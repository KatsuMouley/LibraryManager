'use client';
import Link from 'next/link';
import { removeToken } from '@/utils/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const logout = () => {
    removeToken();
    router.push('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex gap-4">
      <Link href="/livros">Livros</Link>
      <Link href="/autores">Autores</Link>
      <Link href="/emprestimos">Empréstimos</Link>
      <button onClick={logout}>Sair</button>
    </nav>
  );
}
