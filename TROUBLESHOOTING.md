# Feilsøking - iKid App

## "Firebase not configured" feil

### Sjekkliste:

1. **Verifiser config.ts filen:**
   - Åpne `src/services/firebase/config.ts`
   - Sjekk at alle verdiene er fylt ut (ikke `YOUR_API_KEY`, etc.)
   - Sjekk at filen er lagret

2. **Sjekk Firebase Console:**
   - Gå til [Firebase Console](https://console.firebase.google.com/)
   - Velg prosjektet ditt (`ikid-791bd`)
   - Gå til Project Settings (⚙️) → General
   - Scroll ned til "Your apps"
   - Verifiser at Web-appen er registrert

3. **Sjekk at verdiene matcher:**
   - `apiKey` skal starte med `AIzaSy...`
   - `authDomain` skal være `ikid-791bd.firebaseapp.com`
   - `projectId` skal være `ikid-791bd`
   - `storageBucket` skal være `ikid-791bd.firebasestorage.app` eller `ikid-791bd.appspot.com`

4. **Prøv å restarte Metro bundler:**
   ```bash
   # Stopp Metro bundler (Ctrl+C)
   # Slett cache
   npm start -- --reset-cache
   ```

## "Network request failed" feil

### Sjekkliste:

1. **Verifiser Firestore er aktivert:**
   - Gå til Firebase Console → Firestore Database
   - Sjekk at databasen er opprettet
   - Hvis ikke, klikk "Create database"
   - Velg "Start in test mode" (for testing)
   - Velg region: `europe-north2 (Stockholm)` (eller annen EØS-region)

2. **Sjekk Firestore Security Rules:**
   - Gå til Firestore Database → Rules
   - For testing, bruk disse reglene:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.time < timestamp.date(2025, 12, 31);
       }
     }
   }
   ```
   - Klikk "Publish"

3. **Sjekk internettforbindelse:**
   - Prøv å åpne en nettside i nettleseren
   - Sjekk at enheten/emulatoren har internett

4. **Sjekk Firebase Authentication:**
   - Gå til Firebase Console → Authentication
   - Sjekk at "Email/Password" er aktivert
   - Gå til "Sign-in method" tab
   - Verifiser at Email/Password er "Enabled"

5. **Sjekk at appen har tilgang:**
   - For Android emulator: Sjekk at internett fungerer
   - For fysisk enhet: Sjekk WiFi/mobilnett

## Andre vanlige feil

### "User data not found"
- Dette betyr at brukeren er opprettet i Authentication, men ikke i Firestore
- Løsning: Registrer brukeren på nytt, eller legg til manuelt i Firestore

### "Permission denied"
- Firestore security rules blokkerer tilgang
- Løsning: Oppdater security rules (se over)

### Appen crasher ved oppstart
- Sjekk at alle pakker er installert: `npm install`
- Sjekk at Metro bundler kjører: `npm start`
- Sjekk konsollen for feilmeldinger

## Test Firebase-tilkobling

For å teste om Firebase fungerer, kan du prøve:

1. **Registrer en testbruker:**
   - E-post: `test@test.com`
   - Passord: `Test1234!`
   - Navn: `Test Bruker`
   - Rolle: `Foreldre`

2. **Sjekk Firebase Console:**
   - Authentication → Users: Du skal se testbrukeren
   - Firestore Database → Data: Du skal se en `users` collection

3. **Hvis dette fungerer:**
   - Firebase er riktig konfigurert! ✅
   - Hvis ikke, følg sjekklisten over

## Hvis ingenting fungerer

1. **Sjekk at du er på riktig Firebase-prosjekt:**
   - Gå til Firebase Console
   - Verifiser at du ser prosjektet `ikid-791bd`

2. **Sjekk at config.ts har riktige verdier:**
   - Sammenlign med Firebase Console → Project Settings → Your apps → Web app

3. **Prøv å reinstallere avhengigheter:**
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Sjekk React Native versjon:**
   ```bash
   npx react-native --version
   ```

