import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, CalendarDays,
  Lightbulb, Zap, Box, Circle, Aperture, Grid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { equipmentService } from '@/services/equipmentService';
import HighlightBanners from '@/components/HighlightBanners';

const HomePage = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await equipmentService.getAllEquipment();
      setEquipment(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Updated categories - Lighting Only
  const categories = [
    { icon: Lightbulb, label: 'Spotlight' },
    { icon: Zap, label: 'LED Light' },
    { icon: Box, label: 'Softbox' },
    { icon: Circle, label: 'Fresnel' },
    { icon: Aperture, label: 'Par Light' },
    { icon: Grid, label: 'Lighting Rig' },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>O hub da iluminação audiovisual - A Plataforma B2B de Locação HubLumi</title>
        <meta name="description" content="Conectando locadoras de equipamentos audiovisuais a produtoras e profissionais." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1563199592-687f283ab0e3?w=1600&h=900&fit=crop"
            alt="Cinema Production Set"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center w-full pt-32 md:pt-40">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white leading-tight"
          >
            O hub da iluminação <br className="hidden md:block" /> audiovisual
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 font-light drop-shadow-md px-4"
          >
            A primeira plataforma B2B que centraliza o estoque das melhores locadoras de cinema do Brasil.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mb-16"
          >
            <Link to="/catalogo">
              <Button className="w-full sm:w-auto bg-[#FFD700] hover:bg-[#E5C100] text-black text-lg px-12 py-8 rounded-full font-bold shadow-lg shadow-[#FFD700]/20 transition-transform hover:scale-105">
                Alugar Equipamentos
              </Button>
            </Link>
          </motion.div>

          {/* Icons Grid - Lighting Only */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 md:gap-12 px-4 pb-20"
          >
            {categories.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center group cursor-pointer">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#FFD700] group-hover:border-[#FFD700] transition-all duration-300 group-hover:scale-110 shadow-lg backdrop-blur-sm">
                  <cat.icon className="w-6 h-6 md:w-8 md:h-8 text-gray-300 group-hover:text-black transition-colors" />
                </div>
                <span className="mt-3 text-xs md:text-sm text-gray-400 group-hover:text-[#FFD700] font-medium tracking-wide uppercase transition-colors">
                  {cat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Highlight Banners Section */}
      <HighlightBanners />

      {/* Featured Equipment Grid */}
      <section className="py-24 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Destaques da Iluminação</h2>
            <p className="text-gray-400">Os equipamentos mais requisitados pelas grandes produções.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-80 bg-white/5 animate-pulse rounded-xl" />
              ))
            ) : (
              equipment.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-[#FFD700]/50 hover:shadow-2xl hover:shadow-[#FFD700]/10 transition-all duration-300 group flex flex-col"
                >
                  <Link to={`/equipamento/${item.id}`} className="block relative h-48 overflow-hidden cursor-pointer">
                    <img
                      src={item.image_url || item.fotoPrincipal}
                      alt={item.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${item.statusDisponibilidade === 'disponivel'
                      ? 'bg-green-500/90 text-white'
                      : 'bg-red-500/90 text-white'
                      }`}>
                      {item.statusDisponibilidade === 'disponivel' ? 'Disponível' : 'Indisponível'}
                    </div>
                  </Link>

                  <div className="p-5 flex flex-col flex-grow">
                    <Link to={`/equipamento/${item.id}`} className="block">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 hover:text-[#FFD700] transition-colors">{item.titulo}</h3>
                    </Link>
                    <div className="text-[#FFD700] font-bold text-xl mb-4">
                      R$ {item.valorDiaria} <span className="text-xs text-gray-500 font-normal">/ dia</span>
                    </div>

                    <div className="mt-auto grid grid-cols-1 gap-2">
                      <Link to={`/equipamento/${item.id}`} className="w-full">
                        <Button className="w-full bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold transition-all hover:scale-[1.02]">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          Reservar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-16 text-center">
            <Link to="/catalogo">
              <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black px-8 py-6 rounded-full text-lg">
                Ver Catálogo Completo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 to-transparent pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Pronto para otimizar sua produção?</h2>
          <p className="text-lg md:text-xl text-gray-400 mb-10">Junte-se a centenas de produtores que já usam o HubLumi.</p>
          <Link to="/catalogo" className="inline-flex items-center text-[#FFD700] hover:text-white font-bold text-lg transition-colors group">
            Explorar Catálogo <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;