import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// The sliding strip repeats the brand name so the CSS marquee (translateX -50%)
// loops seamlessly. The circular badge next to the wordmark spins a full
// 360deg forever via CSS (see .logo-360__badge / @keyframes spin360).
const BANNER_REPEATS = 10;

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="brand-banner">
        <div className="brand-banner__track">
          {Array.from({ length: BANNER_REPEATS * 2 }).map((_, i) => (
            <span key={i}>THRIFTO — PREMIUM FOOTWEAR</span>
          ))}
        </div>
      </div>

      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="logo-360">
            <div className="logo-360__badge">T</div>
            <div className="logo-360__name">Thrifto</div>
          </Link>

          <nav className="main-nav">
            <Link to="/shop">Shop</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/cart" className="cart-pill">Cart ({totalItems})</Link>

            {!user && <Link to="/login">Login</Link>}
            {user && isAdmin && <Link to="/admin">Admin Panel</Link>}
            {user && !isAdmin && <Link to="/my-orders">My Orders</Link>}
            {user && (
              <button className="linklike" onClick={handleLogout}>
                Logout
              </button>
            )}
          </nav>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        <nav className={`mobile-nav-panel${menuOpen ? ' open' : ''}`}>
          <Link to="/shop" onClick={closeMenu}>Shop</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          <Link to="/cart" onClick={closeMenu}>Cart ({totalItems})</Link>

          {!user && <Link to="/login" onClick={closeMenu}>Login</Link>}
          {user && isAdmin && <Link to="/admin" onClick={closeMenu}>Admin Panel</Link>}
          {user && !isAdmin && <Link to="/my-orders" onClick={closeMenu}>My Orders</Link>}
          {user && (
            <button className="linklike" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
