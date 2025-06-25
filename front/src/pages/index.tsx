// src/pages/index.tsx
'use client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

export default function WelcomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Seção Hero com imagem de fundo */}
      <div 
        className="relative flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-cover bg-center"
        // <<<<< NOVO: URL da imagem atualizada >>>>>
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")' }}
      >
        {/* Overlay para escurecer a imagem */}
        <div className="absolute inset-0 bg-black opacity-70"></div>

        {/* Conteúdo Centralizado */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl sm:text-8xl font-extrabold mb-6 drop-shadow-2xl animate-fade-in-down">
            Seu Acervo Digital
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto drop-shadow-lg">
            A sua biblioteca pessoal, online e ao seu alcance.
          </p>

          {/* Botões Condicionais (Lógica Dinâmica) */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={() => router.push('/explorar')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-full shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 text-lg"
                >
                  Explorar Acervo
                </button>
                <button 
                  onClick={() => router.push('/Emprestimos/meus-livros')} 
                  className="bg-white hover:bg-gray-200 text-gray-900 font-bold py-4 px-12 rounded-full shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 text-lg"
                >
                  Gerenciar Meus Livros
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => router.push('/auth/login')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-full shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 text-lg"
                >
                  Fazer Login
                </button>
                <button 
                  onClick={() => router.push('/auth/register')} 
                  className="bg-white hover:bg-gray-200 text-gray-900 font-bold py-4 px-12 rounded-full shadow-2xl transition duration-300 ease-in-out transform hover:scale-105 text-lg"
                >
                  Cadastrar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Seção de "Como Funciona" */}
      <div className="bg-white text-gray-900 p-16 sm:p-24 text-center">
        <h2 className="text-4xl font-bold mb-12">Como Funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <span className="text-5xl">📖</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Explore o Acervo</h3>
            <p className="text-gray-600">Navegue por nossa coleção, procure por título ou autor.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <span className="text-5xl">✅</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Pegue Emprestado</h3>
            <p className="text-gray-600">Com sua conta, solicite o livro e receba a confirmação.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <span className="text-5xl">↩️</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Devolva no Prazo</h3>
            <p className="text-gray-600">Devolva o livro a tempo para evitar penalidades.</p>
          </div>
        </div>
      </div>
    </div>
  );
}