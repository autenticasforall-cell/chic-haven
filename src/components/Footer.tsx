import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="editorial-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-lg uppercase tracking-[3px] font-light mb-4">
              AUTÊNTICAS <span className="italic">para todas</span>
            </h3>
            <p className="text-[13px] font-body opacity-70 leading-relaxed mb-6">
              Moda feminina autêntica para mulheres reais. Do P ao GG, com estilo e conforto para todas.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/autenticasparatodas/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://wa.me/5561983139769?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20ajuda%20%F0%9F%9B%8D%EF%B8%8F" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-body text-[12px] uppercase tracking-[1.5px] font-medium mb-5">Categorias</h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/colecoes/vestidos" className="text-[13px] font-body opacity-70 hover:opacity-100 transition-opacity">Vestidos</Link>
              <Link to="/colecoes/blusas" className="text-[13px] font-body opacity-70 hover:opacity-100 transition-opacity">Blusas</Link>
              <Link to="/colecoes/saias" className="text-[13px] font-body opacity-70 hover:opacity-100 transition-opacity">Saias</Link>
              <Link to="/colecoes/calcas" className="text-[13px] font-body opacity-70 hover:opacity-100 transition-opacity">Calças</Link>
              <Link to="/colecoes/acessorios" className="text-[13px] font-body opacity-70 hover:opacity-100 transition-opacity">Acessórios</Link>
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-body text-[12px] uppercase tracking-[1.5px] font-medium mb-5">Informações</h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/sobre" className="text-[13px] font-body opacity-70 hover:opacity-100 transition-opacity">Sobre nós</Link>
              <Link to="/trocas" className="text-[13px] font-body opacity-70 hover:opacity-100 transition-opacity">Trocas e devoluções</Link>
              <Link to="/faq" className="text-[13px] font-body opacity-70 hover:opacity-100 transition-opacity">Perguntas frequentes</Link>
              <Link to="/privacidade" className="text-[13px] font-body opacity-70 hover:opacity-100 transition-opacity">Política de privacidade</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-[12px] uppercase tracking-[1.5px] font-medium mb-5">Atendimento</h4>
            <div className="space-y-3 text-[13px] font-body opacity-70">
              <a href="mailto:contato@autenticasparatodas.com.br" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <Mail className="w-4 h-4" /> contato@autenticasparatodas.com.br
              </a>
              <a href="https://wa.me/5561983139769" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
                <MessageCircle className="w-4 h-4" /> (61) 98313-9769
              </a>
              <p>Seg a Sex: 9h às 18h</p>
              <p>Sáb: 9h às 13h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="editorial-container py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-body opacity-50">
            © {new Date().getFullYear()} Autênticas para todas. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3 text-[11px] font-body opacity-50">
            {/* Payment icons as text for now */}
            <span>Visa</span>
            <span>·</span>
            <span>Mastercard</span>
            <span>·</span>
            <span>Pix</span>
            <span>·</span>
            <span>Boleto</span>
            <span>·</span>
            <span>Amex</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
