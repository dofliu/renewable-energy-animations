// KITS: land
/* 陸域風電系列 第 8 集：小型風機與分散式應用 */
const gyy=x=>groundY(x);
const PXM=12;                                                 // 側視場景比例：1 m ＝ 12 px（示意）
/* 典型 10 kW 小型風機功率曲線（示例）：切入 3 m/s、額定 11 m/s */
const pc=v=>v<3||v>25?0:v>=11?10:10*(v*v*v-27)/(1331-27);
/* 韋伯分布 k=2（年平均風速 vm） */
const wb=(v,vm)=>{const c=vm/.8862;return 2/c*(v/c)*Math.exp(-(v/c)*(v/c));};
/* 正視水平軸小風機；x,g 為塔底，H 輪轂高，R 轉子半徑；回傳輪轂座標 */
function smallT(x,g,H,R,rot,o){o=o||{};const hy=g-H,tw=Math.max(2,R*.09);
  poly([x-tw,g,x-tw*.55,hy,x+tw*.55,hy,x+tw,g],o.col||'#eef2f4','rgba(0,0,0,.35)',1);
  box(x-R*.2,hy-R*.1,R*.4,R*.2,'#dfe5e8','rgba(0,0,0,.35)',1);
  for(let i=0;i<3;i++){const a=rot+i*TAU/3,c=Math.cos(a),s=Math.sin(a),tx=x+s*R,ty=hy-c*R,nx=c*R*.06,ny=s*R*.06;
   poly([x-nx,hy-ny,x+nx,hy+ny,tx+nx*.3,ty+ny*.3,tx-nx*.3,ty-ny*.3],'#f4f6f7','rgba(0,0,0,.35)',1);}
  circ(x,hy,Math.max(2,R*.1),'#dfe5e8','#394650',1);return [x,hy];}
/* 側視垂直軸（H 型達里厄）小風機 */
function vawtSide(x,g,H,R,h,rot){const hy=g-H;
  ln([x,g,x,hy-h/2],'#dfe5e8',Math.max(2,R*.08));
  [[hy-h*.3],[hy+h*.3]].forEach(([y])=>ln([x-R*.95,y,x+R*.95,y],'rgba(223,229,232,.55)',1.5));
  const B=[0,1,2].map(i=>{const a=rot+i*TAU/3;return {x:x+Math.sin(a)*R,z:Math.cos(a)};}).sort((a,b)=>a.z-b.z);
  B.forEach(b=>{const w=Math.max(2,R*.1);box(b.x-w/2,hy-h/2,w,h,b.z>0?'#f4f6f7':'#b9c3c9','rgba(0,0,0,.35)',1);
   ln([x,hy-h*.3,b.x,hy-h*.3],'#9aa3a8',1.2);ln([x,hy+h*.3,b.x,hy+h*.3],'#9aa3a8',1.2);});}
function house(x,g,w,h,col){box(x,g-h,w,h,col||'#e9dcc6','rgba(0,0,0,.3)',1);
  poly([x-8,g-h,x+w/2,g-h-h*.55,x+w+8,g-h],'#a8553a','rgba(0,0,0,.3)',1);
  for(let i=0;i<2;i++)box(x+w*.18+i*w*.44,g-h*.72,w*.2,h*.26,'#6f8ea0','rgba(0,0,0,.3)',1);box(x+w*.44,g-h*.42,w*.14,h*.42,'#7a5a3e');}
function tree(x,s){const g=gyy(x);s=s||1;ln([x,g,x,g-50*s],'#5b4632',5*s);circ(x,g-66*s,26*s,'#3f6b45');circ(x-14*s,g-52*s,18*s,'#4a7a50');circ(x+14*s,g-54*s,18*s,'#4a7a50');}
/* 風的流線（持續移動的短線） */
function windStreaks(y0,y1,n,sp,a){const r=rng(5);alphaDo(a,()=>{for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),x=VX0+((r()*2000+TT*sp)%(VX1-VX0+200))-100;ln([x,y,x+46,y],'rgba(255,255,255,.7)',1.6);}});}
function along(P,f){let L=0;const S=[];for(let i=2;i<P.length;i+=2){const d=Math.hypot(P[i]-P[i-2],P[i+1]-P[i-1]);S.push(d);L+=d;}
  let t=((f%1)+1)%1*L;for(let i=0;i<S.length;i++){if(t<=S[i]){const k=t/S[i];return [lerp(P[i*2],P[i*2+2],k),lerp(P[i*2+1],P[i*2+3],k)];}t-=S[i];}return [P[P.length-2],P[P.length-1]];}
function flow(P,n,sp,col,r){for(let i=0;i<n;i++){const [x,y]=along(P,TT*sp+i/n);circ(x,y,r||4,col);}}
/* 翼型剖面（俯視圖用），弦長 L，方向 ang */
function foil(x,y,L,ang,col){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.beginPath();
  const T=s=>L*.15*5*(.2969*Math.sqrt(s)-.126*s-.3516*s*s+.2843*s*s*s-.1015*s*s*s*s);
  for(let i=0;i<=16;i++){const s=i/16;ctx.lineTo(L/2-s*L,-T(s));}for(let i=16;i>=0;i--){const s=i/16;ctx.lineTo(L/2-s*L,T(s));}
  ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.strokeStyle='#13232e';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();}
/* 模擬風速（持續變動，示例） */
const wsNow=(b,a)=>b+a*(.6*Math.sin(TT*.7)+.4*Math.sin(TT*1.9+1));

const EP={no:8,slug:'onshore-wind',seriesName:'陸域風電系列',t:'小型風機與分散式應用',en:'Small wind turbines and distributed use',
lede:'不是每一部風機都有百公尺高。小型風機立在農舍旁、漁港邊或離島村落，發的電就近使用。這一集比較水平軸與垂直軸的設計，看低風速場址的功率曲線與年發電量，說明為什麼屋頂上往往不是好位置，以及小風機如何和太陽光電、儲能一起撐起離島微電網。',
facts:[['≤ 200','m²','IEC 61400-2 小型風機的掃掠面積上限，約為直徑 16 m'],
['59.3','%','貝茲極限：理論上風機最多能從風中擷取的能量比例'],
['8','倍','風速變為 2 倍時，風中的功率變為 2³ = 8 倍'],
['9','m','經驗法則：葉片最低點至少高出 90 m 內障礙物 9 m'],
['≈ 2','倍','同一部 10 kW 風機，年均風速 5 m/s 與 4 m/s 場址的年發電量比（示例）'],
['7.4110','元/度','114 年度陸域風力 1 瓩以上不及 30 瓩的躉購費率']],
note:'說明：本集為教育用途示意動畫，風機、建築與離島電力設施的比例經過簡化，時間已壓縮。小型風機掃掠面積 ≤ 200 m²、電壓低於 AC 1000 V／DC 1500 V 依 IEC 61400-2 與國家標準 CNS 15176-2；貝茲極限 16/27 ≈ 59.3% 為理論值；「葉片最低點高出 90 m（300 ft）內障礙物 9 m（30 ft）」為美國能源部等機構常用的經驗法則，實際須依場址評估；114 年度陸域風力 1 瓩以上不及 30 瓩躉購費率 7.4110 元/度依經濟部公告，各年度費率請以最新公告為準；澎湖設有中小型風機測試場。10 kW 風機的功率曲線（切入 3 m/s、額定 11 m/s）、以韋伯分布 k=2 估算的年發電量（年均 4、5、6 m/s 約 6,700、13,600、21,900 度）、各型風機的典型功率係數、屋頂與塔架的風速與紊流強度、離島負載與各電源出力、日夜與季節出力曲線皆為典型範例，並非特定機型或案場資料。',
base:()=>{landSky(GY,{sun:{x:1320,y:120}});drawGround();},
shots:[
/* 1 ─────────────────────────────── 在自家旁邊發電 */
{t:'在自家旁邊發電',en:'Power beside the farmhouse',dur:13,side:true,
 d:'小型風機是容量從數百瓦到數十瓩的風力發電機，常見於農場、漁港、山區工作站與離島。以一部 10 kW 機組為例，轉子直徑約 7 m，裝在 18 m 高的塔架上，和農舍差不多是同一個尺度。葉片帶動發電機產生變動的交流電，經控制器與變流器整理成穩定的電力，先供自家使用，多餘的電再併入電網。它的價值不在規模，而在電就在用電的地方產生，不需要長距離輸電。',
 s:[[0,'農舍旁的一部 10 kW 小型風機'],[.25,'轉子直徑 7 m，塔架 18 m 高'],[.5,'控制器與變流器把電整理成穩定的交流電'],[.75,'先供自家使用，多餘的電併入電網']],
 cam:u=>camMix({x:820,y:430,s:1.3},{x:800,y:470,s:1.55},ease(seg(u,0,.4))),
 draw(u){
  windStreaks(260,560,18,420,.55);
  const TX=1000,g=gyy(TX),H=18*PXM,R=3.5*PXM,ws=wsNow(6.2,1.6),rot=TT*2.6;
  tree(420,1.1);tree(1260,1.2);tree(1330,.9);
  const hx=560,hg=gyy(hx+80);house(hx,hg,160,84);
  /* 電纜：塔底 → 控制櫃 → 住宅 */
  const cx=800,cg=gyy(cx);cabinet(cx-22,cg,44,56,'#dfe5e8');circ(cx,cg-48,3,'#7dffc4');
  const P=[TX,g+2,TX,g+18,cx,cg+18,cx,cg-2],Q=[cx-22,cg-30,hx+160,hg-30];
  ln(P,'rgba(40,50,60,.7)',3);ln(Q,'rgba(40,50,60,.7)',3);
  const pw=pc(ws)/10;if(pw>0){flow(P,6,.35+pw*.4,'#f2c230',3.5);flow(Q,4,.35+pw*.4,'#f2c230',3.5);}
  smallT(TX,g,H,R,rot);
  person(TX+60,gyy(TX+60),'#e8572a',2.2);
  lab(TX,g-H,'小型風機 10 kW',{dx:-150,dy:-60,st:'s',a:band(u,.04,.5)});
  lab(TX+R,g-H,'轉子直徑 7 m',{dx:110,dy:50,st:'l',a:band(u,.25,.55)});
  lab(TX,g-H*.45,'塔架 18 m',{dx:110,dy:0,st:'l',a:band(u,.28,.58)});
  lab(cx,cg-56,'控制器與變流器',{dx:-40,dy:-110,st:'g',a:band(u,.5,.8)});
  lab(hx+80,hg-100,'自用，餘電併網',{dx:-90,dy:-80,st:'g',a:band(u,.74,1)});
 },
 hud(u){hudPanel(250,182,'小型風機（示例）',seg(u,.03,.08),w=>{const ws=wsNow(6.2,1.6);
  hrow(56,'風速',trf('{n} m/s',{n:ws.toFixed(1)}),w,'#fff');
  hrow(88,'輸出功率',trf('{n} kW',{n:pc(ws).toFixed(1)}),w,'#f2c230');
  hrow(120,'今日發電',trf('{n} 度',{n:(38+u*6).toFixed(1)}),w,'#7dffc4');
  hrow(152,'額定容量','10 kW',w,'#fff');});}},

/* 2 ─────────────────────────────── 多小才算小 */
{t:'多小才算小',en:'How small is small',dur:13,
 d:'國際標準 IEC 61400-2 把轉子掃掠面積不超過 200 m²、輸出電壓低於交流 1000 V 或直流 1500 V 的風機定義為小型風機，台灣的國家標準 CNS 15176-2 採用同樣的界線。200 m² 相當於直徑約 16 m 的轉子。一部 10 kW 機組的直徑約 7 m、掃掠面積約 38 m²；而 4 MW 級的大型陸域風機直徑約 136 m，掃掠面積超過 14,000 m²，是小型上限的 70 多倍。',
 s:[[0,'同一比例尺下，小型風機幾乎看不見'],[.3,'放大來看：10 kW 與 1 kW 機組'],[.55,'IEC 61400-2：掃掠面積不超過 200 m²'],[.78,'大型風機的掃掠面積是上限的 70 多倍']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'與大型風機比一比（同一比例尺）',20,'#f2c230',700);
  const G=740,S=2.8;
  box(62,G,696,58,'rgba(164,135,106,.35)');ln([62,G,758,G],'rgba(227,236,238,.5)',1.5);
  smallT(280,G,110*S,68*S,TT*.5);
  smallT(600,G,18*S,3.5*S,TT*2.6);smallT(640,G,10*S,1.25*S,TT*3.4);
  wt(280,780,'4 MW 級：輪轂 110 m、直徑 136 m',16,'rgba(227,236,238,.85)',600,'center');
  /* 放大框 */
  const zk=ease(seg(u,.25,.36));
  ctx.setLineDash([5,4]);ln([585,G-60,660,G-60,660,G+4,585,G+4,585,G-60],'#f2c230',1.5);ctx.setLineDash([]);
  if(zk>0)alphaDo(zk,()=>{ln([585,G-60,500,480],'rgba(242,194,48,.6)',1);ln([660,G-60,740,480],'rgba(242,194,48,.6)',1);
   box(500,240,240,240,'#1d3c52','#f2c230',1.5);
   ctx.save();ctx.beginPath();ctx.rect(500,240,240,240);ctx.clip();
   const g2=450,k=9;box(500,g2,240,30,'rgba(164,135,106,.5)');
   smallT(555,g2,18*k,3.5*k,TT*2.6);house(592,g2,64,56);smallT(705,g2,10*k,1.25*k,TT*3.4);
   ctx.restore();
   wt(555,472,'10 kW',15,'#fff',700,'center',COND);wt(705,472,'1 kW',15,'#fff',700,'center',COND);
   wt(510,262,'放大 3 倍',14,'#f2c230',700);});
  /* 右：掃掠面積 */
  card(800,160,740,420,{bg:'rgba(7,27,39,.75)'});wt(824,200,'掃掠面積（同一比例尺）',20,'#f2c230',700);
  const cy=380,k2=12;
  ctx.save();ctx.beginPath();ctx.rect(802,220,736,358);ctx.clip();
  const bk=seg(u,.72,.84);if(bk>0){ctx.beginPath();ctx.arc(1540+68*k2-180,cy,68*k2,0,TAU);ctx.fillStyle=`rgba(255,157,122,${(.16*bk).toFixed(3)})`;ctx.fill();ctx.strokeStyle=`rgba(255,157,122,${bk.toFixed(3)})`;ctx.lineWidth=2.5;ctx.stroke();}
  ctx.restore();
  const CI=[[880,1.25,'1 kW','D 2.5 m','4.9 m²',.08],[990,3.5,'10 kW','D 7 m','38 m²',.18],[1170,8,'小型上限','D 16 m','200 m²',.5]];
  CI.forEach(([x,r,n,d,a,t],i)=>{const k=ease(seg(u,t,t+.08));if(k<=0)return;alphaDo(k,()=>{
   if(i===2){ctx.setLineDash([8,6]);ring(x,cy,r*k2,'#e8572a',2.5);ctx.setLineDash([]);}
   else circ(x,cy,r*k2,'rgba(242,194,48,.25)','#f2c230',2);
   wt(x,cy+116,n,18,i===2?'#ff9d7a':'#fff',700,'center');wt(x,cy+142,d,17,'rgba(227,236,238,.8)',600,'center',COND);wt(x,cy+166,a,19,i===2?'#ff9d7a':'#f2c230',700,'center',COND);});});
  if(bk>0)alphaDo(bk,()=>{wt(1430,cy-40,'大型',18,'#ff9d7a',700,'center');wt(1430,cy-14,'D 136 m',17,'#fff',600,'center',COND);wt(1430,cy+12,'≈ 14,500 m²',18,'#ff9d7a',700,'center',COND);});
  card(800,610,740,190,{bg:'rgba(7,27,39,.75)'});wt(824,650,'小型風機的定義',20,'#7dffc4',700);
  const DR=[['IEC 61400-2：掃掠面積 ≤ 200 m²',.55],['輸出電壓低於 AC 1000 V／DC 1500 V',.62],['台灣國家標準 CNS 15176-2 同樣界線',.68]];
  DR.forEach(([s,t],i)=>alphaDo(seg(u,t,t+.05),()=>{const y=670+i*40;box(824,y,6,30,'#7dffc4');wt(844,y+22,s,17,'#fff',600);}));
 }},

/* 3 ─────────────────────────────── 水平軸與垂直軸 */
{t:'水平軸與垂直軸',en:'Horizontal or vertical axis',dur:13,
 d:'小型風機有兩大類。水平軸風機和大型風機一樣面向來風，但多半沒有偏航馬達，而是靠尾舵像風向標一樣自動對風，效率較高、技術成熟。垂直軸風機的主軸直立，不論風從哪個方向來都能轉動，發電機可以放在地面附近，常見的有靠升力旋轉的達里厄式，以及靠阻力推動的薩佛紐斯式。垂直軸機型對紊流與風向變化較能適應，但功率係數通常較低；任何風機都無法超過 59.3% 的貝茲極限。',
 s:[[0,'水平軸：尾舵像風向標一樣自動對風'],[.3,'垂直軸：不論風從哪裡來都能轉'],[.55,'達里厄式靠升力，薩佛紐斯式靠阻力'],[.75,'效率比一比，上限是 59.3% 的貝茲極限']],
 draw(u){
  diagBG();
  const wd=.55*Math.sin(TT*.55)+.25*Math.sin(TT*1.3);   // 風向擺動（弧度）
  /* 左：水平軸俯視 */
  card(60,160,700,370,{bg:'rgba(7,27,39,.75)'});wt(84,200,'水平軸（俯視）',20,'#f2c230',700);
  const hx=250,hy=350,la=wd*.9;
  ctx.save();ctx.beginPath();ctx.rect(62,220,696,308);ctx.clip();
  for(let i=0;i<4;i++){const y=260+i*56,x=90+((TT*120+i*50)%70);ctx.save();ctx.translate(hx,hy);ctx.rotate(wd);ctx.translate(-hx,-hy);arrow(x,y,x+50,y,'rgba(125,200,220,.85)',2.5);ctx.restore();}
  ctx.restore();
  ctx.save();ctx.translate(hx,hy);ctx.rotate(la);
  box(-10,-90,8,180,'#f4f6f7','#13232e',1.2);rrp(-4,-14,70,28,6);ctx.fillStyle='#dfe5e8';ctx.fill();ctx.strokeStyle='#13232e';ctx.lineWidth=1.2;ctx.stroke();
  ln([66,0,150,0],'#9aa3a8',3);poly([150,-4,200,-34,214,-34,214,34,200,34,150,4],'#f2c230','#13232e',1.2);
  circ(-8,0,9,'#dfe5e8','#13232e',1.2);
  ctx.restore();
  lab(hx+Math.cos(la)*200,hy+Math.sin(la)*200,'尾舵',{dx:-40,dy:70,st:'s',a:band(u,.04,.5)});
  lab(hx-6*Math.cos(la)+90*Math.sin(la),hy-6*Math.sin(la)-90*Math.cos(la),'轉子',{dx:-70,dy:30,st:'l',a:band(u,.04,.5)});
  const HL=[['尾舵自動對風','構造簡單',.06],['效率較高','機型成熟',.14]];
  HL.forEach(([a,b,t],i)=>alphaDo(seg(u,t,t+.05),()=>{const y=300+i*90;box(556,y,6,64,'#f2c230');wt(574,y+26,a,17,'#fff',700);wt(574,y+54,b,16,'rgba(227,236,238,.8)',600);}));
  /* 右：垂直軸俯視 */
  card(800,160,740,370,{bg:'rgba(7,27,39,.75)'});wt(824,200,'垂直軸（俯視）',20,'#f2c230',700);
  ctx.save();ctx.beginPath();ctx.rect(802,220,736,308);ctx.clip();
  for(let i=0;i<4;i++){const y=260+i*56,x=830+((TT*120+i*50)%60);ctx.save();ctx.translate(1170,360);ctx.rotate(wd);ctx.translate(-1170,-360);arrow(x,y,x+44,y,'rgba(125,200,220,.85)',2.5);ctx.restore();}
  ctx.restore();
  const da=seg(u,.28,.36),r1=TT*1.8;
  alphaDo(.35+.65*da,()=>{const cx=1020,cy=350,R=80;ring(cx,cy,R,'rgba(227,236,238,.25)',1.5);circ(cx,cy,8,'#dfe5e8','#13232e',1.2);
   for(let i=0;i<3;i++){const a=r1+i*TAU/3,x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;ln([cx,cy,x,y],'#9aa3a8',1.5);foil(x,y,58,a+Math.PI/2,'#f4f6f7');}
   wt(cx,462,'達里厄式',18,'#fff',700,'center');wt(cx,488,'升力型',15,'#7dffc4',600,'center');});
  alphaDo(.35+.65*da,()=>{const cx=1320,cy=350,a=TT*1.1,R=56;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
   ctx.lineWidth=7;ctx.strokeStyle='#f4f6f7';ctx.beginPath();ctx.arc(-R/2+6,0,R/2,0,Math.PI);ctx.stroke();ctx.beginPath();ctx.arc(R/2-6,0,R/2,Math.PI,TAU);ctx.stroke();ctx.restore();
   ring(cx,cy,R+12,'rgba(227,236,238,.25)',1.5);circ(cx,cy,7,'#dfe5e8','#13232e',1.2);
   wt(cx,462,'薩佛紐斯式',18,'#fff',700,'center');wt(cx,488,'阻力型',15,'#7dc8dc',600,'center');});
  alphaDo(band(u,.3,.6),()=>tag(1170,256,'任何風向都能轉',{size:16,bg:'#7dffc4',align:'center'}));
  /* 下：功率係數 */
  card(60,560,1480,240,{bg:'rgba(7,27,39,.75)'});wt(84,600,'功率係數 Cp（典型最大值，示例）',20,'#f2c230',700);
  const X0=300,X1=1400,Xc=v=>X0+(X1-X0)*v/.6;
  ln([X0,628,X0,780],'rgba(255,255,255,.4)',1.2);
  [0,.2,.4,.6].forEach(v=>wt(Xc(v),796,String(v.toFixed(1)),15,'rgba(227,236,238,.7)',600,'center',COND));
  const CP=[['水平軸',.4,'#f2c230'],['達里厄式',.35,'#7dffc4'],['薩佛紐斯式',.18,'#7dc8dc']];
  CP.forEach(([n,v,c],i)=>{const k=ease(seg(u,.58+i*.06,.68+i*.06)),y=636+i*46;wt(X0-16,y+24,n,17,'#fff',700,'right');
   box(X0,y+4,(Xc(v)-X0)*k,30,c);if(k>.9)wt(Xc(v)+10,y+28,v.toFixed(2),19,'#fff',700,'left',COND);});
  const bz=seg(u,.78,.84);if(bz>0)alphaDo(bz,()=>{ctx.setLineDash([7,5]);ln([Xc(.593),622,Xc(.593),778],'#e8572a',2.5);ctx.setLineDash([]);wt(Xc(.593)-10,620,'貝茲極限 0.593',16,'#ff9d7a',700,'right');});
 }},

/* 4 ─────────────────────────────── 低風速的功率曲線 */
{t:'低風速的功率曲線',en:'Power curves at low wind speeds',dur:14,
 d:'風中的功率與風速的三次方成正比，風速加倍，功率變為 8 倍。小型風機常裝在風況普通的地方，因此看的是低風速區段：典型 10 kW 機組約在 3 m/s 開始發電，11 m/s 才達到額定功率。一年之中的風速大致呈韋伯分布，年平均 5 m/s 的場址，最常出現的風速只有 4 m/s 左右。估算年發電量時，要把每個風速的功率乘上出現時數再加總。年均風速從 4 m/s 提高到 5 m/s，年發電量約增加一倍，所以選址比選機型更重要。',
 s:[[0,'功率與風速的三次方成正比'],[.25,'典型 10 kW 機組：3 m/s 起轉，11 m/s 額定'],[.5,'年均 5 m/s 的場址，風速分布集中在低風速'],[.75,'年均風速差 1 m/s，年發電量差約一倍']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,860,640,{title:'功率曲線與風速分布（示例）',x0:0,x1:20,y0:0,y1:12,xt:[0,5,10,15,20],yt:[0,5,10],xl:'風速 m/s',yl:'功率 kW',pl:80,pt:80,pb:64,gx:4,gy:4});
  /* 三次方參考 */
  const k0=seg(u,.02,.2);if(k0>0){ctx.beginPath();for(let i=0;i<=100;i++){const v=20*i/100*k0,p=10*Math.pow(v/11,3);if(p>12.5)break;i?ctx.lineTo(C.X(v),C.Y(p)):ctx.moveTo(C.X(v),C.Y(p));}ctx.setLineDash([6,5]);ctx.strokeStyle='rgba(227,236,238,.55)';ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);}
  alphaDo(band(u,.06,.3),()=>tag(C.X(8.6),C.Y(11),'∝ 風速³',{size:16,bg:'#fff'}));
  /* 風速分布 */
  const wk=seg(u,.48,.6);if(wk>0){ctx.beginPath();ctx.moveTo(C.X(0),C.Y(0));for(let i=0;i<=100;i++){const v=20*i/100;ctx.lineTo(C.X(v),C.Y(wb(v,5)*60*wk));}ctx.lineTo(C.X(20),C.Y(0));ctx.closePath();ctx.fillStyle='rgba(125,200,220,.28)';ctx.fill();ctx.strokeStyle='#7dc8dc';ctx.lineWidth=2;ctx.stroke();
   alphaDo(wk,()=>tag(C.X(11.5),C.Y(3.2),'年均 5 m/s 的風速分布',{size:16,bg:'#7dc8dc'}));}
  /* 功率曲線 */
  const vk=20*seg(u,.22,.46);if(vk>0){ctx.beginPath();for(let i=0;i<=200;i++){const v=vk*i/200;i?ctx.lineTo(C.X(v),C.Y(pc(v))):ctx.moveTo(C.X(v),C.Y(pc(v)));}ctx.strokeStyle='#f2c230';ctx.lineWidth=4;ctx.stroke();circ(C.X(vk),C.Y(pc(vk)),6,'#f2c230','#13232e',1.5);}
  alphaDo(band(u,.26,.5),()=>{tag(C.X(3),C.Y(1.6),'切入 3 m/s',{size:16,bg:'#7dffc4',align:'center'});});
  alphaDo(band(u,.34,.5),()=>{tag(C.X(11),C.Y(10)-30,'額定 11 m/s',{size:16,bg:'#f2c230',align:'center'});});
  /* 右：年發電量 */
  card(960,160,580,640,{bg:'rgba(7,27,39,.75)'});wt(984,200,'年發電量（10 kW，示例）',20,'#f2c230',700);
  const AE=[[4,6700,7.7],[5,13600,15.5],[6,21900,25.0]],B0=660,BH=380/22000;
  AE.forEach(([v,e,cf],i)=>{const k=ease(seg(u,.66+i*.07,.76+i*.07)),x=1030+i*170,h=e*BH*k;
   box(x,B0-h,110,h,i===1?'#f2c230':'rgba(242,194,48,.55)');
   wt(x+55,B0+34,trf('年均 {n} m/s',{n:v}),17,'#fff',700,'center');
   if(k>0){wt(x+55,B0-h-40,trf('{n} 度',{n:Math.round(e*k/100)*100}),19,'#fff',700,'center',COND);wt(x+55,B0-h-14,trf('容量因數 {n}%',{n:(cf*k).toFixed(1)}),15,'rgba(227,236,238,.8)',600,'center');}});
  ln([1000,B0,1520,B0],'rgba(255,255,255,.5)',1.4);
  alphaDo(seg(u,.86,.92),()=>tag(1250,740,'風速多 1 m/s，發電量約多一倍',{size:16,bg:'#7dffc4',align:'center'}));
 }},

/* 5 ─────────────────────────────── 屋頂與亂流 */
{t:'屋頂上的亂流',en:'Turbulence over the roof',dur:13,side:true,
 base:()=>{landSky(GY,{sun:{x:1320,y:120},clouds:false});drawGround();},
 d:'把風機裝在屋頂看似省了塔架，實際上風經過建築物時會在屋頂邊緣分離，屋頂上方與建築物後方形成風速低、方向亂的紊流區。在這裡運轉的風機發電量少，還會把振動與噪音傳進室內，結構也要重新檢核。常用的經驗法則是：葉片最低點至少高出周圍 90 m 內最高障礙物 9 m。塔架型小風機的塔架費用雖高，卻能讓轉子進入較穩定的風，通常比屋頂型划算。',
 s:[[0,'風吹過建築物，在屋頂邊緣分離'],[.25,'屋頂上方與後方形成紊流區'],[.48,'屋頂型風機：風亂、振動與噪音'],[.7,'塔架型：葉片最低點高出障礙物 9 m 以上']],
 cam:u=>({x:820,y:430,s:1.12}),
 draw(u){
  const bx=360,bw=240,bh=12*PXM,bg=gyy(bx+bw/2);
  /* 流線 */
  const fa=seg(u,.02,.1);
  alphaDo(fa,()=>{for(let j=0;j<6;j++){const y0=bg-bh-120+j*40;ctx.beginPath();for(let x=VX0;x<=VX1;x+=10){const dx=x-(bx+bw/2),bump=j<3?Math.exp(-(dx*dx)/(2*260*260))*(90-j*22):0;ctx.lineTo(x,y0-bump);}ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=1.5;ctx.stroke();}
   const r=rng(3);for(let i=0;i<14;i++){const x=VX0+((r()*2000+TT*300)%(VX1-VX0));const y=bg-bh-120+r()*200;ln([x,y,x+30,y],'rgba(255,255,255,.7)',1.6);}});
  /* 紊流區 */
  const ta=band(u,.2,1);
  if(ta>0)alphaDo(ta,()=>{ctx.beginPath();ctx.moveTo(bx,bg-bh);ctx.quadraticCurveTo(bx+bw*.5,bg-bh-110,bx+bw+80,bg-bh-70);ctx.quadraticCurveTo(bx+bw+300,bg-bh+20,bx+bw+420,bg);ctx.lineTo(bx+bw,bg);ctx.closePath();ctx.fillStyle='rgba(232,87,42,.16)';ctx.fill();ctx.setLineDash([6,5]);ctx.strokeStyle='rgba(232,87,42,.8)';ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);
   for(let i=0;i<7;i++){const ph=TT*1.4+i*1.3,x=bx+60+((i*67+TT*50)%(bw+300)),y=bg-bh-10+Math.sin(ph)*18+(x>bx+bw?(x-bx-bw)*.25:-40);ctx.beginPath();ctx.arc(x,y,12,ph,ph+4.2);ctx.strokeStyle='rgba(255,157,122,.9)';ctx.lineWidth=2;ctx.stroke();}});
  /* 建築 */
  box(bx,bg-bh,bw,bh,'#cfd6d9','rgba(0,0,0,.35)',1);
  for(let r=0;r<3;r++)for(let c=0;c<5;c++)box(bx+18+c*44,bg-bh+16+r*44,26,24,'#6f8ea0','rgba(0,0,0,.25)',1);
  /* 屋頂型 */
  const sh=band(u,.42,.7)*Math.sin(TT*23)*2.5,rx=bx+bw/2;
  ctx.save();ctx.translate(sh,0);smallT(rx,bg-bh,4*PXM,2*PXM,TT*(2+1.5*Math.sin(TT*2.3)));ctx.restore();
  if(band(u,.42,.7)>0)alphaDo(band(u,.42,.7),()=>{for(let i=0;i<3;i++){const k=((TT*1.2+i/3)%1);ctx.beginPath();ctx.arc(rx,bg-bh+10,20+k*40,Math.PI*.1,Math.PI*.9);ctx.strokeStyle=`rgba(255,157,122,${(1-k).toFixed(3)})`;ctx.lineWidth=2;ctx.stroke();}});
  tree(820,1.3);
  /* 塔架型：障礙物最高 12 m → 葉片最低點 21 m */
  const TX=1240,g=gyy(TX),R=3.5*PXM,H=(12+9+3.5)*PXM;
  smallT(TX,g,H,R,TT*2.8);
  const tk=band(u,.66,1);
  if(tk>0)alphaDo(tk,()=>{ctx.setLineDash([6,5]);ln([bx,bg-bh,TX+80,bg-bh],'rgba(255,255,255,.75)',1.5);ln([TX-R-40,g-H+R,TX+80,g-H+R],'#7dffc4',1.5);ctx.setLineDash([]);
   arrow(TX+70,bg-bh,TX+70,g-H+R+2,'#7dffc4',2);arrow(TX+70,g-H+R,TX+70,bg-bh-2,'#7dffc4',2);
   ln([bx,g+30,TX,g+30],'rgba(255,255,255,.8)',1.5);ln([bx,g+22,bx,g+38],'rgba(255,255,255,.8)',1.5);ln([TX,g+22,TX,g+38],'rgba(255,255,255,.8)',1.5);});
  lab(bx,bg-bh,'屋頂邊緣氣流分離',{dx:-120,dy:-70,st:'l',a:band(u,.04,.3)});
  lab(bx+bw+160,bg-bh+60,'紊流區',{dx:40,dy:-120,st:'w',a:band(u,.22,.5)});
  lab(rx,bg-bh-4*PXM,'屋頂型：振動與噪音',{dx:-60,dy:-110,st:'w',a:band(u,.44,.7)});
  lab(TX+70,(bg-bh+g-H+R)/2,'高出 9 m 以上',{dx:90,dy:0,st:'g',a:band(u,.68,1)});
  lab((bx+TX)/2,g+30,'90 m 內的障礙物',{dx:0,dy:60,st:'l',a:band(u,.72,1)});
 },
 hud(u){hudPanel(250,150,'風況比較（示例）',seg(u,.03,.08),w=>{const on=u>.48;
  hrow(56,'屋頂 風速',trf('{n} m/s',{n:wsNow(3.8,.9).toFixed(1)}),w,'#ff9d7a');
  hrow(88,'屋頂 紊流強度',u<.22?'—':'35%',w,'#ff9d7a');
  hrow(120,'塔架 風速',on?trf('{n} m/s',{n:wsNow(5.2,.6).toFixed(1)}):'—',w,'#7dffc4');});}},

/* 6 ─────────────────────────────── 離島微電網 */
{t:'離島微電網',en:'An island microgrid',dur:14,side:true,
 base:()=>{},
 d:'離島的電力過去多半依靠柴油發電機，燃料要用船運，發電成本高，也受天候影響。把小型或中型風機、太陽光電與儲能電池接進同一個微電網，由控制器即時分配：白天陽光充足時光電供電並替電池充電，入夜後由風機與電池接手，只有兩者都不夠時才啟動柴油機補足。柴油機從主角變成備援，燃料用量與排放隨之下降。電池也負責平滑風力與日照的快速變動，讓電壓與頻率維持穩定。',
 s:[[0,'離島村落原本靠柴油發電'],[.22,'白天：光電供電，同時替電池充電'],[.5,'入夜：風機與電池接手供電'],[.78,'兩者不足時，柴油機才補上']],
 cam:u=>({x:820,y:440,s:1.1}),
 draw(u){
  const hr=lerp(8,30,u)%24,day=clamp(1-Math.abs(hr-12.5)/6.5,0,1),dk=1-day;
  landSky(GY,{sun:{x:lerp(300,1500,clamp((hr-6)/13,0,1)),y:hr<6.3||hr>18.7?760:420-340*Math.sin(Math.PI*clamp((hr-6)/13,0,1))},dusk:clamp(dk*1.2,0,1),clouds:false});
  if(dk>.4)alphaDo((dk-.4)/.6*.55,()=>box(VX0,VY0,VX1-VX0,VY1-VY0,'#0b1a2a'));
  /* 海 */
  ctx.beginPath();ctx.moveTo(VX0,GY+10);for(let x=VX0;x<=330;x+=8)ctx.lineTo(x,GY+10+3*Math.sin(x*.05+TT*2));ctx.lineTo(330,VY1+20);ctx.lineTo(VX0,VY1+20);ctx.closePath();ctx.fillStyle='#1f7f99';ctx.fill();
  ctx.save();ctx.beginPath();ctx.rect(330,VY0,VX1,VY1-VY0+40);ctx.clip();drawGround();ctx.restore();
  poly([300,VY1+20,330,GY+10,360,gyy(360),380,VY1+20],'#c4a678');
  const P=pw6(u);
  /* 設施 */
  const W1=[440,540],WX=W1;WX.forEach(x=>smallT(x,gyy(x),22*PXM*.8,6*PXM*.8,TT*(1.2+P.w/40)));
  for(let i=0;i<4;i++)solarPanel(680+i*62,gyy(680+i*62),54,22,{glint:day>.5});
  const bx=960;box(bx,gyy(bx)-50,110,50,'#dfe5e8','rgba(0,0,0,.35)',1);for(let i=0;i<4;i++)box(bx+10+i*25,gyy(bx)-42,16,34,'#b9c3c9');
  const bl=P.b<0?'#7dffc4':P.b>0?'#f2c230':'#9aa3a8';circ(bx+100,gyy(bx)-42,4,bl);
  const dx=1110;box(dx,gyy(dx)-44,90,44,'#8d989f','rgba(0,0,0,.35)',1);ln([dx+70,gyy(dx)-44,dx+70,gyy(dx)-80],'#5b6b74',6);
  if(P.d>0){for(let i=0;i<4;i++){const k=((TT*.6+i/4)%1);alphaDo(1-k,()=>circ(dx+70+k*20,gyy(dx)-86-k*50,6+k*12,'rgba(120,120,120,.6)'));}}
  const cx=1250;cabinet(cx-20,gyy(cx),40,52,'#dfe5e8');
  [1330,1400,1470].forEach((x,i)=>{house(x,gyy(x+25),50,40,i%2?'#e9dcc6':'#dde6ea');if(dk>.35)alphaDo(dk,()=>{box(x+9,gyy(x+25)-29,10,10,'#f2c230');box(x+31,gyy(x+25)-29,10,10,'#f2c230');});});
  /* 母線與潮流 */
  const bus=gyy(900)+34;ln([440,bus,1480,bus],'rgba(40,50,60,.8)',3);
  const drop=(x,on,dir)=>{const Q=dir>0?[x,gyy(x)+2,x,bus]:[x,bus,x,gyy(x)+2];ln([x,gyy(x)+2,x,bus],'rgba(40,50,60,.8)',2.5);if(on)flow(Q,3,.8,'#f2c230',3.5);};
  drop(490,P.w>1,1);drop(770,P.s>1,1);drop(bx+55,Math.abs(P.b)>1,P.b>0?1:-1);drop(dx+45,P.d>1,1);drop(1430,true,-1);
  lab(490,gyy(490)-22*PXM*.8,'小型風機',{dx:-60,dy:-60,st:'s',a:band(u,.02,1)});
  lab(770,gyy(770)-40,'太陽光電',{dx:0,dy:-120,st:'s',a:band(u,.02,1)});
  lab(bx+55,gyy(bx)-50,P.b<0?'儲能：充電':'儲能：放電',{dx:-20,dy:-150,st:'g',a:band(u,.2,1)});
  lab(dx+45,gyy(dx)-44,'柴油發電機',{dx:60,dy:-100,st:P.d>1?'w':'n',a:band(u,.02,1)});
  lab(cx,gyy(cx)-52,'微電網控制器',{dx:40,dy:70,st:'l',a:band(u,.1,.4)});
 },
 hud(u){hudPanel(250,214,'離島電力（示例）',seg(u,.03,.08),w=>{const P=pw6(u),hr=Math.floor(lerp(8,30,u)%24);
  hrow(56,'時間',trf('{n}:00',{n:String(hr).padStart(2,'0')}),w,'#fff');
  hrow(86,'負載',trf('{n} kW',{n:P.L.toFixed(0)}),w,'#fff');
  hrow(116,'風力',trf('{n} kW',{n:P.w.toFixed(0)}),w,'#f2c230');
  hrow(146,'光電',trf('{n} kW',{n:P.s.toFixed(0)}),w,'#f2c230');
  hrow(176,'儲能',P.b<0?trf('充電 {n} kW',{n:(-P.b).toFixed(0)}):trf('放電 {n} kW',{n:P.b.toFixed(0)}),w,'#7dffc4');
  hrow(206,'柴油',trf('{n} kW',{n:P.d.toFixed(0)}),w,P.d>1?'#ff9d7a':'#fff');});}},

/* 7 ─────────────────────────────── 風光互補 */
{t:'風與光的互補',en:'Wind and sun work in shifts',dur:13,
 d:'風和陽光的出力時段不同，是分散式系統喜歡把兩者搭配的原因。一天之中，光電集中在中午，許多沿海與離島場址的風在夜間與清晨也有出力；一年之中，台灣冬半年的東北季風帶來強風，夏季則日照較強。兩者相加的曲線比各自平滑，所需的儲能與柴油備援就少。在台灣，1 kW 以上不及 30 kW 的陸域風力可申請躉購，114 年度費率為每度 7.4110 元；機組的性能與安全可依 CNS 15176-2 驗證，澎湖並設有中小型風機測試場。',
 s:[[0,'一天之中：光電集中在中午，風在夜間也有出力'],[.3,'一年之中：冬季東北季風強，夏季日照強'],[.55,'兩者相加更平滑，需要的儲能較少'],[.75,'台灣：小型風力可申請躉購，並有驗證與測試場']],
 draw(u){
  diagBG();
  const pvD=h=>Math.max(0,Math.sin(Math.PI*(h-6)/12.5)),wD=h=>.45+.2*Math.cos(TAU*(h-3)/24);
  const C=chartBox(60,160,700,400,{title:'一天的出力（示例）',x0:0,x1:24,y0:0,y1:1.4,xt:[0,6,12,18,24],yt:[],xl:'時',yl:'相對出力',pl:60,pt:80,pb:60,gx:4,gy:2});
  const k1=seg(u,.02,.26);
  const curve=(C,f,x1,col,lw,fill)=>{ctx.beginPath();const N=120;for(let i=0;i<=N;i++){const x=x1*i/N;i?ctx.lineTo(C.X(x),C.Y(f(x))):ctx.moveTo(C.X(x),C.Y(f(x)));}if(fill){ctx.lineTo(C.X(x1),C.Y(0));ctx.lineTo(C.X(0),C.Y(0));ctx.closePath();ctx.fillStyle=fill;ctx.fill();}else{ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();}};
  if(k1>0){curve(C,pvD,24*k1,'#f2c230',3.5);curve(C,wD,24*k1,'#7dc8dc',3.5);}
  const sk=seg(u,.5,.6);if(sk>0)alphaDo(sk,()=>curve(C,h=>pvD(h)*.8+wD(h),24,'#7dffc4',3));
  /* 右：季節 */
  const pvM=m=>.55+.35*Math.cos(TAU*(m-7)/12),wM=m=>.6+.4*Math.cos(TAU*(m-1)/12);
  const C2=chartBox(800,160,740,400,{title:'一年的出力（示例）',x0:1,x1:12,y0:0,y1:1.8,xt:[1,3,5,7,9,11],yt:[],xl:'月',yl:'相對出力',pl:60,pt:80,pb:60,gx:11,gy:2});
  const k2=seg(u,.28,.5);
  const mc=(f,x1,col,lw)=>{ctx.beginPath();const N=110;for(let i=0;i<=N;i++){const m=1+(x1-1)*i/N;i?ctx.lineTo(C2.X(m),C2.Y(f(m))):ctx.moveTo(C2.X(m),C2.Y(f(m)));}ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();};
  if(k2>0){mc(pvM,1+11*k2,'#f2c230',3.5);mc(wM,1+11*k2,'#7dc8dc',3.5);}
  if(sk>0)alphaDo(sk,()=>mc(m=>pvM(m)+wM(m)*.9,12,'#7dffc4',3));
  alphaDo(band(u,.34,.6),()=>tag(C2.X(1.4),C2.Y(1.25),'東北季風',{size:16,bg:'#7dc8dc'}));
  /* 圖例 */
  [['光電','#f2c230'],['風力','#7dc8dc'],['相加','#7dffc4']].forEach(([n,c],i)=>{const x=560+i*66;box(x-16,183,12,12,c);wt(x,194,n,15,'#fff',600);});
  [['光電','#f2c230'],['風力','#7dc8dc'],['相加','#7dffc4']].forEach(([n,c],i)=>{const x=1340+i*66;box(x-16,183,12,12,c);wt(x,194,n,15,'#fff',600);});
  /* 下：台灣情境 */
  const TW=[['躉購費率','7.4110 元/度','114 年度，1 kW 以上不及 30 kW'],['國家標準','CNS 15176-2','小型風力機的設計要求'],['測試場','澎湖','中小型風機性能與耐久測試']];
  TW.forEach(([n,v,s],i)=>alphaDo(seg(u,.74+i*.06,.8+i*.06),()=>{const x=60+i*500;card(x,590,480,210,{bg:'rgba(7,27,39,.75)'});
   wt(x+24,632,n,19,'#7dffc4',700);wt(x+24,700,v,34,'#f2c230',700,'left',COND);wt(x+24,760,s,17,'rgba(227,236,238,.85)',600);}));
 }}
]};
/* 離島一天的電力平衡（示例）：負載、風、光、柴油、儲能 */
function pw6(u){const hr=lerp(8,30,u)%24,day=Math.max(0,Math.sin(Math.PI*(hr-6)/13));
  const L=120+50*Math.exp(-Math.pow((hr-19.5)/2.5,2))+20*day,s=day*190,w=55+25*Math.sin(TT*.8)+(hr>18||hr<6?20:0);
  let net=s+w-L,b=0,d=0;
  if(net>0)b=-Math.min(net,90);else{b=Math.min(-net,hr>1&&hr<7?20:120);d=Math.max(0,-net-b);}
  return {L,s,w,b,d};}
