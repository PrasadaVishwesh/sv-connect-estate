import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  Phone, Mail, MapPin, Clock, MessageCircle, 
  Send, Facebook, Instagram, Linkedin, Twitter 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || null,
          message: formData.message,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save your message');
      }

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-contact-notification', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw - the message was saved, just email failed
      }
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Get In Touch
            </h1>
            <p className="text-lg text-primary-foreground/70">
              Have questions about a property or need assistance? We're here to help you find your perfect space.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                <p className="text-muted-foreground">
                  Reach out to us through any of these channels. Our team is available to assist you.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Office Address</h3>
                    <p className="text-muted-foreground mt-1">
                      Andhra Prabha Colony, Ajith Singh Nagar,<br />
                      Vijayawada - 520015, Andhra Pradesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone Numbers</h3>
                    <p className="text-muted-foreground mt-1">
                      <a href="tel:+918099952200" className="hover:text-accent transition-colors block">
                        +91 80999 52200
                      </a>
                      <a href="tel:+917981467553" className="hover:text-accent transition-colors block">
                        +91 79814 67553
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email Address</h3>
                    <p className="text-muted-foreground mt-1">
                      <a href="mailto:jatangilingamallu@gmail.com" className="hover:text-accent transition-colors">
                        jatangilingamallu@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Office Hours</h3>
                    <p className="text-muted-foreground mt-1">
                      Monday - Saturday: 9:00 AM - 7:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Chat on WhatsApp</h3>
                <a 
                  href={`https://wa.me/918099952200?text=${encodeURIComponent('Hi! I am interested in your real estate services. Please share more details.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#25D366] text-white hover:bg-[#20BD5C] transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">+91 80999 52200</div>
                    <div className="text-sm opacity-90">Get instant replies</div>
                  </div>
                </a>
                <a 
                  href={`https://wa.me/917981467553?text=${encodeURIComponent('Hi! I am interested in your real estate services. Please share more details.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#25D366] text-white hover:bg-[#20BD5C] transition-colors"
                >
                  <MessageCircle className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">+91 79814 67553</div>
                    <div className="text-sm opacity-90">Alternative number</div>
                  </div>
                </a>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                    <a 
                      key={i}
                      href="#"
                      className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl p-8 shadow-card">
                <h2 className="text-2xl font-bold text-foreground mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData(f => ({ ...f, subject: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="">Select a subject</option>
                        <option value="buy">Looking to Buy</option>
                        <option value="sell">Want to Sell</option>
                        <option value="rent">Looking to Rent</option>
                        <option value="list">List My Property</option>
                        <option value="other">Other Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="accent" 
                    size="lg" 
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <div className="bg-secondary rounded-xl overflow-hidden h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.1234567890123!2d80.6480!3d16.5062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9e75e1b1f%3A0x0!2sAjith%20Singh%20Nagar%2C%20Vijayawada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1699123456789!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
