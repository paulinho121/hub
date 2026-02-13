import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const LuzForm = ({ luz, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    quantidade_total: 1,
    quantidade_disponivel: 1,
    disponivel: true,
    descricao: '',
    preco_aluguel: 0
  });

  useEffect(() => {
    if (luz) {
      setFormData({
        nome: luz.nome || '',
        quantidade_total: luz.quantidade_total || 1,
        quantidade_disponivel: luz.quantidade_disponivel || 1,
        disponivel: luz.disponivel ?? true,
        descricao: luz.descricao || '',
        preco_aluguel: luz.preco_aluguel || 0
      });
    }
  }, [luz]);

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
      const payload = {
        ...formData,
        locadora_id: user.id,
        quantidade_total: parseInt(formData.quantidade_total),
        quantidade_disponivel: parseInt(formData.quantidade_disponivel),
        preco_aluguel: parseFloat(formData.preco_aluguel)
      };

      let error;
      if (luz?.id) {
        // Update
        const { error: updateError } = await supabase
          .from('luzes')
          .update(payload)
          .eq('id', luz.id);
        error = updateError;
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('luzes')
          .insert(payload);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: luz?.id ? "Luz atualizada" : "Luz criada",
        description: "Operação realizada com sucesso."
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving luz:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">
          {luz ? 'Editar Luz' : 'Nova Luz'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
              placeholder="Ex: Refletor LED 50W"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Qtd. Total</label>
              <input
                type="number"
                name="quantidade_total"
                value={formData.quantidade_total}
                onChange={handleChange}
                min="0"
                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Qtd. Disponível</label>
              <input
                type="number"
                name="quantidade_disponivel"
                value={formData.quantidade_disponivel}
                onChange={handleChange}
                min="0"
                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Preço Aluguel (R$)</label>
            <input
              type="number"
              name="preco_aluguel"
              value={formData.preco_aluguel}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full bg-black/50 border border-white/10 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={3}
              className="w-full bg-black/50 border border-white/10 rounded p-2 text-white resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="disponivel"
              name="disponivel"
              checked={formData.disponivel}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-yellow-500"
            />
            <label htmlFor="disponivel" className="text-sm text-gray-300">Disponível para aluguel</label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-700 text-gray-300">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#FFD700] hover:bg-[#E5C100] text-black">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LuzForm;