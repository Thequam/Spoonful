-- Migration: Update spoons constraint to allow 5 spoons (Extreme Energy)
-- This migration updates the CHECK constraint on both activities and timetable_entries tables
-- to allow spoons values from 0 to 5 instead of 0 to 4

-- Drop the old constraint and add new one for activities table
ALTER TABLE public.activities 
DROP CONSTRAINT IF EXISTS activities_spoons_check;

ALTER TABLE public.activities 
ADD CONSTRAINT activities_spoons_check CHECK (spoons >= 0 AND spoons <= 5);

-- Drop the old constraint and add new one for timetable_entries table
ALTER TABLE public.timetable_entries 
DROP CONSTRAINT IF EXISTS timetable_entries_spoons_check;

ALTER TABLE public.timetable_entries 
ADD CONSTRAINT timetable_entries_spoons_check CHECK (spoons >= 0 AND spoons <= 5);
