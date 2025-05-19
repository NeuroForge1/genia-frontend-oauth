import { useState, useEffect } from 'react';
import { getUser, logout } from '../../lib/api/auth';
import withAuth from '../../lib/withAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Obtener datos del usuario del localStorage
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600">GENIA</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/dashboard" className="border-primary-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/connections" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Conexiones
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Abrir menú de usuario</span>
                    <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
                {user ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Bienvenido, {user.name || user.email}</h2>
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Información de usuario</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles de tu cuenta</p>
                      </div>
                      <div className="border-t border-gray-200">
                        <dl>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                          </div>
                          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Plan</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.plan || 'Free'}</dd>
                          </div>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Créditos</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.creditos || 0}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Link href="/connections" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Gestionar conexiones
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando información de usuario...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
