import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
     return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#FFD700]">
        <span className="animate-pulse">Carregando...</span>
      </div>
     );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check roles if specified
  if (allowedRoles.length > 0) {
    const userRole = user.tipo_usuario;
    if (!allowedRoles.includes(userRole)) {
       // Redirect to appropriate dashboard based on role to prevent "stuck" users
       if (userRole === 'super_admin') return <Navigate to="/admin/dashboard" replace />;
       if (userRole === 'locadora') return <Navigate to="/locadora/dashboard" replace />;
       return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;