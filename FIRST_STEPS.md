# Første steg - Kom i gang nå!

## ✅ Status sjekk
- Node.js: ✅ Installert (v20.19.3)
- npm: ✅ Installert (10.8.2)
- Avhengigheter: ✅ Installert

## 📋 Neste steg

### Steg 1: Konfigurer Firebase (5-10 minutter)

Du må opprette et Firebase-prosjekt og kopiere konfigurasjonen.

#### 1a. Gå til Firebase Console
Åpne denne lenken i nettleseren:
👉 https://console.firebase.google.com/

#### 1b. Opprett prosjekt
1. Klikk **"Add project"** (eller "Create a project")
2. Gi prosjektet et navn: **"iKid-Eventyrhagen"** (eller hva du vil)
3. Klikk **"Continue"**
4. Aktiver eller deaktiver Google Analytics (valgfritt)
5. Klikk **"Create project"**
6. Vent til prosjektet er opprettet, klikk **"Continue"**

#### 1c. Aktiver Authentication
1. I venstre meny, klikk på **"Authentication"**
2. Klikk **"Get started"**
3. Gå til **"Sign-in method"** fanen (øverst)
4. Klikk på **"Email/Password"**
5. Slå på toggle for **"Email/Password"** (øverst)
6. Klikk **"Save"**

#### 1d. Aktiver Firestore Database
1. I venstre meny, klikk på **"Firestore Database"**
2. Klikk **"Create database"**
3. Velg **"Start in test mode"** (for testing)
4. Klikk **"Next"**
5. **VIKTIG:** Velg region: **"europe-west1 (Belgium)"** (for GDPR)
6. Klikk **"Enable"**
7. Vent til databasen er opprettet

#### 1e. Hent konfigurasjon
1. Klikk på **tannhjul-ikonet** (⚙️) ved siden av "Project Overview"
2. Velg **"Project settings"**
3. Scroll ned til **"Your apps"** seksjonen
4. Klikk på **Web-ikonet** (`</>`)
5. Gi appen et navn: **"iKid Web App"**
6. **Ikke** huk av for Firebase Hosting
7. Klikk **"Register app"**
8. Du vil se en kode som ser slik ut:

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

#### 1f. Kopier konfigurasjonen til prosjektet
1. Åpne filen: `src/services/firebase/config.ts`
2. Finn `firebaseConfig` objektet (linje 24-31)
3. Erstatt alle `YOUR_*` verdiene med verdiene fra Firebase Console
4. Lagre filen

**Eksempel:**
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnop", // Lim inn din apiKey
  authDomain: "ikid-test.firebaseapp.com",      // Lim inn din authDomain
  projectId: "ikid-test",                       // Lim inn din projectId
  storageBucket: "ikid-test.appspot.com",      // Lim inn din storageBucket
  messagingSenderId: "987654321098",            // Lim inn din messagingSenderId
  appId: "1:987654321098:web:abcdef1234567890", // Lim inn din appId
};
```

### Steg 2: Test at alt fungerer

Når Firebase er konfigurert, kan du teste appen!

#### 2a. Start Metro Bundler
I terminalen, kjør:
```bash
npm start
```

La denne kjøre. Du vil se noe som:
```
Metro waiting on exp://...
```

#### 2b. Start appen (i ny terminal)
Åpne en **ny terminal** og kjør:

**For Android:**
```bash
npm run android
```

**For iOS (kun macOS):**
```bash
npm run ios
```

**Merk:** For Android må du ha:
- Android Studio installert
- En Android emulator kjørende, ELLER
- En fysisk Android-enhet koblet til med USB-debugging aktivert

### Steg 3: Første test

Når appen starter:
1. Du skal se innloggingsskjermen
2. Trykk **"Registrer"**
3. Fyll ut:
   - E-post: `test@test.com`
   - Passord: `Test1234!`
   - Navn: `Test Bruker`
   - Telefon: `12345678` (valgfritt)
   - Rolle: Velg **"Foreldre"**
4. Trykk **"Registrer"**
5. Du skal nå være logget inn! 🎉

## 🆘 Hvis noe går galt

### "Firebase not configured"
- Sjekk at du har kopiert alle verdiene riktig i `config.ts`
- Sjekk at det ikke er mellomrom eller feil anførselstegn

### "Network request failed"
- Sjekk internettforbindelsen
- Sjekk at Firestore er aktivert i Firebase Console
- Sjekk at du valgte "Start in test mode"

### Appen starter ikke
- Sjekk at Metro bundler kjører (`npm start`)
- For Android: Sjekk at emulator/enhet er klar
- Prøv: `npm run clean` og deretter `npm install`

## 📚 Mer hjelp

- Se `QUICK_START.md` for mer detaljer
- Se `TESTING_GUIDE.md` for full testing
- Se `GITHUB_SETUP.md` for å pushe til GitHub

