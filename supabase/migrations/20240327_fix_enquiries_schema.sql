-- 20240327_fix_enquiries_schema.sql
-- Fix missing columns in enquiries table for MIS reporting

DO $$ 
BEGIN 
    -- 1. Add source column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='enquiries' AND column_name='source') THEN
        ALTER TABLE public.enquiries ADD COLUMN source TEXT DEFAULT 'Website';
    END IF;

    -- 2. Add branch_id if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='enquiries' AND column_name='branch_id') THEN
        ALTER TABLE public.enquiries ADD COLUMN branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Refresh PostgREST cache (optional hints, usually happens automatically on DDL)
-- NOTIFY pgrst, 'reload schema';
