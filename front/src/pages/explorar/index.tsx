// src/pages/explorar/index.tsx
'use client';

import { useFetch } from '@/hooks/useFetch';
import LivroCard from '@/components/LivroCard';
import { Livro, Emprestimo } from '@/types/interfaces';
import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Explorar() {
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
    <div className="min-h-screen bg-gray-100">
      {/* ===== NOVO: Seção Hero com a barra de busca centralizada ===== */}
      <div className="bg-gray-900 text-white py-20 px-6 sm:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl sm:text-7xl font-extrabold mb-4 animate-fade-in-down">
            Explore o Conhecimento
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Encontre livros, artigos e pesquisas para o seu próximo projeto.
          </p>
          {/* Barra de busca com ícone */}
          <div className="relative w-full max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Buscar publicações, autores, palavras-chave..."
              value={termoDeBusca}
              onChange={e => setTermoDeBusca(e.target.value)}
              className="w-full pl-6 pr-12 py-4 rounded-full border-2 border-gray-700 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-300 text-lg"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Lista de livros ===== */}
      <div className="p-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Acervo Completo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
    </div>
  );
}