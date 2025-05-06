using Biblioteca.Modelos;

namespace Biblioteca.Data
{
    public class LivroRepository : ILivroRepository
    {
        private readonly AppDataContext _context;

        public LivroRepository(AppDataContext context)
        {
            _context = context;
        }

        public void Cadastrar(Livro livro)
        {
            _context.Livros.Add(livro);
            _context.SaveChanges();
        }

        public List<Livro> Listar()
        {
            return _context.Livros.ToList();
        }

        public Livro? BuscarPorId(int id)
        {
            return _context.Livros.FirstOrDefault(l => l.Id == id);
        }

        public void Atualizar(Livro livro)
        {
            _context.Livros.Update(livro);
            _context.SaveChanges();
        }

        public void Remover(int id)
        {
            var livro = BuscarPorId(id);
            if (livro != null)
            {
                _context.Livros.Remove(livro);
                _context.SaveChanges();
            }
        }

        public bool Existe(int id)
        {
            return _context.Livros.Any(l => l.Id == id);
        }

        public bool LivroEstaEmprestado(int livroId)
        {
            // Apenas exemplo – depende do seu modelo de empréstimo
            return _context.Emprestimos.Any(e => e.LivroId == livroId && e.DataDevolucao == null);
        }
    }
}
