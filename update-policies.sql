-- Update RLS policies to allow public access for demo tool
-- Run this in your Supabase SQL Editor

-- First, let's see the current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'applicants';

-- Drop existing policies for applicants table
DROP POLICY IF EXISTS "applicants_read" ON public.applicants;
DROP POLICY IF EXISTS "applicants_write" ON public.applicants;
DROP POLICY IF EXISTS "applicants_update" ON public.applicants;
DROP POLICY IF EXISTS "applicants_delete" ON public.applicants;
DROP POLICY IF EXISTS "applicants_public_insert" ON public.applicants;
DROP POLICY IF EXISTS "applicants_authenticated_read" ON public.applicants;
DROP POLICY IF EXISTS "applicants_authenticated_update" ON public.applicants;
DROP POLICY IF EXISTS "applicants_authenticated_delete" ON public.applicants;

-- Create new policies that allow public access for all operations (demo tool)
-- Allow public inserts (for the application form)
CREATE POLICY "applicants_public_insert" ON public.applicants
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Allow public reads (for viewing applications)
CREATE POLICY "applicants_public_read" ON public.applicants
    FOR SELECT TO anon, authenticated
    USING (true);

-- Allow public updates (for modifying applications)
CREATE POLICY "applicants_public_update" ON public.applicants
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Allow public deletes (for removing applications)
CREATE POLICY "applicants_public_delete" ON public.applicants
    FOR DELETE TO anon, authenticated
    USING (true);

-- Verify the new policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'applicants'
ORDER BY policyname;
