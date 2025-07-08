import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

const MP_API_URL = 'https://api.mercadopago.com/checkout/preferences';
const MP_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!MP_ACCESS_TOKEN) {
      throw new Error("O segredo MERCADO_PAGO_ACCESS_TOKEN não foi configurado no Supabase.");
    }

    const { items, payer } = await req.json();
    if (!items || items.length === 0) {
      throw new Error("O corpo da requisição deve conter um array de itens.");
    }

    // **CORREÇÃO PRINCIPAL AQUI**
    // Definimos a URL diretamente para o teste.
    const siteUrl = 'http://localhost:5173';

    const preferenceBody = {
      items: items,
      payer: payer,
      back_urls: {
        success: `${siteUrl}/payment/success`,
        failure: `${siteUrl}/payment/failure`,
        pending: `${siteUrl}/payment/failure`,
      },
      auto_return: 'approved',
    };

    const response = await fetch(MP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preferenceBody),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`Erro da API do Mercado Pago: ${JSON.stringify(responseData)}`);
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("[EDGE FUNCTION ERROR]:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
