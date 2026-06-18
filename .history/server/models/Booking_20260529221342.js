import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
});

const BookingSchema = new mongoose.Schema(
  {
    tourId: { type: Number, required: true },
    tourName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    numberOfGuests: { type: Number, default: 1 },
    guestDetails: { type: [GuestSchema], default: [] },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Booking", BookingSchema);
