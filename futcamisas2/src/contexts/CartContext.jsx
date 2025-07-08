import React, { createContext, useContext, useState, useEffect } from 'react';

// Cria o contexto do carrinho
const CartContext = createContext();

/**
 * Provedor do contexto do carrinho. Gerencia o estado do carrinho,
 * incluindo adicionar, remover, atualizar itens e persistir os dados
 * no localStorage.
 */
export function CartProvider({ children }) {
  // Inicializa o estado do carrinho a partir do localStorage ou como um array vazio
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Não foi possível ler os itens do carrinho do localStorage", error);
      return [];
    }
  });

  // Salva os itens do carrinho no localStorage sempre que eles mudam
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Adiciona um produto ao carrinho. Se o produto já existir, incrementa a quantidade.
   * @param {object} product - O produto a ser adicionado.
   */
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item.id === product.id);
      if (itemExists) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  /**
   * Remove um produto do carrinho.
   * @param {number} productId - O ID do produto a ser removido.
   */
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  /**
   * Atualiza a quantidade de um produto no carrinho.
   * @param {number} productId - O ID do produto.
   * @param {number} quantity - A nova quantidade.
   */
  const updateQuantity = (productId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };
  
  /**
   * Limpa todos os itens do carrinho.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcula a quantidade total de itens no carrinho
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Calcula o valor total do carrinho
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Valor a ser fornecido pelo contexto
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook customizado para usar o contexto do carrinho.
 */
export function useCart() {
  return useContext(CartContext);
}
