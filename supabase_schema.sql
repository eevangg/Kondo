-- ====================================================================
-- HomeSync Roommate App - Supabase Database Schema
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- ====================================================================

-- 1. Roommates Table
CREATE TABLE IF NOT EXISTS roommates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed initial roommates if empty
INSERT INTO roommates (name, avatar_color) 
SELECT 'Alex', '#8b5cf6' WHERE NOT EXISTS (SELECT 1 FROM roommates WHERE name = 'Alex');
INSERT INTO roommates (name, avatar_color) 
SELECT 'Sam', '#ec4899' WHERE NOT EXISTS (SELECT 1 FROM roommates WHERE name = 'Sam');

-- 2. Bills Table (Recurring/One-off utility & rent bills)
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  category TEXT NOT NULL DEFAULT 'Utilities',
  paid_by UUID REFERENCES roommates(id) ON DELETE SET NULL,
  is_paid BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_interval TEXT DEFAULT 'Monthly',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Expenses Table (Splitwise style shared transactions)
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  paid_by UUID REFERENCES roommates(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'Groceries',
  split_type TEXT DEFAULT 'equal', -- equal, percentage, exact
  split_details JSONB DEFAULT '{}'::jsonb,
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Expense Settlements Log
CREATE TABLE IF NOT EXISTS settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payer_id UUID REFERENCES roommates(id) ON DELETE CASCADE,
  payee_id UUID REFERENCES roommates(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  note TEXT DEFAULT 'Settled up balances',
  settled_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Pantry Items Table
CREATE TABLE IF NOT EXISTS pantry_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Pantry',
  stock_level TEXT DEFAULT 'Medium', -- Full, Medium, Low, Out
  expiration_date DATE,
  auto_add_shopping BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Shared Shopping List Table
CREATE TABLE IF NOT EXISTS shopping_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Groceries',
  is_completed BOOLEAN DEFAULT false,
  pantry_item_id UUID REFERENCES pantry_items(id) ON DELETE SET NULL,
  added_by UUID REFERENCES roommates(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Cleaning Tasks Table
CREATE TABLE IF NOT EXISTS cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name TEXT NOT NULL,
  area TEXT NOT NULL DEFAULT 'Common Area',
  interval_days INT DEFAULT 7,
  last_cleaned_at TIMESTAMPTZ,
  last_cleaned_by UUID REFERENCES roommates(id) ON DELETE SET NULL,
  streak INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Maintenance Issues Table
CREATE TABLE IF NOT EXISTS maintenance_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL DEFAULT 'Living Room',
  priority TEXT DEFAULT 'Medium', -- Low, Medium, Urgent
  status TEXT DEFAULT 'Reported', -- Reported, In Progress, Fixed
  reported_by UUID REFERENCES roommates(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES roommates(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Realtime publication for tables
ALTER PUBLICATION supabase_realtime ADD TABLE bills, expenses, settlements, pantry_items, shopping_items, cleaning_tasks, maintenance_issues;
