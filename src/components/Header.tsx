import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'Novidades', href: '/colecoes/novidades' },
  { label: 'Conjuntos', href: '/colecoes/conjuntos' },
  { label: 'Vestidos', href: '/colecoes/vestidos' },
  { label: 'Blusas', href: '/colecoes/blusas' },
  { label: 'Ofertas', href: '/colecoes/ofertas' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, totalQuantity } = useCartStore();
  const { user } = useAuth();
  const cartCount = totalQuantity();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b border-secondary ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-soft'
          : 'bg-background'
      }`}
    >
      <div className="editorial-container h-16 flex items-center justify-between">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-baseline gap-1.5 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <span className="font-display text-xl md:text-2xl font-bold text-primary tracking-wide">
            Autênticas
          </span>
          <span className="font-body text-xs md:text-sm text-muted-foreground font-normal">
            para todas
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="relative text-[13px] font-body font-medium text-foreground/80 hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          <Link
            to="/busca"
            className="p-2 text-foreground/70 hover:text-primary transition-colors duration-300"
            aria-label="Buscar"
          >
            <Search className="w-[18px] h-[18px]" />
          </Link>
          <Link
            to={user ? '/conta' : '/auth/login'}
            className="p-2 text-foreground/70 hover:text-primary transition-colors duration-300"
            aria-label="Minha conta"
          >
            <User className="w-[18px] h-[18px]" />
          </Link>
          <button
            onClick={openCart}
            className="relative p-2 text-foreground/70 hover:text-primary transition-colors duration-300"
            aria-label="Carrinho"
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-background z-50 lg:hidden shadow-medium animate-slide-in-left">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-baseline gap-1.5" onClick={() => setMobileOpen(false)}>
                  <span className="font-display text-xl font-bold text-primary">Autênticas</span>
                  <span className="font-body text-xs text-muted-foreground">para todas</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-1 text-foreground/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-3 px-2 text-[15px] font-body font-medium text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
