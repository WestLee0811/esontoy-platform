import { getDashboardOverview } from '@/lib/dashboard';
import { prisma } from '@/lib/prisma';

async function getRecentLogs() {
  return prisma.rPLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
}

export default async function AdminPage() {
  const [overview, logs] = await Promise.all([getDashboardOverview(), getRecentLogs()]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Admin 控制台</h1>
        <p className="text-sm text-slate-400">掌握靈脈 PR、energy% 與最近 PR 流水。</p>
      </div>
      <div className="glow-card p-6 space-y-2">
        <p>靈脈 PR：{overview.currentPR.toLocaleString()}</p>
        <p>energy%：{overview.energyPercent.toFixed(2)}%</p>
        <p>折扣階段：{overview.discountStage} ⇒ {overview.discountPercent}%</p>
        <p>今日新坤盤：{overview.todayKunpanCount}</p>
      </div>
      <div className="glow-card p-6">
        <p className="section-title mb-4">最近 RPLog</p>
        <table className="w-full text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="text-left">Source</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Note</th>
              <th className="text-left">CreatedAt</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-night-700/60">
                <td className="py-2">{log.source}</td>
                <td className="py-2">{log.amount}</td>
                <td className="py-2">{log.note ?? '-'}</td>
                <td className="py-2">{log.createdAt.toISOString()}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-400">
                  尚無 RPLog 紀錄
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
