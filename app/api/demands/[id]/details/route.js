import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Demand from "@/models/Demand";
import { normalizeDetailPayload } from "@/lib/detailPayload";

export async function PATCH(request, { params }) {
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

    const payload = normalizeDetailPayload(body);

    demand.tasks = payload.tasks;
    demand.financing = payload.financing;
    demand.notes = payload.notes;
    demand.risks = payload.risks;

    await demand.save();

    return NextResponse.json({
      message: "Información de la demanda guardada correctamente",
      demand,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error al guardar la información de la demanda",
        details: error.message,
      },
      { status: 500 }
    );
  }
}