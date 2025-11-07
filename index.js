/**
 * Entry point for the React Native application
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './package.json';

// Initialize i18n
import './src/i18n';

AppRegistry.registerComponent(appName, () => App);

