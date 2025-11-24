# Firestore Security Rules - Oppdatering

## 🔴 Problemet
Nye brukere fikk "Missing or insufficient permissions" når de prøvde å registrere seg, selv om registreringen faktisk fungerte.

## ✅ Løsningen
Oppdatert Security Rules for `users`-samlingen slik at nye brukere kan opprette sitt eget dokument ved registrering.

## 📝 Endringer

### Før:
```javascript
allow write: if request.auth != null && 
  get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['staff', 'admin'];
```

### Etter:
```javascript
// Allow users to create their own document when registering
allow create: if request.auth != null && request.auth.uid == userId;

// Allow users to update their own data, or staff/admin to update any user
allow update: if request.auth != null && 
  (request.auth.uid == userId || 
   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['staff', 'admin']);
```

## 🚀 Hvordan oppdatere

1. **Gå til Firebase Console:**
   - Åpne https://console.firebase.google.com/
   - Velg prosjektet ditt (ikid-791bd)

2. **Gå til Firestore Database:**
   - Klikk på "Firestore Database" i venstre meny
   - Klikk på "Rules" tab

3. **Kopier innholdet fra `firestore.rules`:**
   - Åpne `firestore.rules` filen i prosjektet
   - Kopier hele innholdet
   - Lim inn i Firebase Console Rules-editor

4. **Publiser reglene:**
   - Klikk "Publish" nederst på siden
   - Vent noen sekunder til reglene er publisert

## ✅ Resultat

Etter oppdateringen kan nye brukere:
- ✅ Opprette sitt eget brukerdokument ved registrering
- ✅ Oppdatere sin egen informasjon
- ✅ Se sin egen data

Staff/Admin kan fortsatt:
- ✅ Se alle brukere
- ✅ Oppdatere alle brukere
- ✅ Slette brukere

## 🔒 Sikkerhet

Reglene er fortsatt sikre:
- Brukere kan kun opprette/oppdatere sitt eget dokument
- Kun staff/admin kan se og oppdatere andre brukeres data
- Foreldre kan opprette og slette sine egne barn
- Alle operasjoner krever autentisering

## 📝 Oppdatering 2: Foreldre kan opprette og slette barn

Foreldre kan nå:
- ✅ Opprette nye barn og automatisk knytte seg til dem
- ✅ Slette sine egne barn
- ✅ Oppdatere informasjon om sine egne barn

Security Rules er oppdatert for å tillate dette.

