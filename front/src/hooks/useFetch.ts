// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';
import API from '@/services/api';

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let canceled = false;

    API.get<T>(url)
      .then((res) => {
        if (!canceled) setData(res.data);
      })
      .catch((err) => {
        if (!canceled) setError(err);
      })
      .finally(() => {
        if (!canceled) setLoading(false);
      });

    return () => {
      canceled = true;
    };
  }, [url]);

  return { data, loading, error };
}
