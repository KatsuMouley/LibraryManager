using Microsoft.AspNetCore.Mvc;
using Biblioteca.Modelos;
using Biblioteca.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Biblioteca.Controller
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
        _usuarioRepository.Cadastrar(usuario);
        return Created("", usuario);
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] Usuario usuario)
    {
        Usuario? usuarioExistente = _usuarioRepository
            .BuscarUsuarioPorEmailSenha(usuario.Email, usuario.Senha);
        if(usuarioExistente == null)
        {
            return Unauthorized(new { mensagem = "Usuário ou senha inválidos!"});
        }
            
        // parte da implementação do Jwt
        // string token = GerarToken(usuarioExistente);
        return Ok(usuarioExistente);
    }

    [HttpGet("listar")]
    public IActionResult Listar()
    {        
        return Ok(_usuarioRepository.Listar());
    }

    // public string GerarToken(Usuario usuario)
    // {
    //     var claims = new[]
    //     {
    //         new Claim(ClaimTypes.Name, usuario.Email),
    //         new Claim(ClaimTypes.Role, usuario.Permissao.ToString())
    //     };
    //     //Ainda não há chave Jwt
    //     var chave = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);
    //     var assinatura = new SigningCredentials(new SymmetricSecurityKey(chave), SecurityAlgorithms.HmacSha256);
    //     var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddSeconds(30), signingCredentials: assinatura);
    //     return new JwtSecurityTokenHandler().WriteToken(token);
    // }
    }
}
