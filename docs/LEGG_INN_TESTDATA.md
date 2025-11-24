# Legge inn testdata i appen

## Metode 1: Bruk HTML-filen (Enklest)

1. **Åpne filen:**
   - Gå til `http://localhost:3000/addTestData.html` i nettleseren
   - Eller åpne filen `public/addTestData.html` direkte

2. **Klikk på "Legg inn testdata":**
   - Skriptet legger automatisk inn alle dataene
   - Du vil se fremdrift i output-vinduet

3. **Vent til det er ferdig:**
   - Når det står "✅ Ferdig!", er alt lagt inn

## Metode 2: Bruk Console-skriptet

1. **Åpne appen i nettleseren:**
   - Gå til `http://localhost:3000`
   - Logg inn som admin eller staff

2. **Åpne Developer Console:**
   - Trykk `F12` eller høyreklikk → "Inspect"
   - Gå til "Console" tab

3. **Kopier og lim inn skriptet:**
   - Åpne filen `scripts/addTestDataConsole.js`
   - Kopier hele innholdet
   - Lim inn i Console
   - Trykk Enter

4. **Vent til det er ferdig:**
   - Du vil se meldinger om hvert barn og forelder som legges inn

## Hva blir lagt inn?

- **12 barn** med norske navn, fødselsdatoer, allergier og notater
- **24 foreldre** (12 par) knyttet til barna
- Alle foreldre får passord: `Test1234!`

## Testdata som legges inn

### Barn:
1. Emma Hansen (2019-03-15) - Allergi: Nøtter
2. Noah Johansen (2020-05-22)
3. Olivia Olsen (2019-08-10) - Allergi: Melk
4. Liam Larsen (2020-11-03)
5. Sofia Andersen (2019-01-20) - Allergi: Egg
6. Erik Pedersen (2020-07-14)
7. Maja Nilsen (2019-12-05) - Allergi: Nøtter, melk
8. Oskar Kristiansen (2020-02-28)
9. Nora Jensen (2019-09-18)
10. Lucas Karlsen (2020-04-09) - Allergi: Gluten
11. Aurora Solberg (2019-06-25)
12. Isak Berg (2020-10-12) - Allergi: Melk

### Foreldre (par):
- Kari & Ole Hansen (Emma) - kari.hansen@example.com / ole.hansen@example.com
- Anne & Per Johansen (Noah) - anne.johansen@example.com / per.johansen@example.com
- Lisa & Tom Olsen (Olivia) - lisa.olsen@example.com / tom.olsen@example.com
- Maria & Jan Larsen (Liam) - maria.larsen@example.com / jan.larsen@example.com
- Inger & Bjørn Andersen (Sofia) - inger.andersen@example.com / bjorn.andersen@example.com
- Liv & Stein Pedersen (Erik) - liv.pedersen@example.com / stein.pedersen@example.com
- Gunn & Lars Nilsen (Maja) - gunn.nilsen@example.com / lars.nilsen@example.com
- Tone & Geir Kristiansen (Oskar) - tone.kristiansen@example.com / geir.kristiansen@example.com
- Camilla & Anders Jensen (Nora) - camilla.jensen@example.com / anders.jensen@example.com
- Hilde & Thomas Karlsen (Lucas) - hilde.karlsen@example.com / thomas.karlsen@example.com
- Martine & Kristian Solberg (Aurora) - martine.solberg@example.com / kristian.solberg@example.com
- Silje & Martin Berg (Isak) - silje.berg@example.com / martin.berg@example.com

**Alle foreldre har passord:** `Test1234!`

## Test innlogging

Etter at dataene er lagt inn, kan du teste å logge inn med:
- **E-post:** kari.hansen@example.com
- **Passord:** Test1234!

Eller bruk hvilken som helst av de andre foreldrene.
