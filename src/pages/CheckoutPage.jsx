import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return (
      <div className="container page-shell empty-state large">
        <p>You are already signed in as {user.email}.</p>
        <button type="button" className="primary-button" onClick={() => navigate('/account')}>Go to account</button>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = isSignUp
        ? await signUp(name, email, password)
        : await signIn(email, password);

      if (!result.success) {
        setError(result.error || 'Authentication failed.');
        return;
      }

      navigate('/account');
    } catch (caughtError) {
      setError(caughtError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-shell auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Account</p>
        <h1>{isSignUp ? 'Create an account' : 'Welcome back'}</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <label>
              Full name
              <input value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
          )}

          <label>
            Email address
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="6" required />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="primary-button full-width" disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Login'}
          </button>
        </form>

        <button type="button" className="text-button center" onClick={() => setIsSignUp((current) => !current)}>
          {isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}
        </button>
      </div>
    </div>
  );
}
