import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Crear cliente axios con la URL base del backend
const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token de autenticación a las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage (solo en cliente)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores de autenticación (401)
    if (error.response && error.response.status === 401) {
      // Si estamos en el cliente, redirigir a login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        
        // Evitar redirección infinita si ya estamos en la página de login
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
