import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function PaymentSuccess() {
  const { clearCart } = useCart();

  // Limpa o carrinho assim que o usuário chega nesta página
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
        <svg className="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Pagamento Aprovado!</h1>
        <p className="text-gray-600 mb-8">
          Seu pedido foi recebido e está sendo processado. Você receberá um e-mail com os detalhes.
        </p>
        <Link 
          to="/produtos" 
          className="bg-green-600 text-white py-3 px-6 rounded font-semibold hover:bg-green-700 transition text-lg"
        >
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
}
