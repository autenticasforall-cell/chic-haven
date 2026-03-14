import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

const WhatsAppButton = () => {
  const [showLabel, setShowLabel] = useState(false);

  return (
    <a
      href="https://wa.me/5561983139769?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20ajuda%20%F0%9F%9B%8D%EF%B8%8F"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      {showLabel && (
        <span className="bg-foreground text-background text-[12px] font-body px-3 py-2 rounded-sm shadow-lg animate-fade-in-up whitespace-nowrap">
          Falar com a gente
        </span>
      )}
      <div className="w-14 h-14 bg-whatsapp rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
        <MessageCircle className="w-6 h-6 text-accent-foreground" />
      </div>
    </a>
  );
};

export default WhatsAppButton;
