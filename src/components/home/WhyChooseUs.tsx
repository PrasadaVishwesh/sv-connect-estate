import { Shield, Users, TrendingUp, Headphones, FileCheck, Home } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verified Properties',
    description: 'Every property is thoroughly verified for legal documents, ownership, and authenticity.',
  },
  {
    icon: Users,
    title: 'Expert Mediators',
    description: 'Our experienced team ensures smooth negotiations and transparent dealings.',
  },
  {
    icon: TrendingUp,
    title: 'Best Market Rates',
    description: 'Get the best value with our in-depth market analysis and fair pricing.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock assistance for all your property-related queries.',
  },
  {
    icon: FileCheck,
    title: 'Legal Assistance',
    description: 'Complete documentation support and legal verification services.',
  },
  {
    icon: Home,
    title: 'Wide Selection',
    description: 'Access to hundreds of properties across multiple cities and categories.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Your Trusted Real Estate Partner
          </h2>
          <p className="text-muted-foreground mt-4">
            As a dedicated property mediator, we bridge the gap between buyers, sellers, and renters with transparency and expertise.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="bg-card p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 group animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
