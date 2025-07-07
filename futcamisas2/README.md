# Futcamisas2

Loja virtual de camisas de futebol, moderna, segura e escalável.

## Tecnologias
- React (Vite)
- Tailwind CSS
- Supabase (backend, autenticação, banco de dados)
- Mercado Pago (pagamentos)
- React Router

## Estrutura de Pastas
```
src/
  components/
  pages/
  contexts/
  services/
  App.jsx
  main.jsx
  index.css
```

## Como rodar o projeto
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure as variáveis de ambiente (veja `.env.example`).
3. Rode o projeto:
   ```bash
   npm run dev
   ```

## Funcionalidades
- Cadastro e login de usuários (Supabase Auth)
- Listagem, busca e detalhes de produtos
- Carrinho de compras
- Checkout com Mercado Pago
- Avaliações de produtos
- Cupons de desconto
- Painel administrativo (produtos, pedidos, cupons, usuários)

## Deploy
Pronto para deploy em Vercel, Netlify, etc.

---

Para dúvidas ou sugestões, abra uma issue! 