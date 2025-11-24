# 🔒 STRENGE SIKKERHETSREGLER - API NØKLER

## ⚠️ KRITISK: Disse reglene må følges SLAVISK

### Regel 1: ALDRI commit API-nøkler
- ❌ **ALDRI** hardkod API-nøkler i kildekoden
- ❌ **ALDRI** commit filer med API-nøkler
- ✅ **ALLTID** bruk miljøvariabler (`.env.local`)
- ✅ **ALLTID** sjekk før commit og push

### Regel 2: Automatisk sjekk før hver commit/push
Vi har satt opp automatiske hooks som sjekker for API-nøkler:

**Pre-commit hook:**
- Kjører automatisk før hver commit
- Sjekker alle staged files
- Blokkerer commit hvis secrets finnes

**Pre-push hook:**
- Kjører automatisk før hver push
- Sjekker alle tracked files
- Blokkerer push hvis secrets finnes

### Regel 3: Manuell sjekk før push
**FØR hver push, kjør:**

```bash
npm run check-secrets all
```

Dette sjekker ALLE tracked files for API-nøkler.

### Regel 4: Hva sjekkes?
Scriptet sjekker for:
- Google API Keys (AIza...)
- Firebase API Keys
- Stripe Keys
- AWS Keys
- GitHub Tokens
- Private Keys
- Generiske API-nøkler (20+ tegn)
- Passord i kode

### Regel 5: Forbudte filer
Disse filene skal **ALDRI** inneholde secrets:
- `src/services/firebase/config.ts` (bruk miljøvariabler)
- `.env` (alle varianter)
- `.env.local`
- `.env.production`

### Regel 6: Tillatte filer
Disse filene kan inneholde eksempler:
- `config.example.ts` (med placeholders)
- `.env.example` (med placeholders)
- Dokumentasjon (README, guides)

## Hvordan bruke sikkerhetssjekken

### Automatisk (anbefalt)
Hooks kjører automatisk. Hvis de ikke fungerer, se "Feilsøking" nedenfor.

### Manuell sjekk
```bash
# Sjekk staged files (før commit)
npm run check-secrets-staged

# Sjekk alle tracked files (før push)
npm run check-secrets all
```

### Hvis sjekken feiler
1. **STOPP** - Ikke commit eller push
2. Se hvilke filer som inneholder secrets
3. Fjern secrets fra filene
4. Bruk miljøvariabler i stedet
5. Kjør sjekken igjen

## Setup av hooks (hvis de ikke fungerer)

### Windows (PowerShell)
```powershell
# Gjør hooks kjørbare
git config core.hooksPath .git/hooks

# Test at hooks fungerer
npm run check-secrets-staged
```

### Linux/Mac
```bash
# Gjør hooks kjørbare
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push

# Test at hooks fungerer
npm run check-secrets-staged
```

## Checklist før hver push

- [ ] Kjør `npm run check-secrets all`
- [ ] Verifiser at ingen secrets ble funnet
- [ ] Sjekk at `.env.local` er i `.gitignore`
- [ ] Sjekk at `config.ts` er i `.gitignore`
- [ ] Verifiser med `git status` at ingen sensitive filer er staged
- [ ] Push kun når alle sjekker passerer

## Hva gjøres hvis secrets allerede er pushet?

### Hvis du akkurat pushet secrets:
1. **UMIDDELBART**: Roter API-nøklene i Firebase/Google Cloud Console
2. Fjern secrets fra git history (se nedenfor)
3. Push ny versjon uten secrets

### Roter API-nøkler:
1. Gå til Firebase Console
2. Project Settings > General
3. Scroll til "Your apps"
4. Klikk på appen
5. "Regenerate" API key
6. Oppdater `.env.local` med ny nøkkel

### Fjern fra git history (ADVANSERT):
```bash
# Varsel: Dette omskriver historie. Bruk kun hvis nødvendig.
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/services/firebase/config.ts" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (kun hvis du er sikker!)
git push origin --force --all
```

## Eksempler på hva som blokkeres

### ❌ Dette vil blokkeres:
```typescript
// config.ts
const apiKey = "AIzaSyBL2FMkqJtoyZ0eP6rYjPH2cf6sBxTc7XM"; // ❌
```

### ✅ Dette er OK:
```typescript
// config.ts
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || ""; // ✅

// config.example.ts
const apiKey = "YOUR_API_KEY_HERE"; // ✅ (eksempel-fil)
```

## Ytterligere sikkerhetstiltak

1. **GitHub Secrets**: Bruk GitHub Secrets for CI/CD
2. **Environment Variables**: Alltid bruk miljøvariabler
3. **Code Review**: Alltid review kode før merge
4. **Rotasjon**: Roter API-nøkler regelmessig
5. **Monitoring**: Overvåk for uautorisert bruk

## Kontakt

Hvis du er usikker på noe, **STOPP** og spør før du pusher.

**HUSK: Bedre å være forsiktig enn å eksponere secrets!**

