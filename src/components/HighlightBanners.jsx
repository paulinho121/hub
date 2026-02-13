import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HighlightBanners = () => {
  const banners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1594503973889-c9e0df2c8210?w=800&q=80",
      title: "Variedade de luzes profissionais para cinema e audiovisual",
      link: "/catalogo?category=iluminacao"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1686061594212-8904e38bc1f2?w=800&q=80",
      title: "Atendimento de demandas de urgência com efetividade, rapidez e confiabilidade",
      link: "/catalogo"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1693496830171-49a7d48cfc52?w=800&q=80",
      title: "Locação segura, contratos claros e suporte especializado",
      link: "/sobre"
    }
  ];

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#FFD700]/10 transition-all duration-300 aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/3]"
            >
              {/* Image Background */}
              <img 
                src={banner.image} 
                alt={banner.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/95 transition-all duration-300"></div>

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight drop-shadow-md group-hover:text-[#FFD700] transition-colors">
                  {banner.title}
                </h3>
                
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <Link to={banner.link}>
                    <Button 
                      variant="outline" 
                      className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black font-semibold rounded-full px-6"
                    >
                      Saiba Mais <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightBanners;