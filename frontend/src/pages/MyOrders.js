import { useEffect, useState } from 'react';
import api from '../api/api';
import { formatPKR } from '../utils/format';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/myorders').then(({ data }) => setOrders(data));
  }, []);

  return (
    <div className="container" style={{ padding: '48px 24px' }}>
      <h1 className="section-title" style={{ textAlign: 'left' }}>My Orders</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id.slice(-8).toUpperCase()}</td>
                <td>{o.items.map((i) => i.name).join(', ')}</td>
                <td>{formatPKR(o.totalAmount)}</td>
                <td><span className={`pill pill-${o.status.toLowerCase()}`}>{o.status}</span></td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
