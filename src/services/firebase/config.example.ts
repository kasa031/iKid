/**
 * Firebase configuration EXAMPLE
 *
 * INSTRUKSJONER FOR OPPSETT:
 * 1. Kopier denne filen til config.ts: cp config.example.ts config.ts
 * 2. Gå til https://console.firebase.google.com/
 * 3. Opprett et nytt prosjekt eller velg eksisterende
 * 4. Gå til Project Settings (tannhjul-ikonet)
 * 5. Scroll ned til "Your apps" og klikk på Web-ikonet
 * 6. Kopier konfigurasjonsobjektet og lim inn verdiene nedenfor
 *
 * VIKTIG: Sørg for at Firebase-prosjektet er konfigurert for EØS-region
 * (europe-west1) for GDPR-compliance
 *
 * KRITISK SIKKERHET:
 * - config.ts er i .gitignore og vil IKKE bli pushet til GitHub
 * - Bruk alltid miljøvariabler for produksjon
 * - Del aldri API-nøkler offentlig
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration - Erstatt med dine Firebase-verdier
// HENT DISSE FRA FIREBASE CONSOLE - IKKE HARDKOD DEM!
const firebaseConfig = {
  apiKey: 'DIN_API_KEY_HER',
  authDomain: 'ditt-prosjekt.firebaseapp.com',
  projectId: 'ditt-prosjekt-id',
  storageBucket: 'ditt-prosjekt.firebasestorage.app',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef123456',
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage };
