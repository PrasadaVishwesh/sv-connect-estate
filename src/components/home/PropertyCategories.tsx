import { Link } from 'react-router-dom';
import { Home, Building2, Landmark, MapPin, Building } from 'lucide-react';

const categories = [
  {
    title: 'Buy Property',
    description: 'Find your dream home to own',
    icon: Home,
    link: '/properties?type=sale',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'Rent Property',
    description: 'Quality rental properties',
    icon: Building2,
    link: '/properties?type=rent',
    color: 'bg-green-500/10 text-green-600',
  },
  {
    title: 'Commercial Space',
    description: 'Office & retail spaces',
    icon: Building,
    link: '/properties?type=sale&propertyType=commercial',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    title: 'Plots & Land',
    description: 'Build your own space',
    icon: MapPin,
    link: '/properties?type=sale&propertyType=plot',
    color: 'bg-orange-500/10 text-orange-600',
  },
];

export function PropertyCategories() {
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Categories</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Explore By Category
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.title}
                to={category.link}
                className="group bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
