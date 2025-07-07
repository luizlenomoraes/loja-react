import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart'; // Importa a nova página do carrinho
import Header from './components/Header';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
// Os contextos agora são fornecidos no arquivo main.jsx

function App() {
  return (
    // O Provider do Produto foi movido para main.jsx para melhor organização
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-4 pb-8">
        <Routes>
          {/* Rotas principais */}
          <Route path="/" element={<ProductList />} /> {/* Alterado para mostrar a lista de produtos na home */}
          <Route path="/produtos" element={<ProductList />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/carrinho" element={<Cart />} /> {/* Adiciona a rota do carrinho */}
          <Route path="/checkout" element={
            <PrivateRoute>
              <div>Checkout</div>
            </PrivateRoute>
          } />
          <Route path="/conta" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={
            <AdminRoute>
              <div>Painel Admin</div>
            </AdminRoute>
          } />
          {/* Outras rotas */}
        </Routes>
      </main>
      {/* Aqui pode ir um Footer futuramente */}
    </div>
  );
}

export default App;
