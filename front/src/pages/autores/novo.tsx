'use client';
import { useState } from 'react';
import API from '@/services/api';
import { useRouter } from 'next/navigation';

export default function NovoAutor() {
  const [nome, setNome] = useState('');
  const [nac, setNac] = useState('');
  const router = useRouter();
  const submit = async () => {
    await API.post('/Autor', { nome, nacionalidade: nac });
    router.push('/autores');
  };
  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Novo Autor</h1>
      <input placeholder="Nome" className="border p-2 mb-2 w-full" onChange={e => setNome(e.target.value)} />
      <input placeholder="Nacionalidade" className="border p-2 mb-4 w-full" onChange={e => setNac(e.target.value)} />
      <button onClick={submit} className="bg-green-600 text-white px-4 py-2">Salvar</button>
    </div>
  );
}
