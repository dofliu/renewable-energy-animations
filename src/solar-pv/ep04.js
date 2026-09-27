// KITS: land
/* 太陽光電系列 第 4 集：漁電共生 */
const PX0=230,PX1=1370,WL=624,PB=735;                    // 魚塭：左右塭堤、水面、池底
const CX=[355,605,855,1105],PT=432,PW=112;               // 立柱位置、模組下緣高度、模組寬
const E_Y='#f2c230',E_G='#7dffc4',E_W='#e8572a';
const gyy=x=>groundY(x);
const FISH=(()=>{const r=rng(41),a=[];for(let i=0;i<16;i++)a.push({o:r()*1000,y:WL+22+r()*(PB-WL-44),sp:14+r()*22,d:r()<.5?1:-1,s:.8+r()*.5});return a;})();
function waterX(y,left){const t=(y-600)/(PB-600);return left?lerp(PX0-10,PX0+50,t):lerp(PX1+10,PX1-50,t);}
function pondBase(o){o=o||{};
 landSky(GY,{sun:o.sun||{x:1280,y:120},dusk:o.dusk||0,clouds:o.clouds});drawGround();
 poly([PX0-10,gyy(PX0-10),PX0+50,PB,PX1-50,PB,PX1+10,gyy(PX1+10)],'#6b5a45');
 const g=ctx.createLinearGradient(0,WL,0,PB);g.addColorStop(0,'#5aa596');g.addColorStop(1,'#2a615c');
 ctx.beginPath();ctx.moveTo(waterX(WL,true),WL);for(let x=waterX(WL,true);x<=waterX(WL,false);x+=8)ctx.lineTo(x,WL+1.5*Math.sin(x*.05-TT*2));
 ctx.lineTo(waterX(WL,false),WL);ctx.lineTo(PX1-50,PB);ctx.lineTo(PX0+50,PB);ctx.closePath();ctx.fillStyle=g;ctx.fill();
 ln([waterX(WL,true),WL,waterX(WL,false),WL],'rgba(255,255,255,.5)',1.5);
 box(PX0+50,PB,PX1-PX0-100,6,'#54473a');
}
function fishes(a){alphaDo(a===undefined?1:a,()=>{const L=PX1-PX0-160;FISH.forEach(f=>{let p=(f.o+TT*f.sp)%L;const x=f.d>0?PX0+80+p:PX1-80-p,y=f.y+4*Math.sin(TT+f.o);
 ctx.save();ctx.translate(x,y);ctx.scale(f.d*f.s,f.s);ctx.beginPath();ctx.ellipse(0,0,11,4,0,0,TAU);ctx.fillStyle='rgba(210,222,226,.8)';ctx.fill();poly([-9,0,-16,-5,-16,5],'rgba(210,222,226,.8)');ctx.restore();});});}
function panelAt(x,y,w,glint){ctx.save();ctx.translate(x,y);ctx.rotate(12*Math.PI/180);box(-w/2,-7,w,7,'#1f3f66','rgba(0,0,0,.4)',1);
 ctx.strokeStyle='rgba(160,200,240,.5)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<6;i++){ctx.moveTo(-w/2+w*i/6,-7);ctx.lineTo(-w/2+w*i/6,0);}ctx.stroke();
 box(-w/2,-7,w,1.5,glint?'#fff':'#9fc3e6');ctx.restore();}
/* 立柱式陣列：a 透明度，n 已完成的排數 */
function pvArray(a,n){if(n===undefined)n=CX.length;alphaDo(a===undefined?1:a,()=>{
 CX.slice(0,n).forEach(x=>{alphaDo(.5,()=>box(x-60,WL+1,104,5,'rgba(0,0,0,.25)'));
  ln([x-34,PB,x-34,PT+14],'#8a99a3',6);ln([x+34,PB,x+34,PT-2],'#8a99a3',6);box(x-40,PB-4,12,6,'#5d6a72');box(x+28,PB-4,12,6,'#5d6a72');
  panelAt(x,PT,PW,Math.sin(TT*1.3+x)>.96);});
 if(n>1)ln([CX[0]-34,PT+36,CX[n-1]+34,PT+36],'#6f7d86',3);});}
function aerator(x){box(x-20,WL-7,40,9,'#e9e2cf','rgba(0,0,0,.35)',1);box(x-4,WL-18,8,11,'#394650');
 const cx=x+26,cy=WL-2,r=13;ring(cx,cy,r,'#dfe5e8',2);for(let k=0;k<6;k++){const an=TT*5+k*TAU/6;ln([cx,cy,cx+Math.cos(an)*r,cy+Math.sin(an)*r],'#dfe5e8',2.5);}
 for(let k=0;k<5;k++){const f=(TT*1.5+k/5)%1;alphaDo(1-f,()=>circ(cx+18+f*30,WL-6-10*Math.sin(f*Math.PI),2.4,'#e8f7f8'));}}
function feeder(x,on){const y=gyy(x);box(x-14,y-46,28,34,'#dfe5e8','rgba(0,0,0,.3)',1);ln([x,y-12,x,y],'#394650',4);poly([x+14,y-36,x+30,y-40,x+30,y-30,x+14,y-28],'#8d989f');
 if(on>0)for(let k=0;k<10;k++){const f=(TT*.9+k/10)%1,px=x+30+f*(160+(k%3)*40),py=y-36-90*f+150*f*f;if(py<WL)alphaDo(on*(1-f*.4),()=>circ(px,py,2.2,'#c79a54'));}}
function raft(x,col){const y=WL+1.5*Math.sin(TT*2+x*.02);poly([x-44,y-6,x+44,y-6,x+36,y+4,x-36,y+4],'#d9d2bd','rgba(0,0,0,.35)',1);person(x+8,y-6,col||'#1f7f99',4);}
function invBox(){const x=70,y=gyy(95);box(x,y-62,52,62,'#dfe5e8','rgba(0,0,0,.3)',1);box(x+8,y-50,36,10,'#2b3137');circ(x+40,y-24,3,E_G);}
/* 沿折線取比例 f 的點 */
function partialPt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
 let r=f*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,sp,col,a,r){if(a<=0)return;for(let k=0;k<n;k++){const f=(TT*sp+k/n)%1,p=partialPt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4,col));}}
/* 圖解用的迷你魚塭剖面 */
function miniPond(x,y,w){poly([x,y,x+22,y+46,x+w-22,y+46,x+w,y],'#2f6f69');ln([x+6,y+10,x+w-6,y+10],'rgba(255,255,255,.4)',1.2);box(x-40,y-2,40,4,'#7a9a55');box(x+w,y-2,40,4,'#7a9a55');}
function miniPanel(x,y,w){ctx.save();ctx.translate(x,y);ctx.rotate(12*Math.PI/180);box(-w/2,-6,w,6,'#1f3f66');box(-w/2,-6,w,1.5,'#9fc3e6');ctx.restore();}

const EP={no:4,slug:'solar-pv',seriesName:'太陽光電系列',t:'漁電共生',en:'Aquavoltaics: fish farms with solar',
lede:'台灣西南沿海有大片魚塭，漁電共生是在不放棄養殖的前提下，把太陽光電架在魚塭上方或塭堤上。這一集看支架要多高才不妨礙作業、遮蔽率 40% 怎麼算、遮蔭對池水有什麼影響，以及漁民、地主與光電業者如何一起經營。',
facts:[['40','%','地面型漁電共生：光電等農業設施面積不得超過申請農地的 40%'],
['80','%','室內養殖的屋頂型光電：建築設施面積上限'],
['7','成','養殖產量須達該魚種近 3 年統計平均的 7 成，才算維持養殖事實'],
['3','m','支架建議淨高 3 公尺以上，讓收成機具與工作膠筏進出'],
['4–10','m','塭堤型支架的建議結構跨距'],
['約 100','萬度','每公頃魚塭光電一年的發電量（示例）']],
note:'說明：本集為教育用途示意動畫，魚塭、支架與人物比例經過調整。設施面積 40%／80% 與產量 7 成的判定依農業部「申請農業用地作農業設施容許使用審查辦法」及各縣市漁電共生專區說明；支架淨高 3 公尺以上、塭堤型跨距 4–10 公尺為工研院於能源署能源知識庫的設計建議；遮蔽率 40% 下主要魚種可維持約 7 成產能為水產試驗所試驗結果。1 公頃案場 0.8 MWp、年發電約 1,250 度／kWp、養殖月曆與產量比例皆為典型範例，實際以各案場經營計畫與審查為準。',
base:()=>pondBase({clouds:false}),
shots:[
{t:'魚塭上的光電',en:'Solar above the fish pond',dur:13,side:true,
 d:'台灣西南沿海的魚塭地勢平坦、日照充足，是設置太陽光電的重要場址。漁電共生的原則是「養殖為本、綠能加值」：魚塭照常放養、投餌與收成，光電設施則架在池面上方或塭堤上。增氧水車持續攪動池水補充溶氧，魚群在模組的遮蔭下活動。以 1 公頃魚塭、光電面積 40% 估算，裝置容量約 0.8 MWp，這是典型範例，實際依模組與配置而定。',
 s:[[0,'西南沿海的魚塭，日照充足、地勢平坦'],[.28,'魚塭照常養殖，增氧水車持續攪動池水'],[.52,'光電模組架在池面上方的立柱上'],[.76,'養殖為本，光電是在魚塭上的加值']],
 cam:u=>camMix({x:800,y:450,s:1},{x:760,y:520,s:1.45},ease(seg(u,.3,.5))),
 draw(u){
  invBox();fishes();aerator(480);aerator(980);
  const k=ease(seg(u,.46,.62));pvArray(k,Math.ceil(4*k));
  lab(130,gyy(130),'塭堤',{dx:-10,dy:-80,a:band(u,.04,.3)});
  lab(700,680,'養殖池',{dx:40,dy:70,st:'l',a:band(u,.08,.34)});
  lab(506,WL-4,'增氧水車',{dx:-40,dy:-70,st:'g',a:band(u,.28,.54)});
  lab(700,690,'魚群',{dx:60,dy:50,a:band(u,.34,.56),minor:true});
  lab(CX[1]+34,560,'立柱式支架',{dx:40,dy:-40,a:band(u,.54,.8)});
  lab(CX[2],PT-6,'光電模組',{dx:-20,dy:-70,st:'s',a:band(u,.58,.84)});
  lab(96,gyy(96)-62,'變流器',{dx:30,dy:-60,a:band(u,.78,1),minor:true});
 },
 hud(u){hudPanel(250,150,'案場概況（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.46,.62));
  hrow(56,'魚塭面積','1 ha',w,'#fff');hrow(88,'光電面積',Math.round(40*k)+' %',w,'#f2c230');hrow(120,'裝置容量',(0.8*k).toFixed(2)+' MWp',w,'#7dffc4');});}},

{t:'三種設置方式',en:'Three ways to combine',dur:13,
 d:'漁電共生依光電的位置分成幾種型態。塭堤型把支架立在既有塭堤與堤路上，模組跨越池邊，池面大多保持開闊，結構跨距建議 4 到 10 公尺。池中立柱型把基樁打進池底，模組架在整個池面上方，考量收成機具進出，建議高度 3 公尺以上。室內養殖型則是在養殖場的屋頂設置光電，建築設施面積上限為 80%。三種都要和養殖戶事先溝通，避免影響放養與收成。',
 s:[[0,'依光電的位置，漁電共生分成幾種型態'],[.22,'塭堤型：支架立在塭堤上，池面保持開闊'],[.48,'池中立柱型：基樁打進池底，高度 3 公尺以上'],[.74,'室內養殖型：在養殖場屋頂設置光電']],
 draw(u){
  diagBG();
  const a1=seg(u,.18,.28),a2=seg(u,.44,.54),a3=seg(u,.7,.8);
  [[60,a1],[570,a2],[1080,a3]].forEach(([x,a],i)=>{alphaDo(.35+.65*a,()=>card(x,160,460,640,{bg:'rgba(7,27,39,.75)',st:a>.5?'rgba(242,194,48,.6)':'rgba(255,255,255,.16)'}));});
  /* 塭堤型 */
  alphaDo(.35+.65*a1,()=>{wt(84,200,'塭堤型',20,'#f2c230',700);
   miniPond(120,440,340);[[80,420],[500,420]].forEach(([x,y])=>{ln([x,y+18,x,y-120],'#8a99a3',5);});
   miniPanel(135,316,150);miniPanel(445,316,150);
   ctx.setLineDash([5,4]);ln([80,480,500,480],'rgba(242,194,48,.8)',1.5);ctx.setLineDash([]);
   wt(290,506,'跨距 4–10 m',17,'#f2c230',700,'center',COND);
   wt(84,580,'支架立在塭堤與堤路上',17,'#fff',500);wt(84,614,'池面大多保持開闊',17,'#fff',500);
   wt(84,648,'不影響池中作業',17,'#7dffc4',600);wt(84,760,'可設置量較少',16,'rgba(227,236,238,.75)',500);});
  /* 池中立柱型 */
  alphaDo(.35+.65*a2,()=>{wt(594,200,'池中立柱型',20,'#f2c230',700);
   miniPond(630,440,340);[700,800,900].forEach(x=>{ln([x,486,x,334],'#8a99a3',5);miniPanel(x,330,90);});
   ctx.setLineDash([5,4]);ln([985,440,985,338],'rgba(242,194,48,.8)',1.5);ctx.setLineDash([]);
   wt(995,398,'≥ 3 m',17,'#f2c230',700,'left',COND);
   wt(594,580,'基樁打進池底',17,'#fff',500);wt(594,614,'模組架在池面上方',17,'#fff',500);
   wt(594,648,'留出機具與膠筏空間',17,'#7dffc4',600);wt(594,760,'基樁位置需與養殖戶協調',16,'rgba(227,236,238,.75)',500);});
  /* 室內養殖型 */
  alphaDo(.35+.65*a3,()=>{wt(1104,200,'室內養殖型',20,'#f2c230',700);
   poly([1150,480,1150,380,1330,330,1510,380,1510,480],'#5b6770','rgba(255,255,255,.3)',1);
   ctx.save();ctx.translate(1240,352);ctx.rotate(-Math.atan2(50,180));box(-86,-8,172,8,'#1f3f66');box(-86,-8,172,1.5,'#9fc3e6');ctx.restore();
   ctx.save();ctx.translate(1420,352);ctx.rotate(Math.atan2(50,180));box(-86,-8,172,8,'#1f3f66');box(-86,-8,172,1.5,'#9fc3e6');ctx.restore();
   box(1180,430,300,40,'#2f6f69');box(1180,430,300,3,'rgba(255,255,255,.4)');
   wt(1104,580,'在養殖場屋頂設置光電',17,'#fff',500);wt(1104,614,'室內可控溫、控水質',17,'#fff',500);
   wt(1104,648,'建築設施面積上限 80%',17,'#7dffc4',600);wt(1104,760,'常用於高價魚種、蝦類',16,'rgba(227,236,238,.75)',500);});
 }},

{t:'高度留給養殖作業',en:'Headroom for farm work',dur:13,side:true,
 d:'支架高度與柱距決定了養殖戶能不能照常工作。投餌機放在塭堤上，把飼料拋進池中；工作膠筏要在模組下方來回，檢查水車、撈除死魚；收成時要下網拉魚，吊車或搬運車停在堤路上。因此模組下緣建議離地 3 公尺以上，柱距也要留給膠筏與網具通過。支架與基樁長期處在高濕、鹽霧環境，通常採用熱浸鍍鋅或更耐蝕的鍍層鋼材。',
 s:[[0,'投餌機從塭堤把飼料拋進池中'],[.28,'工作膠筏在模組下方來回巡池'],[.5,'模組下緣留出 3 公尺以上的淨高'],[.74,'收成時下網拉魚，車輛停在堤路上']],
 cam:u=>camMix({x:700,y:540,s:1.55},{x:760,y:500,s:1.25},ease(seg(u,.44,.56))),
 draw(u){
  invBox();fishes();aerator(980);pvArray(1);
  feeder(270,seg(u,.02,.1)*(1-seg(u,.9,1)));
  const rx=lerp(420,780,ease(seg(u,.26,.5)));raft(rx);
  const dm=seg(u,.48,.56);
  alphaDo(dm,()=>{const x=CX[1]+80;ctx.setLineDash([6,4]);ln([CX[0]-60,GY,CX[2]+60,GY],'rgba(255,255,255,.7)',1.5);ctx.setLineDash([]);
   arrow(x,GY-4,x,PT+20,E_Y,2.5);arrow(x,PT+20,x,GY-4,E_Y,2.5);
   arrow(CX[1],PT-40,CX[2],PT-40,'rgba(255,255,255,.8)',2);arrow(CX[2],PT-40,CX[1],PT-40,'rgba(255,255,255,.8)',2);});
  const hv=seg(u,.72,.8);
  if(hv>0){const tx=1480;truck(tx,gyy(tx),true,'#e9b21f');
   alphaDo(hv,()=>{const y=WL+30*(1-ease(seg(u,.8,.95)));ctx.strokeStyle='rgba(230,240,240,.85)';ctx.lineWidth=1.4;ctx.beginPath();
    for(let x=1180;x<=1340;x+=12){ctx.moveTo(x,WL);ctx.lineTo(x+(x<1260?20:-20),y+20);}ctx.moveTo(1180,WL);ctx.lineTo(1340,WL);ctx.stroke();
    person(1200,gyy(1200)+4,'#e8572a',4.4);person(1352,gyy(1352),'#1f7f99',4.4);});}
  lab(270,gyy(270)-40,'投餌機',{dx:-20,dy:-70,st:'s',a:band(u,.04,.3)});
  lab(rx,WL-10,'工作膠筏',{dx:40,dy:-60,a:band(u,.28,.52)});
  lab(CX[1]+80,(GY+PT)/2,'淨高 3 m 以上',{dx:70,dy:0,st:'s',a:band(u,.52,.76)});
  lab((CX[1]+CX[2])/2,PT-40,'柱距 5 m（示例）',{dx:0,dy:-60,st:'l',a:band(u,.54,.76)});
  lab(1260,WL+14,'收成下網',{dx:-30,dy:70,st:'g',a:band(u,.76,1)});
  lab(CX[3]+34,640,'鍍層鋼材防鹽霧',{dx:60,dy:40,st:'w',a:band(u,.8,1),minor:true});
 },
 hud(u){hudPanel(250,150,'作業空間（示例）',seg(u,.05,.1),w=>{
  hrow(56,'模組淨高','3.2 m',w,'#f2c230');hrow(88,'柱距','5 m',w,'#fff');hrow(120,'膠筏通行',u>.5?'可通過':'檢查中',w,u>.5?'#7dffc4':'#f2c230');});}},

{t:'遮蔽率 40% 怎麼算',en:'What 40% shading means',dur:14,
 d:'地面型漁電共生規定，光電等農業設施的面積不得超過申請農地面積的 40%，常被稱為遮蔽率上限。水產試驗所的試驗顯示，在 40% 遮蔽下，文蛤、虱目魚、鱸魚等主要魚種大致可維持七成以上的產能。遮蔭能降低夏季水溫、減少蒸發，但也會減少池中藻類的光合作用，讓溶氧下降，需要增氧水車補足。案場的產量須達該魚種近 3 年統計平均的 7 成，才算維持養殖事實。',
 s:[[0,'從上方看：模組投影占魚塭面積的比例'],[.25,'地面型的光電面積上限為 40%'],[.48,'遮蔭降低水溫，也會減少藻類與溶氧'],[.74,'產量須達近 3 年平均的 7 成']],
 draw(u){
  diagBG();
  card(60,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'俯視：魚塭與模組投影',20,'#f2c230',700);
  const X0=110,Y0=240,W=620,H=330,N=5,pitch=W/N,sw=ease(seg(u,.06,.3))*pitch*.4;
  box(X0-14,Y0-14,W+28,H+28,'#7a9a55');box(X0,Y0,W,H,'#3f8a80');
  for(let i=0;i<6;i++){const y=Y0+30+i*52;ln([X0+10,y+3*Math.sin(TT+i),X0+W-10,y+3*Math.sin(TT+i+1)],'rgba(255,255,255,.12)',1);}
  for(let i=0;i<N;i++){const x=X0+pitch*i+(pitch-sw)/2;box(x,Y0,sw,H,'rgba(31,63,102,.92)');
   ctx.strokeStyle='rgba(160,200,240,.4)';ctx.lineWidth=1;ctx.beginPath();for(let y=Y0+26;y<Y0+H;y+=26){ctx.moveTo(x,y);ctx.lineTo(x+sw,y);}ctx.stroke();}
  const ratio=Math.round(100*N*sw/W);
  wt(X0,Y0+H+52,'光電面積 ÷ 申請面積',18,'#fff',600);wt(X0+W,Y0+H+52,trf('{n}%',{n:ratio}),30,'#f2c230',700,'right',COND);
  const GX=X0,GYY=Y0+H+80,GW=W;box(GX,GYY,GW,18,'rgba(255,255,255,.12)');box(GX,GYY,GW*ratio/100,18,'#f2c230');
  alphaDo(seg(u,.22,.3),()=>{ln([GX+GW*.4,GYY-10,GX+GW*.4,GYY+28],E_W,3);wt(GX+GW*.4+10,GYY+58,'上限 40%',17,'#ff9d7a',700);wt(GX,GYY+58,'0',15,'rgba(227,236,238,.7)',600,'left',COND);wt(GX+GW,GYY+58,'100%',15,'rgba(227,236,238,.7)',600,'right',COND);});
  /* 右：遮蔭的影響 */
  card(820,160,720,380,{bg:'rgba(7,27,39,.75)'});wt(844,200,'遮蔭對池水的影響',20,'#f2c230',700);
  const IT=[['夏季水溫降低','g'],['減少水分蒸發','g'],['藻類光合作用減少','w'],['溶氧下降，需增氧補足','w']];
  IT.forEach(([t,s],i)=>{const k=seg(u,.42+i*.05,.48+i*.05),y=262+i*66;alphaDo(k,()=>{circ(866,y-6,9,s==='g'?E_G:E_W);wt(890,y,t,19,'#fff',600);
   wt(1514,y,s==='g'?'有利':'需管理',17,s==='g'?E_G:'#ff9d7a',700,'right');});});
  card(820,570,720,230,{bg:'rgba(7,27,39,.75)'});wt(844,610,'養殖事實的產量門檻',20,'#f2c230',700);
  const B0=880,BW=600,BY=680,p=ease(seg(u,.72,.9))*.82;
  box(B0,BY,BW,30,'rgba(255,255,255,.12)');box(B0,BY,BW*p,30,'#58b8d0');
  alphaDo(seg(u,.7,.76),()=>{ln([B0+BW*.7,BY-14,B0+BW*.7,BY+44],E_W,3);wt(B0+BW*.7,BY-22,'7 成門檻',16,'#ff9d7a',700,'center');
   wt(B0,BY+68,'以近 3 年統計平均為 100%',16,'rgba(227,236,238,.8)',500);});
  alphaDo(seg(u,.9,.95),()=>{wt(B0+BW,BY+68,trf('本池 {n}%（示例）',{n:82}),17,E_G,700,'right');});
 }},

{t:'一年的養殖與維運',en:'A year of farming and O&M',dur:13,
 d:'光電的維運要配合養殖的節奏。以虱目魚為例，冬季常排乾池水、曬池整池，春季放養魚苗，夏秋投餌養成，年底前收成。光電業者每月巡檢，定期以清水清洗模組，避免清潔劑流入池中；颱風季前檢查螺栓與基樁，沿海鹽霧環境也要追蹤鍍層的腐蝕狀況。維運車輛走塭堤，避開放養與收成的日子，雙方事先排好行事曆，才能真正共生。',
 s:[[0,'以虱目魚為例，看一整年的養殖節奏'],[.3,'冬季曬池，春季放養，夏秋養成，年底收成'],[.55,'光電每月巡檢，定期以清水清洗模組'],[.78,'颱風季前加強檢查，維運避開放養與收成']],
 draw(u){
  diagBG();
  card(60,160,1480,500,{bg:'rgba(7,27,39,.75)'});
  wt(84,200,'年度行事曆（示例：虱目魚）',20,'#f2c230',700);
  const X0=300,X1=1500,MW=(X1-X0)/12,mx=m=>X0+MW*(m-1);
  for(let m=1;m<=12;m++){wt(mx(m)+MW/2,262,String(m),18,'rgba(227,236,238,.85)',700,'center',COND);ln([mx(m),276,mx(m),620],'rgba(255,255,255,.08)',1);}
  wt(X1,232,'月',16,'rgba(227,236,238,.7)',600,'right');
  wt(84,350,'養殖',20,'#fff',700);wt(84,520,'光電維運',20,'#fff',700);
  const A=[[1,2,'曬池整池','#8d7a5a'],[3,3,'放養','#58b8d0'],[4,10,'投餌養成','#2f8f84'],[11,12,'收成','#f2c230']];
  A.forEach(([m0,m1,t,c],i)=>{const k=seg(u,.1+i*.06,.16+i*.06);if(k<=0)return;const w=(m1-m0+1)*MW-6;
   alphaDo(k,()=>{box(mx(m0)+3,318,w*ease(k),48,c);wt(mx(m0)+3+w/2,350,t,17,c==='#f2c230'?'#13232e':'#fff',700,'center');});});
  const on=seg(u,.5,.56);
  alphaDo(on,()=>{for(let m=1;m<=12;m++)circ(mx(m)+MW/2,440,6,E_G);wt(X0-16,446,'巡檢',16,E_G,700,'right');});
  alphaDo(seg(u,.56,.62),()=>{[3,6,9,12].forEach(m=>box(mx(m)+10,470,MW-20,26,'#7dc8dc'));wt(X0-16,489,'清洗',16,'#7dc8dc',700,'right');});
  alphaDo(seg(u,.66,.72),()=>{box(mx(6)+3,514,4*MW-6,40,'rgba(232,87,42,.85)');wt(mx(6)+2*MW,540,'颱風季加強檢查',17,'#fff',700,'center');});
  alphaDo(seg(u,.72,.78),()=>{box(mx(1)+3,574,MW*2-6,30,'#b37cff');wt(mx(3)+10,595,'鹽霧腐蝕檢查',16,'#d6b8ff',700);});
  const cur=X0+(X1-X0)*seg(u,.1,.95);ln([cur,280,cur,624],'rgba(242,194,48,.9)',2.5);circ(cur,280,6,E_Y);
  alphaDo(seg(u,.8,.88),()=>{card(60,690,1480,110,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});
   wt(90,736,'維運車輛走塭堤，避開放養與收成的日子',19,'#fff',700);wt(90,772,'清洗只用清水，避免清潔劑流入池中',17,'rgba(227,236,238,.85)',500);});
 }},

{t:'誰一起經營',en:'Who runs it together',dur:13,
 d:'一個漁電共生案場通常有三方：提供土地的地主、實際養殖的漁民，以及投資建置與售電的光電業者。業者支付地主租金或分潤，並與漁民一起規劃支架位置與作業動線；漁民持續放養、申報放養量，讓案場通過養殖事實查核。申請時要先通過環境與社會檢核，再取得農業設施與綠能設施的容許使用，完成施工併網後，主管機關仍會定期查核養殖情形。',
 s:[[0,'地主、漁民與光電業者，三方共同經營'],[.3,'業者付租金，並與漁民一起規劃配置'],[.52,'漁民持續養殖，申報放養量'],[.74,'從環社檢核到養殖查核，一步步把關']],
 draw(u){
  diagBG();
  const N=[[800,250,'養殖漁民','#58b8d0'],[380,520,'地主','#8d7a5a'],[1220,520,'光電業者','#f2c230']];
  const na=seg(u,.02,.12);
  const L=(a,b,t,k,col,dy)=>{if(k<=0)return;const [x0,y0]=[N[a][0],N[a][1]],[x1,y1]=[N[b][0],N[b][1]],d=Math.hypot(x1-x0,y1-y0),ux=(x1-x0)/d,uy=(y1-y0)/d;
   alphaDo(k,()=>{arrow(x0+ux*110,y0+uy*62,x1-ux*110,y1-uy*62,col,3);wt((x0+x1)/2,(y0+y1)/2+(dy||0),t,17,col,700,'center');});};
  L(2,1,'租金或分潤',seg(u,.28,.36),'#fff',-18);
  L(2,0,'共同規劃支架與動線',seg(u,.34,.42),'#f2c230',-30);
  alphaDo(seg(u,.5,.58),()=>{arrow(N[0][0]-110,N[0][1]+50,N[1][0]+60,N[1][1]-62,E_G,3);wt(470,370,'持續養殖',17,E_G,700,'center');wt(470,396,'申報放養量',17,E_G,700,'center');});
  N.forEach(([x,y,t,c])=>alphaDo(na,()=>{card(x-110,y-44,220,88,{bg:'rgba(7,27,39,.9)',st:c,lw:2.5});wt(x,y+8,t,22,'#fff',700,'center');}));
  alphaDo(seg(u,.12,.2),()=>{wt(800,392,'養殖為本',24,'#7dffc4',700,'center');wt(800,426,'綠能加值',24,'#f2c230',700,'center');});
  alphaDo(seg(u,.7,.74),()=>{card(60,630,1480,170,{bg:'rgba(7,27,39,.82)'});wt(84,668,'申請與查核流程（簡化）',18,'#f2c230',700);});
  const ST=['環社檢核','農業容許','綠能容許','施工併網','養殖查核'];
  ST.forEach((n,i)=>{const k=seg(u,.72+i*.04,.76+i*.04),x=90+i*292;if(u<.7)return;alphaDo(.6+.4*k,()=>{tag(x,740,trf('{i}. {s}',{i:i+1,s:tr(n)}),{size:17,bg:k>.5?(i===4?'#7dffc4':'#f2c230'):'rgba(255,255,255,.25)',fg:k>.5?'#13232e':'#fff'});});
   if(i<4)alphaDo(k,()=>arrow(x+226,740,x+272,740,'rgba(255,255,255,.6)',2));});
 }},

{t:'送電與收成',en:'Power out, fish in',dur:12,side:true,
 base:()=>pondBase({dusk:.55,sun:{x:1320,y:300},clouds:false}),
 d:'白天模組產生的直流電，沿著支架上的線槽送到塭堤上的變流器轉成交流，再經升壓後併入台電電網。以 1 公頃魚塭、0.8 MWp 為例，台灣南部每 kWp 一年約可發 1,250 度電，全年約 100 萬度，相當於約 280 戶家庭一年的用電，這是典型範例。池中的魚照常長大收成，同一塊土地同時生產漁獲與電力，這就是漁電共生想達成的目標。',
 s:[[0,'模組的直流電沿線槽送到塭堤上的變流器'],[.3,'轉成交流並升壓後，併入台電電網'],[.55,'一年約 100 萬度電，約 280 戶的用電'],[.78,'同一塊土地，同時生產漁獲與電力']],
 cam:u=>camMix({x:760,y:520,s:1.35},{x:800,y:450,s:1},ease(seg(u,.5,.66))),
 draw(u){
  invBox();fishes();aerator(480);aerator(980);pvArray(1);
  const bx=CX[0]-34,Pd=[[CX[3],PT+36],[bx,PT+36],[bx-40,PT+36],[122,gyy(122)-40]];
  const Pg=[[70,gyy(95)-30],[34,gyy(34)-30],[34,gyy(34)-200],[-40,gyy(34)-200]];
  ln([34,gyy(34),34,gyy(34)-210],'#394650',5);ln([14,gyy(34)-200,54,gyy(34)-200],'#394650',3);
  const on=seg(u,.04,.14);flowDots(Pd,7,.45,E_Y,on,4.5);flowDots(Pg,4,.55,E_G,on*seg(u,.26,.34),4.5);
  const hv=seg(u,.72,.8);if(hv>0){const tx=1480;truck(tx,gyy(tx),true,'#e9b21f');
   alphaDo(hv,()=>{for(let k=0;k<6;k++){const f=(TT*.6+k/6)%1;const x=lerp(1300,1440,f),y=WL-10-60*Math.sin(f*Math.PI);ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.ellipse(0,0,9,3.5,.3,0,TAU);ctx.fillStyle='#dfe7ea';ctx.fill();ctx.restore();}
    person(1400,gyy(1400),'#e8572a',4.4);});}
  lab(CX[2],PT+36,'直流線槽',{dx:30,dy:-80,st:'s',a:band(u,.04,.3)});
  lab(96,gyy(96)-62,'變流器',{dx:40,dy:-70,a:band(u,.18,.44)});
  lab(34,gyy(34)-200,'台電電網',{dx:60,dy:-40,st:'g',a:band(u,.3,.56)});
  lab(1340,WL-30,'魚獲收成',{dx:-40,dy:-70,st:'l',a:band(u,.76,1)});
 },
 hud(u){hudPanel(250,150,'年度成果（示例）',seg(u,.05,.1),w=>{const k=seg(u,.1,.7);
  hrow(56,'裝置容量','0.8 MWp',w,'#fff');hrow(88,'年發電量',trf('{n} 萬度',{n:Math.max(1,Math.round(100*k))}),w,'#f2c230');hrow(120,'約可供',trf('{n} 戶',{n:Math.round(280*k)}),w,'#7dffc4');});}}
]};
