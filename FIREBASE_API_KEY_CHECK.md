# 🔑 Sjekk Firebase API-nøkler

## Direkte lenker til Firebase Console

### 1. Prosjektoversikt
**https://console.firebase.google.com/project/ikid**

### 2. Prosjektinnstillinger (hvor API-nøklene er)
**https://console.firebase.google.com/project/ikid/settings/general**

### 3. Web App-konfigurasjon (spesifikk for web-app)
**https://console.firebase.google.com/project/ikid/settings/general/web**

## Hvordan sjekke om API-nøklene er gyldige

### Steg 1: Gå til prosjektinnstillinger
1. Åpne: https://console.firebase.google.com/project/ikid/settings/general
2. Logg inn med Google-kontoen din

### Steg 2: Finn Web App-konfigurasjonen
1. Scroll ned til seksjonen **"Your apps"**
2. Klikk på web-appen din (eller "Add app" > Web hvis du ikke har en)

### Steg 3: Se API-nøklene
Du vil se en konfigurasjon som ser slik ut:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ikid-xxxxx.firebaseapp.com",
  projectId: "ikid",
  storageBucket: "ikid-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Steg 4: Verifiser at nøklene matcher
Sammenlign med verdiene i din `.env.local` fil:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=ikid-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ikid
VITE_FIREBASE_STORAGE_BUCKET=ikid-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

## Hvis API-nøklene ikke fungerer

### Sjekkliste:
- [ ] Er prosjektet aktivt? (ikke slettet eller deaktivert)
- [ ] Er API-nøklene kopiert riktig? (ingen mellomrom, hele nøkkelen)
- [ ] Er `.env.local` filen på riktig plass? (i rot-mappen av prosjektet)
- [ ] Har du restartet dev-serveren etter å ha lagt til nøkler?

### Test API-nøklene
1. Åpne nettleseren din
2. Gå til: http://localhost:3000
3. Sjekk konsollen (F12) for feilmeldinger
4. Prøv å logge inn - hvis det fungerer, er API-nøklene gyldige

## Hvis du trenger nye API-nøkler

1. Gå til: https://console.firebase.google.com/project/ikid/settings/general
2. Scroll til "Your apps"
3. Klikk på web-appen din
4. Klikk på "Config" for å se nøklene
5. Kopier nøklene til `.env.local`

## Viktig sikkerhet

⚠️ **ALDRIG** del API-nøklene offentlig!
- ✅ Lagre dem i `.env.local` (som er i `.gitignore`)
- ❌ Ikke commit `.env.local` til Git
- ❌ Ikke del nøklene i chat eller e-post
- ✅ Bruk Firebase Security Rules for å beskytte data

