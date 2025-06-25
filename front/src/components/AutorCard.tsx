// src/components/AutorCard.tsx
import { Autor } from '@/types/interfaces';
import Link from 'next/link';

interface Props {
  autor: Autor;
  onDelete: (id: number) => void;
}

export default function AutorCard({ autor, onDelete }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex flex-col justify-between h-auto">
      <div className="mb-4">
        <h2 className="font-bold text-xl text-gray-900">{autor.nome}</h2>
        <p className="text-gray-600">Nacionalidade: {autor.nacionalidade}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Link href={`/admin/autores/${autor.id}`} className="text-yellow-600 font-semibold hover:underline">
          Editar
        </Link>
        <button
          onClick={() => onDelete(autor.id)}
          className="text-red-600 font-semibold hover:underline"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}