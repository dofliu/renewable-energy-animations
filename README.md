# 再生能源動畫館

用動畫介紹再生能源的靜態網站。每個主題由一支總覽動畫與數集深入動畫組成。
所有頁面都是純 HTML，不需要編譯或安裝任何套件。

## 目錄結構

```
index.html              網站首頁（主題列表，由 catalog.json 產生）
catalog.json            網站目錄：主題、集數、說明文字
scripts/site_build.py   重建首頁與系列頁的腳本
offshore-wind/          離岸風電主題
  index.html            系列頁：總覽＋13 集清單
  overview.html         全流程總覽動畫
  ep01.html … ep13.html 各集深入動畫
.nojekyll               讓 GitHub Pages 直接提供檔案，不經 Jekyll 處理
```

## 發佈到 GitHub Pages

1. 在 GitHub 建立新的 repository（例如 `renewable-energy-animations`），設為 Public。
2. 把本資料夾內所有檔案（含 `.nojekyll`）上傳到 repository 根目錄。
   網頁上傳：Add file → Upload files，把檔案拖進去後 Commit。
   或使用指令：
   ```
   git init
   git add .
   git commit -m "First release"
   git branch -M main
   git remote add origin https://github.com/<帳號>/renewable-energy-animations.git
   git push -u origin main
   ```
3. 進入 repository 的 Settings → Pages。
4. Source 選 Deploy from a branch，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
5. 約一到兩分鐘後，網站會出現在
   `https://<帳號>.github.io/renewable-energy-animations/`

## 新增主題或集數

網站的目錄由 `catalog.json` 決定，首頁與各系列頁都是由它產生的。

1. 把新動畫 HTML 放進主題資料夾，例如 `wave-energy/ep01.html`（可另放 `thumb.svg` 作為首頁卡片縮圖）。
2. 在 `catalog.json` 的 `topics` 加入主題，或在既有主題的 `groups` 加入集數。
3. 執行 `python3 scripts/site_build.py --site .`，會重建首頁、系列頁，並替每集加上頂部導覽列。
4. commit 並 push，GitHub Pages 約一到兩分鐘後更新。

## 注意事項

- 字型從 Google Fonts 載入；無法連線時會自動改用系統的中文字型。
- 動畫內的數值為教育用途的典型範例，實際依各案設計與主管機關核定內容而定。

## 多國語言（中文／English／日本語）

每一支動畫、首頁、系列頁與導覽列都有語言切換（右上角），選擇會記住並套用到整個網站；也可以在網址後加 `?lang=en` 或 `?lang=ja` 直接指定。
catalog.json 的顯示文字可寫成 `{"zh":"…","en":"…","ja":"…"}`，新增集數時請三種語言都填，然後執行 `python3 scripts/site_build.py --site .`。

每支動畫的「匯出影片」按鈕可直接輸出 MP4（建議用最新版 Chrome 或 Edge），影片語言依當下選擇的語言。
