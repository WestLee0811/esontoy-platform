# Esontoy Platform MVP

一個以 Next.js 14 App Router + Prisma + SQLite 打造的營運控制台，聚焦坤盤（KunPan）開盤邏輯、33% 成本線、H 曲線與靈脈 PR 儀表板。

## 開發環境準備

1. 安裝依賴

```bash
npm install
```

> 提示：本專案尚未產生 `node_modules`，首次開發請先安裝依賴。若環境無法連網，可以先調整代理或使用離線套件來源。

2. 啟動開發伺服器

```bash
npm run dev
```

3. Prisma Migrate（建置 SQLite）

```bash
# 設定資料庫連線字串，預設為 prisma/dev.db
export DATABASE_URL="file:./prisma/dev.db"

# 初始化資料庫 schema
npx prisma migrate dev --name init
```

4. 產生 Prisma Client（每次調整 schema 都要）

```bash
npx prisma generate
```

5. 單元測試

```bash
npm run test
```

## 專案結構

```
prisma/
  schema.prisma        # User/Item/KunPan/LedgerStar/RPLog/Config 等模型
src/
  app/
    page.tsx           # 首頁，使用 /api/dashboard/overview 顯示儀表板
    kunpan/
      page.tsx         # 列出所有坤盤卡片
      new/page.tsx     # 建立坤盤表單（含即時計價）
    admin/page.tsx     # 管理儀表板 + RPLog 表格
    api/
      dashboard/overview/route.ts # 聚合靈脈 PR、energy%、折扣階段 API
      kunpan/create/route.ts      # 建立坤盤 API，套用 33% 成本線與 H 曲線
  components/
    dashboard/OverviewWidget.tsx  # 前台儀表板卡片
    kunpan/KunpanForm.tsx         # 建盤表單 + 即時計算
  lib/
    pricing.ts          # calcBasePricePerDraw/applyHCurve/... 純函式
    dashboard.ts        # 共用的儀表板聚合邏輯
    prisma.ts           # PrismaClient 單例
  tests/
    pricing.test.ts     # 使用 Vitest 驗證成本與加價函式
```

## 核心商業邏輯備註

- **33% 成本洞**：`calcBasePricePerDraw` 先計算每洞預期成本，再除以 `1 - marginRatio` 取得基礎單抽價，並於 `route.ts` 與 `KunpanForm` 中重複使用。
- **H 曲線**：`applyHCurve` 依洞數 N 給定 1.33～1.0 的倍率，API 建盤時將倍率寫入 `curveH` 欄位，也會把 H 後價格當作 `slotPrice`。
- **單抽 / 五抽 / 十抽**：`calcSinglePriceWithSurcharge` 透過 +50 / +100 元規則讓單抽比五抽平均價高，`calcPackPrice` 則不再折扣。
- **靈脈 PR 聚合**：`getDashboardOverview` / `/api/dashboard/overview` 會統計 `RPLog.amount`、比對 `Config.energyT100` 計算 energy%，並以階梯邏輯決定 0/1/3/5/7% 折扣，同時回報今日新坤盤數量。

## Tailwind 主題

`src/app/globals.css` 與 `tailwind.config.ts` 以夜空 + 霓虹為主，提供簡易遊戲 UI 風格（`glow-card`、`section-title` 等工具類別）。

## 待辦備註

- Prisma schema 已預留註解，下一階段可加入 QianPan、DragonRealm、SealedStone 等 Model。
- 目前尚未整合認證，`KunPan` 列表與表單以 demo ownerId 代表。未來可串接真實使用者系統。
