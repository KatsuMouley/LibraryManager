// src/pages/Emprestimos/meus-livros.tsx
'use client';
import { useFetch } from '@/hooks/useFetch';
import { Emprestimo, Livro } from '@/types/interfaces';
import API from '@/services/api';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react'; // <<<<< NOVO: Importe useMemo

export default function MeusEmprestimosPage() {
  const router = useRouter();
  const { isAuthenticated, isCheckingAuth } = useAuth();

  const { data: emprestimos, loading, error, refetch } = useFetch<Emprestimo[]>(
    isAuthenticated ? '/Emprestimos/meus-emprestimos' : null
  );

  const { data: livros, loading: loadingLivros } = useFetch<Livro[]>(
    isAuthenticated ? '/Livros/listar' : null
  );

  if (isCheckingAuth) {
    return <p className="p-6 text-center text-gray-500">Verificando autenticação...</p>;
  }

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const handleDevolver = async (emprestimoId: number) => {
    if (window.confirm('Tem certeza que deseja devolver este livro?')) {
      try {
        await API.put(`/Emprestimos/devolver/${emprestimoId}`);
        alert('Livro devolvido com sucesso!'); // Você pode trocar por mensagem inline se quiser
        refetch();
      } catch (err) {
        alert('Erro ao registrar devolução.'); // Você pode trocar por mensagem inline se quiser
        console.error(err);
      }
    }
  };
  
  const getLivroTitulo = (livroId: number) => {
    if (!livros) return 'Carregando título...';
    return livros.find(l => l.id === livroId)?.titulo || 'Título não encontrado';
  };

  // <<<<<<< NOVO: Separação dos empréstimos em ativos e devolvidos >>>>>>>>>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const emprestimosAtivos = useMemo(() => 
    emprestimos?.filter(emp => emp.dataDevolucao === null) || [], 
    [emprestimos]
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const emprestimosDevolvidos = useMemo(() => 
    emprestimos?.filter(emp => emp.dataDevolucao !== null) || [], 
    [emprestimos]
  );

  if (loading || loadingLivros) return <p className="p-6 text-center text-gray-500">Carregando seus empréstimos…</p>;
  if (error) return <p className="p-6 text-center text-red-600">Falha ao carregar empréstimos.</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Meus Livros Emprestados</h1>
        
        {/* ===== SEÇÃO: EMPRÉSTIMOS ATIVOS ===== */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 pb-2 border-blue-400">Empréstimos Ativos</h2>
        {emprestimosAtivos.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mb-12">Nenhum empréstimo ativo no momento. Que tal explorar e pegar um livro?</p>
        ) : (
          <ul className="space-y-6 mb-12">
            {emprestimosAtivos.map(emp => (
              <li key={emp.id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center transition-transform transform hover:scale-105">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{getLivroTitulo(emp.livroId)}</h2>
                  <p className="text-gray-600">Empréstimo: {new Date(emp.dataEmprestimo).toLocaleDateString('pt-BR')}</p>
                  <p className="text-gray-600">Devolução Prevista: {new Date(emp.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}</p>
                  <p className="text-red-500 font-bold mt-2">Status: Ainda não devolvido</p>
                </div>
                <button
                  onClick={() => handleDevolver(emp.id)}
                  className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
                >
                  Devolver
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* ===== SEÇÃO: EMPRÉSTIMOS DEVOLVIDOS ===== */}
        <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 pb-2 border-gray-400 mt-12">Empréstimos Devolvidos</h2>
        {emprestimosDevolvidos.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Nenhum empréstimo devolvido ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emprestimosDevolvidos.map(emp => (
              <div key={emp.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 transition-transform transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-700 mb-1">{getLivroTitulo(emp.livroId)}</h3>
                <p className="text-gray-500 text-sm">Empréstimo: {new Date(emp.dataEmprestimo).toLocaleDateString('pt-BR')}</p>
                <p className="text-gray-500 text-sm">Devolução Prevista: {new Date(emp.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}</p>
                {emp.dataDevolucao && (
                  <p className="text-green-700 font-bold text-sm mt-2">Devolvido em: {new Date(emp.dataDevolucao).toLocaleDateString('pt-BR')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}