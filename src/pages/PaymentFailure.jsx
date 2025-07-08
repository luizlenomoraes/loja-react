import React from 'react';
import { Link } from 'react-router-dom';

export default function PaymentFailure() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
        <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Falha no Pagamento</h1>
        <p className="text-gray-600 mb-8">
          Não foi possível processar seu pagamento. Por favor, verifique seus dados e tente novamente.
        </p>
        <Link 
          to="/carrinho" 
          className="bg-green-600 text-white py-3 px-6 rounded font-semibold hover:bg-green-700 transition text-lg"
        >
          Voltar para o Carrinho
        </Link>
      </div>
    </div>
  );
}
