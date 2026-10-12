import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/currency';

export default function AccountPage() {
  const { user, orders } = useStore();

  if (!user) {
    return (
      <div className="container page-shell empty-state large">
        <p>Please sign in to view your account and order history.</p>
        <Link to="/auth" className="primary-button">Go to login</Link>
      </div>
    );
  }

  return (
    <div className="container page-shell account-shell">
      <div className="account-summary card-box">
        <p className="eyebrow">My account</p>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>

      <div className="card-box">
        <h2>Order history</h2>

        {orders.length === 0 ? (
          <p className="empty-text">You have no orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-row">
                <div>
                  <strong>{order.id}</strong>
                  <p>{new Date(order.createdAt).toLocaleDateString('en-ZA')}</p>
                </div>
                <span className="status-pill">{order.paymentStatus}</span>
                <strong>{formatCurrency(order.total)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
