-- Create Storage Bucket for Financial Reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for reports
CREATE POLICY "Public Access for reports" ON storage.objects
FOR SELECT USING (bucket_id = 'reports');

CREATE POLICY "Admin Upload reports" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'reports' AND
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

CREATE POLICY "Admin Delete reports" ON storage.objects
FOR DELETE USING (
    bucket_id = 'reports' AND
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
