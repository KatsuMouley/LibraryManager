// pages/auth/register.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { register } from '@/services/auth';
import axios, { AxiosError } from 'axios';

export default function Register() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [permissao, setPermissao] = useState(1);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const router = useRouter();

    
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErro('');
  setSucesso('');

  try {
    await register({ email, senha, permissao });
    setSucesso('Cadastro realizado com sucesso! Redirecionando para login…');
    setTimeout(() => router.push('/auth/login'), 1500);
  } catch (error: unknown) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      // Aqui o TypeScript sabe que é um AxiosError
      const axiosError = error as AxiosError<{ message: string }>;
      setErro(
        axiosError.response?.data?.message ||
        'Falha no cadastro. Verifique seus dados e tente novamente.'
      );
    } else if (error instanceof Error) {
      // Outro tipo de erro JS
      setErro(error.message);
    } else {
      // Erro totalmente inesperado
      setErro('Falha inesperada. Tente novamente mais tarde.');
    }
  }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6">Cadastro de Usuário</h1>

                {erro && <p className="text-red-500 mb-4">{erro}</p>}
                {sucesso && <p className="text-green-600 mb-4">{sucesso}</p>}

                <label className="block mb-3">
                    <span className="text-gray-700">Email</span>
                    <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label className="block mb-3">
                    <span className="text-gray-700">Senha</span>
                    <input
                        type="password"
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        required
                    />
                </label>

                <label className="block mb-6">
                    <span className="text-gray-700">Permissão</span>
                    <select
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                        value={permissao}
                        onChange={e => setPermissao(Number(e.target.value))}
                    >
                        <option value={1}>Usuário</option>
                        <option value={2}>Bibliotecário</option>
                        <option value={3}>Administrador</option>
                    </select>
                </label>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Cadastrar
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Já tem conta?{' '}
                    <a href="/auth/login" className="text-blue-600 hover:underline">
                        Faça login
                    </a>
                </p>
            </form>
        </div>
    );
}
