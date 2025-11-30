import { prisma } from '@/lib/prisma';
import { KunpanForm } from '@/components/kunpan/KunpanForm';

async function getItems() {
  return prisma.item.findMany({ orderBy: { createdAt: 'desc' } });
}

export default async function NewKunpanPage() {
  const items = await getItems();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">建立坤盤</h1>
        <p className="text-sm text-slate-400">
          選擇商品與成本參數，下方即時計算 33% 成本線與 H 曲線結果。
        </p>
      </div>
      {items.length === 0 ? (
        <p className="text-slate-400">請先建立至少一個 Item 後再開盤。</p>
      ) : (
        <KunpanForm items={items} />
      )}
    </div>
  );
}
