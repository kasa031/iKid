# GitHub Actions Workflows

## YAML Linter Warnings

The YAML linter may show warnings about "Context access might be invalid" for GitHub Secrets (e.g., `VITE_FIREBASE_API_KEY`). 

**These warnings are expected and can be safely ignored.** They occur because the linter cannot verify that secrets exist in GitHub repository settings, but the workflow will function correctly as long as the secrets are properly configured in GitHub.

### To verify secrets are configured:

1. Go to: https://github.com/kasa031/iKid/settings/secrets/actions
2. Ensure all required secrets are present:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

If all secrets are present, the workflow will work correctly despite the linter warnings.

