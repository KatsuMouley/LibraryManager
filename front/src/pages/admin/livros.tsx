// src/pages/admin/livros.tsx
'use client';
import { useFetch } from '@/hooks/useFetch';
import { Livro } from '@/types/interfaces';
import LivroCard from '@/components/LivroCard';
import Link from 'next/link';
import API from '@/services/api';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext'; // <<<<< Use o hook useAuth

export default function GerenciarLivros() {
  // Permissões que dão acesso a esta página
  const PERMISSAO_GERENTE = 1;

  // <<<<< NOVO: Use o useAuth para obter o estado de autenticação >>>>>
  const { user, isCheckingAuth } = useAuth();

  const { data: livros, loading: loadingLivros, error: errorLivros, refetch } = useFetch<Livro[]>('/Livros/listar');
  const router = useRouter();

  // <<<<< NOVO: Lógica de redirecionamento simplificada >>>>>
  if (isCheckingAuth) {
    return <p className="p-6 text-center">Verificando permissões...</p>;
  }
  if (!user.id || user.permissao === null || user.permissao < PERMISSAO_GERENTE) {
    router.push('/auth/login');
    return null;
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      try {
        await API.delete(`/Livros/${id}`);
        alert('Livro excluído com sucesso!');
        refetch();
      } catch (err) {
        alert('Erro ao excluir livro.');
        console.error(err);
      }
    }
  };

  if (loadingLivros) return <p className="p-6 text-center">Carregando livros para gerenciamento…</p>;
  if (errorLivros) return <p className="p-6 text-center text-red-600">Falha ao carregar a lista de livros.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Livros</h1>
        <div>
          <Link href="/admin/livros/novo" className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition mr-4">
            + Novo Livro
          </Link>
          <Link href="/admin/autores" className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition">
            Gerenciar Autores
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {livros?.map((livro) => (
          <LivroCard 
            key={livro.id} 
            livro={livro} 
            userPermissao={user.permissao} // Passa a permissão do contexto
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}