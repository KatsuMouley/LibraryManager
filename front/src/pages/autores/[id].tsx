'use client';
import { useState, useEffect } from 'react';
import API from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Autor } from '@/types/interfaces';

export default function EditarAutor() {
  const [nome, setNome] = useState('');
  const [nac, setNac] = useState('');
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id');

  useEffect(() => {
    if (id) {
      API.get(`/Autor/${id}`).then(res => {
        const a: Autor = res.data;
        setNome(a.nome);
        setNac(a.nacionalidade);
      });
    }
  }, [id]);

  const submit = async () => {
    await API.put(`/Autor/alterar/${id}`, { id: +id!, nome, nacionalidade: nac });
    router.push('/autores');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Editar Autor</h1>
      <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" className="border p-2 mb-2 w-full" />
      <input value={nac} onChange={e => setNac(e.target.value)} placeholder="Nacionalidade" className="border p-2 mb-4 w-full" />
      <button onClick={submit} className="bg-green-600 text-white px-4 py-2">Salvar</button>
    </div>
  );
}
