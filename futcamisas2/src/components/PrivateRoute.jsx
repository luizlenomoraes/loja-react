import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
} 