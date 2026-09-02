import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { initAnalytics } from './analytics.js';
import { initMixpanel } from './mixpanel.js';
import './styles.css';

initAnalytics();
initMixpanel();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
