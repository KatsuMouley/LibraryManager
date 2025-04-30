using System;
using Biblioteca.Modelos;

namespace Biblioteca.Data;

public class LivroRepository : ILivroRepository
{
     private readonly AppDataContext _context;
    public LivroRepository(AppDataContext context)
    {
        _context = context;
    }
    public void Cadastrar(Livro livro)
    {
        _context.livros.Add(livro);
        _context.SaveChanges();
    }

    public List<Livro> Listar()
    {
       return _context.livros.ToList();
    }
}
