import { Link } from 'react-router-dom';
import { formatPKR } from '../utils/format';

const ProductCard = ({ product }) => {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      {product.soldOut ? (
        <span className="badge-soldout">Sold Out</span>
      ) : onSale ? (
        <span className="badge-soldout sale">Sale</span>
      ) : (
        <span className="badge-soldout instock">In Stock</span>
      )}
      <div className="product-card__img">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-card__body">
        <p className="product-card__cat">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">
          {formatPKR(product.price)}
          {onSale && <span className="product-card__was">{formatPKR(product.compareAtPrice)}</span>}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
