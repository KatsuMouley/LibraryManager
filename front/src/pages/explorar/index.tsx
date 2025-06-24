// src/pages/explorar/index.tsx
'use client';

import { useFetch } from '@/hooks/UseFetch'; // lowercase no nome do arquivo
import LivroCard from '@/components/LivroCard';
import { Livro } from '@/types/interfaces';

export default function Explorar() {
  const { data: livros, loading, error } = useFetch<Livro[]>('/Livros/listar');

  if (loading) return <p>Carregando acervo…</p>;
  if (error) return <p>Falha ao carregar acervo.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Explorar Acervo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {livros?.map((livro) => (
          // Não passamos onDelete, então o botão “Excluir” não aparece aqui
          <LivroCard key={livro.id} livro={livro} />
        ))}
      </div>
    </div>
  );
}
