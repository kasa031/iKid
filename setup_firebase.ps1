# Script for å hjelpe med Firebase-oppsett

Write-Host "=== Firebase Setup Guide ===" -ForegroundColor Cyan
Write-Host ""

# Sjekk om config.ts eksisterer og har konfigurasjon
$configPath = "src\services\firebase\config.ts"
if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
    if ($configContent -match "YOUR_API_KEY" -or $configContent -match "YOUR_PROJECT_ID") {
        Write-Host "⚠️  Firebase config.ts mangler konfigurasjon!" -ForegroundColor Yellow
        Write-Host ""
    } else {
        Write-Host "✅ Firebase config.ts er konfigurert" -ForegroundColor Green
        Write-Host ""
    }
} else {
    Write-Host "❌ Firebase config.ts finnes ikke!" -ForegroundColor Red
    Write-Host ""
}

# Sjekk om google-services.json eksisterer
$googleServicesPath = "android\app\google-services.json"
if (Test-Path $googleServicesPath) {
    Write-Host "✅ google-services.json finnes" -ForegroundColor Green
} else {
    Write-Host "⚠️  google-services.json mangler!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "For å laste ned google-services.json:" -ForegroundColor Cyan
    Write-Host "1. Gå til https://console.firebase.google.com/" -ForegroundColor White
    Write-Host "2. Velg prosjektet ditt (ikid-791bd)" -ForegroundColor White
    Write-Host "3. Klikk på ⚙️ (Settings) → Project settings" -ForegroundColor White
    Write-Host "4. Scroll ned til 'Your apps'" -ForegroundColor White
    Write-Host "5. Klikk på Android-ikonet (eller 'Add app' → Android)" -ForegroundColor White
    Write-Host "6. Package name: com.ikid" -ForegroundColor White
    Write-Host "7. Last ned google-services.json" -ForegroundColor White
    Write-Host "8. Kopier filen til: android\app\google-services.json" -ForegroundColor White
    Write-Host ""
}

Write-Host "=== Neste Steg ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Sjekk at Firebase Authentication er aktivert:" -ForegroundColor Yellow
Write-Host "   - Gå til Firebase Console → Authentication" -ForegroundColor White
Write-Host "   - Aktiver 'Email/Password' sign-in method" -ForegroundColor White
Write-Host ""
Write-Host "2. Sjekk at Firestore Database er opprettet:" -ForegroundColor Yellow
Write-Host "   - Gå til Firebase Console → Firestore Database" -ForegroundColor White
Write-Host "   - Opprett database hvis den ikke eksisterer" -ForegroundColor White
Write-Host "   - VIKTIG: Velg EØS-region (europe-north2 eller lignende)" -ForegroundColor White
Write-Host ""
Write-Host "3. Sett opp Security Rules:" -ForegroundColor Yellow
Write-Host "   - Se docs/SECURITY.md for regler" -ForegroundColor White
Write-Host ""

