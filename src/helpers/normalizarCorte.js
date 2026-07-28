export const normalizarCortePorTurno = (rows = []) => {
  const resultado = {
    turnos: {},
    totalGeneral: 0,
  };

  for (const row of rows) {
    const turno = row.turno;
    const categoria = row.categoria;
    const total = Number(row.total_por_categoria);

    if (!resultado.turnos[turno]) {
      resultado.turnos[turno] = {
        total: 0,
        categorias: [],
      };
    }
    resultado.turnos[turno].categorias.push({
      categoria,
      total,
    });

    resultado.turnos[turno].total += total;
    resultado.totalGeneral += total;
  }
  return resultado;
};
