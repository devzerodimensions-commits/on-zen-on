import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist');
const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;
const adminUser = process.env.ADMIN_USER || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const adminToken = crypto.createHash('sha256').update(`${adminUser}:${adminPassword}`).digest('hex');

app.use(express.json());
app.use(express.static(distPath));

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== adminToken) return res.status(401).json({ error: 'Admin login is required.' });
  return next();
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || `item-${Date.now()}`;
}

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

app.post('/api/admin/login', (req, res) => {
  if (req.body?.user !== adminUser || req.body?.password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid admin ID or password.' });
  }
  return res.json({ token: adminToken });
});

app.get('/api/admin/summary', requireAdmin, async (_req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database is not configured.' });
  const [inquiries, content, settings] = await Promise.all([
    pool.query("SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'new')::int AS fresh FROM inquiries"),
    pool.query('SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = $1)::int AS published FROM content_items', ['published']),
    pool.query('SELECT key, value FROM site_settings ORDER BY key'),
  ]);
  return res.json({ inquiries: inquiries.rows[0], content: content.rows[0], settings: settings.rows });
});

app.get('/api/admin/inquiries', requireAdmin, async (_req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database is not configured.' });
  const result = await pool.query('SELECT id, name, email, message, status, notes, created_at FROM inquiries ORDER BY created_at DESC');
  return res.json(result.rows);
});

app.patch('/api/admin/inquiries/:id', requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database is not configured.' });
  const { status = 'new', notes = '' } = req.body;
  const result = await pool.query('UPDATE inquiries SET status = $1, notes = $2 WHERE id = $3 RETURNING *', [status, notes, req.params.id]);
  if (!result.rowCount) return res.status(404).json({ error: 'Inquiry not found.' });
  return res.json(result.rows[0]);
});

app.delete('/api/admin/inquiries/:id', requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database is not configured.' });
  await pool.query('DELETE FROM inquiries WHERE id = $1', [req.params.id]);
  return res.json({ ok: true });
});

app.get('/api/admin/content', requireAdmin, async (_req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database is not configured.' });
  const result = await pool.query('SELECT id, type, title, slug, status, excerpt, body, created_at, updated_at FROM content_items ORDER BY updated_at DESC');
  return res.json(result.rows);
});

app.post('/api/admin/content', requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database is not configured.' });
  const { type = 'page', title, status = 'draft', excerpt = '', body = '' } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required.' });
  const slug = slugify(req.body.slug || title);
  const result = await pool.query(
    'INSERT INTO content_items (type, title, slug, status, excerpt, body) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [type, title, slug, status, excerpt, body],
  );
  return res.status(201).json(result.rows[0]);
});

app.patch('/api/admin/content/:id', requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database is not configured.' });
  const { type = 'page', title, slug, status = 'draft', excerpt = '', body = '' } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required.' });
  const result = await pool.query(
    'UPDATE content_items SET type = $1, title = $2, slug = $3, status = $4, excerpt = $5, body = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
    [type, title, slugify(slug || title), status, excerpt, body, req.params.id],
  );
  if (!result.rowCount) return res.status(404).json({ error: 'Content not found.' });
  return res.json(result.rows[0]);
});

app.delete('/api/admin/content/:id', requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database is not configured.' });
  await pool.query('DELETE FROM content_items WHERE id = $1', [req.params.id]);
  return res.json({ ok: true });
});

app.get('/api/admin/settings', requireAdmin, async (_req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database is not configured.' });
  const result = await pool.query('SELECT key, value FROM site_settings ORDER BY key');
  return res.json(Object.fromEntries(result.rows.map(({ key, value }) => [key, value])));
});

app.patch('/api/admin/settings', requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'Database is not configured.' });
  const entries = Object.entries(req.body || {});
  await Promise.all(entries.map(([key, value]) => pool.query(
    'INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()',
    [key, String(value)],
  )));
  return res.json({ ok: true });
});

app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.listen(process.env.PORT || 3001, () => console.log('On Zen On API ready'));
