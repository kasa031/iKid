# Firebase Authentication Setup - Hva du trenger

## ✅ Hva du MÅ aktivere

### Email/Password (PÅKREVD)
1. Gå til Firebase Console → **Authentication**
2. Klikk **"Get started"** (hvis første gang)
3. Gå til **"Sign-in method"** tab
4. Klikk på **"Email/Password"**
5. **Aktiver** "Email/Password" (slå på toggle)
6. Klikk **"Save"**

**Dette er det ENESTE du trenger for autentisering!**

## ❌ Hva du IKKE trenger

### Email link (Passwordless sign-in)
- **Ikke aktivere** - Appen bruker ikke passwordless sign-in
- Dette er for å sende magisk link på e-post i stedet for passord
- Appen bruker tradisjonell Email/Password autentisering

### Andre sign-in-metoder
- Google Sign-In: Ikke nødvendig
- Facebook Sign-In: Ikke nødvendig
- Apple Sign-In: Ikke nødvendig
- Anonym: Ikke nødvendig

## 📧 E-post til foreldre

Appen bruker **mailto:** funksjonen for å sende e-post til foreldre. Dette:
- Åpner brukerens e-postklient (Gmail, Outlook, etc.)
- Fyller ut mottaker, emne og melding
- Krever **IKKE** Firebase Email Link
- Krever **IKKE** noen ekstra Firebase-innstillinger

## ✅ Sjekkliste

- [ ] Authentication er aktivert
- [ ] Email/Password er Enabled
- [ ] Firestore Database er opprettet
- [ ] Security Rules tillater tilgang (test mode)

## 🚀 Neste steg

Når Email/Password er aktivert:
1. Test registrering: `npm run android`
2. Prøv å registrere en bruker
3. Sjekk Firebase Console → Authentication → Users

