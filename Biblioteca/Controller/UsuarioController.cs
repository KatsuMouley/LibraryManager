using Microsoft.AspNetCore.Mvc;
using Biblioteca.Modelos;
using Biblioteca.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Linq; // Necessário para usar o .Select()

namespace Biblioteca.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IConfiguration _configuration;

        public UsuarioController(IUsuarioRepository usuarioRepository, IConfiguration configuration)
        {
            _usuarioRepository = usuarioRepository;
            _configuration = configuration;
        }
        
        [Authorize(Roles = "administrador")]
        [HttpGet("listar")]
        public IActionResult Listar()
        {
            // Busca os usuários do repositório
            var usuarios = _usuarioRepository.Listar();
            
            // Seleciona apenas os campos seguros para não expor a senha na resposta
            var resultado = usuarios.Select(u => new {
                u.Id,
                u.Email,
                u.Permissao
            });

            return Ok(resultado);
        }

        [HttpPost("cadastrar")]
        public IActionResult Cadastrar([FromBody] Usuario usuario)
        {
            if (_usuarioRepository.BuscarUsuarioPorEmail(usuario.Email) != null)
            {
                return BadRequest(new { mensagem = "Este e-mail já está cadastrado." });
            }
            
            // Criptografa a senha antes de salvar
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);
            _usuarioRepository.Cadastrar(usuario);

            // Retorna uma resposta 201 Created com os dados do usuário (sem a senha)
            return CreatedAtAction(nameof(Listar), new { id = usuario.Id }, new {
                usuario.Id,
                usuario.Email,
                usuario.Permissao
            });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Usuario usuario)
        {
            var usuarioExistente = _usuarioRepository.BuscarUsuarioPorEmail(usuario.Email);
            if (usuarioExistente == null || !BCrypt.Net.BCrypt.Verify(usuario.Senha, usuarioExistente.Senha))
            {
                return Unauthorized(new { mensagem = "Usuário ou senha inválidos!" });
            }

            string token = GerarToken(usuarioExistente);

            return Ok(new
            {
                token,
                usuario = new { usuarioExistente.Id, usuarioExistente.Email, usuarioExistente.Permissao }
            });
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public string GerarToken(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, usuario.Email),
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Role, usuario.Permissao.ToString())
            };

            var chave = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!);
            var assinatura = new SigningCredentials(new SymmetricSecurityKey(chave), SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddHours(20), signingCredentials: assinatura);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}