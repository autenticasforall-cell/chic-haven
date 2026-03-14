import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    eyebrow: 'COLEÇÃO OUTONO/INVERNO',
    title: 'Autenticidade que veste bem',
    subtitle: 'Peças exclusivas para mulheres que valorizam conforto e estilo. Do P ao GG.',
    cta1: { label: 'COMPRAR AGORA', link: '/colecoes/novidades' },
    cta2: { label: 'VER LOOKBOOK', link: '/colecoes' },
  },
  {
    eyebrow: 'NOVIDADES',
    title: 'Cada peça, uma história',
    subtitle: 'Descubra nossa nova coleção com tecidos premium e caimento impecável.',
    cta1: { label: 'EXPLORAR', link: '/colecoes/novidades' },
    cta2: { label: 'VER COLEÇÕES', link: '/colecoes' },
  },
  {
    eyebrow: 'SALE',
    title: 'Até 50% off em peças selecionadas',
    subtitle: 'Aproveite condições especiais nas suas peças favoritas.',
    cta1: { label: 'VER OFERTAS', link: '/colecoes/sale' },
    cta2: { label: 'NOVIDADES', link: '/colecoes/novidades' },
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <div
      className="relative w-full overflow-hidden bg-muted"
      style={{ aspectRatio: '16/7' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex items-center transition-all duration-700 ${
            i === current ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <div className="editorial-container relative z-10 flex items-center h-full">
            <div className="max-w-lg">
              <p className="text-[11px] uppercase tracking-[2px] text-muted-foreground font-body mb-4">
                {slide.eyebrow}
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] mb-4">
                {slide.title}
              </h1>
              <p className="font-body text-sm text-muted-foreground mb-8 max-w-md">
                {slide.subtitle}
              </p>
              <div className="flex gap-3">
                <Link
                  to={slide.cta1.link}
                  className="bg-primary text-primary-foreground px-7 py-3 text-[11px] uppercase tracking-[1.5px] font-body hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  {slide.cta1.label}
                </Link>
                <Link
                  to={slide.cta2.link}
                  className="border border-foreground px-7 py-3 text-[11px] uppercase tracking-[1.5px] font-body hover:bg-foreground hover:text-background transition-all duration-300"
                >
                  {slide.cta2.label}
                </Link>
              </div>
            </div>
          </div>
          {/* Placeholder for hero image */}
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-muted/50 to-transparent hidden md:block">
            {/* <!-- SUBSTITUIR: foto real de modelo com look da coleção --> */}
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-20">👗</span>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={() => setCurrent(c => (c - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-background transition-colors z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-background transition-colors z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-foreground w-6' : 'bg-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
