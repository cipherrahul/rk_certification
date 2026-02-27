-- Create Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    exam_date DATE NOT NULL,
    course TEXT NOT NULL,
    academic_session TEXT NOT NULL,
    total_marks INTEGER NOT NULL DEFAULT 100,
    passing_marks INTEGER NOT NULL DEFAULT 33,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Exam Marks Table
CREATE TABLE IF NOT EXISTS exam_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL DEFAULT 0,
    is_absent BOOLEAN NOT NULL DEFAULT false,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(exam_id, student_id, subject_name)
);

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_marks ENABLE ROW LEVEL SECURITY;

-- Policies for public or authenticated access (basic policies for now)
CREATE POLICY "Enable all for signed-in users" ON exams FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for signed-in users" ON exam_marks FOR ALL USING (auth.role() = 'authenticated');
