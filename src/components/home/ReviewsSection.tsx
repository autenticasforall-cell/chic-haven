import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useFadeInOnScroll } from '@/hooks/useFadeIn';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  rating: number;
  body: string;
  title: string;
  user_name?: string;
  city?: string;
}

const fallbackReviews: Review[] = [
  { id: '1', rating: 5, body: 'Amei o vestido! Caimento perfeito e tecido de ótima qualidade. Já é minha loja favorita!', title: '', user_name: 'Maria Clara', city: 'Asa Norte' },
  { id: '2', rating: 5, body: 'Comprei 3 peças e todas vieram impecáveis. Entrega super rápida em Brasília!', title: '', user_name: 'Ana Paula', city: 'Lago Sul' },
  { id: '3', rating: 5, body: 'Finalmente uma loja que tem tamanhos reais! Do P ao GG com muito estilo.', title: '', user_name: 'Juliana Santos', city: 'Águas Claras' },
];

const ReviewsSection = () => {
  const ref = useFadeInOnScroll();
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('id, rating, body, title')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(6);

      if (data && data.length > 0) {
        setReviews(data);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section ref={ref} className="fade-in-section section-padding bg-muted">
      <div className="editorial-container">
        <h2 className="font-display text-2xl md:text-3xl text-center uppercase tracking-[3px] font-light mb-12">
          O que nossas clientes dizem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="bg-background p-8">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="font-display text-lg italic leading-relaxed mb-6">
                "{review.body}"
              </p>
              <p className="font-body text-[12px] text-muted-foreground">
                — {review.user_name || 'Cliente'}{review.city ? `, ${review.city}` : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
