import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  // Pega a primeira imagem do array, ou usa um placeholder se não houver nenhuma
  const imageUrl = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls[0] 
    : 'https://via.placeholder.com/200x200?text=Produto';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 flex flex-col">
      <Link to={`/produto/${product.id}`} className="flex-1 flex flex-col items-center">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-40 h-40 object-contain mb-4"
        />
        <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">{product.name}</h3>
        <span className="text-green-600 text-xl font-semibold mb-2">{product.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </Link>
      <Link
        to={`/produto/${product.id}`}
        className="mt-2 w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 text-center transition"
      >
        Ver Detalhes
      </Link>
    </div>
  );
}
