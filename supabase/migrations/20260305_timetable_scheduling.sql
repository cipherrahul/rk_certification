-- ============================================================
-- Timetable & Scheduling System Migration
-- ============================================================

-- 1. Create Rooms Table
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 30,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Maintenance')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Holidays Table
CREATE TABLE public.holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE, -- NULL means global holiday
    date DATE NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Public' CHECK (type IN ('Public', 'School', 'Emergency')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Timetables Table
CREATE TABLE public.timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.branch_classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    valid_from DATE NOT NULL,
    valid_until DATE,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Class Schedules Table
CREATE TABLE public.class_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timetable_id UUID NOT NULL REFERENCES public.timetables(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_special_class BOOLEAN NOT NULL DEFAULT FALSE,
    special_date DATE, -- Populated only if is_special_class is TRUE
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- 5. Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies: Admins full access
-- ============================================================

CREATE POLICY "Admins have full access to rooms" ON public.rooms
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admins have full access to holidays" ON public.holidays
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admins have full access to timetables" ON public.timetables
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Admins have full access to class_schedules" ON public.class_schedules
    FOR ALL TO authenticated USING (true);

-- ============================================================
-- RLS Policies: Public Read Access (for Students viewing timetable)
-- ============================================================

CREATE POLICY "Rooms are publicly viewable" ON public.rooms
    FOR SELECT USING (true);

CREATE POLICY "Holidays are publicly viewable" ON public.holidays
    FOR SELECT USING (true);

CREATE POLICY "Timetables are publicly viewable" ON public.timetables
    FOR SELECT USING (true);

CREATE POLICY "Class schedules are publicly viewable" ON public.class_schedules
    FOR SELECT USING (true);

-- ============================================================
-- Auto-update updated_at triggers
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER holidays_updated_at BEFORE UPDATE ON public.holidays FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER timetables_updated_at BEFORE UPDATE ON public.timetables FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER class_schedules_updated_at BEFORE UPDATE ON public.class_schedules FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Enable Realtime (Publication)
-- ============================================================
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.branches, 
    public.branch_classes, 
    public.branch_expenses, 
    public.students, 
    public.teachers,
    public.fee_payments,
    public.salary_records,
    public.rooms,
    public.holidays,
    public.timetables,
    public.class_schedules;
COMMIT;
