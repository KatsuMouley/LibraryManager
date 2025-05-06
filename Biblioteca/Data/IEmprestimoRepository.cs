using Biblioteca.Modelos;

namespace Biblioteca.Data
{
    public interface IEmprestimoRepository
    {
        void Cadastrar(Emprestimo emprestimo);
        void Devolver(int id);
        List<Emprestimo> Listar();
        Emprestimo? BuscarPorId(int id);
        bool LivroEstaEmprestado(int livroId);
    }
}
