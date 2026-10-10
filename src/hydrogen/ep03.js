// KITS: land
/* 氫能系列 第 3 集：氫氣的儲存與運輸 */
const gyy=x=>groundY(x);
const SUN={x:1180,y:120};
const H2C='#7dffc4',O2C='#b37cff',WC='#58b8d0',EC='#f2c230',HC='#ff8a60',GRY='rgba(141,152,159,.55)';
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1,p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
function pl(P,col,lw){const a=[];P.forEach(p=>a.push(p[0],p[1]));ln(a,col,lw);}
function road(){ctx.beginPath();for(let x=-400;x<=2000;x+=20)ctx.lineTo(x,gyy(x)-2);for(let x=2000;x>=-400;x-=20)ctx.lineTo(x,gyy(x)+16);ctx.closePath();ctx.fillStyle='#3d4448';ctx.fill();
  ctx.setLineDash([26,22]);ctx.beginPath();for(let x=-400;x<=2000;x+=20)ctx.lineTo(x,gyy(x)+8);ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);}
function skyline(x0,n){const R=rng(33);for(let i=0;i<n;i++){const x=x0+i*72+R()*20,h=60+R()*110,w=46+R()*24;box(x,gyy(x)-h-2,w,h,'rgba(120,140,150,.35)');}}

/* 長管拖車：x 為車頭前緣 */
function tubeTrailer(x){const g=gyy(x);
  box(x-440,g-26,372,10,'#4a545b');
  for(let i=0;i<3;i++){rrp(x-430,g-128+i*34,350,28,14);ctx.fillStyle='#dfe5e8';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();
    ln([x-420,g-114+i*34,x-90,g-114+i*34],'rgba(31,127,153,.35)',2);}
  box(x-82,g-128,12,112,'#8d989f');
  poly([x-66,g-26,x-66,g-76,x-24,g-80,x-2,g-52,x,g-26],'#1f7f99','rgba(0,0,0,.3)',1);box(x-40,g-72,22,20,'#2a3a46');box(x-66,g-30,68,8,'#2b3137');
  for(const wx of [-380,-340,-300,-30]){circ(x+wx,g-14,14,'#1d2226');circ(x+wx,g-14,6,'#aeb8be');}
  return [x-250,g-128];}
/* 面向左的燃料電池車：x 為車中心 */
function carL(x){const g=gyy(x);ctx.save();ctx.translate(x,g);ctx.scale(-1,1);
  poly([-140,-26,-142,-50,-122,-62,-74,-67,-42,-98,38,-100,82,-68,128,-60,142,-44,140,-26],'#dfe6ea','rgba(0,0,0,.35)',1.2);
  poly([-62,-69,-36,-93,-2,-94,-2,-69],'#2a3a46');poly([4,-69,4,-94,34,-93,70,-69],'#2a3a46');
  ln([-138,-40,138,-40],'rgba(31,127,153,.7)',2);
  for(const wx of [-90,90]){circ(wx,-20,20,'#1d2226');circ(wx,-20,9,'#aeb8be');}
  ctx.restore();}
function compressor(x){const g=gyy(x+60);box(x,g-112,120,112,'#e3e8ec','rgba(0,0,0,.3)',1);box(x,g-112,120,12,'#1f7f99');
  circ(x+36,g-56,22,'#c9d1d6','rgba(0,0,0,.3)',1);const a=TT*3;ln([x+36,g-56,x+36+Math.cos(a)*16,g-56+Math.sin(a)*16],'#4a545b',3);
  box(x+70,g-90,36,60,'#e3d27a','rgba(0,0,0,.3)',1);}
function vessels(x,n){const g=gyy(x);for(let i=0;i<n;i++){rrp(x+i*46,g-160,38,156,17);ctx.fillStyle='#dfe5e8';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();}}
function dispenser(x){const g=gyy(x);box(x-22,g-96,44,96,'#f4f6f7','rgba(0,0,0,.3)',1);box(x-16,g-86,32,20,'#2a3a46');box(x-22,g-110,44,14,'#1f7f99');wt(x,g-99,'H₂',11,'#fff',700,'center',COND);}
function canopy(x0,x1){const g=gyy(x0);box(x0,g-210,x1-x0,16,'#e3e8ec','rgba(0,0,0,.25)',1);box(x0,g-196,x1-x0,6,'#1f7f99');box(x0+20,g-194,12,194,'#aeb8be');box(x1-32,g-194,12,194,'#aeb8be');}

/* 管線場景 */
const PX0=230,PX1=1560,PJ=1000;
const pipeAt=x=>gyy(x)+54;
function pipePts(a,b){const P=[];for(let x=a;x<=b;x+=65)P.push([x,pipeAt(x)]);P.push([b,pipeAt(b)]);return P;}
function plant(x){const g=gyy(x);box(x,g-120,150,120,'#cfd8dc','rgba(0,0,0,.25)',1);box(x,g-132,150,12,'#aeb8be');
  rrp(x+20,g-190,40,70,18);ctx.fillStyle='#dfe5e8';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();
  rrp(x+80,g-170,40,50,18);ctx.fillStyle='#dfe5e8';ctx.fill();ctx.stroke();box(x+60,g-60,34,60,'#2a3a46');}
function factory(x){const g=gyy(x);box(x,g-130,170,130,'#c9ccd0','rgba(0,0,0,.25)',1);box(x+20,g-230,26,100,'#8d989f');box(x+66,g-200,26,70,'#8d989f');
  for(let i=0;i<4;i++)box(x+16+i*38,g-100,24,30,'#2a3a46');}
function house(x,w){const g=gyy(x);box(x,g-70,w,70,'#d8cfc0','rgba(0,0,0,.25)',1);poly([x-8,g-70,x+w/2,g-112,x+w+8,g-70],'#a8553a');box(x+w/2-10,g-40,20,40,'#6a5a48');}
function stationPipe(x){const g=gyy(x);box(x,g-84,110,84,'#e3e8ec','rgba(0,0,0,.3)',1);box(x,g-84,110,10,'#1f7f99');circ(x+34,g-42,18,'#c9d1d6','rgba(0,0,0,.3)',1);box(x+62,g-66,34,50,'#e3d27a','rgba(0,0,0,.3)',1);}

const EP={no:3,slug:'hydrogen',seriesName:'氫能系列',t:'氫氣的儲存與運輸',en:'Hydrogen storage and transport',
lede:'氫氣很輕，常壓下 1 公斤要占約 11 立方公尺，要運得動，必須先把它壓縮、冷卻，或換成別的分子。這一集比較高壓氣態、液氫、氨與有機液態載體、管線四種做法，看各自把氫「裝」進多少、要付出多少能量，以及它們適合什麼距離與用量。',
facts:[['約 11','m³','常壓下 1 kg 氫氣的體積（密度約 0.09 kg/m³）'],
['40','kg/m³','700 bar 高壓氣態氫的密度；350 bar 約 24 kg/m³'],
['−253','°C','氫氣液化的溫度，液氫密度約 71 kg/m³'],
['約 30','%','液化耗電約相當於氫氣所含能量的比例（示例）'],
['17.6','wt%','氨的含氫重量比，液氨每立方公尺約含 121 kg 氫'],
['20','%','天然氣管線摻氫研究常用的體積比上限']],
note:'說明：本集為教育用途示意動畫，設備外觀與比例經過調整。體積密度（700 bar 約 40、液氫約 71、液氨約 121、二苄基甲苯約 57 kg H₂/m³）與液化耗電約 30%、壓縮耗電約 10–15%、氨含氫 17.6 wt%、二苄基甲苯含氫 6.2 wt% 為美國能源部（DOE）與文獻常見的典型範例；管線摻氫 20% 為歐洲 HyDeploy 等示範計畫採用的上限，是否可行取決於管材與終端設備；各種運輸方式的適用距離與運量為示意，實際依成本與法規而定。中油楠梓加氫站與聯華林德樹谷示範站於 2025 年 12 月啟用，設有 350 bar 與 700 bar 加氫設備，資料取自新聞報導。',
base:()=>{landSky(GY,{sun:SUN,clouds:true});drawGround();},
shots:[
{t:'為什麼氫氣難運',en:'Why hydrogen is hard to move',dur:13,
 d:'氫是最輕的氣體，常壓下每立方公尺只有約 0.09 公斤，1 公斤氫氣要占約 11 立方公尺，裝不滿一輛卡車。所以運輸前要先提高「體積密度」：壓縮到 350 或 700 巴，密度升到約 24 與 40 公斤每立方公尺；冷卻到零下 253°C 變成液氫，約 71；轉成液氨或有機液態載體，則可到 57 到 121。代價是能量：壓縮到 700 巴大約要用掉氫能量的一成多，液化約三成，而且每一種載體到終點都還要把氫取回來。',
 s:[[0,'常壓下 1 公斤氫氣要占約 11 立方公尺'],[.3,'壓縮、液化或轉成載體，才能把氫裝得更密'],[.6,'液氨每立方公尺含氫，比液氫還多'],[.82,'裝得愈密，要付出的能量愈多']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,900,640,{title:'每立方公尺能裝多少氫（示例）',x0:0,x1:130,y0:0,y1:6,xt:[0,40,80,120],yt:[],xl:'kg H₂/m³',pt:70,pb:64,pl:230,gx:5,gy:0});
  const B=[['常壓氣態','25°C、1 bar',.09,'rgba(227,236,238,.7)',.04],['高壓氣態','350 bar',24,'#7dc8dc',.14],['高壓氣態','700 bar',40,'#58b8d0',.24],
   ['液氫','−253°C',71,'#b37cff',.4],['有機液態載體','二苄基甲苯',57,EC,.52],['液氨','−33°C 或約 10 bar',121,HC,.6]];
  B.forEach(([n,s,v,col,t0],i)=>{const y=c.Y(5.5-i),h=60,k=ease(seg(u,t0,t0+.12));if(k<=0)return;
   alphaDo(seg(u,t0,t0+.04),()=>{wt(c.px-20,y-4,n,21,'rgba(227,236,238,.92)',700,'right');wt(c.px-20,y+20,s,15,'rgba(227,236,238,.75)',500,'right');});
   box(c.px,y-h/2,Math.max(2,c.X(v*k)-c.px),h,col);
   if(k>.9)wt(c.X(v)+12,y+8,v<1?'0.09':String(v),24,'#fff',700,'left',COND);});
  alphaDo(seg(u,.06,.12),()=>{wt(c.px+170,c.Y(5.5)+34,'1 kg 約占 11 m³',17,'#ff9d7a',700,'left');});
  alphaDo(seg(u,.66,.72),()=>{card(1000,160,540,640,{bg:'rgba(7,27,39,.75)'});wt(1032,208,'裝得愈密，代價愈高',22,EC,700);
   const rows=[['壓縮到 700 bar','約 10–15%',.7],['液化到 −253°C','約 30%',.76],['合成氨、再裂解','需高溫與觸媒',.82],['氫化、再脫氫','需加熱釋氫',.88]];
   rows.forEach(([a,b,t0],i)=>alphaDo(seg(u,t0,t0+.05),()=>{const y=300+i*120;wt(1032,y,a,20,'#fff',700);wt(1032,y+40,b,i<2?28:20,i<2?HC:'rgba(227,236,238,.85)',700,'left',i<2?COND:undefined);}));
   wt(1032,770,'數字為占氫能量的比例（示例）',16,'rgba(227,236,238,.7)',500);});
 }},

{t:'長管拖車與加氫站',en:'Tube trailers and refuelling',dur:13,side:true,
 d:'短距離、用量不大時，最常見的做法是用長管拖車運高壓氫氣。拖車上固定著一束鋼製或複合材料的長管，裝著約 200 到 500 巴的氫氣，開到加氫站卸給壓縮機。壓縮機把氫氣升壓，先存在站內的儲氣瓶組，車輛來加氫時再從瓶組一路送到加氫機，用 350 或 700 巴灌進氣瓶。拖車的好處是彈性高、不必鋪管；缺點是一車能載的氫有限，距離一遠，運費就快速上升。',
 s:[[0,'長管拖車載著高壓氫氣開進加氫站'],[.24,'接上管線，氫氣送進壓縮機升壓'],[.5,'升壓後的氫氣先存進站內儲氣瓶組'],[.74,'燃料電池車進站，以 350 或 700 巴加氫']],
 draw(u){
  skyline(900,8);road();
  const g=gyy(600),tx=lerp(-60,520,easeOut(seg(u,0,.22)));
  canopy(1180,1500);compressor(600);vessels(780,3);dispenser(1330);
  const P1=[[tx-250,g-128],[tx-250,g-170],[650,g-170],[650,g-112]],P2=[[720,g-60],[780,g-60]],P3=[[900,g-30],[1330,g-30],[1330,g-60]];
  pl(P2,'#8d989f',5);pl(P3,'#8d989f',5);
  const tr1=tubeTrailer(tx);
  const a1=seg(u,.22,.28);
  if(a1>0){pl([[520-250,g-128],[270,g-170],[650,g-170],[650,g-112]],'#4a545b',5);}
  flowDots([[270,g-170],[650,g-170],[650,g-112]],6,H2C,seg(u,.26,.32),.45,3.6);
  flowDots(P2,3,H2C,seg(u,.4,.46),.6,3.6);
  flowDots(P3,5,H2C,seg(u,.7,.76),.5,3.6);
  const cx=lerp(1900,1130,easeOut(seg(u,.56,.74)));
  if(u>.5)carL(cx);
  const hk=seg(u,.74,.8);if(hk>0){const pp=[cx+126,gyy(cx)-50];ctx.beginPath();ctx.moveTo(1330,g-60);ctx.quadraticCurveTo((1330+pp[0])/2,g-20,pp[0],pp[1]);ctx.strokeStyle='#1d2226';ctx.lineWidth=4;ctx.stroke();}
  lab(520-250,g-100,'長管拖車',{dx:-30,dy:-140,st:'s',a:band(u,.04,.5)});
  lab(660,g-112,'壓縮機',{dx:0,dy:-130,st:'s',a:band(u,.26,.7)});
  lab(826,g-160,'儲氣瓶組',{dx:20,dy:-110,a:band(u,.46,1)});
  lab(1330,g-110,'加氫機',{dx:-20,dy:-90,st:'g',a:band(u,.7,1)});
 },
 hud(u){hudPanel(250,160,'壓力（示例）',seg(u,.05,.1),w=>{const k=seg(u,.24,.5),m=seg(u,.7,.95);
  hrow(56,'拖車管束','約 200–500 bar',w,'#7dc8dc');hrow(88,'壓縮機出口',u>.26?'升壓中':'待命',w,EC);hrow(120,'儲氣瓶組',u>.5?'約 900 bar':'充氣中',w,H2C);hrow(150,'加氫',u>.74?'350 / 700 bar':'待命',w,'#fff');});}},

{t:'液氫與絕熱儲槽',en:'Liquid hydrogen and cryogenic tanks',dur:13,
 d:'把氫氣冷卻到零下 253°C 就會變成液體，密度約每立方公尺 71 公斤，比 700 巴高壓氣體還高，運量大，運輸時槽內壓力也低。代價是液化要消耗相當於氫能量約三成的電力，儲槽也必須像超大型的保溫瓶：內外兩層容器之間抽成真空，再包上多層反射絕熱材料，擋住外界的熱。熱仍會一點一滴漏進去，讓少量液氫蒸發，所以槽頂要有排氣或回收的設計，長時間存放必須管理這些蒸發氣。',
 s:[[0,'冷卻到零下 253°C，氫氣變成液體'],[.28,'內外兩層容器之間抽成真空，像超大保溫瓶'],[.54,'多層反射材料擋住外界的熱'],[.78,'仍有少量熱漏入，液氫緩慢蒸發需要排氣或回收']],
 draw(u){
  diagBG();
  card(60,160,780,640,{bg:'rgba(7,27,39,.75)'});wt(84,204,'液氫儲槽剖面（示意）',22,EC,700);
  const ox=110,oy=290,ow=680,oh=340;
  rrp(ox,oy,ow,oh,150);ctx.fillStyle='#aeb8be';ctx.fill();
  rrp(ox+14,oy+14,ow-28,oh-28,136);ctx.fillStyle='rgba(14,42,59,.95)';ctx.fill();
  alphaDo(seg(u,.28,.36),()=>{rrp(ox+14,oy+14,ow-28,oh-28,136);ctx.fillStyle='rgba(125,200,220,.16)';ctx.fill();
   for(let i=0;i<5;i++){rrp(ox+22+i*5,oy+22+i*5,ow-44-i*10,oh-44-i*10,128-i*5);ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1.4;ctx.stroke();}});
  const ix=ox+70,iy=oy+70,iw=ow-140,ih=oh-140;
  rrp(ix,iy,iw,ih,100);ctx.fillStyle='#e3e8ec';ctx.fill();
  rrp(ix+8,iy+8,iw-16,ih-16,92);ctx.fillStyle='#10354a';ctx.fill();
  ctx.save();rrp(ix+8,iy+8,iw-16,ih-16,92);ctx.clip();
  const lv=iy+ih*.38;ctx.beginPath();ctx.moveTo(ix,iy+ih);for(let x=ix;x<=ix+iw;x+=10)ctx.lineTo(x,lv+Math.sin(x*.03+TT*2)*3);ctx.lineTo(ix+iw,iy+ih);ctx.closePath();
  const gr=ctx.createLinearGradient(0,lv,0,iy+ih);gr.addColorStop(0,'rgba(179,124,255,.85)');gr.addColorStop(1,'rgba(110,70,190,.9)');ctx.fillStyle=gr;ctx.fill();
  const a4=seg(u,.78,.84);
  if(a4>0)for(let k=0;k<6;k++){const f=((TT*.35)+k/6)%1,bx=ix+120+k*70,by=lerp(iy+ih-30,lv-6,f);alphaDo(a4*(1-f*.3),()=>circ(bx,by,4+f*3,'rgba(255,255,255,.7)'));}
  ctx.restore();
  wt(ix+iw/2,lv+70,'液氫',30,'#fff',700,'center');
  /* 外界熱 */
  const hh=seg(u,.54,.62);
  if(hh>0)for(let k=0;k<6;k++){const bx=ox+110+k*100,f=((TT*.5)+k/6)%1,yy=oy-34+f*26;alphaDo(hh*(1-f*.6),()=>arrow(bx,yy,bx,yy+22,'#ff8a60',3));}
  alphaDo(seg(u,.54,.6),()=>wt(ox+110,oy-50,'外界熱量',18,'#ff9d7a',700,'left'));
  if(a4>0){const f=(TT*.4)%1;ln([ox+ow-150,oy+14,ox+ow-150,oy-40,ox+ow-60,oy-40],'#c9d1d6',3);for(let k=0;k<3;k++){const q=((TT*.5)+k/3)%1;alphaDo(a4*(1-q),()=>circ(ox+ow-150+q*90,oy-40,4,'rgba(255,255,255,.7)'));}}
  lab(ox+ow-100,oy-40,'排氣與回收',{dx:60,dy:-20,st:'w',a:band(u,.78,1)});
  alphaDo(band(u,.24,1),()=>wt(ox+ow-20,oy+oh+40,'外層容器',17,'rgba(227,236,238,.9)',600,'right'));
  alphaDo(band(u,.26,1),()=>wt(ox+20,oy+oh+40,'真空夾層與多層絕熱',17,EC,700,'left'));
  alphaDo(band(u,.06,1),()=>wt(ix+iw/2,iy+52,'內層容器',17,'rgba(227,236,238,.9)',600,'center'));
  /* 溫度階梯 */
  card(880,160,660,640,{bg:'rgba(7,27,39,.75)'});wt(904,204,'有多冷（°C）',22,EC,700);
  const sx=1010,sy0=260,sy1=740,Y=t=>lerp(sy0,sy1,(25-t)/298);
  box(sx-10,sy0,20,sy1-sy0,'rgba(255,255,255,.12)');
  const kk=ease(seg(u,.02,.3));box(sx-10,Y(25),20,(sy1-Y(25))*0+ (Y(-253)-Y(25))*kk,'#7dc8dc');
  [[25,'室溫',.02,'#fff'],[-196,'液態氮',.12,'#7dc8dc'],[-253,'液氫（約 20 K）',.24,'#b37cff'],[-273,'絕對零度',.32,'rgba(227,236,238,.7)']].forEach(([t,n,t0,col])=>{
   alphaDo(seg(u,t0,t0+.05),()=>{const y=Y(t);circ(sx,y,9,col);wt(sx+34,y+8,String(t).replace('-','−'),32,col,700,'left',COND);wt(sx+160,y+8,n,19,'rgba(227,236,238,.9)',600);});});
  alphaDo(seg(u,.36,.42),()=>{tag(1100,Y(-100)+10,'液化耗電約 30%',{bg:'rgba(255,138,96,.9)',size:19});});
 }},

{t:'氨與有機液態載體',en:'Ammonia and liquid organic carriers',dur:13,
 d:'長途、跨洋運氫時，常把氫「寄放」在別的分子裡。氨由氫和氮合成，每個分子含三個氫，液態氨在零下 33°C 常壓或常溫約 10 巴就能儲存，現成的肥料產業已有船舶、港口與管理經驗，但氨有毒，到終點要高溫裂解才能取回氫，或直接當燃料。有機液態載體（LOHC）例如二苄基甲苯，與氫反應後變成常溫常壓的液體，可以用現有的油品槽車運輸，含氫約 6.2 重量百分比，到終點再加熱脫氫，載體可回收重複使用。',
 s:[[0,'氫和氮合成氨，液氨用現有肥料產業設施運輸'],[.3,'氨有毒，到終點要裂解才能取回氫'],[.52,'有機載體吸收氫，變成常溫常壓的液體'],[.78,'到終點加熱脫氫，載體回收重複使用']],
 draw(u){
  diagBG();
  const rowS=(y,col,title,steps,t0,facts,t1)=>{
   alphaDo(seg(u,t0,t0+.05),()=>{card(60,y,1480,300,{bg:'rgba(7,27,39,.75)'});box(60,y,8,300,col);wt(96,y+46,title,24,col,700);});
   let xx=96;steps.forEach(([t,bg,sub],i)=>{const w=wtw(t,20,700)+24.2,a=seg(u,t0+.04+i*.05,t0+.09+i*.05);
    alphaDo(a,()=>{tag(xx,y+130,t,{bg,size:20});wt(xx,y+178,sub,16,'rgba(227,236,238,.82)',500);if(i<steps.length-1)arrow(xx+w+6,y+130,xx+w+42,y+130,'rgba(227,236,238,.8)',2.5);});xx+=w+Math.max(56,wtw(sub,16,500)-w+14);});
   alphaDo(seg(u,t1,t1+.06),()=>{let fx=96;facts.forEach(([t,bg])=>{const w=tag(fx,y+250,t,{bg,size:18,fg:'#0e2a3b'});fx+=w+16;});});};
  rowS(160,HC,'液氨（NH₃）',[['氫 + 氮','#7dffc4','電解氫加空氣中的氮'],['合成氨','#e3d27a','高溫高壓、觸媒'],['液氨運輸','#ff9d7a','−33°C 或約 10 bar'],['裂解','#e3d27a','高溫取回氫']],.02,[['含氫 17.6 wt%','#ff9d7a'],['液態含氫約 121 kg/m³','#ff9d7a'],['有毒，需嚴格管理','rgba(255,138,96,.9)']],.28);
  rowS(490,EC,'有機液態載體（LOHC）',[['氫 + 載體','#7dffc4','如二苄基甲苯'],['氫化','#e3d27a','加氫反應、放熱'],['常溫常壓運輸','#f2c230','可用油品槽車'],['脫氫','#e3d27a','加熱釋氫、載體回收']],.46,[['含氫 6.2 wt%','#f2c230'],['液態含氫約 57 kg/m³','#f2c230'],['載體可重複使用','#7dffc4']],.72);
 }},

{t:'管線輸氫與摻氫',en:'Pipelines and blending',dur:14,side:true,
 d:'量大又固定的地方，管線最省錢：氫氣從工廠經壓縮機站加壓，沿著埋在地下的專用鋼管送到工廠與用戶。專用氫氣管線要選用強度與韌性合適的鋼材，因為氫原子會鑽進鋼的晶格，讓材料變脆，稱為氫脆。另一條路是利用現成的天然氣管線，把氫以體積比最多約 20% 摻進天然氣一起輸送，歐洲的示範計畫已讓居民用這種混合氣煮飯，但混合比例愈高，管材、計量與燃燒設備要改的就愈多。',
 s:[[0,'氫氣在工廠加壓，進入埋在地下的專用管線'],[.3,'沿途由壓縮機站補壓，送到遠處的用戶'],[.52,'氫原子會鑽進鋼的晶格，造成氫脆，管材要特別選用'],[.76,'也可摻入現成的天然氣管線，比例研究上限約 20%']],
 draw(u){
  skyline(1100,6);plant(110);stationPipe(660);factory(1260);house(1470,60);house(1555,50);
  const P=pipePts(PX0,PX1);
  pl([[PX0,gyy(PX0)-30],[PX0,pipeAt(PX0)]],'#8d989f',8);
  pl(P,'#6a747a',12);pl(P,'#aeb8be',6);
  pl([[715,gyy(715)-30],[715,pipeAt(715)]],'#8d989f',8);
  /* 摻氫分支 */
  const bl=seg(u,.72,.9),blend=lerp(0,.2,ease(bl));
  const NG=[[1640,pipeAt(1640)+10],[PJ+60,pipeAt(PJ)+10],[PJ,pipeAt(PJ)]];
  alphaDo(seg(u,.68,.74),()=>{pl(NG,'#c96a4a',8);wt(1360,pipeAt(1360)+54,'天然氣管線',18,HC,700,'center');});
  pl([[PX1-50,pipeAt(PX1)],[PX1-50,gyy(PX1)-10]],'#8d989f',7);
  /* 流動 */
  const up=pipePts(PX0,PJ);
  flowDots(P.slice(0,P.findIndex(p=>p[0]>PJ)),7,H2C,seg(u,.02,.08),.3,5.5);
  if(u<.68)flowDots(pipePts(PJ,PX1),6,H2C,seg(u,.02,.08),.3,4.2);
  else{const dn=pipePts(PJ,PX1),n=10;for(let k=0;k<n;k++){const f=((TT*.3)+k/n)%1,p=ptAt(dn,f);alphaDo(seg(u,.68,.74),()=>circ(p[0],p[1],4.2,k<Math.max(1,Math.round(blend*10))?H2C:HC));}}
  /* 氫脆放大 */
  const hz=seg(u,.5,.58);
  if(hz>0)alphaDo(hz*(u>.7?1-seg(u,.7,.74):1),()=>{const x0=70,y0=175,w=400,h=205;card(x0,y0,w,h,{bg:'rgba(7,27,39,.9)'});wt(x0+16,y0+30,'管壁放大（示意）',17,EC,700);
   box(x0+20,y0+80,w-40,60,'rgba(141,152,159,.8)');
   for(let i=0;i<10;i++)for(let j=0;j<3;j++)circ(x0+40+i*36,y0+96+j*20,5,'rgba(220,226,230,.9)');
   wt(x0+w/2,y0+72,'鋼',14,'#fff',600,'center');
   for(let k=0;k<7;k++){const f=((TT*.28)+k/7)%1,hx=x0+34+k*52,hy=lerp(y0+175,y0+100,f);alphaDo(1-f*.3,()=>circ(hx,hy,5,H2C));}
   wt(x0+w/2,y0+192,'氫原子鑽進晶格 → 氫脆',17,'#ff9d7a',700,'center');});
  lab(185,gyy(185)-120,'氫氣工廠',{dx:10,dy:-80,st:'g',a:band(u,.02,.3)});
  lab(715,gyy(715)-84,'壓縮機站',{dx:0,dy:-110,st:'s',a:band(u,.26,.5)});
  lab(560,pipeAt(560)+4,'專用氫氣管線',{dx:0,dy:60,st:'s',a:band(u,.04,.5),minor:true});
  lab(1345,gyy(1345)-130,'工業用戶',{dx:0,dy:-80,a:band(u,.3,.65)});
  lab(PJ,pipeAt(PJ),'摻氫點',{dx:0,dy:70,st:'g',a:band(u,.7,1)});
 },
 hud(u){hudPanel(240,128,'摻氫比例（示例）',seg(u,.05,.1),w=>{const b=Math.round(100*lerp(0,.2,ease(seg(u,.72,.9))));
  hrow(56,'氫氣體積比',trf('{n}%',{n:b}),w,H2C);hbar(14,68,w-28,b/20,H2C);hrow(106,'上限（研究）','約 20%',w,EC);});}},

{t:'什麼距離用什麼方式',en:'Which way fits which job',dur:12,
 d:'沒有哪一種方式最好，要看距離與運量。短距離、小用量，例如加氫站，長管拖車最彈性；距離拉長、運量變大，液氫槽車每趟載得較多；用量大又固定的工業區，管線的長期成本最低；跨洋運輸則要靠液氨或有機載體裝船。台灣第一批民用加氫設施已經起步，2025 年 12 月啟用的中油楠梓加氫站就設有 350 與 700 巴的加氫槍，小客車約 5 分鐘加滿、大型巴士約 10 到 15 分鐘。',
 s:[[0,'依距離與運量，選擇不同的運氫方式'],[.28,'短距離、小用量：長管拖車最彈性'],[.5,'量大又固定：管線最省；跨洋靠氨或載體'],[.76,'台灣加氫站已在 2025 年 12 月啟用']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,940,640,{title:'運氫方式的適用範圍（示意）',x0:0,x1:4,y0:0,y1:3,xt:[],yt:[],xl:'運輸距離',yl:'運量',pt:70,pb:70,pl:70,gx:4,gy:3});
  [['場內',0.4],['數百 km',1.3],['上千 km',2.3],['跨洋',3.3]].forEach(([t,x])=>wt(c.X(x),c.py+c.ph+26,t,17,'rgba(227,236,238,.85)',600,'center'));
  const Z=[['長管拖車',.1,1.2,.1,1.0,EC,.1,.5],['液氫槽車',1.0,2.2,.8,1.8,'#b37cff',.24,.5],['管線',.3,2.5,2.0,2.9,H2C,.4,.5],['液氨／載體海運',2.6,3.9,1.2,2.9,HC,.5,.5]];
  Z.forEach(([n,x0,x1,y0,y1,col,t0])=>alphaDo(seg(u,t0,t0+.08),()=>{const X0=c.X(x0),X1=c.X(x1),Y0=c.Y(y1),Y1=c.Y(y0);
   rrp(X0,Y0,X1-X0,Y1-Y0,16);ctx.save();ctx.globalAlpha=.26;ctx.fillStyle=col;ctx.fill();ctx.restore();ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();
   wt((X0+X1)/2,(Y0+Y1)/2+8,n,22,col,700,'center');}));
  alphaDo(seg(u,.76,.82),()=>{card(1040,160,500,640,{bg:'rgba(7,27,39,.75)'});wt(1070,208,'台灣：加氫站起步',22,EC,700);
   [['2025 年 12 月','中油楠梓加氫站啟用'],['350 / 700 bar','兩種壓力的加氫槍'],['約 5 分鐘','小客車加滿所需時間'],['10–15 分鐘','大型巴士加滿所需時間']].forEach(([a,b],i)=>alphaDo(seg(u,.78+i*.04,.84+i*.04),()=>{const y=290+i*120;wt(1070,y,a,30,i?H2C:EC,700,'left',COND);wt(1070,y+36,b,18,'rgba(227,236,238,.88)',500);}));});
 }}
]};
