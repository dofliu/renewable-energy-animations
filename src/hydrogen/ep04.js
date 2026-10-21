// KITS: land
/* 氫能系列 第 4 集：氫氣的安全 */
const gyy=x=>groundY(x);
const SUN={x:1180,y:120};
const H2C='#7dffc4',O2C='#b37cff',WC='#58b8d0',EC='#f2c230',HC='#ff8a60';
function pl(P,col,lw){const a=[];P.forEach(p=>a.push(p[0],p[1]));ln(a,col,lw);}
function skyline(x0,n){const R=rng(33);for(let i=0;i<n;i++){const x=x0+i*72+R()*20,h=60+R()*110,w=46+R()*24;box(x,gyy(x)-h-2,w,h,'rgba(120,140,150,.35)');}}
function road(){ctx.beginPath();for(let x=-400;x<=2000;x+=20)ctx.lineTo(x,gyy(x)-2);for(let x=2000;x>=-400;x-=20)ctx.lineTo(x,gyy(x)+16);ctx.closePath();ctx.fillStyle='#3d4448';ctx.fill();}
function dispenser(x){const g=gyy(x);box(x-22,g-96,44,96,'#f4f6f7','rgba(0,0,0,.3)',1);box(x-16,g-86,32,20,'#2a3a46');box(x-22,g-110,44,14,'#1f7f99');wt(x,g-99,'H₂',11,'#fff',700,'center',COND);}
function posts(x0,x1){const g=gyy(x0);box(x0+20,g-194,12,194,'#aeb8be');box(x1-32,g-194,12,194,'#aeb8be');}
/* 頂棚：gap 為頂部排氣開口寬度 */
function roof(x0,x1,gap){const g=gyy(x0),y=g-210;
  if(gap>0){const m=(x0+x1)/2;box(x0,y,m-gap/2-x0,16,'#e3e8ec','rgba(0,0,0,.25)',1);box(m+gap/2,y,x1-m-gap/2,16,'#e3e8ec','rgba(0,0,0,.25)',1);
    box(m-gap/2-8,y-34,8,34,'#aeb8be');box(m+gap/2,y-34,8,34,'#aeb8be');box(m-gap/2-24,y-44,gap+48,10,'#c9d1d6','rgba(0,0,0,.25)',1);}
  else box(x0,y,x1-x0,16,'#e3e8ec','rgba(0,0,0,.25)',1);
  box(x0,y+14,x1-x0,6,'#1f7f99');}

const EP={no:4,slug:'hydrogen',seriesName:'氫能系列',t:'氫氣的安全',en:'Hydrogen safety',
lede:'氫氣燃燒範圍寬、點火能量低，洩漏後又無色無味、火焰幾乎看不見。但它也比空氣輕得多，一旦在戶外洩漏會迅速向上散開。這一集看氫氣的特性如何決定安全設計：通風與排氣、偵測器與緊急停機、耐氫材料與壓力釋放，最後把這些做法疊成一層又一層的防護。',
facts:[['4–75','%','氫氣在空氣中的可燃範圍（體積比）；甲烷約 5–15%'],
['約 0.02','mJ','氫氣的最小點火能量，約為甲烷的十四分之一'],
['約 1/14','','氫氣密度相對空氣，洩漏後會迅速向上擴散'],
['0.4 / 1','%','偵測器常見的警報與停機設定，約為下限 4% 的 10% 與 25%（示例）'],
['約 110','°C','車用氣瓶熱啟動洩壓裝置常見的動作溫度（示例）'],
['3','層','預防洩漏、偵測洩漏、阻止擴大，是加氫站的基本防護邏輯']],
note:'說明：本集為教育用途示意動畫，設備外觀與比例經過調整。可燃範圍 4–75%（各來源略有差異，約 4–74%）與最小點火能量約 0.02 mJ（各來源 0.017–0.02 mJ）為氫安全文獻常見值；甲烷可燃範圍約 5–15%、汽油蒸氣約 1.4–7.6%、甲烷最小點火能量約 0.3 mJ 為一般文獻值。警報 10% 與停機 25% 可燃下限、洩漏濃度曲線、洩壓裝置約 110°C、頂棚排氣與各防護層的配置為典型範例，實際依場站設計與法規而定。中油楠梓加氫站於 2025 年 12 月啟用，TÜV SÜD 依 ISO 19880-1:2020 進行安全性與功能性測試，資料取自新聞報導與該公司新聞稿。',
base:()=>{landSky(GY,{sun:SUN,clouds:true});drawGround();},
shots:[
{t:'氫氣有哪些特性',en:'What makes hydrogen different',dur:13,
 d:'談氫安全，先看氫氣本身的三個特性。第一，可燃範圍很寬：在空氣中體積比約 4% 到 75% 都能被點燃，甲烷只有約 5% 到 15%。第二，點火能量很低：只要約 0.02 毫焦耳，大約是甲烷的十四分之一，一點靜電火花就可能引燃。第三，氫氣燃燒時火焰淡藍近乎無色，白天用肉眼很難看見。好消息是氫氣很輕，密度只有空氣的約十四分之一，洩漏後會迅速向上散開，這也是防護設計最倚賴的特性。',
 s:[[0,'氫氣在空氣中約 4% 到 75% 都能燃燒'],[.32,'點火能量極低，靜電火花就可能引燃'],[.56,'火焰近乎無色，白天肉眼很難看見'],[.78,'但氫氣很輕，洩漏後會迅速向上散開']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,900,640,{title:'在空氣中的可燃範圍（體積比，示例）',x0:0,x1:80,y0:0,y1:3,xt:[0,20,40,60,80],yt:[],xl:'%',pt:70,pb:64,pl:200,gx:4,gy:0});
  [['氫氣',4,75,H2C,.04],['甲烷',5,15,'#7dc8dc',.18],['汽油蒸氣',1.4,7.6,'#ff9d7a',.3]].forEach(([n,a,b,col,t0],i)=>{
   const y=c.Y(2.5-i),h=64,k=ease(seg(u,t0,t0+.14));
   alphaDo(seg(u,t0,t0+.04),()=>wt(c.px-20,y+8,n,24,'rgba(227,236,238,.92)',700,'right'));
   if(k>0){const x0=c.X(a),x1=c.X(a+(b-a)*k);box(x0,y-h/2,Math.max(3,x1-x0),h,col);
    if(k>.9)wt(x1+12,y+8,trf('{a}–{b}%',{a:a,b:b}),26,'#fff',700,'left',COND);}});
  alphaDo(seg(u,.2,.26),()=>{wt(c.px+10,c.py+c.ph-8,'愈寬，愈容易遇到可燃混合',17,'#ff9d7a',700,'left');});
  const cards=[['點火能量',.32,()=>{wt(1032,300,'氫氣',20,H2C,700);box(1170,282,10,20,H2C);wt(1196,300,'約 0.02 mJ',26,'#fff',700,'left',COND);
     wt(1032,350,'甲烷',20,'#7dc8dc',700);box(1170,332,150,20,'#7dc8dc');wt(1334,350,'約 0.3 mJ',26,'#fff',700,'left',COND);}],
   ['密度',.56,()=>{wt(1032,470,'氫氣約為空氣的 1/14',24,EC,700);circ(1050,520,12,H2C);circ(1110,520,6,H2C);circ(1160,520,6,H2C);wt(1200,528,'洩漏後向上',18,'rgba(227,236,238,.88)',600);}],
   ['火焰',.78,()=>{wt(1032,630,'火焰淡藍、近乎無色',24,EC,700);wt(1032,672,'白天用肉眼難以察覺',18,'rgba(227,236,238,.88)',600);wt(1032,712,'需靠火焰偵測器',18,'#ff9d7a',700);}]];
  alphaDo(seg(u,.3,.35),()=>{card(1000,160,540,640,{bg:'rgba(7,27,39,.75)'});wt(1032,208,'三個關鍵特性',22,EC,700);});
  cards.forEach(([n,t0,fn],i)=>alphaDo(seg(u,t0,t0+.05),()=>{fn();}));
 }},

{t:'洩漏後往上跑',en:'A leak rises and disperses',dur:14,side:true,cam:u=>({x:740,y:400,s:1.55}),base:()=>{landSky(GY,{sun:SUN,clouds:false});drawGround();},
 d:'氫氣的擴散很快又比空氣輕，在戶外洩漏時，會像煙一樣直接向上、向外散開，濃度很快降到可燃下限以下。危險反而出現在有頂棚的地方：氫氣向上衝，碰到平整的屋頂就停在底下，愈積愈濃，可能超過 4% 而成為可燃混合氣。所以加氫站的頂棚要避免形成凹陷或死角，並在最高處留排氣口，讓氫氣順著它的浮力直接排到戶外。這是用物理特性做被動安全，不必靠任何設備動作。',
 s:[[0,'戶外洩漏的氫氣向上散開，濃度迅速下降'],[.3,'遇到平整的頂棚，氫氣被擋在屋頂下方'],[.5,'濃度累積，可能超過可燃下限 4%'],[.7,'屋頂最高處留排氣口，氫氣順著浮力排出']],
 draw(u){
  skyline(1150,5);road();
  const g=gyy(700),rt=g-210,LX=700;
  const closed=seg(u,.28,.34)*(1-seg(u,.62,.66));
  const vented=seg(u,.62,.68);
  const a2=seg(u,.28,.34);
  posts(400,1000);
  if(a2>0&&vented<=0)alphaDo(a2,()=>roof(400,1000,0));
  if(vented>0)roof(400,1000,vented*80);
  dispenser(LX);
  const N=26,R=rng(7);
  const H=520;
  for(let k=0;k<N;k++){const f=((TT*.3)+k/N)%1,x0=LX+(R()-.5)*30,dir=R()<.5?-1:1,rise=f*H;let x=x0+Math.sin(k*1.7+f*5)*26*f,y=g-100-rise,al=1-f*.7;
   if(a2>0.5&&u<.62){const cap=rt+18+(k%3)*7,Rc=g-100-cap;if(rise>Rc){y=cap;x=clamp(x0+dir*(rise-Rc)*.9,430,970);al=.9;}}
   else if(u>=.62){const cap=rt+18+(k%3)*7,Rc=g-100-cap;if(rise>Rc&&Math.abs(x0-LX)>0){x=lerp(x,LX+(x0-LX)*.3,seg(rise,Rc,Rc+50));}}
   const colA=u<.28?.85:.9;alphaDo(al*colA,()=>circ(x,y,u<.28?5.5-f*2:5,H2C));}
  /* 積聚的雲 */
  const cl=seg(u,.34,.55)*(1-seg(u,.64,.78));
  if(cl>0)alphaDo(cl*.55,()=>{const gr=ctx.createLinearGradient(0,rt,0,rt+110);gr.addColorStop(0,'rgba(232,87,42,.8)');gr.addColorStop(1,'rgba(232,87,42,0)');ctx.fillStyle=gr;ctx.fillRect(410,rt+18,580,110);});
  lab(LX,g-110,'加氫機',{dx:-40,dy:-60,a:band(u,0,.3)});
  lab(700,rt-20,'氫氣向上散開',{dx:260,dy:-130,st:'g',a:band(u,.02,.28)});
  lab(500,rt+50,'氫氣積在頂棚下',{dx:-30,dy:90,st:'w',a:band(u,.4,.62)});
  lab(700,rt-40,'頂部排氣口',{dx:200,dy:-100,st:'g',a:band(u,.7,1)});
 },
 hud(u){hudPanel(250,128,'頂棚下濃度（示例）',seg(u,.05,.1),w=>{
  const v=u<.62?lerp(0,6,ease(seg(u,.28,.58))):lerp(6,.3,ease(seg(u,.62,.8)));const col=v>=4?'#ff8a60':H2C;
  hrow(56,'氫氣濃度',trf('{n}%',{n:v.toFixed(1)}),w,col);hbar(14,68,w-28,v/8,col);hrow(106,'可燃下限','4%',w,EC);});}},

{t:'看不見的火焰',en:'The invisible flame',dur:13,side:true,cam:u=>({x:760,y:430,s:1.55}),base:()=>{landSky(GY,{sun:SUN,clouds:false});drawGround();},
 d:'萬一洩漏的氫氣被點燃，會形成噴射火焰。氫氣火焰顏色很淡，白天幾乎看不見，人可能走到火焰旁才發現，所以不能只靠眼睛。加氫站會在頂棚和設備周圍裝設火焰偵測器，利用紫外線或紅外線感測火焰才有的特殊輻射，而不是看可見光；有些場站也會搭配熱像儀。一旦偵測器動作，控制系統立刻發出警報、關閉氣源，把火焰的燃料切斷，讓火焰在短時間內熄滅。',
 s:[[0,'洩漏的氫氣被點燃，形成噴射火焰'],[.28,'火焰淡藍，白天肉眼幾乎看不見'],[.52,'紫外線或紅外線火焰偵測器看見了火焰'],[.76,'控制系統警報並切斷氣源，火焰熄滅']],
 draw(u){
  skyline(1200,5);road();
  const g=gyy(700),rt=g-210;
  posts(400,1000);roof(400,1000,80);dispenser(700);
  const lit=seg(u,.1,.16)*(1-seg(u,.78,.86));
  if(lit>0){const fl=Math.sin(TT*14)*6,P=[[722,g-92],[780+fl,g-120],[900,g-160+fl],[1010,g-178]];
   alphaDo(lit*.22,()=>{ctx.beginPath();ctx.moveTo(722,g-84);ctx.quadraticCurveTo(860,g-120,1010+fl,g-190);ctx.quadraticCurveTo(870,g-150,722,g-104);ctx.closePath();ctx.fillStyle='#bfe3ff';ctx.fill();});
   alphaDo(lit*.5,()=>{ctx.beginPath();ctx.moveTo(722,g-90);ctx.quadraticCurveTo(820,g-110,900+fl,g-150);ctx.quadraticCurveTo(820,g-125,722,g-100);ctx.closePath();ctx.fillStyle='rgba(120,170,255,.6)';ctx.fill();});}
  /* 肉眼 */
  const px=1130;person(px,g,'#e3e8ec',1.1);
  alphaDo(band(u,.2,.5),()=>{ring(px,g-100,20,'rgba(227,236,238,.5)',2);});
  /* 偵測器 */
  const dxp=940,dyp=rt+18;const on=seg(u,.5,.56)*(1-seg(u,.9,.97));
  box(dxp-12,dyp,24,26,'#2a3a46','rgba(0,0,0,.4)',1);circ(dxp,dyp+13,6,on>0?'#ff5030':'#556');
  if(on>0)alphaDo(on*.28,()=>{ctx.beginPath();ctx.moveTo(dxp,dyp+13);ctx.lineTo(720,g-60);ctx.lineTo(860,g-210);ctx.closePath();ctx.fillStyle='#f2c230';ctx.fill();});
  const al=seg(u,.6,.66)*(1-seg(u,.9,.97));
  if(al>0)alphaDo(al,()=>{tag(560,rt-52,'警報',{bg:'rgba(232,87,42,.95)',size:24});tag(650,rt-52,'切斷氣源',{bg:'rgba(232,87,42,.95)',size:24});});
  lab(860,g-150,'氫氣火焰',{dx:70,dy:-130,st:'w',a:band(u,.14,.5)});
  lab(px,g-100,'肉眼看不見',{dx:0,dy:-90,a:band(u,.24,.62)});
  lab(dxp,dyp+14,'火焰偵測器',{dx:90,dy:-80,st:'g',a:band(u,.5,1)});
 }},

{t:'偵測與緊急停機',en:'Detection and emergency shutdown',dur:14,
 d:'因為氫氣沒有顏色和氣味，加氫站要靠氣體偵測器「聞」。偵測器裝在最容易積氣的高處，例如頂棚下與機櫃上方。常見的設定是濃度達可燃下限（4%）的 10%，也就是 0.4% 時先發警報；達 25%，也就是 1% 時，控制系統自動關閉緊急截斷閥、停止壓縮機並啟動通風。整條鏈從偵測到動作只要幾秒，而且在濃度還遠低於可燃範圍時就開始處理。設定值依場站設計與法規而定。',
 s:[[0,'氫氣沒有氣味，要靠偵測器隨時監測'],[.32,'達可燃下限的 10%，先發出警報'],[.55,'達 25%，自動關閉緊急截斷閥並停機'],[.78,'啟動通風，把氫氣排出，在可燃範圍之前就處理']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,860,640,{title:'洩漏濃度與動作門檻（示例）',x0:0,x1:60,y0:0,y1:4.4,xt:[0,20,40,60],yt:[0,1,2,3,4],xl:'時間（秒）',yl:'氫氣濃度（%）',pt:70,pb:70,pl:84,gx:3,gy:4});
  const t=u*60,pk=seg(u,.02,.62);
  const conc=s=>s<=24?s*.05:s<=34?1.2+(s-24)*.02-0:1.2-(s-34)*.03;
  /* 曲線 */
  ctx.beginPath();let first=true;for(let s=0;s<=Math.min(t,60);s+=.5){const v=Math.max(0,s<=26?s*.0462:s<=36?1.2:Math.max(.05,1.2-(s-36)*.05));const x=c.X(s),y=c.Y(v);if(first){ctx.moveTo(x,y);first=false}else ctx.lineTo(x,y);}
  ctx.strokeStyle=H2C;ctx.lineWidth=4;ctx.stroke();
  [[4,'可燃下限 4%','#ff8a60',.06],[1,'停機 1%（25%）',EC,.12],[.4,'警報 0.4%（10%）','#7dc8dc',.18]].forEach(([v,n,col,t0])=>alphaDo(seg(u,t0,t0+.05),()=>{const y=c.Y(v);ctx.setLineDash([10,8]);ln([c.px,y,c.px+c.pw,y],col,2.5);ctx.setLineDash([]);wt(c.px+c.pw-8,y-10,n,18,col,700,'right');}));
  /* 流程 */
  card(960,160,580,640,{bg:'rgba(7,27,39,.75)'});wt(990,208,'偵測到停機的自動流程',22,EC,700);
  const st=[['氣體偵測器','感測頂棚下與機櫃上方',0,'#7dc8dc'],['警報','濃度達 0.4%（10% LFL）',.3,EC],['緊急截斷','濃度達 1%：關閥、停壓縮機',.52,'#ff8a60'],['通風排出','風扇啟動，氫氣排到戶外',.74,H2C]];
  st.forEach(([a,b,t0,col],i)=>{const y=260+i*128;alphaDo(seg(u,t0,t0+.06),()=>{tag(990,y,a,{bg:col,fg:'#0e2a3b',size:22});wt(990,y+48,b,18,'rgba(227,236,238,.9)',500);if(i<3)arrow(1010,y+62,1010,y+100,'rgba(227,236,238,.7)',2.5);});});
  alphaDo(seg(u,.55,.6),()=>wt(c.X(30),c.Y(3.2),'從偵測到動作僅數秒',20,'#fff',700,'center'));
 }},

{t:'耐氫材料與壓力釋放',en:'Hydrogen-tolerant materials and pressure relief',dur:13,
 d:'氫氣的另一個風險來自壓力。加氫站與車輛的氫氣壓力高達 350 到 700 巴，而且氫原子會鑽進金屬，造成氫脆，所以管路與零件要選用耐氫的材料，例如沃斯田鐵不鏽鋼 316L。車用氣瓶常是 IV 型：塑膠內襯負責氣密，外面包碳纖維承受壓力，不會有氫脆問題。氣瓶還有熱啟動洩壓裝置，遇到火災、溫度升高到約 110°C 時打開，把氫氣朝安全方向排出，避免氣瓶因受熱而破裂。',
 s:[[0,'350 到 700 巴的氫氣，管路零件要選耐氫的材料'],[.3,'車用氣瓶以塑膠內襯加碳纖維，沒有氫脆問題'],[.58,'遇到火災，熱啟動洩壓裝置在約 110°C 打開'],[.82,'氫氣朝安全方向排出，避免氣瓶爆裂']],
 draw(u){
  diagBG();
  const col=(x,t0,title)=>alphaDo(seg(u,t0,t0+.06),()=>{card(x,160,480,640,{bg:'rgba(7,27,39,.75)'});wt(x+24,208,title,22,EC,700);});
  col(60,0,'耐氫的管路材料');col(560,.28,'IV 型複合材料氣瓶');col(1060,.54,'熱啟動洩壓裝置');
  /* 左：鋼材晶格 */
  alphaDo(seg(u,.04,.1),()=>{box(100,300,400,120,'rgba(141,152,159,.7)');for(let i=0;i<9;i++)for(let j=0;j<3;j++)circ(126+i*42,328+j*34,6,'rgba(220,226,230,.9)');
   wt(300,288,'一般鋼材',16,'rgba(227,236,238,.85)',600,'center');
   for(let k=0;k<6;k++){const f=((TT*.3)+k/6)%1;alphaDo(1-f*.3,()=>circ(120+k*64,lerp(470,370,f),5,H2C));}
   wt(300,500,'氫原子鑽入 → 變脆',18,'#ff9d7a',700,'center');});
  alphaDo(seg(u,.12,.18),()=>{wt(100,620,'選用 316L 不鏽鋼',24,H2C,700);wt(100,660,'組織較不易受氫影響',18,'rgba(227,236,238,.9)',500);wt(100,700,'並限制硬度與焊接品質',18,'rgba(227,236,238,.9)',500);});
  /* 中：氣瓶 */
  alphaDo(seg(u,.32,.38),()=>{const x=610,y=300,w=380,h=180;rrp(x,y,w,h,90);ctx.fillStyle='#10354a';ctx.fill();
   rrp(x,y,w,h,90);ctx.strokeStyle='#2a2f34';ctx.lineWidth=18;ctx.stroke();rrp(x,y,w,h,90);ctx.strokeStyle='rgba(60,70,78,.9)';ctx.lineWidth=14;ctx.stroke();
   rrp(x+16,y+16,w-32,h-32,74);ctx.strokeStyle='#dfe5e8';ctx.lineWidth=6;ctx.stroke();
   for(let i=0;i<7;i++)ln([x+40+i*50,y+4,x+70+i*50,y+h-4],'rgba(255,255,255,.1)',2);
   for(let k=0;k<7;k++){const f=((TT*.4)+k/7)%1;circ(x+90+(k*47)%220,y+90+Math.sin(k*2+TT*2)*34*f,4,H2C);}
   wt(x+w/2,y+h/2+8,'H₂',34,'#fff',700,'center',COND);
   lab(x+w-30,y+14,'碳纖維層',{dx:20,dy:-60,st:'s',a:band(u,.36,.8),minor:true});lab(x+30,y+h-30,'塑膠內襯',{dx:-10,dy:70,a:band(u,.4,.8),minor:true});});
  alphaDo(seg(u,.4,.46),()=>{wt(610,620,'內襯氣密、碳纖維承壓',24,H2C,700);wt(610,660,'不會氫脆，重量輕',18,'rgba(227,236,238,.9)',500);});
  /* 右：洩壓 */
  const T=lerp(25,120,ease(seg(u,.54,.78)));const open=T>=110;
  alphaDo(seg(u,.56,.62),()=>{const x=1100,y=300;rrp(x,y+60,400,120,60);ctx.fillStyle='#10354a';ctx.fill();rrp(x,y+60,400,120,60);ctx.strokeStyle='#3a434a';ctx.lineWidth=12;ctx.stroke();
   box(x+176,y+30,48,40,'#aeb8be','rgba(0,0,0,.4)',1);circ(x+200,y+22,10,open?'#ff5030':'#f2c230');
   if(open)for(let k=0;k<5;k++){const f=((TT*.6)+k/5)%1;alphaDo(1-f,()=>circ(x+200+Math.sin(k*3)*14*f,y+10-f*130,6-f*3,H2C));}
   const fk=seg(u,.58,.7);if(fk>0)for(let i=0;i<5;i++){const fx=x+60+i*70,fh=26+Math.sin(TT*10+i)*8;alphaDo(fk*.7,()=>poly([fx-18,y+182,fx,y+182-fh*1.6,fx+18,y+182],'#ff8a3a'));}
   wt(x+200,y+235,'火災升溫',18,'#ff9d7a',700,'center');});
  alphaDo(seg(u,.6,.66),()=>{wt(1090,620,'約 110°C 時打開',24,H2C,700);wt(1090,660,'朝安全方向排放氫氣',18,'rgba(227,236,238,.9)',500);
   wt(1090,740,trf('瓶溫 {n}°C',{n:Math.round(T)}),30,open?'#ff8a60':EC,700,'left',COND);});
 }},

{t:'層層防護',en:'Layers of protection',dur:13,
 d:'氫氣安全沒有單一的神奇裝置，而是一層疊一層的防護：先靠材料、焊接與壓力設計，讓氫氣不容易漏；再靠安全距離、開放式通風與頂部排氣，讓漏出的氫氣不會積聚；第三層是氣體與火焰偵測，早一步發現；第四層是緊急截斷與洩壓，阻止事故擴大；最後還有人員訓練與演練。台灣第一批加氫站也依這套邏輯進行查驗，中油楠梓加氫站在 2025 年 12 月啟用前，由 TÜV SÜD 依 ISO 19880-1 完成安全性與功能性測試，場內也設有緊急開關。',
 s:[[0,'第一層：材料與設計，讓氫氣不容易漏'],[.25,'第二層：通風與排氣，漏出的氫氣不積聚'],[.5,'第三層：偵測；第四層：緊急截斷與洩壓'],[.76,'台灣加氫站依 ISO 19880-1 完成安全測試']],
 draw(u){
  diagBG();
  const L=[['1','預防洩漏','耐氫材料、焊接品質、壓力設計',.02,'#7dc8dc'],['2','不讓氫氣積聚','安全距離、開放通風、頂部排氣',.2,H2C],['3','及早發現','氣體偵測器、火焰偵測器',.4,EC],['4','阻止擴大','緊急截斷、洩壓、緊急開關',.56,'#ff8a60'],['5','人與管理','訓練、演練、定期檢查與維護',.7,'#b37cff']];
  L.forEach(([n,a,b,t0,col],i)=>alphaDo(seg(u,t0,t0+.07),()=>{const y=170+i*122,x=60+i*26;card(x,y,760-i*26,106,{bg:'rgba(7,27,39,.75)'});box(x,y,10,106,col);
   circ(x+54,y+53,26,col);wt(x+54,y+63,n,30,'#0e2a3b',800,'center',COND);wt(x+100,y+44,a,24,col,700);wt(x+100,y+80,b,17,'rgba(227,236,238,.9)',500);}));
  alphaDo(seg(u,.74,.8),()=>{card(900,170,640,620,{bg:'rgba(7,27,39,.75)'});wt(930,218,'台灣：第一批加氫站',22,EC,700);
   [['2025 年 12 月','中油楠梓加氫站啟用'],['ISO 19880-1','TÜV SÜD 完成安全性與功能性測試'],['350 / 700 bar','兩種壓力的加氫設備'],['緊急開關','站內設有防災設備與緊急開關']].forEach(([a,b],i)=>alphaDo(seg(u,.76+i*.04,.82+i*.04),()=>{const y=310+i*118;wt(930,y,a,i==1?28:30,i?H2C:EC,700,'left',COND);wt(930,y+36,b,18,'rgba(227,236,238,.88)',500);}));});
 }}
]};
