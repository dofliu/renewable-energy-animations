// KITS: land
/* 陸域風電系列 第 9 集：除役、延壽與葉片回收 */
const gyy=x=>groundY(x);
/* 正視葉片（以輪轂為原點），wear 為前緣磨損程度 */
function bladeF(a,R,wear){const c=Math.cos(a),s=Math.sin(a),tx=s*R,ty=-c*R,nx=c,ny=s;
  poly([-nx*7,-ny*7,nx*7,ny*7,tx+nx*2,ty+ny*2,tx-nx*2,ty-ny*2],'#f4f6f7','rgba(0,0,0,.35)',1);
  if(wear>0)alphaDo(wear,()=>ln([tx*.62-nx*4.5,ty*.62-ny*4.5,tx-nx*2,ty-ny*2],'#8a6f55',3));}
/* 正視轉子；sy<1 代表轉子傾倒放平 */
function rotorF(cx,cy,R,rot,sy,wear){ctx.save();ctx.translate(cx,cy);ctx.scale(1,sy);
  for(let i=0;i<3;i++)bladeF(rot+i*TAU/3,R,wear||0);circ(0,0,R*.06+4,'#dfe5e8','#394650',1.2);ctx.restore();}
/* 正視塔架：從地面 g 畫到 yTop */
function towerF(x,g,yTop,H,wear){const wb=H*.05+6,wt_=H*.028+4,k=(g-yTop)/H,wtop=lerp(wb,wt_,k);
  poly([x-wb,g,x-wtop,yTop,x+wtop,yTop,x+wb,g],'#eef2f4','rgba(0,0,0,.3)',1);
  [.4,.75].forEach(f=>{const y=g-H*f;if(y>yTop)ln([x-lerp(wb,wt_,f),y,x+lerp(wb,wt_,f),y],'rgba(0,0,0,.18)',1);});
  if(wear>0){const r=rng(Math.round(x));for(let i=0;i<14;i++){const f=r()*.9,y=g-H*f;if(y<yTop)continue;circ(x+(r()-.5)*lerp(wb,wt_,f)*1.4,y,1.5+r()*2.5,`rgba(150,92,52,${(.75*wear).toFixed(3)})`);}}}
function nacF(x,hy,H){const w=H*.07+8;box(x-w,hy-w*.7,w*2,w*1.4,'#dfe5e8','rgba(0,0,0,.35)',1);}
/* 完整正視風機 */
function frontT(x,H,R,rot,wear){const g=gyy(x),hy=g-H;towerF(x,g,hy,H,wear);nacF(x,hy,H);rotorF(x,hy,R,rot,1,wear);return {g,hy};}
/* 履帶式主吊機（吊臂向左）；回傳支點 */
function crawler(px){const g=gyy(px);box(px-62,g-16,124,16,'#2b3137');for(let i=0;i<6;i++)circ(px-50+i*20,g-8,6,'#555','#222',1);
  box(px-52,g-44,92,28,'#e9b21f','rgba(0,0,0,.3)',1);box(px-66,g-62,36,46,'#c99a16','rgba(0,0,0,.3)',1);box(px+20,g-62,26,22,'#f4f6f7');box(px+24,g-58,16,11,'#2a3a46');return {x:px+10,y:g-44};}
/* 側視平放葉片（葉根在右） */
function bladeSide(x0,y,L,a0,a1){a0=a0||0;a1=a1===undefined?1:a1;
  const P=[[0,-24],[.08,-26],[.28,-32],[1,-13],[1,-9],[.28,-5],[.08,-3],[0,-3]];
  const at=(f,top)=>{let i=0;const S=top?[[0,-24],[.08,-26],[.28,-32],[1,-13]]:[[0,-3],[.08,-3],[.28,-5],[1,-9]];
   for(i=0;i<S.length-1&&S[i+1][0]<f;i++);const k=(f-S[i][0])/((S[i+1][0]-S[i][0])||1);return lerp(S[i][1],S[i+1][1],clamp(k,0,1));};
  const top=[],bot=[];[a0,...P.slice(0,4).map(p=>p[0]).filter(f=>f>a0&&f<a1),a1].forEach(f=>{top.push(x0-L*f,y+at(f,1));bot.unshift(x0-L*f,y+at(f,0));});
  poly([...top,...bot],'#eef2f4','rgba(0,0,0,.4)',1);if(a0===0)ln([x0,y-24,x0,y-3],'#8d989f',3);
  if(a0>0)ln([x0-L*a0,y+at(a0,1),x0-L*a0,y+at(a0,0)],'#b9a888',2.5);if(a1<1)ln([x0-L*a1,y+at(a1,1),x0-L*a1,y+at(a1,0)],'#b9a888',2.5);}
/* 挖土機（手臂向左，k 為破碎錘的下探量） */
function excavator(x,g,reach,drop,hammer){box(x-50,g-18,100,18,'#2b3137');for(let i=0;i<5;i++)circ(x-40+i*20,g-9,6,'#555','#222',1);
  box(x-42,g-52,84,34,'#e9b21f','rgba(0,0,0,.3)',1);box(x+6,g-80,34,30,'#e9b21f','rgba(0,0,0,.3)',1);box(x+11,g-76,22,14,'#2a3a46');
  const sx=x-34,sy=g-46,ex=x-reach*.55,ey=g-140,tx=x-reach,ty=g-30+drop;
  ln([sx,sy,ex,ey],'#d9a51a',10);ln([ex,ey,tx,ty-30],'#d9a51a',7);
  if(hammer){box(tx-6,ty-32,12,26,'#3d4750');ln([tx,ty-6,tx,ty+4],'#9aa3a8',3);}
  else poly([tx-14,ty-32,tx+8,ty-32,tx+4,ty,tx-18,ty-6],'#3d4750');
  return [tx,ty];}
function tree(x,b){const g=gyy(x);ln([x,g,x+b*.3,g-40,x+b,g-72],'#5b4632',5);circ(x+b*1.1,g-84,24,'#3f6b45');circ(x+b*1.2-16,g-72,17,'#4a7a50');}

const K=(u,p)=>{const o=kf(u,p);return [o.x,o.y];};
const TX=700,H4=330,R4=150;                 // 拆除分鏡的風機位置、輪轂高度、轉子半徑（世界座標）
const RT=[TX,gyy(TX)-H4];                    // 輪轂位置
const ROT0=Math.PI;                          // 轉子鎖定時一支葉片朝下

const EP={no:9,slug:'onshore-wind',seriesName:'陸域風電系列',t:'除役、延壽與葉片回收',en:'Decommissioning, life extension and blade recycling',
lede:'風機的設計壽命通常是 20 年。台灣第一批陸域風機已陸續屆齡，接下來要決定延壽、換成更大的新機，或拆除除役。這一集看剩餘壽命怎麼評估、換機如何以少換多、風機怎麼反向拆除，以及最難處理的複合材料葉片能回收成什麼。',
facts:[['20','年','IEC 61400-1 風機的設計壽命至少 20 年'],
['5–10','%','台電評估以更新零組件延壽，可提升的發電效率'],
['0.66 → 5','MW','台電石門風場更新案：單機容量上限擴大約 7.5 倍'],
['85–90','%','一部風機總質量中可回收的比例，主要是鋼材與金屬'],
['100','%','歐洲風電業承諾退役葉片全部再使用、回收或回收能源'],
['≈ 1','m','基礎常見拆除到地表下約 1 公尺再覆土（示例）']],
note:'說明：本集為教育用途示意動畫，風機、吊機與基礎比例經過簡化，拆除與回收過程的時間已壓縮。設計壽命 20 年依 IEC 61400-1；延壽評估依 IEC TS 61400-28:2025 與 DNV-ST-0262 的架構；台電以零組件更新延壽可提升發電效率 5–10%，以及石門風場以 3 部單機 5 MW 以下、總裝置容量 15 MW 以下的新機更新原 6 部 0.66 MW 機組並於 2026 年通過環評，引自台電與中央社等公開報導，數值為計畫上限；風機總質量 85–90% 可回收、歐洲風電業承諾退役葉片 100% 再使用回收、奧地利、德國、荷蘭、芬蘭禁止複合材料掩埋，引自 WindEurope 公開資料。疲勞損傷曲線與剩餘壽命 8 年、葉片材料比例、葉片長度 23 m 與重量、切割段數、熱解溫度、拆除深度約 1 m、累計發電量與可用率皆為典型範例，實際依機型、合約與主管機關要求而定，並非特定案場資料。',
base:()=>{landSky(GY,{sun:{x:1320,y:120}});drawGround();},
shots:[
/* 1 ─────────────────────────────── 屆齡 */
{t:'服役二十年的風機',en:'Twenty years in service',dur:12,side:true,
 d:'風機設計時依 IEC 61400-1 以至少 20 年的壽命計算疲勞強度。台灣本島的商業風場從 2000 年代初開始運轉，第一批單機 660 kW 左右的風機已陸續屆滿 20 年。二十年間葉片前緣被雨滴與沙塵磨損、塔架塗裝老化，控制器與變流器的零件也可能停產。屆齡不代表馬上要拆，但業主必須做決定：繼續運轉需要證明結構仍然安全，換機或除役則要重新規劃。',
 s:[[0,'海岸邊的第一代風機已運轉二十年'],[.3,'葉片前緣磨損、塔架塗裝老化'],[.6,'控制系統零件逐漸停產'],[.82,'屆滿設計壽命：延壽、換機或除役']],
 cam:u=>camMix({x:800,y:450,s:1},{x:650,y:450,s:1.3},ease(seg(u,.25,.6))),
 draw(u){
  const w=ease(seg(u,.05,.7));
  [[1260,0],[1360,1],[160,2]].forEach(([x,i])=>tree(x,10+4*Math.sin(TT*2.4+i)));
  frontT(300,210,95,TT*1.1+1,w*.8);
  frontT(960,170,80,TT*1.05+2.2,w*.8);
  const T=frontT(640,240,110,TT*1.2,w);
  lab(640+Math.sin(TT*1.2)*110*.8,T.hy-Math.cos(TT*1.2)*110*.8,'葉片前緣磨損',{dx:-130,dy:-40,st:'w',a:band(u,.3,.62)});
  lab(646,T.g-110,'塔架塗裝老化',{dx:150,dy:20,st:'w',a:band(u,.34,.66)});
  lab(640,T.hy-12,'控制器零件停產',{dx:150,dy:-60,st:'w',a:band(u,.6,.84)});
  lab(640,T.hy,'設計壽命 20 年',{dx:-170,dy:-70,st:'s',a:band(u,.82,1)});
 },
 hud(u){hudPanel(250,182,'第一代風機（示例）',seg(u,.03,.08),w=>{const yr=20*seg(u,.06,.8);
  hrow(56,'運轉年數',trf('{n} 年',{n:yr.toFixed(0)}),w,yr>=19.5?'#ff9d7a':'#f2c230');
  hrow(88,'單機容量','660 kW',w,'#fff');
  hrow(120,'累計發電',trf('{n} GWh',{n:(1.45*yr).toFixed(1)}),w,'#7dffc4');
  hrow(152,'狀態',yr<19.5?'運轉中':'屆滿設計壽命',w,yr<19.5?'#7dffc4':'#ff9d7a');});}},

/* 2 ─────────────────────────────── 剩餘壽命評估 */
{t:'延壽評估：還能轉幾年',en:'How many more years?',dur:14,
 d:'設計壽命是以設計風況計算的疲勞極限，實際場址的風況若比假設溫和，結構累積的疲勞損傷就比較少。延壽評估先整理 SCADA 運轉資料與維修紀錄，再到現場檢查塔架螺栓、焊道、葉片與基礎，最後用實際風況重新計算載重，推估剩餘壽命。IEC TS 61400-28 與 DNV-ST-0262 提供這套評估的架構。結論可能是延壽數年、更換主要零組件，或判定不宜繼續運轉。',
 s:[[0,'設計曲線：第 20 年累積損傷達到允許值'],[.3,'實際風況較溫和，損傷累積較慢'],[.5,'延伸曲線：推估剩餘壽命'],[.72,'檢查與重算後，決定延壽、換機或除役']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,700,470,{title:'累積疲勞損傷（示意）',x0:0,x1:30,y0:0,y1:1.2,xt:[0,10,20,30],yt:[0,.5,1],xl:'運轉年數',yl:'累積損傷',pl:90,pt:80,pb:64,gx:3,gy:2});
  ctx.setLineDash([8,6]);ln([C.X(0),C.Y(1),C.X(30),C.Y(1)],'#e8572a',2);ctx.setLineDash([]);
  wt(C.X(.5),C.Y(1)-10,'允許值',16,'#ff9d7a',700);
  const k1=seg(u,.04,.26);if(k1>0){ln([C.X(0),C.Y(0),C.X(20*k1),C.Y(k1)],'rgba(255,255,255,.85)',3);}
  alphaDo(seg(u,.24,.28),()=>tag(C.X(20)-14,C.Y(1)-30,'設計：第 20 年',{size:16,bg:'#fff',align:'right'}));
  const k2=seg(u,.3,.5);if(k2>0){ln([C.X(0),C.Y(0),C.X(20*k2),C.Y(20*k2/28)],'#7dffc4',3.5);circ(C.X(20*k2),C.Y(20*k2/28),6,'#7dffc4','#13232e',1.5);}
  alphaDo(seg(u,.46,.5),()=>tag(C.X(20)+12,C.Y(20/28)+30,'實際量測',{size:16,bg:'#7dffc4'}));
  const k3=seg(u,.5,.64);if(k3>0){ctx.setLineDash([6,6]);ln([C.X(20),C.Y(20/28),C.X(20+8*k3),C.Y((20+8*k3)/28)],'#7dffc4',3);ctx.setLineDash([]);}
  alphaDo(seg(u,.62,.66),()=>{ln([C.X(20),C.Y(.12),C.X(28),C.Y(.12)],'#f2c230',2.5);ln([C.X(20),C.Y(.07),C.X(20),C.Y(.17)],'#f2c230',2.5);ln([C.X(28),C.Y(.07),C.X(28),C.Y(.17)],'#f2c230',2.5);
   tag(C.X(24),C.Y(.12)-36,'剩餘壽命約 8 年',{size:16,bg:'#f2c230',align:'center'});});
  card(60,660,700,140,{bg:'rgba(7,27,39,.75)'});
  wt(84,712,'場址風況比設計假設溫和，疲勞累積較慢',18,'#fff',600);
  wt(84,756,'但螺栓、焊道與葉片仍要逐項檢查確認',18,'rgba(227,236,238,.8)',600);
  /* 右：評估步驟 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'延壽評估的步驟',20,'#f2c230',700);
  const ST=[['資料回顧','SCADA 運轉資料、維修與故障紀錄'],['現場檢查','塔架螺栓、焊道、葉片、基礎'],['載重重算','以實際風況重新計算疲勞'],['做出決定','延壽、換機或除役']],T0=[.06,.22,.4,.7];
  let cur=-1;T0.forEach((t,i)=>{if(u>=t)cur=i;});
  ST.forEach(([n,s],i)=>{const y=226+i*104,on=u>=T0[i];alphaDo(on?1:.35,()=>{const c=i<cur?'#7dffc4':i===cur?'#f2c230':'rgba(227,236,238,.6)';
   box(824,y,692,86,i===cur?'rgba(242,194,48,.12)':'rgba(255,255,255,.04)',c,i===cur?2.5:1);
   circ(864,y+43,20,i<cur?'#7dffc4':'#16384c',c,2);wt(864,y+50,String(i+1),20,i<cur?'#13232e':c,800,'center',COND);
   wt(902,y+38,n,19,c,700);wt(902,y+68,s,17,'#fff',600);});});
  const OP=[['延壽','#7dffc4'],['換機','#f2c230'],['除役','#ff9d7a']];
  OP.forEach(([n,c],i)=>alphaDo(seg(u,.74+i*.06,.78+i*.06),()=>{const x=844+i*226;box(x,660,200,80,'rgba(255,255,255,.05)',c,2);wt(x+100,710,n,22,c,800,'center');}));
  wt(1170,778,'IEC TS 61400-28　DNV-ST-0262',15,'rgba(227,236,238,.55)',600,'center');
 }},

/* 3 ─────────────────────────────── 換機 */
{t:'換機：以少換多',en:'Repowering: fewer, bigger machines',dur:14,
 d:'換機（repowering）是在原場址拆掉舊風機，換上單機容量更大的新機。新機的葉片更長、輪轂更高，能接觸到更穩定的風，所以部數可以減少，總容量與發電量反而增加。以台電石門風場的更新案為例，原有 6 部 0.66 MW 機組，規劃換成 3 部單機 5 MW 以下的新機，總裝置容量上限 15 MW，2026 年通過環評。換機可以沿用場址、道路與併網線路，但仍要重新評估噪音、生態與景觀。',
 s:[[0,'舊場址：6 部 0.66 MW 風機'],[.28,'拆除舊機，換上 3 部大型新機'],[.52,'部數減半，總容量上限約為 3.8 倍'],[.74,'沿用場址與併網點，仍須重新環評']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'同一場址的更新（示意）',20,'#f2c230',700);
  const g1=420,g2=770;
  ln([80,g1,740,g1],'rgba(164,135,106,.8)',3);ln([80,g2,740,g2],'rgba(164,135,106,.8)',3);
  const fo=1-seg(u,.26,.36);
  wt(84,250,'更新前：6 部 × 0.66 MW',18,'#fff',700);
  for(let i=0;i<6;i++){const x=150+i*104;alphaDo(lerp(.25,1,fo),()=>{const hy=g1-100;poly([x-4,g1,x-2,hy,x+2,hy,x+4,g1],'#eef2f4','rgba(0,0,0,.35)',1);box(x-7,hy-5,14,9,'#dfe5e8');rotorF(x,hy,44,TT*1.6+i,1,0);});}
  const fi=ease(seg(u,.3,.46));
  wt(84,482,'更新後：3 部 × 5 MW',18,fi>0?'#f2c230':'rgba(227,236,238,.4)',700);
  [180,410,640].forEach((x,i)=>{const H=170*fi;if(H<2)return;const hy=g2-H;poly([x-8,g2,x-4,hy,x+4,hy,x+8,g2],'#eef2f4','rgba(0,0,0,.35)',1);box(x-12,hy-7,24,13,'#dfe5e8');
   alphaDo(seg(u,.4,.46),()=>rotorF(x,hy,95,TT*.8+i*1.3,1,0));});
  alphaDo(seg(u,.46,.5),()=>{wt(740,g2+22,'輪轂更高、葉片更長',15,'rgba(227,236,238,.75)',600,'right');});
  /* 右：容量比較 */
  const C=chartBox(800,160,740,350,{title:'總裝置容量（石門更新案，上限值）',x0:0,x1:2,y0:0,y1:16,xt:[],yt:[0,5,10,15],yl:'MW',pl:80,pt:80,pb:56,gx:0,gy:3});
  const B=[['更新前',3.96,'#7dc8dc',.04],['更新後',15,'#f2c230',.46]];
  B.forEach(([n,v,c,t],i)=>{const k=ease(seg(u,t,t+.1)),x0=C.X(i+.25),x1=C.X(i+.75);
   if(k>0){box(x0,C.Y(v*k),x1-x0,C.Y(0)-C.Y(v*k),c);wt((x0+x1)/2,C.Y(v*k)-12,trf('{n} MW',{n:(v*k).toFixed(v<10?2:0)}),24,'#fff',700,'center',COND);}
   wt((x0+x1)/2,C.Y(0)+32,n,18,'rgba(227,236,238,.85)',600,'center');});
  card(800,540,740,260,{bg:'rgba(7,27,39,.75)'});wt(824,580,'換機的重點',20,'#7dffc4',700);
  const PT=[['沿用原場址、道路與併網點','#7dffc4',.56],['部數減半，容量上限約 3.8 倍','#f2c230',.62],['重新評估噪音、生態與景觀','#ff9d7a',.76]];
  PT.forEach(([s,c,t],i)=>alphaDo(seg(u,t,t+.05),()=>{const y=604+i*62;box(824,y,692,50,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);box(824,y,6,50,c);wt(846,y+33,s,18,'#fff',600);}));
 }},

/* 4 ─────────────────────────────── 反向拆除 */
{t:'反向拆除',en:'Dismantling in reverse',dur:14,side:true,
 d:'拆除風機大致是吊裝的倒帶。先停機、鎖定轉子，排空齒輪油與液壓油並切斷電力。主吊機把轉子連同三支葉片整組吊下，在接近地面時由輔助吊機扶住下方葉片，讓轉子轉為水平放在地上；接著吊下機艙，再由上而下一段一段拆下塔架。吊裝需要在風速限制內進行，拆下的大件會在現場再分解，鋼製塔架與機艙內的銅、鋼大多可以直接回收。',
 s:[[0,'停機、鎖定轉子並排空油料'],[.1,'主吊機把轉子整組吊下'],[.32,'接近地面時轉為水平放下'],[.46,'吊下機艙'],[.72,'由上而下拆除塔架']],
 cam:u=>({x:800,y:420,s:1}),
 draw(u){
  const g=gyy(TX),hy=RT[1];
  [[150,0],[1500,1]].forEach(([x,i])=>tree(x,10+4*Math.sin(TT*2.4+i)));
  /* 轉子路徑 */
  const rk=seg(u,.1,.42);
  const rp=K(rk,[[0,TX,hy],[.15,TX,hy-34],[.55,600,320],[.8,540,430],[1,540,g-14]]);
  const rsy=lerp(1,.22,ease(seg(rk,.7,1)));
  /* 機艙路徑 */
  const nk=seg(u,.46,.7);const np=K(nk,[[0,TX,hy],[.2,TX,hy-40],[.6,1010,300],[1,1250,g-22]]);
  /* 塔架上段 */
  const tk=seg(u,.72,.96);const tY0=hy+8,tY1=g-H4*.6;     // 上段範圍
  const tc=(tY0+tY1)/2,tp=K(tk,[[0,TX,tc],[.2,TX,tc-40],[.6,1200,380],[1,1400,g-14]]);
  const tang=Math.PI/2*ease(seg(tk,.7,1));
  /* 地上的物件 */
  towerF(TX,g,tk>0?tY1:hy,H4,0);
  if(nk===0){nacF(TX,hy,H4);}
  else{nacF(np[0],np[1],H4);}
  rotorF(rp[0],rp[1],R4,ROT0,rsy,0);
  if(tk>0){ctx.save();ctx.translate(tp[0],tp[1]);ctx.rotate(-tang);const L=tY1-tY0;const wb=H4*.05+6,f0=.6,wa=lerp(wb,H4*.028+4,f0);
   poly([-wa,L/2,-(H4*.028+4),-L/2,(H4*.028+4),-L/2,wa,L/2],'#eef2f4','rgba(0,0,0,.3)',1);ctx.restore();}
  /* 吊機 */
  let hx,hk,sl=null;
  if(u<.44){hx=rp[0];hk=rp[1]-26;sl=[rp[0]-8,rp[1]-6,rp[0]+8,rp[1]-6];}
  else if(u<.72){const k=seg(u,.42,.46);hx=lerp(540,np[0],k);hk=lerp(g-120,np[1]-40,k);if(u>=.46)sl=[np[0]-20,np[1]-14,np[0]+20,np[1]-14];}
  else{const k=seg(u,.7,.72);const L=(tY1-tY0)/2;hx=lerp(1250,tp[0],k);hk=lerp(g-120,tp[1]-L*Math.cos(tang)-30,k);if(u>=.72)sl=[tp[0]-6,tp[1]-L*Math.cos(tang)-4,tp[0]+6,tp[1]-L*Math.cos(tang)-4];}
  const mp=crawler(1000);const mh=crane(mp.x,mp.y,520,hx,hk,{col:'#e9b21f'});if(sl)slings(mh.x,mh.hy,sl);
  /* 輔助吊機扶住下方葉片 */
  if(rk>.6&&rk<1){const a=band(rk,.6,.98);alphaDo(a,()=>{const tx=rp[0],ty=rp[1]+R4*rsy;ln([tx,ty,tx-120,ty-180],'rgba(30,35,40,.7)',1);});}
  person(TX-60,g,'#e8572a',2.2);person(TX+40,g,'#e8572a',2.2);
  lab(TX,hy,'鎖定轉子',{dx:-150,dy:-50,st:'s',a:band(u,0,.12)});
  lab(rp[0],rp[1],'轉子整組吊下',{dx:-150,dy:-40,st:'s',a:band(u,.14,.34)});
  lab(rp[0]-R4*.6,rp[1],'轉為水平放下',{dx:-80,dy:-90,st:'g',a:band(u,.34,.5)});
  lab(np[0],np[1],'機艙',{dx:120,dy:-60,st:'s',a:band(u,.48,.7)});
  lab(tp[0],tp[1],'塔架上段',{dx:-150,dy:-60,st:'s',a:band(u,.74,.98)});
  lab(mp.x,mp.y-10,'主吊機',{dx:120,dy:40,st:'l',a:band(u,.04,.26)});
 },
 hud(u){hudPanel(250,182,'拆除進度',seg(u,.03,.08),w=>{
  const R=[['鎖定轉子',0,.1],['吊下轉子',.1,.44],['吊下機艙',.46,.7],['拆除塔架',.72,.96]];
  R.forEach(([n,a,b],i)=>hrow(56+i*32,n,u>=b?'完成':u>=a?'進行中':'—',w,u>=b?'#7dffc4':u>=a?'#f2c230':'#fff'));});}},

/* 5 ─────────────────────────────── 葉片切割 */
{t:'葉片現場切割與運輸',en:'Cutting blades on site',dur:13,side:true,
 d:'鋼材和銅很好回收，難題在葉片。葉片由玻璃纖維、環氧樹脂與輕木或泡棉芯材層層黏合，強度高、重量輕，卻很難拆開。整支長葉片要動用特殊車輛才能運出，所以常在現場先用鑽石鋼索鋸或水刀切成數段，切割時以灑水或集塵設備抑制粉塵，作業人員配戴防護具。切成數公尺長的段落後，用一般卡車就能載到處理廠。',
 s:[[0,'拆下的葉片平放在地上'],[.18,'用鑽石鋼索鋸切成數段'],[.4,'灑水與集塵，抑制玻纖粉塵'],[.62,'切段後用一般卡車載運']],
 cam:u=>({x:760,y:470,s:1.25}),
 draw(u){
  const g=gyy(760),y=g-22,x0=1080,L=620;
  [[260,0],[1240,1]].forEach(([x,i])=>tree(x,10+4*Math.sin(TT*2.4+i)));
  const cuts=[0,.26,.5,.74,1],CT=[.18,.3,.42];
  const load=seg(u,.66,.76);
  /* 支架 */
  [.1,.4,.62,.88].forEach(f=>{const x=x0-L*f;box(x-10,y-4,20,y>0?g-y+4:0,'#6f7a80');});
  for(let i=0;i<4;i++){const sh=(i?ease(seg(u,CT[Math.min(i-1,2)],CT[Math.min(i-1,2)]+.08)):0)*-14*i;
   const done=i<3?u>=CT[i]+.06:true;const gone=load>(i+1)/5;
   if(!gone)ctx.save(),ctx.translate(sh,0),bladeSide(x0,y,L,cuts[i],cuts[i+1]),ctx.restore();}
  /* 鋼索鋸 */
  const ci=CT.findIndex(t=>u>=t&&u<t+.1);
  if(ci>=0){const k=seg(u,CT[ci],CT[ci]+.1),cx=x0-L*cuts[ci+1]-14*(ci+1)*0;
   box(cx-16,y-80,32,18,'#e9b21f','rgba(0,0,0,.3)',1);ln([cx,y-62,cx,lerp(y-34,y,k)],'#d0d6da',2);
   const r=rng(ci*7+Math.floor(TT*12));for(let i=0;i<14;i++){const a=r()*Math.PI,d=r()*30;circ(cx+Math.cos(a)*d,lerp(y-30,y-4,k)-Math.sin(a)*d*.6,1.6,'rgba(210,214,216,.75)');}
   person(cx+28,g,'#e8572a',2.4);}
  /* 灑水 */
  const wa=band(u,.38,.6);if(wa>0)alphaDo(wa,()=>{const cx=x0-L*.5;for(let i=0;i<10;i++){const k=((TT*1.5+i/10)%1);circ(cx+40-k*40,y-70+k*60,2,'#7dc8dc');}ln([cx+60,g,cx+40,y-70],'#3d4750',2);});
  /* 卡車 */
  const tx=u<.62?2000:u<.7?lerp(1500,620,ease(seg(u,.62,.7))):u<.82?620:lerp(620,-200,easeIn(seg(u,.82,1)));
  truck(tx,g+56,true,'#7dc8dc',()=>{const n=Math.round(load*4);for(let i=0;i<n;i++)box(4+(i%2)*44,-46-Math.floor(i/2)*12,40,12,'#eef2f4','rgba(0,0,0,.4)',1);});
  lab(x0-L*.45,y-26,'退役葉片',{dx:-80,dy:-90,st:'l',a:band(u,0,.18)});
  lab(x0-L*.26,y-60,'鑽石鋼索鋸',{dx:-120,dy:-70,st:'s',a:band(u,.18,.4)});
  lab(x0-L*.5,y-50,'灑水抑制粉塵',{dx:110,dy:-90,st:'g',a:band(u,.4,.62)});
  lab(tx-60,g+20,'一般卡車載運',{dx:-60,dy:-110,st:'s',a:band(u,.68,.9)});
 },
 hud(u){hudPanel(250,182,'葉片處理（示例）',seg(u,.03,.08),w=>{const n=u<.24?1:u<.36?2:u<.48?3:4;
  hrow(56,'葉片長度','23 m',w,'#fff');
  hrow(88,'每支重量','≈ 2 t',w,'#fff');
  hrow(120,'切割段數',trf('{n} 段',{n:u<.18?1:n}),w,'#f2c230');
  hrow(152,'運輸',u<.62?'待切割':u<.82?'裝車中':'送往處理廠',w,u<.62?'#fff':'#7dffc4');});}},

/* 6 ─────────────────────────────── 葉片材料去哪裡 */
{t:'葉片材料的去處',en:'Where blade materials go',dur:14,
 d:'一部風機總質量約 85–90% 是塔架、機艙裡的鋼材與金屬，可以熔煉再利用；剩下的大多是葉片的複合材料。退役葉片的處理途徑包括：機械粉碎後做成填料或板材；送進水泥窯共處理，玻璃纖維成為水泥原料、樹脂提供熱能；以熱解在數百度下分解樹脂，回收纖維與油氣；新一代可回收葉片則改用能在溶液中分離的樹脂。奧地利、德國、荷蘭、芬蘭已禁止複合材料掩埋，台灣也已將退役葉片納入回收再利用管理。',
 s:[[0,'風機質量多為鋼材，可直接回收'],[.25,'葉片複合材料是回收的難題'],[.42,'粉碎、水泥窯共處理、熱解'],[.75,'可回收葉片：樹脂可分離再利用']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});
  wt(84,200,'一部風機的質量組成（示例）',20,'#f2c230',700);
  const k1=ease(seg(u,.04,.2)),bx=84,bw=652;
  box(bx,230,bw,56,'rgba(255,255,255,.05)','rgba(255,255,255,.2)',1);
  box(bx,230,bw*.88*k1,56,'#7dffc4');if(k1>.5)wt(bx+14,268,'鋼材與金屬 約 88%',18,'#13232e',700);
  const k1b=seg(u,.18,.24);box(bx+bw*.88,230,bw*.12*k1b,56,'#ff9d7a');
  alphaDo(seg(u,.2,.26),()=>{wt(bx+bw,314,'葉片等複合材料',16,'#ff9d7a',700,'right');});
  alphaDo(seg(u,.26,.32),()=>{
   wt(84,380,'一支葉片的材料（示例）',20,'#f2c230',700);
   const M=[['玻璃纖維',.6,'#7dc8dc'],['樹脂與膠',.3,'#f2c230'],['芯材與其他',.1,'#b37cff']];let x=bx;
   M.forEach(([n,f,c],i)=>{const w=bw*f*ease(seg(u,.28+i*.04,.34+i*.04));box(x,410,w,56,c);x+=bw*f;});
   M.forEach(([n,f,c],i)=>{const y=500+i*44;box(84,y,22,22,c);wt(120,y+18,n,18,'#fff',600);wt(736,y+18,trf('約 {n}%',{n:Math.round(f*100)}),18,'#fff',700,'right',COND);});
  });
  alphaDo(seg(u,.82,.88),()=>{box(84,664,652,112,'rgba(232,87,42,.1)','rgba(255,157,122,.6)',1.5);
   wt(104,706,'奧地利、德國、荷蘭、芬蘭',18,'#ff9d7a',700);wt(104,746,'已禁止複合材料進入掩埋場',18,'#fff',600);});
  /* 右：途徑 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'退役葉片的處理途徑',20,'#f2c230',700);
  const sx=900,sy=500;
  box(sx-70,sy-40,140,80,'rgba(242,194,48,.15)','#f2c230',2);wt(sx,sy-4,'退役葉片',18,'#f2c230',700,'center');wt(sx,sy+24,'切段',16,'#fff',600,'center');
  const RT2=[['機械粉碎','填料、板材、建材',.4],['水泥窯共處理','玻纖成原料、樹脂供熱',.5],['熱解','數百度分解樹脂，回收纖維',.6],['可回收葉片','樹脂可在溶液中分離',.74]];
  RT2.forEach(([n,s,t],i)=>{const y=232+i*134,on=seg(u,t,t+.06),c=i===3?'#7dffc4':'#7dc8dc';
   alphaDo(lerp(.25,1,on),()=>{ctx.setLineDash(on>0?[]:[5,5]);ln([sx+70,sy,1010,y+56],on>0?c:'rgba(227,236,238,.4)',2);ctx.setLineDash([]);
    box(1010,y,506,112,on>0?'rgba(125,200,220,.08)':'rgba(255,255,255,.03)',on>0?c:'rgba(227,236,238,.3)',on>0?2:1);
    wt(1034,y+46,n,20,c,700);wt(1034,y+84,s,17,'#fff',600);});
   if(on>0){const k=(TT*.8+i*.25)%1;circ(lerp(sx+70,1010,k),lerp(sy,y+56,k),4,c);}});
 }},

/* 7 ─────────────────────────────── 基礎拆除與復原 */
{t:'基礎拆除與土地復原',en:'Removing foundations, restoring land',dur:13,side:true,
 d:'風機的擴展式基礎是數百立方公尺的鋼筋混凝土，大部分埋在地下。常見做法是開挖基礎周圍，用破碎機打除墩座與上部混凝土，到地表下約 1 公尺，再回填土壤恢復耕作或植生；也有地區要求整座基礎全部移除。打下的混凝土碎塊可做為級配料，鋼筋分離後回收。若是換機，新基礎通常另選位置興建，原地則恢復成土地，由主管機關與地主確認復原結果。',
 s:[[0,'塔架拆除後，只剩地上的基礎墩座'],[.16,'開挖周圍，以破碎機打除上部混凝土'],[.48,'打除到地表下約 1 公尺'],[.62,'鋼筋與混凝土碎塊分開回收'],[.8,'回填土壤，恢復植生']],
 cam:u=>({x:760,y:610,s:1.55}),
 draw(u){
  const X=700,g=gyy(X),D=50;          // D：地表下約 1 m
  const pit=ease(seg(u,.08,.2)),brk=seg(u,.18,.5),fill=ease(seg(u,.76,.92)),grass=seg(u,.88,1);
  /* 開挖坑 */
  const pw=lerp(70,170,pit),pd=D+10;
  if(pit>0&&fill<1){poly([X-pw,g,X+pw,g,X+pw-20,g+pd,X-pw+20,g+pd],'#6b5236');ln([X-pw,g,X-pw+20,g+pd,X+pw-20,g+pd,X+pw,g],'#4f3c27',2);}
  /* 底板（保留） */
  poly([X-60,g+D,X+60,g+D,X+190,g+120,X-190,g+120],'#9aa3a8','rgba(0,0,0,.4)',1);box(X-190,g+120,380,40,'#8d989f','rgba(0,0,0,.4)',1);
  ctx.setLineDash([5,5]);ln([X-180,g+140,X+180,g+140],'rgba(40,50,60,.55)',1.5);ctx.setLineDash([]);
  /* 墩座（被打除的部分） */
  const top=lerp(g-24,g+D,brk);
  if(top<g+D-1){box(X-46,top,92,g+D-top,'#a7b0b4','rgba(0,0,0,.4)',1);
   if(brk<.15)for(let i=-3;i<=3;i++)ln([X+i*12,top,X+i*12,top-10],'#5b6670',2.5);
   if(brk>0&&brk<1){const r=rng(Math.floor(TT*14));for(let i=0;i<10;i++)circ(X-40+r()*80,top-r()*16,2+r()*3,'#c4cbce');
    for(let i=0;i<4;i++)ln([X-30+i*20,top,X-26+i*20+(r()-.5)*8,top-14],'#b56a3c',1.8);}}
  /* 碎塊堆 */
  const pile=seg(u,.2,.5)*(1-seg(u,.62,.74));
  if(pile>0){const r=rng(3);for(let i=0;i<26*pile;i++)circ(X-260+r()*90,g-4-r()*24*pile,4+r()*5,'#b5bcc0','rgba(0,0,0,.25)',.8);
   for(let i=0;i<6*pile;i++)ln([X-270+r()*90,g-6-r()*20,X-240+r()*90,g-10-r()*20],'#b56a3c',2);}
  /* 回填 */
  if(fill>0){alphaDo(fill,()=>{poly([X-pw,g,X+pw,g,X+pw-20,g+pd,X-pw+20,g+pd],'#8a6a45');box(X-46,g+2,92,D-2,'#8a6a45');});
   ctx.strokeStyle='#5c8a3f';ctx.lineWidth=1.2;ctx.beginPath();for(let x=X-pw;x<=X+pw;x+=5){const h=(3+(x%4))*grass;ctx.moveTo(x,g);ctx.lineTo(x+1,g-h);}ctx.stroke();}
  /* 挖土機 */
  const ex=u<.6?lerp(1000,930,seg(u,.06,.16)):u<.76?930:lerp(930,960,seg(u,.76,.8));
  const hammer=u>=.18&&u<.52,drop=hammer?Math.abs(Math.sin(TT*16))*6+(top-g)+26:fill>0?-10:20;
  excavator(ex,gyy(ex),ex-X-10,drop,hammer);
  /* 卡車載走 */
  const tk=seg(u,.6,.76);if(tk>0&&tk<1){const tx=lerp(360,-200,easeIn(seg(tk,.5,1)));truck(tx,g,true,'#e8572a',()=>{if(tk>.3)for(let i=0;i<5;i++)circ(18+i*14,-38-(i%2)*6,7,'#b5bcc0');});}
  ctx.setLineDash([6,5]);alphaDo(band(u,.44,.8),()=>{ln([X-200,g+D,X+200,g+D],'#f2c230',2);});ctx.setLineDash([]);
  lab(X,g-24,'基礎墩座',{dx:-120,dy:-60,st:'l',a:band(u,0,.16)});
  lab(X+30,g-30,'錨栓',{dx:90,dy:-70,st:'l',a:band(u,0,.16)});
  lab(X-20,top,'破碎機打除',{dx:-130,dy:-80,st:'s',a:band(u,.2,.46)});
  lab(X+200,g+D,'地表下約 1 m',{dx:90,dy:30,st:'s',a:band(u,.46,.8)});
  lab(X+150,g+130,'底板留在地下',{dx:70,dy:60,st:'l',a:band(u,.5,.78)});
  lab(X-230,g-14,'混凝土碎塊與鋼筋',{dx:-40,dy:-90,st:'g',a:band(u,.6,.74)});
  lab(X,g-4,'覆土植生',{dx:-110,dy:-80,st:'g',a:band(u,.84,1)});
 },
 hud(u){hudPanel(250,150,'基礎拆除（示例）',seg(u,.03,.08),w=>{
  hrow(56,'打除進度',trf('{n}%',{n:Math.round(100*seg(u,.18,.5))}),w,'#f2c230');
  hrow(88,'鋼筋',u<.62?'分離中':'送回收',w,u<.62?'#fff':'#7dffc4');
  hrow(120,'土地',u<.8?'施工中':'復原',w,u<.8?'#fff':'#7dffc4');});}}
]};
