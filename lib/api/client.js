// Archivo de depuración para verificar la comunicación frontend-backend
// Añade logs detallados para identificar problemas de conectividad

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

console.log('NEXT_PUBLIC_BACKEND_URL:', API_URL);

// Crear cliente axios con la URL base del backend
const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  // Añadir timeout para detectar problemas de red
  timeout: 10000,
});

// Log de configuración
console.log('API Client configurado con baseURL:', `${API_URL}/api/v1`);

// Interceptor para añadir token de autenticación a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    console.log('Enviando solicitud a:', config.url);
    console.log('Método:', config.method);
    console.log('Datos:', config.data);
    
    // Obtener token del localStorage (solo en cliente)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token añadido a la solicitud');
      } else {
        console.log('No hay token disponible');
      }
    }
    return config;
  },
  (error) => {
    console.error('Error en interceptor de solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => {
    console.log('Respuesta recibida:', response.status);
    console.log('Datos de respuesta:', response.data);
    return response;
  },
  (error) => {
    console.error('Error en respuesta:', error);
    
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado
      // que cae fuera del rango 2xx
      console.error('Datos de error:', error.response.data);
      console.error('Estado:', error.response.status);
      console.error('Cabeceras:', error.response.headers);
      
      // Manejar errores de autenticación (401)
      if (error.response.status === 401) {
        console.log('Error de autenticación detectado');
        // Si estamos en el cliente, redirigir a login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          
          // Evitar redirección infinita si ya estamos en la página de login
          if (!window.location.pathname.includes('/auth/login')) {
            console.log('Redirigiendo a login');
            window.location.href = '/auth/login';
          }
        }
      }
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Algo ocurrió al configurar la solicitud que desencadenó un error
      console.error('Error al configurar la solicitud:', error.message);
    }
    
    // Verificar si es un error de CORS
    if (error.message && error.message.includes('Network Error')) {
      console.error('Posible error de CORS o problema de red');
    }
    
    // Verificar si es un error de timeout
    if (error.code === 'ECONNABORTED') {
      console.error('La solicitud excedió el tiempo de espera');
    }
    
    return Promise.reject(error);
  }
);

// Función de prueba para verificar conectividad
apiClient.testConnection = async () => {
  try {
    console.log('Probando conexión al backend...');
    const response = await axios.get(`${API_URL}/health`);
    console.log('Conexión exitosa:', response.status, response.data);
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Error al probar conexión:', error);
    return {
      success: false,
      error: error.message,
      details: error.response ? error.response.data : null
    };
  }
};

export default apiClient;
