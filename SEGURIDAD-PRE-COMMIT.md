# 🔐 IMPORTANTE: Configuración de Seguridad

## ⚠️ ANTES DE HACER COMMIT

**VERIFICA** que no hay claves reales en estos archivos:

```bash
# Buscar claves de Supabase
grep -r "eyJhbGciOiJ" . --exclude-dir=node_modules --exclude-dir=.git

# Buscar claves de Stripe  
grep -r "sk_test_\|pk_test_\|sk_live_\|pk_live_" . --exclude-dir=node_modules --exclude-dir=.git

# Buscar URLs específicas del proyecto
grep -r "xfuhbjqqlgfxxkjvezhy" . --exclude-dir=node_modules --exclude-dir=.git
```

## ✅ Archivos que DEBEN usar variables de entorno

- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/edgeFunctions.ts`
- `fix-admin-profile.js`
- `supabase/.env.functions`
- `supabase/config.toml`

## 🚫 Archivos que NO se deben commitear

- `.env` (con valores reales)
- `.env.local` (ya está en .gitignore)
- `supabase/.env.functions` (si tiene valores reales)

## 🔍 Comando de verificación rápida

```bash
# Ejecutar antes de cada commit
./verify-security.sh
```

## 📋 Checklist pre-commit

- [ ] No hay claves JWT reales (eyJhbGciOiJ...)
- [ ] No hay claves de Stripe reales (sk_test_, pk_test_)
- [ ] No hay URLs específicas del proyecto
- [ ] Variables de entorno configuradas correctamente
- [ ] Archivos .env.* en .gitignore
