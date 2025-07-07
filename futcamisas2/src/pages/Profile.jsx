import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Minha Conta</h2>
      <div className="mb-4">
        <span className="font-semibold text-gray-700">Email:</span>
        <span className="ml-2 text-gray-900">{user?.email}</span>
      </div>
      {/* Espaço para mais dados futuramente */}
      <button
        onClick={logout}
        className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition mt-6"
      >
        Sair
      </button>
    </div>
  );
} 