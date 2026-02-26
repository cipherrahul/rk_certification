-- 20240304_enable_realtime_applications.sql
-- Enable Realtime for job_applications table

ALTER TABLE public.job_applications REPLICA IDENTITY FULL;

-- Add to existing publication if exists, or create new one
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.job_applications;
    END IF;
END $$;
