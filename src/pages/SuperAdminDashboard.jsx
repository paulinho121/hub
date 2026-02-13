import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import {
    Users, Package, Calendar, FileSpreadsheet, Search,
    Download, Filter, CheckCircle, XCircle, Trash2,
    BarChart3, LayoutDashboard, Shield, UserCog,
    Settings, PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { getLocadoras, getReservas, getAllEquipamentos, updateLocadoraStatus, seedInitialData } from '@/lib/supabaseDatabase';
import { useRealtimeEquipamentos } from '@/hooks/useRealtimeEquipamentos';
import EquipmentRegistrationForm from '@/components/EquipmentRegistrationForm';
import GoogleSheetsImporter from '@/components/GoogleSheetsImporter';
import { Zap } from 'lucide-react';

const SuperAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('equipment');

    // Realtime Equipment
    const [initialEquipment, setInitialEquipment] = useState([]);
    const [equipment, setEquipment] = useRealtimeEquipamentos(initialEquipment);

    // Other Data
    const [locadoras, setLocadoras] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [importerOpen, setImporterOpen] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState('');
    const [isSeeding, setIsSeeding] = useState(false);

    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
        fetchAdminInfo();
    }, []);

    const fetchAdminInfo = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentAdmin(user?.email || 'Admin');
        } catch (e) {
            console.error(e);
        }
    };

    const loadData = async () => {
        const [eq, loc, res] = await Promise.all([
            getAllEquipamentos(),
            getLocadoras(),
            getReservas()
        ]);
        setInitialEquipment(eq);
        setLocadoras(loc);
        setReservas(res);
    };

    const handleToggleLocadora = async (id, currentStatus) => {
        await updateLocadoraStatus(id, !currentStatus);
        loadData();
        toast({ title: 'Status atualizado' });
    };

    const handleSeedData = async () => {
        if (!locadoras || locadoras.length === 0) {
            toast({
                title: "Nenhuma locadora encontrada",
                description: "Cadastre uma locadora antes de conectar as luzes.",
                variant: "destructive"
            });
            return;
        }

        setIsSeeding(true);
        try {
            // Vincula as luzes à primeira locadora encontrada
            await seedInitialData(locadoras[0].id);
            toast({
                title: "Luzes Conectadas!",
                description: "As 12 luzes de demonstração agora são produtos oficiais no seu banco de dados.",
                className: "bg-green-600 text-white"
            });
            await loadData();
            setActiveTab('equipment');
        } catch (error) {
            toast({ title: "Erro ao conectar", description: error.message, variant: "destructive" });
        } finally {
            setIsSeeding(false);
        }
    };

    const getTabLabel = (tab) => {
        switch (tab) {
            case 'equipment': return 'Equipamentos (Live)';
            case 'locadoras': return 'Locadoras';
            case 'reservas': return 'Reservas';
            case 'registration': return 'Cadastrar Produto';
            default: return tab;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-[#111] to-[#1a1a00] pt-24 pb-12 px-4">
            <Helmet><title>Super Admin - HubLumi</title></Helmet>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#FFD700] flex items-center gap-2">
                            <Shield className="w-8 h-8" />
                            Painel Master
                        </h1>
                        <p className="text-gray-400 mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Logado como: <span className="text-white font-mono">{currentAdmin}</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={handleSeedData}
                            disabled={isSeeding}
                            className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-500 border border-yellow-600/50"
                        >
                            <Zap className={`w-4 h-4 mr-2 ${isSeeding ? 'animate-pulse' : ''}`} />
                            {isSeeding ? 'Conectando...' : 'Conectar Luzes (Demonstração)'}
                        </Button>
                        <Button
                            onClick={() => navigate('/super-admin-setup')}
                            className="bg-red-900/30 hover:bg-red-900/50 text-red-200 border border-red-900/50"
                        >
                            <UserCog className="w-4 h-4 mr-2" /> Gerenciar Admin
                        </Button>
                        <Button onClick={() => setImporterOpen(true)} className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                            <FileSpreadsheet className="w-4 h-4 mr-2" /> Importar Dados
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-1 overflow-x-auto">
                    {['equipment', 'locadoras', 'reservas', 'registration'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab === 'registration' && <PlusCircle className="w-4 h-4" />}
                            {getTabLabel(tab)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className={`${activeTab === 'registration' ? '' : 'bg-black/50 border border-[#FFD700]/20 rounded-xl overflow-hidden backdrop-blur-xl'}`}>
                    {activeTab === 'equipment' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-[#FFD700]/10 text-[#FFD700]">
                                    <tr>
                                        <th className="p-4">Modelo</th>
                                        <th className="p-4">Marca</th>
                                        <th className="p-4">Locadora</th>
                                        <th className="p-4">Qtd</th>
                                        <th className="p-4">Preço</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {equipment.length === 0 ? (
                                        <tr><td colSpan="6" className="p-8 text-center text-gray-500">Nenhum equipamento encontrado.</td></tr>
                                    ) : (
                                        equipment.map(item => (
                                            <tr key={item.id} className="hover:bg-white/5">
                                                <td className="p-4 font-bold text-white">{item.modelo}</td>
                                                <td className="p-4 text-gray-400">{item.marca}</td>
                                                <td className="p-4 text-gray-400">{item.locadoras?.nome || 'Unknown'}</td>
                                                <td className="p-4">{item.quantidade}</td>
                                                <td className="p-4 text-[#FFD700]">R$ {item.valor_diaria}</td>
                                                <td className="p-4">{item.disponivel ? '✅' : '❌'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'locadoras' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-[#FFD700]/10 text-[#FFD700]">
                                    <tr>
                                        <th className="p-4">Nome</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Cidade</th>
                                        <th className="p-4">Ativo</th>
                                        <th className="p-4">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {locadoras.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">Nenhuma locadora encontrada.</td></tr>
                                    ) : (
                                        locadoras.map(loc => (
                                            <tr key={loc.id} className="hover:bg-white/5">
                                                <td className="p-4 font-bold text-white">{loc.nome}</td>
                                                <td className="p-4">{loc.email}</td>
                                                <td className="p-4">{loc.cidade}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs ${loc.ativo ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                        {loc.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleToggleLocadora(loc.id, loc.ativo)}
                                                        className="border-white/20 hover:bg-white/10"
                                                    >
                                                        {loc.ativo ? 'Desativar' : 'Ativar'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'reservas' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-300">
                                <thead className="bg-[#FFD700]/10 text-[#FFD700]">
                                    <tr>
                                        <th className="p-4">Locadora</th>
                                        <th className="p-4">Cliente</th>
                                        <th className="p-4">Item</th>
                                        <th className="p-4">Datas</th>
                                        <th className="p-4">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {reservas.length === 0 ? (
                                        <tr><td colSpan="5" className="p-8 text-center text-gray-500">Nenhuma reserva encontrada.</td></tr>
                                    ) : (
                                        reservas.map(res => (
                                            <tr key={res.id} className="hover:bg-white/5">
                                                <td className="p-4 font-bold text-white">{res.locadoras?.nome}</td>
                                                <td className="p-4">{res.usuarios?.nome || res.usuarios?.email}</td>
                                                <td className="p-4">{res.equipamentos?.modelo}</td>
                                                <td className="p-4 text-xs">
                                                    {res.data_inicio} até {res.data_fim}
                                                </td>
                                                <td className="p-4 text-[#FFD700]">R$ {res.valor_total}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'registration' && (
                        <div className="p-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <EquipmentRegistrationForm onSuccess={() => {
                                setActiveTab('equipment');
                                loadData();
                            }} />
                        </div>
                    )}
                </div>

                <GoogleSheetsImporter
                    isOpen={importerOpen}
                    onClose={() => setImporterOpen(false)}
                    locadoraId={null}
                />
            </div>
        </div>
    );
};

export default SuperAdminDashboard;