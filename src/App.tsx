/**
 * Main App component
 * Sets up providers and navigation
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppRouter } from './navigation/AppRouter';
import { LoadingScreen } from './components/common/LoadingScreen';
import './App.css';

const AppContent: React.FC = () => {
  const { theme, colors } = useTheme();
  const { loading } = useAuth();

  React.useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
  }, [theme, colors]);

  if (loading) {
    return <LoadingScreen />;
  }

  return <AppRouter />;
};

const App: React.FC = () => {
  // Set basename for GitHub Pages (matches repository name: iKid)
  const basename = import.meta.env.PROD ? '/iKid' : '/';
  
  return (
    <BrowserRouter basename={basename}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
