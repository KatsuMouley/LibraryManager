'use client';
import { useEffect, useState } from 'react';
import API from '@/services/api';
import { Emprestimo } from '@/types/interfaces';
import Link from 'next/link';

export default function Emprestimos() {
  const [ems, setEms] = useState<Emprestimo[]>([]);
  useEffect(() => {
    API.get('/Emprestimos/listar').then(res => setEms(res.data));
  }, []);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Empréstimos</h1>
        <Link href="/emprestimos/novo" className="bg-blue-600 text-white px-3 py-1">
          + Novo
        </Link>
      </div>
      <ul className="space-y-2">
        {ems.map(e => (
          <li key={e.id} className="border p-4 rounded">
            Livro: {e.livroid} — Usuário: {e.usuarioid} — Prevista: {new Date(e.dataDevolucaoPrevista).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
