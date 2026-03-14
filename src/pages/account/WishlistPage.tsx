import { useWishlist } from '@/contexts/WishlistContext';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/shopify';

const WishlistPage = () => {
  const { items, removeFromWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-body text-sm mb-4">Sua lista de desejos está vazia.</p>
        <Link
          to="/"
          className="text-[12px] uppercase tracking-[1px] font-body border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors"
        >
          Explorar produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.shopify_product_id} className="group">
          <div className="relative aspect-[3/4] bg-muted overflow-hidden mb-3">
            {item.product_image && (
              <img src={item.product_image} alt={item.product_title || ''} className="w-full h-full object-cover" />
            )}
            <button
              onClick={() => removeFromWishlist(item.shopify_product_id)}
              className="absolute top-2 right-2 w-8 h-8 bg-background/80 flex items-center justify-center hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          </div>
          <p className="font-body text-sm font-medium truncate">{item.product_title}</p>
          {item.product_price && (
            <p className="font-body text-sm text-muted-foreground">{formatPrice(String(item.product_price))}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default WishlistPage;
