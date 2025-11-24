# GitHub Pages Setup Guide - iKid

## ⚠️ KRITISK SIKKERHET FØR PUSH

### 1. Sjekk at API-nøkler IKKE er i koden

**FØR du pusher noe til GitHub, sjekk:**

```bash
# Sjekk om config.ts er i .gitignore
cat .gitignore | grep config.ts

# Sjekk om det er noen hardkodede API-nøkler
grep -r "AIza" src/
grep -r "apiKey" src/services/firebase/config.ts
```

**Hvis du finner API-nøkler:**
- ✅ `config.ts` skal være i `.gitignore` (allerede gjort)
- ✅ Bruk miljøvariabler i stedet (allerede konfigurert)
- ✅ Opprett `.env.local` med dine verdier (ikke commit denne!)

### 2. Opprett .env.local for lokal utvikling

```bash
# Kopier eksempelet
cp .env.example .env.local

# Rediger .env.local og legg inn dine Firebase-verdier
# Dette filen er allerede i .gitignore
```

## GitHub Pages Setup

### Steg 1: Opprett GitHub Repository

1. Gå til [GitHub](https://github.com)
2. Klikk "New repository"
3. Navn: `ikid` (eller hva du vil)
4. Velg "Public" (for gratis GitHub Pages)
5. **IKKE** huk av "Initialize with README" (vi har allerede kode)
6. Klikk "Create repository"

### Steg 2: Legg til Remote og Push

```bash
# Sjekk at du er i riktig mappe
cd C:\Users\Karina\Desktop\Egenlagde_programmer\iKid

# Legg til GitHub remote (erstatt med din URL)
git remote add origin https://github.com/DITT-BRUKERNAVN/ikid.git

# Sjekk at config.ts IKKE er tracked
git status

# Hvis config.ts vises, fjern den fra tracking
git rm --cached src/services/firebase/config.ts

# Commit alle endringer
git add .
git commit -m "Initial commit: Web app conversion"

# Push til GitHub
git push -u origin main
```

### Steg 3: Aktiver GitHub Pages

1. Gå til ditt repository på GitHub
2. Klikk på **Settings** (øverst til høyre)
3. Scroll ned til **Pages** (i venstre meny)
4. Under **Source**, velg:
   - **Branch**: `main` (eller `gh-pages` hvis vi lager det)
   - **Folder**: `/ (root)` eller `/dist` (avhengig av setup)
5. Klikk **Save**

### Steg 4: Opprett GitHub Actions Workflow

Jeg har opprettet en workflow-fil som automatisk bygger og deployer når du pusher til main.

**Filen ligger i:** `.github/workflows/deploy.yml`

Denne workflow:
- Bygger prosjektet automatisk
- Deployer til GitHub Pages
- Bruker miljøvariabler fra GitHub Secrets (ikke hardkodede nøkler!)

### Steg 5: Legg til Firebase Secrets i GitHub

**VIKTIG:** For at appen skal fungere på GitHub Pages, må du legge til Firebase-konfigurasjonen som GitHub Secrets:

1. Gå til ditt repository på GitHub
2. Klikk **Settings** > **Secrets and variables** > **Actions**
3. Klikk **New repository secret**
4. Legg til hver av disse (klikk "New repository secret" for hver):

```
VITE_FIREBASE_API_KEY = din-api-key
VITE_FIREBASE_AUTH_DOMAIN = ikid-791bd.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = ikid-791bd
VITE_FIREBASE_STORAGE_BUCKET = ikid-791bd.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 338831664153
VITE_FIREBASE_APP_ID = 1:338831664153:web:0c90ee9397e1a5ad53b688
```

### Steg 6: Verifiser Deployment

1. Etter første push, gå til **Actions**-fanen på GitHub
2. Du skal se en workflow kjøre
3. Når den er ferdig (grønn checkmark), gå til **Settings** > **Pages**
4. Du skal se en URL som: `https://ditt-brukernavn.github.io/ikid/`

### Steg 7: Test Appen

1. Åpne URL-en fra GitHub Pages
2. Test at innlogging fungerer
3. Sjekk at Firebase-tilkoblingen fungerer

## Troubleshooting

### "Page not found" etter deployment

- Vent 1-2 minutter (GitHub Pages tar litt tid)
- Sjekk at workflow er ferdig i **Actions**-fanen
- Sjekk at base path i `vite.config.ts` er riktig

### Firebase ikke fungerer

- Sjekk at alle Secrets er lagt til i GitHub
- Sjekk at Secrets-navnene matcher (må starte med `VITE_`)
- Sjekk Firebase Console at domenet er autorisert

### Build feiler

- Sjekk **Actions**-fanen for feilmeldinger
- Sjekk at alle dependencies er i `package.json`
- Sjekk at TypeScript-kompilering fungerer lokalt først

## Sikkerhet - Viktige Regler

✅ **GJØR DETTE:**
- Bruk alltid miljøvariabler for API-nøkler
- Sjekk `.gitignore` før hver commit
- Bruk GitHub Secrets for produksjon
- Test lokalt først

❌ **ALDRI:**
- Commit `.env.local` eller `config.ts` med nøkler
- Hardkod API-nøkler i koden
- Del API-nøkler offentlig
- Push uten å sjekke `.gitignore` først

## Neste Steg

Etter at GitHub Pages er satt opp:
1. Test appen på GitHub Pages URL
2. Konfigurer OAuth Consent Screen (hvis ikke gjort)
3. Legg til testbrukere i Firebase
4. Test alle funksjoner

