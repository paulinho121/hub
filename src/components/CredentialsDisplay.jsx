import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, ShieldCheck, ExternalLink, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CredentialsDisplay = ({ email, password }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl bg-[#111] border border-[#FFD700]/30 rounded-xl overflow-hidden shadow-2xl shadow-[#FFD700]/5"
    >
      <div className="bg-[#FFD700]/10 p-6 border-b border-[#FFD700]/20 flex items-center">
        <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center mr-4">
          <ShieldCheck className="w-6 h-6 text-[#FFD700]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Credenciais de Super Admin Geradas</h2>
          <p className="text-gray-400 text-sm">Guarde estas informações em local seguro.</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-black border border-white/10 rounded-lg p-4 font-mono text-sm relative group">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleCopy}
            className="absolute top-2 right-2 text-gray-500 hover:text-white"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
          
          <div className="mb-3">
            <span className="text-gray-500 select-none">USER_EMAIL: </span>
            <span className="text-green-400">{email}</span>
          </div>
          <div>
            <span className="text-gray-500 select-none">PASSWORD: &nbsp;&nbsp;</span>
            <span className="text-[#FFD700]">{password}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-bold flex items-center">
            <Terminal className="w-4 h-4 mr-2 text-gray-400" />
            Instruções de Login
          </h3>
          <ol className="list-decimal list-inside text-gray-400 space-y-2 text-sm ml-2">
            <li>Copie as credenciais acima.</li>
            <li>Acesse a página de login exclusiva para administradores.</li>
            <li>Insira o email e a senha gerada.</li>
            <li>Clique em "Entrar como Super Admin" para acessar o dashboard.</li>
          </ol>
        </div>

        <div className="pt-4 flex justify-end">
          <Link to="/super-admin-login">
            <Button className="bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold">
              Ir para Login <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CredentialsDisplay;