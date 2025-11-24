# ⚠️ KRITISK: Setup før GitHub Push

## Steg 1: Opprett .env.local (GJØR DETTE FØRST!)

**Dette filen er allerede i .gitignore og vil IKKE bli pushet til GitHub.**

Opprett en fil kalt `.env.local` i rotmappen med følgende innhold:

```env
VITE_FIREBASE_API_KEY=ditt-api-key-her
VITE_FIREBASE_AUTH_DOMAIN=ditt-prosjekt.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ditt-prosjekt-id
VITE_FIREBASE_STORAGE_BUCKET=ditt-prosjekt.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=ditt-sender-id
VITE_FIREBASE_APP_ID=ditt-app-id
```

**Hvor finner jeg disse verdiene?**
- Gå til Firebase Console → Project Settings → Your apps → Web app
- Kopier verdiene fra Firebase-konfigurasjonen

**Hvordan:**
1. Åpne PowerShell i prosjektmappen
2. Kjør: `New-Item -Path .env.local -ItemType File`
3. Lim inn innholdet over
4. Lagre filen

## Steg 2: Verifiser at config.ts IKKE blir pushet

```bash
# Sjekk at config.ts er ignorert
git check-ignore src/services/firebase/config.ts

# Hvis den returnerer filstien, er den ignorert ✅
# Hvis den returnerer ingenting, må du legge den til .gitignore
```

## Steg 3: Test lokalt først

```bash
# Test at appen bygger med miljøvariabler
npm run build

# Test at appen kjører lokalt
npm run dev
```

## Steg 4: Sjekk hva som skal pushes

```bash
# Se hva som vil bli pushet
git status

# Viktig: config.ts skal IKKE vises her!
# Hvis den vises, kjør:
git rm --cached src/services/firebase/config.ts
```

## Steg 5: Når alt er klart, push til GitHub

Følg instruksjonene i `GITHUB_PAGES_SETUP.md`

