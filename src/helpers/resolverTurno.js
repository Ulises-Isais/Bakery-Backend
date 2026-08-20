export const resolverTurno = (req) => {
  // Admin puede pedir ambos turnos
  if (req.role === "admin") {
    if (req.body?.turno === "mañana" || req.body?.turno === "tarde") {
      return req.body.turno;
    }
    return null; // null = ambos turnos
  }

  // Despacho tiene turno fijo desde JWT
  return req.turno;
};
