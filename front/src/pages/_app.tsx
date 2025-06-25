// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/contexts/AuthContext'; // Importe o AuthProvider

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}