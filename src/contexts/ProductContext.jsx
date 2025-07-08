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

  // NOVA FUNÇÃO DELETEPRODUCT
  async function deleteProduct(id) {
    // 1. Buscar as URLs das imagens do produto que será deletado
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('image_urls')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error(`Não foi possível buscar o produto para deletar as imagens: ${fetchError.message}`);
    }

    // 2. Se houver imagens, deletá-las do Storage
    if (product.image_urls && product.image_urls.length > 0) {
      const filePaths = product.image_urls.map(url => {
        // Extrai o caminho do arquivo da URL completa
        // Ex: https://.../product-images/user_id/12345-image.png -> user_id/12345-image.png
        const path = url.split('/product-images/')[1];
        // Adiciona uma verificação para garantir que o caminho foi extraído
        if (!path) {
          console.warn(`Não foi possível extrair o caminho do arquivo da URL: ${url}`);
          return null;
        }
        return path;
      }).filter(path => path !== null); // Filtra quaisquer URLs malformadas

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage.from('product-images').remove(filePaths);

        if (storageError) {
          // Mesmo que dê erro ao deletar a imagem, ainda tentamos deletar o produto
          console.error("Erro ao deletar imagens do storage:", storageError.message);
        }
      }
    }

    // 3. Deletar o registro do produto da tabela 'products'
    const { error: deleteError } = await supabase.from('products').delete().eq('id', id);
    if (deleteError) {
      throw deleteError;
    }

    // 4. Atualizar o estado local para remover o produto da lista
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
