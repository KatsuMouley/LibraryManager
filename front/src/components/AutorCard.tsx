// src/components/AutorCard.tsx
import { Autor } from '@/types/interfaces';
import Link from 'next/link';

interface Props {
  autor: Autor;
  onDelete: (id: number) => void;
}

export default function AutorCard({ autor, onDelete }: Props) {
  return (
    <div className="border p-4 rounded bg-gray-100 flex justify-between items-center shadow-sm">
      <div>
        <h2 className="font-bold text-lg">{autor.nome}</h2>
        <p className="text-gray-600">Nacionalidade: {autor.nacionalidade}</p>
      </div>
      <div className="flex gap-2">
        <Link href={`/admin/autores/${autor.id}`} className="text-yellow-600 hover:underline">
          Editar
        </Link>
        <button
          onClick={() => onDelete(autor.id)}
          className="text-red-600 hover:underline"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}