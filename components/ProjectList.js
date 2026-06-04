"use client";

import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import StatusBadge from "./StatusBadge";
import { formatDate } from "@/lib/utils";

function getNextProjectState(currentState) {
  if (currentState === "Planificación") return "Ejecución";
  if (currentState === "Ejecución") return "En pruebas";
  if (currentState === "En pruebas") return "Completado";
  return null;
}

export default function ProjectList() {
  const { projects, fetchAllData, setMessage, clearMessage, loading } =
    useAppContext();

  const changeProjectState = async (id, state) => {
    try {
      const response = await fetch(`/api/projects/${id}/state`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state }),
      });

      const data = await response.json();
      setMessage(data.message || data.error || "Operación realizada");
      await fetchAllData();
      clearMessage();
    } catch {
      setMessage("No se pudo actualizar el proyecto");
      clearMessage();
    }
  };

  const deleteProject = async (id) => {
    const confirmed = window.confirm("¿Seguro que quieres eliminar este proyecto?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      setMessage(data.message || data.error || "Operación realizada");
      await fetchAllData();
      clearMessage();
    } catch {
      setMessage("No se pudo eliminar el proyecto");
      clearMessage();
    }
  };

  return (
    <section className="panel">
      <div className="section-title">
        <h2>Proyectos</h2>
      </div>

      {loading ? (
        <p>Cargando proyectos...</p>
      ) : projects.length === 0 ? (
        <p>No hay proyectos registrados.</p>
      ) : (
        <div className="table-wrapper">
          <table className="records-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Departamento</th>
                <th>Prioridad</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Demanda origen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const nextState = getNextProjectState(project.state);

                return (
                  <tr key={project._id}>
                    <td>
                      <Link href={`/projects/${project._id}`} className="table-link">
                        {project.code}
                      </Link>
                    </td>
                    <td>{project.name}</td>
                    <td>{project.department}</td>
                    <td>{project.priority}</td>
                    <td>{formatDate(project.plannedStartDate)}</td>
                    <td>{formatDate(project.plannedEndDate)}</td>
                    <td>
                      <StatusBadge>{project.state}</StatusBadge>
                    </td>
                    <td>{project.demandId?.code || "-"}</td>
                    <td>
                      <div className="actions">
                        {nextState && (
                          <button
                            onClick={() =>
                              changeProjectState(project._id, nextState)
                            }
                          >
                            Pasar a {nextState}
                          </button>
                        )}

                        <button
                          className="danger"
                          onClick={() => deleteProject(project._id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}