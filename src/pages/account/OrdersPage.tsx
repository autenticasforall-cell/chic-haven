import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/shopify';

interface Order {
  id: string;
  shopify_order_number: string;
  total_price: number;
  financial_status: string;
  fulfillment_status: string;
  created_at: string;
  line_items: unknown;
}

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('orders_cache')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setOrders(data as Order[]);
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) return <div className="animate-pulse"><div className="h-20 bg-muted mb-4" /><div className="h-20 bg-muted" /></div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground font-body text-sm">Nenhum pedido encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="border border-border p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-body text-sm font-medium">Pedido #{order.shopify_order_number}</p>
              <p className="text-[11px] text-muted-foreground font-body">
                {new Date(order.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-body text-sm font-semibold">{formatPrice(String(order.total_price))}</p>
              <p className="text-[10px] uppercase tracking-[1px] text-muted-foreground font-body">
                {order.fulfillment_status || 'Processando'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
