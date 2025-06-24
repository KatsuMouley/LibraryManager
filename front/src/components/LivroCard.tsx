import { Livro } from '@/types/interfaces';
import Link from 'next/link';

interface Props {
  livro: Livro;
  onDelete?: (id: number) => void;  // Agora opcional
}

export default function LivroCard({ livro, onDelete }: Props) {
  return (
    <div className="border p-4 rounded bg-gray-100 flex justify-between items-center">
      <div>
        <h2 className="font-bold">{livro.titulo}</h2>
        <p>Ano: {livro.anoPublicacao}</p>
      </div>
      <div className="flex gap-2">
        <Link href={`/livros/${livro.id}`} className="text-blue-600">
          Editar
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(livro.id)}
            className="text-red-600"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
