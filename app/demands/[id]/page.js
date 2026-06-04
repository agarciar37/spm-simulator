import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Demand from "@/models/Demand";
import DetailWorkspace from "@/components/DetailWorkspace";

async function getDemand(id) {
  try {
    await connectDB();
    const demand = await Demand.findById(id).populate("generatedProjectId").lean();
    return demand ? JSON.parse(JSON.stringify(demand)) : null;
  } catch {
    return null;
  }
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("es-ES");
}

export default async function DemandDetailPage({ params }) {
  const { id } = await params;
  const demand = await getDemand(id);

  if (!demand) {
    return (
      <main className="container">
        <section className="panel">
          <h1>Demanda no encontrada</h1>
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
            <p className="eyebrow">Detalle de demanda</p>
            <h1>{demand.code}</h1>
            <p className="subtitle">{demand.name}</p>
          </div>

          <div className="actions">
            {demand.generatedProjectId?._id && (
              <Link
                href={`/projects/${demand.generatedProjectId._id}`}
                className="link-button"
              >
                Ver proyecto generado
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
              <strong>Nombre:</strong> {demand.name}
            </p>
            <p>
              <strong>Descripción:</strong> {demand.description}
            </p>
            <p>
              <strong>Solicitado por:</strong> {demand.requestedBy}
            </p>
            <p>
              <strong>Departamento:</strong> {demand.department}
            </p>
            <p>
              <strong>Prioridad:</strong> {demand.priority}
            </p>
            <p>
              <strong>Estado:</strong> {demand.state}
            </p>
          </div>

          <div className="detail-card">
            <h3>Planificación</h3>
            <p>
              <strong>Inicio previsto:</strong>{" "}
              {formatDate(demand.plannedStartDate)}
            </p>
            <p>
              <strong>Fin previsto:</strong>{" "}
              {formatDate(demand.plannedEndDate)}
            </p>
            <p>
              <strong>Creado el:</strong> {formatDate(demand.createdAt)}
            </p>
            <p>
              <strong>Proyecto generado:</strong>{" "}
              {demand.generatedProjectId?.code || "No generado"}
            </p>
          </div>
        </div>
      </section>

      <DetailWorkspace type="demand" record={demand} />
    </main>
  );
}