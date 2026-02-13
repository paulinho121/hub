import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EquipmentCard = ({ equipment, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white/5 backdrop-blur-sm border border-yellow-500/20 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden bg-gray-900">
        <img
          src={equipment.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={equipment.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            equipment.availability === 'available' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {equipment.availability === 'available' ? (
              <><CheckCircle className="w-3 h-3 mr-1" /> Disponível</>
            ) : (
              <><AlertCircle className="w-3 h-3 mr-1" /> Indisponível</>
            )}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors line-clamp-1">
          {equipment.title}
        </h3>
        
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          {equipment.city} - {equipment.state}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
          <span className="text-xl font-bold text-yellow-500">
            R$ {Number(equipment.dailyRate).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            <span className="text-xs text-gray-400 font-normal ml-1">/dia</span>
          </span>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onEdit(equipment)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onDelete(equipment)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EquipmentCard;