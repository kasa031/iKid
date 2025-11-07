# Test Appen Nå!

## ✅ Firebase er konfigurert!

Nå kan du teste appen.

## Steg-for-steg testing:

### Steg 1: Metro Bundler kjører
Metro bundler skal nå kjøre i bakgrunnen. Du vil se noe som:
```
Metro waiting on exp://...
```

### Steg 2: Start appen (i ny terminal)

Åpne en **ny terminal** (la Metro bundler kjøre i den første) og kjør:

**For Android:**
```bash
npm run android
```

**For iOS (kun macOS):**
```bash
npm run ios
```

**Merk:** For Android må du ha:
- Android Studio installert
- En Android emulator kjørende, ELLER
- En fysisk Android-enhet koblet til med USB-debugging aktivert

### Steg 3: Første test

Når appen starter:

1. **Du skal se innloggingsskjermen**
2. **Trykk "Registrer"**
3. **Fyll ut skjemaet:**
   - E-post: `test@test.com` (eller hva du vil)
   - Passord: `Test1234!` (minst 6 tegn)
   - Navn: `Test Bruker`
   - Telefon: `12345678` (valgfritt)
   - Rolle: Velg **"Foreldre"**
4. **Trykk "Registrer"**
5. **Du skal nå være logget inn og se hovedskjermen!** 🎉

### Steg 4: Verifiser i Firebase

1. Gå til Firebase Console → **Authentication**
2. Du skal se din testbruker i listen
3. Gå til **Firestore Database**
4. Du skal se en `users` collection med din bruker

## 🆘 Hvis noe går galt:

### "Firebase not configured"
- Sjekk at `config.ts` har riktige verdier
- Sjekk at filen er lagret

### "Network request failed"
- Sjekk internettforbindelsen
- Sjekk at Firestore er aktivert
- Sjekk at du valgte "Start in test mode"

### Appen starter ikke
- Sjekk at Metro bundler kjører
- For Android: Sjekk at emulator/enhet er klar
- Prøv: `npm run clean` og reinstaller

### "Cannot connect to Metro"
- Sjekk at Metro bundler kjører (`npm start`)
- Prøv å restarte Metro bundler

## 📋 Test-checkliste:

- [ ] Metro bundler kjører
- [ ] Appen starter på emulator/enhet
- [ ] Innloggingsskjermen vises
- [ ] Registrering fungerer
- [ ] Bruker vises i Firebase Console
- [ ] Innlogging fungerer
- [ ] Hovedskjermen vises

## ✅ Neste steg etter første test:

Når første test fungerer, følg `TESTING_GUIDE.md` for systematisk testing av alle funksjoner!

