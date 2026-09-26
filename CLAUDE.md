# 再生能源動畫館 repo 說明（給 Claude Code）

這個 repo 同時是 GitHub Pages 網站根目錄與動畫原始碼庫。

## 結構
- `index.html`、`<主題>/index.html`：由 `scripts/site_build.py` 依 `catalog.json` 產生，**不要手改**。
- `<主題>/epNN.html`：建置好的動畫（單一 HTML）。`offshore-wind/overview.html` 是使用者手做的總覽片，**不要修改或重建**。
- `src/<主題>/epNN.js` 與 `epNN.i18n.js`：動畫原始碼與中英日翻譯。要改動畫一律改這裡再重建。
- `.claude/skills/energy-animation-studio/`：製作技能（引擎、kit、build.py、qa.py、寫作規範）。動工前先讀其中的 `SKILL.md`。
- `automation/topics.md`：每日例行工作的題目清單；`automation/CHANGELOG.md`：每次新增的紀錄。

## 常用指令
```bash
S=.claude/skills/energy-animation-studio
python3 $S/scripts/build.py src/solar-pv/ep02.js --out solar-pv/ep02.html
python3 $S/scripts/qa.py solar-pv/ep02.html --outdir qa --langs zh,en,ja
python3 scripts/site_build.py --site .
```
QA 需要 `pip install playwright pillow` 與 `python -m playwright install --with-deps chromium`。

## 規則
- 每一集都必須是中文／English／日本語三語，並通過 `qa.py --langs zh,en,ja`（無執行錯誤、無漏翻）。
- 只新增，不刪除、不改名既有的集數檔案，網址要保持穩定。
- `catalog.json` 所有顯示文字用 `{"zh":…,"en":…,"ja":…}`。
- 數字以台灣情境為主並查證；無法查證的寫成「典型範例」並在 note 註明。
- `qa/` 是暫存輸出，不要提交。
- 品牌主題：預設 Journal（DOF LAB 字標、鏽紅強調色、襯線標題），由 `build.py` 自動套用 `assets/engine/theme-journal.*`；集數檔照舊寫經典色碼即可。`--theme classic` 可建出舊外觀。
- 署名（國立勤益科技大學 智慧自動化工程系 劉瑞弘老師研究室）已內建：動畫片頭與右上角由引擎 `i18n.js` 的 `credit`／`creditFull` 產生，頁面頁尾由 `catalog.json` 的 `credit` 產生。不要移除；修改引擎後要用 `src/` 重建所有集數。
