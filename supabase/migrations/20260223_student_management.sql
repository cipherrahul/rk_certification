-- ============================================================
-- Student Management System Migration
-- ============================================================

-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL UNIQUE,        -- e.g. RK2026STU001
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  father_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  course TEXT NOT NULL,
  academic_session TEXT NOT NULL,         -- e.g. "2026-27"
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fee Payments table
CREATE TABLE public.fee_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT NOT NULL UNIQUE,    -- e.g. RK-FEE-2026-00001
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  month TEXT NOT NULL,                    -- e.g. "February 2026"
  total_fees NUMERIC(10,2) NOT NULL,
  paid_amount NUMERIC(10,2) NOT NULL,
  remaining_amount NUMERIC(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_mode TEXT NOT NULL,             -- Cash / Online / Cheque / DD
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies: students
-- ============================================================

-- Public SELECT (needed for receipt verification name lookup)
CREATE POLICY "Students are publicly viewable" ON public.students
  FOR SELECT USING (true);

-- Admin INSERT
CREATE POLICY "Admins can insert students" ON public.students
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Admin UPDATE
CREATE POLICY "Admins can update students" ON public.students
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Admin DELETE
CREATE POLICY "Admins can delete students" ON public.students
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- ============================================================
-- RLS Policies: fee_payments
-- ============================================================

-- Public SELECT (for receipt verification)
CREATE POLICY "Fee payments are publicly viewable" ON public.fee_payments
  FOR SELECT USING (true);

-- Admin INSERT
CREATE POLICY "Admins can insert fee payments" ON public.fee_payments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Admin UPDATE
CREATE POLICY "Admins can update fee payments" ON public.fee_payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Admin DELETE
CREATE POLICY "Admins can delete fee payments" ON public.fee_payments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- ============================================================
-- Storage bucket for student photos and ID cards
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('students', 'students', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Students bucket public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'students');

CREATE POLICY "Admin can upload student photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'students' AND
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Admin can delete student photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'students' AND
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );
