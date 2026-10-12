import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { buildPayFastForm } from '../lib/payfast';
import { formatCurrency } from '../utils/currency';

const initialForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  province: '',
  postalCode: ''
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, deliveryFee, total, placeOrder, user } = useStore();
  const [form, setForm] = useState({ ...initialForm, email: user?.email || '' });
  const [orderReference, setOrderReference] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [processing, setProcessing] = useState(false);

  const hasProducts = cart.length > 0;

  const orderSummary = useMemo(
    () => ({
      id: `FB-${Date.now().toString().slice(-6)}`,
      items: cart.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
      total,
      subtotal,
      deliveryFee,
    }),
    [cart, subtotal, deliveryFee, total]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handlePayNow = async (event) => {
    event.preventDefault();
    if (!hasProducts) return;

    setProcessing(true);
    setPaymentError('');

    try {
      const result = placeOrder(form);

      if (!result.success) {
        setPaymentError(result.error);
        return;
      }

      setOrderReference(result.order.id);

      try {
        const { url, params } = buildPayFastForm(result.order, form);
        const formElement = document.createElement('form');
        formElement.method = 'POST';
        formElement.action = url;

        Object.entries(params).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          formElement.appendChild(input);
        });

        document.body.appendChild(formElement);
        formElement.submit();
      } catch (providerError) {
        setPaymentError(providerError.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  if (!hasProducts && !orderReference) {
    return (
      <div className="container page-shell empty-state large">
        <p>Your cart is empty.</p>
        <Link to="/catalog" className="primary-button">Continue shopping</Link>
      </div>
    );
  }

  if (orderReference) {
    return (
      <div className="container page-shell empty-state large">
        <p>Order {orderReference} has been placed and is awaiting payment confirmation from PayFast.</p>
        <p>We do not mark the order as paid until the payment provider confirms it securely.</p>
        <button type="button" className="primary-button" onClick={() => navigate('/account')}>View order history</button>
      </div>
    );
  }

  return (
    <div className="container page-shell checkout-shell">
      <div className="checkout-card">
        <p className="eyebrow">Secure checkout</p>
        <h1>Delivery and payment</h1>

        <form onSubmit={handlePayNow} className="checkout-form">
          <div className="form-grid">
            <label>
              First name
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>
            <label>
              Last name
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label className="full-span">
              Street address
              <input name="address" value={form.address} onChange={handleChange} required />
            </label>
            <label>
              City
              <input name="city" value={form.city} onChange={handleChange} required />
            </label>
            <label>
              Province
              <input name="province" value={form.province} onChange={handleChange} required />
            </label>
            <label>
              Postal code
              <input name="postalCode" value={form.postalCode} onChange={handleChange} required />
            </label>
          </div>

          <div className="order-total-box">
            <div>
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <strong>{formatCurrency(deliveryFee)}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>

          {paymentError && <p className="error-text">{paymentError}</p>}

          <button type="submit" className="primary-button full-width" disabled={processing}>
            {processing ? 'Preparing secure payment...' : 'Pay securely via PayFast'}
          </button>
        </form>
      </div>
    </div>
  );
}
