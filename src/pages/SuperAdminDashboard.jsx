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

    const getStatusColor = (status) => {
        switch (status) {
            case 'pendente_aprovacao': return 'bg-yellow-500/20 text-yellow-500';
            case 'aprovado': return 'bg-blue-500/20 text-blue-400';
            case 'pago': return 'bg-green-500/20 text-green-400';
            case 'cancelado': return 'bg-red-500/20 text-red-500';
            default: return 'bg-zinc-800 text-zinc-400';
        }
    };

    const handleUpdateLogisticsStatus = async (reservaId, newStatus) => {
        try {
            const { error } = await supabase
                .from('reservas')
                .update({ logistica_status: newStatus })
                .eq('id', reservaId);

            if (error) throw error;

            toast({ title: 'Status logístico atualizado' });
            loadData();
        } catch (error) {
            toast({ title: 'Erro ao atualizar status', description: error.message, variant: 'destructive' });
        }
    };

    const getTabLabel = (tab) => {
        switch (tab) {
            case 'equipment': return 'Equipamentos (Live)';
            case 'locadoras': return 'Locadoras';
            case 'reservas': return 'Reservas';
            case 'logistica': return 'Torre de Controle (Logística)';
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
                    {['equipment', 'locadoras', 'reservas', 'logistica', 'registration'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-gray-500 hover:text-white'}`}
                        >
                            {tab === 'logistica' && <LayoutDashboard className="w-4 h-4" />}
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
                                        <th className="p-4">Entrega</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {reservas.length === 0 ? (
                                        <tr><td colSpan="7" className="p-8 text-center text-gray-500">Nenhuma reserva encontrada.</td></tr>
                                    ) : (
                                        reservas.map(res => (
                                            <tr key={res.id} className="hover:bg-white/5">
                                                <td className="p-4 font-bold text-white">{res.locadoras?.nome}</td>
                                                <td className="p-4">
                                                    <div className="text-white">{res.usuarios?.nome || res.customer_name}</div>
                                                    <div className="text-[10px] text-gray-500">{res.usuarios?.email || res.customer_email}</div>
                                                </td>
                                                <td className="p-4">{res.equipamentos?.modelo || res.equipment_name}</td>
                                                <td className="p-4 text-xs">
                                                    {new Date(res.data_inicio || res.start_date).toLocaleDateString('pt-BR')} <br />
                                                    até {new Date(res.data_fim || res.end_date).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${res.modalidade_entrega === 'delivery' ? 'bg-blue-900 text-blue-300' : 'bg-zinc-800 text-zinc-400'}`}>
                                                        {res.modalidade_entrega === 'delivery' ? 'Delivery' : 'Hub Pickup'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(res.status)}`}>
                                                        {res.status?.replace('_', ' ') || 'Pendente'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-[#FFD700] font-bold text-right">R$ {res.valor_total || res.total_price}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'logistica' && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Torre de Controle de Logística</h2>
                                <div className="flex gap-2">
                                    <div className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                                        <Package className="w-4 h-4 text-blue-400" />
                                        <span className="text-xs text-white">Total Entregas: {reservas.filter(r => r.modalidade_entrega === 'delivery').length}</span>
                                    </div>
                                    <div className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#FFD700]" />
                                        <span className="text-xs text-white">Pickups em análise: {reservas.filter(r => r.logistica_status === 'pendente').length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {reservas.filter(r => r.modalidade_entrega === 'delivery' || r.logistica_status !== 'pendente').map(res => (
                                    <div key={res.id} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className={`p-3 rounded-full ${res.modalidade_entrega === 'delivery' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {res.modalidade_entrega === 'delivery' ? <MapPin className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{res.equipamentos?.modelo || res.equipment_name}</h4>
                                                <p className="text-xs text-gray-500">De: {res.locadoras?.nome} → Para: {res.modalidade_entrega === 'delivery' ? res.endereco_entrega : 'Hub Principal'}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                                            <div className="text-right mr-4">
                                                <div className="text-[10px] text-gray-500 uppercase font-black">Status Logístico</div>
                                                <div className="text-xs text-[#FFD700] font-bold">{res.logistica_status?.replace('_', ' ') || 'AGUARDANDO COLETA'}</div>
                                            </div>
                                            <select
                                                className="bg-black border border-white/20 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#FFD700]"
                                                value={res.logistica_status || 'pendente'}
                                                onChange={(e) => handleUpdateLogisticsStatus(res.id, e.target.value)}
                                            >
                                                <option value="pendente">Pendente</option>
                                                <option value="coleta_agendada">Coleta Agendada</option>
                                                <option value="em_transito">Em Trânsito</option>
                                                <option value="entregue">Entregue no Set</option>
                                                <option value="devolvido_hub">Devolvido ao Hub</option>
                                                <option value="finalizado">Finalizado</option>
                                            </select>
                                            <Button size="sm" className="bg-[#FFD700] text-black">Ver Rota</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
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