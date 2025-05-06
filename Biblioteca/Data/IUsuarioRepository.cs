using Biblioteca.Modelos;

namespace Biblioteca.Data
{
    public interface IUsuarioRepository
    {
        void Cadastrar(Usuario usuario);
        List<Usuario> Listar();
        Usuario? BuscarUsuarioPorEmailSenha(string email, string senha);
        bool Existe(int id);
    }
}
