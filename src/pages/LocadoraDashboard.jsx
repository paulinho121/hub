import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Image as ImageIcon, Trash2, Edit2, Loader2, LogOut,
    Briefcase, User, Search, Package, ShoppingCart, Repeat,
    ArrowRightLeft, ShieldCheck, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import EquipmentRegistrationForm from '@/components/EquipmentRegistrationForm';
import { getEquipamentosByLocadora, getOtherLocadorasEquipment } from '@/lib/supabaseDatabase';

const LocadoraDashboard = () => {
    const [activeTab, setActiveTab] = useState('meus-produtos');
    const [myEquipment, setMyEquipment] = useState([]);
    const [hubCatalog, setHubCatalog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const targetId = user.id;

            // Fetch Profile
            const { data: prof } = await supabase.from('usuarios').select('*').eq('id', targetId).single();
            setUserProfile(prof);

            // Fetch My Equipment
            const myEq = await getEquipamentosByLocadora(targetId);
            setMyEquipment(myEq || []);

            // Fetch Hub Catalog (Other Locadoras)
            const othersEq = await getOtherLocadorasEquipment(targetId);
            setHubCatalog(othersEq || []);

        } catch (error) {
            console.error("Dashboard Load Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestInteraction = async (item) => {
        toast({
            title: "Solicitação Enviada ao Hub",
            description: `O HubLumi recebeu seu pedido de interessem pelo ${item.modelo}. Entraremos em contato com o parceiro anonimamente.`,
            className: "bg-blue-600 text-white"
        });
    };

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <Helmet><title>Dashboard Locadora - HubLumi</title></Helmet>

            <div className="max-w-7xl mx-auto">
                {/* Header Profissional */}
                <div className="bg-[#111] border border-[#FFD700]/20 rounded-2xl p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                    <div className="z-10">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                                <Briefcase className="w-8 h-8 text-[#FFD700]" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">
                                    {userProfile?.empresa || userProfile?.nome || 'Minha Locadora'}
                                </h1>
                                <p className="text-[#FFD700]/80 text-sm font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Conta Locadora Verificada
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 z-10">
                        <Button onClick={logout} variant="outline" className="border-red-900/50 text-red-500 hover:bg-red-900/20 px-6 font-bold">
                            <LogOut className="w-5 h-5 mr-2" /> Sair
                        </Button>
                    </div>
                </div>

                {/* Tab Navigation Hub */}
                <div className="flex flex-wrap gap-2 mb-8 bg-zinc-900/50 p-1.5 rounded-xl border border-white/5 w-fit">
                    {[
                        { id: 'meus-produtos', label: 'Meus Produtos', icon: Package },
                        { id: 'hub-catalog', label: 'Hub de Parceiros (Blind)', icon: Repeat },
                        { id: 'add-product', label: 'Novo Cadastro', icon: Plus },
                        { id: 'solicitacoes', label: 'Solicitações Hub', icon: ArrowRightLeft }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {activeTab === 'meus-produtos' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {myEquipment.length === 0 ? (
                                    <div className="col-span-full py-20 text-center bg-[#111] rounded-2xl border border-dashed border-zinc-800">
                                        <Package className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                        <p className="text-zinc-500 font-medium">Você ainda não possui produtos no seu inventário.</p>
                                        <Button onClick={() => setActiveTab('add-product')} variant="link" className="text-[#FFD700]">Cadastrar agora</Button>
                                    </div>
                                ) : (
                                    myEquipment.map(item => (
                                        <ProductCard key={item.id} item={item} isOwn />
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'hub-catalog' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="mb-6 bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 items-center">
                                <ShieldCheck className="w-6 h-6 text-blue-400 shrink-0" />
                                <p className="text-sm text-blue-200">
                                    <strong>Intermediação Blind:</strong> Aqui você vê equipamentos de parceiros.
                                    As identidades são ocultas. Todo o processo é mediado pelo <strong>HubLumi</strong>.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {hubCatalog.length === 0 ? (
                                    <div className="col-span-full py-20 text-center text-zinc-500">Nenhum produto externo disponível no momento.</div>
                                ) : (
                                    hubCatalog.map(item => (
                                        <ProductCard
                                            key={item.id}
                                            item={item}
                                            onAction={() => handleRequestInteraction(item)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'add-product' && (
                        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
                            <EquipmentRegistrationForm onSuccess={() => {
                                setActiveTab('meus-produtos');
                                loadDashboardData();
                            }} />
                        </div>
                    )}

                    {activeTab === 'solicitacoes' && (
                        <div className="bg-[#111] rounded-2xl border border-white/10 p-20 text-center animate-in fade-in">
                            <ArrowRightLeft className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                            <h2 className="text-xl font-bold text-white mb-2">Central de Intermediação</h2>
                            <p className="text-zinc-500 max-w-md mx-auto">Suas solicitações de produtos enviadas e recebidas via Hub aparecerão aqui em breve.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProductCard = ({ item, isOwn, onAction }) => {
    return (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-[#FFD700]/30 transition-all group flex flex-col h-full">
            <div className="h-48 bg-zinc-900 relative overflow-hidden">
                <img
                    src={item.imagem_url || item.imagem}
                    alt={item.modelo}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/80 rounded-lg text-xs font-black text-[#FFD700] backdrop-blur-md border border-white/10 shadow-xl">
                    R$ {item.valor_diaria}
                </div>
                {!isOwn && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600/90 rounded-md text-[10px] font-bold text-white uppercase flex items-center gap-1 backdrop-blur-sm border border-blue-400/30">
                        <MapPin className="w-3 h-3" />
                        {item.locadoras?.cidade || 'São Paulo'}
                    </div>
                )}
            </div>

            <div className="p-5 flex-grow flex flex-col">
                <div className="mb-4">
                    <h3 className="text-white font-bold text-lg mb-1 leading-tight">{item.modelo}</h3>
                    <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                        {isOwn ? item.categoria : 'Parceiro Verificado'}
                    </p>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
                    {isOwn ? (
                        <div className="flex justify-between items-center">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.disponivel ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-red-500/30 text-red-500 bg-red-500/5'}`}>
                                {item.disponivel ? 'ATIVO NO CATÁLOGO' : 'INDISPONÍVEL'}
                            </span>
                            <div className="flex gap-2">
                                <button className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                <button className="p-2 text-red-500/50 hover:text-red-500 transition-colors bg-white/5 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            onClick={onAction}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-xl text-xs uppercase tracking-widest gap-2 shadow-lg shadow-blue-900/10"
                        >
                            <ShoppingCart className="w-4 h-4" /> Solicitar via HubLumi
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocadoraDashboard;