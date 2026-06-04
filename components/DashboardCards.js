"use client";

import { useAppContext } from "@/context/AppContext";

export default function DashboardCards() {
  const { stats } = useAppContext();

  const cards = [
    { label: "Demandas totales", value: stats?.demands?.total ?? 0 },
    { label: "Nuevas", value: stats?.demands?.nuevo ?? 0 },
    { label: "En evaluación", value: stats?.demands?.evaluacion ?? 0 },
    { label: "Aprobadas", value: stats?.demands?.aprobado ?? 0 },
    { label: "Rechazadas", value: stats?.demands?.rechazado ?? 0 },
    { label: "Proyectos totales", value: stats?.projects?.total ?? 0 },
    { label: "En planificación", value: stats?.projects?.planificacion ?? 0 },
    { label: "En ejecución", value: stats?.projects?.ejecucion ?? 0 },
    { label: "En pruebas", value: stats?.projects?.pruebas ?? 0 },
    { label: "Completados", value: stats?.projects?.completado ?? 0 },
  ];

  return (
    <section className="cards-grid">
      {cards.map((card) => (
        <article key={card.label} className="stat-card">
          <p>{card.label}</p>
          <h3>{card.value}</h3>
        </article>
      ))}
    </section>
  );
}