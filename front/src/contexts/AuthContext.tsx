// src/contexts/AuthContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getToken, removeToken } from '@/utils/auth';
import { listenToAuthEvent, removeAuthListener } from '@/utils/events';

// Defina a interface para o payload do usuário no token
interface UserPayload {
  id?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  exp: number;
}

// Defina o tipo de objeto que o contexto irá fornecer
interface AuthContextType {
  user: { id: number | null; permissao: number | null };
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  logout: () => void;
}

// Crie o contexto com valores padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook customizado para facilitar o acesso ao contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// O componente que provê o estado de autenticação para toda a aplicação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>({ id: null, permissao: null });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Lógica para decodificar o token e definir o estado
  const checkAndSetAuthState = () => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwtDecode<UserPayload>(token);
        
        // Mapeia a permissão
        const roleValue = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
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
        }

        // Mapeia o ID do usuário
        const userIdClaim = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.id;
        const userId = userIdClaim ? Number(userIdClaim) : null;
        
        // Atualiza o estado
        setUser({ id: userId, permissao: permissaoNumerica });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token inválido ou expirado. Removendo...', error);
        removeToken();
        setUser({ id: null, permissao: null });
        setIsAuthenticated(false);
      }
    } else {
      setUser({ id: null, permissao: null });
      setIsAuthenticated(false);
    }
    setIsCheckingAuth(false);
  };

  // Efeito para verificar a autenticação na montagem e em eventos de login/logout
  useEffect(() => {
    checkAndSetAuthState();
    listenToAuthEvent(checkAndSetAuthState);
    return () => removeAuthListener(checkAndSetAuthState);
  }, []);

  const logout = () => {
    removeToken();
    setUser({ id: null, permissao: null });
    setIsAuthenticated(false);
  };

  const value = { user, isAuthenticated, isCheckingAuth, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}