-- supabase/migrations/0003_testcases_requirement_id.sql

ALTER TABLE TestCases
ADD COLUMN requirement_id TEXT;
