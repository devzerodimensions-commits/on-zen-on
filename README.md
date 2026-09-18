# On Zen On website and dynamic admin

The original React website now reads published pages, menus and layouts from a secure Express CMS. Your supplied logo is used throughout. Visit `/admin/` for pages, original-layout sections, image uploads, SEO, drafts, publishing, history, menus, users and inquiries. The interface follows a WordPress-style editing workflow while retaining the existing React design.

**Appearance** is the theme customiser: eight ready-made colour themes, seventeen fonts (separate heading and body fonts), every text size, colours for the page, cards, links, header and footer, button styles, spacing and logo sizes — all with the live website previewed beside the controls at computer, tablet and phone widths, and readability warnings before you publish. Pages open in a **visual builder**: the real website beside the section list, click a section on the page itself to edit it, drag to reorder, and every keystroke shows up live at computer, tablet and phone widths. Sections can be copied and hidden as well as reordered, and pictures can be searched, renamed and deleted in the media library. See [docs/change-the-look-of-the-website.md](docs/change-the-look-of-the-website.md), written for non-technical editors.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete Render and first-administrator setup. Use the existing Render service and database; do not create a replacement Blueprint.

## Run locally

```bash
npm ci
npm run build
npm start
```

For a disposable local demonstration (stop the server above first):

```bash
node scripts/preview.mjs
```

The demonstration runs at `http://localhost:3101/` and `/admin/` with `preview@example.test` / `local-review-only-4829`. It uses a temporary local database and cannot run in production. For persistent local editing, follow `.env.example`, set your own first-admin email/password and use `npm start` on port 3001. No password is enabled by default.

## Deploy to Render with PostgreSQL

1. Push this project, including `render.yaml`, to a GitHub repository.
2. Use the existing `on-zen-on` service; privately configure the initial administrator as described in the deployment guide.
3. Retain the existing database connection. The service runs `npm run db:migrate` before deployment; startup adds the CMS tables and imports initial content without overwriting subsequent edits.
4. After the deploy finishes, open the generated `onrender.com` URL.

`DATABASE_URL` stays server-side; it is never exposed to the React app. For local PostgreSQL, copy `.env.example` to `.env`, set your own connection string, run `npm run db:migrate`, then run `npm run server` alongside Vite.
