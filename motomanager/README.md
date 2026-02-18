# MotoManager

Production-ready MVP monorepo.

## Cloud start (bez lokalnog testa)

### 1) Supabase (Postgres)
1. Kreiraj novi Supabase projekat.
2. Kopiraj connection string (Transaction pooler ili Direct).
3. U Render env var postavi:
	- `ConnectionStrings__Default` = tvoj Supabase connection string

### 2) Backend (Render)
1. Kreiraj novi Web Service (Linux) iz repo-a.
2. Root dir: `motomanager/backend`
3. Language: **Docker** (koristi Dockerfile iz backend foldera)
4. Dodaj env vars:
	- `ConnectionStrings__Default`
	- `AllowedOrigins__0` = Vercel URL (npr. https://motomanager.vercel.app)

### 3) Frontend (Vercel)
1. Importuj repo u Vercel.
2. Root dir: `motomanager/frontend/motomanager-web`
3. Build command: `npm run build`
4. Output dir: `dist/motomanager-web`
5. Set `API_BASE_URL` u `src/environments/environment.ts` pre builda.

## API_BASE_URL

Podesi u [frontend/motomanager-web/src/environments/environment.ts](frontend/motomanager-web/src/environments/environment.ts).

## Deploy

### Backend (Render)
- Set `ConnectionStrings__Default` u Render env vars.
- Deploy kao .NET 8 Web Service.

### Frontend (Vercel)
- Build komanda: `npm run build`
- Output: `dist/motomanager-web`
- Set `API_BASE_URL` u `environment.ts` pre builda.

## Komande za kreiranje solution-a i projekata

```bash
# u /motomanager/backend

dotnet new sln -n MotoManager

dotnet new web -n MotoManager.Api

dotnet new classlib -n MotoManager.Domain

dotnet new classlib -n MotoManager.Application

dotnet new classlib -n MotoManager.Infrastructure

# reference

dotnet sln add MotoManager.Api MotoManager.Domain MotoManager.Application MotoManager.Infrastructure

dotnet add MotoManager.Application reference MotoManager.Domain

dotnet add MotoManager.Infrastructure reference MotoManager.Domain MotoManager.Application

dotnet add MotoManager.Api reference MotoManager.Domain MotoManager.Application MotoManager.Infrastructure

# paketi

dotnet add MotoManager.Api package FluentValidation.DependencyInjectionExtensions

dotnet add MotoManager.Application package FluentValidation

dotnet add MotoManager.Infrastructure package Microsoft.EntityFrameworkCore

dotnet add MotoManager.Infrastructure package Microsoft.EntityFrameworkCore.Design

dotnet add MotoManager.Infrastructure package Npgsql.EntityFrameworkCore.PostgreSQL

dotnet add MotoManager.Infrastructure package Npgsql.EntityFrameworkCore.PostgreSQL.NamingConventions

dotnet add MotoManager.Api package Microsoft.EntityFrameworkCore.Design

# migracije

cd MotoManager.Api

dotnet ef migrations add InitialCreate -p ../MotoManager.Infrastructure -s .

dotnet ef database update
```
