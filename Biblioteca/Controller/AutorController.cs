// Controllers/AutorController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Biblioteca.Data;
using Biblioteca.Modelos;
using System.Collections.Generic;

namespace Biblioteca.Controllers
{
    [Authorize] // Proteja o controller
    [ApiController]
    [Route("api/[controller]")]
    public class AutorController : ControllerBase
    {
        private readonly IAutorRepository _autorRepository;

        public AutorController(IAutorRepository autorRepository)
        {
            _autorRepository = autorRepository;
        }

        [HttpGet("listar")]
        public ActionResult<IEnumerable<Autor>> GetAutores()
        {
            return Ok(_autorRepository.Listar());
        }

        [HttpGet("{id}")]
        public ActionResult<Autor> GetAutor(int id)
        {
            var autor = _autorRepository.BuscarPorId(id);
            if (autor == null) return NotFound("Autor não encontrado.");
            return Ok(autor);
        }

        [HttpPost]
        [Authorize(Roles = "administrador")] // Restrinja quem pode cadastrar
        public ActionResult<Autor> PostAutor(Autor autor)
        {
            _autorRepository.Cadastrar(autor);
            // Retorna o autor criado e o link para acessá-lo
            return CreatedAtAction(nameof(GetAutor), new { id = autor.Id }, autor);
        }

        [HttpPut("alterar/{id}")]
        [Authorize(Roles = "administrador")] // Restrinja quem pode atualizar
        public IActionResult PutAutor(int id, Autor autor)
        {
            if (id != autor.Id) return BadRequest("ID do autor na URL não corresponde ao ID no corpo da requisição.");

            var autorExistente = _autorRepository.BuscarPorId(id);
            if (autorExistente == null) return NotFound("Autor não encontrado para atualização.");

            autorExistente.Nome = autor.Nome;
            autorExistente.Nacionalidade = autor.Nacionalidade;
            // Atualize outros campos se houver

            _autorRepository.Atualizar(autorExistente);
            return NoContent(); // Sucesso, sem conteúdo para retornar
        }

        [HttpDelete("deletar/{id}")]
        [Authorize(Roles = "administrador")] // Apenas admin pode deletar, por exemplo
        public IActionResult DeleteAutor(int id)
        {
            var autor = _autorRepository.BuscarPorId(id);
            if (autor == null) return NotFound("Autor não encontrado para exclusão.");

            _autorRepository.Remover(id);
            return NoContent(); // Sucesso, sem conteúdo para retornar
        }
    }
}