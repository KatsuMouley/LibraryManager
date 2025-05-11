using Microsoft.AspNetCore.Mvc;
using Biblioteca.Modelos;
using Biblioteca.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;


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

        
        [HttpPost("cadastrar")]
        public IActionResult Cadastrar([FromBody] Usuario usuario)
        {
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);
            _usuarioRepository.Cadastrar(usuario);
            return Ok(usuario);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Usuario usuario)
        {
            var usuarioExistente = _usuarioRepository.BuscarUsuarioPorEmail(usuario.Email);
            if (usuarioExistente == null || !BCrypt.Net.BCrypt.Verify(usuario.Senha, usuarioExistente.Senha))
                return Unauthorized(new { mensagem = "Usuário ou senha inválidos!" });

            string token = GerarToken(usuarioExistente);

            return Ok(new
            {
                token,
                usuario = new { usuarioExistente.Id, usuarioExistente.Email, usuarioExistente.Permissao }
            });
        }


        [Authorize(Roles = "administrador")]
        [HttpGet("listar")]
        public IActionResult Listar()
        {
            return Ok(_usuarioRepository.Listar());
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public string GerarToken(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Permissao.ToString())
            };

            var chave = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!);
            var assinatura = new SigningCredentials(new SymmetricSecurityKey(chave), SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddHours(1), signingCredentials: assinatura);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
