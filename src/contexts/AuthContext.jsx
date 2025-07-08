import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (authUser) => {
    if (!authUser) {
      setUser(null);
      return;
    }
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
    if (error) console.error("Erro ao buscar perfil:", error);
    setUser({ ...authUser, ...profile, role: profile?.role || 'user' });
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await fetchUserProfile(session?.user || null);
      setLoading(false);
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserProfile(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Função de registro atualizada para aceitar todos os dados do formulário
  async function register(formData) {
    const { email, password, ...metaData } = formData;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Envia os dados extras (full_name, phone) para o trigger do Supabase
        data: metaData
      }
    });
    if (error) throw error;
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
