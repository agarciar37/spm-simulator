import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Demand from "@/models/Demand";
import Project from "@/models/Project";
import Counter from "@/models/Counter";

export async function POST() {
  try {
    await connectDB();

    const existingDemands = await Demand.countDocuments();

    if (existingDemands > 0) {
      return NextResponse.json(
        { error: "Ya existen datos. Borra la base si quieres volver a sembrar." },
        { status: 400 }
      );
    }

    const demand1 = await Demand.create({
      code: "DMND00001",
      name: "Implantación de portal de proveedores",
      description: "Crear un portal para la gestión de proveedores y seguimiento de solicitudes.",
      requestedBy: "Álvaro García",
      department: "Compras",
      priority: "Alta",
      plannedStartDate: new Date("2026-04-15"),
      plannedEndDate: new Date("2026-05-20"),
      state: "Nuevo",
    });

    const demand2 = await Demand.create({
      code: "DMND00002",
      name: "Automatización de aprobaciones IT",
      description: "Automatizar el circuito de aprobaciones para peticiones IT internas.",
      requestedBy: "Lucía Martín",
      department: "IT",
      priority: "Media",
      plannedStartDate: new Date("2026-04-18"),
      plannedEndDate: new Date("2026-05-10"),
      state: "En evaluación",
    });

    const demand3 = await Demand.create({
      code: "DMND00003",
      name: "Cuadro de mando de capacidad",
      description: "Desarrollar una vista ejecutiva con indicadores de capacidad y carga.",
      requestedBy: "Carlos Pérez",
      department: "PMO",
      priority: "Alta",
      plannedStartDate: new Date("2026-04-10"),
      plannedEndDate: new Date("2026-06-10"),
      state: "Aprobado",
    });

    const project1 = await Project.create({
      code: "PRJ00001",
      demandId: demand3._id,
      name: demand3.name,
      description: demand3.description,
      requestedBy: demand3.requestedBy,
      department: demand3.department,
      priority: demand3.priority,
      plannedStartDate: demand3.plannedStartDate,
      plannedEndDate: demand3.plannedEndDate,
      state: "Planificación",
    });

    demand3.generatedProjectId = project1._id;
    await demand3.save();

    await Counter.findOneAndUpdate(
      { key: "demand" },
      { value: 3 },
      { upsert: true }
    );

    await Counter.findOneAndUpdate(
      { key: "project" },
      { value: 1 },
      { upsert: true }
    );

    return NextResponse.json({
      message: "Datos de ejemplo cargados correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al cargar datos de ejemplo", details: error.message },
      { status: 500 }
    );
  }
}