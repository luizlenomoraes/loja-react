import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  // Redireciona se não houver usuário ou se a função não for 'admin'
  // Note que seu script SQL usa 'user', então o admin deve ter 'admin'
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
