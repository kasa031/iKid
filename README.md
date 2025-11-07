# iKid - Digital inn- og utkryssing for barnehager

iKid er en React Native-applikasjon designet for barnehagen "Eventyrhagen Barnehage" for å erstatte det gamle Excel-baserte systemet for inn- og utkryssing av barn. Applikasjonen er bygget med fokus på GDPR-compliance, sikkerhet og brukervennlighet.

## Funksjoner

### For foreldre
- Inn- og utkryssing av egne barn
- Oversikt over barnets status
- Visning av barnets profil og informasjon
- Flerspråklig støtte (norsk, engelsk, polsk)
- Dark/light mode

### For ansatte
- Inn- og utkryssing av alle barn
- Oversikt over alle barn og deres status
- Logger for inn/utkryssinger
- Kalender med viktige hendelser
- Send e-post til foresatte
- Administrasjon av barn-profiler

### Sikkerhet og personvern
- GDPR-compliant datalagring (EØS-land)
- Rollebasert tilgangskontroll
- Kryptert datatransport
- Sikker passordhåndtering
- Automatisk logging av alle handlinger

## Teknologistack

- **React Native** - Kryssplattform mobilutvikling
- **TypeScript** - Type-sikkerhet
- **Firebase** - Backend, autentisering og database
- **i18next** - Flerspråklig støtte
- **React Navigation** - Navigasjon

## Rask start

For å komme i gang raskt, se `QUICK_START.md`.

For systematisk testing, se `TESTING_GUIDE.md`.

## Prosjektoppsett

### Forutsetninger
- Node.js (v14 eller nyere)
- npm eller yarn
- React Native CLI
- Android Studio (for Android-utvikling)
- Xcode (for iOS-utvikling, kun macOS)

### Installasjon

1. Klon repositoriet:
```bash
git clone <repository-url>
cd iKid
```

2. Installer avhengigheter:
```bash
npm install
```

3. Konfigurer Firebase:
   - Opprett et Firebase-prosjekt
   - Kopier Firebase-konfigurasjonen til `src/services/firebase/config.ts`
   - Sørg for at Firebase-prosjektet er konfigurert for EØS-region

4. Start Metro bundler:
```bash
npm start
```

5. Kjør appen:
```bash
# For Android
npm run android

# For iOS
npm run ios
```

## Prosjektstruktur

```
iKid/
├── src/
│   ├── components/      # Gjenbrukbare komponenter
│   ├── screens/         # Skjermkomponenter
│   ├── services/         # Backend-tjenester
│   ├── navigation/      # Navigasjonskonfigurasjon
│   ├── context/         # React Context providers
│   ├── utils/           # Hjelpefunksjoner
│   ├── types/           # TypeScript type-definisjoner
│   ├── constants/       # Konstanter (farger, størrelser)
│   └── i18n/            # Språkfiler
├── package.json
├── tsconfig.json
└── README.md
```

## Database-struktur

### Collections

- **users** - Brukerdata (foreldre og ansatte)
- **children** - Barn-profiler
- **checkInOutLogs** - Logger for inn/utkryssinger
- **calendarEvents** - Kalenderoppføringer

## Sikkerhet

- All data lagres i EØS-land (GDPR-compliance)
- Passord hashes med Firebase Authentication
- Rollebasert tilgangskontroll implementert
- Firestore Security Rules for datatilgang
- Kryptert datatransport (HTTPS)

## Utvikling

### Kodekvalitet
- ESLint for kodekvalitet
- Prettier for kodeformatering
- TypeScript for type-sikkerhet

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formatering
```bash
npm run format
```

## Deployment

### Android
1. Bygg release APK:
```bash
cd android
./gradlew assembleRelease
```

### iOS
1. Åpne prosjektet i Xcode
2. Velg "Archive" for produksjonsbygget

## Dokumentasjon

Se `docs/` mappen for detaljert dokumentasjon om:
- Database-struktur
- API-endepunkter
- Rollebasert tilgang
- GDPR-compliance
- Brukermanual

## Lisens

ISC

## Kontakt

For spørsmål eller support, kontakt utviklingsteamet.

