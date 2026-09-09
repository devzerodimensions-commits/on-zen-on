import 'dotenv/config';
import express from 'express';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');
const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;

app.use(express.json());
app.use(express.static(distPath));

app.get('/api/health', async (_req, res) => {
  try {
    if (!pool) return res.status(503).json({ ok: false, database: 'not configured' });
    await pool.query('SELECT 1');
    return res.json({ ok: true, database: 'connected' });
  } catch {
    return res.status(503).json({ ok: false, database: 'unavailable' });
  }
});

app.post('/api/inquiries', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are required.' });
  if (!pool) return res.status(503).json({ error: 'Database is not configured.' });
  try {
    await pool.query('INSERT INTO inquiries (name, email, message) VALUES ($1, $2, $3)', [name, email, message]);
    res.status(201).json({ ok: true });
  } catch (error) { res.status(500).json({ error: 'Unable to save your inquiry.' }); }
});

app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.listen(process.env.PORT || 3001, () => console.log('On Zen On API ready'));
