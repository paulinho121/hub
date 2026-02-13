import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, Package, Edit, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import NotificationPreferences from '@/components/NotificationPreferences';
import { mockSupabaseOperations } from '@/lib/supabase';

const UserDashboard = () => {
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    whatsapp: currentUser?.whatsapp || '',
    company: currentUser?.company || ''
  });

  useEffect(() => {
    loadReservations();
    // Update form data if user context updates
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
  }, [currentUser]);

  const loadReservations = () => {
    const allReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    // In a real app, filter by user_id
    setReservations(allReservations);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await updateProfile(formData);

      if (error) throw error;

      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso no banco de dados.'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'completed':
        return 'text-blue-400 bg-blue-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <Helmet>
        <title>Meu Dashboard - HubLumi</title>
        <meta name="description" content="Gerencie suas reservas e perfil" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Meu Dashboard</h1>
          <p className="text-gray-400 text-lg">Gerencie suas reservas e informações</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Perfil</h2>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="ghost"
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                      placeholder="Para notificações"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Empresa</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                      Salvar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="flex-1 bg-white/10 text-white border-yellow-500/30"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-400">Nome</p>
                      <p className="text-white">{currentUser?.name || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white">{currentUser?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-400">Telefone</p>
                      <p className="text-white">{currentUser?.phone || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-400">WhatsApp</p>
                      <p className="text-white">{currentUser?.whatsapp || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-400">Empresa</p>
                      <p className="text-white">{currentUser?.company || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8">
              <NotificationPreferences userId={currentUser?.id} />
            </div>
          </motion.div>

          {/* Reservations Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Minhas Reservas</h2>

              {reservations.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Você ainda não tem reservas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="bg-white/5 border border-yellow-500/10 rounded-lg p-6 hover:border-yellow-500/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">
                            {reservation.equipment_name}
                          </h3>
                          <p className="text-sm text-gray-400">ID: {reservation.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Início</p>
                          <p className="text-white font-semibold">
                            {new Date(reservation.start_date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Fim</p>
                          <p className="text-white font-semibold">
                            {new Date(reservation.end_date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Total</p>
                          <p className="text-yellow-500 font-bold text-lg">
                            R$ {reservation.total_price}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Criada em</p>
                          <p className="text-white font-semibold">
                            {new Date(reservation.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;