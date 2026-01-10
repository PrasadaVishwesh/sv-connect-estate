-- Add explicit deny policies for the rate_limits table
-- This provides defense in depth for the operational table used by Edge Functions

-- Block all public SELECT access
CREATE POLICY "Block all public select on rate limits"
ON public.rate_limits
FOR SELECT
TO public
USING (false);

-- Block all public INSERT access (only service role should insert)
CREATE POLICY "Block all public insert on rate limits"
ON public.rate_limits
FOR INSERT
TO public
WITH CHECK (false);

-- Block all public UPDATE access
CREATE POLICY "Block all public update on rate limits"
ON public.rate_limits
FOR UPDATE
TO public
USING (false)
WITH CHECK (false);

-- Block all public DELETE access
CREATE POLICY "Block all public delete on rate limits"
ON public.rate_limits
FOR DELETE
TO public
USING (false);