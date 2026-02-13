import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  variant = "destructive", // destructive | default
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-white/10 rounded-xl w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className={`p-3 rounded-full ${variant === 'destructive' ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
            {variant === 'destructive' ? (
              <AlertTriangle className={`w-6 h-6 ${variant === 'destructive' ? 'text-red-500' : 'text-yellow-500'}`} />
            ) : (
              <Info className="w-6 h-6 text-yellow-500" />
            )}
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        <p className="text-gray-400 mb-6">
          {description}
        </p>
        
        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose} disabled={loading} className="text-white hover:bg-white/10">
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'destructive' ? "destructive" : "default"}
            onClick={onConfirm} 
            disabled={loading}
            className={variant === 'destructive' ? "bg-red-600 hover:bg-red-700" : "bg-[#FFD700] hover:bg-[#E5C100] text-black"}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationModal;