import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';
import { storefrontApiRequest, GET_PRODUCTS, type ShopifyProduct } from '@/lib/shopify';
import { Search, Loader2 } from 'lucide-react';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [input, setInput] = useState(query);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setProducts([]); return; }
    setLoading(true);
    try {
      const data = await storefrontApiRequest(GET_PRODUCTS, { first: 24, query: q });
      setProducts(data?.data?.products?.edges || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { if (query) search(query); }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: input });
  };

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="section-padding">
        <div className="editorial-container">
          <h1 className="font-display text-3xl text-center uppercase tracking-[3px] font-light mb-10">
            Buscar
          </h1>

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-12">
            <div className="flex border border-border">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="O que você procura?"
                className="flex-1 bg-transparent px-4 py-3 text-sm font-body outline-none"
              />
              <button type="submit" className="px-4 hover:text-accent transition-colors">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>
            </div>
          </form>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          ) : query && !loading ? (
            <p className="text-center text-muted-foreground font-body text-sm">
              Nenhum resultado para "{query}"
            </p>
          ) : null}
        </div>
      </main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </div>
  );
};

export default SearchPage;
