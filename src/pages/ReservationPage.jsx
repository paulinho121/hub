import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, CreditCard, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ReservationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '', // Added WhatsApp field
    company: '',
    paymentMethod: 'pix'
  });

  useEffect(() => {
    const pending = localStorage.getItem('pendingReservation');
    if (!pending) {
      navigate('/catalog');
      return;
    }
    const data = JSON.parse(pending);
    setReservationData(data);
    
    // Pre-fill user data if available from session
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        whatsapp: currentUser.whatsapp || '',
        company: currentUser.company || ''
      }));
    }
  }, [navigate]);

  const calculateTotalPrice = () => {
    if (!reservationData) return 0;
    
    const start = new Date(reservationData.startDate);
    const end = new Date(reservationData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    return reservationData.equipment.daily_price * days;
  };

  const calculateDays = () => {
    if (!reservationData) return 0;
    
    const start = new Date(reservationData.startDate);
    const end = new Date(reservationData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateWhatsApp = (number) => {
    // Basic regex for international phone format or simple numbers
    // Allows +1234567890, 1234567890, (11) 99999-9999
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(number.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.whatsapp && !validateWhatsApp(formData.whatsapp)) {
      toast({
        title: 'Número de WhatsApp inválido',
        description: 'Por favor, insira um número válido.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Create reservation
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const newReservation = {
        id: Date.now().toString(),
        equipment_id: reservationData.equipment.id,
        equipment_name: reservationData.equipment.name,
        start_date: reservationData.startDate,
        end_date: reservationData.endDate,
        total_price: calculateTotalPrice(),
        status: 'pending',
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_whatsapp: formData.whatsapp, // Store WhatsApp
        customer_company: formData.company,
        payment_method: formData.paymentMethod,
        created_at: new Date().toISOString()
      };

      reservations.push(newReservation);
      localStorage.setItem('reservations', JSON.stringify(reservations));

      // Clear pending reservation
      localStorage.removeItem('pendingReservation');

      toast({
        title: 'Reserva confirmada!',
        description: `ID: ${newReservation.id}. Detalhes enviados para ${formData.email}.`
      });

      // Redirect to success page or catalog
      setTimeout(() => {
        navigate('/catalog');
      }, 2000);

    } catch (error) {
      toast({
        title: 'Erro ao processar reserva',
        description: 'Ocorreu um erro. Por favor, tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!reservationData) {
    return null;
  }

  const totalPrice = calculateTotalPrice();
  const days = calculateDays();

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <Helmet>
        <title>Finalizar Reserva - CineRent</title>
        <meta name="description" content="Complete sua reserva de equipamento" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Finalizar Reserva</h1>
          <p className="text-gray-400 text-lg">Complete os dados para confirmar sua reserva</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reservation Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Resumo da Reserva</h2>
            
            <div className="space-y-6">
              <div>
                <img
                  src={reservationData.equipment.image_url}
                  alt={reservationData.equipment.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-white">{reservationData.equipment.name}</h3>
                <p className="text-gray-400 text-sm mt-2">{reservationData.equipment.category}</p>
              </div>

              <div className="space-y-3 pt-6 border-t border-yellow-500/20">
                <div className="flex justify-between">
                  <span className="text-gray-400">Data Início:</span>
                  <span className="text-white font-semibold">
                    {new Date(reservationData.startDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Data Fim:</span>
                  <span className="text-white font-semibold">
                    {new Date(reservationData.endDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dias:</span>
                  <span className="text-white font-semibold">{days}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Preço/dia:</span>
                  <span className="text-white font-semibold">R$ {reservationData.equipment.daily_price}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-yellow-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-white">Total:</span>
                  <span className="text-3xl font-bold text-yellow-500">R$ {totalPrice}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Seus Dados</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    placeholder="João Silva"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Telefone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Opcional. Para receber notificações instantâneas.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Empresa</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    placeholder="Produtora XYZ (opcional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Método de Pagamento</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-10 py-3 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="pix" className="bg-gray-900">PIX</option>
                    <option value="credit" className="bg-gray-900">Cartão de Crédito</option>
                    <option value="debit" className="bg-gray-900">Cartão de Débito</option>
                    <option value="boleto" className="bg-gray-900">Boleto</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-6 text-lg rounded-lg mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Confirmar Reserva'
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;