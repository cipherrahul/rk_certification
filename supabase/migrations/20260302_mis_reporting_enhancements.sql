-- 20260302_mis_reporting_enhancements.sql
-- Migration to ensure enquiries table exists and matches MIS requirements

-- Create Enquiries Table if not exists
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    class TEXT NOT NULL,
    course_interested TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    email TEXT,
    message TEXT,
    source TEXT DEFAULT 'Website', -- Website, Social Media, Walk-in, Referral
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'admitted', 'closed')),
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure RLS is enabled
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Policies for enquiries
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to enquiries') THEN
        CREATE POLICY "Admins have full access to enquiries" ON public.enquiries FOR ALL TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can submit inquiries') THEN
        CREATE POLICY "Anyone can submit inquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Indices for analytical performance
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON public.students(created_at);
CREATE INDEX IF NOT EXISTS idx_fee_payments_payment_date ON public.fee_payments(payment_date);

-- Add source column to students to track acquisition source if not exists
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS acquisition_source TEXT DEFAULT 'Direct';
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL;
