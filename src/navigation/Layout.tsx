/**
 * Layout Component
 * Main layout with navigation tabs
 */

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole, SupportedLanguage } from '../types';
import { InstallPrompt } from '../components/pwa/InstallPrompt';
import './Layout.css';

export const Layout: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLanguageChange = async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
  };

  const navItems = [
    { path: '/', label: t('overview.title') || 'Oversikt', icon: '📊' },
    ...(user?.role === UserRole.PARENT
      ? [{ path: '/my-child', label: t('child.myChild') || 'Mitt barn', icon: '👶' }]
      : [
          { path: '/checkin', label: t('child.checkIn') || 'Kryss inn', icon: '✅' },
          { path: '/checkout', label: t('child.checkOut') || 'Kryss ut', icon: '❌' },
          { path: '/logs', label: t('logs.title') || 'Logger', icon: '📝' },
        ]),
    { path: '/calendar', label: t('calendar.title') || 'Kalender', icon: '📅' },
    { path: '/profile', label: t('settings.myProfile') || 'Min profil', icon: '👤' },
    { path: '/settings', label: t('common.settings') || 'Innstillinger', icon: '⚙️' },
  ];

  return (
    <div
      className="layout"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <header
        className="layout-header"
        style={{
          backgroundColor: colors.primary,
          borderBottomColor: colors.primary,
          color: '#FFFFFF',
          boxShadow: `0 2px 8px ${colors.primary}40`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
            <h1 className="layout-title" style={{ color: '#FFFFFF', marginBottom: '0.125rem', marginTop: 0, lineHeight: 1.2 }}>iKid</h1>
            <p style={{ fontSize: '0.75rem', margin: 0, marginTop: '0.125rem', opacity: 0.9, textAlign: 'left', lineHeight: 1.2 }}>
              Eventyrhagen Barnehage
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={() => handleLanguageChange('no')}
              style={{
                background: i18n.language === 'no' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#FFFFFF',
                transition: 'all 0.2s ease',
              }}
              title="Norsk"
            >
              🇳🇴
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              style={{
                background: i18n.language === 'en' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: '#FFFFFF',
                transition: 'all 0.2s ease',
              }}
              title="English"
            >
              🇬🇧
            </button>
          </div>
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>

      <nav
        className="layout-nav"
        style={{
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          boxShadow: `0 -2px 8px ${colors.shadow}10`,
        }}
      >
        {navItems.map(item => (
          <button
            key={item.path}
            className={`nav-item ${isActive(item.path) ? 'nav-item--active' : ''}`}
            onClick={() => navigate(item.path)}
            style={{
              color: isActive(item.path)
                ? colors.primary
                : colors.textSecondary,
              backgroundColor: isActive(item.path)
                ? `${colors.primary}10`
                : 'transparent',
              borderRadius: 8,
              transition: 'all 0.2s ease',
            }}
            aria-label={item.label}
          >
            <span className="nav-item-icon" style={{ fontSize: '1.5rem' }}>{item.icon}</span>
            <span className="nav-item-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <InstallPrompt />
    </div>
  );
};
