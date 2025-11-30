import { prisma } from '@/lib/prisma';

async function getKunpans() {
  return prisma.kunPan.findMany({
    include: { item: true },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function KunpanListPage() {
  const kunpans = await getKunpans();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">我的坤盤</h1>
        <p className="text-sm text-slate-400">列出目前資料庫中的所有坤盤（先不做登入）。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {kunpans.length === 0 && <p className="text-slate-400">尚無坤盤，前往 /kunpan/new 建立。</p>}
        {kunpans.map((kunpan) => (
          <div key={kunpan.id} className="glow-card p-5 space-y-2">
            <p className="text-lg font-semibold text-night-neon">{kunpan.item?.name ?? '未設定商品'}</p>
            <p className="text-sm text-slate-400">品牌：{kunpan.item?.brand ?? '-'}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span>洞數 N：{kunpan.totalSlots}</span>
              <span>slotPrice：${kunpan.slotPrice}</span>
              <span>大獎成本：${kunpan.grandPrizeCost}</span>
              <span>大獎數量：1</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
