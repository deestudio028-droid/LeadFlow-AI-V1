-- ==========================================
-- AUDIT SCRIPT: FIND MISSING PROFILES
-- ==========================================
-- This query identifies auth.users that DO NOT have a matching row in public.profiles
SELECT 
  u.id AS auth_user_id,
  u.email,
  u.created_at
FROM 
  auth.users u
LEFT JOIN 
  public.profiles p ON u.id = p.id
WHERE 
  p.id IS NULL;


-- ==========================================
-- FIX EXISTING DATA: IDEMPOTENT MIGRATION
-- ==========================================
-- Automatically create missing profiles for existing auth.users safely
INSERT INTO public.profiles (id, role)
SELECT 
  u.id, 
  'Client' as role
FROM 
  auth.users u
LEFT JOIN 
  public.profiles p ON u.id = p.id
WHERE 
  p.id IS NULL;


-- ==========================================
-- REPAIR TRIGGER
-- ==========================================
-- Drop existing to be safe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Re-declare function securely
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'Client')
  ON CONFLICT (id) DO NOTHING; -- Idempotency inside the trigger
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- AUDIT ORPHANED BUSINESSES (Sanity Check)
-- ==========================================
-- Identify businesses whose owner_id does not exist in profiles
SELECT 
  b.id AS business_id,
  b.name,
  b.owner_id
FROM 
  public.businesses b
LEFT JOIN 
  public.profiles p ON b.owner_id = p.id
WHERE 
  p.id IS NULL;

-- Note: To fix orphaned businesses, their owner_id must be updated to a valid profile.id, or the orphaned business should be deleted.
