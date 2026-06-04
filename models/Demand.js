import mongoose from "mongoose";
import { DEMAND_STATES } from "@/lib/transitions";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    responsible: {
      type: String,
      trim: true,
      default: "",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pendiente", "En curso", "Bloqueada", "Completada"],
      default: "Pendiente",
    },
  },
  { _id: false }
);

const FinancingSchema = new mongoose.Schema(
  {
    concept: {
      type: String,
      trim: true,
      default: "",
    },
    amount: {
      type: Number,
      default: 0,
    },
    provider: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pendiente", "Solicitada", "Aprobada", "Rechazada"],
      default: "Pendiente",
    },
  },
  { _id: false }
);

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
    tasks: {
      type: [TaskSchema],
      default: [],
    },
    financing: {
      type: [FinancingSchema],
      default: [],
    },
    risks: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
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