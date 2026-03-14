import { useState } from 'react';
import { useFadeInOnScroll } from '@/hooks/useFadeIn';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const NewsletterSection = () => {
  const ref = useFadeInOnScroll();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Insira um email válido');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({ email: email.trim() });
      if (error) {
        if (error.code === '23505') {
          toast.info('Este email já está cadastrado!');
        } else {
          throw error;
        }
      } else {
        toast.success('Inscrita com sucesso! 🎉');
        setEmail('');
      }
    } catch {
      toast.error('Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} className="fade-in-section bg-gradient-to-br from-primary to-foreground py-16 md:py-20">
      <div className="editorial-container text-center">
        <h2 className="font-display text-3xl md:text-4xl text-primary-foreground uppercase tracking-[3px] font-light mb-4">
          Fique por dentro
        </h2>
        <p className="font-body text-sm text-primary-foreground/60 mb-8 max-w-md mx-auto">
          Receba novidades, promoções exclusivas e dicas de estilo diretamente no seu email.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu melhor email"
            className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 px-4 py-3 text-[13px] font-body text-primary-foreground placeholder:text-primary-foreground/40 outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-accent-foreground px-7 py-3 text-[11px] uppercase tracking-[1.5px] font-body hover:bg-accent/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            Quero Receber
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
