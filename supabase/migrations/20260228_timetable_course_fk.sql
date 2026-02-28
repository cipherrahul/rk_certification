-- Migration to switch timetables to use the central courses table instead of branch_classes
-- Run this in your Supabase SQL Editor

ALTER TABLE public.timetables DROP CONSTRAINT IF EXISTS timetables_class_id_fkey;

-- Rename class_id to course_id
ALTER TABLE public.timetables RENAME COLUMN class_id TO course_id;

-- Add the new foreign key referencing the global courses table
ALTER TABLE public.timetables ADD CONSTRAINT timetables_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
