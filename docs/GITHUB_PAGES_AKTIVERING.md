# Slik aktiverer du GitHub Pages for iKid

## 📍 Viktig informasjon

**Workflowen din bruker GitHub Actions deployment** (ikke branch-basert).

Dette betyr:
- ✅ Den lager **IKKE** en `gh-pages` branch
- ✅ Den deployer direkte via GitHub Actions
- ✅ Du må velge **"GitHub Actions"** som source i settings

## 🔧 Steg-for-steg oppsett

### Steg 1: Aktiver GitHub Pages

1. Gå til: https://github.com/kasa031/iKid/settings/pages

2. Under **"Source"**, velg:
   - **"Deploy from a branch"** → **NEI, IKKE DETTE!**
   - **"GitHub Actions"** → **JA, VELG DETTE!** ✅

3. Klikk **"Save"**

### Steg 2: Sjekk at Secrets er lagt til

1. Gå til: https://github.com/kasa031/iKid/settings/secrets/actions

2. Sjekk at disse secrets finnes:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. Hvis de mangler, legg dem til:
   - Klikk **"New repository secret"**
   - Navn: `VITE_FIREBASE_API_KEY` (eller hvilken som mangler)
   - Verdi: Din Firebase API key
   - Klikk **"Add secret"**
   - Gjenta for alle secrets

### Steg 3: Trigger deployment

1. Gå til: https://github.com/kasa031/iKid/actions

2. Klikk på **"Deploy to GitHub Pages"** workflow (venstre meny)

3. Klikk **"Run workflow"** (høyre side)
   - Velg branch: `main`
   - Klikk **"Run workflow"**

4. Vent til workflowen er ferdig (grønn checkmark)

### Steg 4: Finn URL-en

1. Etter deployment, gå til: https://github.com/kasa031/iKid/settings/pages

2. Du skal se en URL som:
   ```
   https://kasa031.github.io/iKid/
   ```

3. Eller sjekk workflowen:
   - Gå til: https://github.com/kasa031/iKid/actions
   - Klikk på den siste workflow-run
   - Scroll ned til **"Deploy to GitHub Pages"** job
   - Du skal se URL-en der

## 🚀 Automatisk deployment

Etter at du har aktivert GitHub Pages med "GitHub Actions" som source, vil workflowen automatisk deploye hver gang du pusher til `main` branch.

## ✅ Test at det fungerer

1. Åpne: https://kasa031.github.io/iKid/
2. Sjekk at appen laster
3. Test innlogging

## 🔍 Troubleshooting

### "Page not found" eller 404

- Vent 1-2 minutter (kan ta litt tid første gang)
- Sjekk at workflowen er ferdig (grønn checkmark)
- Sjekk at du valgte **"GitHub Actions"** som source, ikke en branch

### Workflow feiler

- Sjekk **Actions**-fanen for feilmeldinger
- Sjekk at alle Secrets er lagt til
- Sjekk at Secrets-navnene matcher (må starte med `VITE_`)

### Firebase fungerer ikke

- Sjekk at alle Firebase Secrets er lagt til
- Sjekk Firebase Console at domenet `kasa031.github.io` er autorisert
- Sjekk at API key har riktige referrer-restrictions i Google Cloud Console

## 📱 Del med venner

**URL:** `https://kasa031.github.io/iKid/`

Send denne lenken til venner, de kan åpne den i mobilnettleseren sin!

