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
  // <<<<<<< CORRIGIDO: camelCase para corresponder ao payload da API >>>>>>>>>
  livroId: number;
  usuarioId: number;
  dataEmprestimo: string;
  // CORRIGIDO: O nome da propriedade é 'dataDevolucao'
  dataDevolucao: string | null;
  dataDevolucaoPrevista: string;
  // Adicione a propriedade 'status' que também aparece no JSON da API
  status?: string;
}