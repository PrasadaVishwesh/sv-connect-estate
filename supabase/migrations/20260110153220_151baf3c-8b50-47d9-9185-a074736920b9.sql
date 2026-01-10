-- Create rate limiting table for persistent rate limiting across cold starts
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  endpoint text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(ip_address, endpoint)
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow edge functions (via service role) to manage rate limits
-- No public access needed - only service role accesses this table

-- Add cleanup function for old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.rate_limits 
  WHERE window_start < now() - interval '2 hours';
$$;

-- Add database CHECK constraints for contact_submissions
ALTER TABLE public.contact_submissions
ADD CONSTRAINT contact_name_length CHECK (char_length(name) > 0 AND char_length(name) <= 100),
ADD CONSTRAINT contact_email_format CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
ADD CONSTRAINT contact_email_length CHECK (char_length(email) <= 255),
ADD CONSTRAINT contact_phone_length CHECK (char_length(phone) > 0 AND char_length(phone) <= 20),
ADD CONSTRAINT contact_message_length CHECK (char_length(message) > 0 AND char_length(message) <= 2000),
ADD CONSTRAINT contact_subject_length CHECK (subject IS NULL OR char_length(subject) <= 200);

-- Add database CHECK constraints for owner_submissions
ALTER TABLE public.owner_submissions
ADD CONSTRAINT owner_name_length CHECK (char_length(owner_name) > 0 AND char_length(owner_name) <= 100),
ADD CONSTRAINT owner_email_format CHECK (owner_email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
ADD CONSTRAINT owner_email_length CHECK (char_length(owner_email) <= 255),
ADD CONSTRAINT owner_phone_length CHECK (char_length(owner_phone) > 0 AND char_length(owner_phone) <= 20),
ADD CONSTRAINT owner_title_length CHECK (char_length(title) > 0 AND char_length(title) <= 200),
ADD CONSTRAINT owner_city_length CHECK (char_length(city) > 0 AND char_length(city) <= 100),
ADD CONSTRAINT owner_area_length CHECK (char_length(area) > 0 AND char_length(area) <= 100),
ADD CONSTRAINT owner_description_length CHECK (description IS NULL OR char_length(description) <= 2000);

-- Add database CHECK constraints for property_enquiries
ALTER TABLE public.property_enquiries
ADD CONSTRAINT enq_name_length CHECK (char_length(name) > 0 AND char_length(name) <= 100),
ADD CONSTRAINT enq_phone_length CHECK (char_length(phone) > 0 AND char_length(phone) <= 20),
ADD CONSTRAINT enq_email_format CHECK (email IS NULL OR email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
ADD CONSTRAINT enq_email_length CHECK (email IS NULL OR char_length(email) <= 255),
ADD CONSTRAINT enq_message_length CHECK (message IS NULL OR char_length(message) <= 2000),
ADD CONSTRAINT enq_property_id_length CHECK (char_length(property_id) > 0 AND char_length(property_id) <= 50),
ADD CONSTRAINT enq_property_title_length CHECK (char_length(property_title) > 0 AND char_length(property_title) <= 200);