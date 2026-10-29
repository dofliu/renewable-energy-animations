// KITS: land
/* 氫能系列 第 6 集：加氫站與快速加注 */
const gyy=x=>groundY(x);
const SUN={x:1180,y:120};
const H2C='#7dffc4',WC='#58b8d0',EC='#f2c230',HC='#ff8a60',CC='#7dc8dc';
function road(){ctx.beginPath();for(let x=-400;x<=2000;x+=20)ctx.lineTo(x,gyy(x)-2);for(let x=2000;x>=-400;x-=20)ctx.lineTo(x,gyy(x)+16);ctx.closePath();ctx.fillStyle='#3d4448';ctx.fill();}
function dispenser(x){const g=gyy(x);box(x-24,g-120,48,120,'#f4f6f7','rgba(0,0,0,.3)',1);box(x-17,g-108,34,24,'#2a3a46');box(x-24,g-134,48,14,'#1f7f99');wt(x,g-123,'H₂',11,'#fff',700,'center',COND);}
/* 小客車：x 為車尾，朝右；fill 0–1 為氣瓶氫氣量，heat 0–1 為瓶溫著色 */
function fcv(x,fill,heat){const g=gyy(x);
  ctx.beginPath();ctx.moveTo(x,g-34);ctx.lineTo(x,g-70);ctx.quadraticCurveTo(x+10,g-82,x+60,g-86);ctx.lineTo(x+130,g-112);ctx.quadraticCurveTo(x+170,g-116,x+210,g-106);ctx.lineTo(x+262,g-86);ctx.quadraticCurveTo(x+290,g-78,x+292,g-50);ctx.lineTo(x+292,g-34);ctx.closePath();
  ctx.fillStyle='#e9eef0';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1.5;ctx.stroke();
  poly([x+138,g-104,x+206,g-98,x+248,g-86,x+138,g-86],'#9fc4d4');
  /* 氣瓶（透視） */
  rrp(x+24,g-76,150,34,17);ctx.fillStyle='rgba(16,53,74,.85)';ctx.fill();
  if(fill>0){ctx.save();rrp(x+24,g-76,150,34,17);ctx.clip();const r=Math.round(lerp(125,255,heat)),b=Math.round(lerp(255,96,heat));ctx.fillStyle='rgb('+r+',255,'+Math.round(lerp(196,96,heat))+')';ctx.globalAlpha=.85;ctx.fillRect(x+24,g-76,150*fill,34);ctx.restore();}
  rrp(x+24,g-76,150,34,17);ctx.strokeStyle='#3a434a';ctx.lineWidth=4;ctx.stroke();
  [x+70,x+232].forEach(wx=>{circ(wx-0+(wx>x+100?0:0),g-24,26,'#22282c');circ(wx,g-24,12,'#aeb8be');});}
function hose(x0,y0,x1,y1,col,k){const mx=(x0+x1)/2,my=Math.max(y0,y1)+70*k;ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(mx,my,x1,y1);ctx.strokeStyle=col||'#2a2f34';ctx.lineWidth=7;ctx.stroke();}
function curveTo(c,f,u0,u1,col,lw){ /* 逐步畫出 f(t) */
  const n=80,m=Math.floor(n*clamp(seg(u0,0,1),0,1));ctx.beginPath();for(let i=0;i<=n;i++){const t=i/n;if(t>u1)break;const p=f(t);i?ctx.lineTo(c.X(p[0]),c.Y(p[1])):ctx.moveTo(c.X(p[0]),c.Y(p[1]));}ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.stroke();}
/* 加注壓力曲線（示例，單位 MPa、秒）：先快後慢趨近 */
const PR=t=>{const s=t*180;return 5+75*Math.pow(1-Math.pow(1-s/180,1.35),1);};

const EP={no:6,slug:'hydrogen',seriesName:'氫能系列',t:'加氫站與快速加注',en:'Hydrogen refuelling stations',
lede:'燃料電池車加氫，像加油一樣約三分鐘就能完成，背後卻不簡單：氫氣要先壓到比車上氣瓶更高的壓力，快速灌入時又會因為壓縮而發熱。這一集跟著一台小客車進站，看氫氣從儲氣瓶到加氫機的路徑、為什麼要先預冷到零下 40°C、加注協定怎麼控制壓力與溫度，最後看台灣第一批加氫站的樣子。',
facts:[['約 3','分鐘','70 MPa 小客車在預冷 −40°C 的加氫機上的加注目標時間'],
['−40','°C','預冷後氫氣送出的溫度（T40 等級加氫機）'],
['85','°C','車載氣瓶內氣體溫度的上限，加注全程不得超過'],
['87.5','MPa','加注 70 MPa 氣瓶時，加氫機端壓力的上限'],
['60','g/s','小客車加注的流量上限（SAE J2601）'],
['700 / 350','bar','中油楠梓加氫站同時提供小客車與大型車兩種壓力']],
note:'說明：本集為教育用途示意動畫，設備外觀與比例經過調整。預冷 −40°C 的 T40 加氫機、約 3 分鐘加注目標、氣瓶氣體溫度上限 85°C、加氫機壓力上限 87.5 MPa、流量上限 60 g/s 整理自 SAE J2601 加注協定及美國能源部與相關文獻摘要（各版本細節略有差異，實際依協定版本與加氫機等級而定）。台灣中油楠梓加氫站同時供應 700 bar 與 350 bar、每日可服務約 7 輛大巴，資料取自新聞報導與能源署文件；「加氫站銷售氫燃料經營許可管理辦法」規定加氫站須有儲氫槽、氫氣處理設備與加氫機。蓄壓器分組、壓力與溫度曲線、5 kg 加氫量與續航里程為典型範例，非特定站點或車型資料。',
base:()=>{landSky(GY,{sun:SUN,clouds:true});drawGround();},
shots:[
{t:'氫氣怎麼到加氫機',en:'From storage to dispenser',dur:13,
 d:'加氫站的任務，是把氫氣升壓、降溫，再安全地交給車輛。氫氣通常由管束拖車運來，壓力只有約 200 巴；壓縮機先把它升到 900 巴左右，存進高壓蓄壓器。蓄壓器分成低、中、高三組，加注時由低壓組開始接力，讓壓縮機不必即時供應全部流量。氫氣離開蓄壓器後，要通過預冷器，冷卻到約零下 40°C，才送到加氫機。加氫機同時量測流量與壓力，並與車輛通訊。',
 s:[[0,'管束拖車運來約 200 巴的氫氣'],[.28,'壓縮機升壓，存進低中高三組蓄壓器'],[.55,'蓄壓器放出的氫氣先經過預冷器'],[.8,'降到約零下 40°C 後，才送到加氫機']],
 draw(u){
  diagBG();
  const g=300;
  /* 方塊 */
  const B=[['管束拖車','約 200 bar',60,.02,'#7dc8dc'],['壓縮機','升到約 900 bar',330,.2,EC],['蓄壓器','低／中／高三組',620,.3,H2C],['預冷器','冷卻到約 −40°C',1000,.52,'#8fd3ff'],['加氫機','量測、通訊、加注',1300,.74,'#ff8a60']];
  B.forEach(([a,b,x,t0,col],i)=>{const w=i==2?300:210,h=i==2?330:200,y=i==2?220:280;alphaDo(seg(u,t0,t0+.07),()=>{card(x,y,w,h,{bg:'rgba(7,27,39,.78)'});box(x,y,w,8,col);wt(x+w/2,y+h+42,a,24,col,700,'center');wt(x+w/2,y+h+74,b,17,'rgba(227,236,238,.9)',500,'center');});});
  /* 管束拖車內容 */
  alphaDo(seg(u,.04,.1),()=>{for(let i=0;i<4;i++)rrp(84,310+i*34,162,22,11),ctx.fillStyle='#aeb8be',ctx.fill();wt(165,300,'H₂',18,'#fff',700,'center',COND);});
  /* 壓縮機 */
  alphaDo(seg(u,.22,.28),()=>{circ(435,380,52,'#2a3a46','rgba(255,255,255,.4)',3);const a=TT*3;ln([435,380,435+Math.cos(a)*40,380+Math.sin(a)*40],EC,5);ln([435,380,435+Math.cos(a+3.14)*40,380+Math.sin(a+3.14)*40],EC,5);});
  /* 蓄壓器三組：液位隨 u 升高 */
  [['低',.34],['中',.38],['高',.42]].forEach(([n,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const x=650+i*90,y=260,w=70,h=240;rrp(x,y,w,h,24);ctx.fillStyle='#10354a';ctx.fill();const f=ease(seg(u,t0,t0+.18))*(.45+i*.2);ctx.save();rrp(x,y,w,h,24);ctx.clip();ctx.fillStyle=H2C;ctx.globalAlpha=.7;ctx.fillRect(x,y+h*(1-f),w,h*f);ctx.restore();rrp(x,y,w,h,24);ctx.strokeStyle='#aeb8be';ctx.lineWidth=4;ctx.stroke();wt(x+w/2,y+h+30,n,20,'#fff',700,'center');}));
  /* 預冷器 */
  alphaDo(seg(u,.54,.6),()=>{for(let i=0;i<5;i++)ln([1040,320+i*34,1170,320+i*34],'#8fd3ff',3);ln([1040,320,1170,320],'#8fd3ff',3);wt(1105,480,'冷媒',16,'#8fd3ff',700,'center');});
  /* 流動粒子與管線 */
  const segs=[[270,380,330,380,.12],[540,380,620,380,.26],[920,380,1000,380,.46],[1210,380,1300,380,.68]];
  segs.forEach(([x0,y0,x1,y1,t0])=>alphaDo(seg(u,t0,t0+.04),()=>{ln([x0,y0,x1,y1],'rgba(227,236,238,.5)',4);for(let k=0;k<3;k++){const f=((TT*.6)+k/3)%1;circ(lerp(x0,x1,f),y0,5,H2C);}}));
  /* 溫度條 */
  alphaDo(seg(u,.55,.62),()=>{const T=lerp(25,-40,ease(seg(u,.56,.78)));tag(1105,200,trf('氫氣 {n}°C',{n:Math.round(T)}),{bg:T<=-35?'#8fd3ff':EC,fg:'#0e2a3b',size:24,align:'center'});});
  alphaDo(seg(u,.8,.88),()=>wt(800,810,'整條路徑：升壓 → 儲存 → 降溫 → 加注',24,'#fff',700,'center'));
 }},

{t:'接上噴嘴開始加氫',en:'Connecting and starting the fill',dur:14,side:true,cam:u=>({x:800,y:430,s:1.5}),base:()=>{landSky(GY,{sun:SUN,clouds:false});drawGround();},
 d:'小客車停好後，駕駛先熄火，把加氫噴嘴對準車上的加注口扣緊。噴嘴與車輛之間有機械鎖，扣好後加氫機先用低壓氫氣做洩漏測試，確認接頭沒有漏。接著加氫機以紅外線與車輛通訊，取得氣瓶容量、目前壓力與溫度，再決定加注的壓力升率。全部確認後才開始加氫，駕駛在這段時間只要等待，不需要操作任何閥門。',
 s:[[0,'熄火停好，把噴嘴扣在加注口上'],[.28,'先用低壓氫氣做洩漏測試'],[.5,'紅外線通訊，回報氣瓶容量與壓力溫度'],[.72,'確認安全後，開始加氫']],
 draw(u){
  road();
  const g=gyy(700),arr=ease(seg(u,0,.2));const cx=lerp(1500,800,arr);
  dispenser(640);
  const done=seg(u,.2,.28);
  fcv(cx,seg(u,.72,1)*.35+.1,0);
  /* 軟管：跟著車尾加注口 */
  const nx=cx+14,ny=g-62;
  if(done>0)alphaDo(done,()=>{hose(664,g-80,nx,ny,'#2a2f34',.4);box(nx-10,ny-5,16,10,'#f2c230');});
  else hose(664,g-80,664,g-30,'#2a2f34',.1);
  /* 洩漏測試 */
  const lt=band(u,.3,.5);if(lt>0)alphaDo(lt,()=>{ring(nx,ny,12+((TT*30)%16),H2C,2);});
  /* 紅外線通訊 */
  const ir=band(u,.5,.72);if(ir>0)alphaDo(ir,()=>{for(let k=0;k<3;k++){const r=24+((TT*40+k*26)%78);ctx.beginPath();ctx.arc(nx,ny,r,-.5,.5);ctx.strokeStyle=EC;ctx.lineWidth=3;ctx.stroke();}});
  lab(640,gyy(640)-120,'加氫機',{dx:-60,dy:-80,a:band(u,.02,.5)});
  lab(nx,ny,'車輛加注口',{dx:80,dy:-130,st:'s',a:band(u,.22,.5)});
  lab(nx,ny-16,'洩漏測試',{dx:10,dy:-210,st:'g',a:band(u,.3,.5)});
  lab(nx,ny,'紅外線通訊',{dx:120,dy:-190,st:'s',a:band(u,.52,.74)});
  lab(cx+100,g-70,'碳纖維氣瓶',{dx:20,dy:60,a:band(u,.74,1),minor:true});
 },
 hud(u){hudPanel(250,128,'通訊內容（示例）',seg(u,.45,.5),w=>{hrow(54,'氣瓶容量','5 kg',w,H2C);hrow(82,'起始壓力','5 MPa',w,EC);hrow(110,'起始溫度','25°C',w,CC);});}},

{t:'為什麼要預冷',en:'Why pre-cool the hydrogen',dur:14,
 d:'氫氣被快速灌進氣瓶時，會因為壓縮而升溫，就像打氣筒打久了會發熱。氣瓶外層的碳纖維複合材料耐不了太高的溫度，所以協定規定瓶內氣體不得超過 85°C。如果用常溫氫氣加注，在三分鐘內瓶溫會遠超過上限，只能放慢速度、甚至分多次加注；先把氫氣預冷到零下 40°C，等於在入口先扣掉一大段升溫，讓瓶溫在整個過程中都低於 85°C，才能做到約三分鐘加滿。',
 s:[[0,'氫氣快速灌入氣瓶，會因壓縮而升溫'],[.3,'常溫加注，瓶溫很快衝過 85°C 上限'],[.55,'預冷到零下 40°C，入口先扣掉一大段升溫'],[.8,'瓶溫全程低於 85°C，約三分鐘就能加滿']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,940,640,{title:'氣瓶內氣體溫度（示例）',x0:0,x1:180,y0:-40,y1:120,xt:[0,60,120,180],yt:[-40,0,40,85,120],xl:'加注時間（秒）',yl:'溫度（°C）',pt:70,pb:70,pl:90,gx:3,gy:4});
  /* 85°C 上限 */
  alphaDo(seg(u,.04,.1),()=>{const y=c.Y(85);ctx.setLineDash([10,8]);ln([c.px,y,c.px+c.pw,y],'#ff8a60',3);ctx.setLineDash([]);wt(c.px+c.pw-8,y-10,'上限 85°C',20,'#ff8a60',700,'right');});
  const noP=t=>[t*180,25+90*(1-Math.exp(-t*3.2))];
  const pre=t=>[t*180,-5+80*(1-Math.exp(-t*3.2))*0.96+Math.max(0,t-.2)*0];
  const k1=ease(seg(u,.26,.52)),k2=ease(seg(u,.56,.82));
  if(k1>0){ctx.beginPath();for(let i=0;i<=80;i++){const t=i/80;if(t>k1)break;const p=noP(t);i?ctx.lineTo(c.X(p[0]),c.Y(p[1])):ctx.moveTo(c.X(p[0]),c.Y(p[1]));}ctx.strokeStyle='#ff9d7a';ctx.lineWidth=5;ctx.stroke();
   if(k1>.5)alphaDo(seg(u,.4,.48),()=>wt(c.X(172),c.Y(113),'常溫氫氣：超過上限',20,'#ff9d7a',700,'right'));}
  if(k2>0){ctx.beginPath();for(let i=0;i<=80;i++){const t=i/80;if(t>k2)break;const p=pre(t);i?ctx.lineTo(c.X(p[0]),c.Y(p[1])):ctx.moveTo(c.X(p[0]),c.Y(p[1]));}ctx.strokeStyle=H2C;ctx.lineWidth=5;ctx.stroke();
   if(k2>.6)alphaDo(seg(u,.7,.78),()=>wt(c.X(125),c.Y(52),'預冷 −40°C：全程低於上限',20,H2C,700,'center'));}
  /* 右欄原理 */
  card(1040,160,500,640,{bg:'rgba(7,27,39,.75)'});wt(1070,208,'升溫從哪裡來',22,EC,700);
  alphaDo(seg(u,.06,.12),()=>{wt(1070,262,'1  氣體被壓縮，動能轉成熱',19,'rgba(227,236,238,.92)',600);wt(1070,300,'2  氣瓶以碳纖維承壓，耐溫有限',19,'rgba(227,236,238,.92)',600);});
  alphaDo(seg(u,.3,.36),()=>{tag(1070,350,'常溫加注',{bg:'#ff8a60',fg:'#0e2a3b',size:22});wt(1070,420,'必須放慢速度，或分多次加',19,'rgba(227,236,238,.92)',600);wt(1070,452,'加滿時間遠超過三分鐘',19,'#ff9d7a',700);});
  alphaDo(seg(u,.58,.64),()=>{tag(1070,520,'預冷 −40°C',{bg:H2C,fg:'#0e2a3b',size:22});wt(1070,590,'入口先扣掉一段升溫',19,'rgba(227,236,238,.92)',600);wt(1070,622,'才能約 3 分鐘加到 95–100%',19,H2C,700);});
  alphaDo(seg(u,.82,.88),()=>wt(1070,740,'代價：預冷器要耗電',19,EC,700));
 }},

{t:'加注協定如何控制',en:'The fuelling protocol',dur:13,
 d:'加注過程由協定控制，例如 SAE J2601。加氫機依車輛氣瓶的容量、起始壓力與環境溫度，決定壓力要多快升上去。一開始瓶壓低，可以升得快；愈接近目標壓力，升速愈慢，並確保溫度、流量與壓力都不超過限制：小客車的流量上限約每秒 60 公克，加氫機端壓力上限 87.5 MPa。加注停止的條件是達到目標壓力，也就是氣瓶充填率 95% 至 100%。70 MPa 指的是 15°C 時的額定壓力，所以瓶溫較高時，壓力會暫時高於 70 MPa。',
 s:[[0,'加氫機依容量、起始壓力與氣溫決定升壓速率'],[.3,'瓶壓低時升得快，接近目標時放慢'],[.58,'流量不超過 60 g/s，壓力不超過 87.5 MPa'],[.82,'達到目標壓力，充填率 95% 至 100% 即停止']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,940,640,{title:'氣瓶壓力與加注流量（示例）',x0:0,x1:180,y0:0,y1:100,xt:[0,60,120,180],yt:[0,20,40,60,80],xl:'加注時間（秒）',yl:'壓力（MPa）',pt:70,pb:70,pl:90,gx:3,gy:5});
  alphaDo(seg(u,.04,.1),()=>{const y=c.Y(87.5);ctx.setLineDash([10,8]);ln([c.px,y,c.px+c.pw,y],'#ff8a60',3);ctx.setLineDash([]);wt(c.px+8,y-10,'加氫機端上限 87.5 MPa',19,'#ff8a60',700,'left');
   const y2=c.Y(70);ctx.setLineDash([4,6]);ln([c.px,y2,c.px+c.pw,y2],'rgba(227,236,238,.5)',2);ctx.setLineDash([]);wt(c.px+8,y2+24,'額定 70 MPa（15°C 時）',18,'rgba(227,236,238,.85)',600,'left');});
  const k=ease(seg(u,.14,.8));
  if(k>0){ctx.beginPath();for(let i=0;i<=90;i++){const t=i/90;if(t>k)break;const p=PR(t);i?ctx.lineTo(c.X(t*180),c.Y(p)):ctx.moveTo(c.X(t*180),c.Y(p));}ctx.strokeStyle=H2C;ctx.lineWidth=5;ctx.stroke();
   const t=k,p=PR(t);circ(c.X(t*180),c.Y(p),9,EC);}
  alphaDo(seg(u,.3,.36),()=>wt(c.X(24),c.Y(40),'前段升得快',20,H2C,700,'left'));
  alphaDo(seg(u,.56,.62),()=>wt(c.X(120),c.Y(60),'接近目標，放慢',20,H2C,700,'left'));
  card(1040,160,500,640,{bg:'rgba(7,27,39,.75)'});wt(1070,208,'協定把關的四件事',22,EC,700);
  [['流量','不超過 60 g/s（小客車）',.12,CC],['壓力','加氫機端不超過 87.5 MPa',.3,'#ff8a60'],['溫度','瓶內氣體 −40°C 至 85°C',.5,EC],['停止','充填率 95–100% 即結束',.7,H2C]].forEach(([a,b,t0,col],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=262+i*126;box(1070,y-6,8,76,col);wt(1096,y+22,a,24,col,700);wt(1096,y+60,b,19,'rgba(227,236,238,.92)',500);}));
  alphaDo(seg(u,.8,.86),()=>{const t=trf('{n} MPa',{n:Math.round(PR(clamp(k,0,1)))});tag(c.X(150),c.Y(94),'壓力達標',{bg:H2C,fg:'#0e2a3b',size:22,align:'center'});});
 }},

{t:'加滿，拔槍離開',en:'Fill complete and depart',dur:13,side:true,cam:u=>({x:800,y:430,s:1.5}),base:()=>{landSky(GY,{sun:SUN,clouds:false});drawGround();},
 d:'氣瓶達到目標壓力，加氫機自動停止流量。接著要先把軟管內剩餘的高壓氫氣釋放到安全位置，壓力降下來之後，噴嘴才解鎖、才拔得出來。加氫機上還裝有斷離接頭：萬一駕駛忘了拔槍就開走，接頭會在拉力下自動分開並關閉兩側閥門，避免氫氣外洩。這一次大約加了 5 公斤氫氣，對小客車而言約可行駛 500 到 600 公里，整個流程只需要幾分鐘。',
 s:[[0,'達到目標壓力，加氫機自動停止流量'],[.3,'軟管內的高壓氫氣先洩壓，噴嘴才解鎖'],[.55,'若忘了拔槍，斷離接頭會分開並關閉閥門'],[.78,'約 5 公斤氫氣，可行駛約 500 至 600 公里']],
 draw(u){
  road();
  const g=gyy(700),dep=ease(seg(u,.7,1));const cx=800+dep*900;
  dispenser(640);
  fcv(cx,.98,0);
  const nx=cx+14,ny=g-62;
  const rel=seg(u,.38,.44);
  if(u<.55)hose(664,g-80,nx,ny,'#2a2f34',.4);
  else{ /* 斷離接頭示意：軟管收回 */ hose(664,g-80,690,g-30,'#2a2f34',.1);}
  if(u<.55)box(nx-10,ny-5,16,10,'#f2c230');
  const ven=band(u,.28,.42);if(ven>0)for(let k=0;k<5;k++){const f=((TT*.6)+k/5)%1;alphaDo(ven*(1-f),()=>circ(664+Math.sin(k*3)*10*f,g-146-f*110,6-f*3,H2C));}
  if(u>.5&&u<.62)alphaDo(band(u,.5,.62),()=>{ring(670,g-60,30,'#ff8a60',3);});
  lab(664,g-146,'洩壓後解鎖',{dx:-70,dy:-90,st:'g',a:band(u,.28,.5)});
  lab(676,g-60,'斷離接頭',{dx:90,dy:-120,st:'w',a:band(u,.5,.7)});
  lab(cx+140,g-110,'約 5 kg ≈ 500–600 km',{dx:20,dy:-110,st:'s',a:band(u,.72,1)});
 },
 hud(u){hudPanel(250,128,'本次加注（示例）',seg(u,.02,.08),w=>{hrow(54,'加氫量','5.0 kg',w,H2C);hrow(82,'時間','約 3 分',w,EC);hrow(110,'充填率','約 98%',w,CC);});}},

{t:'台灣的第一批加氫站',en:'Taiwan’s first stations',dur:13,
 d:'台灣的加氫站才剛起步。依經濟部的管理辦法，銷售氫燃料要設置加氫站，並包含儲氫槽、氫氣處理設備與加氫機，與地界和道路也要保持規定距離。2025 年 12 月，中油與聯華林德合作的楠梓加氫站啟用，可同時供應 700 巴的小客車與 350 巴的大型車，每天可服務約 7 輛大巴。加氫站造價高、車輛少，初期主要靠示範營運與公車路線累積使用量，再逐步擴充。',
 s:[[0,'台灣的加氫站依管理辦法設置與查驗'],[.3,'楠梓站同時供應 700 巴與 350 巴'],[.55,'每天可服務約 7 輛氫燃料電池大巴'],[.8,'造價高、車輛少，先以示範與公車累積用量']],
 draw(u){
  diagBG();
  card(60,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(92,208,'加氫站的三大設備',22,EC,700);
  [['儲氫槽','存放高壓氫氣',.04,H2C],['氫氣處理設備','壓縮、預冷與淨化',.2,CC],['加氫機','量測、通訊、加注',.36,'#ff8a60']].forEach(([a,b,t0,col],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=250+i*150;card(92,y,676,120,{bg:'rgba(14,42,59,.9)'});box(92,y,10,120,col);wt(130,y+50,a,28,col,700);wt(130,y+92,b,19,'rgba(227,236,238,.92)',500);}));
  alphaDo(seg(u,.5,.56),()=>wt(92,740,'並與地界、道路保持規定距離',19,'rgba(227,236,238,.9)',600));
  card(840,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(872,208,'中油楠梓加氫站',22,EC,700);
  [['2025 年 12 月','啟用，與聯華林德合作',.28],['700 / 350','bar 兩種壓力，小客車與大巴',.4],['約 7','輛大巴／天',.56],['示範','先以公車路線累積用量',.72]].forEach(([a,b,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=290+i*118;wt(872,y,a,i==1?34:i==2?44:30,i==2?H2C:EC,700,'left',COND);wt(872,y+40,b,19,'rgba(227,236,238,.9)',500);}));
 }}
]};
