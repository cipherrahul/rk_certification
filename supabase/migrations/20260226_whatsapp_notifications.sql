-- Add PDF and WhatsApp tracking to fee_payments
ALTER TABLE public.fee_payments 
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS whatsapp_message_id TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_error TEXT;

-- Add PDF and WhatsApp tracking to salary_records
ALTER TABLE public.salary_records 
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS whatsapp_message_id TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_error TEXT;

-- Create Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('fee-receipts', 'fee-receipts', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('salary-slips', 'salary-slips', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for fee-receipts
CREATE POLICY "Public Access for fee-receipts" ON storage.objects
FOR SELECT USING (bucket_id = 'fee-receipts');

CREATE POLICY "Admin Upload fee-receipts" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'fee-receipts' AND
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

CREATE POLICY "Admin Delete fee-receipts" ON storage.objects
FOR DELETE USING (
    bucket_id = 'fee-receipts' AND
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Storage Policies for salary-slips
CREATE POLICY "Public Access for salary-slips" ON storage.objects
FOR SELECT USING (bucket_id = 'salary-slips');

CREATE POLICY "Admin Upload salary-slips" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'salary-slips' AND
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

CREATE POLICY "Admin Delete salary-slips" ON storage.objects
FOR DELETE USING (
    bucket_id = 'salary-slips' AND
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);
