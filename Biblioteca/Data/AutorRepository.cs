// Data/AutorRepository.cs
using Biblioteca.Modelos;
using System.Collections.Generic;
using System.Linq;

namespace Biblioteca.Data
{
    public class AutorRepository : IAutorRepository
    {
        private readonly AppDataContext _context; // Seu DbContext

        public AutorRepository(AppDataContext context) // Injete seu DbContext
        {
            _context = context;
        }

        public IEnumerable<Autor> Listar() => _context.Autores.ToList();

        public Autor? BuscarPorId(int id) => _context.Autores.Find(id);

        public void Cadastrar(Autor autor)
        {
            _context.Autores.Add(autor);
            _context.SaveChanges();
        }

        public void Atualizar(Autor autor)
        {
            _context.Autores.Update(autor);
            _context.SaveChanges();
        }

        public void Remover(int id)
        {
            var autor = BuscarPorId(id);
            if (autor != null)
            {
                _context.Autores.Remove(autor);
                _context.SaveChanges();
            }
        }

        public bool Existe(int id) => _context.Autores.Any(a => a.Id == id);
    }
}