import { prisma } from '@/lib/prisma';

function resolveDiscount(percent: number) {
  if (percent < 20) return { discountPercent: 0, discountStage: '<20%' };
  if (percent < 40) return { discountPercent: 1, discountStage: '20%-40%' };
  if (percent < 60) return { discountPercent: 3, discountStage: '40%-60%' };
  if (percent < 80) return { discountPercent: 5, discountStage: '60%-80%' };
  return { discountPercent: 7, discountStage: '80%-100%' };
}

export async function getDashboardOverview() {
  const [rpAgg, config, todayKunpanCount] = await Promise.all([
    prisma.rPLog.aggregate({ _sum: { amount: true } }),
    prisma.config.findFirst({ orderBy: { createdAt: 'desc' } }),
    prisma.kunPan.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  const currentPR = rpAgg._sum.amount ?? 0;
  const energyMax = config?.energyT100 ?? 1_500_000;
  const energyPercent = Math.min(100, (currentPR / energyMax) * 100);
  const discount = resolveDiscount(energyPercent);

  return {
    currentPR,
    energyPercent,
    discountPercent: discount.discountPercent,
    discountStage: discount.discountStage,
    todayKunpanCount,
  };
}

export { resolveDiscount };
