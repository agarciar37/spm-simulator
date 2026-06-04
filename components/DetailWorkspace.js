"use client";

import { useMemo, useState } from "react";

const emptyTask = {
  title: "",
  description: "",
  responsible: "",
  dueDate: "",
  status: "Pendiente",
};

const emptyFinancing = {
  concept: "",
  amount: "",
  provider: "",
  status: "Pendiente",
};

function toDateInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function normalizeTasks(tasks = []) {
  return tasks.map((task) => ({
    title: task.title || "",
    description: task.description || "",
    responsible: task.responsible || "",
    dueDate: toDateInput(task.dueDate),
    status: task.status || "Pendiente",
  }));
}

function normalizeFinancing(financing = []) {
  return financing.map((item) => ({
    concept: item.concept || "",
    amount: item.amount ?? "",
    provider: item.provider || "",
    status: item.status || "Pendiente",
  }));
}

export default function DetailWorkspace({ type, record }) {
  const [tasks, setTasks] = useState(normalizeTasks(record.tasks));
  const [financing, setFinancing] = useState(
    normalizeFinancing(record.financing)
  );
  const [notes, setNotes] = useState(record.notes || "");
  const [risks, setRisks] = useState(record.risks || "");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const endpoint = useMemo(
    () =>
      `/api/${type === "demand" ? "demands" : "projects"}/${
        record._id
      }/details`,
    [record._id, type]
  );

  const updateTask = (index, field, value) => {
    setTasks((previous) =>
      previous.map((task, currentIndex) =>
        currentIndex === index ? { ...task, [field]: value } : task
      )
    );
  };

  const updateFinancing = (index, field, value) => {
    setFinancing((previous) =>
      previous.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const saveDetails = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, financing, notes, risks }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "No se pudieron guardar los cambios");
        return;
      }

      setMessage(data.message || "Información guardada correctamente");
    } catch {
      setMessage("Error inesperado al guardar la información");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="panel">
      <div className="section-title">
        <div>
          <h2>Espacio de seguimiento</h2>
          <p className="section-help">
            Añade tareas pendientes, financiación, riesgos y notas de
            seguimiento.
          </p>
        </div>

        <button type="button" onClick={saveDetails} disabled={saving}>
          {saving ? "Guardando..." : "Guardar información"}
        </button>
      </div>

      {message && <div className="message-box compact">{message}</div>}

      <div className="workspace-grid">
        <article className="detail-card wide-card">
          <div className="section-title compact-title">
            <h3>Tareas pendientes</h3>
            <button
              type="button"
              onClick={() => setTasks((prev) => [...prev, emptyTask])}
            >
              Añadir tarea
            </button>
          </div>

          {tasks.length === 0 ? (
            <p>No hay tareas registradas.</p>
          ) : (
            <div className="stacked-list">
              {tasks.map((task, index) => (
                <div className="editable-row" key={`task-${index}`}>
                  <input
                    type="text"
                    placeholder="Título de la tarea"
                    value={task.title}
                    onChange={(event) =>
                      updateTask(index, "title", event.target.value)
                    }
                  />

                  <input
                    type="text"
                    placeholder="Responsable"
                    value={task.responsible}
                    onChange={(event) =>
                      updateTask(index, "responsible", event.target.value)
                    }
                  />

                  <input
                    type="date"
                    value={task.dueDate}
                    onChange={(event) =>
                      updateTask(index, "dueDate", event.target.value)
                    }
                  />

                  <select
                    value={task.status}
                    onChange={(event) =>
                      updateTask(index, "status", event.target.value)
                    }
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En curso">En curso</option>
                    <option value="Bloqueada">Bloqueada</option>
                    <option value="Completada">Completada</option>
                  </select>

                  <textarea
                    placeholder="Descripción / comentarios"
                    value={task.description}
                    onChange={(event) =>
                      updateTask(index, "description", event.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="danger small-button"
                    onClick={() =>
                      setTasks((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    Eliminar tarea
                  </button>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="detail-card wide-card">
          <div className="section-title compact-title">
            <h3>Financiación</h3>
            <button
              type="button"
              onClick={() =>
                setFinancing((prev) => [...prev, emptyFinancing])
              }
            >
              Añadir financiación
            </button>
          </div>

          {financing.length === 0 ? (
            <p>No hay financiación registrada.</p>
          ) : (
            <div className="stacked-list">
              {financing.map((item, index) => (
                <div
                  className="editable-row finance-row"
                  key={`financing-${index}`}
                >
                  <input
                    type="text"
                    placeholder="Concepto"
                    value={item.concept}
                    onChange={(event) =>
                      updateFinancing(index, "concept", event.target.value)
                    }
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Importe"
                    value={item.amount}
                    onChange={(event) =>
                      updateFinancing(index, "amount", event.target.value)
                    }
                  />

                  <input
                    type="text"
                    placeholder="Proveedor / área"
                    value={item.provider}
                    onChange={(event) =>
                      updateFinancing(index, "provider", event.target.value)
                    }
                  />

                  <select
                    value={item.status}
                    onChange={(event) =>
                      updateFinancing(index, "status", event.target.value)
                    }
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Solicitada">Solicitada</option>
                    <option value="Aprobada">Aprobada</option>
                    <option value="Rechazada">Rechazada</option>
                  </select>

                  <button
                    type="button"
                    className="danger small-button"
                    onClick={() =>
                      setFinancing((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    Eliminar financiación
                  </button>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="detail-card">
          <h3>Riesgos / bloqueos</h3>
          <textarea
            className="large-textarea"
            placeholder="Riesgos, bloqueos, dependencias o puntos de atención"
            value={risks}
            onChange={(event) => setRisks(event.target.value)}
          />
        </article>

        <article className="detail-card">
          <h3>Notas de seguimiento</h3>
          <textarea
            className="large-textarea"
            placeholder="Notas generales, acuerdos, decisiones o próximos pasos"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </article>
      </div>
    </section>
  );
}