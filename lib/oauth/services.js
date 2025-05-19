import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase/client';

// Servicios MCP disponibles
export const AVAILABLE_SERVICES = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Conecta tu cuenta de GitHub para automatizar issues, PRs y más.',
    icon: '/icons/github.svg',
    color: 'bg-gray-800',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Integra Notion para gestionar documentos y bases de conocimiento.',
    icon: '/icons/notion.svg',
    color: 'bg-gray-100',
    textColor: 'text-black',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Conecta Slack para automatizar mensajes y notificaciones.',
    icon: '/icons/slack.svg',
    color: 'bg-purple-600',
  },
  {
    id: 'google',
    name: 'Google Workspace',
    description: 'Integra Google Drive, Sheets y más para automatizar tu trabajo.',
    icon: '/icons/google.svg',
    color: 'bg-white',
    textColor: 'text-black',
    border: 'border border-gray-200',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Conecta Instagram para automatizar publicaciones y engagement.',
    icon: '/icons/instagram.svg',
    color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
  },
  {
    id: 'trello',
    name: 'Trello',
    description: 'Integra Trello para automatizar la gestión de tareas y proyectos.',
    icon: '/icons/trello.svg',
    color: 'bg-blue-500',
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Conecta Twitter para automatizar tweets y engagement.',
    icon: '/icons/twitter.svg',
    color: 'bg-black',
  },
];

// Función para iniciar el flujo OAuth
export const initiateOAuthFlow = async (service, userId) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://genia-backendmpc.onrender.com';
  const redirectUrl = `${backendUrl}/api/mcp/${service}/auth?user_id=${userId}`;
  
  // Redirigir al usuario al endpoint de autorización del backend
  window.location.href = redirectUrl;
};

// Hook para manejar el callback de OAuth
export const useOAuthCallback = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Verificar si estamos en una ruta de callback
    if (router.pathname.includes('/connections/callback')) {
      const { service, code, state, error } = router.query;
      
      if (error) {
        console.error('Error en el callback de OAuth:', error);
        // Redirigir al usuario a la página de conexiones con un mensaje de error
        router.push(`/connections?error=${error}`);
        return;
      }
      
      if (service && (code || state)) {
        // El backend ya ha procesado el callback y almacenado el token
        // Solo necesitamos redirigir al usuario a la página de conexiones con un mensaje de éxito
        router.push(`/connections?success=${service}`);
      }
    }
  }, [router.pathname, router.query]);
};

// Función para verificar si un servicio está conectado
export const checkServiceConnection = async (userId, service) => {
  try {
    const { data, error } = await supabase
      .from('user_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('service', service)
      .single();
    
    if (error) {
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error(`Error al verificar conexión de ${service}:`, err);
    return false;
  }
};

// Función para desconectar un servicio
export const disconnectService = async (userId, service) => {
  try {
    // Primero, eliminar la conexión de la base de datos
    const { error: dbError } = await supabase
      .from('user_connections')
      .delete()
      .eq('user_id', userId)
      .eq('service', service);
    
    if (dbError) {
      throw dbError;
    }
    
    // Luego, llamar al backend para revocar el token si es necesario
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://genia-backendmpc.onrender.com';
    const response = await fetch(`${backendUrl}/api/mcp/${service}/disconnect?user_id=${userId}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al desconectar el servicio');
    }
    
    return true;
  } catch (err) {
    console.error(`Error al desconectar ${service}:`, err);
    throw err;
  }
};
