-- Create owner_submissions table for property listing requests
CREATE TABLE public.owner_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Owner Details
  owner_name TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  -- Property Details
  property_type TEXT NOT NULL,
  listing_type TEXT NOT NULL,
  title TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft TEXT,
  expected_price TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'NEW'
);

-- Create property_enquiries table for leads from property detail pages
CREATE TABLE public.property_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  property_id TEXT NOT NULL,
  property_title TEXT NOT NULL,
  -- Enquiry Details
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  preferred_time TEXT,
  status TEXT NOT NULL DEFAULT 'NEW'
);

-- Enable Row Level Security on both tables
ALTER TABLE public.owner_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_enquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for owner_submissions
-- Anyone can submit (public form)
CREATE POLICY "Anyone can submit property listing"
ON public.owner_submissions
FOR INSERT
WITH CHECK (true);

-- Only admins and agents can view submissions
CREATE POLICY "Admins and agents can view owner submissions"
ON public.owner_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'agent'::app_role));

-- Only admins can update submissions
CREATE POLICY "Admins can update owner submissions"
ON public.owner_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete submissions
CREATE POLICY "Admins can delete owner submissions"
ON public.owner_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for property_enquiries
-- Anyone can submit an enquiry (public form)
CREATE POLICY "Anyone can submit property enquiry"
ON public.property_enquiries
FOR INSERT
WITH CHECK (true);

-- Only admins and agents can view enquiries
CREATE POLICY "Admins and agents can view property enquiries"
ON public.property_enquiries
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'agent'::app_role));

-- Only admins can update enquiries
CREATE POLICY "Admins can update property enquiries"
ON public.property_enquiries
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete enquiries
CREATE POLICY "Admins can delete property enquiries"
ON public.property_enquiries
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_owner_submissions_updated_at
BEFORE UPDATE ON public.owner_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_property_enquiries_updated_at
BEFORE UPDATE ON public.property_enquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Explicitly revoke SELECT from anonymous role for both tables (PII protection)
REVOKE SELECT ON public.owner_submissions FROM anon;
REVOKE UPDATE ON public.owner_submissions FROM anon;
REVOKE DELETE ON public.owner_submissions FROM anon;

REVOKE SELECT ON public.property_enquiries FROM anon;
REVOKE UPDATE ON public.property_enquiries FROM anon;
REVOKE DELETE ON public.property_enquiries FROM anon;