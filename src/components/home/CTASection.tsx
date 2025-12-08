import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20 bg-hero-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Find Your
            <span className="text-accent"> Perfect Property?</span>
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-10 max-w-xl mx-auto">
            Get in touch with our expert mediators today. Whether you're buying, selling, or renting, we're here to help you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" asChild>
              <Link to="/properties" className="gap-2">
                Browse Properties
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" asChild>
              <a href="tel:+918099952200" className="gap-2">
                <Phone className="w-5 h-5" />
                Call Us Now
              </a>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-primary-foreground/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm">Available 24/7</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-primary-foreground/20" />
            <span className="text-sm">Free Consultation</span>
            <div className="hidden sm:block w-px h-4 bg-primary-foreground/20" />
            <span className="text-sm">No Hidden Charges</span>
          </div>
        </div>
      </div>
    </section>
  );
}
