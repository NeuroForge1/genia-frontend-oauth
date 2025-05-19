import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useOAuthCallback } from '../../lib/oauth/services';

export default function OAuthCallback() {
  const router = useRouter();
  
  // Usar el hook personalizado para manejar el callback
  useOAuthCallback();
  
  // Mostrar un mensaje de carga mientras se procesa el callback
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">Procesando autenticación...</h2>
      <p className="mt-2 text-gray-500">Por favor, espera mientras completamos el proceso.</p>
    </div>
  );
}
