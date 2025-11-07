# Kjør Testing - Steg-for-steg

Denne guiden tar deg gjennom hele testprosessen fra start til slutt.

## 🎯 Oversikt

Vi skal teste appen på Android (og iOS hvis mulig) og verifisere at alle funksjoner fungerer.

## 📋 Steg 1: Verifiser Firebase (5 minutter)

### 1.1 Sjekk config.ts
Åpne `src/services/firebase/config.ts` og verifiser at:
- [ ] `apiKey` starter med `AIzaSy...` (ikke `YOUR_API_KEY`)
- [ ] `authDomain` er `ikid-791bd.firebaseapp.com`
- [ ] `projectId` er `ikid-791bd`
- [ ] Alle verdiene er fylt ut

### 1.2 Sjekk Firebase Console
Gå til: https://console.firebase.google.com/project/ikid-791bd

**Authentication:**
- [ ] Gå til Authentication → Sign-in method
- [ ] Email/Password skal være **Enabled** (grønn toggle)
- [ ] Hvis ikke, klikk på Email/Password og aktiver det

**Firestore Database:**
- [ ] Gå til Firestore Database
- [ ] Sjekk at databasen er opprettet (du skal se "Data" og "Rules" faner)
- [ ] Hvis ikke, klikk "Create database":
  - Velg "Start in test mode"
  - Velg region: "europe-north2 (Stockholm)"
  - Klikk "Enable"

**Security Rules:**
- [ ] Gå til Firestore Database → Rules
- [ ] For testing, bruk disse reglene:
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
- [ ] Klikk "Publish"

## 🚀 Steg 2: Start Metro Bundler (2 minutter)

1. **Åpne en terminal** i prosjektmappen
2. **Kjør:**
   ```bash
   npm start
   ```
3. **La denne kjøre i bakgrunnen** (ikke lukk terminalen)
4. Du skal se noe som:
   ```
   Metro waiting on exp://...
   ```

## 📱 Steg 3: Forbered Android (5 minutter)

### Alternativ A: Android Emulator

1. **Åpne Android Studio**
2. **Klikk på "More Actions" → "Virtual Device Manager"** (eller Tools → Device Manager)
3. **Hvis du ikke har en emulator:**
   - Klikk "Create Device"
   - Velg en enhet (f.eks. Pixel 5)
   - Velg system image (f.eks. Android 11 eller nyere)
   - Klikk "Next" → "Finish"
4. **Start emulatoren:**
   - Klikk play-knappen ved siden av emulatoren
   - Vent til emulatoren er fullt oppstartet (kan ta 1-2 minutter)

### Alternativ B: Fysisk Android-enhet

1. **Aktiver USB-debugging:**
   - Gå til Settings → About phone
   - Trykk 7 ganger på "Build number"
   - Gå til Settings → Developer options
   - Aktiver "USB debugging"
2. **Koble enheten til PC** med USB-kabel
3. **Godkjenn USB-debugging** på enheten (popup vil vises)
4. **Verifiser tilkobling:**
   ```bash
   adb devices
   ```
   Du skal se enheten i listen (f.eks. `ABC123XYZ    device`)

## 🏃 Steg 4: Kjør appen (2 minutter)

1. **Åpne en NY terminal** (la Metro bundler kjøre i den første)
2. **Naviger til prosjektmappen** (hvis ikke allerede der):
   ```bash
   cd C:\Users\Karina\Desktop\Egenlagde_programmer\iKid
   ```
3. **Kjør:**
   ```bash
   npm run android
   ```
4. **Vent** mens appen bygges og installeres (kan ta 1-2 minutter første gang)
5. **Appen skal nå åpne på enheten/emulatoren**

## 🧪 Steg 5: Test-scenarier (15-20 minutter)

### Test 1: Registrering (3 minutter)

1. **Du skal se innloggingsskjermen**
2. **Trykk "Registrer"**
3. **Fyll ut skjemaet:**
   - E-post: `test@test.com`
   - Passord: `Test1234!`
   - Navn: `Test Bruker`
   - Telefon: `12345678` (valgfritt)
   - Rolle: Velg **"Foreldre"**
4. **Trykk "Registrer"**
5. **Forventet:** Du skal se hovedskjermen (Overview)
6. **Verifiser i Firebase Console:**
   - Gå til Authentication → Users
   - Du skal se `test@test.com` i listen
   - Gå til Firestore Database → Data → users
   - Du skal se brukerdata

**✅ Hvis dette fungerer:** Firebase er riktig konfigurert!

### Test 2: Innlogging (2 minutter)

1. **Logg ut** (gå til Settings → Logg ut)
2. **Du skal se innloggingsskjermen igjen**
3. **Fyll ut:**
   - E-post: `test@test.com`
   - Passord: `Test1234!`
4. **Trykk "Logg inn"**
5. **Forventet:** Du skal se hovedskjermen igjen

### Test 3: Oversikt (2 minutter)

1. **Gå til "Oversikt"** (hvis ikke allerede der)
2. **Forventet:** Du skal se en liste (kan være tom hvis ingen barn er lagt til)
3. **Prøv søkefunksjonen** (hvis tilgjengelig)
4. **Prøv filter** (hvis tilgjengelig)

### Test 4: Innstillinger (3 minutter)

1. **Gå til "Innstillinger"**
2. **Prøv å endre språk:**
   - Velg et annet språk (f.eks. English)
   - **Forventet:** UI endrer språk
3. **Prøv å endre tema:**
   - Toggle mellom lys/mørk
   - **Forventet:** Farger endres
4. **Prøv å endre passord:**
   - Fyll ut nåværende og nytt passord
   - **Forventet:** Passord endres

### Test 5: Andre funksjoner (5-10 minutter)

**Hvis du har tilgang til admin-funksjoner:**
- Prøv å legge til et barn
- Prøv å se alle barn
- Prøv kalender (hvis tilgjengelig)

## 🔍 Steg 6: Verifiser i Firebase (2 minutter)

Gå til Firebase Console og sjekk:

- [ ] **Authentication → Users:** Du skal se testbrukeren
- [ ] **Firestore Database → Data:**
  - [ ] `users` collection eksisterer
  - [ ] Testbrukeren er i `users` collection
  - [ ] Eventuelle andre collections (children, checkInOutLogs, etc.)

## ✅ Steg 7: Test-resultat

**Dokumenter resultatet:**

- [ ] Registrering fungerer
- [ ] Innlogging fungerer
- [ ] Oversikt fungerer
- [ ] Innstillinger fungerer
- [ ] Data synkroniseres med Firebase
- [ ] Ingen crashes eller kritiske feil

## 🆘 Hvis noe ikke fungerer

### "Firebase not configured"
- Sjekk at config.ts er lagret
- Restart Metro bundler: `npm start -- --reset-cache`

### "Network request failed"
- Sjekk internettforbindelse
- Sjekk Firebase Console → Firestore er aktivert
- Sjekk Security Rules

### Appen starter ikke
- Sjekk at Metro bundler kjører
- Sjekk at emulator/enhet er klar
- Prøv: `npm run clean` (hvis tilgjengelig)

### Se `TROUBLESHOOTING.md` for mer hjelp

## 📝 Neste steg

Etter testing:
1. Dokumenter eventuelle problemer
2. Test på andre enheter hvis mulig
3. Test med ulike brukerroller (foreldre, ansatte, admin)

