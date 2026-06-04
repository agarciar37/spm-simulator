import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Demand from "@/models/Demand";
import Project from "@/models/Project";
import Counter from "@/models/Counter";

export async function DELETE() {
  try {
    await connectDB();

    await Promise.all([
      Demand.deleteMany({}),
      Project.deleteMany({}),
      Counter.deleteMany({}),
    ]);

    return NextResponse.json({
      message: "Datos eliminados correctamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al limpiar la base de datos", details: error.message },
      { status: 500 }
    );
  }
}