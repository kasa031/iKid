# PWA Installasjonsguide - iKid

## Hvordan legge til på hjemskjermen

### Windows PC - Brave Browser

1. **Åpne appen i Brave**
   - Gå til `http://localhost:3000` (under utvikling) eller din deployede URL

2. **Installer PWA**
   - Klikk på **meny-ikonet** (tre streker) øverst til høyre
   - Velg **"Install iKid"** eller **"Legg til på skrivebordet"**
   - Alternativt: Se etter installasjonsikonet i adresselinjen (pluss-ikon eller installasjonsikon)

3. **Bekreft installasjon**
   - En dialog vil dukke opp
   - Klikk **"Installer"** eller **"Legg til"**

4. **Åpne appen**
   - Appen vil nå vises som en egen app på skrivebordet
   - Du kan åpne den direkte uten å åpne nettleseren først

### iPhone - Brave Browser (og Safari)

1. **Åpne appen i Brave/Safari**
   - Gå til din deployede URL

2. **Legg til på hjemskjermen**
   - Trykk på **deling-ikonet** (firkant med pil oppover) nederst i skjermen
   - Scroll ned og velg **"Legg til på Hjem-skjerm"** eller **"Add to Home Screen"**

3. **Tilpass navn (valgfritt)**
   - Du kan endre navnet før du legger til
   - Standard navn er "iKid"

4. **Bekreft**
   - Trykk **"Legg til"** øverst til høyre

5. **Åpne appen**
   - Appen vil nå vises som et ikon på hjemskjermen
   - Når du åpner den, vil den fungere som en standalone app uten nettleser-UI

### Android - Brave Browser (og Chrome)

1. **Åpne appen i nettleseren**
   - Gå til din deployede URL

2. **Installer PWA**
   - En banner kan dukke opp automatisk: "Legg til på hjem-skjerm"
   - Eller: Trykk på **meny-ikonet** (tre prikker) → **"Legg til på hjem-skjerm"** eller **"Install app"**

3. **Bekreft**
   - Trykk **"Legg til"** eller **"Install"**

4. **Åpne appen**
   - Appen vil nå vises i app-listen
   - Du kan åpne den som en vanlig app

## Funksjoner som PWA

Når appen er installert som PWA, får du:

- ✅ **Standalone modus**: Åpnes uten nettleser-UI
- ✅ **Offline-funksjonalitet**: Grunnleggende funksjoner fungerer offline
- ✅ **Rask tilgang**: Direkte fra hjemskjermen
- ✅ **App-lignende opplevelse**: Føles som en native app
- ✅ **Automatiske oppdateringer**: Oppdateres automatisk når ny versjon er tilgjengelig

## Krav for PWA-installasjon

- Appen må kjøres over **HTTPS** (eller localhost for utvikling)
- Manifest-filen må være tilgjengelig
- Service Worker må være aktivert
- Ikoner må være tilgjengelige

## Feilsøking

### Installasjonsknappen vises ikke

1. Sjekk at du kjører appen over HTTPS (eller localhost)
2. Sjekk at manifest.json er tilgjengelig: `http://localhost:3000/manifest.json`
3. Sjekk nettleserens konsoll for feil
4. Prøv å bygge appen først: `npm run build`

### Appen fungerer ikke offline

- Service Worker må være aktivert
- Kjør `npm run build` for å generere service worker
- Sjekk at Workbox er konfigurert riktig i `vite.config.ts`

## Deploying for produksjon

For å deploye appen slik at den kan installeres:

1. **Bygg appen**
   ```bash
   npm run build
   ```

2. **Deploy til hosting**
   - Firebase Hosting
   - Netlify
   - Vercel
   - GitHub Pages
   - Eller annen statisk hosting

3. **Sørg for HTTPS**
   - Alle PWA-krav krever HTTPS (unntatt localhost)

4. **Test installasjon**
   - Åpne den deployede URL-en
   - Følg installasjonsinstruksjonene over

