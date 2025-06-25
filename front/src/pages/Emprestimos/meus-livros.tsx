// src/pages/Emprestimos/meus-livros.tsx
'use client';
import { useFetch } from '@/hooks/useFetch';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Emprestimo, Livro, Usuario } from '@/types/interfaces';
import API from '@/services/api';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getToken } from '@/utils/auth';
import { listenToAuthEvent, removeAuthListener } from '@/utils/events';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UserPayload {
  'http://schemas.microsoft.com/ws/2005/05/identity/claims/nameidentifier'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
}

export default function MeusEmprestimosPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Lógica de verificação de autenticação
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsAuthenticated(!!getToken());
      setIsCheckingAuth(false);
    };
    checkAuthStatus();
    listenToAuthEvent(checkAuthStatus);
    return () => { removeAuthListener(checkAuthStatus); };
  }, []);

  // 1. Hook para buscar os empréstimos do usuário logado
  const { data: emprestimos, loading, error, refetch } = useFetch<Emprestimo[]>(
    isAuthenticated ? '/Emprestimos/meus-emprestimos' : null
  );

  // 2. NOVO: Hook para buscar a lista de todos os livros
  const { data: livros, loading: loadingLivros } = useFetch<Livro[]>(
    isAuthenticated ? '/Livros/listar' : null
  );

  // Redirecionamento se o usuário não estiver autenticado
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isCheckingAuth, router]);

  // Função para lidar com a devolução
  const handleDevolver = async (emprestimoId: number) => {
    if (window.confirm('Tem certeza que deseja devolver este livro?')) {
      try {
        console.log('DEBUG: Enviando requisição de devolução para ID:', emprestimoId);
        await API.put(`/Emprestimos/devolver/${emprestimoId}`);
        
        // Dispara o refetch para recarregar os dados do useFetch
        refetch(); 
        console.log('DEBUG: Refetch disparado. Verifique a aba Network.');
        
        alert('Livro devolvido com sucesso!');
      } catch (err) {
        alert('Erro ao registrar devolução.');
        console.error(err);
      }
    }
  };
  
  // NOVO: Função para encontrar o título do livro pelo ID
  const getLivroTitulo = (livroId: number) => {
    if (!livros) return 'Carregando título...';
    return livros.find(l => l.id === livroId)?.titulo || 'Título não encontrado';
  };

  // Exibe estado de carregamento
  if (isCheckingAuth || !isAuthenticated) {
    return <p className="p-6 text-center">Verificando autenticação...</p>;
  }
  if (loading || loadingLivros) return <p className="p-6 text-center">Carregando seus empréstimos…</p>;
  if (error) return <p className="p-6 text-center text-red-600">Falha ao carregar empréstimos.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Meus Livros Emprestados</h1>
      
      {emprestimos?.length === 0 ? (
        <p className="text-center text-gray-500">Você não possui livros emprestados.</p>
      ) : (
        <ul className="space-y-4">
          {emprestimos?.map(emp => (
            <li key={emp.id} className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center">
              <div>
                {/* CORRIGIDO: Agora mostra o título em vez do ID */}
                <p>Livro: **{getLivroTitulo(emp.livroId)}**</p> 
                <p>Empréstimo: {new Date(emp.dataEmprestimo).toLocaleDateString('pt-BR')}</p>
                <p>Devolução Prevista: {new Date(emp.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}</p>
                {/* CORRIGIDO: Agora verifica 'dataDevolucao' */}
                {emp.dataDevolucao ? (
                  <p className="text-green-600 font-bold">Devolvido em: {new Date(emp.dataDevolucao).toLocaleDateString('pt-BR')}</p>
                ) : (
                  <p className="text-red-500 font-bold">Ainda não devolvido</p>
                )}
              </div>
              {!emp.dataDevolucao && (
                <button
                  onClick={() => handleDevolver(emp.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Devolver
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}