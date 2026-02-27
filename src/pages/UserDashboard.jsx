import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, Package, Edit, MessageCircle, MapPin, Truck, FolderPlus, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import NotificationPreferences from '@/components/NotificationPreferences';
import { reservationService } from '@/services/reservationService';
import { equipmentService } from '@/services/equipmentService';
import { projectService } from '@/services/projectService';

const UserDashboard = () => {
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [creatingProject, setCreatingProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  const [selectedEquipmentQty, setSelectedEquipmentQty] = useState(1);
  const [draftItems, setDraftItems] = useState([]);
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
    if (currentUser?.id) {
      loadReservations();
      loadProjects();
      loadEquipment();
    } else {
      setReservations([]);
      setLoadingReservations(false);
      setProjects([]);
      setLoadingProjects(false);
    }
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

  const loadReservations = async () => {
    if (!currentUser?.id) return;
    setLoadingReservations(true);
    try {
      const data = await reservationService.getReservas({ usuario_id: currentUser.id });
      const normalized = (data || []).map(r => ({
        id: r.id,
        equipment_id: r.equipamento_id,
        equipment_name: r.equipamentos?.modelo || r.equipment_name,
        start_date: r.data_inicio,
        end_date: r.data_fim,
        total_price: r.valor_total,
        status: r.status,
        modalidade_entrega: r.modalidade_entrega,
        created_at: r.data_criacao
      }));
      setReservations(normalized);
    } catch (e) {
      console.error('Erro ao carregar reservas:', e);
      setReservations([]);
    } finally {
      setLoadingReservations(false);
    }
  };

  const loadProjects = async () => {
    if (!currentUser?.id) return;
    setLoadingProjects(true);
    try {
      const data = await projectService.listByUser(currentUser.id);
      setProjects(data || []);
    } catch (e) {
      console.error('Erro ao carregar projetos:', e);
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadEquipment = async () => {
    try {
      const data = await equipmentService.getAllEquipment();
      setAvailableEquipment(data || []);
    } catch (e) {
      console.error('Erro ao carregar equipamentos para projetos:', e);
      setAvailableEquipment([]);
    }
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
      case 'aprovado':
        return 'text-green-400 bg-green-500/20';
      case 'pending':
      case 'pendente_aprovacao':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'completed':
      case 'finalizado':
        return 'text-blue-400 bg-blue-500/20';
      case 'cancelled':
      case 'cancelado':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
      case 'aprovado':
        return 'Confirmada';
      case 'pending':
      case 'pendente_aprovacao':
        return 'Aguardando Aprovação';
      case 'completed':
      case 'finalizado':
        return 'Concluída';
      case 'cancelled':
      case 'cancelado':
        return 'Cancelada';
      default:
        return status?.replace('_', ' ');
    }
  };

  const handleAddDraftItem = () => {
    if (!selectedEquipmentId) return;
    const equipamento = availableEquipment.find(e => e.id === selectedEquipmentId);
    if (!equipamento) return;
    setDraftItems(prev => [
      ...prev,
      {
        equipamento_id: equipamento.id,
        modelo: equipamento.modelo,
        quantidade: selectedEquipmentQty || 1
      }
    ]);
    setSelectedEquipmentId('');
    setSelectedEquipmentQty(1);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    setCreatingProject(true);
    try {
      const created = await projectService.create({
        usuario_id: currentUser.id,
        titulo: newProjectTitle.trim(),
        descricao: newProjectDescription.trim(),
        equipamentos: draftItems
      });
      setProjects(prev => [created, ...prev]);
      setNewProjectTitle('');
      setNewProjectDescription('');
      setDraftItems([]);
      toast({
        title: 'Trabalho criado!',
        description: 'Seu card de trabalho foi criado. Você pode usá-lo como checklist de equipamentos.'
      });
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: 'Erro ao criar trabalho',
        description: error.message || 'Tente novamente em instantes.',
        variant: 'destructive'
      });
    } finally {
      setCreatingProject(false);
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

          {/* Reservations + Projects Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Minhas Reservas</h2>

              {loadingReservations ? (
                <div className="text-center py-12 text-gray-400">Carregando reservas...</div>
              ) : reservations.length === 0 ? (
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

                      <div className="mt-4 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded ${reservation.modalidade_entrega === 'delivery' ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-800 text-zinc-400'}`}>
                            {reservation.modalidade_entrega === 'delivery' ? <MapPin className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-black">Entrega</p>
                            <p className="text-xs text-white">{reservation.modalidade_entrega === 'delivery' ? 'Delivery no Set' : 'Retirada no Hub'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded bg-yellow-500/10 text-yellow-500">
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-black">Status Logístico</p>
                            <p className="text-xs text-yellow-500 font-bold uppercase">{reservation.logistica_status?.replace('_', ' ') || 'Processando'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Projects / Trabalhos */}
            <div className="bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <FolderPlus className="w-6 h-6 text-yellow-400" />
                    Meus Trabalhos
                  </h2>
                  <p className="text-sm text-gray-400">
                    Crie cards para cada produção (filme, campanha, conteúdo) e liste os equipamentos que você precisa.
                  </p>
                </div>
              </div>

              {/* New Project Form */}
              <form onSubmit={handleCreateProject} className="mb-6 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Nome do trabalho *</label>
                    <input
                      type="text"
                      value={newProjectTitle}
                      onChange={e => setNewProjectTitle(e.target.value)}
                      placeholder="Ex: Filme X - Semana 1"
                      className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Descrição / Cliente</label>
                    <input
                      type="text"
                      value={newProjectDescription}
                      onChange={e => setNewProjectDescription(e.target.value)}
                      placeholder="Produtora / marca / contexto"
                      className="w-full bg-white/10 border border-yellow-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="mt-3 border-t border-white/10 pt-3 space-y-2">
                  <p className="text-xs text-gray-300 font-medium">Equipamentos necessários (opcional)</p>
                  <div className="flex flex-col md:flex-row gap-2">
                    <select
                      value={selectedEquipmentId}
                      onChange={e => setSelectedEquipmentId(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-yellow-500"
                    >
                      <option value="">Selecionar equipamento do catálogo</option>
                      {availableEquipment.map(eq => (
                        <option key={eq.id} value={eq.id}>
                          {eq.modelo} — R$ {eq.valor_diaria}/dia
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={selectedEquipmentQty}
                      onChange={e => setSelectedEquipmentQty(parseInt(e.target.value, 10) || 1)}
                      className="w-24 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-yellow-500"
                    />
                    <Button
                      type="button"
                      onClick={handleAddDraftItem}
                      disabled={!selectedEquipmentId}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-semibold px-3"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  {draftItems.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {draftItems.map((item, index) => (
                        <span
                          key={`${item.equipamento_id}-${index}`}
                          className="px-2 py-1 rounded-full bg-black/40 border border-yellow-500/40 text-[11px] text-yellow-100"
                        >
                          {item.modelo} × {item.quantidade}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={creatingProject || !newProjectTitle.trim()}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-semibold px-4"
                  >
                    {creatingProject ? 'Criando...' : 'Criar Trabalho'}
                  </Button>
                </div>
              </form>

              {/* Existing projects */}
              {loadingProjects ? (
                <div className="text-center py-8 text-gray-400 text-sm">Carregando trabalhos...</div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Você ainda não criou nenhum trabalho. Comece criando um acima.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-black/40 border border-yellow-500/20 rounded-xl p-4 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{project.titulo}</h3>
                        {project.descricao && (
                          <p className="text-xs text-gray-300 mb-2">{project.descricao}</p>
                        )}
                        <p className="text-[11px] text-gray-500 mb-3">
                          Criado em{' '}
                          {project.created_at
                            ? new Date(project.created_at).toLocaleDateString('pt-BR')
                            : '—'}
                        </p>
                        {Array.isArray(project.equipamentos) && project.equipamentos.length > 0 ? (
                          <div className="space-y-1 text-xs">
                            <p className="text-gray-300 font-medium mb-1">Equipamentos planejados:</p>
                            {project.equipamentos.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-gray-200">
                                <span>{item.modelo || 'Equipamento'}</span>
                                <span className="text-yellow-400 font-semibold">
                                  × {item.quantidade || 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-500">
                            Nenhum equipamento listado ainda. Use o formulário acima para adicionar quando criar
                            novos trabalhos.
                          </p>
                        )}
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