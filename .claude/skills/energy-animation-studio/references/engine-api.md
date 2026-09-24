# 引擎 API

## 目錄
1. 檔案組合　2. EP 資料格式　3. 分鏡格式　4. 時間與動態工具　5. 繪圖工具　6. 標註與 HUD　7. 圖解工具　8. Kit 函式　9. 常見陷阱

## 1. 檔案組合

組合順序：core → i18n → kits → 集數檔 → 集數檔.i18n.js → engine。`kit-offshore-dict.js` 在使用 marine kit 時自動加入（離岸相關標註的英日文）。

`build.py` 依序串接：`core.js` → 第一行 `// KITS:` 宣告的 kit → episode 檔 → `engine.js`，塞進 `template.html`。
episode 檔在最上層只做「定義」：常數、函式、`const EP={...}`。不要在最上層呼叫繪圖函式（此時畫布尚未就緒）。
引擎在載入後才讀 `EP`，所以 episode 檔可以使用 engine.js 裡的函式（`wt`, `diagBG`, `chartBox` …），只要是在繪圖函式內呼叫。

可用 kit：`marine`、`land`、`offshore-seq`（離岸風電原片的整段施工動作，需設定 `SC/SU`，見 examples 與原系列 ep06–12 的寫法 `O(c,p)`）、`offshore-farm`（`renderFarm(u)`、`farmHUD(u)` 風場全景日夜）。

## 2. EP 資料格式

```js
const EP={
  no:1, t:'集名', en:'English subtitle',
  seriesName:'波浪發電系列', total:5,          // 顯示「波浪發電系列 第 1 集（共 5 集）」；單集可省略 total
  lede:'頁首導言，1–2 句',
  facts:[['數值','單位','一句說明'], ...],     // 4–6 張重點數字卡
  note:'頁尾說明：示意性質與數值來源性質',
  base:u=>{...}, end:u=>{...},                 // 選用：side 分鏡的整集背景（前景前／後），預設為 kit-marine 的 sideBase/sideEnd
  shots:[ ... ]
};
```

## 3. 分鏡格式

```js
{ t:'分鏡標題', en:'English', dur:12,          // 秒
  d:'120–200 字說明段落（顯示於畫面下方）',
  s:[[0,'字幕一'],[.35,'字幕二'],[.7,'字幕三']], // [開始時間比例 0–1, 文字]
  side:true,                                   // true：引擎先畫 base，再 draw，再 end，再 fx
  base:u=>{}, end:u=>{},                       // 選用：覆寫 EP.base/end
  cam:u=>({x:800,y:450,s:1}),                  // 選用：世界座標中心與縮放
  draw(u){...},                                // 必要；非 side 分鏡要自己畫背景（通常 diagBG()）
  fx(u){...},                                  // 選用：畫在水面／前景之上（聲波、雷射、粒子）
  hud(u){...} }                                // 選用：螢幕座標的右上面板（hudPanel）
```
`u` 是本分鏡的進度 0→1。全域 `TT` 是秒數（持續動態用，如波浪、旋轉）。

## 4. 時間與動態工具

`lerp(a,b,t)`、`clamp(v,a,b)`、`ease/easeOut/easeIn(t)`、`seg(u,a,b)`（把 u 在 [a,b] 間映射成 0–1）、`band(u,a,b)`（在 a→b 期間為 1，前後淡入淡出，用於標籤）、`kf(u,[[u0,x0,y0],[u1,x1,y1],…])`（關鍵影格路徑）、`lerpPt`、`bez`、`partial(P,f)`（折線畫到比例 f）、`rng(seed)`（可重現的亂數，固定配置用）、`nz(x)`（平滑雜訊）、`hn(i,j)`（格點雜訊）、`camMix(a,b,k)`。

## 5. 繪圖工具（世界座標）

`box(x,y,w,h,fill,stroke,lw)`、`rrp(x,y,w,h,r)`（圓角路徑，接著 fill）、`ln([x0,y0,x1,y1,…],col,lw)`、`poly([…],fill,stroke,lw)`、`circ(x,y,r,fill,stroke,lw)`、`ring(x,y,r,col,lw)`、`arrow(x0,y0,x1,y1,col,lw)`、`arrowR(x,y,L,col)`、`pathLine(P,col,lw,dash)`、`alphaDo(a,fn)`（在透明度 a 下執行 fn）、`person(x,y,col,s)`、`rail(x0,x1,y,h)`、`wins(...)` 窗格、`crane(px,py,L,hx,hy,{col,solid,w})` 吊臂＋吊鉤（回傳臂端座標）、`slings(hx,hy,[x,y,…])` 吊索。

## 6. 標註與 HUD

- `lab(x,y,文字,{dx,dy,st,a,minor})`：指向世界座標點的膠囊標籤（螢幕座標繪製，自動避開邊界）。`dx,dy` 是引線偏移（螢幕 px）；`dy:0` 時水平引出。`st`：`'n'` 深色（預設）、`'s'` 黃、`'w'` 橘警示、`'g'` 綠、`'l'` 白。`minor:true` 在窄螢幕隱藏。
- `tick(x,y,文字,'left'|'right')`：無底的小刻度文字（高度、深度）。
- `hudPanel(w,h,標題,alpha,(w,h)=>{…})`：右上資料面板，面板內用 `hrow(y,標籤,值,w,色)`、`hbar(x,y,w,比例,色)`、`htext(x,y,文字,size,色,weight,font,align)`；面板座標原點在面板左上。窄螢幕（<600px）與關閉標註時自動隱藏，所以關鍵資訊不能只放在 HUD。

## 7. 圖解工具（engine.js）

- `diagBG()`：深海藍背景＋淡格線，並把鏡頭重設為全畫面。圖解分鏡的 draw 第一行。
- `wt(x,y,文字,size,色,weight,align,font,baseline)`：世界座標文字，自動保證最小可讀字級。`wtw()` 量寬度。
- `card(x,y,w,h,{bg,st,r})`：圓角卡片。
- `tag(x,y,文字,{bg,fg,size,align})`：世界座標的實心膠囊（流程步驟、警示字）。
- `chartBox(x,y,w,h,{title,x0,x1,y0,y1,xt:[…],yt:[…],xl,yl,pl,pr,pt,pb,gx,gy})`：畫座標框並回傳 `{X,Y,px,py,pw,ph}` 映射函式，之後用 `c.X(v)`、`c.Y(v)` 畫線或長條。

## 8. Kit 函式

**kit-marine**（海在左、陸在右的剖面；`SEA`=470、`TX`=640 風機、`OX`=1120 變電站、`COAST`=1455）
地形與水：`bedY(x)`、`layB(x,i)`、`LAY`（四層地層）、`surf(x)`、`wlAt(cx,damp)`、`drawSky/drawWaterBack/drawSoil/drawWaterOver`、`soilRegion()`/`waterRegion()`（可用來 clip）、`sideBase()/sideEnd()`。
船：`vsl(x,len,flip,{damp,tilt,a},drawFn)` 搭配 `vWorkboat vSurvey vDrill vResearch vHLV vBubble vGuard vCraneVessel vCLV vSmallWork vCTV vSOV`；`drawWTIV(R,deck,legBot)`、`drawGripper`。
結構：`drawPile`、`drawHammer`、`drawTP`、`drawTowerSec`、`drawNacelle(ax,ay,cut,light)`、`drawBlade`、`drawRotor`、`drawJacket`、`drawPins`、`drawTopside`、`drawOnshore`、`drawPylon`、`hddPt(t)`/`drawHDD`、`buoy`、`rov`。
生物：`dolphin`、`fish`、`school`、`bird`。

**kit-land**（`GY`=600）
`landSky(horizonY,{sun:{x,y},dusk:0–1,clouds})`、`groundY(x)`、`drawGround({layers,grass})`、`LAND_LAY`、`landBase()`；
開闊海面：`swellY(x,{y,A,L,sp})`、`drawSwell({y,A,L,sp,bed})`、`seaBase()`；
物件：`solarPanel(x,y,w,tilt,{h,glint})`、`pvRow`、`truck(x,y,flip,col,loadFn)`、`fence`、`cabinet`、`pileRig(x,y,hammerY)`。

新主題的物件（浮標、電池貨櫃、電解槽、水輪機…）寫在 episode 檔內，沿用上面的基本形狀與配色。

## 9. 常見陷阱

- 在 `lab()` 以外畫文字請用 `wt()`（世界座標）或 `htext()`（HUD 內），不要直接用 `ctx.fillText` 固定字級，否則手機上會過小。
- `ctx.save()/restore()` 要成對；`setLineDash` 用完要 `setLineDash([])`。
- 用 `rng(seed)` 產生固定排列，不要在 draw 內用 `Math.random()`（畫面會閃爍、拖曳時間軸會跳）。
- 所有動作都要是 `u` 或 `TT` 的純函式，才能自由拖曳時間軸。
- 標籤文字若含全形冒號與括號，長度會增加，窄畫面注意。


## 10. 多語系（i18n.js）

- `LANG`（'zh'|'en'|'ja'）、`LI`（中文 -1、英文 0、日文 1）。切換時 engine 更新 `FONT`（日文改用 Noto Sans JP）並觸發 `langchange` 事件。
- `DICT`：`{中文:[英文,日文]}`。kit 與 `EPISODE.i18n.js` 用 `Object.assign(DICT,{...})` 加入。
- `tr(s)`：中文模式原樣回傳；其他語言查 DICT，再試 `TPAT` 正規式，含全形空白「　」的字串會分段翻譯。`lab`、`tick`、`wt`、`wtw`、`hudPanel`、`hrow`、`htext`、字幕、說明、重點數字（三欄）都會自動經過 `tr`，所以集數檔裡直接寫中文即可。
- `trf(key,vars)`：先翻譯含 `{x}` 的鍵，再代入變數。動態字串一律用它。
- `ui(key,vars)`：介面字串表 `UI`（`[zh,en,ja]`），kit 可 `Object.assign(UI,{...})`。
- 標題規則：英文版主標題用 `EP.en`／分鏡的 `en`，副標題顯示中文；日文版主標題為 `tr(中文)`，副標題顯示英文。
- `QA_KEEP.push('…')`：刻意在其他語言顯示中文的字串（例如雙語副標），qa.py 會略過。
- 自己用 `ctx.fillText` 畫字時要自己呼叫 `tr()`；量字寬也要先 `tr()` 再量。
- `window.__ow`：`seek(t)`、`pause()`、`shot(i)`、`setLang(l)`、`keep()`、`SS`、`TOTAL`，供 qa.py 使用。
