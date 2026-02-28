-- Admin-Teacher Internal Chat System

CREATE TABLE IF NOT EXISTS teacher_admin_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject TEXT NOT NULL DEFAULT 'Institutional Talk',
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teacher_admin_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES teacher_admin_threads(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('teacher', 'admin')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_teacher_admin_threads_teacher ON teacher_admin_threads(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_admin_messages_thread ON teacher_admin_messages(thread_id);

-- Enable RLS
ALTER TABLE teacher_admin_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_admin_messages ENABLE ROW LEVEL SECURITY;

-- Policies (Service role access for simplicity in server actions)
CREATE POLICY "Service role full access teacher_admin_threads" ON teacher_admin_threads FOR ALL USING (true);
CREATE POLICY "Service role full access teacher_admin_messages" ON teacher_admin_messages FOR ALL USING (true);
