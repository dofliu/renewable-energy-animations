// KITS: land
/* 太陽光電系列 第 2 集：太陽電池怎麼發電 */
const E_C='#58b8d0',H_C='#ff8a60';                       // 電子、電洞
function elec(x,y,a){alphaDo(a===undefined?1:a,()=>{circ(x,y,8,E_C);ln([x-4,y,x+4,y],'#0e2a3b',2);});}
function hole(x,y,a){alphaDo(a===undefined?1:a,()=>{circ(x,y,8,'rgba(14,42,59,.9)');ring(x,y,8,H_C,2.5);ln([x-4,y,x+4,y],H_C,2);ln([x,y-4,x,y+4],H_C,2);});}
/* 波狀光子：由 (x0,y0) 到 (x1,y1) 畫到比例 f */
function photon(x0,y0,x1,y1,col,f,amp){
  f=clamp(f);if(f<=0)return;amp=amp||7;const L=Math.hypot(x1-x0,y1-y0),ux=(x1-x0)/L,uy=(y1-y0)/L,n=Math.max(2,Math.floor(L*f/3));
  ctx.beginPath();for(let i=0;i<=n;i++){const s=L*f*i/n,w=amp*Math.sin(s*.16-TT*8);const x=x0+ux*s-uy*w,y=y0+uy*s+ux*w;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  ctx.strokeStyle=col;ctx.lineWidth=2.6;ctx.stroke();const ex=x0+ux*L*f,ey=y0+uy*L*f;
  poly([ex+ux*10,ey+uy*10,ex-uy*6,ey+ux*6,ex+uy*6,ey-ux*6],col);
}
/* 模組 I-V 模型（示例參數）：Isc 13.9 A、Voc 51.6 V */
const IV=(V,Isc,Voc,Vt)=>Math.max(0,Isc*(1-Math.exp((V-Voc)/Vt))/(1-Math.exp(-Voc/Vt)));
const I25=V=>IV(V,13.9,51.6,2.6),I65=V=>IV(V,14.18,46.44,2.95);
const SUN={x:760,y:120};
const PX=[420,640,860,1080];                             // 場景中的四座模組
const gyy=x=>groundY(x);
function fieldModule(x,glint){solarPanel(x,gyy(x),190,22,{h:70,glint});}
function thermo(x,y,f){rrp(x-9,y-120,18,120,9);ctx.fillStyle='rgba(255,255,255,.85)';ctx.fill();circ(x,y+4,15,'#e8572a');box(x-4,y-110*f,8,110*f+4,'#e8572a');}

const EP={no:2,slug:'solar-pv',seriesName:'太陽光電系列',t:'太陽電池怎麼發電',en:'How a solar cell makes electricity',
lede:'陽光照在一片深藍色的板子上，為什麼就有電流流出？這一集從矽原子與光子談起，看 PN 接面如何把電子推向同一個方向，再從一片電池片組成模組，最後用 I-V 曲線理解最大功率點與溫度的影響。',
facts:[['1.12','eV','矽的能隙：光子能量要高於這個值，才能把電子從鍵結中釋放'],
['約 0.7','V','一片矽晶電池的開路電壓，與面積無關；面積決定電流大小'],
['144','片','常見 182 mm 半片模組的電池數，分成兩半各 72 片串聯後並聯'],
['1,000','W/m²','標準測試條件（STC）的日照強度，另規定電池溫度 25°C 與 AM1.5 光譜'],
['−0.30 ~ −0.40','%/°C','常見矽晶模組的功率溫度係數，溫度每升 1°C 功率約少這麼多'],
['約 22–23','%','目前常見商用矽晶模組的轉換效率範圍（示例）']],
note:'說明：本集為教育用途示意動畫，原子、電池與模組的比例經過放大調整。I-V 曲線以 580 W 級半片模組為示例參數（開路電壓 51.6 V、短路電流 13.9 A）計算，溫度影響以功率溫度係數約 −0.3%/°C 估算；實際數值依各廠牌規格書與現場條件而定。',
base:()=>{landSky(GY,{sun:SUN});drawGround();},
shots:[
{t:'陽光照在模組上',en:'Sunlight on a solar module',dur:12,side:true,
 d:'太陽光電模組沒有會轉動的零件，也不燃燒任何東西。陽光可以看成一顆顆帶有能量的「光子」，打在模組表面的電池片上，就直接在材料內部產生電流，從接線盒以直流電的形式流出。晴天中午，照到地面的日照強度大約每平方公尺 1,000 瓦；一片常見的模組把其中約兩成多轉換成電，其餘多半變成熱。',
 s:[[0,'陽光由一顆顆帶有能量的光子組成'],[.3,'光子打在模組表面的電池片上'],[.55,'材料內部直接產生電流，沒有轉動零件'],[.78,'直流電從接線盒流出，送往變流器']],
 cam:u=>camMix({x:800,y:430,s:1},{x:720,y:500,s:1.45},ease(seg(u,.2,.6))),
 draw(u){
  const G=seg(u,.02,.3);
  PX.forEach((x,i)=>{for(let k=0;k<3;k++){const f=(TT*.45+k/3+i*.13)%1;if(G>0)alphaDo(G*.9,()=>photon(SUN.x+20,SUN.y+20,x-10,gyy(x)-86,'#f2c230',f,5));}});
  PX.forEach(x=>fieldModule(x,u>.3));
  const bx=1300;cabinet(bx,gyy(bx),70,70,'#dfe5e8');
  const cab=[];PX.forEach((x,i)=>{cab.push(x+40,gyy(x)-8);});
  ln([PX[0]+40,gyy(PX[0])-4,bx,gyy(bx)-4],'#2b3137',3);
  const ca=seg(u,.55,.65);if(ca>0)for(let k=0;k<8;k++){const f=(TT*.35+k/8)%1;alphaDo(ca,()=>circ(lerp(PX[0]+40,bx,f),lerp(gyy(PX[0]),gyy(bx),f)-4,4,E_C));}
  lab(SUN.x+60,SUN.y+60,'光子',{dx:60,dy:-30,st:'s',a:band(u,.03,.35)});
  lab(PX[1],gyy(PX[1])-86,'太陽光電模組',{dx:-40,dy:-90,a:band(u,.25,.6)});
  lab(PX[2]+80,gyy(PX[2])-60,'電池片直接把光變成電',{dx:40,dy:-110,st:'g',a:band(u,.5,.78)});
  lab(bx+35,gyy(bx)-70,'變流器',{dx:30,dy:-70,a:band(u,.7,1)});
  lab(lerp(PX[0]+40,bx,.5),gyy(700)-4,'直流電',{dx:0,dy:60,st:'l',a:band(u,.72,1)});
 },
 hud(u){hudPanel(230,120,'晴天中午（示例）',seg(u,.05,.1),w=>{const G=Math.round(1000*ease(seg(u,.02,.3)));hrow(56,'日照強度',G+' W/m²',w,'#f2c230');hrow(88,'轉成電的比例','約 22%',w,'#7dffc4');});}},

{t:'光子打出電子',en:'Photons free electrons',dur:13,
 d:'矽原子最外層有四個電子，和相鄰原子兩兩共用，排成整齊的晶格。光子打進矽裡，若能量大於矽的能隙 1.12 電子伏特，就能把一個電子從鍵結中「踢」出來，成為可以自由移動的電子，原位置留下一個帶正電的空位，稱為電洞。紅外光能量不足，會直接穿過；藍紫光能量太多，多出來的部分變成熱。這是矽晶電池效率有上限的主要原因。',
 s:[[0,'矽原子共用電子，排成整齊的晶格'],[.2,'光子打進來，把電子從鍵結中釋放'],[.4,'能帶圖：能量要跨過 1.12 eV 的能隙'],[.6,'藍紫光能量太多，多出的部分變成熱'],[.8,'紅外光能量不足，直接穿過']],
 draw(u){
  diagBG();
  card(70,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(94,200,'矽晶格（示意）',20,'#f2c230',700);
  const AX=[190,310,430,550,670],AY=[290,410,530,650];
  ctx.strokeStyle='rgba(227,236,238,.35)';ctx.lineWidth=2;ctx.beginPath();
  AX.forEach(x=>AY.forEach(y=>{if(x<670){ctx.moveTo(x+26,y-5);ctx.lineTo(x+94,y-5);ctx.moveTo(x+26,y+5);ctx.lineTo(x+94,y+5);}if(y<650){ctx.moveTo(x-5,y+26);ctx.lineTo(x-5,y+94);ctx.moveTo(x+5,y+26);ctx.lineTo(x+5,y+94);}}));ctx.stroke();
  const fx=490,fy=410;                                      // 被釋放電子的位置（兩原子之間的鍵結）
  AX.forEach(x=>AY.forEach(y=>{if(x<670&&!(x===430&&y===410)){elec(x+60,y,.55);}}));
  AX.forEach(x=>AY.forEach(y=>{circ(x,y,26,'#1f5f8a','rgba(255,255,255,.4)',1.5);wt(x,y+1,'Si',18,'#fff',700,'center',COND,'middle');}));
  const p1=seg(u,.06,.2),fr=ease(seg(u,.2,.36));
  photon(120,230,fx-14,fy-14,'#f2c230',p1*(1-seg(u,.2,.24)));
  if(fr>0){hole(fx,fy,1);const ex=lerp(fx,640,fr)+6*Math.sin(TT*3)*fr,ey=lerp(fy,560,fr)+6*Math.cos(TT*2.6)*fr;elec(ex,ey,1);}
  else elec(fx,fy,.55);
  alphaDo(seg(u,.26,.32),()=>{wt(640,600,'自由電子',17,E_C,700,'center');wt(fx,fy-24,'電洞',17,H_C,700,'center');});
  alphaDo(seg(u,.08,.14),()=>wt(128,262,'光子',17,'#f2c230',700));
  alphaDo(seg(u,.3,.36),()=>wt(94,760,'光子能量夠大，才能打斷鍵結',18,'rgba(227,236,238,.85)',500));
  /* 右：能帶圖 */
  card(820,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(844,200,'能帶圖：跨過能隙才算數',20,'#f2c230',700);
  const a0=seg(u,.38,.46);
  alphaDo(a0,()=>{box(870,250,640,80,'rgba(88,184,208,.18)','rgba(88,184,208,.6)',1.5);box(870,560,640,80,'rgba(255,138,96,.16)','rgba(255,138,96,.6)',1.5);
   wt(1490,300,'導帶',17,E_C,700,'right');wt(1490,610,'價帶',17,H_C,700,'right');
   ln([900,330,900,560],'rgba(255,255,255,.5)',1.5);ln([892,330,908,330],'rgba(255,255,255,.5)',1.5);ln([892,560,908,560],'rgba(255,255,255,.5)',1.5);
   wt(916,440,'能隙',17,'#fff',700);wt(916,466,'1.12 eV',22,'#f2c230',700,'left',COND);});
  const COL=[[1050,'#f2c230','可見光','產生電子電洞對',.42,.58],[1230,'#b37cff','藍紫光','多餘能量變成熱',.6,.78],[1410,'#ff8a60','紅外光','能量不足，穿過',.8,.94]];
  COL.forEach(([x,c,nm,res,t0,t1],j)=>{const k=seg(u,t0,t1);if(k<=0)return;
   const pf=seg(k,0,.35);photon(x-90,700,x-10,610,c,pf,5);
   const jump=ease(seg(k,.35,.7));
   if(j===2){alphaDo(seg(k,.35,.5),()=>{ctx.setLineDash([6,6]);arrow(x,590,x,470,'rgba(255,138,96,.8)',2.5);ctx.setLineDash([]);wt(x+14,500,'×',26,'#e8572a',700);});elec(x,600,1);}
   else{const top=j===1?262:300,y=lerp(600,top,jump);if(jump>0&&jump<1)ln([x,600,x,y],'rgba(255,255,255,.35)',2);
    let yy=y;if(j===1){const d=ease(seg(k,.7,.95));yy=lerp(top,300,d);if(d>0)for(let q=0;q<3;q++){const hy=282-q*14-12*((TT*1.4+q/3)%1);ln([x+18,hy,x+30,hy-6,x+42,hy],'#e8572a',2.5);}}
    elec(x,yy,1);if(jump>.3)hole(x,600,1);}
   alphaDo(seg(k,.1,.3),()=>{wt(x,690,nm,17,c,700,'center');wt(x,752,res,15,'rgba(227,236,238,.85)',500,'center');});});
 }},

{t:'PN 接面：把電子推往同一邊',en:'The PN junction',dur:14,
 d:'只把電子打出來還不夠，它們很快又會和電洞重新結合。電池片的關鍵是 PN 接面：在矽裡摻入磷，形成電子較多的 N 型層；摻入硼，形成電洞較多的 P 型層。兩層接觸處形成一道內建電場，像一道單向的坡，光產生的電子被推向 N 型層，電洞被推向 P 型層。只要用導線把兩邊接起來，電子就會繞經外部電路流動，點亮燈泡，這就是光電流。',
 s:[[0,'N 型層（摻磷）電子較多，P 型層（摻硼）電洞較多'],[.25,'兩層交界處形成內建電場'],[.45,'光產生的電子被推向 N 層，電洞被推向 P 層'],[.7,'接上外部電路，電子繞一圈點亮燈泡']],
 draw(u){
  diagBG();
  const X0=120,X1=1060,NY=260,JY=380,PY=760,dep=seg(u,.22,.36);
  box(X0,NY,X1-X0,JY-NY,'#1f5f8a');box(X0,JY,X1-X0,PY-JY,'#3c2f52');
  alphaDo(dep,()=>{box(X0,JY-18,X1-X0,54,'rgba(255,255,255,.1)');ctx.setLineDash([6,6]);ln([X0,JY-18,X1,JY-18],'rgba(255,255,255,.35)',1.2);ln([X0,JY+36,X1,JY+36],'rgba(255,255,255,.35)',1.2);ctx.setLineDash([]);});
  const r=rng(7);for(let i=0;i<22;i++){const x=X0+30+r()*(X1-X0-60),y=NY+18+r()*(JY-NY-50);elec(x+6*Math.sin(TT*1.3+i),y,.55);}
  const r2=rng(11);for(let i=0;i<30;i++){const x=X0+30+r2()*(X1-X0-60),y=JY+60+r2()*(PY-JY-90);hole(x+6*Math.sin(TT*1.1+i),y,.55);}
  alphaDo(seg(u,.03,.1),()=>{tag(X0+16,NY+26,'N 型矽（摻磷）',{size:18,bg:E_C});tag(X0+16,PY-30,'P 型矽（摻硼）',{size:18,bg:H_C});});
  alphaDo(dep,()=>{for(let i=0;i<6;i++){const x=X0+80+i*160;arrow(x,JY-12,x,JY+32,'#f2c230',3);}tag(X1-16,JY+8,'內建電場',{size:17,align:'right'});});
  const g=seg(u,.42,.5);
  if(g>0)for(let k=0;k<6;k++){const p=(TT*.4+k/6)%1,x=X0+110+k*155;
   alphaDo(g*clamp(Math.min(p*6,(1-p)*6)),()=>{photon(x-40,150,x-6,JY-4,'#f2c230',Math.min(1,p*4),4);if(p>.25){const q=ease(seg(p,.25,.9));elec(x,lerp(JY+8,NY+30,q),1);hole(x+14,lerp(JY+8,PY-60,q),1);}});}
  /* 外部電路 */
  const cA=seg(u,.66,.74);
  alphaDo(cA,()=>{box(X0,NY-14,X1-X0,14,'#c9d1d6');box(X0,PY,X1-X0,14,'#c9d1d6');
   const P=[X1,NY-7,1330,NY-7,1330,470],Q=[1330,560,1330,PY+7,X1,PY+7];ln(P,'#dfe5e8',4);ln(Q,'#dfe5e8',4);
   const on=seg(u,.72,.8);const rg=ctx.createRadialGradient(1330,515,6,1330,515,110);rg.addColorStop(0,`rgba(255,230,140,${.8*on})`);rg.addColorStop(1,'rgba(255,230,140,0)');ctx.fillStyle=rg;ctx.fillRect(1210,395,240,240);
   circ(1330,510,40,on>.5?'#ffe38a':'rgba(255,255,255,.25)','#fff',2);box(1316,548,28,18,'#9aa7b0');
   wt(1395,500,'燈泡',18,'#fff',700);wt(1395,530,'亮起',16,'#ffe38a',600);
   const path=[[X1,NY-7],[1330,NY-7],[1330,470],[1330,560],[1330,PY+7],[X1,PY+7]];
   if(on>0)for(let k=0;k<10;k++){const f=(TT*.25+k/10)%1;const pt=partialPt(path,f);elec(pt[0],pt[1],on);}
   wt(1190,NY-24,'電子流出 N 層',16,E_C,700,'center');wt(1190,PY+44,'回到 P 層與電洞結合',16,'rgba(227,236,238,.85)',500,'center');});
  alphaDo(seg(u,.02,.08),()=>wt(X0,220,'電池片剖面（示意）',20,'#f2c230',700));
 }},

{t:'電池片的構造',en:'Inside a solar cell',dur:12,
 d:'一片矽晶電池片約 0.15 至 0.2 毫米厚，現在常見的邊長是 182 毫米，常再切成兩半使用。正面的細柵線負責收集電流，再匯到較粗的主柵線；表面的抗反射膜讓電池片呈深藍或黑色，減少陽光被反射。背面是另一個電極。不論電池片多大，單片的開路電壓都只有約 0.7 伏特，面積越大，產生的電流越多。',
 s:[[0,'正面：細柵線收集電流，匯到主柵線'],[.3,'剖面：抗反射膜、N 型層、P 型基板與背電極'],[.6,'電池片常切成兩半，降低電流與電阻損失'],[.8,'單片約 0.7 V，面積決定電流大小']],
 draw(u){
  diagBG();
  card(70,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(94,200,'正面（182 mm 電池片）',20,'#f2c230',700);
  const S=400,x0=220,y0=250,a=seg(u,.02,.12);
  alphaDo(a,()=>{box(x0,y0,S,S,'#1c3558');const fN=Math.floor(60*seg(u,.04,.2));ctx.strokeStyle='rgba(210,220,230,.55)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<fN;i++){const y=y0+S*i/60;ctx.moveTo(x0,y);ctx.lineTo(x0+S,y);}ctx.stroke();
   const bN=Math.floor(10*seg(u,.12,.26));for(let i=0;i<bN;i++){const x=x0+S*(i+.5)/10;box(x-2,y0,4,S,'#e3e8ec');}
   ln([x0,y0+S+24,x0+S,y0+S+24],'rgba(255,255,255,.6)',1.5);ln([x0,y0+S+16,x0,y0+S+32],'rgba(255,255,255,.6)',1.5);ln([x0+S,y0+S+16,x0+S,y0+S+32],'rgba(255,255,255,.6)',1.5);
   wt(x0+S/2,y0+S+50,'182 mm',20,'#fff',700,'center',COND);});
  const cut=seg(u,.58,.7);
  alphaDo(cut,()=>{ctx.setLineDash([10,8]);ln([x0-20,y0+S/2,x0+S+20,y0+S/2],'#f2c230',3);ctx.setLineDash([]);tag(x0+S+10,y0+S/2-34,'切成半片',{size:16});});
  alphaDo(band(u,.1,.55),()=>{wt(94,236,'細柵線：收集電流',16,'rgba(227,236,238,.85)',500);wt(94,730,'主柵線：把電流匯出',16,'#e3e8ec',700);});
  /* 右：剖面 */
  card(820,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(844,200,'剖面（厚度放大示意）',20,'#f2c230',700);
  const L=[['抗反射膜',260,16,'#2d5f9e'],['N 型層（射極）',276,40,'#1f5f8a'],['P 型矽基板',316,260,'#3c2f52'],['背面電極',576,40,'#9aa7b0']];
  const cx0=870,cx1=1250,b=seg(u,.28,.4);
  alphaDo(b,()=>{L.forEach(([n,y,h,c],i)=>{box(cx0,y,cx1-cx0,h,c);const ty=y+h/2;ln([cx1,ty,cx1+24,ty],'rgba(255,255,255,.5)',1.2);wt(cx1+32,ty+6,n,17,i===2?H_C:i===1?E_C:'#fff',700);});
   for(let i=0;i<6;i++){const x=cx0+30+i*64;poly([x,260,x+16,260,x+12,240,x+4,240],'#e3e8ec');}
   wt(cx1+32,236,'正面柵線',16,'#e3e8ec',600);
   ctx.setLineDash([6,5]);ln([cx0,316,cx1,316],'#f2c230',2);ctx.setLineDash([]);wt(cx0+10,338,'PN 接面',16,'#f2c230',700);
   for(let i=0;i<5;i++){const f=(TT*.5+i/5)%1;photon(cx0+50+i*70,150+30,cx0+50+i*70+10,250,'#f2c230',Math.min(1,f*2.4),3);}
   wt(1050,470,'厚度約 0.15–0.2 mm',18,'rgba(227,236,238,.85)',600,'center');});
  const v=seg(u,.78,.88);
  alphaDo(v,()=>{card(860,650,640,120,{bg:'rgba(31,127,92,.35)',st:'rgba(125,255,196,.5)'});wt(890,698,'單片開路電壓',18,'#fff',700);wt(1480,702,'約 0.7 V',34,'#7dffc4',700,'right',COND);wt(890,742,'電壓與面積無關；面積越大，電流越大',16,'rgba(227,236,238,.85)',500);});
 }},

{t:'從電池片到模組',en:'From cells to a module',dur:13,
 d:'一片電池片的電壓太低，也經不起風雨，所以要串聯並封裝成模組。常見的 182 毫米半片模組有 144 片電池，分成兩半各 72 片串聯，再彼此並聯，開路電壓約 50 伏特。電池片夾在兩層封裝膠膜（EVA 或 POE）之間，前面是強化玻璃、背面是背板或第二片玻璃，經層壓後裝上鋁框。接線盒裡的三顆旁路二極體，讓局部被遮蔭的電池串可以被繞過。',
 s:[[0,'封裝結構：玻璃、膠膜、電池片、膠膜、背板'],[.35,'層壓成一體，再裝上鋁框'],[.5,'144 片半片電池：分成兩半，各 72 片串聯'],[.7,'接線盒內的旁路二極體，讓遮蔭的部分被繞過']],
 draw(u){
  diagBG();
  card(70,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(94,200,'模組封裝結構',20,'#f2c230',700);
  const LY=[['強化玻璃','rgba(190,225,240,.55)',10],['封裝膠膜（EVA）','rgba(255,255,255,.35)',6],['電池片','#1f3f66',8],['封裝膠膜（EVA）','rgba(255,255,255,.35)',6],['背板','#e3e8ec',8]];
  const gap=lerp(78,16,ease(seg(u,.3,.45))),top=270;
  for(let i=LY.length-1;i>=0;i--){const [n,c,th]=LY[i],y=top+i*gap;
   const k=seg(u,.02+i*.05,.08+i*.05);if(k<=0)continue;alphaDo(k,()=>{poly([200,y,560,y,480,y+70,120,y+70],c,'rgba(255,255,255,.5)',1.2);poly([120,y+70,480,y+70,480,y+70+th,120,y+70+th],'rgba(0,0,0,.35)');
    if(i===2){ctx.strokeStyle='rgba(160,200,240,.6)';ctx.lineWidth=1;ctx.beginPath();for(let j=1;j<8;j++){const t=j/8;ctx.moveTo(lerp(200,120,0)+t*360,y);ctx.lineTo(120+t*360,y+70);}ctx.stroke();}
    alphaDo(1-seg(u,.3,.4),()=>{ln([560,y+35,585,y+35],'rgba(255,255,255,.5)',1.2);wt(595,y+41,n,16,i===2?'#f2c230':'#fff',600);});});}
  const fr=seg(u,.4,.5);
  alphaDo(fr,()=>{const yb=top+4*gap+78;poly([120,top+70,480,top+70,480,yb,120,yb],'#aab5bc');poly([480,top+70,560,top,560,yb-70,480,yb],'#8d989f');poly([200,top,560,top,480,top+70,120,top+70],null,'#dfe5e8',5);
   wt(595,top+60,'層壓成一體',18,'#7dffc4',700);wt(595,top+92,'裝上鋁框',18,'#fff',600);wt(595,top+124,'前玻璃約 3.2 mm',16,'rgba(227,236,238,.8)',500);
   card(100,560,640,200,{bg:'rgba(255,255,255,.05)'});wt(126,600,'為什麼要封裝',19,'#f2c230',700);wt(126,640,'電池片很薄很脆，怕水氣與撞擊',17,'#fff',500);wt(126,676,'層壓：加熱並抽真空，讓膠膜熔合',17,'#fff',500);wt(126,712,'玻璃透光、背板絕緣，鋁框提供強度',17,'#fff',500);});
  /* 右：電池排列 */
  card(820,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(844,200,'144 片半片電池的串接',20,'#f2c230',700);
  const ga=seg(u,.46,.52),CW=25,CH=32,gx0=872,gy0=250;
  alphaDo(ga,()=>{rrp(gx0-12,gy0-12,24*CW+20+24,6*CH+24,6);ctx.fillStyle='#0b1e2c';ctx.fill();ctx.strokeStyle='#c9d1d6';ctx.lineWidth=3;ctx.stroke();
   const lit=Math.floor(72*seg(u,.52,.66));
   for(let h=0;h<2;h++)for(let r=0;r<6;r++)for(let c=0;c<12;c++){const idx=r*12+(r%2?11-c:c);const x=gx0+h*(12*CW+20)+c*CW,y=gy0+r*CH;box(x+1,y+1,CW-2,CH-2,idx<lit?'#2b6fb0':'#1a3350');}
   const jb=gx0+12*CW+10;box(jb-9,gy0-34,18,24,'#394650');
   wt(gx0+6*CW,gy0+6*CH+42,'左半 72 片串聯',16,E_C,700,'center');wt(gx0+12*CW+20+6*CW,gy0+6*CH+42,'右半 72 片串聯',16,E_C,700,'center');
   wt(jb,gy0-44,'接線盒',16,'#fff',700,'center');});
  alphaDo(seg(u,.6,.66),()=>{wt(870,530,trf('{n} 片 × 約 0.7 V ≈ {v} V',{n:72,v:50}),24,'#fff',700);wt(870,562,'兩半並聯：電壓不變、電流相加',16,'rgba(227,236,238,.85)',500);});
  const bd=seg(u,.7,.76);
  alphaDo(bd,()=>{for(let i=0;i<3;i++){const y=gy0+i*2*CH;rrp(gx0-10,y,24*CW+20+20,2*CH-2,5);ctx.strokeStyle=i===1?'#e8572a':'rgba(242,194,48,.8)';ctx.lineWidth=2.5;ctx.stroke();}
   alphaDo(.55,()=>box(gx0+4*CW,gy0+2*CH,3*CW,2*CH,'#0e1a22'));wt(gx0+5.5*CW,gy0+3*CH+6,'遮蔭',16,'#ffb199',700,'center');
   card(860,600,640,170,{bg:'rgba(7,27,39,.6)'});wt(890,640,'3 顆旁路二極體',20,'#f2c230',700);
   wt(890,678,'每顆負責 1/3 的電池串',17,'#fff',500);wt(890,712,'局部遮蔭時電流從二極體繞過，',17,'#fff',500);wt(890,744,'只損失被遮的那 1/3，不會整片停擺',17,'#7dffc4',600);});
 }},

{t:'I-V 曲線與最大功率點',en:'The I-V curve and maximum power point',dur:13,
 d:'模組的「體檢表」是 I-V 曲線：橫軸是電壓、縱軸是電流。短路時電流最大，稱為短路電流 Isc；斷路時電壓最高，稱為開路電壓 Voc，但這兩點的功率都是零。功率等於電壓乘電流，在曲線轉彎的「膝點」附近最大，稱為最大功率點（MPP）。變流器的 MPPT 功能會隨日照變化，不斷調整工作電壓，讓模組一直停在這一點附近。',
 s:[[0,'I-V 曲線：電壓越高，電流先持平再急降'],[.3,'兩端點：短路電流 Isc 與開路電壓 Voc'],[.5,'功率＝電壓 × 電流，在膝點附近最大'],[.75,'變流器的 MPPT 持續追蹤最大功率點']],
 draw(u){
  diagBG();
  const A=chartBox(70,160,720,640,{title:'I-V 曲線（580 W 級模組示例）',x0:0,x1:55,y0:0,y1:16,xt:[0,10,20,30,40,50],yt:[0,4,8,12,16],xl:'電壓（V）',yl:'電流（A）',pt:70,gx:5,gy:4});
  const B=chartBox(830,160,710,640,{title:'P-V 曲線：功率＝電壓 × 電流',x0:0,x1:55,y0:0,y1:700,xt:[0,10,20,30,40,50],yt:[0,200,400,600],xl:'電壓（V）',yl:'功率（W）',pt:70,gx:5,gy:7});
  const Vm=44.1,Im=I25(Vm),Pm=Vm*Im;
  const f1=seg(u,.02,.3);if(f1>0){ctx.beginPath();for(let V=0;V<=51.6*f1;V+=.2){const x=A.X(V),y=A.Y(I25(V));V?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=3.5;ctx.stroke();}
  alphaDo(seg(u,.3,.38),()=>{circ(A.X(0),A.Y(13.9),7,'#fff');wt(A.X(0)+14,A.Y(13.9)-14,'短路電流 Isc 13.9 A',17,'#fff',700);
   circ(A.X(51.6),A.Y(0),7,'#fff');wt(A.X(51.6)-30,A.Y(0)-40,'開路電壓',17,'#fff',700,'right');wt(A.X(51.6)-30,A.Y(0)-16,'Voc 51.6 V',17,'#fff',700,'right',COND);});
  const f2=seg(u,.42,.62);if(f2>0){ctx.beginPath();for(let V=0;V<=51.6*f2;V+=.2){const x=B.X(V),y=B.Y(V*I25(V));V?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#f2c230';ctx.lineWidth=3.5;ctx.stroke();}
  alphaDo(seg(u,.44,.5),()=>wt(B.px+14,B.py+30,'兩端的功率都是 0',16,'rgba(227,236,238,.8)',500));
  const m=seg(u,.62,.7);
  alphaDo(m,()=>{ctx.fillStyle='rgba(242,194,48,.14)';ctx.fillRect(A.X(0),A.Y(Im),A.X(Vm)-A.X(0),A.Y(0)-A.Y(Im));
   ctx.setLineDash([7,6]);ln([A.X(Vm),A.Y(Im),A.X(Vm),A.Y(0)],'#f2c230',2);ln([B.X(Vm),B.Y(Pm),B.X(Vm),B.Y(0)],'#f2c230',2);ctx.setLineDash([]);
   circ(A.X(Vm),A.Y(Im),8,'#f2c230');circ(B.X(Vm),B.Y(Pm),8,'#f2c230');
   wt(A.X(Vm)-12,A.Y(Im)+40,'最大功率點',17,'#f2c230',700,'right');wt(A.X(Vm)-12,A.Y(Im)+64,'44.1 V × 13.1 A',17,'#f2c230',700,'right',COND);
   wt(B.X(Vm)-14,B.Y(Pm)-16,'Pmax 約 580 W',20,'#f2c230',700,'right');});
  const t=seg(u,.74,.98);
  if(t>0){const V=Vm+14*Math.sin(t*TAU*1.5)*Math.exp(-t*3.2);circ(A.X(V),A.Y(I25(V)),7,'#fff','#13232e',2);circ(B.X(V),B.Y(V*I25(V)),7,'#fff','#13232e',2);
   alphaDo(seg(u,.74,.8),()=>tag(B.X(45),B.Y(70),'MPPT：來回微調電壓，找出最高點',{size:17,bg:'#7dffc4',align:'right'}));}
 }},

{t:'溫度越高，功率越低',en:'Heat lowers the output',dur:13,side:true,
 d:'模組的標示功率是在電池溫度 25°C 的標準條件下量測。台灣夏天中午，模組溫度常達 60 至 70°C，電壓會明顯下降，常見矽晶模組的功率溫度係數約為每度 −0.3% 至 −0.4%，比 25°C 時少了一成以上。所以日照最強的正午不一定效率最好；支架架高、保留背面通風、選用溫度係數較低的模組，都能減少這部分損失。',
 s:[[0,'夏天中午日照最強，模組也跟著升溫'],[.3,'模組溫度可達 65°C，電壓明顯下降'],[.55,'溫度每升 1°C，功率約少 0.3–0.4%'],[.72,'架高與背面通風，幫助模組散熱']],
 base:u=>{landSky(GY,{sun:{x:lerp(260,1160,seg(u,0,.6)),y:lerp(300,170,seg(u,0,.6))},clouds:false});drawGround();},
 cam:u=>({x:800,y:430,s:1}),
 draw(u){
  const T=lerp(30,65,ease(seg(u,.05,.5)));
  PX.forEach(x=>fieldModule(x+120,false));
  const hs=seg(u,.2,.4);if(hs>0)PX.forEach((x,i)=>{for(let q=0;q<3;q++){const p=(TT*.5+q/3+i*.2)%1,xx=x+120+(q-1)*40,yy=gyy(x)-100-p*70;alphaDo(hs*(1-p)*.8,()=>ln([xx,yy,xx+8,yy-10,xx,yy-20,xx+8,yy-30],'#ff8a60',2));}});
  const vn=seg(u,.7,.8);if(vn>0)PX.forEach((x,i)=>{for(let q=0;q<3;q++){const p=(TT*.6+q/3+i*.1)%1;alphaDo(vn*.8,()=>arrow(x+40+p*120,gyy(x)-24-p*12,x+60+p*120,gyy(x)-30-p*12,'#7dc8dc',2.5));}});
  const tx=1400;thermo(tx,gyy(tx)-30,seg(T,20,75));
  wt(tx,gyy(tx)+26,trf('{t}°C',{t:Math.round(T)}),24,'#13232e',700,'center',COND);
  /* 25°C 與 65°C 的 I-V 比較 */
  const ca=seg(u,.3,.4);
  alphaDo(ca,()=>{const c=chartBox(540,140,560,280,{title:'I-V 曲線：25°C 與 65°C',x0:0,x1:55,y0:0,y1:16,xt:[0,25,50],yt:[0,8,16],xl:'電壓（V）',pt:56,pb:40,gx:2,gy:2});
   [[I25,51.6,'#7dffc4'],[I65,46.44,'#ff8a60']].forEach(([f,vo,col],j)=>{const k=j?seg(u,.36,.5):1;ctx.beginPath();for(let V=0;V<=vo*k;V+=.3){const x=c.X(V),y=c.Y(f(V));V?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=3;ctx.stroke();});
   alphaDo(seg(u,.46,.52),()=>{wt(c.px+14,c.py+c.ph-44,'25°C：約 580 W',16,'#7dffc4',700);wt(c.px+14,c.py+c.ph-20,'65°C：約 510 W',16,'#ffb199',700);});});
  lab(tx,gyy(tx)-150,'模組溫度',{dx:-40,dy:-60,st:'w',a:band(u,.08,.5)});
  lab(PX[3]+180,gyy(PX[3])-100,'電壓下降、功率變低',{dx:30,dy:-60,st:'w',a:band(u,.5,.76)});
  lab(PX[2]+120,gyy(PX[2])-40,'背面通風散熱',{dx:60,dy:-40,st:'g',a:band(u,.72,1)});
  lab(PX[0]+120,gyy(PX[0])-30,'支架架高',{dx:-50,dy:-30,st:'l',a:band(u,.74,1)});
 },
 hud(u){hudPanel(240,150,'模組狀態（示例）',seg(u,.05,.1),w=>{const T=lerp(30,65,ease(seg(u,.05,.5))),G=lerp(700,1000,ease(seg(u,.05,.5)));const p=580*G/1000*(1-.0035*(T-25));
  hrow(56,'日照強度',Math.round(G)+' W/m²',w,'#f2c230');hrow(88,'模組溫度',Math.round(T)+'°C',w,'#ff8a60');hrow(120,'輸出功率',Math.round(p)+' W',w,'#7dffc4');});}}
]};
/* 沿折線取比例 f 的點 */
function partialPt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=f*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
