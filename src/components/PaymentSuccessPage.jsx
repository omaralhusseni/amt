import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const booking = state?.booking;
  const bookingId = state?.bookingId;

  return (
    <section className="payment-success-page page">
      <div style={{ paddingTop: 120, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 600 }}>
          <div style={{ fontSize: "5rem", marginBottom: 24, color: "var(--gold)" }}>✓</div>
          
          <h1 style={{ fontSize: "2.5rem", color: "var(--dark)", marginBottom: 16, fontFamily: "var(--font-display)" }}>
            Payment Successful!
          </h1>
          
          <p style={{ fontSize: "1.1rem", color: "var(--dark-mid)", marginBottom: 32, lineHeight: 1.6 }}>
            Thank you for your payment. Your booking is confirmed and you will receive a confirmation email shortly.
          </p>

          {booking && (
            <div style={{
              textAlign: "left",
              backgroundColor: "var(--light)",
              padding: 28,
              borderRadius: 8,
              marginBottom: 32,
              border: "1px solid var(--gold)",
            }}>
              <h3 style={{ color: "var(--dark)", marginBottom: 16, fontSize: "1.1rem" }}>Booking Summary</h3>
              <div style={{ display: "grid", gap: 12, fontSize: "0.95rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--dark-mid)" }}>Tour:</span>
                  <strong>{booking.tourName}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--dark-mid)" }}>Guest Name:</span>
                  <strong>{booking.contactName}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--dark-mid)" }}>Number of Guests:</span>
                  <strong>{booking.numberOfGuests}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--dark-mid)" }}>Amount Paid:</span>
                  <strong>{booking.amount} {booking.currency}</strong>
                </div>
                {booking.payment && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                      <span style={{ color: "var(--dark-mid)" }}>Transaction ID:</span>
                      <code style={{ fontSize: "0.85rem", color: "var(--gold)" }}>{booking.payment.transactionId.slice(-12)}</code>
                    </div>
                    {booking.payment.cardBrand && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--dark-mid)" }}>Card:</span>
                        <strong>{booking.payment.cardBrand} •••• {booking.payment.last4Digits}</strong>
                      </div>
                    )}
                  </>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
                  <span style={{ color: "var(--dark-mid)" }}>Booking ID:</span>
                  <code style={{ fontSize: "0.85rem" }}>{bookingId?.slice(-8)}</code>
                </div>
              </div>
            </div>
          )}

          <div style={{
            backgroundColor: "#f0f9f7",
            border: "1px solid var(--gold)",
            borderRadius: 8,
            padding: 16,
            marginBottom: 32,
            fontSize: "0.95rem",
          }}>
            <p style={{ margin: 0, color: "var(--dark)" }}>
              📧 A confirmation email has been sent to your email address with all booking details.
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              onClick={() => navigate("/tours")}
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
              Browse More Tours
            </button>
            <button
              onClick={() => navigate("/")}
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
              Return Home
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
