// src/components/LivroCard.tsx
import { Livro } from '@/types/interfaces';
import Link from 'next/link';
import API from '@/services/api';
import { getUserIdFromToken } from '@/utils/auth';
import { useRouter } from 'next/router';

interface Props {
  livro: Livro;
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

  const handleEmprestar = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert('Você precisa estar logado para emprestar um livro.');
      router.push('/auth/login');
      return;
    }

    if (window.confirm(`Tem certeza que deseja emprestar o livro "${livro.titulo}"?`)) {
      try {
        // <<<<<<< PAYLOAD CORRIGIDO >>>>>>>>>
        const payload = {
          livroId: livro.id, // Corrigido: PascalCase
          usuarioId: userId, // Corrigido: PascalCase
          dataEmprestimo: new Date().toISOString(),
          dataDevolucaoPrevista: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        
        await API.post('/Emprestimos/cadastrar', payload);
        
        alert(`Livro "${livro.titulo}" emprestado com sucesso!`);
        router.push('/Emprestimos/meus-livros');
      } catch (err) {
        alert('Erro ao registrar o empréstimo. O livro pode já estar emprestado.');
        console.error(err);
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
        {isGerente ? (
          <>
            <Link href={`/admin/livros/editar/${livro.id}`} className="text-yellow-600 hover:underline">
              Editar
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(livro.id)}
                className="text-red-600 hover:underline"
              >
                Excluir
              </button>
            )}
          </>
        ) : isUsuarioComum ? (
          <>
            <Link href={`/livros/${livro.id}`} className="text-blue-600 hover:underline">
              Ver Detalhes
            </Link>
            <button onClick={handleEmprestar} className="text-green-600 hover:underline">
              Emprestar
            </button>
          </>
        ) : (
          <Link href={`/livros/${livro.id}`} className="text-blue-600 hover:underline">
            Ver Detalhes
          </Link>
        )}
      </div>
    </div>
  );
}