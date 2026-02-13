import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, LayoutDashboard, LogOut, LogIn, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const { user, logout, isLocadora, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isLocadora) return '/locadora/dashboard';
    return '/dashboard';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-[#FFD700]/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
             <img 
               src="https://horizons-cdn.hostinger.com/0dac87d6-de75-44be-816f-f9d7405a5902/55fc0b45212861f0a066eab7b4474d0e.png" 
               alt="HubLumi Logo" 
               className="h-10 w-auto object-contain"
             />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className={cn("text-sm font-medium hover:text-[#FFD700] transition-colors", isActive('/') ? "text-[#FFD700]" : "text-gray-300")}>Home</Link>
            <Link to="/catalogo" className={cn("text-sm font-medium hover:text-[#FFD700] transition-colors", isActive('/catalogo') ? "text-[#FFD700]" : "text-gray-300")}>Catálogo</Link>
            
            <div className="h-6 w-px bg-white/10 mx-2" />
            
            <Link to="/comparison" className={cn("text-sm font-medium hover:text-[#FFD700] transition-colors", isActive('/comparison') ? "text-[#FFD700]" : "text-gray-300")}>
              Comparar
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={getDashboardLink()}>
                    <Button variant="ghost" className={cn(
                        "transition-colors",
                        isAdmin ? "text-red-400 hover:bg-red-900/10" : "text-[#FFD700] hover:bg-[#FFD700]/10"
                    )}>
                      {isAdmin ? <ShieldAlert className="w-4 h-4 mr-2" /> : <LayoutDashboard className="w-4 h-4 mr-2" />}
                      Dashboard
                    </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button className="bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold">
                    <LogIn className="w-4 h-4 mr-2" /> Entrar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white p-2">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="lg:hidden border-t border-white/10 bg-black overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-[#FFD700]">Home</Link>
              <Link to="/catalogo" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-[#FFD700]">Catálogo</Link>
              <Link to="/comparison" onClick={() => setMobileMenuOpen(false)} className="block text-white hover:text-[#FFD700]">Comparar</Link>
              
              {user ? (
                 <>
                   <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="block text-[#FFD700] font-bold">Dashboard</Link>
                   <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center text-gray-400 mt-4">
                     <LogOut className="w-4 h-4 mr-2" /> Sair
                   </button>
                 </>
              ) : (
                 <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-[#FFD700] font-bold">Entrar</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;