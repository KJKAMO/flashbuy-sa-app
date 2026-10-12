import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/currency';

export default function HomePage() {
  const { featuredProducts, categories, products, addToCart } = useStore();

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">FlashBuy SA</p>
            <h1>Shop smarter. Spend less. Feel premium.</h1>
            <p className="hero-copy">
              Premium gadgets, home find, travel essentials, and everyday favourites delivered across South Africa.
            </p>
            <div className="hero-actions">
              <Link to="/catalog" className="primary-button">Shop now</Link>
              <Link to="/auth" className="secondary-button">Join now</Link>
            </div>
            <ul className="hero-stats">
              <li><strong>20k+</strong><span>happy shoppers</span></li>
              <li><strong>R0</strong><span>subscription</span></li>
              <li><strong>48h</strong><span>dispatch</span></li>
            </ul>
          </div>

          <div className="hero-card">
            <div className="card-badge">Deal of the week</div>
            <h3>Apex Pro Wireless Headphones</h3>
            <div className="price-line">
              <span>{formatCurrency(2299)}</span>
              <strong>Save 15%</strong>
            </div>
            <button type="button" className="primary-button full-width" onClick={() => addToCart(featuredProducts[0], 1)}>
              Add to cart
            </button>
          </div>
        </div>
      </section>

      <section className="sections">
        <div className="container">
          <div className="section-heading">
            <h2>Shop by category</h2>
            <Link to="/catalog">Explore all</Link>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <Link key={category} to={`/catalog?category=${encodeURIComponent(category)}`} className="category-card">
                <span>{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sections alt-bg">
        <div className="container">
          <div className="section-heading">
            <h2>Featured deals</h2>
            <Link to="/catalog">See more</Link>
          </div>

          <div className="product-grid">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <section className="sections">
        <div className="container">
          <div className="section-heading">
            <h2>Popular picks</h2>
            <Link to="/catalog">Browse catalogue</Link>
          </div>

          <div className="product-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
