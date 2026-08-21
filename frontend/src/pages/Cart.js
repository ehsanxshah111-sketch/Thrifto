import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, removeFromCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 760 }}>
      <h1 className="section-title" style={{ textAlign: 'left' }}>Your Cart</h1>

      {cart.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/shop">Continue shopping</Link>.
        </p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-row" key={`${item.product}-${item.size}`}>
              <img src={item.image} alt={item.name} />
              <div className="cart-row__info">
                <strong>{item.name}</strong>
                <p style={{ margin: '4px 0', fontSize: 13, color: '#666' }}>
                  Size US {item.size} &middot; Qty {item.qty}
                </p>
              </div>
              <div>{formatPKR(item.price * item.qty)}</div>
              <button
                className="btn btn-danger"
                style={{ padding: '6px 12px', fontSize: 11 }}
                onClick={() => removeFromCart(item.product, item.size)}
              >
                Remove
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '28px 0', fontSize: 20, fontFamily: 'Georgia, serif' }}>
            <span>Total</span>
            <span>{formatPKR(totalAmount)}</span>
          </div>

          <button className="btn btn-primary btn-block" onClick={handleCheckout}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
