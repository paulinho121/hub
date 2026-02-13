import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Lightbulb, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import LuzForm from './LuzForm';
import ConfirmationModal from './ConfirmationModal';

const LuzManagement = () => {
  const [luzes, setLuzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLuz, setEditingLuz] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [luzToDelete, setLuzToDelete] = useState(null);

  const { user } = useAuth();
  const { toast } = useToast();

  const fetchLuzes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('luzes')
        .select('*')
        .eq('locadora_id', user.id)
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      setLuzes(data || []);
    } catch (error) {
      console.error("Error fetching luzes:", error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar a lista de luzes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLuzes();

      // Realtime subscription
      const subscription = supabase
        .channel('luzes_changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'luzes',
          filter: `locadora_id=eq.${user.id}` 
        }, () => {
          fetchLuzes();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const handleEdit = (luz) => {
    setEditingLuz(luz);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (luz) => {
    setLuzToDelete(luz);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!luzToDelete) return;
    
    try {
      const { error } = await supabase
        .from('luzes')
        .delete()
        .eq('id', luzToDelete.id);

      if (error) throw error;

      toast({ title: "Luz removida com sucesso" });
      setDeleteModalOpen(false);
      setLuzToDelete(null);
      fetchLuzes(); // Optimistic update or refresh
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    fetchLuzes();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLuz(null);
  };

  // Stats
  const totalLuzes = luzes.length;
  const totalItems = luzes.reduce((acc, curr) => acc + (curr.quantidade_total || 0), 0);
  const totalAvailable = luzes.reduce((acc, curr) => acc + (curr.quantidade_disponivel || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" /> 
            Gerenciamento de Luzes
          </h2>
          <p className="text-gray-400 text-sm">Controle seu estoque de iluminação</p>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold"
        >
          <Plus className="w-4 h-4 mr-2" /> Nova Luz
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-white/10 p-4 rounded-xl">
          <p className="text-gray-400 text-xs uppercase">Tipos de Luzes</p>
          <p className="text-2xl font-bold text-white">{totalLuzes}</p>
        </div>
        <div className="bg-[#111] border border-white/10 p-4 rounded-xl">
          <p className="text-gray-400 text-xs uppercase">Estoque Total</p>
          <p className="text-2xl font-bold text-blue-400">{totalItems}</p>
        </div>
        <div className="bg-[#111] border border-white/10 p-4 rounded-xl">
          <p className="text-gray-400 text-xs uppercase">Disponíveis</p>
          <p className="text-2xl font-bold text-green-400">{totalAvailable}</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        ) : luzes.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Lightbulb className="w-12 h-12 mb-3 opacity-20" />
            <p>Nenhuma luz cadastrada.</p>
            <Button variant="link" onClick={() => setIsFormOpen(true)} className="text-yellow-500 mt-2">
              Cadastrar primeira luz
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-white/5 text-gray-200 uppercase text-xs">
                <tr>
                  <th className="p-4">Nome</th>
                  <th className="p-4">Preço (Dia)</th>
                  <th className="p-4 text-center">Total</th>
                  <th className="p-4 text-center">Disp.</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {luzes.map((luz) => (
                  <tr key={luz.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-white">{luz.nome}</td>
                    <td className="p-4">R$ {luz.preco_aluguel}</td>
                    <td className="p-4 text-center">{luz.quantidade_total}</td>
                    <td className="p-4 text-center">{luz.quantidade_disponivel}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${luz.disponivel ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {luz.disponivel ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(luz)} className="h-8 w-8 hover:text-white">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(luz)} className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-900/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <LuzForm 
          luz={editingLuz} 
          onClose={handleCloseForm} 
          onSuccess={handleFormSuccess} 
        />
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Luz"
        description={`Tem certeza que deseja excluir "${luzToDelete?.nome}"?`}
        confirmText="Excluir"
        variant="destructive"
      />
    </div>
  );
};

export default LuzManagement;