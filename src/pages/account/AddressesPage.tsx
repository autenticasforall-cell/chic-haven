import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  recipient_name: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
}

const AddressesPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    recipient_name: '', street: '', number: '', complement: '',
    neighborhood: '', city: 'Brasília', state: 'DF', zip_code: '', label: 'Casa',
  });

  useEffect(() => {
    if (!user) return;
    supabase.from('addresses').select('*').eq('user_id', user.id).then(({ data }) => {
      if (data) setAddresses(data as Address[]);
      setLoading(false);
    });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('addresses').insert({ ...form, user_id: user.id });
    if (error) {
      toast.error('Erro ao salvar endereço');
    } else {
      toast.success('Endereço salvo!');
      setShowForm(false);
      // Refresh
      const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id);
      if (data) setAddresses(data as Address[]);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast.success('Endereço removido');
  };

  if (loading) return <div className="animate-pulse"><div className="h-20 bg-muted" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-body text-sm font-medium">{addresses.length} endereço(s)</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[12px] uppercase tracking-[1px] font-body hover:text-accent transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="border border-border p-5 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={form.recipient_name} onChange={e => setForm(f => ({ ...f, recipient_name: e.target.value }))} placeholder="Destinatário" required className="border border-border bg-transparent px-3 py-2.5 text-sm font-body outline-none" />
            <input value={form.zip_code} onChange={e => setForm(f => ({ ...f, zip_code: e.target.value }))} placeholder="CEP" required className="border border-border bg-transparent px-3 py-2.5 text-sm font-body outline-none" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} placeholder="Rua" required className="col-span-2 border border-border bg-transparent px-3 py-2.5 text-sm font-body outline-none" />
            <input value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} placeholder="Nº" required className="border border-border bg-transparent px-3 py-2.5 text-sm font-body outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.complement} onChange={e => setForm(f => ({ ...f, complement: e.target.value }))} placeholder="Complemento" className="border border-border bg-transparent px-3 py-2.5 text-sm font-body outline-none" />
            <input value={form.neighborhood} onChange={e => setForm(f => ({ ...f, neighborhood: e.target.value }))} placeholder="Bairro" required className="border border-border bg-transparent px-3 py-2.5 text-sm font-body outline-none" />
          </div>
          <button type="submit" disabled={saving} className="bg-primary text-primary-foreground px-6 py-2.5 text-[11px] uppercase tracking-[1px] font-body flex items-center gap-2 disabled:opacity-50">
            {saving && <Loader2 className="w-3 h-3 animate-spin" />} Salvar
          </button>
        </form>
      )}

      <div className="space-y-3">
        {addresses.map(addr => (
          <div key={addr.id} className="border border-border p-4 flex justify-between items-start">
            <div>
              <p className="font-body text-sm font-medium">{addr.recipient_name} · {addr.label}</p>
              <p className="text-[12px] text-muted-foreground font-body mt-1">
                {addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ''} · {addr.neighborhood}
              </p>
              <p className="text-[12px] text-muted-foreground font-body">
                {addr.city}/{addr.state} · CEP {addr.zip_code}
              </p>
            </div>
            <button onClick={() => handleDelete(addr.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressesPage;
