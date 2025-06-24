'use client';
import { useState } from 'react';
import API from '@/services/api';
import { useRouter } from 'next/navigation';

export default function NovoEmprestimo() {
  const [livroId, setLivroId] = useState<number>();
  const [userId, setUserId] = useState<number>();
  const [dataE, setDataE] = useState('');
  const [dataPrev, setDataPrev] = useState('');
  const router = useRouter();

  const submit = async () => {
    await API.post('/Emprestimos/cadastrar', {
      livroid: livroId,
      usuarioid: userId,
      dataEmprestimo: dataE,
      dataDevolucaoPrevista: dataPrev
    });
    router.push('/emprestimos');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Novo Empréstimo</h1>
      <input type="number" placeholder="ID do Livro" className="border p-2 mb-2 w-full" onChange={e => setLivroId(+e.target.value)} />
      <input type="number" placeholder="ID do Usuário" className="border p-2 mb-2 w-full" onChange={e => setUserId(+e.target.value)} />
      <input type="date" placeholder="Data Empréstimo" className="border p-2 mb-2 w-full" onChange={e => setDataE(e.target.value)} />
      <input type="date" placeholder="Data Devolução Prevista" className="border p-2 mb-4 w-full" onChange={e => setDataPrev(e.target.value)} />
      <button onClick={submit} className="bg-green-600 text-white px-4 py-2">Salvar</button>
    </div>
  );
}
