import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  // Exemplo: admin é o email admin@futcamisas.com
  if (user.email !== 'admin@futcamisas.com') return <Navigate to="/" replace />;
  return children;
} 