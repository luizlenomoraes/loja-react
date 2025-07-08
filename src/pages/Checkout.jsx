import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

const MERCADO_PAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

export default function Checkout() {
  const { cartItems, cartTotal } = useCart();
  const { user, loading: authLoading } = useAuth(); // Pega o status de loading do usuário
  const navigate = useNavigate();
  
  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redireciona se o carrinho estiver vazio, mas apenas depois que a autenticação carregar
    if (!authLoading && cartItems.length === 0) {
      navigate('/produtos');
    }
  }, [cartItems, authLoading, navigate]);

  useEffect(() => {
    if (MERCADO_PAGO_PUBLIC_KEY) {
      initMercadoPago(MERCADO_PAGO_PUBLIC_KEY, { locale: 'pt-BR' });
    } else {
      setError('A chave pública do Mercado Pago não foi configurada.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Condição de guarda para não executar antes de ter tudo o que precisa
    if (cartItems.length === 0 || !MERCADO_PAGO_PUBLIC_KEY || !user) {
      return;
    }

    const createPreference = async () => {
      setIsLoading(true);
      setError('');
      try {
        const { data, error: functionError } = await supabase.functions.invoke('create-preference', {
          body: { 
            items: cartItems.map(item => ({
              id: item.id,
              title: item.name,
              quantity: item.quantity,
              unit_price: item.price,
              currency_id: 'BRL',
            })),
            payer: { email: user.email }
          },
        });

        if (functionError) throw new Error(functionError.message);
        if (data.id) {
          setPreferenceId(data.id);
        } else {
          throw new Error('Não foi possível obter o ID da preferência.');
        }

      } catch (err) {
        console.error('Erro ao criar preferência:', err);
        setError('Falha ao iniciar o pagamento. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    createPreference();
  }, [cartItems, user]); // Depende apenas do carrinho e do usuário

  // Renderiza um estado de carregamento mais robusto
  if (authLoading || (isLoading && cartItems.length > 0)) {
    return <div className="text-center py-8">Carregando checkout...</div>;
  }
  
  if (cartItems.length === 0) {
    return <div className="text-center py-8">Seu carrinho está vazio. Redirecionando...</div>;
  }
  
  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Compra</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Resumo do Pedido</h2>
          <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-gray-600">{item.name} (x{item.quantity})</span>
                <span className="font-semibold">{(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span>{cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pagamento</h2>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center min-h-[150px] flex items-center justify-center">
            {preferenceId && (
              <Wallet 
                initialization={{ preferenceId: preferenceId }} 
                // O onReady não é mais usado para limpar o carrinho
              />
            )}
            {!preferenceId && !error && <p>Aguardando para iniciar o pagamento...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
