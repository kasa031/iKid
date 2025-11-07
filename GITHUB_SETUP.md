# GitHub Setup Guide

Guide for å sette opp prosjektet med GitHub.

## Steg 1: Sjekk at du er i riktig mappe

```bash
cd C:\Users\Karina\Desktop\Egenlagde_programmer\iKid
```

## Steg 2: Initialiser Git (hvis ikke allerede gjort)

```bash
git init
```

## Steg 3: Legg til remote repository

```bash
git remote add origin https://github.com/kasa031/iKid.git
```

Hvis remote allerede eksisterer, bruk:
```bash
git remote set-url origin https://github.com/kasa031/iKid.git
```

## Steg 4: Sjekk .gitignore

Sjekk at `src/services/firebase/config.ts` er i `.gitignore` (den skal være det).

Dette sikrer at dine Firebase-credentials ikke blir committet til GitHub.

## Steg 5: Legg til alle filer

```bash
git add .
```

## Steg 6: Commit endringene

```bash
git commit -m "Initial commit - iKid app ready for testing"
```

## Steg 7: Push til GitHub

```bash
git push -u origin main
```

Hvis du får feil om at `main` ikke eksisterer, prøv:
```bash
git push -u origin master
```

Eller opprett `main` branch:
```bash
git branch -M main
git push -u origin main
```

## Viktig: Firebase Config

**ALDRIG** commit `src/services/firebase/config.ts` med ekte Firebase-credentials!

Filen er i `.gitignore`, men dobbeltsjekk før du pusher:

```bash
# Sjekk hva som skal committes
git status

# Hvis config.ts vises, fjern den:
git reset HEAD src/services/firebase/config.ts
```

## Fremtidige commits

Når du gjør endringer:

```bash
# Se hva som er endret
git status

# Legg til endringene
git add .

# Commit
git commit -m "Beskrivelse av endringene"

# Push
git push
```

## Hjelp

- Se `QUICK_START.md` for Firebase-oppsett
- Se `TESTING_GUIDE.md` for testing

