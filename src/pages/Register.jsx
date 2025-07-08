import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await register(form);
      navigate('/');
      // O ideal é usar um modal customizado em vez do alert.
      alert('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.');
    } catch (err) {
      setError(err.message || 'Erro ao registrar. Tente outro email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-600 text-center">Criar Conta</h2>
        <div className="space-y-4">
            <input type="text" name="full_name" placeholder="Nome Completo" value={form.full_name} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
            <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
            <input type="tel" name="phone" placeholder="Telefone (Opcional)" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
            <input type="password" name="password" placeholder="Senha (mínimo 6 caracteres)" value={form.password} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
        {error && <div className="text-red-600 my-4 text-center">{error}</div>}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition mt-6" disabled={submitting || loading}>
          {submitting || loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <div className="text-center mt-4">
          <span className="text-gray-600">Já tem conta?</span>{' '}
          <Link to="/login" className="text-green-600 hover:underline">Entrar</Link>
        </div>
      </form>
    </div>
  );
}
