-- 20260227_branch_management_system.sql
-- Migration to introduce structured Branch Management and enable Realtime

-- 1. Enable UUID Extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Branches Table
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    email TEXT NOT NULL,
    opening_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Branch Classes Table
CREATE TABLE IF NOT EXISTS public.branch_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    course_type TEXT NOT NULL,
    duration TEXT NOT NULL,
    fee_structure JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Branch Expenses Table
CREATE TABLE IF NOT EXISTS public.branch_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'Rent', 'Electricity', 'Marketing', 'Salary', 'Other'
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Update Teachers Table
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id);
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Teacher' CHECK (role IN ('Teacher', 'Branch Head', 'Staff'));

-- 6. Update Students Table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id);
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES public.branch_classes(id);

-- 7. Data Migration: Create Default Branch and Link Existing Records
DO $$
DECLARE
    default_branch_id UUID;
BEGIN
    -- Insert default branch
    INSERT INTO public.branches (name, code, city, state, address, contact_number, email, opening_date, status)
    VALUES ('Adarsh Nagar Branch', 'RK-AN-01', 'Delhi', 'Delhi', 'Adarsh Nagar, Delhi', '7533042633', 'info.rkinstitution2016@gmail.com', '2016-04-02', 'Active')
    ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO default_branch_id;

    -- Link existing teachers
    UPDATE public.teachers 
    SET branch_id = default_branch_id 
    WHERE branch_id IS NULL;

    -- Link existing students
    UPDATE public.students 
    SET branch_id = default_branch_id 
    WHERE branch_id IS NULL;
END $$;

-- 8. Enable RLS and Policies
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branch_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branch_expenses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to branches') THEN
        CREATE POLICY "Admins have full access to branches" ON public.branches FOR ALL TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to branch_classes') THEN
        CREATE POLICY "Admins have full access to branch_classes" ON public.branch_classes FOR ALL TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to branch_expenses') THEN
        CREATE POLICY "Admins have full access to branch_expenses" ON public.branch_expenses FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- 9. Enable Realtime (Publication)
-- This allows the dashboard to receive real-time updates for these tables
BEGIN;
  -- Remove existing if exists to avoid error
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.branches, 
    public.branch_classes, 
    public.branch_expenses, 
    public.students, 
    public.teachers,
    public.fee_payments,
    public.salary_records;
COMMIT;
