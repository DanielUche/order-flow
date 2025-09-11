import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';

const OrdersApp = React.lazy(() => import('mf-orders/App'));
const AnalyticsApp = React.lazy(() => import('mf-analytics/App'));

const App = () => (
  <BrowserRouter>
    <nav style={{ display: 'flex', gap: 12, padding: 12 }}>
      <Link to="/">Home</Link>
      <Link to="/orders">Orders</Link>
      <Link to="/analytics">Analytics</Link>
    </nav>
    <React.Suspense fallback={<div>Loading…</div>}>
      <Routes>
        <Route path="/" element={<div>Welcome to OrderFlow</div>} />
        <Route path="/orders" element={<OrdersApp />} />
        <Route path="/analytics" element={<AnalyticsApp />} />
      </Routes>
    </React.Suspense>
  </BrowserRouter>
);

createRoot(document.getElementById('root')!).render(<App />);
