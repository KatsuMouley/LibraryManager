using Biblioteca.Modelos;

namespace Biblioteca.Data
{
    public interface ILivroRepository
    {
        void Cadastrar(Livro livro);
        List<Livro> Listar();
        Livro? BuscarPorId(int id); // novo
        void Atualizar(Livro livro); // novo
        void Remover(int id); // novo
        bool Existe(int id);
        bool LivroEstaEmprestado(int livroId);
    }
}
