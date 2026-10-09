// KITS: land
/* 水力系列 第 2 集：水庫式水力發電 */
/* 河谷剖面（示意，比例壓縮）：左側水庫、中間壩體、右下廠房與尾水 */
const BED=[[-200,262],[100,270],[300,420],[500,600],[548,640],[620,644],[800,656],[1200,668],[1800,680]];
const HILL=[[-200,110],[300,150],[560,185],[620,190],[1000,290],[1300,380],[1800,470]];
const DAM_X=548,DAM_TOP=225;
const WL_FULL=250;
const PEN=[[548,410],[585,418],[690,560],[792,630]];
const PH={x:790,y:596,w:150,h:62};
const TAILR=[[940,640],[1060,664],[1300,672]];
function pl(P,col,lw){ctx.lineJoin='round';ln(P.flat(),col,lw);}
function pf(P,x){for(let i=1;i<P.length;i++)if(x<=P[i][0]){const a=P[i-1],b=P[i],t=(x-a[0])/(b[0]-a[0]);return lerp(a[1],b[1],t);}return P[P.length-1][1];}
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,dir,sp,r){if(a<=0)return;for(let k=0;k<n;k++){let f=((TT*(sp||.3))+k/n)%1;if(dir<0)f=1-f;const p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
const bedY=x=>pf(BED,x);
/* 河谷全景：wl 為水庫水位（像素 y，愈小愈高） */
function damScene(wl,o){
  o=o||{};
  ctx.beginPath();ctx.moveTo(-200,1000);HILL.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(1800,1000);ctx.closePath();ctx.fillStyle='#7f9e62';ctx.fill();
  const r=rng(5);for(let i=0;i<46;i++){const x=-150+r()*1900,y=pf(HILL,x);if(x>480&&x<660)continue;circ(x,y+4+r()*40,8+r()*5,'#5d8646');}
  /* 水庫 */
  const g=ctx.createLinearGradient(0,wl,0,640);g.addColorStop(0,'#4ea3c4');g.addColorStop(1,'#1d5f86');
  ctx.beginPath();ctx.moveTo(-200,wl);ctx.lineTo(DAM_X,wl);for(let x=DAM_X;x>=-200;x-=20)ctx.lineTo(x,Math.max(wl,bedY(x)));ctx.closePath();ctx.fillStyle=g;ctx.fill();
  for(let k=0;k<7;k++){const x=((k*97+TT*14)%700)-150;ln([x,wl+4,x+26,wl+4],'rgba(255,255,255,.45)',1.5);}
  /* 河床岩盤 */
  ctx.beginPath();ctx.moveTo(-200,1000);BED.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(1800,1000);ctx.closePath();ctx.fillStyle='#8f7d68';ctx.fill();
  ctx.beginPath();ctx.moveTo(-200,1000);BED.forEach(p=>ctx.lineTo(p[0],p[1]+60));ctx.lineTo(1800,1000);ctx.closePath();ctx.fillStyle='#716a62';ctx.fill();
  /* 壩體 */
  poly([DAM_X,DAM_TOP,DAM_X+36,DAM_TOP,DAM_X+66,646,DAM_X,646],'#b8c0c4','rgba(0,0,0,.35)',2);
  for(let k=1;k<5;k++)ln([DAM_X,DAM_TOP+k*84,DAM_X+36+k*7,DAM_TOP+k*84],'rgba(0,0,0,.12)',1.5);
  /* 廠房、壓力鋼管 */
  ctx.lineCap='round';pl(PEN,'#44535c',14);pl(PEN,o.dry?'#3a4a54':'#5f7f92',7);ctx.lineCap='butt';
  box(PH.x,PH.y,PH.w,PH.h,'#d9dfe2','rgba(0,0,0,.35)',1.5);poly([PH.x-6,PH.y,PH.x+PH.w/2,PH.y-24,PH.x+PH.w+6,PH.y],'#8a4a3a');
  for(let k=0;k<4;k++)box(PH.x+14+k*34,PH.y+16,20,16,'#6f8a9a');
  /* 尾水與下游河道 */
  ctx.beginPath();ctx.moveTo(940,640);TAILR.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(1800,676);ctx.lineTo(1800,690);ctx.lineTo(940,670);ctx.closePath();ctx.fillStyle='#3f93b8';ctx.fill();
  /* 進水塔 */
  box(DAM_X-26,380,26,56,'#9aa4aa','rgba(0,0,0,.35)',1.5);for(let k=0;k<4;k++)ln([DAM_X-24,386+k*13,DAM_X-4,386+k*13],'#44535c',1.5);
  /* 送電 */
  const px=1180,py=pf(BED,1180);ln([px,py,px,py-130],'#6b5a48',5);ln([px-26,py-118,px+26,py-118],'#6b5a48',3);
  ln([PH.x+PH.w,PH.y+10,px,py-118,1700,py-160],'#394650',2);
}
/* 發電機＋法蘭西斯機組剖面（cx 為軸心） */
function unitSection(cx,u,spin,gv){
  const rot=TT*spin;
  box(cx-96,196,192,104,'#44535c','#c9d1d6',2);
  for(let k=0;k<8;k++){const a=rot+k*TAU/8;const x=cx+Math.cos(a)*70;if(Math.sin(a)>-.2)box(x-6,236,12,22,'#e8a23a');}
  box(cx-12,300,24,170,'#c9d1d6');
  /* 蝸殼（左右兩側斷面）與導翼 */
  circ(cx-176,520,56,'rgba(59,127,160,.5)','#8d989f',4);circ(cx+176,520,56,'rgba(59,127,160,.5)','#8d989f',4);
  for(const s of[-1,1]){ctx.save();ctx.translate(cx+s*96,512);ctx.rotate(s*(.5+gv));box(-3,-22,6,44,'#c9d1d6');ctx.restore();}
  /* 轉輪 */
  poly([cx-14,470,cx+14,470,cx+96,540,cx+82,574,cx+32,560,cx-32,560,cx-82,574,cx-96,540],'#7fb3cf','#c9d1d6',2);
  for(let k=0;k<5;k++){const f=((rot*.3+k*.2)%1);ln([cx-80+f*160,486,cx-80+f*160+10,560],'rgba(255,255,255,.55)',2);}
  /* 尾水管 */
  poly([cx-34,566,cx+34,566,cx+60,650,cx+300,704,cx+300,774,cx+170,774,cx-60,690],'rgba(59,127,160,.5)','#8d989f',3);
}
const DAMTYPE=(x,y,k)=>0;

const EP={no:2,slug:'hydropower',seriesName:'水力系列',t:'水庫式水力發電',en:'Reservoir hydropower',
lede:'築壩把溪水蓄成水庫，就等於把能量存了起來。這一集走進水庫式水力電廠，看壩體如何擋住水、進水口與壓力鋼管如何把水送到廠房、法蘭西斯水輪機與發電機怎麼把水能轉成電，再看水庫如何依用電需求調度，以及台灣大甲溪的階梯式水力開發。',
facts:[['234','MW','德基電廠最多 3 部機組合計出力，位於大甲溪最上游'],
['1,408','m','德基水庫滿水位的標高，高落差來自上游山區的水庫'],
['約 79','MW','流量 60 m³/s、落差 150 m、效率 0.9 時的出力（示例）'],
['450','rpm','60 Hz 電網、16 極發電機的同步轉速（示例）'],
['1,826','MW','2024 年底台灣慣常水力裝置容量，約占全國 3.2%'],
['2,602','MW','同期抽蓄水力裝置容量，約占全國 4.5%']],
note:'說明：本集為教育用途示意動畫，河谷、壩體與廠房比例經過壓縮，並非特定電廠的實際外形。德基電廠機組合計 234 MW、滿水位 1408 m 取自台電與新聞公開資料；台灣慣常水力與抽蓄水力裝置容量取自台電 2024 年 12 月裝置容量月報。流量、落差、效率與機組極數為「典型範例」數字，僅供說明計算方法。',
base:()=>{landSky(640,{sun:{x:1240,y:110},clouds:false});},
shots:[
{t:'把一條溪蓄成一座水庫',en:'Turning a river into a reservoir',dur:13,side:true,
 d:'水庫式水力電廠在河谷最窄處築起一道壩，把溪水攔下來，抬高水位，形成水庫。水庫裡的水位高過壩下游的河道，兩者之間的高度差就是落差，水往下落的能量就是發電的來源。與川流式不同，水庫能把豐水期的水存起來，在需要用電時再放出去發電。電廠通常設在壩的下游側，水經進水口、壓力鋼管送進廠房，發電後的水從尾水道回到河裡，也同時兼顧供水與防洪。',
 s:[[0,'壩把河谷攔起來，水位逐漸升高形成水庫'],[.28,'水庫水位與壩下河道之間，就是落差'],[.52,'水經進水口與壓力鋼管送進廠房發電'],[.78,'發電後的水從尾水道回到河裡']],
 cam:u=>camMix({x:800,y:450,s:1},{x:760,y:440,s:1.08},ease(seg(u,.1,.7))),
 draw(u){
  const wl=lerp(380,WL_FULL,ease(seg(u,.02,.3)));
  damScene(wl);
  flowDots(PEN,6,'#dff6ff',seg(u,.5,.56),1,.55,4);
  flowDots(TAILR,4,'#dff6ff',seg(u,.72,.78),1,.5,3.5);
  const hA=seg(u,.3,.45);
  alphaDo(band(u,.3,.7),()=>{ctx.setLineDash([8,7]);ln([300,WL_FULL,1200,WL_FULL],'rgba(255,255,255,.7)',1.5);ln([1000,666,1200,666],'rgba(255,255,255,.7)',1.5);ctx.setLineDash([]);
   arrow(1140,WL_FULL+4,1140,lerp(WL_FULL+4,662,hA),'#f2c230',3);tick(1150,460,'落差 H','left');});
  lab(240,WL_FULL+40,'水庫',{dx:-20,dy:90,st:'s',a:band(u,.04,.3)});
  lab(DAM_X+20,DAM_TOP,'壩體',{dx:-20,dy:-90,st:'s',a:band(u,.04,.3)});
  lab(DAM_X-13,408,'進水口',{dx:-130,dy:30,a:band(u,.44,.7)});
  lab(690,560,'壓力鋼管',{dx:-120,dy:-20,a:band(u,.48,.76)});
  lab(PH.x+PH.w/2,PH.y,'廠房',{dx:30,dy:-90,st:'l',a:band(u,.6,1)});
  lab(1150,664,'尾水回到河裡',{dx:60,dy:70,st:'g',a:band(u,.74,1)});
 },
 hud(u){hudPanel(250,150,'水庫電廠（示例）',seg(u,.05,.1),w=>{const g=ease(seg(u,.5,.7));
  hrow(56,'水位',trf('{h} m',{h:Math.round(lerp(80,150,ease(seg(u,.02,.3))))}),w,'#7dc8dc');hrow(88,'落差','150 m',w,'#fff');hrow(120,'出力',Math.round(79*g)+' MW',w,'#f2c230');});}},

{t:'三種壩，三種擋水方式',en:'Three ways to hold back water',dur:12,
 d:'壩要承受水庫的巨大水壓，常見有三種型式。拱壩呈弧形，向上游凸出，把水壓像拱橋一樣傳給兩側岩壁，壩體可以做得很薄，但需要兩岸有堅硬的岩石。重力壩靠混凝土本身的重量抵抗水壓，斷面近似三角形，對地基要求高。土石壩用土、砂礫與塊石堆成，中間以黏土心牆防水，適應性強，是世界上數量最多的壩型。選哪一種，取決於河谷形狀、地質與就近取得的材料。',
 s:[[0,'壩要承受水庫的水壓，主要有三種型式'],[.3,'拱壩：把水壓傳給兩側岩壁'],[.55,'重力壩：靠混凝土自身重量站穩'],[.78,'土石壩：土石堆成，中間有防水心牆']],
 draw(u){
  diagBG();
  const cols=[['拱壩','把水壓傳到兩側岩壁',.04],['重力壩','靠自身重量抵抗水壓',.3],['土石壩','適應性強、材料就近取得',.55]];
  cols.forEach(([n,sub,t],i)=>{const x=60+i*500,a=seg(u,t,t+.06);
   card(x,160,480,500,{bg:'rgba(7,27,39,.75)',st:a>.5?'rgba(242,194,48,.5)':'rgba(255,255,255,.16)'});
   wt(x+24,200,n,22,'#f2c230',700);wt(x+24,232,sub,16,'rgba(227,236,238,.85)',500);
   alphaDo(a,()=>{
    const bx=i===2?x+100:x+60,by=600;
    if(i===0){ /* 俯視：弧形壩向上游凸出，水壓傳到兩側岩壁 */
     box(x+30,340,70,150,'#8f7d68');box(x+380,340,70,150,'#8f7d68');
     ctx.beginPath();ctx.moveTo(x+100,430);ctx.quadraticCurveTo(x+240,290,x+380,430);ctx.strokeStyle='#b8c0c4';ctx.lineWidth=26;ctx.stroke();
     wt(x+240,276,'水庫（俯視）',14,'rgba(227,236,238,.8)',600,'center');
     for(let k=0;k<4;k++)arrow(x+150+k*60,296,x+150+k*60,k===0||k===3?340:318,'#7dc8dc',3);
     arrow(x+130,440,x+80,470,'#f2c230',3);arrow(x+350,440,x+400,470,'#f2c230',3);
    }else if(i===1){
     poly([bx+30,by-300,bx+110,by-300,bx+260,by,bx+30,by],'#b8c0c4','rgba(0,0,0,.35)',2);
     box(bx-40,by-250,70,250,'rgba(59,127,160,.55)');for(let k=0;k<5;k++)arrow(bx-30,by-230+k*46,bx+24,by-230+k*46,'#7dc8dc',3);
     arrow(bx+130,by-100,bx+130,by-20,'#f2c230',4);wt(bx+160,by-60,'自重',16,'#f2c230',700);
    }else{
     poly([bx+30,by-300,bx+90,by-300,bx+290,by,bx-40,by],'#a4876a','rgba(0,0,0,.35)',2);
     poly([bx+52,by-290,bx+70,by-290,bx+82,by,bx+40,by],'#6c7a82');
     box(bx-70,by-250,70,250,'rgba(59,127,160,.55)');for(let k=0;k<5;k++)arrow(bx-60,by-230+k*46,bx-2,by-230+k*46,'#7dc8dc',3);
     wt(bx+62,by-312,'心牆',15,'#7dffc4',700,'center');
    }
   });});
  alphaDo(seg(u,.8,.86),()=>{card(60,680,1480,120,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});
   wt(90,728,'怎麼選',20,'#7dffc4',700);wt(240,728,'河谷窄而岩盤堅硬 → 拱壩；地基良好、混凝土方便 → 重力壩',18,'#fff',600);
   wt(240,768,'河谷寬、有大量土石可用 → 土石壩（石門水庫為土石壩）',18,'#fff',600);});
 }},

{t:'進水口與壓力鋼管',en:'Intake and penstock',dur:13,side:true,
 d:'進水口設在壩的上游側、低於正常水位的位置，這樣即使水庫放水到較低水位，仍能取到水。口前裝有攔污柵，擋住漂流木與垃圾，後方的閘門可以在檢修時關閉。水進入壓力鋼管後，沿著山坡或穿過壩體往下衝。水位越深，壓力越大，每下降 10 公尺約增加 1 大氣壓，所以鋼管下段要用更厚的鋼板。管子末端接到廠房的水輪機，這裡的水壓與速度，就是推動機組的力量。',
 s:[[0,'進水口設在低水位以下，隨時取得到水'],[.26,'攔污柵擋住漂流木，閘門可在檢修時關閉'],[.5,'水沿壓力鋼管往下衝，壓力隨深度增加'],[.76,'管子末端接到廠房的水輪機']],
 cam:u=>camMix({x:800,y:450,s:1},{x:650,y:470,s:1.7},ease(seg(u,.06,.3))*(1-ease(seg(u,.78,.94)))),
 draw(u){
  const wl=lerp(WL_FULL,300,ease(seg(u,.2,.7)));
  damScene(wl);
  flowDots(PEN,8,'#dff6ff',seg(u,.28,.36),1,.6,4.5);
  alphaDo(band(u,.0,.8),()=>{ctx.setLineDash([6,6]);ln([240,wl,DAM_X-30,wl],'rgba(255,255,255,.7)',1.5);ctx.setLineDash([]);arrow(300,wl+4,300,lerp(wl+4,408,seg(u,.1,.3)),'#f2c230',3);});
  lab(DAM_X-13,408,'進水口',{dx:-140,dy:-70,st:'s',a:band(u,.04,.3)});
  lab(DAM_X-24,408,'攔污柵',{dx:-150,dy:60,a:band(u,.22,.5)});
  lab(DAM_X+16,416,'閘門',{dx:20,dy:-110,a:band(u,.26,.5)});
  lab(690,560,'壓力鋼管',{dx:-140,dy:-40,st:'s',a:band(u,.44,.8)});
  lab(PH.x+30,PH.y+30,'水輪機',{dx:-20,dy:90,st:'l',a:band(u,.74,1)});
 },
 hud(u){hudPanel(260,150,'進水口水壓（示例）',seg(u,.05,.1),w=>{const d=lerp(150,100,ease(seg(u,.2,.7)));
  hrow(56,'進水口水深',trf('{d} m',{d:Math.round(d)}),w,'#7dc8dc');hrow(88,'水壓',trf('約 {p} MPa',{p:(d*.00981).toFixed(2)}),w,'#f2c230');hrow(120,'規則','每 10 m ≈ 1 大氣壓',w,'#fff');});}},

{t:'法蘭西斯機組：水變成電',en:'Inside a Francis unit',dur:13,
 d:'水庫電廠最常用的是法蘭西斯水輪機。高壓水從壓力鋼管進入蝸殼，沿著圓周均勻分配，再通過可調角度的導翼，轉向後推動轉輪，最後從中心經尾水管流向下游。轉輪透過垂直的主軸帶動上方的發電機轉子，轉子的磁場切割定子線圈，就產生電。導翼開得越大，進水越多，出力越高，這也是機組調整負載的方法。發電機的轉速由頻率與極數決定，60 Hz、16 極時是每分鐘 450 轉。',
 s:[[0,'高壓水進入蝸殼，沿圓周均勻分配'],[.26,'導翼調整進水量，轉輪被推著旋轉'],[.5,'主軸帶動發電機轉子，磁場切割線圈發電'],[.76,'60 Hz、16 極，每分鐘 450 轉']],
 draw(u){
  diagBG();
  card(60,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'法蘭西斯機組剖面（示意）',20,'#f2c230',700);
  const on=seg(u,.06,.14),gv=lerp(.15,.6,seg(u,.3,.45)*.7+.3*seg(u,.8,1));
  const cx=420;
  box(60,742,740,58,'rgba(59,127,160,.35)');
  unitSection(cx,u,on*2.2,gv);
  alphaDo(on,()=>{const P=[[100,520],[240,520],[320,515]];ctx.lineCap='round';pl([[80,520],[180,520]],'#26343d',26);pl([[80,520],[180,520]],'#3b7fa0',14);ctx.lineCap='butt';
   flowDots([[90,520],[200,520],[cx-130,520],[cx-90,520],[cx-30,566],[cx+30,640],[cx+200,720]],9,'#dff6ff',1,1,.4,4);});
  alphaDo(seg(u,.04,.12),()=>{wt(90,500,'壓力鋼管',16,'rgba(227,236,238,.9)',600);wt(cx-176,602,'蝸殼',16,'rgba(227,236,238,.9)',600,'center');wt(cx+100,458,'導翼',16,'#7dffc4',700);wt(cx+120,566,'轉輪',16,'#fff',700);wt(cx+200,760,'尾水管',16,'rgba(227,236,238,.9)',600,'center');});
  alphaDo(seg(u,.5,.56),()=>{wt(cx+110,250,'發電機',17,'#f2c230',700);wt(cx+110,278,'轉子＋定子',15,'rgba(227,236,238,.85)',500);});
  /* 右：能量轉換 */
  card(840,160,700,330,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});wt(864,200,'能量一路轉換',20,'#f2c230',700);
  const S=[['位能','水庫水位高',.1],['壓力與動能','鋼管內高壓水流',.3],['機械能','轉輪帶動主軸',.5],['電能','發電機輸出',.7]];
  S.forEach(([a,b,t],i)=>alphaDo(seg(u,t,t+.05),()=>{const y=262+i*52;tag(864,y,a,{size:17,align:'left'});wt(1100,y+6,b,16,'rgba(227,236,238,.9)',500);if(i<3)wt(880,y+30,'↓',16,'#f2c230',700);}));
  alphaDo(seg(u,.72,.78),()=>wt(864,470,'整體效率約 90–95%（大型機組，示例）',16,'#7dffc4',700));
  card(840,510,700,290,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});wt(864,550,'發電機轉速',20,'#7dffc4',700);
  alphaDo(seg(u,.74,.8),()=>{wt(1190,630,'n = 120 × f ÷ p',40,'#fff',700,'center',COND);wt(1190,670,'f = 60 Hz、p = 16 極（示例）',17,'rgba(227,236,238,.85)',500,'center');
   wt(1190,760,trf('= {n} rpm',{n:Math.round(450*ease(seg(u,.76,.9)))}),46,'#7dffc4',700,'center',COND);});
 }},

{t:'水位、流量與出力',en:'Level, flow and output',dur:13,
 d:'水庫電廠的出力同樣是 P ≈ 9.81 × Q × H × η。流量 Q 靠導翼開度調整，落差 H 則隨水庫水位升降：水位越高，同樣的水能發出越多電。以示例電廠計，流量 60 立方公尺每秒、落差 150 公尺、效率 0.9，約可發 79 MW；水位降到落差 120 公尺，出力就降到約 64 MW。水庫電廠啟動快，幾分鐘內就能從停機升到滿載，所以常在傍晚用電尖峰時發電，離峰時蓄水，成為電網調度的重要工具。',
 s:[[0,'出力 ≈ 9.81 × 流量 × 落差 × 效率'],[.28,'水位降低，同樣的水量發的電就變少'],[.52,'離峰蓄水，傍晚尖峰時開機發電'],[.78,'幾分鐘內就能從停機升到滿載']],
 draw(u){
  diagBG();
  card(60,160,640,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'水位對出力的影響（示例）',20,'#f2c230',700);
  alphaDo(seg(u,.03,.1),()=>{wt(380,262,'P ≈ 9.81 · Q · H · η',34,'#fff',700,'center',COND);wt(380,296,'Q = 60 m³/s、η = 0.9',16,'rgba(227,236,238,.8)',500,'center');});
  const k=ease(seg(u,.12,.3));
  const rows=[['滿水位','H = 150 m',150,'#58b8d0',.12],['低水位','H = 120 m',120,'#ff8a60',.28]];
  rows.forEach(([a,b,H,col,t],i)=>alphaDo(seg(u,t,t+.05),()=>{const y=370+i*190;wt(90,y,a,20,'#fff',700);wt(90,y+30,b,18,'rgba(227,236,238,.85)',600,'left',COND);
   const P=9.81*60*H*.9/1000;box(90,y+48,lerp(0,400,P/80*(i?seg(u,.3,.45):k)),30,col);wt(660,y+72,trf('{p} MW',{p:(P*(i?seg(u,.3,.45):k)).toFixed(0)}),24,col,700,'right',COND);}));
  alphaDo(seg(u,.4,.46),()=>wt(380,760,'水位少 20%，出力少約 20%',18,'#7dffc4',700,'center'));
  /* 右：日負載曲線 */
  const c=chartBox(740,160,800,640,{title:'一天的用電與水力調度（示意）',x0:0,x1:24,y0:0,y1:1,pl:70,pb:70,pt:76,gx:4,gy:4});
  ['0','6','12','18','24'].forEach((t,i)=>wt(c.X(i*6),c.py+c.ph+24,t,16,'rgba(227,236,238,.75)',600,'center',COND));
  wt(c.px+c.pw-8,c.py+c.ph-12,'時',16,'rgba(227,236,238,.7)',500,'right');
  const load=h=>.45+.22*Math.exp(-Math.pow((h-11)/3.2,2))+.3*Math.exp(-Math.pow((h-19.5)/2.2,2));
  const hy=h=>Math.max(0,.9*Math.exp(-Math.pow((h-19.5)/2.1,2))*1.0);
  const t1=seg(u,.46,.7);
  alphaDo(seg(u,.4,.46),()=>{ctx.beginPath();for(let i=0;i<=96;i++){const h=i/4;if(h>24*t1+.01)break;const x=c.X(h),y=c.Y(load(h));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#f2c230';ctx.lineWidth=4;ctx.stroke();});
  alphaDo(seg(u,.5,.56),()=>{ctx.beginPath();ctx.moveTo(c.X(0),c.Y(0));for(let i=0;i<=96;i++){const h=i/4;if(h>24*t1+.01)break;ctx.lineTo(c.X(h),c.Y(hy(h)));}ctx.lineTo(c.X(Math.min(24,24*t1)),c.Y(0));ctx.closePath();ctx.fillStyle='rgba(125,255,196,.35)';ctx.fill();});
  alphaDo(seg(u,.6,.66),()=>{wt(c.X(19.5),c.Y(1)-6,'尖峰：水力開機發電',17,'#7dffc4',700,'center');wt(c.X(3),c.Y(.4)-10,'離峰：停機蓄水',17,'rgba(227,236,238,.9)',600,'center');});
  alphaDo(seg(u,.4,.46),()=>{wt(c.X(1),c.Y(load(1))-30,'用電需求',16,'#f2c230',700);});
  alphaDo(seg(u,.5,.56),()=>wt(c.X(15.5),c.Y(.12)-6,'水力出力',16,'#7dffc4',700,'right'));
  alphaDo(seg(u,.76,.82),()=>{tag(c.px+20,c.py+30,'停機 → 滿載：約數分鐘',{size:19,bg:'#7dffc4',fg:'#0e2a3b'});});
 }},

{t:'大甲溪的階梯式開發',en:'A cascade on the Dajia River',dur:12,
 d:'台灣山多河短、落差大，水力開發常沿著同一條河流分段進行。大甲溪最上游是德基水庫，滿水位約 1,408 公尺，德基電廠最多 3 部機組合計 234 MW；水發電後往下游流，依序經過青山、谷關、天輪、馬鞍等電廠，同一批水一路再利用，整條溪的落差都被用到。水庫放水時要保留河川生態所需的水量，也兼顧供水與防洪。到 2024 年底，台灣慣常水力約 1,826 MW，占全國裝置容量 3.2%，抽蓄水力則有 2,602 MW。',
 s:[[0,'大甲溪最上游是德基水庫，滿水位約 1,408 m'],[.3,'水發電後流往下游，依序經過各座電廠'],[.55,'同一批水一路再利用，整條溪的落差都被用到'],[.78,'慣常水力約占全國裝置容量 3.2%']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'大甲溪電廠由上游到下游（落差示意，非實際高程）',20,'#f2c230',700);
  const N=[['德基','水庫式 234 MW'],['青山',''],['谷關',''],['天輪',''],['馬鞍','']];
  const X0=170,DX=190,Y0=290,DY=100;
  ctx.beginPath();N.forEach((n,i)=>{const x=X0+i*DX,y=Y0+i*DY;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.strokeStyle='rgba(88,184,208,.9)';ctx.lineWidth=6;ctx.stroke();
  N.forEach(([n,s],i)=>{const t=.04+i*.12,a=seg(u,t,t+.06),x=X0+i*DX,y=Y0+i*DY;
   alphaDo(a,()=>{box(x-26,y-52,52,42,i===0?'#b8c0c4':'#d9dfe2','rgba(0,0,0,.4)',2);poly([x-32,y-52,x,y-72,x+32,y-52],'#8a4a3a');
    wt(x,y+34,n,20,i===0?'#f2c230':'#fff',700,'center');if(s)wt(x,y+62,s,15,'#7dffc4',700,'center');});});
  alphaDo(seg(u,.3,.6),()=>{for(let k=0;k<12;k++){const f=((TT*.12)+k/12)%1;const p=[X0+f*4*DX,Y0+f*4*DY];circ(p[0],p[1]-5,4,'#dff6ff');}});
  alphaDo(seg(u,.55,.62),()=>{wt(X0+DX*2,Y0+DY*4-10,'一滴水，一路發電',22,'#7dffc4',700,'center');});
  /* 右：台灣水力比重 */
  card(1100,160,440,330,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});wt(1124,200,'台灣裝置容量（2024 年底）',20,'#f2c230',700);
  alphaDo(seg(u,.76,.82),()=>{const k=ease(seg(u,.78,.95));
   wt(1124,264,'慣常水力',18,'#fff',700);box(1124,276,lerp(0,1826,k)/2602*380,24,'#58b8d0');wt(1500,320,trf('{v} MW',{v:Math.round(1826*k).toLocaleString('en-US')}),22,'#58b8d0',700,'right',COND);
   wt(1124,370,'抽蓄水力',18,'#fff',700);box(1124,382,lerp(0,2602,k)/2602*380,24,'#7dffc4');wt(1500,426,trf('{v} MW',{v:Math.round(2602*k).toLocaleString('en-US')}),22,'#7dffc4',700,'right',COND);
   wt(1124,466,'占全國 3.2% 與 4.5%',16,'rgba(227,236,238,.85)',500);});
  card(1100,510,440,290,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});wt(1124,550,'水庫的多重任務',20,'#7dffc4',700);
  [['供水','民生、農業與工業用水'],['防洪','颱風豪雨前預先騰空'],['發電','調度尖峰與備用'],['生態','保留河川基流']].forEach(([a,b],i)=>alphaDo(seg(u,.4+i*.1,.45+i*.1),()=>{const y=594+i*52;wt(1124,y,a,18,'#fff',700);wt(1124,y+24,b,14,'rgba(227,236,238,.85)',500);}));
 }}
]};
