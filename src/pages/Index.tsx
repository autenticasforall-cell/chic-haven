import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import HeroCarousel from '@/components/home/HeroCarousel';
import TrustStrip from '@/components/home/TrustStrip';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductsSection from '@/components/home/ProductsSection';
import UrgencyBanner from '@/components/home/UrgencyBanner';
import BrandStory from '@/components/home/BrandStory';
import ReviewsSection from '@/components/home/ReviewsSection';
import InstagramStrip from '@/components/home/InstagramStrip';
import NewsletterSection from '@/components/home/NewsletterSection';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <main>
        <HeroCarousel />
        <TrustStrip />
        <CategoryGrid />
        <ProductsSection />
        <UrgencyBanner />
        <BrandStory />
        <ReviewsSection />
        <InstagramStrip />
        <NewsletterSection />
      </main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
