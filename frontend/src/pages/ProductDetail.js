import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPKR } from '../utils/format';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => {
      setProduct(data);
      if (data.sizes?.length) setSize(data.sizes[0]);
    });
  }, [id]);

  if (!product) {
    return (
      <div className="container product-detail">
        <p style={{ marginTop: 40 }}>Loading...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container product-detail">
      <p className="product-detail__breadcrumb">
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
        <span>/</span>
        {product.name}
      </p>

      <div className="product-detail__grid">
        <div className="product-detail__image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail__info">
          <p className="product-card__cat">{product.category}</p>
          <h1>{product.name}</h1>
          <div className="product-detail__divider" />
          <p className="product-detail__description">{product.description}</p>

          <p className="product-detail__price">
            {formatPKR(product.price)}
            {product.compareAtPrice > product.price && (
              <span className="product-card__was">{formatPKR(product.compareAtPrice)}</span>
            )}
          </p>

          {product.soldOut ? (
            <span className="badge-soldout" style={{ position: 'static', display: 'inline-block' }}>
              Sold Out
            </span>
          ) : (
            <>
              <div className="field">
                <label>Size</label>
                <select value={size || ''} onChange={(e) => setSize(Number(e.target.value))}>
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>US {s}</option>
                  ))}
                </select>
              </div>

              <div className="field" style={{ maxWidth: 140 }}>
                <label>Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={product.stock}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                />
              </div>

              <button className="btn btn-primary" onClick={handleAddToCart}>
                Add to Cart
              </button>
              {added && <p className="product-detail__added">Added to cart.</p>}
              <p className="product-detail__stock">{product.stock} in stock</p>
            </>
          )}

          <div className="product-detail__badges">
            <span>Free Delivery, Prepaid</span>
            <span>Easy Exchange</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
