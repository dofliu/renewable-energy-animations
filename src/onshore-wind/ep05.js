// KITS: land
/* 陸域風電系列 第 5 集：齒輪箱與發電機 */
const gyy=x=>groundY(x);
const TX=640,HY=240;                                       // 風機塔架位置與輪轂高度（世界座標）
const RR=15,G1=5,G2=4.6,G3=4.8,GR=G1*G2*G3;                  // 轉子 15 rpm、三級增速 1:110.4（典型範例）
const PW=3.6;                                              // 額定功率 MW（示例）
const fmt=v=>Math.round(v).toLocaleString('en-US');
const tq=rpm=>PW*1e3/(rpm*TAU/60);                         // 扭矩 kN·m（忽略損耗）
/* 側視葉片：輪轂 (hx,hy)，葉片長 L，轉角 a（葉片在轉子平面內，側視時看到邊） */
function bladeS(hx,hy,a,L){const c=Math.cos(a),s=Math.sin(a),dx=s*6;
  poly([hx-3,hy,hx+3,hy,hx+dx+1.5,hy-c*L,hx+dx-1.5,hy-c*L],'#f4f6f7','rgba(0,0,0,.35)',1);}
/* 側視風機；cut：外殼透明度（0 看得到內部），rot：轉子角度 */
function turbineSide(rot,cut){const g=gyy(TX);
  poly([TX-18,g,TX-11,HY+36,TX+11,HY+36,TX+18,g],'#eef2f4','rgba(0,0,0,.3)',1);
  const hx=TX-100;
  for(let i=0;i<3;i++){const a=rot+i*TAU/3;if(Math.cos(a)<0)bladeS(hx,HY,a,200);}
  /* 內部 */
  box(TX-80,HY+26,260,10,'#8d989f');                                   // 底座
  box(TX-100,HY-6,110,12,'#9aa3a8','rgba(0,0,0,.4)',1);                // 主軸
  for(let k=0;k<3;k++){const q=rot+k*TAU/3;if(Math.cos(q)>0)ln([TX-75,HY+5*Math.sin(q),TX+8,HY+5*Math.sin(q)],'rgba(0,0,0,.35)',1.5);}
  box(TX-64,HY-18,18,36,'#7dc8dc','rgba(0,0,0,.45)',1);                // 主軸承
  box(TX+10,HY-26,75,54,'#6f7a80','rgba(0,0,0,.5)',1.5);               // 齒輪箱
  const gr=(x,y,r,s)=>{circ(x,y,r,'#8d989f','#394650',1.5);for(let i=0;i<6;i++){const a=s+i*TAU/6;ln([x,y,x+Math.cos(a)*r,y+Math.sin(a)*r],'#394650',1);}};
  gr(TX+32,HY+2,16,rot);gr(TX+58,HY-10,9,-rot*4.6);gr(TX+72,HY+10,6,rot*22);
  box(TX+85,HY-3,26,6,'#9aa3a8');                                      // 高速軸
  box(TX+90,HY-18,6,36,'#e8572a');                                     // 剎車盤
  box(TX+110,HY-22,60,44,'#58b8d0','rgba(0,0,0,.45)',1);               // 發電機
  for(let k=0;k<5;k++){const q=rot*12+k*TAU/5;if(Math.cos(q)>0)ln([TX+114,HY+18*Math.sin(q),TX+166,HY+18*Math.sin(q)],'rgba(0,0,0,.25)',2);}
  box(TX+172,HY-14,6,30,'#394650');                                    // 冷卻器
  /* 外殼 */
  alphaDo(cut,()=>{rrp(TX-80,HY-32,260,68,8);ctx.fillStyle='#e3e8ec';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();});
  alphaDo(1-cut,()=>{rrp(TX-80,HY-32,260,68,8);ctx.strokeStyle='rgba(40,50,60,.7)';ctx.lineWidth=1.5;ctx.setLineDash([6,4]);ctx.stroke();ctx.setLineDash([]);});
  poly([TX-80,HY-26,TX-112,HY-12,TX-118,HY,TX-112,HY+12,TX-80,HY+26],'#dfe5e8','rgba(0,0,0,.35)',1);   // 導流罩
  for(let i=0;i<3;i++){const a=rot+i*TAU/3;if(Math.cos(a)>=0)bladeS(hx,HY,a,200);}
  return {hx,hy:HY};}
/* 風線 */
function windLines(y0,y1,n,sp,a,seed,len){if(a<=0)return;const r=rng(seed||3);ctx.lineCap='round';
  for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),ph=r(),s=sp*(.7+.6*r()),L=(len||60)*(.6+.8*r());const x=VX0-200+((ph*2400+TT*s)%(VX1-VX0+400));
   alphaDo(a*(.25+.35*r()),()=>ln([x,y,x+L,y],'#ffffff',2));}ctx.lineCap='butt';}
/* 齒輪（外齒或內齒）：Z 齒數 */
function gearPath(x,y,r,Z,a,inw){const th=Math.max(3,r*.08)*(inw?-1:1);
  for(let i=0;i<=Z*4;i++){const q=a+i*TAU/(Z*4),k=(i%4===1||i%4===2)?1:0,rr=r+(k?th:0)-(inw?0:th*.5),px=x+Math.cos(q)*rr,py=y+Math.sin(q)*rr;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();}
function gear(x,y,r,Z,a,fill,st){ctx.beginPath();gearPath(x,y,r,Z,a,false);ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=st||'#394650';ctx.lineWidth=1.5;ctx.stroke();
  circ(x,y,r*.22,'#394650');ln([x,y,x+Math.cos(a)*r*.7,y+Math.sin(a)*r*.7],'#394650',3);}
/* 側視轉軸：粗細 h，條紋隨角度 q 移動 */
function shaft(x0,x1,y,h,q,col){box(x0,y-h/2,x1-x0,h,col,'rgba(0,0,0,.45)',1.5);
  for(let k=0;k<4;k++){const p=q+k*TAU/4;if(Math.cos(p)>0){const yy=y+Math.sin(p)*h*.42;ln([x0+4,yy,x1-4,yy],'rgba(0,0,0,.3)',Math.max(1.5,h*.06));}}}
/* 變壓器符號 */
function xfmr(x,y,r){ring(x-r*.45,y,r,'#fff',2.5);ring(x+r*.45,y,r,'#fff',2.5);}
/* 沿折線的位置 */
function along(P,f){let L=0;const S=[];for(let i=2;i<P.length;i+=2){const d=Math.hypot(P[i]-P[i-2],P[i+1]-P[i-1]);S.push(d);L+=d;}
  let t=((f%1)+1)%1*L;for(let i=0;i<S.length;i++){if(t<=S[i]){const k=t/S[i];return [lerp(P[i*2],P[i*2+2],k),lerp(P[i*2+1],P[i*2+3],k)];}t-=S[i];}return [P[P.length-2],P[P.length-1]];}
function flow(P,n,sp,col,r){for(let i=0;i<n;i++){const [x,y]=along(P,TT*sp+i/n);circ(x,y,r||4,col);}}
/* 波形小圖：cyc 顯示的週期數，dc 為直流 */
function wave(x,y,w,h,cyc,col,dc){box(x,y,w,h,'rgba(255,255,255,.04)','rgba(255,255,255,.16)',1);ln([x+6,y+h/2,x+w-6,y+h/2],'rgba(255,255,255,.14)',1);
  ctx.beginPath();for(let i=0;i<=80;i++){const t=i/80,xx=x+6+t*(w-12),yy=dc?y+h*.28:y+h/2-Math.sin(TAU*cyc*t-TT*3)*h*.34;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();}
/* 小型變電站與電塔（側視） */
function pylon(x){const g=gyy(x);ln([x-22,g,x-5,g-190,x+5,g-190,x+22,g],'#6f7a80',2.5);ln([x-16,g-60,x+16,g-60],'#6f7a80',2);ln([x-30,g-160,x+30,g-160],'#6f7a80',2.5);ln([x-24,g-120,x+24,g-120],'#6f7a80',2);}
function substation(x){const g=gyy(x);fence(x-90,x+90,g);cabinet(x-70,g,40,56,'#dfe5e8');cabinet(x+30,g,40,56,'#dfe5e8');
  box(x-20,g-70,40,70,'#9aa3a8','rgba(0,0,0,.3)',1);for(let i=0;i<3;i++)ln([x-14+i*14,g-70,x-14+i*14,g-92],'#6f7a80',2.5);}

const EP={no:5,slug:'onshore-wind',seriesName:'陸域風電系列',t:'齒輪箱與發電機',en:'Gearboxes and generators',
lede:'葉片每分鐘只轉十幾圈，發電機卻需要轉得快、送出穩定的 60 Hz 電力。這一集打開機艙，看齒輪箱如何增速、雙饋式與永磁直驅發電機各怎麼運作，以及變流器扮演的角色。',
facts:[['1 : 110','左右','2–4 MW 級陸域風機三級齒輪箱的典型增速比（示例）'],
['1,800','rpm','台灣電網 60 Hz 下，4 極發電機的同步轉速（n = 120 f ÷ p）'],
['≈ 30','%','雙饋式發電機的變流器只需處理約三成功率，轉速可在同步轉速 ±30% 內變化'],
['100','%','全功率變流器：發電機的全部電力都經過 AC→DC→AC 轉換後才併網'],
['≈ 650','kg/MW','低速永磁直驅發電機的永久磁鐵用量（Siemens 估計，依設計而異）'],
['3','級','常見的增速齒輪箱：一級行星齒輪加兩級平行軸齒輪（示例）']],
note:'說明：本集為教育用途示意動畫，機艙、齒輪與電路比例經過簡化。同步轉速 n = 120 f ÷ p 為電機學公式，台灣電網頻率為 60 Hz；雙饋式感應發電機（DFIG）以部分功率變流器搭配約 ±30% 同步轉速的變速範圍、齒輪箱＋全功率變流器與直驅等傳動型式，參考美國 NREL 風機傳動鏈相關文件；直驅發電機永磁用量約每 MW 650 kg 為 Siemens 估計值，文獻中依機型與磁鐵等級差異很大；Enercon 等直驅機型不使用齒輪箱。額定功率 3.6 MW、轉子 15 rpm、三級增速比 1 : 5、1 : 4.6、1 : 4.8、扭矩、690 V 與 22.8 kV 電壓、各型式轉速範圍與比較內容皆為典型範例，並非特定機型或案場資料；扭矩計算忽略齒輪損耗。',
base:()=>{landSky(GY,{sun:{x:1320,y:120},clouds:false});drawGround();},
shots:[
/* 1 ─────────────────────────────── 打開機艙 */
{t:'打開機艙',en:'Inside the nacelle',dur:13,side:true,
 d:'陸域風機的輪轂高度常在 80–120 公尺，葉片轉動的機械能要在機艙裡變成電能。沿著動力傳遞的順序，依序是輪轂、主軸與主軸承、增速齒輪箱、高速軸上的剎車盤，最後是發電機；機艙後段還有冷卻器，控制櫃與變流器則放在機艙或塔架底部。葉片每分鐘約轉 10–20 圈，發電機卻需要每分鐘上千轉，這一集要看的，就是中間這段轉速與電力的轉換。',
 s:[[0,'輪轂高度約百公尺，機艙裡藏著整條傳動鏈'],[.3,'打開外殼：主軸、主軸承、齒輪箱'],[.55,'齒輪箱後方是剎車盤與發電機'],[.78,'轉子每分鐘十幾轉，發電機要轉上千轉']],
 cam:u=>camMix({x:800,y:420,s:1},{x:TX+30,y:HY+10,s:2.5},ease(seg(u,.16,.38))),
 draw(u){
  windLines(120,560,18,240,.9,5,60);
  const rot=TT*RR*TAU/60;
  turbineSide(rot,1-ease(seg(u,.3,.42)));
  lab(TX+50,HY-32,'機艙',{dx:60,dy:-60,st:'l',a:band(u,.03,.2)});
  lab(TX-100,HY,'輪轂',{dx:-80,dy:-70,st:'l',a:band(u,.03,.2)});
  lab(TX-55,HY-18,'主軸承',{dx:-50,dy:-80,st:'s',a:band(u,.4,.62)});
  lab(TX-20,HY+6,'主軸（低速）',{dx:-60,dy:90,a:band(u,.42,.64)});
  lab(TX+48,HY-26,'齒輪箱',{dx:0,dy:-90,st:'s',a:band(u,.46,.75)});
  lab(TX+93,HY+18,'剎車盤',{dx:0,dy:90,st:'w',a:band(u,.56,.8)});
  lab(TX+140,HY-22,'發電機',{dx:60,dy:-80,st:'g',a:band(u,.6,.98)});
  lab(TX+100,HY,'高速軸',{dx:70,dy:80,a:band(u,.76,.98)});
 },
 hud(u){hudPanel(250,150,'傳動鏈轉速（示例）',seg(u,.05,.1),w=>{const r=RR+.3*nz(TT*.4);
  hrow(56,'轉子轉速',trf('{n} rpm',{n:r.toFixed(1)}),w,'#fff');hrow(88,'發電機轉速',trf('{n} rpm',{n:fmt(r*GR)}),w,'#7dffc4');hrow(120,'增速比',trf('1 : {n}',{n:GR.toFixed(0)}),w,'#f2c230');});}},

/* 2 ─────────────────────────────── 為什麼要增速 */
{t:'為什麼要增速',en:'Why speed it up?',dur:13,
 d:'功率等於扭矩乘以轉速。以一部 3.6 MW 的風機為例，轉子每分鐘 15 轉時，主軸承受約 2,300 kN·m 的扭矩；若把轉速提高 110 倍，同樣功率的扭矩只剩約 21 kN·m，發電機就能做得小而輕。另一方面，發電機的同步轉速 n = 120 f ÷ p，由電網頻率 f 與磁極數 p 決定。台灣電網是 60 Hz，4 極發電機的同步轉速是每分鐘 1,800 轉；若要直接配合每分鐘 15 轉，就需要 480 極。解法有兩種：用齒輪箱增速，或用多極發電機搭配變流器。',
 s:[[0,'功率等於扭矩乘以轉速'],[.25,'轉速提高 110 倍，扭矩就降到約百分之一'],[.5,'在 60 Hz 電網，4 極發電機同步轉速是 1,800 rpm'],[.75,'所以要嘛用齒輪箱增速，要嘛讓發電機多極']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'同樣的功率，兩種轉法（示例）',20,'#f2c230',700);
  alphaDo(seg(u,.02,.08),()=>{wt(410,272,'P = T × ω',44,'#fff',700,'center',COND);wt(410,306,'功率 = 扭矩 × 轉速',18,'rgba(227,236,238,.85)',600,'center');});
  const rq=TT*RR*TAU/60;
  alphaDo(seg(u,.06,.13),()=>{wt(90,366,'轉子側',18,'#7dc8dc',700);shaft(90,470,440,96,rq,'#9aa3a8');
   wt(520,432,'15 rpm',32,'#fff',700,'left',COND);wt(520,466,trf('扭矩 {n} kN·m',{n:fmt(tq(RR))}),18,'#ff9d7a',700);});
  alphaDo(seg(u,.2,.26),()=>{arrow(280,500,280,570,'#f2c230',3);tag(410,535,trf('同樣 {p} MW',{p:PW}),{size:16,bg:'#f2c230',align:'center'});});
  alphaDo(seg(u,.24,.31),()=>{wt(90,600,'發電機側',18,'#7dffc4',700);shaft(90,470,630,16,rq*12,'#58b8d0');
   wt(520,622,trf('{n} rpm',{n:fmt(RR*GR)}),32,'#7dffc4',700,'left',COND);wt(520,656,trf('扭矩 {n} kN·m',{n:tq(RR*GR).toFixed(1)}),18,'#ff9d7a',700);});
  alphaDo(seg(u,.36,.42),()=>tag(410,742,'扭矩小約 110 倍，發電機可以小得多',{size:17,bg:'#7dffc4',align:'center'}));
  /* 右：同步轉速 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'發電機要轉多快？',20,'#f2c230',700);
  alphaDo(seg(u,.46,.52),()=>{wt(1170,272,'n = 120 f ÷ p',42,'#fff',700,'center',COND);
   wt(840,318,'n：同步轉速（rpm）',17,'rgba(227,236,238,.9)',600);wt(840,346,'f：電網頻率（台灣 60 Hz）',17,'rgba(227,236,238,.9)',600);wt(840,374,'p：發電機磁極數',17,'rgba(227,236,238,.9)',600);});
  [[4,1800,'#7dffc4'],[6,1200,'#7dc8dc'],[480,15,'#ff9d7a']].forEach(([p,n,c],i)=>alphaDo(seg(u,.52+i*.06,.58+i*.06),()=>{const y=410+i*72;
   box(840,y,660,56,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);wt(862,y+37,trf('{p} 極',{p}),22,c,700,'left',COND);
   const f=Math.max(.012,n/1800)*ease(seg(u,.52+i*.06,.62+i*.06));box(980,y+18,360*f,20,c);wt(1484,y+38,trf('{n} rpm',{n:fmt(n)}),24,c,700,'right',COND);}));
  alphaDo(seg(u,.7,.76),()=>wt(1170,660,'要直接配合 15 rpm，需要 480 極',18,'#ff9d7a',700,'center'));
  alphaDo(seg(u,.76,.82),()=>{tag(990,730,'解法一：齒輪箱增速',{size:17,bg:'#f2c230',align:'center'});tag(1340,730,'解法二：多極＋變流器',{size:17,bg:'#7dffc4',align:'center'});});
 }},

/* 3 ─────────────────────────────── 齒輪箱 */
{t:'齒輪箱的三級增速',en:'Three stages of a gearbox',dur:14,
 d:'常見的風機齒輪箱由一級行星齒輪加上兩級平行軸齒輪組成。第一級是行星齒輪：外圈的內齒環固定，主軸帶動行星架，三到四個行星齒輪一邊公轉、一邊自轉，把力量分散到多個齒面，中間的太陽齒輪就被帶著快速旋轉。以太陽齒輪 22 齒、內齒環 88 齒為例，增速比是 1 + 88 ÷ 22 = 5 倍。接著兩級平行軸齒輪再各增速約 4.6 與 4.8 倍，合計約 110 倍。每一級都有些微摩擦損耗，整體效率約 97%，損失的能量變成熱，要靠潤滑油循環與冷卻器帶走。',
 s:[[0,'第一級行星齒輪：主軸帶動行星架'],[.25,'行星齒輪分擔負載，帶動中央的太陽齒輪'],[.5,'再經過兩級平行軸齒輪，每一級都加速'],[.76,'轉速增加約 110 倍，扭矩同比例下降']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'第一級：行星齒輪（正視示意）',20,'#f2c230',700);
  const cx=410,cy=500,m=4.4,rs=22*m/2,rp=33*m/2,rr=88*m/2,cr=rs+rp;
  const th=TT*.3,sun=th*5,pl=th*(1-88/33);
  /* 內齒環 */
  ctx.beginPath();ctx.arc(cx,cy,rr+26,0,TAU);gearPath(cx,cy,rr,88,0,true);ctx.fillStyle='#6f7a80';ctx.fill('evenodd');ctx.strokeStyle='#394650';ctx.lineWidth=1.5;ctx.stroke();
  /* 行星架 */
  const ka=seg(u,.02,.08);
  alphaDo(.35+.65*band(u,.02,.3),()=>{for(let i=0;i<3;i++){const a=th+i*TAU/3;ln([cx,cy,cx+Math.cos(a)*cr,cy+Math.sin(a)*cr],'#f2c230',10);}});
  for(let i=0;i<3;i++){const a=th+i*TAU/3;gear(cx+Math.cos(a)*cr,cy+Math.sin(a)*cr,rp,33,pl,'#9aa3a8');circ(cx+Math.cos(a)*cr,cy+Math.sin(a)*cr,9,'#f2c230','#13232e',1.5);}
  gear(cx,cy,rs,22,sun,'#7dffc4','#13232e');
  alphaDo(ka,()=>{wt(cx,cy+rr+62,'內齒環固定　88 齒',17,'rgba(227,236,238,.9)',700,'center');});
  alphaDo(band(u,.04,.34),()=>tag(cx-190,cy-rr-4,'輸入：行星架',{size:16,bg:'#f2c230',align:'center'}));
  alphaDo(band(u,.26,.56),()=>{tag(cx+170,cy-rr-4,'輸出：太陽齒輪',{size:16,bg:'#7dffc4',align:'center'});});
  alphaDo(seg(u,.3,.36),()=>{tag(cx,cy+rr+100,'1 + 88 ÷ 22 = 5 倍',{size:18,bg:'#dfe5e8',align:'center'});});
  /* 右：三級轉速與扭矩 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'轉速與扭矩逐級變化（示例）',20,'#f2c230',700);
  const ST=[['主軸',RR,'#fff'],['第一級 行星',RR*G1,'#7dc8dc'],['第二級 平行軸',RR*G1*G2,'#7dc8dc'],['第三級 平行軸',RR*GR,'#7dffc4']];
  const RT=['× 5','× 4.6','× 4.8'];
  wt(1110,248,'轉速',16,'rgba(227,236,238,.7)',700,'left');wt(1350,248,'扭矩',16,'rgba(227,236,238,.7)',700,'left');
  ST.forEach(([n,v,c],i)=>{const t0=i===0?.04:i===1?.3:.46+(i-2)*.12;alphaDo(seg(u,t0,t0+.06),()=>{const y=270+i*120;
   box(830,y,680,76,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);
   const q=TT*Math.log2(v/7.5+1)*1.6;circ(870,y+38,20,'#16384c',c,2.5);ln([870,y+38,870+Math.cos(q)*18,y+38+Math.sin(q)*18],c,3);
   wt(904,y+32,n,18,'#fff',700);wt(904,y+60,i?trf('累計 1 : {n}',{n:(v/RR).toFixed(i===3?1:0)}):'1 : 1',15,'rgba(227,236,238,.75)',600,'left',COND);
   wt(1110,y+48,trf('{n} rpm',{n:fmt(v)}),28,c,700,'left',COND);
   const T=tq(v),f=T/tq(RR);box(1350,y+22,140*Math.max(.02,f),14,'#ff9d7a');wt(1350,y+62,trf('{n} kN·m',{n:T>100?fmt(T):T.toFixed(1)}),17,'#ff9d7a',700,'left',COND);
   if(i<3)alphaDo(seg(u,t0+.2,t0+.26),()=>{arrow(990,y+80,990,y+114,'#f2c230',2.5);wt(1004,y+104,RT[i],17,'#f2c230',700,'left',COND);});});});
  alphaDo(seg(u,.8,.86),()=>tag(1170,766,'整體效率約 97%，損耗變成熱由油冷卻帶走',{size:16,bg:'#f2c230',align:'center'}));
 }},

/* 4 ─────────────────────────────── 雙饋式 */
{t:'雙饋式感應發電機',en:'The doubly-fed induction generator',dur:14,
 d:'過去十多年最常見的陸域機型，是齒輪箱搭配雙饋式感應發電機（DFIG）。它的定子直接接到電網，轉子則經由滑環與碳刷接到一組背對背的變流器。變流器調整送進轉子的電流頻率，讓發電機在同步轉速約 ±30% 的範圍內變速運轉，葉片就能跟著風速改變轉速、保持在效率最好的葉尖速比。轉速低於同步轉速時，電網經變流器供電給轉子；高於同步轉速時，轉子也把電送出去。因為變流器只處理約三成功率，體積與成本都較小；缺點是仍需齒輪箱，滑環碳刷要定期保養。',
 s:[[0,'定子直接接電網，轉子經滑環接到變流器'],[.25,'變流器只處理約三成的功率'],[.5,'低於同步轉速：電網供電給轉子'],[.72,'高於同步轉速：轉子也把電送回電網']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'雙饋式發電機的電路（示意）',20,'#f2c230',700);
  const n=1400+800*ease(seg(u,.45,.85)),sl=(n-1800)/1800;
  const q=TT*(1+n/400);
  /* 齒輪箱與軸 */
  box(90,420,90,90,'#6f7a80','rgba(0,0,0,.5)',1.5);wt(135,405,'齒輪箱',16,'rgba(227,236,238,.9)',700,'center');
  shaft(180,222,465,14,q,'#9aa3a8');
  /* DFIG */
  box(222,380,190,170,'#58b8d0','rgba(0,0,0,.5)',1.5);box(248,418,138,94,'#7dc8dc','rgba(0,0,0,.5)',1.5);
  for(let k=0;k<5;k++){const p=q+k*TAU/5;if(Math.cos(p)>0){const yy=465+Math.sin(p)*40;ln([254,yy,380,yy],'rgba(0,0,0,.3)',3);}}
  wt(317,372,'定子',16,'#58b8d0',700,'center');wt(317,470,'轉子',16,'#13232e',800,'center');
  for(let k=0;k<3;k++)box(296+k*14,550,8,22,'#e8a33a');wt(317,596,'滑環',15,'#e8a33a',700,'center');
  /* 定子路徑 */
  const SP=[412,440,640,440];ln(SP,'#f2c230',4);
  /* 轉子路徑 */
  const RP=[317,572,317,650,360,650];ln([317,572,317,650,360,650],'#e8a33a',2.5);
  box(356,620,84,60,'#16384c','#e8a33a',2);wt(398,656,'AC/DC',15,'#fff',700,'center',COND);
  ln([440,640,484,640],'#e8a33a',2.5);ln([440,660,484,660],'#e8a33a',2.5);ln([462,628,462,672],'#e8a33a',3);
  box(484,620,80,60,'#16384c','#e8a33a',2);wt(524,656,'DC/AC',15,'#fff',700,'center',COND);
  ln([564,650,640,650,640,440],'#e8a33a',2.5);
  /* 變壓器與電網 */
  ln([640,440,672,440],'#f2c230',4);xfmr(694,440,18);ln([716,440,740,440],'#f2c230',4);
  wt(694,400,'電網',17,'#fff',700,'center');wt(694,486,'60 Hz',17,'#fff',700,'center',COND);
  /* 功率流 */
  alphaDo(seg(u,.06,.12),()=>flow([412,440,740,440],6,.5,'#f2c230',6));
  const rp=[317,572,317,650,360,650,640,650,640,440];
  alphaDo(seg(u,.2,.26)*Math.min(1,Math.abs(sl)*6+.2),()=>{const dir=sl<0?-1:1;for(let i=0;i<4;i++){const [x,y]=along(rp,dir*TT*.35+i/4);circ(x,y,3.5,'#e8a33a');}});
  alphaDo(seg(u,.22,.28),()=>tag(462,730,'變流器：約 30% 功率',{size:16,bg:'#e8a33a',align:'center'}));
  alphaDo(seg(u,.45,.5),()=>wt(84,262,trf('發電機轉速 {n} rpm',{n:fmt(n)}),20,'#7dffc4',700,'left',COND));
  /* 右：變速範圍 */
  const C=chartBox(800,160,740,640,{title:'轉子功率與轉速（示例）',x0:1000,x1:2600,y0:-40,y1:40,xt:[1200,1800,2400],yt:[-30,0,30],xl:'發電機轉速 rpm',yl:'轉子功率 %',pl:80,pt:70,pb:70,gx:4,gy:4});
  alphaDo(seg(u,.3,.36),()=>{box(C.X(1260),C.py,C.X(2340)-C.X(1260),C.ph,'rgba(125,255,196,.08)');
   ctx.setLineDash([7,6]);ln([C.X(1800),C.py,C.X(1800),C.py+C.ph],'#fff',2);ctx.setLineDash([]);
   wt(C.X(1800)+10,C.py+26,'同步轉速 1,800 rpm',16,'#fff',700,'left');
   wt(C.X(1260)+10,C.py+26,'變速範圍 ±30%',16,'#7dffc4',700,'left');});
  const f=seg(u,.32,.44);if(f>0){ctx.beginPath();ctx.moveTo(C.X(1260),C.Y(-30));ctx.lineTo(C.X(lerp(1260,2340,f)),C.Y(lerp(-30,30,f)));ctx.strokeStyle='#f2c230';ctx.lineWidth=3;ctx.stroke();}
  alphaDo(seg(u,.48,.54),()=>{wt(C.X(1680),C.Y(-30),'電網供電給轉子',16,'#e8a33a',700,'center');wt(C.X(1680),C.Y(-30)+24,'次同步',15,'rgba(227,236,238,.75)',600,'center');});
  alphaDo(seg(u,.72,.78),()=>{wt(C.X(1960),C.Y(30),'轉子也送電',16,'#e8a33a',700,'center');wt(C.X(1960),C.Y(30)+24,'超同步',15,'rgba(227,236,238,.75)',600,'center');});
  alphaDo(seg(u,.45,.5),()=>circ(C.X(n),C.Y(sl*100),9,'#7dffc4','#13232e',2));
 }},

/* 5 ─────────────────────────────── 永磁直驅 */
{t:'永磁直驅與全功率變流器',en:'Direct drive and the full-power converter',dur:14,
 d:'另一種做法是拿掉齒輪箱，讓輪轂直接帶動一部直徑很大的多極發電機。轉子上排滿一圈永久磁鐵，磁極數可達上百極，即使每分鐘只轉十幾圈，定子線圈仍能感應出電力。不過它發出的電頻率隨轉速改變，大約只有十幾赫茲，不能直接併網，必須由全功率變流器先整流成直流，再轉換成穩定的 60 Hz 交流電。直驅機型少了齒輪箱這個最常損壞的部件，但發電機大而重，每 MW 約需數百公斤的永久磁鐵，其中含有釹、鐠等稀土元素。',
 s:[[0,'沒有齒輪箱，輪轂直接帶動大型發電機'],[.25,'一圈永久磁鐵，轉得慢也能發電'],[.5,'頻率隨轉速變化，先整流成直流'],[.75,'再轉換成穩定的 60 Hz 交流電併網']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'直驅永磁發電機（正視示意）',20,'#f2c230',700);
  const cx=410,cy=500,R=196,th=TT*.22;
  /* 定子 */
  ctx.beginPath();ctx.arc(cx,cy,R+44,0,TAU);ctx.arc(cx,cy,R+12,0,TAU,true);ctx.fillStyle='#6f7a80';ctx.fill();
  for(let i=0;i<72;i++){const a=i*TAU/72;ln([cx+Math.cos(a)*(R+14),cy+Math.sin(a)*(R+14),cx+Math.cos(a)*(R+30),cy+Math.sin(a)*(R+30)],'#e8a33a',3);}
  /* 轉子與磁鐵 */
  circ(cx,cy,R+8,'#394650');
  const km=ease(seg(u,.2,.34));
  for(let i=0;i<60;i++){const a=th+i*TAU/60;if(i/60>km)continue;ctx.save();ctx.translate(cx+Math.cos(a)*(R-2),cy+Math.sin(a)*(R-2));ctx.rotate(a);box(-8,-8,16,16,i%2?'#58b8d0':'#e8572a');ctx.restore();}
  circ(cx,cy,R-16,'#16384c');
  for(let i=0;i<6;i++){const a=th+i*TAU/6;ln([cx+Math.cos(a)*60,cy+Math.sin(a)*60,cx+Math.cos(a)*(R-16),cy+Math.sin(a)*(R-16)],'#8d989f',8);}
  circ(cx,cy,60,'#dfe5e8','#394650',2);
  for(let i=0;i<3;i++){const a=th+i*TAU/3;circ(cx+Math.cos(a)*34,cy+Math.sin(a)*34,11,'#9aa3a8');}
  alphaDo(band(u,.04,.3),()=>tag(cx,cy+96,'輪轂直接連結',{size:16,bg:'#dfe5e8',align:'center'}));
  alphaDo(band(u,.26,.56),()=>{tag(cx-150,cy-R-44,'永久磁鐵',{size:16,bg:'#e8572a',align:'center'});tag(cx+150,cy-R-44,'定子線圈',{size:16,bg:'#e8a33a',align:'center'});});
  alphaDo(seg(u,.56,.62),()=>tag(cx,cy+R+72,'直徑可達 5 m 以上　無齒輪箱',{size:16,bg:'#7dffc4',align:'center'}));
  /* 右：全功率變流器 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'全功率變流器：100% 電力都要轉換',20,'#f2c230',700);
  const BX=[[830,'發電機','約 15 Hz','#7dc8dc'],[1010,'整流','AC → DC','#e8a33a'],[1190,'變流','DC → AC','#e8a33a'],[1370,'電網','60 Hz','#7dffc4']];
  BX.forEach(([x,n,s,c],i)=>{const t0=[.38,.48,.6,.66][i];alphaDo(seg(u,t0,t0+.06),()=>{
   box(x,270,140,90,'#16384c',c,2);wt(x+70,308,n,20,c,800,'center');wt(x+70,340,s,17,'#fff',700,'center',COND);
   if(i<3)arrowR(x+146,315,30,'#f2c230');
   const vf=12+4*nz(TT*.3);wave(x,400,140,110,i===0?vf/60*1.6:i===3?1.6:0,c,i===1||i===2);});});
  alphaDo(seg(u,.5,.56),()=>{wt(1100,550,'直流鏈',16,'#e8a33a',700,'center');ln([1010,540,1060,540],'rgba(232,163,58,.5)',1);ln([1140,540,1330,540],'rgba(232,163,58,.5)',1);});
  alphaDo(seg(u,.42,.48),()=>wt(900,550,'頻率隨轉速變',15,'rgba(227,236,238,.8)',600,'center'));
  alphaDo(seg(u,.7,.76),()=>wt(1440,550,'穩定併網',15,'rgba(227,236,238,.8)',600,'center'));
  alphaDo(seg(u,.8,.86),()=>{box(830,610,680,150,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);
   wt(852,650,'優點',18,'#7dffc4',800);wt(930,650,'少了齒輪箱，轉速低、磨耗少',18,'#fff',600);
   wt(852,700,'限制',18,'#ff9d7a',800);wt(930,700,'發電機大而重，需要稀土永久磁鐵',18,'#fff',600);
   wt(930,738,'每 MW 約 650 kg 永久磁鐵（Siemens 估計）',16,'rgba(227,236,238,.8)',600);});
 }},

/* 6 ─────────────────────────────── 比較 */
{t:'三種傳動鏈比一比',en:'Three drivetrains compared',dur:13,
 d:'目前的風機大致分成三種傳動鏈。齒輪箱加雙饋式發電機技術成熟、變流器小，是許多陸域機型的主流，但齒輪箱與滑環需要較多保養。中速永磁的混合式設計只用一到兩級齒輪，發電機轉速約每分鐘數百轉，兼顧體積與可靠度，並搭配全功率變流器。永磁直驅完全沒有齒輪箱，運動零件最少，但發電機最大最重，也最依賴稀土。全功率變流器還能提供較好的電網支撐能力。選哪一種沒有絕對答案，要看成本、重量、道路運輸與吊裝條件，以及當地的維修能力。',
 s:[[0,'三種傳動鏈，差在齒輪箱與變流器'],[.3,'雙饋式：變流器小，但齒輪箱要保養'],[.55,'中速與直驅：齒輪少或沒有，用全功率變流器'],[.8,'沒有絕對好壞，看成本、運輸與維修條件']],
 draw(u){
  diagBG();
  const COL=[['齒輪箱＋雙饋式','三級','約 1,000–2,000 rpm','約 30%','變流器小、成本較低','齒輪箱與滑環要保養','#f2c230',3],
   ['中速永磁（混合式）','一至兩級','約 100–500 rpm','100%','齒輪較少、機艙較精簡','仍有齒輪箱、需稀土','#7dc8dc',1.5],
   ['永磁直驅','無','約 10–20 rpm','100%','運動零件最少','發電機大而重、需稀土','#7dffc4',0]];
  const RW=['齒輪箱','發電機轉速','變流器'];
  COL.forEach(([h,a,b,c,pro,con,col,ng],i)=>{const x=60+i*500,w=480,t0=[.02,.36,.5][i];
   card(x,160,w,640,{bg:'rgba(7,27,39,.75)'});
   alphaDo(seg(u,t0,t0+.06),()=>{box(x,160,w,6,col);wt(x+24,206,h,21,col,800);
    /* 小圖示：主軸—齒輪箱—發電機 */
    const y=270,gw=ng*24,gl=Math.max(70,190-ng*30),x0=x+30;
    ln([x0,y,x0+60,y],'#9aa3a8',8);if(ng>0)box(x0+60,y-24,gw+20,48,'#6f7a80','rgba(0,0,0,.4)',1);
    const gx=x0+60+(ng>0?gw+20:0),gh=ng===0?90:ng<2?64:46;ln([gx,y,gx+14,y],'#9aa3a8',4);box(gx+14,y-gh/2,gl,gh,'#58b8d0','rgba(0,0,0,.4)',1);
    [a,b,c].forEach((v,k)=>{const yy=360+k*72;ln([x+24,yy-30,x+w-24,yy-30],'rgba(255,255,255,.1)',1);
     wt(x+24,yy,RW[k],16,'rgba(227,236,238,.7)',600);wt(x+24,yy+28,v,20,'#fff',700);});});
   alphaDo(seg(u,t0+.1,t0+.16),()=>{const yy=596;
    wt(x+24,yy,'優點',17,'#7dffc4',800);wt(x+24,yy+32,pro,18,'#fff',600);
    wt(x+24,yy+80,'限制',17,'#ff9d7a',800);wt(x+24,yy+112,con,18,'#fff',600);});});
  alphaDo(seg(u,.8,.86),()=>tag(800,142,'選擇取決於成本、重量、運輸與維修能力',{size:17,bg:'#f2c230',align:'center'}));
 }},

/* 7 ─────────────────────────────── 送上電網 */
{t:'從發電機到電網',en:'From generator to grid',dur:13,side:true,
 d:'發電機送出的電壓通常只有數百伏特，例如 690 V，要先經過變流器調整成與電網同步，再由塔底或機艙內的升壓變壓器提高到數萬伏特的中壓，透過地下集電線路送到風場變電站，再升壓併入台電電網。台灣電網頻率是 60 Hz，變流器與控制器會持續讓輸出的頻率、電壓與功率因數符合併網規範。齒輪箱與發電機在機艙裡把轉速換成電力，變流器與變壓器則把這些電力整理成電網能接受的樣子。',
 s:[[0,'風機運轉中，電力從機艙沿塔架往下送'],[.3,'變流器讓輸出與 60 Hz 電網同步'],[.55,'升壓變壓器把 690 V 提高到中壓'],[.78,'地下集電線路送到變電站，再併入電網']],
 cam:u=>camMix({x:800,y:430,s:1},{x:820,y:440,s:1.02},ease(seg(u,.1,.9))),
 draw(u){
  windLines(120,560,18,240,.9,7,60);
  const rot=TT*RR*TAU/60;turbineSide(rot,1);
  const g=gyy(TX),bx=TX+36,SX=1180;
  box(bx,g-46,70,46,'#dfe5e8','rgba(0,0,0,.3)',1);for(let i=0;i<3;i++)ln([bx+10,g-36+i*10,bx+60,g-36+i*10],'rgba(0,0,0,.2)',2);
  substation(SX);pylon(1400);ln([SX,gyy(SX)-92,1400,gyy(1400)-160,1700,gyy(1400)-150],'rgba(60,70,75,.7)',1.5);
  const cy=g+28;
  alphaDo(seg(u,.5,.56),()=>{ctx.setLineDash([10,6]);ln([bx+35,g,bx+35,cy,SX,cy,SX,gyy(SX)],'#f2c230',2.5);ctx.setLineDash([]);});
  const DOWN=[TX+140,HY+22,TX+140,HY+36,TX,HY+40,TX,g-20,bx,g-20];
  alphaDo(seg(u,.05,.12),()=>flow(DOWN,5,.45,'#7dffc4',4));
  alphaDo(seg(u,.56,.62),()=>flow([bx+35,g,bx+35,cy,SX,cy,SX,gyy(SX)-70],8,.25,'#f2c230',4.5));
  alphaDo(seg(u,.8,.86),()=>flow([SX,gyy(SX)-92,1400,gyy(1400)-160,1700,gyy(1400)-150],5,.4,'#ff9d7a',4));
  lab(TX+140,HY,'發電機 690 V',{dx:80,dy:-70,st:'g',a:band(u,.04,.3)});
  lab(TX,g-150,'電纜沿塔架而下',{dx:-110,dy:-40,a:band(u,.12,.34)});
  lab(bx+35,g-46,'變流器與控制櫃',{dx:90,dy:-80,st:'s',a:band(u,.3,.56)});
  lab(bx+35,g-30,'升壓變壓器',{dx:110,dy:-60,st:'s',a:band(u,.56,.8)});
  lab(900,cy,'地下集電線路（示例 22.8 kV）',{dx:0,dy:70,st:'s',a:band(u,.6,.86)});
  lab(SX,gyy(SX)-80,'風場變電站',{dx:0,dy:-110,a:band(u,.74,1)});
  lab(1400,gyy(1400)-190,'台電電網 60 Hz',{dx:-40,dy:-60,st:'w',a:band(u,.82,1)});
 },
 hud(u){hudPanel(250,150,'併網狀態（示例）',seg(u,.05,.1),w=>{
  hrow(56,'輸出功率',trf('{p} MW',{p:(3.2+.25*nz(TT*.3)).toFixed(2)}),w,'#f2c230');hrow(88,'電網頻率',trf('{f} Hz',{f:(60+.02*nz(TT*.7)).toFixed(2)}),w,'#7dffc4');hrow(120,'升壓',u>.56?'690 V → 22.8 kV':'690 V',w,'#fff');});}}
]};
