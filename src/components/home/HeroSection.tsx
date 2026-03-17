import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-main.jpg';

const HeroSection = () => {
  return (
    <section className="relative h-[90vh] md:h-[90vh] min-h-[500px] flex items-center overflow-hidden">
      {/* Background image */}
      <img
        src={heroImage}
        alt="Mulher confiante usando roupa elegante e casual"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 editorial-container w-full">
        <div className="max-w-xl">
          {/* Badge */}
          <div
            className="inline-block bg-primary/20 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
          >
            <span className="text-primary-foreground text-[12px] font-body font-medium tracking-wide">
              ✨ Nova Coleção — Outono/Inverno 2025
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-4xl sm:text-5xl md:text-[64px] font-bold text-primary-foreground leading-[1.1] mb-5 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            Moda que celebra quem você é.
          </h1>

          {/* Subline */}
          <p
            className="font-body text-base md:text-lg text-primary-foreground/80 leading-relaxed mb-8 max-w-md opacity-0 animate-fade-in-up"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Peças pensadas para a mulher real. Estilo, conforto e personalidade em cada coleção.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-wrap gap-3 mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <Link
              to="/colecoes/novidades"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body font-semibold text-sm px-7 py-3.5 rounded-sm hover:bg-primary/90 transition-colors duration-300"
            >
              Ver Lançamentos →
            </Link>
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 border border-primary-foreground/40 text-primary-foreground font-body font-medium text-sm px-7 py-3.5 rounded-sm hover:bg-primary-foreground/10 backdrop-blur-sm transition-colors duration-300"
            >
              Nossa História
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="flex flex-wrap gap-5 text-primary-foreground/70 text-[13px] font-body opacity-0 animate-fade-in-up"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <span>⭐ +3.000 clientes satisfeitas</span>
            <span>🔒 Compra 100% segura</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
