# 時值 (Lifetime Finance) — Claude Code 工作說明

## 專案概述
個人理財規劃 Web App，台灣用戶，繁體中文介面。
單一檔案架構：`index.html`（vanilla JS + Chart.js + Supabase）

**GitHub Pages URL**: `https://jcnmlm-ui.github.io/shizhi/`
**本地路徑**: `C:\Users\user\shizhi\`

---

## 技術棧
- **前端**: 純 HTML / CSS / Vanilla JavaScript（無框架、無建置步驟）
- **圖表**: Chart.js（CDN）
- **後端/資料**: Supabase（PostgreSQL + Auth + RLS）
- **部署**: GitHub Pages（push 後自動部署）
- **後台管理**: `admin.html`（本機使用，不部署）

## Supabase 專案
- **Project ID**: `haxfwofjrfkjwestfzvk`
- **URL**: `https://haxfwofjrfkjwestfzvk.supabase.co`
- **Org**: 第二組織（`aqwmpkdlcnpkgrljucor`）

---

## 語言與風格規則
- 所有 UI 文字必須使用**繁體中文**
- 程式碼內的變數/函式名稱用英文
- 金額格式：`fmtMoney()` 函式，顯示 `NT$X,XXX`
- 設計風格：溫暖紙感（`--bg: #F6F2E9`）× 沉穩翠綠（`--primary: #1E6B50`）

---

## 重要架構原則
1. **單檔原則**：所有功能都在 `index.html` 裡，不拆分檔案
2. **每次改動後**必須跑 `node --check` 確認 JS 語法正確
3. **SQL 異動**：使用 idempotent 寫法（`IF NOT EXISTS`、`ON CONFLICT DO NOTHING`）
4. **RLS**：所有資料表必須啟用 Row Level Security
5. **feature flags**：功能存取透過 `canAccess(tab)` 和 `hasAddon(key)` 控制

---

## 目前功能分頁（共 17 個）

### 主要功能（所有用戶）
- 儀表板、收支、資產負債、目標、建議報告、設定

### 進階模組（完整版/訂閱制）
- 子女養育、分期採購、勞退勞保、保險防護、投資配置

### 訂閱功能
- 歷史規劃紀錄（快照）

### 加購模組（另外付費）
- 模組商店、郵局薪資試算、創業財務模板
- 開發中：房地產投報試算、綜所稅試算

---

## 商業化架構

### 方案層級
| 方案 | 功能 |
|---|---|
| 免費 | 6 個基礎功能 |
| 完整版（NT$3,980 買斷）| 所有主功能 + PDF 匯出 |
| 訂閱制（NT$99/月）| 完整版 + 歷史快照 |
| 加購模組 | 需要先有完整版或訂閱制 |

### 付款流程
匯款末五碼 → 填申請表 → 管理員在 admin.html 確認 → 手動開通

### 相關資料表
- `fp_plans`, `fp_subscriptions`, `fp_user_overrides`（方案管理）
- `fp_snapshots`（歷史快照）
- `fp_addons`, `fp_user_addons`（加購模組）
- `fp_payment_requests`（付款申請，含 addon_key）
- `fp_site_config`（站點設定，收款資訊、定價）

---

## 工作流程

### 修改 index.html 後
```bash
# 1. 確認語法
node --check index.html  # 不行，要先抽出 JS

# 2. Push 到 GitHub（GitHub Pages 自動部署）
git add index.html
git commit -m "說明改了什麼"
git push origin main
```

### 修改 Supabase DB
透過 MCP 工具直接執行 SQL（已授權 Claude Code 存取財務專案）

---

## 當前已知問題 / 待辦
請參考 `memory.md`

---

## 對話 Session 複雜度說明

每次回覆結束後，若任務難易度值得說明，請在最後附上一行評估：

```
難易度：★★☆☆☆ | Token 估計：~2,000（約佔 200K 上限的 1%）| 建議：可繼續對話
```

- **難易度**：1–5 顆星（★ = 簡單修改，★★★★★ = 跨多檔、DB 異動、架構重構）
- **Token 估計**：本次回覆大概消耗多少 token（含程式碼讀取）
- **累計估算**：長對話累積接近上限（約 150K+）時，主動提醒用戶「建議開新對話」
- **上限**：claude-sonnet-4-6 的 context window 為 200K tokens

---

## 不要做的事
- 不要修改 `supabase_setup.sql`（用獨立 migration 檔案）
- 不要把 `admin.html` push 到 GitHub（含 service_role 相關功能）
- 不要在 HTML 裡放 service_role key
- 不要改 `fp_plans.id`（源碼有硬寫對應）
- 不要改 RLS policies（從 Supabase MCP 工具操作）
