import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Loader2, ShoppingCart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { equipmentService } from '@/services/equipmentService';
import { useRealtimeEquipamentos } from '@/hooks/useRealtimeEquipamentos';
import { Link } from 'react-router-dom';
import { logDebug } from '@/lib/debug';

const CatalogPage = () => {
    const [initialData, setInitialData] = useState([]);
    const [equipment, setEquipment] = useRealtimeEquipamentos(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterCategory, setFilterCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadCatalog();
    }, []);

    const loadCatalog = async () => {
        setLoading(true);
        setError(null);
        logDebug('CATALOG', 'Fetching catalog data...');
        try {
            const data = await equipmentService.getAllEquipment();
            logDebug('CATALOG', `Fetched ${data?.length || 0} items`);
            setInitialData(data || []);
        } catch (err) {
            console.error("Failed to load catalog:", err);
            logDebug('CATALOG', 'Error fetching items', err.message);
            setError('Não foi possível carregar os equipamentos. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Todos', ...new Set(equipment.map(i => i.categoria).filter(Boolean))];

    const filteredItems = (equipment || [])
        .filter(item => item.disponivel)
        .filter(item => filterCategory === 'Todos' || item.categoria === filterCategory)
        .filter(item => item.modelo?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <Helmet><title>Catálogo - HubLumi</title></Helmet>

            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">Equipamentos Disponíveis</h1>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-[#111] p-4 rounded-xl border border-white/10">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar modelo..."
                            className="w-full bg-black border border-white/20 rounded-lg pl-10 p-2.5 text-white focus:border-[#FFD700] outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {categories.slice(0, 5).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${filterCategory === cat ? 'bg-[#FFD700] text-black font-bold' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="flex items-center justify-center p-6 bg-red-900/20 border border-red-500/50 rounded-xl mb-8 text-red-400">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {error}
                        <Button variant="link" onClick={loadCatalog} className="text-red-300 underline ml-2">Tentar novamente</Button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-[#FFD700]" />
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredItems.map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[#111] border border-white/10 rounded-xl overflow-hidden hover:border-[#FFD700]/50 transition-all hover:transform hover:scale-[1.02] group"
                            >
                                <div className="h-48 bg-gray-900 relative overflow-hidden">
                                    <img
                                        src={item.imagem || 'https://via.placeholder.com/400'}
                                        alt={item.modelo}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                                        {item.locadoras?.nome || 'Parceiro HubLumi'}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="text-xs text-[#FFD700] font-bold uppercase tracking-wider mb-2">{item.categoria}</div>
                                    <h3 className="text-white font-bold text-lg mb-1 truncate" title={item.modelo}>{item.modelo}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{item.descricao || 'Sem descrição.'}</p>

                                    <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-400 mb-4 border-t border-b border-white/5 py-3">
                                        <div>
                                            <span className="block text-white font-bold">R$ {item.valor_diaria}</span>
                                            Diária
                                        </div>
                                        <div>
                                            <span className="block text-white font-bold">R$ {item.valor_semana}</span>
                                            Semana
                                        </div>
                                        <div>
                                            <span className="block text-white font-bold">R$ {item.valor_mes}</span>
                                            Mês
                                        </div>
                                    </div>

                                    <Link to={`/equipamento/${item.id}`}>
                                        <Button className="w-full bg-[#FFD700] text-black hover:bg-[#E5C100] font-bold">
                                            <ShoppingCart className="w-4 h-4 mr-2" /> Ver Detalhes
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && !error && filteredItems.length === 0 && (
                    <div className="text-center py-20 text-gray-500 bg-[#111] rounded-xl border border-white/10">
                        <p className="text-lg">Nenhum equipamento encontrado.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalogPage;