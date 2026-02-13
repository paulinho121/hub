import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileSpreadsheet, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const GoogleSheetsImporter = ({ isOpen, onClose, locadoraId }) => {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState('https://docs.google.com/spreadsheets/d/1YBJX3nw0QHMH8c5nUbcjquP5hQnGxcOV/edit');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUrlImport = async () => {
    if (!spreadsheetUrl) {
      toast({ title: "Erro", description: "URL da planilha é obrigatória", variant: "destructive" });
      return;
    }
    
    // Fallback if no locadoraId provided (e.g. testing)
    const targetLocadoraId = locadoraId; // In production this must be valid
    
    if (!targetLocadoraId) {
         toast({ title: "Atenção", description: "Locadora não identificada. Importação pode falhar.", variant: "destructive" });
         // Proceeding anyway might cause DB error, but lets user try
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-google-sheets', {
        body: { spreadsheetUrl, locadora_id: targetLocadoraId }
      });

      if (error) throw new Error(error.message || 'Erro ao conectar com servidor');
      if (data.error) throw new Error(data.error);

      toast({
        title: 'Importação Concluída',
        description: data.message || `Importados ${data.count} itens.`,
        className: 'bg-green-600 text-white'
      });
      
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Falha na Importação',
        description: error.message,
        variant: 'destructive'
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
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-white/10">
           <h2 className="text-xl font-bold text-white flex items-center">
             <FileSpreadsheet className="w-5 h-5 mr-2 text-green-500" />
             Importar Equipamentos
           </h2>
        </div>

        <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Link da Planilha Google</label>
                <div className="relative">
                   <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                   <input 
                      type="text"
                      value={spreadsheetUrl}
                      onChange={(e) => setSpreadsheetUrl(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-lg pl-10 p-3 text-white focus:border-green-500 outline-none text-sm font-mono"
                   />
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-lg">
                  <div className="flex items-start mb-2">
                    <AlertCircle className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                    <h4 className="text-sm font-bold text-blue-100">Como funciona</h4>
                  </div>
                  <ul className="list-disc list-inside text-xs text-blue-200 space-y-1 ml-1">
                      <li>Use planilhas <strong>Públicas</strong> para garantir acesso.</li>
                      <li>O sistema buscará colunas: Modelo, Categoria, Qtd, Valores, etc.</li>
                      <li>ID da Locadora Alvo: <span className="font-mono text-white bg-black px-1">{locadoraId || 'N/A'}</span></li>
                  </ul>
              </div>

              <Button 
                onClick={handleUrlImport}
                disabled={loading || !spreadsheetUrl}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processando...</> : 'Iniciar Importação'}
              </Button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GoogleSheetsImporter;