# Verifiser Firebase Firestore-region (EØS)

Denne guiden hjelper deg med å verifisere at Firebase Firestore er konfigurert for EØS-region, som er påkrevd for GDPR-compliance.

## Hvorfor er dette viktig?

For å overholde GDPR (General Data Protection Regulation) må all personopplysninger lagres innenfor EØS (Europeisk Økonomisk Samarbeidsområde). Firebase Firestore må derfor være konfigurert med en EØS-region.

## Steg-for-steg verifisering

### Steg 1: Gå til Firebase Console

1. Åpne [Firebase Console](https://console.firebase.google.com/)
2. Velg ditt prosjekt (f.eks. "ikid" eller "iKid-Eventyrhagen")
3. Gå til **Firestore Database** i venstre meny

### Steg 2: Sjekk database-region

1. Klikk på **Settings** (tannhjul-ikonet) øverst til høyre
2. Klikk på **Project settings**
3. Scroll ned til **Your Cloud Firestore locations** eller **Database location**
4. Se hvilken region som er oppgitt

### Steg 3: Verifiser at regionen er EØS

**Godkjente EØS-regioner:**
- ✅ `europe-west1` (Belgia) - **Anbefalt**
- ✅ `europe-west3` (Frankrike)
- ✅ `europe-west4` (Nederland)
- ✅ `europe-north1` (Finland)
- ✅ `europe-central2` (Polen)

**Ikke godkjent:**
- ❌ `us-central1` (USA)
- ❌ `us-east1` (USA)
- ❌ `asia-south1` (India)
- ❌ Andre ikke-EØS regioner

### Steg 4: Hvis regionen ikke er EØS

⚠️ **Viktig:** Hvis databasen allerede er opprettet med feil region, kan du **ikke** endre regionen etterpå. Du må:

1. Eksportere all data (hvis det er noe)
2. Slette den eksisterende databasen
3. Opprette en ny database med korrekt EØS-region
4. Importere dataene igjen

**Alternativ:** Opprett et nytt Firebase-prosjekt med korrekt region fra starten.

## Hvordan opprette database med EØS-region

1. Gå til **Firestore Database** i Firebase Console
2. Klikk **Create database** (hvis du ikke har en database)
3. Velg **Start in production mode** (eller test mode for testing)
4. **VIKTIG:** Velg en EØS-region fra listen:
   - `europe-west1` (Belgia) - **Anbefalt**
   - `europe-west3` (Frankrike)
   - `europe-west4` (Nederland)
5. Klikk **Enable**

## Verifisering via Firebase CLI (valgfritt)

Hvis du har Firebase CLI installert, kan du også sjekke regionen via kommandolinjen:

```bash
firebase firestore:databases:list
```

Dette vil vise alle databaser og deres regioner.

## Dokumentasjon

- [Firebase Firestore Locations](https://firebase.google.com/docs/firestore/manage-databases#choose_location)
- [GDPR Compliance](https://firebase.google.com/support/privacy/gdpr)

## Status

- [ ] Firebase Firestore-region er verifisert som EØS
- [ ] Region: _________________ (fyll inn)
- [ ] Dato for verifisering: _________________

## Notater

Legg til eventuelle notater om verifiseringen her:

_________________________________________________
_________________________________________________
_________________________________________________

