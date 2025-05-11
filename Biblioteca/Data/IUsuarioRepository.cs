using Biblioteca.Modelos;

namespace Biblioteca.Data
{
    public interface IUsuarioRepository
    {
        Usuario? BuscarUsuarioPorEmailSenha(string email, string senha);
        Usuario? BuscarUsuarioPorEmail(string email);
        Usuario BuscarPorId(int id);
        void Cadastrar(Usuario usuario);
        List<Usuario> Listar();
        bool Existe(int id);
        void Atualizar(Usuario usuario);
    }
}
