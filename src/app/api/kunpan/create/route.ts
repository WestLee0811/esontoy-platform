import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyHCurve, calcBasePricePerDraw, calcPackPrice, calcSinglePriceWithSurcharge } from '@/lib/pricing';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      ownerId,
      itemId,
      totalSlots,
      grandPrizeCost,
      smallPrizeUnitCost,
      smallPrizeQty,
      otherCostPerDraw = 0,
      marginRatio,
    } = body;

    if (!ownerId || !itemId) {
      return NextResponse.json({ error: 'ownerId 與 itemId 必填' }, { status: 400 });
    }

    let base;
    try {
      base = calcBasePricePerDraw(
        Number(grandPrizeCost),
        Number(smallPrizeUnitCost),
        Number(smallPrizeQty),
        Number(totalSlots),
        Number(marginRatio),
        Number(otherCostPerDraw ?? 0),
      );
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
    const curve = applyHCurve(base.pricePerDraw, Number(totalSlots));
    const slotPrice = Math.round(curve.adjustedPrice);
    const singlePrice = calcSinglePriceWithSurcharge(curve.adjustedPrice);
    const pack5 = calcPackPrice(curve.adjustedPrice, 5);
    const pack10 = calcPackPrice(curve.adjustedPrice, 10);

    const kunpan = await prisma.kunPan.create({
      data: {
        ownerId,
        itemId,
        totalSlots: Number(totalSlots),
        grandPrizeCost: Number(grandPrizeCost),
        smallPrizeUnitCost: Number(smallPrizeUnitCost),
        smallPrizeQty: Number(smallPrizeQty),
        otherCostPerDraw: Number(otherCostPerDraw ?? 0),
        marginRatio: Number(marginRatio),
        curveH: curve.hMultiplier,
        slotPrice,
        status: 'active',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      include: { item: true },
    });

    return NextResponse.json(
      {
        kunpan,
        pricing: {
          basePricePerDraw: base.pricePerDraw,
          expectedCostPerDraw: base.expectedCostPerDraw,
          hMultiplier: curve.hMultiplier,
          slotPrice,
          singlePrice,
          pack5,
          pack10,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '建立坤盤失敗' }, { status: 500 });
  }
}
