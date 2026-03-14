import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface WishlistItem {
  shopify_product_id: string;
  shopify_variant_id?: string;
  product_title?: string;
  product_image?: string;
  product_price?: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const LOCAL_KEY = 'autenticas-wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage or Supabase
  const loadWishlist = useCallback(async () => {
    if (user) {
      setIsLoading(true);
      const { data } = await supabase
        .from('wishlists')
        .select('shopify_product_id, shopify_variant_id, product_title, product_image, product_price')
        .eq('user_id', user.id);
      if (data) setItems(data as WishlistItem[]);
      setIsLoading(false);
    } else {
      const stored = localStorage.getItem(LOCAL_KEY);
      if (stored) setItems(JSON.parse(stored));
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Sync local wishlist to Supabase on login
  useEffect(() => {
    if (user) {
      const local = localStorage.getItem(LOCAL_KEY);
      if (local) {
        const localItems: WishlistItem[] = JSON.parse(local);
        if (localItems.length > 0) {
          const inserts = localItems.map(item => ({
            user_id: user.id,
            ...item,
          }));
          supabase.from('wishlists').upsert(inserts, { onConflict: 'user_id,shopify_product_id' }).then(() => {
            localStorage.removeItem(LOCAL_KEY);
            loadWishlist();
          });
        }
      }
    }
  }, [user, loadWishlist]);

  const addToWishlist = async (item: WishlistItem) => {
    if (user) {
      await supabase.from('wishlists').insert({ user_id: user.id, ...item });
      setItems(prev => [...prev, item]);
    } else {
      const updated = [...items, item];
      setItems(updated);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (user) {
      await supabase.from('wishlists').delete().eq('user_id', user.id).eq('shopify_product_id', productId);
    }
    const updated = items.filter(i => i.shopify_product_id !== productId);
    setItems(updated);
    if (!user) localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  };

  const isInWishlist = (productId: string) => items.some(i => i.shopify_product_id === productId);

  return (
    <WishlistContext.Provider value={{ items, isLoading, addToWishlist, removeFromWishlist, isInWishlist, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
