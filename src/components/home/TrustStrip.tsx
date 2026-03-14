import { Truck, Star, Tag, RefreshCw } from 'lucide-react';
import { useFadeInOnScroll } from '@/hooks/useFadeIn';

const items = [
  { icon: Truck, title: 'ENTREGA RÁPIDA', subtitle: 'Brasília em 24h' },
  { icon: Star, title: 'AVALIAÇÃO 4.9★', subtitle: '+2.400 clientes' },
  { icon: Tag, title: 'MENOR PREÇO', subtitle: 'Garantia de preço' },
  { icon: RefreshCw, title: 'TROCA FÁCIL', subtitle: '30 dias sem custo' },
];

const TrustStrip = () => {
  const ref = useFadeInOnScroll();

  return (
    <div ref={ref} className="fade-in-section bg-primary">
      <div className="editorial-container py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3 justify-center py-2">
              <item.icon className="w-5 h-5 text-primary-foreground/70 flex-shrink-0" />
              <div>
                <p className="text-[11px] uppercase tracking-[1px] text-primary-foreground font-body font-medium">
                  {item.title}
                </p>
                <p className="text-[10px] text-primary-foreground/60 font-body">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
