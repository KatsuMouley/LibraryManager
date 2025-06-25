/* eslint-disable @next/next/no-img-element */
// src/components/LivroCard.tsx
'use client';
import { Livro } from '@/types/interfaces';
import Link from 'next/link';
import API from '@/services/api';
import { useRouter } from 'next/router';
import { getUserIdFromToken } from '@/utils/auth';
import { isAxiosError } from 'axios';
import { useState } from 'react';

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

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleEmprestar = async () => {
    setSuccessMessage('');
    setErrorMessage('');

    const userId = getUserIdFromToken();
    if (!userId) {
      setErrorMessage('Você precisa estar logado para emprestar um livro.');
      setTimeout(() => router.push('/auth/login'), 2000);
      return;
    }

    if (window.confirm(`Tem certeza que deseja emprestar o livro "${livro.titulo}"?`)) {
      try {
        const payload = { livroId: livro.id };

        await API.post('/Emprestimos/emprestar', payload);

        setSuccessMessage(`Livro "${livro.titulo}" emprestado com sucesso!`);
        setTimeout(() => router.push('/Emprestimos/meus-livros'), 2000);
      } catch (error) {
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
              friendlyMessage = rawData; // Atribui a mensagem bruta se não for uma das conhecidas
            }
          } else if (rawData?.message) {
            friendlyMessage = rawData.message;
          }

          // --- AQUI É ONDE A CORREÇÃO ENTRA ---
          const statusCode = error.response.status; // Obtenha o status diretamente da resposta do Axios

          if (statusCode === 403) {
            setErrorMessage(`Acesso negado (403): ${friendlyMessage}`);
          } else if (statusCode === 400) {
            setErrorMessage(`Requisição inválida (400): ${friendlyMessage}`);
          } else if (statusCode >= 500) { // Usar >= 500 para cobrir todos os erros de servidor
            setErrorMessage(`Erro interno do servidor (${statusCode}): ${friendlyMessage}. Por favor, contate o suporte.`);
          } else {
            setErrorMessage(`Ocorreu um erro: ${friendlyMessage}`);
          }
        } else {
          setErrorMessage('Ocorreu um erro de rede. Verifique sua conexão.');
        }
      }
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white flex flex-col justify-between h-48 sm:h-auto overflow-hidden">
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={livro.capaUrl || `https://placehold.co/100x150/f0f0f0/666666?text=Sem+Capa`} 
          alt={`Capa do livro ${livro.titulo}`} 
          className="w-20 h-24 object-cover rounded-md shadow-md"
        />
        <div>
          <h2 className="font-bold text-xl text-gray-900">{livro.titulo}</h2>
          <p className="text-gray-600">Ano: {livro.anoPublicacao}</p>
        </div>
      </div>

      <div className="mb-2">
        {successMessage && <p className="text-green-600 font-bold text-sm">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 font-bold text-sm">{errorMessage}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {isGerente ? (
          <>
            <Link href={`/admin/livros/${livro.id}`} className="text-yellow-600 font-semibold hover:underline">
              Editar
            </Link>
            {onDelete && (
              <button onClick={() => onDelete(livro.id)} className="text-red-600 font-semibold hover:underline">
                Excluir
              </button>
            )}
          </>
        ) : isUsuarioComum ? (
          <>
            <Link href={`/livros/${livro.id}`} className="text-blue-600 font-semibold hover:underline">
              Ver Detalhes
            </Link>
            <button 
              onClick={handleEmprestar} 
              disabled={livro.isEmprestado}
              className={`
                font-semibold transition 
                ${livro.isEmprestado ? 'text-gray-500 cursor-not-allowed' : 'text-green-600 hover:underline'}
              `}
            >
              {livro.isEmprestado ? 'Indisponível' : 'Emprestar'}
            </button>
          </>
        ) : (
          <Link href={`/livros/${livro.id}`} className="text-blue-600 font-semibold hover:underline">
            Ver Detalhes
          </Link>
        )}
      </div>
    </div>
  );
}