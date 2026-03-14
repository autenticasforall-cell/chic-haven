import { useState, useEffect } from 'react';
import { useFadeInOnScroll } from '@/hooks/useFadeIn';
import { storefrontApiRequest, GET_PRODUCTS, type ShopifyProduct } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';

const tabs = [
  { label: 'Mais Vendidos', query: '' },
  { label: 'Lançamentos', query: 'tag:novo' },
  { label: 'Promoções', query: 'tag:sale' },
];

const ProductsSection = () => {
  const ref = useFadeInOnScroll();
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const variables: { first: number; query?: string } = { first: 8 };
        if (tabs[activeTab].query) variables.query = tabs[activeTab].query;
        const data = await storefrontApiRequest(GET_PRODUCTS, variables);
        setProducts(data?.data?.products?.edges || []);
      } catch (error) {
        if (import.meta.env.DEV) console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  return (
    <section ref={ref} className="fade-in-section section-padding">
      <div className="editorial-container">
        <h2 className="font-display text-2xl md:text-3xl text-center uppercase tracking-[3px] font-light mb-8">
          Nossas Escolhas
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-10">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`text-[12px] uppercase tracking-[1px] font-body pb-2 border-b-2 transition-all duration-300 ${
                i === activeTab
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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
            <p className="text-muted-foreground font-body text-sm">
              Nenhum produto encontrado. Novidades em breve! 🛍️
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
