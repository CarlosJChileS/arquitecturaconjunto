# Script para cargar variables de entorno desde archivo .env en PowerShell
# Uso: .\load-env.ps1

param(
    [string]$EnvFile = ".env"
)

if (-not (Test-Path $EnvFile)) {
    Write-Host "❌ Error: Archivo $EnvFile no encontrado" -ForegroundColor Red
    Write-Host "💡 Crea el archivo basado en .env.example" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Cargando variables de entorno desde $EnvFile..." -ForegroundColor Green

Get-Content $EnvFile | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]*)\s*=\s*(.*)\s*$") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        
        # Remover comillas si las hay
        if ($value -match '^"(.*)"$') {
            $value = $matches[1]
        } elseif ($value -match "^'(.*)'$") {
            $value = $matches[1]
        }
        
        Set-Item -Path "env:$name" -Value $value
        Write-Host "✅ $name configurado" -ForegroundColor Gray
    }
}

Write-Host "🎉 Variables cargadas exitosamente!" -ForegroundColor Green
Write-Host "💡 Ahora puedes ejecutar: .\deploy.ps1" -ForegroundColor Yellow
