# On Zen On: deploy the connected admin

The public site and WordPress-style admin are one React/Express service. This is a custom CMS, not the WordPress PHP application. Existing public classes, images, headings, line breaks and decorative layouts are preserved through 17 original-design templates. Your supplied logo is at `public/assets/on-zen-on-official-logo.png`.

## Render configuration

Use the existing `on-zen-on` service and `on-zen-on-postgres` PostgreSQL database. No new paid resources are required by this implementation.

- Node 24.19.0 (`.node-version`).
- Build: `npm ci && npm run build`.
- Start: `npm run db:migrate && npm start`.
- Health: `/api/health` (returns deployed commit when Render provides it).
- `NODE_ENV=production`.
- `DATABASE_URL`: retain the existing private Render connection string.
- `APP_ORIGIN=https://on-zen-on.onrender.com` (also derives from Render's external URL when unset).
- `TRUST_PROXY_HOPS=1` for the existing Render reverse proxy.
- `ADMIN_EMAIL`: the owner's chosen sign-in email.
- `ADMIN_PASSWORD`: a new unique password of 14–200 characters, entered privately in Render.

On first boot only, when the real authentication table has no users, the last two variables create the initial administrator. After successful sign-in, remove `ADMIN_PASSWORD` from Render; the stored salted hash continues working. There is no default account or password and no public self-registration. The legacy `admin/admin123` token login is retired with HTTP 410. Existing profile-only `admin_users` rows were not real login accounts and do not grant access to this CMS.

Do not deploy known preview credentials. `scripts/preview.mjs` refuses production/database environments and runs a separate temporary SQLite preview on loopback only.

## Data preservation

The old inquiry table is retained, with admin-only list/status/notes access. Existing legacy content records are retained in `content_items` and imported once as drafts using stable IDs; invalid paths remain in the original table for review. Existing database tables are not dropped. Initial homepage/layout/menu/settings seeds use stable IDs and never overwrite edited content on restart.

Uploaded images are validated and converted to WebP, with their bytes stored in `media_data` alongside database metadata. This avoids Render's ephemeral filesystem. Back up PostgreSQL to back up both content and uploads. This approach is suitable for a modest marketing image library; migrate large libraries or video to object storage. Maximum source upload is 8 MB and the image decoder has a pixel limit. Uploads are public marketing assets, not private documents.

## Editor workflow

- `/admin/`: Dashboard, Pages, Reusable sections, Menus, Media library, Site settings, Inquiries and Users.
- Home contains 15 sections in their original order. Expand a section to edit its copy, destinations or images. Up/down controls reorder it.
- New pages support standard blocks or “Original layout” sections. Template fields are validated; no arbitrary HTML or CSS is accepted.
- Save draft does not change published content. Preview embeds the actual site layout using the authenticated draft endpoint. The inquiry form does not submit in preview.
- Administrators publish/unpublish; editors work on drafts. Page publication takes a snapshot of any shared sections. Republish a page to adopt updated shared-section content.
- Header and footer are editable in Reusable sections and publish globally. Header/footer/service menus publish by location. Global company settings update footer copy, contact details and company name; addresses remain editable in the original footer layout.
- New page paths appear in the public router and XML sitemap after publication. SEO metadata is present in initial HTML. Unknown routes return 404. Page body is still rendered by React.
- Users supports creating real login accounts and enabling/disabling them. Disabling revokes existing sessions. Self-disabling is blocked.
- Existing slug redirects, scheduled publication, password-reset email, MFA, nested menus and drag-and-drop positioning are not included.

## Checks and release

`npm run build`, `npm test`, `npm audit --omit=dev`. CI runs a dedicated PostgreSQL service test in addition to local SQLite integration tests. The PostgreSQL test accepts only a local database named `cms_test`, never the production connection.

Confirm `/api/health`, `/`, `/admin/`, `/api/public/page?path=/` and `/sitemap.xml` after deployment. Check a signed-in save/preview/publish cycle with a designated test page and then unpublish it. Keep the old deployment available as rollback; older code ignores the new CMS tables. Do not remove the database or recreate the Render service to roll back.

Before deployment review the first-account environment values privately. A successful website deployment alone does not establish that the owner has completed first-admin setup.
