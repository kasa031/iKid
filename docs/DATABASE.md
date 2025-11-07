# Database-struktur

Dette dokumentet beskriver database-strukturen for iKid-applikasjonen.

## Firebase Firestore Collections

### users
Brukerdata for foreldre og ansatte.

**Felter:**
- `email` (string) - E-postadresse
- `name` (string) - Fullt navn
- `phone` (string, optional) - Telefonnummer
- `role` (string) - Rolle: 'parent', 'staff', eller 'admin'
- `createdAt` (timestamp) - Opprettelsestidspunkt
- `updatedAt` (timestamp) - Sist oppdatert

**Security Rules:**
- Brukere kan lese sin egen data
- Ansatte kan lese alle brukere
- Kun ansatte kan oppdatere brukerdata

### children
Barn-profiler.

**Felter:**
- `firstName` (string) - Fornavn
- `lastName` (string) - Etternavn
- `dateOfBirth` (timestamp) - Fødselsdato
- `parentIds` (array<string>) - Array av foreldre-IDer
- `photoUrl` (string, optional) - URL til profilbilde
- `allergies` (string, optional) - Allergier
- `notes` (string, optional) - Notater
- `status` (string, optional) - Status: 'not_checked_in', 'checked_in', 'checked_out'
- `lastCheckIn` (timestamp, optional) - Sist innkrysset
- `lastCheckOut` (timestamp, optional) - Sist utkrysset
- `createdAt` (timestamp) - Opprettelsestidspunkt
- `updatedAt` (timestamp) - Sist oppdatert

**Security Rules:**
- Foreldre kan kun lese egne barn (basert på parentIds)
- Ansatte kan lese og oppdatere alle barn
- Kun ansatte kan opprette nye barn

### checkInOutLogs
Logger for inn- og utkryssinger.

**Felter:**
- `childId` (string) - ID til barnet
- `userId` (string) - ID til brukeren som utførte handlingen
- `action` (string) - 'check_in' eller 'check_out'
- `timestamp` (timestamp) - Tidspunkt for handlingen
- `notes` (string, optional) - Notater

**Security Rules:**
- Foreldre kan kun lese logger for egne barn
- Ansatte kan lese alle logger
- Kun autentiserte brukere kan opprette logger

### calendarEvents
Kalenderoppføringer.

**Felter:**
- `title` (string) - Tittel på hendelsen
- `description` (string, optional) - Beskrivelse
- `date` (timestamp) - Dato for hendelsen
- `eventType` (string) - Type: 'parent_meeting', 'field_trip', 'other'
- `createdBy` (string) - ID til brukeren som opprettet hendelsen
- `createdAt` (timestamp) - Opprettelsestidspunkt
- `updatedAt` (timestamp) - Sist oppdatert

**Security Rules:**
- Alle autentiserte brukere kan lese kalenderoppføringer
- Kun ansatte kan opprette, oppdatere og slette oppføringer

## Indexes

Følgende indekser må opprettes i Firestore:

1. `checkInOutLogs`: `childId` (ascending), `timestamp` (descending)
2. `checkInOutLogs`: `userId` (ascending), `timestamp` (descending)
3. `children`: `parentIds` (array-contains)
4. `calendarEvents`: `date` (ascending)

## GDPR-compliance

- All data lagres i EØS-land (Firebase EU-region)
- Data har automatisk TTL (Time To Live) basert på norsk lovgivning
- Brukere har rett til å få data eksportert
- Brukere har rett til å få data slettet
- Alle handlinger logges for sporing

