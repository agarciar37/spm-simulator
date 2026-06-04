export const DEMAND_STATES = [
  "Nuevo",
  "En evaluación",
  "Aprobado",
  "Rechazado",
];

export const PROJECT_STATES = [
  "Planificación",
  "Ejecución",
  "En pruebas",
  "Completado",
];

export const demandTransitions = {
  Nuevo: ["En evaluación"],
  "En evaluación": ["Aprobado", "Rechazado"],
  Aprobado: [],
  Rechazado: [],
};

export const projectTransitions = {
  "Planificación": ["Ejecución"],
  Ejecución: ["En pruebas"],
  "En pruebas": ["Completado"],
  Completado: [],
};

export function isValidTransition(currentState, nextState, transitions) {
  return (transitions[currentState] || []).includes(nextState);
}