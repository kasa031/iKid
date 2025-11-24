import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Use '/' for local development (dev server), '/ikid/' for production build (GitHub Pages)
  const base = command === 'serve' ? '/' : '/ikid/';

  // Only enable PWA in production builds
  const isDev = command === 'serve';

  return {
  plugins: [
    react(),
    // Only register PWA plugin in production
    ...(isDev ? [] : [VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.svg', 'icon-512.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'iKid - Eventyrhagen Barnehage',
        short_name: 'iKid',
        description: 'Digital inn- og utkryssing for barnehager',
        theme_color: '#2563EB',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
        ],
        shortcuts: [
          {
            name: 'Kryss inn',
            short_name: 'Inn',
            description: 'Kryss inn et barn',
            url: '/checkin',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
          {
            name: 'Kryss ut',
            short_name: 'Ut',
            description: 'Kryss ut et barn',
            url: '/checkout',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Use correct base path for precaching
        navigateFallback: base === '/' ? '/' : '/ikid/',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // Disable PWA service worker in dev mode to avoid Workbox conflicts
        type: 'module',
        navigateFallback: base,
        disableDevLogs: true,
      },
      // Completely disable service worker registration in dev mode
      injectRegister: isDev ? false : 'auto',
      // Disable all PWA features in dev mode
      strategies: isDev ? 'injectManifest' : 'generateSW',
      injectManifest: isDev ? undefined : undefined,
    })]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@screens': path.resolve(__dirname, './src/screens'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@i18n': path.resolve(__dirname, './src/i18n'),
    },
  },
  build: {
    rollupOptions: {
      external: ['react-native'],
      output: {
        manualChunks(id) {
          // Split vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('i18next')) {
              return 'i18n-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit since we're using code splitting
  },
    server: {
      port: 3000,
      open: true,
    },
    base: base,
  };
});
