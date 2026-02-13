import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Plus, Check, Zap, Lightbulb, Info, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availability, setAvailability] = useState(null);
  const [relatedEquipment, setRelatedEquipment] = useState([]);
  const [isInComparison, setIsInComparison] = useState(false);

  useEffect(() => {
    loadEquipment();
    checkComparison();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate) {
      checkAvailability();
    }
  }, [startDate, endDate]);

  const loadEquipment = () => {
    // In CatalogPage we are forcing the localStorage to match INITIAL_LIGHTING_DATA
    // so we can trust it here too.
    const allEquipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const item = allEquipment.find(e => e.id === id);
    
    if (item) {
      setEquipment(item);
      // Load related equipment (same category, different item)
      // Since we only have Aputure and Creamsource now, almost everything is related
      const related = allEquipment
        .filter(e => e.id !== item.id)
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 3);
      setRelatedEquipment(related);
    }
  };

  const checkComparison = () => {
    const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    setIsInComparison(comparisonList.includes(id));
  };

  const checkAvailability = () => {
    // Mock availability check - in real app, this would query the database
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      toast({
        title: 'Data inválida',
        description: 'A data final deve ser posterior à data inicial',
        variant: 'destructive'
      });
      return;
    }

    // Simulate availability check
    const isAvailable = Math.random() > 0.3; // 70% chance of being available
    setAvailability(isAvailable);
  };

  const handleReservation = () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Selecione as datas',
        description: 'Por favor, selecione as datas de início e fim da reserva',
        variant: 'destructive'
      });
      return;
    }

    if (!availability) {
      toast({
        title: 'Equipamento indisponível',
        description: 'Este equipamento não está disponível nas datas selecionadas',
        variant: 'destructive'
      });
      return;
    }

    // Store reservation data and navigate to reservation page
    localStorage.setItem('pendingReservation', JSON.stringify({
      equipment,
      startDate,
      endDate
    }));
    navigate('/reservation');
  };

  const toggleComparison = () => {
    const comparisonList = JSON.parse(localStorage.getItem('comparisonList') || '[]');
    
    if (isInComparison) {
      const updated = comparisonList.filter(item => item !== id);
      localStorage.setItem('comparisonList', JSON.stringify(updated));
      setIsInComparison(false);
      toast({
        title: 'Removido da comparação',
        description: 'Equipamento removido da lista de comparação'
      });
    } else {
      comparisonList.push(id);
      localStorage.setItem('comparisonList', JSON.stringify(comparisonList));
      setIsInComparison(true);
      toast({
        title: 'Adicionado à comparação',
        description: 'Equipamento adicionado à lista de comparação'
      });
    }
  };

  if (!equipment) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <Helmet>
        <title>{equipment.name} - CineRent</title>
        <meta name="description" content={equipment.description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            onClick={() => navigate('/catalog')}
            variant="ghost"
            className="text-white hover:text-yellow-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Catálogo
          </Button>
        </motion.div>

        {/* Product Image Section - Prominent & Large */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="w-full bg-white/5 border border-yellow-500/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative aspect-video lg:aspect-[21/9]">
              {equipment.image_url ? (
                <img
                  src={equipment.image_url}
                  alt={equipment.name}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                  <ImageIcon className="w-20 h-20 opacity-50" />
                </div>
              )}
              <div className="absolute top-6 left-6">
                <span className="bg-yellow-500 text-black text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {equipment.category}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Equipment Details - Left Column (2/3 width) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{equipment.name}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{equipment.description}</p>
            </div>

            {/* Technical Specifications */}
            {equipment.specifications && (
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Info className="w-6 h-6 mr-3 text-yellow-500" />
                  Especificações Técnicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-black/30 rounded-lg border border-white/5">
                    <div className="flex items-center text-yellow-500 mb-2">
                      <Zap className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Potência</span>
                    </div>
                    <span className="text-white text-lg">{equipment.specifications.power}</span>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg border border-white/5">
                    <div className="flex items-center text-yellow-500 mb-2">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Tipo de Luz</span>
                    </div>
                    <span className="text-white text-lg">{equipment.specifications.type}</span>
                  </div>
                  <div className="col-span-1 md:col-span-2 p-4 bg-black/30 rounded-lg border border-white/5">
                    <div className="flex items-center text-yellow-500 mb-2">
                      <Check className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Características Principais</span>
                    </div>
                    <span className="text-white text-lg">{equipment.specifications.features}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Booking & Price - Right Column (1/3 width, sticky) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 shadow-xl">
                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-gray-400 text-sm uppercase tracking-wide mb-1">Preço da diária</p>
                  <span className="text-5xl font-bold text-yellow-500">
                    R$ {equipment.daily_price}
                  </span>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-yellow-500" />
                    Verificar Disponibilidade
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Data Início
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Data Fim
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                  </div>

                  {availability !== null && (
                    <div className={`p-4 rounded-lg animate-in fade-in slide-in-from-top-2 ${availability ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                      <p className={`font-semibold flex items-center ${availability ? 'text-green-400' : 'text-red-400'}`}>
                        {availability ? <><Check className="w-4 h-4 mr-2"/> Disponível</> : '✗ Indisponível'}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={handleReservation}
                      disabled={!availability}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6 text-lg rounded-xl shadow-lg shadow-yellow-500/20 transition-all hover:scale-[1.02]"
                    >
                      Reservar Agora
                    </Button>
                    <Button
                      onClick={toggleComparison}
                      variant="outline"
                      className={`w-full py-6 rounded-xl border-dashed ${
                        isInComparison
                          ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500'
                          : 'bg-transparent text-gray-400 border-gray-600 hover:border-yellow-500 hover:text-yellow-500'
                      }`}
                    >
                      {isInComparison ? (
                        <><Check className="w-5 h-5 mr-2" /> Na lista de comparação</>
                      ) : (
                        <><Plus className="w-5 h-5 mr-2" /> Adicionar à comparação</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Equipment */}
        {relatedEquipment.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-24 pt-12 border-t border-white/10"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Equipamentos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedEquipment.map((item) => (
                <Link key={item.id} to={`/equipment/${item.id}`}>
                  <div className="group bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-xl overflow-hidden hover:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10">
                    <div className="relative h-48 overflow-hidden bg-gray-900">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">{item.name}</h3>
                      <span className="text-xl font-bold text-yellow-500">
                        R$ {item.daily_price}<span className="text-sm text-gray-400 font-normal">/dia</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EquipmentDetailPage;