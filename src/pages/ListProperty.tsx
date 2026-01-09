import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Building2, CheckCircle2, Upload, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa / Independent House' },
  { value: 'plot', label: 'Plot / Land' },
  { value: 'commercial', label: 'Commercial Space' },
];

const listingTypes = [
  { value: 'sale', label: 'Sell' },
  { value: 'rent', label: 'Rent' },
];

export default function ListProperty() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Owner Details
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    // Property Details
    propertyType: '',
    listingType: '',
    title: '',
    address: '',
    city: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    areaSqFt: '',
    expectedPrice: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('owner_submissions')
        .insert({
          owner_name: formData.ownerName,
          owner_phone: formData.ownerPhone,
          owner_email: formData.ownerEmail,
          property_type: formData.propertyType,
          listing_type: formData.listingType,
          title: formData.title,
          address: formData.address || null,
          city: formData.city,
          area: formData.area,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          area_sqft: formData.areaSqFt,
          expected_price: formData.expectedPrice,
          description: formData.description || null,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save your submission');
      }

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-contact-notification', {
        body: {
          name: formData.ownerName,
          email: formData.ownerEmail,
          phone: formData.ownerPhone,
          message: formData.description || `Property listing request for ${formData.title}`,
          notificationType: 'owner_submission',
          propertyType: propertyTypes.find(t => t.value === formData.propertyType)?.label || formData.propertyType,
          listingType: listingTypes.find(t => t.value === formData.listingType)?.label || formData.listingType,
          city: formData.city,
          area: formData.area,
          expectedPrice: formData.expectedPrice ? `₹${parseInt(formData.expectedPrice).toLocaleString()}` : '',
        },
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw - submission was saved
      }
    
      toast({
        title: "Property Submitted Successfully!",
        description: "Our team will review your property and contact you within 24 hours.",
      });
    
      setStep(3); // Success step
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    'Free property valuation',
    'Professional photography',
    'Wide buyer/tenant network',
    'Legal documentation support',
    'Negotiation assistance',
    'Zero upfront charges',
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              List Your Property
            </h1>
            <p className="text-lg text-primary-foreground/70">
              Get the best value for your property with S.V Real Estate. We connect you with verified buyers and tenants.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Benefits Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-8 shadow-card sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Why List With Us?</h3>
                </div>

                <ul className="space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Our service charges are transparent and discussed upfront. For property sales, 
                    we charge 1-2% of the property value. For rentals, it's one month's rent.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              {step === 3 ? (
                // Success Message
                <div className="bg-card rounded-xl p-8 shadow-card text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Property Submitted Successfully!
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Thank you for listing your property with S.V Real Estate. Our team will review 
                    your submission and contact you within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="accent" onClick={() => { setStep(1); setFormData({ ownerName: '', ownerPhone: '', ownerEmail: '', propertyType: '', listingType: '', title: '', address: '', city: '', area: '', bedrooms: '', bathrooms: '', areaSqFt: '', expectedPrice: '', description: '' }); }}>
                      List Another Property
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/properties">Browse Properties</a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-xl p-8 shadow-card">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-accent' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-accent text-accent-foreground' : 'bg-secondary'}`}>
                        1
                      </div>
                      <span className="hidden sm:inline font-medium">Your Details</span>
                    </div>
                    <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-accent' : 'bg-border'}`} />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-accent' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-secondary'}`}>
                        2
                      </div>
                      <span className="hidden sm:inline font-medium">Property Details</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {step === 1 && (
                      <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-foreground">Your Contact Details</h2>
                        <p className="text-muted-foreground">We'll use these details to contact you about your property.</p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              name="ownerName"
                              required
                              value={formData.ownerName}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="ownerPhone"
                              required
                              value={formData.ownerPhone}
                              onChange={handleChange}
                              placeholder="+91 98765 43210"
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="ownerEmail"
                            required
                            value={formData.ownerEmail}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>

                        <Button 
                          type="button" 
                          variant="accent" 
                          size="lg"
                          onClick={() => setStep(2)}
                          disabled={!formData.ownerName || !formData.ownerPhone || !formData.ownerEmail}
                          className="w-full md:w-auto"
                        >
                          Continue
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-foreground">Property Details</h2>
                            <p className="text-muted-foreground">Tell us about the property you want to list.</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setStep(1)}
                            className="text-accent hover:underline text-sm"
                          >
                            Back
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Property Type *
                            </label>
                            <select
                              name="propertyType"
                              required
                              value={formData.propertyType}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                              <option value="">Select type</option>
                              {propertyTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Listing Type *
                            </label>
                            <select
                              name="listingType"
                              required
                              value={formData.listingType}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                              <option value="">Select listing type</option>
                              {listingTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Property Title *
                          </label>
                          <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Spacious 3BHK Apartment in Bandra West"
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              name="city"
                              required
                              value={formData.city}
                              onChange={handleChange}
                              placeholder="e.g., Mumbai"
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Area/Locality *
                            </label>
                            <input
                              type="text"
                              name="area"
                              required
                              value={formData.area}
                              onChange={handleChange}
                              placeholder="e.g., Bandra West"
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Full Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Building name, street, landmark"
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Bedrooms
                            </label>
                            <input
                              type="number"
                              name="bedrooms"
                              min="0"
                              value={formData.bedrooms}
                              onChange={handleChange}
                              placeholder="0"
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Bathrooms
                            </label>
                            <input
                              type="number"
                              name="bathrooms"
                              min="0"
                              value={formData.bathrooms}
                              onChange={handleChange}
                              placeholder="0"
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Area (Sq Ft) *
                            </label>
                            <input
                              type="number"
                              name="areaSqFt"
                              required
                              min="0"
                              value={formData.areaSqFt}
                              onChange={handleChange}
                              placeholder="1000"
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Expected Price (₹) *
                            </label>
                            <input
                              type="number"
                              name="expectedPrice"
                              required
                              min="0"
                              value={formData.expectedPrice}
                              onChange={handleChange}
                              placeholder="5000000"
                              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Property Description
                          </label>
                          <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your property - key features, amenities, nearby landmarks..."
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                          />
                        </div>

                        <Button 
                          type="submit" 
                          variant="accent" 
                          size="lg"
                          disabled={isSubmitting}
                          className="w-full md:w-auto"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Property'}
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
