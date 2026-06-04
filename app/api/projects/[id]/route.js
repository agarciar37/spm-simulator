import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Demand from "@/models/Demand";

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