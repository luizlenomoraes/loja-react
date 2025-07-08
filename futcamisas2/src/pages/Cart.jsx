import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

/**
 * Página do Carrinho de Compras.
 * Exibe os itens adicionados, permite gerenciá-los e mostra o total.
 */
export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  // Se o carrinho estiver vazio, exibe uma mensagem
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Seu Carrinho está Vazio</h1>
        <p className="text-gray-600 mb-8">Adicione produtos para vê-los aqui.</p>
        <Link to="/produtos" className="bg-green-600 text-white py-2 px-6 rounded font-semibold hover:bg-green-700 transition">
          Ver Produtos
        </Link>
      </div>
    );
  }

  // Renderiza a lista de itens do carrinho
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Seu Carrinho</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        {cartItems.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b py-4 gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img src={item.image_url || 'https://via.placeholder.com/100x100?text=Produto'} alt={item.name} className="w-20 h-20 object-contain rounded" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-600">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
              <div className="flex items-center border rounded">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg font-bold hover:bg-gray-100">-</button>
                <span className="px-4 py-1">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg font-bold hover:bg-gray-100">+</button>
              </div>
              <p className="font-semibold w-24 text-right">
                {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 font-semibold">
                Remover
              </button>
            </div>
          </div>
        ))}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button onClick={clearCart} className="bg-red-500 text-white py-2 px-4 rounded font-semibold hover:bg-red-600 transition w-full sm:w-auto">
            Limpar Carrinho
          </button>
          <div className="text-right w-full sm:w-auto">
            <p className="text-2xl font-bold">Total: {cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <Link to="/checkout" className="mt-4 inline-block bg-green-600 text-white py-3 px-8 rounded font-semibold hover:bg-green-700 transition text-lg w-full sm:w-auto text-center">
              Finalizar Compra
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
