/**
 * PWA Install Prompt Component
 * Shows install button when PWA can be installed
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common/Button';
import { Spacing, FontSizes } from '../../constants/sizes';
import './InstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app was just installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;

    // User choice logged for analytics (optional)
    if (outcome === 'accepted') {
      // User installed the app
    } else {
      // User dismissed the prompt
    }

    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or if user recently dismissed
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  // Check if user recently dismissed (within 7 days)
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime) {
    const daysSinceDismissal = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissal < 7) {
      return null;
    }
  }

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: Spacing.md,
    left: '50%',
    transform: 'translateX(-50%)',
    maxWidth: 500,
    width: '90%',
    backgroundColor: colors.card || colors.background,
    border: `1px solid ${colors.border || colors.primary}`,
    borderRadius: 12,
    padding: Spacing.md,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.sm,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: FontSizes.lg,
    fontWeight: 700,
    margin: 0,
    color: colors.text,
  };

  const textStyle: React.CSSProperties = {
    fontSize: FontSizes.md,
    margin: 0,
    color: colors.textSecondary,
  };

  return (
    <div style={containerStyle} className="install-prompt">
      <div>
        <h3 style={titleStyle}>
          {t('pwa.installTitle') || 'Installer iKid'}
        </h3>
        <p style={textStyle}>
          {t('pwa.installDescription') || 'Legg til på hjemmeskjermen for rask tilgang'}
        </p>
      </div>
      <div style={{ display: 'flex', gap: Spacing.sm }}>
        <Button
          title={t('pwa.install') || 'Installer'}
          onPress={handleInstallClick}
          variant="primary"
          style={{ flex: 1 }}
        />
        <Button
          title={t('common.cancel') || 'Avbryt'}
          onPress={handleDismiss}
          variant="outline"
          style={{ flex: 1 }}
        />
      </div>
    </div>
  );
};

