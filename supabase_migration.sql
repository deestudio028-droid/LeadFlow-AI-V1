-- Migration to add status and source to leads table

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new',
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'widget';

-- Ensure we don't break existing views or queries by keeping default values
