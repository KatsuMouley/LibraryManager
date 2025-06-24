'use client';
import { useEffect, useState } from 'react';
import API from '@/services/api';
import { Autor } from '@/types/interfaces';
import Link from 'next/link';

export default function Autores() {
  const [autores, setAutores] = useState<Autor[]>([]);
  useEffect(() => {
    API.get('/Autor/listar').then(res => setAutores(res.data));
  }, []);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Autores</h1>
        <Link href="/autores/novo" className="bg-blue-600 text-white px-3 py-1">
          + Novo
        </Link>
      </div>
      <ul className="space-y-2">
        {autores.map(a => (
          <li key={a.id} className="border p-4 rounded">{a.nome}</li>
        ))}
      </ul>
    </div>
  );
}
