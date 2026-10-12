import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export default function CatalogPage() {
  const { products, categories, addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    const nextCategory = searchParams.get('category') || 'All';
    setSelectedCategory(nextCategory);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = !normalizedQuery || product.name.toLowerCase().includes(normalizedQuery) || product.description.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, query]);

  const handleCategoryChange = (nextCategory) => {
    setSelectedCategory(nextCategory);
    setSearchParams(nextCategory === 'All' ? {} : { category: nextCategory });
  };

  return (
    <div className="container page-shell">
      <div className="catalog-header">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1>Explore our collection</h1>
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products"
          className="search-input"
        />
      </div>

      <div className="filter-row">
        <button type="button" className={selectedCategory === 'All' ? 'filter-chip active' : 'filter-chip'} onClick={() => handleCategoryChange('All')}>
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={selectedCategory === category ? 'filter-chip active' : 'filter-chip'}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state large">
          <p>No products match your search or filters.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
