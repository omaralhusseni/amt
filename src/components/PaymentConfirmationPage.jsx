import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [bookingId] = useState(state?.bookingId || null);
  const [status, setStatus] = useState({ stage: "confirming", message: "Confirming your payment..." });
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setStatus({ stage: "error", message: "No booking found. Redirecting..." });
      setTimeout(() => navigate("/tours"), 3000);
      return;
    }

    // Poll for payment confirmation every 1 second
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/booking/${bookingId}/status`);
        if (!response.ok) {
          throw new Error("Failed to fetch booking status");
        }

        const data = await response.json();
        setBookingDetails(data);

        if (data.paymentStatus === "paid") {
          setStatus({ stage: "success", message: "Payment confirmed! 🎉" });
          clearInterval(pollInterval);
          // Redirect after 2 seconds to success/receipt page
          setTimeout(() => {
            navigate("/payment-success", { state: { bookingId, booking: data } });
          }, 2000);
        } else if (data.paymentStatus === "failed") {
          setStatus({ stage: "error", message: "Payment failed. Please try again." });
          clearInterval(pollInterval);
          setTimeout(() => {
            navigate("/payment-error", { state: { bookingId, reason: "Payment declined" } });
          }, 3000);
        } else if (data.paymentStatus === "cancelled") {
          setStatus({ stage: "error", message: "Payment was cancelled." });
          clearInterval(pollInterval);
          setTimeout(() => {
            navigate("/payment-error", { state: { bookingId, reason: "Payment cancelled" } });
          }, 3000);
        } else if (data.paymentStatus === "unknown") {
          setStatus({ stage: "confirming", message: "Payment status unclear. Please contact support." });
          clearInterval(pollInterval);
          setTimeout(() => {
            navigate("/payment-error", { state: { bookingId, reason: "Unable to confirm payment status" } });
          }, 5000);
        }
      } catch (error) {
        console.error("Error polling booking status:", error);
        // Continue polling even if there's an error - might be temporary
        setStatus({ stage: "confirming", message: "Waiting for confirmation..." });
      }
    }, 1000); // Poll every 1 second

    // Set a timeout to stop polling after 5 minutes
    const timeoutId = setTimeout(() => {
      clearInterval(pollInterval);
      setStatus({ stage: "error", message: "Payment confirmation timeout. Please contact support." });
      setTimeout(() => {
        navigate("/payment-error", { state: { bookingId, reason: "Confirmation timeout" } });
      }, 3000);
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
    };
  }, [bookingId, navigate]);

  return (
    <section className="payment-confirmation-page page">
      <div style={{ paddingTop: 120, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 600 }}>
          {status.stage === "confirming" && (
            <>
              <div style={{ marginBottom: 32 }}>
                <div style={{
                  width: 80,
                  height: 80,
                  margin: "0 auto 24px",
                  borderRadius: "50%",
                  border: "4px solid var(--gold)",
                  borderTop: "4px solid transparent",
                  animation: "spin 1s linear infinite",
                }}>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              </div>
              <h1 style={{ fontSize: "2rem", color: "var(--dark)", marginBottom: 16 }}>
                {status.message}
              </h1>
              <p style={{ color: "var(--dark-mid)", fontSize: "1rem", lineHeight: 1.6 }}>
                We're confirming your payment with our payment provider. This usually takes a few seconds.
              </p>
            </>
          )}

          {status.stage === "success" && (
            <>
              <div style={{ fontSize: "4rem", marginBottom: 24 }}>✓</div>
              <h1 style={{ fontSize: "2rem", color: "var(--dark)", marginBottom: 16 }}>
                {status.message}
              </h1>
              {bookingDetails && (
                <div style={{ textAlign: "left", backgroundColor: "var(--light)", padding: 24, borderRadius: 8, marginBottom: 24 }}>
                  <p><strong>Tour:</strong> {bookingDetails.tourName}</p>
                  <p><strong>Guests:</strong> {bookingDetails.numberOfGuests}</p>
                  <p><strong>Amount:</strong> {bookingDetails.amount} {bookingDetails.currency}</p>
                  <p><strong>Booking ID:</strong> {bookingId?.slice(-8)}</p>
                </div>
              )}
              <p style={{ color: "var(--dark-mid)" }}>Redirecting to booking confirmation...</p>
            </>
          )}

          {status.stage === "error" && (
            <>
              <div style={{ fontSize: "3rem", marginBottom: 24, color: "var(--error)" }}>✕</div>
              <h1 style={{ fontSize: "2rem", color: "var(--dark)", marginBottom: 16 }}>
                {status.message}
              </h1>
              <p style={{ color: "var(--dark-mid)", marginBottom: 24 }}>
                If you need help, please contact our support team.
              </p>
              <button
                onClick={() => navigate("/booking", { state: { tourId: bookingDetails?.tourId } })}
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
