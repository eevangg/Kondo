-- HomeSync Supabase Schema Migration (Updated with Live Condo Data)
-- Copy & Run this SQL in your Supabase SQL Editor (https://app.supabase.com/project/_/sql)

-- 1. Roommates Table
CREATE TABLE IF NOT EXISTS roommates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_color TEXT DEFAULT '#6366f1',
  initials TEXT,
  pin TEXT DEFAULT '123456',
  telegram_handle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Roommates (Andre & Gerard)
INSERT INTO roommates (id, name, avatar_color, initials, pin, telegram_handle)
VALUES 
  ('r1', 'Andre', '#6366f1', 'AN', '123456', '@eevangg'),
  ('r2', 'Gerard', '#06b6d4', 'GR', '567890', '@gerardmolinaa')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  telegram_handle = EXCLUDED.telegram_handle;

-- 2. Bills Table (Rent & Utilities)
CREATE TABLE IF NOT EXISTS bills (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  category TEXT DEFAULT 'Monthly Dues',
  paid_by TEXT REFERENCES roommates(id),
  is_paid BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT TRUE,
  recurrence_interval TEXT DEFAULT 'Monthly',
  status TEXT DEFAULT 'Due',
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clear old dummy bills & seed live bills (Only Assoc Dues + Water and Electricity credited to Andre)
DELETE FROM bills;
INSERT INTO bills (id, title, amount, due_date, category, paid_by, is_paid, is_recurring, recurrence_interval, status, remarks)
VALUES
  ('b1', 'Monthly Rent', 16000.00, '2026-09-01', 'Monthly Dues', NULL, FALSE, TRUE, 'Monthly', 'Due', 'Monthly condo rent (Due 1st of month)'),
  ('b2', 'Converge Fiber Internet', 1500.00, '2026-09-01', 'Utilities', NULL, FALSE, TRUE, 'Monthly', 'Due', 'Converge high-speed internet (Due 1st of month)'),
  ('b3', 'Electricity (Meralco - June & July)', 10522.63, '2026-07-27', 'Utilities', 'r1', FALSE, TRUE, 'Monthly', 'Overdue', 'Meralco electric bill (Due 27th of month - Overdue)'),
  ('b4', 'Association Dues + Water', 2562.80, '2026-08-30', 'Monthly Dues', 'r1', FALSE, TRUE, 'Monthly', 'Due', 'Building dues & water utility (Due 30th of month)');

-- 3. Shared Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  paid_by TEXT REFERENCES roommates(id),
  category TEXT DEFAULT 'Groceries',
  split_type TEXT DEFAULT 'equal',
  expense_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Settlements History Table
CREATE TABLE IF NOT EXISTS settlements (
  id TEXT PRIMARY KEY,
  payer_id TEXT REFERENCES roommates(id),
  payee_id TEXT REFERENCES roommates(id),
  amount NUMERIC(10, 2) NOT NULL,
  note TEXT,
  settled_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Shared Household Events Table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  category TEXT DEFAULT 'Maintenance',
  reminder_timing TEXT DEFAULT '1 day before',
  added_by TEXT REFERENCES roommates(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Pantry Inventory Table
CREATE TABLE IF NOT EXISTS pantry_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Dry Goods',
  stock_level TEXT DEFAULT 'Full',
  expiration_date DATE,
  reminder_days_before INT DEFAULT 1,
  auto_add_shopping BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Shopping List Items Table
CREATE TABLE IF NOT EXISTS shopping_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Household Essentials',
  is_completed BOOLEAN DEFAULT FALSE,
  pantry_item_id TEXT REFERENCES pantry_items(id) ON DELETE SET NULL,
  added_by TEXT REFERENCES roommates(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Cleaning Routine Tasks Table
CREATE TABLE IF NOT EXISTS cleaning_tasks (
  id TEXT PRIMARY KEY,
  task_name TEXT NOT NULL,
  area TEXT DEFAULT 'Bathroom',
  interval_days INT DEFAULT 7,
  last_cleaned_at TIMESTAMPTZ,
  last_cleaned_by TEXT REFERENCES roommates(id),
  streak INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clear old dummy cleaning tasks & seed live task
DELETE FROM cleaning_tasks;
INSERT INTO cleaning_tasks (id, task_name, area, interval_days, last_cleaned_at, last_cleaned_by, streak)
VALUES
  ('c1', 'Deep Clean Bathroom', 'Bathroom', 7, '2026-08-05', 'r1', 1);

-- 9. Maintenance & Repairs Queue Table
CREATE TABLE IF NOT EXISTS maintenance_issues (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT DEFAULT 'Kitchen',
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'To Fix',
  reported_by TEXT REFERENCES roommates(id),
  assigned_to TEXT REFERENCES roommates(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clear old dummy maintenance & seed live repair
DELETE FROM maintenance_issues;
INSERT INTO maintenance_issues (id, title, description, location, priority, status, reported_by, assigned_to)
VALUES
  ('m1', 'Broken Kitchen Sink', 'Kitchen sink leak repair.', 'Kitchen', 'High', 'Done', 'r1', 'r1');

-- 10. Condo Presence Status Table
CREATE TABLE IF NOT EXISTS presence (
  roommate_id TEXT PRIMARY KEY REFERENCES roommates(id),
  status TEXT DEFAULT 'At Condo',
  return_time TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Presence Data
INSERT INTO presence (roommate_id, status, return_time)
VALUES 
  ('r1', 'At Condo', NULL),
  ('r2', 'At Condo', NULL)
ON CONFLICT (roommate_id) DO NOTHING;

-- Enable Row Level Security (RLS) & Public Policies for HomeSync
ALTER TABLE roommates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write access to HomeSync data" ON roommates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write access to HomeSync bills" ON bills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write access to HomeSync expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write access to HomeSync settlements" ON settlements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write access to HomeSync events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write access to HomeSync pantry" ON pantry_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write access to HomeSync shopping" ON shopping_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write access to HomeSync cleaning" ON cleaning_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write access to HomeSync maintenance" ON maintenance_issues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write access to HomeSync presence" ON presence FOR ALL USING (true) WITH CHECK (true);
