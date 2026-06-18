import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [iframeUrl, setIframeUrl] = useState(state?.iframeUrl || null);
  const [bookingId] = useState(state?.bookingId || null);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("processing");

  useEffect(() => {
    if (!iframeUrl && bookingId) {
      // Optionally: fetch booking status or stored iframe from server
    }
  }, [iframeUrl, bookingId]);

  // Listen for iframe completion signals via postMessage
  useEffect(() => {
    const handleMessage = (event) => {
      // Verify the message origin is from Paymob
      if (
        event.origin.includes("accept.paymob.com") ||
        event.origin.includes("paymob")
      ) {
        console.log("Message from Paymob iframe:", event.data);

        // Paymob typically sends a message when payment flow is complete
        if (event.data.type === "close" || event.data.type === "redirect") {
          setPaymentStatus("completed");
          setShowContinueButton(true);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Show continue button after 10 seconds if no message received
    const timeoutId = setTimeout(() => {
      setShowContinueButton(true);
    }, 10000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleContinue = () => {
    if (!bookingId) {
      navigate("/tours");
      return;
    }
    navigate("/payment-confirmation", { state: { bookingId } });
  };

  const handleBackToBooking = () => {
    navigate(-1);
  };

  return (
    <section className="checkout-page page">
      <style>{`
        @media (max-width: 768px) {
          .checkout-page {
            padding: 0 16px;
          }
          .checkout-page h1 {
            font-size: clamp(1.5rem, 4vw, 2rem);
          }
          .checkout-iframe-container {
            height: clamp(400px, 70vh, 600px);
          }
          .checkout-button-section button {
            width: 100%;
            padding: 14px 16px !important;
            font-size: 0.95rem;
          }
        }
      `}</style>

      <div
        style={{
          paddingTop: "clamp(80px, 10vw, 120px)",
          paddingBottom: "40px",
        }}
      >
        <button
          className="back-btn"
          onClick={handleBackToBooking}
          style={{ marginBottom: 24 }}
        >
          ← Back
        </button>

        <div style={{ marginTop: 24, maxWidth: 900, margin: "24px auto 0" }}>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              color: "#1a1a1a",
              marginBottom: 16,
            }}
          >
            Secure payment
          </h1>
          <p
            style={{
              color: "#555555",
              marginBottom: 24,
              fontSize: "clamp(0.9rem, 2vw, 1rem)",
              lineHeight: 1.6,
            }}
          >
            Complete your payment in the secure Paymob checkout below. We'll
            record the payment and update your booking automatically.
          </p>

          {iframeUrl ? (
            <>
              <div
                className="checkout-iframe-container"
                style={{
                  width: "100%",
                  height: "clamp(500px, 80vh, 700px)",
                  marginBottom: 24,
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <iframe
                  title="Paymob Checkout"
                  src={iframeUrl}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                />
              </div>
            </>
          ) : (
            <div
              style={{
                padding: "24px",
                backgroundColor: "#ffebee",
                border: "2px solid #d32f2f",
                borderRadius: 8,
                color: "#c62828",
                textAlign: "center",
                fontSize: "clamp(0.9rem, 2vw, 1rem)",
                fontWeight: 500,
              }}
            >
              No checkout session found. Return to booking and try again.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
