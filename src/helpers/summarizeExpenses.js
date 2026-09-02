/**
 *
 * @param {*} expenses
 * @returns Calcula el total de gastos confirmados en el turno.
 */

export const summarizeExpenses = (expenses) => {
  const totalGastos = expenses.reduce(
    (total, expense) => total + Number(expense.monto),
    0,
  );

  return { totalGastos };
};
