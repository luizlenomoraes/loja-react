import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  
  const product = products.find(p => String(p.id) === String(id));
  const [selectedImage, setSelectedImage] = useState('');

  // Filtra produtos relacionados (mesma categoria, exceto o atual)
  const relatedProducts = product 
    ? products.filter(p => p.category === product.category && String(p.id) !== String(id)).slice(0, 4)
    : [];

  useEffect(() => {
    if (product && product.image_urls && product.image_urls.length > 0) {
      setSelectedImage(product.image_urls[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return <div className="text-center py-8 text-green-600">Carregando produto...</div>;
  if (!product) return <div className="text-center py-8 text-gray-500">Produto não encontrado.</div>;

  const hasImages = product.image_urls && product.image_urls.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="mb-4"><img src={selectedImage || 'https://via.placeholder.com/400x400?text=Produto'} alt={product.name} className="w-full h-auto object-contain rounded-lg shadow-md"/></div>
          {hasImages && product.image_urls.length > 1 && (
            <div className="flex gap-2 justify-center">
              {product.image_urls.map((url, index) => (
                <button key={index} onClick={() => setSelectedImage(url)} className={`p-1 rounded-lg ${selectedImage === url ? 'ring-2 ring-green-500' : ''}`}>
                  <img src={url} alt={`${product.name} - thumbnail ${index + 1}`} className="w-20 h-20 object-cover rounded-md"/>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <span className="text-green-600 text-3xl font-semibold mb-4 block">{product.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            <p className="text-gray-700 mb-4">{product.description || 'Sem descrição.'}</p>
          </div>
          <div className="mt-4">
            <button onClick={handleAddToCart} className={`w-full text-white py-3 rounded font-semibold transition ${added ? 'bg-blue-500' : 'bg-green-600 hover:bg-green-700'}`} disabled={added}>{added ? 'Adicionado!' : 'Adicionar ao Carrinho'}</button>
            <Link to="/produtos" className="block text-center text-green-600 mt-4 hover:underline">Voltar para produtos</Link>
          </div>
        </div>
      </div>

      {/* Seção de Especificações e Produtos Relacionados */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="border-t pt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Especificações</h3>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div><span className="font-semibold">Categoria:</span> {product.category || 'Não especificada'}</div>
              <div><span className="font-semibold">Estoque:</span> {product.stock_quantity > 0 ? `${product.stock_quantity} unidades` : 'Indisponível'}</div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="border-t pt-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Produtos Relacionados</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
