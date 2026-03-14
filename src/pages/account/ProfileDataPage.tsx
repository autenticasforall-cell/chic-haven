import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ProfileDataPage = () => {
  const { profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    cpf: profile?.cpf || '',
    birth_date: profile?.birth_date || '',
    gender: profile?.gender || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Dados atualizados!');
    } catch {
      toast.error('Erro ao atualizar dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="text-[11px] uppercase tracking-[1px] font-body text-muted-foreground mb-1.5 block">
          Nome completo
        </label>
        <input
          type="text"
          value={form.full_name}
          onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
          className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body outline-none focus:border-accent transition-colors"
        />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-[1px] font-body text-muted-foreground mb-1.5 block">
          Telefone
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body outline-none focus:border-accent transition-colors"
        />
      </div>
      <div>
        <label className="text-[11px] uppercase tracking-[1px] font-body text-muted-foreground mb-1.5 block">
          CPF
        </label>
        <input
          type="text"
          value={form.cpf}
          onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))}
          className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body outline-none focus:border-accent transition-colors"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] uppercase tracking-[1px] font-body text-muted-foreground mb-1.5 block">
            Data de nascimento
          </label>
          <input
            type="date"
            value={form.birth_date}
            onChange={e => setForm(f => ({ ...f, birth_date: e.target.value }))}
            className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body outline-none focus:border-accent transition-colors"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-[1px] font-body text-muted-foreground mb-1.5 block">
            Gênero
          </label>
          <select
            value={form.gender}
            onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
            className="w-full border border-border bg-transparent px-4 py-3 text-sm font-body outline-none focus:border-accent transition-colors"
          >
            <option value="">Selecione</option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="outro">Outro</option>
            <option value="prefiro_nao_dizer">Prefiro não dizer</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-primary-foreground px-8 py-3 text-[12px] uppercase tracking-[1.5px] font-body hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Salvar
      </button>
    </form>
  );
};

export default ProfileDataPage;
