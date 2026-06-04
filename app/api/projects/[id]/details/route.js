import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { normalizeDetailPayload } from "@/lib/detailPayload";

export async function PATCH(request, { params }) {
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

    const payload = normalizeDetailPayload(body);

    project.tasks = payload.tasks;
    project.financing = payload.financing;
    project.notes = payload.notes;
    project.risks = payload.risks;

    await project.save();

    return NextResponse.json({
      message: "Información del proyecto guardada correctamente",
      project,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al guardar la información del proyecto",
        details: error.message,
      },
      { status: 500 }
    );
  }
}