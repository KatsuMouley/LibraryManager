// src/components/Navbar.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getToken, removeToken } from '@/utils/auth';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verifica o token no carregamento do componente
    setIsAuthenticated(!!getToken());
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    router.push('/auth/login'); // Redireciona para a página de login
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Acervo
        </Link>
        
        <div className="space-x-4">
          <Link href="/explorar" className="hover:text-gray-300">
            Explorar
          </Link>

          {/* Renderização condicional dos links */}
          {isAuthenticated ? (
            // Se autenticado, mostra o botão de Logout
            <>
              {/* Você pode adicionar mais links protegidos aqui, como 'Dashboard' */}
              <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition">
                Sair
              </button>
            </>
          ) : (
            // Se não autenticado, mostra os links de Login e Cadastro
            <>
              <Link href="/auth/login" className="hover:text-gray-300">
                Entrar
              </Link>
              <Link href="/auth/register" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition">
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}