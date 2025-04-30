using System;

namespace Biblioteca.Modelos;

public class Livro
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Autor { get; set; }
    public int AnoPublicacao { get; set; }

}