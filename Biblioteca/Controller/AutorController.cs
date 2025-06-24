// Controllers/AutorController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Biblioteca.Data;
using Biblioteca.Modelos;
using System.Collections.Generic;

namespace Biblioteca.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AutorController : ControllerBase
    {
        private readonly IAutorRepository _autorRepository;

        public AutorController(IAutorRepository autorRepository)
        {
            _autorRepository = autorRepository;
        }

        // Acesso público ao acervo de autores
        [HttpGet("listar")]
        [AllowAnonymous]
        public ActionResult<IEnumerable<Autor>> Listar()
        {
            var autores = _autorRepository.Listar();
            return Ok(autores);
        }

        // Detalhe de autor por ID (requer login)
        [HttpGet("{id}")]
        public ActionResult<Autor> BuscarPorId(int id)
        {
            var autor = _autorRepository.BuscarPorId(id);
            if (autor == null)
                return NotFound("Autor não encontrado.");
            return Ok(autor);
        }

        // Cadastrar novo autor (apenas administrador)
        [HttpPost]
        [Authorize(Roles = "administrador")]
        public ActionResult<Autor> Cadastrar(Autor autor)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _autorRepository.Cadastrar(autor);
            return CreatedAtAction(nameof(BuscarPorId), new { id = autor.Id }, autor);
        }

        // Atualizar autor por ID (apenas administrador)
        [HttpPut("alterar/{id}")]
        [Authorize(Roles = "administrador")]
        public IActionResult Atualizar(int id, Autor autor)
        {
            if (id != autor.Id)
                return BadRequest("ID inconsistente.");

            var existente = _autorRepository.BuscarPorId(id);
            if (existente == null)
                return NotFound("Autor não encontrado.");

            existente.Nome = autor.Nome;
            existente.Nacionalidade = autor.Nacionalidade;

            _autorRepository.Atualizar(existente);
            return NoContent();
        }

        // Remover autor por ID (apenas administrador)
        [HttpDelete("deletar/{id}")]
        [Authorize(Roles = "administrador")]
        public IActionResult Deletar(int id)
        {
            var autor = _autorRepository.BuscarPorId(id);
            if (autor == null)
                return NotFound("Autor não encontrado.");

            _autorRepository.Remover(id);
            return NoContent();
        }
    }
}
