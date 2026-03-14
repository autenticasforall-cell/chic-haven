import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import CollectionPage from "./pages/CollectionPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import AuthCallback from "./pages/AuthCallback";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SearchPage from "./pages/SearchPage";
import AccountLayout from "./pages/account/AccountLayout";
import OrdersPage from "./pages/account/OrdersPage";
import AddressesPage from "./pages/account/AddressesPage";
import WishlistPage from "./pages/account/WishlistPage";
import ProfileDataPage from "./pages/account/ProfileDataPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function CartSyncWrapper({ children }: { children: React.ReactNode }) {
  useCartSync();
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <WishlistProvider>
            <CartSyncWrapper>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/colecoes/:handle" element={<CollectionPage />} />
                <Route path="/colecoes" element={<CollectionPage />} />
                <Route path="/produtos/:handle" element={<ProductPage />} />
                <Route path="/busca" element={<SearchPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/cadastro" element={<LoginPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
                <Route path="/conta" element={<AccountLayout />}>
                  <Route index element={<OrdersPage />} />
                  <Route path="pedidos" element={<OrdersPage />} />
                  <Route path="enderecos" element={<AddressesPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="dados" element={<ProfileDataPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartSyncWrapper>
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
