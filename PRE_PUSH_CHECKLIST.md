# ✅ PRE-PUSH CHECKLIST - MÅ GJØRES FØR HVER PUSH

## 🔒 KRITISK SIKKERHETSSJEKK

### Før hver commit:
```bash
npm run check-secrets-staged
```
**Dette kjører automatisk via pre-commit hook, men sjekk manuelt også!**

### Før hver push:
```bash
npm run check-secrets all
```
**Dette kjører automatisk via pre-push hook, men sjekk manuelt også!**

## 📋 Full Checklist

### 1. Sikkerhetssjekk
- [ ] Kjør `npm run check-secrets all`
- [ ] Verifiser at ingen secrets ble funnet
- [ ] Hvis secrets funnes: **STOPP** og fjern dem først

### 2. Verifiser .gitignore
- [ ] Sjekk at `config.ts` er i `.gitignore`
- [ ] Sjekk at `.env.local` er i `.gitignore`
- [ ] Sjekk at alle `.env*` filer er i `.gitignore`

### 3. Sjekk hva som skal pushes
```bash
git status
```
- [ ] `config.ts` skal **IKKE** vises
- [ ] `.env.local` skal **IKKE** vises
- [ ] Ingen filer med hardkodede API-nøkler

### 4. Test lokalt
- [ ] `npm run build` fungerer
- [ ] `npm run dev` fungerer
- [ ] Appen fungerer lokalt med `.env.local`

### 5. Når alt er OK
- [ ] Commit endringene
- [ ] Push til GitHub

## 🚨 Hvis sikkerhetssjekken feiler

1. **STOPP umiddelbart** - Ikke commit eller push
2. Se hvilke filer som inneholder secrets
3. Fjern secrets fra filene
4. Bruk miljøvariabler i stedet
5. Kjør sjekken igjen: `npm run check-secrets all`
6. Når sjekken passerer, kan du pushe

## 📝 Hva sjekkes?

- Google API Keys (AIza...)
- Firebase API Keys
- Stripe Keys
- AWS Keys
- GitHub Tokens
- Private Keys
- Hardkodede passord
- Secrets i forbudte filer

## ⚠️ VIKTIG

**Disse reglene må følges SLAVISK.**
**Bedre å være forsiktig enn å eksponere secrets!**

