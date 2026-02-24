-- =============================================
-- Create offer_letters table
-- =============================================

CREATE TABLE IF NOT EXISTS public.offer_letters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    address TEXT NOT NULL,
    employee_email TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT NOT NULL,
    work_location TEXT NOT NULL,
    employment_type TEXT NOT NULL,
    joining_date DATE NOT NULL,
    probation_period TEXT NOT NULL,
    working_hours TEXT NOT NULL,
    basic_salary NUMERIC NOT NULL DEFAULT 0,
    hra NUMERIC NOT NULL DEFAULT 0,
    ta NUMERIC NOT NULL DEFAULT 0,
    other_allowance NUMERIC NOT NULL DEFAULT 0,
    gross_salary NUMERIC NOT NULL DEFAULT 0,
    pdf_url TEXT,
    status TEXT NOT NULL DEFAULT 'generating',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.offer_letters ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can manage offer letters
CREATE POLICY "Admins can view offer letters" ON public.offer_letters
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can create offer letters" ON public.offer_letters
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update offer letters" ON public.offer_letters
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete offer letters" ON public.offer_letters
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- =============================================
-- Create 'offer-letters' storage bucket
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('offer-letters', 'offer-letters', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for offer-letters bucket
-- Allow admins to upload and manage PDFs
CREATE POLICY "Admins can upload offer letters" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'offer-letters' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view offer letters" ON storage.objects
    FOR SELECT USING (bucket_id = 'offer-letters');

CREATE POLICY "Admins can delete offer letters" ON storage.objects
    FOR DELETE USING (bucket_id = 'offer-letters' AND auth.uid() IS NOT NULL);
