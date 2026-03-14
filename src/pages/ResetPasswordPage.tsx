import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Senha atualizada com sucesso!');
      navigate('/');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="section-padding">
        <div className="max-w-md mx-auto px-4">
          <h1 className="font-display text-3xl text-center uppercase tracking-[3px] font-light mb-10">
            Nova Senha
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nova senha"
              required
              minLength={6}
              className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body outline-none focus:border-accent transition-colors"
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirmar nova senha"
              required
              minLength={6}
              className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 text-[12px] uppercase tracking-[1.5px] font-body hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Atualizar senha
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
