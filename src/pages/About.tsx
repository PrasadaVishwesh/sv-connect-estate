import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/PageTransition';
import { Button } from '@/components/ui/button';
import { 
  Users, Target, Award, Heart, 
  CheckCircle2, ArrowRight, Building2, Phone
} from 'lucide-react';
import svLogo from '@/assets/sv-logo.jpg';

const values = [
  {
    icon: Heart,
    title: 'Client-First Approach',
    description: 'Your needs and satisfaction are at the heart of everything we do.',
  },
  {
    icon: Target,
    title: 'Transparency',
    description: 'Clear communication, honest pricing, and no hidden surprises.',
  },
  {
    icon: Award,
    title: 'Expertise',
    description: 'Decade of experience in the real estate market.',
  },
  {
    icon: Users,
    title: 'Personal Touch',
    description: 'Dedicated relationship managers for personalized service.',
  },
];

const services = [
  {
    title: 'Property Buying Assistance',
    description: 'End-to-end support for finding and purchasing your dream property.',
    features: ['Property shortlisting', 'Site visits coordination', 'Price negotiation', 'Documentation support'],
  },
  {
    title: 'Property Selling Services',
    description: 'Professional marketing and mediation to get the best value for your property.',
    features: ['Property valuation', 'Professional photography', 'Buyer screening', 'Legal assistance'],
  },
  {
    title: 'Rental Management',
    description: 'Hassle-free rental solutions for landlords and tenants.',
    features: ['Tenant verification', 'Rent agreements', 'Property management', 'Dispute resolution'],
  },
  {
    title: 'Property Hunting',
    description: 'Personalized property search based on your specific requirements.',
    features: ['Custom search criteria', 'Market analysis', 'Comparative reports', 'Investment advice'],
  },
];

export default function About() {
  return (
    <PageTransition>
      <Layout>
      {/* Hero Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              About S.V Real Estate
            </h1>
            <p className="text-lg text-primary-foreground/70">
              Your trusted real estate mediator since 2014. Connecting people to the right property, stress-free.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative animate-fade-up">
              <div className="bg-card rounded-2xl shadow-xl p-8 text-center">
                <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-accent shadow-lg">
                  <img 
                    src={svLogo} 
                    alt="S.V Real Estate"
                    className="w-full h-full object-cover bg-white"
                  />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Jatangi Lingamallu</h3>
                <p className="text-accent font-medium mb-4">Founder & CEO</p>
                <p className="text-muted-foreground mb-6">
                  With over a decade of experience in the real estate industry, our founder has built 
                  S.V Real Estate on the principles of trust, transparency, and customer satisfaction.
                </p>
                <div className="flex justify-center gap-4">
                  <a 
                    href="tel:+918099952200"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Contact
                  </a>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg hidden lg:block">
                <Building2 className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">Trusted</div>
                <div className="text-sm">Property Mediators</div>
              </div>
            </div>
            
            <div className="animate-fade-up stagger-1">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                A Decade of Connecting Dreams to Doorsteps
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  S.V Real Estate was founded with a simple mission: to make property transactions 
                  transparent, stress-free, and accessible to everyone. What started as a small 
                  consultancy in Ajith Singh Nagar, Vijayawada has grown into one of the most trusted 
                  real estate mediation firms in the region.
                </p>
                <p>
                  As mediators, we don't build properties – we build relationships. We act as 
                  the trusted bridge between property owners and seekers, ensuring fair deals, 
                  verified documentation, and seamless transactions.
                </p>
                <p>
                  Over the years, we've helped thousands of families find their dream homes, 
                  assisted investors in making smart property decisions, and supported property 
                  owners in getting the best value for their assets.
                </p>
              </div>
              <div className="flex gap-8 mt-8">
                <div>
                  <div className="text-4xl font-bold text-accent">10+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent">1000+</div>
                  <div className="text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent">500+</div>
                  <div className="text-sm text-muted-foreground">Properties Sold</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              What Drives Us Forward
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={value.title}
                  className="bg-card p-8 rounded-xl shadow-card text-center animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Comprehensive Real Estate Solutions
            </h2>
            <p className="text-muted-foreground mt-4">
              From finding your dream home to selling your property – we've got you covered.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div 
                key={service.title}
                className="bg-card p-8 rounded-xl shadow-card hover:shadow-card-hover transition-shadow animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mediator Fee Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Transparent Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Our Service Charges
            </h2>
            <p className="text-muted-foreground mb-10">
              We believe in complete transparency. All our service charges are discussed upfront 
              with no hidden fees or surprises.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl shadow-card">
                <h3 className="font-semibold text-foreground mb-2">Property Sale</h3>
                <div className="text-3xl font-bold text-accent mb-2">1-2%</div>
                <p className="text-sm text-muted-foreground">of property value</p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-card">
                <h3 className="font-semibold text-foreground mb-2">Rental</h3>
                <div className="text-3xl font-bold text-accent mb-2">1 Month</div>
                <p className="text-sm text-muted-foreground">rent as brokerage</p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-card">
                <h3 className="font-semibold text-foreground mb-2">Consultation</h3>
                <div className="text-3xl font-bold text-accent mb-2">Free</div>
                <p className="text-sm text-muted-foreground">initial consultation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Start Your Property Journey?
          </h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
            Get in touch with our expert team for a free consultation. We're here to help you 
            every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" asChild>
              <Link to="/contact" className="gap-2">
                Contact Us Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  </PageTransition>
  );
}
