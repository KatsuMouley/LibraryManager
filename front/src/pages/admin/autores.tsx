// src/pages/admin/autores.tsx
'use client';
import { useFetch } from '@/hooks/useFetch';
import { Autor } from '@/types/interfaces';
import AutorCard from '@/components/AutorCard';
import Link from 'next/link';
import API from '@/services/api';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function GerenciarAutores() {
  const { user, isCheckingAuth } = useAuth();
  const router = useRouter();
  
  const PERMISSAO_GERENTE = 1;

  // Proteção de rota
  if (isCheckingAuth) {
    return <p className="p-6 text-center">Verificando permissões...</p>;
  }
  if (!user.id || user.permissao < PERMISSAO_GERENTE) {
    router.push('/explorar');
    return null;
  }

  const { data: autores, loading, error, refetch } = useFetch<Autor[]>('/Autor/listar');

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este autor? Isso pode afetar livros!')) {
      try {
        await API.delete(`/Autor/deletar/${id}`);
        alert('Autor excluído com sucesso!');
        refetch();
      } catch (err) {
        alert('Erro ao excluir autor. Verifique se ele não tem livros associados.');
        console.error(err);
      }
    }
  };

  if (loading) return <p className="p-6 text-center">Carregando autores…</p>;
  if (error) return <p className="p-6 text-center text-red-600">Falha ao carregar a lista de autores.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Autores</h1>
        <Link href="/admin/autores/novo" className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition">
          + Novo Autor
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {autores?.map((autor) => (
          <AutorCard key={autor.id} autor={autor} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}