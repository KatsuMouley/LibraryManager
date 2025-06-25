// src/pages/admin/livros.tsx
'use client';
import { useFetch } from '@/hooks/useFetch';
import { Livro } from '@/types/interfaces';
import LivroCard from '@/components/LivroCard';
import Link from 'next/link';
import API from '@/services/api';
import { useRouter } from 'next/router'; // Ensure this is from 'next/router' for Pages Router
import { useState, useEffect } from 'react';
import { getToken } from '@/utils/auth';
import { listenToAuthEvent, removeAuthListener } from '@/utils/events';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string; 
}

export default function GerenciarLivros() {
  // Permissões que dão acesso a esta página
  const PERMISSAO_GERENTE = 1;

  const { data: livros, loading: loadingLivros, error: errorLivros, refetch } = useFetch<Livro[]>('/Livros/listar');
  const router = useRouter();

  const [userPermissao, setUserPermissao] = useState<number | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // New state to handle loading during auth check

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = getToken();
      let permissao: number | null = null;
      
      if (token) {
        try {
          const decoded = jwtDecode<UserPayload>(token);
          const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
          const roleValue = decoded[roleClaimKey];
          if (roleValue) {
            switch (roleValue.toLowerCase()) {
              case 'usuario': permissao = 0; break;
              case 'administrador': permissao = 1; break;
              default: {
                const numericValue = Number(roleValue);
                permissao = !isNaN(numericValue) ? numericValue : 0;
              }
            }
          }
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
          permissao = null;
        }
      }
      setUserPermissao(permissao);
      setIsCheckingAuth(false); // Authentication check is complete
    };
    
    checkAuthStatus();
    listenToAuthEvent(checkAuthStatus);
    return () => { removeAuthListener(checkAuthStatus); };
  }, []);

  // --- Mude a lógica de redirecionamento para DENTRO de um useEffect ---
  useEffect(() => {
    if (!isCheckingAuth) {
      if (userPermissao === null) {
        router.push('/auth/login');
      } else if (userPermissao < PERMISSAO_GERENTE) {
        router.push('/explorar');
      }
    }
  }, [userPermissao, isCheckingAuth, router]);

  // Exibe um estado de carregamento enquanto verifica a autenticação
  if (isCheckingAuth || userPermissao === null || userPermissao < PERMISSAO_GERENTE) {
    // Se ainda estiver verificando ou não tiver permissão, não renderiza a página completa
    return <p className="p-6 text-center">Verificando permissões...</p>;
  }

  // --- O resto do seu componente permanece inalterado ---

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      try {
        await API.delete(`/Livros/${id}`);
        alert('Livro excluído com sucesso!');
        refetch(); // Recarrega a lista de livros após a exclusão
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
         <div className='justify-between'> {/* <<<< NOVO: Envolve os botões em um div */}
          <Link href="/admin/livros/novo" className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition mr-4">
            + Novo Livro
          </Link>
          <Link href="/admin/autores" className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition">
            Gerenciar Autores
          </Link>
        </div> {/* <<<< FIM DO NOVO DIV */}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {livros?.map((livro) => (
          <LivroCard 
            key={livro.id} 
            livro={livro} 
            userPermissao={userPermissao}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}