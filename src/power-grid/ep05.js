// KITS: land
/* 電網系列 第 5 集：系統慣量與頻率響應 */
/* 機組跳脫後的頻率（示例）：5 秒時損失 6% 供電；H 為系統慣量常數（秒） */
const FSIM={};
function fsim(H,mode){
  const k=H+'_'+mode;if(FSIM[k])return FSIM[k];
  const dt=.05,o=[];let df=0,Pm=0,Pb=0;
  for(let t=0;t<=30.001;t+=dt){
    o.push(60+df*60);const x=-df;
    Pm+=(Math.min(.09,x/.05)-Pm)/2.5*dt;
    Pb+=((mode?Math.min(.05,x/.008):0)-Pb)/.2*dt;
    const hh=mode===2?H+2:H;
    df+=(t<5?0:(Pm+Pb-.06+2*x)/(2*hh))*dt;
  }
  FSIM[k]=o;return o;
}
const fAt=(H,mode,t)=>{const A=fsim(H,mode),f=clamp(t,0,30)*20,i=Math.min(A.length-2,Math.floor(f));return lerp(A[i],A[i+1],f-i);};

function rotor(x,y,r,ang,col){
  circ(x,y,r,'#2a3a44','rgba(255,255,255,.5)',2.5);
  for(let i=0;i<6;i++){const a=ang+i*TAU/6;ln([x,y,x+r*.88*Math.cos(a),y+r*.88*Math.sin(a)],col,Math.max(3,r*.07));}
  circ(x,y,r*.16,'#e3e8ec');
}
function plantB(x,gy,on,trip){
  box(x,gy-120,230,120,'#c9d1d6','rgba(0,0,0,.3)',1.2);box(x+24,gy-190,28,70,'#aeb8be','rgba(0,0,0,.3)',1);box(x+74,gy-210,24,90,'#aeb8be','rgba(0,0,0,.3)',1);
  box(x+120,gy-90,90,90,trip?'#c8553d':'#5e6d76');
  if(on&&!trip)for(let k=0;k<3;k++){const p=(TT*.2+k/3)%1;alphaDo((1-p)*.5,()=>circ(x+86+Math.sin(p*5+k)*8,gy-212-p*80,9+p*16,'rgba(200,210,215,.7)'));}
  rotor(x+165,gy-45,28,trip?0:TT*(on?9:3),'#e3e8ec');
}
function pylonB(x,gy,h){ln([x-18,gy,x,gy-h,x+18,gy],'#8d989f',3);ln([x-14,gy-h*.7,x+14,gy-h*.7],'#8d989f',3);ln([x-22,gy-h,x+22,gy-h],'#8d989f',4);return [x,gy-h];}
function cityB(x0,gy,n,litFn){
  for(let i=0;i<n;i++){const x=x0+i*66,h=70+((i*37)%5)*26,lit=litFn(i);
    box(x,gy-h,52,h,lit?'#dfe5e8':'#6b7780','rgba(0,0,0,.3)',1);
    for(let r=0;r<Math.floor(h/26);r++)for(let c=0;c<2;c++)box(x+9+c*22,gy-h+10+r*24,12,12,lit?'#ffd98a':'#2b3942');}
}

const EP={no:5,slug:'power-grid',seriesName:'電網系列',t:'系統慣量與頻率響應',en:'System inertia and frequency response',
lede:'電網的頻率是供需是否平衡的即時指標，而大型同步發電機轉子裡儲存的動能，就是替頻率擋下第一波衝擊的「慣量」。當太陽光電與風電透過變流器併網、取代部分同步機組，系統慣量下降，同樣的機組跳脫會讓頻率掉得更快。這一集看頻率與慣量的關係、跳脫後頻率曲線、低頻卸載，以及儲能與組網型變流器如何補上缺口。',
facts:[['±1','%','台灣系統頻率容許範圍為 60 Hz ±1%，下限 59.5 Hz（媒體報導台電調度原則）'],
['3,600','rpm','二極同步機組轉速與 60 Hz 對應：60 圈／秒 × 60 秒'],
['0.45→1.8','Hz／s','同樣損失 6% 供電，系統慣量常數 H 由 4 秒降到 1 秒時，起始頻率下降率的變化（示例）'],
['200','毫秒','業者表示儲能自動頻率控制（AFC）可在 200 毫秒內輸出 100% 功率'],
['60／85','MW／MWh','台電冬山儲能電站規格，採增強型動態調頻備轉（E-dReg）技術（媒體報導）'],
['300+','萬戶','2022 年台電說明，各頻段低頻卸載機制涵蓋約 300 多萬戶用戶']],
note:'說明：本集為教育用途示意動畫，設備與電網比例經過調整。台灣系統頻率 60 Hz ±1%（下限 59.5 Hz）、低頻卸載機制與 2022 年約 300 多萬戶納入各頻段，引自台電說明與媒體報導；儲能 AFC 可於 200 毫秒內輸出 100% 功率為業者說法；冬山儲能 60 MW／85 MWh 與 E-dReg 引自媒體報導；澳洲 Hornsdale 電池以虛擬慣量模式運轉引自澳洲再生能源署（ARENA）報告。系統慣量常數 H、機組跳脫 6%、頻率曲線（以搖擺方程式與簡化調速器模型計算）、再生能源占比情境與低頻卸載階段皆為典型範例，並非台灣電網實際參數。',
base:()=>{landSky(GY,{sun:{x:1300,y:120},clouds:false});drawGround();},
shots:[
{t:'60 Hz：供需的心跳',en:'60 Hz: the heartbeat of supply and demand',dur:13,side:true,
 d:'電網的頻率不是設定出來的，而是供需平衡的結果。發電廠裡的同步發電機與電網「鎖」在一起，一起以固定轉速旋轉：二極機組每分鐘 3,600 轉，剛好對應 60 Hz。發電量大於用電量時，機組被加速，頻率上升；用電量大於發電量時，機組被拖慢，頻率下降。調度中心必須讓頻率維持在 60 Hz 附近，台灣的容許範圍約為 ±1%，也就是下限 59.5 Hz。頻率一旦偏離太多，設備可能保護跳脫，所以頻率是整個電網最重要的健康指標。',
 s:[[0,'發電機與電網鎖在一起，同步旋轉'],[.3,'二極機組每分鐘 3,600 轉，對應 60 Hz'],[.58,'用電突然增加，機組被拖慢，頻率下降'],[.82,'調速器增加出力，頻率慢慢拉回']],
 draw(u){
  const gy=GY;
  plantB(130,gy,true,false);
  const ps=[420,640,860,1080].map((x,i)=>pylonB(x,gy,140-i*4));
  ln([360,gy-120,...ps.flat()],'rgba(30,40,46,.85)',1.8);
  const flow=seg(u,.04,.12);
  alphaDo(flow,()=>{const P=[[360,gy-120],...ps];for(let i=0;i<5;i++){const t=(TT*.28+i/5)%1,k=t*(P.length-1),j=Math.min(P.length-2,Math.floor(k));circ(lerp(P[j][0],P[j+1][0],k-j),lerp(P[j][1],P[j+1][1],k-j),3.4,'#f2c230');}});
  const more=seg(u,.5,.58);
  cityB(1160,gy,6,i=>true);
  alphaDo(more,()=>{box(1556,gy-150,20,150,'#7dc8dc');lab(1566,gy-150,'新增用電',{dx:-60,dy:-80,st:'w',a:band(u,.52,.82)});});
  lab(280,gy-190,'同步發電機',{dx:-40,dy:-100,st:'s',a:band(u,.02,.5)});
  lab(1260,gy-150,'城市用電',{dx:-20,dy:-110,st:'g',a:band(u,.04,.5)});
 },
 hud(u){
  const f=60+(u<.5?.02*Math.sin(u*40):-.35*Math.sin(Math.min(1,(u-.5)/.15)*Math.PI/2)*(1-ease(seg(u,.6,1))*.85));
  hudPanel(260,150,'系統頻率',seg(u,.05,.1),w=>{hrow(56,'頻率',f.toFixed(2)+' Hz',w,f<59.9?'#ff9d7a':'#7dffc4');hrow(88,'標稱值','60 Hz',w,'#fff');hrow(120,'下限','59.5 Hz',w,'#f2c230');});}},

{t:'慣量：轉子裡的動能',en:'Inertia: energy stored in rotors',dur:14,
 d:'慣量是旋轉質量抵抗轉速改變的能力。同步發電機的轉子與汽輪機很重、轉得很快，儲存了大量動能；當電網突然缺電，這份動能會先釋放出來補上缺口，代價是轉速（頻率）下降。系統慣量常以慣量常數 H 表示，意思是「機組儲存的動能，可以用額定功率放電多少秒」，大型火力機組約在數秒的等級（示例）。慣量越大，同樣的缺電只會讓頻率慢慢滑落，調度與調速器就有時間反應；慣量小，頻率會掉得又快又深。',
 s:[[0,'重的轉子儲存很多動能，轉速不易改變'],[.3,'突然缺電，兩組機組同時被拖慢'],[.6,'慣量大的機組，頻率下降得比較慢'],[.85,'慣量小的機組，頻率很快逼近下限']],
 draw(u){
  diagBG();
  const t=seg(u,.3,.95)*6,hv=fAt(4,0,5+t*.9),lw=fAt(1.6,0,5+t*.9);
  const cols=[['大慣量系統','H ≈ 4 秒（示例）','#7dffc4',4,hv,370,75],['小慣量系統','H ≈ 1.6 秒（示例）','#ff8a60',1.6,lw,1230,48]];
  cols.forEach(([n,sub,c,H,f,cx,r],i)=>{
    card(cx-290,150,580,650,{bg:'rgba(7,27,39,.75)',st:c});
    wt(cx,196,n,26,c,700,'center');wt(cx,230,sub,18,'rgba(227,236,238,.85)',500,'center');
    const rpm=3600*f/60,k=f/60;
    rotor(cx,400,r+30,TT*(4+(k-.97)*60)*(1),c);
    wt(cx,520,Math.round(rpm).toLocaleString('en-US')+' rpm',36,c,700,'center',COND);
    wt(cx,560,f.toFixed(2)+' Hz',46,f<59.5?'#ff9d7a':'#fff',700,'center',COND);
    rrp(cx-230,600,460,22,5);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fill();
    const q=clamp((f-58.5)/1.5,0,1);box(cx-230,600,460*q,22,f<59.5?'#e8572a':c);
    ln([cx-230+460/1.5,594,cx-230+460/1.5,628],'#f2c230',2.4);wt(cx-230+460/1.5,648,'59.5 Hz',16,'#f2c230',700,'center',COND);
    wt(cx,716,H>3?'動能多：頻率慢慢滑落':'動能少：頻率快速下滑',20,'#fff',600,'center');
    wt(cx,752,H>3?'留給調速器的反應時間較長':'留給調速器的反應時間很短',17,'rgba(227,236,238,.85)',500,'center');
  });
  alphaDo(seg(u,.28,.36),()=>{tag(800,470,'機組跳脫：缺電 6%',{size:18,bg:'#e8572a',align:'center'});});
  wt(800,820,'H = ½·J·ω² ÷ 額定容量（秒）',20,'#f2c230',700,'center');
 }},

{t:'機組跳脫後的頻率曲線',en:'Frequency after a unit trip',dur:14,
 d:'假設系統在第 5 秒突然損失一部機組，供電少了 6%（示例）。曲線的前幾秒幾乎是一條斜線，斜率稱為頻率變化率（RoCoF），大小約等於 60 Hz × 缺電比例 ÷（2 × H）。慣量大時斜率緩，慣量小時斜率陡。接著調速器開始增加出力，頻率在最低點（頻率最低點）後被拉回。大慣量系統的最低點約 59.56 Hz，仍在 59.5 Hz 之上；小慣量系統卻掉到約 59.3 Hz，已經跌破下限，會觸發保護動作。',
 s:[[0,'第 5 秒，一部大型機組突然跳脫'],[.3,'曲線前段的斜率，就是頻率下降率'],[.58,'調速器加油門，頻率在最低點後被拉回'],[.85,'小慣量系統的最低點跌破 59.5 Hz']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,960,640,{title:'機組跳脫後的頻率（示例，缺電 6%）',x0:0,x1:30,y0:59,y1:60.2,xt:[0,5,10,15,20,25,30],yt:[59,59.5,60],xl:'秒',yl:'Hz',pl:84,pt:60,pb:56,gx:6,gy:3});
  ctx.save();ctx.fillStyle='rgba(232,87,42,.1)';ctx.fillRect(C.px,C.Y(59.5),C.pw,C.Y(59)-C.Y(59.5));ctx.restore();
  ln([C.px,C.Y(59.5),C.px+C.pw,C.Y(59.5)],'rgba(232,87,42,.85)',1.8);wt(C.px+C.pw-8,C.Y(59.5)-8,'下限 59.5 Hz',15,'#ff9d7a',600,'right');
  const px=C.X(5);ln([px,C.py,px,C.py+C.ph],'rgba(255,255,255,.4)',1.4);
  alphaDo(seg(u,.04,.14),()=>tag(px+8,C.py+22,'機組跳脫',{size:15,bg:'#e8572a',align:'left'}));
  const dr=(H,col,a0,a1)=>{const k=ease(seg(u,a0,a1)),tm=30*k;ctx.beginPath();for(let t=0;t<=tm;t+=.25)ctx.lineTo(C.X(t),C.Y(Math.max(59,fAt(H,0,t))));if(tm>0){ctx.strokeStyle=col;ctx.lineWidth=3.4;ctx.stroke();}};
  dr(4,'#7dffc4',.12,.5);dr(1.6,'#ff8a60',.45,.85);
  alphaDo(seg(u,.3,.4),()=>{ln([C.X(5),C.Y(60),C.X(8.2),C.Y(59.55)],'#f2c230',2.4);ctx.setLineDash([6,6]);ln([C.X(5),C.Y(60),C.X(8.2),C.Y(60)],'rgba(242,194,48,.6)',1.4);ctx.setLineDash([]);tag(C.X(9),C.Y(59.85),'斜率 = RoCoF',{size:16,bg:'#f2c230',align:'left'});});
  alphaDo(seg(u,.5,.58),()=>tag(C.X(14),C.Y(59.72),'H = 4 秒：最低點約 59.56 Hz',{size:16,bg:'#7dffc4',align:'left'}));
  alphaDo(seg(u,.82,.9),()=>tag(C.X(12),C.Y(59.12),'H = 1.6 秒：最低點約 59.3 Hz',{size:16,bg:'#ff8a60',align:'left'}));
  const cx=1060;
  card(cx,160,480,300,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});wt(cx+24,202,'頻率變化率 RoCoF',22,'#f2c230',700);
  wt(cx+24,250,'60 × 0.06 ÷ (2 × H)',24,'#fff',700,'left',COND);
  [['H = 4 秒','0.45 Hz／s','#7dffc4'],['H = 1.6 秒','1.13 Hz／s','#ff8a60']].forEach(([a,b,c],i)=>{const y=312+i*62;wt(cx+24,y,a,20,'#fff',600);wt(cx+456,y,b,32,c,700,'right',COND);});
  card(cx,480,480,320,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(cx+24,522,'三個階段',22,'#7dc8dc',700);
  [['1','慣量：轉子動能先頂住','#f2c230'],['2','一次調頻：調速器加出力','#7dffc4'],['3','二次調頻：AGC 回到 60 Hz','#7dc8dc']].forEach(([n,t,c],i)=>{const y=572+i*70;circ(cx+40,y,16,c);wt(cx+40,y+7,n,20,'#13232e',800,'center',COND);wt(cx+68,y+7,t,19,'rgba(227,236,238,.92)',500);});
 }},

{t:'再生能源取代同步機組',en:'Inverter-based plants replace synchronous units',dur:14,
 d:'太陽光電與多數風機透過變流器併網，轉子或電池的轉速與電網頻率之間隔了一層電力電子，不會自動「感覺」到頻率變化，因此預設並不提供慣量。當這類電源取代部分同步機組，系統的總慣量就跟著下降。假設同步機組占 80% 時 H 約為 4 秒（示例），占 50% 降到 2.5 秒，占 20% 只剩 1 秒；同樣損失 6% 供電，頻率起始下降率會從 0.45 升到 1.8 Hz／s。這不代表再生能源不能高占比，而是需要新的工具補上快速反應的能力。',
 s:[[0,'同步機組多：轉子動能大，系統慣量高'],[.3,'變流器電源增加，慣量跟著下降'],[.6,'同樣缺電，頻率下降得更快'],[.85,'需要新的快速反應工具補上缺口']],
 draw(u){
  diagBG();
  const S=[['同步機組 80%',80,4,'0.45'],['同步機組 50%',50,2.5,'0.72'],['同步機組 20%',20,1,'1.8']];
  card(60,160,1000,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'電源結構與系統慣量（示例）',20,'#f2c230',700);
  S.forEach(([n,sy,H,ro],i)=>alphaDo(seg(u,.04+i*.12,.12+i*.12),()=>{
    const x=130+i*320,bw=180,top=260,hh=400,k=ease(seg(u,.06+i*.12,.2+i*.12));
    const hs=hh*sy/100*k,hi=hh*(100-sy)/100*k;
    box(x,top+hh-hs,bw,hs,'rgba(242,194,48,.85)');box(x,top+hh-hs-hi,bw,hi,'rgba(125,200,220,.85)');
    wt(x+bw/2,top+hh-hs/2+8,sy+'%',30,'#13232e',800,'center',COND);
    if(hi>30)wt(x+bw/2,top+hh-hs-hi/2+8,(100-sy)+'%',28,'#13232e',800,'center',COND);
    wt(x+bw/2,top+hh+36,n,19,'#fff',600,'center');
    wt(x+bw/2,top+hh+70,'H = '+H+' 秒',24,H<2?'#ff8a60':'#7dffc4',700,'center',COND);}));
  box(130,224,22,10,'#f2c230');wt(160,234,'同步機組',16,'rgba(227,236,238,.9)',600);box(430,224,22,10,'#7dc8dc');wt(460,234,'變流器電源',16,'rgba(227,236,238,.9)',600);
  const cx=1100;
  card(cx,160,440,300,{bg:'rgba(7,27,39,.75)',st:'#ff8a60'});wt(cx+24,202,'同樣缺電 6% 的起始下降率',20,'#ff8a60',700);
  S.forEach(([n,sy,H,ro],i)=>alphaDo(seg(u,.55+i*.08,.62+i*.08),()=>{const y=268+i*66;wt(cx+24,y,n,18,'#fff',600);wt(cx+416,y+4,ro+' Hz／s',32,i===2?'#ff8a60':'#7dffc4',700,'right',COND);}));
  card(cx,480,440,320,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(cx+24,522,'為什麼沒有慣量',20,'#7dc8dc',700);
  alphaDo(seg(u,.28,.36),()=>{['轉子或直流側經變流器併網','輸出由控制器決定，不隨頻率變','預設不釋放動能支撐頻率'].forEach((t,k)=>{circ(cx+32,572+k*52,3.5,'#7dc8dc');wt(cx+48,578+k*52,t,18,'rgba(227,236,238,.92)',500);});});
  alphaDo(seg(u,.84,.92),()=>tag(cx+220,770,'解法：讓變流器也能快速支撐',{size:16,bg:'#f2c230',align:'center'}));
 }},

{t:'低頻卸載：最後一道防線',en:'Under-frequency load shedding',dur:14,side:true,
 d:'如果頻率持續下滑，調度手段又來不及，電網還有最後一道防線：低頻卸載。保護電驛在變電所裡監測頻率，一旦低於設定值，就自動切開部分饋線，犧牲一小部分用戶，讓供需重新平衡，避免整個系統因為頻率崩潰而全面停電。通常會分成好幾個頻率階段，由低到高、一階一階卸載（階段數值為示例）。台電說明，2022 年約有 300 多萬戶用戶納入各頻段的低頻卸載機制；若供需仍失衡，才會進一步分區輪流停電。',
 s:[[0,'一部機組跳脫，頻率開始下滑'],[.3,'頻率跌破設定值，保護電驛動作'],[.55,'變電所切開部分饋線，這些用戶暫時停電'],[.8,'供需重新平衡，頻率回升，系統保住']],
 draw(u){
  const gy=GY,trip=u>.08;
  plantB(90,gy,true,trip);
  const ps=[360,560,760].map(x=>pylonB(x,gy,140));
  ln([320,gy-120,...ps.flat()],'rgba(30,40,46,.85)',1.8);
  /* 變電所 */
  box(900,gy-70,150,70,'#aeb8be','rgba(0,0,0,.35)',1.2);ln([ps[2][0],ps[2][1],960,gy-70],'rgba(30,40,46,.85)',1.8);
  [0,1,2].forEach(i=>{const open=u>.55-.0&&u>[.5,.58,.66][i];box(920+i*40,gy-110,22,40,open?'#c8553d':'#7dffc4','rgba(0,0,0,.4)',1);});
  const lit=i=>{const g=i%3;return !(u>[.5,.58,.66][g]&&u<.9);};
  cityB(1090,gy,7,lit);
  [0,1,2].forEach(g=>ln([1010,gy-60,1010+(g+1)*20,gy-60-g*10,1090+g*2*66+26,gy-170],'rgba(30,40,46,.25)',1));
  lab(190,gy-60,'機組跳脫',{dx:-20,dy:-120,st:'w',a:band(u,.06,.4)});
  lab(980,gy-110,'低頻保護電驛',{dx:-10,dy:-110,st:'s',a:band(u,.28,.8)});
  lab(1300,gy-170,'部分饋線停電',{dx:0,dy:-90,st:'w',a:band(u,.58,.88)});
 },
 hud(u){
  const f=kf(u,[[0,60,0],[.1,60,0],[.3,59.45,0],[.52,59.3,0],[.66,59.55,0],[.85,59.88,0],[1,59.95,0]]).x;
  hudPanel(270,150,'系統頻率',seg(u,.03,.08),w=>{hrow(56,'頻率',f.toFixed(2)+' Hz',w,f<59.5?'#ff9d7a':'#7dffc4');hrow(88,'第一階段（示例）','59.5 Hz',w,'#f2c230');hrow(120,'卸載',u>.5?trf('{n} 區',{n:u>.66?3:u>.58?2:1}):'尚未動作',w,u>.5?'#ff9d7a':'#fff');});}},

{t:'儲能與組網型變流器補上慣量',en:'Storage and grid-forming inverters add inertia',dur:14,
 d:'變流器電源要幫忙，關鍵是反應要快。電池儲能系統可以在毫秒到數百毫秒內改變輸出，業者表示儲能自動頻率控制可在 200 毫秒內輸出 100% 功率，台電冬山儲能電站（60 MW／85 MWh）就採用增強型動態調頻備轉技術。更進一步，組網型（grid-forming）變流器能模擬同步機組的行為，在頻率下滑時自動多輸出，稱為虛擬慣量；澳洲 Hornsdale 電池已新增這種運轉模式。不過，虛擬慣量需要電池預留功率與電量，也要和電壓穩定一起設計。',
 s:[[0,'沒有儲能：頻率掉得又快又深'],[.3,'電池快速頻率響應，毫秒級補上功率'],[.58,'組網型變流器模擬慣量，連起始下降都變緩'],[.85,'電池要預留功率與電量，才有餘裕支撐']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,900,640,{title:'同樣缺電 6%：加上儲能後的頻率（示例，系統 H = 1.6 秒）',x0:0,x1:30,y0:59,y1:60.2,xt:[0,5,10,15,20,25,30],yt:[59,59.5,60],xl:'秒',yl:'Hz',pl:84,pt:60,pb:56,gx:6,gy:3});
  ln([C.px,C.Y(59.5),C.px+C.pw,C.Y(59.5)],'rgba(232,87,42,.85)',1.8);wt(C.px+C.pw-8,C.Y(59.5)-8,'下限 59.5 Hz',15,'#ff9d7a',600,'right');
  ln([C.X(5),C.py,C.X(5),C.py+C.ph],'rgba(255,255,255,.4)',1.4);
  const dr=(mode,col,a0,a1)=>{const k=ease(seg(u,a0,a1)),tm=30*k;ctx.beginPath();for(let t=0;t<=tm;t+=.25)ctx.lineTo(C.X(t),C.Y(Math.max(59,fAt(1.6,mode,t))));if(tm>0){ctx.strokeStyle=col;ctx.lineWidth=3.4;ctx.stroke();}};
  dr(0,'#ff8a60',.04,.3);dr(1,'#7dffc4',.3,.56);dr(2,'#b37cff',.56,.82);
  alphaDo(seg(u,.2,.3),()=>tag(C.X(12),C.Y(59.12),'無儲能：最低點約 59.3 Hz',{size:16,bg:'#ff8a60',align:'left'}));
  alphaDo(seg(u,.46,.56),()=>tag(C.X(12),C.Y(59.7),'儲能快速響應：約 59.8 Hz',{size:16,bg:'#7dffc4',align:'left'}));
  alphaDo(seg(u,.72,.82),()=>tag(C.X(12),C.Y(60.1),'組網型（虛擬慣量）：約 59.9 Hz',{size:16,bg:'#b37cff',align:'left'}));
  const cx=1000;
  [['電池快速頻率響應','#7dffc4',['變流器偵測頻率偏差','毫秒級改變輸出功率','台電 AFC：200 毫秒內可滿載（業者說法）'],.3,0],
   ['組網型變流器','#b37cff',['自己建立電壓與頻率','模擬同步機組的慣性反應','澳洲 Hornsdale 已有虛擬慣量模式'],.56,1]].forEach(([n,c,L,a0,i])=>alphaDo(seg(u,a0,a0+.07),()=>{const y=160+i*232;
    card(cx,y,540,212,{bg:'rgba(7,27,39,.75)',st:c});wt(cx+24,y+42,n,24,c,700);L.forEach((t,k)=>{circ(cx+32,y+78+k*40,3.5,c);wt(cx+48,y+84+k*40,t,18,'rgba(227,236,238,.92)',500);});}));
  alphaDo(seg(u,.84,.92),()=>{card(cx,632,540,168,{bg:'rgba(255,255,255,.05)',st:'#f2c230'});wt(cx+24,674,'冬山儲能電站 60 MW／85 MWh',21,'#f2c230',700);wt(cx+24,718,'採增強型動態調頻備轉（E-dReg）',19,'rgba(227,236,238,.92)',500);wt(cx+24,758,'需預留功率與電量，才有餘裕支撐',19,'rgba(227,236,238,.92)',500);});
 }}
]};
