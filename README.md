# 🎓 LearnPro - Plataforma de Cursos Online

Una plataforma moderna de cursos online con panel de administración, sistema de suscripciones y pagos integrados.

## 📋 Req## 🚀 Despliegue Automático en Google Cloud Run

### ⚡ Despliegue Express (3 pasos):

1. **Configurar Google Cloud:**
   ```bash
   gcloud auth login
   gcloud config set project TU_PROJECT_ID
   ```

2. **Editar script de despliegue:**
   Abre `deploy.sh` (Linux/Mac) o `deploy.ps1` (Windows) y cambia:
   ```bash
   PROJECT_ID="tu-project-id-real"        # ⚠️ OBLIGATORIO
   SUPABASE_URL="tu-url-supabase"         # ⚠️ OBLIGATORIO  
   SUPABASE_ANON_KEY="tu-anon-key"        # ⚠️ OBLIGATORIO
   ```

3. **Ejecutar despliegue:**
   ```bash
   # Linux/Mac
   ./deploy.sh
   
   # Windows
   .\deploy.ps1
   ```

**🎉 ¡Listo!** Tu app estará funcionando en minutos con todas las configuraciones automáticas.

📋 **Ver guía rápida completa:** [DEPLOY-QUICK.md](./DEPLOY-QUICK.md)

### 🔧 Lo que hace automáticamente el script:
- ✅ Habilita APIs necesarias
- ✅ Construye imagen Docker optimizada
- ✅ Configura todas las variables de entorno
- ✅ Despliega con configuración de producción
- ✅ Configura auto-scaling (0-10 instancias)
- ✅ Habilita acceso público
- ✅ Configura health checks
- ✅ Optimiza memoria y CPU

## 🚀 Despliegue Manual Detallado (Opcional)

### Requisitos para despliegue:itos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (incluido con Node.js) o **yarn**
- **Git** - [Descargar aquí](https://git-scm.com/)

### Verificar instalación:
```bash
node --version
npm --version
git --version
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/CarlosJChileS/arquitecturaconjunto.git
cd arquitecturaconjunto
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Variables para Supabase Edge Functions
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Stripe Configuration (Opcional - para pagos)
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret
VITE_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key

# PayPal Configuration (Opcional - para pagos)
PAYPAL_CLIENT_ID=tu_paypal_client_id
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret

# Resend Email Service (Opcional - para emails)
RESEND_API_KEY=tu_resend_api_key

# App Configuration
VITE_APP_URL=http://localhost:8083
```

### 4. Configurar Supabase (Base de datos)

1. Ve a [Supabase](https://supabase.com/) y crea un nuevo proyecto
2. Copia la URL y las claves desde el dashboard de Supabase
3. Ejecuta las migraciones SQL desde la carpeta `supabase/migrations/`

## 🏃‍♂️ Ejecutar el Proyecto

### Desarrollo
```bash
npm run dev
```
La aplicación se abrirá en: http://localhost:8083

### Producción
```bash
npm run build
npm run preview
```

## 🔑 Credenciales de Administrador

Para acceder al panel de administración:
- URL: http://localhost:8083/admin-login
- Email: carlosjchiles@gmail.com
- Contraseña: (configurar en Supabase Auth)

## 📁 Estructura del Proyecto

```
arquitecturaconjunto/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes de UI (shadcn)
│   │   └── ...
│   ├── pages/              # Páginas de la aplicación
│   │   ├── AdminLogin.tsx  # Login de administrador
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminCourseEditor.tsx
│   │   └── ...
│   ├── contexts/           # Contextos de React
│   ├── hooks/              # Hooks personalizados
│   ├── lib/               # Utilidades
│   └── integrations/      # Integraciones (Supabase)
├── supabase/              # Configuración de Supabase
│   ├── functions/         # Edge Functions
│   └── migrations/        # Migraciones SQL
├── public/                # Archivos estáticos
├── Dockerfile             # Configuración Docker
├── .dockerignore          # Archivos excluidos del build
├── nginx.conf             # Configuración Nginx
├── cloud-run.yaml         # Configuración Cloud Run
├── deploy.sh              # Script de despliegue (Linux/Mac)
├── deploy.ps1             # Script de despliegue (Windows)
└── ...
```

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - React 18 + TypeScript
  - Vite (Build tool)
  - Tailwind CSS
  - shadcn/ui (Componentes)
  - React Router (Navegación)
  - React Query (Estado del servidor)

- **Backend:**
  - Supabase (Base de datos + Auth)
  - Supabase Edge Functions
  - PostgreSQL

- **Pagos:**
  - Stripe
  - PayPal

- **Email:**
  - Resend

## 🌟 Características

- ✅ Sistema de autenticación (usuarios y admin)
- ✅ Panel de administración completo
- ✅ Editor de cursos avanzado
- ✅ Sistema de suscripciones
- ✅ Procesamiento de pagos
- ✅ Gestión de usuarios
- ✅ Responsive design
- ✅ Dashboard de analytics

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter
npm run type-check   # Verificación de tipos
```

## 🔧 Configuración Adicional

### Base de datos Supabase
1. Ejecutar migraciones en: `supabase/migrations/`
2. Configurar Row Level Security (RLS)
3. Subir Edge Functions: `supabase/functions/`

### Configurar Stripe (Opcional)
1. Crear cuenta en Stripe
2. Configurar webhooks
3. Agregar claves en `.env.local`

## � Despliegue en Google Cloud Run

### Requisitos para despliegue:
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) instalado
- [Docker](https://docs.docker.com/get-docker/) instalado
- Proyecto de Google Cloud configurado
- Facturación habilitada en el proyecto

### 1. Configurar Google Cloud
```bash
# Instalar gcloud CLI y autenticarse
gcloud auth login
gcloud config set project TU_PROJECT_ID

# Habilitar APIs necesarias
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Configurar variables de entorno para producción
Edita los scripts `deploy.sh` o `deploy.ps1` y actualiza:
```bash
PROJECT_ID="tu-project-id"        # Tu ID de proyecto en Google Cloud
SERVICE_NAME="learnpro-app"       # Nombre del servicio
REGION="us-central1"              # Región de despliegue
```

### 3. Desplegar automáticamente

**En Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**En Windows (PowerShell):**
```powershell
.\deploy.ps1
```

### 4. Despliegue manual paso a paso
```bash
# 1. Construir imagen
docker build -t gcr.io/TU_PROJECT_ID/learnpro-app .

# 2. Subir a Container Registry
docker push gcr.io/TU_PROJECT_ID/learnpro-app

# 3. Desplegar en Cloud Run
gcloud run deploy learnpro-app \
  --image gcr.io/TU_PROJECT_ID/learnpro-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10
```

### 5. Configurar variables de entorno en Cloud Run
```bash
gcloud run services update learnpro-app \
  --set-env-vars "VITE_SUPABASE_URL=tu_url,VITE_SUPABASE_ANON_KEY=tu_key" \
  --region us-central1
```

### 6. Configurar dominio personalizado (Opcional)
1. Ve a Cloud Run en la consola de Google Cloud
2. Selecciona tu servicio
3. Ve a la pestaña "CUSTOM DOMAINS"
4. Agrega tu dominio y sigue las instrucciones

## �🐛 Solución de Problemas

### Puerto en uso
Si el puerto 8083 está ocupado, Vite automáticamente usará el siguiente disponible.

### Error de conexión a Supabase
Verifica que las variables de entorno estén correctamente configuradas.

### Problemas de instalación
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error de construcción Docker
```bash
# Verificar que Docker esté ejecutándose
docker --version

# Limpiar cache de Docker
docker system prune -a
```

### Error de despliegue en Cloud Run
```bash
# Verificar logs del servicio
gcloud run services logs read learnpro-app --region=us-central1

# Verificar configuración del proyecto
gcloud config list
```

### Variables de entorno en producción
Asegúrate de configurar todas las variables necesarias en Cloud Run:
```bash
gcloud run services update learnpro-app \
  --set-env-vars "VITE_SUPABASE_URL=https://tu-proyecto.supabase.co" \
  --set-env-vars "VITE_SUPABASE_ANON_KEY=tu-anon-key" \
  --region us-central1
```

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación de [Supabase](https://supabase.com/docs)
2. Consulta la documentación de [Vite](https://vitejs.dev/)
3. Abre un issue en este repositorio

---

**Desarrollado con ❤️ usando React + Supabase**
