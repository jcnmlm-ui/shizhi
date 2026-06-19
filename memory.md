# 時值專案 — 進度記錄

> 最後更新：2026/06/16（SortableJS 升級後）
> 此檔案記錄每次對話後的變更，供 Claude Code 跨對話保持上下文。

---

## 目前狀態總覽

| 層面 | 狀態 |
|---|---|
| 前台 (GitHub Pages) | ✅ 運作中 `jcnmlm-ui.github.io/shizhi/` |
| 後台 admin.html | ✅ 本機運作 |
| Supabase DB | ✅ 16 張表，所有 migration 已套用 |
| Edge Function get-features | ✅ 已部署（v2，含 addons） |
| 付款流程（匯款末五碼）| ✅ 前端 Modal + DB 完成，人工處理中 |
| Claude Code 環境 | ✅ 已安裝，路徑 `C:\Users\user\shizhi` |

---

## Supabase 資料庫（共 16 張表）

### 財務主表（supabase_setup.sql）
| 表 | 欄位數 |
|---|---|
| fp_settings | 35 |
| fp_incomes | 10 |
| fp_expenses | 11 |
| fp_assets | 10 |
| fp_liabilities | 9 |
| fp_goals | 11 |
| fp_children | 14 |
| fp_purchases | 10 |

### 商業化表
| 表 | 欄位數 | 說明 |
|---|---|---|
| fp_plans | 7 | 方案定義（free/full/subscription）|
| fp_subscriptions | 9 | 用戶訂閱狀態 |
| fp_user_overrides | 7 | 個別功能覆寫 |
| fp_snapshots | 12 | 歷史規劃快照（含 monthly_surplus, savings_rate, em_months）|
| fp_addons | 9 | 加購模組目錄（含 status 欄位）|
| fp_user_addons | 6 | 已購模組 |
| fp_payment_requests | 13 | 付款申請（含 duration_months、addon_key）|
| fp_site_config | 6 | 站點設定（收款資訊、定價等）|

---

## fp_site_config 目前設定值

| key | value |
|---|---|
| payment.bank_name | 永豐銀行 |
| payment.bank_code | 807 |
| payment.account_no | 19901800073505 |
| payment.account_name | 鄭家弦 |
| payment.price_full | 3980 |
| payment.price_sub | 99 |
| contact.email | jcn.mlm@gmail.com |
| contact.response_time | 1-2 個工作天 |

---

## fp_addons 目前狀態

| module_key | name | price | status |
|---|---|---|---|
| postal | 郵局薪資試算 | 99 | available |
| startup | 創業財務模板 | 299 | coming_soon |
| realestate | 房地產投報試算 | 99 | coming_soon |
| taxcalc | 綜所稅試算 | 299 | coming_soon |
| budgetai | AI 支出健檢 | 199 | coming_soon |

---

## 已完成的功能（本次開發週期）

### 商業化架構（Step 1-6）
- ✅ Step 1：fp_plans / fp_subscriptions / fp_user_overrides
- ✅ Step 2：fp_snapshots（歷史快照 UI）
- ✅ Step 3：fp_addons / fp_user_addons + Edge Function v2 + ADDON_REGISTRY
- ✅ Step 4：fp_payment_requests + PDF 付費牆 + 升級 Modal
- ✅ Step 5：fp_site_config（後台可編輯收款資訊、定價）
- ✅ Step 6：duration_months + addon_key + coming_soon 狀態

### 計算加強
- ✅ 勞保提前/延後請領增減給（每年 ±4%）
- ✅ 勞退自提從工作期現金流扣除
- ✅ 郵局年終獎金分 2月/8月 各半計入月流量
- ✅ 蒙地卡羅加入相關係數矩陣（股債 ρ=-0.15）

### 後台 admin.html
- ✅ 用戶管理、訂閱操作
- ✅ 加購模組授予/撤銷
- ✅ 功能覆寫管理
- ✅ 待審付款申請列表（區分方案升級 vs 加購模組）
- ✅ ⚙️ 網站設定（收款資訊、定價、加購模組定價/狀態）

### UX 修正
- ✅ Modal 不再點外側關閉，加「稍後再說」
- ✅ 訂閱月數計算機（1/3/6/12 月折扣）
- ✅ Email 欄位自動帶入 + 說明文字
- ✅ 登出後完整重設（基礎功能 only，清空 addons）
- ✅ Nav 只顯示已擁有的加購模組
- ✅ 模組商店三區塊（已擁有/可購買/開發中）
- ✅ coming_soon 模組點選顯示「開發中」頁
- ✅ 加購兩道牆（未付費→升級方案；已付費→加購表單）
- ✅ nav 左側捲動（overflow-y:auto）
- ✅ JSON 備份降格為折疊選項

### 收支功能（2026/06）
- ✅ ~~排序/刪除模式（緩衝 draft，儲存才生效）~~ → 已移除，見下方 SortableJS 升級
- ✅ 分類下拉（主分類不可選，子分類可選；設定頁可管理）
- ✅ 金額千位符號；報酬率顯示至小數第三位
- ✅ 頻率週期欄：monthly 時月欄顯示 —（不可輸入）；0 值顯示 —
- ✅ 頻率切換後立即重繪表格（不再需要等待或重新整理）

### 歷史快照強化（2026/06）
- ✅ 卡片展示 6 項指標：淨值、儲蓄率、緊急預備金月數、月結餘、年收入、年支出
- ✅ 淨值顯示與前一份快照的 ▲/▼ 差額
- ✅ ≥2 份快照時頂部顯示 Chart.js 趨勢圖（淨值/年收入/年支出）
- ✅ fp_snapshots 新增 monthly_surplus, savings_rate, em_months 欄位

### 拖曳排序升級為 SortableJS（2026/06，分兩步）
- ✅ 第一步：移除原生 HTML5 DnD（dragstart/dragover/drop/dragend + dragState），
  改用 SortableJS（CDN），新增 initSortable/destroySortable 通用函式
  （此時排序/刪除緩衝模式仍保留，套用在 .ro-list 上）
- ✅ 第二步：SortableJS 拖曳已經很順滑，不再需要緩衝 draft 來避免卡卡感，
  整個「排序/刪除」模式移除——收支/資產/負債/目標改成跟子女/分期採購一樣，
  表格列直接顯示拖曳握把，拖曳完立即寫回 state 並 persistOrder，沒有額外的儲存步驟
- ✅ renderEntity 現在只有一個渲染路徑：grid 前面加 22px 握把欄，
  資料列包在 `.tbl-rows`（CSS `display:contents`，不影響原本 flex 版面）讓 Sortable 綁定整個容器
- ✅ 桌面拖曳動畫更順滑，理論上手機觸控也可拖曳（touchStartThreshold:5）
- ✅ 已用 preview 模擬拖曳驗證：DOM 重排後 onEnd 立即把新順序寫回 state（incomes/expenses/assets/liabilities/goals/children 都測過）

### 新手導覽系統（2026/06）
- ✅ 登入後首次出現右下角 prompt（1.2秒延遲）：「第一次來嗎？開始導覽 / 先自己看」
- ✅ 8 個步驟：設定→收入→支出→資金流量→資產→負債→目標→儀表板
- ✅ 每步自動切換 tab，spotlight（暗色遮罩打洞）高亮目標區塊，底部固定說明卡片
- ✅ 進度點、上一步/下一步/跳過；最後一步按「完成 ✓」
- ✅ 設定頁底部有「重新開始導覽」連結
- ✅ 完成/跳過後記入 localStorage(`shizhi_tour_done=1`)，不再重複出現
- ✅ 行動裝置：卡片改直排，按鈕靠右

### Info Tooltip 系統（2026/06）
- ✅ 新增 `.tip` CSS class（15px 圓形 ⓘ 圖示）＋ JS tooltip manager（fixed 定位，不受 overflow:hidden 影響）
- ✅ 支援 hover（桌面）和 tap（手機），顯示 data-tip 屬性內容，`white-space:pre-wrap` 支援換行
- ✅ 已加說明：月/日欄標、可動用欄標、每月應投入/可行性欄標、儲蓄率、緊急預備金、
  資金流量三格KPI、勞保三格KPI、勞退四格KPI、子女養育兩格KPI、育嬰留停四個輸入格

### 子女養育補助邏輯調整（2026/06）
- ✅ 新增「育嬰留職停薪津貼」：(父投保薪資+母投保薪資)×比例%×可請月數，算出一筆額度，
  依序扣抵 0、1、2 歲的養育成本（需在子女滿3歲前請完），額度用不完不會倒貼/退費
- ✅ 移除「國中/高中教育補助」欄位——這兩項其實已經反映在 國中/高中學雜費 的金額本身
  （免學費後的淨額），原本另外扣抵是重複計算，造成混淆
- ✅ 「政府補助/津貼」說明文字改用 `<ul><li>`，育嬰留停津貼獨立一個子區塊（自己的小標題+說明+欄位），
  不再塞成一大段 `<br>·` 文字擠在輸入格上方
- ✅ 已用 preview 手算驗證：留停津貼額度=34,800×80%×6=167,040，正確吃掉 0、1 歲全部費用，
  2 歲剩 $12,960 自付，跟手算分毫不差

---

### 內容行銷 / SEO（2026/06）
- ✅ fp_posts 資料表（已透過 Claude.ai/Supabase MCP 建立，非 Claude Code 建立）
- ✅ story.html：公開故事/案例分享頁面（列表+深連結詳細頁、marked.js Markdown 渲染、篩選 tabs、動態 JSON-LD）
- ✅ admin.html 加入「📝 內容管理」區塊（文章列表/新增/編輯/發布/下架/刪除，案例分享有確認 dialog）
- ✅ index.html 側邊欄加「📖 閱讀我們的故事 →」連結
- ✅ index.html 加入 WebApplication + Organization JSON-LD
- ✅ generate-static-posts.js：為每篇已發布文章產生 posts/{slug}/index.html（OG meta + 即時跳轉）
- ✅ sitemap.xml（靜態基本版，跑腳本後自動更新含文章頁）
- ✅ robots.txt
- ✅ about.html：關於我們頁面（背景/理念/聯絡）
- [ ] Google Search Console 驗證 + 提交 sitemap（需到 Google 平台操作）
- [ ] Google Analytics 4 追蹤碼（需先取得 GA4 Measurement ID 再加入各頁 head）
- [ ] 自訂網域（Phase E，暫緩，估 NT$300-500/年）

> 發布文章後流程：admin.html 發布 → `node generate-static-posts.js` → `git add posts/ sitemap.xml && git push`
> 分享連結用 `posts/{slug}/`（有正確 OG meta），不用 `story.html?post=slug`

---

## 目前已知問題 / 待辦

### 近期待辦
- [ ] index.html 尚未透過 Claude Code push（目前仍需手動上傳）
- [ ] admin.html 不應 push 到 GitHub（注意：含付款功能）
- [ ] startup 模組目前 status=coming_soon（DB），需要確認是否要改 available
- [ ] site.newsletter_url 尚未設定（開發中模組的追蹤連結）

### Phase 3 計算強化（未做）
- [ ] 綜所稅自動估算
- [ ] XIRR/IRR 不規則現金流
- [ ] 勞保提前/延後請領（邏輯已做，需 UI 測試）
- [ ] 蒙地卡羅相關係數進一步優化

### Phase 4 商業化（未完成）
- [ ] 金流串接（ECPay/Stripe）— webhook 自動寫入訂閱
- [ ] 付費報告移至 Edge Function（目前在前端產生）
- [ ] 電子發票串接

### Phase 5 對外上線
- [ ] 法律意見/合規
- [x] 服務條款 / 隱私政策（terms.html 已完成）
- [ ] 行銷獲客

---

## 重要的操作記憶

### Git 設定
```bash
# 進入專案目錄
cd /c/Users/user/shizhi

# Push 到 GitHub
git add -A
git commit -m "描述"
git push origin main
```

### Claude Code 啟動
```bash
cd /c/Users/user/shizhi
claude
```

### Supabase 直接執行 SQL（Claude 可透過 MCP 操作）
- Project ID: haxfwofjrfkjwestfzvk
- 組織: 第二組織（aqwmpkdlcnpkgrljucor）

---

## 產品規劃書版本
- 時值 v3.3（14 頁）— 最新版本，含蒙地卡羅、商業化架構
- 夢想藍圖 v1.0 — 衍生產品規劃，尚未開始開發

---

*此檔案應在每次重要變更後更新。*
