import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_ANALYTICS_URL ?? 'http://localhost:8787';

export default function AnalyticsApp() {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    fetch(`${API_URL}/analytics/orders-per-day`)
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? 0));
  }, []);
  return (
    <div style={{ padding: 16 }}>
      <h2>Analytics</h2>
      <p>Orders (last 24h): {count}</p>
    </div>
  );
}
