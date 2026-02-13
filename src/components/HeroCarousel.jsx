import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroCarousel = () => {
  // Static carousel configuration as requested
  // Only the first slide is kept
  const slide = {
    id: 1,
    image: "https://images.unsplash.com/photo-1580168500910-a57358352f14?w=1920&h=1080&fit=crop",
    title: "Locação Pontual Cine Pro",
    subtitle: "Iluminação cinematográfica de alta performance para produções exigentes."
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute inset-0"
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-black/20 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl"
          >
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-md max-w-3xl mx-auto">
              {slide.subtitle}
            </p>
            <Link to="/catalog">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg px-8 py-6 rounded-full shadow-lg shadow-yellow-500/50 transition-all hover:scale-105 font-semibold">
                Explorar Catálogo de Iluminação
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;