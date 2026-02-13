import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, GitCompare, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { equipmentService } from '@/services/equipmentService';
import { reservationService } from '@/services/reservationService';
import { useAuth } from '@/contexts/AuthContext';

const EquipamentoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Reservation Form State
  const [dates, setDates] = useState({ start: '', end: '' });
  const [quantity, setQuantity] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await equipmentService.getEquipmentById(id);

      if (data) {
        setItem(data);
      } else {
        toast({ title: 'Equipamento não encontrado', variant: 'destructive' });
        navigate('/catalogo');
      }
      setLoading(false);
    };
    loadData();
  }, [id, navigate]);

  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.name || user.nome || '',
        email: user.email || '',
        phone: user.phone || user.telefone || '',
        message: ''
      });
    }
  }, [user]);

  const handleAddToComparison = () => {
    if (!item) return;

    const currentList = JSON.parse(localStorage.getItem('comparisonList') || '[]');

    if (currentList.some(i => i.id === item.id)) {
      toast({
        title: "Já adicionado",
        description: "Este item já está na sua lista de comparação.",
      });
      return;
    }

    if (currentList.length >= 4) {
      toast({
        title: "Limite atingido",
        description: "Máximo de 4 equipamentos para comparação.",
        variant: "destructive",
      });
      return;
    }

    const updatedList = [...currentList, item];
    localStorage.setItem('comparisonList', JSON.stringify(updatedList));

    toast({
      title: "Adicionado!",
      description: "Equipamento adicionado à comparação.",
      className: "bg-[#FFD700] text-black border-none",
    });
  };

  const handleReserve = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!dates.start || !dates.end) {
      toast({ title: 'Datas obrigatórias', variant: 'destructive' });
      setSubmitting(false);
      return;
    }

    try {
      const reservaData = {
        equipamento_id: item.id,
        locadora_id: item.locadora_id,
        usuario_id: user?.id || null,
        data_inicio: dates.start,
        data_fim: dates.end,
        quantidade_reservada: quantity,
        valor_total: (item.valor_diaria || item.valorDiaria) * calculateDays()
      };

      const reserva = await reservationService.create(reservaData);

      toast({
        title: 'Solicitação Enviada!',
        description: 'Sua reserva foi registrada e a locadora entrará em contato.'
      });

      navigate('/reserva/confirmacao', { state: { reservation: reserva, item } });

    } catch (error) {
      console.error('Erro na reserva:', error);
      toast({
        title: 'Erro ao processar reserva',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDays = () => {
    if (!dates.start || !dates.end) return 0;
    const start = new Date(dates.start);
    const end = new Date(dates.end);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  if (loading || !item) return <div className="min-h-screen bg-black pt-32 text-center text-white">Carregando...</div>;

  // Ensure we have an array for images
  const images = [item.image_url, item.fotoPrincipal].filter((v, i, a) => v && a.indexOf(v) === i);
  if (images.length === 0) images.push("https://via.placeholder.com/800x600?text=No+Image");

  const totalDays = calculateDays();
  const totalPrice = totalDays * item.valorDiaria * quantity;

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-28 pb-12 px-4">
      <Helmet>
        <title>{item.titulo} - HubLumi</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/catalogo')}
          className="mb-8 text-gray-400 hover:text-white pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Catálogo
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-900 border border-white/10 relative group"
            >
              <img
                src={images[activeImage]}
                alt={item.titulo}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="rounded-full bg-black/50 text-white hover:bg-black">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#FFD700]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {item.specifications && (
              <div className="bg-[#111] rounded-xl p-6 border border-white/10 mt-6">
                <h3 className="text-white font-bold mb-4">Especificações Técnicas</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {Object.entries(item.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-gray-500 capitalize">{key}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Info & Form */}
          <div className="space-y-6 md:space-y-8">
            <div>
              <h1 className="text-2xl md:text-5xl font-bold text-white mb-4">{item.titulo}</h1>
              <div className="flex items-center text-gray-400 text-sm mb-6">
                <MapPin className="w-4 h-4 mr-1 text-[#FFD700]" />
                {item.enderecoCurto || 'Centro'} • {item.cidade}, {item.estado}
              </div>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg">{item.description}</p>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                <div>
                  <span className="text-gray-400 text-sm">Valor Diária</span>
                  <div className="text-3xl md:text-4xl font-bold text-[#FFD700]">R$ {item.valorDiaria}</div>
                </div>
                <div className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold border ${item.statusDisponibilidade === 'disponivel' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {item.statusDisponibilidade === 'disponivel' ? 'Disponível' : 'Indisponível'}
                </div>
              </div>

              <form onSubmit={handleReserve} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Início</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
                      value={dates.start}
                      onChange={e => setDates({ ...dates, start: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Fim</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
                      value={dates.end}
                      onChange={e => setDates({ ...dates, end: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Quantidade</label>
                  <select
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value))}
                  >
                    {[...Array(Math.max(1, parseInt(item.quantidadeTotal || 1))).keys()].map(i => (
                      <option key={i + 1} value={i + 1}>{i + 1} unidade(s)</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-bold text-white mb-3">Seus Dados</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Seu Nome"
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none placeholder:text-gray-600 transition-colors"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="email"
                        placeholder="Seu Email"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none placeholder:text-gray-600 transition-colors"
                        value={customerInfo.email}
                        onChange={e => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      />
                      <input
                        type="tel"
                        placeholder="Seu Telefone"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none placeholder:text-gray-600 transition-colors"
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      />
                    </div>
                    <textarea
                      placeholder="Mensagem opcional para a locadora..."
                      rows="2"
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none placeholder:text-gray-600 resize-none transition-colors"
                      value={customerInfo.message}
                      onChange={e => setCustomerInfo({ ...customerInfo, message: e.target.value })}
                    />
                  </div>
                </div>

                {totalDays > 0 && (
                  <div className="bg-[#FFD700]/10 p-4 rounded-lg flex justify-between items-center border border-[#FFD700]/20">
                    <span className="text-[#FFD700] font-medium text-sm md:text-base">Total ({totalDays} dias):</span>
                    <span className="text-xl md:text-2xl font-bold text-white">R$ {totalPrice}</span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={submitting || item.statusDisponibilidade !== 'disponivel'}
                    className="flex-1 bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold py-6 text-lg rounded-xl shadow-lg shadow-[#FFD700]/10 w-full md:w-auto"
                  >
                    {submitting ? 'Enviando...' : 'Solicitar Reserva'}
                  </Button>

                  <Button
                    type="button"
                    onClick={handleAddToComparison}
                    className="bg-black border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-bold py-6 px-6 rounded-xl transition-all w-full md:w-auto flex items-center justify-center"
                  >
                    <GitCompare className="w-5 h-5 mr-2" />
                    Comparar
                  </Button>
                </div>

                <p className="text-center text-xs text-gray-500 mt-2">
                  A locadora receberá seu pedido e entrará em contato.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipamentoDetailPage;