// KITS: land
/* 氫能系列 第 8 集：氫能煉鋼 */
const gyy=x=>groundY(x);
const SUN={x:1180,y:120};
const H2C='#7dffc4',WC='#58b8d0',EC='#f2c230',HC='#ff8a60',CC='#7dc8dc',PC='#b37cff';
function pipeDots(P,n,col,sp,r){const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));const T=L[L.length-1];
  for(let k=0;k<n;k++){const d=(((TT*sp)+k/n)%1)*T;let i=1;while(i<L.length-1&&L[i]<d)i++;const f=(d-L[i-1])/(L[i]-L[i-1]);circ(lerp(P[i-1][0],P[i][0],f),lerp(P[i-1][1],P[i][1],f),r||5,col);}}
function smoke(x,y,n,col,k,spread){for(let i=0;i<n;i++){const f=((TT*.22)+i/n)%1;alphaDo((1-f)*.55*k,()=>circ(x+Math.sin(i*2.1+f*4)*18*f+f*(spread||50),y-f*230,8+f*20,col));}}
function tank(x,y,w,h,fill){rrp(x,y-h,w,h,h/2);ctx.fillStyle='#10354a';ctx.fill();rrp(x,y-h,w,h,h/2);ctx.strokeStyle='#aeb8be';ctx.lineWidth=5;ctx.stroke();
  if(fill>0){ctx.save();rrp(x,y-h,w,h,h/2);ctx.clip();ctx.fillStyle='rgba(125,255,196,.35)';ctx.fillRect(x,y-h*fill,w,h*fill);ctx.restore();}}
/* 高爐：x 為左緣，g 為地面 */
function blastFurnace(x,g,glow){
  poly([x,g,x+220,g,x+190,g-120,x+170,g-330,x+50,g-330,x+30,g-120],'#7d8a92','rgba(0,0,0,.35)',1.5);
  poly([x+60,g-20,x+160,g-20,x+148,g-110,x+60,g-110],'#3a2a22');
  alphaDo(glow,()=>{poly([x+66,g-24,x+154,g-24,x+146,g-104,x+66,g-104],'#ff7a30');box(x+80,g-70,60,30,'#ffd27a');});
  box(x+40,g-342,140,14,'#6c777e');
  for(let i=0;i<3;i++)ln([x+36+i*4,g-220+i*40,x+184-i*4,g-220+i*40],'rgba(0,0,0,.22)',3);}
/* 熱風爐 */
function stove(x,g,w,h){rrp(x,g-h,w,h,w/2);ctx.fillStyle='#9aa6ad';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=2;ctx.stroke();for(let i=1;i<4;i++)ln([x+6,g-h+i*h/4,x+w-6,g-h+i*h/4],'rgba(0,0,0,.2)',2);}
/* 豎爐 */
function shaft(x,g,w,h){box(x,g-h,w,h,'#8a969e','rgba(0,0,0,.35)',1.5);box(x+10,g-h+10,w-20,h-20,'#4a3b34');box(x-8,g-h-12,w+16,14,'#6c777e');}
function pellets(x,y,w,h,flow,col){const R=rng(11);for(let i=0;i<46;i++){const px=x+8+R()*(w-16),py0=R();const py=y+((py0+TT*flow)%1)*h;circ(px,py,5,col||'#b0603f');}}

const EP={no:8,slug:'hydrogen',seriesName:'氫能系列',t:'氫能煉鋼：用氫取代焦炭',en:'Hydrogen steelmaking: replacing coke with hydrogen',
lede:'鋼鐵是工業排碳的大戶，因為高爐要用焦炭把鐵礦裡的氧搶走。氫也能搶走氧，產物只有水。把氫還原鐵搭配電爐，就是低碳煉鋼的一條路，但前提是有大量的綠電與綠氫。',
facts:[['約 1.8','t CO₂／t 鋼','高爐—轉爐路線的典型排放，各文獻約 1.8–2.0'],
['約 51','kg H₂／t 鋼','氫還原所需的氫量（約 1.7 MWh），各文獻約 50–60'],
['約 900','°C','豎爐內還原溫度的典型範例；氫還原吸熱，需要補熱'],
['約 3.5','MWh／t 鋼','全氫路線耗電，常見範圍 3.5–3.9，多數用在電解'],
['約 1.6','t CO₂／t 鋼','以台灣電網電力估算的電力排放，與高爐相近'],
['2030 與 2050','年','中鋼規劃：2030 年前高爐噴吹含氫氣體，2050 年氫冶金與碳捕捉']],
note:'說明：本集為教育用途示意動畫，設備外觀與比例經過調整。高爐路線約 1.8 t CO₂／t 鋼（文獻約 1.8–2.0）、氫還原約 51 kg H₂／t 鋼（約 50–60）、全氫路線耗電約 3.5 MWh／t 鋼（約 3.5–3.9）、豎爐約 900°C 皆為典型範例；電力排碳以台電 114 年度 0.467 kg CO₂e／度、光電約 0.045、離岸風電約 0.012 估算，僅計電力、不含礦石與其他製程排放。中鋼路徑依媒體報導的公開規劃整理，實際時程以公司公告為準。',
base:()=>{landSky(GY,{sun:SUN,clouds:true});drawGround();},
shots:[
{t:'高爐：靠焦炭搶走氧',en:'The blast furnace runs on coke',dur:13,side:true,
 d:'鐵礦石的主要成分是氧化鐵，要得到鐵，就得把氧拿走。傳統高爐從頂部加入鐵礦與焦炭，底部吹入約 1,200°C 的熱風，焦炭燃燒產生一氧化碳，一氧化碳奪走氧化鐵裡的氧，變成二氧化碳。煉出的鐵水再送進轉爐煉成鋼。每生產 1 公噸鋼，典型排放約 1.8 公噸二氧化碳。',
 s:[[0,'鐵礦與焦炭從爐頂加入，熱風從底部吹入'],[.3,'焦炭變成一氧化碳，奪走氧化鐵裡的氧'],[.58,'一氧化碳變成二氧化碳，從爐頂排出'],[.82,'每噸鋼典型排放約 1.8 噸二氧化碳']],
 draw(u){
  const X=600,g=gyy(X+110);
  stove(250,g,70,250);stove(335,g,70,230);
  ln([320,g-40,X+30,g-40],'#e8572a',10);alphaDo(seg(u,.1,.2),()=>pipeDots([[320,g-40],[X+30,g-40]],5,'#ffd27a',.25,4));
  blastFurnace(X,g,seg(u,.05,.15));
  ln([X-170,g,X+110,g-342],'#6c777e',9);
  const sk=seg(u,.02,.1);
  for(let i=0;i<5;i++){const f=(TT*.14+i/5)%1;alphaDo(sk,()=>{circ(lerp(X-170,X+110,f),lerp(g,g-342,f)-12,9,i%2?'#2c2c2c':'#b0603f');});}
  const hot=seg(u,.2,.35);
  alphaDo(hot,()=>{for(let i=0;i<8;i++){const f=(TT*.2+i/8)%1;circ(X+70+Math.sin(i*5)*30,g-300+f*240,5,i%2?'#ff8a3a':'#ffd27a');}});
  smoke(X+110,g-346,12,'rgba(150,154,160,1)',seg(u,.45,.58),70);
  alphaDo(band(u,.04,.5),()=>tag(X+260,g-420,'Fe₂O₃ + 3CO → 2Fe + 3CO₂',{bg:EC,fg:'#0e2a3b',size:24}));
  box(X+210,g-26,70,18,'#e8572a');ln([X+270,g-18,X+330,g-18],'#ff9a50',7);
  const lq=seg(u,.6,.9);box(X+320,g-60,90,60,'#5a6168');box(X+328,g-52+(1-lq)*40,74,48*lq+4,'#ff9a50');
  lab(280,g-250,'熱風爐',{dx:-30,dy:-110,a:band(u,.05,.5)});
  lab(X-40,g-200,'鐵礦與焦炭',{dx:-120,dy:-100,st:'s',a:band(u,.05,.5)});
  lab(X+110,g-346,'二氧化碳排出',{dx:-250,dy:-70,st:'w',a:band(u,.5,1)});
  lab(X+365,g-30,'鐵水',{dx:80,dy:-110,st:'g',a:band(u,.6,1)});
 },
 hud(u){hudPanel(270,128,'每公噸鋼（示例）',seg(u,.05,.1),w=>{const v=lerp(0,1.8,ease(seg(u,.3,.8)));
  hrow(56,'CO₂',trf('{n} t',{n:v.toFixed(1)}),w,HC);hbar(14,68,w-28,v/2.2,HC);hrow(106,'還原劑','焦炭',w,EC);});}},

{t:'氫也能搶走氧',en:'Hydrogen takes the oxygen too',dur:13,
 d:'氧化鐵要經過三步，才變成金屬鐵：赤鐵礦 Fe₂O₃ 先變磁鐵礦 Fe₃O₄，再變方鐵礦 FeO，最後是鐵。焦炭路線的搶氧者是一氧化碳，產物是二氧化碳；氫路線的搶氧者是氫氣，產物是水。差別在於，一氧化碳還原大致放熱，氫還原則吸熱，所以氫路線必須把氫氣預熱，並持續補熱。',
 s:[[0,'氧化鐵要經過三步，才變成金屬鐵'],[.3,'焦炭路線用一氧化碳搶氧，產出二氧化碳'],[.58,'氫路線用氫氣搶氧，產出的是水'],[.82,'氫還原吸熱，所以氫氣要預熱並持續補熱']],
 draw(u){
  diagBG();
  const steps=['Fe₂O₃','Fe₃O₄','FeO','Fe'];
  const rows=[['焦炭路線：一氧化碳還原',HC,'CO₂','排出二氧化碳','大致放熱',.26,230],['氫路線：氫氣還原',H2C,'H₂O','排出水蒸氣','吸熱，需補熱',.5,520]];
  rows.forEach(([ttl,col,prod,pn,heat,t0,y0])=>{
   card(60,y0-70,1480,250,{bg:'rgba(7,27,39,.75)'});
   alphaDo(seg(u,t0-.04,t0+.02),()=>wt(90,y0-26,ttl,24,col,700));
   steps.forEach((s,i)=>{const x=150+i*250,k=seg(u,t0+i*.05,t0+i*.05+.06);
    alphaDo(k,()=>{box(x,y0+10,150,76,i==3?'#c9d3d8':'#b0603f','rgba(0,0,0,.3)',1.5);wt(x+75,y0+58,s,34,i==3?'#0e2a3b':'#fff',800,'center',COND);});
    if(i<3)alphaDo(seg(u,t0+i*.05+.03,t0+i*.05+.08),()=>{arrow(x+158,y0+48,x+242,y0+48,col,5);});});
   alphaDo(seg(u,t0+.18,t0+.24),()=>{tag(1180,y0+8,prod,{bg:col,fg:'#0e2a3b',size:30});wt(1180,y0+74,pn,20,'rgba(227,236,238,.92)',600);tag(1180,y0+104,heat,{bg:'rgba(0,0,0,.35)',fg:col,size:20});});
  });
  alphaDo(seg(u,.8,.88),()=>wt(800,790,'焦炭路線的碳，最後變成二氧化碳；氫路線的氫，最後變成水',22,EC,700,'center'));
 }},

{t:'豎爐直接還原：氫氣吹過礦球',en:'Shaft furnace direct reduction',dur:14,side:true,
 d:'氫還原鐵不用熔化鐵礦。鐵礦球團從豎爐頂部加入，約 900°C 的熱氫氣由爐腰吹入，向上穿過礦球，帶走氧氣變成水蒸氣。爐頂出來的氣體經冷凝把水分離，氫氣可回收再用。球團在固態下變成海綿鐵（DRI），含鐵量高、帶孔洞，從爐底排出。氫氣由電解槽供應，電力來自太陽光電或風電。',
 s:[[0,'電解槽產氫，加熱器把氫氣升溫到約 900°C'],[.3,'熱氫氣從爐腰吹入，向上穿過鐵礦球團'],[.58,'氫帶走氧變成水，爐頂氣體冷凝回收'],[.82,'固態的海綿鐵（DRI）從爐底排出']],
 draw(u){
  const g=gyy(700),X=640,W=200,H=300;
  for(let i=0;i<3;i++)solarPanel(60+i*92,gyy(60+i*92),84,24,{h:46,glint:true});
  box(150,g-110,170,110,'#dfe5e8','rgba(0,0,0,.3)',1.5);box(150,g-110,170,14,'#1f7f99');wt(235,g-40,'電解槽',22,'#0e2a3b',700,'center');
  const P1=[[320,g-60],[400,g-60]];
  ln(P1.flat(),H2C,8);alphaDo(seg(u,.05,.12),()=>pipeDots(P1,3,H2C,.25,4));
  box(400,g-130,100,130,'#8a5a4a','rgba(0,0,0,.35)',1.5);
  const gl=seg(u,.1,.25);alphaDo(gl,()=>{box(412,g-100,76,70,'#ff7a30');box(426,g-86,48,40,'#ffd27a');});
  wt(450,g-146,'加熱器',20,'#fff',700,'center');
  const P2=[[500,g-60],[560,g-60],[560,g-H*.4],[X,g-H*.4]];
  ln(P2.flat(),'#ffb070',8);alphaDo(seg(u,.28,.36),()=>pipeDots(P2,6,'#ffe0a0',.22,4));
  shaft(X,g,W,H);
  pellets(X+10,g-H+14,W-20,H*.62,.05,'#b0603f');
  const red=seg(u,.3,.75);
  box(X+10,g-H*.38,W-20,H*.38-10,'#6e6f73');
  alphaDo(red,()=>{const R=rng(3);for(let i=0;i<30;i++)circ(X+16+R()*(W-32),g-H*.38+10+((R()+TT*.05)%1)*(H*.38-30),5,'#c9d3d8');});
  const up=seg(u,.32,.5);
  alphaDo(up,()=>{for(let i=0;i<8;i++){const f=(TT*.18+i/8)%1;circ(X+30+(i%4)*45,g-H*.4-f*(H*.55),4,i%2?'#ffe0a0':H2C);}});
  const P3=[[X+W,g-H-4],[X+W+60,g-H-4],[X+W+60,g-H+30],[1020,g-H+30]];
  ln(P3.flat(),CC,8);alphaDo(seg(u,.45,.55),()=>pipeDots(P3,5,'#e6f6fb',.2,4));
  box(1020,g-H-30,110,130,'#9bb7c2','rgba(0,0,0,.3)',1.5);wt(1075,g-H+40,'冷凝',20,'#0e2a3b',700,'center');
  const wa=seg(u,.55,.8);
  alphaDo(wa,()=>{for(let i=0;i<5;i++){const f=(TT*.3+i/5)%1;alphaDo(1-f,()=>circ(1075,g-H+100+f*60,5,WC));}});
  box(1030,g-H+165,90,36,'#5d7f8e');wt(1075,g-H+191,'水',18,'#fff',700,'center');
  const dr=seg(u,.6,.9);
  box(X+W/2-30,g,60,8,'#4a4f55');
  alphaDo(dr,()=>{for(let i=0;i<4;i++){const f=(TT*.3+i/4)%1;circ(X+W/2+Math.sin(i*4)*10,g+f*26,6,'#c9d3d8');}});
  lab(235,g-110,'電解槽',{dx:-30,dy:-130,st:'s',a:band(u,0,.4)});
  lab(450,g-100,'氫氣加熱到約 900°C',{dx:-40,dy:-120,a:band(u,.12,.5)});
  lab(X+W/2,g-H-12,'鐵礦球團',{dx:-120,dy:-10,st:'s',a:band(u,.02,.5)});
  lab(X+W/2,g-H*.25,'豎爐',{dx:-230,dy:-160,a:band(u,.3,.7)});
  lab(1130,g-H+30,'水蒸氣冷凝',{dx:110,dy:60,a:band(u,.5,.9)});
  lab(X+W/2,g+16,'海綿鐵（DRI）',{dx:-250,dy:50,st:'g',a:band(u,.62,1)});
 },
 hud(u){hudPanel(270,128,'豎爐（示例）',seg(u,.05,.1),w=>{const v=lerp(25,900,ease(seg(u,.1,.5)));
  hrow(56,'氫氣溫度',trf('{n} °C',{n:Math.round(v)}),w,EC);hbar(14,68,w-28,v/1000,EC);hrow(106,'產物','水蒸氣',w,H2C);});}},

{t:'電爐煉鋼：電弧熔化海綿鐵',en:'Electric arc furnace',dur:13,side:true,
 d:'海綿鐵還要熔化成鋼。電弧爐用三支石墨電極，在爐內與金屬料之間產生電弧，溫度可超過 3,000°C，把海綿鐵與廢鋼熔成約 1,600°C 的鋼水。這個步驟全靠電，所以電力的排碳係數很重要。熔煉完成後，爐體傾斜，鋼水倒入鋼包，送去精煉與連鑄。',
 s:[[0,'海綿鐵與廢鋼從爐頂裝入電弧爐'],[.3,'石墨電極放下，電弧把金屬料熔化'],[.58,'爐內升到約 1,600°C，鋼水逐漸升高'],[.82,'爐體傾斜，鋼水倒入鋼包送去精煉']],
 draw(u){
  const X=640,g=gyy(X+150);
  const tilt=ease(seg(u,.78,.95))*-.28;
  const ch=seg(u,.02,.24);
  /* 裝料桶 */
  const by=lerp(g-470,g-330,ease(seg(u,.02,.18)));
  alphaDo(1-seg(u,.24,.3),()=>{poly([X+80,by,X+220,by,X+200,by+90,X+100,by+90],'#6c777e','rgba(0,0,0,.3)',1.5);
   if(ch>.1)for(let i=0;i<6;i++)circ(X+120+i*16,by+(((TT*.5)+i/6)%1)*100+10,6,'#c9d3d8');});
  ctx.save();ctx.translate(X+150,g-30);ctx.rotate(tilt);ctx.translate(-X-150,-g+30);
  poly([X,g-230,X+300,g-230,X+270,g-30,X+30,g-30],'#7d8a92','rgba(0,0,0,.35)',1.5);
  const lvl=seg(u,.3,.7);
  ctx.save();ctx.beginPath();ctx.moveTo(X+14,g-228);ctx.lineTo(X+286,g-228);ctx.lineTo(X+262,g-38);ctx.lineTo(X+38,g-38);ctx.closePath();ctx.clip();
  ctx.fillStyle='#8a8f94';ctx.fillRect(X,g-38-80*(1-lvl)-10,300,150*(1-lvl)+14);
  ctx.fillStyle='#ff9a50';ctx.fillRect(X,g-38-(30+90*lvl)*lvl,300,(30+90*lvl)*lvl+10);ctx.restore();
  ln([X-6,g-232,X+306,g-232],'#6c777e',10);
  const ed=ease(seg(u,.22,.36));
  [0,1,2].forEach(i=>{const ex=X+70+i*80;box(ex-9,g-400,18,170+ed*110-40,'#2a2d30','rgba(255,255,255,.2)',1);
   if(ed>.9){const fl=.55+.45*Math.sin(TT*30+i*2);alphaDo(fl*seg(u,.34,.4),()=>{circ(ex,g-120+ed*0,24,'#fff3b0');circ(ex,g-120,12,'#fff');});}});
  ctx.restore();
  /* 鋼包 */
  const pr=seg(u,.82,.97);
  box(X+390,g-90,130,90,'#5a6168','rgba(0,0,0,.3)',1.5);
  if(pr>0){ln([X+300,g-80,X+390+30,g-90+4],'#ff9a50',8*pr);box(X+400,g-14-70*pr,110,70*pr,'#ff9a50');}
  /* 供電 */
  ln([X-120,g-380,X+60,g-380],'#ff9d7a',4);ln([X-120,g-380,X-120,g-60],'#9aa6ad',8);
  alphaDo(seg(u,.2,.4),()=>pipeDots([[X-120,g-380],[X+60,g-380]],4,'#fff3b0',.35,4));
  lab(X+150,g-232,'電弧爐',{dx:-340,dy:-100,a:band(u,.05,.5)});
  lab(X+150,g-330,'石墨電極',{dx:200,dy:-20,st:'s',a:band(u,.2,.7)});
  lab(X+150,g-120,'鋼水約 1,600°C',{dx:-60,dy:130,st:'w',a:band(u,.45,.85)});
  lab(X+455,g-70,'鋼包',{dx:90,dy:-120,st:'g',a:band(u,.8,1)});
  lab(X-120,g-250,'綠電',{dx:-60,dy:-60,st:'g',a:band(u,.2,.7)});
 },
 hud(u){hudPanel(270,128,'電弧爐（示例）',seg(u,.05,.1),w=>{const v=lerp(25,1600,ease(seg(u,.3,.7)));
  hrow(56,'鋼水溫度',trf('{n} °C',{n:Math.round(v)}),w,v>1000?HC:EC);hbar(14,68,w-28,v/1800,v>1000?HC:EC);hrow(106,'能源','電力',w,EC);});}},

{t:'一噸鋼要多少氫與電',en:'Hydrogen and power per tonne of steel',dur:14,
 d:'以全氫路線估算，每公噸鋼約需 51 公斤氫，電解就要約 2.65 MWh，再加上氫氣加熱與電爐，總耗電約 3.5 MWh，常見範圍在 3.5 到 3.9 MWh。電的來源決定碳排：用台灣電網電力，電力部分約 1.6 公噸二氧化碳，與高爐相近；用光電約 0.16，用離岸風電約 0.04。',
 s:[[0,'每噸鋼約需 51 公斤氫，電解約耗電 2.65 MWh'],[.3,'加上氫氣加熱與電爐，總耗電約 3.5 MWh'],[.58,'用台灣電網電力，電力排放約 1.6 噸，與高爐相近'],[.82,'換成光電或離岸風電，才降到約 0.16 與 0.04 噸']],
 draw(u){
  diagBG();
  card(60,160,700,600,{bg:'rgba(7,27,39,.75)'});wt(90,208,'每公噸鋼的耗電（示例）',22,EC,700);
  const bx=100,bw=620;
  alphaDo(seg(u,.04,.1),()=>{wt(bx,300,'電解製氫（約 51 kg H₂）',20,H2C,700);const k=ease(seg(u,.04,.22));box(bx,316,bw*(2.65/3.5)*k,54,H2C);if(k>.9)wt(bx+bw*(2.65/3.5)-12,358,'2.65',28,'#0e2a3b',800,'right',COND);});
  alphaDo(seg(u,.26,.32),()=>{wt(bx,440,'氫氣加熱、豎爐與電爐',20,EC,700);const k=ease(seg(u,.26,.4));box(bx,456,bw*(.85/3.5)*k,54,EC);if(k>.9)wt(bx+bw*(.85/3.5)+14,498,'0.85',28,'#fff',800,'left',COND);});
  alphaDo(seg(u,.38,.44),()=>{ln([bx,560,bx+bw,560],'rgba(227,236,238,.5)',2);tag(bx,590,'合計約 3.5 MWh',{bg:EC,fg:'#0e2a3b',size:28});wt(bx,672,'常見範圍 3.5–3.9 MWh／t 鋼',20,'rgba(227,236,238,.9)',500);});
  card(800,160,740,600,{bg:'rgba(7,27,39,.75)'});wt(830,208,'電力排放（t CO₂／t 鋼，僅計電力）',22,EC,700);
  const rows=[['高爐路線（焦炭）',1.8,HC,.5],['氫還原＋台灣電網',1.6,'#e8572a',.56],['氫還原＋光電',.16,EC,.66],['氫還原＋離岸風電',.04,PC,.74]];
  rows.forEach(([n,v,col,t0],i)=>{const y=290+i*115,k=ease(seg(u,t0,t0+.1));
   alphaDo(seg(u,t0,t0+.04),()=>wt(830,y,n,21,'rgba(227,236,238,.95)',700));
   if(k>0){const w=Math.max(4,620*(v/2)*k);box(830,y+14,w,46,col);if(k>.9)wt(830+w+12,y+50,trf('約 {n}',{n:v<1?v.toFixed(2):v.toFixed(1)}),26,'#fff',700,'left',COND);}});
 }},

{t:'台灣的低碳煉鋼路徑',en:"Taiwan's low-carbon steel pathway",dur:13,
 d:'台灣的鋼鐵廠以高爐為主，是工業排碳的大戶。中鋼規劃分階段走：2030 年前，把高爐的輔助燃料由粉煤改為含氫氣體，並用部分還原鐵取代鐵料；2050 年再導入氫冶金，並搭配碳捕捉與封存。真正的門檻是綠氫的量與價格、需要的大量綠電，以及低碳鋼的認證與歐盟碳邊境調整機制。',
 s:[[0,'現在：高爐加焦炭，是主要的煉鐵方式'],[.3,'2030 年前：高爐噴吹含氫氣體，搭配部分還原鐵'],[.58,'2050 年：導入氫冶金，並搭配碳捕捉封存'],[.82,'關鍵門檻：綠氫的量與價格、綠電、低碳鋼認證']],
 draw(u){
  diagBG();
  const S=[['現在','高爐＋焦炭','主要靠焦炭還原',HC,.04],['2030 年前','高爐噴吹含氫氣體','部分以還原鐵取代鐵料',EC,.26],['2050 年','氫冶金＋碳捕捉封存','氫還原鐵搭配電爐',H2C,.48]];
  ln([120,300,1480,300],'rgba(227,236,238,.35)',4);
  S.forEach(([yr,a,b,col,t0],i)=>{const x=60+i*500;
   alphaDo(seg(u,t0,t0+.08),()=>{circ(x+240,300,16,col,'#fff',3);tag(x+240,240,yr,{bg:col,fg:'#0e2a3b',size:28,align:'center'});
    card(x,350,460,230,{bg:'rgba(7,27,39,.75)'});wt(x+30,410,a,26,col,700);wt(x+30,460,b,21,'rgba(227,236,238,.92)',500);});});
  alphaDo(seg(u,.68,.74),()=>wt(800,640,'三道門檻',24,EC,700,'center'));
  [['綠氫的量與價格',.72,H2C],['大量綠電',.78,PC],['低碳鋼認證與 CBAM',.84,CC]].forEach(([a,t0,col],i)=>alphaDo(seg(u,t0,t0+.06),()=>tag(300+i*500,710,a,{bg:col,fg:'#0e2a3b',size:24,align:'center'})));
 }}
]};
