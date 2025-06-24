//pages/auth/login
'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '@/services/auth';
import { setToken } from '@/utils/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    try {
      const token = await login({ email, senha });
      setToken(token);
      router.push('/explorar');
    } catch {
      setErro('Email ou senha inválidos.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        {erro && <p className="text-red-600">{erro}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Entrar
        </button>
      </form>
      <p className="mt-4">
        Ainda não tem conta? <a href="/auth/cadastro" className="text-blue-600 underline">Cadastre-se</a>
      </p>
    </div>
  );
}
