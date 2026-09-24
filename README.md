# 再生能源動畫館

用動畫介紹再生能源的靜態網站。每個主題由一支總覽動畫與數集深入動畫組成。
所有頁面都是純 HTML，不需要編譯或安裝任何套件。

## 目錄結構

```
index.html              網站首頁（主題列表）
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

## 新增一個主題

1. 在根目錄建立新資料夾，例如 `solar/`，放入該主題的動畫 HTML。
2. 仿照 `offshore-wind/index.html` 建立 `solar/index.html` 系列頁。
3. 在根目錄 `index.html` 的 `<div class="topics">` 裡，複製一個 `<a class="topic">` 區塊，
   改成新主題的連結、名稱與說明。
4. 每集頁面最上方的導覽列可仿照現有各集，連回首頁與系列頁。

## 注意事項

- 字型從 Google Fonts 載入；無法連線時會自動改用系統的中文字型。
- 動畫內的數值為教育用途的典型範例，實際依各案設計與主管機關核定內容而定。
