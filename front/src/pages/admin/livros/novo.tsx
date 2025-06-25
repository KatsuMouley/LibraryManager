// src/pages/admin/livros/novo.tsx
'use client';
import LivroForm from '@/components/LivroForm';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext'; // <<<<< NOVO: Importe o useAuth

export default function NovoLivroPage() {
  const router = useRouter();
  // <<<<< NOVO: Use o useAuth para obter o estado de autenticação >>>>>
  const { user, isCheckingAuth } = useAuth();
  const PERMISSAO_GERENTE = 1; // Permissão de administrador

  // <<<<< NOVO: Lógica de redirecionamento simplificada >>>>>
  if (isCheckingAuth) {
    return <p className="p-6 text-center">Verificando permissões...</p>;
  }
  if (!user.id || user.permissao === null || user.permissao < PERMISSAO_GERENTE) {
    // Redireciona se não estiver logado ou não tiver permissão suficiente
    router.push('/auth/login'); // Ou para '/explorar' se quiser mostrar uma página de acesso negado
    return null;
  }

  return <LivroForm />;
}