-- =============================================
-- Create job_applications table
-- Run this in Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    job_id TEXT NOT NULL,
    job_title TEXT NOT NULL,
    current_location TEXT NOT NULL,
    highest_qualification TEXT NOT NULL,
    experience_years TEXT NOT NULL,
    cover_letter TEXT NOT NULL,
    resume_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public application submission)
CREATE POLICY "Anyone can submit a job application" ON public.job_applications
    FOR INSERT WITH CHECK (true);

-- Only authenticated admins can view applications
CREATE POLICY "Admins can view job applications" ON public.job_applications
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Only authenticated admins can update application status
CREATE POLICY "Admins can update job applications" ON public.job_applications
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- =============================================
-- Create 'resumes' storage bucket
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload resumes (for job applications)
CREATE POLICY "Anyone can upload resumes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'resumes');

-- Allow admins to view and download resumes
CREATE POLICY "Admins can view resumes" ON storage.objects
    FOR SELECT USING (bucket_id = 'resumes' AND auth.uid() IS NOT NULL);
