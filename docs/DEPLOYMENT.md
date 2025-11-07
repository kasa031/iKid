# Deployment Guide

Dette dokumentet beskriver hvordan man deployer iKid-applikasjonen til produksjon.

## Forutsetninger

- Node.js (v14 eller nyere)
- React Native CLI
- Firebase-prosjekt konfigurert
- Android Studio (for Android)
- Xcode (for iOS, kun macOS)

## Firebase-konfigurasjon

1. Opprett et Firebase-prosjekt i Firebase Console
2. Velg EU-region for GDPR-compliance
3. Aktiver Firebase Authentication (Email/Password)
4. Aktiver Firestore Database
5. Kopier Firebase-konfigurasjonen til `src/services/firebase/config.ts`

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

## Android Deployment

### 1. Bygg release APK

```bash
cd android
./gradlew assembleRelease
```

APK-filen vil være i `android/app/build/outputs/apk/release/`

### 2. Bygg AAB (App Bundle) for Google Play

```bash
cd android
./gradlew bundleRelease
```

AAB-filen vil være i `android/app/build/outputs/bundle/release/`

### 3. Signer appen

Følg Google Play's guide for app-signering.

## iOS Deployment

### 1. Åpne prosjektet i Xcode

```bash
cd ios
open iKid.xcworkspace
```

### 2. Konfigurer signing

1. Velg prosjektet i Xcode
2. Gå til "Signing & Capabilities"
3. Velg ditt team og provisioning profile

### 3. Bygg for produksjon

1. Velg "Any iOS Device" som target
2. Velg "Product" > "Archive"
3. Følg guiden for å laste opp til App Store

## CI/CD Pipeline

### GitHub Actions eksempel

Opprett `.github/workflows/build.yml`:

```yaml
name: Build and Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run linter
      run: npm run lint
    
    - name: Build Android
      run: |
        cd android
        ./gradlew assembleRelease
```

## Miljøvariabler

Opprett `.env` fil for miljøspesifikke variabler:

```
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
```

## Testing i produksjon

1. Test alle funksjoner i produksjonsmiljø
2. Verifiser GDPR-compliance
3. Test på ulike enheter
4. Test flerspråklig støtte
5. Test dark/light mode

## Vedlikehold

- Regelmessig oppdatering av avhengigheter
- Overvåking av feil og ytelse
- Sikkerhetsgjennomgang
- Backup av database

