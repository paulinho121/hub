import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Settings, Loader2, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import CredentialsDisplay from '@/components/CredentialsDisplay';
import { useNavigate } from 'react-router-dom';

const AdminSetupHelper = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('idle'); // idle, processing, success, error
  const [errorDetails, setErrorDetails] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const ADMIN_CREDENTIALS = {
    email: "admin@hublumi.com",
    password: "Admin@123456"
  };

  const handleCreateAdmin = async () => {
    setLoading(true);
    setStep('processing');
    setErrorDetails('');

    try {
      // Step 1: Create Auth User
      console.log("Calling create-admin-user...");
      const { data: authData, error: authError } = await supabase.functions.invoke('create-admin-user', {
        body: ADMIN_CREDENTIALS
      });

      if (authError) throw new Error(`Function error: ${authError.message}`);
      if (!authData.success) throw new Error(authData.error || "Failed to create auth user");

      const userId = authData.userId;
      toast({ title: "Passo 1/2 Concluído", description: "Usuário de autenticação criado com sucesso." });

      // Step 2: Create Database Record
      console.log("Calling setup-admin-record...");
      const { data: dbData, error: dbError } = await supabase.functions.invoke('setup-admin-record', {
        body: { userId, email: ADMIN_CREDENTIALS.email }
      });

      if (dbError) throw new Error(`Function error: ${dbError.message}`);
      if (!dbData.success) throw new Error(dbData.error || "Failed to create database record");

      setStep('success');
      toast({ 
        title: "Sucesso!", 
        description: `Admin criado! Email: ${ADMIN_CREDENTIALS.email}`,
        className: "bg-green-600 text-white border-none"
      });

    } catch (error) {
      console.error("Setup failed:", error);
      setStep('error');
      setErrorDetails(error.message);
      toast({ 
        title: "Falha na Configuração", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-red-900/20 border border-red-500/30">
          <Shield className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Configuração de Super Admin</h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          Esta ferramenta irá configurar automaticamente o usuário administrador principal do sistema.
          Se o usuário já existir, a senha será redefinida.
        </p>
      </div>

      <motion.div 
        layout
        className="bg-[#111] border border-white/10 rounded-xl p-8 shadow-2xl"
      >
        {step === 'idle' || step === 'processing' || step === 'error' ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-4 text-sm text-gray-400 bg-black/50 p-4 rounded-lg border border-white/5 w-full">
              <Settings className="w-5 h-5 text-yellow-500" />
              <div className="flex-1">
                <p>Ações que serão executadas:</p>
                <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                  <li>Criar usuário <span className="text-white font-mono">admin@hublumi.com</span> no Supabase Auth</li>
                  <li>Confirmar email automaticamente</li>
                  <li>Inserir registro na tabela <span className="text-white font-mono">usuarios</span> com papel <span className="text-red-400">super_admin</span></li>
                </ul>
              </div>
            </div>

            {step === 'error' && (
              <div className="w-full bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3 text-red-200">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Ocorreu um erro:</p>
                  <p className="text-sm opacity-80">{errorDetails}</p>
                </div>
              </div>
            )}

            <Button 
              onClick={handleCreateAdmin} 
              disabled={loading}
              className="w-full md:w-auto min-w-[200px] bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg shadow-lg shadow-red-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processando...
                </>
              ) : (
                'Criar Usuário Admin'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
              <h3 className="text-xl font-bold text-white">Configuração Concluída!</h3>
              <p className="text-gray-400">O usuário administrador está pronto para uso.</p>
            </div>

            <div className="flex justify-center">
              <CredentialsDisplay 
                email={ADMIN_CREDENTIALS.email} 
                password={ADMIN_CREDENTIALS.password} 
              />
            </div>

            <div className="pt-4 flex justify-center">
               <Button 
                 onClick={() => navigate('/login')}
                 className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-6 text-lg"
               >
                 Testar Login Agora <ArrowRight className="w-5 h-5 ml-2" />
               </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminSetupHelper;