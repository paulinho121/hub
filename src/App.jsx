import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingScreen from '@/components/LoadingScreen';
import { logDebug } from '@/lib/debug';

// Pages
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ComparisonPage from '@/pages/ComparisonPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import UserDashboard from '@/pages/UserDashboard';
import EquipamentoDetailPage from '@/pages/EquipamentoDetailPage';
import AdminDashboard from '@/pages/AdminDashboard';
import SuperAdminDashboard from '@/pages/SuperAdminDashboard';
import SuperAdminLoginPage from '@/pages/SuperAdminLoginPage';
import SuperAdminSetupPage from '@/pages/SuperAdminSetupPage';
import LocadoraDashboard from '@/pages/LocadoraDashboard';
import LocadoraProfilePage from '@/pages/LocadoraProfilePage';
import AdminBootstrapPage from '@/pages/AdminBootstrapPage';

// Inner App component to handle loading state
const InnerApp = () => {
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    logDebug('App', 'Mounting InnerApp', { loading, isAuthenticated });
  }, [loading, isAuthenticated]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans text-gray-100">
      <Navigation />
      <main className="flex-grow pt-20">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/equipamento/:id" element={<EquipamentoDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Utility Routes (Remove in production) */}
          <Route path="/admin-bootstrap" element={<AdminBootstrapPage />} />

          {/* Super Admin Routes */}
          <Route path="/super-admin-login" element={<SuperAdminLoginPage />} />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/super-admin-setup" 
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminSetupPage />
              </ProtectedRoute>
            } 
          />

          {/* User Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Locadora Routes */}
          <Route 
            path="/locadora/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['locadora']}>
                <LocadoraDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/locadora/perfil" 
            element={
              <ProtectedRoute allowedRoles={['locadora']}>
                <LocadoraProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Redirects */}
          <Route path="/locadora/login" element={<Navigate to="/login" replace />} />
          <Route path="/super-admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;