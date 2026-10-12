import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/currency';

const blankProduct = {
  name: '',
  category: 'Electronics',
  price: 0,
  stock: 0,
  image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  description: '',
  featured: false,
  rating: 4.5,
};

export default function AdminPage() {
  const { products, addProduct, removeProduct, updateProduct } = useStore();
  const [newProduct, setNewProduct] = useState(blankProduct);

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target;
    setNewProduct((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateProduct = (event) => {
    event.preventDefault();
    addProduct({
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
    });
    setNewProduct(blankProduct);
  };

  return (
    <div className="container page-shell admin-shell">
      <div className="card-box">
        <p className="eyebrow">Admin dashboard</p>
        <h1>Manage products</h1>

        <form onSubmit={handleCreateProduct} className="admin-form">
          <div className="form-grid">
            <label>
              Product name
              <input name="name" value={newProduct.name} onChange={handleInput} required />
            </label>
            <label>
              Category
              <input name="category" value={newProduct.category} onChange={handleInput} required />
            </label>
            <label>
              Price (ZAR)
              <input type="number" name="price" value={newProduct.price} onChange={handleInput} required />
            </label>
            <label>
              Stock
              <input type="number" name="stock" value={newProduct.stock} onChange={handleInput} required />
            </label>
            <label className="full-span">
              Image URL
              <input name="image" value={newProduct.image} onChange={handleInput} required />
            </label>
            <label className="full-span">
              Description
              <textarea name="description" value={newProduct.description} onChange={handleInput} required />
            </label>
            <label className="checkbox-row">
              <input type="checkbox" name="featured" checked={newProduct.featured} onChange={handleInput} />
              Featured product
            </label>
          </div>

          <button type="submit" className="primary-button">Add product</button>
        </form>
      </div>

      <div className="card-box">
        <h2>Current inventory</h2>
        <div className="inventory-list">
          {products.map((product) => (
            <div key={product.id} className="inventory-item">
              <div>
                <strong>{product.name}</strong>
                <p>{product.category}</p>
              </div>
              <div>
                <span>{formatCurrency(product.price)}</span>
                <p>Stock: {product.stock}</p>
              </div>
              <div className="inventory-actions">
                <button type="button" className="secondary-button" onClick={() => updateProduct(product.id, { stock: product.stock + 5 })}>Restock</button>
                <button type="button" className="text-button" onClick={() => removeProduct(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
