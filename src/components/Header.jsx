import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
      </Link>

      <div className="product-body">
        <div className="product-meta">
          <span>{product.category}</span>
          <span>{product.rating.toFixed(1)} ★</span>
        </div>

        <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
        <p>{product.description}</p>

        <div className="product-footer">
          <strong>{formatCurrency(product.price)}</strong>
          <button type="button" onClick={() => onAddToCart(product, 1)}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
