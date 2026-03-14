import { useFadeInOnScroll } from '@/hooks/useFadeIn';

const InstagramStrip = () => {
  const ref = useFadeInOnScroll();

  const placeholders = Array.from({ length: 6 }, (_, i) => i);

  return (
    <section ref={ref} className="fade-in-section bg-primary py-12">
      <div className="text-center mb-8">
        <p className="font-display text-2xl italic text-primary-foreground tracking-wide">
          @autenticasparatodas
        </p>
        <p className="text-[11px] text-primary-foreground/60 font-body uppercase tracking-[1.5px] mt-2">
          Siga-nos no Instagram
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6">
        {placeholders.map((i) => (
          <a
            key={i}
            href="https://www.instagram.com/autenticasparatodas/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square bg-primary-foreground/5 group overflow-hidden"
          >
            {/* <!-- SUBSTITUIR: foto real do Instagram --> */}
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl opacity-20">📸</span>
            </div>
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-primary-foreground text-sm font-body">♥ {Math.floor(Math.random() * 200 + 50)}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default InstagramStrip;
