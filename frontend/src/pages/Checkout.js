import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/format';

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', address: '', city: '', postalCode: '', phone: '' });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      await api.post('/orders', {
        items: cart.map((i) => ({ product: i.product, size: i.size, qty: i.qty })),
        shippingAddress: form,
      });
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return <div className="container" style={{ padding: 48 }}><p>Your cart is empty.</p></div>;
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Checkout</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handlePlaceOrder}>
          <div className="field">
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>City</label>
            <input name="city" value={form.city} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Postal Code</label>
            <input name="postalCode" value={form.postalCode} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, margin: '20px 0' }}>
            Total: {formatPKR(totalAmount)}
          </p>
          <button className="btn btn-primary btn-block" disabled={placing}>
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
