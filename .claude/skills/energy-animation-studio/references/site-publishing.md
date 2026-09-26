# 網站結構與發佈

## 結構

```
<repo 根目錄>/
  index.html          首頁（site_build.py 產生）
  catalog.json        唯一的目錄來源
  .nojekyll
  README.md
  <slug>/             每個主題一個資料夾，例如 offshore-wind、wave-energy、solar-pv
    index.html        系列頁（site_build.py 產生）
    thumb.svg         選用：首頁卡片縮圖（320×150 viewBox 的 SVG）
    overview.html     選用：總覽片
    ep01.html …       各集
```

## catalog.json

```json
{
  "siteTitle": "再生能源動畫館",
  "siteLede": "首頁導言",
  "disclaimer": "頁尾說明",
  "topics": [
    {
      "slug": "wave-energy",
      "title": "波浪發電",
      "summary": "首頁卡片上的一句話",
      "lede": "系列頁導言",
      "overview": {"file": "overview.html", "title": "總覽片標題", "sub": "一句話"},
      "groups": [
        {"name": "原理", "episodes": [
          {"no": 1, "file": "ep01.html", "title": "點吸收式波浪發電", "sub": "一句話摘要"}
        ]}
      ]
    }
  ]
}
```
- `dur` 可省略，腳本會從 HTML 自動計算。`overview` 可省略。
- `credit`（選用，三語）：署名與版權文字。site_build.py 會把它放在首頁、系列頁頁尾，並注入每一集與總覽片頁面底部（`<p class="site-credit">`，可重複執行）。動畫畫面內的署名（片頭一行、右上角浮水印，也會錄進匯出影片）則來自引擎 `i18n.js` 的 `credit`／`creditFull` 介面字串。
- 主題順序即首頁順序；集數順序即上一集／下一集順序（總覽片排最前）。

### 多語欄位

catalog.json 中所有顯示文字（siteTitle、siteLede、disclaimer、主題的 title／summary／lede、群組 name、每集與總覽的 title／sub）都可以寫成字串（只有中文）或 `{"zh":"…","en":"…","ja":"…"}`。site_build.py 會在首頁、系列頁與每集導覽列放入語言切換，語言記在 localStorage 的 `rea-lang`，所有頁面共用；注入頁面時會把舊的 `owf-lang` 改為 `rea-lang`。新增集數時三種語言都要填。

## 流程

1. 把新 HTML 放進 `<slug>/`，檔名用英文小寫與數字（`ep01.html`）。
2. 編輯 catalog.json。
3. `python3 scripts/site_build.py --site <repo 根目錄>`：重建首頁、系列頁，並為每集插入頂部導覽列（可重複執行，不會重複插入）。
4. 腳本最後會列出 catalog 中有、但資料夾裡找不到的檔案，交付前確認沒有警告。
5. 打包整個網站或變更的檔案為 zip 交付。

使用者手上若只有網站、沒有 catalog.json，可以依現有首頁與系列頁內容重建一份。

## GitHub Pages

1. Public repository，檔案放在根目錄（含 `.nojekyll`）。
2. Settings → Pages → Deploy from a branch → `main` / `(root)` → Save。
3. 網址：`https://<帳號>.github.io/<repo>/`。之後每次 push 會自動更新，約 1–2 分鐘生效。
4. 私人網站需要付費方案或其他托管；可在 Pages 設定自訂網域。
