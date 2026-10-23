// KITS: land
/* 太陽光電系列 第 9 集：追日系統與雙面模組 */
const E_Y='#f2c230',E_G='#7dffc4',E_W='#e8572a',E_B='#58b8d0';
const DEG=Math.PI/180;
const gy=x=>groundY(x);
const FXS=[330,550],TRS=[1010,1230];        // 固定式與追日式支架位置
const sunAt=u=>{const th=lerp(-70,70,u)*DEG;return {th,x:800+640*Math.sin(th),y:540-420*Math.cos(th)};};
/* 一天的功率模型（示例）：日照強度隨高度角緩升，固定式再乘上入射角 */
const elv=h=>Math.max(0,Math.sin((h-6)/12*Math.PI));
const PT=h=>0.95*Math.pow(elv(h),.2);
const PF=h=>PT(h)*Math.max(0,Math.cos((h-12)/6*Math.PI/2*.72));
const GAIN=(()=>{let f=0,t=0;for(let h=6;h<=18;h+=.02){f+=PF(h);t+=PT(h);}return {f:f*.02,t:t*.02,g:t/f-1};})();

function unit(cx,ang,o){o=o||{};const y=gy(cx),cy=y-70,w=170;
 ln([cx,y,cx,cy],'#8a99a3',6);
 ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);box(-w/2,-9,w,9,o.bi?'#2a5a74':'#1f3f66','rgba(0,0,0,.4)',1);
 ctx.strokeStyle='rgba(160,200,240,.5)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<6;i++){ctx.moveTo(-w/2+w*i/6,-9);ctx.lineTo(-w/2+w*i/6,0);}ctx.stroke();
 box(-w/2,-9,w,1.8,'#9fc3e6');ctx.restore();circ(cx,cy,5,'#c7d0d5');}
function ray(x0,y0,x1,y1,col,lw,a){alphaDo(a,()=>{ctx.setLineDash([10,8]);ln([x0,y0,x1,y1],col,lw);ctx.setLineDash([]);});}
function anemo(x,spd){const y=gy(x);ln([x,y,x,y-120],'#8a99a3',5);ctx.save();ctx.translate(x,y-124);
 for(let i=0;i<3;i++){const a=TT*spd+i*2.094;ctx.save();ctx.rotate(a);ln([0,0,26,0],'#c7d0d5',3);circ(30,0,8,'#dfe5e8','rgba(0,0,0,.3)',1);ctx.restore();}
 circ(0,0,5,'#2b3137');ctx.restore();}
function sunDisc(x,y,r){const g=ctx.createRadialGradient(x,y,4,x,y,r*2.4);g.addColorStop(0,'rgba(255,240,180,.9)');g.addColorStop(1,'rgba(255,240,180,0)');ctx.fillStyle=g;ctx.fillRect(x-r*2.4,y-r*2.4,r*4.8,r*4.8);circ(x,y,r,'#fff3c4');}

const EP={no:9,slug:'solar-pv',seriesName:'太陽光電系列',t:'追日系統與雙面模組',en:'Solar trackers and bifacial modules',
lede:'固定式支架一整天只對著同一個方向，太陽卻從東走到西。這一集看單軸追日如何讓模組一直正對陽光、雙面模組如何把地面反射的光也變成電，以及在颱風的台灣，這兩項技術必須做哪些取捨。',
facts:[['15–25','%','單軸追日相較固定式的年發電量增益範圍（國際文獻，依緯度與雲量而異）'],
['4–15','%','單軸追日搭配雙面模組的背面增益範圍，全球平均約 9%'],
['約 25','%','台北地區研究引用的單軸追日平均增益，但建築遮蔭可能抵銷一部分'],
['70–80','%','雙面模組背面效率相對正面的比例（示例，依型號而異）'],
['0.2–0.3','','草地與一般地面的反照率；白色屋頂約 0.6、新雪約 0.8（典型值）'],
['約 20','m/s','追日系統進入避風位置的持續風速門檻示例（各廠牌設定不同）']],
note:'說明：本集為教育用途示意動畫，設備與比例經過調整。單軸追日相較固定式增益 15–25%、搭配雙面模組增益 4–15%（平均約 9%）取自國際能源署 PVPS 與 OSTI 文獻整理；台北地區單軸追日平均約高 25% 引自台灣大學碩士論文對前人研究的整理；彰濱 100 MW 案模組廠商預估雙面增益約 5%、業界一般約 12%，且颱風使支架高度受限，引自 PV Tech 報導，皆為廠商預估而非實測。雙軸增益、一天的功率曲線、各種地面的背面增益、雙面係數、避風風速門檻皆為典型範例，實際依地點、模組型號與設計規範而定。',
base:()=>{landSky(GY,{sun:{x:1280,y:120}});drawGround();},
shots:[
{t:'追著太陽轉的支架',en:'Following the sun',dur:13,side:true,
 d:'太陽從東邊升起、西邊落下，固定式支架的模組卻整天朝著同一個方向，早晚陽光斜斜掠過板面，入射角大，接收到的能量就少。單軸追日系統在支架中央加一根東西向轉動的水平軸，馬達帶著整排模組由東向西慢慢轉動，讓板面盡量正對陽光。入射角越小，同樣面積接到的陽光越多，這就是追日增加發電量的來源。',
 s:[[0,'太陽從東邊升起，固定式模組只能朝著同一個方向'],[.3,'單軸追日的模組，跟著太陽慢慢轉動'],[.58,'早晚固定式的入射角大，接到的陽光變少'],[.8,'追日式幾乎整天正對陽光']],
 base:u=>{const s=sunAt(u);landSky(GY,{sun:{x:s.x,y:s.y},clouds:false});drawGround();},
 draw(u){
  const s=sunAt(u),tr=clamp(s.th,-60*DEG,60*DEG);
  FXS.forEach(x=>unit(x,0));TRS.forEach(x=>unit(x,tr));
  const ra=band(u,.12,1)*.35;
  [...FXS,...TRS].forEach(x=>{const cy=gy(x)-80;ray(s.x,s.y,x-30,cy,'#fff3c4',1.6,ra);ray(s.x,s.y,x+30,cy,'#fff3c4',1.6,ra);});
  tick(150,gy(150)+40,'東','left');tick(1460,gy(1460)+40,'西','right');
  lab(FXS[0]+110,gy(FXS[0])-90,'固定式支架',{dx:-30,dy:-120,st:'l',a:band(u,.04,.58)});
  lab(TRS[0]+110,gy(TRS[0])-84,'單軸追日支架',{dx:20,dy:-130,st:'s',a:band(u,.24,1)});
  lab(TRS[0],gy(TRS[0])-70,'東西向轉軸',{dx:-120,dy:60,st:'g',a:band(u,.32,.7),minor:true});
 },
 hud(u){hudPanel(250,150,'入射角（示意）',seg(u,.05,.1),w=>{const th=Math.abs(sunAt(u).th)/DEG,ct=Math.cos(th*DEG);
  hrow(56,'固定式',trf('{n}°',{n:Math.round(th)}),w,'#ff9d7a');hrow(88,'追日式',trf('{n}°',{n:Math.round(Math.max(0,th-60))}),w,'#7dffc4');
  hrow(120,'固定式受光',trf('{n} %',{n:Math.round(ct*100)}),w,'#f2c230');});}},

{t:'單軸與雙軸',en:'Single-axis and dual-axis',dur:13,
 d:'追日系統依轉軸數量分成兩類。單軸只負責東西方向，構造簡單、馬達少，是大型地面案場的主流；雙軸再加上調整仰角的第二個軸，全年都能正對太陽，增益更高，但結構複雜、佔地間距大、受風面積也大，維護成本較高。國際文獻顯示，單軸追日相較固定式約多發兩成上下；雙軸的增益再高一些，是否划算要比較多出來的電與多花的錢。',
 s:[[0,'固定式、單軸、雙軸，是三種不同的追日程度'],[.3,'單軸約多發兩成上下，結構簡單'],[.58,'雙軸再多一些，但結構與維護更複雜'],[.8,'划不划算，要比較多發的電與多花的成本']],
 draw(u){
  diagBG();
  card(60,160,940,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'年發電量相對固定式（示例）',20,E_Y,700);
  const B=[['固定式',100,'rgba(227,236,238,.75)','基準'],['單軸追日',120,E_Y,'約 +15–25%'],['雙軸追日',130,E_G,'約 +30%（示例）']],base=690,K=3.2;
  ln([90,base,970,base],'rgba(255,255,255,.4)',2);
  B.forEach((b,i)=>{const x=140+i*290,a=ease(seg(u,.04+i*.14,.2+i*.14)),h=b[1]*K*a;
   box(x,base-h,200,h,b[2]);wt(x+100,base+34,b[0],20,'#fff',700,'center');
   alphaDo(seg(u,.18+i*.14,.26+i*.14),()=>{wt(x+100,base-h-44,trf('{n}',{n:b[1]}),38,b[2],700,'center',COND);tag(x+100,base-h-34-0,b[3],{size:16,bg:'rgba(255,255,255,.12)',fg:'#fff',align:'center'});});});
  card(1040,160,500,640,{bg:'rgba(7,27,39,.75)'});wt(1064,200,'兩種追日方式',20,E_Y,700);
  [['單軸',E_Y,[['轉軸','東西向，一個軸'],['結構','簡單，馬達少'],['定位','大型地面案場主流']],[0],.34],
   ['雙軸',E_G,[['轉軸','東西加仰角，兩個軸'],['結構','複雜，佔地與風載較大'],['定位','特殊場域、小型案場']],[0,1],.6]].forEach(([n,col,rows,ax,t0],i)=>{
   const y0=250+i*270,a=seg(u,t0-.1,t0);alphaDo(.25+.75*a,()=>{
    box(1064,y0,4,230,col);tag(1084,y0+10,n,{size:20,bg:col,fg:'#13232e'});
    rows.forEach((r,k)=>{wt(1084,y0+110+k*44,r[0],17,'rgba(227,236,238,.8)',600);wt(1196,y0+110+k*44,r[1],17,'#fff',700);});
    const cx=1462,cy=y0+22;ln([cx,cy+4,cx,cy+44],'#8a99a3',5);const sw=Math.sin(TT*1.2)*.5;ctx.save();ctx.translate(cx,cy);ctx.rotate(sw);box(-30,-5,60,5,'#1f3f66','rgba(0,0,0,.4)',1);ctx.restore();
    if(ax.length>1)alphaDo(.9,()=>{ctx.beginPath();ctx.arc(cx,cy+4,36,-2.2,-.9);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();});});});
 }},

{t:'一天的發電曲線',en:'The daily power curve',dur:13,
 d:'把一天的發電量畫成曲線，固定式像一座鐘形的山丘，只有中午前後最高，早晚迅速掉落；追日式的曲線則像一座寬頂的高台，早上很早就爬升，到傍晚還維持在高處。兩條曲線在中午幾乎重疊，增益幾乎都來自早晚這兩段時間，也因此更能配合下午晚間的用電需求，在電力尖峰到來之前多供一些電。',
 s:[[0,'固定式的曲線像鐘形山丘，中午最高'],[.3,'追日式的曲線早上很早就爬升'],[.56,'兩條線在中午幾乎重疊，差別在早晚'],[.78,'整天加起來，追日式多發一截']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:'rgba(7,27,39,.75)'});
  const c=chartBox(90,190,940,570,{title:'晴天一天的發電功率（示例）',x0:6,x1:18,y0:0,y1:1,xt:[6,9,12,15,18],yt:[0,.25,.5,.75,1],xl:'時',yl:''});
  wt(c.X(18)-8,c.Y(1)+24,'單位：每 kW 裝置容量（kW）',15,'rgba(227,236,238,.75)',600,'right');
  const f1=ease(seg(u,.04,.24)),f2=ease(seg(u,.28,.5));
  const plot=(fn,f,col,lw)=>{ctx.beginPath();for(let h=6;h<=6+12*f+1e-6;h+=.05){const x=c.X(h),y=c.Y(fn(h));h===6?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();};
  const ga=ease(seg(u,.6,.74));
  if(ga>0){ctx.beginPath();for(let h=6;h<=18;h+=.1)h===6?ctx.moveTo(c.X(h),c.Y(PT(h))):ctx.lineTo(c.X(h),c.Y(PT(h)));for(let h=18;h>=6;h-=.1)ctx.lineTo(c.X(h),c.Y(PF(h)));ctx.closePath();alphaDo(ga*.45,()=>{ctx.fillStyle=E_G;ctx.fill();});}
  plot(PF,f1,'rgba(227,236,238,.85)',3.5);plot(PT,f2,E_Y,3.5);
  alphaDo(seg(u,.2,.28),()=>wt(c.X(15.4),c.Y(PF(15.4))+34,'固定式',18,'#fff',700,'center'));
  alphaDo(seg(u,.46,.54),()=>wt(c.X(7.6),c.Y(PT(7.6))-18,'追日式',18,E_Y,700,'center'));
  alphaDo(seg(u,.56,.66),()=>{[[7,'早上多發'],[17,'傍晚多發']].forEach(([h,t])=>{ln([c.X(h),c.Y(PF(h))-4,c.X(h),c.Y(PT(h))+4],E_G,2.5);wt(c.X(h)+(h<12?-10:10),c.Y(.16),t,16,E_G,700,h<12?'left':'right');ln([c.X(h),c.Y(.16)-22,c.X(h),c.Y(PF(h))+4],'rgba(125,255,196,.35)',1.2);});});
  alphaDo(seg(u,.58,.68),()=>{ctx.setLineDash([6,6]);ln([c.X(12),c.Y(0),c.X(12),c.Y(PT(12))],'rgba(255,255,255,.4)',1.5);ctx.setLineDash([]);wt(c.X(12),c.Y(PT(12))-14,'中午幾乎重疊',16,'#fff',600,'center');});
  card(1100,160,440,640,{bg:'rgba(7,27,39,.75)'});wt(1124,200,'一天加總（示例）',20,E_Y,700);
  const R=[['固定式',trf('{n} kWh/kW',{n:GAIN.f.toFixed(1)}),'#fff',.3],['追日式',trf('{n} kWh/kW',{n:GAIN.t.toFixed(1)}),E_Y,.5],['多發',trf('+{n} %',{n:Math.round(GAIN.g*100)}),E_G,.76]];
  R.forEach(([a,b,col,t0],i)=>{const y=290+i*130,k=seg(u,t0,t0+.08);alphaDo(k,()=>{wt(1124,y,a,20,'rgba(227,236,238,.85)',600);wt(1516,y+8,b,36,col,700,'right',COND);ln([1124,y+30,1516,y+30],'rgba(255,255,255,.15)',1);});});
  alphaDo(seg(u,.8,.9),()=>wt(1124,720,'更貼近午後到傍晚的用電需求',17,'rgba(227,236,238,.9)',600));
 }},

{t:'雙面模組怎麼收光',en:'How bifacial modules collect light',dur:13,
 d:'雙面模組的電池片兩面都能發電，背面通常採用透明背板或雙層玻璃。陽光照到正面時，一部分光穿過電池縫隙或被地面反射，再從下方照到背面，這些反射光與天空的散射光，額外轉換成電。背面的轉換效率通常是正面的七到八成，稱為雙面係數。地面顏色越淺、反射的光越多，背面能增加的發電量也越多。',
 s:[[0,'陽光從正面照進模組，轉換成電'],[.3,'一部分光落到地面，被反射回來'],[.56,'反射光與散射光從下方照到背面'],[.78,'背面效率約為正面的七到八成']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'雙面模組的剖面（示意）',20,E_Y,700);
  const px=560,py=450,ang=-24*DEG,gyy=740;
  box(90,gyy,940,34,'#3f4a3b');box(90,gyy,940,4,'#6e8f58');
  ln([px,py,px,gyy],'#8a99a3',6);
  const sa=seg(u,.04,.2),dir=[Math.cos(50*DEG),Math.sin(50*DEG)];
  /* 入射光 */
  alphaDo(sa,()=>{for(let i=0;i<4;i++){const ox=-30+i*70,t=(TT*.5+i*.25)%1,x0=px-330+ox,y0=py-250;const x1=px-130+ox*.9+i*10,y1=py-90+i*40;ln([x0,y0,x1,y1],'rgba(255,243,196,.55)',2.5);circ(lerp(x0,x1,t),lerp(y0,y1,t),4,'#fff3c4');}});
  /* 地面反射 */
  const ra=seg(u,.3,.5);
  alphaDo(ra,()=>{for(let i=0;i<5;i++){const xa=px-210+i*60,t=(TT*.45+i*.2)%1,x1=px-60+i*30,y1=py+22;ln([xa,gyy,x1,y1],'rgba(255,243,196,.5)',2);circ(lerp(xa,x1,t),lerp(gyy,y1,t),3.5,'#fff3c4');}});
  /* 散射光 */
  alphaDo(seg(u,.5,.64),()=>{for(let i=0;i<3;i++){const xa=px+100+i*70,t=(TT*.35+i*.3)%1,y0=py-170;ln([xa,y0,px+i*30,py+14],'rgba(200,225,240,.38)',2);circ(lerp(xa,px+i*30,t),lerp(y0,py+14,t),3,'#cfe3f0');}});
  ctx.save();ctx.translate(px,py);ctx.rotate(ang);box(-190,-12,380,12,'#1f3f66','rgba(0,0,0,.4)',1);box(-190,-12,380,2.5,'#9fc3e6');
  box(-190,-1.5,380,2.5,seg(u,.56,.7)>0?E_G:'#8fb8cf');ctx.restore();
  lab(px-130,py+40,'背面受光',{dx:-110,dy:120,st:'g',a:band(u,.5,1)});
  lab(px+120,py-48,'正面受光',{dx:70,dy:-80,st:'s',a:band(u,.1,.5)});
  lab(px-210,gyy,'地面反射光',{dx:-30,dy:0,st:'l',a:band(u,.32,.8),minor:true});
  lab(px,py+22,'透明背板或雙玻',{dx:150,dy:90,a:band(u,.62,1),minor:true});
  card(1100,160,440,640,{bg:'rgba(7,27,39,.75)'});wt(1124,200,'背面能多發多少',20,E_Y,700);
  const L=[['雙面係數','背面效率 ÷ 正面效率','約 70–80%（示例）',.6],['反射光','地面越亮','背面越亮',.68],['離地高度','支架越高','背面看到的反射光越多',.76]];
  L.forEach(([a,b,b2,t0],i)=>{const k=seg(u,t0,t0+.08),y=270+i*150;alphaDo(.25+.75*k,()=>{box(1124,y-26,14,110,k>.5?E_G:'rgba(255,255,255,.3)');wt(1156,y+4,a,20,'#fff',700);wt(1156,y+44,b,16,'rgba(227,236,238,.85)',500);wt(1156,y+70,b2,16,'rgba(227,236,238,.85)',500);});});
 }},

{t:'反照率與離地高度',en:'Albedo and mounting height',dur:13,
 d:'反照率是地面把陽光反射回去的比例。深色土壤約 0.15，草地約 0.2 到 0.25，淺色碎石與水泥更高，白色塗佈屋頂可達 0.6，新雪則高達 0.8。背面增益大致隨反照率上升，業界一般約 5% 到 15%。支架離地越高，背面看到的地面範圍越大；但在台灣，颱風限制了支架高度，彰濱 100 MW 案的廠商就預估增益只有約 5%。',
 s:[[0,'反照率，是地面把陽光反射回去的比例'],[.3,'地面越亮，背面增加的發電量越多'],[.58,'支架離地越高，背面接到的反射光越多'],[.8,'颱風限制了支架高度，增益也會打折']],
 draw(u){
  diagBG();
  card(60,160,940,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'背面增益隨地面變化（示例）',20,E_Y,700);
  const S=[['深色土壤',.15,'#4a4038'],['草地',.25,'#5c8a3f'],['淺色碎石',.35,'#b9b4a8'],['白色屋頂',.6,'#e8ecee'],['新雪',.8,'#ffffff']],base=680,K=1050;
  ln([90,base,970,base],'rgba(255,255,255,.4)',2);
  S.forEach((s,i)=>{const x=110+i*172,a=ease(seg(u,.04+i*.07,.2+i*.07)),g=s[1]*24,h=g*13*a;
   box(x,base-h,130,h,E_G);box(x,base,130,26,s[2],'rgba(255,255,255,.3)',1);
   wt(x+65,base+56,s[0],17,'#fff',700,'center');wt(x+65,base+82,trf('反照率 {n}',{n:s[1].toFixed(2)}),14,'rgba(227,236,238,.75)',500,'center');
   alphaDo(seg(u,.14+i*.07,.24+i*.07),()=>wt(x+65,base-h-14,trf('+{n}%',{n:Math.round(g)}),28,E_G,700,'center',COND));});
  card(1040,160,500,640,{bg:'rgba(7,27,39,.75)'});wt(1064,200,'離地高度的取捨',20,E_Y,700);
  const hh=ease(seg(u,.5,.64)),hs=lerp(60,140,hh),cx=1290,gyy2=470;
  box(1064,gyy2,452,14,'#3f4a3b');box(1064,gyy2,452,3,'#6e8f58');
  ln([cx,gyy2,cx,gyy2-hs],'#8a99a3',6);ctx.save();ctx.translate(cx,gyy2-hs);ctx.rotate(-16*DEG);box(-120,-9,240,9,'#2a5a74','rgba(0,0,0,.4)',1);ctx.restore();
  alphaDo(seg(u,.5,.62),()=>{for(let i=0;i<5;i++){const xa=cx-110+i*55,t=(TT*.4+i*.2)%1;ln([xa,gyy2,cx-60+i*30,gyy2-hs+6],'rgba(255,243,196,.45)',1.8);circ(lerp(xa,cx-60+i*30,t),lerp(gyy2,gyy2-hs+6,t),3,'#fff3c4');}});
  alphaDo(seg(u,.5,.6),()=>{arrow(1100,gyy2-30,1100,gyy2-hs-10,E_G,2.5);wt(1112,gyy2-hs/2-10,'越高越好',16,E_G,700);});
  alphaDo(seg(u,.72,.84),()=>{card(1064,520,452,240,{bg:'rgba(232,87,42,.1)',st:'rgba(232,87,42,.5)'});
   tag(1088,556,'台灣的限制',{size:18,bg:E_W,fg:'#fff'});wt(1088,630,'颱風使支架不能架太高',19,'#fff',700);
   wt(1088,672,'彰濱 100 MW 案：廠商預估約 +5%',17,'rgba(227,236,238,.9)',600);wt(1088,708,'業界一般約 +12%（廠商預估，非實測）',16,'rgba(227,236,238,.8)',500);});
 }},

{t:'颱風來了：避風位置',en:'Typhoon stow position',dur:14,side:true,
 d:'追日系統的最大風險是強風。轉動中的模組斜著迎風，受風面積大，容易發生扭轉共振與結構損壞。因此控制器接上風速計，當持續風速超過設定門檻，例如每秒二十公尺左右，馬達就把所有模組轉到平放的避風位置，大幅降低風壓。颱風下平放雖然安全，但發電也暫停，所以在台灣，要在多發的電、結構成本與避風策略之間取得平衡。',
 s:[[0,'平常，模組依太陽角度轉動'],[.3,'風速計量到風越吹越強'],[.5,'超過門檻，馬達把模組轉成平放'],[.78,'風過之後，再回到追日位置']],
 base:u=>{landSky(GY,{dusk:.35,clouds:false});drawGround();ctx.fillStyle='rgba(30,40,50,'+(.35*seg(u,.1,.5)).toFixed(3)+')';ctx.fillRect(VX0,VY0,VX1-VX0,GY-VY0);},
 draw(u){
  const v=8+14*ease(seg(u,.1,.5))+(u>.5?3*ease(seg(u,.5,.6)):0)+(u>.8?-14*ease(seg(u,.8,.98)):0)+1.2*Math.sin(TT*2.3);
  const stow=ease(seg(u,.5,.66))-ease(seg(u,.84,.98));
  const wind=clamp((v-8)/14,0,1);
  const xs=[330,560,1040,1270];
  xs.forEach((x,i)=>unit(x,lerp(38*DEG,0,stow)+.05*wind*(1-stow)*Math.sin(TT*8+i)));
  anemo(800,lerp(2,12,wind));
  ctx.strokeStyle='rgba(255,255,255,'+(.15+.35*wind)+')';ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<16;i++){const y=230+((i*149)%330),x=((TT*(160+380*wind)+i*263)%1900)-200,L=40+90*wind;ctx.moveTo(x,y);ctx.lineTo(x+L,y);}ctx.stroke();
  lab(800,gy(800)-124,'風速計',{dx:-80,dy:-90,st:'l',a:band(u,.18,.6)});
  lab(xs[2],gy(xs[2])-100,'平放避風',{dx:20,dy:-120,st:'g',a:band(u,.58,.84)});
  alphaDo(band(u,.4,.62),()=>tag(800,230,'風速超過門檻',{size:20,bg:E_W,fg:'#fff',align:'center'}));
 },
 hud(u){hudPanel(250,150,'避風控制（示例）',seg(u,.05,.1),w=>{
  const v=8+14*ease(seg(u,.1,.5))+(u>.5?3*ease(seg(u,.5,.6)):0)+(u>.8?-14*ease(seg(u,.8,.98)):0),stow=ease(seg(u,.5,.66))-ease(seg(u,.84,.98));
  hrow(56,'風速',trf('{n} m/s',{n:Math.round(v)}),w,v>=20?'#ff9d7a':'#fff');hrow(88,'面板角度',trf('{n}°',{n:Math.round(38*(1-stow))}),w,'#f2c230');
  hrow(120,'狀態',stow>.5?'避風中':'追日中',w,stow>.5?'#7dffc4':'#fff');});}}
]};
