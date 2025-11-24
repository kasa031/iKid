# iKid - Eventyrhagen Barnehage

Digital inn- og utkryssing for barnehager - En moderne webapp bygget med React, TypeScript og Firebase.

## 🚀 Kom i gang

### Forutsetninger

- Node.js 18+ og npm
- Firebase-prosjekt (se [Firebase Setup](./docs/setup/FIREBASE_SETUP.md))

### Installasjon

```bash
# Installer avhengigheter
npm install

# Start utviklingsserver
npm run dev

# Bygg for produksjon
npm run build

# Forhåndsvis produksjonsbygget
npm run preview
```

## 📱 PWA (Progressive Web App)

Appen kan installeres på hjemskjermen som en PWA. Se [PWA Installasjonsguide](./PWA_INSTALLASJON.md) for detaljer.

## 📚 Dokumentasjon

- [Firebase Setup](./docs/setup/FIREBASE_SETUP.md) - Komplett Firebase-oppsett
- [PWA Installasjon](./PWA_INSTALLASJON.md) - Installer appen på hjemskjermen
- [Deployment](./docs/DEPLOYMENT.md) - Deploy til produksjon
- [Sikkerhet](./docs/SECURITY.md) - Sikkerhetsretningslinjer
- [GDPR](./docs/GDPR.md) - Personvern og GDPR
- [Brukerhåndbok](./docs/USER_MANUAL.md) - Brukerguide

## 🛠️ Teknologi

- **Frontend**: React 19, TypeScript, Vite
- **Routing**: React Router v7
- **Styling**: CSS Modules
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Internasjonalisering**: i18next
- **PWA**: vite-plugin-pwa

## 📁 Prosjektstruktur

```
iKid/
├── public/              # Statiske filer og PWA-assets
├── src/
│   ├── components/      # Gjenbrukbare komponenter
│   ├── screens/        # Skjermkomponenter
│   ├── navigation/     # Routing og navigasjon
│   ├── services/       # API og Firebase-tjenester
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Hjelpefunksjoner
│   ├── constants/      # Konstantverdier
│   ├── types/          # TypeScript typer
│   └── i18n/           # Oversettelser
├── docs/               # Dokumentasjon
└── scripts/            # Build scripts
```

## 🔒 Sikkerhet

- Passord hashing via Firebase
- Rollebasert tilgangskontroll
- GDPR-kompatibel datalagring
- Datalagring innenfor EØS

## 🌍 Språkstøtte

Appen støtter:
- Norsk (no)
- Engelsk (en)
- Polsk (pl)

## 📝 Lisens

ISC
