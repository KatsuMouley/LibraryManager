/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Caminhos para arquivos na raiz do projeto (geralmente não usados com a pasta src)
    // './pages/**/*.{js,ts,jsx,tsx,mdx}',
    // './components/**/*.{js,ts,jsx,tsx,mdx}',

    // **Caminhos para arquivos dentro da pasta `src`**
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // <- Verifique se esta linha está correta e ativada
    
    // Adicione outros caminhos se você tiver outras pastas com componentes
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Se você estiver usando o App Router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};