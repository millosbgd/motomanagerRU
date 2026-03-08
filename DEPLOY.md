# Deploy & Publish — MotoManagerRU

---

## Arhitektura

| Sloj | Tehnologija | Platforma | Trigger |
|---|---|---|---|
| Frontend | Angular 18 | Vercel | auto — `git push main` |
| Backend | .NET 8 Web API | Render (free) | auto — `git push main` |
| Baza | PostgreSQL | Supabase | manuel — DBeaver |

---

## 1. Baza podataka — Supabase

### Konekcija u DBeaver

| Namena | Port | Koristiti za |
|---|---|---|
| Transaction Pooler | **6543** | App (Render env var) |
| Direct | **5432** | DDL u DBeaver (CREATE TABLE, CREATE FUNCTION) |

### Pokretanje SQL skripti (tabele + funkcije)

1. Otvori DBeaver → konekcija na **Direct port 5432**
2. Otvori fajl `motomanager/backend/sql/functions.sql`
3. Označi željene blokove (ili sve)
4. Pritisni **Alt+X** (Execute Script) — **ne** Ctrl+Enter

> ⚠️ Svaki put kad se doda nova SQL funkcija ili tabela, mora da se ručno pokrene u DBeaver-u na produkcijskom Supabase-u.

---

## 2. Backend — Render

### Inicijalni setup (jednom)

1. [render.com](https://render.com) → **New Web Service**
2. Poveži GitHub repo → izaberi `main` granu
3. **Root Directory:** `motomanager/backend`
4. **Build Command:** `dotnet publish MotoManager.Api/MotoManager.Api.csproj -c Release -o out`
5. **Start Command:** `dotnet out/MotoManager.Api.dll`
6. **Environment Variables:**

| Key | Value |
|---|---|
| `ConnectionStrings__DefaultConnection` | Supabase connection string (port **6543**, `Pooling=true`) |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

Connection string format:
```
Host=xxx.pooler.supabase.com;Port=6543;Database=postgres;Username=postgres.xxx;Password=YYY;Pooling=true;SSL Mode=Require;Trust Server Certificate=true
```

### Redeploy

Push na `main` → Render automatski detectuje promene i deployuje.

Manuelni redeploy: Render dashboard → tvoj servis → **Manual Deploy** → Deploy latest commit.

> ⚠️ Free tier "spava" nakon 15 min neaktivnosti — prvi request može da traje 30–60s.

---

## 3. Frontend — Vercel

### Inicijalni setup (jednom)

1. [vercel.com](https://vercel.com) → **Add New Project** → importuj GitHub repo
2. **Root Directory:** `motomanager/frontend/motomanager-web`
3. **Framework Preset:** Angular
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist/motomanager-web/browser`
6. **Environment Variables:**

| Key | Value |
|---|---|
| *(nema — API URL je u `environment.ts`)* | |

> API URL se konfiguriše u `src/environments/environment.ts` i `environment.development.ts`.

### Redeploy

Push na `main` → Vercel automatski builduje i deployuje.

---

## 4. Standardni workflow — nova funkcionalnost

```
1. Backend:
   a. Dodaj entitet / DTO / interfejse / servis / repozitorijum
   b. Registruj u Program.cs (DI + endpoint)
   c. Dodaj SQL funkcije u motomanager/backend/sql/functions.sql
   d. Pokreni SQL funkcije u DBeaver (Direct port 5432, Alt+X)

2. Frontend:
   a. Dodaj model u src/app/models/
   b. Dodaj metode u src/app/services/api.service.ts
   c. Kreiraj komponentu u src/app/pages/
   d. Dodaj rutu u app.routes.ts
   e. Dodaj link u app.component.ts (sidebar)

3. Build & Deploy:
   npm run build                    # provjeri da nema grešaka
   git add -A
   git commit -m "feat: opis"
   git push                         # triggeruje Vercel + Render auto-deploy
```

---

## 5. Arhitekturno pravilo — SELECT vs mutacije

| Operacija | Metod |
|---|---|
| `SELECT` (čitanje) | SQL funkcija u DB + `FromSqlRaw` / `FromSqlInterpolated` u repozitorijumu |
| `INSERT / UPDATE / DELETE` | EF Core (`Add`, `Update`, `Remove` + `SaveChangesAsync`) |

---

## 6. Dijagnoza grešaka

| Greška | Uzrok | Rešenje |
|---|---|---|
| `404` na API endpointu | Pogrešna putanja u `Program.cs` | Uskladi `MapGroup(...)` sa frontend `api.service.ts` |
| `500` na API endpointu | SQL funkcija ne postoji u bazi | Pokreni funkciju u DBeaver (Alt+X, Direct port 5432) |
| Frontend ne vidi backend | Pogrešan `apiUrl` u `environment.ts` | Provjeri `apiUrl` da pokazuje na Render URL |
| Render sporo odgovara | Free tier cold start | Normalno — sačekaj 30–60s ili upgradeuj plan |
| Vercel build fail | Angular compiler greška | Pokreni `npm run build` lokalno pa ispravi |
