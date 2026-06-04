import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Demand from "@/models/Demand";
import { formatCode, getNextSequence } from "@/lib/counters";

export async function GET() {
  try {
    await connectDB();

    const demands = await Demand.find()
      .populate("generatedProjectId")
      .sort({ createdAt: -1 });

    return NextResponse.json(demands);
  } catch (error) {
    console.error("ERROR AL OBTENER DEMANDAS:", error);

    return NextResponse.json(
      { error: "Error al obtener demandas", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    console.log("BODY RECIBIDO EN POST /api/demands:", body);

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

    if (new Date(plannedStartDate) > new Date(plannedEndDate)) {
      return NextResponse.json(
        { error: "La fecha de inicio no puede ser posterior a la fecha de fin" },
        { status: 400 }
      );
    }

    const sequence = await getNextSequence("demand");
    const code = formatCode("DMND", sequence);

    const demand = await Demand.create({
      code,
      name,
      description,
      requestedBy,
      department,
      priority: priority || "Media",
      plannedStartDate: new Date(plannedStartDate),
      plannedEndDate: new Date(plannedEndDate),
      state: "Nuevo",
    });

    return NextResponse.json(demand, { status: 201 });
  } catch (error) {
    console.error("ERROR AL CREAR DEMANDA:", error);

    return NextResponse.json(
      { error: "Error al crear la demanda", details: error.message },
      { status: 500 }
    );
  }
}