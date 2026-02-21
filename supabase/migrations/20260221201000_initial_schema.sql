-- Create ENUM for roles
CREATE TYPE public.user_role AS ENUM ('admin', 'staff');

-- Create admins table linked to auth.users
CREATE TABLE public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role public.user_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  father_name TEXT,
  email TEXT,
  mobile TEXT,
  certificate_type TEXT NOT NULL,
  issue_date DATE NOT NULL,
  completion_date DATE NOT NULL,
  grade TEXT,
  duration TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for admins table
-- Admins can read their own data
CREATE POLICY "Admins can view their own data" ON public.admins
  FOR SELECT USING (auth.uid() = id);

-- Super admins can view all admins (optional, assuming we have one main admin)
CREATE POLICY "Super admins can view all admins" ON public.admins
  FOR SELECT USING (
    (SELECT role FROM public.admins WHERE id = auth.uid()) = 'admin'
  );

-- Create policies for certificates table
-- Anyone can view a certificate (for public verification)
CREATE POLICY "Certificates are publicly viewable" ON public.certificates
  FOR SELECT USING (true);

-- Only authenticated admins/staff can insert/update/delete certificates
CREATE POLICY "Admins can insert certificates" ON public.certificates
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update certificates" ON public.certificates
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete certificates" ON public.certificates
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Sequence for certificate ID generation
CREATE SEQUENCE certificate_seq START 1;

-- Storage setup for PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true);

-- Storage Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'certificates' AND 
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'certificates' AND 
  EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
