import mongoose from "mongoose";
import { PROJECT_STATES } from "@/lib/transitions";

const ProjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    demandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Demand",
      required: true,
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
      enum: PROJECT_STATES,
      default: "Planificación",
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.pre("validate", function () {
  if (
    this.plannedStartDate &&
    this.plannedEndDate &&
    this.plannedStartDate > this.plannedEndDate
  ) {
    throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin");
  }
});

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);