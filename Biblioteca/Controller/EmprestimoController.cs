using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Biblioteca.Data;
using Biblioteca.Modelos;

namespace Biblioteca.Controllers
{
    [Authorize]
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

        [Authorize(Roles = "usuario, administrador")]
        [HttpPost("cadastrar")]
        public IActionResult Cadastrar([FromBody] Emprestimo emprestimo)
        {
            if (!_livroRepository.Existe(emprestimo.LivroId))
                return BadRequest("Livro não encontrado.");

            var usuario = _usuarioRepository.BuscarPorId(emprestimo.UsuarioId);
            if (usuario == null)
                return BadRequest("Usuário não encontrado.");

            if (usuario.Penalizado)
                return BadRequest("Usuário penalizado. Não pode realizar empréstimos.");

            if (_emprestimoRepository.LivroEstaEmprestado(emprestimo.LivroId))
                return BadRequest("Livro já está emprestado.");

            var emprestimosAtivos = _emprestimoRepository.ContarEmprestimosAtivos(usuario.Id);
            if (emprestimosAtivos >= 5)
                return BadRequest("Limite de empréstimos atingido.");

            emprestimo.DataEmprestimo = DateTime.Now;
            emprestimo.DataDevolucaoPrevista = DateTime.Now.AddDays(7);

            _emprestimoRepository.Cadastrar(emprestimo);
            return CreatedAtAction(nameof(BuscarPorId), new { id = emprestimo.Id }, emprestimo);
        }
        
        [HttpPut("devolver/{id}")]
        public IActionResult Devolver(int id)
        {
            var emprestimo = _emprestimoRepository.BuscarPorId(id);
            if (emprestimo == null)
                return NotFound("Empréstimo não encontrado.");

            if (emprestimo.DataDevolucao != null)
                return BadRequest("Este empréstimo já foi devolvido.");

            emprestimo.DataDevolucao = DateTime.Now;

            if (emprestimo.DataDevolucao > emprestimo.DataDevolucaoPrevista)
            {
                var usuario = _usuarioRepository.BuscarPorId(emprestimo.UsuarioId);
                usuario.Penalizado = true;
                _usuarioRepository.Atualizar(usuario);
            }

            _emprestimoRepository.Atualizar(emprestimo);
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
