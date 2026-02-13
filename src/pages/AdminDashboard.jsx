import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { 
  Building, ShieldAlert, CheckCircle, XCircle, Search, Loader2, LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const [locadoras, setLocadoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocadoras();
  }, []);

  const fetchLocadoras = async () => {
    try {
      const { data, error } = await supabase
        .from('locadoras')
        .select('*')
        .order('data_criacao', { ascending: false });
      
      if (error) throw error;
      setLocadoras(data || []);
    } catch (error) {
      console.error('Error fetching locadoras:', error);
      toast({ title: 'Erro', description: 'Falha ao carregar locadoras.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('locadoras')
        .update({ ativo: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setLocadoras(prev => prev.map(loc => 
        loc.id === id ? { ...loc, ativo: !currentStatus } : loc
      ));
      
      toast({ title: 'Status atualizado', description: `Locadora ${!currentStatus ? 'ativada' : 'desativada'}.` });
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível atualizar o status.', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredLocadoras = locadoras.filter(loc => 
    (loc.nome?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (loc.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <Helmet><title>Admin Dashboard - HubLumi</title></Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShieldAlert className="text-red-500 w-8 h-8" />
              Painel Administrativo
            </h1>
            <p className="text-gray-400 mt-1">Olá, {user?.nome || 'Admin'}. Gerenciamento global.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar locadora..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#111] border border-white/10 text-white pl-10 pr-4 py-2 rounded-lg focus:border-red-500 outline-none w-full md:w-64"
              />
            </div>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-red-500 animate-spin" /></div>
        ) : (
          <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-gray-400" />
                Locadoras Cadastradas ({locadoras.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/50 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Telefone</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLocadoras.length === 0 ? (
                     <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Nenhuma locadora encontrada.</td></tr>
                  ) : (
                    filteredLocadoras.map((loc) => (
                      <tr key={loc.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{loc.nome}</td>
                        <td className="px-6 py-4 text-gray-400">{loc.email}</td>
                        <td className="px-6 py-4 text-gray-400">{loc.telefone || '-'}</td>
                        <td className="px-6 py-4">
                          {loc.ativo ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                              <CheckCircle className="w-3 h-3 mr-1" /> Ativo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50">
                              <XCircle className="w-3 h-3 mr-1" /> Inativo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleStatus(loc.id, loc.ativo)}
                            className={loc.ativo ? "text-red-400 hover:text-red-300 hover:bg-red-900/20" : "text-green-400 hover:text-green-300 hover:bg-green-900/20"}
                          >
                            {loc.ativo ? 'Desativar' : 'Ativar'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;