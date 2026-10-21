// KITS: land
/* 電網系列 第 4 集：離島微電網 */
const islY=x=>440-150*Math.pow(Math.max(0,Math.sin(Math.PI*(x-360)/1120)),.7);
const onIsl=x=>x>372&&x<1468;
function dieselPlant(x,on){
  const y=islY(x+80);
  box(x,y-84,170,84,'#c9d1d6','rgba(0,0,0,.3)',1);box(x+22,y-132,24,48,'#aeb8be','rgba(0,0,0,.3)',1);box(x+62,y-150,22,66,'#aeb8be','rgba(0,0,0,.3)',1);
  box(x+98,y-60,56,60,'#5e6d76');for(let i=0;i<3;i++)box(x+104,y-52+i*16,44,8,'#8d989f');
  if(on)for(let k=0;k<3;k++){const p=(TT*.22+k/3)%1;alphaDo((1-p)*.55,()=>circ(x+73+Math.sin(p*5+k)*7,y-152-p*70,8+p*14,'rgba(90,96,100,.7)'));}
}
function dieselI(x,y){box(x,y-60,100,60,'#c9d1d6','rgba(0,0,0,.3)',1);box(x+14,y-96,18,36,'#aeb8be');for(let i=0;i<3;i++)box(x+44+i*18,y-48,12,36,'#5e6d76');}
function oilTank(x){const y=islY(x);box(x-30,y-56,60,56,'#b08a64','rgba(0,0,0,.3)',1);ctx.beginPath();ctx.ellipse(x,y-56,30,8,0,0,TAU);ctx.fillStyle='#c79d72';ctx.fill();}
function tanker(x,y){
  poly([x-120,y-26,x+120,y-26,x+96,y+6,x-100,y+6],'#2f4b5d','rgba(0,0,0,.4)',1.2);
  box(x-110,y-36,220,10,'#c8553d');box(x+60,y-66,44,30,'#e8eef0','rgba(0,0,0,.3)',1);box(x+68,y-60,10,8,'#3d6f8e');box(x+84,y-60,10,8,'#3d6f8e');
  ln([x-60,y-36,x-60,y-50,x+30,y-50,x+30,y-36],'#8d989f',2);
}
function poleI(x,h){const y=islY(x);ln([x,y,x,y-h],'#6b5845',4);ln([x-14,y-h+6,x+14,y-h+6],'#6b5845',3);return [x,y-h+6];}
function houseI(x,lit){const y=islY(x+21),hh=40+(x%3)*8;box(x,y-hh,42,hh,'#dfe5e8','rgba(0,0,0,.25)',1);poly([x-4,y-hh,x+21,y-hh-16,x+46,y-hh],'#9b6b55');
  box(x+8,y-hh+12,10,10,lit?'#ffd98a':'#3d6f8e');box(x+24,y-hh+12,10,10,lit?'#ffd98a':'#3d6f8e');}
function windI(x,y,h,rot){ln([x,y,x,y-h],'#eef2f4',5);for(let i=0;i<3;i++){const a=rot+i*TAU/3;ln([x,y-h,x+h*.5*Math.cos(a),y-h+h*.5*Math.sin(a)],'#eef2f4',3);}circ(x,y-h,4,'#c9d1d6');}
function battBox(x,y,w,h,soc){box(x,y-h,w,h,'#e3e8ec','rgba(0,0,0,.35)',1.2);box(x,y-h,w,8,'#9aa6ad');
  const n=6;for(let i=0;i<n;i++){const cx=x+8+i*((w-16)/n);box(cx,y-h+18,(w-16)/n-4,h-30,'rgba(0,0,0,.12)');box(cx,y-12-(h-30)*soc,(w-16)/n-4,(h-30)*soc,'#7dffc4');}}

/* 一天的發電與用電模擬（示例）：負載、風光、儲能（200 kWh、最大 40 kW）、柴油補足 */
const dLoad=h=>38+12*Math.exp(-Math.pow((h-8)/2,2))+32*Math.exp(-Math.pow((h-20)/2.2,2))+8*Math.exp(-Math.pow((h-13)/2.5,2));
const dPV=h=>(h<6||h>18)?0:90*Math.pow(Math.sin(Math.PI*(h-6)/12),1.4)*(1-.05*Math.sin(h*1.7));
const dWind=h=>14+6*Math.sin(h*.9+1)+3*Math.sin(h*2.3);
let SIM=null;
function sim(){
  if(SIM)return SIM;
  const N=240,A=[];let soc=.3;
  for(let i=0;i<=N;i++){
    const h=i*24/N,L=dLoad(h),P=dPV(h),W=dWind(h),net=L-P-W;let bat=0,cur=0,dsl=0;
    if(net<0){bat=-Math.min(-net,40,(1-soc)*200/(24/N));cur=Math.max(0,-net+bat);}
    else{const av=Math.max(0,(soc-.2)*200/(24/N));bat=Math.min(net,40,av);dsl=net-bat;}
    soc=Math.min(1,Math.max(0,soc-bat*(24/N)/200));
    A.push({h,L,P,W,bat,dsl,cur,soc});
  }
  SIM=A;return A;
}
function simAt(h){const A=sim(),f=clamp(h/24,0,1)*(A.length-1),i=Math.min(A.length-2,Math.floor(f)),t=f-i;const a=A[i],b=A[i+1],o={};for(const k in a)o[k]=lerp(a[k],b[k],t);return o;}

const EP={no:4,slug:'power-grid',seriesName:'電網系列',t:'離島微電網',en:'Island microgrids',
lede:'離島沒有和本島相連的電網，用電長期靠柴油發電機，燃料要用船運。微電網把太陽光電、風機、電池與柴油機整合成一座能獨立運轉的小電網，由能源管理系統即時調度。這一集看微電網的組成、一天裡電力如何分配、電池怎麼穩住頻率，以及蘭嶼與七美等離島的實際做法。',
facts:[['6.4','%','七美全島年用電中綠電占比（約 2017 年報導）；規劃擴充後，綠電大於負載的時間可達全年 15%'],
['16','元／度','七美以柴油機發電的每度成本約 16 元（2017 年報導）'],
['500／1,100','kW／kWh','台達電交付台電的蘭嶼儲能系統規格：500 kW、1.1 MWh（2022 年報導）'],
['4×20','公尺','蘭嶼儲能系統旁的鋼筋混凝土防風牆，高 4 m、寬 20 m，對付颱風、強風與鹽霧'],
['4','部','東吉嶼微電網保留的柴油發電機，與太陽光電、儲能電池共同供電'],
['67','%','七美中期規劃（3 MW 光電＋1.5 MW 風機）再加需量反應，綠電大於負載的時間占比預估值']],
note:'說明：本集為教育用途示意動畫，島嶼、設備與地形比例經過調整。七美綠電占比 6.4%、柴油每度成本約 16 元、年用電約 780 萬度與擴充規劃（15%／50%／67% 為「綠電大於負載的時間占比」預估）引自 2017 年媒體報導；蘭嶼儲能 500 kW／1.1 MWh 與防風牆規格引自 2022 年台達電新聞；東吉嶼微電網（結合太陽光電、儲能與 4 部柴油機）引自 2019 年前後公視與電視新聞報導，各數據年代較舊。一天的負載與發電曲線、儲能 200 kWh／40 kW、頻率偏移曲線與節點配置皆為典型範例，並非特定島嶼的實測資料。',
base:()=>seaBase(),
shots:[
{t:'一座孤立的島',en:'An isolated island grid',dur:13,side:true,
 d:'離島多半沒有海底電纜接到本島，島上的電必須自己發。傳統作法是在島上蓋一座柴油發電廠：油輪把柴油運到油槽，發電機燒油發電，再由電線桿把電送進村落。這種供電可靠，但燃料與維修都得靠船運，成本高，遇到風浪或颱風還可能無法補給。柴油機排放的廢氣與噪音也會影響島上的生活品質。微電網的想法，就是在島上就地加入太陽光電與風力，並用電池與控制系統把它們整合起來，少燒一點柴油。',
 s:[[0,'離島沒有電纜接本島，電只能自己發'],[.28,'油輪把柴油運來，送進島上油槽'],[.55,'柴油機發電，再由電線桿送進村落'],[.8,'燃料靠船運，成本高也容易受天候影響']],
 draw(u){
  /* 島 */
  ctx.beginPath();ctx.moveTo(360,520);for(let x=360;x<=1480;x+=8)ctx.lineTo(x,islY(x));ctx.lineTo(1480,520);ctx.closePath();
  ctx.fillStyle='#6b8e4e';ctx.fill();ctx.beginPath();ctx.moveTo(340,880);for(let x=340;x<=1500;x+=8)ctx.lineTo(x,islY(x)+22+nz(x*.01)*4);ctx.lineTo(1500,880);ctx.closePath();ctx.fillStyle='#8a7a5c';ctx.fill();
  const tx=lerp(40,230,ease(seg(u,.04,.3))),ty=swellY(tx,{y:420})-2;
  tanker(tx,ty+6);
  oilTank(700);dieselPlant(470,true);
  /* 輸油 */
  alphaDo(seg(u,.3,.4),()=>{ln([tx+90,ty-30,300,ty-110,700,islY(700)-60],'rgba(176,138,100,.9)',3);for(let i=0;i<5;i++){const t=(TT*.35+i/5)%1;circ(lerp(tx+90,700,t),lerp(ty-30,islY(700)-60,t)-Math.sin(t*3.14)*60,3.2,'#c79d72');}});
  /* 配電 */
  const poles=[760,860,960,1060,1160].map(x=>poleI(x,70));
  const ps=[[560,islY(560)-84],...poles];
  ln(ps.flat(),'rgba(30,40,46,.85)',1.6);
  const on=seg(u,.5,.6);
  alphaDo(on,()=>{for(let i=0;i<5;i++){const t=(TT*.3+i/5)%1,k=t*(ps.length-1),j=Math.min(ps.length-2,Math.floor(k));circ(lerp(ps[j][0],ps[j+1][0],k-j),lerp(ps[j][1],ps[j+1][1],k-j),3,'#f2c230');}});
  [1090,1150,1210,1270].forEach((x,i)=>houseI(x+ (i>1?40:0),u>.55));
  lab(550,islY(550)-120,'柴油發電廠',{dx:-30,dy:-90,st:'w',a:band(u,.45,.8)});
  lab(700,islY(700)-56,'油槽',{dx:20,dy:-120,a:band(u,.28,.55)});
  lab(tx,ty-60,'運油船',{dx:-10,dy:-90,a:band(u,.04,.45)});
  lab(1180,islY(1180)-90,'村落',{dx:20,dy:-110,st:'g',a:band(u,.6,1)});
 },
 hud(u){hudPanel(250,150,'孤島電網（典型）',seg(u,.05,.1),w=>{hrow(56,'發電來源','柴油 100%',w,'#ff9d7a');hrow(88,'與本島電網','無連接',w,'#fff');hrow(120,'燃料補給','靠船運',w,'#f2c230');});}},

{t:'微電網的組成',en:'What makes a microgrid',dur:14,
 d:'微電網是一座能獨立運轉的小電網，由發電、儲電、用電與控制四部分組成。太陽光電與風機提供不用燃料的電；柴油機是穩定可靠的後盾；電池把多餘的電存起來，在不夠的時候放出來，並且反應非常快。三者都接到同一條匯流排，送往村落負載。最關鍵的是能源管理系統（EMS），它收集各設備的出力、電池的電量與負載預測，決定誰該多發、誰該少發，讓電壓與頻率維持穩定，同時盡量少燒柴油。',
 s:[[0,'太陽光電、風機、柴油機與電池接到同一條匯流排'],[.3,'匯流排把電送給村落負載'],[.55,'電池在電多時充電、電不足時放電'],[.78,'能源管理系統即時調度每一個設備']],
 draw(u){
  diagBG();
  const BX=820;
  /* 匯流排 */
  box(BX-8,260,16,340,'#c9d1d6');wt(BX,248,'微電網匯流排',18,'#fff',700,'center');
  const N=[[220,320,'太陽光電','#f2c230'],[220,430,'風機','#7dc8dc'],[220,540,'柴油機','#ff8a60']];
  const fl=seg(u,.08,.2);
  N.forEach(([x,y,n,c],i)=>alphaDo(seg(u,.04+i*.04,.1+i*.04),()=>{
    card(x-110,y-46,220,92,{bg:'rgba(255,255,255,.05)',st:c});wt(x,y+8,n,26,c,700,'center');
    ln([x+110,y,BX-8,y],'rgba(227,236,238,.6)',3);
    alphaDo(fl,()=>{for(let k=0;k<4;k++){const t=(TT*.35+k/4+i*.2)%1;circ(lerp(x+110,BX-8,t),y,4,c);}});}));
  /* 負載 */
  alphaDo(seg(u,.24,.32),()=>{card(1180,350,300,160,{bg:'rgba(255,255,255,.05)',st:'#7dffc4'});wt(1330,440,'村落負載',26,'#7dffc4',700,'center');ln([BX+8,430,1180,430],'rgba(227,236,238,.6)',3);
    for(let k=0;k<4;k++){const t=(TT*.35+k/4)%1;circ(lerp(BX+8,1180,t),430,4,'#7dffc4');}});
  /* 儲能 */
  alphaDo(seg(u,.46,.54),()=>{card(670,640,300,76,{bg:'rgba(255,255,255,.05)',st:'#b37cff'});wt(820,688,'儲能電池',26,'#b37cff',700,'center');
    const ch=u<.66;ln([BX,600,BX,640],'rgba(227,236,238,.6)',3);
    for(let k=0;k<3;k++){const t=(TT*.4+k/3)%1;circ(BX,ch?lerp(600,640,t):lerp(640,600,t),4,'#b37cff');}
    tag(1010,682,ch?'電多時充電':'電少時放電',{size:17,bg:'#b37cff',align:'left'});});
  /* EMS */
  alphaDo(seg(u,.7,.8),()=>{card(660,140,320,92,{bg:'rgba(255,255,255,.05)',st:'#f2c230'});wt(820,176,'能源管理系統',24,'#f2c230',700,'center');wt(820,210,'EMS',20,'#f2c230',700,'center',COND);
    ctx.save();ctx.setLineDash([8,8]);ctx.lineDashOffset=-TT*30;ctx.strokeStyle='rgba(242,194,48,.8)';ctx.lineWidth=2.2;
    [[660,186,330,300],[660,186,330,410],[660,186,330,520],[980,186,1330,350],[820,232,820,260]].forEach(([a,b,c,d])=>{ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke();});ctx.restore();ctx.setLineDash([]);
    wt(1330,290,'負載預測',18,'rgba(227,236,238,.85)',600,'center');});
 }},

{t:'一天的電力怎麼分配',en:'How a day of power is shared',dur:14,
 d:'我們用一座假想的小島看一天的電力分配（示例）。清晨與夜間，用電不高，風機與電池先供電，不夠的部分才由柴油機補上。白天太陽升起，光電出力很高，除了供應負載，剩下的電把電池充滿；若電池也充不下，就得減少光電出力。傍晚光電消失、用電卻衝上尖峰，這時候電池以最大功率放電，柴油機只補不足的部分。能源管理系統的目標，就是讓綠電盡量被用到，讓柴油機少開、開在效率好的區間。',
 s:[[0,'夜間：風機與電池先供電，柴油機補不足'],[.32,'白天：光電供應負載，並把電池充滿'],[.6,'傍晚用電尖峰：電池放電，柴油機只補不足'],[.85,'目標：綠電用得多，柴油機開得少']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,960,640,{title:'一天的發電與用電（示例，單位 kW）',x0:0,x1:24,y0:0,y1:120,xt:[0,6,12,18,24],yt:[0,40,80,120],xl:'時',yl:'kW',pl:76,pt:60,pb:56,gx:4,gy:3});
  const hh=24*ease(seg(u,.04,.96)),A=sim();
  const pts=k=>{const r=[];for(let i=0;i<A.length&&A[i].h<=hh;i++)r.push([C.X(A[i].h),C.Y(k(A[i]))]);return r;};
  /* 風光面積 */
  const rp=pts(a=>a.P+a.W);
  if(rp.length>1){ctx.beginPath();ctx.moveTo(rp[0][0],C.Y(0));rp.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(rp[rp.length-1][0],C.Y(0));ctx.closePath();ctx.fillStyle='rgba(125,255,196,.22)';ctx.fill();ctx.beginPath();rp.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle='#7dffc4';ctx.lineWidth=2.4;ctx.stroke();}
  /* 柴油 */
  const dp=pts(a=>a.dsl);
  if(dp.length>1){ctx.beginPath();dp.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle='#ff8a60';ctx.lineWidth=3;ctx.stroke();}
  /* 負載 */
  const lp=pts(a=>a.L);
  if(lp.length>1){ctx.beginPath();lp.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle='#ffffff';ctx.lineWidth=3.4;ctx.stroke();}
  const x=C.X(hh);ln([x,C.py,x,C.py+C.ph],'rgba(255,255,255,.55)',1.6);
  /* 圖例 */
  [['負載','#ffffff'],['光電＋風機','#7dffc4'],['柴油機','#ff8a60']].forEach(([n,c],i)=>{box(C.px+20+i*190,C.py+14,24,6,c);wt(C.px+52+i*190,C.py+24,n,16,'rgba(227,236,238,.9)',600);});
  /* 右側讀數 */
  const o=simAt(hh),cx=1060;
  card(cx,160,480,640,{bg:'rgba(7,27,39,.75)',r:12});wt(cx+24,200,trf('{n} 時的即時分配',{n:Math.floor(hh)}),20,'#f2c230',700);
  const R=[['負載',o.L,'#ffffff'],['光電＋風機',o.P+o.W,'#7dffc4'],['電池',o.bat,'#b37cff'],['柴油機',o.dsl,'#ff8a60']];
  R.forEach(([n,v,c],i)=>{const y=262+i*92;wt(cx+24,y,n,20,'#fff',600);
    if(i===2){wt(cx+456,y,trf(v>=.5?'放電 {n} kW':v<=-.5?'充電 {n} kW':'待機 {n} kW',{n:Math.abs(v).toFixed(0)}),26,c,700,'right',COND);}
    else wt(cx+456,y,v.toFixed(0)+' kW',30,c,700,'right',COND);
    rrp(cx+24,y+14,432,16,4);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fill();
    const w=432*Math.min(1,Math.abs(v)/110);box(cx+24,y+14,Math.max(2,w),16,c);});
  wt(cx+24,650,'電池電量',20,'#fff',600);wt(cx+456,650,(o.soc*100).toFixed(0)+' %',26,'#b37cff',700,'right',COND);
  rrp(cx+24,664,432,22,5);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fill();box(cx+24,664,432*o.soc,22,'#b37cff');
  alphaDo(band(u,.3,.55),()=>tag(cx+240,738,'多餘的光電先充電池',{size:17,bg:'#7dffc4',align:'center'}));
  alphaDo(band(u,.6,.8),()=>tag(cx+240,738,'尖峰由電池放電頂上',{size:17,bg:'#b37cff',align:'center'}));
  alphaDo(seg(u,.84,.92),()=>tag(cx+240,738,'柴油機只補不足',{size:17,bg:'#ff8a60',align:'center'}));
 }},

{t:'電池如何穩住頻率',en:'How batteries hold the frequency',dur:14,
 d:'小島的電網很「輕」：機組少、負載小，光電一旦被雲遮住，出力可能在幾秒內掉掉一大截，頻率就會明顯下滑。只靠柴油機時，要等調速器加油門，頻率會先跌得比較深、恢復也慢。有了電池與變流器，情況就不同：變流器可在毫秒級改變輸出，立刻把缺的功率補上，頻率只小幅偏移就拉回。更進一步，可建立電壓與頻率的「組網型」變流器還能在柴油機停機時當主力，讓島上的光電與風機在沒有大型機組的情況下仍能運轉。',
 s:[[0,'雲飄過，光電出力瞬間掉了一大截'],[.3,'只靠柴油機：調速器反應慢，頻率跌得深'],[.58,'加了電池：變流器毫秒級補上缺的功率'],[.82,'組網型變流器還能自己建立電壓與頻率']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,900,640,{title:'雲遮光電後的頻率（示意）',x0:0,x1:30,y0:58.6,y1:60.3,xt:[0,5,10,15,20,25,30],yt:[58.8,59.2,59.6,60],xl:'秒',yl:'Hz',pl:84,pt:60,pb:56,gx:6,gy:4});
  const A=t=>t<5?60:60-1.6*(1-Math.exp(-(t-5)/1.5))*Math.exp(-(t-5)/10);
  const B=t=>t<5?60:60-.22*Math.sin(Math.min(1,(t-5)/1.4)*Math.PI/2)*Math.exp(-(t-5)/2.2);
  /* 允許範圍 */
  ctx.save();ctx.fillStyle='rgba(125,255,196,.07)';ctx.fillRect(C.px,C.Y(60.5),C.pw,C.Y(59.5)-C.Y(60.5));ctx.restore();
  ln([C.px,C.Y(59.5),C.px+C.pw,C.Y(59.5)],'rgba(232,87,42,.75)',1.6);wt(C.px+C.pw-8,C.Y(59.5)-8,'允許下限（示例）',15,'#ff9d7a',600,'right');
  const draw1=(f,col,a0,a1)=>{const k=ease(seg(u,a0,a1)),tm=30*k;ctx.beginPath();for(let t=0;t<=tm;t+=.25)ctx.lineTo(C.X(t),C.Y(f(t)));if(tm>0){ctx.strokeStyle=col;ctx.lineWidth=3.4;ctx.stroke();}return tm;};
  const ca=seg(u,.04,.18);
  alphaDo(ca,()=>{const px=C.X(5);ln([px,C.py,px,C.py+C.ph],'rgba(255,255,255,.4)',1.4);tag(px+8,C.py+22,'雲遮住光電',{size:15,bg:'#7dc8dc',align:'left'});});
  draw1(A,'#ff8a60',.2,.52);draw1(B,'#7dffc4',.5,.8);
  alphaDo(seg(u,.4,.5),()=>tag(C.X(9),C.Y(58.95),'只靠柴油機',{size:16,bg:'#ff8a60',align:'left'}));
  alphaDo(seg(u,.68,.78),()=>tag(C.X(9),C.Y(59.9),'加上電池變流器',{size:16,bg:'#7dffc4',align:'left'}));
  /* 右側比較 */
  const cx=1000;
  [['柴油機組','#ff8a60',['慣量大，頻率變化較慢','調速器加油門要時間','頻率先跌得深、恢復慢'],.2],
   ['電池變流器','#7dffc4',['毫秒級改變輸出','立即補上缺的功率','頻率偏移小、拉回快'],.5]].forEach(([n,c,L,a0],i)=>alphaDo(seg(u,a0,a0+.07),()=>{const y=160+i*230;
    card(cx,y,540,210,{bg:'rgba(7,27,39,.75)',st:c});wt(cx+24,y+42,n,24,c,700);L.forEach((t,k)=>{circ(cx+32,y+78+k*40,3.5,c);wt(cx+48,y+84+k*40,t,19,'rgba(227,236,238,.92)',500);});}));
  alphaDo(seg(u,.82,.9),()=>{card(cx,630,540,170,{bg:'rgba(255,255,255,.05)',st:'#f2c230'});wt(cx+24,672,'組網型（grid-forming）變流器',21,'#f2c230',700);wt(cx+24,716,'可自己建立電壓與頻率',19,'rgba(227,236,238,.92)',500);wt(cx+24,756,'柴油機停機時，風光仍能運轉',19,'rgba(227,236,238,.92)',500);});
 }},

{t:'蘭嶼的儲能與防風牆',en:'Lanyu storage and its windbreak',dur:14,side:true,
 d:'蘭嶼的供電長期倚賴柴油發電機，夏季觀光旺季時尖峰用電增加，供電吃緊。台電在蘭嶼電廠設置了台達電交付的儲能系統，規格約 500 kW、1.1 MWh，用來削峰填谷、調節頻率，並在發電機之間提供備用電源。蘭嶼位於颱風路徑，風大又帶鹽霧，因此設備旁蓋了一面高 4 公尺、寬 20 公尺的鋼筋混凝土防風牆，把強風與飛濺的鹽分擋在設備之外，讓儲能系統能長期可靠運轉。',
 s:[[0,'蘭嶼尖峰用電增加，供電吃緊'],[.3,'儲能系統削峰填谷，並調節頻率'],[.58,'颱風強風帶著鹽霧，從海面吹來'],[.82,'防風牆擋在上風處，保護儲能設備']],
 cam:u=>camMix({x:800,y:450,s:1},{x:1160,y:470,s:1.5},ease(seg(u,.2,.6))),
 draw(u){
  const gy=500;
  /* 陸地 */
  ctx.beginPath();ctx.moveTo(740,gy+40);ctx.lineTo(820,gy+10);ctx.lineTo(900,gy);ctx.lineTo(1700,gy);ctx.lineTo(1700,900);ctx.lineTo(740,900);ctx.closePath();ctx.fillStyle='#6b8e4e';ctx.fill();
  box(740,gy+14,960,900-gy,'#8a7a5c');
  ctx.beginPath();ctx.moveTo(740,gy+40);ctx.lineTo(820,gy+10);ctx.lineTo(900,gy);ctx.lineTo(1700,gy);ctx.strokeStyle='#5c8a3f';ctx.lineWidth=3;ctx.stroke();
  /* 風 */
  const wind=seg(u,.45,.55)*(1-seg(u,.92,1)*.5);
  alphaDo(wind,()=>{for(let i=0;i<14;i++){const y=gy-170+((i*37)%170),p=((TT*.55+i*.171)%1),x=lerp(400,1000,p);ln([x,y,x+80,y],'rgba(255,255,255,.55)',2);}
    for(let i=0;i<22;i++){const p=((TT*.4+i*.137)%1),y=gy-30-((i*53)%150);circ(lerp(380,980,p),y+Math.sin(p*9+i)*6,2.2,'rgba(255,255,255,.7)');}});
  /* 防風牆 */
  const ws=ease(seg(u,.7,.82));
  box(980,gy-112*ws,30,112*ws,'#9aa0a3','rgba(0,0,0,.4)',1.5);
  /* 儲能設備 */
  const soc=.35+.6*Math.min(1,seg(u,.15,.45));
  battBox(1060,gy,200,86,soc);box(1280,gy-56,64,56,'#aeb8be','rgba(0,0,0,.3)',1);wt(1312,gy-22,'PCS',16,'#13232e',700,'center',COND);
  /* 鹽霧被擋 */
  alphaDo(ws*wind,()=>{for(let i=0;i<8;i++){const p=((TT*.5+i*.13)%1);circ(1000-p*40+Math.sin(p*7+i)*4,gy-118-p*30,2.2,'rgba(255,255,255,.7)');}});
  /* 柴油機組與電線 */
  dieselI(1400,gy);
  lab(1160,gy-86,'儲能設備',{dx:0,dy:-110,st:'g',a:band(u,.04,.6)});
  lab(993,gy-112,'防風牆',{dx:-30,dy:-70,st:'s',a:band(u,.7,1)});
  lab(880,gy-90,'颱風強風與鹽霧',{dx:0,dy:-60,st:'w',a:band(u,.44,.8)});
  lab(1460,gy-80,'柴油機組',{dx:30,dy:-80,a:band(u,.04,.45)});
 },
 hud(u){hudPanel(270,182,'蘭嶼儲能系統',seg(u,.05,.1),w=>{hrow(56,'功率','500 kW',w,'#7dffc4');hrow(88,'容量','1.1 MWh',w,'#7dffc4');hrow(120,'防風牆','高 4 m × 寬 20 m',w,'#f2c230');hrow(152,'用途','削峰填谷、調頻',w,'#fff');});}},

{t:'讓柴油機少開一點',en:'Burning less diesel',dur:14,
 d:'微電網的目標不是完全趕走柴油機，而是讓它少開、開得有效率。以七美為例，2017 年的報導指出全島年用電約 780 萬度，綠電占比只有 6.4%，柴油發電每度成本約 16 元。規劃擴充光電與風機、再加上儲能與能源管理系統，綠電大於負載的時間預估可達全年 15%；中期擴充到 3 MW 光電與 1.5 MW 風機，可達 50%；若再配合需量反應，預估可提高到 67%。這些是規劃值，實際效果仍取決於天候與用電習慣。',
 s:[[0,'七美的綠電占比，過去只有 6.4%'],[.3,'擴充光電、風機並加上儲能與 EMS'],[.6,'再搭配需量反應，綠電時間占比可更高'],[.85,'柴油機仍是後盾，但開機時數大幅減少']],
 draw(u){
  diagBG();
  card(60,160,800,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'七美：綠電大於負載的時間占比（規劃值）',20,'#f2c230',700);
  const R=[['擴充光電與風機＋儲能',15,'#7dc8dc',.1],['中期 3 MW 光電＋1.5 MW 風機',50,'#f2c230',.35],['再加需量反應',67,'#7dffc4',.6]];
  R.forEach(([n,v,c,a0],i)=>alphaDo(seg(u,a0,a0+.06),()=>{const y=270+i*150,k=ease(seg(u,a0,a0+.18));
    wt(84,y,n,20,'#fff',600);rrp(84,y+18,720,40,6);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fill();box(84,y+18,720*v/100*k,40,c);
    wt(84+720*v/100*k+10,y+50,Math.round(v*k)+' %',28,c,700,'left',COND);}));
  card(900,160,640,250,{bg:'rgba(7,27,39,.75)',st:'#ff9d7a'});wt(924,200,'2017 年的起點（七美）',20,'#ff9d7a',700);
  alphaDo(seg(u,.04,.12),()=>{wt(924,262,'6.4 %',56,'#ff9d7a',700,'left',COND);wt(1150,250,'綠電占全年用電',20,'#fff',600);wt(1150,280,'全島年用電約 780 萬度',17,'rgba(227,236,238,.85)',500);
    wt(924,356,'約 16 元',44,'#ff9d7a',700,'left',COND);wt(1150,344,'柴油每度發電成本',20,'#fff',600);wt(1150,374,'燃料與維修都靠船運',17,'rgba(227,236,238,.85)',500);});
  card(900,430,640,330,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});wt(924,470,'讓柴油機少開的三個工具',20,'#f2c230',700);
  [['儲能','把白天多的光電留到傍晚','#b37cff'],['風光互補','白天靠光電、夜間靠風','#7dffc4'],['需量反應','把可彈性的用電移到綠電多的時段','#7dc8dc']].forEach(([n,t,c],i)=>alphaDo(seg(u,.3+i*.12,.38+i*.12),()=>{const y=494+i*86;box(924,y,6,56,c);wt(946,y+24,n,22,c,700);wt(946,y+50,t,17,'rgba(227,236,238,.9)',500);}));
  alphaDo(seg(u,.88,.95),()=>tag(460,730,'規劃值，實際取決於天候與用電習慣',{size:16,bg:'#f2c230',align:'center'}));
 }}
]};
