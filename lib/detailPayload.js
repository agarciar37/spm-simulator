export function normalizeDetailPayload(body = {}) {
  const tasks = Array.isArray(body.tasks)
    ? body.tasks
        .map((task) => ({
          title: String(task.title || "").trim(),
          description: String(task.description || "").trim(),
          responsible: String(task.responsible || "").trim(),
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          status: task.status || "Pendiente",
        }))
        .filter((task) => task.title.length > 0)
    : [];

  const financing = Array.isArray(body.financing)
    ? body.financing
        .map((item) => ({
          concept: String(item.concept || "").trim(),
          amount: Number(item.amount || 0),
          provider: String(item.provider || "").trim(),
          status: item.status || "Pendiente",
        }))
        .filter((item) => item.concept.length > 0 || item.amount > 0)
    : [];

  return {
    tasks,
    financing,
    notes: String(body.notes || "").trim(),
    risks: String(body.risks || "").trim(),
  };
}