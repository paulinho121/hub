import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Activity, RefreshCw, Trash2, Database, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { checkSupabaseSetup } from '@/lib/diagnostico';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const DebugPage = () => {
  const { user, isAdmin } = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const runDiagnosis = async () => {
    setLoading(true);
    const res = await checkSupabaseSetup();
    setResults(res);
    setLoading(false);
  };

  const setupAdmin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('setup-admin');
      if (error) throw error;
      toast({ title: "Admin Setup", description: "Admin user created/updated successfully" });
      runDiagnosis();
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin && user) {
     return <div className="min-h-screen bg-black text-white flex items-center justify-center">Acesso Negado</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <Helmet><title>Debug & Setup - HubLumi</title></Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
                <Activity className="mr-3 text-[#FFD700]" />
                Diagnóstico do Sistema
            </h1>
            <div className="flex gap-2">
                <Button onClick={runDiagnosis} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Verificar
                </Button>
            </div>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#111] p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <ShieldCheck className="mr-2 text-green-500" /> Admin Tools
                </h3>
                <p className="text-gray-400 mb-4 text-sm">Cria ou reseta o usuário admin padrão (admin@hublumi.com)</p>
                <Button onClick={setupAdmin} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                    Setup Admin User
                </Button>
            </div>
            
            <div className="bg-[#111] p-6 rounded-xl border border-white/10">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Database className="mr-2 text-purple-500" /> Database Info
                </h3>
                <div className="text-sm text-gray-400 space-y-2">
                    <p>URL: {import.meta.env.VITE_SUPABASE_URL}</p>
                    <p>Environment: {import.meta.env.MODE}</p>
                </div>
            </div>
        </div>

        {/* Results */}
        {results && (
            <div className="space-y-6">
                {/* Auth Status */}
                <div className="bg-[#111] p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Status de Autenticação</h3>
                    <div className="flex items-center">
                        {results.auth.status === 'ok' ? (
                            <CheckCircle className="text-green-500 mr-3" />
                        ) : (
                            <XCircle className="text-red-500 mr-3" />
                        )}
                        <div>
                            <p className="text-white font-bold">{results.auth.status.toUpperCase()}</p>
                            <p className="text-gray-400">{results.auth.message}</p>
                        </div>
                    </div>
                </div>

                {/* Table Status */}
                <div className="bg-[#111] p-6 rounded-xl border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Tabelas do Banco de Dados</h3>
                    <div className="grid gap-4">
                        {Object.entries(results.tables).map(([tableName, info]) => (
                            <div key={tableName} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                                <div className="flex items-center">
                                    {info.status === 'ok' ? (
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-500 mr-3" />
                                    )}
                                    <span className="text-white font-mono">{tableName}</span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-bold ${info.count > 0 ? 'text-blue-400' : 'text-gray-500'}`}>
                                        {info.count ?? 0} registros
                                    </span>
                                    {info.columnsStatus === 'error' && (
                                        <p className="text-xs text-red-400 mt-1">{info.columnsMessage}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DebugPage;