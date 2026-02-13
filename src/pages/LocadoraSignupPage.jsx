import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Building, Phone, Loader2, MapPin, CheckCircle, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const LocadoraSignupPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmar_senha: '',
    telefone: '',
    endereco: '',
    nome_empresa: '',
    cnpj: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Mask CNPJ (simple digits only filter for now to keep state clean)
    if (name === 'cnpj') {
       const digitsOnly = value.replace(/\D/g, '');
       if (digitsOnly.length <= 11) {
          setFormData(prev => ({ ...prev, [name]: digitsOnly }));
       }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome do responsável é obrigatório';
    if (!formData.nome_empresa.trim()) newErrors.nome_empresa = 'Nome da empresa é obrigatório';
    
    if (!formData.cnpj) {
        newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (formData.cnpj.length !== 11) {
        newErrors.cnpj = 'CNPJ deve conter exatamente 11 dígitos';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 8) {
      newErrors.senha = 'A senha deve ter no mínimo 8 caracteres';
    }

    if (formData.senha !== formData.confirmar_senha) {
      newErrors.confirmar_senha = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkEmailUnique = async (email) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      if (data) return false;
      return true;
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
      return true; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, corrija os erros indicados.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Check uniqueness
      const isUnique = await checkEmailUnique(formData.email);
      if (!isUnique) {
        setErrors(prev => ({ ...prev, email: 'Este email já está cadastrado.' }));
        throw new Error('Email já cadastrado no sistema.');
      }

      // 2. Create Auth User
      // Note: Passing nome_empresa and cnpj in metadata so the trigger can pick them up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome,
            nome_empresa: formData.nome_empresa,
            cnpj: formData.cnpj,
            role: 'locadora'
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar usuário.");

      // Wait a moment for trigger to create 'usuarios' record
      await new Promise(r => setTimeout(r, 1500));

      const userId = authData.user.id;

      // 3. Create Locadora Record (Requires linked user)
      // We first need to check if we can create the locadora record. 
      // Typically, one user = one locadora in this model?
      // Or locadora record is created and then linked.
      
      const { data: locadoraData, error: locadoraError } = await supabase
        .from('locadoras')
        .insert({
          nome: formData.nome_empresa, // Use Company Name for Locadora Name
          email: formData.email,
          telefone: formData.telefone,
          endereco: formData.endereco,
          ativo: true,
          data_criacao: new Date().toISOString()
        })
        .select()
        .single();

      if (locadoraError) {
        console.error("Failed to create locadora record:", locadoraError);
        // Fallback: If trigger failed or RLS blocked, we might have issues.
        throw new Error("Erro ao criar perfil da locadora: " + locadoraError.message);
      }

      // 4. Link User to Locadora
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({
          locadora_id: locadoraData.id,
          telefone: formData.telefone
        })
        .eq('id', userId);

      if (updateError) {
        console.error("Failed to link user to locadora:", updateError);
        throw new Error("Erro ao vincular usuário.");
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Redirecionando para o painel...",
        className: "bg-green-600 text-white border-none"
      });

      setTimeout(() => {
        window.location.href = '/locadora/dashboard';
      }, 1500);

    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-24">
      <Helmet>
        <title>Cadastro de Locadora - HubLumi</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-[#111] border border-yellow-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                <Building className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Parceria HubLumi</h1>
            <p className="text-gray-400">Cadastre sua locadora e gerencie seus equipamentos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Empresa Info */}
            <div className="bg-white/5 p-4 rounded-lg border border-white/5 mb-6">
                <h3 className="text-[#FFD700] text-sm font-bold uppercase tracking-wider mb-4 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" /> Dados da Empresa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Nome da Empresa *</label>
                        <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            name="nome_empresa"
                            value={formData.nome_empresa}
                            onChange={handleChange}
                            className={`w-full bg-black/50 border ${errors.nome_empresa ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 outline-none transition-colors`}
                            placeholder="Nome Fantasia ou Razão Social"
                        />
                        </div>
                        {errors.nome_empresa && <p className="text-red-500 text-xs mt-1 ml-1">{errors.nome_empresa}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">CNPJ (apenas números) *</label>
                        <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            name="cnpj"
                            maxLength={11}
                            value={formData.cnpj}
                            onChange={handleChange}
                            className={`w-full bg-black/50 border ${errors.cnpj ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 outline-none transition-colors`}
                            placeholder="00000000000"
                        />
                        </div>
                        {errors.cnpj && <p className="text-red-500 text-xs mt-1 ml-1">{errors.cnpj}</p>}
                    </div>
                </div>
            </div>

            {/* Responsável e Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Responsável *</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={`w-full bg-black/50 border ${errors.nome ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 outline-none transition-colors`}
                    placeholder="Seu nome completo"
                  />
                </div>
                {errors.nome && <p className="text-red-500 text-xs mt-1 ml-1">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Corporativo *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full bg-black/50 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 outline-none transition-colors`}
                    placeholder="contato@locadora.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>
            </div>

            {/* Senha e Confirmacao */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    className={`w-full bg-black/50 border ${errors.senha ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 outline-none transition-colors`}
                    placeholder="Min. 8 caracteres"
                  />
                </div>
                {errors.senha ? (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.senha}</p>
                ) : (
                  formData.senha && formData.senha.length >= 8 && (
                    <p className="text-green-500 text-xs mt-1 ml-1 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Senha forte</p>
                  )
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Senha *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="confirmar_senha"
                    value={formData.confirmar_senha}
                    onChange={handleChange}
                    className={`w-full bg-black/50 border ${errors.confirmar_senha ? 'border-red-500' : 'border-white/10'} rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 outline-none transition-colors`}
                    placeholder="Repita a senha"
                  />
                </div>
                {errors.confirmar_senha && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmar_senha}</p>}
              </div>
            </div>

            {/* Telefone e Endereco */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 outline-none transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-yellow-500 outline-none transition-colors"
                    placeholder="Rua, Cidade, Estado"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-lg mt-4 transition-transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </Button>

            <div className="text-center mt-6 pt-4 border-t border-white/10">
              <p className="text-gray-400">
                Já possui conta?{' '}
                <Link to="/login" className="text-yellow-500 hover:text-yellow-400 font-semibold hover:underline">
                  Fazer Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LocadoraSignupPage;