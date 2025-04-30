using System;
using Microsoft.AspNetCore.Mvc;
using Biblioteca.Data;
using Biblioteca.Modelos;

[ApiController]
[Route("api/[controller]")]
public class LivrosController : ControllerBase
{
    private static List<Livro> livros = new List<Livro>
    {
        new Livro { Id = 1, Titulo = "Dom Casmurro", Autor = "Machado de Assis", AnoPublicacao = 1899 },
        new Livro { Id = 2, Titulo = "O Pequeno Príncipe", Autor = "Antoine de Saint-Exupéry", AnoPublicacao = 1943 }
    };

    [HttpGet]
    public ActionResult<IEnumerable<Livro>> GetLivros() => livros;

    [HttpGet("{id}")]
    public ActionResult<Livro> GetLivro(int id)
    {
        var livro = livros.FirstOrDefault(l => l.Id == id);
        if (livro == null) return NotFound();
        return livro;
    }

    [HttpPost]
    public ActionResult<Livro> PostLivro(Livro livro)
    {
        livro.Id = livros.Max(l => l.Id) + 1;
        livros.Add(livro);
        return CreatedAtAction(nameof(GetLivro), new { id = livro.Id }, livro);
    }

    [HttpPut("{id}")]
    public IActionResult PutLivro(int id, Livro livro)
    {
        var livroExistente = livros.FirstOrDefault(l => l.Id == id);
        if (livroExistente == null) return NotFound();

        livroExistente.Titulo = livro.Titulo;
        livroExistente.Autor = livro.Autor;
        livroExistente.AnoPublicacao = livro.AnoPublicacao;

        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteLivro(int id)
    {
        var livro = livros.FirstOrDefault(l => l.Id == id);
        if (livro == null) return NotFound();

        livros.Remove(livro);
        return NoContent();
    }
}
