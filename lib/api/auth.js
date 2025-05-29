import apiClient from './client';

export const registerUser = async (email, password, name, referralCode) => {
  // Crear un objeto con los campos requeridos
  const payload = {
    email,
    password
  };
  
  // Añadir campos opcionales solo si tienen valor
  if (name) {
    payload.name = name;
  }
  
  if (referralCode) {
    payload.referral_code = referralCode;
  }
  
  console.log('Enviando payload de registro:', {
    ...payload,
    password: '********' // No mostrar contraseña real en logs
  });
  
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await apiClient.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data;
};

export const storeAuthData = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
};

export const getAuthData = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return { token, user };
  }
  return { token: null, user: {} };
};

export const isAuthenticated = () => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('auth_token');
  }
  return false;
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
};

export const requestPasswordRecovery = async (email) => {
  const response = await apiClient.post('/auth/password-recovery', { email });
  return response.data;
};

export const googleAuthUrl = async () => {
  const response = await apiClient.get('/auth/google');
  return response.data.auth_url;
};

export const facebookAuthUrl = async () => {
  const response = await apiClient.get('/auth/facebook');
  return response.data.auth_url;
};
