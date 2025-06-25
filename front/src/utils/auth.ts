// src/utils/auth.ts
import { jwtDecode } from 'jwt-decode';
import { dispatchAuthEvent } from './events';

const TOKEN_KEY = 'jwt_token';

// Interface para o payload do token
interface TokenPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  sub?: string; // Adicione esta chave comum para o ID
  id?: string; // Adicione esta chave comum para o ID
  exp: number;
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    dispatchAuthEvent();
  }
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    dispatchAuthEvent();
  }
}

// <<<<<<< FUNÇÃO CORRIGIDA E ROBUSTA >>>>>>>>>
export function getUserIdFromToken(): number | null {
  const token = getToken();
  
  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      console.log('getUserIdFromToken (DEBUG): Payload decodificado:', decoded);
      
      // Tenta encontrar o ID do usuário usando a claim mais comum.
      // Adicionei a verificação para 'sub' e 'id' como fallback.
      const userIdClaim = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.sub || decoded.id;

      if (userIdClaim) {
        const userId = Number(userIdClaim);
        if (!isNaN(userId)) {
          console.log('getUserIdFromToken (DEBUG): ID do usuário encontrado e convertido:', userId);
          return userId;
        } else {
          console.error('getUserIdFromToken (DEBUG): Valor da claim não é um número:', userIdClaim);
        }
      } else {
        console.warn('getUserIdFromToken (DEBUG): Claim do User ID não encontrada no token. Verifique o backend.');
      }
    } catch (error) {
      console.error('getUserIdFromToken (DEBUG): Erro ao decodificar token para obter User ID:', error);
    }
  }
  return null;
}