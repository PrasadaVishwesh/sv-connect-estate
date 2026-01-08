import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/PageTransition';
import { HeroSection } from '@/components/home/HeroSection';
import { PropertyCategories } from '@/components/home/PropertyCategories';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { Testimonials } from '@/components/home/Testimonials';
import { FAQ } from '@/components/home/FAQ';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <PageTransition>
      <Layout>
        <HeroSection />
        <PropertyCategories />
        <FeaturedProperties />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <CTASection />
      </Layout>
    </PageTransition>
  );
};

export default Index;
