import React, { useState, useEffect } from 'react';
import { Save, Loader2, Package, Image as ImageIcon, Zap, DollarSign, List, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { getLocadoras, createEquipamento } from '@/lib/supabaseDatabase';
import { useAuth } from '@/contexts/AuthContext';

const EquipmentRegistrationForm = ({ onSuccess }) => {
    const { user, isLocadora: authIsLocadora, isAdmin } = useAuth();
    const canSelfRegister = authIsLocadora || isAdmin;
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [locadoras, setLocadoras] = useState([]);
    const [locadorasLoading, setLocadorasLoading] = useState(true);

    const [formData, setFormData] = useState({
        modelo: '',
        marca: '',
        categoria: '',
        watts: '',
        valor_diaria: '',
        quantidade: 1,
        descricao: '',
        imagem: '',
        locadora_id: (user?.id && canSelfRegister) ? user.id : '',
        disponivel: true
    });

    useEffect(() => {
        const fetchLocadoras = async () => {
            try {
                const data = await getLocadoras();
                setLocadoras(data || []);

                // Força a seleção se tiver permissão e o campo estiver vazio
                if (user?.id && canSelfRegister) {
                    setFormData(prev => ({ ...prev, locadora_id: user.id }));
                }
            } catch (error) {
                console.error("Error fetching locadoras:", error);
            } finally {
                setLocadorasLoading(false);
            }
        };
        fetchLocadoras();
    }, [user, authIsLocadora]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.locadora_id) {
            toast({
                title: "Erro",
                description: "Selecione uma locadora para o equipamento.",
                variant: "destructive"
            });
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                valor_diaria: parseFloat(formData.valor_diaria),
                quantidade: parseInt(formData.quantidade),
                watts: formData.watts ? parseInt(formData.watts) : null
            };

            await createEquipamento(payload);

            toast({
                title: "Sucesso!",
                description: "Equipamento cadastrado com sucesso.",
                className: "bg-green-600 text-white border-none"
            });

            // Clear form
            setFormData({
                modelo: '',
                marca: '',
                categoria: '',
                watts: '',
                valor_diaria: '',
                quantidade: 1,
                descricao: '',
                imagem: '',
                locadora_id: (user?.id && canSelfRegister) ? user.id : '',
                disponivel: true
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error saving equipment:", error);
            toast({
                title: "Erro ao cadastrar",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#111] border border-[#FFD700]/20 rounded-xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                <Package className="w-8 h-8 text-[#FFD700]" />
                <div>
                    <h2 className="text-2xl font-bold text-white">Cadastrar Novo Equipamento</h2>
                    <p className="text-gray-400 text-sm">Preencha todos os detalhes para adicionar ao catálogo.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coluna 1 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4 text-blue-400" /> Modelo / Nome
                            </label>
                            <input
                                type="text"
                                name="modelo"
                                required
                                value={formData.modelo}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
                                placeholder="Ex: LS 1200d PRO"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Marca</label>
                            <input
                                type="text"
                                name="marca"
                                required
                                value={formData.marca}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
                                placeholder="Ex: Aputure"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <List className="w-4 h-4 text-purple-400" /> Categoria
                                </label>
                                <select
                                    name="categoria"
                                    required
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="LED Monolight">LED Monolight</option>
                                    <option value="LED Panel">LED Panel</option>
                                    <option value="Fresnel">Fresnel</option>
                                    <option value="RGBWW">RGBWW</option>
                                    <option value="Tubo LED">Tubo LED</option>
                                    <option value="HMI">HMI</option>
                                    <option value="Acessório">Acessório</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-yellow-400" /> Potência (Watts)
                                </label>
                                <input
                                    type="number"
                                    name="watts"
                                    value={formData.watts}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
                                    placeholder="Ex: 1200"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-orange-400" /> Locadora Responsável
                            </label>
                            <select
                                name="locadora_id"
                                required
                                value={formData.locadora_id}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
                            >
                                <option value="">Selecione a locadora...</option>
                                {locadoras.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.nome}</option>
                                ))}
                                {canSelfRegister && (
                                    <option value={user.id}>
                                        {user.company || user.name || 'Minha Empresa'}
                                    </option>
                                )}
                            </select>
                            {canSelfRegister && (
                                <p className="text-xs text-[#FFD700]/70 mt-1 italic">
                                    Registrando como: <strong>{user.company || user.name || 'Sua Empresa'}</strong>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Coluna 2 */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-400" /> Valor Diária (R$)
                                </label>
                                <input
                                    type="number"
                                    name="valor_diaria"
                                    required
                                    step="0.01"
                                    value={formData.valor_diaria}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade Estoque</label>
                                <input
                                    type="number"
                                    name="quantidade"
                                    required
                                    min="1"
                                    value={formData.quantidade}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-cyan-400" /> URL da Imagem
                            </label>
                            <input
                                type="url"
                                name="imagem"
                                required
                                value={formData.imagem}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors"
                                placeholder="https://exemplo.com/foto.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Descrição / Detalhes</label>
                            <textarea
                                name="descricao"
                                rows={4}
                                value={formData.descricao}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition-colors resize-none"
                                placeholder="Descreva as características técnicas e diferenciais do produto..."
                            />
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                            <input
                                type="checkbox"
                                id="disponivel"
                                name="disponivel"
                                checked={formData.disponivel}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-white/20 bg-black text-[#FFD700] focus:ring-[#FFD700]"
                            />
                            <label htmlFor="disponivel" className="text-sm text-gray-200 font-medium cursor-pointer">
                                Disponível para locação imediata
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold px-12 py-6 text-lg shadow-lg shadow-[#FFD700]/10"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Save className="w-6 h-6 mr-2" />}
                        Finalizar Cadastro
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EquipmentRegistrationForm;
