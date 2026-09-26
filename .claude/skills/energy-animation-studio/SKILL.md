---
name: energy-animation-studio
description: 製作「再生能源動畫館」風格的教育解說動畫（單一 HTML、canvas 動畫、分鏡式播放器），並整合進可上傳 GitHub Pages 的網站。只要使用者要做任何能源、電廠、設備原理或施工流程的解說動畫都要使用本技能，例如「做一個波浪發電的動畫」「太陽光電場安裝流程動畫」「儲能／氫能／地熱／陸域風電／離岸風電新一集」「把某某流程做成像離岸風場那樣的動畫」，也包括修改既有集數、新增主題到動畫館網站、更新 catalog.json 或產生要上傳 GitHub 的檔案。即使使用者沒說「動畫館」或「skill」，只要是能源或工程流程的動態圖解就應該觸發。
---

# 再生能源動畫館：動畫製作技能

這個技能封裝了「離岸風場開發系列」的完整做法：同一套播放器與繪圖引擎、固定的視覺語言、分鏡寫法、品質檢查腳本，以及把成品放進 GitHub Pages 網站的流程。目標是讓每一支新動畫看起來都屬於同一個系列，並且能直接上傳。

## 技能內容

```
assets/engine/        播放器與繪圖引擎（build.py 會自動組合）
  core.js             工具函式、鏡頭、標註、HUD、吊機、圖表
  engine.js           分鏡播放器、片頭、轉場、UI 控制
  kit-marine.js       海岸剖面世界：海、海床地層、各式工作船、單樁、轉接段、塔架、機艙、葉片、套管、海纜、鯨豚魚鳥
  kit-land.js         陸地／開闊海面：天空、地層、湧浪、太陽光電板、卡車、圍籬、機櫃、打樁機
  kit-offshore-*.js   離岸風電系列專用的整段施工動作與風場全景（續做離岸風電時才用）
  template.html, style.css
  theme-journal.*    預設品牌主題（DOF LAB Journal：配色對應、直角、襯線標題、片頭、D 字標）；build.py --theme classic 可關閉
assets/episode-starter.js   新集數的起始檔（兩種分鏡各一個範例）
scripts/build.py      episode.js → 單一 HTML
scripts/qa.py         以三種語言掃描整條時間軸：錯誤、漏翻字串、截圖與總覽圖
scripts/site_build.py 依 catalog.json 重建網站首頁、系列頁與每集導覽列
references/style-guide.md     視覺與文字規範（動筆前必讀）
references/engine-api.md      EP／分鏡資料格式與所有繪圖函式
references/site-publishing.md 網站結構、catalog.json、GitHub Pages
references/examples/          兩集真實成品：offshore-ep01.js（圖解為主）、offshore-ep05.js（施工場景為主）
```

## 工作流程

### 1. 判斷要做什麼

| 使用者說 | 做法 |
|---|---|
| 「做一個 X 的動畫」 | 一集，5–7 個分鏡、約 70–90 秒。直接規劃並製作，在回覆中說明假設。 |
| 「做一個 X 系列」「X 的完整開發流程」 | 先列出集數清單（每集一句話）和總覽片的分鏡，請使用者確認後再逐集製作。系列工作量大，確認能避免大量重工。 |
| 「修改第 N 集」 | 請使用者上傳該集 HTML 或原始 episode.js；HTML 內 `const EP={` 開始到 `/* ===== episode engine` 之前就是 episode 程式，可抽出修改後重建。 |
| 「放上網站」「更新動畫館」 | 見第 5 步。 |

### 2. 查證內容

動畫是教育用途，數字要站得住腳。用網路搜尋查證設備尺寸、容量、施工步驟與主管機關規範，優先採用官方或產業來源（能源署、台電、設備商技術文件、國際標準）。以台灣情境為主要脈絡（法規、海況、季風、颱風、在地案例），但不捏造特定案場資料。所有數字在頁尾 `note` 註明為「典型範例」。

### 3. 規劃分鏡

先讀 `references/style-guide.md`。每集的節奏：

- 4–7 個分鏡，每個 10–16 秒；一集 60–95 秒。
- 兩種分鏡交錯：**現場場景**（設備、施工、運轉的側視動畫）與**原理圖解**（剖面、圖表、流程、比較）。圖解至少佔三分之一，這是「深入」與一般動畫的差別：不只演出「做了什麼」，還要畫出「為什麼」。
- 每個分鏡有：標題＋英文副標、120–200 字的說明段落 `d`、3–5 句依時間出現的字幕 `s`、必要時一個右上角 HUD 即時數據面板。
- 每集 4–6 個「重點數字」卡片。

把分鏡表寫在回覆裡（表格即可）再動工；使用者要一次看到全部時不必停下來等確認。

### 4. 製作與檢查

```bash
S=<本技能路徑>
cp $S/assets/episode-starter.js work/ep01.js              # 從起始檔開始
cp $S/assets/episode-starter.i18n.js work/ep01.i18n.js    # 翻譯檔（與集數檔同名）
# 編輯 work/ep01.js（第一行 // KITS: land 或 marine 決定可用的繪圖函式）
python3 $S/scripts/build.py work/ep01.js --out out/ep01.html
python3 $S/scripts/qa.py out/ep01.html --outdir qa --langs zh,en,ja   # 需要時先 pip install playwright pillow --break-system-packages
```

然後用 view 看 `qa/ep01_zh_sheet.png`（以及 `_en_`、`_ja_` 總覽圖），對照 `references/style-guide.md` 末尾的檢查清單修正，重建再檢查，直到沒有錯誤、沒有文字重疊、每個分鏡一眼看得懂。寫程式前讀 `references/engine-api.md`；新主題需要的物件（例如波浪發電浮標、儲能貨櫃）直接在 episode 檔裡寫成函式，參考 examples 的寫法。

**需要新的場景世界時**（例如山區的抽蓄水力、屋頂型光電）：以 `kit-land.js` 為基礎，在 episode 檔的 `EP.base` 裡畫自己的背景，而不是修改引擎。若同一主題會有多集共用，可把這些函式整理成新的 `kit-<主題>.js` 放進 `assets/engine/` 並在 `build.py` 的 `KIT_FILES` 登記。

**工具用量**：一集通常需要 3–6 次工具呼叫（寫檔、建置＋檢查、看截圖、修正）。系列作品用 bash heredoc 一次寫多個檔案、合併建置與截圖，並在每一批完成時誠實回報進度；做不完就明說完成了哪幾集、下一步是什麼。

### 4.5 三語版（每一集都必須有）

所有動畫都要支援 中文／English／日本語，畫面右上角有語言切換，選擇會記在 `rea-lang`，整個網站共用；網址加 `?lang=en` 也可指定。做法：

1. 集數檔照常用繁體中文寫所有文字（標註、HUD、字幕、說明、重點數字）。
2. 會變動數字的字串用 `trf('第 {n} 天',{n:day})`，不要用模板字串或 `'…'+x+'…'` 拼接，否則無法翻譯。
3. 在 `EPISODE.i18n.js` 以 `Object.assign(DICT,{ "中文":["English","日本語"], … })` 提供每個字串的英日文，`trf` 的鍵保留 `{n}` 佔位。
4. 執行 `qa.py --langs zh,en,ja`：英文版畫面或頁面上只要還有中文就會列出；日文版列出和中文完全相同的字串（若日文本來就相同，例如「風向計」，可忽略）。
5. 看英文總覽圖，確認較長的英文沒有擠出圖框或與圖形重疊。

翻譯風格見 `references/style-guide.md` 第 8 節。播放器另有「匯出影片」：以 WebCodecs 逐格離線算繪 MP4（1080p／720p、30／60 fps、全片或目前分鏡），語言與標註設定沿用畫面，不需額外設定。

### 5. 交付與網站整合

1. **預覽**：有 Artifact 工具時，逐集以 publish 發佈，讓使用者直接在瀏覽器看。
2. **網站檔案**：依 `references/site-publishing.md`。
   - 使用者上傳了現有網站（zip 或 `catalog.json`）：把新集數放進 `<slug>/`，在 catalog.json 加入主題或集數，執行 `site_build.py`，打包整個網站 zip。
   - 沒有現有網站：產生只含新主題資料夾與 catalog.json 片段的 zip，並說明合併方式（放進 repo 後執行 site_build.py，或把 catalog 片段貼進去）。
3. 用 present_files 交付 zip，簡短說明要上傳哪些檔案到 GitHub。

## 為什麼這樣做

- **單一 HTML、無外部資源**：GitHub Pages、離線播放、嵌入簡報都能用；只從 Google Fonts 載入字型，失敗時自動退回系統中文字型。
- **固定的播放器與視覺語言**：觀眾在不同主題間切換時不需要重新學習操作，系列感也來自這份一致性。
- **資料驅動的網站**：`catalog.json` 是唯一的目錄來源，新增主題只改資料、不改頁面，避免手動修改 HTML 造成連結錯誤。
