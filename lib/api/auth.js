import apiClient from './client';

/**
 * Registra un nuevo usuario a través del backend
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} name - Nombre del usuario (opcional)
 * @param {string} referralCode - Código de referido (opcional)
 * @returns {Promise} - Promesa con los datos del usuario y token
 */
export const registerUser = async (email, password, name = '', referralCode = null) => {
  try {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      name,
      referral_code: referralCode
    });
    
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Inicia sesión de usuario a través del backend
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} - Promesa con los datos del usuario y token
 */
export const loginUser = async (email, password) => {
  try {
    // El backend espera un formato específico para OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error en login:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Inicia el flujo de autenticación con Google
 * @returns {Promise} - Promesa con la URL de autenticación
 */
export const startGoogleAuth = async () => {
  try {
    const response = await apiClient.get('/auth/google');
    return response.data;
  } catch (error) {
    console.error('Error al iniciar auth con Google:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Procesa el callback de autenticación con Google
 * @param {string} code - Código de autorización de Google
 * @returns {Promise} - Promesa con los datos del usuario y token
 */
export const processGoogleCallback = async (code) => {
  try {
    const response = await apiClient.get(`/auth/google/callback?code=${code}`);
    return response.data;
  } catch (error) {
    console.error('Error en callback de Google:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

/**
 * Almacena los datos de autenticación en localStorage
 * @param {Object} data - Datos de autenticación (token y usuario)
 */
export const storeAuthData = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
};

/**
 * Obtiene el token de autenticación de localStorage
 * @returns {string|null} - Token de autenticación o null
 */
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

/**
 * Obtiene los datos del usuario de localStorage
 * @returns {Object|null} - Datos del usuario o null
 */
export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

/**
 * Cierra la sesión del usuario
 */
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
};

/**
 * Solicita restablecimiento de contraseña
 * @param {string} email - Email del usuario
 * @returns {Promise} - Promesa con la respuesta del servidor
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error al solicitar reset de contraseña:', error.response?.data || error);
    throw error.response?.data || error;
  }
};
