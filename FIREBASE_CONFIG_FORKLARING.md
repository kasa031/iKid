# Firebase Config - Tydelig Forklaring

## ❓ Spørsmålet: Skal jeg velge "Config" tab?

**SVAR: NEI! Du trenger ikke å velge "Config" tab.**

## ✅ Hva du skal gjøre (steg-for-steg):

### Steg 1: I Firebase Console
1. Du er allerede i **Project Settings** → **General**
2. Du ser **"Web apps"** i venstre side
3. Du ser **"SDK setup and configuration"** i høyre side
4. **"npm" tab er allerede valgt** (dette er riktig!)

### Steg 2: Finn firebaseConfig objektet
1. Scroll ned i **"npm" tab** (ikke bytt til "Config" tab)
2. Du skal se JavaScript-kode som starter med:
   ```javascript
   // Import the functions you need from the SDKs you need
   import { initializeApp } from "firebase/app";
   // ... mer kode ...
   ```
3. Scroll videre ned til du ser:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "ikid-791bd.firebaseapp.com",
     projectId: "ikid-791bd",
     storageBucket: "ikid-791bd.firebasestorage.app",
     messagingSenderId: "338831664153",
     appId: "1:338831664153:web:0c90ee9397e1a5ad53b688"
   };
   ```

### Steg 3: Kopier firebaseConfig objektet
1. **Kopier BARE firebaseConfig objektet** (fra `const firebaseConfig = {` til `};`)
2. **Ikke kopier** import-statements eller initializeApp-koden

### Steg 4: Lim inn i config.ts
1. Åpne `src/services/firebase/config.ts` i prosjektet ditt
2. Finn `const firebaseConfig = { ... }` objektet
3. **Erstatt** hele objektet med det du kopierte fra Firebase Console
4. **Lagre filen**

## ✅ Sjekk at det er riktig

Etter at du har limt inn, skal `config.ts` se slik ut:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyBL2FMkqJtoyZ0eP6rYjPH2cf6sBxTc7XM",
  authDomain: "ikid-791bd.firebaseapp.com",
  projectId: "ikid-791bd",
  storageBucket: "ikid-791bd.firebasestorage.app",
  messagingSenderId: "338831664153",
  appId: "1:338831664153:web:0c90ee9397e1a5ad53b688",
};
```

**VIKTIG:** 
- Alle verdiene skal være fylt ut (ikke `YOUR_API_KEY`, etc.)
- Filen skal være lagret
- Resten av filen (imports, initialization) skal være uendret

## 🔍 Hva er forskjellen mellom "npm" og "Config" tab?

- **"npm" tab:** Viser kode for å installere og bruke Firebase med npm (det du trenger!)
- **"Config" tab:** Viser bare konfigurasjonsobjektet i en annen format (samme informasjon, annen presentasjon)

**Du kan bruke begge, men "npm" tab er enklest for React Native-prosjekter.**

## ✅ Status nå

Basert på sjekk: **config.ts ser ut til å være riktig konfigurert allerede!**

Hvis du ser `apiKey: "AIzaSy..."` i config.ts (ikke `YOUR_API_KEY`), så er alt riktig!

## 🚀 Neste steg

1. **Verifiser config.ts:**
   - Åpne `src/services/firebase/config.ts`
   - Sjekk at alle verdiene er fylt ut
   - Lagre hvis du gjorde endringer

2. **Sjekk Firebase Console:**
   - Authentication → Email/Password må være Enabled
   - Firestore Database må være opprettet
   - Security Rules må tillate tilgang (test mode)

3. **Test appen:**
   - Start Metro bundler: `npm start`
   - I ny terminal: `npm run android`

## 🆘 Hvis du fortsatt er usikker

1. Åpne `src/services/firebase/config.ts`
2. Sjekk at `apiKey` starter med `AIzaSy...`
3. Hvis den gjør det → Alt er riktig! ✅
4. Hvis den sier `YOUR_API_KEY` → Kopier fra Firebase Console og lim inn

