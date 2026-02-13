import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createEquipamento, updateEquipamento } from '@/lib/supabaseDatabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const CATEGORIES = ['Spotlight', 'LED', 'Softbox', 'Fresnel', 'Par Light', 'Acessórios', 'Câmera', 'Lente', 'Audio'];

const EquipmentForm = ({ equipment, isOpen, onClose, onSave }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    modelo: '',
    categoria: 'Spotlight',
    quantidade: 1,
    valor_diaria: '',
    valor_semana: '',
    valor_mes: '',
    descricao: '',
    imagem: '',
    disponivel: true
  });

  useEffect(() => {
    if (equipment) {
      setFormData({
        modelo: equipment.modelo || '',
        categoria: equipment.categoria || 'Spotlight',
        quantidade: equipment.quantidade || 1,
        valor_diaria: equipment.valor_diaria || '',
        valor_semana: equipment.valor_semana || '',
        valor_mes: equipment.valor_mes || '',
        descricao: equipment.descricao || '',
        imagem: equipment.imagem || '',
        disponivel: equipment.disponivel
      });
    } else {
      setFormData({
        modelo: '',
        categoria: 'Spotlight',
        quantidade: 1,
        valor_diaria: '',
        valor_semana: '',
        valor_mes: '',
        descricao: '',
        imagem: '',
        disponivel: true
      });
    }
  }, [equipment, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.modelo || !formData.valor_diaria) {
        throw new Error("Campos obrigatórios: Modelo e Valor Diária");
      }

      const payload = {
        ...formData,
        locadora_id: user.locadora_id || user.id // Handle slightly different user structures
      };

      if (equipment) {
        await updateEquipamento(equipment.id, payload);
      } else {
        await createEquipamento(payload);
      }

      toast({
        title: equipment ? "Equipamento atualizado" : "Equipamento cadastrado",
        description: "Sucesso!",
        className: "bg-green-600 text-white"
      });
      
      onSave && onSave();
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-yellow-500/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#111] z-10">
          <h2 className="text-xl font-bold text-white">
            {equipment ? 'Editar Equipamento' : 'Novo Equipamento'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Modelo *</label>
              <input type="text" name="modelo" value={formData.modelo} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Categoria</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Valor Diária *</label>
                <input type="number" name="valor_diaria" value={formData.valor_diaria} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none" placeholder="0.00" required />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Valor Semana</label>
                <input type="number" name="valor_semana" value={formData.valor_semana} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none" placeholder="0.00" />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Valor Mês</label>
                <input type="number" name="valor_mes" value={formData.valor_mes} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none" placeholder="0.00" />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Quantidade</label>
              <input type="number" name="quantidade" value={formData.quantidade} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none" min="0" />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">URL Imagem</label>
              <div className="relative">
                 <Upload className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                 <input type="text" name="imagem" value={formData.imagem} onChange={handleChange} className="w-full bg-black border border-white/20 rounded-lg p-3 pl-10 text-white focus:border-[#FFD700] outline-none" placeholder="http://..." />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Descrição</label>
            <textarea name="descricao" value={formData.descricao} onChange={handleChange} rows={3} className="w-full bg-black border border-white/20 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none resize-none" />
          </div>

          <div className="flex items-center space-x-3">
            <input type="checkbox" id="disponivel" name="disponivel" checked={formData.disponivel} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-[#FFD700] focus:ring-[#FFD700]" />
            <label htmlFor="disponivel" className="text-white">Equipamento Disponível para Locação</label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={onClose} className="text-gray-400">Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Salvar</>}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EquipmentForm;