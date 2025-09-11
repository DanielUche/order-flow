import React, { useEffect, useState } from 'react';
import { Button } from '@orderflow/ui';
import { Order } from '@orderflow/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

export default function OrdersApp() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/orders`)
      .then((r) => r.json())
      .then(setOrders)
      .catch(console.error);
  }, []);

  const create = async () => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: name, amount }),
    });
    const saved = await res.json();
    setOrders((prev) => [saved, ...prev]);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Orders</h2>
      <div>
        <input
          placeholder="Customer"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <Button onClick={create}>Create</Button>
      </div>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.customerName} — ${'{'}o.amount{'}'} — {o.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
