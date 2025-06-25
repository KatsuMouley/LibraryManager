// src/pages/index.tsx
import Link from 'next/link';
//TELA INICIAL
export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in-down">
        Bem-vindo(a) ao Acervo Digital!
      </h1>
      <p className="text-lg text-gray-700 mb-12 max-w-2xl">
        Explore nossa vasta coleção de livros. Faça login para gerenciar empréstimos, favoritos e mais!
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Opção 1: Continuar Explorando */}
        <Link href="/explorar" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
          Explorar Acervo
        </Link>

        {/* Opção 2: Fazer Login */}
        <Link href="/auth/login" className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-4 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 border-2 border-blue-600">
          Fazer Login
        </Link>
      </div>
      
      <p className="mt-8 text-gray-500 text-sm">
        Não tem uma conta?{' '}
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Cadastre-se agora
        </Link>
      </p>
    </div>
  );
}