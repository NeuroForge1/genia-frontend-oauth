import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/hooks';
import { AVAILABLE_SERVICES, initiateOAuthFlow, checkServiceConnection, disconnectService } from '../../lib/oauth/services';
import Link from 'next/link';

export default function Connections() {
  const { user, loading: userLoading } = useAuth();
  const [connections, setConnections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { success, error: queryError } = router.query;

  // Cargar el estado de las conexiones al montar el componente
  useEffect(() => {
    const loadConnections = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Verificar el estado de conexión para cada servicio
        const connectionStates = {};
        
        for (const service of AVAILABLE_SERVICES) {
          const isConnected = await checkServiceConnection(user.id, service.id);
          connectionStates[service.id] = isConnected;
        }
        
        setConnections(connectionStates);
      } catch (err) {
        console.error('Error al cargar conexiones:', err);
        setError('Error al cargar el estado de las conexiones. Por favor, recarga la página.');
      } finally {
        setLoading(false);
      }
    };
    
    loadConnections();
  }, [user]);

  // Manejar la conexión de un servicio
  const handleConnect = async (serviceId) => {
    if (!user) {
      router.push('/auth/login?redirect=/connections');
      return;
    }
    
    try {
      await initiateOAuthFlow(serviceId, user.id);
    } catch (err) {
      console.error(`Error al iniciar flujo OAuth para ${serviceId}:`, err);
      setError(`Error al conectar con ${serviceId}. Por favor, inténtalo de nuevo.`);
    }
  };

  // Manejar la desconexión de un servicio
  const handleDisconnect = async (serviceId) => {
    if (!user) return;
    
    try {
      await disconnectService(user.id, serviceId);
      
      // Actualizar el estado local
      setConnections(prev => ({
        ...prev,
        [serviceId]: false
      }));
    } catch (err) {
      console.error(`Error al desconectar ${serviceId}:`, err);
      setError(`Error al desconectar ${serviceId}. Por favor, inténtalo de nuevo.`);
    }
  };

  // Redirigir a login si no hay usuario autenticado
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/login?redirect=/connections');
    }
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Conexiones
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Conecta tus servicios favoritos para automatizar tareas con GENIA.
          </p>
        </div>
        
        {error && (
          <div className="mt-8 max-w-3xl mx-auto bg-red-50 border-l-4 border-red-400 p-4">
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
              </div>
            </div>
          </div>
        )}
        
        {queryError && (
          <div className="mt-8 max-w-3xl mx-auto bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error al conectar el servicio: {queryError}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mt-8 max-w-3xl mx-auto bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  ¡Servicio {success} conectado exitosamente!
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none">
          {AVAILABLE_SERVICES.map((service) => (
            <div
              key={service.id}
              className={`flex flex-col rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
                connections[service.id] ? 'border-2 border-green-500' : 'hover:shadow-xl'
              }`}
            >
              <div className={`flex-shrink-0 h-24 ${service.color} ${service.textColor || 'text-white'} ${service.border || ''} flex items-center justify-center`}>
                <img
                  className="h-12 w-12"
                  src={service.icon}
                  alt={`${service.name} logo`}
                />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      connections[service.id] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {connections[service.id] ? 'Conectado' : 'No conectado'}
                    </span>
                  </div>
                  <p className="mt-3 text-base text-gray-500">{service.description}</p>
                </div>
                <div className="mt-6">
                  {connections[service.id] ? (
                    <button
                      onClick={() => handleDisconnect(service.id)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Desconectar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(service.id)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Conectar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
