// src/components/LivroForm.tsx
'use client';
import { useState, useEffect } from 'react';
import { Livro, Autor } from '@/types/interfaces';
import API from '@/services/api';
import { useRouter } from 'next/router'; // CORRIGIDO: Use 'next/router' para Pages Router
import { useFetch } from '@/hooks/useFetch';

export default function LivroForm() {
  // Estados para os campos do formulário
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState<number | ''>('');
  const [autorId, setAutorId] = useState<number | ''>('');

  // Estados para feedback visual
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Hooks do Next.js
  const router = useRouter(); // CORRIGIDO: use useRouter
  const { id } = router.query; // CORRIGIDO: Pegue o ID da query do router

  // Hook para buscar a lista de autores para o dropdown
  const { data: autores, loading: loadingAutores, error: errorAutores } = useFetch<Autor[]>('/Autor/listar');

  // Efeito para pré-preencher o formulário no modo de edição
  useEffect(() => {
    // O `id` é uma string ou undefined.
    if (id) {
      setLoading(true);
      setError('');
      // Faz a requisição para buscar os dados do livro com o ID
      API.get(`/Livros/${id}`)
        .then(res => {
          const l: Livro = res.data;
          setTitulo(l.titulo);
          setAno(l.anoPublicacao);
          setAutorId(l.autorId);
          setLoading(false);
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch(err => {
          setError('Falha ao carregar dados do livro para edição.');
          setLoading(false);
        });
    }
  }, [id]); // O efeito roda sempre que o ID na URL muda

  // Gera um array de anos para o dropdown, de 1900 até o ano atual + 5
  const anoAtual = new Date().getFullYear();
  const anosDisponiveis = Array.from({ length: anoAtual - 1899 + 5 }, (_, i) => 1900 + i).reverse();

  // Função de submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação
    if (!titulo || !ano || !autorId) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    const payload = { titulo, anoPublicacao: ano, autorId };

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
  
  // Exibe loading ou erro para o dropdown de autores
  if (loadingAutores) return <div className="p-6 text-center">Carregando autores...</div>;
  if (errorAutores) return <div className="p-6 text-center text-red-600">Falha ao carregar a lista de autores.</div>;
  if (!autores || autores.length === 0) return <div className="p-6 text-center text-gray-500">Nenhum autor cadastrado. Por favor, cadastre um autor primeiro.</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{id ? 'Editar' : 'Novo'} Livro</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Exibe mensagens de feedback */}
        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        {/* Campo Título */}
        <label className="block">
          <span className="text-gray-700">Título</span>
          <input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-200"
            placeholder="Título"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            required
          />
        </label>

        {/* Campo Ano de Publicação (Dropdown de Anos) */}
        <label className="block">
          <span className="text-gray-700">Ano de Publicação</span>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-200 bg-white"
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

        {/* Campo Autor (Dropdown) */}
        <label className="block">
          <span className="text-gray-700">Autor</span>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring focus:ring-blue-200 bg-white"
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
        
        {/* Botão de Salvar com estado de loading */}
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