import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-green-600 tracking-wide">Futcamisas2</Link>
      <nav className="space-x-4 flex items-center">
        <Link to="/" className="text-gray-700 hover:text-green-600">Home</Link>
        <Link to="/produtos" className="text-gray-700 hover:text-green-600">Produtos</Link>
        <Link to="/carrinho" className="text-gray-700 hover:text-green-600">Carrinho</Link>
        {!user && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-green-600">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-green-600">Registrar</Link>
          </>
        )}
        {user && (
          <>
            {/* Exemplo: se o email for admin@futcamisas.com, mostra Admin */}
            {user.email === 'admin@futcamisas.com' && (
              <Link to="/admin" className="text-red-600 font-semibold hover:text-red-800">Admin</Link>
            )}
            <Link to="/conta" className="text-gray-700 hover:text-green-600">Minha Conta</Link>
            <button onClick={handleLogout} className="text-gray-700 hover:text-green-600 ml-2">Sair</button>
          </>
        )}
      </nav>
    </header>
  );
} 