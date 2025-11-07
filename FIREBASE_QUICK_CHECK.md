# Firebase Rask Sjekkliste

## ✅ Steg 1: Verifiser config.ts

Åpne `src/services/firebase/config.ts` og sjekk at:
- [ ] `apiKey` starter med `AIzaSy...` (ikke `YOUR_API_KEY`)
- [ ] `authDomain` er `ikid-791bd.firebaseapp.com`
- [ ] `projectId` er `ikid-791bd`
- [ ] `storageBucket` er `ikid-791bd.firebasestorage.app`
- [ ] Filen er lagret

**Dine verdier skal være:**
```typescript
apiKey: "AIzaSyBL2FMkqJtoyZ0eP6rYjPH2cf6sBxTc7XM"
authDomain: "ikid-791bd.firebaseapp.com"
projectId: "ikid-791bd"
storageBucket: "ikid-791bd.firebasestorage.app"
messagingSenderId: "338831664153"
appId: "1:338831664153:web:0c90ee9397e1a5ad53b688"
```

## ✅ Steg 2: Sjekk Firebase Console

Gå til: https://console.firebase.google.com/project/ikid-791bd

### Authentication
- [ ] Gå til **Authentication** → **Sign-in method**
- [ ] **Email/Password** skal være **Enabled** (grønn toggle)
- [ ] Hvis ikke, klikk på Email/Password og aktiver det

### Firestore Database
- [ ] Gå til **Firestore Database**
- [ ] Sjekk at databasen er opprettet (du skal se "Data" og "Rules" faner)
- [ ] Hvis ikke, klikk **"Create database"**:
  - Velg **"Start in test mode"**
  - Velg region: **"europe-north2 (Stockholm)"**
  - Klikk **"Enable"**

### Security Rules (for testing)
- [ ] Gå til **Firestore Database** → **Rules**
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
- [ ] Klikk **"Publish"**

## ✅ Steg 3: Restart Metro Bundler

Hvis du har gjort endringer i config.ts:

1. Stopp Metro bundler (Ctrl+C i terminalen)
2. Start på nytt med cache-clear:
   ```bash
   npm start -- --reset-cache
   ```

## ✅ Steg 4: Test

1. I ny terminal: `npm run android`
2. Prøv å registrere en bruker:
   - E-post: `test@test.com`
   - Passord: `Test1234!`
   - Navn: `Test Bruker`
   - Rolle: `Foreldre`
3. Sjekk Firebase Console:
   - **Authentication** → **Users**: Du skal se testbrukeren
   - **Firestore Database** → **Data**: Du skal se `users` collection

## 🆘 Hvis det fortsatt ikke fungerer

1. **Sjekk internettforbindelse** på enheten/emulatoren
2. **Sjekk at du er på riktig Firebase-prosjekt** (`ikid-791bd`)
3. **Sjekk konsollen** for detaljerte feilmeldinger
4. Se `TROUBLESHOOTING.md` for mer hjelp

