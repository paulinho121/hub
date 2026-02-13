import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, AlertCircle, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import EquipmentManagement from '@/components/EquipmentManagement';
import { mockSupabaseOperations } from '@/lib/supabase';

const RentalDashboard = () => {
  const { currentUser, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ total: 0, available: 0, unavailable: 0 });

  useEffect(() => {
    // Fetch basic stats
    const fetchStats = async () => {
      if (currentUser) {
        const { data } = await mockSupabaseOperations.getEquipmentByLocadora(currentUser.id);
        if (data) {
          setStats({
            total: data.length,
            available: data.filter(e => e.availability === 'available').length,
            unavailable: data.filter(e => e.availability !== 'available').length
          });
        }
      }
    };
    fetchStats();
  }, [currentUser, activeTab]); // Refresh when tab changes (e.g. after adding equipment)

  const sidebarItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'equipment', label: 'Meus Equipamentos', icon: Package },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black pt-16 flex">
      <Helmet>
        <title>Painel da Locadora - CineRent</title>
      </Helmet>

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-yellow-500/20 fixed h-full hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-1">
            <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-black text-xl">
              {currentUser?.name?.charAt(0) || 'L'}
            </div>
            <div>
              <h2 className="text-white font-bold truncate max-w-[140px]">{currentUser?.name}</h2>
              <span className="text-xs text-yellow-500 font-medium px-2 py-0.5 bg-yellow-500/10 rounded-full">Locadora</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-yellow-500 text-black font-semibold shadow-lg shadow-yellow-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            onClick={() => signOut()} 
            className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-4 lg:p-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-white mb-6">Visão Geral</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-yellow-500/10 transition-all" />
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Total de Equipamentos</p>
                      <h3 className="text-4xl font-bold text-white mt-1">{stats.total}</h3>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <Package className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 mt-2">
                    <div className="bg-yellow-500 h-1 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-green-500/10 transition-all" />
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Disponíveis</p>
                      <h3 className="text-4xl font-bold text-white mt-1">{stats.available}</h3>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 mt-2">
                    <div className="bg-green-500 h-1 rounded-full" style={{ width: `${stats.total ? (stats.available/stats.total)*100 : 0}%` }}></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/30 transition-all">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-red-500/10 transition-all" />
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">Indisponíveis / Manutenção</p>
                      <h3 className="text-4xl font-bold text-white mt-1">{stats.unavailable}</h3>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1 mt-2">
                    <div className="bg-red-500 h-1 rounded-full" style={{ width: `${stats.total ? (stats.unavailable/stats.total)*100 : 0}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Quick Actions or Recent Activity could go here */}
              <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                 <h3 className="text-xl text-white font-semibold mb-2">Comece a gerenciar seu inventário</h3>
                 <p className="text-gray-400 mb-6">Cadastre seus equipamentos para que os clientes possam encontrá-los.</p>
                 <Button onClick={() => setActiveTab('equipment')} className="bg-yellow-500 text-black hover:bg-yellow-600">
                    Gerenciar Equipamentos
                 </Button>
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <EquipmentManagement />
          )}

          {activeTab === 'settings' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Configurações da Locadora</h2>
              <p className="text-gray-400">Funcionalidade em desenvolvimento. Em breve você poderá editar perfil público, horário de funcionamento e regras de locação.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RentalDashboard;