// KITS: land
/* 電網系列 第 3 集：輸電網與變電所 */
const gyy=x=>groundY(x);
const qb=(a,c,b,t)=>(1-t)*(1-t)*a+2*(1-t)*t*c+t*t*b;
/* 輸電鐵塔：h 高度；回傳四個導線掛點 */
function pylon(x,h,col){
  const y=gyy(x),w0=h*.17,w1=h*.07;col=col||'#9aa6ad';
  ln([x-w0,y,x-w1,y-h*.55,x-3,y-h],col,2.4);ln([x+w0,y,x+w1,y-h*.55,x+3,y-h],col,2.4);
  ln([x-w0,y,x+w1,y-h*.55,x-w1,y-h*.55,x+w0,y],'rgba(154,166,173,.7)',1.2);
  ln([x-w1,y-h*.55,x+3,y-h,x-3,y-h,x+w1,y-h*.55],'rgba(154,166,173,.7)',1.2);
  const a1=y-h*.9,a2=y-h*.72,L1=h*.2,L2=h*.28;
  ln([x-L1,a1,x+L1,a1],col,3);ln([x-L2,a2,x+L2,a2],col,3);
  return [[x-L1,a1],[x+L1,a1],[x-L2,a2],[x+L2,a2]];
}
/* 兩座鐵塔之間的導線與電流點 */
function span(A,B,sag,flow,col){
  for(let k=0;k<4;k++){
    const [x0,y0]=A[k],[x1,y1]=B[k],cx=(x0+x1)/2,cy=(y0+y1)/2+sag*2;
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(cx,cy,x1,y1);ctx.strokeStyle='rgba(30,40,46,.85)';ctx.lineWidth=1.6;ctx.stroke();
    if(flow>0)for(let i=0;i<3;i++){const t=(TT*.35+i/3+k*.13)%1;alphaDo(flow,()=>circ(qb(x0,cx,x1,t),qb(y0,cy,y1,t),2.6,col||'#f2c230'));}
  }
}
function pole(x,h){const y=gyy(x);ln([x,y,x,y-h],'#6b5845',4);ln([x-16,y-h+6,x+16,y-h+6],'#6b5845',3);return [[x-16,y-h+6],[x+16,y-h+6],[x-8,y-h+18],[x+8,y-h+18]];}
/* 變壓器：s 縮放；on 時有流動微光 */
function xfmr(x,y,s,on){
  box(x-40*s,y-54*s,80*s,54*s,'#7a8a94','rgba(0,0,0,.35)',1.2);
  for(let i=0;i<6;i++){box(x-58*s,y-46*s+i*7*s,16*s,4*s,'#99a6ad');box(x+42*s,y-46*s+i*7*s,16*s,4*s,'#99a6ad');}
  for(let i=0;i<3;i++){const bx=x-24*s+i*24*s;ln([bx,y-54*s,bx,y-76*s],'#c9d1d6',5*s);circ(bx,y-78*s,4*s,'#c9d1d6');}
  if(on)alphaDo(.5+.4*Math.sin(TT*5),()=>box(x-34*s,y-28*s,68*s,5*s,'#7dffc4'));
  box(x-44*s,y-6*s,88*s,6*s,'#4d5a62');
}
/* 斷路器 / 隔離開關 / 避雷器 / 匯流排 */
function breaker(x,y,open){box(x-9,y-34,18,34,'#c9d1d6','rgba(0,0,0,.35)',1);box(x-12,y-44,24,10,'#e3e8ec','rgba(0,0,0,.3)',1);
  box(x-14,y-62,28,18,open?'#e8572a':'#5e6d76','rgba(0,0,0,.35)',1);ln([x,y-62,x,y-80],'#c9d1d6',3);}
function disc(x,y,open){ln([x,y,x,y-30],'#8d989f',5);circ(x,y-32,4,'#c9d1d6');ln([x,y-32,x+(open?18:0),y-(open?58:64)],'#e3e8ec',3);ln([x,y-64,x,y-70],'#8d989f',3);}
function arrester(x,y){for(let i=0;i<4;i++)box(x-7,y-12-i*13,14,10,'#b08a64','rgba(0,0,0,.3)',1);ln([x,y,x,y-6],'#6b5845',4);}
function busbar(x0,x1,y,col){ln([x0,y,x1,y],col||'#aeb8be',4);}
function sub(x,y,w,h){box(x,y-h,w,h,'#dfe5e8','rgba(0,0,0,.3)',1);for(let i=0;i<Math.floor((w-20)/36);i++)box(x+12+i*36,y-h+16,24,16,'#3d6f8e');box(x+w/2-14,y-34,28,34,'#5e6d76');}
function windT(x,y,h,rot){ln([x,y,x,y-h],'#eef2f4',5);for(let i=0;i<3;i++){const a=rot+i*TAU/3;ln([x,y-h,x+h*.55*Math.cos(a),y-h+h*.55*Math.sin(a)],'#eef2f4',3);}circ(x,y-h,4,'#c9d1d6');}
function houses(x0,n,lit){for(let i=0;i<n;i++){const x=x0+i*52,y=gyy(x),hh=44+(i%3)*10;box(x,y-hh,42,hh,i%2?'#e8dccb':'#dfe5e8','rgba(0,0,0,.25)',1);poly([x-4,y-hh,x+21,y-hh-18,x+46,y-hh],'#9b6b55');box(x+8,y-hh+14,10,10,lit?'#ffd98a':'#3d6f8e');box(x+24,y-hh+14,10,10,lit?'#ffd98a':'#3d6f8e');}}
function plant(x,y,on){box(x,y-86,150,86,'#c9d1d6','rgba(0,0,0,.3)',1);box(x+20,y-130,26,44,'#aeb8be','rgba(0,0,0,.3)',1);box(x+62,y-150,22,64,'#aeb8be','rgba(0,0,0,.3)',1);
  box(x+16,y-60,50,60,'#8d989f');for(let i=0;i<5;i++)box(x+84+i*12,y-60,8,36,'#5e6d76');
  if(on)for(let k=0;k<3;k++){const p=(TT*.25+k/3)%1;alphaDo((1-p)*.5,()=>circ(x+73+Math.sin(p*5+k)*6,y-152-p*70,8+p*14,'rgba(230,236,240,.6)'));}}
/* 示意用電壓階層 */
const TIERS=[['345 kV','超高壓變電所','#e8572a'],['161 kV','一次變電所','#f2c230'],['69 kV','二次變電所','#7dc8dc'],['11.4 kV','配電','#7dffc4'],['220／380 V','用戶','#dfe5e8']];

const EP={no:3,slug:'power-grid',seriesName:'電網系列',t:'輸電網與變電所',en:'Transmission grid and substations',
lede:'發電廠的電不能直接送到你家。它要先升到數十萬伏特，沿著輸電鐵塔跑上百公里，再經過一座座變電所一級一級降壓。這一集看台灣 345／161／69 kV 的電網階層、變電所裡的主要設備，以及再生能源越來越多時，電網為什麼需要加強。',
facts:[['345','kV','台灣輸電系統最高電壓，南北向有三路 345 kV 幹線串起北、中、南樞紐'],
['246','倍','相同輸送功率與導線下，電壓從 22 kV 提高到 345 kV，線路損耗約降為 1/246（理想示例）'],
['4','級','由 345、161、69 kV 到 11.4 kV 配電，電力逐級降壓送到用戶'],
['N-1','準則','輸電系統規劃原則：任一線路或設備故障時，仍須維持供電不中斷'],
['5,645','億元','台電強化電網韌性建設計畫的十年總經費，分為分散、強固、防衛三大主軸'],
['28','座','計畫預定新設的變電所數量（含大安、萬隆等），另有約 24 座改建為屋內化']],
note:'說明：本集為教育用途示意動畫，鐵塔、設備與地形比例經過調整。345／161／69 kV 電壓階層與 N-1 規劃原則依台電《輸電系統規劃準則》；強化電網韌性建設計畫（5,645 億元、28 座新設變電所、約 24 座屋內化）依台電與行政院 2022 年核定內容及新聞報導整理；損耗倍率為理想化計算，負載與設備數值皆為典型範例。',
base:()=>{landSky(GY,{sun:{x:1300,y:120},clouds:false});drawGround();},
shots:[
{t:'從電廠到你家',en:'From power plant to your home',dur:14,side:true,
 d:'發電廠的發電機輸出電壓只有約十幾到二十幾千伏特，必須先經升壓變壓器升到 345 kV，才能長距離輸送。高壓電沿著輸電鐵塔抵達超高壓變電所，在這裡降為 161 kV，再送往各地的一次變電所；之後降到 69 kV、11.4 kV，由電線桿配送到街區，最後在用戶端降為 220／380 V 或 110／220 V。每降一級，電流變大、輸送距離變短，電網就像一棵由粗幹到細枝的樹。',
 s:[[0,'發電廠先把電升到 345 kV'],[.3,'高壓電沿鐵塔送往遠方的負載中心'],[.55,'超高壓變電所把電壓降為 161 kV'],[.8,'再逐級降壓，由電線桿送進街區']],
 cam:u=>{const a=ease(seg(u,.28,.42)),b=ease(seg(u,.66,.84));return camMix(camMix({x:430,y:410,s:1.32},{x:1010,y:420,s:1.32},a),{x:800,y:440,s:1.02},b);},
 draw(u){
  const f=seg(u,.05,.15);
  plant(40,gyy(100),true);xfmr(262,gyy(262),.6,true);
  const T=[400,650,900].map(x=>pylon(x,215));
  ln([262,gyy(262)-60,262,gyy(262)-150,400+10,gyy(400)-215*.9],'rgba(30,40,46,.85)',1.6);
  span(T[0],T[1],26,f);span(T[1],T[2],26,f);
  /* 超高壓變電所 */
  const ex=1000,ey=gyy(1060);
  box(ex-20,ey-4,200,4,'#5e6d76');xfmr(ex+30,ey-4,.7,seg(u,.3,.5)>0);xfmr(ex+130,ey-4,.7,seg(u,.3,.5)>0);busbar(ex-6,ex+170,ey-110,'#aeb8be');
  ln([ex+30,ey-4-70,ex+30,ey-110],'#aeb8be',2);ln([ex+130,ey-4-70,ex+130,ey-110],'#aeb8be',2);
  ln([T[2][0][0],T[2][0][1],ex-6,ey-110],'rgba(30,40,46,.85)',1.6);
  const P=[1230,1370].map(x=>pylon(x,150,'#b3bec5'));
  ln([ex+170,ey-110,P[0][0][0],P[0][0][1]],'rgba(30,40,46,.85)',1.6);
  span(P[0],P[1],20,seg(u,.45,.6),'#7dc8dc');
  /* 街區 */
  const pl=pole(1470,100);ln([P[1][0][0],P[1][0][1],pl[0][0],pl[0][1]],'rgba(30,40,46,.85)',1.6);
  houses(1500,2,u>.82);
  alphaDo(seg(u,.7,.8),()=>{const t=(TT*.4)%1;circ(lerp(P[1][0][0],pl[0][0],t),lerp(P[1][0][1],pl[0][1],t),2.6,'#7dffc4');});
  lab(110,gyy(110)-140,'發電廠',{dx:-10,dy:-80,a:band(u,.02,.28)});
  lab(262,gyy(262)-80,'升壓至 345 kV',{dx:10,dy:-130,st:'w',a:band(u,.08,.3)});
  lab(650,gyy(650)-215,'345 kV 輸電鐵塔',{dx:0,dy:-70,st:'w',a:band(u,.3,.55)});
  lab(ex+80,ey-110,'超高壓變電所',{dx:0,dy:-100,st:'s',a:band(u,.5,.7)});
  lab(1300,gyy(1300)-150,'161 kV 輸電',{dx:0,dy:-80,st:'s',a:band(u,.58,.8)});
  lab(1470,gyy(1470)-100,'11.4 kV 配電',{dx:-30,dy:-90,st:'g',a:band(u,.8,1)});
 },
 hud(u){hudPanel(250,182,'電壓階層（示例）',seg(u,.04,.1),w=>{const k=u<.3?0:u<.55?1:u<.75?2:3;
  hrow(56,'位置',['發電廠','輸電鐵塔','變電所','配電'][k],w,'#fff');hrow(88,'電壓',['約 20 kV','345 kV','161 kV','11.4 kV'][k],w,['#ff9d7a','#ff9d7a','#f2c230','#7dffc4'][k]);
  hrow(120,'電流',k>1?'大':'小',w,k>1?'#ff9d7a':'#7dffc4');hrow(152,'距離',['—','上百公里','數十公里','數公里'][k],w,'#fff');});}},

{t:'為什麼要用高壓輸電',en:'Why transmit at high voltage',dur:13,
 d:'輸電線路的損耗等於電流平方乘以電阻，而輸送功率等於電壓乘以電流。要送同樣的功率，電壓提高十倍，電流就降為十分之一，損耗降為百分之一。若同一條導線送相同功率，22 kV 提高到 345 kV，電壓增為約 15.7 倍，電流降為 1/15.7，損耗約降為 1/246。這就是輸電網要把電升到數十萬伏特的原因：用較細的導線、較少的損失，把電送到更遠的地方。',
 s:[[0,'輸送同樣的功率，電壓越高，電流越小'],[.3,'損耗和電流的平方成正比'],[.6,'345 kV 的損耗只剩 22 kV 的 1/246'],[.82,'高壓讓電可以送得又遠又省']],
 draw(u){
  diagBG();
  card(60,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'同樣送 100 MW，導線裡的電流（示意）',20,'#f2c230',700);
  const W2=[['22 kV','電流大',1,'#ff8a60',.06],['345 kV','電流小',22/345,'#7dffc4',.2]];
  W2.forEach(([v,n,r,c,a0],i)=>alphaDo(seg(u,a0,a0+.06),()=>{const y=300+i*210;
   wt(84,y-26,v,30,c,700,'left',COND);wt(190,y-26,n,18,'rgba(227,236,238,.9)',600);
   rrp(84,y,680,46,23);ctx.fillStyle='rgba(255,255,255,.07)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1.5;ctx.stroke();
   const cnt=Math.round(22*(i?.22:1)),sp=(i?.35:.55);
   for(let k=0;k<cnt*1.6;k++){const t=((TT*sp+k/(cnt*1.6))%1);circ(100+t*648,y+23,i?4:6,c);}
   wt(764,y+84,i?'1 / 15.7':'1',22,c,700,'right',COND);}));
  alphaDo(seg(u,.24,.3),()=>wt(84,740,'電壓 ×15.7，電流 ÷15.7',20,'#fff',700));
  card(840,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(864,200,'線路損耗相對值（示例）',20,'#f2c230',700);
  const R=[['22 kV',100,'#ff8a60'],['69 kV',(22/69)**2*100,'#f2c230'],['161 kV',(22/161)**2*100,'#7dc8dc'],['345 kV',(22/345)**2*100,'#7dffc4']];
  R.forEach(([n,v,c],i)=>{const a0=.4+i*.07,k=ease(seg(u,a0,a0+.1));alphaDo(seg(u,a0,a0+.04),()=>{const y=270+i*92;wt(864,y+8,n,22,'#fff',700,'left',COND);
   box(990,y-16,Math.max(3,420*v/100*k),30,c);wt(1000+420*v/100*k,y+8,(v*k).toFixed(v<10?2:0)+' %',20,c,700,'left',COND);});});
  alphaDo(seg(u,.68,.74),()=>{card(864,650,652,120,{bg:'rgba(255,255,255,.05)',st:'#f2c230'});wt(884,694,'P = √3 · V · I　　損耗 = 3 · I² · R',22,'#f2c230',700);
   wt(884,740,'功率相同，V 越高 I 越小，損耗以平方下降',17,'rgba(227,236,238,.9)',500);});
  alphaDo(seg(u,.8,.86),()=>tag(1340,232,'約 1/246',{size:20,bg:'#7dffc4',align:'center'}));
 }},

{t:'台灣的電網階層',en:'Taiwan grid hierarchy',dur:14,
 d:'台灣的輸電系統以 345 kV 為骨幹，南北向有三路幹線，串起北部龍潭、中部中寮與南部龍崎等樞紐超高壓變電所。345 kV 降為 161 kV 後送到一次變電所，再降為 69 kV 進入二次變電所，最後以 11.4 kV 配電線送到街區。負載集中在北部與工業區，發電與再生能源則分布在中南部與沿海，所以輸電網必須能雙向、大量地調度電力。',
 s:[[0,'電力由 345 kV 骨幹逐級降壓往下送'],[.3,'三路南北幹線串起北、中、南樞紐'],[.55,'離岸風電與南部光電，要送往北部負載'],[.8,'輸電網要能大量、雙向調度電力']],
 draw(u){
  diagBG();
  card(60,160,760,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'電壓階層與變電所',20,'#f2c230',700);
  TIERS.forEach(([v,n,c],i)=>alphaDo(seg(u,.03+i*.06,.09+i*.06),()=>{const y=232+i*112;card(84,y,712,92,{bg:'rgba(255,255,255,.04)',st:c});box(84,y,6,92,c);
   wt(110,y+58,v,40,c,700,'left',COND);wt(330,y+40,n,22,'#fff',700);
   wt(330,y+72,['由發電廠與輸電幹線匯入','分送各地區','降壓後進入市區','送到街區的電線桿','家戶與小型商店'][i],17,'rgba(227,236,238,.85)',500);
   if(i<4)alphaDo(.8,()=>arrow(700,y+92,700,y+112,'rgba(255,255,255,.55)',2));}));
  card(860,160,680,640,{bg:'rgba(7,27,39,.75)'});wt(884,200,'345 kV 骨幹示意（非實際路線）',20,'#f2c230',700);
  const IS=[[1320,230],[1400,300],[1430,380],[1410,470],[1380,560],[1340,650],[1290,730],[1250,780],[1210,740],[1180,660],[1150,570],[1130,470],[1150,380],[1190,300],[1250,245]];
  ctx.beginPath();IS.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle='rgba(125,160,170,.18)';ctx.fill();ctx.strokeStyle='rgba(227,236,238,.45)';ctx.lineWidth=2;ctx.stroke();
  const H=[[1250,310,'北部　龍潭'],[1235,500,'中部　中寮'],[1250,690,'南部　龍崎']];
  const t1=seg(u,.28,.5);
  [-26,0,26].forEach((d,k)=>{const x0=H[0][0]+d*.2,x1=H[1][0]+d*.2,x2=H[2][0]+d*.2;
   alphaDo(t1,()=>{ctx.beginPath();ctx.moveTo(x0+d*.4,H[0][1]);ctx.lineTo(x1+d,H[1][1]);ctx.lineTo(x2+d*.4,H[2][1]);ctx.strokeStyle='#e8572a';ctx.lineWidth=3;ctx.stroke();
    for(let i=0;i<4;i++){const t=(TT*.2+i/4+k*.1)%1,y=lerp(H[0][1],H[2][1],t);circ(t<.5?lerp(x0+d*.4,x1+d,t*2):lerp(x1+d,x2+d*.4,(t-.5)*2),y,3,'#f2c230');}});});
  H.forEach(([x,y,n],i)=>alphaDo(seg(u,.22+i*.04,.3+i*.04),()=>{circ(x,y,13,'#f2c230','#0e2a3b',3);tag(x,y+(i?36:-34),n,{size:16,bg:'#0e2a3b',fg:'#fff',align:'center'});}));
  alphaDo(seg(u,.55,.64),()=>{circ(1100,430,10,'#7dc8dc');wt(1100,402,'離岸風電',17,'#7dc8dc',700,'center');arrow(1112,438,1210,486,'#7dc8dc',3);});
  alphaDo(seg(u,.62,.7),()=>{circ(1120,720,10,'#7dffc4');wt(1118,750,'南部光電',17,'#7dffc4',700,'center');arrow(1130,712,1212,520,'#7dffc4',3);});
  alphaDo(seg(u,.72,.8),()=>{arrow(1372,580,1372,340,'#ff9d7a',4);wt(1360,470,'北送',20,'#ff9d7a',700,'right');tag(1330,780,'負載集中在北部',{size:17,bg:'#ff9d7a',align:'center'});});
 }},

{t:'變電所裡有什麼',en:'Inside a substation',dur:14,side:true,
 d:'變電所是電網的交通樞紐。高壓線路進站後，先經避雷器保護設備不受雷擊與突波傷害，再經隔離開關與斷路器進入主變壓器降壓。隔離開關用來在無電流時分隔檢修，斷路器則能在故障電流下切斷線路。降壓後的電力匯集到匯流排，再由多條饋線送出。保護電驛隨時量測電流與電壓，一旦發現短路，就在幾個週波內命令斷路器跳脫，把故障範圍縮到最小。',
 s:[[0,'高壓線進站，先經過避雷器保護'],[.28,'隔離開關與斷路器控制電力進出'],[.52,'主變壓器把電壓降低，電流變大'],[.76,'發生短路時，斷路器迅速跳脫隔離故障']],
 cam:u=>camMix({x:520,y:500,s:1.7},{x:1020,y:500,s:1.7},ease(seg(u,.45,.65))),
 draw(u){
  const gy=gyy(700),trip=seg(u,.78,.84)>0.5;
  box(60,gy-4,1400,6,'#5e6d76');
  /* 進線鐵塔 */
  const Tp=pylon(110,200);ln([Tp[0][0],Tp[0][1],260,gy-120],'rgba(30,40,46,.85)',1.6);
  const f=seg(u,.05,.15)*(trip?0:1);
  alphaDo(f,()=>{for(let i=0;i<4;i++){const t=(TT*.4+i/4)%1;circ(lerp(Tp[0][0],260,t),lerp(Tp[0][1],gy-120,t),3,'#f2c230');}});
  busbar(260,330,gy-120);arrester(290,gy-120);ln([290,gy-120,290,gy-110],'#aeb8be',2);
  ln([260,gy-120,520,gy-120],'rgba(30,40,46,.85)',1.8);
  disc(400,gy,false);ln([400,gy-64,400,gy-120],'#aeb8be',2);
  breaker(520,gy,trip);ln([520,gy-80,520,gy-120],'#aeb8be',2);
  ln([520,gy-120,700,gy-120],'rgba(30,40,46,.85)',1.8);ln([700,gy-120,700,gy-76],'#aeb8be',2);
  xfmr(700,gy,1.15,!trip);
  ln([770,gy-90,850,gy-110],'rgba(30,40,46,.85)',1.6);
  breaker(880,gy,trip);ln([880,gy-80,880,gy-120],'#aeb8be',2);
  busbar(840,1420,gy-120,'#c9d1d6');
  [1000,1160,1320].forEach((x,i)=>{ln([x,gy-120,x,gy-70],'#aeb8be',2);disc(x,gy,false);ln([x,gy-64,x,gy-70],'#aeb8be',2);ln([x,gy-120,x,gy-132],'#aeb8be',2);});
  ln([1420,gy-120,1500,gy-100],'rgba(30,40,46,.85)',1.6);
  alphaDo(seg(u,.5,.6)*(trip?0:1),()=>{for(let i=0;i<6;i++){const t=(TT*.5+i/6)%1;circ(840+t*580,gy-120,3,'#7dffc4');}});
  sub(1060,gy-4,180,110);
  /* 故障 */
  if(u>.76){const a=seg(u,.76,.8)*(1-seg(u,.9,1)*.6);alphaDo(a,()=>{ln([420,gy-120,435,gy-150,425,gy-150,445,gy-190],'#f2c230',3);circ(440,gy-150,24+8*Math.sin(TT*20),'rgba(232,87,42,.4)');});}
  lab(290,gy-150,'避雷器',{dx:-20,dy:-90,a:band(u,.02,.3)});
  lab(400,gy-70,'隔離開關',{dx:0,dy:-110,st:'s',a:band(u,.24,.5)});
  lab(520,gy-80,'斷路器',{dx:10,dy:-150,st:'s',a:band(u,.28,.52)});
  lab(700,gy-100,'主變壓器',{dx:0,dy:-160,st:'g',a:band(u,.5,.75)});
  lab(1100,gy-120,'匯流排與饋線',{dx:0,dy:-110,a:band(u,.58,.8)});
  lab(430,gy-170,'短路故障',{dx:-80,dy:-60,st:'w',a:band(u,.76,.95)});
  lab(520,gy-30,'跳脫',{dx:60,dy:70,st:'w',a:band(u,.82,1)});
 },
 hud(u){hudPanel(250,150,'保護動作（示例）',seg(u,.05,.1),w=>{const t=u>.78;
  hrow(56,'狀態',t?'故障跳脫':'正常運轉',w,t?'#ff9d7a':'#7dffc4');hrow(88,'故障電流',t?'數萬安培':'負載電流',w,t?'#ff9d7a':'#fff');hrow(120,'切除時間',t?'數個週波':'—',w,t?'#7dffc4':'#fff');});}},

{t:'N-1：一條線壞了還能供電',en:'N-1: staying on when one line fails',dur:14,
 d:'輸電網規劃有一條重要原則稱為 N-1：任何一條線路或一部變壓器因故障退出時，其餘設備仍要能把電送到用戶，且不超過容量。做法是讓重要負載有兩條以上的路徑，並限制平時的負載率。若兩條線路平時各載 45%，其中一條跳脫後另一條載 90%，仍在容量內；但若平時就各載 70%，跳脫後剩下一條要載 140%，會過載跳脫，造成連鎖停電。這也是再生能源增加時，電網需要預留餘裕的原因。',
 s:[[0,'重要負載由兩條線路同時供電'],[.28,'其中一條跳脫，電流轉移到另一條'],[.55,'平時負載率夠低，轉移後仍在容量內'],[.8,'負載率太高，轉移後就會過載連鎖跳脫']],
 draw(u){
  diagBG();
  const trip=ease(seg(u,.26,.34));
  const CASE=[['符合 N-1：平時各載 45%',45,'#7dffc4',160,.0],['不符合：平時各載 70%',70,'#ff9d7a',480,.52]];
  CASE.forEach(([name,ld,c,y0,off],ci)=>{
   card(60,y0,1480,300,{bg:'rgba(7,27,39,.75)'});wt(84,y0+40,name,20,c,700);
   const t=ease(seg(u,.26+off*.2,.34+off*.2)),after=Math.min(ld*2,200),cur=lerp(ld,after,t);
   const SX=140,LX=620;
   circ(SX,y0+160,26,'#f2c230');wt(SX,y0+168,'電源',16,'#0e2a3b',800,'center');
   box(LX,y0+134,90,52,'#dfe5e8');wt(LX+45,y0+168,'負載',18,'#0e2a3b',700,'center');
   [-1,1].forEach((d,k)=>{const yy=y0+160+d*54,out=k===0&&t>.5;
    ctx.beginPath();ctx.moveTo(SX+26,y0+160);ctx.lineTo(SX+110,yy);ctx.lineTo(LX-70,yy);ctx.lineTo(LX,y0+160);ctx.strokeStyle=out?'rgba(232,87,42,.5)':'rgba(227,236,238,.7)';ctx.lineWidth=4;if(out)ctx.setLineDash([8,8]);ctx.stroke();ctx.setLineDash([]);
    if(!out){for(let i=0;i<5;i++){const tt=(TT*.4+i/5)%1;circ(lerp(SX+110,LX-70,tt),yy,3.5,cur>100?'#ff9d7a':'#f2c230');}}
    else wt((SX+LX)/2+20,yy+(d<0?-14:-14)+28,'跳脫',18,'#ff9d7a',700,'center');});
   /* 負載率條 */
   wt(780,y0+78,'剩餘線路的負載率',18,'rgba(227,236,238,.9)',600);
   rrp(780,y0+96,520,36,6);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fill();
   const w=520*Math.min(cur,200)/200;box(780,y0+96,w,36,cur>100?'#e8572a':c);
   ln([780+260,y0+90,780+260,y0+140],'#fff',2);wt(780+260,y0+158,'容量 100%',15,'#fff',700,'center');
   wt(780+Math.max(w,60)+10,y0+122,Math.round(cur)+' %',26,cur>100?'#ff9d7a':c,700,'left',COND);
   alphaDo(seg(u,.5+off*.5,.58+off*.5),()=>tag(1420,y0+240,cur>100?'過載，連鎖跳脫':'仍在容量內，供電不中斷',{size:17,bg:cur>100?'#e8572a':'#7dffc4',align:'right'}));
  });
  alphaDo(seg(u,.84,.9),()=>tag(800,832,'所以平時就要預留餘裕，這也是加強電網的原因',{size:18,bg:'#f2c230',align:'center'}));
 }},

{t:'為再生能源加強電網',en:'Strengthening the grid for renewables',dur:14,side:true,
 d:'離岸風電、光電等再生能源越來越多，電力來源變得分散，輸電網要在更多地點接入、也要承受更大的潮流變化。台電的強化電網韌性建設計畫，以十年、約 5,645 億元分為三大主軸：分散，讓發電與用電更靠近、減少南北長距離輸送；強固，補強線路與變電所，並把變電所改為屋內化與地下電纜；防衛，強化系統保護與復電能力。計畫預定新設 28 座變電所，並將約 24 座改建為屋內化。',
 s:[[0,'風機與光電廠接入新的變電所'],[.3,'屋內型變電所佔地小、不怕鹽霧與颱風'],[.55,'地下電纜把電送進市區，景觀更好'],[.8,'分散、強固、防衛，讓電網更有韌性']],
 base:u=>{landSky(GY,{sun:{x:1250,y:130},clouds:false});drawGround();},
 cam:u=>camMix({x:700,y:430,s:1.15},{x:900,y:440,s:1.1},ease(seg(u,.3,.7))),
 draw(u){
  const gy=x=>gyy(x);
  [90,200,310].forEach((x,i)=>windT(x,gy(x),150+(i%2)*20,TT*.9+i));
  for(let i=0;i<4;i++)solarPanel(40+i*70,gy(40)+4,60,.5);
  const a=seg(u,.05,.15);
  alphaDo(a,()=>{ln([310,gy(310)-150,430,gy(430)-170,560,gy(560)-200],'rgba(30,40,46,.85)',1.6);});
  /* 屋內型變電所 GIS */
  const bx=560,by=gy(560);
  box(bx,by-190,260,190,'#cfd6da','rgba(0,0,0,.35)',1.5);box(bx-10,by-205,280,16,'#8d989f');
  for(let i=0;i<5;i++)box(bx+20+i*46,by-165,30,22,'#3d6f8e');box(bx+100,by-52,60,52,'#5e6d76');
  for(let i=0;i<3;i++){ln([bx+50+i*80,by-205,bx+50+i*80,by-240],'#c9d1d6',5);circ(bx+50+i*80,by-243,4,'#c9d1d6');}
  ln([bx+50,by-243,bx+50,by-200],'rgba(30,40,46,.85)',1.6);
  alphaDo(seg(u,.28,.38),()=>{for(let i=0;i<3;i++)box(bx+30+i*70,by-130,56,38,'rgba(125,255,196,.25)','#7dffc4',1.5);});
  /* 地下電纜 */
  const cy=by+46;
  alphaDo(seg(u,.5,.6),()=>{ctx.save();ctx.setLineDash([10,8]);ctx.lineDashOffset=-TT*30;ctx.strokeStyle='#f2c230';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx+130,by);ctx.lineTo(bx+130,cy);ctx.lineTo(1200,cy);ctx.lineTo(1200,gy(1200));ctx.stroke();ctx.restore();ctx.setLineDash([]);});
  /* 市區 */
  houses(1120,4,true);sub(1330,gy(1330),110,84);
  /* 分散：區域電源 */
  alphaDo(seg(u,.68,.78),()=>{tag(900,250,'分散',{size:20,bg:'#7dc8dc',align:'center'});tag(1050,250,'強固',{size:20,bg:'#f2c230',align:'center'});tag(1200,250,'防衛',{size:20,bg:'#7dffc4',align:'center'});});
  lab(200,gy(200)-160,'風機與光電',{dx:-10,dy:-80,st:'g',a:band(u,.02,.3)});
  lab(690,by-205,'屋內型變電所（GIS）',{dx:0,dy:-130,st:'s',a:band(u,.28,.55)});
  lab(900,cy,'地下電纜',{dx:0,dy:-120,st:'l',a:band(u,.5,.8)});
  lab(1240,gy(1240)-60,'市區用電',{dx:0,dy:-110,a:band(u,.6,1)});
 },
 hud(u){hudPanel(270,150,'強化電網韌性計畫',seg(u,.05,.1),w=>{
  hrow(56,'分散工程',trf('{n} 億',{n:(4379*ease(seg(u,.1,.5))).toFixed(0)}),w,'#7dc8dc');hrow(88,'強固工程',trf('{n} 億',{n:(1250*ease(seg(u,.2,.6))).toFixed(0)}),w,'#f2c230');hrow(120,'系統防衛',trf('{n} 億',{n:(16.9*ease(seg(u,.3,.7))).toFixed(1)}),w,'#7dffc4');});}}
]};
