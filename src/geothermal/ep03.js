// KITS: land
/* 地熱系列 第 3 集：增強型地熱系統（EGS） */
const gyy=x=>groundY(x);
const SUN={x:1180,y:120};
const HOT='#ff8a60',COOL='#58b8d0',PWR='#f2c230',STEEL='#8d989f',GRN='#7dffc4',WARN='#e8572a';
const EGS_LAY=[{d:0,c:'#7a9a55'},{d:14,c:'#a4876a'},{d:70,c:'#8a7a6a'},{d:160,c:'#756d66'},{d:225,c:'#8a7068'}];
const EDP=m=>m*.066;                            // 場景深度比例：5,000 m ≈ 330 px（水平方向放大）
const X1=700,X2=1100;                           // 注入井、生產井
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1,p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
function pl(P,col,lw){const a=[];P.forEach(p=>a.push(p[0],p[1]));ln(a,col,lw);}
function hills(){poly([-200,GY,-60,430,120,380,300,440,420,400,560,470,700,430,880,480,1000,440,1180,410,1320,450,1500,400,1700,460,1800,GY],'#8fae9a');
  poly([-200,GY,0,500,200,470,380,520,600,480,820,530,1060,490,1300,520,1560,480,1800,GY],'#7c9f7c');}
function egsBase(){landSky(GY,{sun:SUN,clouds:false});hills();drawGround({layers:EGS_LAY});}
/* 熱岩：愈深愈紅 */
function hotRock(a){const y0=GY+EDP(1200);const gr=ctx.createLinearGradient(0,y0,0,1010);gr.addColorStop(0,'rgba(232,87,42,0)');gr.addColorStop(1,'rgba(232,87,42,.62)');
  alphaDo(a,()=>{ctx.fillStyle=gr;ctx.fillRect(-300,y0,2200,1010-y0+20);});}
function grains(a){const R=rng(3);alphaDo(a,()=>{for(let i=0;i<70;i++){const x=R()*1600,y=GY+EDP(3000)+R()*(1010-GY-EDP(3000));ln([x,y,x+8+R()*10,y+3+R()*5],'rgba(60,40,36,.35)',2);}});}
function depthScale(a){alphaDo(a,()=>{ctx.setLineDash([6,8]);for(let km=1;km<=5;km++){const y=GY+EDP(km*1000);ln([-200,y,1800,y],'rgba(255,255,255,.25)',1);}ctx.setLineDash([]);
  for(let km=1;km<=5;km++){const y=GY+EDP(km*1000);wt(50,y-8,km+' km',17,'rgba(255,255,255,.9)',700,'left',COND);wt(50,y+14,'≈'+(15+30*km)+'°C',16,'#ffd2bf',600,'left',COND);}});}
function derrick(x,a){const g=gyy(x);alphaDo(a===undefined?1:a,()=>{ln([x-28,g,x-7,g-150],'#e9b21f',4);ln([x+28,g,x+7,g-150],'#e9b21f',4);
  ln([x-20,g-40,x+17,g-100,x-14,g-100,x+21,g-40],'rgba(233,178,31,.85)',1.5);box(x-12,g-158,24,10,'#6a747a');box(x-48,g-22,52,22,'#5c6770','rgba(0,0,0,.3)',1);});}
function egsWell(x,dm){const g=gyy(x);if(dm<=0)return g;const cs=Math.min(EDP(dm),EDP(3900));box(x-8,g,16,cs,'#aeb8be');box(x-5,g,10,EDP(dm),'#1d2328');return g+EDP(dm);}
function wellhead(x){const g=gyy(x);box(x-14,g-16,28,16,'#6a747a','rgba(0,0,0,.3)',1);box(x-9,g-34,18,18,STEEL,'rgba(0,0,0,.3)',1);ring(x+18,g-26,7,'#1f7f99',3);}
/* 人工裂隙網：由注入井向生產井延伸 */
const FRP=[0,1,2,3,4,5].map(i=>{const P=[];for(let k=0;k<=8;k++){const e=(k>0&&k<8)?1:0;P.push([lerp(X1+6,X2-6,k/8),GY+EDP(3950)+i*13+(i%2?1:-1)*22*Math.sin(k*1.3+i*1.7)*e]);}return P;});
function fracDraw(f,hl,a){if(f<=0)return;alphaDo(a===undefined?1:a,()=>{FRP.forEach((P,i)=>{const o=[];for(let t=0;t<=1.0001;t+=.04){if(t>f)break;const p=ptAt(P,t);o.push(p[0],p[1]);}const q=ptAt(P,f);o.push(q[0],q[1]);
  ln(o,hl?'rgba(255,160,120,.95)':'rgba(255,157,122,.7)',hl?3.5:2.5);});});}
/* 微震事件：位置固定、依時間出現 */
const SEV=(()=>{const R=rng(11),a=[];for(let j=0;j<60;j++)a.push({x:lerp(X1-30,X2+30,R()),y:GY+EDP(3800+R()*900),t:.3+.38*j/60});return a;})();
function microseis(u,a){let n=0;alphaDo(a,()=>{SEV.forEach(e=>{const age=u-e.t;if(age<0)return;n++;circ(e.x,e.y,3,GRN);if(age<.04)ring(e.x,e.y,5+age*500,'rgba(125,255,196,'+(1-age/.04)+')',2);});});return n;}
function plume(x,y,a,s){if(a<=0)return;for(let i=0;i<7;i++){const p=(TT*.45+i/7)%1;alphaDo(a*(1-p)*.9,()=>circ(x+14*Math.sin(p*4+i)*s,y-p*200*s,(12+p*40)*s,'rgba(255,255,255,.6)'));}}

const EP={no:3,slug:'geothermal',seriesName:'地熱系列',t:'增強型地熱系統（EGS）',en:'Enhanced geothermal systems (EGS)',
lede:'很多地方地下很熱，卻沒有天然的熱水與裂隙。增強型地熱系統（EGS）的做法，是鑽進乾熱岩、用高壓水造出裂隙，再注水循環取熱。這一集看人工儲集層怎麼造、怎麼發電，以及浦項地震留下的教訓。',
facts:[['約 5,000','m','法國 Soultz 計畫的三口深井鑽到約 5,000 m，岩溫約 200°C'],
['1.5–1.7','MWe','Soultz 試驗電廠的發電規模（毛發電量）'],
['約 2,290','m','美國 Utah FORGE 垂直井 58-32 的井深，井底約 199°C'],
['5.5','Mw','2017 年南韓浦項 EGS 場址附近發生的地震規模'],
['1.9','M','Utah FORGE 首對水平井測試中的最大誘發地震規模'],
['逾 2/3','注入水','Utah FORGE 循環測試中，由生產井返回的注入水比例']],
note:'說明：本集為教育用途示意動畫，井深比例經過壓縮、井距放大，地溫梯度（約 30°C/km）、HUD 與發電功率數值皆為典型範例。Soultz 井深、岩溫與電廠規模參考 CORDIS、德國 BGR 與 DESTRESS 專案資料；浦項地震參考史丹佛大學與同行審查論文；Utah FORGE 井深、溫度、刺激壓力與水平井測試結果參考美國能源部 FORGE 計畫公開資料。員山 1 號井數值見第 2 集。',
base:()=>egsBase(),
shots:[
{t:'乾熱岩的熱',en:'Heat in hot dry rock',dur:13,side:true,
 d:'地熱電廠需要三個條件：夠熱的岩石、足夠的水，以及讓水流動的裂隙。許多地方地下很熱，卻缺少天然的熱水與裂隙，岩石又緻密，這類高溫但乾燥、低滲透的岩體稱為乾熱岩。一般地溫約每深 1 公里升高 30°C，因此鑽到約 5 公里深，岩溫可達 150°C 以上；法國 Soultz 計畫鑽到約 5,000 公尺時約 200°C。增強型地熱系統（EGS）的想法，就是自己造出水流通道，把這些熱取出來。',
 s:[[0,'地底愈深愈熱，約每公里升高 30°C'],[.28,'深處的花崗岩很熱，卻緻密又乾燥'],[.52,'這類乾熱岩缺少天然的水與裂隙'],[.76,'EGS 要鑽進去，自己造出水的通道']],
 cam:u=>({x:800,y:560,s:1}),
 draw(u){
  hotRock(seg(u,.02,.3));grains(seg(u,.1,.3));depthScale(seg(u,.04,.2));
  flowDots([[420,GY+EDP(4800)],[420,GY+EDP(1500)]],5,HOT,seg(u,.14,.28),.18,5);flowDots([[1300,GY+EDP(4800)],[1300,GY+EDP(1500)]],5,HOT,seg(u,.14,.28),.18,5);
  const dm=4500*ease(seg(u,.52,.95));
  derrick(X1,seg(u,.5,.58));egsWell(X1,dm);
  if(dm>0)circ(X1,gyy(X1)+EDP(dm),6,PWR);
  lab(560,GY+EDP(500),'沉積層與表土',{dx:-90,dy:-30,a:band(u,.04,.34),minor:true});
  lab(900,GY+EDP(3800),'乾熱岩（花崗岩）',{dx:140,dy:-10,st:'s',a:band(u,.26,.6)});
  lab(420,GY+EDP(3200),'熱量由下往上傳導',{dx:-60,dy:-60,st:'w',a:band(u,.14,.4)});
  lab(1100,GY+EDP(3300),'缺少天然熱水與裂隙',{dx:-60,dy:70,st:'w',a:band(u,.5,.8)});
  lab(X1,GY-100,'深井',{dx:-110,dy:-30,a:band(u,.6,1)});
 },
 hud(u){hudPanel(240,150,'地下溫度（示例）',seg(u,.05,.1),w=>{const dm=4500*ease(seg(u,.52,.95)),km=dm/1000;
  hrow(56,'鑽頭深度',km.toFixed(1)+' km',w,'#fff');hrow(88,'岩層溫度','≈'+Math.round(15+30*km)+'°C',w,PWR);hrow(120,'發電常用門檻','≥ 150°C',w,GRN);});}},

{t:'造裂：水力刺激',en:'Hydraulic stimulation',dur:14,side:true,
 d:'EGS 先鑽兩口以上的深井，穿過蓋層進入乾熱岩。接著在注入井加壓注水，水壓超過岩石承受的限度，就會撐開既有的裂隙，或使它們沿著斷面滑動，裂隙因此變寬、互相連通，這個過程稱為水力刺激。美國 Utah FORGE 在 2017 年對垂直井 58-32 做刺激測試，井口壓力峰值約 27.6 MPa、流量約 1,430 L/min。每次裂隙滑動都會放出微小震動，稱為微震，正好用來描繪裂隙網路長到哪裡。',
 s:[[0,'先鑽注入井與生產井，進入乾熱岩'],[.28,'在注入井加壓注水，水壓撐開岩石裂隙'],[.5,'裂隙滑動時放出微震，標出網路位置'],[.76,'裂隙互相連通，接到生產井']],
 cam:u=>({x:800,y:560,s:1}),
 draw(u){
  hotRock(1);grains(1);
  const dm=4400*ease(seg(u,.02,.26)),pa=seg(u,.3,.36);
  derrick(X1,1-seg(u,.3,.4));derrick(X2,1-seg(u,.3,.4));
  const yb=egsWell(X1,dm);egsWell(X2,dm);wellhead(X1);wellhead(X2);
  const g=gyy(X1);
  /* 注入泵 */
  alphaDo(pa,()=>{box(X1-230,g-44,120,44,'#5c6770','rgba(0,0,0,.3)',1);circ(X1-190,g-22,13,'#1f7f99');ln([X1-190,g-22,X1-190+9*Math.cos(TT*6),g-22+9*Math.sin(TT*6)],'#fff',3);box(X1-150,g-34,30,14,'#44535c');ln([X1-110,g-26,X1-14,g-26],'#8d989f',6);});
  flowDots([[X1,g-26],[X1,g+EDP(3950)]],8,COOL,pa,.3,3.5);
  const f=ease(seg(u,.34,.78));fracDraw(f,f<1&&u>.34);
  const n=microseis(u,1);
  const ca=seg(u,.78,.86);
  if(ca>0){flowDots([[X1,g+EDP(3990)],[X2,g+EDP(3990)]],6,COOL,ca,.4,3.5);}
  lab(X1,g+EDP(1500),'注入井',{dx:-110,dy:-20,st:'s',a:band(u,.04,.34)});
  lab(X2,g+EDP(1500),'生產井',{dx:110,dy:-20,st:'s',a:band(u,.04,.34)});
  lab(X1-190,g-44,'高壓注入泵',{dx:-70,dy:-50,a:band(u,.3,.56)});
  lab(900,g+EDP(3950),'裂隙網路',{dx:0,dy:-110,st:'w',a:band(u,.46,.8)});
  lab(1000,g+EDP(4300),'微震事件',{dx:150,dy:10,st:'g',a:band(u,.48,.76)});
  lab(900,g+EDP(4000),'人工儲集層',{dx:0,dy:110,st:'s',a:band(u,.8,1)});
 },
 hud(u){hudPanel(250,150,'水力刺激（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.3,.5)),dn=1-.2*seg(u,.5,.8),n=SEV.filter(e=>u>=e.t).length;
  hrow(56,'注入壓力',u<.3?'—':Math.round(28*k*dn)+' MPa',w,PWR);hrow(88,'注入流量',u<.3?'—':Math.round(24*k)+' L/s',w,COOL);hrow(120,'微震事件',trf('{n} 次',{n:n}),w,GRN);});}},

{t:'微震監測與紅綠燈',en:'Seismic monitoring and traffic lights',dur:13,
 d:'注水改變岩石孔隙壓力，若碰上臨界受力的斷層，微震可能變大，變成居民感受得到的誘發地震。2017 年 11 月，南韓浦項 EGS 場址附近發生 Mw 5.5 地震，多項研究認為與注水刺激有關，且主震發生在停止注入約兩個月之後。現在的做法是布設井下與地表地震儀即時監測，並採用「紅綠燈」管理：事件規模超過門檻時，就降低流量、停止注入或洩壓。選址時也要避開已知的活動斷層。',
 s:[[0,'注水時，地震儀即時記錄每一次微震'],[.3,'事件規模變大，亮起黃燈'],[.52,'降低注入壓力，事件隨之變少'],[.72,'浦項事件顯示，停注後風險仍在']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,760,650,{title:'微震事件監測（示例）',x0:0,x1:72,y0:-2,y1:3,xt:[0,24,48,72],yt:[-2,-1,0,1,2,3],xl:'注入時間（小時）',yl:'事件規模 M',gx:3,gy:5,pt:74});
  const Pf=t=>t<34?t/34:Math.max(.35,1-(t-34)/40*.65),k=seg(u,.05,.85),tn=72*k;
  ctx.setLineDash([8,6]);ln([c.X(0),c.Y(1),c.X(72),c.Y(1)],'rgba(242,194,48,.8)',2);ln([c.X(0),c.Y(2),c.X(72),c.Y(2)],'rgba(232,87,42,.9)',2);ctx.setLineDash([]);
  wt(c.X(72)-6,c.Y(1)-8,'黃燈門檻（示例）',16,PWR,600,'right');wt(c.X(72)-6,c.Y(2)-8,'紅燈門檻（示例）',16,'#ff8a60',600,'right');
  const pp=[];for(let t=0;t<=tn;t+=1)pp.push(c.X(t),c.Y(-1.6+3.2*Pf(t)*.8));if(pp.length>3)ln(pp,'#f2c230',3);
  const R=rng(5);for(let j=0;j<70;j++){const t=72*(j+R()*.8)/70,P=Pf(t);let m=Math.min(.85,-1.9+2.6*P*Math.pow(R(),.9));if(j===33)m=1.3;if(t>tn)continue;
   circ(c.X(t),c.Y(m),m>1?7:4.5,m>1?'#ff8a60':GRN,m>1?'#fff':null,m>1?1.5:0);}
  tag(c.X(2),c.Y(2.75),'注入壓力（相對）',{bg:'#f2c230',fg:'#13232e',size:15,align:'left'});tag(c.X(26),c.Y(2.75),'微震事件',{bg:'#7dffc4',fg:'#0e2a3b',size:15,align:'left'});
  /* 右：紅綠燈 */
  card(860,150,680,650,{bg:'rgba(7,27,39,.75)'});wt(884,196,'紅綠燈管理',20,'#f2c230',700);
  const act=u<.43?0:u<.64?1:0;
  const TL=[['綠燈','規模很小，照常注入','#3ddc84'],['黃燈','不再加壓，加密監測','#f2c230'],['橘燈','降低流量，必要時暫停','#ff8a2a'],['紅燈','停止注入並洩壓','#e8572a']];
  TL.forEach(([h,b,col],i)=>{const y=252+i*68,on=i===act;card(884,y-34,632,60,{bg:on?'rgba(255,255,255,.08)':'rgba(255,255,255,.03)',st:on?col:'rgba(255,255,255,.12)'});
   circ(920,y-4,15,on?col:'rgba(255,255,255,.12)');wt(956,y+2,h,20,on?col:'rgba(227,236,238,.6)',700);wt(1066,y+2,b,17,on?'#fff':'rgba(227,236,238,.6)',500);});
  alphaDo(seg(u,.66,.74),()=>{card(884,540,632,240,{bg:'rgba(232,87,42,.08)',st:'rgba(232,87,42,.5)'});
   wt(908,584,'2017 年 11 月：浦項 Mw 5.5 地震',20,'#ff8a60',700);
   wt(908,624,'震央靠近 EGS 場址，多項研究指出與注水有關',17,'#fff',500);
   wt(908,656,'主震發生時，注入已停止約兩個月',17,'#fff',500);
   wt(908,696,'教訓：停注後壓力仍會擴散，',17,'rgba(227,236,238,.9)',500);
   wt(908,726,'選址要避開斷層，門檻也要保守。',17,'rgba(227,236,238,.9)',500);});
 }},

{t:'注水循環發電',en:'Circulating water for power',dur:14,side:true,
 d:'造好人工儲集層後，轉入長期運轉：低溫水由注入井往下，沿著裂隙流經高溫岩石被加熱，再由生產井升回地面。熱水在地面經熱交換器，把熱傳給沸點較低的工作流體，推動雙循環（ORC）機組發電，降溫後的水再回注，形成封閉循環。以示例數字估算，每秒 50 公升的水由約 70°C 加熱到約 180°C，約帶來 23 MW 的熱功率，扣掉轉換效率後可發約 2.8 MW 的電。',
 s:[[0,'冷水由注入井下去，流過高溫的裂隙'],[.28,'岩石把水加熱，熱水從生產井升回地面'],[.5,'熱交換器推動雙循環機組，帶動發電機'],[.74,'降溫後的水再回注，形成封閉循環']],
 cam:u=>({x:800,y:560,s:1}),
 draw(u){
  hotRock(1);grains(1);
  const g=gyy(X1),gb=gyy(X2),yI=g+EDP(3990);
  fracDraw(1,false,.9);egsWell(X1,4400);egsWell(X2,4400);wellhead(X1);wellhead(X2);
  const a1=seg(u,.04,.1),a2=seg(u,.26,.32),a3=seg(u,.46,.52),a4=seg(u,.72,.78);
  /* 地面電廠 */
  box(810,g-96,180,96,'#dfe5e8','rgba(0,0,0,.3)',1);box(826,g-78,40,28,'#2a3a46');
  circ(910,g-48,24,'#aeb8be','#44535c',2);for(let i=0;i<4;i++){const a=TT*(a3>0?5:0)+i*Math.PI/2;ln([910,g-48,910+22*Math.cos(a),g-48+22*Math.sin(a)],'#44535c',3);}
  box(944,g-62,36,28,'#5c6770');
  box(1200,g-110,90,110,'#c9d1d6','rgba(0,0,0,.3)',1);ln([990,g-80,1200,g-80],'#8d989f',5);plume(1245,g-116,a4,.9);
  ln([1480,g,1480,g-170],'#8d989f',4);ln([1450,g-150,1510,g-150],'#8d989f',3);ln([1460,g-120,1500,g-120],'#8d989f',3);
  alphaDo(a3,()=>ln([990,g-30,1480,g-150],'rgba(242,194,48,.8)',2));
  /* 管線與流動 */
  ln([X2,g-26,990,g-26],'#8d989f',6);ln([810,g-26,X1,g-26],'#8d989f',6);
  flowDots([[X1,g-26],[X1,yI]],8,COOL,a1,.3,3.5);
  flowDots([[X1,yI],[(X1+X2)/2,yI]],6,COOL,a1,.3,3.5);flowDots([[(X1+X2)/2,yI],[X2,yI]],6,HOT,a2,.3,3.5);
  flowDots([[X2,yI],[X2,gb-26],[990,g-26]],8,HOT,a2,.3,4);
  flowDots([[810,g-26],[X1,g-26]],5,COOL,a4,.3,4);
  lab(X1,g+EDP(2000),'注入井（冷水）',{dx:-120,dy:-10,st:'s',a:band(u,.04,.3)});
  lab(X2,g+EDP(2000),'生產井（熱水）',{dx:130,dy:-10,st:'w',a:band(u,.28,.54)});
  lab(900,yI,'人工儲集層',{dx:0,dy:90,st:'s',a:band(u,.2,.5)});
  lab(900,g-96,'熱交換器與 ORC 機組',{dx:0,dy:-80,a:band(u,.46,.74)});
  lab(1245,g-60,'冷卻塔',{dx:60,dy:-80,a:band(u,.7,1),minor:true});
  lab(1480,g-150,'送入電網',{dx:-60,dy:-60,st:'g',a:band(u,.56,.86)});
 },
 hud(u){hudPanel(250,180,'循環運轉（示例）',seg(u,.05,.1),w=>{
  hrow(56,'注入溫度','約 70°C',w,COOL);hrow(88,'產出溫度',u<.3?'—':'約 180°C',w,HOT);hrow(120,'流量',u<.1?'—':'50 L/s',w,'#fff');hrow(152,'發電功率',u<.5?'—':Math.round(2.8*ease(seg(u,.5,.62))*10)/10+' MW',w,PWR);});}},

{t:'EGS 與傳統地熱',en:'EGS versus conventional geothermal',dur:13,
 d:'與傳統地熱相比，EGS 不必等到剛好有天然熱水，理論上能把地熱帶到更多地方，這是它被視為深層潛力的原因。但挑戰也不少：水若沿少數主裂隙快速穿過，岩石來不及加熱，產出溫度會下降，稱為熱短路；部分注入水會留在地層，需要補水；注水可能誘發地震；深井與造裂的成本也比傳統地熱高。降低成本與管理風險，是目前各示範場址的主要課題。',
 s:[[0,'傳統地熱靠天然熱水，EGS 自己造通道'],[.28,'EGS 理論上能用在更多地方'],[.5,'水若只走少數裂隙，產出溫度會下降'],[.74,'成本與誘發地震，是目前的主要課題']],
 draw(u){
  diagBG();
  card(60,150,860,370,{bg:'rgba(7,27,39,.75)'});wt(84,196,'兩種地熱的差別',20,'#f2c230',700);
  wt(236,240,'傳統地熱',18,COOL,700);wt(580,240,'EGS',18,HOT,700);ln([80,254,900,254],'rgba(255,255,255,.15)',1);
  const T=[['熱源','火山、斷層區的高溫地層','深處乾熱岩，位置限制少'],['流體','天然熱水或蒸氣','由地面注水循環'],['滲透性','天然裂隙','水力刺激造裂'],['分布','資源集中在少數區域','理論上分布更廣'],['成本','探勘階段風險較高','深井與造裂，成本較高']];
  T.forEach(([h,a,b],i)=>{const y=292+i*46,k=seg(u,.02+i*.05,.08+i*.05);alphaDo(.2+.8*k,()=>{wt(84,y,h,18,'#f2c230',700);wt(236,y,a,17,'#fff',500);wt(580,y,b,17,'#fff',500);if(i<4)ln([80,y+22,900,y+22],'rgba(255,255,255,.08)',1);});});
  const c=chartBox(60,540,860,260,{title:'產出溫度變化（示例）',x0:0,x1:30,y0:100,y1:200,xt:[0,10,20,30],yt:[100,150,200],xl:'運轉年數',yl:'°C',gx:3,gy:2});
  const kk=seg(u,.5,.86),pa=[],pb=[];for(let t=0;t<=30*kk+.001;t+=.5){pa.push(c.X(t),c.Y(185-.4*t));pb.push(c.X(t),c.Y(185-55*(1-Math.exp(-t/10))));}
  if(pa.length>3){ln(pa,GRN,3);ln(pb,'#ff8a60',3);}
  tag(c.X(14),c.Y(118),'熱短路',{bg:'#ff8a60',fg:'#13232e',size:15,align:'left'});tag(c.X(14),c.Y(192),'設計良好',{bg:'#7dffc4',fg:'#0e2a3b',size:15,align:'left'});
  const C=[['熱短路','水沿少數主裂隙快速穿過，岩石來不及加熱','#ff8a60',.46],['水量損失','部分注入水滲入地層，需要持續補水',COOL,.56],['誘發地震','注水改變孔隙壓力，可能觸動既有斷層','#e8572a',.66],['成本與規模','深井、造裂與監測都很貴，需靠經驗降低成本',PWR,.76]];
  C.forEach(([h,b,col,t0],i)=>{const y=150+i*168,k=seg(u,t0,t0+.06);alphaDo(.2+.8*k,()=>{card(960,y,580,150,{bg:'rgba(7,27,39,.75)',st:k>.5?col:'rgba(255,255,255,.12)'});box(960,y,8,150,col);wt(992,y+56,h,22,col,700);wt(992,y+100,b,17,'rgba(227,236,238,.9)',500);});});
 }},

{t:'發展歷程與台灣機會',en:'Milestones and Taiwan outlook',dur:13,
 d:'EGS 的研究已有五十年：1970 年代美國 Fenton Hill 乾熱岩實驗，1987 年起歐洲在法國 Soultz 試驗，2016 年新電廠併網，毛發電量約 1.7 MW。2017 年浦項事件讓各國重新檢討風險規範。2024 年，美國 Utah FORGE 完成第一對水平井的循環測試，注入的水超過三分之二由生產井返回，最大誘發地震規模約 1.9。台灣的員山 1 號井已探測到近 4,000 公尺深處約 150°C 的高溫，EGS 是否適合台灣，仍需要更多探勘與評估。',
 s:[[0,'五十年來，EGS 一路從實驗走向示範'],[.3,'浦項事件之後，各國重新檢討風險'],[.55,'水平井讓循環測試取得新進展'],[.76,'台灣的深層地熱，還在探勘與評估']],
 draw(u){
  diagBG();
  const ST=[['1970 年代','美國 Fenton Hill','乾熱岩實驗'],['1987 年起','法國 Soultz','歐洲 EGS 試驗場'],['2016 年','Soultz 新電廠','毛發電量約 1.7 MW'],['2017 年','南韓浦項','Mw 5.5 誘發地震'],['2024 年','美國 Utah FORGE','水平井對循環測試']];
  ST.forEach(([y,h,b],i)=>{const x=60+i*296,k=seg(u,.02+i*.12,.1+i*.12),warn=i===3;alphaDo(.2+.8*k,()=>{card(x,176,276,160,{bg:'rgba(7,27,39,.75)',st:warn?'#e8572a':'rgba(255,255,255,.16)'});
   wt(x+20,216,y,22,warn?'#ff8a60':'#f2c230',700,'left',COND);wt(x+20,260,h,19,'#fff',700);wt(x+20,300,b,16,'rgba(227,236,238,.85)',500);if(i<4)arrow(x+280,256,x+292,256,'rgba(242,194,48,.8)',2.5);});});
  alphaDo(seg(u,.6,.68),()=>{card(60,376,720,424,{bg:'rgba(7,27,39,.75)'});wt(84,422,'台灣的深層地熱',20,'#f2c230',700);
   const L=[['員山 1 號井','近 4,000 m 深，井底約 150°C','#f2c230'],['地溫梯度','3,500 m 以下約 90°C/km，顯示下方熱源','#ff8a60'],['下一步','需要更多探勘，評估岩性、斷層與滲透性','#7dffc4']];
   L.forEach(([h,b,col],i)=>{const y=486+i*100;box(84,y-30,6,78,col);wt(106,y,h,21,col,700);wt(106,y+36,b,17,'#fff',500);});});
  alphaDo(seg(u,.76,.84),()=>{card(820,376,720,424,{bg:'rgba(7,27,39,.75)'});wt(844,422,'EGS 要成熟的三件事',20,'#f2c230',700);
   const R=[['造裂技術','讓水流穩定、不短路','#ff8a60'],['地震風險','監測與紅綠燈，保守選址','#e8572a'],['成本下降','深鑽與水平井的經驗累積','#f2c230']];
   R.forEach(([h,b,col],i)=>{const y=490+i*96;circ(860,y-7,8,col);wt(884,y,h,21,col,700);wt(884,y+36,b,17,'rgba(227,236,238,.9)',500);});});
 }}
]};
