# Script para verificar que no hay claves sensibles antes del commit (PowerShell)

Write-Host "🔍 Verificando seguridad antes del commit..." -ForegroundColor Green

$ERRORS = 0

# Buscar claves JWT de Supabase
Write-Host "🔎 Buscando claves JWT de Supabase..." -ForegroundColor Yellow
try {
    $jwtResults = Select-String -Path "*.js", "*.ts", "*.json", "*.sh", "*.ps1", "*.toml" -Pattern "eyJhbGciOiJ" -Exclude "*.md", ".env.local" -Recurse -ErrorAction SilentlyContinue
    if ($jwtResults) {
        Write-Host "❌ ENCONTRADAS claves JWT de Supabase:" -ForegroundColor Red
        $jwtResults | ForEach-Object { Write-Host "   $($_.Filename):$($_.LineNumber) - $($_.Line.Trim())" -ForegroundColor Red }
        $ERRORS++
    }
} catch {
    # Ignorar errores de archivos no encontrados
}

# Buscar claves de Stripe
Write-Host "🔎 Buscando claves de Stripe..." -ForegroundColor Yellow
try {
    $stripeResults = Select-String -Path "*.js", "*.ts", "*.json", "*.sh", "*.ps1", "*.toml" -Pattern "sk_test_|pk_test_|sk_live_|pk_live_" -Exclude "*.md", ".env.local" -Recurse -ErrorAction SilentlyContinue
    if ($stripeResults) {
        Write-Host "❌ ENCONTRADAS claves de Stripe:" -ForegroundColor Red
        $stripeResults | ForEach-Object { Write-Host "   $($_.Filename):$($_.LineNumber) - $($_.Line.Trim())" -ForegroundColor Red }
        $ERRORS++
    }
} catch {
    # Ignorar errores de archivos no encontrados
}

# Buscar URLs específicas del proyecto
Write-Host "🔎 Buscando URLs específicas del proyecto..." -ForegroundColor Yellow
try {
    $urlResults = Select-String -Path "*.js", "*.ts", "*.json", "*.sh", "*.ps1" -Pattern "xfuhbjqqlgfxxkjvezhy" -Exclude "*.md", ".env.local", "config.toml" -Recurse -ErrorAction SilentlyContinue
    if ($urlResults) {
        Write-Host "⚠️  ENCONTRADAS URLs específicas del proyecto (verificar si son apropiadas):" -ForegroundColor Yellow
        $urlResults | ForEach-Object { Write-Host "   $($_.Filename):$($_.LineNumber) - $($_.Line.Trim())" -ForegroundColor Yellow }
    }
} catch {
    # Ignorar errores de archivos no encontrados
}

# Verificar que archivos críticos usen variables de entorno
Write-Host "🔎 Verificando uso de variables de entorno..." -ForegroundColor Yellow

# Verificar client.ts
if (Test-Path "src\integrations\supabase\client.ts") {
    $clientCheck = Select-String -Path "src\integrations\supabase\client.ts" -Pattern "import\.meta\.env\.VITE_SUPABASE_URL" -Quiet
    if (-not $clientCheck) {
        Write-Host "❌ client.ts no usa variables de entorno correctamente" -ForegroundColor Red
        $ERRORS++
    }
}

# Verificar fix-admin-profile.js
if (Test-Path "fix-admin-profile.js") {
    $profileCheck = Select-String -Path "fix-admin-profile.js" -Pattern "process\.env" -Quiet
    if (-not $profileCheck) {
        Write-Host "❌ fix-admin-profile.js no usa variables de entorno" -ForegroundColor Red
        $ERRORS++
    }
}

# Resultado final
if ($ERRORS -eq 0) {
    Write-Host "✅ Verificación de seguridad EXITOSA - No se encontraron problemas" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ FALLO en verificación de seguridad - $ERRORS problema(s) encontrado(s)" -ForegroundColor Red
    Write-Host "🔧 Por favor corrige los problemas antes de hacer commit" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Consejos:" -ForegroundColor Cyan
    Write-Host "   - Usa variables de entorno en lugar de claves hardcodeadas" -ForegroundColor Gray
    Write-Host "   - Verifica que .env.local esté en .gitignore" -ForegroundColor Gray
    Write-Host "   - Asegúrate de usar valores de ejemplo en archivos de configuración" -ForegroundColor Gray
}
