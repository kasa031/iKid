# Deployment Guide

Dette dokumentet beskriver hvordan man deployer iKid-applikasjonen til produksjon.

## Forutsetninger

- Node.js (v18 eller nyere)
- Firebase-prosjekt konfigurert
- Git repository
- Hosting-konto (Firebase Hosting, Netlify, Vercel, eller GitHub Pages)

## Firebase-konfigurasjon

1. Opprett et Firebase-prosjekt i Firebase Console
2. Velg EU-region for GDPR-compliance
3. Aktiver Firebase Authentication (Email/Password)
4. Aktiver Firestore Database
5. Opprett en Web App i Firebase Console
6. Kopier Firebase-konfigurasjonen til `.env.local` (for lokal utvikling)
7. For produksjon, legg til miljøvariabler i hosting-platformen

## Firestore Security Rules

Implementer følgende security rules i Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['staff', 'admin']);
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['staff', 'admin'];
    }
    
    // Children collection
    match /children/{childId} {
      allow read: if request.auth != null && 
        (resource.data.parentIds.hasAny([request.auth.uid]) || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['staff', 'admin']);
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['staff', 'admin'];
    }
    
    // Check-in/out logs
    match /checkInOutLogs/{logId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // Calendar events
    match /calendarEvents/{eventId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['staff', 'admin'];
    }
  }
}
```

## Web Deployment

### 1. Bygg produksjonsversjonen

```bash
npm run build
```

Dette genererer en `dist/` mappe med alle produksjonsfiler.

### 2. Test produksjonsbygget lokalt

```bash
npm run preview
```

Dette starter en lokal server med produksjonsbygget på http://localhost:4173

### 3. Deploy til Firebase Hosting

```bash
# Installer Firebase CLI hvis ikke allerede installert
npm install -g firebase-tools

# Logg inn
firebase login

# Initialiser Firebase Hosting (hvis ikke allerede gjort)
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### 4. Deploy til Netlify

1. Push koden til GitHub
2. Gå til [Netlify](https://www.netlify.com/)
3. Koble til GitHub-repository
4. Sett build command: `npm run build`
5. Sett publish directory: `dist`
6. Legg til miljøvariabler i Netlify dashboard
7. Deploy

### 5. Deploy til Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Eller bruk Vercel dashboard og koble til GitHub-repository.

### 6. Deploy til GitHub Pages

Se [GITHUB_PAGES_SETUP.md](../GITHUB_PAGES_SETUP.md) for detaljerte instruksjoner.

## CI/CD Pipeline

### GitHub Actions eksempel

Opprett `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run linter
      run: npm run lint
    
    - name: Build
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Miljøvariabler

### Lokal utvikling

Opprett `.env.local` fil i rot-mappen:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Produksjon

Legg til miljøvariabler i hosting-platformen:
- **Firebase Hosting**: I Firebase Console > Hosting > Environment variables
- **Netlify**: I Netlify Dashboard > Site settings > Environment variables
- **Vercel**: I Vercel Dashboard > Project settings > Environment variables
- **GitHub Actions**: I Repository settings > Secrets and variables > Actions

## Testing i produksjon

1. Test alle funksjoner i produksjonsmiljø
2. Verifiser GDPR-compliance
3. Test på ulike nettlesere (Chrome, Firefox, Edge, Safari)
4. Test responsivt design (mobil, tablet, desktop)
5. Test PWA-installasjon på ulike enheter
6. Test flerspråklig støtte
7. Test dark/light mode
8. Verifiser HTTPS (påkrevd for PWA)

## Vedlikehold

- Regelmessig oppdatering av avhengigheter
- Overvåking av feil og ytelse
- Sikkerhetsgjennomgang
- Backup av database

