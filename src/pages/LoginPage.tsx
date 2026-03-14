import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import Footer from '@/components/Footer';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Bem-vinda de volta!');
        navigate('/');
      } else {
        await signUp(email, password, name);
        toast.success('Cadastro realizado! Verifique seu email.');
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success('Email de recuperação enviado!');
      setShowReset(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar email');
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
            {showReset ? 'Recuperar Senha' : isLogin ? 'Entrar' : 'Criar Conta'}
          </h1>

          {showReset ? (
            <form onSubmit={handleReset} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email"
                required
                className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3.5 text-[12px] uppercase tracking-[1.5px] font-body hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Enviar link de recuperação
              </button>
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="w-full text-[12px] text-muted-foreground font-body hover:text-foreground transition-colors"
              >
                Voltar ao login
              </button>
            </form>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b border-border mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 pb-3 text-[12px] uppercase tracking-[1px] font-body border-b-2 transition-colors ${
                    isLogin ? 'border-foreground' : 'border-transparent text-muted-foreground'
                  }`}
                >
                  Entrar
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 pb-3 text-[12px] uppercase tracking-[1px] font-body border-b-2 transition-colors ${
                    !isLogin ? 'border-foreground' : 'border-transparent text-muted-foreground'
                  }`}
                >
                  Criar conta
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome completo"
                    required
                    className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body outline-none focus:border-accent transition-colors"
                  />
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body outline-none focus:border-accent transition-colors"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  required
                  minLength={6}
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body outline-none focus:border-accent transition-colors"
                />

                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowReset(true)}
                    className="text-[12px] text-muted-foreground font-body hover:text-foreground transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3.5 text-[12px] uppercase tracking-[1.5px] font-body hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLogin ? 'Entrar' : 'Criar conta'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
