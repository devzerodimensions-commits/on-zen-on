# On Zen On website

## Run locally

```bash
npm install
npm run dev
```

In another terminal, run the inquiry API:

```bash
Copy-Item .env.example .env
npm run server
```

## Deploy to Render with PostgreSQL

1. Push this project, including `render.yaml`, to a GitHub repository.
2. In Render, select **New → Blueprint** and choose the repository.
3. Render creates the web service and the `on-zen-on-postgres` database. It connects the database URL automatically and runs `npm run db:migrate` before deployment.
4. After the deploy finishes, open the generated `onrender.com` URL.

`DATABASE_URL` stays server-side; it is never exposed to the React app. For local PostgreSQL, copy `.env.example` to `.env`, set your own connection string, run `npm run db:migrate`, then run `npm run server` alongside Vite.
