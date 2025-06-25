// Seu modelo Emprestimo

namespace Biblioteca.Modelos // ou o namespace que preferir
{
    public class Emprestimo
    {
        public int Id { get; set; }
        public int LivroId { get; set; }
        public int UsuarioId { get; set; }
        public DateTime DataEmprestimo { get; set; }
        public DateTime? DataDevolucao { get; set; }
        public DateTime DataDevolucaoPrevista { get; set; }
        public string Status { get; set; }
    }
}