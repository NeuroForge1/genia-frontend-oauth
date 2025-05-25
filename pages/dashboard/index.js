import { useState, useEffect } from 'react';
import { getAuthData, logoutUser } from '../../lib/api/auth';
import withAuth from '../../lib/withAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    // Obtener datos del usuario del localStorage
    try {
      const { user: userData } = getAuthData();
      if (userData) {
        setUser(userData);
      } else {
        setError('No se pudo cargar la información del usuario');
      }
    } catch (err) {
      console.error('Error al cargar datos de usuario:', err);
      setError('Error al cargar datos de usuario');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    try {
      logoutUser();
      router.push('/auth/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      setError('Error al cerrar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegación */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600">GENIA</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => handleSectionChange('dashboard')}
                  className={`${
                    activeSection === 'dashboard'
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleSectionChange('connections')}
                  className={`${
                    activeSection === 'connections'
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Conexiones
                </button>
                <button
                  onClick={() => handleSectionChange('credits')}
                  className={`${
                    activeSection === 'credits'
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Créditos
                </button>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {user && (
                <div className="ml-3 relative flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 font-bold mr-2">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 mr-4">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
            {/* Menú móvil */}
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menú principal</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeSection === 'dashboard' && 'Dashboard'}
              {activeSection === 'connections' && 'Conexiones'}
              {activeSection === 'credits' && 'Créditos'}
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Mensajes de error */}
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contenido según la sección activa */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {loading ? (
                <div className="p-10 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Cargando información...</p>
                </div>
              ) : (
                <>
                  {activeSection === 'dashboard' && (
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-xl font-semibold mb-4">Bienvenido, {user?.name || user?.email}</h2>
                      <div className="bg-white overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Información de usuario</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalles de tu cuenta</p>
                        </div>
                        <div className="border-t border-gray-200">
                          <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Email</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Plan</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  user?.plan === 'premium' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {user?.plan || 'Free'}
                                </span>
                              </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Créditos</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex items-center">
                                  <span className="text-lg font-semibold">{user?.creditos || 0}</span>
                                  <button className="ml-4 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    Comprar más
                                  </button>
                                </div>
                              </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">Módulos activos</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <div className="flex flex-wrap gap-2">
                                  {user?.modulos_activos ? (
                                    Array.isArray(user.modulos_activos) ? (
                                      user.modulos_activos.map((modulo, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                          {modulo}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-gray-500">Formato no válido</span>
                                    )
                                  ) : (
                                    <span className="text-gray-500">No hay módulos activos</span>
                                  )}
                                </div>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'connections' && (
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-xl font-semibold mb-4">Conexiones</h2>
                      <p className="text-gray-600 mb-6">Conecta tus cuentas para aprovechar al máximo GENIA.</p>
                      
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Tarjeta de conexión: OpenAI */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-gray-500">OpenAI</dt>
                                <dd className="flex items-center">
                                  <div className="flex items-center">
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></span>
                                    <span className="text-sm font-medium text-green-600">Conectado</span>
                                  </div>
                                </dd>
                              </div>
                            </div>
                            <div className="mt-4">
                              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Configurar
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Tarjeta de conexión: WhatsApp */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-gray-500">WhatsApp</dt>
                                <dd className="flex items-center">
                                  <div className="flex items-center">
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></span>
                                    <span className="text-sm font-medium text-green-600">Conectado</span>
                                  </div>
                                </dd>
                              </div>
                            </div>
                            <div className="mt-4">
                              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Configurar
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Tarjeta de conexión: Email */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="flex items-center">
                                  <div className="flex items-center">
                                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 mr-2"></span>
                                    <span className="text-sm font-medium text-yellow-600">Configuración pendiente</span>
                                  </div>
                                </dd>
                              </div>
                            </div>
                            <div className="mt-4">
                              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Conectar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'credits' && (
                    <div className="px-4 py-5 sm:p-6">
                      <h2 className="text-xl font-semibold mb-4">Créditos</h2>
                      <div className="bg-white overflow-hidden sm:rounded-lg mb-6">
                        <div className="px-4 py-5 sm:p-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Balance actual</h3>
                          <div className="mt-2 max-w-xl text-sm text-gray-500">
                            <p>Tus créditos disponibles para usar en GENIA.</p>
                          </div>
                          <div className="mt-5">
                            <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-500">Créditos disponibles</p>
                                <p className="text-3xl font-bold text-gray-900">{user?.creditos || 0}</p>
                              </div>
                              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Comprar más
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-lg font-medium text-gray-900 mb-4">Planes disponibles</h3>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Plan Básico */}
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                          <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Plan Básico</h3>
                            <div className="mt-2">
                              <p className="text-3xl font-bold text-gray-900">$9.99<span className="text-sm font-normal text-gray-500">/mes</span></p>
                              <p className="mt-4 text-sm text-gray-500">Ideal para comenzar con GENIA.</p>
                            </div>
                            <ul className="mt-4 space-y-2">
                              <li className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2 text-sm text-gray-500">100 créditos/mes</p>
                              </li>
                              <li className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2 text-sm text-gray-500">Acceso a OpenAI</p>
                              </li>
                              <li className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2 text-sm text-gray-500">WhatsApp básico</p>
                              </li>
                            </ul>
                            <div className="mt-6">
                              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Seleccionar plan
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Plan Premium */}
                        <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-primary-500">
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg leading-6 font-medium text-gray-900">Plan Premium</h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                Popular
                              </span>
                            </div>
                            <div className="mt-2">
                              <p className="text-3xl font-bold text-gray-900">$29.99<span className="text-sm font-normal text-gray-500">/mes</span></p>
                              <p className="mt-4 text-sm text-gray-500">Para usuarios que necesitan más potencia.</p>
                            </div>
                            <ul className="mt-4 space-y-2">
                              <li className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2 text-sm text-gray-500">500 créditos/mes</p>
                              </li>
                              <li className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2 text-sm text-gray-500">Acceso a OpenAI avanzado</p>
                              </li>
                              <li className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2 text-sm text-gray-500">WhatsApp completo</p>
                              </li>
                              <li className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2 text-sm text-gray-500">Email marketing</p>
                              </li>
                            </ul>
                            <div className="mt-6">
                              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Seleccionar plan
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Plan Empresarial */}
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                          <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Plan Empresarial</h3>
                            <div className="mt-2">
                              <p className="text-3xl font-bold text-gray-900">$99.99<span className="text-sm font-normal text-gray-500">/mes</span></p>
                              <p className="mt-4 text-sm text-gray-500">Para equipos y empresas.</p>
                            </div>
                            <ul className="mt-4 space-y-2">
                              <li className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2 text-sm text-gray-500">2000 créditos/mes</p>
                              </li>
                              <li className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2 text-sm text-gray-500">Todos los módulos</p>
                              </li>
                              <li className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2 text-sm text-gray-500">Soporte prioritario</p>
                              </li>
                              <li className="flex items-start">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="ml-2 text-sm text-gray-500">API personalizada</p>
                              </li>
                            </ul>
                            <div className="mt-6">
                              <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Contactar ventas
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
