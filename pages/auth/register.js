import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { registerUser, storeAuthData, isAuthenticated } from '../../lib/api/auth';

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
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar coincidencia de contraseñas
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        // Evaluar fortaleza de contraseña
        let strength = 0;
        if (value.length >= 8) strength += 1;
        if (/[A-Z]/.test(value)) strength += 1;
        if (/[0-9]/.test(value)) strength += 1;
        if (/[^A-Za-z0-9]/.test(value)) strength += 1;
        setPasswordStrength(strength);
      }
      
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (confirmPassword) {
        setPasswordMatch(password === confirmPassword);
      }
    }
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
    
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Enviando datos de registro:', {
        email: formData.email,
        name: formData.name,
        password: '********' // No mostrar contraseña real en logs
      });
      
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
      setSuccess(true);
      
      // Redirigir al dashboard después de un breve retraso
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.message || 'Error al registrar usuario. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar indicador de fortaleza de contraseña
  const renderPasswordStrength = () => {
    if (!formData.password) return null;
    
    const getStrengthText = () => {
      switch(passwordStrength) {
        case 0: return 'Muy débil';
        case 1: return 'Débil';
        case 2: return 'Media';
        case 3: return 'Fuerte';
        case 4: return 'Muy fuerte';
        default: return '';
      }
    };
    
    const getStrengthColor = () => {
      switch(passwordStrength) {
        case 0: return 'bg-red-500';
        case 1: return 'bg-orange-500';
        case 2: return 'bg-yellow-500';
        case 3: return 'bg-blue-500';
        case 4: return 'bg-green-500';
        default: return '';
      }
    };
    
    return (
      <div className="mt-1">
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${getStrengthColor()}`} style={{ width: `${passwordStrength * 25}%` }}></div>
          </div>
          <span className="ml-2 text-xs text-gray-600">{getStrengthText()}</span>
        </div>
      </div>
    );
  };

  // Si el registro fue exitoso, mostrar mensaje de éxito
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">¡Registro exitoso!</strong>
            <span className="block sm:inline"> Redirigiendo al dashboard...</span>
            <div className="mt-4 flex justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${formData.password && passwordStrength < 2 ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
              />
              {renderPasswordStrength()}
              {formData.password && passwordStrength < 2 && (
                <p className="mt-1 text-xs text-red-600">
                  La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, números y caracteres especiales.
                </p>
              )}
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
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${formData.confirmPassword && !passwordMatch ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {formData.confirmPassword && !passwordMatch && (
                <p className="mt-1 text-xs text-red-600">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || (formData.confirmPassword && !passwordMatch) || passwordStrength < 2}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(loading || (formData.confirmPassword && !passwordMatch) || passwordStrength < 2) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
