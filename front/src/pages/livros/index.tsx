'use client';
import { useEffect, useState } from 'react';
import API from '@/services/api';
import { Livro } from '@/types/interfaces';
import LivroCard from '@/components/LivroCard';
import Link from 'next/link';

export default function Livros() {
  const [livros, setLivros] = useState<Livro[]>([]);

  useEffect(() => {
    API.get('/Livros/listar').then(res => setLivros(res.data));
  }, []);

  const deleteLivro = async (id: number) => {
    await API.delete(`/Livros/${id}`);
    setLivros(l => l.filter(x => x.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Livros</h1>
        <Link href="/livros/novo" className="bg-blue-600 text-white px-3 py-1">
          + Novo
        </Link>
      </div>
      <div className="space-y-2">
        {livros.map(l => (
          <LivroCard key={l.id} livro={l} onDelete={deleteLivro} />
        ))}
      </div>
    </div>
  );
}
