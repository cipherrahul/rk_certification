-- Teacher Portal: Add password_hash to teachers table
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS specializations TEXT;

-- Teacher-posted Materials (class-specific)
CREATE TABLE IF NOT EXISTS teacher_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    class_name TEXT NOT NULL,        -- e.g. "Class 11", "BCA", "MCA"
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    material_type TEXT NOT NULL DEFAULT 'Video' CHECK (material_type IN ('Video', 'PDF', 'Link', 'Notes')),
    file_url TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teacher-posted Assignments (class-specific)
CREATE TABLE IF NOT EXISTS teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    class_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    max_marks INTEGER DEFAULT 100,
    attachment_url TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teacher-scheduled Live Classes (class-specific)
CREATE TABLE IF NOT EXISTS teacher_live_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    class_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    platform TEXT DEFAULT 'Zoom' CHECK (platform IN ('Zoom', 'Google Meet', 'Microsoft Teams', 'Other')),
    meeting_url TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_teacher_materials_class ON teacher_materials(class_name);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_class ON teacher_assignments(class_name);
CREATE INDEX IF NOT EXISTS idx_teacher_live_classes_class ON teacher_live_classes(class_name);
CREATE INDEX IF NOT EXISTS idx_teacher_materials_teacher ON teacher_materials(teacher_id);

-- RLS
ALTER TABLE teacher_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_live_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Open access teacher_materials" ON teacher_materials FOR ALL USING (true);
CREATE POLICY "Open access teacher_assignments" ON teacher_assignments FOR ALL USING (true);
CREATE POLICY "Open access teacher_live_classes" ON teacher_live_classes FOR ALL USING (true);
