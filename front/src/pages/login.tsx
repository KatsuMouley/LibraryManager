'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/services/api';
import { setToken } from '@/utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

// pages/login.tsx
const handleLogin = async () => {
  try {
    const res = await API.post('/Usuario/login', { email, senha });
    console.log('login response:', res.data);
    // supondo que venha em res.data.token
    setToken(res.data.token);
    router.push('/livros');
  } catch {
    alert('Credenciais inválidas.');
  }
};


  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <input
        className="border mb-2 p-2"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="border mb-4 p-2"
        type="password"
        placeholder="Senha"
        onChange={e => setSenha(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Entrar
      </button>
    </div>
  );
}
