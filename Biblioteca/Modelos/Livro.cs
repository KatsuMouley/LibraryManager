// Biblioteca/Modelos/Livro.cs
using System;
using System.Collections.Generic;

namespace Biblioteca.Modelos;

public class Livro
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public int AnoPublicacao { get; set; }
    public int AutorId { get; set; } // Chave estrangeira
    public Autor? Autor { get; set; } // Propriedade de navegação para o Autor

   // <<<<< ADICIONE ESTA LINHA >>>>>
    public string? CapaUrl { get; set; } // A URL da imagem da capa do livro
}