# 時值 · 財務地圖

個人財務規劃與視覺化試算工具：收支、淨值、目標排序、可投資資產的人生時間軸。
純前端單檔（`index.html`），可直接部署到 GitHub Pages；資料預設存在瀏覽器，亦可接 Supabase 雲端同步。

> 試算工具，所有未來數字皆為依假設所做之估算，非投資建議或報酬保證。

---

## 一、馬上使用（零設定）
直接用瀏覽器打開 `index.html` 就能用，資料會存在這台裝置的瀏覽器（localStorage）。

## 二、部署到 GitHub Pages
1. 在 GitHub 建立一個新的 repository（可設為 Private）。
2. 把 `index.html` 上傳進去（首頁檔名就是 `index.html`，不需改名）。
3. 進入 repo 的 **Settings → Pages**。
4. **Source** 選 `Deploy from a branch`，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
5. 等待約 1 分鐘，頁面會出現你的網址：`https://<你的帳號>.github.io/<repo 名稱>/`。打開即可。

## 三、（可選）啟用 Supabase 雲端同步
讓資料跨裝置同步、並可登入保存。

1. 到 Supabase 後台 → **SQL Editor**，貼上 `supabase_setup.sql` 全部內容 → 按 **Run**（建立資料表與安全政策）。
2. 到 **Project Settings → API**，複製：
   - **Project URL**（形如 `https://xxxx.supabase.co`）
   - **anon / publishable key**（可公開；安全性由 RLS 保障）
3. 打開 `index.html`，找到最上方這兩行，貼上你的值：
   ```js
   const SUPABASE_URL = "";        // ← 貼上 Project URL
   const SUPABASE_ANON_KEY = "";   // ← 貼上 anon / publishable key
   ```
4. 確認 Supabase 後台 **Authentication → Providers** 已啟用 **Email**。
5. 重新整理頁面 → 到「設定 → 雲端同步」用 Email 註冊（第一次）再登入，資料即開始同步。

### 關於安全
- anon/publishable key 本來就設計成可公開放在前端，**安全性靠資料表的 RLS 政策**（本專案已設定：每個帳號只能讀寫自己的資料）。
- 切勿把 **service_role / secret key** 放進前端或 repo。
- 若仍不放心，把 GitHub repo 設為 Private 即可。

---

## 功能
- **儀表板**：淨值、每月結餘、儲蓄率、緊急預備金月數；人生資產時間軸（名目／實質可切換）、退休目標參考線。
- **收支 / 資產負債 / 目標**：表格式即時編輯，自動計算。
- **目標**：每月應投入金額與可行性分析。
- **設定**：年齡、退休年齡、通膨、報酬、薪資成長等假設。
- **備份**：JSON 匯出 / 匯入。
