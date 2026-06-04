"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";

const initialState = {
  name: "",
  description: "",
  requestedBy: "",
  department: "",
  priority: "Media",
  plannedStartDate: "",
  plannedEndDate: "",
};

export default function DemandForm() {
  const {
    fetchAllData,
    setMessage,
    clearMessage,
    editingDemand,
    setEditingDemand,
  } = useAppContext();

  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingDemand) {
      setForm({
        name: editingDemand.name || "",
        description: editingDemand.description || "",
        requestedBy: editingDemand.requestedBy || "",
        department: editingDemand.department || "",
        priority: editingDemand.priority || "Media",
        plannedStartDate: editingDemand.plannedStartDate?.slice(0, 10) || "",
        plannedEndDate: editingDemand.plannedEndDate?.slice(0, 10) || "",
      });
    } else {
      setForm(initialState);
    }
  }, [editingDemand]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const isEditing = Boolean(editingDemand);

      const response = await fetch(
        isEditing ? `/api/demands/${editingDemand._id}` : "/api/demands",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "No se pudo guardar la demanda");
        clearMessage();
        return;
      }

      setMessage(
        isEditing
          ? "Demanda actualizada correctamente"
          : `Demanda ${data.code} creada correctamente`
      );

      setForm(initialState);
      setEditingDemand(null);
      await fetchAllData();
      clearMessage();
    } catch (error) {
      setMessage("Error inesperado al guardar la demanda");
      clearMessage();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <div className="section-title">
        <h2>{editingDemand ? "Editar demanda" : "Nueva demanda"}</h2>

        {editingDemand && (
          <button
            type="button"
            className="secondary"
            onClick={() => setEditingDemand(null)}
          >
            Cancelar edición
          </button>
        )}
      </div>

      <form className="demand-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />

        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Solicitado por"
          value={form.requestedBy}
          onChange={(e) => updateField("requestedBy", e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Departamento"
          value={form.department}
          onChange={(e) => updateField("department", e.target.value)}
          required
        />

        <select
          value={form.priority}
          onChange={(e) => updateField("priority", e.target.value)}
        >
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>

        <input
          type="date"
          value={form.plannedStartDate}
          onChange={(e) => updateField("plannedStartDate", e.target.value)}
          required
        />

        <input
          type="date"
          value={form.plannedEndDate}
          onChange={(e) => updateField("plannedEndDate", e.target.value)}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting
            ? "Guardando..."
            : editingDemand
            ? "Actualizar demanda"
            : "Crear demanda"}
        </button>
      </form>
    </section>
  );
}