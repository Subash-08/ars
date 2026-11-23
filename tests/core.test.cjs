const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
function load(file){const filename=path.resolve(file);const mod=new Module(filename,module);mod.filename=filename;mod.paths=Module._nodeModulePaths(path.dirname(filename));mod._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);return mod.exports;}
const {calculateEmi,calculateSavings}=load('src/lib/calculations.ts');
const {validateLead}=load('src/lib/lead-validation.ts');
const auth=load('src/lib/auth.ts');
test('EMI handles zero interest, full deposit and a standard amortization',()=>{
  assert.equal(calculateEmi(60000,0,0,12),5000);
  assert.equal(calculateEmi(60000,60000,9.5,24),0);
  assert.equal(calculateEmi(60000,0,9.5,0),0);
  assert.ok(Math.abs(calculateEmi(74990,10000,9.5,24)-2984)<1);
});
test('savings retains full precision and supports negative savings',()=>{
  const values=calculateSavings(100,26,105,55,5.25,1.82);
  assert.equal(Math.round(values.annual),56582);
  assert.ok(calculateSavings(30,26,1,100,50,10).annual<0);
});
test('lead validation rejects bad phone, branch, date, type and oversized data',()=>{
  const valid={name:'QA Sample',phone:'9000000000',assignedBranch:'Madathur',inquiryType:'Test Drive'};
  assert.equal(validateLead(valid).assignedBranch,'Madathur');
  for(const changed of [{phone:'123'},{phone:'0000000000'},{assignedBranch:'Elsewhere'},{inquiryType:'Token Booking @ 1000'},{preferredDate:'2020-01-01'},{preferredDate:'2099-02-30'},{message:'a'.repeat(2001)}]) assert.throws(()=>validateLead({...valid,...changed}));
});
test('staff authentication fails closed and rejects forged or expired sessions',()=>{
  const previousSecret=process.env.AUTH_SECRET;const previousPassword=process.env.ADMIN_PASSWORD;
  try{
    delete process.env.AUTH_SECRET;delete process.env.ADMIN_PASSWORD;
    assert.equal(auth.validSession('anything'),false);
    assert.equal(auth.authConfigured(),false);
    process.env.AUTH_SECRET='test-only-secret-that-is-long-enough-1234';process.env.ADMIN_PASSWORD='test-only-password-12345';
    const expired=Buffer.from(JSON.stringify({expires:Date.now()-1000})).toString("base64url");
    const signature=require("node:crypto").createHmac("sha256",process.env.AUTH_SECRET).update(expired).digest("base64url");
    assert.equal(auth.validSession(`${expired}.${signature}`),false);
    const token=auth.createSession();assert.equal(auth.validSession(token),true);assert.equal(auth.validSession(token+'bad'),false);
    const request=(method,cookie,origin)=>new Request('http://localhost:3100/api/leads',{method,headers:{...(cookie?{cookie:`${auth.SESSION_COOKIE}=${cookie}`} : {}),...(origin?{origin}: {})}});
    assert.equal(auth.requireAdmin(request('GET')).status,401);
    assert.equal(auth.requireAdmin(request('GET',token)),null);
    assert.equal(auth.requireAdmin(request('PATCH',token,'https://elsewhere.example')).status,403);
    assert.equal(auth.requireAdmin(request('PATCH',token,'http://localhost:3100')),null);
  }finally{if(previousSecret===undefined)delete process.env.AUTH_SECRET;else process.env.AUTH_SECRET=previousSecret;if(previousPassword===undefined)delete process.env.ADMIN_PASSWORD;else process.env.ADMIN_PASSWORD=previousPassword;}
});
