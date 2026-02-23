-- Add new fields to students table
ALTER TABLE public.students
ADD COLUMN student_class text,
ADD COLUMN total_course_fee numeric(10,2),
ADD COLUMN admission_fee numeric(10,2),
ADD COLUMN monthly_fee_amount numeric(10,2),
ADD COLUMN payment_start_date date,
ADD COLUMN payment_mode text;
