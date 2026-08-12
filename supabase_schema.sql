-- Kondo Supabase Schema Migration (Portfolio Ready & Sanitized)
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

-- Seed Initial Sample Roommates
INSERT INTO roommates (id, name, avatar_color, initials, pin, telegram_handle)
VALUES 
  ('r1', 'Roommate 1', '#6366f1', 'R1', '123456', '@roommate1'),
  ('r2', 'Roommate 2', '#06b6d4', 'R2', '567890', '@roommate2')
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

-- Clear old dummy bills & seed sample bills
DELETE FROM bills;
INSERT INTO bills (id, title, amount, due_date, category, paid_by, is_paid, is_recurring, recurrence_interval, status, remarks)
VALUES
  ('b1', 'Monthly Rent', 15000.00, '2026-09-01', 'Monthly Dues', NULL, FALSE, TRUE, 'Monthly', 'Due', 'Monthly condo rent (Due 1st of month)'),
  ('b2', 'Converge Internet', 1500.00, '2026-09-01', 'Utilities', NULL, FALSE, TRUE, 'Monthly', 'Due', 'Converge internet bill (Due 1st of month)'),
  ('b3', 'Electricity (Meralco)', 5000.00, '2026-08-27', 'Utilities', 'r1', FALSE, TRUE, 'Monthly', 'Due', 'Meralco electric bill (Due 27th of month)'),
  ('b4', 'Association Dues + Water', 2500.00, '2026-08-30', 'Monthly Dues', 'r1', FALSE, TRUE, 'Monthly', 'Due', 'Building dues & water utility (Due 30th of month)');

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

-- Clear old dummy cleaning tasks & seed sample task
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

-- Clear old dummy maintenance & seed sample repair
DELETE FROM maintenance_issues;
INSERT INTO maintenance_issues (id, title, description, location, priority, status, reported_by, assigned_to)
VALUES
  ('m1', 'Kitchen Sink Repair', 'Kitchen sink leak repair.', 'Kitchen', 'High', 'Done', 'r1', 'r1');

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

-- Disable RLS on public tables to guarantee 100% open client access without policy restrictions
ALTER TABLE roommates DISABLE ROW LEVEL SECURITY;
ALTER TABLE bills DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE settlements DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE pantry_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE presence DISABLE ROW LEVEL SECURITY;

-- Enable Supabase Realtime Broadcasting for all Kondo tables
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE roommates, bills, expenses, settlements, events, pantry_items, shopping_items, cleaning_tasks, maintenance_issues, presence;
