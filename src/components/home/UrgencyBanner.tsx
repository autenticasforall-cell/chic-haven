import { useState, useEffect } from 'react';
import { useFadeInOnScroll } from '@/hooks/useFadeIn';
import { Link } from 'react-router-dom';

const UrgencyBanner = () => {
  const ref = useFadeInOnScroll();
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const getTimeToMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      return {
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      };
    };

    setTimeLeft(getTimeToMidnight());
    const timer = setInterval(() => setTimeLeft(getTimeToMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={ref} className="fade-in-section bg-accent">
      <div className="editorial-container py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h3 className="font-display text-xl md:text-2xl text-accent-foreground uppercase tracking-[2px] font-light">
              Oferta do Dia
            </h3>
            <p className="text-[12px] text-accent-foreground/80 font-body mt-1">
              Descontos exclusivos acabam à meia-noite
            </p>
          </div>

          <div className="flex gap-3">
            {[
              { value: timeLeft.hours, label: 'Horas' },
              { value: timeLeft.minutes, label: 'Min' },
              { value: timeLeft.seconds, label: 'Seg' },
            ].map((unit) => (
              <div key={unit.label} className="text-center">
                <div className="w-14 h-14 bg-accent-foreground/10 flex items-center justify-center">
                  <span className="font-display text-2xl text-accent-foreground">{unit.value}</span>
                </div>
                <span className="text-[9px] uppercase tracking-[1px] text-accent-foreground/60 font-body">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <Link
            to="/colecoes/sale"
            className="bg-accent-foreground text-accent px-7 py-3 text-[11px] uppercase tracking-[1.5px] font-body hover:bg-foreground transition-colors"
          >
            Ver Ofertas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UrgencyBanner;
