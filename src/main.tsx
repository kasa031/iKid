/**
 * Entry point for the web application
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';

// Error boundary for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Verify root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found!');
}

try {
  ReactDOM.createRoot(rootElement).render(
    <App />
  );
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Error loading application</h1>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      <p>Check the browser console for more details.</p>
    </div>
  `;
}
