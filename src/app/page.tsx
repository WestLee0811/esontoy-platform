import { OverviewWidget } from '@/components/dashboard/OverviewWidget';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">辰境儀表板</h1>
        <p className="text-sm text-slate-400">
          即時讀取 /api/dashboard/overview 的靈脈 PR、energy% 與折扣階段。
        </p>
      </div>
      <OverviewWidget />
    </div>
  );
}
