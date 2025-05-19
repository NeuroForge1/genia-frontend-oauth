export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} GENIA. Todos los derechos reservados.
          </p>
          <div className="mt-2 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Términos y condiciones
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Política de privacidad
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
