import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Demand from "@/models/Demand";

function normalizePendingTasks(tasks) {
  if (!Array.isArray(tasks)) return [];

  return tasks
    .map((task) => ({
      title: String(task.title || "").trim(),
      done: Boolean(task.done),
    }))
    .filter((task) => task.title.length > 0);
}

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const demand = await Demand.findById(id).populate("generatedProjectId");

    if (!demand) {
      return NextResponse.json(
        { error: "Demanda no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(demand);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener la demanda", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const demand = await Demand.findById(id);

    if (!demand) {
      return NextResponse.json(
        { error: "Demanda no encontrada" },
        { status: 404 }
      );
    }

    const {
      name,
      description,
      requestedBy,
      department,
      priority,
      plannedStartDate,
      plannedEndDate,
      pendingTasks,
      funding,
      risks,
      notes,
    } = body;

    if (
      !name ||
      !description ||
      !requestedBy ||
      !department ||
      !plannedStartDate ||
      !plannedEndDate
    ) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben estar informados" },
        { status: 400 }
      );
    }

    if (new Date(plannedStartDate) > new Date(plannedEndDate)) {
      return NextResponse.json(
        { error: "La fecha de inicio no puede ser posterior a la fecha de fin" },
        { status: 400 }
      );
    }

    demand.name = name;
    demand.description = description;
    demand.requestedBy = requestedBy;
    demand.department = department;
    demand.priority = priority || "Media";
    demand.plannedStartDate = new Date(plannedStartDate);
    demand.plannedEndDate = new Date(plannedEndDate);
    demand.pendingTasks = normalizePendingTasks(pendingTasks);
    demand.funding = {
      budget: Number(funding?.budget || 0),
      spent: Number(funding?.spent || 0),
      source: funding?.source || "",
    };
    demand.risks = risks || "";
    demand.notes = notes || "";

    await demand.save();

    return NextResponse.json({
      message: "Demanda actualizada correctamente",
      demand,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar la demanda", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const demand = await Demand.findById(id);

    if (!demand) {
      return NextResponse.json(
        { error: "Demanda no encontrada" },
        { status: 404 }
      );
    }

    if (demand.generatedProjectId) {
      return NextResponse.json(
        { error: "No se puede eliminar una demanda que ya tiene proyecto generado" },
        { status: 400 }
      );
    }

    await Demand.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Demanda eliminada correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar la demanda", details: error.message },
      { status: 500 }
    );
  }
}