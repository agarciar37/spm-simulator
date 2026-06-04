import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Demand from "@/models/Demand";
import Project from "@/models/Project";
import { demandTransitions, isValidTransition } from "@/lib/transitions";
import { formatCode, getNextSequence } from "@/lib/counters";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const { state } = await request.json();

    const demand = await Demand.findById(id);

    if (!demand) {
      return NextResponse.json(
        { error: "Demanda no encontrada" },
        { status: 404 }
      );
    }

    if (!state) {
      return NextResponse.json(
        { error: "Debes indicar un estado" },
        { status: 400 }
      );
    }

    if (!isValidTransition(demand.state, state, demandTransitions)) {
      return NextResponse.json(
        { error: `Transición no permitida de ${demand.state} a ${state}` },
        { status: 400 }
      );
    }

    demand.state = state;
    await demand.save();

    let project = null;

    if (state === "Aprobado" && !demand.generatedProjectId) {
      const projectSequence = await getNextSequence("project");
      const projectCode = formatCode("PRJ", projectSequence);

      project = await Project.create({
        code: projectCode,
        demandId: demand._id,
        name: demand.name,
        description: demand.description,
        requestedBy: demand.requestedBy,
        department: demand.department,
        priority: demand.priority,
        plannedStartDate: demand.plannedStartDate,
        plannedEndDate: demand.plannedEndDate,
        state: "Planificación",
        tasks: demand.tasks || [],
        financing: demand.financing || [],
        risks: demand.risks || "",
        notes: demand.notes || "",
      });

      demand.generatedProjectId = project._id;
      await demand.save();
    }

    return NextResponse.json({
      message:
        state === "Aprobado" && project
          ? "Demanda aprobada y proyecto generado correctamente"
          : "Estado de la demanda actualizado correctamente",
      demand,
      project,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar la demanda", details: error.message },
      { status: 500 }
    );
  }
}