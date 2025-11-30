/**
 * 計算 33% 成本洞邏輯下的單抽基礎價格。
 */
export function calcBasePricePerDraw(
  grandPrizeCost: number,
  smallPrizeUnitCost: number,
  smallPrizeQty: number,
  totalSlots: number,
  marginRatio: number,
  otherCostPerDraw = 0,
) {
  if (totalSlots <= 0) {
    throw new Error('totalSlots must be positive');
  }
  if (marginRatio >= 1 || marginRatio < 0) {
    throw new Error('marginRatio must be between 0 and 1');
  }
  const expectedCostPerDraw = (grandPrizeCost + smallPrizeUnitCost * smallPrizeQty) / totalSlots + otherCostPerDraw;
  const pricePerDraw = expectedCostPerDraw / (1 - marginRatio);
  return {
    expectedCostPerDraw,
    pricePerDraw,
  };
}

/**
 * 依洞數套用 H 曲線加成。
 */
export function applyHCurve(pricePerDraw: number, totalSlots: number) {
  let hMultiplier = 1;
  if (totalSlots <= 10) hMultiplier = 1.33;
  else if (totalSlots <= 20) hMultiplier = 1.25;
  else if (totalSlots <= 30) hMultiplier = 1.2;
  else if (totalSlots <= 40) hMultiplier = 1.15;
  else if (totalSlots <= 60) hMultiplier = 1.05;
  else hMultiplier = 1; // N 60~80 之間直接落到 1.0，80 以上維持 1.0

  const adjustedPrice = pricePerDraw * hMultiplier;
  return { hMultiplier, adjustedPrice };
}

/**
 * 單抽加價邏輯：比五抽平均價多 50 元，若 >1000 則加 100。
 */
export function calcSinglePriceWithSurcharge(pricePerDrawH: number) {
  const surcharge = pricePerDrawH > 1000 ? 100 : 50;
  return Math.round(pricePerDrawH + surcharge);
}

/**
 * 五抽／十抽組直接以 H 後單抽價相乘，不再折扣。
 */
export function calcPackPrice(pricePerDrawH: number, packSize: number) {
  if (packSize <= 0) {
    throw new Error('packSize must be positive');
  }
  return Math.round(pricePerDrawH * packSize);
}
