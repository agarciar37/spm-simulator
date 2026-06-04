import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find()
      .populate("demandId")
      .sort({ createdAt: -1 });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener proyectos", details: error.message },
      { status: 500 }
    );
  }
}