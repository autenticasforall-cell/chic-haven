import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';
import { storefrontApiRequest, GET_COLLECTION_PRODUCTS, GET_PRODUCTS, type ShopifyProduct } from '@/lib/shopify';

const CollectionPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (handle) {
          const data = await storefrontApiRequest(GET_COLLECTION_PRODUCTS, { handle, first: 24 });
          const collection = data?.data?.collection;
          if (collection) {
            setTitle(collection.title);
            setProducts(collection.products.edges);
          } else {
            // Fallback: search by tag
            const fallback = await storefrontApiRequest(GET_PRODUCTS, { first: 24, query: `tag:${handle}` });
            setTitle(handle.charAt(0).toUpperCase() + handle.slice(1));
            setProducts(fallback?.data?.products?.edges || []);
          }
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [handle]);

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="section-padding">
        <div className="editorial-container">
          {/* Breadcrumb */}
          <nav className="text-[11px] font-body text-muted-foreground mb-8 uppercase tracking-[1px]">
            <a href="/" className="hover:text-foreground">Home</a>
            <span className="mx-2">›</span>
            <span className="text-foreground">{title || handle}</span>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-[3px] font-light mb-10 text-center">
            {title || handle}
          </h1>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted mb-3" />
                  <div className="h-4 bg-muted w-3/4 mb-2" />
                  <div className="h-3 bg-muted w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-body">Nenhum produto encontrado nesta coleção.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </div>
  );
};

export default CollectionPage;
