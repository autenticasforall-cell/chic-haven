import { useFadeInOnScroll } from '@/hooks/useFadeIn';

const BrandStory = () => {
  const ref = useFadeInOnScroll();

  const stats = [
    { value: '4.9★', label: 'Avaliação média' },
    { value: '+2400', label: 'Clientes satisfeitas' },
    { value: '3x', label: 'Parcelamento sem juros' },
  ];

  return (
    <section ref={ref} className="fade-in-section section-padding">
      <div className="editorial-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Visual */}
          <div className="relative aspect-square bg-gradient-to-br from-accent/20 to-muted flex items-center justify-center overflow-hidden">
            <span className="font-display text-[120px] md:text-[160px] uppercase tracking-[10px] text-foreground/5 font-light select-none">
              MODA
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl">✨</span>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-[11px] uppercase tracking-[2px] text-accent font-body mb-4">
              Nossa História
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-light leading-tight mb-6">
              Moda autêntica para mulheres reais
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              A Autênticas para Todas nasceu da crença de que moda é para todas. Cada peça é
              cuidadosamente selecionada pensando em conforto, qualidade e estilo acessível.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
              Do P ao GG, acreditamos que cada mulher merece se sentir confiante e autêntica.
              Trabalhamos com tecidos de qualidade e modelagens que valorizam todos os corpos.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl md:text-3xl font-light">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground font-body mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
