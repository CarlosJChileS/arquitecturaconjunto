#!/bin/bash

# Script para verificar que no hay claves sensibles antes del commit

echo "🔍 Verificando seguridad antes del commit..."

ERRORS=0

# Buscar claves JWT de Supabase
echo "🔎 Buscando claves JWT de Supabase..."
if grep -r "eyJhbGciOiJ" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" --exclude=".env.local" -q; then
    echo "❌ ENCONTRADAS claves JWT de Supabase:"
    grep -r "eyJhbGciOiJ" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" --exclude=".env.local"
    ERRORS=$((ERRORS + 1))
fi

# Buscar claves de Stripe
echo "🔎 Buscando claves de Stripe..."
if grep -r "sk_test_\|pk_test_\|sk_live_\|pk_live_" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" --exclude=".env.local" -q; then
    echo "❌ ENCONTRADAS claves de Stripe:"
    grep -r "sk_test_\|pk_test_\|sk_live_\|pk_live_" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" --exclude=".env.local"
    ERRORS=$((ERRORS + 1))
fi

# Buscar URLs específicas del proyecto
echo "🔎 Buscando URLs específicas del proyecto..."
if grep -r "xfuhbjqqlgfxxkjvezhy" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" --exclude=".env.local" --exclude="supabase/config.toml" -q; then
    echo "⚠️  ENCONTRADAS URLs específicas del proyecto (verificar si son apropiadas):"
    grep -r "xfuhbjqqlgfxxkjvezhy" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" --exclude=".env.local" --exclude="supabase/config.toml"
fi

# Verificar que archivos críticos usen variables de entorno
echo "🔎 Verificando uso de variables de entorno..."

# Verificar client.ts
if ! grep -q "import.meta.env.VITE_SUPABASE_URL" src/integrations/supabase/client.ts; then
    echo "❌ client.ts no usa variables de entorno correctamente"
    ERRORS=$((ERRORS + 1))
fi

# Verificar fix-admin-profile.js
if ! grep -q "process.env" fix-admin-profile.js; then
    echo "❌ fix-admin-profile.js no usa variables de entorno"
    ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -eq 0 ]; then
    echo "✅ Verificación de seguridad EXITOSA - No se encontraron problemas"
    exit 0
else
    echo ""
    echo "❌ FALLO en verificación de seguridad - $ERRORS problema(s) encontrado(s)"
    echo "🔧 Por favor corrige los problemas antes de hacer commit"
    echo ""
    echo "💡 Consejos:"
    echo "   - Usa variables de entorno en lugar de claves hardcodeadas"
    echo "   - Verifica que .env.local esté en .gitignore"
    echo "   - Asegúrate de usar valores de ejemplo en archivos de configuración"
    exit 1
fi
