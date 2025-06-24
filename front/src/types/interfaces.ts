export interface Livro {
  id: number;
  titulo: string;
  anoPublicacao: number;
  autorId: number;
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
  livroid: number;
  usuarioid: number;
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal?: string;
}
