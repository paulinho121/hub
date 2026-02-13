import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ShieldAlert, Save, AlertTriangle, Loader2, UserCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const SuperAdminSetupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAdminEmail, setCurrentAdminEmail] = useState('Carregando...');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentAdmin();
  }, []);

  const fetchCurrentAdmin = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('email')
        .eq('tipo_usuario', 'super_admin')
        .single();
      
      if (error) throw error;
      if (data) setCurrentAdminEmail(data.email);
      else setCurrentAdminEmail('Não encontrado');
    } catch (error) {
      console.error('Error fetching admin:', error);
      setCurrentAdminEmail('Erro ao carregar');
    }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('setup-super-admin', {
        body: { email, password }
      });

      if (error) throw new Error(error.message || 'Falha na invocação da função');
      if (data?.error) throw new Error(data.error);

      toast({
        title: "Sucesso!",
        description: "Novo Super Admin configurado. Por favor, faça login novamente.",
        className: "bg-green-600 text-white border-none"
      });
      
      // Sign out to force re-login with new credentials/roles if necessary
      await supabase.auth.signOut();
      navigate('/login');

    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível atualizar o Super Admin.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <Helmet><title>Configurar Super Admin - HubLumi</title></Helmet>

      <div className="max-w-2xl mx-auto">
        <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/dashboard')}
            className="mb-6 text-gray-400 hover:text-white pl-0"
        >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Dashboard
        </Button>

        <div className="bg-[#111] border border-red-900/30 rounded-xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-600" />
            
            <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-red-900/20 rounded-lg border border-red-900/50">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Alterar Super Admin</h1>
                    <p className="text-gray-400">Transfira o controle total do sistema para um novo email.</p>
                </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-lg p-4 mb-8 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Super Admin Atual</p>
                    <p className="text-white font-mono flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-green-500" />
                        {currentAdminEmail}
                    </p>
                </div>
            </div>

            <div className="bg-yellow-900/10 border border-yellow-700/30 rounded-lg p-4 mb-8 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-200/80">
                    <p className="font-bold mb-1">Atenção Crítica</p>
                    <p>
                        Ao definir um novo Super Admin, a conta atual perderá os privilégios administrativos e será rebaixada para "Locadora". 
                        Certifique-se de ter acesso ao email e senha que está definindo.
                    </p>
                </div>
            </div>

            <form onSubmit={handleUpdateAdmin} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Novo Email de Admin</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                        placeholder="novo.admin@exemplo.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nova Senha</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none transition-colors"
                        placeholder="••••••••"
                    />
                    <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                </div>

                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    Definir Novo Super Admin
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSetupPage;