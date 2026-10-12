import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/currency';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="container page-shell empty-state large">
        <p>Product not found.</p>
        <button type="button" className="secondary-button" onClick={() => navigate('/catalog')}>Back to catalog</button>
      </div>
    );
  }

  return (
    <div className="container page-shell product-page">
      <div className="product-visual">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <p className="eyebrow">{product.category}</p>
        <h1>{product.name}</h1>
        <div className="rating-line">
          <span>{product.rating.toFixed(1)} ★</span>
          <span>{product.stock} in stock</span>
        </div>

        <p className="product-price">{formatCurrency(product.price)}</p>
        <p>{product.description}</p>

        <div className="product-actions">
          <button type="button" className="primary-button" onClick={() => addToCart(product, 1)}>
            Add to cart
          </button>
          <button type="button" className="secondary-button" onClick={() => navigate('/catalog')}>
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
