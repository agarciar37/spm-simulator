import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { isValidTransition, projectTransitions } from "@/lib/transitions";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { state } = await request.json();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Proyecto no encontrado" },
        { status: 404 }
      );
    }

    if (!state) {
      return NextResponse.json(
        { error: "Debes indicar un estado" },
        { status: 400 }
      );
    }

    if (!isValidTransition(project.state, state, projectTransitions)) {
      return NextResponse.json(
        {
          error: `Transición no permitida de ${project.state} a ${state}`,
        },
        { status: 400 }
      );
    }

    project.state = state;
    await project.save();

    return NextResponse.json({
      message: "Estado del proyecto actualizado correctamente",
      project,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el proyecto", details: error.message },
      { status: 500 }
    );
  }
}