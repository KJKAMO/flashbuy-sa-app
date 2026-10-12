const PAYFAST_URL = 'https://www.payfast.co.za/eng/process';

export function buildPayFastForm(order, customer) {
  const merchantId = import.meta.env.VITE_PAYFAST_MERCHANT_ID || '';
  const merchantKey = import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '';
  const environment = import.meta.env.VITE_PAYFAST_MODE || 'sandbox';

  if (!merchantId || !merchantKey) {
    throw new Error('PayFast credentials are not configured. Add VITE_PAYFAST_MERCHANT_ID and VITE_PAYFAST_MERCHANT_KEY to your .env file.');
  }

  const params = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${window.location.origin}/account?payment=success`,
    cancel_url: `${window.location.origin}/checkout?payment=cancelled`,
    notify_url: `${window.location.origin}/api/payfast/notify`,
    name_first: customer.firstName || 'Customer',
    name_last: customer.lastName || 'User',
    email_address: customer.email || 'customer@example.com',
    m_payment_id: order.id,
    amount: Number(order.total / 100).toFixed(2),
    item_name: `FlashBuy SA order ${order.id}`,
    item_description: order.items.map((item) => `${item.name} x ${item.quantity}`).join(', '),
    email_confirmation: '1',
    confirmation_address: customer.email || 'customer@example.com',
    payment_method: 'eft',
    environment,
  };

  return { url: PAYFAST_URL, params };
}
