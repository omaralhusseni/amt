import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
});

const BookingSchema = new mongoose.Schema(
  {
    tourId: { type: String, required: true },
    tourName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    numberOfGuests: { type: Number, default: 1 },
    guestDetails: { type: [GuestSchema], default: [] },
    notes: { type: String, default: "" },
    // Payment fields
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "EGP" },
    transactionId: { type: String, default: null },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "cancelled", "unknown"], default: "pending" },
    paymobOrderId: { type: String, default: null },
    paymobRawWebhook: { type: mongoose.Schema.Types.Mixed, default: null },
    paymentHistory: { type: [mongoose.Schema.Types.Mixed], default: [] },
    selectedSchedule: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Booking", BookingSchema);
