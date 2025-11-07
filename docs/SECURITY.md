# Sikkerhet og GDPR-compliance

Dette dokumentet beskriver sikkerhetstiltak og GDPR-compliance for iKid-applikasjonen.

## GDPR-compliance

### Datalagring
- All data lagres i EØS-land (Firebase EU-region)
- Data krypteres i transit (HTTPS) og at rest
- Automatisk backup av all data

### Personvernrettigheter
- **Rett til innsyn**: Brukere kan se all data som er lagret om dem
- **Rett til retting**: Brukere kan oppdatere sin egen informasjon
- **Rett til sletting**: Brukere kan be om å få data slettet
- **Rett til dataportabilitet**: Brukere kan eksportere sin data

### Databehandling
- Kun nødvendig data samles inn
- Data brukes kun til formålene beskrevet i personvernpolicy
- Data deles ikke med tredjeparter uten samtykke

## Sikkerhetstiltak

### Autentisering
- Firebase Authentication med sterk passordhashing
- Session management med automatisk utlogging
- To-faktor autentisering (valgfritt)

### Tilgangskontroll
- Rollebasert tilgangskontroll (RBAC)
- Foreldre kan kun se egne barn
- Ansatte har tilgang til alle barn
- Firestore Security Rules implementerer tilgangskontroll

### Datakryptering
- All datatransport krypteres med HTTPS/TLS
- Data i database krypteres automatisk av Firebase
- Sensitive data hashes før lagring

### Sikkerhetsgjennomgang
- Regelmessig gjennomgang av sikkerhetstiltak
- Penetrasjonstesting
- Overvåking av sikkerhetshendelser

## Firestore Security Rules

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

## Rate Limiting

- API-kall er begrenset til 100 forespørsler per minutt per bruker
- Implementert via Firebase App Check og Cloud Functions

## Incident Response

Ved sikkerhetshendelser:
1. Identifiser og isoler problemet
2. Varsle berørte brukere
3. Dokumenter hendelsen
4. Implementer tiltak for å forhindre gjentakelse

