import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { PropertyCategories } from '@/components/home/PropertyCategories';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { FAQ } from '@/components/home/FAQ';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PropertyCategories />
      <FeaturedProperties />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <CTASection />
    </Layout>
  );
};

export default Index;
