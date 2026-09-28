// KITS: land
/* 儲能系列 第 3 集：從電池芯到儲能電廠（磷酸鋰鐵電池的化學、曲線、壽命與安全） */
const CW20=220,CH20=104;                                  // 20 呎貨櫃側視尺寸（世界座標）
const BX=[200,480,760];                                   // 三座電池貨櫃左緣（間距 60）
const PCSX=1040,TRX=1200,PYX=1440;                        // PCS 櫃、升壓變壓器、電塔
const gyy=x=>groundY(x);
const SUN={x:300,y:330};
/* 20 呎電池貨櫃：外殼、肋條、端部空調機組；open 0–1 表示側牆透明程度 */
function battContainer(x,y,open,inside){
  open=open||0;const w=CW20,h=CH20;
  box(x,y-h,w,h,'#1a2c38');
  if(open>0)alphaDo(open,()=>(inside||containerInside)(x,y));
  alphaDo(1-open*.85,()=>{box(x,y-h,w,h,'#e3e8ec');ctx.strokeStyle='rgba(0,0,0,.14)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<22;i++){const xx=x+w*i/22;ctx.moveTo(xx,y-h+4);ctx.lineTo(xx,y-4);}ctx.stroke();
   box(x+w-44,y-h+14,34,34,'#c5ced4','rgba(0,0,0,.25)',1);ring(x+w-27,y-h+31,12,'rgba(0,0,0,.35)',2);
   box(x+14,y-h+20,40,10,'#2d8f5a');});
  ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.5;ctx.strokeRect(x,y-h,w,h);
  box(x-4,y-h-4,w+8,5,'#aeb8be');box(x+6,y,18,6,'#6a747a');box(x+w-24,y,18,6,'#6a747a');
}
function containerInside(x,y){
  const h=CH20;box(x+2,y-h+2,CW20-4,h-4,'#13232e');
  for(let i=0;i<6;i++){const rx=x+10+i*28;box(rx,y-h+14,22,h-22,'#2a4a66','rgba(255,255,255,.3)',1);
   for(let m=0;m<4;m++)box(rx+3,y-h+18+m*19,16,15,'#3f6f96');}
  box(x+CW20-40,y-h+10,34,h-16,'#44535c','rgba(255,255,255,.3)',1);
}
function pcsSkid(x,y){box(x,y-90,110,90,'#dfe5e8','rgba(0,0,0,.3)',1);for(let i=0;i<3;i++)box(x+10+i*34,y-80,26,50,'#c9d1d6','rgba(0,0,0,.2)',1);
  for(let i=0;i<3;i++)ring(x+23+i*34,y-18,7,'rgba(0,0,0,.35)',2);}
function transformer(x,y){box(x,y-80,90,80,'#8d989f');for(let i=0;i<5;i++)box(x-10,y-72+i*14,10,8,'#6f7a80');for(let i=0;i<5;i++)box(x+90,y-72+i*14,10,8,'#6f7a80');
  for(let i=0;i<3;i++){box(x+18+i*24,y-110,8,30,'#c9a38c');for(let k=0;k<4;k++)box(x+14+i*24,y-106+k*7,16,3,'#b58b73');}}
function pylon(x,y){ctx.strokeStyle='#5c6770';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-34,y);ctx.lineTo(x-6,y-230);ctx.lineTo(x+6,y-230);ctx.lineTo(x+34,y);
  for(let k=0;k<6;k++){const t=k/6,t2=(k+1)/6;ctx.moveTo(lerp(x-34,x-6,t),lerp(y,y-230,t));ctx.lineTo(lerp(x+34,x+6,t2),lerp(y,y-230,t2));ctx.moveTo(lerp(x+34,x+6,t),lerp(y,y-230,t));ctx.lineTo(lerp(x-34,x-6,t2),lerp(y,y-230,t2));}
  ctx.moveTo(x-60,y-200);ctx.lineTo(x+60,y-200);ctx.moveTo(x-46,y-170);ctx.lineTo(x+46,y-170);ctx.stroke();}
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,dir,sp){if(a<=0)return;for(let k=0;k<n;k++){let f=((TT*(sp||.3))+k/n)%1;if(dir<0)f=1-f;const p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],4.5,col));}}
function sitePath(){const yb=gyy(PCSX)-40;return [[BX[0]+CW20/2,gyy(BX[0])-CH20-10],[BX[0]+CW20/2,gyy(BX[0])-CH20-22],[PCSX+55,gyy(PCSX)-CH20-22],[PCSX+55,yb-50],[TRX+45,yb-50],[TRX+45,gyy(TRX)-112],[PYX,gyy(PYX)-200]];}
/* 消防栓 */
function hydrant(x,y){box(x-7,y-30,14,30,'#c8432a');box(x-11,y-34,22,6,'#a8341f');box(x-13,y-22,26,6,'#a8341f');}
/* 整座案場；inside 用來替換中間貨櫃的內部畫法 */
function siteDraw(o){o=o||{};
  fence(150,1520,gyy(800)+4);
  BX.forEach((x,i)=>battContainer(x,gyy(x+CW20/2),i===1?(o.open||0):0,o.inside));
  pcsSkid(PCSX,gyy(PCSX));transformer(TRX,gyy(TRX));pylon(PYX,gyy(PYX));
  ln([PYX,gyy(PYX)-200,1700,gyy(PYX)-215],'#394650',2);
  ctx.setLineDash([8,6]);ln([BX[0]+CW20/2,gyy(BX[0])-CH20-22,PCSX+55,gyy(PCSX)-CH20-22],'rgba(40,50,58,.55)',2.5);ctx.setLineDash([]);
  for(const x of BX)ln([x+CW20/2,gyy(x)-CH20-4,x+CW20/2,gyy(x)-CH20-22],'rgba(40,50,58,.55)',2.5);
  ln([PCSX+55,gyy(PCSX)-CH20-22,PCSX+55,gyy(PCSX)-90],'rgba(40,50,58,.55)',2.5);
  ln([PCSX+110,gyy(PCSX)-60,TRX,gyy(TRX)-60],'rgba(40,50,58,.55)',2.5);
  ln([TRX+45,gyy(TRX)-110,PYX,gyy(PYX)-200],'#394650',2);
}
/* 稜柱形電池芯 */
function prism(x,y,w,h,col){box(x,y,w,h,col||'#3f6f96','rgba(255,255,255,.55)',1.5);box(x+w*.18,y-h*.06,w*.18,h*.06,'#c9d1d6');box(x+w*.64,y-h*.06,w*.18,h*.06,'#e8572a');}
/* 磷酸鋰鐵與三元鋰的開路電壓曲線（示意，s 為 SOC %） */
const lfpV=s=>3.22+.10*s/100-.72*Math.exp(-s/2.8)+.33*Math.exp((s-100)/2.2);
const nmcV=s=>3.0+.9*s/100+.3*Math.pow(s/100,3)-.3*Math.exp(-s/4);
/* 容量保持率（典型範例）：cyc 為千次 */
const capA=n=>100-20*Math.pow(n/8,.8), capB=n=>100-20*Math.pow(n/5,.8), capC=n=>100-20*Math.pow(n/3,.8);
/* 熱失控溫度歷程（示意，t 0–100） */
const trT=t=>t<40?25+95*Math.pow(t/40,1.5):t<70?120+110*Math.pow((t-40)/30,2):t<82?230+370*(1-Math.exp(-(t-70)/1.6)):600-120*(1-Math.exp(-(t-82)/10));
/* 電芯電量（SOC）：平衡前各不相同，平衡後趨於一致 */
const SOC0=[64,55,60,47,62,58];
const socAt=(i,b)=>lerp(SOC0[i],58,b);
function curveP(ch,fn,a,b,step,col,lw,dash){if(b<=a)return;ctx.beginPath();for(let t=a;t<=b+1e-9;t+=step){const x=ch.X(t),y=ch.Y(fn(t));t===a?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=lw;if(dash)ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}

const EP={no:3,slug:'energy-storage',seriesName:'儲能系列',t:'從電池芯到儲能電廠',en:'From battery cell to storage plant',
lede:'儲能電廠的核心，是成千上萬顆手掌大小的磷酸鋰鐵電池芯。這一集走進電芯內部，看鋰離子怎麼在正負極之間來回，讀懂充放電曲線與電量（SOC），了解電池為什麼會老化，以及熱失控如何發生、又如何層層防護。',
facts:[['3.2','V','磷酸鋰鐵（LFP）電芯標稱電壓；充電截止約 3.65 V、放電截止約 2.5 V'],
['314','Ah','目前儲能貨櫃常見的方形電芯容量，一顆約可存 1 度電'],
['≥ 6,000','次','儲能級 LFP 電芯常見的循環壽命，以容量衰減到 80% 計（典型範例）'],
['80–120','°C','電極表面 SEI 膜開始分解的溫度，是熱失控連鎖反應的第一步'],
['約 230','°C','LFP 電芯熱失控觸發溫度的典型值；三元鋰（NMC）約 160–210 °C（典型範例）']],
note:'說明：本集為教育用途示意動畫，電芯、設備與案場比例經過調整。電芯規格以市售儲能級 314 Ah 磷酸鋰鐵方形電芯規格書為典型範例（標稱 3.2 V、充電截止約 3.65 V、放電截止約 2.5 V、約 1 kWh）；充放電曲線為示意形狀。循環壽命曲線為典型範例，實際依溫度、充放電深度與倍率而異，各廠規格書常標示 6,000–8,000 次以上。熱失控各階段溫度（SEI 分解約 80–120 °C、隔離膜約 130 °C 起熔化）與 LFP、NMC 的自發熱及觸發溫度，取自公開文獻中絕熱量熱（ARC）試驗的典型範圍，因電芯尺寸與試驗方法而異。台灣戶外儲能案場依經濟部標準檢驗局「戶外電池儲能系統案場驗證技術規範」辦理，並參考 CNS 62933-5-2 與 UL 9540A。',
base:()=>{landSky(GY,{sun:SUN,clouds:false});drawGround();},
shots:[
{t:'一顆電芯，組成一座電廠',en:'Thousands of cells make a plant',dur:12,side:true,
 d:'儲能電廠看起來是一排排貨櫃，但真正存電的是裡面成千上萬顆電池芯。常見的磷酸鋰鐵電芯標稱 3.2 伏特、314 安培小時，約可存 1 度電。電芯串成模組、模組疊成電池簇、電池簇裝進貨櫃，一個 20 呎貨櫃約 5 MWh；幾座到幾十座貨櫃再經變流器與變壓器併網，就成為數十至數百 MWh 的儲能電廠（示例）。',
 s:[[0,'儲能電廠的核心，是一顆顆電池芯'],[.25,'電芯組成模組，模組疊成電池簇'],[.5,'電池簇裝進貨櫃，一座約 5 MWh'],[.75,'許多貨櫃併網，組成儲能電廠']],
 cam:u=>({x:820,y:450,s:1}),
 draw(u){
  siteDraw();
  const P=sitePath();flowDots(P,12,'#f2c230',seg(u,.78,.84),1,.35);
  const L=[['電池芯','3.2 V · 約 1 kWh'],['電池模組','約 104 kWh'],['電池簇','約 418 kWh'],['電池貨櫃','約 5 MWh'],['儲能電廠','數十至數百 MWh']];
  L.forEach(([n,v],i)=>{const t0=.03+i*.17,a=seg(u,t0,t0+.06);const x=470+i*214;
   alphaDo(.3+.7*a,()=>{card(x,170,190,92,{bg:'rgba(7,27,39,.82)',st:a>.5?'rgba(242,194,48,.7)':undefined});
    wt(x+95,206,n,19,a>.5?'#f2c230':'rgba(227,236,238,.7)',700,'center');wt(x+95,242,v,19,'#fff',700,'center',COND);});
   if(i<4)alphaDo(a,()=>arrow(x+192,216,x+210,216,'#f2c230',2.5));});
  lab(BX[1]+CW20/2,gyy(BX[1])-CH20,'電池貨櫃',{dx:0,dy:-60,st:'s',a:band(u,.55,.78)});
  lab(PCSX+55,gyy(PCSX)-90,'變流器（PCS）',{dx:-10,dy:-70,a:band(u,.72,1)});
  lab(PYX,gyy(PYX)-200,'併網',{dx:-50,dy:40,st:'l',a:band(u,.78,1)});
 }},

{t:'鋰鐵電池裡面',en:'Inside a lithium iron phosphate cell',dur:15,
 d:'一顆磷酸鋰鐵電芯由正極、負極、隔離膜與電解液組成。正極是塗在鋁箔上的磷酸鋰鐵（LiFePO₄），負極是塗在銅箔上的石墨。充電時，鋰離子從正極出發，穿過電解液與隔離膜，嵌進石墨層之間，電子則經外部電路流向負極；放電時方向相反。磷酸鋰鐵是橄欖石結構，磷與氧的鍵結牢固，高溫下不易釋放氧氣，這是它比三元鋰安全的主要原因。',
 s:[[0,'打開電芯：正極、隔離膜、負極與電解液'],[.22,'充電：鋰離子從正極游向石墨負極'],[.45,'電子走外部電路，隔離膜只讓離子通過'],[.62,'放電：鋰離子回到正極，電子推動負載'],[.82,'橄欖石結構牢固，高溫下不易釋氧']],
 draw(u){
  diagBG();
  card(60,160,940,640,{bg:'rgba(7,27,39,.75)'});
  const Y0=300,Y1=600,a0=seg(u,.02,.1);
  const chg=seg(u,.22,.5),dis=seg(u,.62,.9),p=clamp(ease(chg)-ease(dis));
  const charging=u<.58;
  alphaDo(a0,()=>{
   box(150,Y0,690,Y1-Y0,'rgba(88,184,208,.16)');                          // 電解液
   box(136,Y0-10,14,Y1-Y0+20,'#c9d1d6');box(840,Y0-10,14,Y1-Y0+20,'#c98a5a'); // 鋁箔、銅箔
   box(150,Y0,250,Y1-Y0,'rgba(63,111,150,.35)');
   for(let r=0;r<8;r++)for(let c=0;c<6;c++)circ(176+c*42+(r%2)*10,Y0+22+r*37,15,'#3f6f96','rgba(255,255,255,.25)',1);
   ctx.setLineDash([6,5]);ln([488,Y0,488,Y1],'rgba(242,242,242,.8)',4);ctx.setLineDash([]);
   box(580,Y0,260,Y1-Y0,'rgba(40,46,52,.6)');
   for(let r=0;r<9;r++)ln([594,Y0+18+r*33,828,Y0+18+r*33],'#8d989f',5);
   wt(275,Y1+44,'正極 LiFePO₄',19,'#fff',700,'center');wt(275,Y1+74,'鋁箔集電',16,'rgba(227,236,238,.8)',500,'center');
   wt(488,Y1+44,'隔離膜',19,'#fff',700,'center');wt(488,Y1+74,'電解液',16,'#7dc8dc',600,'center');
   wt(710,Y1+44,'負極 石墨',19,'#fff',700,'center');wt(710,Y1+74,'銅箔集電',16,'rgba(227,236,238,.8)',500,'center');
   /* 外部電路 */
   ln([143,Y0-10,143,220,380,220],'#c9d1d6',3);ln([600,220,847,220,847,Y0-10],'#c9d1d6',3);
   card(380,196,220,48,{bg:'rgba(242,194,48,.14)',st:'rgba(242,194,48,.6)'});
  });
  alphaDo(a0,()=>wt(490,228,charging?'充電器':'負載',18,'#f2c230',700,'center'));
  /* 鋰離子 */
  const R=rng(5);const ions=[];for(let i=0;i<16;i++)ions.push({yc:Y0+30+R()*(Y1-Y0-60),xc:180+R()*190,xa:606+R()*200,ya:Y0+34+Math.floor(R()*8)*33,d:R()});
  if(a0>0)ions.forEach(o=>{const k=clamp(p*1.6-o.d*.6);const mid=clamp(k*1.25-.05);
   const x=lerp(o.xc,o.xa,ease(mid)),y=lerp(o.yc,o.ya,ease(mid))+Math.sin(TT*3+o.d*9)*3*(k>0&&k<1?1:0);
   alphaDo(a0,()=>{circ(x,y,9,'#f2c230','#13232e',1.5);});});
  /* 電子 */
  const eA=charging?band(u,.24,.52):band(u,.64,.9);
  if(eA>0){const P=[[143,Y0-10],[143,220],[847,220],[847,Y0-10]];flowDots(charging?P:P.slice().reverse(),8,'#7dffc4',eA,1,.4);}
  alphaDo(band(u,.24,.52),()=>{arrow(420,Y1-22,560,Y1-22,'#f2c230',3);tag(488,280,'充電：Li⁺ → 負極',{size:16,align:'center'});});
  alphaDo(band(u,.64,.92),()=>{arrow(560,Y1-22,420,Y1-22,'#f2c230',3);tag(488,280,'放電：Li⁺ → 正極',{size:16,align:'center'});});
  alphaDo(seg(u,.3,.36),()=>{circ(104,742,9,'#f2c230','#13232e',1.5);wt(124,748,'鋰離子 Li⁺',17,'#fff',600);circ(344,742,5,'#7dffc4');wt(360,748,'電子 e⁻（外部電路）',17,'#fff',600);});
  /* 右：為什麼是磷酸鋰鐵 */
  card(1040,160,500,640,{bg:'rgba(7,27,39,.75)'});
  wt(1066,200,'為什麼是磷酸鋰鐵',20,'#f2c230',700);
  alphaDo(seg(u,.05,.12),()=>{card(1066,222,448,74,{bg:'rgba(242,194,48,.1)',st:'rgba(242,194,48,.45)'});wt(1290,268,'LiFePO₄ ↔ FePO₄ + Li⁺ + e⁻',24,'#fff',700,'center',COND);});
  const K=[['橄欖石結構','磷與氧鍵結牢固，高溫下不易釋氧','#7dffc4'],['不含鈷、鎳','原料較易取得，成本較低','#7dffc4'],['循環壽命長','可充放數千次以上','#7dffc4'],['能量密度較低','同樣電量比三元鋰重、體積大','#ff9d7a']];
  K.forEach(([h,s,c],i)=>alphaDo(seg(u,.66+.06*i,.72+.06*i),()=>{const y=322+i*116;card(1066,y,448,98,{bg:'rgba(255,255,255,.04)',st:'rgba(255,255,255,.14)'});
   box(1066,y,6,98,c);wt(1092,y+40,h,20,c,700);wt(1092,y+74,s,17,'rgba(227,236,238,.88)',500);}));
 }},

{t:'平坦的充放電曲線',en:'A remarkably flat voltage curve',dur:14,
 d:'把電芯從空充到滿，電壓不是直線上升。磷酸鋰鐵在電量約 10% 到 90% 之間，電壓幾乎停在 3.2 至 3.3 伏特，這段「平台區」讓輸出電壓穩定，也是標稱 3.2 伏特的由來。充電到約 3.65 伏特必須停止，放電到約 2.5 伏特也要停，超過都會損傷電芯。三元鋰的電壓會隨電量明顯變化；磷酸鋰鐵的平坦曲線則讓人很難只看電壓判斷剩多少電。',
 s:[[0,'從空電充到滿，電壓怎麼變化'],[.3,'10% 到 90% 之間，電壓幾乎不動'],[.52,'3.65 V 與 2.5 V 是不能越過的截止線'],[.72,'三元鋰斜斜上升，鋰鐵卻像平台']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,960,640,{title:'電芯電壓與電量（示意）',x0:0,x1:100,y0:2.3,y1:4.4,xt:[0,20,40,60,80,100],yt:[2.5,3,3.5,4],xl:'電量 SOC（%）',yl:'電壓（V）',pl:72,pt:70,pb:60,gx:5,gy:7});
  const f=100*seg(u,.03,.3);
  /* 平台區 */
  alphaDo(seg(u,.3,.37),()=>{box(c.X(10),c.Y(3.36),c.X(90)-c.X(10),c.Y(3.18)-c.Y(3.36),'rgba(242,194,48,.14)');wt(c.X(50),c.Y(3.36)-14,'平台區：電壓幾乎不變',18,'#f2c230',700,'center');});
  /* 截止線 */
  alphaDo(seg(u,.5,.56),()=>{ctx.setLineDash([8,6]);ln([c.px,c.Y(3.65),c.px+c.pw,c.Y(3.65)],'#e8572a',2);ln([c.px,c.Y(2.5),c.px+c.pw,c.Y(2.5)],'#e8572a',2);ctx.setLineDash([]);
   wt(c.px+12,c.Y(3.65)-10,'充電截止 3.65 V',17,'#ff9d7a',700);wt(c.px+c.pw-12,c.Y(2.5)-10,'放電截止 2.5 V',17,'#ff9d7a',700,'right');});
  /* 三元鋰對照 */
  const g=seg(u,.72,.9);
  if(g>0){curveP(c,nmcV,0,100*g,.5,'#b37cff',3,[9,6]);alphaDo(seg(u,.8,.86),()=>wt(c.X(70),c.Y(nmcV(70))-18,'三元鋰 NMC（對照）',17,'#b37cff',700,'right'));}
  curveP(c,lfpV,0,f,.25,'#f2c230',4);
  if(f>0){const s=f,v=lfpV(s);circ(c.X(s),c.Y(v),8,'#fff','#13232e',2);
   alphaDo(seg(u,.03,.08),()=>{const tx=Math.min(c.X(s)+14,c.px+c.pw-150),ty=c.Y(v)+(s>85?40:34);wt(tx,ty,v.toFixed(2)+' V',20,'#fff',700,'left',COND);wt(tx+86,ty,Math.round(s)+'%',20,'#7dffc4',700,'left',COND);});}
  alphaDo(seg(u,.2,.26),()=>wt(c.X(40),c.Y(3.02),'磷酸鋰鐵 LFP',18,'#f2c230',700,'center'));
  /* 右：三條關鍵電壓 */
  const V=[['3.65 V','充電截止','再充會使正極與電解液劣化','#ff9d7a',.5],['3.2 V','標稱電壓','平台區中段，計算容量的基準','#f2c230',.32],['2.5 V','放電截止','再放會損傷負極與銅箔','#ff9d7a',.54]];
  V.forEach(([v,n,s,col,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=160+i*140;card(1060,y,480,122,{bg:'rgba(7,27,39,.75)'});
   wt(1086,y+56,v,38,col,700,'left',COND);wt(1250,y+48,n,20,'#fff',700);wt(1250,y+86,s,16,'rgba(227,236,238,.85)',500);}));
  alphaDo(seg(u,.86,.92),()=>{card(1060,590,480,210,{bg:'rgba(125,255,196,.1)',st:'rgba(125,255,196,.5)'});wt(1086,634,'只看電壓，很難知道剩多少電',20,'#7dffc4',700);
   wt(1086,676,'平台區內差 10% 電量，',17,'#fff',500);wt(1086,706,'電壓只差約 0.01 V',17,'#fff',500);wt(1086,750,'→ 需要 BMS 用其他方法估算',17,'rgba(227,236,238,.88)',600);});
 }},

{t:'BMS 怎麼知道還剩多少電',en:'How the BMS estimates state of charge',dur:13,side:true,
 d:'電池管理系統（BMS）隨時量測每顆電芯的電壓、溫度與整串電流。因為鋰鐵曲線平坦，BMS 主要以「庫侖計數」估算電量（SOC）：把流進流出的電流逐秒累加，再利用靜置或接近充飽、放空時的電壓校正誤差。串聯的電芯只要有一顆先滿或先空，整串就得停下，所以 BMS 還要做電芯平衡，把電量偏高的電芯稍微放電，讓大家回到同一水準，可用容量才不會被最弱的一顆拖累。',
 s:[[0,'打開貨櫃，BMS 監測每一顆電芯'],[.25,'逐秒累加電流，估算電量（SOC）'],[.48,'各電芯電量不一，最弱的一顆會拖累整串'],[.7,'電芯平衡：電量拉回同一水準']],
 cam:u=>camMix({x:820,y:450,s:1},{x:BX[1]+CW20/2+40,y:gyy(BX[1]+CW20/2)-CH20/2-6,s:2.7},ease(seg(u,.02,.22))),
 draw(u){
  const op=ease(seg(u,.12,.26)),b=ease(seg(u,.62,.9));
  const inside=(x,y)=>{const h=CH20;box(x+2,y-h+2,CW20-4,h-4,'#13232e');
   for(let i=0;i<6;i++){const rx=x+10+i*28,top=y-h+14,hh=h-22,sc=socAt(i,b);box(rx,top,22,hh,'#1a3350','rgba(255,255,255,.35)',1);
    const fh=(hh-4)*sc/100,low=sc===Math.min(...SOC0.map((_,k)=>socAt(k,b)));
    box(rx+3,top+hh-2-fh,16,fh,low&&b<.6&&u>.45?'#ff9d7a':'#7dffc4');
    if(u>.44&&b<.95&&SOC0[i]>60)alphaDo(seg(u,.62,.68)*(1-b),()=>circ(rx+11,top+6,2.4,'#f2c230'));}
   box(x+CW20-40,y-h+10,34,h-16,'#44535c','rgba(255,255,255,.3)',1);box(x+CW20-34,y-h+18,22,10,'#0e2a3b');circ(x+CW20-23,y-h+40,2.5,'#7dffc4');
   ctx.setLineDash([2,2]);ln([x+12,y-h+10,x+CW20-40,y-h+10],'rgba(242,194,48,.8)',1);ctx.setLineDash([]);};
  siteDraw({open:op,inside});
  const x0=BX[1],y0=gyy(x0+CW20/2);
  lab(x0+CW20-23,y0-CH20+30,'BMS 主控',{dx:50,dy:110,st:'s',a:band(u,.2,.62)});
  lab(x0+60,y0-CH20+10,'電壓與溫度採樣線',{dx:-60,dy:-80,a:band(u,.22,.5)});
  lab(x0+10+3*28+11,y0-40,'電量最低的電芯',{dx:-110,dy:70,st:'w',a:band(u,.48,.68)});
  lab(x0+10+0*28+11,y0-CH20+20,'高電量電芯小幅放電',{dx:-40,dy:-80,st:'g',a:band(u,.66,.95)});
 },
 hud(u){hudPanel(250,190,'BMS 監測（示例）',seg(u,.05,.1),w=>{const b=ease(seg(u,.62,.9));const s=SOC0.map((_,i)=>socAt(i,b));const mx=Math.max(...s),mn=Math.min(...s);
  const soc=lerp(52,58,seg(u,.2,.45));
  hrow(56,'估算電量',Math.round(soc)+'%',w,'#7dffc4');hrow(88,'電流',(u<.45?'+157':'0')+' A',w,'#fff');
  hrow(120,'電芯電量差',Math.round(mx-mn)+'%',w,mx-mn>6?'#ff9d7a':'#7dffc4');
  s.forEach((v,i)=>{const bx=16+i*((w-32)/6),bw=(w-32)/6-8;box(bx,136,bw,40,'rgba(255,255,255,.1)');box(bx,136+40*(1-v/100),bw,40*v/100,v===mn&&b<.6?'#ff9d7a':'#7dffc4');});});}},

{t:'電池為什麼會老化',en:'Why batteries age',dur:13,
 d:'每一次充放電，電極表面都會發生少量副反應，消耗可用的鋰，容量因此慢慢下降。業界常把容量衰減到初始的 80% 視為壽命終點。儲能級磷酸鋰鐵電芯在約 25°C、0.5C 充放電時，規格書常標示 6,000 次以上的循環壽命；若每天充放一次，約可用十幾年。溫度越高、充放電越深、電流越大，老化越快，所以儲能系統會控溫、保留電量上下緩衝，並以溫和倍率運轉（典型範例）。',
 s:[[0,'每次充放電，容量都會少一點點'],[.3,'衰減到 80% 時，通常視為壽命終點'],[.55,'溫度高、放得深、電流大，老化更快'],[.78,'控溫與保留緩衝，讓電池用得更久']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,960,640,{title:'循環次數與容量保持率（典型範例）',x0:0,x1:10,y0:60,y1:102,xt:[0,2,4,6,8,10],yt:[60,70,80,90,100],xl:'循環次數（千次）',yl:'容量保持率（%）',pl:72,pt:70,pb:60,gx:5,gy:4});
  const n=10*seg(u,.04,.5);
  alphaDo(seg(u,.28,.34),()=>{ctx.setLineDash([8,6]);ln([c.px,c.Y(80),c.px+c.pw,c.Y(80)],'#e8572a',2);ctx.setLineDash([]);wt(c.px+12,c.Y(80)+26,'壽命終點 80%',17,'#ff9d7a',700);});
  const g=seg(u,.52,.62);
  if(g>0)alphaDo(g,()=>{curveP(c,capC,0,Math.min(10,4.2),.05,'#ff8a60',3);curveP(c,capB,0,Math.min(10,7),.05,'#58b8d0',3);
   wt(c.X(4.2)+10,c.Y(capC(4.2))+6,'高溫 45°C',17,'#ff8a60',700);wt(c.X(7)+10,c.Y(capB(7))+6,'高倍率、滿充滿放',17,'#7dc8dc',700);});
  curveP(c,capA,0,n,.05,'#7dffc4',4);
  if(n>0){circ(c.X(n),c.Y(capA(n)),8,'#fff','#13232e',2);
   alphaDo(seg(u,.04,.1),()=>{wt(c.px+c.pw-14,c.py+34,trf('循環 {n} 次',{n:Math.round(n*1000).toLocaleString('en-US')}),20,'#fff',700,'right');wt(c.px+c.pw-14,c.py+68,trf('容量 {p}%',{p:capA(n).toFixed(0)}),20,'#7dffc4',700,'right');});}
  alphaDo(seg(u,.1,.16),()=>wt(c.X(.4),c.Y(97),'典型條件：25°C、0.5C',17,'#7dffc4',700));
  alphaDo(seg(u,.4,.46),()=>{ln([c.X(8),c.Y(80),c.X(8),c.py+c.ph],'rgba(125,255,196,.5)',1.5);wt(c.X(8)-8,c.Y(64),'約 8,000 次',17,'#7dffc4',700,'right',COND);});
  /* 右：影響因素 */
  const F=[['溫度','25°C 左右最理想，高溫加速副反應'],['充放電深度（DoD）','保留上下緩衝，少用 0% 與 100%'],['倍率（C-rate）','儲能多用 0.5C，約 2 小時充滿'],['日曆老化','放著不用，也會慢慢衰退']];
  F.forEach(([h,s],i)=>alphaDo(seg(u,.55+i*.05,.61+i*.05),()=>{const y=160+i*122;card(1060,y,480,106,{bg:'rgba(7,27,39,.75)'});box(1060,y,6,106,i===3?'#58b8d0':'#f2c230');
   wt(1086,y+42,h,20,'#f2c230',700);wt(1086,y+78,s,17,'rgba(227,236,238,.88)',500);}));
  alphaDo(seg(u,.8,.86),()=>{card(1060,654,480,146,{bg:'rgba(125,255,196,.1)',st:'rgba(125,255,196,.5)'});wt(1086,698,'每天一次完整循環',19,'#fff',700);
   wt(1086,740,'6,000 次 ≈ 16 年',30,'#7dffc4',700,'left',COND);wt(1086,776,'（示例）',16,'rgba(227,236,238,.75)',500);});
 }},

{t:'熱失控：溫度一路失控',en:'Thermal runaway, step by step',dur:14,
 d:'熱失控是電芯內部的連鎖放熱反應。過充、內部短路或外部高溫讓電芯升溫；約 80 至 120°C 時，負極表面的 SEI 膜開始分解放熱；約 130°C 起隔離膜熔化，正負極直接接觸而內短路，溫度急速上升並排出可燃氣體。磷酸鋰鐵正極不易釋氧，自發熱與熱失控的起點都比三元鋰高，失控時的最高溫度也較低，但並非不會失控，仍需要防護（典型範例）。',
 s:[[0,'過充、內短路或外部高溫，讓電芯開始升溫'],[.22,'80–120°C：SEI 膜分解，自己開始發熱'],[.38,'隔離膜熔化，內短路讓溫度急升'],[.62,'比一比：鋰鐵比三元鋰更晚失控、溫度較低']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,900,640,{title:'電芯溫度歷程（示意）',x0:0,x1:100,y0:0,y1:700,yt:[0,100,200,300,400,500,600,700],xl:'時間',yl:'溫度（°C）',pl:72,pt:70,pb:50,gx:5,gy:7});
  const tt=100*seg(u,.04,.6);
  alphaDo(seg(u,.02,.08),()=>tag(c.X(3),c.Y(640),'誘因：過充 / 內短路 / 外部高溫',{size:16,bg:'#dfe5e8'}));
  alphaDo(seg(u,.2,.26),()=>{box(c.px,c.Y(120),c.pw,c.Y(80)-c.Y(120),'rgba(242,194,48,.14)');wt(c.px+12,c.Y(120)+24,'SEI 膜分解 80–120°C',16,'#f2c230',700);});
  alphaDo(seg(u,.34,.4),()=>{ctx.setLineDash([6,5]);ln([c.px,c.Y(130),c.px+c.pw,c.Y(130)],'rgba(255,157,122,.8)',1.5);ctx.setLineDash([]);wt(c.px+12,c.Y(130)-10,'隔離膜熔化約 130°C',16,'#ff9d7a',700);});
  alphaDo(seg(u,.44,.5),()=>{ctx.setLineDash([6,5]);ln([c.px,c.Y(230),c.px+c.pw,c.Y(230)],'#e8572a',2);ctx.setLineDash([]);wt(c.px+12,c.Y(230)-10,'LFP 熱失控觸發 約 230°C',16,'#e8572a',700);});
  curveP(c,trT,0,tt,.25,'#ff8a60',4);
  if(tt>0){const T=trT(tt);circ(c.X(tt),c.Y(T),8,'#fff','#13232e',2);wt(c.X(tt)+(tt>80?-14:14),c.Y(T)+(tt>70?-14:6),Math.round(T)+'°C',19,'#fff',700,tt>80?'right':'left',COND);}
  const gs=seg(u,.5,.56);if(gs>0)for(let q=0;q<6;q++){const p=(TT*.5+q/6)%1;alphaDo(gs*(1-p)*.8,()=>circ(c.X(78)+20*Math.sin(p*8+q),c.Y(610)-p*70,6+p*10,'rgba(200,200,200,.5)'));}
  alphaDo(seg(u,.52,.58),()=>tag(c.X(57),c.Y(520),'排出可燃氣體',{size:16,bg:'#e8572a',fg:'#fff',align:'right'}));
  /* 右：LFP 與 NMC 比較 */
  card(1000,160,540,640,{bg:'rgba(7,27,39,.75)'});
  wt(1024,200,'LFP 與三元鋰 NMC（典型範圍）',20,'#f2c230',700);
  const M=[['自發熱起點','150–170','90–110',160,100],['熱失控觸發','約 230','160–210',235,185],['失控最高溫','約 600','約 800',600,800]];
  const S=v=>v/900*300;
  M.forEach(([n,lv,nv,l,m],i)=>{const a=seg(u,.62+i*.08,.68+i*.08);if(a<=0)return;const y=246+i*170;alphaDo(a,()=>{
   wt(1024,y+14,n,19,'#fff',700);
   box(1110,y+34,S(l)*a,34,'#7dffc4');wt(1024,y+58,'LFP',17,'#7dffc4',700,'left',COND);wt(1118+S(l)*a,y+58,lv+' °C',18,'#fff',700,'left',COND);
   box(1110,y+80,S(m)*a,34,'#b37cff');wt(1024,y+104,'NMC',17,'#b37cff',700,'left',COND);wt(1118+S(m)*a,y+104,nv+' °C',18,'#fff',700,'left',COND);});});
  alphaDo(seg(u,.88,.94),()=>wt(1024,770,'鋰鐵較安全，但仍會失控',17,'#ff9d7a',700));
 }},

{t:'從電芯到案場，層層防護',en:'Layers of protection, cell to site',dur:13,side:true,
 d:'防護要從最小的電芯做到整個案場。電芯有洩壓閥，內壓過高時先排氣；模組內電芯之間加隔熱材，延緩熱量傳給鄰居；電池簇的 BMS 發現電壓或溫度異常就切斷電路；貨櫃裝有可燃氣體偵測、洩爆板與自動滅火系統；案場則保留貨櫃間距、消防通道與消防栓。台灣戶外儲能案場依標準檢驗局的案場驗證規範審查，並參考 CNS 62933-5-2 與 UL 9540A 的熱失控延燒試驗。',
 s:[[0,'電芯洩壓閥、模組隔熱材，先把熱留在原地'],[.3,'BMS 發現異常，立即切斷電路'],[.52,'貨櫃內有氣體偵測、洩爆板與滅火系統'],[.75,'案場保留間距與消防通道，並通過驗證']],
 cam:u=>camMix({x:BX[1]+CW20/2+40,y:gyy(BX[1]+CW20/2)-CH20/2-6,s:2.5},{x:820,y:450,s:1},ease(seg(u,.46,.66))),
 draw(u){
  const op=1-ease(seg(u,.4,.5));
  const inside=(x,y)=>{containerInside(x,y);const h=CH20;
   alphaDo(seg(u,.04,.1),()=>{for(let i=0;i<5;i++)box(x+33+i*28,y-h+14,4,h-22,'#f2c230');});
   if(u>.28&&u<.5)alphaDo(seg(u,.28,.32),()=>{circ(x+CW20-23,y-h+40,4,'#e8572a');});};
  siteDraw({open:op,inside});
  /* 貨櫃頂部：偵測器與洩爆板 */
  BX.forEach(x=>{const y=gyy(x+CW20/2)-CH20;box(x+70,y-10,50,6,'#8d989f');circ(x+150,y-8,5,'#dfe5e8','#44535c',1.5);});
  hydrant(1005,gyy(1005));
  const x0=BX[1],y0=gyy(x0+CW20/2);
  lab(x0+50,y0-60,'電芯間隔熱材',{dx:-70,dy:-90,st:'s',a:band(u,.05,.3)});
  lab(x0+CW20/2,y0-CH20+18,'電芯洩壓閥',{dx:30,dy:-100,a:band(u,.08,.3)});
  lab(x0+CW20-23,y0-CH20+40,'BMS 切斷電路',{dx:60,dy:80,st:'w',a:band(u,.3,.48)});
  lab(BX[0]+150,gyy(BX[0]+110)-CH20-8,'可燃氣體偵測',{dx:-40,dy:-80,a:band(u,.54,.76)});
  lab(BX[2]+95,gyy(BX[2]+110)-CH20-10,'洩爆板',{dx:30,dy:-90,st:'s',a:band(u,.56,.78)});
  const gy1=gyy(BX[1])+30;
  alphaDo(band(u,.74,1),()=>{arrow(BX[1]+CW20+6,gy1,BX[2]-6,gy1,'#7dffc4',2.5);arrow(BX[2]-6,gy1,BX[1]+CW20+6,gy1,'#7dffc4',2.5);});
  lab(BX[1]+CW20+30,gy1,'貨櫃間距',{dx:0,dy:60,st:'g',a:band(u,.74,1)});
  lab(1005,gyy(1005)-30,'消防栓與通道',{dx:-20,dy:-110,st:'w',a:band(u,.78,1)});
 },
 hud(u){hudPanel(310,200,'防護層級',seg(u,.03,.08),w=>{
  const R=[['電芯','洩壓閥',.03],['模組','隔熱材',.05],['電池簇','BMS 斷路',.3],['貨櫃','偵氣・洩爆・滅火',.54],['案場','間距・通道',.76]];
  R.forEach(([n,v,t0],i)=>{const on=u>=t0;htext(16,52+i*30,n,15,on?'#f2c230':'rgba(227,236,238,.45)',700);htext(w-14,52+i*30,v,15,on?'#fff':'rgba(227,236,238,.45)',600,undefined,'right');});});}}
]};
