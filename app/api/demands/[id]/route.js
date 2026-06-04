import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Demand from "@/models/Demand";
import Project from "@/models/Project";

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

    if (demand.state === "Aprobado") {
      return NextResponse.json(
        { error: "No se puede editar una demanda aprobada" },
        { status: 400 }
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

    demand.name = name;
    demand.description = description;
    demand.requestedBy = requestedBy;
    demand.department = department;
    demand.priority = priority || "Media";
    demand.plannedStartDate = plannedStartDate;
    demand.plannedEndDate = plannedEndDate;

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