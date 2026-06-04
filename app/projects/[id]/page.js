import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import DetailWorkspace from "@/components/DetailWorkspace";

async function getProject(id) {
  try {
    await connectDB();
    const project = await Project.findById(id).populate("demandId").lean();
    return project ? JSON.parse(JSON.stringify(project)) : null;
  } catch {
    return null;
  }
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("es-ES");
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return (
      <main className="container">
        <section className="panel">
          <h1>Proyecto no encontrado</h1>
          <Link href="/" className="link-button">
            Volver al inicio
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="panel">
        <div className="detail-header">
          <div>
            <p className="eyebrow">Detalle de proyecto</p>
            <h1>{project.code}</h1>
            <p className="subtitle">{project.name}</p>
          </div>

          <div className="actions">
            {project.demandId?._id && (
              <Link
                href={`/demands/${project.demandId._id}`}
                className="link-button"
              >
                Ver demanda origen
              </Link>
            )}

            <Link href="/" className="link-button secondary-link">
              Volver al inicio
            </Link>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <h3>Información general</h3>
            <p>
              <strong>Nombre:</strong> {project.name}
            </p>
            <p>
              <strong>Descripción:</strong> {project.description}
            </p>
            <p>
              <strong>Solicitado por:</strong> {project.requestedBy}
            </p>
            <p>
              <strong>Departamento:</strong> {project.department}
            </p>
            <p>
              <strong>Prioridad:</strong> {project.priority}
            </p>
            <p>
              <strong>Estado:</strong> {project.state}
            </p>
          </div>

          <div className="detail-card">
            <h3>Planificación</h3>
            <p>
              <strong>Inicio previsto:</strong>{" "}
              {formatDate(project.plannedStartDate)}
            </p>
            <p>
              <strong>Fin previsto:</strong>{" "}
              {formatDate(project.plannedEndDate)}
            </p>
            <p>
              <strong>Creado el:</strong> {formatDate(project.createdAt)}
            </p>
            <p>
              <strong>Demanda origen:</strong>{" "}
              {project.demandId?.code || "No disponible"}
            </p>
          </div>
        </div>
      </section>

      <DetailWorkspace type="project" record={project} />
    </main>
  );
}