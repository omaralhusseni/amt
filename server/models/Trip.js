import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  images: { type: [String], default: [] },
  place: { type: String, default: "" },
});

const ActivityWithTimeSchema = new mongoose.Schema({
  time: { type: String, default: "" },
  activity: { type: ActivitySchema, required: true },
});

// A schedule is a named collection of days; each day is an array of ActivityWithTime
const ScheduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  days: { type: [[ActivityWithTimeSchema]], default: [] },
  price_per_person: { type: Number, default: 0 },
});

const TripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    interested: { type: Number, default: 0 },
    schedules: { type: [ScheduleSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Trip", TripSchema);
