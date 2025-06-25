// src/components/AutorForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { Autor } from '@/types/interfaces';
import API from '@/services/api';
import { useRouter } from 'next/router';

export default function AutorForm() {
  const [nome, setNome] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const { id } = router.query;

  // Efeito para pré-preencher o formulário no modo de edição
  useEffect(() => {
    if (id) {
      setLoading(true);
      setError('');
      API.get(`/Autor/${id}`)
        .then(res => {
          const a: Autor = res.data;
          setNome(a.nome);
          setNacionalidade(a.nacionalidade);
          setLoading(false);
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch(err => {
          setError('Falha ao carregar dados do autor para edição.');
          setLoading(false);
        });
    }
  }, [id]);

  // Função de submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nome) {
      setError('Por favor, preencha o nome do autor.');
      return;
    }

    setLoading(true);
    const payload = { nome, nacionalidade };

    try {
      if (id) {
        // Rota de edição (PUT)
        await API.put(`/Autor/alterar/${id}`, payload);
        setSuccess('Autor atualizado com sucesso!');
      } else {
        // Rota de criação (POST)
        await API.post('/Autor', payload);
        setSuccess('Autor cadastrado com sucesso!');
      }
      
      setTimeout(() => router.push('/admin/autores'), 1500);
    } catch (err) {
      setError('Falha ao salvar o autor. Verifique os dados e tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{id ? 'Editar' : 'Novo'} Autor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <label className="block">
          <span className="text-gray-700">Nome</span>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-200"
            placeholder="Nome do Autor"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700">Nacionalidade</span>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-200"
            placeholder="Nacionalidade"
            value={nacionalidade}
            onChange={e => setNacionalidade(e.target.value)}
          />
        </label>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white px-4 py-2 rounded-md transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}