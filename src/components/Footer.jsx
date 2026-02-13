import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-[#FFD700]/20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="flex flex-col items-start">
             <Link to="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
               <img 
                 src="https://horizons-cdn.hostinger.com/0dac87d6-de75-44be-816f-f9d7405a5902/55fc0b45212861f0a066eab7b4474d0e.png" 
                 alt="HubLumi Logo" 
                 className="h-12 w-auto object-contain"
               />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              O hub da iluminação audiovisual. Especialistas em conectar produções às melhores locadoras do Brasil.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-lg font-semibold text-[#FFD700]">Links Rápidos</span>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/catalogo" className="text-gray-400 hover:text-[#FFD700] transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="text-gray-400 hover:text-[#FFD700] transition-colors">
                  Comparar Equipamentos
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-[#FFD700] transition-colors">
                  Login Cliente
                </Link>
              </li>
              <li>
                <Link to="/locadora/signup" className="text-gray-400 hover:text-[#FFD700] transition-colors">
                  Parceiro Locadora
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <span className="text-lg font-semibold text-[#FFD700]">Categorias</span>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/catalogo?category=Iluminação" className="text-gray-400 hover:text-[#FFD700] transition-colors">
                  Iluminação
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-gray-400 hover:text-[#FFD700] transition-colors">
                  Ver Catálogo Completo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="text-lg font-semibold text-[#FFD700]">Contato</span>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4 text-[#FFD700]" />
                <span>contato@hublumi.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4 text-[#FFD700]" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 text-[#FFD700]" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#FFD700]/10 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} HubLumi. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;