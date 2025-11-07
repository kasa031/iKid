# Quick Start Guide - iKid

Rask guide for å komme i gang med testing av iKid-appen.

## Steg 1: Klon repository (hvis du ikke allerede har det)

Hvis du allerede har prosjektet lokalt, hopp over dette steget.

```bash
git clone https://github.com/kasa031/iKid.git
cd iKid
```

## Steg 2: Installer avhengigheter

```bash
npm install
```

Dette installerer alle nødvendige pakker (React Native, Firebase, etc.).

## Steg 3: Konfigurer Firebase (5-10 minutter)

### 3a. Opprett Firebase-prosjekt

1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Klikk **"Add project"** (eller "Create a project")
3. Gi prosjektet et navn, f.eks. **"iKid-Eventyrhagen"**
4. Aktiver eller deaktiver Google Analytics (valgfritt for testing)
5. Klikk **"Create project"**
6. Vent til prosjektet er opprettet, klikk **"Continue"**

### 3b. Aktiver Authentication (Email/Password)

1. I Firebase Console, klikk på **"Authentication"** i venstre meny
2. Klikk **"Get started"** (hvis første gang)
3. Gå til **"Sign-in method"** fanen
4. Klikk på **"Email/Password"**
5. Aktiver **"Email/Password"** (slå på toggle)
6. Klikk **"Save"**

### 3c. Aktiver Firestore Database

1. I Firebase Console, klikk på **"Firestore Database"** i venstre meny
2. Klikk **"Create database"**
3. Velg **"Start in test mode"** (for testing - vi setter opp sikkerhet senere)
4. **VIKTIG:** Velg region: **"europe-west1 (Belgium)"** eller annen EU-region for GDPR-compliance
5. Klikk **"Enable"**
6. Vent til databasen er opprettet

### 3d. Hent Firebase-konfigurasjon

1. I Firebase Console, klikk på **tannhjul-ikonet** (⚙️) ved siden av "Project Overview"
2. Velg **"Project settings"**
3. Scroll ned til **"Your apps"** seksjonen
4. Klikk på **Web-ikonet** (`</>`)
5. Gi appen et navn, f.eks. **"iKid Web App"**
6. **Ikke** huk av for Firebase Hosting (vi trenger det ikke)
7. Klikk **"Register app"**
8. Du vil se en konfigurasjon som ser slik ut:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "ikid-eventyrhagen.firebaseapp.com",
  projectId: "ikid-eventyrhagen",
  storageBucket: "ikid-eventyrhagen.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

### 3e. Oppdater config.ts i prosjektet

1. Åpne filen `src/services/firebase/config.ts` i prosjektet ditt
2. Finn `firebaseConfig` objektet
3. Erstatt alle `YOUR_*` verdiene med verdiene fra Firebase Console:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Lim inn din apiKey her
  authDomain: "ikid-eventyrhagen.firebaseapp.com", // Lim inn din authDomain her
  projectId: "ikid-eventyrhagen", // Lim inn din projectId her
  storageBucket: "ikid-eventyrhagen.appspot.com", // Lim inn din storageBucket her
  messagingSenderId: "123456789012", // Lim inn din messagingSenderId her
  appId: "1:123456789012:web:abc123def456", // Lim inn din appId her
};
```

4. Lagre filen

**Eksempel på hvordan det skal se ut:**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnop",
  authDomain: "ikid-test.firebaseapp.com",
  projectId: "ikid-test",
  storageBucket: "ikid-test.appspot.com",
  messagingSenderId: "987654321098",
  appId: "1:987654321098:web:abcdef1234567890",
};
```

## Steg 4: Start Metro Bundler

Åpne en terminal og kjør:

```bash
npm start
```

La denne kjøre i bakgrunnen. Du vil se noe som:
```
Metro waiting on exp://192.168.1.1:8081
```

## Steg 5: Kjør appen

Åpne en **ny terminal** (la Metro bundler kjøre i den første) og kjør:

### For Android:
```bash
npm run android
```

### For iOS (kun macOS):
```bash
npm run ios
```

**Merk:** For Android må du ha Android Studio installert og en emulator kjørende, eller en fysisk enhet koblet til.

## Steg 6: Første test (2 minutter)

Når appen starter:

1. **Du skal se innloggingsskjermen**
2. **Trykk på "Registrer"**
3. **Fyll ut skjemaet:**
   - E-post: `test@test.com` (eller hva du vil)
   - Passord: `Test1234!` (minst 6 tegn)
   - Navn: `Test Bruker`
   - Telefon: `12345678` (valgfritt)
   - Rolle: Velg **"Foreldre"**
4. **Trykk "Registrer"**
5. **Du skal nå være logget inn og se hovedskjermen!**

## Steg 7: Verifiser at alt fungerer

1. Gå til Firebase Console → **Authentication**
2. Du skal se din testbruker i listen
3. Gå til **Firestore Database**
4. Du skal se en `users` collection med din bruker

## Vanlige problemer og løsninger

### Problem: "Firebase not configured" eller "Firebase: Error"
**Løsning:**
- Sjekk at du har kopiert alle verdiene riktig i `config.ts`
- Sjekk at det ikke er mellomrom eller anførselstegn som ikke skal være der
- Verifiser at Firebase-prosjektet er aktivert

### Problem: "Network request failed"
**Løsning:**
- Sjekk internettforbindelsen
- Sjekk at Firestore er aktivert i Firebase Console
- Sjekk at du valgte "Start in test mode" (ikke production mode)

### Problem: "App crashes on startup"
**Løsning:**
```bash
# Stopp Metro bundler (Ctrl+C)
# Rens prosjektet
npm run clean

# Reinstaller avhengigheter
npm install

# Start på nytt
npm start
```

### Problem: "Cannot find module" eller lignende
**Løsning:**
```bash
# Slett node_modules og reinstaller
rm -rf node_modules
npm install
```

### Problem: Android emulator starter ikke
**Løsning:**
- Åpne Android Studio
- Gå til Tools → Device Manager
- Start en emulator derfra først
- Deretter kjør `npm run android`

## Neste steg

Når oppsettet fungerer:

1. **Følg `TESTING_GUIDE.md`** for systematisk testing av alle funksjoner
2. **Eller bruk `TEST_CHECKLIST.md`** for rask sjekk av alle funksjoner

## Git/GitHub (valgfritt)

Hvis du vil pushe endringene til GitHub:

```bash
# Legg til alle filer
git add .

# Commit endringene
git commit -m "Initial commit - iKid app ready for testing"

# Push til GitHub
git push origin main
```

**Viktig:** Ikke commit `src/services/firebase/config.ts` med ekte Firebase-credentials til GitHub! 
Filen er allerede i `.gitignore`, men dobbeltsjekk at den ikke blir committet.

## Hjelp

- Se `TESTING_GUIDE.md` for detaljert testing
- Se `docs/FIREBASE_SETUP.md` for mer Firebase-informasjon
- Se `README.md` for generell informasjon
