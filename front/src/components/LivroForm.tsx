'use client';
import { useState, useEffect } from 'react';
import { Livro } from '@/types/interfaces';
import API from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LivroForm() {
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState<number>();
  const [autorId, setAutorId] = useState<number>();
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id');

  useEffect(() => {
    if (id) {
      API.get(`/Livros/${id}`).then(res => {
        const l: Livro = res.data;
        setTitulo(l.titulo);
        setAno(l.anoPublicacao);
        setAutorId(l.autorId);
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    const payload = { titulo, anoPublicacao: ano, autorId };
    if (id) {
      await API.put(`/Livros/${id}`, payload);
    } else {
      await API.post('/Livros', payload);
    }
    router.push('/livros');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">{id ? 'Editar' : 'Novo'} Livro</h1>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Título"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        type="number"
        placeholder="Ano de Publicação"
        value={ano}
        onChange={e => setAno(+e.target.value)}
      />
      <input
        className="border p-2 mb-4 w-full"
        type="number"
        placeholder="ID do Autor"
        value={autorId}
        onChange={e => setAutorId(+e.target.value)}
      />
      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2">
        Salvar
      </button>
    </div>
  );
}
