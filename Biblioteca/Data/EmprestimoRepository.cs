using Biblioteca.Modelos;

namespace Biblioteca.Data
{
    public class EmprestimoRepository : IEmprestimoRepository
    {
        private readonly AppDataContext _context;

        public EmprestimoRepository(AppDataContext context)
        {
            _context = context;
        }

        public bool UsuarioAtingiuLimiteEmprestimos(int usuarioId, int limite = 3)
        {
            return _context.Emprestimos.Count(e => e.UsuarioId == usuarioId && e.DataDevolucao == null) >= limite;
        }

        public void Cadastrar(Emprestimo emprestimo)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == emprestimo.UsuarioId);
            if (usuario != null && usuario.Penalizado)
                throw new Exception("Usuário penalizado, não pode pegar livros emprestados.");

            if (UsuarioAtingiuLimiteEmprestimos(emprestimo.UsuarioId))
                throw new Exception("Usuário atingiu o limite de empréstimos.");

            _context.Emprestimos.Add(emprestimo);
            _context.SaveChanges();
        }

        public void Devolver(int id)
        {
            var emprestimo = _context.Emprestimos.FirstOrDefault(e => e.Id == id && e.DataDevolucao == null);
            if (emprestimo != null)
            {
                emprestimo.DataDevolucao = DateTime.Now;

                var diasEmprestado = (emprestimo.DataDevolucao.Value - emprestimo.DataEmprestimo).TotalDays;
                if (diasEmprestado > 7)
                {
                    var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == emprestimo.UsuarioId);
                    if (usuario != null)
                    {
                        usuario.Penalizado = true;
                    }
                }

                _context.SaveChanges();
            }
        }

        public List<Emprestimo> Listar()
        {
            return _context.Emprestimos.ToList();
        }

        public Emprestimo? BuscarPorId(int id)
        {
            return _context.Emprestimos.FirstOrDefault(e => e.Id == id);
        }

        public bool LivroEstaEmprestado(int livroId)
        {
            return _context.Emprestimos.Any(e => e.LivroId == livroId && e.DataDevolucao == null);
        }

        public int ContarEmprestimosAtivos(int usuarioId)
        {
            return _context.Emprestimos.Count(e => e.UsuarioId == usuarioId && e.Status == "Ativo");
        }

        public void Atualizar(Emprestimo emprestimo)
        {
            _context.Emprestimos.Update(emprestimo);
            _context.SaveChanges();
        }
    }
}
