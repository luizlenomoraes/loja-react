import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Header from './components/Header';
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import { ProductProvider } from './contexts/ProductContext';
// Contextos e páginas serão importados conforme implementados

function App() {
  return (
    <ProductProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          {/* Rotas principais */}
          <Route path="/" element={<div>Home</div>} />
          <Route path="/produtos" element={<ProductList />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/carrinho" element={<div>Carrinho</div>} />
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
        {/* Footer */}
      </div>
    </ProductProvider>
  );
}

export default App; 