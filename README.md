# GENIA Frontend - Sistema de Autenticación OAuth

Este repositorio contiene el frontend de GENIA, un sistema SaaS de automatización con IA que permite a los usuarios conectar sus propias herramientas (GitHub, Notion, Slack, Google Workspace, Instagram, Trello, Twitter/X) para crear y publicar contenido automáticamente.

## Estructura del Proyecto

El frontend está desarrollado con Next.js, Tailwind CSS y se integra con Supabase para la autenticación y almacenamiento de datos.

```
genia-frontend-oauth/
├── components/         # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── connections/    # Componentes para gestionar conexiones OAuth
│   ├── layout/         # Componentes de layout (header, footer, etc.)
│   └── ui/             # Componentes de UI genéricos
├── lib/                # Utilidades y configuraciones
│   ├── supabase/       # Cliente y utilidades de Supabase
│   └── oauth/          # Utilidades para manejar OAuth
├── pages/              # Páginas de la aplicación
│   ├── api/            # Rutas de API
│   ├── auth/           # Páginas de autenticación
│   ├── connections/    # Páginas de conexiones
│   └── dashboard/      # Páginas del dashboard
├── public/             # Archivos estáticos
├── styles/             # Estilos globales
├── types/              # Definiciones de tipos TypeScript
└── utils/              # Utilidades generales
```

## Características Principales

- **Autenticación de usuarios** con Supabase (registro, login, recuperación de contraseña)
- **Conexiones OAuth** con múltiples servicios:
  - GitHub
  - Notion
  - Slack
  - Google Workspace
  - Instagram
  - Trello
  - Twitter/X
- **Dashboard** para visualizar y gestionar conexiones
- **Sistema de créditos** para controlar el uso de la plataforma

## Flujo OAuth

El flujo OAuth para conectar servicios externos sigue estos pasos:

1. Usuario hace clic en "Conectar [Servicio]"
2. Frontend redirige al usuario al endpoint de autorización del backend
3. Backend redirige al usuario al servicio externo para autorización
4. Usuario autoriza la aplicación en el servicio externo
5. Servicio externo redirige al usuario de vuelta al backend con un código
6. Backend intercambia el código por un token y lo almacena en Supabase
7. Backend redirige al usuario de vuelta al frontend
8. Frontend muestra confirmación de conexión exitosa

## Configuración del Proyecto

### Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Cuenta en Supabase
- Servidores MCP desplegados

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
NEXT_PUBLIC_BACKEND_URL=url_del_backend
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/genia-frontend-oauth.git
cd genia-frontend-oauth

# Instalar dependencias
npm install
# o
yarn install

# Iniciar servidor de desarrollo
npm run dev
# o
yarn dev
```

## Despliegue

El frontend está configurado para ser desplegado en Vercel:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel
```

## Documentación Adicional

Para más detalles sobre la implementación y uso del sistema, consulta los siguientes documentos:

- [Guía de Pruebas para Flujo OAuth](../documentacion_pruebas_oauth.md)
- [Documentación para el Desarrollo del Frontend](../documentacion_frontend_genia.md)
