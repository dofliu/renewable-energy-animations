// KITS: land
/* 地熱系列 第 1 集：地熱發電廠 */
const gyy=x=>groundY(x);
const SUN={x:1180,y:120};
const PWX=230,HXX=330,PHX=500,PHW=220,PHH=120,ACX=780,ACW=220,RWX=1090,SSX=1200,TWX=1440;  // 生產井、熱交換器、發電機房、氣冷冷凝器、回注井、變電站、電塔
const HOT='#ff8a60',COOL='#58b8d0',WF='#b37cff',PWR='#f2c230';                              // 熱水、回注水、工作流體、電力
const GEO_LAY=[{d:0,c:'#7a9a55'},{d:14,c:'#a4876a'},{d:60,c:'#8a7a6a'},{d:150,c:'#6d6862'},{d:190,c:'#7a4b3a'},{d:330,c:'#8e3b22'}];
/* 沿折線 P（[[x,y],…]）取比例 f 的點 */
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1,p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
function pl(P,col,lw){const a=[];P.forEach(p=>a.push(p[0],p[1]));ln(a,col,lw);}
/* 遠山（宜蘭山區意象） */
function hills(){poly([-200,GY,-60,430,120,380,300,440,420,400,560,470,700,430,880,480,1000,440,1180,410,1320,450,1500,400,1700,460,1800,GY],'#8fae9a');
  poly([-200,GY,0,500,200,470,380,520,600,480,820,530,1060,490,1300,520,1560,480,1800,GY],'#7c9f7c');}
function geoBase(k){landSky(GY,{sun:SUN,clouds:!k,dusk:k||0});hills();drawGround({layers:GEO_LAY});}
/* 地面設施 */
function wellhead(x){const g=gyy(x);box(x-30,g-4,60,6,'#aeb8be');box(x-10,g-24,20,22,'#8d989f');box(x-7,g-64,14,42,'#c9d1d6','rgba(0,0,0,.3)',1);
  box(x-18,g-58,36,6,'#6a747a');box(x-18,g-40,36,6,'#6a747a');circ(x+16,g-30,7,'#1f7f99');}
function heatEx(x){const g=gyy(x+60);box(x+14,g-54,8,54,'#6a747a');box(x+98,g-54,8,54,'#6a747a');
  rrp(x,g-98,120,46,20);ctx.fillStyle='#dfe5e8';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();ln([x+30,g-98,x+30,g-52],'rgba(0,0,0,.18)',1);ln([x+90,g-98,x+90,g-52],'rgba(0,0,0,.18)',1);}
function powerHouse(){const x=PHX,g=gyy(x+PHW/2),w=PHW,h=PHH;box(x,g-h,w,h,'#e3e8ec','rgba(0,0,0,.3)',1);poly([x-8,g-h,x+w/2,g-h-26,x+w+8,g-h],'#8d989f');
  for(let i=0;i<5;i++)box(x+18+i*40,g-h+24,24,16,'#2a3a46');box(x+w/2-18,g-44,36,44,'#5c6770');box(x+14,g-h+54,72,14,'#1f7f99');}
function acc(){const x=ACX,g=gyy(x+ACW/2),w=ACW;for(let i=0;i<=4;i++)box(x+8+i*(w-22)/4,g-96,6,96,'#6a747a');
  box(x,g-112,w,18,'#c9d1d6','rgba(0,0,0,.3)',1);poly([x+6,g-112,x+w/2,g-150,x+w-6,g-112],'#aeb8be','rgba(0,0,0,.25)',1);
  for(let i=0;i<3;i++){const cx=x+40+i*70,cy=g-150+10;box(cx-26,cy-12,52,6,'#8d989f');const s=Math.abs(Math.cos(TT*6+i));ln([cx-24*s,cy-16,cx+24*s,cy-16],'#44535c',3);}}
function reinjPump(x){const g=gyy(x);box(x-70,g-30,44,26,'#1f7f99','rgba(0,0,0,.3)',1);circ(x-48,g-17,8,'#58b8d0');box(x-74,g-4,52,4,'#6a747a');
  box(x-24,g-4,48,6,'#aeb8be');box(x-8,g-40,16,38,'#c9d1d6','rgba(0,0,0,.3)',1);box(x-14,g-36,28,5,'#6a747a');}
function substation(){const x=SSX,g=gyy(x+50);fence(x-10,x+110,g+2);box(x+14,g-50,70,46,'#8d989f','rgba(0,0,0,.3)',1);for(let i=0;i<3;i++){box(x+24+i*22,g-72,6,22,'#c9d1d6');circ(x+27+i*22,g-74,4,'#e3e8ec');}}
function pylon(x){const g=gyy(x);ctx.strokeStyle='#5c6770';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-24,g);ctx.lineTo(x-6,g-220);ctx.lineTo(x+6,g-220);ctx.lineTo(x+24,g);
  for(let i=0;i<6;i++){const y0=g-i*36,y1=g-(i+1)*36,w0=24-18*i/6,w1=24-18*(i+1)/6;ctx.moveTo(x-w0,y0);ctx.lineTo(x+w1,y1);ctx.moveTo(x+w0,y0);ctx.lineTo(x-w1,y1);}
  ctx.moveTo(x-40,g-190);ctx.lineTo(x+40,g-190);ctx.moveTo(x-30,g-160);ctx.lineTo(x+30,g-160);ctx.stroke();}
/* 管線路徑 */
const P_PROD=()=>[[PWX,gyy(PWX)-64],[PWX,gyy(PWX)-112],[HXX+10,gyy(PWX)-112],[HXX+10,gyy(HXX+60)-98]];
const P_BRINE=()=>[[HXX+110,gyy(HXX+60)-52],[HXX+110,gyy(HXX)-14],[RWX-60,gyy(HXX)-14],[RWX-60,gyy(RWX)-30]];
const P_WF=()=>[[HXX+120,gyy(HXX+60)-78],[PHX,gyy(HXX+60)-78]];
const P_ACC=()=>[[PHX+PHW,gyy(PHX)-80],[ACX+30,gyy(PHX)-80],[ACX+30,gyy(ACX+ACW/2)-94]];
const P_RET=()=>[[ACX+ACW-30,gyy(ACX+ACW/2)-94],[ACX+ACW-30,gyy(ACX)-50],[PHX+PHW,gyy(ACX)-50]];
const P_PWR=()=>[[PHX+PHW/2,gyy(PHX)-PHH-26],[PHX+PHW/2,gyy(PHX)-190],[SSX+49,gyy(PHX)-190],[SSX+49,gyy(SSX)-74]];
const P_GRID=()=>[[SSX+71,gyy(SSX)-74],[TWX-40,gyy(TWX)-190],[1700,gyy(TWX)-196]];
/* 地下：井與儲集層 */
const W_PROD=()=>[[PWX+60,gyy(PWX)+240],[PWX+10,gyy(PWX)+160],[PWX,gyy(PWX)+60],[PWX,gyy(PWX)]];   // 由下往上
const W_REIN=()=>[[RWX,gyy(RWX)],[RWX,gyy(RWX)+70],[RWX-10,gyy(RWX)+170],[RWX-60,gyy(RWX)+250]];  // 由上往下
const R_FLOW=()=>[[RWX-60,gyy(RWX)+262],[RWX-300,860],[PWX+360,868],[PWX+70,gyy(PWX)+252]];
function wellBore(P,a){alphaDo(a===undefined?1:a,()=>{pl(P,'#aeb8be',14);pl(P,'#2a3a46',8);});}
function reservoirGlow(a){if(a<=0)return;alphaDo(a,()=>{const R=rng(11);for(let i=0;i<40;i++){const x=R()*1600,y=800+R()*120,p=(TT*.4+R())%1;circ(x+10*Math.sin(TT+i),y,2+2*Math.sin(p*TAU)**2,'rgba(255,157,122,.55)');}});}
function plantDraw(o){o=o||{};
  pl(P_GRID(),'rgba(40,50,58,.6)',2);pylon(TWX);substation();
  [P_PROD(),P_BRINE()].forEach(P=>pl(P,'#6a747a',6));[P_WF(),P_ACC(),P_RET()].forEach(P=>pl(P,'#8d989f',4));pl(P_PWR(),'rgba(40,50,58,.55)',2);
  wellhead(PWX);heatEx(HXX);powerHouse();acc();reinjPump(RWX);
  wellBore(W_PROD(),o.wells);wellBore(W_REIN(),o.wells);
}
function plantFlows(a){flowDots(P_PROD(),6,HOT,a,.35);flowDots(P_BRINE(),9,COOL,a,.2);flowDots(P_WF(),3,WF,a,.5,3.5);flowDots(P_ACC(),4,WF,a,.4,3.5);flowDots(P_RET(),4,WF,a,.4,3.5);
  flowDots(P_PWR(),5,PWR,a,.5,3.5);flowDots(P_GRID(),6,PWR,a,.35,3.5);flowDots(W_PROD(),6,HOT,a,.3,3.5);flowDots(W_REIN(),6,COOL,a,.3,3.5);}

const EP={no:1,slug:'geothermal',seriesName:'地熱系列',t:'地熱發電廠',en:'Inside a geothermal power plant',
lede:'地球內部的熱不分晝夜、不看天氣，是少數能當作基載的再生能源。這一集從地下的熱從哪裡來談起，走進一座地熱電廠，看生產井與回注井如何把熱水取出又送回，比較閃化式與雙循環兩種發電方式，最後介紹台灣宜蘭清水與大屯火山的地熱背景。',
facts:[['4.2','MW','宜蘭清水地熱電廠裝置容量，2021 年起商轉'],
['約 150','°C','清水地熱的熱水溫度，採雙循環（ORC）發電'],
['293','°C','大屯火山區早年鑽井量測的地下熱水最高溫度'],
['989','MW','深度 3 公里內的淺層地熱潛能（工研院估計）'],
['約 32','GW','深度超過 3 公里的深層地熱潛能'],
['200','MW','經濟部規劃的 2030 年地熱累計裝置容量']],
note:'說明：本集為教育用途示意動畫，設備外觀、井深與地層比例經過壓縮調整。清水地熱電廠 4.2 MW、熱源約 150°C、ORC 取熱不取水與機組可用率約 95% 取自中央社、工商時報等報導；大屯火山 293°C 與酸性流體 pH 1.3–3.9 取自國科會科技大觀園與大屯火山觀測站資料；淺層 989 MW、深層約 32 GW 潛能及 2030 年 200 MW、2050 年 6 GW 願景取自經濟部能源署與行政院「地熱減碳旗艦行動計畫」。地溫曲線、閃化式與雙循環的適用溫度、回注溫度與電廠配置為文獻常見範圍的典型範例，實際數值依各案場而定。',
base:()=>geoBase(0),
shots:[
{t:'一座地熱電廠',en:'A geothermal power plant',dur:12,side:true,
 d:'地熱電廠看起來不大，真正的主角藏在地下。生產井深入約兩千公尺的地熱儲集層，把高溫熱水抽到地面；熱水在熱交換器把熱交給發電系統，推動汽輪機與發電機產生電力，再經變電站送上電網。放完熱、溫度降低的地熱水不排放，而是由回注井送回地下，讓儲集層保持水量與壓力。整套系統全天運轉，不受日照與風速影響。',
 s:[[0,'生產井從地下儲集層抽出高溫熱水'],[.26,'熱水在熱交換器把熱交給發電系統'],[.52,'汽輪機帶動發電機，電力送上電網'],[.76,'降溫後的地熱水由回注井送回地下']],
 cam:u=>camMix({x:800,y:470,s:1},{x:760,y:480,s:1.08},ease(seg(u,.1,.6))),
 draw(u){
  plantDraw();reservoirGlow(1);
  flowDots(W_PROD(),6,HOT,band(u,.02,1),.3,3.5);flowDots(P_PROD(),6,HOT,band(u,.08,1),.35);
  flowDots(P_WF(),3,WF,band(u,.26,1),.5,3.5);flowDots(P_ACC(),4,WF,band(u,.3,1),.4,3.5);flowDots(P_RET(),4,WF,band(u,.3,1),.4,3.5);
  flowDots(P_PWR(),5,PWR,band(u,.5,1),.5,3.5);flowDots(P_GRID(),6,PWR,band(u,.54,1),.35,3.5);
  flowDots(P_BRINE(),9,COOL,band(u,.74,1),.2);flowDots(W_REIN(),6,COOL,band(u,.78,1),.3,3.5);
  lab(PWX,gyy(PWX)-64,'生產井',{dx:-20,dy:-110,st:'s',a:band(u,.02,.3)});
  lab(PWX+40,gyy(PWX)+220,'地熱儲集層',{dx:60,dy:-40,st:'w',a:band(u,.04,.3)});
  lab(HXX+60,gyy(HXX+60)-98,'熱交換器',{dx:90,dy:-60,st:'s',a:band(u,.26,.55)});
  lab(PHX+PHW/2,gyy(PHX)-PHH-26,'發電機房',{dx:40,dy:-90,a:band(u,.5,.78)});
  lab(SSX+49,gyy(SSX)-74,'變電站',{dx:-60,dy:-60,st:'s',a:band(u,.52,.78)});
  lab(RWX,gyy(RWX)-40,'回注井',{dx:20,dy:-110,st:'g',a:band(u,.76,1)});
 },
 hud(u){hudPanel(240,150,'地熱電廠（示例）',seg(u,.05,.1),w=>{const t=lerp(25,150,ease(seg(u,.04,.24))),p=4.2*ease(seg(u,.48,.66));
  hrow(56,'井口溫度',Math.round(t)+'°C',w,HOT);hrow(88,'發電',p.toFixed(1)+' MW',w,PWR);hrow(120,'回注',u>.76?'運轉中':'—',w,COOL);});}},

{t:'地下的熱從哪裡來',en:'Where the heat comes from',dur:13,
 d:'地球內部的熱主要來自岩石中放射性元素衰變與地球形成時留下的熱，一般地區每往下一公里，溫度約升高 25 到 30°C。在火山或板塊活動旺盛的地方，高溫岩體離地表較近，溫度上升得更快。地熱儲集層需要三個條件：熱源、有裂隙可讓熱水流動的岩層，以及上方不透水的蓋層把熱水封住；雨水沿斷層滲入地下，被加熱後形成熱水或蒸氣，部分沿裂隙冒出成為溫泉與噴氣孔。',
 s:[[0,'每往地下一公里，溫度約升高 25–30°C'],[.24,'雨水沿斷層滲入地下，被熱源加熱'],[.5,'不透水的蓋層把熱水封在儲集層裡'],[.74,'火山與板塊活動區，地下溫度升得更快']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'地熱儲集層的三個條件',20,'#f2c230',700);
  const X0=90,X1=750;
  box(X0,280,X1-X0,80,'#5b4e42');box(X0,360,X1-X0,90,'#6f5c4a');box(X0,450,X1-X0,150,'#7a4b3a');
  const hg=ctx.createLinearGradient(0,600,0,780);hg.addColorStop(0,'#b8431f');hg.addColorStop(1,'#e8572a');ctx.fillStyle=hg;ctx.fillRect(X0,600,X1-X0,180);
  ln([X0,280,X1,280],'#7a9a55',4);
  const R=rng(4);for(let i=0;i<14;i++){const x=X0+30+R()*600,y=470+R()*110;ln([x,y,x+14+R()*20,y+8+R()*16],'rgba(0,0,0,.35)',2);}
  /* 斷層與雨水 */
  ctx.setLineDash([8,6]);ln([200,280,330,600],'rgba(227,236,238,.7)',2);ctx.setLineDash([]);
  const ra=band(u,.22,1);if(ra>0){for(let i=0;i<12;i++){const p=(TT*.8+i/12)%1;alphaDo(ra,()=>ln([140+i*14,228+p*40,136+i*14,240+p*40],'#7dc8dc',2));}
   flowDots([[200,282],[330,600],[480,560]],6,COOL,ra,.25,5);}
  /* 熱源上升 */
  const ha=seg(u,.02,.1);for(let i=0;i<6;i++){const x=150+i*105,p=(TT*.35+i*.17)%1;alphaDo(ha*(1-p),()=>arrow(x,760-p*40,x,720-p*40,'#f2c230',3));}
  /* 儲集層熱水 */
  const wa=seg(u,.5,.58);if(wa>0){const R2=rng(8);for(let i=0;i<26;i++){const x=X0+20+R2()*620,y=466+R2()*120;alphaDo(wa*(.5+.5*Math.sin(TT*2+i)),()=>circ(x,y,4,HOT));}}
  /* 溫泉 */
  const sa=seg(u,.74,.8);if(sa>0){ln([610,450,640,360,650,282],'rgba(255,157,122,.9)',3);for(let i=0;i<5;i++){const p=(TT*.5+i/5)%1;alphaDo(sa*(1-p),()=>circ(650+8*Math.sin(p*6+i),272-p*60,8+p*10,'rgba(255,255,255,.5)'));}}
  wt(X1-14,322,'地表',17,'rgba(227,236,238,.9)',600,'right');
  alphaDo(seg(u,.5,.56),()=>wt(X1-14,412,'蓋層（不透水）',18,'#fff',700,'right'));
  alphaDo(seg(u,.5,.56),()=>wt(X1-14,530,'儲集層（裂隙岩層）',18,'#fff',700,'right'));
  wt(X1-14,700,'熱源（高溫岩體）',18,'#fff',700,'right');
  alphaDo(ra,()=>wt(320,262,'雨水補注',18,'#7dc8dc',700,'left'));
  alphaDo(sa,()=>wt(560,254-10,'溫泉、噴氣孔',17,'#ff9d7a',700,'right'));
  /* 右：地溫曲線 */
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(844,196,'地溫隨深度增加（示意）',20,'#f2c230',700);
  const PX0=930,PX1=1500,PY0=250,PY1=720,TX=t=>PX0+t/300*(PX1-PX0),DY=d=>PY0+d/3*(PY1-PY0);
  ln([PX0,PY0,PX1,PY0],'rgba(227,236,238,.7)',1.5);ln([PX0,PY0,PX0,PY1],'rgba(227,236,238,.7)',1.5);
  [0,100,200,300].forEach(t=>{ln([TX(t),PY0,TX(t),PY1],'rgba(255,255,255,.07)',1);wt(TX(t),PY0-12,t+'',17,'rgba(227,236,238,.85)',600,'center',COND);});
  [0,1,2,3].forEach(d=>{ln([PX0,DY(d),PX1,DY(d)],'rgba(255,255,255,.07)',1);wt(PX0-12,DY(d)+6,d+' km',17,'rgba(227,236,238,.85)',600,'right',COND);});
  wt(PX1,PY1+44,'溫度（°C）　深度（km）',16,'rgba(227,236,238,.75)',500,'right');
  const curve=(fn,f)=>{const P=[];for(let i=0;i<=30;i++){const d=3*i/30;P.push({x:TX(fn(d)),y:DY(d)});}return partial(P,f);};
  const C=[[d=>25+28*d,'一般地區 約 28°C/km','rgba(227,236,238,.9)',.04,[1.9,1.6]],[d=>25+62*d-4*d*d,'地熱區 2 km 約 150°C','#7dffc4',.3,[2.75,2.0]],[d=>25+190*d-45*d*d,'火山區 可達約 290°C','#ff8a60',.74,[1.0,1.0]]];
  C.forEach(([fn,n,col,t0,[dl]])=>{const f=ease(seg(u,t0,t0+.18));if(f<=0)return;pathLine(curve(fn,f),col,3);
   alphaDo(seg(u,t0+.14,t0+.2),()=>{const x=TX(fn(dl)),y=DY(dl);circ(x,y,5,col);wt(x+12,y-10,n,17,col,700,'left');});});
 }},

{t:'生產井與回注井',en:'Production and injection wells',dur:13,side:true,
 d:'地熱井的鑽法和石油井相似，鑽到約兩千公尺深，井內下鋼製套管並灌注水泥固定，防止熱水流失或汙染淺層地下水。生產井常以傾斜方式穿過更多裂隙，增加出水量。熱水上升時壓力降低，要控制井口壓力與流量，避免結垢堵塞。放熱後的地熱水由回注井送回儲集層，距離生產井要夠遠，讓回注水在地下重新被加熱，同時補充水量、維持壓力，也避免地層下陷。',
 s:[[0,'剖開地面：兩口井深入約 2000 m 的儲集層'],[.25,'鋼製套管與水泥固定井壁，保護地下水'],[.5,'熱水從生產井上升到地面'],[.74,'回注水在地下重新加熱，維持儲集層壓力']],
 cam:u=>camMix({x:800,y:470,s:1},{x:660,y:640,s:1.3},ease(seg(u,.02,.22))),
 draw(u){
  plantDraw();reservoirGlow(1);
  const ca=band(u,.25,.5);
  if(ca>0){[W_PROD(),W_REIN()].forEach(P=>alphaDo(ca,()=>{pl(P,'#f2c230',18);pl(P,'#aeb8be',12);pl(P,'#2a3a46',8);}));}
  flowDots(W_PROD(),7,HOT,band(u,.48,1),.3,3.5);flowDots(P_PROD(),6,HOT,band(u,.5,1),.35);
  flowDots(P_BRINE(),9,COOL,band(u,.7,1),.2);flowDots(W_REIN(),7,COOL,band(u,.72,1),.3,3.5);
  const fa=band(u,.74,1);if(fa>0){const P=R_FLOW();for(let k=0;k<9;k++){const f=((TT*.12)+k/9)%1,p=ptAt(P,f);alphaDo(fa,()=>circ(p[0],p[1],5,f<.45?COOL:HOT));}}
  lab(PWX+60,gyy(PWX)+240,'生產井',{dx:-40,dy:-60,st:'s',a:band(u,.02,1)});
  lab(RWX-60,gyy(RWX)+250,'回注井',{dx:60,dy:-50,st:'g',a:band(u,.02,1)});
  lab(PWX,gyy(PWX)+60,'套管與水泥',{dx:120,dy:-30,a:band(u,.25,.5)});
  lab(700,gyy(700)+100,'蓋層',{dx:0,dy:-40,a:band(u,.25,.5),minor:true});
  lab(700,870,'重新加熱',{dx:0,dy:-50,st:'w',a:band(u,.76,1)});
 },
 hud(u){hudPanel(240,150,'地熱井（示例）',seg(u,.05,.1),w=>{const d=Math.round(2000*ease(seg(u,.02,.2)));
  hrow(56,'井深',d+' m',w,'#fff');hrow(88,'出水溫度',u>.5?'約 150°C':'—',w,HOT);hrow(120,'回注溫度',u>.72?'約 90°C':'—',w,COOL);});}},

{t:'閃化式發電',en:'Flash steam power',dur:13,
 d:'溫度較高、約 180°C 以上的地熱田，多採用閃化式發電。地下的高溫熱水承受很高的壓力，抽到地面減壓時，一部分會瞬間沸騰成蒸氣，稱為閃化。汽水分離器把蒸氣和熱水分開，蒸氣推動汽輪機帶動發電機，用過的蒸氣在冷凝器凝結成水，經冷卻塔散熱；分離出的熱水與冷凝水再一起回注地下。印尼、菲律賓與紐西蘭的大型地熱電廠多屬這一類。',
 s:[[0,'高壓熱水從生產井抽到地面'],[.22,'減壓時部分熱水瞬間沸騰成蒸氣'],[.42,'蒸氣推動汽輪機，帶動發電機'],[.62,'冷凝器把蒸氣變回水，冷卻塔散熱'],[.8,'熱水與冷凝水一起回注地下']],
 draw(u){
  diagBG();
  card(900,158,640,112,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});
  wt(924,200,'適用：約 180°C 以上的高溫地熱田',19,'#f2c230',700);wt(924,240,'熱水減壓 → 部分急速汽化（閃化）',18,'#fff',600);
  ln([80,740,1520,740],'rgba(227,236,238,.6)',2);box(80,742,1440,58,'rgba(122,75,58,.35)');
  const step=u<.22?0:u<.42?1:u<.62?2:u<.8?3:4,cc=i=>i===step?'#f2c230':'rgba(227,236,238,.85)';
  /* 生產井、分離器 */
  box(150,470,20,330,'#8d989f');box(154,470,12,330,'#2a3a46');
  rrp(290,330,80,180,30);ctx.fillStyle='#dfe5e8';ctx.fill();ctx.strokeStyle=step===1?'#f2c230':'rgba(0,0,0,.3)';ctx.lineWidth=step===1?3:1;ctx.stroke();
  /* 汽輪機與發電機 */
  poly([560,320,720,290,720,410,560,380],'#aeb8be',step===2?'#f2c230':'rgba(0,0,0,.3)',step===2?3:1);
  const rot=TT*6*seg(u,.42,.5);for(let i=0;i<6;i++){const x=580+i*24,s=Math.abs(Math.sin(rot+i));ln([x,350-24*s-i*3,x,350+24*s+i*3],'#5c6770',3);}
  ln([720,350,760,350],'#5c6770',6);box(760,310,110,80,'#1f7f99',step===2?'#f2c230':'rgba(0,0,0,.3)',step===2?3:1);
  /* 冷凝器、冷卻塔 */
  box(580,470,120,70,'#8d989f',step===3?'#f2c230':'rgba(0,0,0,.3)',step===3?3:1);
  poly([960,560,985,440,975,340,1115,340,1105,440,1130,560],'#c9d1d6',step===3?'#f2c230':'rgba(0,0,0,.3)',step===3?3:1);
  if(u>.62)for(let i=0;i<4;i++){const p=(TT*.4+i/4)%1;alphaDo(seg(u,.62,.68)*(1-p),()=>circ(1045+10*Math.sin(p*5+i),330-p*90,16+p*18,'rgba(255,255,255,.4)'));}
  /* 回注井 */
  box(1270,640,20,160,'#8d989f');box(1274,640,12,160,'#2a3a46');
  /* 流動 */
  const Pp=[[160,800],[160,450],[290,450]],Ps=[[330,330],[330,292],[520,292],[520,350],[560,350]],Pe=[[640,410],[640,470]],Pc=[[700,505],[960,505]],Pt=[[1045,560],[1045,640],[1280,640]],Pb=[[330,510],[330,690],[1280,690]],Pr=[[1280,640],[1280,800]];
  [Pp,Ps,Pe,Pc,Pt,Pb].forEach(P=>pl(P,'rgba(141,152,159,.8)',6));
  flowDots(Pp,6,HOT,seg(u,.02,.08),.35,6);
  flowDots(Ps,6,'#ffffff',seg(u,.24,.3),.4,6);
  flowDots(Pb,8,HOT,seg(u,.24,.3),.2,6);
  flowDots(Pe,2,'#ffffff',seg(u,.44,.5),.4,5);flowDots(Pc,4,COOL,seg(u,.62,.68),.35,6);flowDots(Pt,4,COOL,seg(u,.8,.86),.35,6);flowDots(Pr,4,COOL,seg(u,.8,.86),.35,6);
  if(u>.22){const R=rng(3);for(let i=0;i<10;i++){const p=(TT*.6+R())%1;alphaDo(seg(u,.22,.28)*(1-p),()=>circ(300+R()*60,500-p*150,4+p*3,'rgba(255,255,255,.1)','#fff',1.5));}}
  alphaDo(seg(u,.44,.5),()=>{for(let i=0;i<3;i++){const p=(TT*1.2+i/3)%1;ln([900,318+i*14,900+22*p,318+i*14],PWR,3);}});
  wt(160,440-10,'生產井',18,cc(0),700,'center');wt(330,550,'汽水分離器',18,cc(1),700,'left');
  wt(640,270,'汽輪機',18,cc(2),700,'center');wt(815,420,'發電機',18,cc(2),700,'center');
  wt(640,580,'冷凝器',18,cc(3),700,'center');wt(1045,600,'冷卻塔',18,cc(3),700,'center');wt(1280,620,'回注井',18,cc(4),700,'center');
  alphaDo(seg(u,.24,.3),()=>{wt(420,286,'蒸氣',17,'#fff',700,'left');wt(420,682,'熱水',17,HOT,700,'left');});
 }},

{t:'雙循環發電',en:'Binary cycle (ORC)',dur:14,
 d:'溫度約 100 到 180°C 的中低溫地熱，常用雙循環發電，也稱有機朗肯循環（ORC）。地熱水只在熱交換器裡把熱傳給另一套封閉迴路中的工作流體，例如沸點約 28°C 的異戊烷；工作流體受熱汽化，推動渦輪與發電機，再到氣冷式冷凝器冷凝，由泵送回熱交換器。地熱水不接觸渦輪，放熱後全部回注，稱為「取熱不取水」。宜蘭清水地熱電廠就是採用這種方式。',
 s:[[0,'地熱水進入熱交換器，只交出熱量'],[.24,'工作流體沸點低，受熱就汽化'],[.46,'工作流體蒸氣推動渦輪與發電機'],[.66,'氣冷式冷凝器把工作流體冷凝，泵送回去'],[.84,'地熱水全部回注：取熱不取水']],
 draw(u){
  diagBG();
  card(900,158,640,112,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});
  wt(924,200,'適用：約 100–180°C 的中低溫地熱',19,'#f2c230',700);wt(924,240,'工作流體沸點低（異戊烷約 28°C）',18,'#fff',600);
  ln([80,700,760,700],'rgba(227,236,238,.6)',2);box(80,702,680,98,'rgba(122,75,58,.35)');
  const step=u<.24?0:u<.46?1:u<.66?2:u<.84?3:4,hi=i=>i===step?'#f2c230':'rgba(0,0,0,.3)',lw=i=>i===step?3:1,cc=i=>i===step?'#f2c230':'rgba(227,236,238,.85)';
  box(140,420,20,380,'#8d989f');box(144,420,12,380,'#2a3a46');box(550,600,20,200,'#8d989f');box(554,600,12,200,'#2a3a46');
  /* 熱交換器 */
  rrp(300,380,200,150,16);ctx.fillStyle='#dfe5e8';ctx.fill();ctx.strokeStyle=step<=1?'#f2c230':'rgba(0,0,0,.3)';ctx.lineWidth=step<=1?3:1;ctx.stroke();
  const zz=[];for(let i=0;i<=8;i++)zz.push(330+i*18,i%2?500:410);ln(zz,HOT,4);
  /* 渦輪、發電機 */
  poly([700,330,840,300,840,420,700,390],'#aeb8be',hi(2),lw(2));
  const rot=TT*6*seg(u,.46,.54);for(let i=0;i<5;i++){const x=720+i*26,s=Math.abs(Math.sin(rot+i));ln([x,360-22*s-i*4,x,360+22*s+i*4],'#5c6770',3);}
  ln([840,360,870,360],'#5c6770',6);box(870,320,110,80,'#1f7f99',hi(2),lw(2));
  /* 氣冷式冷凝器 */
  box(1070,330,300,90,'#c9d1d6',hi(3),lw(3));for(let i=0;i<4;i++){const cx=1110+i*74,s=Math.abs(Math.cos(TT*6+i));box(cx-26,312,52,6,'#8d989f');ln([cx-24*s,306,cx+24*s,306],'#44535c',3);}
  for(let i=0;i<4;i++){const p=(TT*.5+i/4)%1;alphaDo(seg(u,.66,.72)*(1-p),()=>arrow(1110+i*74,300-p*30,1110+i*74,280-p*30,'rgba(255,157,122,.9)',3));}
  /* 泵 */
  circ(860,620,26,'#1f7f99',hi(3),lw(3));const pa=TT*5;ln([860,620,860+18*Math.cos(pa),620+18*Math.sin(pa)],'#fff',3);
  /* 流動路徑 */
  const Gin=[[150,800],[150,400],[300,400]],Gout=[[400,530],[400,600],[560,600],[560,800]];
  const W1=[[500,400],[620,400],[620,360],[700,360]],W2=[[800,410],[800,470],[1100,470],[1100,420]],W3=[[1300,420],[1300,620],[886,620]],W4=[[834,620],[640,620],[640,500],[500,500]];
  [Gin,Gout].forEach(P=>pl(P,'rgba(141,152,159,.8)',6));[W1,W2,W3,W4].forEach(P=>pl(P,'rgba(179,124,255,.45)',6));
  flowDots(Gin,6,HOT,seg(u,.02,.08),.35,6);flowDots(Gout,6,COOL,seg(u,.06,.12),.3,6);
  flowDots(W4,5,WF,seg(u,.24,.3),.35,5);flowDots(W1,4,'#d9b8ff',seg(u,.3,.36),.45,6);flowDots(W2,6,'#d9b8ff',seg(u,.48,.54),.35,6);flowDots(W3,6,WF,seg(u,.66,.72),.35,5);
  alphaDo(seg(u,.46,.52),()=>{for(let i=0;i<3;i++){const p=(TT*1.2+i/3)%1;ln([1010,328+i*14,1010+22*p,328+i*14],PWR,3);}});
  wt(150,390-10,'生產井',18,cc(0),700,'center');wt(580,660,'回注井',18,cc(4),700,'left');wt(400,560,'熱交換器（蒸發器）',18,step<=1?'#f2c230':'rgba(227,236,238,.85)',700,'center');
  wt(770,285,'渦輪',18,cc(2),700,'center');wt(925,430,'發電機',18,cc(2),700,'center');wt(1220,452,'氣冷式冷凝器',18,cc(3),700,'center');wt(860,672,'工作流體泵',18,cc(3),700,'center');
  alphaDo(seg(u,.24,.3),()=>{wt(580,470,'工作流體',17,'#d9b8ff',700,'center');});
  alphaDo(seg(u,.84,.9),()=>{card(900,700,640,100,{bg:'rgba(125,255,196,.12)',st:'rgba(125,255,196,.6)'});wt(1220,742,'取熱不取水',22,'#7dffc4',700,'center');wt(1220,778,'地熱水不接觸渦輪，全部回注地下',17,'#fff',600,'center');});
 }},

{t:'台灣的地熱',en:'Geothermal energy in Taiwan',dur:14,
 d:'台灣位在歐亞板塊與菲律賓海板塊交界，地熱資源豐富。北部大屯火山群的地下熱水溫度最高約 293°C，但多為酸性流體，pH 約 1.3 到 3.9，會腐蝕管線，是開發的主要難題。宜蘭清水地熱屬中低溫熱水，約 150°C，2021 年起以 4.2 MW 的雙循環機組商轉。工研院估計深度 3 公里內的淺層地熱潛能約 989 MW，更深的深層地熱約 32 GW；經濟部規劃 2030 年累計 200 MW，2050 年願景 6 GW。',
 s:[[0,'台灣位在板塊交界，地熱資源豐富'],[.22,'大屯火山群溫度高，但流體呈強酸性'],[.44,'宜蘭清水以雙循環機組商轉'],[.66,'淺層潛能約 989 MW，深層約 32 GW'],[.84,'目標 2030 年累計 200 MW']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'主要地熱區（示意）',20,'#f2c230',700);
  const MX=l=>150+(l-120)*155,MY=a=>190+(25.4-a)*170;
  const TW=[[121.5,25.3],[121.9,25.12],[122.0,25.0],[121.85,24.6],[121.8,24.3],[121.6,23.9],[121.5,23.4],[121.3,22.9],[121.0,22.6],[120.85,21.92],[120.7,22.0],[120.6,22.3],[120.3,22.55],[120.15,22.9],[120.1,23.1],[120.15,23.5],[120.3,23.9],[120.6,24.3],[120.8,24.6],[121.0,24.9],[121.2,25.1],[121.4,25.25]];
  const pts=[];TW.forEach(([l,a])=>pts.push(MX(l),MY(a)));poly(pts,'rgba(122,154,85,.55)','rgba(227,236,238,.7)',2);
  alphaDo(seg(u,.02,.08)*.6,()=>poly([MX(121.35),MY(24.8),MX(121.55),MY(24.6),MX(121.35),MY(23.2),MX(121.0),MY(22.7),MX(120.9),MY(22.9),MX(121.15),MY(23.6)],'rgba(242,194,48,.25)','rgba(242,194,48,.5)',1.5));
  alphaDo(seg(u,.04,.1),()=>wt(MX(120.35),MY(23.5),'中央山脈',16,'rgba(227,236,238,.75)',600,'center'));
  const mk=(l,a,col,t0,name,l1,l2,cy)=>{const k=seg(u,t0,t0+.06);if(k<=0)return;const x=MX(l),y=MY(a),p=(TT*.8)%1;
   alphaDo(k,()=>{alphaDo(1-p,()=>ring(x,y,8+16*p,col,2));circ(x,y,8,col);ln([x+10,y,480,cy],col,1.5);
    card(480,cy-50,270,100,{bg:'rgba(7,27,39,.9)',st:col});wt(496,cy-18,name,19,col,700);wt(496,cy+12,l1,17,'#fff',600);wt(496,cy+38,l2,16,'rgba(227,236,238,.85)',500);});};
  mk(121.55,25.18,'#ff8a60',.22,'大屯火山群','最高約 293°C','強酸性 pH 1.3–3.9',250);
  mk(121.63,24.6,'#7dffc4',.44,'宜蘭清水','約 150°C、4.2 MW','2021 年起商轉',420);
  alphaDo(seg(u,.02,.08),()=>{wt(560,640,'歐亞板塊與菲律賓海板塊交界',16,'rgba(227,236,238,.8)',500,'center');arrow(620,680,560,680,'rgba(227,236,238,.6)',2);arrow(500,720,560,720,'rgba(227,236,238,.6)',2);});
  /* 右：潛能與目標 */
  const R=[['淺層地熱潛能','989 MW','深度 3 公里內',.66,'#7dc8dc',989],['深層地熱潛能','約 32 GW','深度超過 3 公里',.72,'#ff8a60',32],['2030 年目標','200 MW','累計裝置容量',.84,'#f2c230',200],['2050 年願景','6 GW','累計裝置容量',.9,'#7dffc4',6]];
  R.forEach(([t,v,s,t0,col,n],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=160+i*162;card(820,y,720,146,{bg:'rgba(7,27,39,.75)'});box(820,y,8,146,col);wt(850,y+44,t,19,'rgba(227,236,238,.9)',600);
   const k=ease(seg(u,t0,t0+.1)),num=trf(v.replace(/[\d]+/,'{n}'),{n:Math.round(+v.match(/\d+/)[0]*k)});wt(850,y+106,num,42,col,700,'left',COND);wt(1510,y+106,s,17,'rgba(227,236,238,.8)',500,'right');}));
 }},

{t:'穩定的基載電力',en:'Steady baseload power',dur:12,side:true,
 base:()=>geoBase(.75),
 d:'地熱電廠不受晝夜與天氣影響，清水地熱機組的可用率約 95%，可以當作基載電力，和隨天候變動的太陽光電、風電互補。開發也有挑戰：地熱水含有礦物質，降溫時容易在管線結垢，早年清水的試驗電廠就曾因結垢與產量衰退停機；酸性流體會腐蝕套管；鑽井成本高、探勘有失敗風險；溫泉區也需要與地方溝通。持續回注與監測，是讓地熱長期運轉的關鍵。',
 s:[[0,'入夜後，地熱電廠照樣穩定發電'],[.24,'礦物質在管線結垢，需要定期清除'],[.48,'酸性流體會腐蝕套管與管線'],[.72,'持續回注與監測，維持儲集層長期運轉']],
 draw(u){
  plantDraw();reservoirGlow(1);plantFlows(1);
  lab(HXX+10,gyy(PWX)-112,'結垢',{dx:70,dy:-50,st:'w',a:band(u,.22,.5)});
  lab(PWX,gyy(PWX)+100,'酸性腐蝕',{dx:90,dy:-20,st:'w',a:band(u,.46,.72)});
  lab(RWX-20,gyy(RWX)+200,'回注維持壓力',{dx:-60,dy:-60,st:'g',a:band(u,.7,1)});
  lab(TWX,gyy(TWX)-190,'基載電力',{dx:-80,dy:-50,st:'s',a:band(u,.02,.3)});
 },
 hud(u){hudPanel(240,170,'今日運轉（示例）',seg(u,.05,.1),w=>{const e=4.2*24*ease(seg(u,.05,.95));
  hrow(56,'輸出',(4.2-.05*Math.sin(TT)).toFixed(2)+' MW',w,PWR);hrow(88,'今日發電',trf('{n} MWh',{n:e.toFixed(1)}),w,'#fff');hbar(14,100,w-28,e/100.8,PWR);hrow(140,'可用率','約 95%',w,'#7dffc4');});}}
]};
