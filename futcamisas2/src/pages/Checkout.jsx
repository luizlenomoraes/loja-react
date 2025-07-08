import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

// Chave pública de teste do Mercado Pago. Substitua pela sua chave em produção.
// É seguro mantê-la no frontend.
const MERCADO_PAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Inicializa o SDK do Mercado Pago
  useEffect(() => {
    if (MERCADO_PAGO_PUBLIC_KEY) {
      initMercadoPago(MERCADO_PAGO_PUBLIC_KEY);
    } else {
      setError('A chave pública do Mercado Pago não foi configurada.');
      setIsLoading(false);
    }
  }, []);

  // Cria a preferência de pagamento no backend via Supabase Edge Function
  useEffect(() => {
    // Não prossegue se não houver itens ou se já estiver carregando
    if (cartItems.length === 0 || !MERCADO_PAGO_PUBLIC_KEY) {
      setIsLoading(false);
      return;
    }

    const createPreference = async () => {
      setIsLoading(true);
      setError('');
      try {
        // Chama a Supabase Edge Function para criar a preferência
        const { data, error: functionError } = await supabase.functions.invoke('create-preference', {
          body: { 
            items: cartItems.map(item => ({
              id: item.id,
              title: item.name,
              quantity: item.quantity,
              unit_price: item.price,
              currency_id: 'BRL',
            })),
            payer: {
              email: user.email,
            }
          },
        });

        if (functionError) {
          throw new Error(functionError.message);
        }

        if (data.id) {
          setPreferenceId(data.id);
        } else {
          throw new Error('Não foi possível obter o ID da preferência.');
        }

      } catch (err) {
        console.error('Erro ao criar preferência:', err);
        setError('Falha ao iniciar o pagamento. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    createPreference();
  }, [cartItems, user.email]); // Recria a preferência se o carrinho ou usuário mudar

  // Ação executada quando o pagamento é concluído
  const handleOnReady = () => {
    // O ideal é que o backend confirme o pagamento via Webhooks.
    // Para simplificar, limpamos o carrinho aqui.
    // AVISO: Isso não garante que o pagamento foi aprovado.
    clearCart();
  };
  
  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Finalizar Compra</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Resumo do Pedido */}
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

        {/* Área de Pagamento */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pagamento</h2>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            {isLoading && <p>Carregando o sistema de pagamento...</p>}
            {!isLoading && preferenceId && (
              <Wallet 
                initialization={{ preferenceId: preferenceId }} 
                onReady={handleOnReady}
                customization={{ texts:{ valueProp: 'smart_option'}}} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
