import { useState, useEffect } from 'react';

const messages = [
  '🌸 Frete grátis acima de R$199 para todo o Brasil',
  '💳 Parcele em até 6x sem juros',
  '✨ Nova coleção disponível — confira os lançamentos',
];

const AnnouncementBar = () => {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary py-2.5 overflow-hidden">
      <p
        className={`text-primary-foreground text-center text-[11px] uppercase tracking-[1.5px] font-body font-medium transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        {messages[current]}
      </p>
    </div>
  );
};

export default AnnouncementBar;
