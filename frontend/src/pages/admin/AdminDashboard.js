import { useEffect, useState } from 'react';
import api from '../../api/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, soldOut: 0, orders: 0, messages: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/orders'),
      api.get('/messages'),
    ]).then(([p, o, m]) => {
      setStats({
        products: p.data.length,
        soldOut: p.data.filter((x) => x.soldOut).length,
        orders: o.data.length,
        messages: m.data.filter((x) => !x.read).length,
      });
    });
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p style={{ color: '#666', marginBottom: 28 }}>
        Orders and customer messages are only visible here — regular customer accounts cannot reach this area.
      </p>
      <div className="stat-cards">
        <div className="stat-card"><div className="num">{stats.products}</div><div className="label">Products</div></div>
        <div className="stat-card"><div className="num">{stats.soldOut}</div><div className="label">Sold Out</div></div>
        <div className="stat-card"><div className="num">{stats.orders}</div><div className="label">Total Orders</div></div>
        <div className="stat-card"><div className="num">{stats.messages}</div><div className="label">Unread Messages</div></div>
      </div>
    </div>
  );
};

export default AdminDashboard;
