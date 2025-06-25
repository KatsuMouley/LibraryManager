// src/pages/explorar/index.tsx
'use client';
import { useFetch } from '@/hooks/useFetch';
import LivroCard from '@/components/LivroCard';
import { Livro, Emprestimo } from '@/types/interfaces';
import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Use o hook useAuth

export default function Explorar() {
  // Apenas uma linha para obter o estado do contexto
  const { user, isAuthenticated } = useAuth();
  const userPermissao = user.permissao;

  const { data: todosOsLivros, loading, error } = useFetch<Livro[]>('/Livros/listar');

  const { data: emprestimosUsuario } = useFetch<Emprestimo[]>(
    isAuthenticated ? '/Emprestimos/meus-emprestimos' : null
  );

  const [termoDeBusca, setTermoDeBusca] = useState('');

  const livrosComStatus = useMemo(() => {
    if (!todosOsLivros) return [];
    
    const livrosEmprestadosIds = new Set(
      emprestimosUsuario
        ?.filter(emp => emp.dataDevolucao === null)
        .map(emp => emp.livroId)
    );

    return todosOsLivros.filter(livro =>
      livro.titulo.toLowerCase().includes(termoDeBusca.toLowerCase())
    ).map(livro => ({
      ...livro,
      isEmprestado: livrosEmprestadosIds.has(livro.id)
    }));
  }, [todosOsLivros, termoDeBusca, emprestimosUsuario]);

  if (loading) return <p className="text-center p-6">Carregando acervo…</p>;
  if (error) return <p className="text-center text-red-600 p-6">Falha ao carregar acervo.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Explorar Acervo</h1>
      
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Buscar livros por título..."
          value={termoDeBusca}
          onChange={e => setTermoDeBusca(e.target.value)}
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {livrosComStatus.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">Nenhum livro encontrado.</p>
        ) : (
          livrosComStatus.map((livro) => (
            <LivroCard 
              key={livro.id} 
              livro={livro} 
              userPermissao={userPermissao === 1 ? 0 : userPermissao}
              isEmprestado={livro.isEmprestado}
            />
          ))
        )}
      </div>
    </div>
  );
}