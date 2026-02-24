-- Add branch column to teachers table
ALTER TABLE public.teachers
  ADD COLUMN IF NOT EXISTS branch TEXT NOT NULL DEFAULT 'Main Branch – Adarsh Nagar, Delhi';
