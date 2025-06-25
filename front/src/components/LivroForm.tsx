// src/components/LivroForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { Livro, Autor } from '@/types/interfaces';
import API from '@/services/api';
import { useRouter } from 'next/router';
import { useFetch } from '@/hooks/useFetch';

export default function LivroForm() {
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState<number | ''>('');
  const [autorId, setAutorId] = useState<number | ''>('');
  const [capaUrl, setCapaUrl] = useState(''); // Estado para a URL da capa

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const { id } = router.query;

  const { data: autores, loading: loadingAutores, error: errorAutores } = useFetch<Autor[]>('/Autor/listar');

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError('');
      API.get(`/Livros/${id}`)
        .then(res => {
          const l: Livro = res.data;
          setTitulo(l.titulo);
          setAno(l.anoPublicacao);
          setAutorId(l.autorId);
          setCapaUrl(l.capaUrl || ''); // Pré-preenche a URL da capa
          setLoading(false);
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch(err => {
          setError('Falha ao carregar dados do livro para edição.');
          setLoading(false);
        });
    }
  }, [id]);

  const anoAtual = new Date().getFullYear();
  const anosDisponiveis = Array.from({ length: anoAtual - 1899 + 5 }, (_, i) => 1900 + i).reverse();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!titulo || !ano || !autorId) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    const payload = { titulo, anoPublicacao: ano, autorId, capaUrl }; // Inclui capaUrl no payload

    try {
      if (id) {
        await API.put(`/Livros/${id}`, payload);
        setSuccess('Livro atualizado com sucesso!');
      } else {
        await API.post('/Livros', payload);
        setSuccess('Livro cadastrado com sucesso!');
      }

      setTimeout(() => router.push('/explorar'), 1500);
    } catch (err) {
      setError('Falha ao salvar o livro. Verifique os dados e tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingAutores) return <div className="p-6 text-center text-gray-500">Carregando autores...</div>;
  if (errorAutores) return <div className="p-6 text-center text-red-600">Falha ao carregar a lista de autores.</div>;
  if (!autores || autores.length === 0) return <div className="p-6 text-center text-gray-500">Nenhum autor cadastrado. Por favor, cadastre um autor primeiro.</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-2xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">{id ? 'Editar' : 'Novo'} Livro</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-center text-sm">{error}</p>}
        {success && <p className="text-green-600 text-center text-sm">{success}</p>}

        <label className="block">
          <span className="text-gray-700 font-medium">Título</span>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Título"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Ano de Publicação</span>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
            value={ano}
            onChange={e => setAno(Number(e.target.value))}
            required
          >
            <option value="" disabled>Selecione o ano</option>
            {anosDisponiveis.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Autor</span>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
            value={autorId}
            onChange={e => setAutorId(Number(e.target.value))}
            required
          >
            <option value="" disabled>Selecione um autor</option>
            {autores?.map(autor => (
              <option key={autor.id} value={autor.id}>
                {autor.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">URL da Capa (Opcional)</span>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Ex: https://exemplo.com/capa.jpg"
            type="url"
            value={capaUrl}
            onChange={e => setCapaUrl(e.target.value)}
          />
        </label>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-bold py-3 rounded-md transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}