export default function StatusBadge({ children }) {
  const getClassName = () => {
    const value = String(children).toLowerCase();

    if (value.includes("aprobado") || value.includes("completado")) {
      return "status-badge status-success";
    }

    if (value.includes("rechazado")) {
      return "status-badge status-danger";
    }

    if (value.includes("evaluación") || value.includes("pruebas")) {
      return "status-badge status-warning";
    }

    return "status-badge status-default";
  };

  return <span className={getClassName()}>{children}</span>;
}