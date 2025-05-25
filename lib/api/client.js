import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token de autenticación
apiClient.interceptors.request.use(
  (config) => {
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
    // Crear un objeto de error más amigable y detallado
    const customError = {
      message: 'Ha ocurrido un error inesperado',
      status: 500,
      data: null,
      detail: null
    };
    
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      customError.status = error.response.status;
      customError.data = error.response.data;
      
      // Extraer mensaje de error detallado si existe
      if (error.response.data) {
        if (error.response.data.detail) {
          customError.detail = error.response.data.detail;
          customError.message = error.response.data.detail;
        } else if (error.response.data.message) {
          customError.detail = error.response.data.message;
          customError.message = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          customError.detail = error.response.data;
          customError.message = error.response.data;
        }
      }
      
      // Mensajes específicos según código de estado
      switch (error.response.status) {
        case 401:
          customError.message = 'No autorizado. Por favor, inicia sesión nuevamente.';
          // Limpiar datos de autenticación si el token expiró
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            // Redirigir a login si es necesario
            if (window.location.pathname !== '/auth/login') {
              window.location.href = '/auth/login';
            }
          }
          break;
        case 403:
          customError.message = 'No tienes permisos para realizar esta acción.';
          break;
        case 404:
          customError.message = 'El recurso solicitado no existe.';
          break;
        case 422:
          customError.message = 'Datos de formulario inválidos. Por favor, verifica la información.';
          break;
        case 500:
          customError.message = 'Error del servidor. Por favor, intenta más tarde.';
          break;
      }
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      customError.message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      customError.detail = 'Error de conexión: no se recibió respuesta del servidor.';
    } else {
      // Error al configurar la solicitud
      customError.message = error.message;
      customError.detail = 'Error al configurar la solicitud.';
    }
    
    // Registrar el error para depuración
    console.error('Error API:', customError);
    
    return Promise.reject(customError);
  }
);

export default apiClient;
