/* eslint-disable @next/next/no-img-element */
// src/pages/livros/[id].tsx
'use client';
import { useRouter } from 'next/router';
import { useFetch } from '@/hooks/useFetch';
import { Livro, Autor, Emprestimo } from '@/types/interfaces'; // Importe Emprestimo
import API from '@/services/api';
import { useAuth } from '@/contexts/AuthContext'; // Use o useAuth
import { useState, useMemo } from 'react'; // Importe useState e useMemo
import { isAxiosError } from 'axios';

export default function LivroDetalhePage() {
  const router = useRouter();
  const { id } = router.query;

  // <<<<< NOVO: Use o useAuth para obter o estado de autenticação >>>>>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, isAuthenticated, isCheckingAuth } = useAuth();

  // Hook para buscar os detalhes do livro
  const { data: livro, loading, error } = useFetch<Livro>(
    id && typeof id === 'string' ? `/Livros/${id}` : null
  );
  
  // Hook para buscar os detalhes do autor
  const { data: autor, loading: loadingAutor } = useFetch<Autor>(
    livro?.autorId ? `/Autor/${livro.autorId}` : null
  );

  // <<<<< NOVO: Buscar os empréstimos do usuário para verificar o status do livro >>>>>
  const { data: emprestimosUsuario } = useFetch<Emprestimo[]>(
    isAuthenticated ? '/Emprestimos/meus-emprestimos' : null
  );

  // NOVO: Estado para mensagens de feedback (sucesso/erro)
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // NOVO: Calcular se o livro já está emprestado pelo usuário logado
  const isEmprestadoPeloUsuario = useMemo(() => {
    if (!livro || !emprestimosUsuario || !isAuthenticated) return false;
    return emprestimosUsuario.some(
      emp => emp.livroId === livro.id && emp.dataDevolucao === null // Empréstimo ativo
    );
  }, [livro, emprestimosUsuario, isAuthenticated]);
  
  // Lógica de empréstimo (similar à do LivroCard)
  const handleEmprestar = async () => {
    // Limpa mensagens anteriores
    setSuccessMessage('');
    setErrorMessage('');

    if (!isAuthenticated) {
      setErrorMessage('Você precisa estar logado para emprestar um livro.');
      setTimeout(() => router.push('/auth/login'), 2000);
      return;
    }

    if (window.confirm(`Tem certeza que deseja emprestar o livro "${livro?.titulo}"?`)) {
      try {
        const payload = { livroId: livro?.id }; // Payload simplificado
        await API.post('/Emprestimos/emprestar', payload);
        
        setSuccessMessage(`Livro "${livro?.titulo}" emprestado com sucesso!`);
        setTimeout(() => router.push('/Emprestimos/meus-livros'), 2000);
      } catch (error) {
        console.error('Erro na requisição de empréstimo:', error);
        if (isAxiosError(error) && error.response) {
          const rawData = error.response.data;
          let friendlyMessage = 'Erro desconhecido.';
          if (typeof rawData === 'string') {
            if (rawData.includes('Usuário atingiu o limite')) friendlyMessage = 'Limite de empréstimos atingido.';
            else if (rawData.includes('Livro já está emprestado')) friendlyMessage = 'Livro já está emprestado.';
            else friendlyMessage = rawData;
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
  
  // Estados de carregamento e erro (incluindo o AuthContext e o fetch de autores)
  if (isCheckingAuth || loading || loadingAutor) return <p className="p-6 text-center text-gray-500">Carregando detalhes do livro...</p>;
  if (error) return <p className="p-6 text-center text-red-600">Falha ao carregar o livro. Verifique se o ID está correto.</p>;
  if (!livro) return <p className="p-6 text-center text-gray-500">Livro não encontrado.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Imagem da Capa */}
        <div className="w-full md:w-1/3 p-6 flex justify-center items-center bg-gray-50">
          <img 
            src={livro.capaUrl || `https://placehold.co/200x300/f0f0f0/666666?text=Sem+Capa`} 
            alt={`Capa do livro ${livro.titulo}`} 
            className="w-full h-auto max-w-[200px] rounded-lg shadow-xl object-cover"
          />
        </div>

        {/* Detalhes do Livro */}
        <div className="w-full md:w-2/3 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{livro.titulo}</h1>
            <p className="text-xl text-gray-700 mb-2">
              **Autor:** {autor ? autor.nome : 'Carregando...'}
            </p>
            <p className="text-lg text-gray-600 mb-6">
              **Ano de Publicação:** {livro.anoPublicacao}
            </p>
          </div>

          {/* Mensagens de feedback */}
          {successMessage && <p className="text-green-600 font-bold mb-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-600 font-bold mb-4">{errorMessage}</p>}

          {/* Botão de Empréstimo */}
          <div className="mt-6">
            {isAuthenticated ? (
              <button
                onClick={handleEmprestar}
                disabled={isEmprestadoPeloUsuario}
                className={`
                  w-full md:w-auto text-white font-bold py-3 px-8 rounded-lg shadow-md 
                  transition-all duration-300 transform hover:scale-105
                  ${isEmprestadoPeloUsuario ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                `}
              >
                {isEmprestadoPeloUsuario ? 'Já Emprestado por Você' : 'Emprestar Livro'}
              </button>
            ) : (
              <p className="text-gray-500 italic">Faça login para emprestar este livro.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}