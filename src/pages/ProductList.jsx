import React from 'react';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';

export default function ProductList() {
  const { products, loading, error } = useProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nossos Produtos</h1>
      {loading && <div className="text-center text-green-600">Carregando produtos...</div>}
      {error && <div className="text-center text-red-600">Erro: {error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="text-center text-gray-500">Nenhum produto cadastrado.</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
} 