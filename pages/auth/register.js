import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { registerUser, storeAuthData } from '../../lib/api/auth';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Enviando datos de registro:', {
        email: formData.email,
        name: formData.name,
        password: '********' // No mostrar contraseña real en logs
      });
      
      // Preparar datos para enviar al backend
      // Importante: No enviar campos opcionales como null o undefined
      const registrationData = {
        email: formData.email,
        password: formData.password
      };
      
      // Solo incluir name si tiene valor
      if (formData.name && formData.name.trim() !== '') {
        registrationData.name = formData.name;
      }
      
      // Llamar a la API de registro
      const data = await registerUser(
        formData.email,
        formData.password,
        formData.name || undefined,  // Enviar undefined en lugar de string vacío
        undefined  // No enviar referral_code
      );
      
      console.log('Registro exitoso:', data);
      
      // Guardar datos de autenticación
      storeAuthData(data);
      
      // Mostrar mensaje de éxito
      alert('¡Registro exitoso! Redirigiendo al dashboard...');
      
      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.message || 'Error al registrar usuario. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta en GENIA
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <Link href="/auth/login">
              <a className="font-medium text-indigo-600 hover:text-indigo-500">
                inicia sesión si ya tienes cuenta
              </a>
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="mt-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nombre (opcional)"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div className="mt-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Procesando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
