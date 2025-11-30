'use client';

import { useMemo, useState } from 'react';
import type { Item } from '@prisma/client';
import { applyHCurve, calcBasePricePerDraw, calcPackPrice, calcSinglePriceWithSurcharge } from '@/lib/pricing';

type Props = {
  items: Item[];
};

export function KunpanForm({ items }: Props) {
  const [form, setForm] = useState({
    ownerId: 'demo-user',
    itemId: items[0]?.id ?? '',
    totalSlots: 20,
    grandPrizeCost: 2000,
    smallPrizeUnitCost: 100,
    smallPrizeQty: 10,
    otherCostPerDraw: 0,
    marginRatio: 0.33,
  });
  const [message, setMessage] = useState<string>('');

  const pricing = useMemo(() => {
    try {
      const base = calcBasePricePerDraw(
        form.grandPrizeCost,
        form.smallPrizeUnitCost,
        form.smallPrizeQty,
        form.totalSlots,
        form.marginRatio,
        form.otherCostPerDraw,
      );
      const curve = applyHCurve(base.pricePerDraw, form.totalSlots);
      const single = calcSinglePriceWithSurcharge(curve.adjustedPrice);
      const pack5 = calcPackPrice(curve.adjustedPrice, 5);
      const pack10 = calcPackPrice(curve.adjustedPrice, 10);
      return {
        base: base.pricePerDraw,
        h: curve.hMultiplier,
        slot: Math.round(curve.adjustedPrice),
        single,
        pack5,
        pack10,
      };
    } catch (error) {
      return null;
    }
  }, [form]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/api/kunpan/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? '建立失敗');
      }
      setMessage('建立成功！slotPrice = ' + data.pricing.slotPrice);
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  const isDisabled = items.length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm md:col-span-2">
          <span>Owner ID</span>
          <input
            type="text"
            className="w-full rounded bg-night-900/60 p-2"
            value={form.ownerId}
            onChange={(event) => setForm((prev) => ({ ...prev, ownerId: event.target.value }))}
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>商品</span>
          <select
            className="w-full rounded bg-night-900/60 p-2"
            value={form.itemId}
            onChange={(event) => setForm((prev) => ({ ...prev, itemId: event.target.value }))}
            disabled={isDisabled}
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <span>洞數 N</span>
          <input
            type="number"
            className="w-full rounded bg-night-900/60 p-2"
            value={form.totalSlots}
            onChange={(event) => setForm((prev) => ({ ...prev, totalSlots: Number(event.target.value) }))}
            min={1}
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>大獎成本 (元)</span>
          <input
            type="number"
            className="w-full rounded bg-night-900/60 p-2"
            value={form.grandPrizeCost}
            onChange={(event) => setForm((prev) => ({ ...prev, grandPrizeCost: Number(event.target.value) }))}
            min={0}
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>小賞成本 (元)</span>
          <input
            type="number"
            className="w-full rounded bg-night-900/60 p-2"
            value={form.smallPrizeUnitCost}
            onChange={(event) => setForm((prev) => ({ ...prev, smallPrizeUnitCost: Number(event.target.value) }))}
            min={0}
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>小賞數量 K</span>
          <input
            type="number"
            className="w-full rounded bg-night-900/60 p-2"
            value={form.smallPrizeQty}
            onChange={(event) => setForm((prev) => ({ ...prev, smallPrizeQty: Number(event.target.value) }))}
            min={0}
            required
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>其他成本 / 抽</span>
          <input
            type="number"
            className="w-full rounded bg-night-900/60 p-2"
            value={form.otherCostPerDraw}
            onChange={(event) => setForm((prev) => ({ ...prev, otherCostPerDraw: Number(event.target.value) }))}
            min={0}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>安全線 marginRatio</span>
          <input
            type="number"
            step="0.01"
            className="w-full rounded bg-night-900/60 p-2"
            value={form.marginRatio}
            onChange={(event) => setForm((prev) => ({ ...prev, marginRatio: Number(event.target.value) }))}
            min={0.01}
            max={0.99}
            required
          />
        </label>
      </div>
      <div className="glow-card p-4 text-sm">
        <p>基礎單抽價（33% 成本線）：{pricing ? pricing.base.toFixed(2) : '-'}</p>
        <p>H 曲線倍率：{pricing ? pricing.h.toFixed(2) : '-'}</p>
        <p>H 後單抽價：{pricing ? pricing.slot : '-'}</p>
        <p>單抽售價（加價）：{pricing ? pricing.single : '-'}</p>
        <p>五抽售價：{pricing ? pricing.pack5 : '-'}</p>
        <p>十抽售價：{pricing ? pricing.pack10 : '-'}</p>
      </div>
      <button
        type="submit"
        disabled={isDisabled}
        className="rounded bg-night-accent px-6 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-600"
      >
        建立坤盤
      </button>
      {message && <p className="text-sm text-night-neon">{message}</p>}
    </form>
  );
}
