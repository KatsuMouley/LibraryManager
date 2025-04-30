using System;
using Biblioteca.Modelos;
using Microsoft.EntityFrameworkCore;
namespace Biblioteca.Data;

public class AppDataContext : DbContext
{
    public AppDataContext(DbContextOptions options) : base(options) { }
    public DbSet<Livro> livros { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
}

