import mongoose from "mongoose";

const WebhookLogSchema = new mongoose.Schema(
  {
    provider: { type: String, default: "paymob" },
    payload: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

export default mongoose.model("WebhookLog", WebhookLogSchema);
