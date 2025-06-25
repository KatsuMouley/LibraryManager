// Código completo e corrigido do EmprestimosController
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Biblioteca.Data;
using Biblioteca.Modelos;
using System.Security.Claims;

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

        // Rota para usuário comum e administrador emprestar para si mesmo
        [Authorize] // Autoriza qualquer usuário logado
        [HttpPost("emprestar")]
        public IActionResult EmprestarParaMim([FromBody] CriarEmprestimoDto emprestimoDto)
        {
            // 1. Obter o ID do usuário logado do token
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int loggedInUserId))
                return Unauthorized("ID de usuário no token é inválido.");

            // 2. Validar existência do usuário
            var usuario = _usuarioRepository.BuscarPorId(loggedInUserId);
            if (usuario == null)
                return NotFound("Usuário associado ao seu token não foi encontrado.");

            // 3. Validar se o livro existe
            if (!_livroRepository.Existe(emprestimoDto.LivroId))
                return BadRequest("Livro não encontrado.");
                
            // 4. Validar se o usuário está penalizado
            if (usuario.Penalizado)
                return BadRequest("Usuário penalizado. Não pode realizar empréstimos.");

            // 5. Validar se o livro já está emprestado
            if (_emprestimoRepository.LivroEstaEmprestado(emprestimoDto.LivroId))
                return BadRequest("Livro já está emprestado.");

            // 6. Validar limite de empréstimos
            var emprestimosAtivos = _emprestimoRepository.ContarEmprestimosAtivos(loggedInUserId);
            if (emprestimosAtivos >= 5)
                return BadRequest("Limite de empréstimos atingido.");
            
            // 7. Criar novo empréstimo
            var novoEmprestimo = new Emprestimo
            {
                LivroId = emprestimoDto.LivroId,
                UsuarioId = loggedInUserId,
                DataEmprestimo = DateTime.Now,
                DataDevolucaoPrevista = DateTime.Now.AddDays(7),
                Status = "Emprestado"
            };

            _emprestimoRepository.Cadastrar(novoEmprestimo);
            return CreatedAtAction(nameof(BuscarPorId), new { id = novoEmprestimo.Id }, novoEmprestimo);
        }

        // Rota para administrador emprestar para qualquer usuário
        [Authorize(Roles = "administrador")]
        [HttpPost("emprestar-como-admin")]
        public IActionResult EmprestarComoAdmin([FromBody] AdminCriarEmprestimoDto emprestimoAdminDto)
        {
            // ... (lógica existente, que já parece robusta)
            var usuarioAlvo = _usuarioRepository.BuscarPorId(emprestimoAdminDto.UsuarioId);
            if (usuarioAlvo == null)
                return NotFound("O usuário para o qual o empréstimo está sendo criado não foi encontrado.");
            
            if (!_livroRepository.Existe(emprestimoAdminDto.LivroId))
                return BadRequest("Livro não encontrado.");
                
            if (usuarioAlvo.Penalizado)
                return BadRequest("O usuário alvo está penalizado e não pode receber empréstimos.");

            if (_emprestimoRepository.LivroEstaEmprestado(emprestimoAdminDto.LivroId))
                return BadRequest("Livro já está emprestado.");
            
            var emprestimosAtivos = _emprestimoRepository.ContarEmprestimosAtivos(emprestimoAdminDto.UsuarioId);
            if (emprestimosAtivos >= 5)
                return BadRequest("Limite de empréstimos atingido para o usuário alvo.");

            var novoEmprestimo = new Emprestimo
            {
                LivroId = emprestimoAdminDto.LivroId,
                UsuarioId = emprestimoAdminDto.UsuarioId,
                DataEmprestimo = DateTime.Now,
                DataDevolucaoPrevista = DateTime.Now.AddDays(7),
                Status = "Emprestado"
            };

            _emprestimoRepository.Cadastrar(novoEmprestimo);
            return CreatedAtAction(nameof(BuscarPorId), new { id = novoEmprestimo.Id }, novoEmprestimo);
        }
        
        [HttpPut("devolver/{id}")]
        public IActionResult Devolver(int id)
        {
            var emprestimo = _emprestimoRepository.BuscarPorId(id);
            if (emprestimo == null)
                return NotFound("Empréstimo não encontrado.");

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int loggedInUserId))
                return Unauthorized("ID de usuário no token é inválido.");

            if (emprestimo.UsuarioId != loggedInUserId && !User.IsInRole("administrador"))
                return Forbid("Você não tem permissão para devolver um empréstimo que não é seu.");
            
            if (emprestimo.DataDevolucao != null)
                return BadRequest("Este empréstimo já foi devolvido.");

            emprestimo.DataDevolucao = DateTime.Now;
            emprestimo.Status = "Devolvido";

            if (emprestimo.DataDevolucao > emprestimo.DataDevolucaoPrevista)
            {
                var usuario = _usuarioRepository.BuscarPorId(emprestimo.UsuarioId);
                if (usuario != null) 
                {
                    usuario.Penalizado = true;
                    _usuarioRepository.Atualizar(usuario);
                }
                emprestimo.Status = "Devolvido com Atraso";
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

        [HttpGet("meus-emprestimos")]
        public IActionResult MeusEmprestimos()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Token de usuário inválido ou não contém o ID.");

            if (!int.TryParse(userIdClaim, out int usuarioId))
                return BadRequest("O ID do usuário no token está em um formato inválido.");

            var emprestimos = _emprestimoRepository.ListarPorUsuario(usuarioId);
            
            return Ok(emprestimos);
        }
    }
}