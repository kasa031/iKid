# OAuth Consent Screen Konfigurasjon - Firebase/Google Cloud

## Hva er OAuth Consent Screen?

OAuth Consent Screen er en sikkerhetsside som vises til brukere når de logger inn med Google eller andre OAuth-leverandører. Den informerer brukere om hvilke data appen din ber om tilgang til.

## Hvorfor må jeg konfigurere dette?

Firebase Authentication bruker Google OAuth for innlogging. For at dette skal fungere, må du konfigurere OAuth Consent Screen i Google Cloud Console.

## Steg-for-steg guide

### 1. Gå til Google Cloud Console

1. Gå til [Google Cloud Console](https://console.cloud.google.com/)
2. Velg ditt Firebase-prosjekt (eller opprett et nytt hvis du ikke har et)

### 2. Naviger til OAuth Consent Screen

1. I venstre meny, gå til **APIs & Services** > **OAuth consent screen**
2. Eller klikk på advarselsbanneret som sier "Remember to configure the OAuth consent screen"

### 3. Velg brukertype

- **External**: For alle brukere (anbefalt for testing og produksjon)
- **Internal**: Kun for brukere i din Google Workspace-organisasjon

**Anbefaling**: Velg **External** for å kunne teste med alle Google-kontoer.

### 4. Fyll ut app-informasjon

**App name:**
```
iKid - Eventyrhagen Barnehage
```

**User support email:**
- Velg din e-postadresse (den du bruker for Google Cloud)

**App logo (valgfritt):**
- Du kan laste opp et logo hvis du har et
- Må være minst 120x120 piksler

**Application home page:**
```
https://din-github-username.github.io/ikid
```
Eller din egen domene hvis du har en.

**Application privacy policy link (valgfritt):**
- Hvis du har en privacy policy, legg til lenke her
- Kan være en GitHub Pages-side eller egen nettside

**Application terms of service link (valgfritt):**
- Hvis du har vilkår for bruk, legg til lenke her

**Authorized domains:**
- Legg til: `github.io` (hvis du bruker GitHub Pages)
- Legg til din egen domene hvis du har en

**Developer contact information:**
- Din e-postadresse (samme som support email)

### 5. Scopes (tilganger)

For Firebase Authentication trenger du vanligvis bare standard scopes:

- **email**: For å få brukerens e-postadresse
- **profile**: For å få brukerens navn og profilbilde
- **openid**: For OpenID Connect-autentisering

Disse er vanligvis allerede konfigurert automatisk av Firebase.

### 6. Testbrukere (kun for External)

Hvis appen din er i "Testing"-modus (ikke publisert):

1. Scroll ned til **Test users**
2. Klikk **+ ADD USERS**
3. Legg til e-postadressene til brukere som skal kunne teste appen
4. Kun disse brukerne kan logge inn inntil appen er publisert

**Viktig**: Hvis appen er i testing-modus, må du legge til alle testbrukere her!

### 7. Publiser appen (valgfritt)

Når du er klar for produksjon:

1. Scroll til toppen
2. Klikk **PUBLISH APP**
3. Dette gjør appen tilgjengelig for alle brukere (ikke bare testbrukere)

**Advarsel**: Publiser kun når du er klar, da alle kan se appen din.

### 8. Verifiser konfigurasjonen

1. Gå tilbake til **APIs & Services** > **Credentials**
2. Sjekk at API-nøkkelen din er aktivert
3. Test at innlogging fungerer i appen din

## Feilsøking

### "Error 403: access_denied"

- Sjekk at du har lagt til testbrukere hvis appen er i testing-modus
- Sjekk at OAuth Consent Screen er konfigurert

### "Redirect URI mismatch"

- Sjekk at du har lagt til riktig domene i **Authorized domains**
- For GitHub Pages: legg til `github.io`
- For lokal utvikling: legg til `localhost` i Firebase Console under Authentication > Settings > Authorized domains

### Appen er ikke synlig

- Sjekk at du har publisert appen hvis den skal være tilgjengelig for alle
- Eller legg til testbrukere hvis den er i testing-modus

## Neste steg

Etter at OAuth Consent Screen er konfigurert:

1. Test innlogging i appen din
2. Verifiser at Firebase Authentication fungerer
3. Sjekk at brukerdata blir lagret korrekt i Firestore

## Ytterligere ressurser

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google OAuth Consent Screen Guide](https://developers.google.com/identity/protocols/oauth2/policies)
- [Firebase Console](https://console.firebase.google.com/)

