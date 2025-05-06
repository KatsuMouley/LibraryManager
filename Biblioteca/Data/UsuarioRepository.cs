using Biblioteca.Modelos;
using Microsoft.EntityFrameworkCore;

namespace Biblioteca.Data
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly AppDataContext _context;

        public UsuarioRepository(AppDataContext context)
        {
            _context = context;
        }

        public Usuario? BuscarUsuarioPorEmailSenha(string email, string senha)
        {
            return _context.Usuarios.FirstOrDefault(
                x => x.Email == email && x.Senha == senha
            );
        }

        public void Cadastrar(Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            _context.SaveChanges();
        }

        public List<Usuario> Listar()
        {
            return _context.Usuarios.ToList();
        }

        public bool Existe(int id)
        {
            return _context.Usuarios.Any(u => u.Id == id);
        }
    }
}
