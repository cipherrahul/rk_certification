-- Teacher-Student Chat System
-- Each thread links a teacher and a student.

CREATE TABLE IF NOT EXISTS teacher_student_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject TEXT NOT NULL DEFAULT 'Academic Query',
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(teacher_id, student_id)
);

CREATE TABLE IF NOT EXISTS teacher_student_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES teacher_student_threads(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('teacher', 'student')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ts_threads_teacher ON teacher_student_threads(teacher_id);
CREATE INDEX IF NOT EXISTS idx_ts_threads_student ON teacher_student_threads(student_id);
CREATE INDEX IF NOT EXISTS idx_ts_messages_thread ON teacher_student_messages(thread_id);

-- RLS
ALTER TABLE teacher_student_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_student_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access teacher_student_threads" ON teacher_student_threads FOR ALL USING (true);
CREATE POLICY "Access teacher_student_messages" ON teacher_student_messages FOR ALL USING (true);
