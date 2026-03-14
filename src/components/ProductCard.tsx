import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ShopifyProduct, formatPrice, getInstallments } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: ShopifyProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { node } = product;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const { addItem, isLoading, openCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(node.id);
  const image = node.images.edges[0]?.node;
  const secondImage = node.images.edges[1]?.node;
  const price = node.priceRange.minVariantPrice;
  const comparePrice = node.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = comparePrice && parseFloat(comparePrice.amount) > parseFloat(price.amount);
  const discountPercent = hasDiscount
    ? Math.round((1 - parseFloat(price.amount) / parseFloat(comparePrice!.amount)) * 100)
    : 0;

  // Size options
  const sizeOption = node.options?.find(o => o.name.toLowerCase() === 'tamanho' || o.name.toLowerCase() === 'size');
  const sizes = sizeOption?.values || [];

  const getVariantForSize = (size: string) => {
    return node.variants.edges.find(v =>
      v.node.selectedOptions.some(o => (o.name.toLowerCase() === 'tamanho' || o.name.toLowerCase() === 'size') && o.value === size)
    )?.node;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sizes.length > 0 && !selectedSize) {
      setShaking(true);
      setTimeout(() => setShaking(false), 300);
      return;
    }

    const variant = selectedSize
      ? getVariantForSize(selectedSize)
      : node.variants.edges[0]?.node;

    if (!variant) return;

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });

    toast.success('Adicionado à sacola!', {
      description: node.title,
      position: 'top-center',
    });
    openCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(node.id);
    } else {
      addToWishlist({
        shopify_product_id: node.id,
        product_title: node.title,
        product_image: image?.url,
        product_price: parseFloat(price.amount),
      });
    }
  };

  // Badge logic
  const isNew = node.tags?.includes('novo') || node.tags?.includes('new');
  const isLowStock = node.variants.edges.some(v => v.node.quantityAvailable !== undefined && v.node.quantityAvailable > 0 && v.node.quantityAvailable <= 3);

  return (
    <Link to={`/produtos/${node.handle}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-3">
        {image && (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        {secondImage && (
          <img
            src={secondImage.url}
            alt={secondImage.altText || node.title}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && (
            <span className="bg-success text-success-foreground text-[9px] uppercase tracking-[1px] px-2 py-1 font-body font-medium">
              Novo
            </span>
          )}
          {hasDiscount && (
            <span className="bg-destructive text-destructive-foreground text-[9px] uppercase tracking-[1px] px-2 py-1 font-body font-medium">
              {discountPercent}% OFF
            </span>
          )}
          {isLowStock && !isNew && !hasDiscount && (
            <span className="bg-warning text-warning-foreground text-[9px] uppercase tracking-[1px] px-2 py-1 font-body font-medium">
              Últimas peças
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-accent text-accent' : 'text-foreground'}`}
          />
        </button>

        {/* Add to cart button - appears on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2.5 text-[11px] uppercase tracking-[1.5px] font-body hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Adicionando...' : 'Adicionar ao carrinho'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <h3 className="font-body text-sm font-medium leading-tight line-clamp-1">{node.title}</h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-body text-sm font-semibold">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {hasDiscount && (
            <span className="font-body text-xs text-muted-foreground line-through">
              {formatPrice(comparePrice!.amount, comparePrice!.currencyCode)}
            </span>
          )}
        </div>

        {/* Installments */}
        <p className="text-[11px] text-muted-foreground font-body">
          {getInstallments(price.amount)}
        </p>

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className={`flex gap-1.5 mt-2 ${shaking ? 'animate-shake' : ''}`}>
            {sizes.map((size) => {
              const variant = getVariantForSize(size);
              const available = variant?.availableForSale !== false;
              return (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (available) setSelectedSize(size === selectedSize ? null : size);
                  }}
                  disabled={!available}
                  className={`w-8 h-8 text-[10px] font-body border transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-primary text-primary-foreground border-primary'
                      : available
                        ? 'border-border hover:border-foreground'
                        : 'border-border text-muted-foreground line-through opacity-40 cursor-not-allowed'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
