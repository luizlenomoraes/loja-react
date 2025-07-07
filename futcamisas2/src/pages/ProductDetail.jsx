import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const product = products.find(p => String(p.id) === String(id));

  if (loading) return <div className="text-center py-8 text-green-600">Carregando produto...</div>;
  if (!product) return <div className="text-center py-8 text-gray-500">Produto não encontrado.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row gap-8">
        <img
          src={product.image_url || 'https://via.placeholder.com/300x300?text=Produto'}
          alt={product.name}
          className="w-64 h-64 object-contain mx-auto md:mx-0"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <span className="text-green-600 text-2xl font-semibold mb-4 block">{product.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <p className="text-gray-700 mb-4">{product.description || 'Sem descrição.'}</p>
          </div>
          <button
            className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition mt-4"
            disabled
          >
            Adicionar ao Carrinho (em breve)
          </button>
          <Link to="/produtos" className="block text-center text-green-600 mt-4 hover:underline">Voltar para produtos</Link>
        </div>
      </div>
    </div>
  );
} 