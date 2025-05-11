// Data/IAutorRepository.cs
using Biblioteca.Modelos;
using System.Collections.Generic;

namespace Biblioteca.Data
{
    public interface IAutorRepository
    {
        IEnumerable<Autor> Listar();
        Autor? BuscarPorId(int id);
        void Cadastrar(Autor autor);
        void Atualizar(Autor autor);
        void Remover(int id);
        bool Existe(int id); // Opcional, mas útil
    }
}