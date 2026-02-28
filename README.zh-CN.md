# Crisis Simulation Game - 危機管理模擬系統

![Crisis Sim](docs/screenshots/01-login.png)

一個互動式的企業危機管理教育模擬系統，幫助學習者在高壓情境下培養決策思維、危機應對與策略規劃能力。

---

## 目錄

1. [系統特色](#系統特色)
2. [技術架構](#技術架構)
3. [功能模組](#功能模組)
4. [操作教學](#操作教學)
5. [安裝指南](#安裝指南)
6. [API 接口](#api-接口)
7. [項目結構](#項目結構)
8. [部署說明](#部署說明)
9. [開發者指南](#開發者指南)

---

## 系統特色

### 🎮 沉浸式學習體驗

- **4 個互動小遊戲** - 培養危機敏感度與分析能力
- **3 個危機情境** - 模擬真實企業危機決策
- **即時分數反饋** - 四維度評估決策效果

### 📊 多維度評估系統

| 維度 | 說明 | 評估指標 |
|------|------|----------|
| 經濟 Economy | 財務影響、投資者信心 | 成本效益、風險暴露 |
| 環境 Environment | 生態影響、可持續性 | 環境修復、長期影響 |
| 合規 Legitimacy | 公眾信任、品牌聲譽 | 媒體反應、監管合規 |
| 韌性 Resilience | 營運連續性、適應能力 | 恢復速度、應變機制 |

### 🏆 成績比較系統

- 與同期學生比較排名
- 詳細維度分析
- 雷達圖可視化（規劃中）

---

## 技術架構

```
┌─────────────────────────────────────────────────────┐
│                   Frontend                          │
│   Next.js 16 + React 19 + Tailwind CSS 4           │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   State Management                  │
│   Zustand (Client State)                           │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   API Layer                          │
│   Next.js API Routes (App Router)                  │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   Database                          │
│   PostgreSQL (Neon Serverless)                     │
└─────────────────────────────────────────────────────┘
```

### 技術棧

- **框架**: Next.js 16 (App Router + Turbopack)
- **UI**: React 19, Tailwind CSS 4
- **狀態管理**: Zustand
- **數據庫**: PostgreSQL (Neon Serverless)
- **導出**: XLSX

---

## 功能模組

### 1. 登入系統

![Login](docs/screenshots/01-login.png)

輸入暱稱即可開始體驗，無需註冊。

### 2. 知情同意

![Consent](docs/screenshots/03-consent.png)

說明數據收集用途，確保學術倫理合規。

### 3. 小遊戲模組

#### Mini-Game 1: 優先排序

![Mini-Game 1](docs/screenshots/05-mini-game-1.png)

根據利害關係人的角色，選擇他們最關心的 3 個議題。

#### Mini-Game 2: 張力識別

![Mini-Game 2](docs/screenshots/06-mini-game-2.png)

識別危機中不同立場的衝突點。

#### Mini-Game 3: 訊息可信度

![Mini-Game 3](docs/screenshots/07-mini-game-3.png)

評估不同資訊來源的可信度。

#### Mini-Game 4: 影響預測

![Mini-Game 4](docs/screenshots/08-mini-game-4.png)

預測決策的多元影響。

### 4. 簡報過渡頁

![Briefing](docs/screenshots/09-briefing.png)

預覽即將面對的四維度評估框架。

### 5. 危機情境

#### Scenario 1: 緊急應變

![Scenario](docs/screenshots/10-scenario-1.png)

危機爆發初期，資訊不完全時的初始決策。

#### Scenario 2: 恢復與問責

![Scenario 2](docs/screenshots/11-scenario-2.png)

短期穩定後的責任歸屬與補救措施。

#### Scenario 3: 長期定位

![Scenario 3](docs/screenshots/12-scenario-3.png)

為未來韌性進行的策略佈局。

### 6. 成績比較

![Comparison](docs/screenshots/13-comparison.png)

與同期學習者比較四維度表現與排名。

### 7. 反思筆記

![Reflection](docs/screenshots/14-reflection.png)

強制性反思環節，記錄學習心得與改進建議。

### 8. 完成頁面

![Finish](docs/screenshots/15-finish.png)

感謝參與，數據已記錄。

### 9. 管理員儀表板

![Admin](docs/screenshots/16-admin.png)

查看所有學習記錄、導出數據。

---

## 操作教學

### 基本流程

```
登入 → 同意 → 小遊戲(1-4) → 情境(1-3) → 比較 → 反思 → 完成
```

### 逐步指南

#### Step 1: 開始體驗

1. 訪問 http://localhost:3000
2. 輸入暱稱（如 `Alex`）
3. 點擊「Start Simulation」

#### Step 2: 閱讀同意書

1. 勾選「我同意」
2. 點擊「Continue to Simulation」

#### Step 3: 完成小遊戲

每個小遊戲需要完成指定任務：

| 小遊戲 | 任務 |
|--------|------|
| MG-1 | 為每個利害關係人選擇 3 個最關心的議題 |
| MG-2 | 識別各方立場的張力點 |
| MG-3 | 排列訊息來源的可信度 |
| MG-4 | 預測不同決策的影響 |

#### Step 4: 情境決策

![Scenario Mobile](docs/screenshots/18-mobile-scenario.png)

每個情境提供 5 個選項，選擇後會即時計算分數影響。

#### Step 5: 查看結果

完成後查看：
- 總分（400 分滿分）
- 四維度分數
- 排名百分比

#### Step 6: 提交反思

回答 6 個結構化問題 + 1 個開放式建議。

---

## 安裝指南

### 前置需求

- Node.js 18+
- PostgreSQL 數據庫（可使用 Neon 免費方案）

### 安裝步驟

```bash
# 1. 克隆項目
git clone https://github.com/Kenneth0416/crisis-sim.git
cd crisis-sim

# 2. 安裝依賴
npm install

# 3. 創建環境變量
# 創建 .env.local 文件
echo "DATABASE_URL=your_neon_database_url" > .env.local

# 4. 初始化數據庫
curl http://localhost:3000/api/init-db

# 5. 啟動開發服務器
npm run dev
```

訪問 http://localhost:3000 開始體驗。

### Docker 部署（可選）

```bash
# 使用 Docker Compose
docker-compose up -d
```

---

## API 接口

| 接口 | 方法 | 說明 |
|------|------|------|
| `/api/init-db` | GET | 初始化數據庫表 |
| `/api/session` | POST | 創建遊戲會話 |
| `/api/session` | PUT | 更新迷你遊戲結果 |
| `/api/session` | PATCH | 更新反思內容 |
| `/api/event` | POST | 記錄用戶行為事件 |
| `/api/comparison` | GET | 獲取成績比較數據 |
| `/api/export` | GET | 導出為 XLSX |
| `/api/admin` | GET | 管理員獲取所有數據 |
| `/api/admin` | DELETE | 刪除指定會話 |

---

## 項目結構

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # 管理員儀表板
│   ├── api/               # API 路由
│   │   ├── init-db/      # 數據庫初始化
│   │   ├── session/      # 會話管理
│   │   ├── event/        # 事件記錄
│   │   ├── comparison/   # 成績比較
│   │   ├── export/       # 數據導出
│   │   └── admin/        # 管理員接口
│   ├── briefing/         # 簡報過渡頁
│   ├── comparison/       # 成績比較頁
│   ├── consent/          # 知情同意頁
│   ├── finish/           # 完成頁
│   ├── login/            # 登入頁
│   ├── mini-game/       # 4個小遊戲
│   │   ├── 1/
│   │   ├── 2/
│   │   ├── 3/
│   │   └── 4/
│   ├── reflection/       # 反思頁
│   └── scenario/         # 3個危機情境
│       └── [id]/
├── components/            # 共享組件
│   ├── Header.tsx        # 頂部導航
│   └── ProgressBar.tsx   # 進度條
└── lib/                   # 工具函數
    ├── db.ts             # 數據庫連接
    ├── game-data.ts      # 遊戲配置數據
    └── store.ts          # Zustand 狀態存儲
```

---

## 部署說明

### Vercel 部署（推薦）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Kenneth0416/crisis-sim)

1. 點擊上方按鈕
2. 連接 GitHub
3. 設置 `DATABASE_URL` 環境變量
4. 部署完成

### 環境變量

| 變量 | 說明 | 示例 |
|------|------|------|
| `DATABASE_URL` | Neon PostgreSQL 連接字符串 | `postgres://user:pass@host/neon` |

---

## 開發者指南

### 運行測試

```bash
npm test
```

### 截圖指南

```bash
# 安裝 Playwright
npm install -D playwright @playwright/test

# 啟動開發服務器
npm run dev

# 運行截圖腳本
node screenshot.js
```

截圖保存在 `docs/screenshots/` 目錄。

### 添加新情境

1. 編輯 `src/lib/game-data.ts` 中的 `SCENARIOS` 數組
2. 定義情境標題、描述、5 個可選決策
3. 每個決策包含：名稱、圖標、後果、維度分數

### 添加新小遊戲

1. 在 `src/app/mini-game/` 創建新目錄
2. 實現遊戲邏輯組件
3. 更新 `src/lib/game-data.ts` 中的遊戲列表

---

## 常見問題

### Q: 數據庫連接失敗？

A: 確認 `.env.local` 中的 `DATABASE_URL` 正確，可在 Neon 儀表板獲取連接字符串。

### Q: 如何導出學生數據？

A: 訪問 `/admin` 頁面，點擊「Export XLSX」按鈕。

### Q: 支持移動端嗎？

A: 是的，響應式設計支持手機和平板訪問。

---

## 許可

本項目僅供教育和研究使用。

---

## 聯繫

如有問題，請提交 Issue 或聯繫項目維護者。