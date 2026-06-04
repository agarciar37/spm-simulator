import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
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
    const project = await Project.findById(id).populate("demandId");

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener el proyecto", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
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

    project.name = name;
    project.description = description;
    project.requestedBy = requestedBy;
    project.department = department;
    project.priority = priority || "Media";
    project.plannedStartDate = new Date(plannedStartDate);
    project.plannedEndDate = new Date(plannedEndDate);
    project.pendingTasks = normalizePendingTasks(pendingTasks);
    project.funding = {
      budget: Number(funding?.budget || 0),
      spent: Number(funding?.spent || 0),
      source: funding?.source || "",
    };
    project.risks = risks || "";
    project.notes = notes || "";

    await project.save();

    return NextResponse.json({
      message: "Proyecto actualizado correctamente",
      project,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el proyecto", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      );
    }

    await Demand.findByIdAndUpdate(project.demandId, {
      generatedProjectId: null,
      state: "En evaluación",
    });

    await Project.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Proyecto eliminado correctamente y demanda devuelta a evaluación",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar el proyecto", details: error.message },
      { status: 500 }
    );
  }
}