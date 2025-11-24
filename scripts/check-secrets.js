#!/usr/bin/env node

/**
 * Security Check Script
 * Checks for API keys and secrets before commit/push
 *
 * This script MUST be run before every commit and push
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Patterns that indicate secrets/API keys
const SECRET_PATTERNS = [
  /AIza[0-9A-Za-z_-]{35}/, // Google API Key
  /sk_live_[0-9a-zA-Z]{24,}/, // Stripe Live Key
  /sk_test_[0-9a-zA-Z]{24,}/, // Stripe Test Key
  /AKIA[0-9A-Z]{16}/, // AWS Access Key
  /xox[baprs]-[0-9a-zA-Z-]{10,48}/, // Slack Token
  /ghp_[0-9a-zA-Z]{36}/, // GitHub Personal Access Token
  /gho_[0-9a-zA-Z]{36}/, // GitHub OAuth Token
  /ghu_[0-9a-zA-Z]{36}/, // GitHub User-to-Server Token
  /ghs_[0-9a-zA-Z]{36}/, // GitHub Server-to-Server Token
  /ghr_[0-9a-zA-Z]{36}/, // GitHub Refresh Token
  /-----BEGIN (RSA |DSA |EC |OPENSSH )?PRIVATE KEY-----/, // Private Key
  /api[_-]?key[=:]\s*['"]?[0-9a-zA-Z]{20,}/i, // api_key= or apiKey:
  /secret[=:]\s*['"]?[0-9a-zA-Z]{20,}/i, // secret= or secret:
  /password[=:]\s*['"]?[0-9a-zA-Z]{10,}/i, // password= (but allow short ones)
  /firebase.*api[_-]?key[=:]\s*['"]?[0-9a-zA-Z]{20,}/i, // Firebase API key
];

// Patterns that look like secrets but are actually safe (hash values, etc.)
const SAFE_PATTERNS = [
  /sha512-[0-9a-zA-Z+/=]{88}/, // SHA512 hash (package-lock.json)
  /sha1-[0-9a-zA-Z+/=]{27}/, // SHA1 hash
  /sha256-[0-9a-zA-Z+/=]{43}/, // SHA256 hash
  /integrity.*sha512/i, // npm integrity hashes
];

// Files that are allowed to contain these patterns (example files, etc.)
const ALLOWED_FILES = [
  'config.example.ts',
  '.env.example',
  'README.md',
  'SETUP_FOR_GITHUB.md',
  'GITHUB_PAGES_SETUP.md',
  'OAUTH_CONSENT_SCREEN.md',
  'SECURITY_RULES.md',
  'scripts/check-secrets.js', // This file itself
  'package-lock.json', // Contains SHA hashes, not secrets
  'yarn.lock', // Contains SHA hashes, not secrets
  'pnpm-lock.yaml', // Contains SHA hashes, not secrets
];

// Files that should NEVER contain secrets
const FORBIDDEN_FILES = [
  'src/services/firebase/config.ts',
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
];

function checkFile(filePath, content) {
  const issues = [];
  const fileName = filePath.replace(rootDir + '/', '');

  // Check if file is in forbidden list
  if (FORBIDDEN_FILES.some(forbidden => filePath.includes(forbidden))) {
    SECRET_PATTERNS.forEach((pattern, index) => {
      if (pattern.test(content)) {
        issues.push({
          file: fileName,
          line: 'UNKNOWN',
          pattern: `Pattern ${index + 1}`,
          severity: 'CRITICAL',
          message: `FORBIDDEN FILE contains potential secret: ${fileName}`,
        });
      }
    });
  }

  // Check for secrets in all files (except allowed ones)
  if (!ALLOWED_FILES.some(allowed => fileName.includes(allowed))) {
    const lines = content.split('\n');
    lines.forEach((line, lineNumber) => {
      // Skip if line contains safe patterns (hashes, etc.)
      const isSafe = SAFE_PATTERNS.some(safePattern => safePattern.test(line));
      if (isSafe) return;

      SECRET_PATTERNS.forEach((pattern, patternIndex) => {
        if (pattern.test(line)) {
          // Check if it's a placeholder or example
          if (
            !line.includes('YOUR_') &&
            !line.includes('EXAMPLE') &&
            !line.includes('PLACEHOLDER') &&
            !line.includes('din-') &&
            !line.includes('ditt-') &&
            !line.includes('DIN_') &&
            !line.includes('DITT_') &&
            !line.includes('sha512') && // Skip hash values
            !line.includes('integrity')
          ) {
            // Skip npm integrity
            issues.push({
              file: fileName,
              line: lineNumber + 1,
              pattern: `Pattern ${patternIndex + 1}`,
              severity: 'HIGH',
              message: `Potential secret found in ${fileName}:${lineNumber + 1}`,
              snippet: line.trim().substring(0, 80),
            });
          }
        }
      });
    });
  }

  return issues;
}

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
      cwd: rootDir,
    });
    return output.split('\n').filter(Boolean);
  } catch (error) {
    return [];
  }
}

function getAllTrackedFiles() {
  try {
    const output = execSync('git ls-files', {
      encoding: 'utf-8',
      cwd: rootDir,
    });
    return output.split('\n').filter(Boolean);
  } catch (error) {
    return [];
  }
}

function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'staged'; // 'staged' or 'all'

  console.log('🔒 Security Check: Scanning for API keys and secrets...\n');

  let filesToCheck = [];
  if (mode === 'staged') {
    filesToCheck = getStagedFiles();
    console.log(`📋 Checking ${filesToCheck.length} staged files...\n`);
  } else {
    filesToCheck = getAllTrackedFiles();
    console.log(`📋 Checking ${filesToCheck.length} tracked files...\n`);
  }

  const allIssues = [];

  filesToCheck.forEach(file => {
    const filePath = join(rootDir, file);
    if (existsSync(filePath)) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const issues = checkFile(filePath, content);
        allIssues.push(...issues);
      } catch (error) {
        // Skip binary files or files we can't read
      }
    }
  });

  if (allIssues.length > 0) {
    console.error('❌ SECURITY VIOLATION DETECTED!\n');
    console.error(
      'The following files contain potential API keys or secrets:\n'
    );

    allIssues.forEach(issue => {
      console.error(`  ${issue.severity}: ${issue.file}:${issue.line}`);
      if (issue.snippet) {
        console.error(`    Snippet: ${issue.snippet}...`);
      }
      console.error(`    ${issue.message}\n`);
    });

    console.error('\n🚫 COMMIT/PUSH BLOCKED');
    console.error('\nActions required:');
    console.error('  1. Remove all API keys and secrets from the files above');
    console.error('  2. Use environment variables (.env.local) instead');
    console.error('  3. Ensure .env.local is in .gitignore');
    console.error('  4. Run this check again: npm run check-secrets\n');

    process.exit(1);
  } else {
    console.log('✅ No secrets detected. Safe to proceed.\n');
    process.exit(0);
  }
}

main();
