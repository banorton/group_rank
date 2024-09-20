import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Create a root for React 18
const root = ReactDOM.createRoot(rootElement);

// Render the app within React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
