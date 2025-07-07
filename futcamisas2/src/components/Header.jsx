import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext'; // Importa o hook do carrinho

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart(); // Pega a contagem de itens do carrinho
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-green-600 tracking-wide">Futcamisas2</Link>
      <nav className="space-x-4 md:space-x-6 flex items-center">
        <Link to="/produtos" className="text-gray-700 hover:text-green-600">Produtos</Link>
        
        <Link to="/carrinho" className="relative text-gray-700 hover:text-green-600 p-2">
          {/* Ícone do carrinho em SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {/* Badge com a contagem de itens */}
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        
        {!user && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-green-600">Login</Link>
            <Link to="/register" className="hidden sm:inline-block bg-green-600 text-white py-2 px-4 rounded font-semibold hover:bg-green-700 transition">Registrar</Link>
          </>
        )}
        {user && (
          <>
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
