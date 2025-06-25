// src/pages/admin/autores/novo.tsx
'use client';
import AutorForm from '@/components/AutorForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

export default function NovoAutorPage() {
  const { user, isCheckingAuth } = useAuth();
  const router = useRouter();
  const PERMISSAO_GERENTE = 1;

  // Exibe carregamento enquanto verifica permissões
  if (isCheckingAuth) return <p className="p-6 text-center text-gray-500">Verificando permissões...</p>;
  
  // Redireciona se não estiver logado ou não tiver permissão de gerente
  if (!user.id || user.permissao === null || user.permissao < PERMISSAO_GERENTE) {
    router.push('/explorar'); // Redireciona para uma página pública
    return null;
  }

  return (
    // Container de página para centralizar o formulário e aplicar estilo de fundo
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <AutorForm />
    </div>
  );
}