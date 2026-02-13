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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 top-20 z-40 bg-black/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="flex flex-col h-full p-6 space-y-6">
              <div className="space-y-4">
                {[
                  { to: '/', label: 'Home', icon: Aperture },
                  { to: '/catalogo', label: 'Catálogo', icon: Grid },
                  { to: '/comparison', label: 'Comparar', icon: MapPin },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl text-lg font-medium transition-all",
                      isActive(item.to) ? "bg-[#FFD700] text-black" : "text-gray-300 hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                {user ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/5 text-[#FFD700] font-bold text-lg"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard {isAdmin && "(Admin)"}
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-4 p-4 w-full text-red-500 font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      Sair da Conta
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-[#FFD700] text-black font-black text-xl shadow-lg shadow-[#FFD700]/20"
                  >
                    <LogIn className="w-6 h-6" />
                    ENTRAR AGORA
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;