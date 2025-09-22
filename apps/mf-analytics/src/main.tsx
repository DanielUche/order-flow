// filepath: /Users/danieluche/Desktop/order-flow/apps/mf-analytics/src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error('No root element found');
createRoot(container).render(<App />);
