import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Header({ onCartClick }) {
  const { cart, user, signOut } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="container nav-shell">
        <Link to="/" className="brand">
          <span className="brand-mark">F</span>
          FlashBuy SA
        </Link>

        <nav className="main-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/catalog">Catalog</NavLink>
          <NavLink to="/account">Account</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>

        <div className="header-actions">
          <button type="button" className="icon-button" onClick={onCartClick}>
            Cart <span>{cartCount}</span>
          </button>
          {user ? (
            <>
              <span className="user-pill">{user.name}</span>
              <button type="button" className="secondary-button" onClick={signOut}>Log out</button>
            </>
          ) : (
            <Link to="/auth" className="secondary-button">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
