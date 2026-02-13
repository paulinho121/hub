import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const normalizeUser = (sessionUser, profile) => {
    if (!sessionUser) return null;
    const role = profile?.tipo_usuario || sessionUser.user_metadata?.tipo_usuario || 'user';
    return {
      id: sessionUser.id,
      email: sessionUser.email,
      role: role,
      tipo_usuario: role,
      name: profile?.nome || sessionUser.user_metadata?.nome || 'Usuário',
      phone: profile?.telefone || '',
      whatsapp: profile?.whatsapp || '',
      company: profile?.empresa || ''
    };
  };

  const syncProfile = async (sessionUser) => {
    if (!sessionUser) return;
    try {
      const { data } = await supabase.from('usuarios').select('*').eq('id', sessionUser.id).maybeSingle();
      if (data) {
        setUser(normalizeUser(sessionUser, data));
      }
    } catch (e) {
      console.warn("Silent profile sync failed", e);
    }
  };

  useEffect(() => {
    let mounted = true;

    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 4000);

    async function initialize() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setUser(normalizeUser(session.user, null));
          syncProfile(session.user);
        }
      } catch (err) {
        console.error("Auth Init Error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && mounted) {
        // Only reset to basic user if initializing or signing in
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          setUser(normalizeUser(session.user, null));
          syncProfile(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    const quickUser = normalizeUser(data.user, null);
    setUser(quickUser);
    setLoading(false);
    syncProfile(data.user);

    return { user: quickUser };
  };

  const updateProfile = async (updates) => {
    try {
      if (!user?.id) throw new Error("Usuário não identificado");

      const { data, error } = await supabase
        .from('usuarios')
        .upsert({
          id: user.id,
          email: user.email,
          nome: updates.name || updates.nome,
          telefone: updates.phone || updates.telefone,
          whatsapp: updates.whatsapp,
          empresa: updates.company || updates.empresa,
          tipo_usuario: user.tipo_usuario || 'user'
        })
        .select()
        .single();

      if (error) throw error;

      const session = await supabase.auth.getSession();
      const updatedUser = normalizeUser(session.data.session?.user, data);
      setUser(updatedUser);
      return { data: updatedUser };
    } catch (error) {
      console.error("Update profile error:", error);
      return { error: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      user, currentUser: user, loading, login, logout, updateProfile,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'super_admin' || user?.tipo_usuario === 'super_admin',
      isLocadora: user?.role === 'locadora' || user?.tipo_usuario === 'locadora'
    }}>
      {children}
    </AuthContext.Provider>
  );
};