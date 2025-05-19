import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { processGoogleCallback, storeAuthData } from '../../lib/api/auth';

export default function Callback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { code, service } = router.query;

  useEffect(() => {
    // Solo procesar cuando tenemos el código y el servicio
    if (code && service) {
      processCallback();
    }
  }, [code, service]);

  const processCallback = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      // Procesar según el servicio
      if (service === 'google') {
        data = await processGoogleCallback(code);
      } else {
        throw new Error(`Servicio no soportado: ${service}`);
      }
      
      // Almacenar token y datos de usuario
      storeAuthData(data);
      
      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error(`Error en callback de ${service}:`, err);
      setError(err.detail || err.message || `Error al procesar la autenticación con ${service}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Procesando autenticación
          </h2>
        </div>
        
        {error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    className="text-sm font-medium text-red-700 hover:text-red-600"
                    onClick={() => router.push('/auth/login')}
                  >
                    Volver al inicio de sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">
              Procesando tu autenticación con {service}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
