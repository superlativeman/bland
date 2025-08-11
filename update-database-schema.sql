-- Update database schema to allow multiple submissions from same email
-- Run this in your Supabase SQL Editor

-- First, let's check the current constraints
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'applicants'::regclass 
AND contype = 'u'; -- unique constraints

-- Remove the unique constraint on email
ALTER TABLE public.applicants DROP CONSTRAINT IF EXISTS applicants_email_key;

-- Add an index on created_at for better performance on the API call
CREATE INDEX IF NOT EXISTS idx_applicants_created_at_desc ON public.applicants (created_at DESC);

-- Verify the changes
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'applicants'::regclass 
AND contype = 'u';

-- Check indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'applicants'
ORDER BY indexname;
