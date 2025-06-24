using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Biblioteca.Data;
using Biblioteca.Modelos;

namespace Biblioteca.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LivrosController : ControllerBase
    {
        private readonly ILivroRepository _livroRepository;

        public LivrosController(ILivroRepository livroRepository)
        {
            _livroRepository = livroRepository;
        }

        // ─── ROTAS PÚBLICAS (qualquer um pode ver) ─────────────────────────────────

        [AllowAnonymous]
        [HttpGet("listar")]
        public ActionResult<IEnumerable<Livro>> GetLivros()
        {
            var livros = _livroRepository.Listar();
            return Ok(livros);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public ActionResult<Livro> GetLivro(int id)
        {
            var livro = _livroRepository.BuscarPorId(id);
            if (livro == null) 
                return NotFound("Livro não encontrado.");
            return Ok(livro);
        }

        // ─── ROTAS PROTEGIDAS (escrita) ───────────────────────────────────────────────

        // Criar livro: só bibliotecários ou administradores
        [Authorize(Roles = "bibliotecario,administrador")]
        [HttpPost]
        public ActionResult<Livro> PostLivro(Livro livro)
        {
            _livroRepository.Cadastrar(livro);
            return CreatedAtAction(nameof(GetLivro), new { id = livro.Id }, livro);
        }

        // Atualizar livro: só bibliotecários ou administradores
        [Authorize(Roles = "bibliotecario,administrador")]
        [HttpPut("{id}")]
        public IActionResult PutLivro(int id, Livro livro)
        {
            var livroExistente = _livroRepository.BuscarPorId(id);
            if (livroExistente == null) 
                return NotFound("Livro não encontrado.");

            livroExistente.Titulo = livro.Titulo;
            livroExistente.Autor = livro.Autor;
            livroExistente.AnoPublicacao = livro.AnoPublicacao;

            _livroRepository.Atualizar(livroExistente);
            return NoContent();
        }

        // Deletar livro: só bibliotecários ou administradores
        [Authorize(Roles = "bibliotecario,administrador")]
        [HttpDelete("{id}")]
        public IActionResult DeleteLivro(int id)
        {
            var livro = _livroRepository.BuscarPorId(id);
            if (livro == null) 
                return NotFound("Livro não encontrado.");

            _livroRepository.Remover(id);
            return NoContent();
        }

        [HttpGet("autor/{autorId}")]
        [AllowAnonymous] // se quiser que seja acessível sem login
        public ActionResult<IEnumerable<Livro>> BuscarPorAutor(int autorId)
        {
            var livros = _livroRepository.BuscarPorAutor(autorId);
            if (!livros.Any())
                return NotFound("Nenhum livro encontrado para este autor.");
            return Ok(livros);
        }

    }
}
