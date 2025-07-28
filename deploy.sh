#!/bin/bash

# Script para desplegar en Google Cloud Run
# Configuración automática - solo ajusta las variables al inicio

set -e

# ====== CONFIGURACIÓN - AJUSTA ESTOS VALORES ======
# Opción 1: Define las variables aquí (NO RECOMENDADO para producción)
# PROJECT_ID="tu-project-id"
# SERVICE_NAME="learnpro-app"
# REGION="us-central1"

# Opción 2: Usa variables de entorno del sistema (RECOMENDADO)
# Ejecuta: export PROJECT_ID="tu-project-id" antes de ejecutar este script
# O crea un archivo .env y ejecuta: source .env

# Verificar que las variables requeridas estén definidas
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: Variable PROJECT_ID no está definida"
    echo "💡 Opción 1: export PROJECT_ID='tu-project-id'"
    echo "💡 Opción 2: Crea un archivo .env basado en .env.example y ejecuta: source .env"
    exit 1
fi

if [ -z "$SERVICE_NAME" ]; then
    SERVICE_NAME="learnpro-app"
    echo "📝 Usando SERVICE_NAME por defecto: $SERVICE_NAME"
fi

if [ -z "$REGION" ]; then
    REGION="us-central1"
    echo "📝 Usando REGION por defecto: $REGION"
fi

# Variables de entorno para la aplicación
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ Error: Variable VITE_SUPABASE_URL no está definida"
    echo "💡 Ejecuta: export VITE_SUPABASE_URL='https://tu-proyecto.supabase.co'"
    exit 1
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Variable VITE_SUPABASE_ANON_KEY no está definida"
    echo "💡 Ejecuta: export VITE_SUPABASE_ANON_KEY='tu_clave_anon'"
    exit 1
fi

if [ -z "$VITE_STRIPE_PUBLISHABLE_KEY" ]; then
    echo "❌ Error: Variable VITE_STRIPE_PUBLISHABLE_KEY no está definida"
    echo "💡 Ejecuta: export VITE_STRIPE_PUBLISHABLE_KEY='pk_test_tu_clave'"
    exit 1
fi
# ================================================

IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Iniciando despliegue automático en Google Cloud Run..."
echo "📝 Proyecto: $PROJECT_ID"
echo "📝 Servicio: $SERVICE_NAME"
echo "📝 Región: $REGION"

# Verificar que gcloud esté configurado
if ! gcloud config get-value project > /dev/null 2>&1; then
    echo "❌ Error: gcloud no está configurado. Ejecuta 'gcloud auth login' primero."
    exit 1
fi

# Configurar proyecto si es diferente
CURRENT_PROJECT=$(gcloud config get-value project)
if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
    echo "📝 Configurando proyecto: $PROJECT_ID"
    gcloud config set project $PROJECT_ID
fi

# Habilitar APIs necesarias
echo "🔧 Habilitando APIs necesarias..."
gcloud services enable run.googleapis.com --quiet
gcloud services enable containerregistry.googleapis.com --quiet

# 1. Construir la imagen Docker
echo "📦 Construyendo imagen Docker..."
docker build -t $IMAGE_NAME . --no-cache

# 2. Configurar autenticación de Docker para GCR
echo "🔐 Configurando autenticación Docker..."
gcloud auth configure-docker --quiet

# 3. Subir imagen a Google Container Registry
echo "⬆️ Subiendo imagen a Container Registry..."
docker push $IMAGE_NAME

# 4. Desplegar en Cloud Run con variables de entorno
echo "🌐 Desplegando en Cloud Run con configuración completa..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --concurrency 80 \
  --set-env-vars "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" \
  --set-env-vars "VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY" \
  --set-env-vars "VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY" \
  --set-env-vars "NODE_ENV=production" \
  --project $PROJECT_ID

# Obtener URL del servicio y configurar VITE_APP_URL
echo "🔧 Configurando URL de la aplicación..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)' --project $PROJECT_ID)

# Actualizar con la URL real del servicio
gcloud run services update $SERVICE_NAME \
  --set-env-vars "VITE_APP_URL=$SERVICE_URL" \
  --region $REGION \
  --project $PROJECT_ID

echo "✅ Despliegue completado exitosamente!"
echo ""
echo "🌍 Tu aplicación está disponible en: $SERVICE_URL"
echo "🔑 Panel de admin: $SERVICE_URL/admin-login"
echo ""
echo "📋 Información del despliegue:"
echo "   - Proyecto: $PROJECT_ID"
echo "   - Servicio: $SERVICE_NAME"
echo "   - Región: $REGION"
echo "   - Memoria: 1GB"
echo "   - CPU: 1 vCPU"
echo "   - Scaling: 0-10 instancias"
echo ""
echo "🔧 Para ver logs: gcloud run services logs read $SERVICE_NAME --region=$REGION"
