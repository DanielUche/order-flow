import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_ANALYTICS_URL ?? 'http://localhost:8787';

export default function AnalyticsApp() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${API_URL}/analytics/orders-per-day`)
      .then((r) => r.json())
      .then(setRows);
  }, []);
  return (
    <div style={{ padding: 16 }}>
      <h2>Analytics (last 7 days)</h2>
      <ul>
        {rows.map((r, i) => (
          <li key={i}>
            {r.Data?.[0]?.VarCharValue}: {r.Data?.[1]?.VarCharValue}
          </li>
        ))}
      </ul>
    </div>
  );
}
