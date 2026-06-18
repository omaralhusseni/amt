import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentErrorPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingId = state?.bookingId;
  const reason = state?.reason || "An error occurred during payment processing";

  const errorMessages = {
    "Payment declined": "Your payment was declined. Please check your card details and try again.",
    "Payment cancelled": "You cancelled the payment. You can restart your booking anytime.",
    "Unable to confirm payment status": "We couldn't confirm your payment status. Your funds may or may not have been processed.",
    "Confirmation timeout": "Payment confirmation took too long. Please contact support to verify your payment.",
    "Network error": "A network error occurred. Please check your connection and try again.",
  };

  const message = errorMessages[reason] || reason;

  return (
    <section className="payment-error-page page">
      <div style={{ paddingTop: 120, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 600 }}>
          <div style={{ fontSize: "5rem", marginBottom: 24, color: "#d97706" }}>⚠</div>
          
          <h1 style={{ fontSize: "2.5rem", color: "var(--dark)", marginBottom: 16, fontFamily: "var(--font-display)" }}>
            Payment Error
          </h1>
          
          <p style={{ fontSize: "1.1rem", color: "var(--dark-mid)", marginBottom: 32, lineHeight: 1.6 }}>
            {message}
          </p>

          <div style={{
            backgroundColor: "#fef3c7",
            border: "2px solid #f59e0b",
            borderRadius: 8,
            padding: 20,
            marginBottom: 32,
            fontSize: "0.95rem",
          }}>
            <p style={{ margin: "0 0 12px 0", fontWeight: 600, color: "#78350f" }}>What should I do?</p>
            <ul style={{ margin: 0, paddingLeft: 20, textAlign: "left", color: "#78350f", lineHeight: 1.8 }}>
              <li>Check your card details and ensure they are correct</li>
              <li>Verify you have sufficient funds in your account</li>
              <li>Try again with a different payment method if available</li>
              <li>Contact your bank if the issue persists</li>
              <li>Reach out to our support team for assistance</li>
            </ul>
          </div>

          {bookingId && (
            <div style={{
              backgroundColor: "var(--light)",
              padding: 16,
              borderRadius: 8,
              marginBottom: 32,
              fontSize: "0.9rem",
            }}>
              <p style={{ margin: "0 0 8px 0", color: "var(--dark-mid)" }}>Booking ID for reference:</p>
              <code style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--gold)" }}>
                {bookingId?.slice(-12)}
              </code>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "12px 32px",
                backgroundColor: "var(--gold)",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/tours")}
              style={{
                padding: "12px 32px",
                backgroundColor: "transparent",
                color: "var(--dark)",
                border: "2px solid var(--dark)",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              Browse Tours
            </button>
            <a
              href="mailto:support@egypttours.com"
              style={{
                padding: "12px 32px",
                backgroundColor: "transparent",
                color: "var(--gold)",
                border: "2px solid var(--gold)",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
