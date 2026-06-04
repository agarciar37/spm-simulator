"use client";

import { useAppContext } from "@/context/AppContext";

export default function StatsChart() {
  const { stats } = useAppContext();

  const chartData = [
    {
      label: "Nuevas",
      value: stats?.demands?.nuevo ?? 0,
    },
    {
      label: "Evaluación",
      value: stats?.demands?.evaluacion ?? 0,
    },
    {
      label: "Aprobadas",
      value: stats?.demands?.aprobado ?? 0,
    },
    {
      label: "Rechazadas",
      value: stats?.demands?.rechazado ?? 0,
    },
    {
      label: "Planificación",
      value: stats?.projects?.planificacion ?? 0,
    },
    {
      label: "Ejecución",
      value: stats?.projects?.ejecucion ?? 0,
    },
    {
      label: "Pruebas",
      value: stats?.projects?.pruebas ?? 0,
    },
    {
      label: "Completados",
      value: stats?.projects?.completado ?? 0,
    },
  ];

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);

  return (
    <section className="panel">
      <div className="section-title">
        <h2>Resumen visual de estados</h2>
      </div>

      <div className="chart-grid">
        {chartData.map((item) => (
          <div key={item.label} className="chart-item">
            <div className="chart-bar-wrapper">
              <div
                className="chart-bar"
                style={{ height: `${(item.value / maxValue) * 180}px` }}
              />
            </div>
            <p className="chart-value">{item.value}</p>
            <p className="chart-label">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}