'use client';

import { useEffect, useState } from 'react';

type OverviewResponse = {
  currentPR: number;
  energyPercent: number;
  discountPercent: number;
  discountStage: string;
  todayKunpanCount: number;
};

const initialState: OverviewResponse = {
  currentPR: 0,
  energyPercent: 0,
  discountPercent: 0,
  discountStage: '<20%',
  todayKunpanCount: 0,
};

export function OverviewWidget() {
  const [overview, setOverview] = useState<OverviewResponse>(initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await fetch('/api/dashboard/overview', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load overview');
        }
        const data = (await response.json()) as OverviewResponse;
        if (mounted) {
          setOverview(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="grid gap-6 md:grid-cols-3">
      <div className="glow-card p-6">
        <p className="section-title mb-2">靈脈 PR</p>
        {isLoading ? <p>Loading...</p> : <p className="text-3xl font-bold">{overview.currentPR.toLocaleString()}</p>}
        <p className="text-sm text-slate-400">energy%：{overview.energyPercent.toFixed(2)}%</p>
      </div>
      <div className="glow-card p-6">
        <p className="section-title mb-2">折扣階段</p>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p className="text-3xl font-bold">{overview.discountPercent}%</p>
            <p className="text-sm text-slate-400">目前階段：{overview.discountStage}</p>
          </>
        )}
      </div>
      <div className="glow-card p-6">
        <p className="section-title mb-2">今日新坤盤</p>
        {isLoading ? <p>Loading...</p> : <p className="text-3xl font-bold">{overview.todayKunpanCount}</p>}
        <p className="text-sm text-slate-400">透過 /api/dashboard/overview 即時同步</p>
      </div>
    </section>
  );
}
