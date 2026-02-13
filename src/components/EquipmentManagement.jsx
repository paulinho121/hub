import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockSupabaseOperations } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import EquipmentCard from './EquipmentCard';
import EquipmentForm from './EquipmentForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useToast } from '@/components/ui/use-toast';

const ITEMS_PER_PAGE = 10;
const BRAZILIAN_STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const EquipmentManagement = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [equipmentList, setEquipmentList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, [currentUser]);

  useEffect(() => {
    filterEquipment();
  }, [equipmentList, searchQuery, stateFilter, statusFilter]);

  const fetchEquipment = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const { data } = await mockSupabaseOperations.getEquipmentByLocadora(currentUser.id);
      setEquipmentList(data || []);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEquipment = () => {
    let result = [...equipmentList];

    if (searchQuery) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (stateFilter) {
      result = result.filter(item => item.state === stateFilter);
    }

    if (statusFilter) {
      result = result.filter(item => item.availability === statusFilter);
    }

    setFilteredList(result);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStateFilter('');
    setStatusFilter('');
  };

  const handleAdd = () => {
    setEditingEquipment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (equipment) => {
    setEditingEquipment(equipment);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (equipment) => {
    setEquipmentToDelete(equipment);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!equipmentToDelete) return;
    setIsDeleting(true);
    try {
      await mockSupabaseOperations.deleteEquipment(currentUser.id, equipmentToDelete.id);
      toast({
        title: "Equipamento excluído",
        description: "O equipamento foi removido com sucesso."
      });
      fetchEquipment();
      setDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o equipamento.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setEquipmentToDelete(null);
    }
  };

  const handleFormSave = () => {
    fetchEquipment();
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Meus Equipamentos</h2>
        <Button onClick={handleAdd} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-lg shadow-yellow-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Equipamento
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-yellow-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select 
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="">Todos os Estados</option>
            {BRAZILIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="">Todos Status</option>
            <option value="available">Disponível</option>
            <option value="unavailable">Indisponível</option>
            <option value="maintenance">Em Manutenção</option>
          </select>

          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-400">Carregando equipamentos...</p>
        </div>
      ) : filteredList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredList.map((item) => (
            <EquipmentCard 
              key={item.id} 
              equipment={item} 
              onEdit={handleEdit} 
              onDelete={handleDeleteClick} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
          <PackageOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum equipamento encontrado</h3>
          <p className="text-gray-400 max-w-sm mx-auto mb-6">
            Você ainda não cadastrou equipamentos ou nenhum item corresponde aos filtros selecionados.
          </p>
          <Button onClick={handleAdd} variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10">
            Cadastrar Primeiro Item
          </Button>
        </div>
      )}

      {/* Modals */}
      <EquipmentForm 
        equipment={editingEquipment}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
      />

      <DeleteConfirmationModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        equipmentName={equipmentToDelete?.title}
        loading={isDeleting}
      />
    </div>
  );
};

export default EquipmentManagement;