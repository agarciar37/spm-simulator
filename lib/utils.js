export function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("es-ES");
}