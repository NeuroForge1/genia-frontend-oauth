import { useAuth } from '../lib/hooks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// HOC para proteger rutas que requieren autenticación
export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      // Si no está cargando y no hay usuario, redirigir a login
      if (!loading && !user) {
        router.push(`/auth/login?redirect=${router.pathname}`);
      }
    }, [loading, user, router]);
    
    // Mostrar pantalla de carga mientras verifica la autenticación
    if (loading || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      );
    }
    
    // Si hay usuario, renderizar el componente protegido
    return <Component {...props} user={user} />;
  };
}
