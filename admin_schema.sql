-- ==========================================
-- ADMIN SCHEMA ADDITIONS
-- ==========================================

-- api_requests_log table
CREATE TABLE IF NOT EXISTS public.api_requests_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER NOT NULL,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Setup for Admin Tables
ALTER TABLE public.api_requests_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read all API requests
CREATE POLICY "Admins can read all api requests" ON public.api_requests_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
);
-- Public (edge function) can insert API requests
CREATE POLICY "Public can insert api requests" ON public.api_requests_log FOR INSERT WITH CHECK (
  true
);

-- Admins can read all audit logs
CREATE POLICY "Admins can read all audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
);
-- Server/Admins can insert audit logs
CREATE POLICY "Server can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (
  true
);
