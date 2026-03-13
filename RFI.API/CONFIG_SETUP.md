# Development Setup - Configuration

## Setting Up Local Secrets

The `appsettings.Development.json` file is **NOT** committed to Git for security reasons.

### Quick Setup

1. Copy the template file:
   ```bash
   cp appsettings.Development.TEMPLATE.json appsettings.Development.json
   ```

2. Edit `appsettings.Development.json` and update:
   - `JwtSettings:SecretKey` - Keep the default or generate a new secret key
   - `ConnectionStrings:DefaultConnection` - Update your PostgreSQL password

### Alternative: Use Environment Variables

Instead of creating `appsettings.Development.json`, you can set environment variables:

**Windows (PowerShell):**
```powershell
$env:JWT_SECRET_KEY="YourSuperSecretKeyThatIsAtLeast32CharactersLong!"
$env:ConnectionStrings__DefaultConnection="Host=localhost;Port=5432;Database=rfi_db;Username=postgres;Password=postgres"
```

**Linux/Mac:**
```bash
export JWT_SECRET_KEY="YourSuperSecretKeyThatIsAtLeast32CharactersLong!"
export ConnectionStrings__DefaultConnection="Host=localhost;Port=5432;Database=rfi_db;Username=postgres;Password=postgres"
```

### Production Deployment

Never commit secrets to Git. Use:
- Environment variables (recommended)
- Azure Key Vault (for Azure deployments)
- Cloud provider secret management (Render, Railway, etc.)

## Files Overview

- ✅ `appsettings.json` - Base config (committed to Git, no secrets)
- ✅ `appsettings.Development.TEMPLATE.json` - Template (committed to Git)
- ❌ `appsettings.Development.json` - Your local secrets (NOT in Git)
- ❌ `appsettings.Production.json` - Production secrets (NOT in Git)
