import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Package, MapPin, Heart, User, LogOut } from 'lucide-react';

const AccountLayout = () => {
  const { user, profile, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate(`/auth/login?returnUrl=${encodeURIComponent(location.pathname)}`);
    }
  }, [user, isLoading, navigate, location.pathname]);

  if (isLoading || !user) return null;

  const navItems = [
    { path: '/conta/pedidos', label: 'Meus Pedidos', icon: Package },
    { path: '/conta/enderecos', label: 'Endereços', icon: MapPin },
    { path: '/conta/wishlist', label: 'Lista de Desejos', icon: Heart },
    { path: '/conta/dados', label: 'Meus Dados', icon: User },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="section-padding">
        <div className="editorial-container">
          <h1 className="font-display text-3xl text-center uppercase tracking-[3px] font-light mb-4">
            Minha Conta
          </h1>
          <p className="text-center text-muted-foreground font-body text-sm mb-10">
            Olá, {profile?.full_name || user.email} 👋
          </p>

          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-12">
            {/* Sidebar */}
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-body uppercase tracking-[1px] whitespace-nowrap transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-body uppercase tracking-[1px] text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </nav>

            {/* Content */}
            <div>
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </div>
  );
};

export default AccountLayout;
