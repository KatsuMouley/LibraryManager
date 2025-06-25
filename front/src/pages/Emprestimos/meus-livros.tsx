// src/pages/Emprestimos/meus-livros.tsx
'use client';
import { useFetch } from '@/hooks/useFetch';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Emprestimo, Livro, Usuario } from '@/types/interfaces';
import API from '@/services/api';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getToken, getUserIdFromToken } from '@/utils/auth'; // Importe getUserIdFromToken
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jwtDecode } from 'jwt-decode';
import { listenToAuthEvent, removeAuthListener } from '@/utils/events';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UserPayload {
  'http://schemas.microsoft.com/ws/2005/05/identity/claims/nameidentifier'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
}

export default function MeusEmprestimosPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Lógica de verificação de autenticação e obtenção do ID do usuário
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = getToken();
      if (token) {
        setIsAuthenticated(true);
        // <<<<<<< AQUI ESTÁ A MUDANÇA >>>>>>>>>
        const id = getUserIdFromToken(); // Use a função centralizada!
        setUserId(id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
      setIsCheckingAuth(false);
    };

    checkAuthStatus();
    listenToAuthEvent(checkAuthStatus);
    return () => { removeAuthListener(checkAuthStatus); };
  }, []);

  // Hook para buscar a lista de empréstimos (só se o usuário estiver logado)
  const { data: emprestimos, loading, error, refetch } = useFetch<Emprestimo[]>(
    isAuthenticated ? '/Emprestimos/listar' : null
  );

  // Redirecionamento se o usuário não estiver autenticado
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isCheckingAuth, router]);

  const handleDevolver = async (emprestimoId: number) => {
    if (window.confirm('Tem certeza que deseja devolver este livro?')) {
      try {
        await API.put(`/Emprestimos/devolver/${emprestimoId}`);
        alert('Livro devolvido com sucesso!');
        refetch(); // Recarrega a lista de empréstimos
      } catch (err) {
        alert('Erro ao registrar devolução.');
        console.error(err);
      }
    }
  };

  if (isCheckingAuth || !isAuthenticated) {
    return <p className="p-6 text-center">Verificando autenticação...</p>;
  }

  if (loading) return <p className="p-6 text-center">Carregando seus empréstimos…</p>;
  if (error) return <p className="p-6 text-center text-red-600">Falha ao carregar empréstimos.</p>;

  // Filtra os empréstimos para mostrar apenas os do usuário logado
  const meusEmprestimos = emprestimos?.filter(emp => emp.usuarioid === userId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Meus Livros Emprestados</h1>
      
      {meusEmprestimos?.length === 0 ? (
        <p className="text-center text-gray-500">Você não possui livros emprestados.</p>
      ) : (
        <ul className="space-y-4">
          {meusEmprestimos?.map(emp => (
            <li key={emp.id} className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center">
              <div>
                <p>Livro ID: **{emp.livroid}**</p>
                <p>Empréstimo: {new Date(emp.dataEmprestimo).toLocaleDateString('pt-BR')}</p>
                <p>Devolução Prevista: {new Date(emp.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}</p>
                {emp.dataDevolucaoReal ? (
                  <p className="text-green-600 font-bold">Devolvido em: {new Date(emp.dataDevolucaoReal).toLocaleDateString('pt-BR')}</p>
                ) : (
                  <p className="text-red-500 font-bold">Ainda não devolvido</p>
                )}
              </div>
              {!emp.dataDevolucaoReal && (
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