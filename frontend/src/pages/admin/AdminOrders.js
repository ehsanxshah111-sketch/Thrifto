import { useEffect, useState } from 'react';
import api from '../../api/api';
import { formatPKR } from '../../utils/format';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

// Admin-only: this page calls GET /api/orders, which the backend protects
// with (protect, adminOnly). A customer token gets a 403 here.
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const load = () => api.get('/orders').then(({ data }) => setOrders(data));
  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h1>Orders</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>Every customer order across the store.</p>
      <table>
        <thead>
          <tr>
            <th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Placed</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o._id.slice(-8).toUpperCase()}</td>
              <td>{o.user?.name}<br /><span style={{ color: '#888', fontSize: 11 }}>{o.user?.email}</span></td>
              <td>{o.items.map((i) => `${i.name} (x${i.qty})`).join(', ')}</td>
              <td>{formatPKR(o.totalAmount)}</td>
              <td>
                <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
