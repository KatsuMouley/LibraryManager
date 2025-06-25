// src/pages/admin/livros/novo.tsx
'use client';
import LivroForm from '@/components/LivroForm';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getToken } from '@/utils/auth';
import { listenToAuthEvent, removeAuthListener } from '@/utils/events';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string; 
}

export default function NovoLivroPage() {
  const router = useRouter();
  const PERMISSAO_GERENTE = 1;

  const [userPermissao, setUserPermissao] = useState<number | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = getToken();
      let permissao: number | null = null;
      if (token) {
        try {
          const decoded = jwtDecode<UserPayload>(token);
          const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
          const roleValue = decoded[roleClaimKey];
          if (roleValue) {
            switch (roleValue.toLowerCase()) {
              case 'usuario': permissao = 0; break;
              case 'administrador': permissao = 1; break;
              default: {
                const numericValue = Number(roleValue);
                permissao = !isNaN(numericValue) ? numericValue : 0;
              }
            }
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { permissao = null; }
      }
      setUserPermissao(permissao);
      setIsCheckingAuth(false);
    };
    checkAuthStatus();
    listenToAuthEvent(checkAuthStatus);
    return () => { removeAuthListener(checkAuthStatus); };
  }, []);
  
  useEffect(() => {
    if (!isCheckingAuth) {
      if (userPermissao === null) {
        router.push('/auth/login');
      } else if (userPermissao < PERMISSAO_GERENTE) {
        router.push('/explorar');
      }
    }
  }, [userPermissao, isCheckingAuth, router]);

  if (isCheckingAuth || userPermissao === null || userPermissao < PERMISSAO_GERENTE) {
    return <p className="p-6 text-center">Verificando permissões...</p>;
  }

  return <LivroForm />;
}