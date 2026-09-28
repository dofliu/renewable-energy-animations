// KITS: land
/* 生質能系列 第 1 集：沼氣發電 */
/* 養豬場剖面（示意，比例壓縮）：左豬舍 → 固液分離 → 覆蓋式厭氧消化槽 → 脫硫塔 → 發電機組 → 併網；右側沼液貯存池 */
const BARN={x:60,w:340,y:478};
const SEP={x:446,w:84};
const DG={x0:580,x1:1000,top:600,dep:84};           // 厭氧消化槽：地面下的池體＋紅泥膠布覆蓋
const TW={x:1052,w:40,y:462};                         // 脫硫塔
const GEN={x:1130,w:150,y:536};                       // 發電機組貨櫃
const POLE=1340;
const POND={x:1390,w:170};
const GAS_C='#b37cff',PWR_C='#f2c230',SLR_C='#c9a46a';
/* 只在畫面中段飄動的雲，避開左上章節卡 */
const MYCL=[[560,210,.7,4],[860,150,.55,3],[1100,240,.6,5],[300,300,.5,3.5]];
function clouds(){for(const [x0,y,sc,sp] of MYCL){const x=480+((x0-480+TT*sp)%900+900)%900;lcloud(x,y,sc);}}
function pl(P,col,lw){ctx.lineJoin='round';ln(P.flat(),col,lw);}
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1;const p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4,col));}}
/* 側視小豬：(x,y) 腳底，s 縮放，flip 面向左 */
function pig(x,y,s,flip,ph){
  ctx.save();ctx.translate(x,y);ctx.scale(flip?-s:s,s);
  const b=Math.sin(TT*3+(ph||0))*1.2;
  for(const lx of [-12,-5,7,13])ln([lx,-8,lx,0],'#d98a8a',3.5);
  ctx.beginPath();ctx.ellipse(0,-15+b*.3,19,10,0,0,TAU);ctx.fillStyle='#f0b4b0';ctx.fill();
  circ(19,-18+b*.3,8,'#f0b4b0');box(24,-20+b*.3,5,6,'#e59a96');poly([14,-24,18,-31,21,-24],'#e59a96');
  circ(20,-20+b*.3,1.3,'#3a2a2a');ctx.restore();
}
/* 覆蓋膜頂點高度：inf 0–1 表示集氣量 */
const domeH=inf=>40+44*inf;
function digester(inf,o){
  o=o||{};const {x0,x1,top,dep}=DG,H=domeH(inf);
  box(x0-8,top-4,x1-x0+16,dep+12,'#9aa4aa');                                   // 池壁
  const g=ctx.createLinearGradient(0,top,0,top+dep);g.addColorStop(0,'#7a6a45');g.addColorStop(1,'#4d3f28');
  box(x0,top,x1-x0,dep,g);
  box(x0,top+dep-16,x1-x0,16,'#3b2f1f');                                          // 底部沼渣
  /* 液中氣泡 */
  const r=rng(31);for(let k=0;k<22;k++){const bx=x0+20+r()*(x1-x0-40),sp=.25+r()*.25,f=(TT*sp+r())%1;alphaDo((o.bub===undefined?1:o.bub)*(1-f)*.9,()=>circ(bx+Math.sin(f*9+k)*3,top+dep-18-f*(dep-22),2+r()*2,'rgba(220,210,255,.8)'));}
  /* 氣室與紅泥膠布 */
  ctx.beginPath();ctx.moveTo(x0-6,top);ctx.quadraticCurveTo((x0+x1)/2,top-2*H,x1+6,top);ctx.closePath();
  ctx.fillStyle=o.cut?'rgba(179,124,255,.28)':'#8a3f30';ctx.fill();
  ctx.beginPath();ctx.moveTo(x0-6,top);ctx.quadraticCurveTo((x0+x1)/2,top-2*H,x1+6,top);ctx.strokeStyle='#6a2c22';ctx.lineWidth=3;ctx.stroke();
  if(!o.cut){ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0+60,top-10);ctx.quadraticCurveTo((x0+x1)/2,top-2*H+14,x1-60,top-10);ctx.stroke();}
}
function farm(o){
  o=o||{};const inf=o.inf===undefined?.8:o.inf;
  /* 遠景樹與田 */
  const r=rng(12);for(let i=0;i<26;i++){const x=-100+r()*1800;circ(x,588-r()*6,12+r()*10,'#6f9450');}
  /* 豬舍 */
  box(BARN.x,BARN.y+20,BARN.w,600-BARN.y-20,'#e4e0d6','rgba(0,0,0,.3)',1.5);
  poly([BARN.x-14,BARN.y+22,BARN.x+BARN.w/2,BARN.y-18,BARN.x+BARN.w+14,BARN.y+22],'#6d7c86');
  box(BARN.x+14,BARN.y+44,BARN.w-28,40,'#39424a');
  const pr=rng(5);for(let i=0;i<7;i++)pig(BARN.x+44+i*44,BARN.y+84,.85,pr()<.4,i);
  box(BARN.x,BARN.y+88,BARN.w,34,'#cfc9bb');
  box(BARN.x+BARN.w-8,590,70,10,'#5a4a32');                                      // 集糞溝
  /* 固液分離機 */
  box(SEP.x,560,SEP.w,40,'#9aa4aa','rgba(0,0,0,.3)',1.5);
  ctx.save();ctx.translate(SEP.x+SEP.w/2,548);ctx.rotate(-.12);box(-44,-11,88,22,'#5f7f92','#c9d1d6',1.5);
  for(let k=0;k<6;k++){const x=-38+((k*14+TT*20)%84);ln([x,-10,x+6,10],'#c9d1d6',1.5);}ctx.restore();
  poly([SEP.x-40,600,SEP.x-14,574,SEP.x+8,600],'#6b5433');                        // 固形物堆
  ln([SEP.x+SEP.w,594,DG.x0-6,594],'#44535c',8);ln([SEP.x+SEP.w,594,DG.x0-6,594],'#7a6a45',4);
  digester(inf,o);
  /* 沼氣管線 → 脫硫塔 → 發電機組 */
  const gx=(DG.x0+DG.x1)/2,gy=DG.top-domeH(inf);
  ln([gx,gy,gx,470,TW.x,470],'#6d7c86',6);
  box(TW.x,TW.y,TW.w,600-TW.y,'#c9d1d6','rgba(0,0,0,.35)',1.5);ctx.beginPath();ctx.ellipse(TW.x+TW.w/2,TW.y,TW.w/2,7,0,Math.PI,0);ctx.fillStyle='#c9d1d6';ctx.fill();
  for(let k=0;k<4;k++)box(TW.x+5,TW.y+20+k*28,TW.w-10,14,'#8a7a55');
  ln([TW.x+TW.w,580,GEN.x,580],'#6d7c86',6);
  box(GEN.x,GEN.y,GEN.w,600-GEN.y,'#3f6f5c','rgba(0,0,0,.35)',1.5);
  for(let k=0;k<6;k++)ln([GEN.x+12+k*22,GEN.y+8,GEN.x+12+k*22,592],'rgba(0,0,0,.18)',2);
  ln([GEN.x+GEN.w-22,GEN.y,GEN.x+GEN.w-22,GEN.y-50],'#44535c',8);
  const on=o.on===undefined?1:o.on;
  for(let k=0;k<5;k++){const f=(TT*.5+k/5)%1;alphaDo(on*(1-f)*.5,()=>circ(GEN.x+GEN.w-22+f*30,GEN.y-54-f*70,6+f*14,'rgba(235,240,242,.9)'));}
  /* 餘熱回收管（回到消化槽加溫） */
  if(o.heat)ln([GEN.x+20,596,GEN.x+20,640,DG.x1+20,640,DG.x1+20,DG.top+20,DG.x1,DG.top+20],'#c8553d',4);
  /* 電桿與線路 */
  ln([POLE,600,POLE,430],'#6b5a48',5);ln([POLE-26,442,POLE+26,442],'#6b5a48',3);box(POLE-14,460,28,30,'#8d989f');
  ln([GEN.x+GEN.w,548,POLE-14,480],'#394650',2);ln([POLE-24,442,VX0-10,430],'#394650',1.5);ln([POLE+24,442,VX1+10,430],'#394650',1.5);
  /* 沼液貯存池 */
  box(POND.x-6,598,POND.w+12,46,'#9aa4aa');box(POND.x,600,POND.w,40,'#6b5a34');ln([POND.x,601,POND.x+POND.w,601],'rgba(255,255,255,.35)',1.5);
  ln([DG.x1+6,DG.top+50,DG.x1+40,DG.top+50,DG.x1+40,660,POND.x+20,660,POND.x+20,640],'#44535c',6);
}
const P_MANURE=[[BARN.x+BARN.w,594],[SEP.x,594]];
const P_SLURRY=[[SEP.x+SEP.w,594],[DG.x0,594],[DG.x0+30,630]];
const P_GAS=inf=>[[(DG.x0+DG.x1)/2,DG.top-domeH(inf)],[(DG.x0+DG.x1)/2,470],[TW.x,470],[TW.x+TW.w/2,470],[TW.x+TW.w/2,580],[GEN.x+10,580]];
const P_PWR=[[GEN.x+GEN.w,548],[POLE-14,480],[POLE,442],[1620,430]];
const P_EFF=[[DG.x1+6,DG.top+50],[DG.x1+40,DG.top+50],[DG.x1+40,660],[POND.x+20,660],[POND.x+20,640]];

/* 田間場景：沼液槽車施灌 */
function crop(x,y,h,col){ln([x,y,x,y-h],'#4f7a35',2);for(let k=1;k<=3;k++){const yy=y-h*k/3.4;ln([x,yy,x-6*h/26,yy-5*h/26],col,2);ln([x,yy,x+6*h/26,yy-5*h/26],col,2);}}
function fieldScene(u,tx){
  landSky(560,{sun:{x:900,y:150},clouds:false});
  box(VX0,560,VX1-VX0,VY1-540,'#8a7560');box(VX0,560,VX1-VX0,44,'#9a8466');
  const r=rng(9);for(let i=0;i<14;i++){const x=VX0+r()*(VX1-VX0);circ(x,554,10+r()*8,'#6f9450');}
  /* 遠方的牧場與消化槽 */
  box(120,520,140,40,'#e4e0d6');poly([110,522,190,500,270,522],'#6d7c86');ctx.beginPath();ctx.ellipse(340,560,70,16,0,Math.PI,0);ctx.fillStyle='#8a3f30';ctx.fill();
  /* 田壟與作物：槽車經過的地方先變濕、再長高 */
  for(let x=40;x<1560;x+=34){const wet=clamp((tx-x)/60),gr=clamp((tx-x-200)/500)*seg(u,.1,1);
    if(wet>0)alphaDo(wet*.6,()=>box(x-17,598,34,8,'#5f4d36'));
    crop(x,600,18+46*gr,gr>.5?'#5c9a3f':'#7fae55');}
  /* 沼渣堆肥 */
  poly([1400,600,1470,556,1540,600],'#5a4428');ln([1420,586,1520,586],'rgba(0,0,0,.15)',2);
}
function tanker(x,spray){
  truck(x,600,false,'#3f6f5c',()=>{ctx.beginPath();ctx.ellipse(45,-48,46,17,0,0,TAU);ctx.fillStyle='#d9dfe2';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1.5;ctx.stroke();box(-6,-40,10,8,'#44535c');});
  if(spray>0)for(let k=0;k<14;k++){const f=(TT*1.6+k/14)%1;alphaDo(spray*(1-f)*.8,()=>circ(x-6-f*(40+k%5*8),566+f*f*32-f*6,3,'#8a6a3a'));}
}

const EP={no:1,slug:'bioenergy',seriesName:'生質能系列',t:'沼氣發電',en:'Biogas power from livestock manure',
lede:'豬糞尿曾是河川污染的來源，現在卻能變成電與肥料。這一集走進養豬場，看糞尿廢水如何在厭氧消化槽裡被微生物分解成沼氣，沼氣為什麼要先脫硫，再送進發電機組；接著算一算一座養豬場能發多少電，最後看沼渣沼液如何回到農田，以及收集甲烷對減碳的意義。',
facts:[['60–70','%','沼氣中甲烷的比例，其餘大多是二氧化碳，另含數百到數千 ppm 的硫化氫'],
['約 0.1','m³／頭・日','每頭豬每天的糞尿經厭氧消化可產生的沼氣量（示例，隨季節與管理而變）'],
['約 0.7','m³／度','發一度電約需消耗的沼氣量（甲烷約 60%，小型機組示例）'],
['約 26 萬','度／年','5,000 頭規模養豬場的年發電量（示例）'],
['7.0192','元／度','2025、2026 年度沼氣發電（有厭氧消化設備）的躉購費率'],
['約 28','倍','甲烷在 100 年尺度的暖化潛勢約為二氧化碳的倍數（IPCC AR5）']],
note:'說明：本集為教育用途示意動畫，養豬場、消化槽與發電設備的比例經過壓縮。沼氣成分、每頭豬每日沼氣量（約 0.1 m³）、發電耗氣量（約 0.7 m³／度）參考農業部、畜產試驗所與能源教育資源公開資料；躉購費率依經濟部 114、115 年度再生能源電能躉購費率公告；甲烷暖化潛勢依 IPCC 第五次評估報告。5,000 頭規模、流量、硫化氫濃度、發電效率、施灌量等為典型範例，實際數值依各場設計、季節與飼養管理而不同。沼液沼渣作農地肥分使用須依環境部規定提出計畫並經核准。',
base:()=>{landSky(600,{sun:{x:1240,y:110},clouds:false});clouds();drawGround();},
shots:[
{t:'豬糞尿變成能源',en:'From manure to energy',dur:14,side:true,
 d:'台灣的養豬場多半用水沖洗豬舍，每頭豬每天約產生 30 公升的糞尿廢水。過去常見的三段式處理是固液分離、厭氧處理、好氧處理，厭氧池產生的沼氣大多直接排放。沼氣發電把這條流程串起來：固液分離後的廢水進入覆蓋紅泥膠布的厭氧消化槽，微生物在無氧環境下分解有機物產生沼氣，膠布鼓起就是集氣。沼氣經脫硫後送進發電機組，電力併入台電線路，消化後的沼液則送往貯存池。',
 s:[[0,'豬舍沖洗後的糞尿廢水，先經固液分離'],[.24,'廢水進入覆蓋膠布的厭氧消化槽'],[.48,'膠布鼓起，是槽內產生的沼氣'],[.72,'沼氣脫硫後發電，沼液送往貯存池']],
 cam:u=>({x:800,y:500,s:1.12}),
 draw(u){
  farm({inf:lerp(.3,.9,ease(seg(u,.3,.6)))});
  const inf=lerp(.3,.9,ease(seg(u,.3,.6)));
  flowDots(P_MANURE,4,SLR_C,seg(u,.02,.08),.6,4);
  flowDots(P_SLURRY,5,SLR_C,seg(u,.2,.26),.5,4);
  flowDots(P_GAS(inf),10,GAS_C,seg(u,.62,.68),.35,4.5);
  flowDots(P_PWR,5,PWR_C,seg(u,.7,.76),.6,3.5);
  flowDots(P_EFF,6,SLR_C,seg(u,.74,.8),.35,3.5);
  lab(BARN.x+BARN.w/2,BARN.y,'豬舍',{dx:-40,dy:-80,st:'l',a:band(u,.02,.3)});
  lab(SEP.x+SEP.w/2,540,'固液分離',{dx:-30,dy:-110,a:band(u,.08,.34)});
  lab(790,DG.top-domeH(inf)+10,'厭氧消化槽',{dx:-40,dy:-100,st:'s',a:band(u,.24,.62)});
  lab(TW.x+TW.w/2,TW.y,'脫硫塔',{dx:-30,dy:-90,a:band(u,.66,1)});
  lab(GEN.x+60,GEN.y,'發電機組',{dx:20,dy:-150,st:'s',a:band(u,.7,1)});
  lab(POND.x+POND.w/2,610,'沼液貯存池',{dx:0,dy:110,st:'g',a:band(u,.76,1)});
 },
 hud(u){hudPanel(250,150,'養豬場（示例）',seg(u,.04,.1),w=>{const g=seg(u,.06,.3),b=ease(seg(u,.3,.62));
  hrow(56,'飼養頭數',trf('{n} 頭',{n:Math.round(5000*g).toLocaleString('en-US')}),w,'#fff');
  hrow(88,'每日廢水',trf('{v} m³',{v:Math.round(150*g)}),w,'#c9a46a');
  hrow(120,'每日沼氣',trf('約 {v} m³',{v:Math.round(500*b)}),w,'#b37cff');});}},

{t:'厭氧消化：微生物的接力',en:'Anaerobic digestion',dur:13,
 d:'厭氧消化是一場四個階段的微生物接力。第一步水解，把糞尿裡的蛋白質、脂肪與纖維分解成胺基酸、脂肪酸與糖；第二步酸化，發酵成揮發性脂肪酸；第三步乙酸化，再轉成乙酸、氫與二氧化碳；最後由甲烷菌把它們變成甲烷。甲烷菌生長慢、怕氧氣，也對溫度與酸鹼值敏感，一般維持在 35°C 左右的中溫、pH 約 6.8 到 7.5，並讓廢水在槽內停留數週。沒被分解完的固體沉到槽底成為沼渣。',
 s:[[0,'槽內沒有氧氣，由微生物接力分解有機物'],[.26,'水解、酸化、乙酸化，一步步拆小分子'],[.52,'最後由甲烷菌產生甲烷與二氧化碳'],[.76,'甲烷菌怕氧、怕冷，也怕太酸']],
 draw(u){
  diagBG();
  card(60,160,660,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'消化槽剖面（示意）',20,'#f2c230',700);
  const x0=110,x1=670,top=420,bot=740;
  box(x0-10,top-6,x1-x0+20,bot-top+16,'#6d7c86');
  const g=ctx.createLinearGradient(0,top,0,bot);g.addColorStop(0,'#7a6a45');g.addColorStop(1,'#4d3f28');box(x0,top,x1-x0,bot-top,g);
  box(x0,bot-30,x1-x0,30,'#3b2f1f');
  const H=110;ctx.beginPath();ctx.moveTo(x0-10,top);ctx.quadraticCurveTo((x0+x1)/2,top-2*H,x1+10,top);ctx.closePath();ctx.fillStyle='rgba(179,124,255,.25)';ctx.fill();
  ctx.beginPath();ctx.moveTo(x0-10,top);ctx.quadraticCurveTo((x0+x1)/2,top-2*H,x1+10,top);ctx.strokeStyle='#b35a44';ctx.lineWidth=5;ctx.stroke();
  const r=rng(3);for(let k=0;k<30;k++){const bx=x0+20+r()*(x1-x0-40),sp=.2+r()*.25,f=(TT*sp+r())%1;alphaDo((1-f)*.85,()=>circ(bx+Math.sin(f*8+k)*4,bot-36-f*(bot-top-40),2.5+r()*2.5,'rgba(220,210,255,.85)'));}
  /* 微生物 */
  const m=rng(7);for(let k=0;k<16;k++){const bx=x0+30+m()*(x1-x0-60),by=top+40+m()*(bot-top-90),a=TT*.6+k;ctx.save();ctx.translate(bx+Math.sin(a)*4,by+Math.cos(a*.8)*3);ctx.rotate(a*.3);ctx.beginPath();ctx.ellipse(0,0,9,4,0,0,TAU);ctx.fillStyle=k%3?'rgba(125,255,196,.7)':'rgba(242,194,48,.75)';ctx.fill();ctx.restore();}
  alphaDo(seg(u,.02,.08),()=>{wt((x0+x1)/2,top-60,'沼氣',22,'#d7c3ff',700,'center');wt(x0+14,bot-8,'沼渣沉積',16,'rgba(227,236,238,.85)',600);
   arrow(x0-40,top+60,x0+30,top+60,'#c9a46a',4);wt(x0-40,top+42,'進流',15,'#c9a46a',700);
   arrow(x1-30,bot-70,x1+40,bot-70,'#c9a46a',4);wt(x1+40,bot-88,'沼液',15,'#c9a46a',700,'right');});
  /* 右：四階段 */
  card(760,160,780,470,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});wt(784,200,'四個階段',20,'#f2c230',700);
  const ST=[['水解','蛋白質、脂肪、纖維 → 胺基酸、脂肪酸、糖','#c9a46a',.22],['酸化','→ 揮發性脂肪酸、醇類','#ff9d7a',.3],['乙酸化','→ 乙酸、氫、二氧化碳','#7dc8dc',.38],['甲烷化','甲烷菌 → 甲烷 CH₄ ＋ 二氧化碳 CO₂','#b37cff',.5]];
  ST.forEach(([n,d,col,t],i)=>{const a=seg(u,t,t+.06),y=250+i*94;alphaDo(a,()=>{
   const hot=i===3?seg(u,.5,.56):0;card(784,y,732,78,{bg:hot?'rgba(179,124,255,.18)':'rgba(255,255,255,.05)',st:hot?'rgba(179,124,255,.7)':'rgba(255,255,255,.14)'});
   const tw=tag(804,y+39,n,{bg:col,size:18});wt(Math.max(930,804+tw+18),y+46,d,18,'#fff',600);
   if(i<3)arrow(830,y+80,830,y+92,'rgba(255,255,255,.5)',2);});});
  /* 右下：條件 */
  alphaDo(seg(u,.76,.82),()=>{card(760,650,780,150,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});wt(784,690,'甲烷菌喜歡的條件',20,'#7dffc4',700);
   const C=[['無氧','隔絕空氣'],['約 35°C','中溫消化'],['pH 6.8–7.5','避免酸化'],['數週','水力停留時間']];
   C.forEach(([a,b],i)=>{const x=784+i*190;wt(x,740,a,24,'#fff',700,'left',COND);wt(x,774,b,16,'rgba(227,236,238,.85)',500);});});
 }},

{t:'沼氣為什麼要脫硫',en:'Cleaning the biogas',dur:13,
 d:'從消化槽出來的沼氣大約六到七成是甲烷，三到四成是二氧化碳，還夾帶飽和的水氣與數百到數千 ppm 的硫化氫。硫化氫有臭蛋味、有毒，遇水會形成酸，會腐蝕管線與引擎，燃燒後還會產生二氧化硫。因此沼氣必須先脫硫：常見做法是生物脫硫，讓脫硫菌在填料上把硫化氫氧化成硫，或用氧化鐵吸附。接著冷卻除水，把硫化氫降到數百 ppm 以下，再送進發電機組。',
 s:[[0,'沼氣約六到七成是甲烷，其餘多是二氧化碳'],[.26,'硫化氫雖少，卻會腐蝕管線與引擎'],[.52,'脫硫塔裡的微生物把硫化氫變成硫'],[.76,'除水之後，才送進發電機組']],
 draw(u){
  diagBG();
  /* 左：成分 */
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'沼氣成分（示例）',20,'#f2c230',700);
  const k=ease(seg(u,.04,.22)),bx=100,bw=620,by=250;
  box(bx,by,bw,70,'rgba(255,255,255,.06)');
  box(bx,by,bw*.64*k,70,'#b37cff');box(bx+bw*.64,by,bw*.34*seg(u,.14,.24),70,'#6d7c86');box(bx+bw*.98,by,bw*.02*seg(u,.22,.26),70,'#e8572a');
  alphaDo(seg(u,.1,.16),()=>{wt(bx+16,by+46,trf('甲烷 {p}%',{p:Math.round(64*k)}),24,'#fff',700);});
  alphaDo(seg(u,.2,.26),()=>{wt(bx+bw*.64+14,by+46,'CO₂ 34%',22,'#fff',700,'left',COND);});
  alphaDo(seg(u,.24,.3),()=>{ln([bx+bw*.99,by+72,bx+bw*.99,by+104],'#e8572a',2);wt(bx+bw,by+128,'硫化氫、水氣 約 2%',17,'#ff9d7a',700,'right');});
  /* 硫化氫的危害 */
  alphaDo(seg(u,.28,.34),()=>{card(90,420,640,350,{bg:'rgba(232,87,42,.12)',st:'rgba(232,87,42,.55)'});wt(114,460,'硫化氫 H₂S 的問題',20,'#ff9d7a',700);
   const Rk=[['數百–數千 ppm','沼氣中的典型濃度'],['腐蝕','遇水成酸，侵蝕管線與引擎'],['二氧化硫','燃燒後排放，造成空污'],['有毒、臭蛋味','作業人員安全']];
   Rk.forEach(([a,b],i)=>alphaDo(seg(u,.3+i*.04,.34+i*.04),()=>{const y=520+i*64;wt(114,y,a,21,'#fff',700);wt(420,y,b,17,'rgba(227,236,238,.85)',500);}));});
  /* 右：脫硫塔 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});wt(824,200,'生物脫硫塔（示意）',20,'#f2c230',700);
  const on=seg(u,.5,.56),tx=1010,ty=260,tw=160,th=460;
  box(tx,ty,tw,th,'rgba(255,255,255,.06)','#c9d1d6',2);
  for(let i=0;i<5;i++){const y=ty+60+i*74;const r=rng(40+i);box(tx+8,y,tw-16,50,'rgba(138,122,85,.45)');for(let j=0;j<14;j++)circ(tx+14+r()*(tw-28),y+6+r()*38,4,'rgba(201,164,106,.8)');
   alphaDo(on,()=>{const r2=rng(60+i);for(let j=0;j<5;j++){const a=TT+j;circ(tx+20+r2()*(tw-40)+Math.sin(a)*3,y+10+r2()*30,3,'#7dffc4');}});}
  /* 氣體由下往上 */
  const P=[[880,ty+th-20],[tx,ty+th-20],[tx+tw/2,ty+th-30],[tx+tw/2,ty+20],[tx+tw,ty+20],[1330,ty+20]];
  pl(P.slice(0,2),'#6d7c86',6);pl(P.slice(4),'#6d7c86',6);
  flowDots(P,12,'#b37cff',seg(u,.5,.56),.25,5);
  alphaDo(seg(u,.5,.56),()=>{wt(830,ty+th-36,'原始沼氣',17,'#d7c3ff',700);wt(1300,ty-2,'脫硫後',17,'#d7c3ff',700,'right');
   wt(tx+tw+20,ty+220,'填料上的',16,'rgba(227,236,238,.85)',500);wt(tx+tw+20,ty+248,'脫硫菌',20,'#7dffc4',700);
   wt(tx+tw+20,ty+300,'H₂S → S',22,'#fff',700,'left',COND);wt(tx+tw+20,ty+330,'（加入少量空氣）',15,'rgba(227,236,238,.75)',500);});
  const hs=Math.round(lerp(2000,150,ease(seg(u,.56,.74))));
  alphaDo(seg(u,.54,.6),()=>{wt(1510,ty+th-36,'H₂S',20,'rgba(227,236,238,.85)',700,'right',COND);wt(1510,ty+th+10,trf('{n} ppm',{n:hs.toLocaleString('en-US')}),34,hs<300?'#7dffc4':'#ff9d7a',700,'right',COND);});
  alphaDo(seg(u,.76,.82),()=>{tag(1340,ty+80,'冷卻除水',{bg:'#7dc8dc',size:18});arrow(1340,ty+120,1340,ty+170,'#b37cff',3);tag(1340,ty+200,'送往發電機組',{bg:'#f2c230',size:18});});
 }},

{t:'沼氣發電機組',en:'The gas engine generator',dur:13,side:true,
 d:'乾淨的沼氣送進沼氣發電機組。機組多半是改裝的內燃機：沼氣與空氣混合後在汽缸內燃燒，推動活塞與曲軸，帶動發電機產生交流電，再經變壓器併入台電配電線路。小型機組把沼氣化學能轉成電的效率約兩成到三成，其餘大多變成熱。這些熱可透過冷卻水與排氣熱交換器回收，送回消化槽加溫，讓甲烷菌在冬天也維持中溫。養豬場的產氣量隨季節變化，常搭配儲氣袋讓機組穩定運轉。',
 s:[[0,'脫硫後的沼氣，送進發電機組'],[.28,'沼氣在引擎內燃燒，帶動發電機'],[.52,'電力經變壓器併入台電線路'],[.76,'引擎的餘熱回收，替消化槽加溫']],
 cam:u=>camMix({x:800,y:450,s:1},{x:1170,y:520,s:2},ease(seg(u,.02,.2))*(1-ease(seg(u,.72,.9)))),
 draw(u){
  const heat=seg(u,.76,.84);
  farm({inf:.85,heat:heat>0});
  flowDots(P_GAS(.85),10,GAS_C,1,.35,4.5);
  flowDots(P_PWR,5,PWR_C,seg(u,.5,.56),.6,3.5);
  /* 機組內部（切開） */
  const op=seg(u,.2,.3);
  alphaDo(op,()=>{box(GEN.x+6,GEN.y+6,GEN.w-12,600-GEN.y-12,'#1f2a30');
   const ex=GEN.x+14;box(ex,GEN.y+14,64,40,'#8d989f');
   for(let k=0;k<3;k++){const py=GEN.y+22+Math.sin(TT*14+k*2.1)*5;box(ex+6+k*20,py,12,10,'#c9d1d6');alphaDo(.6+.4*Math.sin(TT*14+k*2.1),()=>circ(ex+12+k*20,GEN.y+18,3,'#ff8a60'));}
   ln([ex+64,GEN.y+40,ex+84,GEN.y+40],'#c9d1d6',5);
   circ(ex+104,GEN.y+34,18,'#3f6f5c','#c9d1d6',2);ctx.save();ctx.translate(ex+104,GEN.y+34);ctx.rotate(TT*6);for(let k=0;k<6;k++){ctx.rotate(TAU/6);ln([0,0,14,0],'#f2c230',2);}ctx.restore();});
  if(heat>0)flowDots([[GEN.x+20,596],[GEN.x+20,640],[DG.x1+20,640],[DG.x1+20,DG.top+20],[DG.x1,DG.top+20]],8,'#ff8a60',heat,.4,4);
  lab(TW.x+TW.w/2,TW.y+40,'脫硫塔',{dx:-60,dy:-40,a:band(u,.04,.3)});
  lab(GEN.x+46,GEN.y+34,'引擎',{dx:-40,dy:-70,st:'s',a:band(u,.28,.54)});
  lab(GEN.x+118,GEN.y+34,'發電機',{dx:30,dy:-80,st:'s',a:band(u,.3,.56)});
  lab(POLE,475,'變壓器',{dx:40,dy:-50,a:band(u,.52,.76)});
  lab(1500,436,'併入台電線路',{dx:0,dy:70,st:'l',a:band(u,.54,.76)});
  lab(DG.x1+20,640,'餘熱回收管',{dx:-60,dy:60,st:'w',a:band(u,.8,1)});
 },
 hud(u){hudPanel(250,150,'發電機組（示例）',seg(u,.04,.1),w=>{const on=seg(u,.26,.4);
  hrow(56,'沼氣流量',trf('{v} m³/h',{v:(21*on).toFixed(0)}),w,'#b37cff');
  hrow(88,'發電出力',Math.round(30*on)+' kW',w,'#f2c230');
  hrow(120,'發電效率',Math.round(22*on)+'%',w,'#7dffc4');});}},

{t:'一座養豬場能發多少電',en:'How much power from one farm',dur:13,
 d:'以飼養 5,000 頭豬的養豬場為例。每頭豬每天的糞尿約可產生 0.1 立方公尺沼氣，一天合計約 500 立方公尺；小型機組每發一度電約需 0.7 立方公尺沼氣，所以每天可發約 714 度，一年約 26 萬度，相當於約 72 戶家庭一年的用電。依 2025 年度沼氣發電躉購費率每度約 7 元計算，一年售電收入約 183 萬元。從能量來看，沼氣的熱能約只有兩成多變成電，若把餘熱也用上，整體利用率還能再提高。',
 s:[[0,'5,000 頭豬，每天約產生 500 m³ 沼氣'],[.26,'每發一度電，約需 0.7 m³ 沼氣'],[.5,'一年約 26 萬度，約 72 戶家庭的用電'],[.68,'發電只用掉兩成多的能量，餘熱也能再利用']],
 draw(u){
  diagBG();
  card(60,160,1480,330,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});wt(84,200,'算一算（示例）',20,'#f2c230',700);
  const B=[['5,000','頭豬','× 0.1 m³／頭・日',.02,'#fff'],['500','m³／日','沼氣',.14,'#d7c3ff'],['約 714','度／日','÷ 0.7 m³／度',.28,'#f2c230'],['約 26 萬','度／年','× 365 天',.44,'#7dffc4']];
  B.forEach(([v,un,op,t,col],i)=>{const a=seg(u,t,t+.06),x=90+i*364;alphaDo(a,()=>{
   card(x,240,320,210,{bg:'rgba(255,255,255,.05)'});wt(x+160,330,v,50,col,700,'center',COND);wt(x+160,370,un,20,'#fff',700,'center');wt(x+160,420,op,17,'rgba(227,236,238,.8)',500,'center');
   if(i<3)arrow(x+324,345,x+358,345,'rgba(255,255,255,.6)',3);});});
  /* 下左：換算 */
  alphaDo(seg(u,.5,.56),()=>{card(60,520,700,280,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});wt(84,560,'相當於',20,'#7dffc4',700);
   const hh=Math.round(72*ease(seg(u,.52,.66)));wt(84,640,trf('約 {n} 戶',{n:hh}),46,'#fff',700,'left',COND);wt(84,680,'家庭一年用電（每戶每月約 300 度）',17,'rgba(227,236,238,.85)',500);
   const rv=Math.round(183*ease(seg(u,.56,.7)));wt(430,640,trf('約 {n} 萬元',{n:rv,m:(rv/100).toFixed(2)}),46,'#f2c230',700,'left',COND);wt(430,680,'年售電收入（7.0192 元／度）',17,'rgba(227,236,238,.85)',500);
   for(let i=0;i<Math.min(hh,72);i++){const x=90+(i%24)*26,y=720+Math.floor(i/24)*24;poly([x,y+14,x+9,y+4,x+18,y+14],'#7dffc4');box(x+3,y+14,12,8,'#7dffc4');}});
  /* 下右：能量分配 */
  alphaDo(seg(u,.64,.7),()=>{card(800,520,740,280,{bg:'rgba(7,27,39,.75)'});wt(824,560,'1 m³ 沼氣的能量去向（示例）',20,'#f2c230',700);
   const E=[['電力','22%',.22,'#f2c230'],['可回收餘熱','約 45%',.45,'#ff8a60'],['其他損失','約 33%',.33,'#6d7c86']];
   let x=830;const k=ease(seg(u,.66,.8));E.forEach(([n,v,f,col],i)=>{const w=680*f*k;box(x,610,w,56,col);alphaDo(seg(u,.7+i*.04,.74+i*.04),()=>{wt(x+8,700,n,17,'#fff',700);wt(x+8,730,v,22,col,700,'left',COND);});x+=680*f;});
   wt(824,780,'約 6 kWh 熱能（甲烷 60%）',16,'rgba(227,236,238,.75)',500);});
 }},

{t:'沼渣沼液回到農田',en:'Digestate back to the fields',dur:13,
 d:'消化後的沼液與沼渣仍含有氮、磷、鉀等養分，臭味與病原也比原本的糞尿少得多。依環境部規定，畜牧場提出「沼液沼渣農地肥分使用計畫」並經核准後，就能以槽車或管線把沼液送到農田施灌，施用量依作物需要的氮量計算，並定期監測土壤與地下水。沼渣則可以堆肥後使用。這樣一來，原本要處理到放流標準的廢水，變成可以取代部分化學肥料的資源，也減少排進河川的污染。',
 s:[[0,'槽車把沼液從牧場載到農田'],[.26,'沼液含有氮、磷、鉀，可取代部分化肥'],[.5,'施用量依作物需氮量計算，須經核准'],[.74,'沼渣堆肥後，也能回到土壤']],
 base:u=>{},
 cam:u=>({x:clamp(lerp(-160,1260,ease(seg(u,.04,.9)))+120,560,1060),y:500,s:1.7}),
 draw(u){
  const tx=lerp(-160,1260,ease(seg(u,.04,.9)));
  fieldScene(u,tx);
  tanker(tx,seg(u,.06,.12)*(1-seg(u,.88,.92)));
  lab(tx+50,552,'沼液槽車',{dx:40,dy:-110,st:'s',a:band(u,.03,.3)});
  lab(Math.max(80,tx-60),600,'施灌沼液',{dx:-30,dy:90,st:'l',a:band(u,.24,.5)});
  lab(Math.max(80,tx-360),590,'作物吸收養分',{dx:-20,dy:-130,st:'g',a:band(u,.5,.76)});
  lab(1470,560,'沼渣堆肥',{dx:-40,dy:-120,a:band(u,.74,1)});
  lab(340,548,'牧場的消化槽',{dx:40,dy:-150,minor:true,a:band(u,.04,.24)});
 },
 hud(u){hudPanel(260,150,'沼液施灌（示例）',seg(u,.04,.1),w=>{const k=ease(seg(u,.06,.9));
  hrow(56,'施灌量',trf('{v} m³',{v:Math.round(20*k)}),w,'#c9a46a');
  hrow(88,'含氮量',trf('約 {v} kg',{v:Math.round(20*k)}),w,'#7dffc4');
  hrow(120,'農地面積','2 ha',w,'#fff');});}},

{t:'把甲烷收起來',en:'Capturing methane',dur:12,
 d:'沼氣發電的減碳效果有兩層。第一層是替代：沼氣發的電取代部分化石燃料發電。第二層更重要：甲烷在 100 年尺度的暖化潛勢約是二氧化碳的 28 倍，糞尿廢水若在開放的池子裡厭氧分解，甲烷會直接逸散到大氣；把它收集起來燒掉發電，排出的是二氧化碳，暖化衝擊大幅降低。加上沼液沼渣回到農田、取代化肥，養豬場就從污染源變成一個能源與養分循環的節點。',
 s:[[0,'甲烷的暖化潛勢，約是二氧化碳的 28 倍'],[.3,'開放池逸散的甲烷，收集後燃燒發電'],[.56,'電力、肥料、減少河川污染，一次解決'],[.8,'養豬場成為能源與養分循環的節點']],
 draw(u){
  diagBG();
  /* 左：逸散 vs 收集 */
  card(60,160,640,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'1 噸甲烷的暖化衝擊（示例）',20,'#f2c230',700);
  const c=chartBox(80,220,600,470,{x0:0,x1:2,y0:0,y1:30,yt:[0,10,20,30],pl:70,pb:70,pt:40,gx:1,gy:3});
  wt(c.px,c.py-12,'噸 CO₂ 當量',15,'rgba(227,236,238,.7)',500);
  const k1=ease(seg(u,.04,.2)),k2=ease(seg(u,.32,.46)),bw=150;
  const x1=c.X(.5)-bw/2,x2=c.X(1.5)-bw/2;
  box(x1,c.Y(28*k1),bw,c.Y(0)-c.Y(28*k1),'#ff8a60');
  alphaDo(seg(u,.04,.1),()=>{wt(c.X(.5),c.Y(0)+30,'直接逸散',18,'#fff',700,'center');wt(c.X(.5),c.Y(28*k1)-12,trf('{n}',{n:Math.round(28*k1)}),30,'#ff9d7a',700,'center',COND);});
  box(x2,c.Y(2.75*k2),bw,c.Y(0)-c.Y(2.75*k2),'#7dffc4');
  alphaDo(seg(u,.32,.38),()=>{wt(c.X(1.5),c.Y(0)+30,'收集燃燒',18,'#fff',700,'center');wt(c.X(1.5),c.Y(2.75*k2)-12,'2.75',30,'#7dffc4',700,'center',COND);});
  alphaDo(seg(u,.4,.46),()=>{wt(84,750,'燃燒後變成二氧化碳，且其碳原本來自飼料作物',16,'rgba(227,236,238,.85)',500);wt(84,776,'（生物源碳，另計）',15,'rgba(227,236,238,.65)',500);});
  /* 右：循環 */
  card(740,160,800,640,{bg:'rgba(7,27,39,.75)',st:'rgba(125,255,196,.45)'});wt(764,200,'能源與養分的循環',20,'#7dffc4',700);
  const cx=1140,cy=500,R=210;
  const N=[['飼料作物','#7dffc4'],['養豬場','#fff'],['厭氧消化','#b37cff'],['沼氣發電','#f2c230'],['沼渣沼液','#c9a46a']];
  const ka=seg(u,.56,.78);
  alphaDo(seg(u,.54,.6),()=>{ctx.beginPath();ctx.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+TAU*ka);ctx.strokeStyle='rgba(125,255,196,.5)';ctx.lineWidth=4;ctx.stroke();
   const f=(TT*.12)%1,a=-Math.PI/2+TAU*f;if(ka>=1)circ(cx+R*Math.cos(a),cy+R*Math.sin(a),7,'#7dffc4');});
  N.forEach(([n,col],i)=>{const a=-Math.PI/2+i*TAU/5,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);alphaDo(seg(u,.56+i*.04,.6+i*.04),()=>tag(x,y,n,{bg:'#0e2a3b',fg:col,size:19,align:'center'}));});
  alphaDo(seg(u,.72,.78),()=>{const a=-Math.PI/2+3*TAU/5,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);arrow(x-10,y+30,x-60,y+90,'#f2c230',3);wt(x-60,y+120,'電力併網',17,'#f2c230',700,'center');});
  alphaDo(seg(u,.8,.86),()=>{wt(cx,cy-10,'污染源',22,'rgba(227,236,238,.6)',700,'center');wt(cx,cy+26,'→ 資源',30,'#7dffc4',800,'center');});
 }}
]};
