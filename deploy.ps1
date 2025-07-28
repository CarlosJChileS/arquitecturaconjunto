# Script para desplegar en Google Cloud Run (PowerShell)
# Configuración automática - solo ajusta las variables al inicio

# ====== CONFIGURACIÓN - AJUSTA ESTOS VALORES ======
# Opción 1: Define las variables aquí (NO RECOMENDADO para producción)
# $PROJECT_ID = "tu-project-id"
# $SERVICE_NAME = "learnpro-app"
# $REGION = "us-central1"

# Opción 2: Usa variables de entorno del sistema (RECOMENDADO)
# Ejecuta: $env:PROJECT_ID = "tu-project-id" antes de ejecutar este script
# O carga desde un archivo .env

# Verificar que las variables requeridas estén definidas
if (-not $env:PROJECT_ID) {
    Write-Host "❌ Error: Variable PROJECT_ID no está definida" -ForegroundColor Red
    Write-Host "💡 Opción 1: `$env:PROJECT_ID = 'tu-project-id'" -ForegroundColor Yellow
    Write-Host "💡 Opción 2: Crea un archivo .env basado en .env.example" -ForegroundColor Yellow
    exit 1
}
$PROJECT_ID = $env:PROJECT_ID

if (-not $env:SERVICE_NAME) {
    $SERVICE_NAME = "learnpro-app"
    Write-Host "📝 Usando SERVICE_NAME por defecto: $SERVICE_NAME" -ForegroundColor Yellow
} else {
    $SERVICE_NAME = $env:SERVICE_NAME
}

if (-not $env:REGION) {
    $REGION = "us-central1"
    Write-Host "📝 Usando REGION por defecto: $REGION" -ForegroundColor Yellow
} else {
    $REGION = $env:REGION
}

# Variables de entorno para la aplicación
if (-not $env:VITE_SUPABASE_URL) {
    Write-Host "❌ Error: Variable VITE_SUPABASE_URL no está definida" -ForegroundColor Red
    Write-Host "💡 Ejecuta: `$env:VITE_SUPABASE_URL = 'https://tu-proyecto.supabase.co'" -ForegroundColor Yellow
    exit 1
}

if (-not $env:VITE_SUPABASE_ANON_KEY) {
    Write-Host "❌ Error: Variable VITE_SUPABASE_ANON_KEY no está definida" -ForegroundColor Red
    Write-Host "💡 Ejecuta: `$env:VITE_SUPABASE_ANON_KEY = 'tu_clave_anon'" -ForegroundColor Yellow
    exit 1
}

if (-not $env:VITE_STRIPE_PUBLISHABLE_KEY) {
    Write-Host "❌ Error: Variable VITE_STRIPE_PUBLISHABLE_KEY no está definida" -ForegroundColor Red
    Write-Host "💡 Ejecuta: `$env:VITE_STRIPE_PUBLISHABLE_KEY = 'pk_test_tu_clave'" -ForegroundColor Yellow
    exit 1
}
# ================================================

$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "🚀 Iniciando despliegue automático en Google Cloud Run..." -ForegroundColor Green
Write-Host "📝 Proyecto: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "📝 Servicio: $SERVICE_NAME" -ForegroundColor Yellow
Write-Host "📝 Región: $REGION" -ForegroundColor Yellow

try {
    # Verificar que gcloud esté configurado
    $currentProject = gcloud config get-value project 2>$null
    if (-not $currentProject) {
        Write-Host "❌ Error: gcloud no está configurado. Ejecuta 'gcloud auth login' primero." -ForegroundColor Red
        exit 1
    }

    # Configurar proyecto si es diferente
    if ($currentProject -ne $PROJECT_ID) {
        Write-Host "📝 Configurando proyecto: $PROJECT_ID" -ForegroundColor Yellow
        gcloud config set project $PROJECT_ID
        if ($LASTEXITCODE -ne 0) { throw "Error configurando proyecto" }
    }

    # Habilitar APIs necesarias
    Write-Host "🔧 Habilitando APIs necesarias..." -ForegroundColor Yellow
    gcloud services enable run.googleapis.com --quiet
    gcloud services enable containerregistry.googleapis.com --quiet

    # 1. Construir la imagen Docker
    Write-Host "📦 Construyendo imagen Docker..." -ForegroundColor Yellow
    docker build -t $IMAGE_NAME . --no-cache
    if ($LASTEXITCODE -ne 0) { throw "Error construyendo imagen Docker" }

    # 2. Configurar autenticación de Docker para GCR
    Write-Host "🔐 Configurando autenticación Docker..." -ForegroundColor Yellow
    gcloud auth configure-docker --quiet

    # 3. Subir imagen a Google Container Registry
    Write-Host "⬆️ Subiendo imagen a Container Registry..." -ForegroundColor Yellow
    docker push $IMAGE_NAME
    if ($LASTEXITCODE -ne 0) { throw "Error subiendo imagen" }

    # 4. Desplegar en Cloud Run con variables de entorno
    Write-Host "🌐 Desplegando en Cloud Run con configuración completa..." -ForegroundColor Yellow
    gcloud run deploy $SERVICE_NAME `
        --image $IMAGE_NAME `
        --platform managed `
        --region $REGION `
        --allow-unauthenticated `
        --port 8080 `
        --memory 1Gi `
        --cpu 1 `
        --min-instances 0 `
        --max-instances 10 `
        --timeout 300 `
        --concurrency 80 `
        --set-env-vars "VITE_SUPABASE_URL=$($env:VITE_SUPABASE_URL)" `
        --set-env-vars "VITE_SUPABASE_ANON_KEY=$($env:VITE_SUPABASE_ANON_KEY)" `
        --set-env-vars "VITE_STRIPE_PUBLISHABLE_KEY=$($env:VITE_STRIPE_PUBLISHABLE_KEY)" `
        --set-env-vars "NODE_ENV=production" `
        --project $PROJECT_ID

    if ($LASTEXITCODE -ne 0) { throw "Error desplegando en Cloud Run" }

    # Obtener URL del servicio y configurar VITE_APP_URL
    Write-Host "🔧 Configurando URL de la aplicación..." -ForegroundColor Yellow
    $SERVICE_URL = gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID

    # Actualizar con la URL real del servicio
    gcloud run services update $SERVICE_NAME `
        --set-env-vars "VITE_APP_URL=$SERVICE_URL" `
        --region $REGION `
        --project $PROJECT_ID

    Write-Host "✅ Despliegue completado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌍 Tu aplicación está disponible en: $SERVICE_URL" -ForegroundColor Cyan
    Write-Host "🔑 Panel de admin: $SERVICE_URL/admin-login" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Información del despliegue:" -ForegroundColor White
    Write-Host "   - Proyecto: $PROJECT_ID" -ForegroundColor Gray
    Write-Host "   - Servicio: $SERVICE_NAME" -ForegroundColor Gray
    Write-Host "   - Región: $REGION" -ForegroundColor Gray
    Write-Host "   - Memoria: 1GB" -ForegroundColor Gray
    Write-Host "   - CPU: 1 vCPU" -ForegroundColor Gray
    Write-Host "   - Scaling: 0-10 instancias" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔧 Para ver logs: gcloud run services logs read $SERVICE_NAME --region=$REGION" -ForegroundColor Yellow

} catch {
    Write-Host "❌ Error durante el despliegue: $_" -ForegroundColor Red
    exit 1
}
