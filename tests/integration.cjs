/* Uses an isolated disposable SQLite database, never the developer's customer records. */
const assert=require('node:assert/strict');
const {spawn,spawnSync}=require('node:child_process');
const {randomBytes}=require('node:crypto');
const fs=require('node:fs');
const path=require('node:path');
const cwd=process.cwd();
const dir=path.join(cwd,'test-results',`integration-${Date.now()}`);fs.mkdirSync(dir,{recursive:true});
const env={...process.env,NEXT_DIST_DIR:'.next-build',DATABASE_URL:`file:${path.join(dir,'test.db').replaceAll('\\','/')}`,AUTH_SECRET:randomBytes(32).toString('hex'),ADMIN_PASSWORD:randomBytes(24).toString('hex'),NEXT_TELEMETRY_DISABLED:'1'};
// Bootstrap from Prisma's generated data model, avoiding a platform schema-engine dependency.
async function setupDatabase(){
 const {PrismaClient,Prisma}=require('@prisma/client');
 const client=new PrismaClient({datasources:{db:{url:env.DATABASE_URL}}});
 try { for(const model of Prisma.dmmf.datamodel.models){
   const fields=model.fields.filter(f=>f.kind==='scalar').map(f=>{
     const type={String:'TEXT',Int:'INTEGER',Float:'REAL',Boolean:'BOOLEAN',DateTime:'DATETIME',BigInt:'BIGINT',Bytes:'BLOB'}[f.type];
     let sql=`"${f.name}" ${type}${f.isId?' PRIMARY KEY':''}${f.isRequired?' NOT NULL':''}${f.isUnique?' UNIQUE':''}`;
     if(f.default!==undefined){if(f.default?.name==='now')sql+=' DEFAULT CURRENT_TIMESTAMP';else if(typeof f.default==='boolean')sql+=` DEFAULT ${Number(f.default)}`;else if(typeof f.default==='number')sql+=` DEFAULT ${f.default}`;else if(typeof f.default==='string')sql+=` DEFAULT '${f.default.replaceAll("'","''")}'`;}
     return sql;
   });
   await client.$executeRawUnsafe(`CREATE TABLE "${model.name}" (${fields.join(',')})`);
 } } finally {await client.$disconnect();}
}
const log=fs.openSync(path.join(dir,'server.log'),'w');
let server;let failureServer;
const base='http://localhost:3100';let cookie='';let checks=0;
async function request(url,method='GET',body,authenticated=false,origin=base){const response=await fetch(base+url,{method,headers:{...(method!=='GET'?{'Content-Type':'application/json',Origin:origin}:{}),...(authenticated?{Cookie:cookie}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});return response;}
async function expect(url,status,method='GET',body,authenticated=false,origin){const res=await request(url,method,body,authenticated,origin);assert.equal(res.status,status,`${method} ${url}`);checks++;return res;}
(async()=>{try{
  await setupDatabase();
  const setup = spawnSync(process.execPath, ['prisma/setup-customer-stories.cjs', '--demo'], {cwd, env, encoding:'utf8'});
  assert.equal(setup.status, 0, setup.stderr);

  server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3100'],{cwd,env,stdio:['ignore',log,log],windowsHide:true});
  let ready=false;for(let i=0;i<60;i++){try{const res=await fetch(base+'/privacy');if(res.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}assert.ok(ready,'server started');
  for(const url of ['/','/e-luna','/finance-offers','/ownership','/showrooms','/about','/book-test-ride','/privacy','/booking-terms','/offer-terms','/sitemap.xml','/robots.txt'])await expect(url,200);
  for(const url of ['/api/leads','/api/admin/products','/api/admin/offers','/api/admin/banners','/api/analytics/stats'])await expect(url,401);
  for(const [url,method]of [['/api/admin/products','POST'],['/api/admin/offers','PUT'],['/api/admin/banners','DELETE'],['/api/leads/none','PATCH'],['/api/leads/none','DELETE']])await expect(url,401,method,{});
  const login=await expect('/api/auth/login',200,'POST',{password:env.ADMIN_PASSWORD});cookie=login.headers.get('set-cookie').split(';')[0];assert.match(login.headers.get('set-cookie'),/HttpOnly/i);
  await expect('/api/auth/session',200,'GET',undefined,true);
  await expect('/api/admin/products',403,'POST',{},true,'https://elsewhere.example');
  const lead={name:'QA Isolated Test',phone:'9000000000',inquiryType:'Test Drive',useCase:'QA Vehicle',assignedBranch:'Madathur',consent:true,message:'First request',utmSource:'QA campaign'};
  await expect('/api/leads',400,'POST',{...lead,phone:'123'});
  await expect('/api/leads',400,'POST',{...lead,consent:false});
  await expect('/api/leads',403,'POST',lead,false,'https://elsewhere.example');
  const first=await (await expect('/api/leads',201,'POST',lead)).json();assert.ok(first.reference);
  const repeat=await (await expect('/api/leads',200,'POST',lead)).json();assert.equal(first.reference,repeat.reference);
  const changed=await (await expect('/api/leads',201,'POST',{...lead,message:'Different request'})).json();assert.notEqual(changed.reference,first.reference);
  const saved=await (await expect('/api/leads',200,'GET',undefined,true)).json();assert.equal(saved.leads.length,2);assert.equal(saved.leads[0].assignedBranch,'Madathur');assert.equal(saved.leads[0].utmSource,'QA campaign');assert.equal(saved.leads[0].status,'NEW');
  await expect(`/api/leads/${first.reference}`,400,'PATCH',{status:'BOOKED_1000'},true);
  await expect(`/api/leads/${first.reference}`,200,'PATCH',{status:'CONTACTED'},true);
  await expect('/api/leads/missing',503,'PATCH',{status:'CONTACTED'},true);
  let offers=await (await expect('/api/offers',200)).json();assert.deepEqual(offers.offers,[]);
  const product={name:'QA Vehicle',slug:'qa-vehicle',price:'₹70,000',image:'/assets/bikes/studio-yellow-hd.jpg',description:'QA only',isPublished:true};
  const added=await (await expect('/api/admin/products',200,'POST',product,true)).json();assert.ok(added.product.id);
  assert.match(await (await request('/e-luna')).text(),/QA Vehicle/);checks++;
  await expect('/api/admin/products',200,'PUT',{id:added.product.id,isPublished:false},true);
  assert.doesNotMatch(await (await request('/e-luna')).text(),/<h3[^>]*>QA Vehicle/);checks++;
  const addedOffer=await (await expect('/api/admin/offers',200,'POST',{title:'QA offer',discount:'QA benefit',validTill:'Valid till Dec 31, 2099',isActive:true},true)).json();
  offers=await (await expect('/api/offers',200)).json();assert.equal(offers.offers.length,1);
  await expect('/api/admin/offers',200,'PUT',{id:addedOffer.offer.id,isActive:false},true);
  offers=await (await expect('/api/offers',200)).json();assert.deepEqual(offers.offers,[]);
  await expect('/api/admin/customer-stories',401);
  const storiesResponse = await expect('/api/admin/customer-stories',200,'GET',undefined,true);
  assert.equal((await storiesResponse.json()).stories.length,9);
  const homepage = await (await request('/')).text();
  assert.match(homepage,/Customer delivery stories/);
  assert.match(homepage,/Demo quote/);
  const storyForm = new FormData();
  storyForm.set('customerName','QA Customer');
  storyForm.set('location','Salem');
  storyForm.set('testimonial','An isolated workflow test.');
  storyForm.set('kind','delivery');
  storyForm.set('isActive','false');
  const upload = fs.readFileSync(path.join(cwd,'public/assets/customer-stories/showroom-red.webp'));
  storyForm.set('image',new Blob([upload],{type:'image/webp'}),'story.webp');
  const savedStory = await fetch(base+'/api/admin/customer-stories',{method:'POST',headers:{Origin:base,Cookie:cookie},body:storyForm});
  assert.equal(savedStory.status,200,await savedStory.text()); checks++;
  const getStories = async () => (await (await request('/api/admin/customer-stories','GET',undefined,true)).json()).stories;
  const createdStory = (await getStories()).find(story=>story.customerName==='QA Customer');
  assert.ok(createdStory);
  await expect(createdStory.imageUrl,404);
  await expect(createdStory.imageUrl,200,'GET',undefined,true);
  await expect('/api/admin/customer-stories',200,'PATCH',{id:createdStory.id,isActive:true},true);
  const publicPhoto = await expect(createdStory.imageUrl,200);
  assert.equal(publicPhoto.headers.get('content-type'),'image/webp');
  assert.match(await (await request('/')).text(),/QA Customer/);
  const order = createdStory.order;
  await expect('/api/admin/customer-stories',200,'PATCH',{id:createdStory.id,move:-1},true);
  assert.ok((await getStories()).find(story=>story.id===createdStory.id).order < order);
  await expect('/api/admin/customer-stories?id='+createdStory.id,200,'DELETE',undefined,true);
  await expect(createdStory.imageUrl,404);
  await expect('/e-luna/qa-vehicle',404);
  await expect('/api/admin/products',200,'PUT',{id:added.product.id,isPublished:true},true);
  assert.match(await (await expect('/e-luna/qa-vehicle',200)).text(),/QA Vehicle/);
  assert.match(await (await request('/sitemap.xml')).text(),/e-luna\/qa-vehicle/);
  const stats=await (await expect('/api/analytics/stats',200,'GET',undefined,true)).json();assert.equal(stats.stats.totalVisits,0);assert.equal(stats.stats.conversionRate,null);assert.deepEqual(stats.stats.sources,[]);
  await expect('/api/analytics/track',400,'POST',{path:'/'});
  await expect('/api/analytics/track',200,'POST',{path:'/',consent:true,utmSource:'QA'});
  await expect(`/api/leads/${first.reference}`,200,'DELETE',undefined,true);
  await expect('/api/auth/logout',200,'POST',{},true);
  await expect('/api/auth/login',401,'POST',{password:'incorrect'});
  // A process restart must not lose the remaining saved enquiry.
  await new Promise(resolve=>{server.once('exit',resolve);server.kill();});
  server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3100'],{cwd,env,stdio:['ignore',log,log],windowsHide:true});
  for(let i=0;i<60;i++){try{if((await fetch(base+'/privacy')).ok)break;}catch{}await new Promise(r=>setTimeout(r,500));}
  const persisted=await (await expect('/api/leads',200,'GET',undefined,true)).json();assert.equal(persisted.leads.length,1);assert.equal(persisted.leads[0].id,changed.reference);
  // A separate empty-schema database must return failure, never success or an in-memory lead.
  const failureEnv={...env,DATABASE_URL:`file:${path.join(dir,'uninitialized.db').replaceAll('\\','/')}`};
  failureServer=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3101'],{cwd,env:failureEnv,stdio:['ignore',log,log],windowsHide:true});
  const badBase='http://localhost:3101';let failureReady=false;
  for(let i=0;i<60;i++){try{if((await fetch(badBase+'/privacy')).ok){failureReady=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}
  assert.ok(failureReady);const failure=await fetch(badBase+'/api/leads',{method:'POST',headers:{'Content-Type':'application/json',Origin:badBase},body:JSON.stringify(lead)});assert.equal(failure.status,503);assert.equal((await failure.json()).success,false);checks++;
  console.log(`PASS: ${checks} isolated production HTTP checks. Test data: ${dir}`);
}finally{server?.kill();failureServer?.kill();fs.closeSync(log);}})().catch(error=>{console.error(error);process.exitCode=1;});
