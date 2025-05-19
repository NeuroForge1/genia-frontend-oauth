import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthToken, getUser } from './api/auth';

/**
 * HOC para proteger rutas que requieren autenticación
 * @param {Component} WrappedComponent - Componente a proteger
 * @returns {Component} - Componente protegido
 */
export default function withAuth(WrappedComponent) {
  return function WithAuth(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
      // Verificar si el usuario está autenticado
      const token = getAuthToken();
      const userData = getUser();
      
      if (!token || !userData) {
        // Redirigir a login si no hay token o usuario
        router.replace('/auth/login');
      } else {
        setUser(userData);
        setLoading(false);
      }
    }, [router]);
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} user={user} />;
  };
}
