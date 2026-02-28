-- Add is_restricted column to students table
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS is_restricted BOOLEAN DEFAULT FALSE;

-- Force update RLS if needed (though existing policies should work)
-- We might want to add a policy that prevents restricted students from seeing certain things,
-- but for now we will handle the restriction logic in the application layer (server actions/UI).
