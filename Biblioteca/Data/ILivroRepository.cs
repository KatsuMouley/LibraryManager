using System;
using Biblioteca.Modelos;

namespace Biblioteca.Data;

public interface ILivroRepository
{
    void Cadastrar(Livro livro);
    List<Livro> Listar();
}
