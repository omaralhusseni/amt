import fetch from "node-fetch";

const PAYMOB_API_URL =
  process.env.PAYMOB_API_URL || "https://accept.paymob.com";

async function getAuthToken() {
  const API_KEY = process.env.PAYMOB_API_KEY;
  if (!API_KEY) throw new Error("Missing PAYMOB_API_KEY env var");
  const res = await fetch(`${PAYMOB_API_URL}/api/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: API_KEY }),
  });
  if (!res.ok) throw new Error(`Paymob auth failed: ${res.status}`);
  return (await res.json()).token;
}

async function createOrder(amountCents, currency = "EGP", items = []) {
  const token = await getAuthToken();
  const res = await fetch(`${PAYMOB_API_URL}/api/ecommerce/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount_cents: amountCents, currency, items }),
  });
  if (!res.ok) throw new Error(`Paymob create order failed: ${res.status}`);
  return res.json();
}

async function createPaymentKey(
  orderId,
  amountCents,
  billingData = {},
  currency = "EGP"
) {
  const INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
  if (!INTEGRATION_ID) throw new Error("Missing PAYMOB_INTEGRATION_ID env var");
  const token = await getAuthToken();
  
  // Ensure all billing data fields have non-empty values
  const finalBillingData = {
    first_name: billingData.first_name || "Customer",
    last_name: billingData.last_name || "Name",
    email: billingData.email || "customer@example.com",
    phone_number: billingData.phone_number || "201000000000",
    apartment: billingData.apartment || "N/A",
    floor: billingData.floor || "1",
    street: billingData.street || "Street",
    building: billingData.building || "1",
    city: billingData.city || "Cairo",
    country: billingData.country || "EG",
    postal_code: billingData.postal_code || "12345",
  };
  
  const payload = {
    amount_cents: amountCents,
    expiration: 3600,
    order_id: orderId,
    billing_data: finalBillingData,
    currency,
    integration_id: Number(INTEGRATION_ID),
  };

  const res = await fetch(`${PAYMOB_API_URL}/api/acceptance/payment_keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Paymob payment key error:", { status: res.status, errorData, payload });
    throw new Error(`Paymob create payment key failed: ${res.status}`);
  }
  return res.json();
}

function buildIframeUrl(paymentToken) {
  const IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
  if (!IFRAME_ID) throw new Error("Missing PAYMOB_IFRAME_ID env var");
  return `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentToken}`;
}

export { getAuthToken, createOrder, createPaymentKey, buildIframeUrl };
