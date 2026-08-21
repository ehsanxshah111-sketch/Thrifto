import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__badges">
      <span>Free Delivery, Prepaid</span>
      <span>Easy Exchange</span>
      <span>Secure Checkout</span>
    </div>

    <div className="container site-footer__grid">
      <div className="site-footer__col">
        <h4>Thrifto</h4>
        <p className="site-footer__blurb">
          Premium footwear, distilled to black and white. Considered shapes, honest materials.
        </p>
      </div>
      <div className="site-footer__col">
        <h4>Quick Links</h4>
        <Link to="/shop">Shop</Link>
        <Link to="/shop?category=Sneakers">Sneakers</Link>
        <Link to="/shop?category=Running">Running</Link>
        <Link to="/shop?category=Formal">Formal</Link>
      </div>
      <div className="site-footer__col">
        <h4>Customer Care</h4>
        <Link to="/contact">Contact Us</Link>
        <Link to="/my-orders">My Orders</Link>
        <Link to="/login">Sign In</Link>
      </div>
      <div className="site-footer__col">
        <h4>About</h4>
        <Link to="/">Our Story</Link>
        <Link to="/contact">Get in Touch</Link>
      </div>
    </div>

    <div className="site-footer__bottom">
      <p>THRIFTO — PREMIUM FOOTWEAR, IN BLACK &amp; WHITE.</p>
      <p>&copy; {new Date().getFullYear()} Thrifto. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
