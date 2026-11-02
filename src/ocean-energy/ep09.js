// KITS: land
/* 海洋能系列 第 9 集：離岸漂浮式多用途平台 */
const PWR='#f2c230',WAV='#58b8d0',OKC='#7dffc4',WARN='#ff8a60',ORG='#e8572a';
const BED=820,SY=430;
const SWu=(a,L)=>({y:SY,A:a,L:L,sp:1.1,bed:BED});
const SW1=SWu(30,430);
function slopeAt(x,o){return Math.atan((swellY(x+12,o)-swellY(x-12,o))/24);}
function rotor(hx,hy,R,a){for(let i=0;i<3;i++){const t=a+i*TAU/3;ln([hx,hy,hx+Math.cos(t)*R,hy+Math.sin(t)*R],'#eef3f5',8);}circ(hx,hy,9,'#cfd8dc','#6a747a',2);}
/* 半潛式浮台＋風機＋環形浮體（原點為水線中心） */
function floater(x,y,s,tilt,opt){opt=opt||{};ctx.save();ctx.translate(x,y);ctx.rotate(tilt||0);ctx.scale(s,s);
  box(-150,52,300,34,'#6a7a84','#2d363b',2);
  box(-125,-24,50,78,'#8c9aa3','#2d363b',2);box(75,-24,50,78,'#8c9aa3','#2d363b',2);
  if(opt.turb!==false){poly([-112,-24,-88,-24,-96,-290,-104,-290],'#e3eaee','#9aa7ae',1.5);box(-120,-302,36,20,'#cfd8dc','#6a747a',2);}
  if(opt.torus!==false){box(-142,-12+(opt.hv||0),84,26,PWR,'#a88410',2);}
  if(opt.turb!==false){rotor(-100,-292,112,TT*(opt.spin||.9));}
  ctx.restore();}
function rotp(x,y,s,tilt,cx,cy){const c=Math.cos(tilt||0),n=Math.sin(tilt||0);return [x+(cx*c-cy*n)*s,y+(cx*n+cy*c)*s];}
function anchorBlk(x,y){poly([x-34,y,x+34,y,x+22,y-26,x-22,y-26],'#59656c','#2d363b',2);}
function chain(a,b,sag){const m=[(a[0]+b[0])/2,(a[1]+b[1])/2+sag];ln([a[0],a[1],m[0],m[1],b[0],b[1]],'#9fb0b8',3.5);}
function fishy(x,y,f){poly([x-12*f,y,x+8*f,y-6,x+8*f,y+6],'#cfe8f0');poly([x+8*f,y,x+16*f,y-6,x+16*f,y+6],'#cfe8f0');}
const EP={no:9,slug:'ocean-energy',seriesName:'海洋能系列',t:'離岸漂浮式多用途平台',en:'Offshore floating multi-use platforms',
lede:'浮動式風機的浮台所在的海域，同時有風、有浪，也有可以共用的海床空間。多用途平台的想法，是讓同一個海上據點同時取風與浪的能量，共用錨碇與海纜，再結合養殖或離岸製氫。這一集看這些構想怎麼運作、省在哪裡，以及在台灣海域的限制。',
facts:[['94.6','MW','挪威 Hywind Tampen：11 座浮動式風機（單機 8.6 MW），共用錨碇系統'],
['260–300','m','Hywind Tampen 場址水深，離挪威西岸約 140 公里'],
['20–30','%','文獻估計錨碇系統占浮動式風電總投資的比例'],
['約 35','%','Hywind Tampen 預計供應 5 座油氣平台年用電的比例'],
['1','MW','法國 Sealhyfe 離岸製氫試驗平台，日產最多約 400 kg 氫氣'],
['6–12','座','台灣浮動式示範計畫草案：每案須設置的浮台數（選出 2–3 案）']],
note:'說明：本集為教育用途示意動畫，平台、錨鏈與養殖箱網比例經過大幅壓縮。Hywind Tampen（Equinor，11 座 8.6 MW、合計 94.6 MW、共用錨碇、水深約 260–300 m、離岸約 140 km、預計供應 Snorre 與 Gullfaks 五座平台約 35% 年用電）取自 Equinor 公開資料與報導。錨碇約占浮動式風電總投資 20–30% 取自文獻整理，各案差異很大。立柱加環形浮體（spar-torus）風浪共構概念取自歐盟 FP7 MARINA Platform 計畫相關研究，多為模型與數值研究，尚無商業化案例。Sealhyfe（Lhyfe，約 1 MW 電解槽、日產最多約 400 kg 氫氣，2023 年在法國 SEM-REV 試驗場離岸約 20 km 處接上 2 MW 的 FLOATGEN 浮動式風機產出第一批氫氣）取自公司與媒體公開資訊，後續運轉結果請以業者公告為準。台灣浮動式離岸風電示範計畫（選出 2–3 案、每案 6–12 座浮台、2027 年啟動選商、2032 年底前併網）取自能源署草案相關報導，細節以正式公告為準。圖中的出力曲線、共用後相對成本、各項投資占比（錨碇以外）與養殖箱網配置皆為說明原理的典型範例，並非特定案場或實測資料。本集不代表任何特定案場。',
base:()=>{landSky(SY+150,{});drawSwell(SW1);},
shots:[
{t:'風與浪，同一座平台',en:'Wind and waves on one platform',dur:13,side:true,
 base:u=>{landSky(SY+150,{});drawSwell(SW1);},
 d:'浮動式風機需要一座浮台，而浮台所在的海域，同時也有穩定的波浪能量。風浪共構的想法，是讓同一座平台既裝風機，也在水線附近加上環形浮體或其他波浪能轉換器，兩種能量共用結構、錨碇與海纜。這個概念在歐洲已有多年的縮尺模型與水槽試驗，但多數仍在研究與示範階段，尚未成為商業標準配置。',
 s:[[0,'浮動式風機站在半潛式浮台上'],[.3,'浮台旁的海面，同時有風也有浪'],[.55,'水線處加上環形浮體，隨浪升降發電'],[.82,'兩種能量共用同一座平台與錨碇']],
 draw(u){
  const bx=800,by=swellY(bx,SW1),tl=slopeAt(bx,SW1)*.22;
  chain([bx-128,by+51],[470,BED-26],50);chain([bx+128,by+51],[1130,BED-26],50);anchorBlk(470,BED);anchorBlk(1130,BED);
  floater(bx,by,.85,tl,{hv:19*Math.sin(TT*1.6)*seg(u,.4,.6),torus:u>.38,spin:1.1});
 },
 fx(u){
  const bx=800,by=swellY(bx,SW1);
  lab(bx-85,by-248,'風機',{dx:-170,dy:-20,st:'n',a:band(u,.05,.45)});
  lab(bx+30,by+30,'半潛式浮台',{dx:200,dy:70,st:'n',a:band(u,.15,.5)});
  lab(bx-85,by,'環形浮體',{dx:-230,dy:50,st:'s',a:band(u,.45,.95)});
  lab(bx+128,by+51,'共用錨鏈',{dx:140,dy:160,st:'g',a:band(u,.7,1)});
 },
 hud(u){hudPanel(250,150,'共構平台輸出（示例）',1,(w,h)=>{const wi=12+2*Math.sin(TT*.7),wa=(.7+.35*Math.sin(TT*1.6+1))*seg(u,.45,.6);hrow(60,'風力',trf('{n} MW',{n:wi.toFixed(1)}),w,PWR);hrow(92,'波浪',trf('{n} MW',{n:wa.toFixed(1)}),w,WAV);hbar(16,118,w-32,(wi+wa)/15,OKC);});}},

{t:'一座平台，兩種取電方式',en:'Two ways to harvest on one platform',dur:14,
 d:'共構平台要解決的問題之一，是怎麼從波浪取電。以歐盟研究計畫提出的「立柱加環形浮體（spar-torus）」概念為例，風機立在柱體上，環形浮體套在水線附近，浪來時浮體上下起伏，與幾乎不動的柱體產生相對升沉，驅動液壓或直驅發電機；風暴時則把浮體鎖在柱體上，避免受損。另一個好處是兩種能源的出力不完全同步，合起來的曲線可能比單獨風力更平順，圖中曲線為示例。',
 s:[[0,'波浪讓環形浮體上下起伏'],[.3,'柱體幾乎不動，產生相對升沉'],[.58,'相對運動驅動發電機取電'],[.82,'風與浪的出力錯開，曲線更平順']],
 draw(u){
  diagBG();
  card(60,150,780,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'一天的出力曲線（示例）',20,PWR,700);
  const c=chartBox(100,230,700,500,{title:'',x0:0,x1:24,y0:0,y1:1.1,xt:[0,6,12,18,24],yt:[0,.5,1],xl:'時刻（時）',pl:60,pr:30,pt:30,pb:60});
  const fw=t=>.5+.42*Math.sin(t/24*TAU*1.5),fv=t=>.45+.3*Math.sin((t-4)/24*TAU*1.5),fs=t=>.7*fw(t)+.3*fv(t)+.1;
  const mk=f=>{const P=[];for(let i=0;i<=96;i++){const t=i/4;P.push(c.X(t),c.Y(f(t)));}return P;};
  ln(partial(mk(fw),seg(u,.05,.3)),PWR,3.5);
  ln(partial(mk(fv),seg(u,.3,.55)),WAV,3.5);
  ln(partial(mk(fs),seg(u,.58,.85)),OKC,5);
  alphaDo(seg(u,.1,.2),()=>tag(c.X(15),c.Y(1.04),'風力',{bg:PWR,fg:'#13232e',size:17}));
  alphaDo(seg(u,.35,.45),()=>tag(c.X(19.5),c.Y(.2),'波浪（較晚、較緩）',{bg:WAV,fg:'#13232e',size:17,align:'center'}));
  alphaDo(seg(u,.7,.85),()=>tag(c.X(8),c.Y(1.05),'合計',{bg:OKC,fg:'#13232e',size:17}));
  card(870,150,670,650,{bg:'rgba(7,27,39,.75)'});wt(894,196,'相對升沉發電（spar-torus 概念）',20,OKC,700);
  const wy=hv=>470+hv,hv=30*Math.sin(TT*1.8);
  ctx.fillStyle='rgba(88,184,208,.2)';ctx.beginPath();ctx.moveTo(890,wy(0)+30*Math.sin(TT*1.8));for(let x=890;x<=1520;x+=10)ctx.lineTo(x,470+30*Math.sin(TT*1.8-(x-890)/90)*(.5+.5*Math.cos((x-1200)/150)));ctx.lineTo(1520,770);ctx.lineTo(890,770);ctx.closePath();ctx.fill();
  box(1180,260,40,500,'#8c9aa3','#2d363b',2);box(1150,330,100,20,'#6a747a');wt(1200,320,'風機',18,'#fff',700,'center');
  box(1110,455+hv,160,34,PWR,'#a88410',2);box(1180,455+hv,40,34,'#8c9aa3');
  ln([1110,436,1110,470+hv-30],'rgba(255,255,255,.0)',1);
  alphaDo(seg(u,.28,.4),()=>{arrow(1330,430,1330,430+Math.sign(hv)*50+hv*.4,WARN,4);wt(1350,430,'相對升沉',20,WARN,700,'left');});
  alphaDo(seg(u,.5,.62),()=>{tag(1010,560,'發電機（PTO）',{bg:OKC,fg:'#13232e',size:17,align:'center'});});
  alphaDo(seg(u,.7,.8),()=>{tag(1010,620,'風暴：鎖住浮體',{bg:WARN,fg:'#13232e',size:17,align:'center'});});
  wt(1200,745,'柱體（慢）與浮體（快）',18,'rgba(227,236,238,.85)',600,'center');
 }},

{t:'共用錨碇與海纜',en:'Shared moorings and cables',dur:14,side:true,
 base:u=>{landSky(SY+150,{});drawSwell(SW1);},
 d:'浮動式風場最昂貴的零件之一是錨碇。文獻估計錨碇系統約占浮動式風電總投資的兩到三成，所以挪威的 Hywind Tampen 讓 11 座風機共用錨碇系統，場址水深約 260 至 300 公尺。共用的做法是讓相鄰兩座平台的錨鏈拉向同一個錨點，錨點數量因此少於每座各自錨碇；動態海纜則從各座平台垂下，接到海床上的海纜，一起送往岸上。下圖以三座平台為例，數量為示意。',
 s:[[0,'每座平台各拉兩條錨鏈，共六個錨點'],[.32,'相鄰平台的錨鏈改拉向同一個錨點'],[.58,'錨點縮減為四個，錨碇成本下降'],[.82,'動態海纜接到海床，一起送上岸']],
 draw(u){
  const k=ease(seg(u,.32,.6)),XS=[420,800,1180],A=[240,610,990,1360];
  const L=i=>lerp(XS[i]-180,A[i],k),R=i=>lerp(XS[i]+180,A[i+1],k);
  XS.forEach((x,i)=>{const y=swellY(x,SW1),tl=slopeAt(x,SW1)*.22,s=.5;
   chain([x-150*s,y+60*s],[L(i),BED-26],30);chain([x+150*s,y+60*s],[R(i),BED-26],30);});
  [0,1,2].forEach(i=>{anchorBlk(L(i),BED);});
  alphaDo(1-k,()=>{anchorBlk(R(0),BED);anchorBlk(R(1),BED);});
  anchorBlk(R(2),BED);
  alphaDo(1,()=>{});
  const ca=seg(u,.72,.82);
  alphaDo(ca,()=>{XS.forEach(x=>{const y=swellY(x,SW1);ln([x,y+50,x+20,y+250,x+70,BED-14,x+110,BED-8],'#ff8a60',3.5);});ln([420,BED-8,1600,BED-8],'#ff8a60',5);});
  XS.forEach((x,i)=>{const y=swellY(x,SW1),tl=slopeAt(x,SW1)*.22;floater(x,y,.5,tl,{spin:1,torus:false});});
 },
 fx(u){
  const k=ease(seg(u,.32,.6));
  lab(240,BED-26,'錨碇塊',{dx:-20,dy:-110,st:'n',a:band(u,0,.3)});
  lab(610,BED-26,'共用錨點',{dx:0,dy:-150,st:'g',a:band(u,.55,.9)});
  lab(800,swellY(800,SW1)-150,'浮動式風機',{dx:150,dy:-40,st:'n',a:band(u,.05,.3)});
  lab(1100,BED-8,'動態海纜',{dx:-20,dy:-200,st:'w',a:band(u,.72,1)});
 },
 hud(u){hudPanel(250,150,'三座平台的錨點數（示意）',1,(w,h)=>{const k=ease(seg(u,.32,.6)),n=Math.round(lerp(6,4,k));hrow(60,'各自錨碇',trf('{n} 個',{n:6}),w,WARN);hrow(92,'共用後',trf('{n} 個',{n:n}),w,OKC);hbar(16,118,w-32,n/6,k>.9?OKC:WARN);});}},

{t:'共用省在哪裡，代價是什麼',en:'Where sharing saves, and what it costs',dur:14,
 d:'共用能省多少，要看陣列配置與海床條件，不能一概而論。圖中以三座機組為例，示意共用錨碇、海纜與維運船次後，相對成本可能下降的方向，數字為典型範例而非實測。右側顯示錨碇在浮動式風電總投資中所占的比重，文獻估計約兩到三成，其餘各項為示意。共用也有代價：相鄰機組的受力互相牽動，其中一條錨纜失效時，鄰近機組的負載會跟著改變，設計時要把這種情況算進去。',
 s:[[0,'共用錨碇、海纜與維運船次可降低成本'],[.3,'錨碇約占浮動式風電總投資兩到三成'],[.58,'共用也讓相鄰機組的受力互相牽動'],[.82,'一條錨纜失效，鄰機的負載會改變']],
 draw(u){
  diagBG();
  card(60,150,780,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'共用後的相對成本（示例，獨立 = 100）',20,PWR,700);
  const I=[['錨碇',72],['動態海纜',78],['維運船次',80],['併網與升壓',85]];
  I.forEach(([n,v],i)=>{const y=240+i*135,a=seg(u,i*.07,i*.07+.14);wt(100,y+30,n,24,'#fff',700);
   box(100,y+46,600,26,'rgba(255,255,255,.12)');wt(720,y+68,'100',20,'rgba(227,236,238,.8)',700,'left',COND);
   const w=v*6*a;box(100,y+46,w,26,OKC);alphaDo(a,()=>wt(100+w+14,y+68,String(v),22,OKC,700,'left',COND));});
  card(870,150,670,650,{bg:'rgba(7,27,39,.75)'});wt(894,196,'浮動式風電投資占比（示意）',20,OKC,700);
  const S=[['風機',30,'#9cc6df'],['浮台',25,'#58b8d0'],['錨碇',25,WARN],['海纜',12,PWR],['其他',8,'#b59a6a']];
  let x0=900;S.forEach(([n,v,col],i)=>{const w=v/100*600*seg(u,i*.05,i*.05+.15);box(x0,260,w,90,col,'#13232e',2);if(w>60)wt(x0+w/2,314,n,i===4?15:19,'#13232e',800,'center');x0+=w;});
  alphaDo(seg(u,.28,.4),()=>{const xa=900+(30+25)/100*600;ln([xa,380,xa,400,xa+150,400,xa+150,380],WARN,3);tag(xa+75,436,'文獻估計 20–30%',{bg:WARN,fg:'#13232e',size:18,align:'center'});});
  alphaDo(seg(u,.5,.62),()=>{card(900,500,610,260,{bg:'rgba(255,255,255,.04)',st:'rgba(255,138,96,.6)'});box(900,500,8,260,WARN);wt(930,546,'共用的代價',24,'#fff',700);
   wt(930,590,'相鄰機組受力互相牽動',20,'rgba(227,236,238,.92)',600);
   alphaDo(seg(u,.62,.72),()=>wt(930,630,'一條錨纜失效，鄰機負載改變',20,'rgba(227,236,238,.92)',600));
   alphaDo(seg(u,.72,.82),()=>wt(930,670,'陣列配置要逐案驗證',20,'rgba(227,236,238,.92)',600));
   alphaDo(seg(u,.82,.92),()=>wt(930,718,'節省的是共用的部分，不是全部',20,PWR,700));});
 }},

{t:'結合養殖與離岸製氫',en:'Adding aquaculture and offshore hydrogen',dur:14,side:true,
 base:u=>{landSky(SY+150,{});drawSwell(SW1);},
 d:'平台上的電力不一定要全部送回岸上。法國的 Sealhyfe 是離岸製氫試驗平台，電解槽約 1 MW、日產最多約 400 公斤氫氣，透過海床匯流站連接 2 MW 的 FLOATGEN 浮動式風機，位置在 SEM-REV 試驗場，離岸約 20 公里。另一個構想是在平台旁加裝養殖箱網，共用錨碇與電力供應。氫氣可用海管或船運送上岸，養殖箱網則要考慮波浪、生物附著與漁獲作業，兩者都還在試驗與概念階段。',
 s:[[0,'平台旁的電力，不一定要送回岸上'],[.3,'電解槽把海水淡化後的水變成氫氣'],[.55,'氫氣經海管送上岸，或改用船運'],[.8,'平台旁也能設養殖箱網，共用電力與錨碇']],
 draw(u){
  const bx=700,s=.75,by=swellY(bx,SW1),tl=slopeAt(bx,SW1)*.22;
  chain([bx-150*s,by+60*s],[480,BED-26],40);chain([bx+150*s,by+60*s],[1000,BED-26],40);anchorBlk(480,BED);anchorBlk(1000,BED);
  const cx=1220,cy=swellY(cx,SW1);
  const ca=seg(u,.72,.85);
  alphaDo(ca,()=>{ln([bx+150*s,by+60*s,cx-60,cy+10],'#9fb0b8',3);
   poly([cx-70,cy+6,cx+70,cy+6,cx+50,cy+170,cx-50,cy+170],'rgba(230,246,255,.16)','rgba(230,246,255,.75)',2);
   box(cx-76,cy-6,152,14,PWR,'#a88410',2);
   const r=rng(7);for(let i=0;i<7;i++){fishy(cx-40+((TT*18+i*37)%80),cy+40+r()*110,(i%2?1:-1));}});
  const ha=seg(u,.32,.5);
  alphaDo(ha,()=>{const rx=bx+120*s,ry=by+90*s;ln([rx,ry,rx+30,BED-14],OKC,5);ln([rx+30,BED-14,1600,BED-14],OKC,5);
   for(let i=0;i<9;i++){const px=rx+30+((TT*110+i*150)%(1570-rx));circ(px,BED-14,6,'#13232e',OKC,2);}});
  floater(bx,by,s,tl,{spin:1,torus:false});
  const p=rotp(bx,by,s,tl,100,-44);box(p[0]-28*s,p[1]-20*s,56*s,40*s,'#e6f6ff','#6a747a',2);
  alphaDo(seg(u,.3,.42),()=>wt(p[0],p[1]+6,'H₂',22,'#13232e',800,'center'));
 },
 fx(u){
  const bx=700,by=swellY(bx,SW1),p=rotp(bx,by,.75,0,100,-44);
  lab(p[0],p[1],'電解槽',{dx:150,dy:-90,st:'g',a:band(u,.28,.62)});
  lab(1100,BED-14,'氫氣海管',{dx:0,dy:-170,st:'g',a:band(u,.45,.78)});
  lab(1220,swellY(1220,SW1)+110,'養殖箱網',{dx:130,dy:0,st:'s',a:band(u,.78,1)});
  lab(bx-75,by-220,'浮動式風機',{dx:-140,dy:-10,st:'n',a:band(u,0,.3)});
 },
 hud(u){hudPanel(250,150,'Sealhyfe 試驗平台',1,(w,h)=>{hrow(60,'電解槽','約 1 MW',w,OKC);hrow(92,'日產氫','最多約 400 kg',w,PWR);hbar(16,118,w-32,seg(u,.3,.7),OKC);});}},

{t:'台灣海域的構想與限制',en:'Concepts and limits for Taiwan’s waters',dur:13,
 d:'台灣是否適合風浪共構，要看海況與政策。能源署公布的浮動式離岸風電示範計畫草案，預計選出 2 至 3 案，每案設置 6 至 12 座浮台，2027 年啟動選商，目標在 2032 年底前併網，細節請以正式公告為準。波浪共構、養殖與製氫在台灣仍屬研究與概念階段，主要限制包括颱風下的生存設計、航道與漁業共用海域、海纜登陸，以及成本。較務實的路徑，是先把浮動式風力做穩，再逐步評估加入其他功能。',
 s:[[0,'示範計畫草案：選出 2 至 3 案，每案 6 至 12 座'],[.3,'2027 年選商，2032 年底前併網'],[.58,'颱風、航道漁業、海纜與成本都是限制'],[.82,'先做穩浮動式風力，再評估加入其他功能']],
 draw(u){
  diagBG();
  card(60,150,780,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'浮動式示範計畫草案（以公告為準）',20,PWR,700);
  alphaDo(seg(u,.02,.14),()=>{[0,1,2].forEach(i=>{const x=180+i*120;box(x-8,300,16,70,'#e3eaee');ln([x,300,x+40,320],'#eef3f5',6);ln([x,300,x-30,270],'#eef3f5',6);ln([x,300,x-10,340],'#eef3f5',6);box(x-26,370,52,18,'#6a7a84');});wt(300,430,'每案 6–12 座浮台，選出 2–3 案',22,'#fff',700,'center');});
  const tx0=120,tx1=780,ty=600;
  box(tx0,ty-3,tx1-tx0,6,'rgba(255,255,255,.35)');
  const K=[['2027','啟動選商',tx0+40,.2],['2032','底前併網',tx1-70,.32]];
  const pg=lerp(tx0,tx1,seg(u,.14,.4));box(tx0,ty-3,pg-tx0,6,PWR);
  K.forEach(([y,t,x,a])=>alphaDo(seg(u,a,a+.1),()=>{circ(x,ty,12,PWR,'#a88410',2);wt(x,ty-30,y,34,PWR,700,'center',COND);wt(x,ty+50,t,20,'#fff',700,'center');}));
  alphaDo(seg(u,.4,.5),()=>wt(450,720,'波浪共構、養殖、製氫：研究與概念階段',20,'rgba(227,236,238,.92)',600,'center'));
  card(870,150,670,650,{bg:'rgba(7,27,39,.75)'});wt(894,196,'共構要面對的限制',20,OKC,700);
  const D=[['颱風下的生存設計','承受極端波浪，需要生存模式',.5],['航道與漁業','海域要與船舶、漁民共用',.6],['海纜登陸與併網','動態海纜、登陸點與電網容量',.7],['成本','開發商對浮動式成本仍有疑慮',.8]];
  D.forEach(([a,b,t0],i)=>alphaDo(seg(u,t0-.06,t0+.04),()=>{const y=230+i*130;card(900,y,610,112,{bg:'rgba(255,255,255,.04)',st:'rgba(255,138,96,.55)'});box(900,y,8,112,WARN);wt(930,y+46,a,24,'#fff',700);wt(930,y+86,b,18,'rgba(227,236,238,.88)',500);}));
  alphaDo(seg(u,.88,.95),()=>{tag(1205,780,'先做穩浮動式風力，再評估加入其他功能',{bg:PWR,fg:'#13232e',size:18,align:'center'});});
 }}
]};
