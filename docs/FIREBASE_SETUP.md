# Firebase Setup Guide

Dette dokumentet beskriver hvordan man setter opp Firebase for iKid-applikasjonen.

## 1. Opprett Firebase-prosjekt

1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Klikk "Add project"
3. Fyll inn prosjektnavn (f.eks. "iKid-Eventyrhagen")
4. Velg eller deaktiver Google Analytics (valgfritt)
5. Klikk "Create project"

## 2. Konfigurer Firebase Authentication

1. I Firebase Console, gå til "Authentication"
2. Klikk "Get started"
3. Gå til "Sign-in method" tab
4. Aktiver "Email/Password" provider
5. Klikk "Save"

## 3. Konfigurer Firestore Database

1. Gå til "Firestore Database"
2. Klikk "Create database"
3. **VIKTIG**: Velg "Start in production mode" (vi setter opp security rules senere)
4. **VIKTIG**: Velg EU-region (europe-west1, europe-west3, eller europe-west4) for GDPR-compliance
5. Klikk "Enable"

## 4. Sett opp Security Rules

1. Gå til "Firestore Database" > "Rules"
2. Erstatt innholdet med reglene fra `docs/SECURITY.md`
3. Klikk "Publish"

## 5. Legg til Firebase-konfigurasjon i appen

1. Gå til "Project Settings" (tannhjul-ikonet)
2. Scroll ned til "Your apps"
3. Klikk på ikonet for React Native (eller Web)
4. Registrer appen med et navn
5. Kopier Firebase-konfigurasjonen
6. Lim inn i `src/services/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};
```

## 6. Installer Firebase CLI (valgfritt)

For deployment og testing:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

## 7. Opprett indekser

I Firestore Console, gå til "Indexes" og opprett følgende:

1. Collection: `checkInOutLogs`
   - Fields: `childId` (Ascending), `timestamp` (Descending)

2. Collection: `checkInOutLogs`
   - Fields: `userId` (Ascending), `timestamp` (Descending)

3. Collection: `children`
   - Fields: `parentIds` (Array)

4. Collection: `calendarEvents`
   - Fields: `date` (Ascending)

## 8. Test konfigurasjonen

1. Kjør appen: `npm start`
2. Prøv å logge inn med en testbruker
3. Verifiser at data lagres i Firestore

## Viktige sikkerhetshensyn

- **Aldri** committ Firebase-konfigurasjon med ekte credentials til Git
- Bruk miljøvariabler for produksjon
- Sørg for at Security Rules er korrekt konfigurert
- Verifiser at region er satt til EU

