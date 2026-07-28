const SETTLEMENT_PRICES = {
  1: 8.0, // Bolillo
  2: 9.0, // Pieza
  3: 9.5, // Reposteria
};

export const getSettlementPrice = (idCategoria) => {
  return SETTLEMENT_PRICES[idCategoria] ?? 0;
};
