# Test Checklist - iKid

Bruk denne listen for å sjekke at alle funksjoner fungerer.

## Oppsett
- [ ] Node.js installert
- [ ] npm install kjørt
- [ ] Firebase-prosjekt opprettet
- [ ] Firebase Authentication aktivert
- [ ] Firestore Database aktivert (EØS-region)
- [ ] Firebase-konfigurasjon oppdatert i `config.ts`
- [ ] Metro bundler starter (`npm start`)
- [ ] Appen kjører på simulator/enhet

## Autentisering
- [ ] Registrering fungerer
- [ ] Innlogging fungerer
- [ ] Glemt passord fungerer
- [ ] Endre passord fungerer
- [ ] Logg ut fungerer
- [ ] Validering av e-post fungerer
- [ ] Validering av passord fungerer

## Inn/utkryssing (Foreldre)
- [ ] Innkryssing fungerer
- [ ] Utkryssing fungerer
- [ ] Status oppdateres i oversikt
- [ ] Tidspunkt vises korrekt
- [ ] Validering: Kan ikke krysse inn to ganger
- [ ] Validering: Kan ikke krysse ut uten å være krysset inn

## Oversikt
- [ ] Alle barn vises (for ansatte)
- [ ] Kun egne barn vises (for foreldre)
- [ ] Status-badges vises korrekt
- [ ] Søk fungerer
- [ ] Filtrering fungerer (Alle/Til stede/Hentet)
- [ ] Real-time oppdateringer fungerer

## Profiler
- [ ] Foreldre kan se "Mitt barn"
- [ ] Ansatte kan se alle barn-profiler
- [ ] Ansatte kan redigere barn-profiler
- [ ] Bildeopplasting fungerer (for ansatte)
- [ ] Informasjon vises korrekt

## Kalender
- [ ] Hendelser vises
- [ ] Ansatte kan legge til hendelser
- [ ] Ansatte kan slette hendelser
- [ ] Dato og tid vises korrekt
- [ ] Notifikasjoner fungerer (hvis implementert)

## Logger
- [ ] Logger vises
- [ ] Søk fungerer
- [ ] Filtrering fungerer
- [ ] Eksport til CSV fungerer (for ansatte)
- [ ] Alle inn/utkryssinger logges

## Admin-funksjoner
- [ ] Legg til barn fungerer
- [ ] Knytt foreldre til barn fungerer
- [ ] Legg til ansatt fungerer
- [ ] Endre rolle fungerer
- [ ] Slett bruker fungerer

## Innstillinger
- [ ] Språkbytte fungerer (Norsk/English/Polski)
- [ ] Tema-bytte fungerer (Light/Dark/System)
- [ ] Oppdater brukerinfo fungerer
- [ ] Endre passord fungerer
- [ ] Logg ut fungerer

## UI/UX
- [ ] Dark mode ser bra ut
- [ ] Light mode ser bra ut
- [ ] Farger er tydelige og lesbare
- [ ] Knapper er touch-friendly
- [ ] Tekst er lesbar
- [ ] Layout fungerer på ulike skjermstørrelser

## Flerspråklig
- [ ] Norsk fungerer
- [ ] English fungerer
- [ ] Polski fungerer
- [ ] Alle tekster er oversatt
- [ ] Layout ser bra ut på alle språk

## Sikkerhet
- [ ] Foreldre kan kun se egne barn
- [ ] Ansatte kan se alle barn
- [ ] Admin-funksjoner er beskyttet
- [ ] Passord hashes korrekt
- [ ] Data lagres i EØS-region

## Ytelse
- [ ] Appen starter raskt
- [ ] Navigasjon er flytende
- [ ] Søk er responsivt
- [ ] Bilder lastes raskt
- [ ] Ingen lag ved scrolling

## Feilhåndtering
- [ ] Feilmeldinger vises tydelig
- [ ] Validering fungerer
- [ ] Network-feil håndteres
- [ ] Loading-states vises

## Notater

Skriv ned eventuelle problemer eller observasjoner:

```
Dato: ___________
Tester: ___________

Problemer:
- 
- 
- 

Observasjoner:
- 
- 
- 
```

