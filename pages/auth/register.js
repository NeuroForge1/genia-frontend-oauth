import { useState } from 'react';
import { registerUser, storeAuthData } from '../../lib/api/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const router = useRouter();
  const { referral } = router.query; // Capturar código de referido de la URL

  // Validación en tiempo real
  const [validations, setValidations] = useState({
    email: true,
    password: true,
    confirmPassword: true
  });

  // Función para validar email
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Función para validar contraseña
  const validatePassword = (password) => {
    return password.length >= 8; // Mínimo 8 caracteres
  };

  // Manejar cambios en los campos con validación
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      setValidations({...validations, email: validateEmail(value)});
    } else {
      setValidations({...validations, email: true}); // No mostrar error si está vacío
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value) {
      setValidations({...validations, password: validatePassword(value)});
    } else {
      setValidations({...validations, password: true}); // No mostrar error si está vacío
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value) {
      setValidations({...validations, confirmPassword: value === password});
    } else {
      setValidations({...validations, confirmPassword: true}); // No mostrar error si está vacío
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const doPasswordsMatch = password === confirmPassword;
    
    setValidations({
      email: isEmailValid,
      password: isPasswordValid,
      confirmPassword: doPasswordsMatch
    });
    
    // Si hay errores de validación, no continuar
    if (!isEmailValid || !isPasswordValid || !doPasswordsMatch) {
      setError('Por favor, corrige los errores en el formulario antes de continuar.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(null);
      
      // Usar el servicio de autenticación que se comunica con el backend
      const data = await registerUser(email, password, name, referral);
      
      // Mostrar mensaje de éxito
      setSuccess(true);
      
      // Almacenar token y datos de usuario
      storeAuthData(data);
      
      // Esperar un momento antes de redirigir para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Error al registrarse:', err);
      setError(err.message || 'Error al registrarse. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta en GENIA
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              inicia sesión si ya tienes cuenta
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  ¡Registro exitoso! Redirigiendo al dashboard...
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!success && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border ${!validations.email ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                />
                {!validations.email && (
                  <p className="mt-1 text-sm text-red-600">
                    Por favor, introduce un correo electrónico válido.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mt-3 mb-1">Nombre</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Nombre (opcional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-3 mb-1">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`appearance-none relative block w-full px-3 py-2 border ${!validations.password ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                  placeholder="Contraseña"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                />
                {!validations.password && (
                  <p className="mt-1 text-sm text-red-600">
                    La contraseña debe tener al menos 8 caracteres.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mt-3 mb-1">Confirmar contraseña</label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border ${!validations.confirmPassword ? 'border-red-300' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  disabled={loading}
                />
                {!validations.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    Las contraseñas no coinciden.
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
        )}
      </div>
    </div>
  );
}
