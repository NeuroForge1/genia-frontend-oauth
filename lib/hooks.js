import { useState, useEffect } from 'react';
import { supabase, getCurrentUser } from '../lib/supabase/client';

// Hook personalizado para manejar la autenticación
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener el usuario actual
    const fetchUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error en useAuth:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Obtener el usuario al montar el componente
    fetchUser();

    // Suscribirse a cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const currentUser = session?.user || null;
          setUser(currentUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Limpiar suscripción al desmontar
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return { user, loading, error };
};

// Hook para manejar las conexiones OAuth del usuario
export const useOAuthConnections = (userId) => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Solo cargar conexiones si hay un userId
    if (!userId) {
      setLoading(false);
      return;
    }

    // Función para obtener las conexiones del usuario
    const fetchConnections = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('user_connections')
          .select('*')
          .eq('user_id', userId);
        
        if (error) throw error;
        
        setConnections(data || []);
      } catch (err) {
        console.error('Error al obtener conexiones OAuth:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();

    // Suscribirse a cambios en la tabla user_connections
    const subscription = supabase
      .channel('user_connections_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_connections',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          // Actualizar las conexiones cuando haya cambios
          fetchConnections();
        }
      )
      .subscribe();

    // Limpiar suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  // Función para verificar si un servicio está conectado
  const isConnected = (service) => {
    return connections.some(conn => conn.service === service && conn.status === 'connected');
  };

  // Función para desconectar un servicio
  const disconnectService = async (service) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('user_id', userId)
        .eq('service', service);
      
      if (error) throw error;
      
      // Actualizar el estado local
      setConnections(prev => prev.filter(conn => conn.service !== service));
      
      return true;
    } catch (err) {
      console.error(`Error al desconectar ${service}:`, err);
      throw err;
    }
  };

  return { 
    connections, 
    loading, 
    error, 
    isConnected,
    disconnectService
  };
};
