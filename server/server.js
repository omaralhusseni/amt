import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";

dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Booking from "./models/Booking.js";
import Payment from "./models/Payment.js";
import WebhookLog from "./models/WebhookLog.js";
import { createOrder, createPaymentKey, buildIframeUrl } from "./paymob.js";
import Trip from "./models/Trip.js";

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/book", async (req, res) => {
  try {
    const {
      tourId,
      tourName,
      contactName,
      email,
      phone,
      numberOfGuests,
      guestDetails,
      notes,
    } = req.body;

    if (!tourId || !contactName || !email || !phone) {
      return res
        .status(400)
        .json({ error: "Missing required booking fields." });
    }

    const booking = await Booking.create({
      tourId,
      tourName,
      contactName,
      email,
      phone,
      numberOfGuests,
      guestDetails,
      notes,
    });

    return res
      .status(201)
      .json({ bookingId: booking._id, message: "Trip booked successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create booking." });
  }
});

// Create payment and return Paymob iframe URL
app.post("/api/checkout/create-payment", async (req, res) => {
  try {
    const {
      tourId,
      tourName,
      contactName,
      email,
      phone,
      numberOfGuests,
      guestDetails,
      notes,
      amount,
      currency = "EGP",
    } = req.body;

    if (!tourId || !contactName || !email || !phone || !amount) {
      return res
        .status(400)
        .json({ error: "Missing required booking/payment fields." });
    }

    const booking = await Booking.create({
      tourId,
      tourName,
      contactName,
      email,
      phone,
      numberOfGuests,
      guestDetails,
      notes,
      selectedSchedule: req.body.selectedSchedule || null,
      amount,
      currency,
      paymentStatus: "pending",
    });

    // Paymob expects amount in cents (integer)
    const amountCents = Math.round(Number(amount) * 100);

    // create order
    const orderResp = await createOrder(amountCents, currency);
    const orderId =
      orderResp.id || orderResp._id || (orderResp.data && orderResp.data.id);

    // create payment key
    const billingData = {
      first_name: contactName.split(" ")[0] || contactName,
      last_name: contactName.split(" ").slice(1).join(" ") || "",
      email,
      phone_number: phone,
      apartment: "",
      floor: "",
      street: "",
      building: "",
      city: "",
      country: "",
      postal_code: "",
    };

    const paymentKeyResp = await createPaymentKey(
      orderId,
      amountCents,
      billingData,
      currency
    );
    const paymentToken =
      paymentKeyResp.token ||
      (paymentKeyResp && paymentKeyResp.data && paymentKeyResp.data.token);

    const iframeUrl = buildIframeUrl(paymentToken);

    // update booking with order id
    booking.paymobOrderId = String(orderId);
    booking.paymentHistory.push({
      event: "created_payment",
      orderResp,
      paymentKeyResp,
    });
    await booking.save();

    return res.status(200).json({ bookingId: booking._id, iframeUrl });
  } catch (error) {
    console.error("create-payment error:", error);
    return res.status(500).json({ error: "Failed to create payment." });
  }
});

// Webhook endpoint for Paymob
app.post("/api/webhook/paymob", async (req, res) => {
  console.log("Received Paymob webhook:", req.body);

  // save entire body as is
  try {
    await WebhookLog.create({
      provider: "paymob",
      payload: req.body,
    });
  } catch (error) {
    console.error("Failed to log webhook:", error);
  }

  // Process the webhook data
  // const { order_id, transaction_id, event, data } = req.body;
  // if (!order_id || !transaction_id || !event) {
  //   console.warn("Invalid webhook payload, missing required fields.");
  //   return res.status(400).json({ error: "Invalid payload" });
  // }

  const order_id =
    req.body.obj.order.id ||
    req.body.obj.order_id ||
    (req.body.data && req.body.data.order_id);
  const transaction_id =
    req.body.obj.transaction.id ||
    req.body.obj.transaction_id ||
    (req.body.data && req.body.data.transaction_id);
  const event = req.body.obj.event || (req.body.data && req.body.data.event);
  const data = req.body;

  try {
    if (req.body.obj.success === false) {
      console.warn("Payment failed according to webhook data:", req.body);
      return res.status(200);
    }
    const booking = await Booking.findOne({ paymobOrderId: String(order_id) });
    if (!booking) {
      console.warn(`No booking found for order_id: ${order_id}`);
      return res.status(404).json({ error: "Booking not found" });
    }

    // Update booking payment status based on event type
    if (event === "payment_success") {
      booking.paymentStatus = "paid";
    } else if (event === "payment_failed") {
      booking.paymentStatus = "failed";
    } else if (event === "payment_cancelled") {
      booking.paymentStatus = "cancelled";
    } else {
      booking.paymentStatus = "unknown";
    }

    // Save transaction details in payment history
    booking.paymentHistory.push({
      event,
      transactionId: transaction_id,
      data,
    });

    await booking.save();
    return res.json({ message: "Webhook processed successfully." });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return res.status(500).json({ error: "Failed to process webhook." });
  }
});

// Trips endpoints
app.get("/api/trips", async (_req, res) => {
  try {
    const trips = await Trip.find({}).lean();
    return res.json(trips);
  } catch (error) {
    console.error("trips list error:", error);
    return res.status(500).json({ error: "Failed to fetch trips." });
  }
});

app.get("/api/trips/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).lean();
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    return res.json(trip);
  } catch (error) {
    console.error("trip fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch trip." });
  }
});

// Get booking status and payment details
app.get("/api/booking/:bookingId/status", async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const booking = await Booking.findById(bookingId).lean();
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Fetch associated payment record if available
    let payment = null;
    if (booking.transactionId) {
      payment = await Payment.findOne({
        transactionId: booking.transactionId,
      }).lean();
    }

    return res.json({
      bookingId: booking._id,
      paymentStatus: booking.paymentStatus,
      amount: booking.amount,
      currency: booking.currency,
      payment: payment || null,
      tourName: booking.tourName,
      contactName: booking.contactName,
      numberOfGuests: booking.numberOfGuests,
    });
  } catch (error) {
    console.error("booking status error:", error);
    return res.status(500).json({ error: "Failed to fetch booking status." });
  }
});

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true })); // Parse JSON bodies

export const handler = serverless(app, {
  binary: ["application/octet-stream", "video/mp4"],
});

// app.listen(4000, () => {
//   console.log("listening on port 4000");
// });

// const PORT = process.env.PORT || 4000;
// const HOST = "0.0.0.0"; // <-- this is key!

// app.listen(PORT, HOST, () => {
//   console.log(`✅ Server running on:`);
//   console.log(`   → Local:   http://localhost:${PORT}`);
//   console.log(`   → Network: http://${getLocalIP()}:${PORT}`);
// });

// // Helper to get local IP address
// function getLocalIP() {
//   const nets = os.networkInterfaces();
//   for (const name of Object.keys(nets)) {
//     for (const net of nets[name]) {
//       if (net.family === "IPv4" && !net.internal) return net.address;
//     }
//   }
// }

export default app;
