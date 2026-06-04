import Link from "next/link";

async function getDemand(id) {
  const response = await fetch(`http://localhost:3000/api/demands/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
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

          <Link href="/" className="link-button">
            Volver al inicio
          </Link>
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <h3>Información general</h3>
            <p><strong>Nombre:</strong> {demand.name}</p>
            <p><strong>Descripción:</strong> {demand.description}</p>
            <p><strong>Solicitado por:</strong> {demand.requestedBy}</p>
            <p><strong>Departamento:</strong> {demand.department}</p>
            <p><strong>Prioridad:</strong> {demand.priority}</p>
            <p><strong>Estado:</strong> {demand.state}</p>
          </div>

          <div className="detail-card">
            <h3>Planificación</h3>
            <p><strong>Inicio previsto:</strong> {formatDate(demand.plannedStartDate)}</p>
            <p><strong>Fin previsto:</strong> {formatDate(demand.plannedEndDate)}</p>
            <p><strong>Creado el:</strong> {formatDate(demand.createdAt)}</p>
            <p>
              <strong>Proyecto generado:</strong>{" "}
              {demand.generatedProjectId?.code || "No generado"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}