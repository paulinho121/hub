import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, equipmentName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 border border-red-500/30 rounded-xl w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-red-500/20 p-3 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Excluir Equipamento</h3>
        </div>
        
        <p className="text-gray-400 mb-6">
          Tem certeza que deseja excluir o equipamento <span className="text-white font-semibold">"{equipmentName}"</span>? Esta ação não pode ser desfeita.
        </p>
        
        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose} disabled={loading} className="text-white hover:bg-white/10">
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Confirmar Exclusão'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationModal;