import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShieldAlert, Loader2, Mail, Lock, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const SuperAdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [adminHint, setAdminHint] = useState('');
  
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    // Attempt to fetch current admin email to give a hint (optional UX improvement)
    const fetchAdminHint = async () => {
        try {
            const { data } = await supabase
                .from('usuarios')
                .select('email')
                .eq('tipo_usuario', 'super_admin')
                .single();
            
            if (data) setAdminHint(data.email);
        } catch (e) {
            console.error("Could not fetch admin hint", e);
        }
    };
    fetchAdminHint();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(false);
    setErrorMessage('');
    
    try {
      const { user: authUser, error } = await login(email, password);
      
      if (error) {
        setLoginError(true);
        setErrorMessage("Email ou senha incorretos.");
        toast({ title: 'Erro de Autenticação', description: "Email ou senha incorretos.", variant: 'destructive' });
      } else if (authUser?.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else {
        setLoginError(true);
        setErrorMessage("Este usuário não tem permissões de administrador.");
      }
    } catch (err) {
      setLoginError(true);
      setErrorMessage("Erro inesperado de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoginError(false);
    setErrorMessage('');
    setEmail('');
    setPassword('');
  };

  // Only use this in emergencies if completely locked out and DB is empty
  const runAdminSetup = async () => {
    setLoading(true);
    try {
        // Fallback to default if everything is broken, requires generic setup-admin fn
        const { error } = await supabase.functions.invoke('setup-admin');
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Credenciais restauradas (Padrão).' });
    } catch (e) {
        toast({ title: 'Erro', description: 'Função de recuperação indisponível.', variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <Helmet><title>Admin Login - HubLumi</title></Helmet>
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black pointer-events-none" />

      <div className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-red-900/30 shadow-2xl relative z-10">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 mb-4 border border-red-900/40">
                <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Acesso Administrativo</h1>
            {adminHint && (
                <div className="mt-2 text-xs text-gray-500 flex items-center justify-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    <span>Admin atual: {adminHint.replace(/(.{2})(.*)(@.*)/, "$1***$3")}</span>
                </div>
            )}
        </div>

        {loginError ? (
            <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h3 className="text-red-200 font-bold mb-2">Falha no Login</h3>
                    <p className="text-red-300/80 text-sm mb-4">{errorMessage}</p>
                </div>
                
                <Button 
                    onClick={handleRetry}
                    className="w-full bg-white text-black hover:bg-gray-200 font-bold"
                >
                    <RefreshCw className="w-4 h-4 mr-2" /> Tentar Novamente
                </Button>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                        <input 
                            type="email" 
                            required
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                            placeholder={adminHint || "admin@hublumi.com"}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Senha</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                        <input 
                            type="password" 
                            required
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <Button 
                    type="submit"
                    disabled={loading} 
                    className="w-full bg-red-600 hover:bg-red-700 font-bold py-6 text-base shadow-lg shadow-red-900/20"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : 'Acessar Painel'}
                </Button>
                
                 <div className="pt-4 text-center">
                   <button 
                     type="button" 
                     onClick={runAdminSetup}
                     className="text-[10px] text-gray-700 hover:text-gray-500 transition-colors cursor-default hover:cursor-pointer"
                     title="Restaurar acesso padrão em caso de emergência"
                   >
                     Problemas de acesso?
                   </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;