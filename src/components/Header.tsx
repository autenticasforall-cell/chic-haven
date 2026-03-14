import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const { openCart, totalQuantity } = useCartStore();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();
  const cartCount = totalQuantity();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-background transition-shadow duration-400 ${
        scrolled ? 'shadow-[0_2px_20px_rgba(0,0,0,0.06)]' : ''
      }`}
      style={{ height: '62px', borderBottom: '1px solid hsl(var(--border))' }}
    >
      <div className="editorial-container h-full flex items-center justify-between">
        {/* Mobile menu */}
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Nav links - desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] uppercase tracking-[1px] font-body">
          <Link to="/colecoes/novidades" className="hover:text-accent transition-colors duration-300">
            Novidades
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-accent transition-colors duration-300">
              Coleções <ChevronDown className="w-3 h-3" />
            </button>
            {collectionsOpen && (
              <div className="absolute top-full left-0 bg-background border border-border shadow-lg py-4 px-6 min-w-[200px] animate-fade-in-up">
                <Link to="/colecoes/vestidos" className="block py-2 text-[12px] hover:text-accent transition-colors">Vestidos</Link>
                <Link to="/colecoes/blusas" className="block py-2 text-[12px] hover:text-accent transition-colors">Blusas</Link>
                <Link to="/colecoes/saias" className="block py-2 text-[12px] hover:text-accent transition-colors">Saias</Link>
                <Link to="/colecoes/calcas" className="block py-2 text-[12px] hover:text-accent transition-colors">Calças</Link>
                <Link to="/colecoes/acessorios" className="block py-2 text-[12px] hover:text-accent transition-colors">Acessórios</Link>
                <div className="border-t border-border mt-2 pt-2">
                  <Link to="/colecoes" className="block py-2 text-[12px] font-medium hover:text-accent transition-colors">
                    Ver todas →
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link to="/colecoes/sale" className="hover:text-accent transition-colors duration-300">
            Sale
          </Link>
          <Link to="/sobre" className="hover:text-accent transition-colors duration-300">
            Sobre
          </Link>
        </nav>

        {/* Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-display text-xl md:text-2xl uppercase tracking-[3px] font-light">
          <span>AUTÊNTICAS</span> <span className="italic">para todas</span>
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <Link to="/busca" className="hover:text-accent transition-colors duration-300">
            <Search className="w-[18px] h-[18px]" />
          </Link>
          <Link to={user ? "/conta/wishlist" : "/auth/login"} className="relative hover:text-accent transition-colors duration-300">
            <Heart className="w-[18px] h-[18px]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button onClick={openCart} className="relative hover:text-accent transition-colors duration-300">
            <ShoppingBag className="w-[18px] h-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </button>
          <Link to={user ? "/conta" : "/auth/login"} className="hover:text-accent transition-colors duration-300">
            <User className="w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-[62px] left-0 right-0 bg-background border-b border-border py-6 px-6 animate-fade-in-up z-50">
          <nav className="flex flex-col gap-4 text-[13px] uppercase tracking-[1px] font-body">
            <Link to="/colecoes/novidades" onClick={() => setMobileOpen(false)}>Novidades</Link>
            <Link to="/colecoes" onClick={() => setMobileOpen(false)}>Coleções</Link>
            <Link to="/colecoes/sale" onClick={() => setMobileOpen(false)}>Sale</Link>
            <Link to="/sobre" onClick={() => setMobileOpen(false)}>Sobre</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
