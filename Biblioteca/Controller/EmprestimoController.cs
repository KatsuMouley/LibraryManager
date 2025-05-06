using Microsoft.AspNetCore.Mvc;
using Biblioteca.Modelos;

namespace Biblioteca.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmprestimosController : ControllerBase
{
    private static List<Emprestimo> emprestimos = new();
    private static int idAtual = 1;

    [HttpGet]
    public ActionResult<IEnumerable<Emprestimo>> GetTodos() => emprestimos;

    [HttpPost]
    public IActionResult RealizarEmprestimo([FromBody] Emprestimo novoEmprestimo)
    {
        if (emprestimos.Any(e => e.LivroId == novoEmprestimo.LivroId && e.DataDevolucao == null))
            return BadRequest("Livro já emprestado.");

        novoEmprestimo.Id = idAtual++;
        emprestimos.Add(novoEmprestimo);
        return CreatedAtAction(nameof(GetTodos), new { id = novoEmprestimo.Id }, novoEmprestimo);
    }

    [HttpPost("devolver/{id}")]
    public IActionResult DevolverLivro(int id)
    {
        var emprestimo = emprestimos.FirstOrDefault(e => e.Id == id);
        if (emprestimo == null || emprestimo.DataDevolucao != null)
            return NotFound("Empréstimo não encontrado ou já devolvido.");

        emprestimo.DataDevolucao = DateTime.Now;
        return Ok(emprestimo);
    }
}
