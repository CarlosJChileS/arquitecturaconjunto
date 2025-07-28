# 🔐 Configuración de Variables de Entorno

Este documento explica cómo configurar las variables de entorno de forma segura para el despliegue.

## ⚠️ Importante

**NUNCA** subas archivos con claves reales al repositorio. Las claves de API, tokens y URLs de base de datos deben mantenerse privadas.

## 📋 Variables Requeridas

### Variables de Google Cloud
- `PROJECT_ID`: ID de tu proyecto en Google Cloud Platform
- `SERVICE_NAME`: Nombre del servicio en Cloud Run (por defecto: `learnpro-app`)
- `REGION`: Región donde desplegar (por defecto: `us-central1`)

### Variables de la Aplicación
- `VITE_SUPABASE_URL`: URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Clave anónima de Supabase
- `VITE_STRIPE_PUBLISHABLE_KEY`: Clave pública de Stripe
- `VITE_APP_URL`: URL de la aplicación (se configura automáticamente)

## 🚀 Configuración para Despliegue

### Método 1: Variables de entorno del sistema

#### En Linux/macOS (bash):
```bash
# Copia .env.example a .env y edita con tus valores reales
cp .env.example .env
nano .env

# Carga las variables
source .env

# Ejecuta el despliegue
./deploy.sh
```

#### En Windows (PowerShell):
```powershell
# Copia .env.example a .env y edita con tus valores reales
Copy-Item .env.example .env
notepad .env

# Opción A: Usar script auxiliar (recomendado)
.\load-env.ps1

# Opción B: Definir variables manualmente
$env:PROJECT_ID = "tu-project-id-real"
$env:VITE_SUPABASE_URL = "https://tu-proyecto.supabase.co"
$env:VITE_SUPABASE_ANON_KEY = "tu_clave_anon_real"
$env:VITE_STRIPE_PUBLISHABLE_KEY = "pk_test_tu_clave_real"

# Ejecuta el despliegue
.\deploy.ps1
```

### Método 2: Archivo .env local

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edita `.env` con tus valores reales:
   ```bash
   PROJECT_ID=mi-proyecto-real-123
   VITE_SUPABASE_URL=https://abcdefgh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJ...
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
   ```

3. Carga las variables:
   ```bash
   source .env    # Linux/macOS
   ```

## 🔍 Obtener las Claves

### Supabase
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Settings > API
3. Copia la `URL` y `anon public` key

### Stripe
1. Ve a tu dashboard en [stripe.com](https://stripe.com)
2. Developers > API keys
3. Copia la `Publishable key` (empieza con `pk_test_` o `pk_live_`)

### Google Cloud
1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Selecciona tu proyecto
3. El ID del proyecto aparece en el dashboard

## 🔒 Buenas Prácticas

1. **Nunca** commitees archivos `.env` con valores reales
2. **Siempre** usa `.env.example` con valores de ejemplo
3. **Rota** las claves regularmente
4. **Usa** diferentes claves para desarrollo y producción
5. **Verifica** que `.env` esté en `.gitignore`

## 🐛 Solución de Problemas

### Error: "Variable X no está definida"
- Verifica que hayas definido todas las variables requeridas
- Verifica que hayas ejecutado `source .env` (Linux/macOS)
- Verifica la sintaxis del archivo `.env` (sin espacios alrededor del `=`)

### Error: "Invalid credentials"
- Verifica que las claves sean correctas y no estén expiradas
- Verifica que uses la clave correcta (test vs live en Stripe)

### Error: "Project not found"
- Verifica que el PROJECT_ID sea correcto
- Verifica que tengas permisos en el proyecto de Google Cloud
