import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Building, Mail, Phone, MapPin, Globe, Edit, Save, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const LocadoraProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    cnpj: '',
    logo: '' // base64 string
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        website: currentUser.website || '',
        cnpj: currentUser.cnpj || '',
        logo: currentUser.logo || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        title: 'Arquivo muito grande',
        description: 'O logotipo deve ter no máximo 2MB.',
        variant: 'destructive'
      });
      return;
    }

    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logo: reader.result }));
      setUploadingLogo(false);
      toast({ title: 'Logo carregado', description: 'Não esqueça de salvar as alterações.' });
    };
    reader.onerror = () => {
      setUploadingLogo(false);
      toast({ title: 'Erro', description: 'Falha ao ler o arquivo.', variant: 'destructive' });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logo: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await updateProfile(formData);
    
    if (error) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Perfil atualizado!',
        description: 'As informações da locadora foram salvas.'
      });
      setIsEditing(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <Helmet>
        <title>Perfil da Locadora - HubLumi</title>
        <meta name="description" content="Gerencie as informações da sua locadora" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
               <div className="w-20 h-20 bg-white/5 rounded-full border border-yellow-500/20 flex items-center justify-center overflow-hidden relative">
                  {formData.logo ? (
                     <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                     <Building className="w-8 h-8 text-yellow-500/50" />
                  )}
               </div>
               <div>
                  <h1 className="text-3xl font-bold text-white">Perfil da Locadora</h1>
                  <p className="text-gray-400 mt-1">Gerencie suas informações comerciais</p>
               </div>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>

          <div className="bg-[#111] backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 md:p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Logo Section */}
                <div className="border-b border-white/10 pb-6">
                   <h3 className="text-lg font-medium text-white mb-4">Logotipo</h3>
                   <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-black border border-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                         {formData.logo ? (
                            <img src={formData.logo} alt="Preview" className="w-full h-full object-contain" />
                         ) : (
                            <ImageIcon className="w-8 h-8 text-gray-600" />
                         )}
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="flex gap-2">
                           <label className="cursor-pointer">
                              <span className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/10">
                                 {uploadingLogo ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                                 Carregar Logo
                              </span>
                              <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={handleLogoUpload} />
                           </label>
                           {formData.logo && (
                              <Button type="button" variant="destructive" size="sm" onClick={handleRemoveLogo}>
                                 <X className="w-4 h-4" />
                              </Button>
                           )}
                         </div>
                         <p className="text-xs text-gray-500">Max 2MB. (JPG, PNG, WEBP)</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nome Fantasia</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-black border border-white/20 rounded-lg px-10 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">CNPJ</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        name="cnpj"
                        type="text"
                        value={formData.cnpj}
                        onChange={handleChange}
                        className="w-full bg-black border border-white/20 rounded-lg px-10 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-black border border-white/20 rounded-lg px-10 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-black border border-white/20 rounded-lg px-10 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full bg-black border border-white/20 rounded-lg px-10 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Endereço</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/20 rounded-lg px-10 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 md:w-auto w-full">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Salvar Alterações
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="bg-transparent border-yellow-500/30 text-white hover:bg-white/10 h-12 md:w-auto w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <Building className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Nome Fantasia</p>
                        <p className="text-lg text-white font-medium">{currentUser?.name || 'Não informado'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <Building className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">CNPJ</p>
                        <p className="text-lg text-white font-medium">{currentUser?.cnpj || 'Não informado'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <Globe className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Website</p>
                        <p className="text-lg text-white font-medium break-all">{currentUser?.website || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <Mail className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Email Corporativo</p>
                        <p className="text-lg text-white font-medium break-all">{currentUser?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <Phone className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Telefone</p>
                        <p className="text-lg text-white font-medium">{currentUser?.phone || 'Não informado'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <MapPin className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Endereço</p>
                        <p className="text-lg text-white font-medium">{currentUser?.address || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LocadoraProfilePage;