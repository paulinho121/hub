import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos.');
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    if (result.error) {
      setError('Email ou senha inválidos.');
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive"
      });
      setLoading(false);
    } else {
      toast({
        title: "Login realizado",
        description: "Bem-vindo ao HubLumi!",
      });
      // Redirect based on role
      if (result.user?.tipo_usuario === 'super_admin' || result.user?.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else if (result.user?.tipo_usuario === 'locadora' || result.user?.role === 'locadora') {
        navigate('/locadora/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Helmet><title>Login - HubLumi</title></Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Entrar</h1>
          <p className="text-gray-400">Acesse sua conta para continuar</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FFD700] outline-none transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FFD700] outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold py-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
          </Button>

          <p className="text-center text-gray-400 mt-4">
            Não tem uma conta? <Link to="/signup" className="text-[#FFD700] hover:underline">Cadastre-se</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;