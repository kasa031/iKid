# GDPR-compliance og databehandling

## Oversikt

iKid-applikasjonen er designet for å være fullt GDPR-compliant i henhold til norsk og europeisk personvernlovgivning.

## Datalagring

### Geografisk plassering
- All data lagres i EØS-land (Firebase EU-region)
- Ingen data overføres utenfor EØS uten eksplisitt samtykke
- Backup av data lagres også innenfor EØS

### Datakryptering
- All datatransport krypteres med HTTPS/TLS
- Data i database krypteres automatisk av Firebase
- Passord hashes med sterk algoritme (Firebase Authentication standard)

## Personvernrettigheter

### Rett til innsyn
Brukere har rett til å se all data som er lagret om dem:
- Brukerdata (navn, e-post, telefon)
- Barn-data (for foreldre: kun egne barn)
- Logger for inn/utkryssinger

### Rett til retting
Brukere kan oppdatere sin egen informasjon:
- Navn, e-post, telefon
- Passord
- Foreldre kan ikke redigere barn-data (kun ansatte)

### Rett til sletting
Brukere kan be om å få data slettet:
- Sletting av bruker sletter også alle tilknyttede data
- Logger beholdes i en begrenset periode i henhold til lovgivning
- Sletting utføres innen 30 dager

### Rett til dataportabilitet
Brukere kan eksportere sin data:
- Data eksporteres i JSON-format
- Inkluderer all brukerdata og tilknyttede logger

### Rett til å protestere
Brukere kan protestere mot databehandling:
- Kontakt barnehagen direkte
- Behandling kan stoppes ved gyldig protester

## Databehandling

### Formål
Data behandles kun for følgende formål:
- Inn- og utkryssing av barn
- Kommunikasjon mellom barnehage og foreldre
- Administrasjon av barnehage

### Lovhjemmel
Databehandling baseres på:
- Artikkel 6(1)(a) GDPR - Samtykke
- Artikkel 6(1)(f) GDPR - Legitimt interesse

### Dataminimering
- Kun nødvendig data samles inn
- Data som ikke lenger er nødvendig slettes automatisk
- Historiske data arkiveres etter lovgivning

### Oppbevaringstid
- Aktive brukerdata: Så lenge brukeren er aktiv
- Logger: 2 år (i henhold til norsk lovgivning)
- Arkiverte data: Slettes automatisk etter oppbevaringstid

## Datadeling

### Tredjeparter
- Data deles ikke med tredjeparter uten samtykke
- Firebase (Google) fungerer som databehandler
- Firebase er GDPR-compliant og sertifisert

### Intern deling
- Foreldre kan kun se egne barn
- Ansatte kan se alle barn (nødvendig for drift)
- Administratorer har full tilgang

## Sikkerhetstiltak

### Tekniske tiltak
- Kryptering av data i transit og at rest
- Rollebasert tilgangskontroll
- Automatisk logging av alle handlinger
- Regelmessig sikkerhetsgjennomgang

### Organisatoriske tiltak
- Tilstede personer med tilgang til data
- Tilsyn med databehandling
- Regelmessig opplæring i personvern

## Kontaktinformasjon

For spørsmål om personvern eller databehandling:
- Kontakt barnehagen direkte
- E-post: [barnehage e-post]
- Telefon: [barnehage telefon]

## Klageadgang

Hvis du mener databehandlingen er i strid med GDPR, kan du klage til:
- Datatilsynet: https://www.datatilsynet.no

