import mongoose from "mongoose";
import { DEMAND_STATES } from "@/lib/transitions";

const DemandSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    requestedBy: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Baja", "Media", "Alta"],
      default: "Media",
    },
    plannedStartDate: {
      type: Date,
      required: true,
    },
    plannedEndDate: {
      type: Date,
      required: true,
    },
    state: {
      type: String,
      enum: DEMAND_STATES,
      default: "Nuevo",
    },
    generatedProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

DemandSchema.pre("validate", function () {
  if (
    this.plannedStartDate &&
    this.plannedEndDate &&
    this.plannedStartDate > this.plannedEndDate
  ) {
    throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin");
  }
});

export default mongoose.models.Demand || mongoose.model("Demand", DemandSchema);