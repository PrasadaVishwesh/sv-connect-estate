-- Fix RLS policies by adding PERMISSIVE policies alongside the existing RESTRICTIVE ones
-- This ensures proper access control while maintaining security

-- Drop existing restrictive SELECT policies and recreate as permissive
-- For contact_submissions
DROP POLICY IF EXISTS "Admins and agents can view submissions" ON public.contact_submissions;
CREATE POLICY "Admins and agents can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'agent'::app_role));

-- For owner_submissions
DROP POLICY IF EXISTS "Admins and agents can view owner submissions" ON public.owner_submissions;
CREATE POLICY "Admins and agents can view owner submissions" 
ON public.owner_submissions 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'agent'::app_role));

-- For property_enquiries
DROP POLICY IF EXISTS "Admins and agents can view property enquiries" ON public.property_enquiries;
CREATE POLICY "Admins and agents can view property enquiries" 
ON public.property_enquiries 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'agent'::app_role));

-- For user_roles - drop existing and recreate to ensure authenticated-only access
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Also fix the INSERT policies to use permissive with proper TO clause
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form" 
ON public.contact_submissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can submit property listing" ON public.owner_submissions;
CREATE POLICY "Anyone can submit property listing" 
ON public.owner_submissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can submit property enquiry" ON public.property_enquiries;
CREATE POLICY "Anyone can submit property enquiry" 
ON public.property_enquiries 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Fix DELETE and UPDATE policies to use proper TO clause
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.contact_submissions;
CREATE POLICY "Admins can delete contact submissions" 
ON public.contact_submissions 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update contact submissions" 
ON public.contact_submissions 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete owner submissions" ON public.owner_submissions;
CREATE POLICY "Admins can delete owner submissions" 
ON public.owner_submissions 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update owner submissions" ON public.owner_submissions;
CREATE POLICY "Admins can update owner submissions" 
ON public.owner_submissions 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete property enquiries" ON public.property_enquiries;
CREATE POLICY "Admins can delete property enquiries" 
ON public.property_enquiries 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update property enquiries" ON public.property_enquiries;
CREATE POLICY "Admins can update property enquiries" 
ON public.property_enquiries 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
CREATE POLICY "Only admins can manage roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));