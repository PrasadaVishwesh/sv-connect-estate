import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_MAX = 5; // Max 5 requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour window

// Create Supabase client with service role for rate limiting
function getSupabaseClient() {
  return createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
}

// Persistent rate limiting using database
async function isRateLimited(ip: string, endpoint: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  try {
    // Check if there's an existing record for this IP and endpoint
    const { data: existing, error: selectError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('ip_address', ip)
      .eq('endpoint', endpoint)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is fine
      console.error('Rate limit check error:', selectError);
      return false; // Allow request on error
    }

    if (!existing) {
      // No existing record, create one
      await supabase.from('rate_limits').insert({
        ip_address: ip,
        endpoint: endpoint,
        request_count: 1,
        window_start: now.toISOString(),
      });
      return false;
    }

    // Check if window has expired
    const recordWindowStart = new Date(existing.window_start);
    if (recordWindowStart < windowStart) {
      // Window expired, reset the counter
      await supabase
        .from('rate_limits')
        .update({
          request_count: 1,
          window_start: now.toISOString(),
        })
        .eq('id', existing.id);
      return false;
    }

    // Check if over limit
    if (existing.request_count >= RATE_LIMIT_MAX) {
      return true; // Rate limited
    }

    // Increment counter
    await supabase
      .from('rate_limits')
      .update({
        request_count: existing.request_count + 1,
      })
      .eq('id', existing.id);

    return false;
  } catch (error) {
    console.error('Rate limiting error:', error);
    return false; // Allow request on error
  }
}

// Cleanup old rate limit records (call occasionally)
async function cleanupRateLimits() {
  const supabase = getSupabaseClient();
  try {
    await supabase.rpc('cleanup_old_rate_limits');
  } catch (error) {
    console.error('Rate limit cleanup error:', error);
  }
}

// HTML escape function to prevent XSS/injection
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Input validation
function validateInput(data: any): { valid: boolean; error?: string } {
  // Honeypot check - if website field is filled, it's a bot
  if (data.website && data.website.trim().length > 0) {
    return { valid: false, error: 'Spam detected' };
  }

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (data.name.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' };
  }
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  if (data.email.length > 255) {
    return { valid: false, error: 'Email must be less than 255 characters' };
  }
  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
    return { valid: false, error: 'Phone is required' };
  }
  if (data.phone.length > 20) {
    return { valid: false, error: 'Phone must be less than 20 characters' };
  }
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length === 0) {
    return { valid: false, error: 'Message is required' };
  }
  if (data.message.length > 2000) {
    return { valid: false, error: 'Message must be less than 2000 characters' };
  }
  if (data.subject && data.subject.length > 200) {
    return { valid: false, error: 'Subject must be less than 200 characters' };
  }
  return { valid: true };
}

interface ContactNotificationRequest {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  website?: string; // Honeypot field - should always be empty
  notificationType?: 'contact' | 'owner_submission' | 'property_enquiry';
  propertyTitle?: string;
  propertyId?: string;
  // For owner submissions
  propertyType?: string;
  listingType?: string;
  city?: string;
  area?: string;
  expectedPrice?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(',')[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    // Persistent rate limiting check
    const endpoint = 'send-contact-notification';
    if (await isRateLimited(clientIP, endpoint)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Occasionally cleanup old rate limit records
    if (Math.random() < 0.1) {
      cleanupRateLimits();
    }

    const data: ContactNotificationRequest = await req.json();
    
    // Validate required fields (includes honeypot check)
    const validation = validateInput(data);
    if (!validation.valid) {
      console.log("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Escape all user inputs for HTML
    const safeName = escapeHtml(data.name.trim());
    const safeEmail = escapeHtml(data.email.trim());
    const safePhone = escapeHtml(data.phone.trim());
    const safeSubject = escapeHtml(data.subject?.trim() || '');
    const safeMessage = escapeHtml(data.message.trim());
    const safePropertyTitle = escapeHtml(data.propertyTitle || '');
    const safePropertyId = escapeHtml(data.propertyId || '');
    const safePropertyType = escapeHtml(data.propertyType || '');
    const safeListingType = escapeHtml(data.listingType || '');
    const safeCity = escapeHtml(data.city || '');
    const safeArea = escapeHtml(data.area || '');
    const safeExpectedPrice = escapeHtml(data.expectedPrice || '');

    // URL-encode phone for WhatsApp link (remove non-digits)
    const phoneDigits = data.phone.replace(/\D/g, '');

    console.log("Sending notification email for:", { 
      name: safeName, 
      email: safeEmail, 
      type: data.notificationType || 'contact' 
    });

    let emailSubject = '';
    let emailHtml = '';

    // Build email based on notification type
    if (data.notificationType === 'owner_submission') {
      emailSubject = `New Property Listing: ${safePropertyType} in ${safeCity}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a2744; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">S.V Real Estate</h1>
            <p style="margin: 5px 0 0;">New Property Listing Request</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1a2744; margin-top: 0;">Owner Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 140px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="tel:${safePhone}">${safePhone}</a></td>
              </tr>
            </table>

            <h2 style="color: #1a2744; margin-top: 20px;">Property Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 140px;">Property Type:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safePropertyType}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Listing Type:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeListingType}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Location:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeArea}, ${safeCity}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Expected Price:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeExpectedPrice || 'Not specified'}</td>
              </tr>
            </table>
            
            ${safeMessage ? `
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px;">
              <h3 style="color: #1a2744; margin-top: 0;">Additional Details:</h3>
              <p style="line-height: 1.6;">${safeMessage}</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f4e8; border-radius: 5px; border-left: 4px solid #4CAF50;">
              <p style="margin: 0; font-size: 14px;">
                <strong>Quick Actions:</strong><br>
                📞 Call: <a href="tel:${safePhone}">${safePhone}</a><br>
                💬 WhatsApp: <a href="https://wa.me/${phoneDigits}">Send WhatsApp</a><br>
                ✉️ Reply: <a href="mailto:${safeEmail}">Send Email</a>
              </p>
            </div>
          </div>
          
          <div style="background: #1a2744; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">This email was sent from your S.V Real Estate List Property form.</p>
          </div>
        </div>
      `;
    } else if (data.notificationType === 'property_enquiry') {
      emailSubject = `Property Enquiry: ${safePropertyTitle}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a2744; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">S.V Real Estate</h1>
            <p style="margin: 5px 0 0;">New Property Enquiry</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
              <strong>Property:</strong> ${safePropertyTitle}<br>
              <strong>Property ID:</strong> ${safePropertyId}
            </div>

            <h2 style="color: #1a2744; margin-top: 0;">Enquiry Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 140px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeEmail || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="tel:${safePhone}">${safePhone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Preferred Time:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeSubject || 'Not specified'}</td>
              </tr>
            </table>
            
            ${safeMessage ? `
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px;">
              <h3 style="color: #1a2744; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6;">${safeMessage}</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f4e8; border-radius: 5px; border-left: 4px solid #4CAF50;">
              <p style="margin: 0; font-size: 14px;">
                <strong>Quick Actions:</strong><br>
                📞 Call: <a href="tel:${safePhone}">${safePhone}</a><br>
                💬 WhatsApp: <a href="https://wa.me/${phoneDigits}">Send WhatsApp</a><br>
                ${safeEmail ? `✉️ Reply: <a href="mailto:${safeEmail}">Send Email</a>` : ''}
              </p>
            </div>
          </div>
          
          <div style="background: #1a2744; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">This email was sent from your S.V Real Estate property enquiry form.</p>
          </div>
        </div>
      `;
    } else {
      // Default contact form
      emailSubject = `New Contact Inquiry: ${safeSubject || 'General Inquiry'}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a2744; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">S.V Real Estate</h1>
            <p style="margin: 5px 0 0;">New Contact Form Submission</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1a2744; margin-top: 0;">New Inquiry Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="tel:${safePhone}">${safePhone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Subject:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeSubject || 'Not specified'}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px;">
              <h3 style="color: #1a2744; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6;">${safeMessage}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e8f4e8; border-radius: 5px; border-left: 4px solid #4CAF50;">
              <p style="margin: 0; font-size: 14px;">
                <strong>Quick Actions:</strong><br>
                📞 Call: <a href="tel:${safePhone}">${safePhone}</a><br>
                💬 WhatsApp: <a href="https://wa.me/${phoneDigits}">Send WhatsApp</a><br>
                ✉️ Reply: <a href="mailto:${safeEmail}">Send Email</a>
              </p>
            </div>
          </div>
          
          <div style="background: #1a2744; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">This email was sent from your S.V Real Estate website contact form.</p>
          </div>
        </div>
      `;
    }

    // Send notification email using Resend API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "S.V Real Estate <onboarding@resend.dev>",
        to: ["jatangilingamallu@gmail.com"],
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const responseData = await res.json();
    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);