"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";

export default function DemoActions() {
  const { fetchAllData, setMessage, clearMessage } = useAppContext();
  const [loadingSeed, setLoadingSeed] = useState(false);
  const [loadingClear, setLoadingClear] = useState(false);

  const loadDemo = async () => {
    try {
      setLoadingSeed(true);

      const response = await fetch("/api/seed", {
        method: "POST",
      });

      const data = await response.json();
      setMessage(data.message || data.error || "Operación realizada");
      await fetchAllData();
      clearMessage();
    } catch (error) {
      setMessage("No se pudieron cargar los datos de ejemplo");
      clearMessage();
    } finally {
      setLoadingSeed(false);
    }
  };

  const clearDemo = async () => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar todos los datos de la demo?"
    );

    if (!confirmed) return;

    try {
      setLoadingClear(true);

      const response = await fetch("/api/seed/clear", {
        method: "DELETE",
      });

      const data = await response.json();
      setMessage(data.message || data.error || "Operación realizada");
      await fetchAllData();
      clearMessage();
    } catch (error) {
      setMessage("No se pudieron eliminar los datos");
      clearMessage();
    } finally {
      setLoadingClear(false);
    }
  };

  return (
    <section className="panel">
      <div className="section-title">
        <h2>Acciones de demo</h2>
      </div>

      <div className="actions">
        <button onClick={loadDemo} disabled={loadingSeed}>
          {loadingSeed ? "Cargando..." : "Cargar datos de ejemplo"}
        </button>

        <button className="danger" onClick={clearDemo} disabled={loadingClear}>
          {loadingClear ? "Eliminando..." : "Vaciar base de datos"}
        </button>
      </div>
    </section>
  );
}