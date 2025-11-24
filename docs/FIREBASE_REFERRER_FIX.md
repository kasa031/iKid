# Fikse Firebase Referrer Blocking Feil

## 🔴 Problemet
Du får feilmeldingen: "Firebase referrer blocking error" når du prøver å registrere deg.

## ✅ Løsning - To steg

### Steg 1: Legg til localhost i Firebase Console

**✅ DETTE ER ALLEREDE GJORT!**

- `localhost` er allerede lagt til i Firebase Console
- `127.0.0.1` er allerede lagt til i Firebase Console
- Ingen endringer nødvendig her

**Se `docs/FIREBASE_SETUP_STATUS.md` for status.**

### Steg 2: Legg til localhost i Google Cloud Console

1. **Gå til Google Cloud Console:**
   - Åpne https://console.cloud.google.com/
   - Velg samme prosjekt som Firebase-prosjektet ditt

2. **Gå til Credentials:**
   - Klikk på "APIs & Services" i venstre meny
   - Klikk på "Credentials"

3. **Finn Browser Key:**
   - Finn "Browser key (auto created by Firebase)" i listen
   - Klikk på den for å åpne innstillingene

4. **Legg til HTTP referrers:**
   - Under "Application restrictions"
   - Velg "HTTP referrers (web sites)"
   - Klikk "Add an item"
   - Legg til følgende (en om gangen):
     - `localhost:*`
     - `127.0.0.1:*`
     - `http://localhost:3000/*`
     - `http://127.0.0.1:3000/*`
   - Klikk "Save" nederst på siden

5. **Vent noen sekunder:**
   - Endringene kan ta 1-2 minutter å tre i kraft

## 🧪 Test løsningen

1. **Lukk og åpne nettleseren på nytt**
2. **Gå til http://localhost:3000**
3. **Prøv å registrere deg igjen**

## ⚠️ Viktig

- Hvis du fortsatt får feil, vent 2-3 minutter og prøv igjen
- Sørg for at du har lagt til **begge** stedene (Firebase Console OG Google Cloud Console)
- Hvis du bruker en annen port enn 3000, legg til den også (f.eks. `localhost:5173` for Vite)

## 📸 Visuell guide

### Firebase Console - Authorized domains:
```
Authentication → Settings → Authorized domains
┌─────────────────────────────┐
│ Authorized domains          │
├─────────────────────────────┤
│ ✅ your-project.firebaseapp.com │
│ ✅ localhost                │  ← Legg til denne
└─────────────────────────────┘
```

### Google Cloud Console - HTTP referrers:
```
APIs & Services → Credentials → Browser key
┌─────────────────────────────┐
│ Application restrictions    │
│ ○ None                      │
│ ● HTTP referrers (web sites)│ ← Velg denne
├─────────────────────────────┤
│ Referrers:                  │
│ • localhost:*               │  ← Legg til disse
│ • 127.0.0.1:*               │
│ • http://localhost:3000/*   │
│ • http://127.0.0.1:3000/*   │
└─────────────────────────────┘
```

## 🆘 Hvis det fortsatt ikke fungerer

1. **Sjekk at du er logget inn på riktig Google-konto** i begge konsollene
2. **Sjekk at du har valgt riktig prosjekt** i begge konsollene
3. **Prøv å hard refresh nettleseren:** Ctrl+Shift+R (Windows) eller Cmd+Shift+R (Mac)
4. **Sjekk at Firebase-prosjektet ditt faktisk er knyttet til Google Cloud-prosjektet**

## 📝 Notater

- Dette er en sikkerhetsinnstilling i Firebase/Google Cloud
- Den forhindrer at API-nøkkelen brukes fra uautorisert domener
- For produksjon må du også legge til ditt faktiske domene (f.eks. `yourdomain.com`)

