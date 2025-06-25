// src/hooks/useFetch.ts
import { useState, useEffect, useCallback } from 'react';
import API from '@/services/api';

// Definimos o tipo de retorno do nosso hook
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: unknown;
  // Adicionamos a função refetch ao retorno
  refetch: () => void;
}

// O T representa o tipo de dado que esperamos (ex: Livro[], Autor[])
export function useFetch<T>(url: string | null): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  
  // Usamos `useCallback` para memorizar a função e evitar re-criação desnecessária
  const fetchData = useCallback(async () => {
    if (!url) return; // Não faz a requisição se a URL for nula

    setLoading(true);
    setError(null);

    try {
      const response = await API.get(url);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]); // A função só muda se a URL mudar

  useEffect(() => {
    fetchData();
  }, [fetchData]); // O efeito roda quando `fetchData` muda

  // A função `refetch` simplesmente chama `fetchData`
  // A usamos para forçar uma nova requisição manual
  const refetch = () => {
    fetchData();
  };

  // Retorna o objeto de estado e a função refetch
  return { data, loading, error, refetch };
}