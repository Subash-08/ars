# ARS Motors

Next.js dealership site with focused product, finance, ownership, showroom and enquiry pages. The original navbar and hero visual styles are preserved. Home includes a product overview, benefits, on-demand 3D studio, finance summary, current offers, showroom links and FAQs.

## Restore points

- Original UI/code: commit `b98bd30`, tag `original-design`, branch `main`.
- Implementation: branch `improve/page-structure`.
- GitHub: https://github.com/Subash-08/ars

The original baseline and restore tag were pushed. The updated branch is kept separate. Database files, environment secrets, dependencies and generated output are excluded from Git.

To inspect the old version without disturbing current work:

```powershell
git worktree add ../ars-original original-design
```

Install its dependencies and copy the local environment file separately if you want to run that checkout. `src/generated/client` was generated and is not versioned; the original seed script references it. The baseline preserves that original limitation. The updated branch fixes the seed import.

When the working tree is clean, switch the existing workspace to the old UI with `git switch main`; return with `git switch improve/page-structure`. The original version has the security flaws identified in the audit; use it as a visual reference, not a production deployment. No database schema changes were required by this update.

## Local setup

```powershell
npm ci
Copy-Item .env.example .env.local
```

Set `DATABASE_URL` for persistent SQLite storage. `file:./dev.db` is relative to the Prisma schema directory. Configure the real public site URL before deploying. Then run:

```powershell
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

`db:seed` writes sample product/offer content and may update existing product listings. Do not run it against customer-managed production content without reviewing it. Existing local data was not reseeded during implementation.

## Staff access

Set a unique `ADMIN_PASSWORD` of at least 12 characters and an `AUTH_SECRET` of at least 32 characters in the server environment. Generate a signing secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

No default staff PIN is accepted. Missing configuration disables staff login. `/admin/login` creates a signed, expiring HttpOnly session cookie; private API reads and writes require it. Mutations validate the same origin. Use HTTPS in production. Rotating `AUTH_SECRET` invalidates existing sessions. This is a single shared staff account; individual accounts/roles require a later authentication integration. Abuse limits are best effort per process; use a shared service when running multiple instances.

## Brochure and commercial content

No verified brochure PDF was supplied. The site offers a brochure enquiry instead of a fake download. After adding an approved PDF under `public/assets/docs`, set `NEXT_PUBLIC_BROCHURE_URL` to its public path and rebuild.

Public product cards and detailed listings read published Product records. Offers read active Offer records and support a genuine empty state. Confirm variant identities, prices, warranties, branch hours and all offer promises with the business before release. Existing database content was retained. Hero/menu editorial copy is separate from the catalogue; the old banner editing API is retained privately but does not change the preserved hero. Finance defaults are illustrative, not a lender offer or a current tariff claim.

## Verification

```powershell
npm run typecheck
npm test
npm run build
```

Integration checks use an isolated database and temporary staff credentials; no developer/customer records are submitted or modified. Build to the test output directory first:

```powershell
$env:NEXT_DIST_DIR='.next-build'
npm run build
npm run test:integration
```

The test servers bind ports 3100 and 3101. Test output/databases are under ignored `test-results/`. A platform sandbox may require permission to run Prisma or local server checks. There is no separately configured ESLint suite yet.

## 3D and motion

The illustrative Three.js vehicle loads only when requested, pauses offscreen/in hidden tabs, throttles updates and disposes GPU geometry/materials when closed. It includes rounded surfaces, studio reflections, keyboard rotation/zoom, colour/day/night choices, and a photograph fallback when WebGL is unavailable. Product Photos are static images, not a fake rotation sequence. A manufacturer-accurate digital twin requires a verified GLB/GLTF model or complete photographic sequence.

Scroll reveals progressively enhance visible content, use short stagger delays, and respect `prefers-reduced-motion`. The navbar/hero keep their existing visual classes; their destinations, qualified copy and accessible interaction behaviour were corrected.

Three.js resource management follows the [official disposal guidance](https://threejs.org/manual/pages/how-to-dispose-of-objects.html).

## Deployment

SQLite requires a persistent writable volume and a suitable single-instance deployment. A stateless/serverless deployment needs an appropriate persistent database integration; setting only a Vercel deployment URL does not provide that storage. Confirm backups, retention, credentials and final commercial content before going live. No deployment was performed by this implementation.

Prisma generation runs at install time (`postinstall`) rather than on every build, avoiding Windows DLL replacement errors while the live preview is running. Run `npx prisma generate` after changing the schema.
