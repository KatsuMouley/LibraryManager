// src/pages/livros/[id].tsx
'use client';
import { useRouter } from 'next/router';
import { useFetch } from '@/hooks/useFetch';
import { Livro, Autor } from '@/types/interfaces';
import API from '@/services/api';
import { getUserIdFromToken } from '@/utils/auth'; // Importe a função para o ID do usuário
import { useState, useEffect } from 'react';
import { getToken } from '@/utils/auth';
import { listenToAuthEvent, removeAuthListener } from '@/utils/events';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jwtDecode } from 'jwt-decode';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UserPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string; 
}

export default function LivroDetalhePage() {
  const router = useRouter();
  const { id } = router.query; // Obtém o ID da URL

  // Estado de autenticação para renderização condicional
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Lógica para verificar a autenticação
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = getToken();
      setIsAuthenticated(!!token);
      setIsCheckingAuth(false);
    };
    checkAuthStatus();
    listenToAuthEvent(checkAuthStatus);
    return () => { removeAuthListener(checkAuthStatus); };
  }, []);


  // Hook para buscar os detalhes do livro
  // A URL só é válida se o ID existir e for uma string
  const { data: livro, loading, error } = useFetch<Livro>(
    id && typeof id === 'string' ? `/Livros/${id}` : null
  );
  
  // Hook para buscar os detalhes do autor (executa apenas após o livro ser carregado)
  const { data: autor, loading: loadingAutor } = useFetch<Autor>(
    livro?.autorId ? `/Autor/${livro.autorId}` : null
  );
  
  // Lógica de empréstimo (similar à do LivroCard)
  const handleEmprestar = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert('Você precisa estar logado para emprestar um livro.');
      router.push('/auth/login');
      return;
    }

    if (window.confirm(`Tem certeza que deseja emprestar o livro "${livro?.titulo}"?`)) {
      try {
        const payload = {
          livroId: livro?.id,
          usuarioId: userId,
          dataEmprestimo: new Date().toISOString(),
          dataDevolucaoPrevista: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        
        await API.post('/Emprestimos/cadastrar', payload);
        
        alert(`Livro "${livro?.titulo}" emprestado com sucesso!`);
        router.push('/Emprestimos/meus-livros');
      } catch (err) {
        alert('Erro ao registrar o empréstimo. O livro pode já estar emprestado.');
        console.error(err);
      }
    }
  };
  
  // Estados de carregamento e erro
  if (isCheckingAuth || loading || loadingAutor) return <p className="p-6 text-center">Carregando detalhes do livro...</p>;
  if (error) return <p className="p-6 text-center text-red-600">Falha ao carregar o livro. Verifique se o ID está correto.</p>;
  if (!livro) return <p className="p-6 text-center text-gray-500">Livro não encontrado.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{livro.titulo}</h1>
      <p className="text-gray-700 mb-2">
        **Autor:** {autor ? autor.nome : 'N/A'}
      </p>
      <p className="text-gray-700 mb-4">
        **Ano de Publicação:** {livro.anoPublicacao}
      </p>

      <div className="flex gap-4">
        {/* Botão de Empréstimo (visível apenas para usuários logados) */}
        {isAuthenticated && (
          <button
            onClick={handleEmprestar}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow-md hover:bg-blue-700 transition"
          >
            Emprestar Livro
          </button>
        )}
      </div>
    </div>
  );
}