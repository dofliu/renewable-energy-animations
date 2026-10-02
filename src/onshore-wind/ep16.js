// KITS: land
/* 陸域風電系列 第 16 集：風機年度定檢 */
const gyy=x=>groundY(x);
/* 正視的葉片與風機（沿用第 3 集） */
function bladeF(cx,cy,a,L,w){w=w===undefined?1:w;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
  const k=Math.max(.18,w);poly([8,-5*k,8+L*.2,-10*k,8+L,-1.5*k,8+L,1.5*k,8+L*.2,8*k,8,5*k],'#f4f6f7','rgba(0,0,0,.35)',1);ctx.restore();}
function turbine(x,gy,H,R,rot,o){o=o||{};const hy=gy-H,w0=Math.max(4,R*.09),w1=Math.max(2.5,R*.05);
  poly([x-w0,gy,x-w1,hy+R*.06,x+w1,hy+R*.06,x+w0,gy],o.tc||'#eef2f4','rgba(0,0,0,.3)',1);
  box(x-R*.1,hy-R*.08,R*.2,R*.13,'#e3e8ec','rgba(0,0,0,.3)',1);
  for(let i=0;i<3;i++)bladeF(x,hy,rot+i*TAU/3-Math.PI/2,R,o.w);
  circ(x,hy,Math.max(3,R*.07),'#dfe5e8','rgba(0,0,0,.4)',1);return {x,y:hy};}
function windLines(y0,y1,n,sp,a,seed,len){if(a<=0)return;const r=rng(seed||3);ctx.lineCap='round';
  for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),ph=r(),s=sp*(.7+.6*r()),L=(len||60)*(.6+.8*r());const x=VX0-200+((ph*2400+TT*s)%(VX1-VX0+400));
   alphaDo(a*(.25+.35*r()),()=>ln([x,y,x+L,y],'#ffffff',2));}ctx.lineCap='butt';}
/* 轉角積分：f(x) 為轉速倍率，讓停機與啟動平順 */
function spin(u,dur,f){let a=0;const N=120;for(let i=0;i<N;i++){const x=u*(i+.5)/N;a+=f(x);}return a*u*dur/N;}
/* 掛鎖與標籤 */
function padlock(x,y,s,col){s=s||1;ctx.beginPath();ctx.arc(x,y-6*s,6*s,Math.PI,0);ctx.strokeStyle='#cfd6db';ctx.lineWidth=2.6*s;ctx.stroke();
  box(x-9*s,y-6*s,18*s,15*s,col||'#e8572a','rgba(0,0,0,.4)',1);circ(x,y+1*s,2*s,'#13232e');}
function lotoTag(x,y,s){s=s||1;ln([x,y,x+6*s,y+10*s],'#cfd6db',1.4);poly([x+2*s,y+10*s,x+22*s,y+10*s,x+22*s,y+38*s,x+2*s,y+38*s],'#f2c230','rgba(0,0,0,.4)',1);
  box(x+5*s,y+20*s,14*s,3*s,'#13232e');box(x+5*s,y+27*s,10*s,3*s,'#13232e');}
/* 打勾記號 */
function chk(x,y,col){ring(x,y,10,col||'#7dffc4',2);ln([x-6,y,x-1,y+6,x+7,y-6],col||'#7dffc4',2.5);}
/* 剖開的塔架：底 (x,gy)，高 H，底寬 wb、頂寬 wt */
function towerCut(x,gy,H,wb,wtp){const top=gy-H,hw=y=>lerp(wb,wtp,(gy-y)/H)/2;
  poly([x-hw(gy),gy,x-hw(top),top,x+hw(top),top,x+hw(gy),gy],'#cfd6db','rgba(0,0,0,.35)',1.5);
  const k=7;poly([x-hw(gy)+k,gy,x-hw(top)+k,top+4,x+hw(top)-k,top+4,x+hw(gy)-k,gy],'#26343d');
  [.34,.67].forEach(f=>{const y=gy-H*f;ln([x-hw(y),y,x+hw(y),y],'#8a99a3',4);box(x-hw(y)+k,y-2,hw(y)*2-2*k,5,'#5b6a73');});
  return {top,hw};}

/* 分鏡 4：法蘭螺栓配置（俯視） */
const NB=60,PICK=[3,13,23,33,43,53];
/* 分鏡 5：油品分析報告 */
const OIL=[['黏度（40 °C）','318 cSt','ISO VG 320 ± 10%'],['含水量','180 ppm','< 500 ppm'],['鐵（Fe）','12 ppm','< 50 ppm'],['清淨度 ISO 4406','17/15/12','≤ 18/16/13']];
/* 分鏡 6：安全鏈的開關 */
const SAFE=['緊急停止按鈕','超速保護','振動開關','扭纜開關','控制器監看'];

const EP={no:16,slug:'onshore-wind',seriesName:'陸域風電系列',t:'風機年度定檢',en:'The annual turbine inspection',
lede:'每一台風機每年都要停下來做一次完整的健康檢查。這一集跟著技師登塔：先停機上鎖掛牌，再抽檢螺栓扭力、取樣齒輪箱油品、補充潤滑脂，最後測試剎車、變槳備用電池與安全鏈，確認一切正常才解鎖復機。',
facts:[['10','%','年度定檢常見的螺栓扭力抽檢比例，抽到鬆動就擴大為全數複查（示例）'],
['57','條','職業安全衛生設施規則：機械檢查、修理前應停止運轉，並上鎖或設置標示'],
['8–12','小時','一台約 2 MW 風機年度保養，兩人小組在塔上作業的典型工時'],
['6','個月','齒輪箱油品取樣與濾芯檢查的典型間隔（示例）'],
['90','°','緊急順槳的目標槳距角：葉片轉到與風平行，讓轉子減速停下'],
['1','年','升降機、防墜器與救援器材的定期檢查週期（示例）']],
note:'說明：本集為教育用途示意動畫，風機、塔架與機艙比例經過調整。停機上鎖或標示的要求依勞動部「職業安全衛生設施規則」第 57 條（機械之掃除、上油、檢查、修理或調整有危害之虞時，應停止運轉並採上鎖或設置標示等措施，並對彈簧、液壓、氣壓等蓄積能量採取洩壓或隔離措施），國際上可參考美國 OSHA 29 CFR 1910.147 與 1910.269；年度保養抽檢約 10% 螺栓與兩人小組 8–12 小時工時為業界文獻常見說法。作業風速上限、扭力與轉角判定值、油品分析數值與警戒值、變槳測試時間、保養間隔與檢查項目皆為典型範例，並非特定案場或機型資料；實際做法依各風機製造商手冊、風場程序與主管機關規定而定。',
base:()=>{landSky(GY,{sun:{x:1260,y:130},clouds:false});drawGround();},
shots:[
/* 1 ─────────────────────────────── 定檢日 */
{t:'定檢日的準備',en:'Preparing for inspection day',dur:12,side:true,
 d:'年度定檢通常排在風小的季節，台灣西部沿海多選在春夏之間，避開東北季風最強、發電最多的月份。出發前，運維團隊確認天氣與風速，作業風速必須低於製造商規定的上限，並準備好工單、備品、潤滑脂、油品取樣瓶與扭力工具。抵達現場後，先通知中控室，由中控遠端讓風機停機，葉片轉到順槳位置，轉子慢慢停下，技師才走進塔門。',
 s:[[0,'風小的日子，運維工程車駛向今天的定檢風機'],[.3,'確認風速低於作業上限，並通知中控室'],[.52,'中控遠端停機，葉片順槳，轉子慢慢停下'],[.78,'技師帶著工具與備品，準備進入塔門']],
 cam:u=>camMix({x:800,y:450,s:1},{x:760,y:470,s:1.15},ease(seg(u,.55,.9))),
 draw(u){
  const sp=x=>x<.48?1:x<.72?lerp(1,0,ease(seg(x,.48,.72))):0;
  const T0=turbine(260,gyy(260),230,115,TT*1.2+1.3);
  const T=turbine(700,gyy(700),320,170,spin(u,12,sp)*1.1);
  windLines(170,520,12,170,.7,5,50);
  /* 工程車 */
  const tx=lerp(1560,900,easeOut(seg(u,0,.32)));
  ctx.save();ctx.translate(tx,gyy(tx));ctx.scale(.62,.62);truck(0,0,true,'#f4f6f7',()=>{box(4,-48,60,14,'#f2c230');});ctx.restore();
  /* 塔門 */
  box(688,gyy(700)-30,24,30,'#6f7a80','rgba(0,0,0,.4)',1);
  /* 技師 */
  const kw=seg(u,.74,.96);if(u>.34)[0,1].forEach(j=>{const x=lerp(tx-90-j*18,722+j*14,ease(kw));person(x,gyy(x),j?'#f2c230':'#e8572a',2.2);});
  alphaDo(band(u,.3,.5),()=>{const x=tx-60,y=gyy(tx)-70;card(x-20,y-60,170,46,{bg:'rgba(7,27,39,.88)'});wt(x+65,y-30,'通知中控室',17,'#f2c230',700,'center');});
  lab(tx-40,gyy(tx)-30,'運維工程車',{dx:20,dy:-80,st:'l',a:band(u,.08,.3)});
  lab(T.x,T.y,'遠端停機',{dx:130,dy:-50,st:'w',a:band(u,.5,.7)});
  lab(T.x-5,T.y+110,'葉片順槳',{dx:-130,dy:30,st:'s',a:band(u,.56,.78)});
  lab(700,gyy(700)-18,'塔門',{dx:-90,dy:-40,a:band(u,.76,1)});
 },
 hud(u){hudPanel(250,150,'作業前確認（示例）',seg(u,.08,.14),w=>{const ws=6.4+.5*nz(TT*.4);
  hrow(56,'輪轂風速',trf('{v} m/s',{v:ws.toFixed(1)}),w,'#7dffc4');hrow(88,'作業上限','12 m/s',w,'#ff9d7a');
  hrow(120,'風機狀態',u<.5?'運轉中':u<.72?'停機中':'已停機',w,u<.5?'#7dffc4':'#f2c230');});}},

/* 2 ─────────────────────────────── LOTO */
{t:'停機上鎖掛牌',en:'Lockout and tagout',dur:14,
 d:'風機停下來不代表安全。轉子可能被風再次推動，690 伏特與中壓電路仍可能帶電，液壓蓄壓器與變槳備用電池裡也存著能量。職業安全衛生設施規則第 57 條要求，機械檢查、修理前應停止運轉，並上鎖或設置標示，對液壓等蓄積能量要洩壓或隔離。實務上稱為上鎖掛牌（LOTO）：插入轉子鎖定銷、斷開電源並洩壓，每位技師掛上自己的鎖與標籤，最後驗電確認零能量，才開始動手。',
 s:[[0,'停下來的風機，仍藏著好幾種能量'],[.3,'插入轉子鎖定銷，斷電並洩放液壓'],[.56,'每位技師掛上自己的鎖與標籤'],[.8,'驗電確認零能量，才開始作業']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'要隔離的能量來源',20,'#f2c230',700);
  /* 簡化機艙 */
  rrp(200,300,420,170,26);ctx.fillStyle='rgba(227,232,236,.1)';ctx.fill();ctx.strokeStyle='rgba(227,232,236,.6)';ctx.lineWidth=2;ctx.stroke();
  circ(180,385,40,'#dfe5e8','rgba(0,0,0,.4)',1.5);box(380,470,60,40,'rgba(227,232,236,.18)','rgba(227,232,236,.45)',1.5);
  box(220,372,120,24,'#9aa3a8');box(330,345,120,80,'#6f7a80');box(460,350,130,70,'#58b8d0');
  const EN=[[180,385,'轉子旋轉','轉子鎖定銷',.28],[520,385,'690 V／中壓電','斷路器上鎖',.36],[390,325,'液壓蓄壓器','洩壓歸零',.42],[180,310,'變槳備用電池','隔離開關',.48],[410,492,'塔底開關櫃','上鎖並掛牌',.54]];
  EN.forEach(([x,y,t,act,at],i)=>{const ok=u>at;alphaDo(seg(u,.04+i*.03,.08+i*.03),()=>{
   const p=(TT*1.4+i*.3)%1;if(!ok)alphaDo(1-p,()=>ring(x,y,10+p*22,'#e8572a',2));
   circ(x,y,11,ok?'#7dffc4':'#e8572a','#13232e',2);});});
  /* 左下：清單 */
  EN.forEach(([x,y,t,act,at],i)=>alphaDo(seg(u,.04+i*.03,.08+i*.03),()=>{const ok=u>at,yy=528+i*52;
   circ(98,yy-6,7,ok?'#7dffc4':'#e8572a');wt(116,yy,t,17,'#fff',700);
   wt(736,yy,ok?act:'有能量',17,ok?'#7dffc4':'#ff9d7a',700,'right');}));
  alphaDo(seg(u,.28,.34),()=>{ln([140,385,152,385],'#f2c230',5);box(150,378,10,14,'#f2c230');});
  /* 右：步驟 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'上鎖掛牌的順序',20,'#f2c230',700);
  const ST=['通知中控、取得工作許可','停機並順槳','插入轉子鎖定銷','斷開電源、洩放蓄壓','個人上鎖並掛標籤','驗電，確認零能量'];
  ST.forEach((t,i)=>{const on=u>.06+i*.13,cur=on&&u<.06+(i+1)*.13;const y=236+i*66;
   box(830,y,430,52,cur?'rgba(242,194,48,.2)':'rgba(255,255,255,.04)',on?'#f2c230':'rgba(255,255,255,.14)',cur?2:1);
   circ(858,y+26,15,on?'#f2c230':'rgba(255,255,255,.12)');wt(858,y+33,String(i+1),18,on?'#13232e':'rgba(227,236,238,.6)',800,'center',COND);
   wt(886,y+33,t,18,on?'#fff':'rgba(227,236,238,.55)',700);});
  /* 鎖箱 */
  const kl=seg(u,.56,.66);if(kl>0)alphaDo(kl,()=>{const hx=1400,hy=330;
   box(hx-62,hy-50,124,190,'#5b6a73','rgba(0,0,0,.4)',1.5);box(hx-40,hy-30,80,40,'#3b4850');ln([hx,hy+10,hx,hy+30],'#cfd6db',4);
   ln([hx-46,hy+38,hx+46,hy+38],'#cfd6db',4);
   [-30,0,30].forEach((dx,j)=>{const a=seg(u,.58+j*.03,.62+j*.03);if(a>0)alphaDo(a,()=>{padlock(hx+dx,hy+58,1.1,['#e8572a','#58b8d0','#7dffc4'][j]);lotoTag(hx+dx-6,hy+70,.8);});});
   wt(hx,hy+170,'一人一鎖一鑰',16,'#f2c230',700,'center');});
  alphaDo(seg(u,.82,.88),()=>tag(1170,662,'零能量確認：測試啟動應無反應',{size:17,bg:'#7dffc4',align:'center'}));
  alphaDo(seg(u,.86,.92),()=>wt(1170,730,'設施規則第 57 條：停機、上鎖或設置標示',17,'rgba(227,236,238,.85)',600,'center'));
 }},

/* 3 ─────────────────────────────── 登塔 */
{t:'登塔：升降機與防墜',en:'Climbing: service lift and fall arrest',dur:13,side:true,
 d:'現代風機的塔架高約 80 至 120 公尺，裡面有爬梯與服務升降機，每隔一段設有休息平台。登塔前，技師檢查安全帶、防墜器與救援器材，掛上沿爬梯設置的防墜滑軌，即使搭升降機也要接上獨立的防墜系統。年度定檢也會檢查升降機本身：鋼索磨耗、限位開關、超速防墜裝置與緊急下降功能。上到機艙後，先確認轉子鎖定銷到位，再打開機艙罩開始工作。',
 s:[[0,'塔架內有爬梯、升降機與分段的休息平台'],[.25,'技師穿戴安全帶，接上獨立的防墜系統'],[.5,'升降機的鋼索、限位與防墜裝置逐項檢查'],[.78,'抵達機艙，確認轉子鎖定銷到位']],
 cam:u=>camMix({x:800,y:420,s:1},{x:900,y:330,s:1.25},ease(seg(u,.62,.9))),
 draw(u){
  const X=920,G=gyy(X),H=500,C=towerCut(X,G,H,150,96),top=C.top;
  /* 機艙與停住的轉子 */
  box(X-60,top-56,190,56,'#e3e8ec','rgba(0,0,0,.35)',1.5);
  ctx.save();ctx.translate(X-74,top-30);
  poly([-6,0,-12,-30,-4,-240,4,-240,8,-30],'#f4f6f7','rgba(0,0,0,.35)',1);poly([-6,0,-10,30,-3,240,4,240,8,30],'#f4f6f7','rgba(0,0,0,.35)',1);
  ctx.restore();circ(X-74,top-30,16,'#dfe5e8','rgba(0,0,0,.4)',1.5);
  const lockOn=u>.8;box(X-52,top-36,18,10,lockOn?'#f2c230':'#9aa3a8');
  /* 爬梯與防墜滑軌 */
  const lx=X-C.hw(G)+18;ln([lx,G,X-C.hw(top)+18,top+6],'#9aa3a8',2);ln([lx+14,G,X-C.hw(top)+32,top+6],'#9aa3a8',2);
  for(let y=G-10;y>top+10;y-=14){const f=(G-y)/H,a=lerp(lx,X-C.hw(top)+18,f);ln([a,y,a+14,y],'#9aa3a8',1.5);}
  ln([lx+7,G,X-C.hw(top)+25,top+6],'#f2c230',2);
  /* 升降機 */
  const rx=X+C.hw(G)-40,rx2=X+C.hw(top)-40;ln([rx,G,rx2,top+6],'rgba(200,210,215,.7)',1.2);ln([rx+20,G,rx2+20,top+6],'rgba(200,210,215,.7)',1.2);
  const lp=ease(seg(u,.3,.74)),ly=lerp(G-4,top+54,lp),lxx=lerp(rx,rx2,(G-ly)/H);
  box(lxx-4,ly-40,30,40,'#e9b21f','rgba(0,0,0,.4)',1.5);box(lxx,ly-34,22,14,'#2a3a46');
  if(u<.3||u>.74)alphaDo(1,()=>{});
  /* 技師 */
  const p1=u<.3?lerp(X+90,lxx+11,ease(seg(u,.12,.3))):lxx+11;const y1=u<.3?G:ly-2;
  if(u<.8)person(p1,y1,'#e8572a',2.2);else person(X+30,top+50,'#e8572a',2.2);
  const p2y=lerp(G,G-140,ease(seg(u,.3,.8))),p2x=lerp(lx,X-C.hw(top)+18,(G-p2y)/H)+7;person(p2x,p2y,'#f2c230',2.2);
  alphaDo(band(u,.22,.5),()=>{ln([p2x,p2y-14,p2x,p2y-26],'#f2c230',2);circ(p2x,p2y-26,3,'#13232e');});
  /* 檢查鋼索 */
  alphaDo(band(u,.5,.76),()=>{const p=(TT*.6)%1,yy=lerp(G-20,top+40,p);ring(lerp(rx,rx2,(G-yy)/H)+10,yy,12,'#7dffc4',2.5);});
  lab(X,G-H*.34,'休息平台',{dx:-150,dy:-10,a:band(u,.02,.26)});
  lab(lx+7,G-200,'爬梯與防墜滑軌',{dx:-150,dy:20,st:'s',a:band(u,.04,.5)});
  lab(p2x,p2y-26,'安全帶與防墜器',{dx:-150,dy:-40,st:'l',a:band(u,.24,.5)});
  lab(lxx+11,ly-40,'服務升降機',{dx:150,dy:-30,st:'l',a:band(u,.28,.56)});
  lab(rx+10,G-80,'檢查鋼索與限位開關',{dx:150,dy:20,st:'g',a:band(u,.5,.78)});
  lab(X-43,top-31,'轉子鎖定銷',{dx:-30,dy:-90,st:'s',a:band(u,.8,1)});
 },
 hud(u){hudPanel(250,150,'登塔前檢查（示例）',band(u,.06,.6),w=>{
  hrow(56,'安全帶與防墜器',u>.2?'合格':'檢查中',w,u>.2?'#7dffc4':'#fff');hrow(88,'升降機鋼索',u>.6?'合格':'檢查中',w,u>.6?'#7dffc4':'#fff');hrow(120,'救援器材',u>.26?'合格':'檢查中',w,u>.26?'#7dffc4':'#fff');});}},

/* 4 ─────────────────────────────── 螺栓 */
{t:'螺栓扭力抽檢',en:'Spot-checking bolt torque',dur:13,
 d:'風機靠數千根高強度螺栓把塔架各段、葉根與輪轂、主軸承座與偏航軸承連在一起。長期的振動與交變載重會讓螺栓預力逐漸鬆弛，一旦預力不足，螺栓就容易疲勞斷裂。新機投產後的首次保養通常全數複查；之後的年度定檢多抽檢約 10% 的螺栓，以液壓扭力扳手施加規定扭力：螺帽不再轉動即為合格，若明顯轉動，代表預力已流失，該處法蘭就要擴大為全數複查並記錄。',
 s:[[0,'塔架法蘭由一整圈高強度螺栓鎖緊'],[.28,'每年抽檢約一成，用液壓扳手施加規定扭力'],[.52,'螺帽不轉動即合格，數據逐根記錄'],[.74,'這一根轉動了，整圈擴大為全數複查']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'塔架法蘭（俯視示意）',20,'#f2c230',700);
  const cx=410,cy=490,R=220;
  ctx.beginPath();ctx.arc(cx,cy,R+34,0,TAU);ctx.arc(cx,cy,R-34,0,TAU,true);ctx.fillStyle='rgba(154,163,168,.35)';ctx.fill('evenodd');
  ring(cx,cy,R+34,'rgba(227,232,236,.5)',2);ring(cx,cy,R-34,'rgba(227,232,236,.5)',2);
  const full=seg(u,.78,.98),bad=PICK[4];
  for(let i=0;i<NB;i++){const a=-Math.PI/2+i*TAU/NB,x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;
   const pk=PICK.indexOf(i),done=pk>=0&&u>.3+pk*.07,isBad=i===bad&&u>.58;
   const fullDone=full>0&&((i-bad+NB)%NB)/NB<full;
   let col='#cfd6db';if(fullDone)col='#7dffc4';if(pk>=0&&u>.24)col='#f2c230';if(done)col='#7dffc4';if(isBad&&full<1)col='#e8572a';
   circ(x,y,9,col,'#13232e',1.5);}
  /* 扳手 */
  const ci=Math.min(5,Math.floor(seg(u,.3,.72)*6));if(u>.28&&u<.76){const i=PICK[ci],a=-Math.PI/2+i*TAU/NB,x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;
   ring(x,y,18,'#f2c230',3);const ox=cx+Math.cos(a)*(R-90),oy=cy+Math.sin(a)*(R-90);ln([x,y,ox,oy],'#e9b21f',9);box(ox-14,oy-14,28,28,'#e9b21f','#13232e',1.5);}
  wt(cx,cy-10,'60 根螺栓',22,'#fff',700,'center');
  wt(cx,cy+22,trf('抽檢 {n} 根',{n:6}),18,'#f2c230',700,'center');
  alphaDo(seg(u,.78,.84),()=>tag(cx,cy+66,'擴大為全數複查',{size:16,bg:'#e8572a',fg:'#fff',align:'center'}));
  /* 右上：抽檢位置 */
  card(800,160,740,250,{bg:'rgba(7,27,39,.75)'});wt(824,200,'年度抽檢的螺栓連接',20,'#f2c230',700);
  [['塔架法蘭',0],['葉根與輪轂',1],['主軸承座',2],['偏航軸承',3]].forEach(([t,i])=>alphaDo(seg(u,.06+i*.04,.1+i*.04),()=>{const x=830+(i%2)*350,y=236+Math.floor(i/2)*78;
   box(x,y,330,60,'rgba(255,255,255,.05)','rgba(255,255,255,.14)',1);circ(x+30,y+30,10,'#cfd6db','#13232e',1.5);wt(x+56,y+37,t,19,'#fff',700);}));
  /* 右下：結果長條 */
  const Cc=chartBox(800,430,740,370,{title:'抽檢結果：螺帽轉角（示例）',x0:0,x1:6,y0:0,y1:40,xt:[],yt:[0,10,20,30,40],yl:'°',pl:70,pt:62,pb:56,gx:6,gy:4});
  ctx.setLineDash([7,6]);ln([Cc.px,Cc.Y(20),Cc.px+Cc.pw,Cc.Y(20)],'#e8572a',2);ctx.setLineDash([]);wt(Cc.px+Cc.pw-8,Cc.Y(20)-10,'判定值 20°',16,'#ff9d7a',700,'right');
  const AN=[2,3,1,4,32,2];
  AN.forEach((v,k)=>{const g=ease(seg(u,.32+k*.07,.38+k*.07));if(g<=0)return;const x=Cc.X(k+.5)-26,b=v>20;
   box(x,Cc.Y(v*g),52,Cc.Y(0)-Cc.Y(v*g),b?'#ff9d7a':'#7dffc4');
   wt(x+26,Cc.Y(0)+28,trf('第 {n} 根',{n:PICK[k]+1}),14,'rgba(227,236,238,.85)',600,'center');
   wt(x+26,Cc.Y(v*g)-10,trf('{d}°',{d:Math.round(v*g)}),16,b?'#ff9d7a':'#7dffc4',700,'center',COND);});
 }},

/* 5 ─────────────────────────────── 油品與潤滑 */
{t:'齒輪箱油品與潤滑',en:'Gearbox oil and lubrication',dur:14,side:false,
 d:'齒輪箱裡的潤滑油同時負責潤滑與散熱，也記錄了齒輪與軸承的健康。技師從取樣閥抽取運轉溫度下的油樣，送實驗室分析黏度、含水量、金屬元素與顆粒清淨度；鐵含量上升或清淨度變差，常是磨耗加劇的早期訊號。同時檢查濾芯前後的壓差並更換濾芯。主軸承、變槳軸承、偏航軸承與發電機軸承則靠自動潤滑泵定量注入潤滑脂，定檢時補滿油脂桶、檢查管路，並清除被擠出的舊脂。',
 s:[[0,'從取樣閥抽出油樣，送實驗室分析'],[.3,'黏度、含水量、金屬與清淨度都在範圍內'],[.55,'檢查濾芯壓差，換上新濾芯'],[.76,'補滿自動潤滑系統，清除擠出的舊脂']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'機艙內的潤滑點（剖面示意）',20,'#f2c230',700);
  rrp(120,300,600,230,30);ctx.fillStyle='rgba(227,232,236,.1)';ctx.fill();ctx.strokeStyle='rgba(227,232,236,.6)';ctx.lineWidth=2;ctx.stroke();
  box(380,530,70,260,'rgba(227,232,236,.22)','rgba(227,232,236,.45)',1.5);
  circ(110,415,46,'#dfe5e8','rgba(0,0,0,.4)',1.5);
  box(150,403,120,24,'#9aa3a8');box(190,385,34,60,'#7dc8dc','rgba(0,0,0,.4)',1);
  box(270,355,170,120,'#6f7a80','rgba(0,0,0,.5)',1.5);
  const gr=(x,y,r)=>{circ(x,y,r,'#8d989f','#394650',2);for(let i=0;i<8;i++){const a=i*TAU/8+.2;ln([x,y,x+Math.cos(a)*r,y+Math.sin(a)*r],'#394650',1.5);}};
  gr(320,415,42);gr(392,385,22);gr(400,443,16);
  /* 油位 */
  box(272,448,166,25,'rgba(232,163,58,.55)');
  box(440,433,70,14,'#9aa3a8');box(510,370,160,110,'#58b8d0','rgba(0,0,0,.4)',1.5);
  wt(207,368,'主軸承',16,'#7dc8dc',700,'center');wt(355,343,'齒輪箱',17,'#fff',700,'center');wt(590,360,'發電機',17,'#7dc8dc',700,'center');
  /* 取樣 */
  const ks=seg(u,.02,.1);alphaDo(ks,()=>{const bx=230,by=560;ln([300,475,300,520,bx+12,520,bx+12,by],'#e8a33a',2);
   const fl=seg(u,.06,.24);box(bx,by,24,44,'rgba(255,255,255,.12)','#fff',1.5);box(bx+2,by+44-40*fl,20,40*fl,'rgba(232,163,58,.85)');box(bx+5,by-8,14,8,'#dfe5e8');
   wt(bx-14,by+30,'油樣',17,'#e8a33a',700,'right');});
  /* 濾芯 */
  const kf=seg(u,.52,.58);alphaDo(kf,()=>{const fx=470,fy=560,nw=u>.66;box(fx,fy,44,90,nw?'#dfe5e8':'#a07a3c','rgba(0,0,0,.4)',1.5);
   for(let i=0;i<7;i++)ln([fx+5,fy+10+i*11,fx+39,fy+10+i*11],'rgba(0,0,0,.25)',2);ln([fx+22,fy,fx+22,477],'#e8a33a',2);
   wt(fx+58,fy+30,'濾芯',17,'#fff',700);wt(fx+58,fy+58,nw?'已更換':'壓差偏高',16,nw?'#7dffc4':'#ff9d7a',700);});
  /* 自動潤滑 */
  const kg=seg(u,.74,.8);alphaDo(kg,()=>{const px=600,py=600;box(px,py,70,80,'#394650','rgba(255,255,255,.4)',1.5);
   const lv=lerp(.25,.95,ease(seg(u,.78,.9)));box(px+8,py+8,54,64,'rgba(255,255,255,.08)');box(px+8,py+8+64*(1-lv),54,64*lv,'#f2c230');
   wt(px+35,py+104,'自動潤滑泵',16,'#f2c230',700,'center');
   [[207,445],[110,370],[590,480],[410,530]].forEach(([x,y],i)=>{ctx.setLineDash([5,5]);ln([px+35,py,px+35,py-30,x,py-30,x,y],'rgba(242,194,48,.7)',1.6);ctx.setLineDash([]);
    const p=(TT*.5+i*.25)%1;circ(x,y,6,'#f2c230','#13232e',1.5);});
   wt(84,770,'主軸承・變槳軸承・偏航軸承・發電機軸承',16,'rgba(227,236,238,.85)',600);});
  /* 右：報告 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'油品分析報告（示例）',20,'#f2c230',700);
  wt(830,250,'項目',16,'rgba(227,236,238,.7)',600);wt(1210,250,'結果',16,'rgba(227,236,238,.7)',600,'right');wt(1510,250,'參考範圍',16,'rgba(227,236,238,.7)',600,'right');
  OIL.forEach(([n,v,ref],i)=>alphaDo(seg(u,.26+i*.05,.3+i*.05),()=>{const y=300+i*70;
   box(824,y-30,692,56,'rgba(255,255,255,.04)','rgba(255,255,255,.12)',1);
   wt(840,y+6,n,18,'#fff',700);wt(1210,y+6,v,20,'#7dffc4',700,'right',COND);wt(1470,y+6,ref,16,'rgba(227,236,238,.8)',600,'right');chk(1494,y);}));
  /* 鐵含量趨勢 */
  const D=chartBox(800,590,740,210,{title:'',x0:0,x1:6,y0:0,y1:60,xt:[],yt:[0,50],yl:'Fe ppm',pl:90,pt:22,pb:30,gx:6,gy:2});
  ctx.setLineDash([7,6]);ln([D.px,D.Y(50),D.px+D.pw,D.Y(50)],'#e8572a',2);ctx.setLineDash([]);wt(D.px+D.pw-8,D.Y(50)-8,'警戒值',15,'#ff9d7a',700,'right');
  const FE=[8,9,11,10,12,12],nE=Math.floor(6*seg(u,.44,.56)+.001);
  for(let i=0;i<nE;i++){circ(D.X(i+.5),D.Y(FE[i]),6,'#f2c230');if(i)ln([D.X(i-.5),D.Y(FE[i-1]),D.X(i+.5),D.Y(FE[i])],'#f2c230',2);}
  alphaDo(seg(u,.5,.56),()=>wt(D.px+10,D.Y(30),'每半年一筆，看趨勢',15,'rgba(227,236,238,.85)',600));
 }},

/* 6 ─────────────────────────────── 剎車、變槳、安全鏈 */
{t:'剎車、變槳電池與安全鏈',en:'Brakes, pitch backup and the safety chain',dur:14,
 d:'風機最重要的保護，是在任何異常下都能把葉片轉到 90 度順槳，讓轉子減速。即使電網斷電，變槳系統也要靠備用電池或超級電容獨力完成，所以定檢時會切斷主電源，實際測試各葉片緊急順槳的時間是否在規定內。安全鏈則是一條獨立於控制軟體的串聯迴路，串起緊急停止按鈕、超速保護、振動開關與扭纜開關，任何一個開關跳脫，就直接觸發緊急順槳。另外量測剎車片厚度並測試機械剎車的作動。',
 s:[[0,'切斷主電源，只靠備用電池讓葉片順槳'],[.3,'三支葉片都在規定時間內轉到 90 度'],[.52,'逐一觸發安全鏈上的每一個開關'],[.76,'任何一個跳脫，風機都立即緊急順槳']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,700,640,{title:'緊急順槳測試（示例）',x0:0,x1:12,y0:0,y1:100,xt:[0,2,4,6,8,10,12],yt:[0,30,60,90],xl:'秒',yl:'槳距角 °',pl:80,pt:70,pb:70,gx:6,gy:3});
  ctx.setLineDash([7,6]);ln([C.X(10),C.Y(0),C.X(10),C.Y(100)],'#e8572a',2);ln([C.X(0),C.Y(90),C.X(12),C.Y(90)],'rgba(255,255,255,.45)',1.5);ctx.setLineDash([]);
  wt(C.X(10)-8,C.Y(96),'規定時間',16,'#ff9d7a',700,'right');wt(C.X(.2),C.Y(90)-10,'順槳 90°',16,'#fff',700);
  const BL=[[7.6,'#7dffc4','葉片 A'],[8.1,'#7dc8dc','葉片 B'],[8.9,'#b37cff','葉片 C']];
  const te=12*seg(u,.06,.46);
  BL.forEach(([tf,col,n],j)=>{if(te<=0)return;ctx.beginPath();for(let t=0;t<=te;t+=.05){const a=t<tf?90*easeOut(Math.min(1,t/tf))*.98+0*t:90;const y=C.Y(Math.min(90,a));t?ctx.lineTo(C.X(t),y):ctx.moveTo(C.X(t),y);}
   ctx.strokeStyle=col;ctx.lineWidth=3;ctx.stroke();
   alphaDo(seg(u,.32,.38),()=>{circ(C.X(6.2),C.Y(30)+j*34,6,col);wt(C.X(6.2)+14,C.Y(30)+j*34+6,trf('{n}：{t} 秒',{n:tr(n),t:tf.toFixed(1)}),16,col,700);});});
  alphaDo(seg(u,.38,.44),()=>tag(C.X(7.6),C.Y(52),'全部在規定時間內',{size:17,bg:'#7dffc4',align:'center'}));
  /* 右上：安全鏈 */
  card(800,160,740,420,{bg:'rgba(7,27,39,.75)'});wt(824,200,'安全鏈：獨立的串聯迴路',20,'#f2c230',700);
  const trip=Math.min(4,Math.floor(seg(u,.52,.9)*5)),tripping=u>.52&&u<.92;
  const sx=i=>870+i*130,sy=300;
  ln([840,sy,1500,sy],'#7dffc4',3);ln([1500,sy,1500,500,840,500,840,sy],'rgba(125,255,196,.6)',2);
  SAFE.forEach((t,i)=>{const open=tripping&&i===trip&&(TT*1.6)%1<.6;const x=sx(i);
   box(x-6,sy-6,12,12,'#0e2a3b');circ(x-24,sy,5,'#fff');circ(x+24,sy,5,'#fff');
   if(open){ln([x-24,sy,x+20,sy-26],'#e8572a',4);}else ln([x-24,sy,x+24,sy],'#7dffc4',4);
   wt(x,sy+40+(i%2)*30,t,15,open?'#ff9d7a':'rgba(227,236,238,.9)',700,'center');
   if(u>.52+(i+1)*.076)chk(x,sy-40);});
  box(1080,470,180,60,'#16384c','#f2c230',2);wt(1170,507,'安全繼電器',18,'#f2c230',700,'center');
  alphaDo(seg(u,.56,.62),()=>{const on=tripping&&(TT*1.6)%1<.6;tag(1170,420,on?'跳脫 → 緊急順槳與剎車':'迴路閉合：允許運轉',{size:16,bg:on?'#e8572a':'#7dffc4',fg:on?'#fff':'#13232e',align:'center'});});
  /* 右下：剎車 */
  card(800,600,740,200,{bg:'rgba(7,27,39,.75)'});wt(824,640,'機械剎車',20,'#f2c230',700);
  const ky=seg(u,.06,.12);alphaDo(ky,()=>{box(860,670,24,110,'#9aa3a8','rgba(0,0,0,.4)',1);ctx.save();
   box(884,690,16,70,'#e8a33a');box(840,690,16,70,'#e8a33a');ctx.restore();
   wt(940,700,'剎車片厚度',17,'#fff',700);wt(940,734,'14 mm（下限 5 mm）',17,'#7dffc4',700);
   wt(1220,700,'作動與釋放測試',17,'#fff',700);wt(1220,734,'油壓、作動時間正常',17,'#7dffc4',700);});
 }},

/* 7 ─────────────────────────────── 復機 */
{t:'解鎖與復機',en:'Unlocking and returning to service',dur:12,side:true,
 d:'所有項目完成後，技師清點工具、收起廢油與舊濾芯，確認機艙與塔內沒有遺留人員與物品。拆除上鎖掛牌的順序與上鎖相反，而且每一把鎖只能由掛上它的人親自取下；拔出轉子鎖定銷、恢復電源後，再通知中控室啟動。風機先以低速運轉，確認振動、溫度與變槳正常，才回到滿載。定檢報告與油品分析結果存進維護系統，成為下一次定檢與預測性維護的比較基準。',
 s:[[0,'清點工具與廢油，確認塔內沒有遺留人員'],[.28,'每人親手取下自己的鎖，拔出轉子鎖定銷'],[.52,'通知中控啟動，風機重新開始轉動'],[.78,'定檢報告存檔，成為下一年的比較基準']],
 draw(u){
  const sp=x=>x<.52?0:x<.8?ease(seg(x,.52,.8)):1;
  turbine(240,gyy(240),230,115,TT*1.2+.4);
  const T=turbine(620,gyy(620),320,170,spin(u,12,sp)*1.1+.3);
  windLines(170,520,14,180,.5+.4*seg(u,.5,.8),9,50);
  box(608,gyy(620)-30,24,30,'#6f7a80','rgba(0,0,0,.4)',1);
  /* 門口的鎖 */
  [0,1].forEach(j=>{const a=1-seg(u,.3+j*.08,.36+j*.08);if(a>0)alphaDo(a,()=>padlock(640+j*16,gyy(620)-14,.8,j?'#58b8d0':'#e8572a'));});
  const kw=seg(u,.06,.3);[0,1].forEach(j=>{const x=lerp(640+j*14,760+j*24,ease(kw));person(x,gyy(x),j?'#f2c230':'#e8572a',2.2);});
  ctx.save();ctx.translate(900,gyy(900));ctx.scale(.62,.62);truck(0,0,true,'#f4f6f7',()=>{box(4,-48,60,14,'#f2c230');});ctx.restore();
  /* 報告卡 */
  const kc=seg(u,.6,.68);if(kc>0)alphaDo(kc,()=>{const x0=1010,y0=380;card(x0,y0,520,300,{bg:'rgba(7,27,39,.9)'});
   wt(x0+20,y0+36,'年度定檢報告（示例）',19,'#f2c230',700);
   const IT=['上鎖掛牌與解除','升降機與防墜設備','螺栓扭力抽檢','油品取樣與濾芯','潤滑脂補充','剎車、變槳與安全鏈'];
   IT.forEach((t,i)=>{const y=y0+82+Math.floor(i/2)*66,x=x0+20+(i%2)*250;alphaDo(seg(u,.64+i*.03,.68+i*.03),()=>{chk(x+12,y-6);wt(x+32,y,t,16,'#fff',700);});});
   alphaDo(seg(u,.84,.9),()=>tag(x0+260,y0+272,'存入維護系統，作為下次比較基準',{size:15,bg:'#7dffc4',align:'center'}));});
  lab(648,gyy(620)-16,'各自取下自己的鎖',{dx:-130,dy:-70,st:'s',a:band(u,.26,.5)});
  lab(T.x,T.y,'低速試運轉',{dx:130,dy:-50,st:'g',a:band(u,.52,.76)});
 },
 hud(u){hudPanel(250,150,'復機狀態（示例）',seg(u,.5,.56),w=>{const p=seg(u,.6,.95);
  hrow(56,'檢查項目','42 / 42',w,'#7dffc4');hrow(88,'輸出功率',trf('{p} MW',{p:(2.1*p).toFixed(1)}),w,'#f2c230');hrow(120,'振動',p>0?'正常':'—',w,'#7dffc4');});}}
]};
