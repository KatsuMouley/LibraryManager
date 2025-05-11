using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Biblioteca.Data;
using Biblioteca.Modelos;

namespace Biblioteca.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class LivrosController : ControllerBase
    {
        private readonly ILivroRepository _livroRepository;

        public LivrosController(ILivroRepository livroRepository)
        {
            _livroRepository = livroRepository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Livro>> GetLivros()
        {
            var livros = _livroRepository.Listar();
            return Ok(livros);
        }

        [HttpGet("{id}")]
        public ActionResult<Livro> GetLivro(int id)
        {
            var livro = _livroRepository.BuscarPorId(id);
            if (livro == null) return NotFound("Livro não encontrado.");
            return Ok(livro);
        }

        [HttpPost]
        public ActionResult<Livro> PostLivro(Livro livro)
        {
            _livroRepository.Cadastrar(livro);
            return CreatedAtAction(nameof(GetLivro), new { id = livro.Id }, livro);
        }

        [HttpPut("{id}")]
        public IActionResult PutLivro(int id, Livro livro)
        {
            var livroExistente = _livroRepository.BuscarPorId(id);
            if (livroExistente == null) return NotFound("Livro não encontrado.");

            livroExistente.Titulo = livro.Titulo;
            livroExistente.Autor = livro.Autor;
            livroExistente.AnoPublicacao = livro.AnoPublicacao;

            _livroRepository.Atualizar(livroExistente);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteLivro(int id)
        {
            var livro = _livroRepository.BuscarPorId(id);
            if (livro == null) return NotFound("Livro não encontrado.");

            _livroRepository.Remover(id);
            return NoContent();
        }
    }
}
