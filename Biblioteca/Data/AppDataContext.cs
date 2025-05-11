using System;
using Biblioteca.Modelos;
using Microsoft.EntityFrameworkCore;
namespace Biblioteca.Data;

public class AppDataContext : DbContext
{
    public AppDataContext(DbContextOptions options) : base(options) { }
    public DbSet<Livro> Livros { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Emprestimo> Emprestimos { get; set; }
    public DbSet<Autor> Autores { get; set; }

    
}

