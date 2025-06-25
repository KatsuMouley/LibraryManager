// src/pages/admin/autores/novo.tsx
// (O mesmo código serve para src/pages/admin/autores/[id].tsx)
'use client';
import AutorForm from '@/components/AutorForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

export default function EditarAutorPage() { // Renomeie para EditarAutorPage no arquivo [id].tsx
  const { user, isCheckingAuth } = useAuth();
  const router = useRouter();
  const PERMISSAO_GERENTE = 1;

  if (isCheckingAuth) return <p className="p-6 text-center text-gray-500">Verificando permissões...</p>;
  if (!user.id || user.permissao === null || user.permissao < PERMISSAO_GERENTE) {
    router.push('/explorar');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <AutorForm />
    </div>
  );
}