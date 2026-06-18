import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Booking" },
    transactionId: { type: String, required: true, unique: true },
    paymobOrderId: { type: String, required: true },
    amount: { type: Number, required: true }, // in original currency units
    currency: { type: String, default: "EGP" },
    status: { type: String, enum: ["paid", "failed", "pending", "cancelled"], default: "pending" },
    paymentMethod: { type: String, default: null }, // card, wallet, etc.
    last4Digits: { type: String, default: null }, // Last 4 digits of card
    cardBrand: { type: String, default: null }, // visa, mastercard, etc.
    paymobResponse: { type: mongoose.Schema.Types.Mixed, default: null }, // Raw Paymob webhook response
    processedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", PaymentSchema);
