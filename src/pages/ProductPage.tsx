import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { storefrontApiRequest, GET_PRODUCT_BY_HANDLE, formatPrice, getInstallments, type ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useWishlist } from '@/contexts/WishlistContext';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const { addItem, isLoading: cartLoading, openCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await storefrontApiRequest(GET_PRODUCT_BY_HANDLE, { handle });
        const p = data?.data?.product;
        if (p) {
          setProduct(p);
          // Set default options
          const defaults: Record<string, string> = {};
          p.options?.forEach((opt: { name: string; values: string[] }) => {
            defaults[opt.name] = opt.values[0];
          });
          setSelectedOptions(defaults);
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [handle]);

  const getSelectedVariant = () => {
    if (!product) return null;
    return product.variants.edges.find(v =>
      v.node.selectedOptions.every(
        o => selectedOptions[o.name] === o.value
      )
    )?.node;
  };

  const selectedVariant = getSelectedVariant();
  const inWishlist = product ? isInWishlist(product.id) : false;

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;

    await addItem({
      product: { node: product } as ShopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success('Adicionado à sacola!', { position: 'top-center' });
    openCart();
  };

  const handleWishlist = () => {
    if (!product) return;
    const image = product.images.edges[0]?.node;
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        shopify_product_id: product.id,
        product_title: product.title,
        product_image: image?.url,
        product_price: parseFloat(product.priceRange.minVariantPrice.amount),
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <AnnouncementBar />
        <Header />
        <div className="editorial-container section-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="aspect-[3/4] bg-muted animate-pulse" />
            <div className="space-y-4">
              <div className="h-6 bg-muted w-3/4 animate-pulse" />
              <div className="h-4 bg-muted w-1/2 animate-pulse" />
              <div className="h-20 bg-muted animate-pulse" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <AnnouncementBar />
        <Header />
        <div className="editorial-container section-padding text-center">
          <p className="text-muted-foreground">Produto não encontrado.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const comparePrice = selectedVariant?.compareAtPrice;
  const hasDiscount = comparePrice && parseFloat(comparePrice.amount) > parseFloat(price.amount);

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
            <a href="/colecoes" className="hover:text-foreground">Coleções</a>
            <span className="mx-2">›</span>
            <span className="text-foreground">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Images */}
            <div>
              <div className="aspect-[3/4] bg-muted overflow-hidden mb-3">
                {product.images.edges[selectedImage] && (
                  <img
                    src={product.images.edges[selectedImage].node.url}
                    alt={product.images.edges[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {product.images.edges.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.edges.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`aspect-[3/4] bg-muted overflow-hidden border-2 transition-colors ${
                        i === selectedImage ? 'border-foreground' : 'border-transparent'
                      }`}
                    >
                      <img src={img.node.url} alt={img.node.altText || ''} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-6">
              <h1 className="font-display text-3xl md:text-4xl font-light">{product.title}</h1>

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-body text-2xl font-semibold">
                    {formatPrice(price.amount, price.currencyCode)}
                  </span>
                  {hasDiscount && (
                    <span className="font-body text-lg text-muted-foreground line-through">
                      {formatPrice(comparePrice!.amount, comparePrice!.currencyCode)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-body mt-1">
                  {getInstallments(price.amount)}
                </p>
              </div>

              {/* Options */}
              {product.options?.map((option) => (
                <div key={option.id}>
                  <p className="font-body text-[12px] uppercase tracking-[1px] mb-3">
                    {option.name}: <span className="font-medium">{selectedOptions[option.name]}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const isSelected = selectedOptions[option.name] === value;
                      return (
                        <button
                          key={value}
                          onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                          className={`px-4 py-2.5 text-[12px] font-body border transition-all duration-200 ${
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border hover:border-foreground'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || !selectedVariant?.availableForSale}
                  className="flex-1 bg-primary text-primary-foreground py-4 text-[12px] uppercase tracking-[1.5px] font-body hover:bg-accent hover:text-accent-foreground transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cartLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {selectedVariant?.availableForSale === false ? 'Esgotado' : 'Adicionar ao carrinho'}
                </button>
                <button
                  onClick={handleWishlist}
                  className="w-14 border border-border flex items-center justify-center hover:border-foreground transition-colors"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-accent text-accent' : ''}`} />
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-6 border-t border-border">
                  <h3 className="font-body text-[12px] uppercase tracking-[1px] mb-3">Descrição</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </div>
  );
};

export default ProductPage;
