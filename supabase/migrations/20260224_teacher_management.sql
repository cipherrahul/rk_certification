-- ============================================================
-- Teacher & Faculty Management System Migration
-- ============================================================

-- Teachers table
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id TEXT NOT NULL UNIQUE,        -- e.g. RK2026TCH001
  name TEXT NOT NULL,
  department TEXT NOT NULL,               -- e.g. Science, Commerce, Arts
  assigned_class TEXT NOT NULL,           -- e.g. Class 10, 11-Science, All Classes
  subject TEXT NOT NULL,
  qualification TEXT NOT NULL,            -- e.g. M.Sc, B.Ed, M.A.
  experience TEXT NOT NULL,               -- e.g. "5 Years", "10 Years"
  contact TEXT NOT NULL,
  joining_date DATE NOT NULL,
  basic_salary NUMERIC(10,2) NOT NULL DEFAULT 0,
  allowances NUMERIC(10,2) NOT NULL DEFAULT 0,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Salary Records table
CREATE TABLE public.salary_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slip_number TEXT NOT NULL UNIQUE,       -- e.g. RK-SAL-2026-00001
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  month TEXT NOT NULL,                    -- e.g. "February"
  year INTEGER NOT NULL,                  -- e.g. 2026
  basic_salary NUMERIC(10,2) NOT NULL,
  allowances NUMERIC(10,2) NOT NULL DEFAULT 0,
  deductions NUMERIC(10,2) NOT NULL DEFAULT 0,
  net_salary NUMERIC(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Pending',  -- Pending / Paid
  payment_date DATE,
  slip_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_records ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies: teachers (Admin only)
-- ============================================================

CREATE POLICY "Admins can view teachers" ON public.teachers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can insert teachers" ON public.teachers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update teachers" ON public.teachers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete teachers" ON public.teachers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- ============================================================
-- RLS Policies: salary_records (Admin only)
-- ============================================================

CREATE POLICY "Admins can view salary records" ON public.salary_records
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can insert salary records" ON public.salary_records
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update salary records" ON public.salary_records
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete salary records" ON public.salary_records
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- ============================================================
-- Storage bucket for teacher photos
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('teachers', 'teachers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Teachers bucket public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'teachers');

CREATE POLICY "Admin can upload teacher photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'teachers' AND
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Admin can delete teacher photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'teachers' AND
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_teacher_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.handle_teacher_updated_at();
