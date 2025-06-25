// src/components/LivroCard.tsx
'use client';
import { Livro } from '@/types/interfaces';
import Link from 'next/link';
import API from '@/services/api';
import { useRouter } from 'next/router';
import { getUserIdFromToken } from '@/utils/auth';
import { isAxiosError } from 'axios';
import { useState } from 'react'; // <<<<< NOVO: Importe useState

interface Props {
  livro: Livro & { isEmprestado?: boolean };
  onDelete?: (id: number) => void;
  userPermissao?: number | null; 
}

export default function LivroCard({ livro, onDelete, userPermissao }: Props) {
  const PERMISSAO_USUARIO_COMUM = 0; 
  const PERMISSAO_ADMIN_OR_BIBLIOTECARIO = 1; 

  const isGerente = userPermissao === PERMISSAO_ADMIN_OR_BIBLIOTECARIO;
  const isUsuarioComum = userPermissao === PERMISSAO_USUARIO_COMUM;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isNaoLogado = userPermissao === null;
  
  const router = useRouter();

  // <<<<<<< NOVO: Estados para as mensagens de feedback >>>>>>>>>
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleEmprestar = async () => {
    // Limpa mensagens antigas ao iniciar a ação
    setSuccessMessage('');
    setErrorMessage('');

    const userId = getUserIdFromToken();
    if (!userId) {
      setErrorMessage('Você precisa estar logado para emprestar um livro.');
      setTimeout(() => router.push('/auth/login'), 2000); // Redireciona após 2s
      return;
    }
    
    if (window.confirm(`Tem certeza que deseja emprestar o livro "${livro.titulo}"?`)) {
      try {
        const payload = { livroId: livro.id };
        
        await API.post('/Emprestimos/emprestar', payload);
        
        // <<<<<<< SUCESSO: Define a mensagem de sucesso >>>>>>>>>
        setSuccessMessage(`Livro "${livro.titulo}" emprestado com sucesso!`);
        
        // Redireciona após exibir a mensagem de sucesso por 2 segundos
        setTimeout(() => router.push('/Emprestimos/meus-livros'), 2000);
      } catch (error) {
        // <<<<<<< ERRO: Extrai a mensagem de erro e a exibe >>>>>>>>>
        console.error('Erro na requisição de empréstimo:', error);
        if (isAxiosError(error) && error.response) {
          const rawData = error.response.data;
          let friendlyMessage = 'Erro desconhecido.';
          if (typeof rawData === 'string') {
            if (rawData.includes('Usuário atingiu o limite')) {
              friendlyMessage = 'Limite de empréstimos atingido.';
            } else if (rawData.includes('Livro já está emprestado')) {
              friendlyMessage = 'Livro já está emprestado.';
            } else {
              friendlyMessage = rawData;
            }
          } else if (rawData?.message) {
            friendlyMessage = rawData.message;
          }
          setErrorMessage(friendlyMessage);
        } else {
          setErrorMessage('Ocorreu um erro de rede. Verifique sua conexão.');
        }
      }
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-100 flex justify-between items-center shadow-sm">
      <div>
        <h2 className="font-bold text-lg">{livro.titulo}</h2>
        <p className="text-gray-600">Ano: {livro.anoPublicacao}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        {/* NOVO: Exibe as mensagens de feedback */}
        {successMessage && <p className="text-green-600 font-bold">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 font-bold">{errorMessage}</p>}
        
        {isGerente ? (
          // Cenário: Admin ou Bibliotecário
          <>
            <Link href={`/admin/livros/${livro.id}`} className="text-yellow-600 hover:underline">
              Editar
            </Link>
            {onDelete && (
              <button onClick={() => onDelete(livro.id)} className="text-red-600 hover:underline">
                Excluir
              </button>
            )}
          </>
        ) : isUsuarioComum ? (
          // Cenário: Usuário Comum
          <>
            <Link href={`/livros/${livro.id}`} className="text-blue-600 hover:underline">
              Ver Detalhes
            </Link>
            <button 
              onClick={handleEmprestar} 
              disabled={livro.isEmprestado}
              className={`
                transition 
                ${livro.isEmprestado ? 'text-gray-500 cursor-not-allowed' : 'text-green-600 hover:underline'}
              `}
            >
              {livro.isEmprestado ? 'Indisponível' : 'Emprestar'}
            </button>
          </>
        ) : (
          // Cenário: Não Logado
          <Link href={`/livros/${livro.id}`} className="text-blue-600 hover:underline">
            Ver Detalhes
          </Link>
        )}
      </div>
    </div>
  );
}