import { createClient } from '@supabase/supabase-js';

// Inicializar el cliente de Supabase con las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Faltan variables de entorno para Supabase. Asegúrate de configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para obtener el usuario actual
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error al obtener el usuario actual:', error.message);
    return null;
  }
  
  return user;
};

// Función para obtener la sesión actual
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error al obtener la sesión actual:', error.message);
    return null;
  }
  
  return session;
};

// Función para registrar un nuevo usuario
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Función para iniciar sesión
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Función para cerrar sesión
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  return true;
};

// Función para restablecer contraseña
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Función para actualizar contraseña
export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Función para obtener las conexiones OAuth del usuario
export const getUserConnections = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_connections')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error al obtener las conexiones del usuario:', error.message);
    return [];
  }
  
  return data;
};

// Función para verificar si un servicio está conectado
export const isServiceConnected = async (userId: string, service: string) => {
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
};

// Función para desconectar un servicio
export const disconnectService = async (userId: string, service: string) => {
  const { error } = await supabase
    .from('user_connections')
    .delete()
    .eq('user_id', userId)
    .eq('service', service);
  
  if (error) {
    throw error;
  }
  
  return true;
};

// Exportar el cliente y las funciones
export default supabase;
