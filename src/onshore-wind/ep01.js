// KITS: land
/* 陸域風電系列 第 1 集：陸域風機運輸與吊裝 */
const M=3.5;                                   // 吊裝分鏡的比例：每公尺 3.5 px（世界座標）
const TX=820;                                  // 風機位置
const SEC=[22,24,25,26];                       // 塔架四段高度（m，示例，合計 97 m）
const DIA=[4.4,4.1,3.8,3.4,3.0];               // 各段接縫處直徑（m，示例）
const BL=67*M;                                 // 葉片長 67 m
const MCX=1040;                                // 主吊機（履帶式）位置
const TCX=470;                                 // 輔助吊機（輪式）位置
const gyy=x=>groundY(x);
const secBase=i=>gyy(TX)-M*SEC.slice(0,i).reduce((a,b)=>a+b,0);
const TOPY=()=>secBase(4);                     // 塔頂 y
const HUBY=()=>TOPY()-11;                      // 輪轂中心 y
/* 由 B（底）到 T（頂）的錐形塔架段，w0/w1 為兩端寬度 */
function secQuad(bx,by,tx,ty,w0,w1){
  const L=Math.hypot(tx-bx,ty-by)||1,nx=-(ty-by)/L,ny=(tx-bx)/L;
  poly([bx+nx*w0/2,by+ny*w0/2,tx+nx*w1/2,ty+ny*w1/2,tx-nx*w1/2,ty-ny*w1/2,bx-nx*w0/2,by-ny*w0/2],'#eef2f4','rgba(0,0,0,.35)',1);
  ln([bx+nx*w0/2,by+ny*w0/2,bx-nx*w0/2,by-ny*w0/2],'#8d989f',2);ln([tx+nx*w1/2,ty+ny*w1/2,tx-nx*w1/2,ty-ny*w1/2],'#8d989f',2);
}
function towerUpTo(n){for(let i=0;i<n;i++)secQuad(TX,secBase(i),TX,secBase(i+1),DIA[i]*M,DIA[i+1]*M);}
function pedestal(){box(TX-16,gyy(TX)-4,32,8,'#9aa3a8','rgba(0,0,0,.3)',1);}
/* 正視的葉片：中心 (cx,cy)，角度 a，葉根距中心 7 px */
function bladeFront(cx,cy,a,L){ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
  poly([7,-4,7+L*.2,-7,7+L,-1,7+L,1,7+L*.2,6,7,4],'#f4f6f7','rgba(0,0,0,.35)',1);ctx.restore();}
/* 正視的機艙與輪轂：(x,y) 為塔頂 */
function nacFront(x,y){box(x-11,y-20,22,18,'#e3e8ec','rgba(0,0,0,.35)',1);circ(x,y-11,7,'#dfe5e8','rgba(0,0,0,.4)',1);circ(x,y-11,2.5,'#8d989f');}
/* 履帶式主吊機（吊臂向左）；回傳吊臂支點 */
function crawler(px){const g=gyy(px);box(px-62,g-16,124,16,'#2b3137');for(let i=0;i<6;i++)circ(px-50+i*20,g-8,6,'#555','#222',1);
  box(px-40,g-44,92,28,'#e9b21f','rgba(0,0,0,.3)',1);box(px+30,g-62,36,46,'#c99a16','rgba(0,0,0,.3)',1);box(px-46,g-62,26,22,'#f4f6f7');box(px-42,g-58,16,11,'#2a3a46');return {x:px-10,y:g-44};}
/* 輪式輔助吊機（吊臂向右）；回傳支點 */
function truckCrane(px){const g=gyy(px);box(px-62,g-30,124,20,'#e9b21f','rgba(0,0,0,.3)',1);box(px-70,g-44,26,34,'#f4f6f7');box(px-66,g-40,16,12,'#2a3a46');
  for(const wx of [-50,-26,20,44])circ(px+wx,g-8,8,'#222','#555',2);box(px-10,g-42,40,14,'#c99a16');return {x:px+14,y:g-40};}
/* 側視的葉片（平放，葉根在右）*/
function bladeSide(x0,y,L){poly([x0,y-24,x0-L*.08,y-26,x0-L*.28,y-32,x0-L,y-13,x0-L,y-9,x0-L*.28,y-5,x0-L*.08,y-3,x0,y-3],'#eef2f4','rgba(0,0,0,.4)',1);ln([x0,y-24,x0,y-3],'#8d989f',3);}
/* 夜間運輸車隊：xf 為曳引車車頭 */
const RY=GY+14;
function escortCar(x){box(x-34,RY-20,68,14,'#dfe5e8');box(x-20,RY-30,36,11,'#c9d1d6');circ(x-20,RY-5,6,'#222');circ(x+20,RY-5,6,'#222');
  const f=.5+.5*Math.sin(TT*9);alphaDo(f,()=>{circ(x-2,RY-33,4,'#f2c230');const g=ctx.createRadialGradient(x-2,RY-33,2,x-2,RY-33,40);g.addColorStop(0,'rgba(242,194,48,.5)');g.addColorStop(1,'rgba(242,194,48,0)');ctx.fillStyle=g;ctx.fillRect(x-42,RY-73,80,80);});}
function convoy(xf){
  poly([xf,RY-26,xf+260,RY-60,xf+260,RY+6,xf,RY-12],'rgba(255,244,200,.12)');
  box(xf-80,RY-10,80,6,'#2b3137');box(xf-46,RY-50,44,40,'#e8572a');box(xf-38,RY-44,26,14,'#2a3a46');box(xf-80,RY-22,34,12,'#394650');
  for(const wx of [-66,-50,-12])circ(xf+wx,RY-4,8,'#222','#555',2);
  box(xf-360,RY-16,300,5,'#6f7a80');
  box(xf-130,RY-22,50,12,'#394650');for(const wx of [-122,-104,-88])circ(xf+wx,RY-4,7,'#222','#555',2);
  box(xf-380,RY-22,70,12,'#394650');for(const wx of [-372,-356,-340,-324])circ(xf+wx,RY-4,7,'#222','#555',2);
  box(xf-112,RY-34,14,12,'#8d989f');box(xf-356,RY-34,14,12,'#8d989f');
  bladeSide(xf-88,RY-22,420);
  alphaDo(.5+.5*Math.sin(TT*9+1.5),()=>circ(xf-506,RY-34,3.5,'#e8572a'));
}
function nightBase(){
  const g=ctx.createLinearGradient(0,VY0,0,GY);g.addColorStop(0,'#071424');g.addColorStop(1,'#1c3551');ctx.fillStyle=g;ctx.fillRect(VX0,VY0,VX1-VX0,GY-VY0+20);
  const r=rng(5);for(let i=0;i<90;i++){const x=r()*2800-500,y=VY0+r()*380,s=r();circ(x,y,.8+s*1.2,`rgba(255,255,255,${.3+.5*s})`);}
  ctx.beginPath();ctx.moveTo(VX0,GY);for(let x=VX0;x<=VX1;x+=10)ctx.lineTo(x,GY-60-40*nz(x*.004)-20*nz(x*.013+3));ctx.lineTo(VX1,GY);ctx.closePath();ctx.fillStyle='#10233a';ctx.fill();
  drawGround();box(VX0,GY-20,VX1-VX0,VY1-GY+40,'rgba(4,12,24,.55)');
  box(VX0,GY+2,VX1-VX0,16,'#2a2f35');ctx.setLineDash([22,18]);ln([VX0,GY+10,VX1,GY+10],'rgba(255,255,255,.5)',1.5);ctx.setLineDash([]);
  for(let x=Math.floor((VX0+400)/300)*300-400;x<VX1+300;x+=300){ln([x,GY+2,x,GY-150,x+26,GY-150],'#4a5560',3);
   const q=ctx.createRadialGradient(x+26,GY-146,2,x+26,GY-146,120);q.addColorStop(0,'rgba(255,220,150,.35)');q.addColorStop(1,'rgba(255,220,150,0)');ctx.fillStyle=q;ctx.fillRect(x-94,GY-266,240,240);circ(x+26,GY-147,4,'#ffe7b0');}
}
/* 轉彎路徑（俯視）：s 為沿中心線距離 */
const RC={x:760,y:720,r:400};
function roadPt(s){if(s<80)return {x:360,y:800-s,a:-Math.PI/2};const A=RC.r*Math.PI/2;
  if(s<80+A){const a=Math.PI+(s-80)/RC.r;return {x:RC.x+RC.r*Math.cos(a),y:RC.y+RC.r*Math.sin(a),a:a+Math.PI/2};}
  return {x:RC.x+(s-80-A),y:RC.y-RC.r,a:0};}
function bladeTop(F,R,col,st){const L=Math.hypot(R.x-F.x,R.y-F.y)||1,dx=(R.x-F.x)/L,dy=(R.y-F.y)/L,nx=-dy,ny=dx;
  const p=(t,w)=>[F.x+dx*t+nx*w,F.y+dy*t+ny*w];const pts=[p(20,-8),p(95,-11),p(320,-2),p(320,2),p(95,11),p(20,8)].flat();poly(pts,col,st,1);}
/* 基礎剖面（側視）*/
const FG=()=>gyy(800);
function footPoly(){const g=FG(),b=g+90;return [600,b,1000,b,1000,b-30,860,b-70,860,g-8,740,g-8,740,b-70,600,b-30];}
function excavator(x,dig){const g=gyy(x);box(x-50,g-14,100,14,'#2b3137');for(let i=0;i<5;i++)circ(x-40+i*20,g-7,5,'#555');box(x-40,g-50,70,36,'#e9b21f','rgba(0,0,0,.3)',1);box(x-36,g-46,20,16,'#2a3a46');
  const sx=x+30,sy=g-40,ex=x+110,ey=g-110,bx=x+150+20*Math.sin(dig*TAU),by=g+20+40*(.5+.5*Math.cos(dig*TAU));
  ln([sx,sy,ex,ey],'#e9b21f',9);ln([ex,ey,bx,by],'#e9b21f',6);poly([bx-10,by-6,bx+12,by-2,bx+8,by+14,bx-8,by+12],'#394650');}
function pumpTruck(x,a){const g=gyy(x);truck(x,g,true,'#dfe5e8');const b0={x:x-60,y:g-44},p1={x:x-120,y:g-230},p2={x:880,y:g-250},p3={x:820,y:g-60};
  alphaDo(a,()=>{ln([b0.x,b0.y,p1.x,p1.y,p2.x,p2.y,p3.x,p3.y],'#e8572a',6);circ(p1.x,p1.y,5,'#394650');circ(p2.x,p2.y,5,'#394650');});return p3;}
/* 輪轂高度風速（示意，m/s）*/
const wnd=h=>8.6+3.6*Math.sin(h/7+.6)+1.8*Math.sin(h/2.3)+1.0*Math.sin(h/1.1+2);
const hubWind=()=>6.4+1.2*nz(TT*.4)+.4*Math.sin(TT*2.3);

const EP={no:1,slug:'onshore-wind',seriesName:'陸域風電系列',t:'陸域風機運輸與吊裝',en:'Transporting and erecting an onshore wind turbine',
lede:'一支 67 公尺長的葉片，要怎麼從港口開上鄉間道路？一座將近 100 公尺高的風機，又是怎麼一段一段疊起來的？這一集跟著陸域風機從夜間運輸、基礎開挖澆置，到主吊機與輔助吊機合作吊裝塔架、機艙與葉片。',
facts:[['67','m','4.2 MW 級陸域風機常見的葉片長度，需以伸縮式拖板車夜間運輸（示例）'],
['約 99','m','這類機型的輪轂高度；加上葉片，葉尖最高約 166 m'],
['600–1,000','m³','一座擴展式基礎常見的混凝土用量（示例）'],
['約 180','支','基礎內錨栓籠常見的錨栓數量，把塔架鎖在基礎上（示例）'],
['600–800','t','吊裝 3–5 MW 級風機常用的履帶式主吊機等級'],
['約 10','m/s','葉片吊裝常見的風速上限；實際依製造商規定（示例）']],
note:'說明：本集為教育用途示意動畫，車輛、吊機與風機比例經過調整。風機尺寸以台灣已設置的 4.2 MW 級陸域風機（葉片約 67 m、輪轂高度約 99 m、總高約 166 m）為典型範例；塔架分段、各段重量、基礎尺寸（直徑約 20 m）、混凝土量、錨栓數量與吊裝風速上限皆為產業常見的典型範例，實際依各機型、地質鑽探結果、製造商吊裝手冊與主管機關核定內容而定。超長貨物上路需依規定申請臨時通行許可，本集路線與時間為示意情境。',
base:()=>{landSky(GY,{sun:{x:1320,y:120},clouds:false});drawGround();},
shots:[
{t:'夜間的超長貨物',en:'Oversized cargo at night',dur:12,side:true,
 d:'陸域風機的葉片、塔架與機艙多由國外製造，海運到台中港等港口卸船後，再走公路運到風場。一支 67 公尺的葉片放在伸縮式拖板車上，整個車隊長度可達 80 公尺左右，比一般聯結車長好幾倍。為了減少對交通的衝擊，超長貨物通常在深夜分段通行，由前導車與後衛車護送，車速很慢，遇到彎道或路口還要停下來調整。',
 s:[[0,'深夜，一支 67 公尺的葉片駛上道路'],[.3,'伸縮式拖板車把葉片架在前後兩組車軸上'],[.55,'前導車與後衛車閃著黃燈護送'],[.78,'車速很慢，避開白天的車流']],
 base:()=>nightBase(),
 cam:u=>({x:lerp(560,1180,u),y:470,s:1.1}),
 draw(u){const xf=lerp(760,1460,u);
  escortCar(xf+170);convoy(xf);escortCar(xf-620);
  lab(xf-300,RY-50,'葉片長 67 m',{dx:-20,dy:-90,st:'s',a:band(u,.04,.5)});
  lab(xf-240,RY-14,'伸縮式拖板車',{dx:40,dy:80,a:band(u,.3,.75)});
  lab(xf+170,RY-34,'前導車',{dx:30,dy:-70,st:'l',a:band(u,.55,1)});
  lab(xf-620,RY-34,'後衛車',{dx:-20,dy:-70,st:'l',a:band(u,.58,1)});
 },
 hud(u){hudPanel(240,150,'運輸車隊（示例）',seg(u,.05,.1),w=>{const h=23+3*u;
  hrow(56,'時間',trf('{h}:{m}',{h:Math.floor(h)%24,m:String(Math.floor((h%1)*60)).padStart(2,'0')}),w,'#fff');
  hrow(88,'車速',trf('{v} km/h',{v:Math.round(12+4*Math.sin(TT*.7))}),w,'#f2c230');hrow(120,'車隊總長','約 80 m',w,'#7dffc4');});}},

{t:'轉彎需要多大空間',en:'How much room a turn takes',dur:13,
 d:'長貨物轉彎時，車頭與後車軸走的路線不同：兩者之間的葉片會切向彎道內側，而伸出後車軸之外的葉尖則往外側甩出。從上方看，整支葉片掃過的範圍遠大於道路本身。因此運輸前要逐段檢討路線：轉彎半徑與路寬是否足夠、橋梁能否承重、架空線與號誌是否擋路，必要時臨時拓寬或移除護欄。山區窄路也可以改用葉片舉升車，把葉片斜舉起來通過。',
 s:[[0,'從上方看，葉片在彎道上掃過的範圍'],[.3,'車身中段切向內側，葉尖往外側甩出'],[.55,'路寬、轉彎半徑與障礙物都要事先檢討'],[.78,'必要時臨時拓寬路面、移除護欄']],
 draw(u){
  diagBG();
  card(60,160,800,640,{bg:'rgba(7,27,39,.75)'});
  ctx.save();ctx.beginPath();ctx.rect(62,162,796,636);ctx.clip();
  const road=w=>{ctx.beginPath();for(let s=-40;s<=860;s+=6){const p=roadPt(s);s>-40?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}ctx.lineWidth=w;ctx.lineCap='butt';};
  road(52);ctx.strokeStyle='rgba(227,236,238,.7)';ctx.stroke();road(48);ctx.strokeStyle='#3a4148';ctx.stroke();
  ctx.setLineDash([12,10]);road(1.5);ctx.strokeStyle='rgba(255,255,255,.55)';ctx.stroke();ctx.setLineDash([]);
  const s1=lerp(240,820,ease(seg(u,.06,.8)));
  for(let k=0;k<=36;k++){const s=lerp(240,s1,k/36);bladeTop(roadPt(s),roadPt(s-230),'rgba(232,87,42,.07)');}
  const F=roadPt(s1),R=roadPt(s1-230);
  bladeTop(F,R,'#eef2f4','rgba(0,0,0,.4)');
  ctx.save();ctx.translate(F.x,F.y);ctx.rotate(F.a);box(-6,-11,40,22,'#e8572a');box(22,-9,10,18,'#2a3a46');ctx.restore();
  circ(R.x,R.y,6,'#f2c230');
  ctx.restore();
  wt(84,200,'轉彎時的掃掠範圍（俯視示意）',20,'#f2c230',700);
  alphaDo(seg(u,.3,.36),()=>{wt(560,560,'內側掃掠',18,'#ff9d7a',700,'center');wt(180,470,'外側懸伸',18,'#ff9d7a',700,'center');});
  alphaDo(seg(u,.08,.14),()=>{circ(104,760,6,'#f2c230');wt(120,766,'後車軸',16,'rgba(227,236,238,.9)',600);box(220,752,26,14,'#e8572a');wt(256,766,'曳引車',16,'rgba(227,236,238,.9)',600);box(350,753,26,12,'rgba(232,87,42,.5)');wt(386,766,'葉片掃過的範圍',16,'rgba(227,236,238,.9)',600);});
  /* 右：路線檢討 */
  card(900,160,640,640,{bg:'rgba(7,27,39,.75)'});wt(924,200,'運輸前的路線檢討',20,'#f2c230',700);
  const L=[['轉彎半徑與路寬','不足時臨時拓寬、移除護欄'],['坡度與橋梁承載','確認車重與坡度可以通行'],['架空線、號誌與路樹','事先移設、升高或修剪'],['夜間分段通行','申請臨時通行許可，減少交通衝擊']];
  L.forEach(([t,s],i)=>{const a=seg(u,.5+i*.07,.56+i*.07);if(a<=0)return;alphaDo(a,()=>{const y=230+i*112;card(924,y,592,96,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});
   circ(966,y+48,22,'#7dffc4');wt(966,y+49,String(i+1),22,'#0e2a3b',700,'center',COND,'middle');wt(1004,y+40,t,20,'#fff',700);wt(1004,y+72,s,17,'rgba(227,236,238,.85)',500);});});
  alphaDo(seg(u,.82,.88),()=>wt(924,712+60,'山區窄路可改用葉片舉升車斜舉通過',17,'#7dffc4',600));
 }},

{t:'基礎開挖與澆置',en:'Excavating and pouring the foundation',dur:14,side:true,
 d:'風機蓋在一座大型鋼筋混凝土基礎上。常見的擴展式基礎直徑約 20 公尺、深約 3 公尺：先開挖並鋪一層墊層混凝土，再綁紮上下兩層放射狀與環狀鋼筋，中央放入錨栓籠。錨栓籠由上百支高強度錨栓與上下錨板組成，日後塔架底部法蘭就鎖在這些錨栓上。混凝土常需連續澆置十幾個小時，用量約 600 至 1,000 立方公尺，最後回填覆土增加壓重。',
 s:[[0,'怪手開挖直徑約 20 公尺的基坑'],[.26,'鋪墊層、綁鋼筋，中央放入錨栓籠'],[.46,'泵浦車連續澆置數百立方公尺混凝土'],[.74,'回填覆土，只留下中央的基座與錨栓']],
 cam:u=>camMix({x:800,y:520,s:1.05},{x:810,y:600,s:1.55},ease(seg(u,.02,.2))),
 draw(u){
  const g=FG(),b=g+90,dig=seg(u,.04,.24),P=footPoly();
  const d=90*dig;
  /* 基坑 */
  if(dig>0){poly([560,g,1040,g,1040-40*dig,g+d,560+40*dig,g+d],'#5e4a38');poly([560,g,1040,g,1040-40*dig,g+d,560+40*dig,g+d],null,'rgba(0,0,0,.35)',1.5);}
  const lean=seg(u,.25,.3),reb=seg(u,.29,.42),cage=seg(u,.34,.44),pour=seg(u,.47,.72),back=seg(u,.75,.9);
  alphaDo(lean,()=>box(596,b,408,8,'#b7bcbf'));
  alphaDo(cage,()=>{for(let i=0;i<9;i++){const x=752+i*12;ln([x,b-4,x,g-24],'#c9d1d6',2);}box(746,b-10,108,6,'#8d989f');box(746,g-30,108,6,'#8d989f');});
  if(reb>0){ctx.strokeStyle='#b5653a';ctx.lineWidth=2;ctx.beginPath();const n=Math.floor(30*reb);for(let i=0;i<=n;i++){const x=606+i*13;ctx.moveTo(x,b-6);ctx.lineTo(x,b-26);}ctx.moveTo(606,b-8);ctx.lineTo(606+13*n,b-8);ctx.moveTo(606,b-24);ctx.lineTo(606+13*n,b-24);ctx.stroke();}
  if(pour>0){const lv=lerp(b,g-8,pour);ctx.save();ctx.beginPath();ctx.rect(560,lv,500,b-lv+2);ctx.clip();poly(P,'#b9bec2','rgba(0,0,0,.35)',1.5);ctx.restore();}
  if(back>0)alphaDo(back,()=>{poly([560,g,740,g,740,b-70,600,b-30,560+40,b-30],'#8a6f55');poly([860,g,1040,g,1000,b-30,1000,b-30,860,b-70],'#8a6f55');ln([560,g,1040,g],'#5c8a3f',3);});
  if(pour>=1){box(740,g-8,120,8,'#b9bec2','rgba(0,0,0,.35)',1);for(let i=0;i<9;i++){const x=752+i*12;ln([x,g-8,x,g-20],'#c9d1d6',2.5);}}
  /* 機具 */
  alphaDo(1-seg(u,.3,.38),()=>excavator(450,TT*.35));
  const pa=seg(u,.42,.48)*(1-seg(u,.74,.8));
  if(pa>0)alphaDo(pa,()=>{const e=pumpTruck(1250,1);const lv=lerp(b,g-8,pour);for(let k=0;k<6;k++){const f=(TT*1.4+k/6)%1;circ(e.x+3*Math.sin(k),lerp(e.y,lv,f),3.5,'#9aa3a8');}});
  lab(800,g+d-10,'基坑 深約 3 m',{dx:-60,dy:-120,st:'n',a:band(u,.08,.28)});
  lab(700,b-16,'上下兩層鋼筋',{dx:-80,dy:80,st:'w',a:band(u,.3,.47)});
  lab(800,g-28,'錨栓籠',{dx:40,dy:-110,st:'s',a:band(u,.36,.5)});
  lab(920,b-40,'混凝土',{dx:60,dy:90,st:'g',a:band(u,.52,.76)});
  lab(650,g,'回填覆土',{dx:-60,dy:-80,st:'n',a:band(u,.82,1)});
  lab(800,g-18,'基座與錨栓',{dx:60,dy:-90,st:'s',a:band(u,.84,1)});
 },
 hud(u){hudPanel(240,150,'基礎工程（示例）',seg(u,.05,.1),w=>{const st=u<.25?'開挖':u<.46?'綁紮鋼筋':u<.74?'澆置混凝土':'回填';
  hrow(56,'工項',st,w,'#f2c230');hrow(88,'開挖深度',trf('{d} m',{d:(3*seg(u,.04,.24)).toFixed(1)}),w,'#fff');
  const c=Math.round(750*seg(u,.47,.72));hrow(120,'混凝土',trf('{c} m³',{c:c.toLocaleString('en-US')}),w,'#7dffc4');hbar(14,132,w-28,c/750,'#7dffc4');});}},

{t:'基礎為什麼不會倒',en:'Why the foundation does not tip over',dur:12,
 d:'風吹在葉片上，會在輪轂高度產生很大的推力。推力乘上將近 100 公尺的力臂，在塔底形成巨大的傾倒力矩。擴展式基礎靠兩件事抵抗：一是基礎本身與上方覆土的重量，二是寬大的底面把力分散到地盤。風越大，下風側的地盤反力越高、上風側越低，設計時要確保底面不會翹起、地盤不會被壓壞。基礎型式由地質鑽探決定，軟弱地盤常改用樁基礎。',
 s:[[0,'風的推力作用在將近 100 公尺高的輪轂'],[.3,'推力乘上高度，在塔底形成傾倒力矩'],[.55,'基礎與覆土的重量把風機壓住'],[.75,'寬大的底面把力分散給地盤']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'基礎受力（示意）',20,'#f2c230',700);
  const k=ease(seg(u,.08,.5)),X=410;
  box(80,600,660,120,'rgba(164,135,106,.35)');ln([80,600,740,600],'#7a9a55',3);
  poly([230,660,590,660,590,630,440,610,440,600,380,600,380,610,230,630],'#b9bec2','rgba(0,0,0,.4)',1.5);
  alphaDo(seg(u,.55,.6),()=>{poly([230,630,380,610,380,600,230,600],'rgba(138,111,85,.9)');poly([590,630,440,610,440,600,590,600],'rgba(138,111,85,.9)');});
  secQuad(X,600,X,256,14,9);box(X-24,238,58,18,'#e3e8ec','rgba(0,0,0,.35)',1);circ(X-28,247,7,'#dfe5e8');ln([X-30,170,X-30,324],'#f4f6f7',5);
  for(let i=0;i<4;i++){const y=190+i*40,f=(TT*.8+i*.27)%1;alphaDo(.4+.6*k,()=>arrow(90+f*40,y,190+f*40,y,'#7dc8dc',2.5));}
  alphaDo(seg(u,.06,.12),()=>{arrow(X+40,247,X+40+70+80*k,247,'#e8572a',4);wt(X+60+80*k,232,'推力',18,'#ff9d7a',700);});
  alphaDo(seg(u,.3,.36),()=>{ctx.strokeStyle='#e8572a';ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(X,630,70,-Math.PI*.85,-Math.PI*.15);ctx.stroke();const a=-Math.PI*.15;poly([X+70*Math.cos(a)+8,630+70*Math.sin(a)-2,X+70*Math.cos(a)-8,630+70*Math.sin(a)-10,X+70*Math.cos(a)-4,630+70*Math.sin(a)+10],'#e8572a');
   wt(X+86,560,'傾倒力矩',18,'#ff9d7a',700);ctx.setLineDash([5,5]);ln([X+120,247,X+120,600],'rgba(255,157,122,.6)',1.5);ctx.setLineDash([]);wt(X+130,420,'約 99 m',17,'#ff9d7a',700,'left',COND);});
  alphaDo(seg(u,.55,.6),()=>{arrow(X,560,X,650,'#7dffc4',4);wt(X-14,546,'自重',18,'#7dffc4',700,'right');arrow(300,585,300,628,'#7dffc4',3);arrow(520,585,520,628,'#7dffc4',3);wt(300,576,'覆土',17,'#7dffc4',700,'center');});
  const pr=seg(u,.72,.78);
  if(pr>0)alphaDo(pr,()=>{const kk=ease(seg(u,.72,.95)),hl=30-20*kk,hr=30+20*kk;poly([230,662,590,662,590,662+hr,230,662+hl],'rgba(125,200,220,.4)','#7dc8dc',1.5);
   for(let i=0;i<6;i++){const x=250+i*64,h=lerp(hl,hr,(x-230)/360);arrow(x,662+h,x,666,'#7dc8dc',1.8);}wt(610,700,'地盤反力',17,'#7dc8dc',700);});
  alphaDo(seg(u,.36,.42),()=>wt(84,752,'推力 × 高度 ＝ 傾倒力矩',19,'#ff9d7a',700));
  alphaDo(seg(u,.6,.66),()=>wt(84,784,'（自重 ＋ 覆土）× 力臂 ＝ 抵抗力矩',19,'#7dffc4',700));
  /* 右：基礎規格 */
  card(820,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(844,200,'擴展式基礎（示例）',20,'#f2c230',700);
  const R=[['直徑約 20 m、深約 3 m','以寬大的底面分散載重'],['混凝土 600–1,000 m³','重量本身就是抵抗力矩'],['錨栓約 180 支','把塔架底部法蘭鎖在基礎上'],['先做地質鑽探','軟弱地盤改用樁基礎']];
  R.forEach(([t,s],i)=>{const a=seg(u,.12+i*.14,.18+i*.14);if(a<=0)return;alphaDo(a,()=>{const y=232+i*138;card(844,y,672,118,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});
   wt(872,y+50,t,24,'#fff',700,'left',COND);wt(872,y+88,s,18,'rgba(227,236,238,.85)',500);});});
 }},

{t:'主吊機與輔助吊機',en:'Main crane and tailing crane',dur:14,side:true,
 d:'混凝土養護到設計強度後才能吊裝塔架。塔架分成數段運到現場，平躺在地上，要先把它「立起來」：履帶式主吊機勾住上端，輪式輔助吊機勾住下端，兩部吊機一起抬離地面；主吊機持續往上吊，輔助吊機則跟著往前送，讓塔架從水平慢慢轉成垂直，避免底部法蘭拖地受損。立直後輔助吊機脫鉤，主吊機把塔架移到基礎上方，對準錨栓降下並鎖上螺栓，其餘各段依序往上疊。',
 s:[[0,'主吊機勾上端、輔助吊機勾下端，一起抬起'],[.26,'主吊機往上吊，輔助吊機往前送'],[.54,'塔架立直後，對準錨栓放上基礎'],[.7,'第二到第四段依序往上疊，鎖緊法蘭螺栓']],
 cam:u=>camMix({x:700,y:470,s:1.55},{x:800,y:420,s:1},ease(seg(u,.6,.7))),
 draw(u){
  const G0=gyy(600),GT=gyy(TX),Ls=M*SEC[0],hB=G0-30;
  pedestal();
  const a=ease(seg(u,.06,.2)),r=ease(seg(u,.24,.52)),c=ease(seg(u,.54,.64));
  let B,T;
  if(u<.24){B={x:560,y:G0-8-22*a};T={x:637,y:B.y};}
  else if(u<.54){const th=r*Math.PI/2;B={x:637-Ls*Math.cos(th),y:hB};T={x:637,y:hB-Ls*Math.sin(th)};}
  else{B={x:lerp(637,TX,c),y:lerp(hB,GT-4,c)};T={x:B.x,y:B.y-Ls};}
  box(566,G0-8,14,8,'#6f7a80');box(620,G0-8,14,8,'#6f7a80');
  /* 已完成的上方各段 */
  const iv=[[.66,.76],[.76,.86],[.86,.96]];
  let hook=T,hookY=T.y-16;
  for(let i=1;i<4;i++){const [t0,t1]=iv[i-1];if(u<t0)break;const dd=80*(1-ease(seg(u,t0,t0+.08)));
   const yb=secBase(i)-dd,yt=secBase(i+1)-dd;secQuad(TX,yb,TX,yt,DIA[i]*M,DIA[i+1]*M);if(u<t1){hook={x:TX,y:yt};hookY=yt-16;}}
  secQuad(B.x,B.y,T.x,T.y,DIA[0]*M,DIA[1]*M);
  if(u>=.96){hook={x:TX,y:TOPY()};hookY=TOPY()-40*seg(u,.96,1)-16;}
  const mp=crawler(MCX);const mh=crane(mp.x,mp.y,520,hook.x,hookY,{col:'#e9b21f'});
  if(u<.96&&(u<.64||u>=.66)){slings(mh.x,mh.hy,[hook.x-5,hook.y,hook.x+5,hook.y]);}
  const tp=truckCrane(TCX);
  if(u<.56){const th=crane(tp.x,tp.y,200,B.x,B.y-18,{col:'#e9b21f'});slings(th.x,th.hy,[B.x-5,B.y,B.x+5,B.y]);}
  else{const k=seg(u,.56,.64);crane(tp.x,tp.y,200,lerp(637,580,k),lerp(hB-18,hB-70,k),{col:'#e9b21f'});}
  person(530,gyy(530),'#e8572a',2.2);person(700,gyy(700),'#f2c230',2.2);
  if(u<.54&&u>.06)ln([B.x,B.y,530,gyy(530)-18],'rgba(255,255,255,.55)',1);
  lab(MCX,gyy(MCX)-44,'主吊機（履帶式）',{dx:40,dy:-60,st:'s',a:band(u,.04,.3)});
  lab(TCX,gyy(TCX)-30,'輔助吊機',{dx:-30,dy:-80,st:'n',a:band(u,.04,.36)});
  lab((B.x+T.x)/2,(B.y+T.y)/2,'塔架第一段',{dx:60,dy:-60,st:'l',a:band(u,.1,.5)});
  lab(TX,GT-4,'對準錨栓',{dx:70,dy:40,st:'g',a:band(u,.56,.68)});
  lab(TX,secBase(2),'法蘭螺栓',{dx:-90,dy:-20,st:'g',a:band(u,.72,.95)});
 },
 hud(u){hudPanel(240,150,'吊裝狀態（示例）',seg(u,.05,.1),w=>{const n=u<.66?1:u<.76?2:u<.86?3:4;const wt_=[60,55,50,45][n-1];
  hrow(56,'吊掛物',trf('塔架第 {n} 段',{n}),w,'#f2c230');hrow(88,'吊重',trf('約 {t} t',{t:wt_}),w,'#fff');hrow(120,'風速',trf('{v} m/s',{v:hubWind().toFixed(1)}),w,'#7dffc4');});}},

{t:'機艙與葉片上高空',en:'Nacelle and blades go up',dur:15,side:true,
 d:'塔架完成後，主吊機把機艙與輪轂吊到將近 100 公尺的塔頂，這是整部風機最重的一吊。接著是葉片：陸域常見兩種做法，一是在地面把三支葉片裝上輪轂，整組轉子一次吊上；二是像這裡的單支吊裝，用專用吊具水平夾住葉片，由地面人員拉住導引繩控制方向，把葉根插進輪轂鎖上螺栓。裝好一支，轉動輪轂 120 度，再裝下一支，重複三次。',
 s:[[0,'主吊機把機艙與輪轂吊上塔頂'],[.28,'機艙對準塔頂法蘭，鎖上螺栓'],[.42,'葉片以專用吊具水平吊起，地面拉住導引繩'],[.62,'葉根對準輪轂，插入並鎖緊'],[.8,'輪轂轉動 120 度，重複裝上三支葉片']],
 cam:u=>camMix({x:800,y:430,s:1},{x:760,y:300,s:1.45},ease(seg(u,.5,.64))),
 draw(u){
  const GT=gyy(TX),top=TOPY(),hy=HUBY();
  pedestal();towerUpTo(4);
  /* 機艙 */
  const n1=ease(seg(u,.05,.2)),n2=ease(seg(u,.2,.3));const ng=gyy(930);
  let nx=930,ny=lerp(ng,top-40,n1);if(u>=.2){nx=lerp(930,TX,n2);ny=lerp(top-40,top,n2);}
  const rot=2*Math.PI/3*(ease(seg(u,.8,.85))+ease(seg(u,.89,.94)));
  /* 葉片 */
  const b1=ease(seg(u,.42,.6)),b2=ease(seg(u,.62,.74));const bg=gyy(800)-6;
  let vx=900,vy=lerp(bg,hy,b1);if(u>=.62)vx=lerp(900,TX,b2);
  if(u>=.74){bladeFront(TX,hy,Math.PI+rot,BL);
   if(u>=.855)alphaDo(seg(u,.855,.87),()=>bladeFront(TX,hy,Math.PI+rot-2*Math.PI/3,BL));
   if(u>=.945)alphaDo(seg(u,.945,.96),()=>bladeFront(TX,hy,Math.PI+rot-4*Math.PI/3,BL));}
  else bladeFront(vx,vy,Math.PI,BL);
  nacFront(nx,ny);
  /* 吊鉤 */
  const mp=crawler(MCX);let hk,hkY,sl=null;
  if(u<.32){hk=nx;hkY=ny-20-22;sl=[nx-9,ny-20,nx+9,ny-20];}
  else if(u<.42){const k=ease(seg(u,.32,.36)),k2=ease(seg(u,.36,.42));hk=lerp(TX,vx-7-.33*BL,k);hkY=lerp(top-60,vy-34,k2);}
  else if(u<.74){hk=vx-7-.33*BL;hkY=vy-34;sl=[hk-30,vy-4,hk+30,vy-4];box(hk-34,vy-12,68,8,'#394650');}
  else{hk=lerp(vx-7-.33*BL,TX-160,seg(u,.74,.82));hkY=hy-60;}
  const mh=crane(mp.x,mp.y,520,hk,hkY,{col:'#e9b21f'});if(sl)slings(mh.x,mh.hy,sl);
  if(u>=.42&&u<.76){const tip=vx-7-BL;ln([tip+6,vy,560,gyy(560)-18],'rgba(255,255,255,.6)',1);ln([vx-30,vy,980,gyy(980)-18],'rgba(255,255,255,.6)',1);}
  person(560,gyy(560),'#e8572a',2.2);person(980,gyy(980),'#f2c230',2.2);
  lab(nx,ny-12,'機艙與輪轂',{dx:70,dy:-50,st:'s',a:band(u,.04,.36)});
  tick(TX+30,top,'約 99 m','left');
  lab(vx-7-BL*.5,vy,'葉片 67 m',{dx:-40,dy:-80,st:'l',a:band(u,.42,.62)});
  lab(560,gyy(560)-18,'導引繩',{dx:-40,dy:-60,st:'n',a:band(u,.44,.7)});
  lab(TX,hy,'葉根插入輪轂',{dx:90,dy:60,st:'g',a:band(u,.66,.82)});
  lab(TX,hy,'轉動 120 度',{dx:90,dy:60,st:'s',a:band(u,.84,1)});
 },
 hud(u){hudPanel(240,150,'吊裝狀態（示例）',seg(u,.05,.1),w=>{const nb=u<.74?1:u<.855?1:u<.945?2:3;
  const it=u<.32?'機艙與輪轂':trf('葉片 {n}/3',{n:nb});
  const top=TOPY(),ng=gyy(930),bg=gyy(800)-6;let y;if(u<.2)y=lerp(ng,top-40,ease(seg(u,.05,.2)));else if(u<.32)y=lerp(top-40,top,ease(seg(u,.2,.3)));else if(u<.42)y=bg;else y=lerp(bg,HUBY(),ease(seg(u,.42,.6)));
  hrow(56,'吊掛物',it,w,'#f2c230');hrow(88,'吊高',trf('{h} m',{h:Math.max(0,Math.round((gyy(TX)-y)/M))}),w,'#fff');hrow(120,'輪轂風速',trf('{v} m/s',{v:hubWind().toFixed(1)}),w,hubWind()<10?'#7dffc4':'#ff8a60');});}},

{t:'等待風速窗口',en:'Waiting for a weather window',dur:13,
 d:'吊裝最大的變數是風。葉片面積大、重量相對輕，被風一吹就會擺動，因此各製造商都訂有吊裝風速上限，葉片常見約 10 m/s，塔架與機艙略高。現場以輪轂高度的風速計持續監測，超過就暫停等待。台灣西部沿海冬季東北季風強勁，夏秋又有颱風，工程團隊要依氣象預報挑選風小的時段。一部風機從塔架到葉片完成，順利時約需數天；之後還要完成內部配線、螺栓複鎖與試運轉，才能併網發電。',
 s:[[0,'輪轂高度的風速隨時在變'],[.3,'低於上限的時段，才是可以吊裝的窗口'],[.55,'依序完成塔架、機艙與三支葉片'],[.8,'配線、複鎖螺栓、試運轉後併網發電']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,860,640,{title:'輪轂高度風速（示意）',x0:0,x1:72,y0:0,y1:16,xt:[0,24,48,72],yt:[0,4,8,12,16],xl:'小時',yl:'m/s',pt:70,pb:60,pl:70,gx:3,gy:4});
  const T=72*seg(u,.03,.6);
  const win=seg(u,.3,.36);
  if(win>0)alphaDo(win,()=>{for(let h=0;h<T;h+=.5)if(wnd(h+.25)<10)box(c.X(h),c.py,c.X(.5)-c.X(0)+.5,c.ph,'rgba(125,255,196,.14)');});
  ctx.setLineDash([8,6]);ln([c.X(0),c.Y(10),c.X(72),c.Y(10)],'#e8572a',2);ln([c.X(0),c.Y(13),c.X(72),c.Y(13)],'rgba(255,157,122,.6)',1.5);ctx.setLineDash([]);
  wt(c.X(71),c.Y(10)-8,'葉片吊裝上限（示例）',16,'#ff9d7a',700,'right');wt(c.X(71),c.Y(13)-8,'塔架與機艙上限（示例）',15,'rgba(255,157,122,.85)',600,'right');
  if(T>0){ctx.beginPath();for(let h=0;h<=T;h+=.2){const x=c.X(h),y=c.Y(wnd(h));h?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#7dc8dc';ctx.lineWidth=3;ctx.stroke();
   circ(c.X(T),c.Y(wnd(T)),6,'#fff','#13232e',2);}
  alphaDo(win,()=>tag(c.X(38),c.Y(2.2),'可吊裝的窗口',{size:17,bg:'#7dffc4',align:'center'}));
  /* 右：吊裝順序 */
  card(960,160,580,640,{bg:'rgba(7,27,39,.75)'});wt(984,200,'吊裝順序',20,'#f2c230',700);
  const S=[['塔架第一段','立起並鎖在基礎錨栓上'],['塔架第二至四段','逐段往上疊'],['機艙與輪轂','最重的一吊'],['三支葉片','單支吊裝，轉動輪轂 120 度'],['配線與螺栓複鎖','塔內電纜、全部螺栓複查'],['試運轉與併網','測試完成後開始發電']];
  S.forEach(([t,s],i)=>{const t0=.4+i*.08,a=seg(u,t0,t0+.05);const y=226+i*94;const on=a>0;
   alphaDo(.3+.7*a,()=>{card(984,y,532,80,{bg:on?'rgba(125,255,196,.08)':'rgba(255,255,255,.03)',st:on?'rgba(125,255,196,.4)':'rgba(255,255,255,.12)'});
    circ(1020,y+40,19,on?'#7dffc4':'rgba(255,255,255,.25)');wt(1020,y+41,String(i+1),20,'#0e2a3b',700,'center',COND,'middle');wt(1054,y+34,t,19,'#fff',700);wt(1054,y+62,s,16,'rgba(227,236,238,.85)',500);});});
 }}
]};
