# Test Guide - Ulike Enheter

Denne guiden hjelper deg med å teste iKid-appen på ulike enheter og plattformer.

## 📱 Forutsetninger

Før du starter, sjekk at du har:

### Android
- [ ] Android Studio installert
- [ ] Android SDK installert
- [ ] Android emulator opprettet ELLER fysisk Android-enhet
- [ ] USB-debugging aktivert (for fysisk enhet)

### iOS (kun macOS)
- [ ] Xcode installert
- [ ] CocoaPods installert (`sudo gem install cocoapods`)
- [ ] iOS Simulator ELLER fysisk iOS-enhet
- [ ] Apple Developer-konto (for fysisk enhet)

## 🚀 Steg 1: Forberedelser

### 1.1 Installer avhengigheter
```bash
npm install
```

### 1.2 Verifiser Firebase
Følg `FIREBASE_QUICK_CHECK.md` for å sjekke at:
- [ ] config.ts har riktige verdier
- [ ] Authentication er aktivert
- [ ] Firestore er opprettet
- [ ] Security rules tillater tilgang

### 1.3 Start Metro Bundler
```bash
npm start
```
La denne kjøre i bakgrunnen.

## 📱 Steg 2: Test på Android

### Alternativ A: Android Emulator

1. **Start Android Studio**
2. **Åpne AVD Manager** (Android Virtual Device Manager)
3. **Opprett en emulator** (hvis du ikke har en):
   - Klikk "Create Virtual Device"
   - Velg en enhet (f.eks. Pixel 5)
   - Velg system image (f.eks. Android 11)
   - Klikk "Finish"
4. **Start emulatoren** (klikk play-knappen)
5. **Vent til emulatoren er fullt oppstartet**
6. **I ny terminal, kjør:**
   ```bash
   npm run android
   ```

### Alternativ B: Fysisk Android-enhet

1. **Aktiver USB-debugging:**
   - Gå til Settings → About phone
   - Trykk 7 ganger på "Build number"
   - Gå til Settings → Developer options
   - Aktiver "USB debugging"
2. **Koble enheten til PC** med USB-kabel
3. **Godkjenn USB-debugging** på enheten
4. **Verifiser tilkobling:**
   ```bash
   adb devices
   ```
   Du skal se enheten i listen
5. **Kjør appen:**
   ```bash
   npm run android
   ```

## 🍎 Steg 3: Test på iOS (kun macOS)

### Alternativ A: iOS Simulator

1. **Åpne Xcode**
2. **Gå til Xcode → Preferences → Components**
3. **Last ned iOS Simulator** (hvis ikke installert)
4. **I terminal, kjør:**
   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

### Alternativ B: Fysisk iOS-enhet

1. **Koble iPhone/iPad til Mac** med USB-kabel
2. **I Xcode:**
   - Åpne `ios/iKid.xcworkspace`
   - Velg enheten i device-selector
   - Sett opp signing (Team, Bundle Identifier)
3. **I terminal:**
   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

## 🧪 Steg 4: Test-scenarier

### Test 1: Registrering og innlogging

**Mål:** Verifiser at brukere kan registrere seg og logge inn

1. Åpne appen
2. Trykk "Registrer"
3. Fyll ut:
   - E-post: `test@test.com`
   - Passord: `Test1234!`
   - Navn: `Test Bruker`
   - Telefon: `12345678`
   - Rolle: `Foreldre`
4. Trykk "Registrer"
5. **Forventet:** Du skal se hovedskjermen
6. Logg ut
7. Logg inn med samme konto
8. **Forventet:** Du skal se hovedskjermen igjen

**Verifiser i Firebase Console:**
- Authentication → Users: Du skal se testbrukeren
- Firestore Database → Data → users: Du skal se brukerdata

### Test 2: Innkryssing (Foreldre)

**Mål:** Test at foreldre kan krysse inn barn

1. Logg inn som foreldre
2. Gå til "Innkryssing" (Check-in)
3. Velg et barn (hvis tilgjengelig)
4. Fyll ut eventuelle notater
5. Trykk "Kryss inn"
6. **Forventet:** Status endres til "Innkrysset"

**Verifiser i Firebase Console:**
- Firestore Database → Data → checkInOutLogs: Du skal se en ny logg

### Test 3: Utkryssing (Foreldre)

**Mål:** Test at foreldre kan krysse ut barn

1. Gå til "Utkryssing" (Check-out)
2. Velg et innkrysset barn
3. Fyll ut eventuelle notater
4. Trykk "Kryss ut"
5. **Forventet:** Status endres til "Utkrysset"

### Test 4: Oversikt (Alle roller)

**Mål:** Test oversiktsskjermen

1. Gå til "Oversikt"
2. **Forventet:** Du skal se liste over barn
3. Prøv søkefunksjonen
4. Prøv filter (Innkrysset, Utkrysset, etc.)
5. **Forventet:** Søk og filter fungerer

### Test 5: Profil (Foreldre)

**Mål:** Test "Mitt barn" skjermen

1. Gå til "Mitt barn"
2. **Forventet:** Du skal se informasjon om ditt barn
3. Sjekk at all informasjon vises korrekt

### Test 6: Profil (Ansatte)

**Mål:** Test at ansatte kan se alle barn

1. Logg inn som ansatt/admin
2. Gå til "Oversikt"
3. **Forventet:** Du skal se alle barn
4. Klikk på et barn
5. **Forventet:** Du skal se barnets profil

### Test 7: Kalender (Ansatte)

**Mål:** Test kalenderfunksjonen

1. Logg inn som ansatt/admin
2. Gå til "Kalender"
3. **Forventet:** Du skal se kalendervisning
4. Prøv å legge til et event (hvis mulig)
5. **Forventet:** Event legges til

### Test 8: Innstillinger

**Mål:** Test innstillinger

1. Gå til "Innstillinger"
2. Prøv å endre språk
3. Prøv å endre tema (lys/mørk)
4. Prøv å endre passord
5. **Forventet:** Alle endringer fungerer

## 🔍 Feilsøking

### "Metro bundler ikke tilgjengelig"
- Sjekk at `npm start` kjører
- Prøv: `npm start -- --reset-cache`

### "Device not found"
- For Android: Sjekk `adb devices`
- For iOS: Sjekk at enheten er koblet og godkjent

### "Build failed"
- Prøv: `cd android && ./gradlew clean && cd ..`
- Prøv: `npm run clean` (hvis tilgjengelig)

### "Firebase not configured"
- Sjekk `src/services/firebase/config.ts`
- Sjekk at filen er lagret
- Restart Metro bundler

### "Network request failed"
- Sjekk internettforbindelse
- Sjekk Firebase Console → Firestore er aktivert
- Sjekk Security Rules

## ✅ Test-checkliste

Etter testing, sjekk:

- [ ] Registrering fungerer
- [ ] Innlogging fungerer
- [ ] Innkryssing fungerer
- [ ] Utkryssing fungerer
- [ ] Oversikt viser riktig data
- [ ] Profil vises korrekt
- [ ] Kalender fungerer (hvis tilgjengelig)
- [ ] Innstillinger fungerer
- [ ] Data synkroniseres med Firebase
- [ ] Ingen crashes eller feilmeldinger

## 📝 Notater

Dokumenter eventuelle problemer eller observasjoner under testing.

