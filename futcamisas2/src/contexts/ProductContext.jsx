import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega produtos do Supabase ao iniciar
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    setProducts(data || []);
    setLoading(false);
  }

  async function addProduct(product) {
    const { data, error } = await supabase.from('products').insert([product]).select();
    if (error) throw error;
    setProducts(prev => [data[0], ...prev]);
  }

  async function updateProduct(id, updates) {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
    if (error) throw error;
    setProducts(prev => prev.map(p => p.id === id ? data[0] : p));
  }

  async function deleteProduct(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  function getProductById(id) {
    return products.find(p => p.id === id);
  }

  return (
    <ProductContext.Provider value={{ products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
} 