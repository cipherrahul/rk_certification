-- Migration: Online Learning Features
-- Description: Creates tables for live classes, study materials, assignments, and online tests.

-- 1. Live Classes
CREATE TABLE IF NOT EXISTS public.live_classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    platform TEXT NOT NULL CHECK (platform IN ('Zoom', 'Google Meet', 'Other')),
    meeting_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Study Materials (Recorded Lectures & Notes)
CREATE TABLE IF NOT EXISTS public.study_materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    material_type TEXT NOT NULL CHECK (material_type IN ('Video', 'PDF', 'Document', 'Link')),
    file_url TEXT NOT NULL, -- Can be a YouTube link, Drive link, or Supabase Storage URL
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Assignments
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_marks INTEGER NOT NULL DEFAULT 100,
    attachment_url TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Assignment Submissions
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    submission_url TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    marks_obtained INTEGER,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Graded', 'Late')),
    UNIQUE(assignment_id, student_id)
);

-- 5. Online Tests
CREATE TABLE IF NOT EXISTS public.online_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    max_marks INTEGER NOT NULL,
    passing_marks INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Test Questions
CREATE TABLE IF NOT EXISTS public.test_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES public.online_tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'MCQ' CHECK (question_type IN ('MCQ', 'TrueFalse', 'ShortAnswer')),
    options JSONB, -- Array of strings for MCQ options
    correct_option TEXT, -- The exact text of the correct option or simple answer
    marks INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Test Submissions
CREATE TABLE IF NOT EXISTS public.test_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_id UUID REFERENCES public.online_tests(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    answers JSONB NOT NULL, -- Key-value map of { question_id: selected_answer }
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    score INTEGER,
    status TEXT NOT NULL DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Submitted', 'Graded')),
    UNIQUE(test_id, student_id)
);

-- Add auth features to students table if not exists (we might need a password hash field)
-- Since we are doing a custom student login, we can add a simple password field mapped to the student table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- RLS Policies can be added later if utilizing direct client fetching, 
-- but since we are using Server Actions (Supabase Service Key / Auth bypass) for now, we don't strictly need RLS here,
-- but let's enable RLS and just open it up for service role for good practice.

ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_submissions ENABLE ROW LEVEL SECURITY;

-- Allow everything for authenticated/service role (we will rely on server actions logic for auth)
CREATE POLICY "Enable all for service role on live_classes" ON public.live_classes FOR ALL USING (true);
CREATE POLICY "Enable all for service role on study_materials" ON public.study_materials FOR ALL USING (true);
CREATE POLICY "Enable all for service role on assignments" ON public.assignments FOR ALL USING (true);
CREATE POLICY "Enable all for service role on assignment_submissions" ON public.assignment_submissions FOR ALL USING (true);
CREATE POLICY "Enable all for service role on online_tests" ON public.online_tests FOR ALL USING (true);
CREATE POLICY "Enable all for service role on test_questions" ON public.test_questions FOR ALL USING (true);
CREATE POLICY "Enable all for service role on test_submissions" ON public.test_submissions FOR ALL USING (true);
