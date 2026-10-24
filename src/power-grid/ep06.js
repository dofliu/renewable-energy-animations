// KITS: land
/* 電網系列 第 6 集：備轉容量率與供電燈號 */
/* 數字單位：萬瓩（10 MW）。日間範例：供電能力 4,351.5、負載 3,990，備轉 361.5 → 9.06% */
const SUP=4351.5,LOAD=3990;
const WK=n=>trf('{n} 萬瓩',{n:n});
const LT=i=>trf('{a}：{b}',{a:tr(LAMP[i][0]),b:tr(LAMP[i][1])});
const LAMP=[['綠燈','供電充裕','#7dffc4'],['黃燈','供電吃緊','#f2c230'],['橘燈','供電警戒','#ff8a60'],['紅燈','限電警戒','#e8572a'],['黑燈','限電準備','#2b3942']];
const lampOf=(rate,cap)=>cap!=null&&cap<=50?4:cap!=null&&cap<=90?3:rate>=10?0:rate>=6?1:2;
/* 一天的負載與供電能力（典型範例，非實測） */
const LOADK=[[0,3000],[4,2750],[7,3200],[10,3750],[12,3800],[14,3990],[16,3900],[18,3800],[19,3830],[21,3600],[24,3000]];
function loadH(h){for(let i=0;i<LOADK.length-1;i++){const a=LOADK[i],b=LOADK[i+1];if(h<=b[0])return lerp(a[1],b[1],(h-a[0])/(b[0]-a[0]));}return LOADK[LOADK.length-1][1];}
const pvH=h=>h<6||h>18?0:450*Math.pow(Math.sin(Math.PI*(h-6)/12),1.5);
const capH=h=>3980+pvH(h);
const rateH=h=>(capH(h)-loadH(h))/loadH(h)*100;
const hh=h=>String(Math.floor(h)).padStart(2,'0')+':'+String(Math.floor((h%1)*60)).padStart(2,'0');
/* 機組跳脫情境：備轉容量（萬瓩） */
function resv(u){
  const K=[[0,420],[.12,420],[.2,210],[.42,210],[.6,330],[.72,360],[.9,400],[1,400]];
  for(let i=0;i<K.length-1;i++){if(u<=K[i+1][0])return lerp(K[i][1],K[i+1][1],ease(seg(u,K[i][0],K[i+1][0])));}return 400;
}

function rotor(x,y,r,ang,col){
  circ(x,y,r,'#2a3a44','rgba(255,255,255,.5)',2.5);
  for(let i=0;i<6;i++){const a=ang+i*TAU/6;ln([x,y,x+r*.88*Math.cos(a),y+r*.88*Math.sin(a)],col,Math.max(3,r*.07));}
  circ(x,y,r*.16,'#e3e8ec');
}
function plantB(x,gy,on,trip){
  box(x,gy-120,230,120,'#c9d1d6','rgba(0,0,0,.3)',1.2);box(x+24,gy-190,28,70,'#aeb8be','rgba(0,0,0,.3)',1);box(x+74,gy-210,24,90,'#aeb8be','rgba(0,0,0,.3)',1);
  box(x+120,gy-90,90,90,trip?'#c8553d':'#5e6d76');
  if(on&&!trip)for(let k=0;k<3;k++){const p=(TT*.2+k/3)%1;alphaDo((1-p)*.5,()=>circ(x+86+Math.sin(p*5+k)*8,gy-212-p*80,9+p*16,'rgba(200,210,215,.7)'));}
  rotor(x+165,gy-45,28,trip?0:TT*(on?9:0),'#e3e8ec');
}
function pylonB(x,gy,h){ln([x-18,gy,x,gy-h,x+18,gy],'#8d989f',3);ln([x-14,gy-h*.7,x+14,gy-h*.7],'#8d989f',3);ln([x-22,gy-h,x+22,gy-h],'#8d989f',4);return [x,gy-h];}
function cityB(x0,gy,n,litFn){
  for(let i=0;i<n;i++){const x=x0+i*66,h=70+((i*37)%5)*26,lit=litFn(i);
    box(x,gy-h,52,h,lit?'#dfe5e8':'#6b7780','rgba(0,0,0,.3)',1);
    for(let r=0;r<Math.floor(h/26);r++)for(let c=0;c<2;c++)box(x+9+c*22,gy-h+10+r*24,12,12,lit?'#ffd98a':'#2b3942');}
}
function bessB(x,gy,on){
  for(let i=0;i<3;i++){box(x+i*58,gy-62,50,62,'#e3e8ec','rgba(0,0,0,.35)',1.2);box(x+i*58+6,gy-52,38,6,on?'#7dffc4':'#7a8790');box(x+i*58+6,gy-40,38,6,on?'#7dffc4':'#7a8790');}
}

const EP={no:6,slug:'power-grid',seriesName:'電網系列',t:'備轉容量率與供電燈號',en:'Operating reserve margin and the supply signal lights',
lede:'台電每天公布的供電燈號，背後是一個簡單的比例：發電能力比用電多出多少。這個比例叫備轉容量率，是替機組跳脫、用電暴增和再生能源波動預留的緩衝。這一集看它怎麼計算、五種燈號的門檻、為什麼太陽下山後的夜尖峰最吃緊，以及機組故障時調度如何用備用機組、儲能與需量反應把燈號拉回來。',
facts:[['≥10','%','備轉容量率達 10% 以上亮綠燈，代表供電充裕（媒體整理台電燈號）'],
['6–10','%','備轉容量率介於 6% 到 10% 亮黃燈，代表供電吃緊'],
['90 / 50','萬瓩','備轉容量降至 90 萬瓩以下亮紅燈（限電警戒），50 萬瓩以下為黑燈（限電準備）'],
['3,951.6','萬瓩','2022 年 8 月 22 日 14 時 1 分的尖峰負載；當日備轉容量率約 11.58%，綠燈（媒體報導）'],
['9.06','%','2025 年 9 月媒體報導的日間預估：供電能力 4,351.5 萬瓩、負載 3,990 萬瓩，黃燈'],
['≈4','%','同一次報導中，夜間備轉容量率約 4%，亮橘燈；太陽光電下午退出，夜尖峰最吃緊']],
note:'說明：本集為教育用途示意動畫，設備與電網比例經過調整。備轉容量率定義（淨尖峰供電能力減瞬時尖峰負載，再除以瞬時尖峰負載）與綠、黃、橘、紅、黑燈門檻（10%、6%、90 萬瓩、50 萬瓩）整理自媒體對台電燈號的報導，正式依據請以台電官網公告為準；綠燈有每日預估值與當日即時值之分，兩者可能不同。2022 年 8 月 22 日尖峰負載 3,951.6 萬瓩與備轉容量率約 11.58% 引自媒體報導；2025 年 9 月日間預估 4,351.5／3,990 萬瓩與夜間約 4% 引自媒體報導。一天的負載與供電能力曲線、太陽光電可靠出力、機組跳脫 210 萬瓩後的備轉變化，以及夜尖峰缺口 280 萬瓩的補法分配皆為典型範例，並非台灣電網實際調度紀錄。',
base:()=>{landSky(GY,{sun:{x:1300,y:120},clouds:false});drawGround();},
shots:[
{t:'電夠不夠用？',en:'Is there enough power?',dur:13,side:true,
 d:'電力無法大量儲存，發電量必須隨時追著用電量走，所以調度中心看的不只是「現在發多少」，更重要的是「還能多發多少」。把全系統所有運轉中機組在尖峰時能供應的電力加總，就是供電能力；它比當下的用電負載多出來的那一段，就是備轉容量。備轉容量像是水桶上緣到水面的距離：留得夠，機組故障或天氣突變時還有餘裕；留得太少，任何一點意外都可能讓供電失衡。台電每天用備轉容量率，把這段距離變成一眼看得懂的燈號。',
 s:[[0,'發電廠把電送上輸電線，輸往城市'],[.3,'傍晚城市用電增加，負載一路上升'],[.58,'供電能力扣掉負載，剩下的就是備轉容量'],[.82,'備轉容量越多，電網越有餘裕']],
 draw(u){
  const gy=GY;
  plantB(70,gy,true,false);plantB(330,gy,true,false);
  const ps=[640,820,1000].map(x=>pylonB(x,gy,140));
  ln([560,gy-120,...ps.flat()],'rgba(30,40,46,.85)',1.8);
  ln([300,gy-120,560,gy-120],'rgba(30,40,46,.85)',1.8);
  alphaDo(seg(u,.04,.12),()=>{const P=[[560,gy-120],...ps];for(let i=0;i<5;i++){const t=(TT*.28+i/5)%1,k=t*(P.length-1),j=Math.min(P.length-2,Math.floor(k));circ(lerp(P[j][0],P[j+1][0],k-j),lerp(P[j][1],P[j+1][1],k-j),3.4,'#f2c230');}});
  const n=3+Math.round(seg(u,.2,.6)*4);
  cityB(1090,gy,7,i=>i<n);
  lab(190,gy-190,'運轉中的機組',{dx:-30,dy:-100,st:'s',a:band(u,.02,.45)});
  lab(820,gy-140,'輸電線路',{dx:0,dy:-100,st:'n',a:band(u,.04,.4)});
  lab(1150,gy-150,'用電負載增加',{dx:-90,dy:-30,st:'w',a:band(u,.24,.62)});
  lab(450,gy-60,'備轉容量',{dx:0,dy:80,st:'g',a:band(u,.58,.92)});
 },
 hud(u){
  const ld=lerp(3640,LOAD,ease(seg(u,.2,.6)));
  hudPanel(280,184,'供電與負載（示例）',seg(u,.05,.1),w=>{hrow(56,'供電能力',WK(SUP.toLocaleString('en-US')),w,'#7dffc4');hrow(88,'用電負載',WK(Math.round(ld).toLocaleString('en-US')),w,'#f2c230');hrow(120,'備轉容量',WK(Math.round(SUP-ld)),w,'#fff');hrow(152,'備轉容量率',((SUP-ld)/ld*100).toFixed(1)+'%',w,'#7dffc4');});}},

{t:'備轉容量率怎麼算',en:'How the reserve margin is calculated',dur:14,
 d:'備轉容量率的算法很直接：用系統運轉的淨尖峰供電能力，減去瞬時尖峰負載，得到備轉容量；再除以瞬時尖峰負載，換成百分比。以 2025 年 9 月媒體報導的日間預估為例，供電能力 4,351.5 萬瓩、負載 3,990 萬瓩，備轉容量 361.5 萬瓩，備轉容量率約 9.06%。留備轉不是浪費：一部大型機組跳脫就可能一次少掉兩百多萬瓩，負載預測也有誤差，太陽光電與風電的出力還會隨天氣起伏，這些都要靠這一段緩衝來吸收。',
 s:[[0,'左邊是各機組加總後的供電能力'],[.3,'右邊是同一時刻的尖峰負載'],[.58,'兩者的差，就是備轉容量'],[.82,'再除以負載，得到備轉容量率']],
 draw(u){
  diagBG();
  const base=760,sc=520/4500,k1=ease(seg(u,.04,.22)),k2=ease(seg(u,.2,.38));
  card(60,150,700,650,{bg:'rgba(7,27,39,.75)'});wt(84,190,'日間預估範例（萬瓩）',20,'#f2c230',700);
  ln([100,base,720,base],'rgba(255,255,255,.4)',1.6);
  const sh=SUP*sc*k1,lh=LOAD*sc*k2;
  box(150,base-sh,200,sh,'rgba(125,255,196,.85)');box(450,base-lh,200,lh,'rgba(242,194,48,.85)');
  wt(250,base+30,'供電能力',20,'#fff',600,'center');wt(550,base+30,'用電負載',20,'#fff',600,'center');
  alphaDo(seg(u,.2,.3),()=>wt(250,base-sh-14,SUP.toLocaleString('en-US'),30,'#7dffc4',700,'center',COND));
  alphaDo(seg(u,.38,.46),()=>wt(550,base-lh+44,LOAD.toLocaleString('en-US'),30,'#13232e',800,'center',COND));
  const gk=ease(seg(u,.5,.64)),gh=(SUP-LOAD)*sc*gk;
  if(gh>1){box(450,base-lh-gh,200,gh,'rgba(232,87,42,.9)');ctx.setLineDash([6,6]);ln([350,base-sh,650,base-sh],'rgba(125,255,196,.6)',1.4);ctx.setLineDash([]);}
  alphaDo(seg(u,.56,.66),()=>{tag(550,base-lh-gh-40,'備轉 361.5',{size:18,bg:'#e8572a',align:'center'});});
  const cx=800;
  card(cx,150,740,330,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});wt(cx+24,192,'備轉容量率',22,'#f2c230',700);
  wt(cx+24,252,'（供電能力 − 負載）÷ 負載',26,'#fff',700,'left');
  alphaDo(seg(u,.7,.8),()=>{wt(cx+24,322,'(4,351.5 − 3,990) ÷ 3,990',26,'rgba(227,236,238,.92)',600,'left',COND);});
  alphaDo(seg(u,.8,.9),()=>{wt(cx+24,414,'≈ 9.06%',60,'#f2c230',800,'left',COND);wt(cx+300,410,'黃燈：供電吃緊',24,'#f2c230',700,'left');});
  card(cx,500,740,300,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(cx+24,542,'為什麼要留備轉',22,'#7dc8dc',700);
  alphaDo(seg(u,.3,.4),()=>{['大型機組突然跳脫，一次少掉兩百多萬瓩','用電負載預測會有誤差','太陽光電與風電隨天氣起伏'].forEach((t,i)=>{circ(cx+34,596+i*54,3.5,'#7dc8dc');wt(cx+52,602+i*54,t,20,'rgba(227,236,238,.92)',500);});});
 }},

{t:'五種燈號：綠、黃、橘、紅、黑',en:'Five lights: green, yellow, orange, red, black',dur:14,
 d:'台電把備轉容量分成五種燈號。備轉容量率達 10% 以上是綠燈，供電充裕；落在 6% 到 10% 是黃燈，供電吃緊；低於 6% 是橘燈，供電警戒，限電機率增加。再往下，改以備轉容量的絕對值判斷：降到 90 萬瓩以下是紅燈，屬於限電警戒；降到 50 萬瓩以下是黑燈，進入限電準備。燈號有每日預估值與當日即時值之分，兩者可能不同，所以看燈號要看是哪一個時間點的數字。以上門檻整理自媒體報導，正式依據請看台電官網。',
 s:[[0,'備轉容量率 10% 以上：綠燈，供電充裕'],[.3,'掉到 6% 到 10%：黃燈，供電吃緊'],[.55,'低於 6%：橘燈，限電機率增加'],[.82,'再往下改看萬瓩：90 萬瓩紅燈，50 萬瓩黑燈']],
 draw(u){
  diagBG();
  const phaseB=u>.62;
  const rate=u<.6?lerp(12.5,4.5,ease(seg(u,.08,.55))):4;
  const cap=phaseB?lerp(130,40,ease(seg(u,.66,.92))):null;
  const idx=lampOf(rate,cap);
  const rows=[['≥ 10%','備轉容量率'],['6% – 10%','備轉容量率'],['< 6%','備轉容量率'],['≤ 90 萬瓩','備轉容量'],['≤ 50 萬瓩','備轉容量']];
  LAMP.forEach((L,i)=>{
    const y=170+i*124,on=i===idx;
    card(60,y,840,112,{bg:on?'rgba(255,255,255,.1)':'rgba(7,27,39,.75)',st:on?L[2]:'rgba(255,255,255,.15)'});
    circ(130,y+56,34,L[2],on?'#fff':'rgba(255,255,255,.3)',on?4:2);
    wt(210,y+50,L[0],30,on?'#fff':'rgba(227,236,238,.7)',700);
    wt(210,y+88,rows[i][1],18,'rgba(227,236,238,.75)',500);
    wt(500,y+66,rows[i][0],34,on?L[2]==='#2b3942'?'#fff':L[2]:'rgba(227,236,238,.7)',700,'left',COND);
    wt(880,y+66,L[1],24,on?'#fff':'rgba(227,236,238,.7)',700,'right');
  });
  const cx=940;
  card(cx,170,600,360,{bg:'rgba(7,27,39,.75)',st:LAMP[idx][2]});
  wt(cx+24,212,phaseB?'備轉容量':'備轉容量率',22,'#f2c230',700);
  wt(cx+24,330,phaseB?WK(Math.round(cap)):rate.toFixed(1)+'%',92,LAMP[idx][2]==='#2b3942'?'#fff':LAMP[idx][2],800,'left',COND);
  circ(cx+500,300,52,LAMP[idx][2],'#fff',4);
  wt(cx+24,420,LT(idx),30,'#fff',700,'left');
  const bw=552;rrp(cx+24,462,bw,22,5);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fill();
  const q=phaseB?clamp(cap/130,0,1)*.2:.2+clamp((rate-4)/9,0,1)*.8;box(cx+24,462,bw*q,22,LAMP[idx][2]==='#2b3942'?'#7a8790':LAMP[idx][2]);
  card(cx,550,600,250,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(cx+24,592,'看燈號的小提醒',22,'#7dc8dc',700);
  ['綠燈有「預估」與「即時」兩種數字','紅、黑燈改以備轉容量（萬瓩）判斷','門檻整理自媒體報導，以台電公告為準'].forEach((t,i)=>{circ(cx+34,640+i*52,3.5,'#7dc8dc');wt(cx+52,646+i*52,t,19,'rgba(227,236,238,.92)',500);});
 }},

{t:'太陽下山後的夜尖峰',en:'The evening peak after sunset',dur:14,
 d:'一天之中最吃緊的時刻，常常不是用電最高的中午，而是太陽下山之後的夜尖峰。中午太陽光電大量出力，供電能力墊高，備轉容量充裕；下午四點之後光電逐漸退出，供電能力掉回其他機組自己的水準，但冷氣、照明與家庭用電仍然很高，備轉容量率就一路被壓低。以示例曲線來看，晚上七點前後約降到 4%，落在橘燈。2022 年 8 月 22 日尖峰負載曾達 3,951.6 萬瓩，那天備轉容量率約 11.58%；夜尖峰要靠儲能、抽蓄與備用機組補位。',
 s:[[0,'清晨負載低，備轉容量率很高'],[.3,'中午光電出力墊高供電能力'],[.58,'下午光電退出，供電能力掉下來'],[.84,'晚上七點前後，備轉容量率降到最低']],
 draw(u){
  diagBG();
  const C=chartBox(60,150,960,650,{title:'一天的負載與供電能力（典型範例，單位：萬瓩）',x0:0,x1:24,y0:2500,y1:4600,xt:[0,4,8,12,16,20,24],yt:[2500,3000,3500,4000,4500],xl:'時',pl:84,pt:60,pb:56,gx:6,gy:4});
  const th=24*ease(seg(u,.06,.9));
  for(let h=0;h<th;h+=.25){const h2=Math.min(th,h+.25),r=rateH(h),c=LAMP[lampOf(r)][2];
    ctx.beginPath();ctx.moveTo(C.X(h),C.Y(loadH(h)));ctx.lineTo(C.X(h2),C.Y(loadH(h2)));ctx.lineTo(C.X(h2),C.Y(capH(h2)));ctx.lineTo(C.X(h),C.Y(capH(h)));ctx.closePath();ctx.fillStyle=c;ctx.globalAlpha=.32;ctx.fill();ctx.globalAlpha=1;}
  const dr=(f,col)=>{ctx.beginPath();for(let h=0;h<=th;h+=.25)ctx.lineTo(C.X(h),C.Y(f(h)));if(th>0){ctx.strokeStyle=col;ctx.lineWidth=3.4;ctx.stroke();}};
  dr(capH,'#7dffc4');dr(loadH,'#f2c230');
  const hc=Math.min(23.9,th);ln([C.X(hc),C.py,C.X(hc),C.py+C.ph],'rgba(255,255,255,.4)',1.4);
  wt(C.px+16,C.py+34,'供電能力',17,'#7dffc4',700);wt(C.px+16,C.py+60,'用電負載',17,'#f2c230',700);
  alphaDo(seg(u,.3,.4)*(1-seg(u,.5,.58)),()=>tag(C.X(12),C.Y(4380),'光電出力墊高供電能力',{size:16,bg:'#7dffc4',align:'center'}));
  alphaDo(seg(u,.82,.9),()=>tag(C.X(19),C.Y(3550),'夜尖峰：最吃緊',{size:17,bg:'#ff8a60',align:'center'}));
  const cx=1060,li=lampOf(rateH(hc));
  card(cx,150,480,300,{bg:'rgba(7,27,39,.75)',st:LAMP[li][2]});
  wt(cx+24,192,'此刻（示例）',22,'#f2c230',700);wt(cx+456,192,hh(hc),30,'#fff',700,'right',COND);
  hrowW(cx+24,236,'用電負載',WK(Math.round(loadH(hc)).toLocaleString('en-US')),432,'#f2c230');
  hrowW(cx+24,276,'供電能力',WK(Math.round(capH(hc)).toLocaleString('en-US')),432,'#7dffc4');
  wt(cx+24,356,'備轉容量率',20,'rgba(227,236,238,.9)',600);wt(cx+456,368,rateH(hc).toFixed(1)+'%',48,LAMP[li][2],800,'right',COND);
  wt(cx+24,420,LT(li),22,'#fff',700);
  card(cx,470,480,330,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(cx+24,512,'為什麼夜尖峰吃緊',22,'#7dc8dc',700);
  ['下午起太陽光電逐漸退出','晚上冷氣與家庭用電仍高','夜間改靠抽蓄、儲能與備用機組'].forEach((t,i)=>{circ(cx+34,566+i*58,3.5,'#7dc8dc');wt(cx+52,572+i*58,t,19,'rgba(227,236,238,.92)',500);});
  alphaDo(seg(u,.9,.97),()=>wt(cx+24,770,'2022-08-22 尖峰負載 3,951.6 萬瓩',17,'#f2c230',600));
 }},

{t:'機組跳脫：備轉怎麼補回來',en:'A unit trips: rebuilding the reserve',dur:14,side:true,
 d:'備轉容量不是固定的，機組一故障就會立刻被吃掉。假設日間備轉容量為 420 萬瓩，備轉容量率約 10.5%，亮綠燈；一部大型機組跳脫，一次少掉 210 萬瓩，備轉容量剩下 210 萬瓩，降到約 5%，轉成橘燈（示例）。調度中心的做法是依序補上：先啟動備用與緊備機組，再請電池儲能放電，同時透過需量反應讓部分大用戶降載。這些措施合計補回約 190 萬瓩，備轉容量率回到 10%，燈號重新轉綠。',
 s:[[0,'一部大型機組突然跳脫，備轉容量被吃掉'],[.3,'備轉容量率掉到 5%，燈號轉橘'],[.5,'啟動備用機組，備轉容量開始回升'],[.78,'儲能放電、用戶降載，燈號回到綠色']],
 draw(u){
  const gy=GY,trip=u>.12,sb=u>.42;
  plantB(40,gy,true,trip);plantB(290,gy,sb,false);
  const ps=[600,780].map(x=>pylonB(x,gy,140));
  ln([270,gy-120,520,gy-120],'rgba(30,40,46,.85)',1.8);ln([520,gy-120,...ps.flat()],'rgba(30,40,46,.85)',1.8);
  const bs=u>.64;bessB(860,gy,bs);ln([ps[1][0],ps[1][1],885,gy-62],'rgba(30,40,46,.85)',1.8);
  ln([ps[1][0],ps[1][1],1090,gy-120],'rgba(30,40,46,.85)',1.8);
  const dr=u>.7;
  cityB(1090,gy,7,i=>!(dr&&(i===1||i===4)&&false)&&true);
  alphaDo(dr?seg(u,.7,.78):0,()=>{[1,4].forEach(i=>box(1090+i*66,gy-70-((i*37)%5)*26,52,70+((i*37)%5)*26,'rgba(30,40,46,.35)'));});
  lab(130,gy-190,'機組跳脫',{dx:-20,dy:-100,st:'w',a:band(u,.12,.4)});
  lab(400,gy-210,'備用機組啟動',{dx:30,dy:-100,st:'s',a:band(u,.44,.82)});
  lab(930,gy-62,'儲能放電',{dx:0,dy:-110,st:'g',a:band(u,.66,.94)});
  lab(1150,gy-150,'需量反應降載',{dx:-90,dy:-30,st:'g',a:band(u,.72,.96)});
 },
 hud(u){
  const r=resv(u),rt=r/LOAD*100,li=lampOf(rt);
  hudPanel(280,184,'備轉容量（示例）',seg(u,.03,.08),w=>{hrow(56,'用電負載',WK(LOAD.toLocaleString('en-US')),w,'#fff');hrow(88,'備轉容量',WK(Math.round(r)),w,LAMP[li][2]);hrow(120,'備轉容量率',rt.toFixed(1)+'%',w,LAMP[li][2]);hrow(152,'燈號',LAMP[li][0],w,LAMP[li][2]);});}},

{t:'補上夜尖峰缺口的工具',en:'Tools that cover the evening-peak gap',dur:13,
 d:'要讓夜尖峰的燈號維持在安全區，不能只靠一種辦法，而是把許多工具疊在一起。以一個典型範例來看，夜尖峰需要補上 280 萬瓩的缺口：抽蓄水力白天抽水、夜間放水發電，能補約 100 萬瓩；電池儲能把中午多餘的光電存起來，傍晚放電，約 60 萬瓩；備用與緊備機組提早啟動待命，約 70 萬瓩；需量反應與時間電價把用電移出尖峰，約 50 萬瓩。每一種都有成本與限制，所以調度要事先規劃，而不是臨時才找。',
 s:[[0,'夜尖峰要補上約 280 萬瓩的缺口（示例）'],[.3,'抽蓄水力與電池儲能先補上一大塊'],[.58,'備用機組提早啟動待命'],[.82,'需量反應把用電移出尖峰，缺口補齊']],
 draw(u){
  diagBG();
  const base=760,sc=520/280;
  card(60,150,700,650,{bg:'rgba(7,27,39,.75)'});wt(84,190,'夜尖峰缺口 280 萬瓩的補法（示例）',20,'#f2c230',700);
  ln([100,base,720,base],'rgba(255,255,255,.4)',1.6);
  const S=[['抽蓄水力',100,'#58b8d0',.12],['電池儲能',60,'#7dffc4',.3],['備用與緊備機組',70,'#f2c230',.5],['需量反應與時間電價',50,'#b37cff',.7]];
  let acc=0;
  box(150,base-280*sc,200,280*sc,'rgba(255,255,255,.06)','rgba(232,87,42,.8)',2);
  S.forEach(([n,v,c,a0])=>{const k=ease(seg(u,a0,a0+.14)),h=v*sc*k,y=base-acc*sc-h;
    if(h>1){box(150,y,200,h,c);if(k>.9){wt(250,y+h/2+9,v+'',28,'#13232e',800,'center',COND);wt(380,y+h/2+8,n,19,'#fff',600);}}
    acc+=v*k;});
  alphaDo(1-seg(u,.12,.2),()=>wt(250,base-140*sc,'缺口',26,'#ff9d7a',700,'center'));
  alphaDo(seg(u,.88,.96),()=>tag(250,base-280*sc-30,'缺口補齊',{size:18,bg:'#7dffc4',align:'center'}));
  const cx=800;
  [['抽蓄水力','白天抽水、夜間放水發電，反應快','#58b8d0',.12],['電池儲能','把中午多餘的光電存起來，傍晚放電','#7dffc4',.3],['備用與緊備機組','夜尖峰前先啟動待命','#f2c230',.5],['需量反應與時間電價','鼓勵用戶把用電移出尖峰','#b37cff',.7]].forEach(([n,t,c,a0],i)=>alphaDo(seg(u,a0,a0+.08),()=>{
    const y=150+i*166;card(cx,y,740,150,{bg:'rgba(7,27,39,.75)',st:c});wt(cx+24,y+46,n,24,c,700);wt(cx+24,y+92,t,20,'rgba(227,236,238,.92)',500);}));
 }}
]};
function hrowW(x,y,label,val,w,col){wt(x,y,label,20,'rgba(227,236,238,.9)',600);wt(x+w,y+4,val,28,col,700,'right',COND);}
