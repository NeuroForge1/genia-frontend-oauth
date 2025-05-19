import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  // Crear cliente de Supabase en el lado del cliente
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}

export default MyApp;
