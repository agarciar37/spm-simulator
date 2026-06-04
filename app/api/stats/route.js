import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Demand from "@/models/Demand";
import Project from "@/models/Project";

export async function GET() {
  try {
    await connectDB();

    const [
      totalDemands,
      newDemands,
      evaluationDemands,
      approvedDemands,
      rejectedDemands,
      totalProjects,
      planningProjects,
      executionProjects,
      testingProjects,
      completedProjects,
    ] = await Promise.all([
      Demand.countDocuments(),
      Demand.countDocuments({ state: "Nuevo" }),
      Demand.countDocuments({ state: "En evaluación" }),
      Demand.countDocuments({ state: "Aprobado" }),
      Demand.countDocuments({ state: "Rechazado" }),
      Project.countDocuments(),
      Project.countDocuments({ state: "Planificación" }),
      Project.countDocuments({ state: "Ejecución" }),
      Project.countDocuments({ state: "En pruebas" }),
      Project.countDocuments({ state: "Completado" }),
    ]);

    return NextResponse.json({
      demands: {
        total: totalDemands,
        nuevo: newDemands,
        evaluacion: evaluationDemands,
        aprobado: approvedDemands,
        rechazado: rejectedDemands,
      },
      projects: {
        total: totalProjects,
        planificacion: planningProjects,
        ejecucion: executionProjects,
        pruebas: testingProjects,
        completado: completedProjects,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener estadísticas", details: error.message },
      { status: 500 }
    );
  }
}