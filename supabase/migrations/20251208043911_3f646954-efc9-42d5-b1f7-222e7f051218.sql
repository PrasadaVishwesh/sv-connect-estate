-- Revoke SELECT from anonymous role on contact_submissions
-- This explicitly prevents unauthenticated users from reading contact form data
REVOKE SELECT ON public.contact_submissions FROM anon;

-- Also revoke UPDATE and DELETE from anon for completeness
REVOKE UPDATE ON public.contact_submissions FROM anon;
REVOKE DELETE ON public.contact_submissions FROM anon;