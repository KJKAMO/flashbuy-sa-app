import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/currency';

export default function CartDrawer({ open, onClose }) {
  const { cart, subtotal, deliveryFee, total, updateQuantity, removeFromCart } = useStore();

  if (!open) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside className="cart-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawer-header">
          <h3>Shopping cart</h3>
          <button type="button" onClick={onClose}>Close</button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is empty.</p>
            <Link to="/catalog" onClick={onClose}>Browse products</Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-body">
                    <div>
                      <h4>{item.name}</h4>
                      <p>{formatCurrency(item.price)}</p>
                    </div>

                    <div className="cart-controls">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>

                    <button type="button" className="text-button" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>{formatCurrency(deliveryFee)}</strong>
              </div>
              <div className="total-row">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>

              <Link to="/checkout" className="primary-button full-width" onClick={onClose}>Proceed to checkout</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
