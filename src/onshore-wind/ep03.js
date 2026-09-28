// KITS: land
/* 陸域風電系列 第 3 集：陸域風場運維 */
const gyy=x=>groundY(x);
const VR=10,VIN=3,VOUT=25;                               // 功率曲線參數（m/s，典型範例，同第 2 集）
const pwr=v=>{if(v<VIN||v>VOUT)return 0;const x=(v*v*v-27)/(VR*VR*VR-27);return 4.2*x/Math.pow(1+Math.pow(x,10),.1);};
/* 正視的葉片：w 為寬度比例（取自第 2 集） */
function bladeF(cx,cy,a,L,w){w=w===undefined?1:w;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
  const k=Math.max(.18,w);poly([8,-5*k,8+L*.2,-10*k,8+L,-1.5*k,8+L,1.5*k,8+L*.2,8*k,8,5*k],'#f4f6f7','rgba(0,0,0,.35)',1);ctx.restore();}
/* 正視的風機：底 (x,gy)，輪轂高 H，葉片長 R，轉角 rot */
function turbine(x,gy,H,R,rot,o){o=o||{};const hy=gy-H,w0=Math.max(4,R*.09),w1=Math.max(2.5,R*.05);
  poly([x-w0,gy,x-w1,hy+R*.06,x+w1,hy+R*.06,x+w0,gy],o.tc||'#eef2f4','rgba(0,0,0,.3)',1);
  box(x-R*.1,hy-R*.08,R*.2,R*.13,'#e3e8ec','rgba(0,0,0,.3)',1);
  for(let i=0;i<3;i++)bladeF(x,hy,rot+i*TAU/3-Math.PI/2,R,o.w);
  circ(x,hy,Math.max(3,R*.07),'#dfe5e8','rgba(0,0,0,.4)',1);return {x,y:hy};}
function windLines(y0,y1,n,sp,a,seed,len){if(a<=0)return;const r=rng(seed||3);ctx.lineCap='round';
  for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),ph=r(),s=sp*(.7+.6*r()),L=(len||60)*(.6+.8*r());const x=VX0-200+((ph*2400+TT*s)%(VX1-VX0+400));
   alphaDo(a*(.25+.35*r()),()=>ln([x,y,x+L,y],'#ffffff',2));}ctx.lineCap='butt';}
function spin(u,dur,f){let a=0;const N=120;for(let i=0;i<N;i++){const x=u*(i+.5)/N;a+=f(x);}return a*u*dur/N;}
/* 運維中心建築：左下角 (x,gy) */
function omBuilding(x,w,h){const g=gyy(x+w/2);box(x,g-h,w,h,'#dfe5e8','rgba(0,0,0,.3)',1);box(x-6,g-h-8,w+12,10,'#9aa3a8');
  wins(x+16,g-h+22,Math.floor((w-24)/40),40,26,20,'#2a3a46');box(x+w-46,g-44,28,44,'#6f7a80');
  ln([x+30,g-h-8,x+30,g-h-70],'#6f7a80',3);circ(x+30,g-h-72,5,'#e8572a');return {ax:x+30,ay:g-h-72};}
/* 小型四軸無人機 */
function drone(x,y,s){s=s||1;ln([x-14*s,y,x+14*s,y],'#2b3137',2.5*s);box(x-6*s,y-3*s,12*s,7*s,'#394650');
  for(const d of [-14,14]){ln([x+d*s-8*s,y-3*s,x+d*s+8*s,y-3*s],'rgba(40,50,60,.8)',1.5*s);}circ(x,y+5*s,2.4*s,'#e8572a');}
/* 小鳥（V 字） */
function vbird(x,y,s,ph){const f=Math.sin(ph)*4*s;ln([x-8*s,y-f,x,y,x+8*s,y-f],'#1f2a30',1.8);}
/* 簡易房屋 */
function house(x,w,h,col){const g=gyy(x+w/2);box(x,g-h,w,h,col||'#e9dcc7','rgba(0,0,0,.3)',1);poly([x-6,g-h,x+w/2,g-h-h*.55,x+w+6,g-h],'#a8583e','rgba(0,0,0,.3)',1);wins(x+10,g-h+14,2,w/2-4,w/4,h*.3,'#2a3a46');}

/* 分鏡 2：散點資料（可重現） */
const SCAT=(()=>{const r=rng(31),a=[];for(let i=0;i<150;i++){const v=2+r()*16;a.push([v,Math.max(0,pwr(v)*(1+(r()-.5)*.08)),r()]);}return a;})();
const SCAT_B=(()=>{const r=rng(47),a=[];for(let i=0;i<60;i++){const v=3+r()*14;const k=v<12?.9:1;a.push([v,Math.max(0,pwr(v)*k*(1+(r()-.5)*.06)),r()]);}return a;})();
const SIG=[['輪轂風速','m/s',7.6,'#7dc8dc'],['輸出功率','MW',2.1,'#f2c230'],['轉子轉速','rpm',8.5,'#fff'],['槳距角','°',0.4,'#fff'],
 ['偏航角','°',212,'#fff'],['齒輪箱油溫','°C',58,'#ff9d7a'],['軸承溫度','°C',64,'#ff9d7a'],['發電機溫度','°C',71,'#ff9d7a']];

const EP={no:3,slug:'onshore-wind',seriesName:'陸域風電系列',t:'陸域風場運維',en:'Operating and maintaining an onshore wind farm',
lede:'風機蓋好之後，要穩定運轉二十年。這一集走進運維現場：看 SCADA 如何即時回報每一台風機、葉片怎麼檢修、齒輪箱如何靠振動與油品提早發現問題，以及風場如何監測噪音與鳥類。',
facts:[['10','分鐘','SCADA 常用的資料彙整間隔：每筆記錄平均值、最大、最小與標準差'],
['≥ 97','%','業界常用的風機可用率目標，約等於全年停機少於 11 天'],
['76','%','美國 NREL 齒輪箱可靠度資料庫中，源自軸承的齒輪箱損壞比例'],
['36','dB(A)','風力發電機組 20–200 Hz 低頻噪音夜間管制值（第一、二類管制區）'],
['6 / 12','個月','半年與年度保養的典型間隔，油品取樣也常每半年一次（示例）'],
['168','部','台電陸域風機數量，裝置容量約 297 MW（經濟部 2022 年新聞稿）']],
note:'說明：本集為教育用途示意動畫，風機、建築與地景比例經過調整。SCADA 以 10 分鐘統計值記錄為業界常見做法；齒輪箱損壞 76% 源自軸承引自美國 NREL 齒輪箱可靠度資料庫；風力發電機組噪音管制值依環境部「噪音管制標準」（20–200 Hz 夜間第一、二類管制區 36 dB(A)、第三類 41 dB(A)、第四類 44 dB(A)；全頻於背景音量較高時採增量不超過 5 dB(A) 管制，於陳情人指定之室內地點量測）；台電 168 部陸域風機與 297 MW 引自經濟部新聞稿。可用率 97%、保養月份與項目、SCADA 讀值、功率曲線散點、振動頻譜、溫度趨勢、噪音分布與雷達偵測畫面皆為典型範例，並非特定案場資料；實際做法依各風場、機型與主管機關規定而定。',
base:()=>{landSky(GY,{sun:{x:1260,y:130},clouds:false});drawGround();},
shots:[
/* 1 ─────────────────────────────── 控制室 */
{t:'看得見每一台風機',en:'Every turbine, seen from the control room',dur:13,side:true,
 d:'陸域風場的風機分散在沿海數公里的範圍，運維人員不可能天天爬上每一座塔架。每台風機都有控制器，持續量測風速、功率、轉速、槳距角、偏航角與各部位溫度，透過光纖把數據送回運維中心，這套系統稱為監控與資料擷取系統（SCADA）。運維人員在中控室就能看到整個風場的即時狀態，也能遠端重新啟動或停機。台電已把分散各地的陸域風機納入遠端集中監控。',
 s:[[0,'沿海的風場，每一台風機都在回報數據'],[.3,'數百個訊號，經光纖傳到運維中心'],[.56,'中控室一眼看出哪台正常、哪台異常'],[.8,'異常警報出現，運維人員開始判斷']],
 cam:u=>camMix({x:800,y:450,s:1},{x:820,y:440,s:1.04},ease(seg(u,.1,.8))),
 draw(u){
  const TS=[[140,240,120],[360,250,125],[580,260,130],[800,250,125]];
  const Ts=TS.map(([x,h,r],i)=>turbine(x,gyy(x),h,r,TT*1.5+i*1.9));
  windLines(170,560,20,240,.9,4,60);
  const A=omBuilding(1060,250,100);
  /* 光纖：地下沿線 */
  const fy=GY+26;alphaDo(seg(u,.26,.34),()=>{ctx.setLineDash([10,6]);ln([140,fy,1110,fy],'#f2c230',2.5);ctx.setLineDash([]);
   Ts.forEach(T=>ln([T.x,gyy(T.x),T.x,fy],'rgba(242,194,48,.7)',1.5));ln([1110,fy,1110,gyy(1110)],'rgba(242,194,48,.7)',1.5);});
  /* 資料封包 */
  alphaDo(seg(u,.3,.36),()=>{for(let i=0;i<4;i++)for(let k=0;k<3;k++){const p=(TT*.35+k/3+i*.13)%1,x0=TS[i][0],x=lerp(x0,1110,p);circ(x,fy,4,i===2?'#e8572a':'#7dffc4');}});
  /* 異常風機閃爍 */
  const T3=Ts[2];alphaDo(seg(u,.72,.76)*(.5+.5*Math.sin(TT*8)),()=>ring(T3.x,T3.y,26,'#e8572a',4));
  /* 中控畫面 */
  const k=ease(seg(u,.5,.58));if(k>0)alphaDo(k,()=>{const x0=930,y0=345;card(x0,y0,560,160,{bg:'rgba(7,27,39,.88)'});
   wt(x0+18,y0+30,'遠端監控畫面（示例）',17,'#f2c230',700);
   for(let i=0;i<12;i++){const cx=x0+18+(i%6)*89,cy=y0+48+Math.floor(i/6)*54,bad=i===2&&u>.72;
    box(cx,cy,80,44,bad?'rgba(232,87,42,.35)':'rgba(125,255,196,.12)',bad?'#e8572a':'rgba(125,255,196,.6)',1.5);
    wt(cx+8,cy+18,'WTG '+String(i+1).padStart(2,'0'),14,'rgba(227,236,238,.9)',700,'left',COND);
    const f=bad?.35:.55+.35*Math.abs(nz(i*1.3+TT*.2));box(cx+8,cy+28,64*f,7,bad?'#e8572a':'#7dffc4');}});
  lab(Ts[1].x,Ts[1].y,'風機控制器',{dx:60,dy:-70,st:'l',a:band(u,.05,.3)});
  lab(700,fy,'光纖通訊',{dx:0,dy:60,st:'s',a:band(u,.3,.55)});
  lab(1185,gyy(1185)-100,'運維中心',{dx:0,dy:-50,a:band(u,.12,.5)});
  lab(T3.x,T3.y+30,'齒輪箱溫度偏高',{dx:-70,dy:90,st:'w',a:band(u,.74,1)});
 },
 hud(u){hudPanel(250,150,'風場即時概況（示例）',seg(u,.05,.1),w=>{const bad=u>.72;
  hrow(56,'運轉台數',bad?'11 / 12':'12 / 12',w,bad?'#ff9d7a':'#7dffc4');hrow(88,'風場出力',trf('{p} MW',{p:(bad?21.3:24.6+.4*nz(TT*.3)).toFixed(1)}),w,'#f2c230');hrow(120,'警報',bad?'1':'0',w,bad?'#ff9d7a':'#fff');});}},

/* 2 ─────────────────────────────── SCADA 數據 */
{t:'SCADA 數據怎麼讀',en:'Reading SCADA data',dur:13,
 d:'SCADA 每秒取樣，但通常以 10 分鐘為一筆彙整，記錄平均值、最大值、最小值與標準差。一台風機常有數百個訊號，運維上最常看的是風速、功率、轉速、槳距角、偏航角，以及齒輪箱油溫、軸承與發電機溫度。把一年的 10 分鐘資料畫在風速—功率圖上，正常的風機會緊貼保證功率曲線；若一台風機在同樣風速下持續少發 5–10%，就要檢查葉片、槳距角或偏航是否出了問題。',
 s:[[0,'每 10 分鐘，SCADA 記下一筆完整的運轉紀錄'],[.3,'風速與功率畫在一起，正常風機貼著功率曲線'],[.52,'這台風機在中低風速時持續少發電'],[.78,'可能是葉片侵蝕、槳距或偏航出了問題']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'SCADA 每 10 分鐘一筆紀錄（示例）',20,'#f2c230',700);
  SIG.forEach(([n,un,v,c],i)=>alphaDo(seg(u,.02+i*.03,.06+i*.03),()=>{const y=262+i*62;
   wt(84,y+6,n,18,'#fff',700);
   ctx.beginPath();for(let j=0;j<=40;j++){const x=320+j*6.5,yy=y-4+11*nz(j*.35+i*2.1+TT*.25);j?ctx.lineTo(x,yy):ctx.moveTo(x,yy);}ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();
   const vv=v+(i<3?.3*nz(TT*.4+i):0);wt(736,y+6,(vv>=100?Math.round(vv):vv.toFixed(1))+' '+un,19,c,700,'right',COND);
   ln([84,y+26,736,y+26],'rgba(255,255,255,.08)',1);}));
  alphaDo(seg(u,.2,.26),()=>tag(410,748,'每筆：平均、最大、最小、標準差',{size:16,bg:'#dfe5e8',align:'center'}));
  const C=chartBox(800,160,740,640,{title:'風速與功率散佈圖（示例）',x0:0,x1:20,y0:0,y1:5,xt:[0,5,10,15,20],yt:[0,1,2,3,4,5],xl:'風速 m/s',yl:'MW',pl:76,pt:70,pb:70,gx:4,gy:5});
  const nA=Math.floor(SCAT.length*seg(u,.28,.46));
  for(let i=0;i<nA;i++){const [v,p]=SCAT[i];circ(C.X(v),C.Y(p),3.4,'rgba(125,255,196,.6)');}
  alphaDo(seg(u,.3,.36),()=>{ctx.setLineDash([7,6]);ctx.beginPath();for(let s=VIN;s<=20;s+=.1){const x=C.X(s),y=C.Y(pwr(s));s===VIN?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.stroke();ctx.setLineDash([]);
   wt(C.X(19.6),C.Y(4.2)-14,'保證功率曲線',16,'#fff',700,'right');});
  const nB=Math.floor(SCAT_B.length*seg(u,.52,.66));
  for(let i=0;i<nB;i++){const [v,p]=SCAT_B[i];circ(C.X(v),C.Y(p),4,'#ff9d7a');}
  alphaDo(seg(u,.3,.36),()=>{circ(C.px+24,C.py+30,5,'rgba(125,255,196,.8)');wt(C.px+36,C.py+36,'正常風機',16,'#7dffc4',700);});
  alphaDo(seg(u,.52,.58),()=>{circ(C.px+24,C.py+62,5,'#ff9d7a');wt(C.px+36,C.py+68,'WTG 03',16,'#ff9d7a',700,'left',COND);});
  alphaDo(seg(u,.6,.66),()=>tag(C.X(14),C.Y(1.6),'同樣風速，少發約 5–10%',{size:17,bg:'#ff9d7a',align:'center'}));
  alphaDo(seg(u,.78,.84),()=>tag(C.X(14),C.Y(.9),'檢查：葉片、槳距、偏航',{size:17,bg:'#f2c230',align:'center'}));
 }},

/* 3 ─────────────────────────────── 葉片檢修 */
{t:'葉片檢修',en:'Inspecting and repairing blades',dur:14,side:true,
 d:'葉片是風機最外露的部件，葉尖線速度可達每秒 70–80 公尺，雨滴、砂粒與鹽分長年撞擊，前緣塗層會逐漸剝蝕，讓氣流變亂、發電量下降數個百分點。葉尖也是雷擊最常落下的地方，靠內部的接收器與導線把電流導入地面。檢查時先停機、把葉片轉到朝下並鎖定轉子，再以無人機或地面長焦相機拍攝整支葉片；發現損傷後，技師以繩索垂降到葉片旁，打磨並補上前緣保護層。',
 s:[[0,'風機停機，把要檢查的葉片轉到朝下'],[.22,'無人機沿著葉片飛行，拍下每一段表面'],[.45,'影像顯示葉尖前緣被雨滴與砂粒侵蝕'],[.65,'技師以繩索垂降，打磨並補上保護塗層']],
 cam:u=>camMix({x:780,y:420,s:1.05},{x:540,y:390,s:2.1},ease(seg(u,.12,.3))),
 draw(u){
  const TX=700,rot=Math.PI-3*Math.pow(1-seg(u,0,.2),2);
  const T=turbine(TX,gyy(TX),300,210,rot,{tc:'#b9c3ca'});
  ctx.save();ctx.translate(880,gyy(880));ctx.scale(.4,.4);truck(0,0,false,'#f4f6f7');ctx.restore();
  const tipY=T.y+8+210;
  /* 前緣侵蝕：葉尖附近的斑點 */
  const rep=seg(u,.82,.94),r=rng(9);
  for(let i=0;i<22;i++){const f=.66+r()*.3,y=T.y+8+210*f,w=10-8.5*(f-.2)/.8,x=TX-w*(.2+r()*.7);
   if(r()<rep)continue;circ(x,y,1.2+r()*1.3,'#b8743c');}
  if(rep>0)alphaDo(rep,()=>{ctx.beginPath();ctx.moveTo(TX-5,T.y+8+210*.66);ctx.lineTo(TX-2,tipY-4);ctx.strokeStyle='#8fb4c4';ctx.lineWidth=3;ctx.stroke();});
  /* 無人機 */
  const dp=seg(u,.2,.62);
  if(dp>0&&dp<1||band(u,.2,.66)>0){const yy=T.y+30+180*(.5-.5*Math.cos(dp*Math.PI*2)),xx=TX-32+4*Math.sin(TT*2);
   alphaDo(band(u,.18,.66),()=>{drone(xx,yy+Math.sin(TT*5)*2,.6);if(Math.sin(TT*6)>.9)alphaDo(.6,()=>poly([xx+6,yy,xx+30,yy-8,xx+30,yy+8],'rgba(255,248,222,.8)'));});
   lab(xx,yy,'無人機',{dx:-80,dy:-30,st:'l',a:band(u,.22,.44)});}
  /* 巡檢影像 */
  const ki=band(u,.4,.66);if(ki>0)alphaDo(ki,()=>{const x0=330,y0=380;card(x0,y0,260,140,{bg:'rgba(7,27,39,.9)',st:'rgba(242,194,48,.8)'});
   wt(x0+12,y0+24,'巡檢影像（示例）',14,'#f2c230',700);
   poly([x0+20,y0+50,x0+240,y0+74,x0+240,y0+96,x0+20,y0+126],'#eef2f4','rgba(0,0,0,.4)',1);
   const q=rng(4);for(let i=0;i<26;i++){const t=q();circ(x0+30+t*200,y0+52+t*24+q()*6,1.5+q()*2.5,'#b8743c');}
   circ(x0+226,y0+86,4,'#394650');});
  /* 繩索作業 */
  const kr=ease(seg(u,.62,.76));
  if(kr>0){[-1,1].forEach((sd,j)=>{const px=TX+sd*18,py=lerp(T.y+20,T.y+8+210*.78,kr);
   ln([TX+sd*6,T.y-6,px,py-22],'rgba(40,40,40,.85)',1.2);person(px,py,j?'#f2c230':'#e8572a',2);
   if(u>.82&&u<.94&&j===0)for(let k=0;k<5;k++){const t=(TT*1.3+k*.2)%1;circ(px-6-t*18,py-10+t*26,1.3,'rgba(230,230,230,.8)');}});}
  lab(TX,T.y,'轉子鎖定',{dx:120,dy:-60,st:'s',a:band(u,.14,.36)});
  lab(TX-6,T.y+8+210*.84,'前緣侵蝕',{dx:110,dy:40,st:'w',a:band(u,.44,.78)});
  lab(TX+18,T.y+8+210*.72,'繩索作業技師',{dx:120,dy:-50,a:band(u,.66,.9)});
  lab(TX-3,T.y+8+210*.8,'修補前緣保護層',{dx:-120,dy:30,st:'g',a:band(u,.86,1)});
  lab(TX,tipY,'葉尖雷擊接收器',{dx:100,dy:40,st:'l',a:band(u,.28,.46)});
 }},

/* 4 ─────────────────────────────── 齒輪箱與振動 */
{t:'聽出齒輪箱的異音',en:'Listening to the gearbox',dur:14,
 d:'齒輪箱把轉子每分鐘約十轉的轉速，提升到發電機需要的每分鐘一千多轉，是最貴也最難更換的部件之一。美國 NREL 的統計中，約 76% 的齒輪箱損壞源自軸承。狀態監測系統（CMS）在主軸承、齒輪箱與發電機裝上振動感測器，高頻取樣後做頻譜分析，軸承剛出現剝落時，特定頻率就會冒出尖峰。再配合油品分析檢查金屬顆粒、含水量與黏度，趨勢越過警戒值時，就能提前備料，排在風小的日子更換。',
 s:[[0,'打開機艙：主軸、齒輪箱與發電機'],[.25,'振動感測器聽出軸承初期損傷的頻率'],[.5,'油品取樣，檢查金屬顆粒與含水量'],[.74,'趨勢越過警戒值，提前安排更換']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'機艙內的傳動系統（剖面示意）',20,'#f2c230',700);
  rrp(120,330,600,240,30);ctx.fillStyle='rgba(227,232,236,.1)';ctx.fill();ctx.strokeStyle='rgba(227,232,236,.6)';ctx.lineWidth=2;ctx.stroke();
  box(380,570,70,210,'rgba(227,232,236,.25)','rgba(227,232,236,.5)',1.5);
  circ(110,450,46,'#dfe5e8','rgba(0,0,0,.4)',1.5);
  const rs=TT*.9;for(let i=0;i<3;i++){const a=rs+i*TAU/3;ln([110,450,110+Math.cos(a)*40,450+Math.sin(a)*40],'rgba(0,0,0,.25)',3);}
  box(150,438,120,24,'#9aa3a8');box(190,420,34,60,'#7dc8dc','rgba(0,0,0,.4)',1);
  box(270,390,170,120,'#6f7a80','rgba(0,0,0,.5)',1.5);
  const gr=(x,y,r,s)=>{circ(x,y,r,'#8d989f','#394650',2);for(let i=0;i<8;i++){const a=s+i*TAU/8;ln([x,y,x+Math.cos(a)*r,y+Math.sin(a)*r],'#394650',1.5);}};
  gr(320,450,42,rs);gr(392,420,22,-rs*3);gr(400,478,16,rs*6);
  box(440,468,70,14,'#9aa3a8');box(510,405,160,110,'#58b8d0','rgba(0,0,0,.4)',1.5);
  for(let i=0;i<6;i++)ln([525+i*24,412,525+i*24,508],'rgba(0,0,0,.2)',2);
  wt(207,400,'主軸承',16,'#7dc8dc',700,'center');wt(355,378,'齒輪箱',17,'#fff',700,'center');wt(590,395,'發電機',17,'#7dc8dc',700,'center');
  wt(355,540,'約 10 rpm → 約 1,500 rpm',16,'rgba(227,236,238,.85)',600,'center');
  const SN=[[207,480],[290,392],[420,510],[590,515]];
  alphaDo(seg(u,.2,.26),()=>{SN.forEach(([x,y],i)=>{circ(x,y,6,'#f2c230','#13232e',1.5);const p=(TT*.8+i*.25)%1;alphaDo(1-p,()=>ring(x,y,6+p*24,'#f2c230',2));});
   tag(620,640,'振動感測器（CMS）',{size:16,bg:'#f2c230',align:'center'});});
  alphaDo(seg(u,.5,.56),()=>{const bx=130,by=600;ln([300,510,300,560,bx+12,560,bx+12,by],'#e8a33a',2);
   box(bx,by,24,40,'rgba(232,163,58,.7)','#fff',1.5);box(bx+5,by-8,14,8,'#dfe5e8');
   wt(bx+36,by+14,'油品取樣',17,'#e8a33a',700);wt(bx+36,by+40,'金屬顆粒・含水量・黏度',16,'rgba(227,236,238,.85)',600);});
  /* 右上：頻譜 */
  const C=chartBox(800,160,740,310,{title:'振動頻譜（示例）',x0:0,x1:10,y0:0,y1:1,xt:[],yt:[],xl:'頻率',yl:'振幅',pl:60,pt:60,pb:44,gx:5,gy:2});
  const g=ease(seg(u,.28,.46));
  ctx.beginPath();for(let f=0;f<=10;f+=.04){const b=.08+.05*Math.abs(nz(f*6+TT*1.5))+.5*Math.exp(-Math.pow((f-1.2)/.08,2))+.3*Math.exp(-Math.pow((f-2.4)/.08,2));
   const d=g*(.6*Math.exp(-Math.pow((f-6.3)/.07,2))+.28*Math.exp(-Math.pow((f-5.9)/.07,2))+.28*Math.exp(-Math.pow((f-6.7)/.07,2)));
   const x=C.X(f),y=C.Y(Math.min(.98,b+d));f?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.stroke();
  wt(C.X(1.2),C.Y(.62),'轉速頻率',15,'rgba(227,236,238,.8)',600,'center');
  alphaDo(seg(u,.36,.42),()=>{circ(C.X(6.3),C.Y(.72),10,null,'#e8572a',2.5);wt(C.X(6.3)+16,C.Y(.78),'軸承缺陷頻率',17,'#ff9d7a',700,'left');});
  /* 右下：趨勢 */
  const D=chartBox(800,490,740,310,{title:'軸承溫度與振動趨勢（示例）',x0:0,x1:12,y0:0,y1:1,xt:[0,3,6,9,12],yt:[],xl:'月',pl:60,pt:60,pb:52,gx:4,gy:2});
  const lv=m=>.22+.02*Math.sin(m*2.3)+(m>6?.055*Math.pow(m-6,1.6):0);
  ctx.setLineDash([7,6]);ln([D.px,D.Y(.62),D.px+D.pw,D.Y(.62)],'#e8572a',2);ctx.setLineDash([]);wt(D.px+10,D.Y(.62)-10,'警戒值',16,'#ff9d7a',700);
  const mE=10.6*seg(u,.56,.8);if(mE>0){ctx.beginPath();for(let m=0;m<=mE;m+=.1){const x=D.X(m),y=D.Y(Math.min(.95,lv(m)));m?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#f2c230';ctx.lineWidth=3;ctx.stroke();}
  alphaDo(seg(u,.78,.84),()=>{const m=10.3;circ(D.X(m),D.Y(lv(m)),8,'#ff9d7a','#13232e',2);tag(D.X(6.6),D.Y(.84),'備料並排定更換',{size:17,bg:'#7dffc4',align:'center'});});
 }},

/* 5 ─────────────────────────────── 保養與可用率 */
{t:'定期保養與可用率',en:'Scheduled service and availability',dur:13,
 d:'除了發現問題才維修，風機也有固定的保養週期，常見是半年一次例行保養、一年一次較完整的年度保養。內容包括檢查塔架與葉片螺栓扭力、補充潤滑脂與更換濾芯、油品取樣、測試變槳與偏航系統，以及升降設備與安全裝置。台灣西部沿海秋冬東北季風最強，也是發電最多的時候，保養多排在風小的季節。衡量運維成果的指標是可用率，業界常以 97% 以上為目標，相當於全年停機少於約 11 天。',
 s:[[0,'保養排進行事曆，避開季風最強的月份'],[.3,'每次保養檢查螺栓、潤滑、油品與控制系統'],[.55,'可用率：一年之中可以運轉的時間比例'],[.8,'業界常以 97% 以上為目標']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'一年的保養行事曆（示例）',20,'#f2c230',700);
  const WS=[8.6,8.2,7.1,5.8,4.9,4.6,4.4,4.8,5.9,7.8,8.8,9.0];   // 月平均風速（示意）
  const mx=i=>100+i*52,by=470;
  WS.forEach((v,i)=>{const g=ease(seg(u,.02+i*.012,.1+i*.012));box(mx(i),by-v*22*g,40,v*22*g,v>7?'rgba(125,200,220,.75)':'rgba(125,200,220,.35)');
   wt(mx(i)+20,by+24,trf('{m} 月',{m:i+1}),15,'rgba(227,236,238,.85)',600,'center');});
  alphaDo(seg(u,.08,.14),()=>{wt(84,250,'月平均風速',16,'#7dc8dc',700);tag(mx(10)+20,by-230,'東北季風',{size:15,bg:'#7dc8dc',align:'center'});
   box(mx(6),by-150,mx(8)+40-mx(6),150,'rgba(232,87,42,.12)');wt(mx(7)+20,by-128,'颱風季',15,'#ff9d7a',700,'center');});
  [[3,'半年保養'],[8,'年度保養']].forEach(([i,t],j)=>alphaDo(seg(u,.14+j*.06,.2+j*.06),()=>{const x=mx(i)+20;
   poly([x,by-150,x-10,by-168,x+10,by-168],'#f2c230');ln([x,by-150,x,by],'rgba(242,194,48,.7)',2);tag(x,by-190,t,{size:15,bg:'#f2c230',align:'center'});}));
  const IT=['螺栓扭力','潤滑與濾芯','油品取樣','變槳與偏航','升降與安全設備','葉片外觀'];
  IT.forEach((t,i)=>alphaDo(seg(u,.3+i*.03,.34+i*.03),()=>{const x=90+(i%2)*330,y=560+Math.floor(i/2)*66;
   box(x,y,300,50,'rgba(255,255,255,.05)','rgba(255,255,255,.14)',1);ring(x+23,y+25,10,'#7dffc4',2);
   ln([x+17,y+25,x+22,y+31,x+30,y+19],'#7dffc4',2.5);wt(x+46,y+32,t,18,'#fff',700);}));
  /* 右：可用率 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'可用率怎麼算',20,'#f2c230',700);
  alphaDo(seg(u,.52,.58),()=>{wt(1170,270,'可用率 = 可運轉時數 ÷ 全年時數',22,'#fff',700,'center');});
  const bx=850,bw=640,byy=330,f=seg(u,.56,.78);
  box(bx,byy,bw,46,'rgba(255,255,255,.06)','rgba(255,255,255,.2)',1);
  const DN=[[.30,.01,'#f2c230'],[.66,.01,'#f2c230'],[.12,.006,'#b37cff'],[.47,.008,'#b37cff'],[.85,.006,'#7dc8dc']];
  if(f>0){box(bx,byy,bw*f,46,'rgba(125,255,196,.55)');DN.forEach(([p,w,c])=>{if(p<f)box(bx+bw*p,byy,Math.max(4,bw*w),46,c);});}
  wt(bx,byy+74,'1 月',15,'rgba(227,236,238,.75)',600,'left');wt(bx+bw,byy+74,'12 月',15,'rgba(227,236,238,.75)',600,'right');
  alphaDo(seg(u,.6,.66),()=>{[['可運轉','#7dffc4'],['計畫保養','#f2c230'],['故障維修','#b37cff'],['等待零件','#7dc8dc']].forEach(([t,c],i)=>{const x=850+i*165;box(x,byy+100,16,16,c);wt(x+24,byy+114,t,16,'rgba(227,236,238,.9)',600);});});
  const av=lerp(90,97.2,ease(seg(u,.6,.82)));
  alphaDo(seg(u,.6,.66),()=>{wt(1170,630,av.toFixed(1)+'%',72,'#7dffc4',700,'center',COND);wt(1170,670,'全年可用率',18,'rgba(227,236,238,.9)',700,'center');});
  alphaDo(seg(u,.82,.88),()=>tag(1170,730,'停機少於約 263 小時，約 11 天',{size:17,bg:'#f2c230',align:'center'}));
 }},

/* 6 ─────────────────────────────── 噪音與鳥類 */
{t:'噪音與鳥類監測',en:'Monitoring noise and birds',dur:14,side:true,
 d:'風場運轉後還要對環境負責。風機的聲音來自葉片劃過空氣與機艙內的齒輪箱，隨距離逐漸減弱。台灣的噪音管制標準把風力發電機組獨立列管，量測點在陳情民眾指定的住家室內；20–200 Hz 低頻噪音在第一、二類管制區夜間不得超過 36 dB(A)。生態方面，西部沿海是候鳥遷徙路線，風場依環評承諾進行鳥類調查與風機下方的撞擊巡查，部分風場以雷達偵測鳥群，必要時讓風機降速或暫停。',
 s:[[0,'風機運轉的聲音，隨距離逐漸減弱'],[.25,'依法在民眾住家室內量測，低頻有專屬標準'],[.5,'鳥類雷達持續掃描風場上空'],[.72,'鳥群接近時，風機降速暫停，讓牠們通過']],
 cam:u=>({x:800,y:450,s:1}),
 draw(u){
  const TX=380,sp=x=>x<.66?1.1:x<.76?lerp(1.1,0,ease(seg(x,.66,.76))):x<.93?0:lerp(0,1.1,seg(x,.93,1));
  const rot=spin(u,14,sp);
  const T=turbine(TX,gyy(TX),270,150,rot);
  /* 噪音等值線 */
  const kn=band(u,.02,.5);if(kn>0)alphaDo(kn,()=>{[[220,'45'],[420,'40'],[640,'35']].forEach(([r,t],i)=>{const p=(TT*.25+i*.33)%1;
    ctx.setLineDash([8,8]);ctx.beginPath();ctx.arc(T.x,T.y,r,-Math.PI/2+.25,.52);ctx.strokeStyle=`rgba(242,194,48,${.85-i*.2})`;ctx.lineWidth=2.5;ctx.stroke();ctx.setLineDash([]);
    const a=.3;wt(T.x+Math.cos(a)*r+8,T.y+Math.sin(a)*r,t+' dB(A)',16,'#13232e',700,'left',COND);});});
  house(1000,110,70);house(1150,90,60,'#dfe5e8');house(1290,120,74);
  alphaDo(band(u,.22,.5),()=>{const x=1055,y=gyy(1055)-26;box(x-8,y-10,16,14,'#f2c230','#13232e',1);});
  /* 鳥類雷達 */
  const RX=760,RY=gyy(760);box(RX-14,RY-40,28,40,'#9aa3a8','rgba(0,0,0,.3)',1);
  const ra=TT*2.2;ctx.save();ctx.translate(RX,RY-46);box(-20,-4,40,8,'#dfe5e8');ctx.restore();
  const kr=seg(u,.46,.52);if(kr>0)alphaDo(kr*.5,()=>{const a0=-Math.PI+((ra%Math.PI)+Math.PI)%Math.PI;
    ctx.beginPath();ctx.moveTo(RX,RY-46);ctx.arc(RX,RY-46,560,a0-.12,a0+.12);ctx.closePath();ctx.fillStyle='rgba(125,255,196,.35)';ctx.fill();
    ctx.setLineDash([4,8]);ctx.beginPath();ctx.arc(RX,RY-46,560,-Math.PI,0);ctx.strokeStyle='rgba(125,255,196,.5)';ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([]);});
  /* 鳥群 */
  const bp=seg(u,.5,.98);if(bp>0&&bp<1){const cx=lerp(1400,-150,bp),cy=250+30*Math.sin(bp*3);
   const F=[[0,0],[-16,-10],[-16,10],[-32,-20],[-32,20],[-48,-30],[16,-6]];
   F.forEach(([dx,dy],i)=>vbird(cx-dx,cy+dy,1.3,TT*9+i));
   alphaDo(band(u,.6,.76),()=>ring(cx+20,cy,44,'#e8572a',2.5));
   lab(cx+20,cy+40,'偵測到鳥群',{dx:0,dy:60,st:'w',a:band(u,.6,.76)});}
  lab(T.x+230,T.y-40,'噪音隨距離減弱',{dx:40,dy:-60,st:'s',a:band(u,.05,.26)});
  lab(1055,gyy(1055)-30,'住家室內量測點',{dx:-40,dy:-90,a:band(u,.24,.5)});
  lab(RX,RY-46,'鳥類雷達',{dx:80,dy:-50,st:'g',a:band(u,.48,.66)});
  lab(T.x,T.y,'降速暫停',{dx:120,dy:-40,st:'w',a:band(u,.74,.94)});
 },
 hud(u){hudPanel(250,150,'噪音監測（示例）',band(u,.05,.46),w=>{
  hrow(56,'低頻量測值',trf('{d} dB(A)',{d:(31.4+.6*nz(TT*.5)).toFixed(1)}),w,'#7dffc4');hrow(88,'夜間管制值','36 dB(A)',w,'#ff9d7a');hrow(120,'管制區','第二類',w,'#fff');});}},

/* 7 ─────────────────────────────── 運維循環與台灣挑戰 */
{t:'運維的循環',en:'The O&M cycle',dur:13,
 d:'運維不是一次性的工作，而是一個循環：SCADA 與 CMS 持續監測，資料分析找出異常並判斷原因，排定人力、零件與吊機，完成維修後再從數據確認出力回到正常。能及早發現，就能把突發故障變成計畫中的工作。台灣沿海風場還有在地的考驗：颱風前要檢查設備，颱風中風機順槳停機並持續監控；海風帶來的鹽霧會腐蝕塔架與電氣設備，需要防蝕塗裝與機艙空氣過濾。做好這些，風機才能穩定運轉約二十年的設計壽命。',
 s:[[0,'監測、診斷、排程、維修，再回到監測'],[.3,'及早發現，把故障變成計畫中的工作'],[.55,'颱風、鹽霧與季風，是台灣沿海風場的考驗'],[.8,'好的運維，讓風機穩定運轉二十年']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'預測性維護的循環',20,'#f2c230',700);
  const cx=410,cy=490,R=210,N=['監測','診斷','排程','維修','驗證'],SUB=['SCADA / CMS','找出原因','人力・零件','現場作業','出力恢復'];
  ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=3;ctx.stroke();
  const pr=seg(u,.04,.5);
  if(pr>0){ctx.beginPath();ctx.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+TAU*pr);ctx.strokeStyle='#f2c230';ctx.lineWidth=4;ctx.stroke();
   const a=-Math.PI/2+TAU*pr;circ(cx+Math.cos(a)*R,cy+Math.sin(a)*R,8,'#f2c230');}
  N.forEach((t,i)=>{const a=-Math.PI/2+i*TAU/5,x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R,on=pr>=i/5-.001;
   circ(x,y,50,on?'#16384c':'#0e2a3b',on?'#f2c230':'rgba(255,255,255,.3)',3);
   wt(x,y+2,t,20,on?'#f2c230':'rgba(227,236,238,.6)',800,'center');wt(x,y+24,SUB[i],13,'rgba(227,236,238,.8)',600,'center');});
  alphaDo(seg(u,.3,.36),()=>{wt(cx,cy-6,'及早發現',22,'#7dffc4',800,'center');wt(cx,cy+26,'故障 → 計畫工作',18,'#fff',700,'center');});
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'台灣沿海風場的考驗',20,'#f2c230',700);
  const CH=[['颱風','颱風前檢查設備','颱風中順槳停機、持續監控','#ff9d7a'],['鹽霧','防蝕塗裝與定期補漆','機艙與電氣室空氣過濾','#7dc8dc'],['東北季風','秋冬風大、發電多','保養排在風小的季節','#7dffc4']];
  CH.forEach(([h,a,b,c],i)=>alphaDo(seg(u,.52+i*.06,.58+i*.06),()=>{const y=250+i*150;
   box(830,y,680,128,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);box(830,y,6,128,c);
   const ix=900,iy=y+64;
   if(i===0){ctx.beginPath();for(let t=0;t<14;t+=.1){const r=4+t*2.6,q=t-TT*2;ctx.lineTo(ix+Math.cos(q)*r,iy+Math.sin(q)*r);}ctx.strokeStyle=c;ctx.lineWidth=3;ctx.stroke();}
   else if(i===1){for(let k=0;k<7;k++){const p=(TT*.5+k/7)%1;circ(ix-30+k*10,iy-30+p*60,3.2,c);}}
   else{for(let k=0;k<4;k++){const p=(TT*.8+k*.25)%1;ln([ix-36+p*20,iy-24+k*16,ix+4+p*20,iy-24+k*16],c,3);}}
   wt(960,y+42,h,21,c,800);wt(960,y+76,a,18,'#fff',600);wt(960,y+106,b,18,'rgba(227,236,238,.85)',600);}));
  alphaDo(seg(u,.8,.86),()=>tag(1170,760,'目標：穩定運轉約 20 年設計壽命',{size:17,bg:'#f2c230',align:'center'}));
 }}
]};
