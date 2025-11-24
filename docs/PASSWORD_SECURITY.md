# 🔒 Passord-sikkerhet og kryptering

## Oversikt

iKid-applikasjonen bruker flere lag med sikkerhet for passord og sensitive data:

1. **Firebase Authentication** - Håndterer passord-hashing på server-siden
2. **Client-side validering** - Sterk passordstyrke-validering før sending
3. **Web Crypto API** - Kryptering av sensitive data før lagring i Firestore

## Passord-hashing

### Firebase Authentication (Server-side)

Firebase Authentication håndterer passord-hashing automatisk på server-siden:
- Bruker **scrypt** (en sterk key derivation function)
- Passord hashes med salt automatisk
- Ingen passord lagres i klartekst
- OWASP-anbefalt implementasjon

**VIKTIG:** Vi sender passord i klartekst til Firebase (over HTTPS), men Firebase hasher det umiddelbart på server-siden. Dette er standard praksis og sikker.

### Client-side validering

Før passord sendes til Firebase, valideres det strengt:

**Minimum krav:**
- ✅ Minimum 12 tegn (OWASP anbefaling)
- ✅ Minst én stor bokstav (A-Z)
- ✅ Minst én liten bokstav (a-z)
- ✅ Minst ett tall (0-9)
- ✅ Minst ett spesialtegn (!@#$%^&*()_+-=[]{};':"\\|,.<>/?)

**Styrke-scoring:**
- 0-1: Svakt
- 2-3: Middels
- 4: Sterkt
- 5+: Meget sterkt (bonus for lengde ≥16 tegn)

### Implementering

```typescript
import { validatePasswordStrength } from '@/utils/validation';

const strength = validatePasswordStrength(password);
if (!strength.isValid) {
  // Vis feedback til bruker
  console.log(strength.feedback);
}
```

## Kryptering av sensitive data

### Web Crypto API

For sensitive data som lagres i Firestore (ikke passord), bruker vi Web Crypto API:

**PBKDF2 med SHA-256:**
- 100,000 iterasjoner (OWASP minimum)
- 256-bit output
- Unik salt per hash

**AES-GCM:**
- 256-bit nøkler
- Galois/Counter Mode (autentisert kryptering)
- 96-bit IV per kryptering

### Bruk

```typescript
import { hashPassword, encryptData, decryptData } from '@/utils/crypto';

// Hash sensitive data før lagring
const { hash, salt } = await hashPassword(sensitiveData);

// Krypter data før lagring
const encrypted = await encryptData(sensitiveData);
```

## Beste praksis

### ✅ Gjør dette:

1. **Alltid valider passordstyrke** før sending til Firebase
2. **Bruk HTTPS** for all kommunikasjon (automatisk med Firebase)
3. **Hash sensitive data** før lagring i Firestore (hvis ikke Firebase håndterer det)
4. **Bruk sterke passord** - minimum 12 tegn med alle krav oppfylt
5. **Implementer rate limiting** (Firebase gjør dette automatisk)

### ❌ Ikke gjør dette:

1. **Ikke lagre passord i klartekst** - Firebase håndterer dette
2. **Ikke hash passord på klientsiden før Firebase** - Firebase trenger klartekst for å hashe korrekt
3. **Ikke send passord over HTTP** - Alltid HTTPS (Firebase krever dette)
4. **Ikke logg passord** - Aldri logg passord eller sensitive data
5. **Ikke bruk svake passord** - Minimum 12 tegn med alle krav

## Sikkerhetslag

```
┌─────────────────────────────────────┐
│  Client-side validering              │
│  (Passordstyrke, format)             │
└──────────────┬────────────────────────┘
               │ HTTPS (TLS 1.3)
               ▼
┌─────────────────────────────────────┐
│  Firebase Authentication             │
│  (scrypt hashing, salt)              │
└──────────────┬────────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Firestore Database                 │
│  (Kryptert at rest)                 │
└─────────────────────────────────────┘
```

## OWASP Compliance

Vi følger OWASP Password Storage Cheat Sheet:

- ✅ **Minimum 12 tegn** (anbefalt minimum)
- ✅ **Kombinasjon av tegn** (stor/liten bokstav, tall, spesialtegn)
- ✅ **Server-side hashing** (Firebase scrypt)
- ✅ **Salt per passord** (Firebase håndterer dette)
- ✅ **Sterk algoritme** (scrypt, PBKDF2)
- ✅ **Tilstrekkelig iterasjoner** (100,000+)

## Testing

Test passordstyrke-validering:

```typescript
import { validatePasswordStrength } from '@/utils/validation';

// Test cases
const weak = validatePasswordStrength('password'); // ❌
const medium = validatePasswordStrength('Password123'); // ⚠️
const strong = validatePasswordStrength('P@ssw0rd123!'); // ✅
```

## Oppdateringer

- **2024**: Oppgradert til minimum 12 tegn (fra 8)
- **2024**: Lagt til detaljert passordstyrke-feedback
- **2024**: Implementert Web Crypto API for ekstra kryptering

