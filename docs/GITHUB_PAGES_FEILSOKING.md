# 🔧 GitHub Pages Feilsøking

## ⚠️ Viktig: Sjekk at GitHub Pages er aktivert riktig!

### Steg 1: Aktiver GitHub Pages med "GitHub Actions"

1. Gå til: https://github.com/kasa031/iKid/settings/pages

2. Under **"Source"**, sjekk at du har valgt:
   - ✅ **"GitHub Actions"** (IKKE "Deploy from a branch")

3. Hvis det står "Deploy from a branch", endre det:
   - Klikk på dropdown
   - Velg **"GitHub Actions"**
   - Klikk **"Save"**

### Steg 2: Kjør workflow på nytt

1. Gå til: https://github.com/kasa031/iKid/actions
2. Klikk på "Deploy to GitHub Pages"
3. Klikk "Run workflow" → "Run workflow"
4. Vent til den er ferdig

### Steg 3: Sjekk feilmeldinger

Hvis workflowen fortsatt feiler:

1. Klikk på den feilede workflow-run
2. Scroll ned og se hvilken step som feiler
3. Klikk på den feilede step for å se feilmeldingen

Vanlige feil:
- "No deployment found" → GitHub Pages er ikke aktivert med "GitHub Actions"
- "Build failed" → Sjekk build-loggen for TypeScript/kompileringsfeil
- "Secrets missing" → Sjekk at alle secrets er lagt til

