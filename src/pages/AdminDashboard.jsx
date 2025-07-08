import React, { useState, useEffect } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente de formulário com gerenciamento avançado de imagens.
 */
function ProductForm({ product, onSave, onCancel }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(
    product || { name: '', description: '', price: '', image_urls: [], category: '', stock_quantity: 0 }
  );
  const [newImageFiles, setNewImageFiles] = useState([]); // Armazena os arquivos de imagem
  const [previews, setPreviews] = useState([]); // Armazena as URLs de prévia
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gera prévias para os novos arquivos selecionados
  useEffect(() => {
    if (newImageFiles.length === 0) {
      setPreviews([]);
      return;
    }
    const previewUrls = newImageFiles.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);

    // Limpa as URLs de prévia da memória quando o componente é desmontado
    return () => previewUrls.forEach(url => URL.revokeObjectURL(url));
  }, [newImageFiles]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setNewImageFiles(Array.from(e.target.files));
    }
  };
  
  const handleRemoveExistingImage = async (urlToRemove) => {
    const imagePath = urlToRemove.split('/product-images/')[1];
    if (!imagePath) {
        alert("Não foi possível extrair o caminho da imagem.");
        return;
    }
    const { error } = await supabase.storage.from('product-images').remove([imagePath]);
    if (error) {
      alert("Falha ao remover a imagem do armazenamento.");
      console.error("Erro ao remover imagem do storage:", error);
      return;
    }
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter(url => url !== urlToRemove)
    }));
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setNewImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSetNewPrimary = (indexToMove) => {
      setNewImageFiles(prev => {
          const itemToMove = prev[indexToMove];
          const remainingItems = prev.filter((_, index) => index !== indexToMove);
          return [itemToMove, ...remainingItems];
      });
  };

  const handleSetExistingPrimary = (urlToMakePrimary) => {
    setFormData(prev => ({
        ...prev,
        image_urls: [
            urlToMakePrimary,
            ...prev.image_urls.filter(url => url !== urlToMakePrimary)
        ]
    }));
  };

  const handleUploadImages = async () => {
    if (newImageFiles.length === 0) return [];
    const uploadPromises = newImageFiles.map(file => {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      return supabase.storage.from('product-images').upload(fileName, file);
    });
    const results = await Promise.all(uploadPromises);
    const urls = results.map(result => {
      if (result.error) throw result.error;
      const { data } = supabase.storage.from('product-images').getPublicUrl(result.data.path);
      return data.publicUrl;
    });
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const uploadedImageUrls = await handleUploadImages();
      const finalImageUrls = [...(formData.image_urls || []), ...uploadedImageUrls];
      
      const dataToSave = { 
        ...formData, 
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity, 10),
        image_urls: finalImageUrls,
      };
      await onSave(dataToSave);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Falha ao salvar o produto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{product ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos de texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="name" placeholder="Nome do Produto" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
            <input type="number" name="price" placeholder="Preço (ex: 99.90)" step="0.01" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
            <input type="text" name="category" placeholder="Categoria" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
            <input type="number" name="stock_quantity" placeholder="Quantidade em Estoque" value={formData.stock_quantity} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
        <div className="mt-6">
          <textarea name="description" placeholder="Descrição do Produto" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" rows="4" />
        </div>
        
        {/* Gerenciamento de Imagens */}
        <div className="mt-6">
          <label className="block text-gray-700 mb-2">Imagens (a primeira da lista é a principal)</label>
          
          {/* Imagens Existentes */}
          {formData.image_urls?.length > 0 && (
            <div className="p-4 border rounded-lg mb-4">
              <p className="text-sm font-semibold mb-2">Imagens Atuais</p>
              <div className="flex flex-wrap gap-4">
                {formData.image_urls.map((url, index) => (
                  <div key={url} className="relative group">
                    <img src={url} alt={`Produto ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                    <div className="absolute top-0 right-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="Remover Imagem" type="button" onClick={() => handleRemoveExistingImage(url)} className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-xs">X</button>
                      {index > 0 && <button title="Definir como Principal" type="button" onClick={() => handleSetExistingPrimary(url)} className="bg-yellow-400 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-lg">★</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prévia de Novas Imagens */}
          {previews.length > 0 && (
            <div className="p-4 border rounded-lg mb-4">
              <p className="text-sm font-semibold mb-2">Novas Imagens (Prévia)</p>
              <div className="flex flex-wrap gap-4">
                {previews.map((previewUrl, index) => (
                  <div key={previewUrl} className="relative group">
                    <img src={previewUrl} alt={`Nova Imagem ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                     <div className="absolute top-0 right-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="Remover Imagem" type="button" onClick={() => handleRemoveNewImage(index)} className="bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-xs">X</button>
                      {index > 0 && <button title="Definir como Principal" type="button" onClick={() => handleSetNewPrimary(index)} className="bg-yellow-400 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-lg">★</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <input type="file" multiple onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded font-semibold hover:bg-gray-600">Cancelar</button>
          <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded font-semibold hover:bg-green-700" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
}

// O componente AdminDashboard continua o mesmo
export default function AdminDashboard() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  const [view, setView] = useState('list');
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleSave = async (productData) => {
    const { id, created_at, ...dataToSave } = productData;
    if (currentProduct) {
      await updateProduct(currentProduct.id, dataToSave);
    } else {
      await addProduct(dataToSave);
    }
    setView('list');
    setCurrentProduct(null);
  };
  
  const handleAddNew = () => { setCurrentProduct(null); setView('form'); };
  const handleEdit = (product) => { setCurrentProduct(product); setView('form'); };
  const handleDelete = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto? A ação não pode ser desfeita.')) {
      await deleteProduct(productId);
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erro: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Painel Administrativo</h1>
      {view === 'list' ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Gerenciar Produtos</h2>
            <button onClick={handleAddNew} className="bg-green-600 text-white py-2 px-4 rounded font-semibold hover:bg-green-700">
              Adicionar Novo Produto
            </button>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Produto</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Preço</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900">{product.name}</p></td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p></td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <ProductForm product={currentProduct} onSave={handleSave} onCancel={() => setView('list')} />
      )}
    </div>
  );
}
