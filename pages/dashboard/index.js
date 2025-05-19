import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/hooks';
import Layout from '../../components/layout/Layout';
import Link from 'next/link';
import { AVAILABLE_SERVICES } from '../../lib/oauth/services';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirigir a login si no hay usuario autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Bienvenido a GENIA
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Tu plataforma de automatización con IA para conectar tus servicios favoritos.
            </p>
          </div>

          {/* Tarjeta de usuario */}
          <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Información de usuario
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Detalles de tu cuenta y estado de conexiones.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Correo electrónico
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.email}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    ID de usuario
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {user.id}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Estado de la cuenta
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Sección de conexiones */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Tus conexiones
            </h2>
            <p className="mt-2 text-gray-600">
              Conecta tus servicios favoritos para automatizar tareas con GENIA.
            </p>
            
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {AVAILABLE_SERVICES.slice(0, 3).map((service) => (
                <div
                  key={service.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className={`p-5 ${service.color} ${service.textColor || 'text-white'} ${service.border || ''} flex items-center justify-center h-24`}>
                    <img
                      className="h-12 w-12"
                      src={service.icon}
                      alt={`${service.name} logo`}
                    />
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                    <div className="mt-4">
                      <Link
                        href="/connections"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Conectar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link
                href="/connections"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Ver todas las conexiones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
