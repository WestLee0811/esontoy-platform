import { describe, expect, it } from 'vitest';
import {
  applyHCurve,
  calcBasePricePerDraw,
  calcPackPrice,
  calcSinglePriceWithSurcharge,
} from '@/lib/pricing';

describe('calcBasePricePerDraw', () => {
  it('computes base price with margin line', () => {
    const result = calcBasePricePerDraw(2000, 100, 5, 20, 0.33);
    expect(result.expectedCostPerDraw).toBeCloseTo(137.5);
    expect(result.pricePerDraw).toBeCloseTo(205.2238, 4);
  });
});

describe('applyHCurve', () => {
  it('applies multiplier based on N', () => {
    expect(applyHCurve(200, 8)).toEqual({ hMultiplier: 1.33, adjustedPrice: 266 });
    expect(applyHCurve(200, 25)).toEqual({ hMultiplier: 1.2, adjustedPrice: 240 });
  });
});

describe('calcSinglePriceWithSurcharge', () => {
  it('adds surcharge based on threshold', () => {
    expect(calcSinglePriceWithSurcharge(900)).toBe(950);
    expect(calcSinglePriceWithSurcharge(1200)).toBe(1300);
  });
});

describe('calcPackPrice', () => {
  it('rounds pack price correctly', () => {
    expect(calcPackPrice(205.2, 5)).toBe(1026);
  });
});
