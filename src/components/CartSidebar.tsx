import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ExternalLink, Loader2, Tag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/shopify';
import { toast } from 'sonner';

const CartSidebar = () => {
  const {
    items, isLoading, isSyncing, isOpen,
    updateQuantity, removeItem, getCheckoutUrl,
    closeCart, syncCart, applyDiscount,
    totalPrice, totalQuantity,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, '_blank');
      closeCart();
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    const applied = await applyDiscount(couponCode.trim());
    if (applied) {
      toast.success('Cupom aplicado com sucesso!');
    } else {
      toast.error('Cupom inválido ou expirado');
    }
    setApplyingCoupon(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/40 z-50" onClick={closeCart} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-background z-50 flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-display text-xl uppercase tracking-[2px]">
            Sacola ({totalQuantity()})
          </h2>
          <button onClick={closeCart} className="text-muted-foreground hover:text-foreground transition-colors text-2xl">
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground font-body text-sm mb-4">Sua sacola está vazia</p>
              <button
                onClick={closeCart}
                className="text-[12px] uppercase tracking-[1px] border-b border-foreground pb-0.5 hover:text-accent hover:border-accent transition-colors"
              >
                Explorar produtos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 py-3 border-b border-border">
                  <div className="w-20 h-24 bg-muted overflow-hidden flex-shrink-0">
                    {item.product.node.images?.edges?.[0]?.node && (
                      <img
                        src={item.product.node.images.edges[0].node.url}
                        alt={item.product.node.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-sm font-medium truncate">{item.product.node.title}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {item.selectedOptions.map(o => o.value).join(' · ')}
                    </p>
                    <p className="font-body text-sm font-semibold mt-1">
                      {formatPrice(item.price.amount, item.price.currencyCode)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-6 h-6 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-6 h-6 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            {/* Coupon */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center border border-border px-3">
                <Tag className="w-3.5 h-3.5 text-muted-foreground mr-2" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Cupom de desconto"
                  className="bg-transparent text-[12px] font-body w-full py-2 outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button
                onClick={handleApplyCoupon}
                disabled={applyingCoupon}
                className="bg-foreground text-background px-4 py-2 text-[11px] uppercase tracking-[1px] hover:bg-accent transition-colors disabled:opacity-50"
              >
                {applyingCoupon ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Aplicar'}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-display text-lg">Subtotal</span>
              <span className="font-body font-semibold text-lg">
                {formatPrice(String(totalPrice()))}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading || isSyncing}
              className="w-full bg-primary text-primary-foreground py-3.5 text-[12px] uppercase tracking-[1.5px] font-body hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading || isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Finalizar Compra
                </>
              )}
            </button>

            <p className="text-[10px] text-muted-foreground text-center">
              Frete e impostos calculados no checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
