// src/pages/admin/autores/[id].tsx
'use client';
import AutorForm from '@/components/AutorForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

export default function EditarAutorPage() {
  const { user, isCheckingAuth } = useAuth();
  const router = useRouter();
  const PERMISSAO_GERENTE = 1;

  if (isCheckingAuth) return <p className="p-6 text-center">Verificando permissões...</p>;
  if (!user.id || user.permissao < PERMISSAO_GERENTE) {
    router.push('/explorar');
    return null;
  }

  return <AutorForm />;
}