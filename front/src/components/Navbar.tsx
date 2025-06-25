// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const PERMISSAO_ADMIN = 1;

  return (
    <nav className="bg-gray-900 text-white py-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border-b-2 border-purple-500 transition-all duration-300 ease-in-out">
      <div className="container mx-auto max-w-7xl px-6 flex justify-between items-center relative">
        
        {/* ===== NOVO: Links de Usuário no Canto Esquerdo ===== */}
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link href="/Emprestimos/meus-livros" className="hover:text-gray-300 font-semibold transition">
                Meus Livros
              </Link>
              {user.permissao === PERMISSAO_ADMIN && (
                <Link href="/admin/livros" className="hover:text-gray-300 font-semibold transition">
                  Gerenciamento
                </Link>
              )}
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-gray-300 font-semibold transition">
                Entrar
              </Link>
              <Link href="/auth/register" className="bg-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition">
                Cadastrar
              </Link>
            </>
          )}
        </div>

        {/* ===== NOVO: Título Centralizado ===== */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-3xl font-bold tracking-wider hover:text-gray-300 transition">
            ACERVO
          </Link>
        </div>
        
        {/* ===== NOVO: Link Explorar e Sair no Canto Direito ===== */}
        <div className="flex items-center space-x-6">
          <Link href="/explorar" className="hover:text-gray-300 font-semibold transition">
            Explorar
          </Link>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Sair
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}