// src/components/Navbar.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getToken, removeToken } from '@/utils/auth';
import { useRouter } from 'next/router';
import { listenToAuthEvent, removeAuthListener } from '@/utils/events'; 
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string; 
}

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPermissao, setUserPermissao] = useState<number | null>(null);
  const router = useRouter();

  const PERMISSAO_ADMIN = 1;

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = getToken();
      setIsAuthenticated(!!token);
      if (token) {
        try {
          const decoded = jwtDecode<UserPayload>(token);
          const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
          const roleValue = decoded[roleClaimKey];
          let permissaoNumerica: number | null = null;
          if (roleValue) {
            switch (roleValue.toLowerCase()) {
              case 'usuario': permissaoNumerica = 0; break;
              case 'administrador': permissaoNumerica = 1; break;
              default: {
                const numericValue = Number(roleValue);
                permissaoNumerica = !isNaN(numericValue) ? numericValue : 0;
              }
            }
            setUserPermissao(permissaoNumerica);
          } else { setUserPermissao(null); }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { setUserPermissao(null); }
      } else { setUserPermissao(null); }
    };

    checkAuthStatus();
    listenToAuthEvent(checkAuthStatus);
    return () => { removeAuthListener(checkAuthStatus); };
  }, []);

  const handleLogout = () => {
    removeToken();
    router.push('/auth/login');
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

          {/* BOTÃO MEUS LIVROS (SÓ PARA USUÁRIOS LOGADOS) */}
          {isAuthenticated && (
            <Link href="/Emprestimos/meus-livros" className="hover:text-gray-300">
              Meus Livros
            </Link>
          )}

          {/* BOTÃO DE GERENCIAMENTO (SÓ PARA ADMINS) */}
          {userPermissao === PERMISSAO_ADMIN && (
            <Link href="/admin/livros" className="bg-purple-600 px-3 py-1 rounded hover:bg-purple-700 transition">
              Gerenciamento
            </Link>
          )}

          {/* Renderização condicional dos links de autenticação */}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition">
              Sair
            </button>
          ) : (
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