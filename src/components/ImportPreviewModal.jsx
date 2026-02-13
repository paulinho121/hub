import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImportPreviewModal = ({ 
  isOpen, 
  onClose, 
  data, 
  onConfirm, 
  loading 
}) => {
  if (!isOpen) return null;

  const hasCriticalErrors = data.some(item => item.validation_errors && item.validation_errors.length > 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
            <div>
              <h2 className="text-xl font-bold text-white">Pré-visualização da Importação</h2>
              <p className="text-gray-400 text-sm">
                Verifique os dados abaixo antes de confirmar. Mostrando primeiros {Math.min(data.length, 100)} itens.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>

          {/* Table */}
          <div className="flex-grow overflow-auto p-0">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-white uppercase bg-black sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">Linha</th>
                  <th className="px-4 py-3">Modelo</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3 text-center">Qtd</th>
                  <th className="px-4 py-3">Valor Diária</th>
                  <th className="px-4 py-3 text-center">Disp?</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((row, i) => {
                  const hasErrors = row.validation_errors && row.validation_errors.length > 0;
                  return (
                    <tr key={i} className={`hover:bg-white/5 ${hasErrors ? 'bg-red-900/10' : ''}`}>
                      <td className="px-4 py-3 font-mono text-xs">{row.row_index}</td>
                      <td className="px-4 py-3 text-white font-medium">{row.modelo}</td>
                      <td className="px-4 py-3">{row.categoria}</td>
                      <td className="px-4 py-3 text-center">{row.quantidade}</td>
                      <td className="px-4 py-3 text-[#FFD700]">R$ {row.valor_diaria}</td>
                      <td className="px-4 py-3 text-center">
                         {row.disponivel ? <span className="text-green-500">Sim</span> : <span className="text-red-500">Não</span>}
                      </td>
                      <td className="px-4 py-3">
                        {hasErrors ? (
                          <div className="flex items-start text-red-400 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col">
                              {row.validation_errors.map((err, idx) => (
                                <span key={idx}>{err}</span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center text-green-500 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            OK
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {data.length === 0 && (
                <div className="p-12 text-center text-gray-500">Nenhum dado encontrado para exibição.</div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-between items-center">
             <div className="text-sm">
                {hasCriticalErrors ? (
                    <span className="text-red-400 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Existem erros de validação. Itens inválidos podem ser ignorados.
                    </span>
                ) : (
                    <span className="text-green-500 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Todos os dados parecem corretos.
                    </span>
                )}
             </div>
             <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="border-white/10 text-gray-300 hover:text-white hover:bg-white/5">
                    Cancelar
                </Button>
                <Button 
                    onClick={onConfirm} 
                    disabled={loading || data.length === 0}
                    className="bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold"
                >
                    {loading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importando...</>
                    ) : (
                        <><Save className="w-4 h-4 mr-2" /> Confirmar Importação</>
                    )}
                </Button>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImportPreviewModal;