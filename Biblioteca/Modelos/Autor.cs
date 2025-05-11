using System;

namespace Biblioteca.Modelos;

public class Autor
{       
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Nacionalidade { get; set; } // Opcional

    // Propriedade de navegação para os Livros (um autor pode ter vários livros)
    public ICollection<Livro>? Livros { get; set; }
 
}
