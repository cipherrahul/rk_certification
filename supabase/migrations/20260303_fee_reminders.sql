-- 20260303_fee_reminders.sql
-- Migration to track fee reminder history and prevent spamming

CREATE TABLE IF NOT EXISTS public.fee_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    month TEXT NOT NULL, -- e.g. "March 2026"
    amount_due NUMERIC(10, 2) NOT NULL,
    whatsapp_status TEXT NOT NULL DEFAULT 'pending' CHECK (whatsapp_status IN ('pending', 'sent', 'failed')),
    whatsapp_message_id TEXT,
    whatsapp_error TEXT,
    last_sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient lookup of previous reminders
CREATE INDEX IF NOT EXISTS idx_fee_reminders_student_month ON public.fee_reminders(student_id, month);

-- Enable RLS
ALTER TABLE public.fee_reminders ENABLE ROW LEVEL SECURITY;

-- Admin Policy
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to fee_reminders') THEN
        CREATE POLICY "Admins have full access to fee_reminders" ON public.fee_reminders FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- Enable Realtime safely
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = 'fee_reminders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.fee_reminders;
    END IF;
END $$;
