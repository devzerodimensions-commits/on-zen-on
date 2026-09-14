CREATE TABLE IF NOT EXISTS inquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS content_items (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'page',
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Editor',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_items (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('siteTitle', 'On Zen On Private Limited'),
  ('tagline', 'Creation meets growth'),
  ('adminEmail', 'hello@onzenon.com'),
  ('businessHours', '24 Hours')
ON CONFLICT (key) DO NOTHING;

INSERT INTO admin_users (name, email, role, status) VALUES
  ('Website Administrator', 'hello@onzenon.com', 'Administrator', 'active')
ON CONFLICT (email) DO NOTHING;
