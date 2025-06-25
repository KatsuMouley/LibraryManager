// src/types/interfaces.ts

export interface Livro {
  id: number;
  titulo: string;
  anoPublicacao: number;
  autorId: number;
  // <<<<<<< CORRIGIDO: Adicionada a propriedade capaUrl >>>>>>>>>
  capaUrl?: string; // Capa do livro (URL opcional)
}

export interface Autor {
  id: number;
  nome: string;
  nacionalidade: string;
}

export interface Usuario {
  id: number;
  email: string;
  permissao: number;
}

export interface Emprestimo {
  id: number;
  livroId: number;
  usuarioId: number;
  dataEmprestimo: string;
  dataDevolucao: string | null;
  dataDevolucaoPrevista: string;
  status?: string;
}