import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Booking from "./models/Booking.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/amt_travel";

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
      return res.status(400).json({ error: "Missing required booking fields." });
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

    return res.status(201).json({ bookingId: booking._id, message: "Trip booked successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create booking." });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Booking backend listening on http://localhost:${PORT}`);
});
