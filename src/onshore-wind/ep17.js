// KITS: land
/* 陸域風電系列 第 17 集：葉片修補 */
const gyy=x=>groundY(x);
/* 正視的葉片與風機（沿用第 3、16 集） */
function bladeF(cx,cy,a,L,w){w=w===undefined?1:w;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
  const k=Math.max(.18,w);poly([8,-5*k,8+L*.2,-10*k,8+L,-1.5*k,8+L,1.5*k,8+L*.2,8*k,8,5*k],'#f4f6f7','rgba(0,0,0,.35)',1);ctx.restore();}
function turbine(x,gy,H,R,rot,o){o=o||{};const hy=gy-H,w0=Math.max(4,R*.09),w1=Math.max(2.5,R*.05);
  poly([x-w0,gy,x-w1,hy+R*.06,x+w1,hy+R*.06,x+w0,gy],o.tc||'#eef2f4','rgba(0,0,0,.3)',1);
  box(x-R*.1,hy-R*.08,R*.2,R*.13,'#e3e8ec','rgba(0,0,0,.3)',1);
  for(let i=0;i<3;i++)bladeF(x,hy,rot+i*TAU/3-Math.PI/2,R,o.w);
  circ(x,hy,Math.max(3,R*.07),'#dfe5e8','rgba(0,0,0,.4)',1);return {x,y:hy};}
function windLines(y0,y1,n,sp,a,seed,len){if(a<=0)return;const r=rng(seed||3);ctx.lineCap='round';
  for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),ph=r(),s=sp*(.7+.6*r()),L=(len||60)*(.6+.8*r());const x=VX0-200+((ph*2400+TT*s)%(VX1-VX0+400));
   alphaDo(a*(.25+.35*r()),()=>ln([x,y,x+L,y],'#ffffff',2));}ctx.lineCap='butt';}
function spin(u,dur,f){let a=0;const N=120;for(let i=0;i<N;i++){const x=u*(i+.5)/N;a+=f(x);}return a*u*dur/N;}
function chk(x,y,col){ring(x,y,10,col||'#7dffc4',2);ln([x-6,y,x-1,y+6,x+7,y-6],col||'#7dffc4',2.5);}
/* 場景常數：葉片轉到正下方（rot=π），前緣在右側 */
const X1=640,H1=420,R1=230,KW=2;
/* 朝下葉片的前緣點：f=0 葉根、1 葉尖 */
function edgePt(hx,hy,f,L,k){L=L||R1;k=k||KW;const e=f<.2?lerp(5*k,10*k,f/.2):lerp(10*k,1.5*k,(f-.2)/.8);return {x:hx+e,y:hy+8+L*f};}
function erosion(hx,hy,a,f0,f1){const r=rng(41);alphaDo(a,()=>{for(let i=0;i<22;i++){const f=lerp(f0,f1,r()),p=edgePt(hx,hy,f);circ(p.x-1-r()*3,p.y,1.2+r()*2.2,'#7a6a55');}});}
function ropes(ax,ay,by,a){alphaDo(a,()=>{ln([ax,ay,ax+8,by],'#f2c230',1.6);ln([ax+5,ay,ax+13,by],'#e8572a',1.6);});}
/* 剖面翼型：前緣在左 */
function airfoil(cx,cy,c,t,fill,st){ctx.beginPath();const N=40,yt=x=>5*t*c*(.2969*Math.sqrt(x)-.126*x-.3516*x*x+.2843*x*x*x-.1015*x*x*x*x);
  for(let i=0;i<=N;i++){const x=1-i/N;ctx.lineTo(cx+x*c,cy-yt(x)*1.15+ (x)*c*.02);}
  for(let i=1;i<=N;i++){const x=i/N;ctx.lineTo(cx+x*c,cy+yt(x)*.85+(x)*c*.02);}
  ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(st){ctx.strokeStyle=st;ctx.lineWidth=2;ctx.stroke();}}
/* 露點（Magnus 公式） */
function dewPt(T,RH){const g=Math.log(RH/100)+17.62*T/(243.12+T);return 243.12*g/(17.62-g);}

const EP={no:17,slug:'onshore-wind',seriesName:'陸域風電系列',t:'葉片修補',en:'Repairing a turbine blade',
lede:'葉片在高速旋轉中承受雨滴、砂粒與雷擊，前緣會逐漸被侵蝕。這一集跟著修補團隊沿繩索垂降到葉片上：選擇繩索或吊籃平台、把損傷磨成 1:50 的斜面、逐層鋪回玻纖積層，在溫濕度窗口內固化，最後加上前緣保護並完成品質檢查。',
facts:[['1:50','斜接比','葉片積層修補常用的打磨斜面比例：2 mm 厚的積層要磨出約 100 mm 長的斜面'],
['88','m/s','葉尖速度示例：60 m 葉片每分鐘 14 轉，雨滴以這個速度撞擊前緣'],
['15','°C','樹脂修補材料常見的最低施作溫度，低於此值不施工（示例）'],
['80','%','相對濕度的典型上限；葉片表面溫度也要比露點高 3 °C 以上（示例）'],
['2','條','繩索作業的獨立繩索：工作繩與確保繩分別固定'],
['1/3','葉長','葉片外側約三分之一是前緣侵蝕最集中、優先保護的區段（示例）']],
note:'說明：本集為教育用途示意動畫，風機、葉片與積層的比例經過調整，積層剖面的厚度方向放大繪製。斜接比 1:50 為葉片修補文獻與實務常見的折衷值（例如德國聯邦材料研究所 BAM 與丹麥科技大學 DTU 的葉片修補研究）；修補材料最低施作溫度約 15 °C 參考 BAM 的研究說明。相對濕度上限 80%、表面溫度高於露點 3 °C（常見塗裝施工準則）、繩索作業風速上限、葉尖速度、侵蝕階段、固化曲線與時間皆為典型範例，並非特定案場、機型或材料的資料；實際做法依風機與材料製造商的修補手冊、繩索作業規範（例如 IRATA）與主管機關規定而定。',
base:()=>{landSky(GY,{sun:{x:1260,y:130},clouds:false});drawGround();},
shots:[
/* 1 ─────────────────────────────── 垂降到葉片 */
{t:'垂降到葉片上',en:'Rappelling onto the blade',dur:13,side:true,
 d:'葉片修補的第一步，是把要修的葉片轉到正下方（6 點鐘位置）並插入轉子鎖定銷，讓技師能沿著葉片上下移動。小面積的損傷多採用繩索作業：技師從機艙頂部垂降，工作繩與確保繩各自固定，任何一條失效，另一條都能接住。地面有支援人員負責吊送材料與緊急救援。台灣西部沿海風大，繩索作業只能在風速低於上限的時段進行，常要等待合適的天氣窗口。',
 s:[[0,'要修的葉片轉到正下方，轉子鎖定'],[.26,'技師從機艙頂部垂降，兩條繩索各自固定'],[.54,'下到葉片外側，前緣的侵蝕清楚可見'],[.78,'地面人員負責吊送材料與待命救援']],
 cam:u=>camMix({x:800,y:450,s:1},{x:700,y:330,s:2},ease(seg(u,.44,.8))),
 draw(u){
  turbine(230,gyy(230),230,115,TT*1.1+.7);
  const T=turbine(X1,gyy(X1),H1,R1,Math.PI,{w:KW,tc:'#b9c3c9'});
  windLines(150,520,10,150,.5,5,50);
  erosion(T.x,T.y,1,.62,.95);
  const ax=T.x+20,ay=T.y-18,d=ease(seg(u,.26,.6)),py=lerp(ay+4,T.y+8+R1*.8,d);
  const pr=seg(u,.2,.28);ropes(ax,ay,lerp(ay,T.y+R1+40,seg(u,.2,.36)),pr);
  if(u>.22)alphaDo(seg(u,.22,.28),()=>person(ax+12,py,'#e8572a',1.4));
  ctx.save();ctx.translate(980,gyy(980));ctx.scale(.62,.62);truck(0,0,true,'#f4f6f7',()=>{box(4,-48,60,14,'#f2c230');});ctx.restore();
  person(900,gyy(900),'#f2c230',2.2);
  const ep=edgePt(T.x,T.y,.8);
  lab(T.x,T.y+R1*.45,'葉片轉到正下方並鎖定',{dx:-170,dy:-20,st:'s',a:band(u,.02,.26)});
  lab(ax+6,ay+60,'工作繩與確保繩',{dx:120,dy:-30,st:'s',a:band(u,.26,.52)});
  lab(ep.x,ep.y,'前緣侵蝕',{dx:90,dy:30,st:'w',a:band(u,.54,.78)});
  lab(ax+12,py-14,'繩索技師',{dx:-110,dy:-30,st:'l',a:band(u,.54,.78)});
  lab(900,gyy(900)-30,'地面支援',{dx:-60,dy:-60,a:band(u,.8,1)});
 },
 hud(u){hudPanel(250,150,'作業條件（示例）',seg(u,.06,.12),w=>{const ws=7.2+.5*nz(TT*.4);
  hrow(56,'輪轂風速',trf('{v} m/s',{v:ws.toFixed(1)}),w,'#7dffc4');hrow(88,'繩索作業上限','12 m/s',w,'#ff9d7a');
  hrow(120,'葉片位置','6 點鐘',w,'#f2c230');});}},

/* 2 ─────────────────────────────── 繩索或平台 */
{t:'繩索作業或吊籃平台',en:'Rope access or a blade platform',dur:13,
 d:'修補葉片有兩種常見的登高方式。繩索作業架設快、人力與設備少，適合前緣侵蝕、小裂紋與塗層修補，但技師懸在空中，作業時間與風速限制較嚴，也難以控制溫濕度。吊籃平台由機艙吊掛、環繞葉片，可在平台上搭起帳篷、加熱與除濕，適合大面積或結構性的積層修補，但架設時間較長、成本也較高。實務上依損傷大小、天候與工期選擇，有時也會改用高空作業車，或把葉片吊下地面修理。',
 s:[[0,'繩索作業：兩條繩索，技師直接懸在葉片旁'],[.3,'架設快、成本低，適合小面積修補'],[.52,'吊籃平台環繞葉片，可以搭帳篷控溫控濕'],[.76,'依損傷大小、天候與工期來選擇']],
 draw(u){
  diagBG();
  const side=(x0,title,items,k0,draw)=>{card(x0,160,700,580,{bg:'rgba(7,27,39,.75)'});wt(x0+24,200,title,20,'#f2c230',700);draw();
   items.forEach(([ok,t],i)=>alphaDo(seg(u,k0+i*.05,k0+.04+i*.05),()=>{const y=588+i*44;
    if(ok)chk(x0+44,y-6);else{ring(x0+44,y-6,10,'#ff9d7a',2);ln([x0+38,y-6,x0+50,y-6],'#ff9d7a',2.5);}
    wt(x0+68,y,t,18,ok?'#fff':'rgba(255,214,200,.95)',600);}));};
  side(60,'繩索作業',[[1,'架設快，一兩個小時即可開工'],[1,'人員與設備少，成本較低'],[1,'適合小面積修補與塗層'],[0,'風速限制嚴，難以控溫控濕']],.1,()=>{
   const cx=410,cy=220;bladeF(cx,cy,Math.PI/2,320,2.4);box(cx-40,cy-14,80,22,'#cfd6db','rgba(0,0,0,.4)',1);
   const by=lerp(300,470,.5+.5*Math.sin(TT*.6)),bx=cx+40;ropes(bx,cy,560,1);person(bx+12,by,'#e8572a',2.2);
   wt(cx-60,300,'工作繩',16,'#f2c230',700,'right');wt(cx-60,330,'確保繩',16,'#ff9d7a',700,'right');});
  side(840,'吊籃平台',[[1,'可搭帳篷，控制溫度與濕度'],[1,'適合大面積與結構性修補'],[0,'架設時間較長，需要吊掛點'],[0,'設備與運輸成本較高']],.48,()=>{
   const cx=1190,cy=220;bladeF(cx,cy,Math.PI/2,320,2.4);box(cx-40,cy-14,80,22,'#cfd6db','rgba(0,0,0,.4)',1);
   const py=lerp(520,420,ease(seg(u,.42,.6)));
   ln([cx-90,cy+8,cx-90,py-6],'rgba(227,236,238,.8)',1.5);ln([cx+90,cy+8,cx+90,py-6],'rgba(227,236,238,.8)',1.5);
   alphaDo(seg(u,.56,.64),()=>{box(cx-96,py-120,192,114,'rgba(125,255,196,.12)','rgba(125,255,196,.6)',1.5);wt(cx+108,py-80,'帳篷',16,'#7dffc4',700);
    const p=(TT*.8)%1;alphaDo(1-p,()=>{ln([cx-70,py-30-p*50,cx-50,py-30-p*50],'#ff9d7a',2);});});
   box(cx-100,py-6,200,18,'#e9b21f','rgba(0,0,0,.45)',1.5);box(cx-20,py-6,40,8,'#0e2a3b');
   person(cx-60,py-6,'#e8572a',2);person(cx+52,py-6,'#f2c230',2);});
  alphaDo(seg(u,.76,.82),()=>tag(800,772,'依損傷大小、天候與工期選擇',{size:18,bg:'#f2c230',align:'center'}));
 }},

/* 3 ─────────────────────────────── 侵蝕從哪裡來 */
{t:'前緣為什麼會被侵蝕',en:'Why the leading edge erodes',dur:13,
 d:'葉片越往外轉得越快。以 60 公尺長、每分鐘 14 轉的葉片為例，葉尖線速度約 88 m/s，相當於時速 317 公里。雨滴、冰雹與砂粒以這樣的速度反覆撞擊前緣，塗層先變粗糙，接著出現凹坑與剝落，最後露出底下的玻纖積層。台灣沿海還有鹽霧與東北季風夾帶的砂粒，侵蝕更快。前緣變粗糙後翼型的氣動性能下降，發電量也跟著減少，所以外側約三分之一是保護的重點。',
 s:[[0,'線速度從葉根到葉尖一路增加'],[.28,'葉尖約 88 m/s，雨滴像子彈一樣撞上前緣'],[.52,'塗層變粗、出現凹坑，再剝落露出積層'],[.76,'外側三分之一侵蝕最嚴重，是修補重點']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,700,640,{title:'線速度沿葉長增加（示例）',x0:0,x1:60,y0:0,y1:100,xt:[0,20,40,60],yt:[0,25,50,75,100],xl:'距葉根 m',yl:'m/s',pl:76,pt:74,pb:70,gx:6,gy:4});
  alphaDo(seg(u,.6,.66),()=>{box(C.X(40),C.py,C.X(60)-C.X(40),C.ph,'rgba(232,87,42,.16)');wt(C.X(50),C.Y(4),'外側三分之一',17,'#ff9d7a',700,'center');});
  const g=ease(seg(u,.04,.3));ctx.beginPath();ctx.moveTo(C.X(0),C.Y(0));ctx.lineTo(C.X(60*g),C.Y(88*g));ctx.strokeStyle='#f2c230';ctx.lineWidth=3.5;ctx.stroke();
  if(g>0)circ(C.X(60*g),C.Y(88*g),7,'#f2c230');
  alphaDo(seg(u,.28,.34),()=>{wt(C.X(57),C.Y(97),'葉尖 88 m/s',20,'#f2c230',700,'right');wt(C.X(57),C.Y(97)+28,'約 317 km/h',17,'rgba(227,236,238,.85)',600,'right');});
  wt(C.X(1),C.Y(95),'60 m 葉片、14 rpm',16,'rgba(227,236,238,.75)',600);
  /* 右上：翼型與雨滴 */
  card(800,160,740,330,{bg:'rgba(7,27,39,.75)'});wt(824,200,'雨滴撞擊前緣（剖面示意）',20,'#f2c230',700);
  const ax=1020,ay=340,c=440;airfoil(ax,ay,c,.18,'#e9eef1','rgba(0,0,0,.4)');
  const er=seg(u,.4,.9);if(er>0){ctx.save();ctx.beginPath();ctx.ellipse(ax+4,ay+2,6+10*er,14+16*er,0,0,TAU);ctx.clip();airfoil(ax,ay,c,.18,'#7a8c5a');ctx.restore();
   const r=rng(7);for(let i=0;i<10;i++){const a=(r()-.5)*2.2;circ(ax+6+Math.cos(a)*(8+6*er)*r(),ay+Math.sin(a)*(16+12*er),1.5+2*r()*er,'#5a4a3a');}}
  const r=rng(11);for(let i=0;i<14;i++){const yy=ay-40+r()*80,ph=(TT*1.4+r())%1,x=lerp(830,ax+2,ph);if(x<ax-4)ln([x-14,yy+(ay-yy)*ph*.5,x,yy+(ay-yy)*ph*.5],'#7dc8dc',2.5);}
  wt(ax-10,ay-70,'前緣',17,'#ff9d7a',700,'center');wt(ax+c-10,ay+60,'後緣',16,'rgba(227,236,238,.8)',600,'right');wt(850,ay+90,'雨滴',16,'#7dc8dc',700);
  /* 右下：侵蝕階段 */
  card(800,510,740,290,{bg:'rgba(7,27,39,.75)'});wt(824,550,'侵蝕的四個階段（示例）',20,'#f2c230',700);
  const ST=[['塗層變粗糙','#d9dfd0'],['點狀凹坑','#c7b48a'],['塗層剝落','#b0875a'],['露出玻纖積層','#8a5a3a']];
  ST.forEach(([t,col],i)=>alphaDo(seg(u,.44+i*.07,.48+i*.07),()=>{const x=824+i*178,y=590;
   box(x,y,160,110,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);
   rrp(x+20,y+20,120,40,20);ctx.fillStyle='#e9eef1';ctx.fill();
   const rr=rng(20+i);for(let j=0;j<(i+1)*7;j++)circ(x+30+rr()*90,y+28+rr()*24,1+rr()*(1+i),col);
   wt(x+80,y+92,t,15,'#fff',700,'center');
   if(i<3)arrowR(x+163,y+40,12,'rgba(242,194,48,.8)');}));
  alphaDo(seg(u,.8,.86),()=>wt(1170,760,'前緣變粗糙，發電量也跟著下降',17,'#ff9d7a',700,'center'));
 }},

/* 4 ─────────────────────────────── 打磨與積層 */
{t:'打磨斜面與玻纖積層',en:'Scarf grinding and laminating',dur:14,
 d:'積層損傷不能只把洞填平。技師先標出損傷範圍，用砂輪把周圍磨成平緩的斜面，常用的斜接比是 1:50，也就是每 1 公釐厚度要磨出 50 公釐長的斜坡，讓新舊積層之間有足夠的黏著面積傳遞載重。清除粉塵並以溶劑擦拭後，把含浸樹脂的玻纖布一層層鋪回，每一層對應原本的一層，最後蓋上較大的覆蓋層，再鋪脫模布與加熱毯固化，完成後打磨回原本的翼型外形。',
 s:[[0,'裂紋穿過了外側三層玻纖積層'],[.22,'磨出 1:50 的平緩斜面，擴大黏著面積'],[.48,'清潔後，含浸樹脂的玻纖布逐層鋪回'],[.74,'蓋上覆蓋層與加熱毯，固化後打磨整形']],
 draw(u){
  diagBG();
  card(60,160,1480,370,{bg:'rgba(7,27,39,.75)'});wt(84,200,'葉片殼體積層（剖面示意，厚度方向放大）',20,'#f2c230',700);
  const L0=140,L1=1460,top=320,P=20,CX=800,W=380,hw=d=>W-(W-30)*d/60;
  for(let i=0;i<4;i++)box(L0,top+i*P,L1-L0,P,i%2?'#cdd5d9':'#dde3e6','rgba(0,0,0,.25)',1);
  box(L0,top+4*P,L1-L0,26,'#c9b48a','rgba(0,0,0,.25)',1);wt(L0+10,top+4*P+19,'夾芯材',14,'#13232e',700);
  box(L0,top-6,L1-L0,6,'#f4f6f7');
  const g=ease(seg(u,.2,.42));
  /* 裂紋 */
  alphaDo(1-seg(u,.3,.4),()=>{ln([CX-20,top-6,CX+6,top+18,CX-10,top+36,CX+12,top+58],'#3a2a20',3);ln([CX+6,top+18,CX+40,top+24],'#3a2a20',2);});
  /* 磨除區 */
  if(g>0){const dd=60*g;ctx.beginPath();ctx.moveTo(CX-hw(0),top-6);ctx.lineTo(CX-hw(dd),top+dd);ctx.lineTo(CX+hw(dd),top+dd);ctx.lineTo(CX+hw(0),top-6);ctx.closePath();
   ctx.fillStyle='#16384c';ctx.fill();ctx.strokeStyle='#f2c230';ctx.lineWidth=1.5;ctx.stroke();
   if(u<.44){const gx=lerp(CX-hw(0),CX+hw(0),(TT*.5)%1);circ(gx,top-30,18,'#9aa3a8','#13232e',2);ln([gx,top-48,gx+30,top-90],'#5b6a73',8);
    const r=rng(Math.floor(TT*8));for(let i=0;i<6;i++)circ(gx+(r()-.5)*60,top-20-r()*40,2,'rgba(227,236,238,.6)');}}
  /* 鋪層 */
  const NEWC=['#7dc8dc','#58b8d0','#7dc8dc'];
  for(let j=0;j<3;j++){const p=seg(u,.5+j*.06,.55+j*.06);if(p<=0)continue;const d0=60-20*j,d1=60-20*(j+1);
   alphaDo(p,()=>poly([CX-hw(d1),top+d1,CX+hw(d1),top+d1,CX+hw(d0),top+d0,CX-hw(d0),top+d0],NEWC[j],'rgba(0,0,0,.3)',1));}
  const pc=seg(u,.68,.72);alphaDo(pc,()=>box(CX-W-50,top-12,2*W+100,10,'#58b8d0','rgba(0,0,0,.3)',1));
  const ph=seg(u,.74,.8);alphaDo(ph,()=>{box(CX-W-70,top-36,2*W+140,20,'#e8572a','rgba(0,0,0,.3)',1);wt(CX,top-44,'加熱毯',17,'#ff9d7a',700,'center');});
  /* 斜率標註 */
  alphaDo(band(u,.3,.5),()=>{ln([CX+30,top+64,CX+W,top+64],'#f2c230',1.5);ln([CX+W+16,top-6,CX+W+16,top+60],'#f2c230',1.5);
   wt((CX+30+CX+W)/2,top+86,'50',18,'#f2c230',700,'center',COND);wt(CX+W+26,top+34,'1',18,'#f2c230',700,'left',COND);});
  lab(CX-200,top+30,'原有積層',{dx:-80,dy:-90,a:band(u,.02,.24)});
  lab(CX-hw(30),top+30,'斜面',{dx:-120,dy:-100,st:'s',a:band(u,.32,.5)});
  lab(CX,top+40,'新鋪玻纖布',{dx:150,dy:-120,st:'g',a:band(u,.52,.72)});
  lab(CX+W+30,top-7,'覆蓋層',{dx:110,dy:-60,st:'g',a:band(u,.68,.8)});
  /* 左下：步驟 */
  card(60,550,700,250,{bg:'rgba(7,27,39,.75)'});
  const STP=['標出範圍、清潔表面','磨出 1:50 斜面','除塵、溶劑擦拭','逐層鋪貼玻纖布','脫模布、加熱毯固化','打磨回原本外形'];
  STP.forEach((t,i)=>{const x=84+(i%2)*340,y=600+Math.floor(i/2)*66,on=u>[.02,.2,.42,.5,.72,.88][i];
   circ(x+16,y-6,15,on?'#f2c230':'rgba(255,255,255,.12)');wt(x+16,y+1,String(i+1),18,on?'#13232e':'rgba(227,236,238,.6)',800,'center',COND);
   wt(x+42,y,t,18,on?'#fff':'rgba(227,236,238,.55)',700);});
  /* 右下：計算 */
  card(800,550,740,250,{bg:'rgba(7,27,39,.75)'});wt(824,590,'斜接比 1:50',20,'#f2c230',700);
  alphaDo(seg(u,.26,.34),()=>{wt(830,650,'積層厚 2 mm',20,'#fff',700);wt(1170,650,'× 50',24,'#f2c230',700,'center',COND);
   wt(1510,650,'單側斜面 100 mm',20,'#7dffc4',700,'right');
   wt(830,712,'修補範圍遠大於裂紋本身',18,'rgba(227,236,238,.85)',600);
   wt(830,752,'黏著面積大，載重才能平順傳過去',18,'rgba(227,236,238,.85)',600);});
 }},

/* 5 ─────────────────────────────── 溫濕度窗口 */
{t:'固化的溫濕度窗口',en:'The curing weather window',dur:14,
 d:'環氧樹脂等修補材料對溫度與濕度很敏感。常見的施作條件是溫度不低於約 15 °C、相對濕度不高於約 80%，而且葉片表面溫度要比露點高 3 °C 以上，否則表面會凝結水氣，影響黏著。台灣清晨常有高濕與露水，所以技師會等日照升溫，或在平台上搭帳篷、用暖風機與除濕機把環境拉進窗口內。加熱毯則能把固化時間從一整天縮短到幾個小時，讓修補趕在天氣變化前完成。',
 s:[[0,'清晨 12 °C、濕度 92%，落在施作窗口之外'],[.28,'搭帳篷、開暖風與除濕，把環境拉進窗口'],[.52,'表面溫度比露點高 3 °C 以上，才不會結露'],[.74,'加熱毯讓樹脂幾個小時就完成固化']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,700,640,{title:'施作窗口（示例）',x0:0,x1:40,y0:40,y1:100,xt:[0,10,20,30,40],yt:[40,60,80,100],xl:'溫度 °C',yl:'相對濕度 %',pl:76,pt:74,pb:70,gx:4,gy:3});
  box(C.X(15),C.Y(80),C.X(35)-C.X(15),C.Y(40)-C.Y(80),'rgba(125,255,196,.14)');ctx.strokeStyle='rgba(125,255,196,.7)';ctx.lineWidth=2;ctx.strokeRect(C.X(15),C.Y(80),C.X(35)-C.X(15),C.Y(40)-C.Y(80));
  wt(C.X(25),C.Y(48),'可施作',18,'#7dffc4',700,'center');
  ctx.setLineDash([6,6]);ln([C.X(15),C.Y(40),C.X(15),C.Y(100)],'#e8572a',1.5);ln([C.X(0),C.Y(80),C.X(40),C.Y(80)],'#e8572a',1.5);ctx.setLineDash([]);
  wt(C.X(15)+8,C.Y(97),'≥ 15 °C',16,'#ff9d7a',700);wt(C.X(39),C.Y(80)-10,'≤ 80%',16,'#ff9d7a',700,'right');
  const m=ease(seg(u,.28,.5)),T=lerp(12,24,m),RH=lerp(92,62,m),inW=T>=15&&RH<=80;
  ctx.setLineDash([4,5]);ln([C.X(12),C.Y(92),C.X(T),C.Y(RH)],'rgba(242,194,48,.7)',2);ctx.setLineDash([]);
  circ(C.X(T),C.Y(RH),11,inW?'#7dffc4':'#e8572a','#13232e',2);
  wt(C.X(12)+18,C.Y(92)+6,'清晨',16,'rgba(227,236,238,.85)',600);
  alphaDo(seg(u,.46,.52),()=>wt(C.X(T)+18,C.Y(RH)+6,'帳篷內',16,'#7dffc4',700));
  /* 右上：露點 */
  card(800,160,740,280,{bg:'rgba(7,27,39,.75)'});wt(824,200,'表面溫度要高於露點 3 °C',20,'#f2c230',700);
  const Td=dewPt(T,RH),gap=T-Td,okg=gap>=3;
  hrowW(830,256,'表面溫度',trf('{t} °C',{t:T.toFixed(1)}),'#fff');hrowW(830,300,'露點',trf('{t} °C',{t:Td.toFixed(1)}),'#7dc8dc');
  hrowW(830,344,'溫差',trf('{t} °C',{t:gap.toFixed(1)}),okg?'#7dffc4':'#ff9d7a');
  tag(1170,404,okg?'不會結露，可以施作':'容易結露，暫停施作',{size:17,bg:okg?'#7dffc4':'#e8572a',fg:okg?'#13232e':'#fff',align:'center'});
  /* 右下：固化曲線 */
  const D=chartBox(800,460,740,340,{title:'樹脂固化程度（示例）',x0:0,x1:24,y0:0,y1:100,xt:[0,6,12,18,24],yt:[0,50,100],xl:'小時',yl:'%',pl:70,pt:64,pb:60,gx:4,gy:2});
  const te=24*seg(u,.62,.92);
  [[7,'#7dc8dc','環境 20 °C'],[.9,'#f2c230','加熱毯']].forEach(([k,col,n],j)=>{if(te<=0)return;ctx.beginPath();
   for(let t=0;t<=te;t+=.2){const y=D.Y(100*(1-Math.exp(-t/k)));t?ctx.lineTo(D.X(t),y):ctx.moveTo(D.X(t),y);}ctx.strokeStyle=col;ctx.lineWidth=3;ctx.stroke();
   alphaDo(seg(u,.7,.76),()=>{circ(D.X(13),D.Y(42)+j*30,6,col);wt(D.X(13)+14,D.Y(42)+j*30+6,n,16,col,700);});});
  alphaDo(seg(u,.8,.86),()=>{circ(D.X(2.7),D.Y(95),5,'#f2c230');wt(D.X(3.4),D.Y(78),'約 3 小時',16,'#f2c230',700);});
 }},

/* 6 ─────────────────────────────── 前緣保護 */
{t:'加上前緣保護',en:'Adding leading edge protection',dur:13,side:true,
 d:'前緣是侵蝕最嚴重的部位，修補完積層後要加上前緣保護（LEP）。常見做法有三種：用滾筒或刮刀塗上柔韌的聚氨酯保護塗層、貼上耐磨的保護膠帶，或黏上預製的保護殼。塗層施作前先填補凹坑、打磨平順，再分層塗佈並量測膜厚。保護材料本身也是消耗品，會隨時間磨耗，所以每次巡檢都要追蹤它的狀況，在磨穿之前重新補塗，比等到積層受損再修便宜得多。',
 s:[[0,'先填補凹坑、打磨平順，讓前緣回到原本外形'],[.3,'沿著前緣滾塗聚氨酯保護塗層'],[.58,'分層塗佈，逐段量測膜厚'],[.8,'也可改貼保護膠帶或預製的保護殼']],
 cam:u=>({x:700,y:405,s:2.3}),
 draw(u){
  const T=turbine(X1,gyy(X1),H1,R1,Math.PI,{w:KW,tc:'#b9c3c9'});
  windLines(150,520,8,120,.4,6,40);
  const fill=seg(u,.04,.26);erosion(T.x,T.y,1-fill,.62,.95);
  /* 塗層 */
  const f0=.55,f1=.97,cp=ease(seg(u,.3,.7)),fc=lerp(f1,f0,cp);
  if(fill>0){const N=20;alphaDo(fill*.9,()=>{ctx.beginPath();for(let i=0;i<=N;i++){const p=edgePt(T.x,T.y,lerp(f0,f1,i/N));ctx.lineTo(p.x+.5,p.y);}ctx.strokeStyle='#cfd6db';ctx.lineWidth=3;ctx.stroke();});}
  if(cp>0){ctx.beginPath();const N=24;for(let i=0;i<=N;i++){const p=edgePt(T.x,T.y,lerp(fc,f1,i/N));ctx.lineTo(p.x-1.5,p.y);}ctx.strokeStyle='#7dc8dc';ctx.lineWidth=5;ctx.lineCap='round';ctx.stroke();ctx.lineCap='butt';}
  const ax=T.x+20,ay=T.y-18;ropes(ax,ay,T.y+R1+40,1);
  const pp=edgePt(T.x,T.y,u<.3?.8:fc);const px=ax+12,py=pp.y+18;person(px,py,'#e8572a',1.4);
  ln([px-2,py-12,pp.x+3,pp.y],'#9aa3a8',1.6);if(cp>0&&cp<1)circ(pp.x+2,pp.y,3,'#58b8d0','#13232e',1);
  /* 膜厚量測點 */
  [.9,.8,.7,.6].forEach((f,i)=>{if(u>.58+i*.05&&fc<=f){const p=edgePt(T.x,T.y,f);circ(p.x+8,p.y,3,'#7dffc4','#13232e',1);}});
  const em=edgePt(T.x,T.y,.85);
  lab(em.x,em.y,'填補凹坑',{dx:80,dy:-40,st:'l',a:band(u,.04,.28)});
  lab(em.x,em.y,'聚氨酯保護塗層',{dx:90,dy:-30,st:'s',a:band(u,.32,.58)});
  lab(edgePt(T.x,T.y,.7).x+8,edgePt(T.x,T.y,.7).y,'膜厚量測點',{dx:90,dy:20,st:'g',a:band(u,.6,.8)});
  lab(edgePt(T.x,T.y,.75).x,edgePt(T.x,T.y,.75).y,'或貼保護膠帶、保護殼',{dx:100,dy:-20,st:'n',a:band(u,.8,1)});
 },
 hud(u){hudPanel(250,150,'塗佈條件（示例）',seg(u,.06,.12),w=>{const fc=lerp(0,320,ease(seg(u,.58,.8)));
  hrow(56,'表面溫度','24.0 °C',w,'#fff');hrow(88,'露點差','7.7 °C',w,'#7dffc4');
  hrow(120,'乾膜厚度',u>.58?trf('{n} µm',{n:Math.round(fc)}):'—',w,'#f2c230');});}},

/* 7 ─────────────────────────────── 檢查與復機 */
{t:'品質檢查與復機',en:'Quality checks and restart',dur:12,side:true,
 d:'修補完成後要做品質檢查：用巴氏硬度計確認樹脂已充分固化，用敲擊檢查找出積層內部的空洞或脫層，並量測外形與表面粗糙度。每一處修補都拍照、標註位置與材料批號，存入葉片的維護紀錄，下次巡檢時拿來比對。技師收回繩索與工具，確認葉片上沒有遺留物後，拔出轉子鎖定銷並通知中控啟動。修補過的前緣讓氣流恢復平順，也延長了葉片的使用壽命。',
 s:[[0,'硬度、敲擊與外形檢查，確認修補合格'],[.3,'技師回到機艙，收回繩索與工具'],[.52,'拔出轉子鎖定銷，通知中控啟動'],[.76,'修補紀錄存檔，成為下次巡檢的比對基準']],
 draw(u){
  const sp=x=>x<.52?0:x<.8?ease(seg(x,.52,.8)):1;
  turbine(230,gyy(230),230,115,TT*1.1+.7);
  const T=turbine(X1,gyy(X1),H1,R1,Math.PI+spin(u,12,sp)*.9,{w:KW,tc:'#b9c3c9'});
  windLines(150,520,12,170,.4+.4*seg(u,.5,.8),9,50);
  const ax=T.x+20,ay=T.y-18,up=ease(seg(u,.2,.42)),py=lerp(T.y+8+R1*.8,ay+4,up);
  const ra=1-seg(u,.42,.5);ropes(ax,ay,lerp(T.y+R1+40,ay,seg(u,.36,.5)),ra);
  if(u<.46)alphaDo(1-seg(u,.4,.46),()=>person(ax+12,py,'#e8572a',1.4));
  ctx.save();ctx.translate(980,gyy(980));ctx.scale(.62,.62);truck(0,0,true,'#f4f6f7',()=>{box(4,-48,60,14,'#f2c230');});ctx.restore();
  person(900,gyy(900),'#f2c230',2.2);
  const kc=seg(u,.58,.66);if(kc>0)alphaDo(kc,()=>{const x0=1010,y0=360;card(x0,y0,520,300,{bg:'rgba(7,27,39,.9)'});
   wt(x0+20,y0+36,'葉片修補紀錄（示例）',19,'#f2c230',700);
   const IT=['巴氏硬度達標','敲擊檢查無空洞','外形與粗糙度','前緣塗層膜厚','照片與位置標註','材料批號與固化紀錄'];
   IT.forEach((t,i)=>{const y=y0+82+Math.floor(i/2)*66,x=x0+20+(i%2)*250;alphaDo(seg(u,.62+i*.03,.66+i*.03),()=>{chk(x+12,y-6);wt(x+32,y,t,16,'#fff',700);});});
   alphaDo(seg(u,.84,.9),()=>tag(x0+260,y0+272,'存入葉片維護紀錄',{size:15,bg:'#7dffc4',align:'center'}));});
  lab(T.x,T.y+R1*.7,'修補完成的前緣',{dx:-150,dy:20,st:'g',a:band(u,.02,.3)});
  lab(ax+6,ay+30,'收回繩索',{dx:120,dy:-40,st:'s',a:band(u,.3,.52)});
  lab(T.x,T.y,'解除鎖定、啟動',{dx:160,dy:70,st:'g',a:band(u,.52,.76)});
 },
 hud(u){hudPanel(250,150,'復機狀態（示例）',seg(u,.5,.56),w=>{const p=seg(u,.6,.95);
  hrow(56,'轉子鎖定',u>.52?'已解除':'鎖定中',w,u>.52?'#7dffc4':'#f2c230');hrow(88,'輸出功率',trf('{p} MW',{p:(2.1*p).toFixed(1)}),w,'#f2c230');hrow(120,'振動',p>0?'正常':'—',w,'#7dffc4');});}}
]};
/* 卡片內的一列：標籤＋數值 */
function hrowW(x,y,label,val,col){wt(x,y,label,18,'rgba(227,236,238,.85)',600);wt(x+680,y,val,22,col,700,'right',COND);}
