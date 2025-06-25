// src/pages/explorar/index.tsx
'use client';

import { useFetch } from '@/hooks/useFetch';
import LivroCard from '@/components/LivroCard';
import { Livro } from '@/types/interfaces';
import { useState, useMemo, useEffect } from 'react';
import { getToken } from '@/utils/auth';
import { listenToAuthEvent, removeAuthListener } from '@/utils/events';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string; 
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  exp: number;
}

export default function Explorar() {
  // Estado para armazenar o nível de permissão do usuário logado
  const [userPermissao, setUserPermissao] = useState<number | null>(null);

  // Use seu hook useFetch para carregar a lista de livros
  const { data: todosOsLivros, loading, error } = useFetch<Livro[]>('/Livros/listar');

  // Estado para o termo de busca
  const [termoDeBusca, setTermoDeBusca] = useState('');

  // Efeito que detecta a permissão do usuário
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = getToken();
      
      if (token) {
        try {
          const decoded = jwtDecode<UserPayload>(token);
          const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
          const roleValue = decoded[roleClaimKey];

          let permissaoNumerica: number | null = null;
          
          if (roleValue) {
            switch (roleValue.toLowerCase()) {
              case 'usuario': permissaoNumerica = 0; break;
              case 'administrador': permissaoNumerica = 1; break;
              default: {
                const numericValue = Number(roleValue);
                permissaoNumerica = !isNaN(numericValue) ? numericValue : 0;
              }
            }
            setUserPermissao(permissaoNumerica);
          } else {
            setUserPermissao(null);
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setUserPermissao(null);
        }
      } else {
        setUserPermissao(null);
      }
    };

    checkAuthStatus();
    listenToAuthEvent(checkAuthStatus);
    
    return () => {
      removeAuthListener(checkAuthStatus);
    };
  }, []);

  // Lógica de filtro dos livros
  const livrosFiltrados = useMemo(() => {
    if (!todosOsLivros) return [];
    return todosOsLivros.filter(livro =>
      livro.titulo.toLowerCase().includes(termoDeBusca.toLowerCase())
    );
  }, [todosOsLivros, termoDeBusca]);

  if (loading) return <p className="text-center p-6">Carregando acervo…</p>;
  if (error) return <p className="text-center text-red-600 p-6">Falha ao carregar acervo.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Explorar Acervo</h1>
      
      {/* Barra de busca */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Buscar livros por título..."
          value={termoDeBusca}
          onChange={e => setTermoDeBusca(e.target.value)}
          className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {livrosFiltrados.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">Nenhum livro encontrado.</p>
        ) : (
          livrosFiltrados.map((livro) => (
            <LivroCard 
              key={livro.id} 
              livro={livro} 
              userPermissao={userPermissao === 1 ? 0 : userPermissao} // <<-- MUDANÇA AQUI!
            />
          ))
        )}
      </div>
    </div>
  );
}