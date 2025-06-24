
// utils/auth.ts

/** Retorna o token salvo ou null se não existir */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/** Salva o token no localStorage */
export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
}

/** Remove o token ao fazer logout ou expirar */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}
