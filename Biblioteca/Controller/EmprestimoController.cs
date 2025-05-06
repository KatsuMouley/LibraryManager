using Microsoft.AspNetCore.Mvc;
using Biblioteca.Data;
using Biblioteca.Modelos;

namespace Biblioteca.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmprestimosController : ControllerBase
    {
        private readonly IEmprestimoRepository _emprestimoRepository;
        private readonly ILivroRepository _livroRepository;
        private readonly IUsuarioRepository _usuarioRepository;

        public EmprestimosController(
            IEmprestimoRepository emprestimoRepository,
            ILivroRepository livroRepository,
            IUsuarioRepository usuarioRepository)
        {
            _emprestimoRepository = emprestimoRepository;
            _livroRepository = livroRepository;
            _usuarioRepository = usuarioRepository;
        }

        [HttpPost("cadastrar")]
        public IActionResult Cadastrar([FromBody] Emprestimo emprestimo)
        {
            if (!_livroRepository.Existe(emprestimo.LivroId))
                return BadRequest("Livro não encontrado.");

            if (!_usuarioRepository.Existe(emprestimo.UsuarioId))
                return BadRequest("Usuário não encontrado.");

            if (_emprestimoRepository.LivroEstaEmprestado(emprestimo.LivroId))
                return BadRequest("Livro já está emprestado.");

            emprestimo.DataEmprestimo = DateTime.Now;
            emprestimo.DataDevolucao = null;

            _emprestimoRepository.Cadastrar(emprestimo);
            return Created("", emprestimo);
        }

        [HttpPut("devolver/{id}")]
        public IActionResult Devolver(int id)
        {
            var emprestimo = _emprestimoRepository.BuscarPorId(id);
            if (emprestimo == null)
                return NotFound("Empréstimo não encontrado.");

            if (emprestimo.DataDevolucao != null)
                return BadRequest("Este empréstimo já foi devolvido.");

            _emprestimoRepository.Devolver(id);
            return Ok("Livro devolvido com sucesso.");
        }

        [HttpGet("listar")]
        public IActionResult Listar()
        {
            return Ok(_emprestimoRepository.Listar());
        }

        [HttpGet("{id}")]
        public IActionResult BuscarPorId(int id)
        {
            var emprestimo = _emprestimoRepository.BuscarPorId(id);
            if (emprestimo == null)
                return NotFound("Empréstimo não encontrado.");
            return Ok(emprestimo);
        }
    }
}
