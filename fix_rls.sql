-- Fix for infinite recursion in RLS policies

-- 1. Create a SECURITY DEFINER function to check admin status safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'Admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the recursive policy on profiles
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;

-- 3. Recreate it using the secure function
CREATE POLICY "Admins can read all profiles" ON public.profiles 
FOR SELECT USING (public.is_admin());

-- 4. (Optional but recommended) Update other Admin policies to use this function 
-- to prevent any future recursion issues and improve query performance.
DROP POLICY IF EXISTS "Admins can manage all businesses" ON public.businesses;
CREATE POLICY "Admins can manage all businesses" ON public.businesses FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all KB" ON public.knowledge_base;
CREATE POLICY "Admins can manage all KB" ON public.knowledge_base FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read all leads" ON public.leads;
CREATE POLICY "Admins can read all leads" ON public.leads FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can read all chat logs" ON public.chat_logs;
CREATE POLICY "Admins can read all chat logs" ON public.chat_logs FOR SELECT USING (public.is_admin());
