// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext'; // Use o hook useAuth

export default function Navbar() {
  // Apenas uma linha para obter o estado do contexto
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const PERMISSAO_ADMIN = 1;

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

          {isAuthenticated && (
            <Link href="/Emprestimos/meus-livros" className="hover:text-gray-300">
              Meus Livros
            </Link>
          )}

          {user.permissao === PERMISSAO_ADMIN && (
            <Link href="/admin/livros" className="bg-purple-600 px-3 py-1 rounded hover:bg-purple-700 transition">
              Gerenciamento
            </Link>
          )}

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