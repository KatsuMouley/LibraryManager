// services/auth.ts
import API from './api';

export type RegisterData = {
  email: string;
  senha: string;
  permissao: number;
};

export async function register({ email, senha, permissao }: RegisterData) {
  // retorna a resposta completa ou message de sucesso
  const res = await API.post('/Usuario/cadastrar', { email, senha, permissao });
  return res.data;
}

export async function login({ email, senha }: Omit<RegisterData, 'permissao'>) {
  const res = await API.post('/Usuario/login', { email, senha });
  return res.data.token;
}
