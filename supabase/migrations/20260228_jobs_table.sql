-- 20260228_jobs_table.sql
-- Migration to create the jobs table for the Admin Job Management System

CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    employment_type TEXT NOT NULL, -- Full-time, Part-time, Contract, Internship
    experience_required TEXT NOT NULL,
    salary_range TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view Published jobs (public)
CREATE POLICY "Anyone can view published jobs" ON public.jobs
    FOR SELECT USING (status = 'Published');

-- 2. Authenticated admins can perform all actions on all jobs
CREATE POLICY "Admins have full access to jobs" ON public.jobs
    FOR ALL TO authenticated USING (true);

-- Enable Realtime
ALTER TABLE public.jobs REPLICA IDENTITY FULL;
-- Add to existing publication if exists, or create new one
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
    END IF;
END $$;
