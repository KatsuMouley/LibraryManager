using System;

namespace Biblioteca.Modelos;

public class Emprestimo
{
    public int Id { get; set; }
    public int LivroId { get; set; }
    public int UsuarioId { get; set; }
    public DateTime DataEmprestimo { get; set; } = DateTime.Now;
    public DateTime? DataDevolucao { get; set; } = null;
}
