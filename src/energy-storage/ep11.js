// KITS: land
/* 儲能系列 第 11 集：飛輪儲能：把電存成轉速 */
const g11=x=>groundY(x);
const NMAX11=16000,NMIN11=8000;
/* 地上的飛輪模組頂蓋 */
function fwCap(x,y){box(x-32,y-26,64,26,'#c9d1d6','rgba(0,0,0,.35)',2);box(x-36,y-30,72,6,'#aeb8be');circ(x,y-14,5,'#2d8f5a');}
/* 飛輪剖面（側視）：真空外殼、轉子、軸、磁浮軸承、馬達發電機；spin 為轉速比例 0–1 */
function fwCut(x,top,w,h,spin,hi){
  const hl=k=>hi===k;
  box(x-w/2,top,w,h,'#5c6770','rgba(0,0,0,.4)',3);
  box(x-w/2+10,top+10,w-20,h-20,'#16222b',hl(1)?'#f2c230':'rgba(255,255,255,.2)',hl(1)?4:1.5);
  ln([x,top+18,x,top+h-18],'#aeb8be',6);
  const by=[top+30,top+h-46];by.forEach(yy=>box(x-22,yy,44,16,'#b37cff',hl(3)?'#f2c230':'rgba(0,0,0,.4)',hl(3)?4:1.5));
  const ry=top+h*.42,rh=h*.26,rw=w-60;
  box(x-rw/2,ry,rw,rh,'#3b4a55',hl(2)?'#f2c230':'rgba(0,0,0,.5)',hl(2)?4:2);
  ctx.save();rrp(x-rw/2,ry,rw,rh,2);ctx.clip();
  const ph=(TT*spin*3)%1;
  for(let i=-1;i<8;i++){const t=(i+ph)/7;const sx=x-rw/2+rw*(.5-.5*Math.cos(t*Math.PI));box(sx-3,ry,6,rh,'rgba(125,255,196,.55)');}
  ctx.restore();
  box(x-rw/2,ry,10,rh,'#1b2730');box(x+rw/2-10,ry,10,rh,'#1b2730');
  const my=top+h*.22;box(x-30,my,60,h*.12,'#e1b36a',hl(4)?'#f2c230':'rgba(0,0,0,.4)',hl(4)?4:1.5);
  ln([x-18,my+6,x-18,my+h*.12-6,x+18,my+6,x+18,my+h*.12-6],'rgba(0,0,0,.35)',2);
}
function pcs11(x,y){box(x,y-110,120,110,'#dfe5e8','rgba(0,0,0,.3)',2);for(let i=0;i<3;i++)box(x+12+i*36,y-96,28,70,'#c9d1d6','rgba(0,0,0,.2)',1);box(x+20,y-20,80,6,'#2d8f5a');}
function trafo11(x,y){box(x,y-80,90,80,'#8a949a','rgba(0,0,0,.35)',2);for(let i=0;i<5;i++)box(x+8+i*16,y-74,8,60,'#6a747a');for(const dx of [20,45,70]){box(x+dx-4,y-112,8,32,'#c8b48a');}}
function pylon11(x,y){ctx.strokeStyle='#5c6770';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-30,y);ctx.lineTo(x-6,y-220);ctx.lineTo(x+6,y-220);ctx.lineTo(x+30,y);ctx.moveTo(x-40,y-180);ctx.lineTo(x+40,y-180);ctx.moveTo(x-34,y-140);ctx.lineTo(x+34,y-140);for(let k=0;k<5;k++){const a=y-k*44,b=y-(k+1)*44;ctx.moveTo(x-30+k*4.8,a);ctx.lineTo(x+30-(k+1)*4.8,b);}ctx.stroke();}
/* 一次轉速曲線：第 1 分鏡 */
function rpm11(u){if(u<.42)return lerp(NMIN11,NMAX11,ease(seg(u,.08,.42)));if(u<.58)return NMAX11;return lerp(NMAX11,NMIN11,ease(seg(u,.58,.9)));}
const EP={no:11,slug:'energy-storage',seriesName:'儲能系列',t:'飛輪儲能：把電存成轉速',en:'Flywheel storage: energy as spin',
lede:'飛輪儲能不靠化學反應，而是把電能變成高速旋轉的動能。這一集看能量為什麼和轉速平方成正比、真空與磁浮軸承如何減少損失、材料強度為何決定轉速上限，以及飛輪在毫秒級調頻與不斷電系統中扮演的角色。',
facts:[['16,000','rpm','美國 Beacon Power 飛輪模組的最高轉速（Stephentown 調頻電廠）'],['25','kWh','每個飛輪模組的可用能量；200 個模組組成 20 MW 調頻電廠'],['75','%','在半速到滿速之間運轉時，可用能量占滿速能量的比例（1−0.5²）'],['毫秒','級','飛輪功率反應時間，適合追隨快速的頻率變化'],['70–95','%','文獻常見的來回效率範圍，依設計與運轉方式而異'],['10 萬','次','Beacon 飛輪的設計全充放電循環次數（設計壽命 20 年）']],
note:'說明：本集為教育用途示意動畫，飛輪結構、電廠配置與曲線經過簡化。Beacon Power 紐約州 Stephentown 電廠 200 個 Smart Energy 25 模組、20 MW、每模組 25 kWh、轉速 8,000–16,000 rpm、設計壽命 20 年與 10 萬次循環，引自 2010–2011 年媒體與產業報導搜尋摘要。來回效率 70–95% 與毫秒級反應為綜述文獻常見範圍。鋼與碳纖維轉子的強度、密度、輪緣速度與比能量為以 σ≈ρv² 估算的典型範例，非特定產品規格；自放電速率因設計差異很大，圖中衰減曲線為典型範例。台灣目前的調頻輔助服務以電池儲能為主，查詢所及尚無大型併網飛輪案例。',
base:()=>{landSky(GY,{sun:{x:260,y:300},clouds:true});drawGround();},
shots:[
{t:'旋轉的電池',en:'A battery that spins',dur:13,side:true,
 d:'飛輪儲能把電能存成旋轉的動能。充電時，馬達把轉子加速；放電時，轉子帶動同一台電機變成發電機，把動能送回電網。美國紐約州的 Stephentown 電廠由 200 個飛輪模組組成，總功率 20 MW，專門提供電網調頻。每個模組埋在地下的鋼筒裡，轉子在真空中以每分鐘 8,000 到 16,000 轉運轉，可用能量約 25 kWh。地下安裝除了節省空間，也是萬一轉子損壞時的安全屏障。',
 s:[[0,'一排排飛輪模組，埋在地下的鋼筒裡'],[.12,'充電：馬達把轉子加速到每分鐘 16,000 轉'],[.45,'轉得越快，存的能量越多'],[.6,'放電：轉子帶動發電機，把電送回電網'],[.85,'電能與動能之間，來回轉換']],
 draw(u){
  for(let i=0;i<6;i++){const x=120+i*95;fwCap(x,g11(x));}
  const cx=820,gy=g11(cx),n=rpm11(u);
  box(cx-110,gy,220,8,'rgba(0,0,0,.25)');
  fwCut(cx,gy-40,190,280,n/NMAX11,0);
  pcs11(1010,g11(1010));trafo11(1180,g11(1180));pylon11(1420,g11(1420));
  ln([cx+60,gy-40,cx+60,gy-70,1010,gy-70],'#e8572a',3);ln([1130,g11(1130)-60,1180,g11(1180)-60],'#e8572a',3);
  ctx.strokeStyle='rgba(40,48,54,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1225,g11(1225)-112);ctx.quadraticCurveTo(1320,g11(1320)-150,1414,g11(1420)-218);ctx.moveTo(1426,g11(1420)-218);ctx.quadraticCurveTo(1520,g11(1500)-190,1600,g11(1600)-200);ctx.stroke();
  const dir=u<.5?-1:1,act=u<.45||u>.58&&u<.92;
  if(act)for(let k=0;k<6;k++){const p=((TT*.5*dir+k/6)%1+1)%1;circ(lerp(cx+60,1010,p),gy-70,5,u<.5?'#7dffc4':'#f2c230');circ(lerp(1130,1180,p),g11(1130)-60,4,u<.5?'#7dffc4':'#f2c230');}
 },
 fx(u){const cx=820,gy=g11(cx);
  lab(310,g11(310)-30,'地下飛輪模組',{dx:0,dy:-110,st:'l',a:band(u,.02,.35)});
  lab(cx,gy+120,'轉子（真空中）',{dx:-190,dy:40,st:'s',a:band(u,.12,.55)});
  lab(1070,g11(1070)-110,'變流器',{dx:-70,dy:-80,st:'n',a:band(u,.3,.7)});
  lab(1225,g11(1225)-112,'升壓變壓器',{dx:-40,dy:-60,st:'n',a:band(u,.35,.72)});
  lab(900,gy-70,u<.5?'充電':'放電',{dx:0,dy:-120,st:u<.5?'g':'s',a:band(u,.15,.42)+band(u,.6,.9)});},
 hud(u){hudPanel(300,170,'飛輪模組狀態',seg(u,.03,.08),w=>{const n=rpm11(u);
  hrow(46,'轉速',trf('{n} rpm',{n:Math.round(n/100)*100}),w,'#f2c230');hbar(16,58,w-32,n/NMAX11,'#f2c230');
  const ue=25*(Math.pow(n/NMAX11,2)-.25)/.75;hrow(96,'可用能量',trf('{n} kWh',{n:ue.toFixed(1)}),w,'#7dffc4');hbar(16,108,w-32,ue/25,'#7dffc4');
  htext(16,150,u<.5?'充電中：馬達加速':'放電中：發電機減速',14,'rgba(227,236,238,.75)',600);});}},

{t:'能量藏在轉速裡',en:'Energy lives in the speed',dur:14,
 d:'旋轉物體的動能是 E = ½Iω²，I 是轉動慣量，ω 是角速度。能量和轉速的平方成正比，轉速加倍，能量變成四倍，所以飛輪追求的是轉得快，而不是做得重。轉動慣量則取決於質量離軸心多遠，質量集中在外緣的輪圈最有效率。實際運轉時，飛輪不會降到零轉速，因為轉速太低時電機輸出電壓也低、功率受限；常見做法是在半速到滿速之間運轉，此時可以取出滿速能量的 1 − 0.5² = 75%。',
 s:[[0,'旋轉動能 E = ½Iω²'],[.25,'轉速加倍，能量變成四倍'],[.5,'質量放在外緣，轉動慣量最大'],[.72,'在半速到滿速之間運轉，可用約 75%']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,860,650,{title:'能量與轉速的關係（以 25 kWh 可用為例）',x0:0,x1:16000,y0:0,y1:35,xt:[0,4000,8000,12000,16000],yt:[0,10,20,30],xl:'轉速（rpm）',yl:'儲存能量（kWh）',pl:80,pt:70,pb:64,gx:4,gy:7});
  const EM=25/.75,E=n=>EM*Math.pow(n/NMAX11,2),t=lerp(0,NMAX11,seg(u,.05,.4));
  alphaDo(seg(u,.68,.76),()=>{ctx.fillStyle='rgba(125,255,196,.14)';ctx.beginPath();ctx.moveTo(c.X(8000),c.Y(0));for(let n=8000;n<=16000;n+=200)ctx.lineTo(c.X(n),c.Y(E(n)));ctx.lineTo(c.X(16000),c.Y(0));ctx.fill();
   ln([c.X(8000),c.Y(E(8000)),c.X(8000),c.Y(0)],'#e8572a',2);ln([c.X(16000)-6,c.Y(E(8000)),c.X(16000)-6,c.Y(E(16000))],'#7dffc4',4);
   wt(c.X(16000)-16,c.Y(20),'可用 75%',20,'#7dffc4',700,'right');wt(c.X(8000)+8,c.Y(2.5),'半速下限',17,'#e8572a',700);});
  ctx.beginPath();for(let n=0;n<=t;n+=200){const X=c.X(n),Y=c.Y(E(n));n===0?ctx.moveTo(X,Y):ctx.lineTo(X,Y);}ctx.strokeStyle='#f2c230';ctx.lineWidth=4;ctx.stroke();
  circ(c.X(t),c.Y(E(t)),8,'#f2c230','#13232e',2);
  alphaDo(seg(u,.25,.32)*(1-seg(u,.62,.68)),()=>{for(const n of [8000,16000]){ln([c.X(n),c.Y(0),c.X(n),c.Y(E(n))],'rgba(255,255,255,.4)',1.5);circ(c.X(n),c.Y(E(n)),7,'#fff');}
   wt(c.X(8000)-12,c.Y(E(8000))-12,trf('{n} kWh',{n:'8.3'}),18,'#fff',700,'right',COND);wt(c.X(16000)-12,c.Y(E(16000))+30,trf('{n} kWh',{n:'33.3'}),18,'#fff',700,'right',COND);});
  card(960,150,580,200,{bg:'rgba(7,27,39,.78)'});wt(990,200,'旋轉動能',21,'#f2c230',700);wt(1250,272,'E = ½ I ω²',44,'#fff',700,'center',COND);wt(990,330,'I 轉動慣量，ω 角速度',17,'rgba(227,236,238,.85)',600);
  alphaDo(seg(u,.25,.33),()=>{card(960,370,580,130,{bg:'rgba(7,27,39,.78)'});wt(990,420,'轉速 × 2',24,'#f2c230',700);wt(1250,420,'→',24,'#fff',700,'center');wt(1300,420,'能量 × 4',24,'#7dffc4',700);wt(990,470,'追求轉得快，而不是做得重',18,'#fff',600);});
  alphaDo(seg(u,.5,.58),()=>{card(960,520,580,280,{bg:'rgba(7,27,39,.78)'});
   const ox=1080,oy=670,a=TT*2;ring(ox,oy,80,'#7dffc4',14);ln([ox,oy,ox+Math.cos(a)*80,oy+Math.sin(a)*80],'rgba(255,255,255,.5)',2);circ(ox,oy,8,'#aeb8be');
   wt(1200,600,'質量集中在外緣',20,'#7dffc4',700);wt(1200,640,'I ≈ m r²',26,'#fff',700,'left',COND);wt(1200,690,'輪圈比實心圓盤',17,'rgba(227,236,238,.85)',600);wt(1200,720,'更有效率',17,'rgba(227,236,238,.85)',600);});
 }},

{t:'剖開飛輪模組',en:'Inside a flywheel module',dur:13,
 d:'高速飛輪要把損失降到最低。轉子放在抽成真空的鋼殼裡，避免空氣阻力在高速下產生大量摩擦熱；轉軸由磁浮軸承支撐，以永久磁鐵和電磁鐵讓轉子懸浮，減少機械摩擦與磨耗。轉軸上的馬達發電機是一台可雙向運轉的電機，充電時當馬達、放電時當發電機。外部的變流器負責把電機的變頻交流電轉成電網的 60 Hz，並決定每一刻要充還是放、功率多大。',
 s:[[0,'鋼殼內抽成真空，減少空氣阻力'],[.22,'碳纖維轉子，承受高速離心力'],[.45,'磁浮軸承讓轉子懸浮，幾乎無接觸'],[.65,'同一台電機，充電當馬達、放電當發電機'],[.84,'變流器把變頻交流轉成電網 60 Hz']],
 draw(u){
  diagBG();
  card(60,150,640,650,{bg:'rgba(7,27,39,.75)'});
  const hi=u<.2?1:u<.43?2:u<.63?3:u<.82?4:5;
  fwCut(380,190,300,560,1,hi);
  alphaDo(seg(u,.82,.88),()=>{box(560,220,120,90,'#dfe5e8',hi===5?'#f2c230':'rgba(0,0,0,.3)',hi===5?4:2);wt(620,330,'變流器',16,'#fff',700,'center');ln([410,290,560,290],'#e8572a',3);});
  const P=[['1','真空外殼','減少空氣阻力與發熱','#58b8d0'],['2','碳纖維轉子','儲存動能的主體','#7dffc4'],['3','磁浮軸承','懸浮支撐，減少摩擦','#b37cff'],['4','馬達／發電機','雙向轉換電能與動能','#e1b36a'],['5','變流器','頻率轉換與充放電控制','#f2c230']];
  const T=[0,.2,.43,.63,.82];
  P.forEach((p,i)=>alphaDo(seg(u,T[i],T[i]+.06),()=>{const y=160+i*128,on=hi===i+1;card(740,y,800,112,{bg:on?'rgba(242,194,48,.12)':'rgba(7,27,39,.78)',st:on?'#f2c230':undefined});
   circ(790,y+56,26,p[3]);wt(790,y+65,p[0],24,'#13232e',700,'center',COND);wt(840,y+48,p[1],23,on?'#f2c230':'#fff',700);wt(840,y+86,p[2],18,'rgba(227,236,238,.85)',600);}));
 }},

{t:'轉速的上限：材料強度',en:'Speed limit: material strength',dur:13,
 d:'轉得越快，輪圈受到的離心力越大。薄輪圈的環向應力約等於 σ ≈ ρv²，ρ 是材料密度，v 是輪緣線速度，所以能承受多高轉速，取決於材料的「強度除以密度」。以典型數值估算，高強度鋼的輪緣速度約 300 多 m/s，碳纖維複合材料可達將近 1,000 m/s，單位質量可存的能量相差近十倍。因此現代高速飛輪多用碳纖維，並把模組裝在地下或厚鋼殼內，防範轉子破裂時的碎片。',
 s:[[0,'轉速越高，輪圈被往外拉得越緊'],[.25,'環向應力 σ ≈ ρv²：強度除以密度決定極限'],[.5,'碳纖維輪緣速度可達鋼的三倍左右'],[.78,'地下安裝與厚鋼殼，防範轉子破裂']],
 draw(u){
  diagBG();
  card(60,150,560,650,{bg:'rgba(7,27,39,.75)'});wt(90,196,'輪圈受力（俯視）',21,'#f2c230',700);
  const ox=340,oy=470,R=170,a=TT*(1+seg(u,0,.25)*4),k=seg(u,0,.25);
  ring(ox,oy,R,'#7dffc4',22);for(let i=0;i<12;i++){const t=a+i*Math.PI/6;ln([ox+Math.cos(t)*(R-11),oy+Math.sin(t)*(R-11),ox+Math.cos(t)*(R+11),oy+Math.sin(t)*(R+11)],'rgba(0,0,0,.35)',2);}
  circ(ox,oy,14,'#aeb8be');
  for(let i=0;i<8;i++){const t=i*Math.PI/4+.4;arrow(ox+Math.cos(t)*(R+18),oy+Math.sin(t)*(R+18),ox+Math.cos(t)*(R+18+30+50*k),oy+Math.sin(t)*(R+18+30+50*k),'#e8572a',3);}
  alphaDo(seg(u,.25,.32),()=>{card(90,690,500,90,{bg:'rgba(14,42,59,.9)'});wt(340,746,'σ ≈ ρ v²',36,'#fff',700,'center',COND);});
  card(660,150,880,650,{bg:'rgba(7,27,39,.75)'});wt(690,196,'兩種轉子材料（典型範例）',21,'#f2c230',700);
  const M=[['高強度鋼','強度約 800 MPa，密度 7,850 kg/m³','',320,14,'#ff9d7a'],['碳纖維複合材料','強度約 1,500 MPa，密度 1,600 kg/m³','',970,130,'#7dffc4']],b=seg(u,.42,.72);
  M.forEach((m,i)=>{const y=250+i*240;alphaDo(seg(u,.3+i*.06,.36+i*.06),()=>{wt(690,y,m[0],22,m[5],700);wt(690,y+34,m[1],16,'rgba(227,236,238,.8)',600);
   wt(690,y+80,'輪緣速度',16,'#fff',600);box(820,y+62,560*b*m[3]/1000,26,m[5]);alphaDo(b,()=>wt(830+560*b*m[3]/1000,y+84,trf('{n} m/s',{n:m[3]}),20,'#fff',700,'left',COND));
   wt(690,y+128,'比能量',16,'#fff',600);box(820,y+110,560*b*m[4]/140,26,m[5]);alphaDo(b,()=>wt(830+560*b*m[4]/140,y+132,trf('{n} Wh/kg',{n:m[4]}),20,'#fff',700,'left',COND));});});
  alphaDo(seg(u,.78,.86),()=>{tag(1100,760,'地下安裝 + 防爆鋼殼',{size:19,bg:'#c0392b',fg:'#fff',align:'center'});});
  alphaDo(seg(u,.6,.68),()=>wt(690,712,'以 σ≈ρv² 估算的轉子理論值',15,'rgba(227,236,238,.6)',500));
 }},

{t:'毫秒級的調頻幫手',en:'Millisecond frequency support',dur:13,
 d:'電網頻率 60 Hz 代表發電與用電的即時平衡。當一部大型機組跳脫，頻率會在幾秒內下滑，傳統機組的調速器需要數秒到數十秒才能增加出力。飛輪透過電力電子控制，可在毫秒級改變功率，立刻放電把頻率撐住，等傳統機組或電池接手後，再慢慢充電回到待命轉速。飛輪幾乎不怕頻繁充放電，適合這種一天上千次的小幅調整。台灣的調頻輔助服務目前以電池儲能為主，飛輪是另一種技術選項。',
 s:[[0,'機組跳脫，頻率開始下滑'],[.25,'飛輪在毫秒內放電，先把頻率撐住'],[.52,'傳統機組數秒後才逐步增加出力'],[.76,'接手後，飛輪慢慢充電回到待命']],
 draw(u){
  diagBG();
  const t=lerp(0,30,seg(u,.03,.9));
  const fw=x=>x<2.05?0:x<14?lerp(1,0,seg(x,8,14)):lerp(0,-.35,seg(x,14,17))*(1-seg(x,22,30));
  const gn=x=>x<4?0:lerp(0,1,easeOut(seg(x,4,14)));
  const c1=chartBox(60,150,1480,300,{title:'電網頻率（Hz）',x0:0,x1:30,y0:59.85,y1:60.05,xt:[0,10,20,30],yt:[59.9,60],pl:90,pt:56,pb:40,gx:6,gy:4});
  const fr=x=>{const dip=x<2?0:(x<2.05?-.02*seg(x,2,2.05):-.02-.08*(1-Math.exp(-(x-2)/.6))*(1-.75));return 60+dip*(x<12?1:Math.exp(-(x-12)/4));};
  const frNo=x=>x<2?60:60-.11*(1-Math.exp(-(x-2)/1.2))*(x<12?1:Math.exp(-(x-12)/5));
  alphaDo(seg(u,.2,.3),()=>{ctx.setLineDash([8,6]);ctx.beginPath();for(let x=0;x<=t;x+=.1){x===0?ctx.moveTo(c1.X(x),c1.Y(frNo(x))):ctx.lineTo(c1.X(x),c1.Y(frNo(x)));}ctx.strokeStyle='rgba(255,157,122,.8)';ctx.lineWidth=2.5;ctx.stroke();ctx.setLineDash([]);
   wt(c1.X(30)-10,c1.Y(59.885)+4,'沒有快速調頻',16,'#ff9d7a',700,'right');});
  ctx.beginPath();for(let x=0;x<=t;x+=.1){x===0?ctx.moveTo(c1.X(x),c1.Y(fr(x))):ctx.lineTo(c1.X(x),c1.Y(fr(x)));}ctx.strokeStyle='#7dffc4';ctx.lineWidth=4;ctx.stroke();
  alphaDo(seg(u,.06,.12),()=>{ln([c1.X(2),c1.py,c1.X(2),c1.py+c1.ph],'rgba(232,87,42,.7)',2);tag(c1.X(2)+10,c1.py+20,'機組跳脫',{size:16,bg:'#c0392b',fg:'#fff'});});
  const c2=chartBox(60,480,1480,320,{title:'出力（相對值）',x0:0,x1:30,y0:-.5,y1:1.1,xt:[0,10,20,30],yt:[-.5,0,.5,1],xl:'時間（秒）',pl:90,pt:56,pb:56,gx:6,gy:4});
  ln([c2.X(0),c2.Y(0),c2.X(30),c2.Y(0)],'rgba(255,255,255,.4)',1.5);
  const draw=(fn,col)=>{ctx.beginPath();for(let x=0;x<=t;x+=.05){x===0?ctx.moveTo(c2.X(x),c2.Y(fn(x))):ctx.lineTo(c2.X(x),c2.Y(fn(x)));}ctx.strokeStyle=col;ctx.lineWidth=4;ctx.stroke();};
  draw(fw,'#f2c230');alphaDo(seg(u,.45,.52),()=>draw(gn,'#58b8d0'));
  alphaDo(seg(u,.25,.32),()=>wt(c2.X(5),c2.Y(1)-10,'飛輪：毫秒級放電',18,'#f2c230',700));
  alphaDo(seg(u,.52,.6),()=>wt(c2.X(15),c2.Y(.62),'傳統機組：數秒後逐步增加',18,'#58b8d0',700));
  alphaDo(seg(u,.76,.84),()=>wt(c2.X(17),c2.Y(-.12),'飛輪充電回待命',18,'#f2c230',700));
 }},

{t:'自放電與適用場合',en:'Self-discharge and best uses',dur:14,
 d:'飛輪的弱點是自放電。即使在真空與磁浮軸承下，殘餘的空氣、軸承與電機損失仍會讓轉子持續減速，一般數小時內就會流失可觀的能量，因此不適合把中午的電存到晚上。它的長處是功率大、反應快、循環壽命長，Beacon 的模組設計可承受 10 萬次全充放電。常見用途包括電網調頻、資料中心與工廠的不斷電系統（UPS），在停電到備用發電機啟動之間撐住數十秒，以及軌道車輛剎車能量的回收再利用。',
 s:[[0,'即使在真空中，轉子仍會慢慢減速'],[.3,'幾小時內流失可觀能量，不適合長時間儲存'],[.55,'功率大、反應快、可承受上萬次循環'],[.78,'適合調頻、不斷電系統與剎車能量回收']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,740,650,{title:'待機時的剩餘能量（典型範例）',x0:0,x1:12,y0:0,y1:100,xt:[0,3,6,9,12],yt:[0,50,100],xl:'待機時間（小時）',yl:'剩餘能量（%）',pl:80,pt:70,pb:64,gx:4,gy:4});
  const t=lerp(0,12,seg(u,.05,.5));
  const fwE=x=>100*Math.exp(-x*.12),btE=x=>100-x*.01;
  const dr=(fn,col)=>{ctx.beginPath();for(let x=0;x<=t;x+=.1){x===0?ctx.moveTo(c.X(x),c.Y(fn(x))):ctx.lineTo(c.X(x),c.Y(fn(x)));}ctx.strokeStyle=col;ctx.lineWidth=4;ctx.stroke();};
  dr(btE,'#58b8d0');dr(fwE,'#f2c230');
  alphaDo(seg(u,.3,.38),()=>{wt(c.X(12)-10,c.Y(100)+30,'鋰電池',18,'#58b8d0',700,'right');wt(c.X(12)-10,c.Y(fwE(12))-14,'飛輪',18,'#f2c230',700,'right');});
  const A=[['電網調頻','頻繁小幅充放電，毫秒級反應','#7dffc4'],['不斷電系統（UPS）','停電到發電機啟動前，撐住數十秒','#7dffc4'],['剎車能量回收','軌道車輛減速時吸收、加速時釋放','#7dffc4'],['不適合','數小時的能量時移，例如午存晚用','#ff9d7a']];
  A.forEach((a,i)=>alphaDo(seg(u,.55+i*.08,.61+i*.08),()=>{const y=150+i*166;card(840,y,700,148,{bg:'rgba(7,27,39,.78)'});box(840,y,6,148,a[2]);wt(870,y+58,a[0],24,a[2],700);wt(870,y+104,a[1],18,'#fff',600);}));
 }}
]};
