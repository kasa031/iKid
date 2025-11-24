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
3. Klikk på Web-ikonet (`</>`)
4. Registrer appen med et navn (f.eks. "iKid Web App")
5. Kopier Firebase-konfigurasjonen
6. Opprett en `.env.local` fil i rot-mappen og legg til:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

**Viktig:** `.env.local` er allerede i `.gitignore` og vil ikke bli pushet til GitHub.

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

1. Start utviklingsserveren: `npm run dev`
2. Åpne http://localhost:3000 i nettleseren
3. Prøv å logge inn med en testbruker
4. Verifiser at data lagres i Firestore

## Viktige sikkerhetshensyn

- **Aldri** committ `.env.local` filen til Git (den er allerede i `.gitignore`)
- Bruk miljøvariabler (`.env.local`) for lokal utvikling
- For produksjon, bruk GitHub Secrets eller hosting-platformens miljøvariabler
- Sørg for at Security Rules er korrekt konfigurert
- Verifiser at region er satt til EU

