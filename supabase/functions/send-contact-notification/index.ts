import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactNotificationRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message }: ContactNotificationRequest = await req.json();

    console.log("Sending contact notification email for:", { name, email, phone, subject });

    // Send notification email using Resend API directly
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "S.V Real Estate <onboarding@resend.dev>",
        to: ["jatangilingamallu@gmail.com"],
        subject: `New Contact Inquiry: ${subject || 'General Inquiry'}`,
        html: `
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
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><a href="tel:${phone}">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Subject:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${subject || 'Not specified'}</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px;">
                <h3 style="color: #1a2744; margin-top: 0;">Message:</h3>
                <p style="line-height: 1.6;">${message}</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #e8f4e8; border-radius: 5px; border-left: 4px solid #4CAF50;">
                <p style="margin: 0; font-size: 14px;">
                  <strong>Quick Actions:</strong><br>
                  📞 Call: <a href="tel:${phone}">${phone}</a><br>
                  💬 WhatsApp: <a href="https://wa.me/${phone.replace(/\D/g, '')}">Send WhatsApp</a><br>
                  ✉️ Reply: <a href="mailto:${email}">Send Email</a>
                </p>
              </div>
            </div>
            
            <div style="background: #1a2744; color: white; padding: 15px; text-align: center; font-size: 12px;">
              <p style="margin: 0;">This email was sent from your S.V Real Estate website contact form.</p>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
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
