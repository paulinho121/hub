import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Trash2, Lightbulb, Zap, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ComparisonPage = () => {
  const [comparisonItems, setComparisonItems] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadComparisonItems();
  }, []);

  const loadComparisonItems = () => {
    const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    setComparisonItems(comparisonList);
  };

  const removeFromComparison = (id) => {
    const updated = comparisonItems.filter(item => item.id !== id);
    localStorage.setItem('comparisonList', JSON.stringify(updated));
    setComparisonItems(updated);
    
    toast({ title: 'Removido', description: 'Item removido da comparação.' });
  };

  const clearComparison = () => {
    localStorage.setItem('comparisonList', JSON.stringify([]));
    setComparisonItems([]);
    toast({ title: 'Lista limpa', description: 'Todos os itens foram removidos.' });
  };

  if (comparisonItems.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-28 pb-16 px-4">
        <Helmet><title>Comparar Luzes - HubLumi</title></Helmet>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-[#111] rounded-3xl border border-white/10"
          >
            <div className="w-20 h-20 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <Lightbulb className="w-10 h-10 text-[#FFD700]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Nenhum equipamento selecionado</h2>
            <Link to="/catalogo">
              <Button className="bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold px-8 py-6 rounded-full text-lg">
                Ir para o Catálogo
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-28 pb-16 px-4">
      <Helmet><title>Comparar Equipamentos - HubLumi</title></Helmet>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Comparação</h1>
            <p className="text-gray-400">Analisando {comparisonItems.length} {comparisonItems.length > 1 ? 'equipamentos' : 'equipamento'}</p>
          </div>
          <Button onClick={clearComparison} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full md:w-auto">
            <Trash2 className="w-4 h-4 mr-2" /> Limpar
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-max">
            <div className="grid gap-4 md:gap-6" style={{ gridTemplateColumns: `minmax(140px, 250px) repeat(${comparisonItems.length}, minmax(280px, 1fr))` }}>
              
              <div className="flex flex-col justify-end pb-4"><span className="text-xl font-bold text-white sticky left-0">Equipamento</span></div>
              {comparisonItems.map((item) => (
                <div key={item.id} className="relative bg-[#111] border border-white/10 rounded-xl p-4 flex flex-col group min-h-[300px]">
                  <button onClick={() => removeFromComparison(item.id)} className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-gray-400 hover:text-red-400 hover:bg-black transition-all z-10"><X className="w-4 h-4" /></button>
                  <div className="h-32 md:h-48 mb-4 rounded-lg overflow-hidden bg-black relative">
                     <img src={item.image_url} alt={item.titulo} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2">{item.titulo}</h3>
                  <Link to={`/equipamento/${item.id}`} className="mt-auto"><Button className="w-full bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold">Alugar</Button></Link>
                </div>
              ))}

              <div className="flex items-center py-4 border-b border-white/5"><span className="text-gray-400 font-medium md:text-lg">Valor Diária</span></div>
              {comparisonItems.map((item) => (
                <div key={`price-${item.id}`} className="flex items-center py-4 border-b border-white/5 px-4 bg-white/5 rounded-lg my-1">
                  <span className="text-[#FFD700] font-bold text-xl md:text-2xl">R$ {item.valorDiaria}</span>
                </div>
              ))}

              <div className="flex items-center py-4 border-b border-white/5"><span className="text-gray-400 font-medium">Disponibilidade</span></div>
              {comparisonItems.map((item) => (
                <div key={`status-${item.id}`} className="flex items-center py-4 border-b border-white/5 px-4">
                  <div className={`flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-bold ${item.statusDisponibilidade === 'disponivel' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{item.statusDisponibilidade === 'disponivel' ? 'Disponível' : 'Indisponível'}</div>
                </div>
              ))}

               <div className="flex items-center py-4 pt-8"><span className="text-[#FFD700] font-bold text-lg flex items-center"><Zap className="w-5 h-5 mr-2"/> Especificações</span></div>
              {comparisonItems.map((item) => (<div key={`sep-${item.id}`} className="py-4 pt-8"></div>))}

               <div className="flex items-center py-3 border-b border-white/5"><span className="text-gray-400 font-medium">Potência</span></div>
              {comparisonItems.map((item) => (<div key={`power-${item.id}`} className="flex items-center py-3 border-b border-white/5 px-4 bg-white/[0.02]"><span className="text-white text-sm md:text-base">{item.specifications?.power || '-'}</span></div>))}

               <div className="flex items-center py-3 border-b border-white/5"><span className="text-gray-400 font-medium">Temp. Cor</span></div>
              {comparisonItems.map((item) => (<div key={`temp-${item.id}`} className="flex items-center py-3 border-b border-white/5 px-4 bg-white/[0.02]"><span className="text-white text-sm md:text-base">{item.specifications?.colorTemp || '-'}</span></div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;