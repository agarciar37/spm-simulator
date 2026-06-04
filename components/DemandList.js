"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import StatusBadge from "./StatusBadge";
import { formatDate } from "@/lib/utils";

export default function DemandList() {
  const {
    demands,
    fetchAllData,
    setMessage,
    clearMessage,
    loading,
    setEditingDemand,
  } = useAppContext();

  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("Todos");

  const filteredDemands = useMemo(() => {
    return demands.filter((demand) => {
      const matchesSearch =
        demand.code.toLowerCase().includes(search.toLowerCase()) ||
        demand.name.toLowerCase().includes(search.toLowerCase());

      const matchesState =
        stateFilter === "Todos" || demand.state === stateFilter;

      return matchesSearch && matchesState;
    });
  }, [demands, search, stateFilter]);

  const changeDemandState = async (id, state) => {
    try {
      const response = await fetch(`/api/demands/${id}/state`, {
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
      setMessage("No se pudo actualizar la demanda");
      clearMessage();
    }
  };

  const deleteDemand = async (id) => {
    const confirmed = window.confirm("¿Seguro que quieres eliminar esta demanda?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/demands/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      setMessage(data.message || data.error || "Operación realizada");
      await fetchAllData();
      clearMessage();
    } catch {
      setMessage("No se pudo eliminar la demanda");
      clearMessage();
    }
  };

  return (
    <section className="panel">
      <div className="section-title">
        <h2>Demandas</h2>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar por código o nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Nuevo">Nuevo</option>
          <option value="En evaluación">En evaluación</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Rechazado">Rechazado</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando demandas...</p>
      ) : filteredDemands.length === 0 ? (
        <p>No hay demandas que coincidan con los filtros.</p>
      ) : (
        <div className="table-wrapper">
          <table className="records-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Solicitado por</th>
                <th>Departamento</th>
                <th>Prioridad</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Proyecto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemands.map((demand) => (
                <tr key={demand._id}>
                  <td>
                    <Link href={`/demands/${demand._id}`} className="table-link">
                      {demand.code}
                    </Link>
                  </td>
                  <td>{demand.name}</td>
                  <td>{demand.requestedBy}</td>
                  <td>{demand.department}</td>
                  <td>{demand.priority}</td>
                  <td>{formatDate(demand.plannedStartDate)}</td>
                  <td>{formatDate(demand.plannedEndDate)}</td>
                  <td>
                    <StatusBadge>{demand.state}</StatusBadge>
                  </td>
                  <td>{demand.generatedProjectId?.code || "-"}</td>
                  <td>
                    <div className="actions">
                      {!["Aprobado", "Rechazado"].includes(demand.state) && (
                        <button onClick={() => setEditingDemand(demand)}>
                          Editar
                        </button>
                      )}

                      {demand.state === "Nuevo" && (
                        <button
                          onClick={() =>
                            changeDemandState(demand._id, "En evaluación")
                          }
                        >
                          Evaluar
                        </button>
                      )}

                      {demand.state === "En evaluación" && (
                        <>
                          <button
                            onClick={() =>
                              changeDemandState(demand._id, "Aprobado")
                            }
                          >
                            Aprobar
                          </button>
                          <button
                            className="secondary"
                            onClick={() =>
                              changeDemandState(demand._id, "Rechazado")
                            }
                          >
                            Rechazar
                          </button>
                        </>
                      )}

                      {!demand.generatedProjectId && (
                        <button
                          className="danger"
                          onClick={() => deleteDemand(demand._id)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}