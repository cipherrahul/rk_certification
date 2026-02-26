-- 20260228_expense_management.sql
-- Migration to introduce structured Expense Categories and Enhanced Expense Tracking

-- 1. Create Expense Categories Table
CREATE TABLE IF NOT EXISTS public.expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#6366f1', -- Default indigo
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add Category Reference and Recurring fields to Branch Expenses
ALTER TABLE public.branch_expenses ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.expense_categories(id) ON DELETE SET NULL;
ALTER TABLE public.branch_expenses ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;
ALTER TABLE public.branch_expenses ADD COLUMN IF NOT EXISTS recurring_interval TEXT CHECK (recurring_interval IN ('Monthly', 'Weekly', 'Yearly', 'Quarterly'));
ALTER TABLE public.branch_expenses ADD COLUMN IF NOT EXISTS last_automated_at TIMESTAMPTZ;

-- 3. Seed Default Categories
INSERT INTO public.expense_categories (name, description, color)
VALUES 
    ('Rent', 'Monthly office/building rent', '#ef4444'),     -- Red
    ('Salary', 'Employee and teacher salaries', '#10b981'),  -- Emerald
    ('Marketing', 'Digital and physical advertising', '#f59e0b'), -- Amber
    ('Electricity', 'Utility bills - Power', '#3b82f6'),     -- Blue
    ('Internet', 'WIFI and Data charges', '#8b5cf6'),       -- Violet
    ('Maintenance', 'General office maintenance', '#6b7280'),-- Gray
    ('Other', 'Miscellaneous expenses', '#94a3b8')
ON CONFLICT (name) DO NOTHING;

-- 4. Data Migration: Link existing 'type' strings to new categories
-- Rent
UPDATE public.branch_expenses b
SET category_id = (SELECT id FROM public.expense_categories WHERE name = 'Rent')
WHERE b.type = 'Rent' AND b.category_id IS NULL;

-- Electricity
UPDATE public.branch_expenses b
SET category_id = (SELECT id FROM public.expense_categories WHERE name = 'Electricity')
WHERE b.type = 'Electricity' AND b.category_id IS NULL;

-- Marketing
UPDATE public.branch_expenses b
SET category_id = (SELECT id FROM public.expense_categories WHERE name = 'Marketing')
WHERE b.type = 'Marketing' AND b.category_id IS NULL;

-- Salary
UPDATE public.branch_expenses b
SET category_id = (SELECT id FROM public.expense_categories WHERE name = 'Salary')
WHERE b.type = 'Salary' AND b.category_id IS NULL;

-- Others
UPDATE public.branch_expenses b
SET category_id = (SELECT id FROM public.expense_categories WHERE name = 'Other')
WHERE b.type NOT IN ('Rent', 'Electricity', 'Marketing', 'Salary') AND b.category_id IS NULL;

-- 5. Enable RLS and Policies
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to expense_categories') THEN
        CREATE POLICY "Admins have full access to expense_categories" ON public.expense_categories FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- 6. Add to Realtime Publication safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'expense_categories'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.expense_categories;
    END IF;
END $$;
