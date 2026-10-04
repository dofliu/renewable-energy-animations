// KITS: land
/* 陸域風電系列 第 10 集：葉片的空氣動力 */
const gyy=x=>groundY(x);
/* 正視的葉片與風機（沿用第 3、16、17 集） */
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
/* 第一支葉片上 f 比例位置（0 葉根、1 葉尖） */
function bladePt(T,rot,R,f){const a=rot-Math.PI/2,d=8+R*f;return {x:T.x+Math.cos(a)*d,y:T.y+Math.sin(a)*d};}
const STC=['#ff9d7a','#f2c230','#7dffc4'];
/* 翼型：以 1/4 弦長為轉軸，ang 為度數（正值機頭朝上） */
function foil(cx,cy,c,t,ang,fill,st,m){m=m===undefined?.035:m;ctx.save();ctx.translate(cx,cy);ctx.rotate(ang*Math.PI/180);
  const N=36,yt=x=>5*t*c*(.2969*Math.sqrt(x)-.126*x-.3516*x*x+.2843*x*x*x-.1015*x*x*x*x),yc=x=>4*m*c*x*(1-x),X=x=>(x-.25)*c;
  ctx.beginPath();for(let i=0;i<=N;i++){const x=(1-Math.cos(Math.PI*(N-i)/N))/2;ctx.lineTo(X(x),-yc(x)-yt(x));}
  for(let i=1;i<=N;i++){const x=(1-Math.cos(Math.PI*i/N))/2;ctx.lineTo(X(x),-yc(x)+yt(x));}
  ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(st){ctx.strokeStyle=st;ctx.lineWidth=2;ctx.stroke();}ctx.restore();}
function fpt(cx,cy,c,ang,x,y){const a=ang*Math.PI/180,lx=(x-.25)*c;return {x:cx+lx*Math.cos(a)-y*Math.sin(a),y:cy+lx*Math.sin(a)+y*Math.cos(a)};}
/* 示例翼型特性：升力係數、阻力係數（典型範例，非特定翼型） */
function Cl(a){if(a<11)return .11*(a+2);if(a<14)return 1.43+.12*Math.sin((a-11)/3*Math.PI/2);return 1.55-.5*ease(clamp((a-14)/6,0,1));}
function Cd(a){let d=.006+.0001*(a-1)*(a-1);if(a>12)d+=.003*(a-12)*(a-12);return d;}
/* 流線：sep 為失速程度 0–1 */
function streamY(x,y0,cl,sep){const D=Math.exp(-Math.abs(y0)/170),up=y0<0?1-.7*sep:1;
  return y0-34*cl*D*up*Math.exp(-Math.pow((x+30)/130,2))+14*cl*D*(1-.5*sep)/(1+Math.exp(-(x-90)/45));}
function streams(cx,cy,al,sep,a,R){const cl=Cl(al);R=R||[-160,-115,-72,100,140,180];
  alphaDo(a,()=>{R.forEach((y0,k)=>{const P=[];for(let x=-320;x<=330;x+=10)P.push(cx+x,cy+streamY(x,y0,cl,sep));
    ln(P,'rgba(125,200,220,.35)',1.5);
    for(let j=0;j<4;j++){const x=-320+((TT*160+j*165+k*53)%650);const y=cy+streamY(x,y0,cl,sep);
     if(!(y0<0&&sep>.3&&x>40))ln([cx+x-14,y,cx+x,cy+streamY(x+14,y0,cl,sep)],'#7dc8dc',2.5);}});});}
/* 失速渦流 */
function vortices(cx,cy,c,ang,s){if(s<=0)return;alphaDo(s,()=>{[[.45,-.13,16],[.68,-.16,22],[.92,-.14,26],[1.15,-.08,22]].forEach(([fx,fy,r],i)=>{
  const p=fpt(cx,cy,c,ang,fx,fy*c);const a0=TT*(3+i*.4)+i;ctx.beginPath();ctx.arc(p.x,p.y,r,a0,a0+4.6);ctx.strokeStyle='#ff9d7a';ctx.lineWidth=2.5;ctx.stroke();
  ctx.beginPath();ctx.arc(p.x,p.y,r*.5,a0+2,a0+6);ctx.stroke();});});}
/* 卡片內的一列：標籤＋數值 */
function rowK(x,y,label,val,col,w){wt(x,y,label,18,'rgba(227,236,238,.85)',600);wt(x+w,y,val,22,col,700,'right',COND);}
/* 速度三角形：轉速 13 rpm、轉子處軸向風速 6 m/s（來流 9 m/s 的 2/3） */
const OM=13*TAU/60,VAX=6;
const phiR=r=>Math.atan(VAX/(OM*r))*180/Math.PI;
const AD=6;

const EP={no:10,slug:'onshore-wind',seriesName:'陸域風電系列',t:'葉片的空氣動力',en:'Blade aerodynamics',
lede:'葉片為什麼要做成又長又扭的形狀？這一集把葉片切成一片片翼型，看攻角如何決定升力與阻力、攻角太大為什麼會失速，再用葉根到葉尖的速度三角形解釋葉片的扭轉角，最後看變槳系統如何控制攻角。',
facts:[['6','°','典型的設計攻角：翼型升阻比最高的附近（示例）'],
['100+','L/D','乾淨翼型在設計攻角附近，升力可達阻力的 100 倍以上（示例）'],
['12–16','°','常見風機翼型開始失速的攻角範圍（示例）'],
['82','m/s','葉尖速度示例：60 m 葉片每分鐘 13 轉'],
['2/3','倍','依貝茲理論，理想轉子處的風速約降為來流的三分之二'],
['13.3','°','NREL 5 MW 參考風機葉片從葉根到葉尖的扭轉角']],
note:'說明：本集為教育用途示意動畫，風機、葉片與翼型的比例經過調整，流線與渦流為示意繪製，阻力向量放大顯示。翼型的升力係數、阻力係數、升阻比曲線與失速角度為典型範例，並非特定翼型的風洞資料；實際數值依翼型、雷諾數與表面粗糙度而定。速度三角形以 60 m 葉片、每分鐘 13 轉、來流 9 m/s，並依貝茲理論取轉子處風速為來流的三分之二計算，忽略切向誘導速度；扭轉角 13.3° 引自 NREL 5 MW 參考風機定義（Jonkman 等，NREL/TP-500-38060，2009）。額定風速、槳距角與輸出功率為示例，實際依機型而定。',
base:()=>{landSky(GY,{sun:{x:1240,y:150},clouds:false});drawGround();},
shots:[
/* 1 ─────────────────────────────── 一串翼型 */
{t:'一支葉片，一串翼型',en:'A blade is a stack of airfoils',dur:13,side:true,
 d:'從地面看，風機葉片像一片細長的板子，但沿著葉長任何一處切開，剖面都是一個翼型，和飛機機翼的原理相同。葉根靠近輪轂，剖面厚而寬，要承受整支葉片的彎矩；越往葉尖，翼型越薄、弦長越窄，角度也一路扭轉。以長約 60 公尺、每分鐘 13 轉的葉片為例，葉尖速度約 82 m/s，葉根附近卻只有十幾 m/s。同一支葉片上，每一段遇到的氣流其實都不一樣。',
 s:[[0,'風場裡的葉片，看起來像一片細長的板子'],[.26,'沿葉長任何一處切開，剖面都是翼型'],[.52,'葉根厚而寬，葉尖薄而窄，角度也一路扭轉'],[.76,'越往外轉得越快，每一段遇到的氣流都不同']],
 draw(u){
  turbine(130,gyy(130),170,80,TT*1.1+.4);turbine(290,gyy(290),150,70,TT*1.2+1.9);
  const rot=TT*1.0+.3,T=turbine(760,gyy(760),290,200,rot);
  windLines(120,540,10,150,.5,5,50);
  [.15,.5,.93].forEach((f,i)=>{const p=bladePt(T,rot,200,f);alphaDo(seg(u,.26+i*.06,.3+i*.06),()=>{circ(p.x,p.y,8,STC[i],'#13232e',2);});});
  const mp=bladePt(T,rot,200,.6);
  lab(mp.x,mp.y,'葉片長約 60 m',{dx:120,dy:-40,st:'l',a:band(u,.04,.26)});
  lab(T.x,T.y,'輪轂',{dx:-110,dy:-50,a:band(u,.04,.26)});
  /* 剖面卡 */
  const ca=seg(u,.26,.32);if(ca>0)alphaDo(ca,()=>{card(920,360,620,330,{bg:'rgba(7,27,39,.86)'});wt(944,398,'切開葉片的剖面（示意）',20,'#f2c230',700);
   const SEC=[[1040,170,.36,16,'葉根','厚而寬'],[1250,120,.22,5,'葉中','中等厚度'],[1440,70,.15,0,'葉尖','薄而窄']];
   SEC.forEach(([x,c,t,ang,n,s],i)=>alphaDo(seg(u,.3+i*.08,.36+i*.08),()=>{const tw=lerp(0,ang,ease(seg(u,.52,.66)));
    foil(x,520,c,t,tw,'#e9eef1','rgba(0,0,0,.4)');circ(x-c*.25-14,520,6,STC[i]);
    wt(x,620,n,19,STC[i],700,'center');wt(x,652,s,16,'rgba(227,236,238,.85)',600,'center');}));
   alphaDo(seg(u,.56,.62),()=>{arrow(1030,460,1460,460,'rgba(242,194,48,.7)',2);wt(1245,450,'扭轉角漸小',16,'#f2c230',700,'center');});});
 },
 hud(u){hudPanel(250,150,'運轉狀態（示例）',seg(u,.06,.12),w=>{const ws=9+.4*nz(TT*.4);
  hrow(56,'風速',trf('{v} m/s',{v:ws.toFixed(1)}),w,'#7dffc4');hrow(88,'轉速','13 rpm',w,'#fff');
  hrow(120,'葉尖速度','82 m/s',w,'#f2c230');});}},

/* 2 ─────────────────────────────── 攻角、升力與阻力 */
{t:'攻角、升力與阻力',en:'Angle of attack, lift and drag',dur:14,
 d:'翼型弦線與迎面氣流之間的夾角稱為攻角（α）。氣流流過翼型，上表面流速較快、壓力較低，下表面壓力較高，產生垂直於來流的升力，同時也有與來流同向的阻力。攻角越大升力越大，但阻力也跟著增加。風機翼型追求的是升力與阻力的比值，也就是升阻比（L/D）：乾淨的翼型在約 6° 的設計攻角附近，升阻比可達 100 以上，這是葉片設計時瞄準的工作點。',
 s:[[0,'翼型弦線與來流的夾角，就是攻角'],[.26,'上表面壓力低、下表面壓力高，產生升力'],[.5,'攻角加大，升力增加，阻力也跟著變大'],[.76,'約 6° 時升阻比最高，是葉片的設計工作點']],
 draw(u){
  diagBG();
  const al=lerp(0,AD,ease(seg(u,.1,.28)))+lerp(0,4,ease(seg(u,.52,.64)))-lerp(0,4,ease(seg(u,.82,.92)));
  const cl=Cl(al),cd=Cd(al);
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'翼型受力（剖面示意）',20,'#f2c230',700);
  const cx=380,cy=420,c=340;
  ctx.save();rrp(62,214,696,400,10);ctx.clip();streams(cx,cy,al,0,1,[-150,-108,-70,95,135,175]);ctx.restore();
  /* 低壓、高壓區 */
  alphaDo(seg(u,.26,.32)*.8,()=>{const p=fpt(cx,cy,c,al,.3,-70),q=fpt(cx,cy,c,al,.68,78);
   wt(p.x,p.y,'低壓',17,'#7dc8dc',700,'center');wt(q.x,q.y,'高壓',17,'#ff9d7a',700,'center');});
  foil(cx,cy,c,.15,al,'#e9eef1','rgba(0,0,0,.4)');
  /* 弦線、來流方向與攻角 */
  const le=fpt(cx,cy,c,al,0,0),te=fpt(cx,cy,c,al,1,0);
  ctx.setLineDash([6,5]);ln([le.x-40*Math.cos(al*Math.PI/180),le.y-40*Math.sin(al*Math.PI/180),te.x,te.y],'rgba(242,194,48,.85)',1.5);
  ln([le.x-40,le.y,le.x+250,le.y],'rgba(227,236,238,.6)',1.5);ctx.setLineDash([]);
  if(al>.3){ctx.beginPath();ctx.arc(le.x,le.y,190,0,al*Math.PI/180);ctx.strokeStyle='#f2c230';ctx.lineWidth=2;ctx.stroke();}
  wt(730,250,trf('α = {a}°',{a:al.toFixed(1)}),26,'#f2c230',700,'right',COND);
  arrow(90,le.y,170,le.y,'#7dc8dc',3);wt(90,le.y-14,'來流',16,'#7dc8dc',700);
  /* 升力與阻力 */
  const ac=fpt(cx,cy,c,al,.25,0);
  alphaDo(seg(u,.28,.34),()=>{const L=cl*150;arrow(ac.x,ac.y,ac.x,ac.y-L,'#7dffc4',4);wt(ac.x+12,ac.y-L+8,'升力',18,'#7dffc4',700);
   const Dg=Math.max(22,cd*150*10);arrow(ac.x,ac.y,ac.x+Dg,ac.y,'#ff9d7a',4);});
  alphaDo(seg(u,.28,.34),()=>wt(ac.x-30,ac.y+56,'阻力（放大 10 倍）',15,'#ff9d7a',700,'right'));
  /* 數值 */
  rowK(90,664,'升力係數 CL',cl.toFixed(2),'#7dffc4',640);rowK(90,710,'阻力係數 CD',cd.toFixed(4),'#ff9d7a',640);
  rowK(90,756,'升阻比 L/D',Math.round(cl/cd).toString(),'#f2c230',640);
  /* 右：兩張圖 */
  const A=chartBox(800,160,740,310,{title:'升力係數與攻角（示例）',x0:0,x1:20,y0:0,y1:1.8,xt:[0,5,10,15,20],yt:[0,.5,1,1.5],xl:'攻角 α（°）',yl:'CL',pl:70,pt:64,pb:58,gx:4,gy:3});
  const g=ease(seg(u,.04,.24));ctx.beginPath();for(let a=0;a<=20*g;a+=.25){const y=A.Y(Cl(a));a?ctx.lineTo(A.X(a),y):ctx.moveTo(A.X(a),y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=3;ctx.stroke();
  circ(A.X(al),A.Y(cl),8,'#f2c230','#13232e',2);
  const B=chartBox(800,490,740,310,{title:'升阻比與攻角（示例）',x0:0,x1:20,y0:0,y1:120,xt:[0,5,10,15,20],yt:[0,40,80,120],xl:'攻角 α（°）',yl:'L/D',pl:70,pt:64,pb:58,gx:4,gy:3});
  const g2=ease(seg(u,.5,.7));ctx.beginPath();for(let a=0;a<=20*g2;a+=.25){const y=B.Y(Cl(a)/Cd(a));a?ctx.lineTo(B.X(a),y):ctx.moveTo(B.X(a),y);}ctx.strokeStyle='#f2c230';ctx.lineWidth=3;ctx.stroke();
  if(g2>0)circ(B.X(al),B.Y(cl/cd),8,'#f2c230','#13232e',2);
  alphaDo(seg(u,.76,.82),()=>{ctx.setLineDash([5,5]);ln([B.X(6),B.Y(0),B.X(6),B.Y(118)],'rgba(242,194,48,.7)',1.5);ctx.setLineDash([]);
   tag(B.X(6)+16,B.Y(112),'設計攻角約 6°',{size:16,bg:'#f2c230'});});
 }},

/* 3 ─────────────────────────────── 速度三角形 */
{t:'葉根到葉尖的速度三角形',en:'Velocity triangles from root to tip',dur:14,side:true,
 d:'葉片感受到的是相對風，由兩個速度合成：一是穿過轉子的風，依貝茲理論在轉子處約降為來流的三分之二，例如 9 m/s 的風剩下約 6 m/s；二是葉片本身運動造成的迎面風，大小等於該處的線速度。葉根 r = 10 m 處線速度約 14 m/s，相對風與旋轉面的夾角約 24°；到了葉尖 r = 60 m，線速度約 82 m/s，相對風幾乎貼著旋轉面吹來，夾角只剩約 4°。',
 s:[[0,'相對風＝穿過轉子的風＋葉片運動的迎面風'],[.24,'葉根轉得慢，相對風斜斜地吹來，約 24°'],[.5,'越往外線速度越大，相對風越貼近旋轉面'],[.74,'要維持相同攻角，每一段葉片都得轉到不同角度']],
 draw(u){
  const rot=TT*1.0+.3,T=turbine(380,gyy(380),250,170,rot);
  windLines(120,540,8,150,.45,7,50);
  const RS=[10,30,60],NM=['葉根','葉中','葉尖'];
  RS.forEach((r,i)=>{const a=seg(u,.06+i*.2,.12+i*.2);if(a<=0)return;const p=bladePt(T,rot,170,r/60*.95);alphaDo(a,()=>circ(p.x,p.y,8,STC[i],'#13232e',2));
   const y=150+i*205;alphaDo(a,()=>{card(700,y,840,190,{bg:'rgba(7,27,39,.86)'});
    wt(724,y+36,NM[i],20,STC[i],700);wt(724+wtw(NM[i],20,700)+14,y+36,trf('r = {r} m',{r}),18,'rgba(227,236,238,.85)',600,'left',COND);
    const k=4.4,vt=OM*r,x0=740,y0=y+76,x1=x0+vt*k,y1=y0+VAX*k,ph=phiR(r);
    arrow(x0,y0,x1,y0,'#7dc8dc',3);arrow(x1,y0,x1,y1,'#7dffc4',3);arrow(x0,y0,x1,y1,'#f2c230',4);
    ctx.beginPath();ctx.arc(x0,y0,Math.min(90,vt*k*.6),0,ph*Math.PI/180);ctx.strokeStyle='rgba(242,194,48,.8)';ctx.lineWidth=1.5;ctx.stroke();
    const tx=1180;rowK(tx,y+80,'葉片速度',trf('{v} m/s',{v:vt.toFixed(1)}),'#7dc8dc',330);
    rowK(tx,y+118,'軸向風速','6.0 m/s','#7dffc4',330);rowK(tx,y+156,'相對風角 φ',trf('{p}°',{p:ph.toFixed(1)}),'#f2c230',330);
    /* 對應的翼型角度 */
    alphaDo(seg(u,.74,.82),()=>{const th=ph-AD;foil(800,y+142,110,.12+.06*(2-i),th,'#e9eef1','rgba(0,0,0,.4)');
     wt(880,y+148,trf('安裝角 {t}°',{t:th.toFixed(1)}),16,'#fff',700);});});});
  alphaDo(band(u,.04,.3),()=>{lab(T.x,T.y+120,'旋轉面',{dx:-90,dy:40,st:'l'});});
 }},

/* 4 ─────────────────────────────── 扭轉角 */
{t:'葉片為什麼要扭轉',en:'Why the blade is twisted',dur:14,
 d:'既然相對風角從葉根的約 24° 一路降到葉尖的約 4°，若葉片是一片平直的板子，葉根的攻角會大到失速，葉尖卻只剩很小的升力。所以葉片沿長度扭轉：每一段的安裝角等於相對風角減去設計攻角，讓整支葉片都在約 6° 的攻角附近工作。理想的扭轉在葉根附近變化最急，實際葉片還要兼顧結構與製造，例如 NREL 5 MW 參考風機從葉根到葉尖扭轉 13.3°。',
 s:[[0,'相對風角從葉根到葉尖一路變小'],[.28,'安裝角＝相對風角－設計攻角'],[.52,'不扭轉的葉片：葉根失速，葉尖幾乎沒有升力'],[.74,'扭轉之後，整支葉片都在設計攻角附近工作']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,700,640,{title:'沿葉長的角度變化（示例）',x0:0,x1:60,y0:-5,y1:35,xt:[0,10,20,30,40,50,60],yt:[0,10,20,30],xl:'距轉軸 r（m）',yl:'角度（°）',pl:76,pt:74,pb:70,gx:6,gy:4});
  ln([C.X(0),C.Y(0),C.X(60),C.Y(0)],'rgba(255,255,255,.35)',1);
  const draw1=(f,col,g)=>{if(g<=0)return;ctx.beginPath();for(let r=7;r<=7+53*g;r+=.5){const y=C.Y(f(r));r>7?ctx.lineTo(C.X(r),y):ctx.moveTo(C.X(r),y);}ctx.strokeStyle=col;ctx.lineWidth=3.5;ctx.stroke();};
  draw1(phiR,'#f2c230',ease(seg(u,.04,.26)));draw1(r=>phiR(r)-AD,'#7dffc4',ease(seg(u,.28,.46)));
  alphaDo(seg(u,.2,.26),()=>{circ(C.X(9),C.Y(31),6,'#f2c230');wt(C.X(9)+14,C.Y(31)+6,'相對風角 φ',17,'#f2c230',700);});
  alphaDo(seg(u,.42,.48),()=>{circ(C.X(9),C.Y(27),6,'#7dffc4');wt(C.X(9)+14,C.Y(27)+6,'安裝角 θ = φ − 6°',17,'#7dffc4',700);
   arrow(C.X(20),C.Y(phiR(20)-AD),C.X(20),C.Y(phiR(20)),'rgba(227,236,238,.8)',2,8);wt(C.X(20)+10,C.Y(phiR(20)-AD/2)+6,'α = 6°',16,'#fff',700,'left',COND);});
  /* 右上：不扭轉 vs 扭轉 */
  card(800,160,740,330,{bg:'rgba(7,27,39,.75)'});
  const tw=ease(seg(u,.7,.8)),as=seg(u,.5,.56);
  wt(824,200,tw<.5?'葉片不扭轉時':'葉片扭轉後',20,tw<.5?'#ff9d7a':'#7dffc4',700);
  if(as>0)alphaDo(as,()=>{[10,30,60].forEach((r,i)=>{const x=920+i*230,y=330,ph=phiR(r),th=lerp(phiR(60)-AD,ph-AD,tw),al=ph-th;
   const a=ph*Math.PI/180;arrow(x-120*Math.cos(a)-30,y-120*Math.sin(a),x-38*Math.cos(a)-30,y-38*Math.sin(a),'#7dc8dc',3);
   const st=al>14;foil(x,y,150,.2-.04*i,th,st?'#ffd2c2':'#e9eef1','rgba(0,0,0,.4)');
   vortices(x,y,150,th,st?seg(u,.54,.6)*(1-tw):0);
   wt(x,y+92,['葉根','葉中','葉尖'][i],17,STC[i],700,'center');
   wt(x,y+124,trf('α = {a}°',{a:al.toFixed(1)}),20,st?'#ff9d7a':(al<8?'#7dffc4':'#f2c230'),700,'center',COND);});});
  /* 右下：重點 */
  card(800,510,740,290,{bg:'rgba(7,27,39,.75)'});wt(824,550,'扭轉的設計取捨',20,'#f2c230',700);
  [['理想扭轉約 20°，在葉根附近變化最急','#fff'],['葉根要承受彎矩，剖面厚、接近圓形','rgba(227,236,238,.9)'],['實際扭轉常較小，兼顧結構與製造','rgba(227,236,238,.9)'],['例：NREL 5 MW 參考風機扭轉 13.3°','#7dffc4']].forEach(([t,col],i)=>
   alphaDo(seg(u,.3+i*.12,.36+i*.12),()=>{circ(836,594+i*52,5,'#f2c230');wt(854,600+i*52,t,18,col,600);}));
 }},

/* 5 ─────────────────────────────── 失速 */
{t:'攻角太大：失速',en:'Too steep: stall',dur:13,
 d:'攻角超過某個角度，氣流無法再貼著上表面流動，會從翼型表面分離，形成紊亂的渦流，這就是失速。常見風機翼型大約在 12–16° 開始失速：升力不增反降，阻力急遽增加，葉片也會振動並產生噪音。早期的定槳距風機刻意利用失速，在強風時自動限制出力；現代大型風機則以變槳控制攻角，避開失速區，出力更平穩，載重也更容易掌握。',
 s:[[0,'攻角逐漸加大，升力跟著增加'],[.3,'超過約 14°，氣流從上表面分離'],[.54,'升力驟降、阻力暴增，葉片振動加劇'],[.78,'現代風機以變槳控制攻角，避開失速區']],
 draw(u){
  diagBG();
  const al=lerp(4,18,ease(seg(u,.04,.56))),sep=seg(al,13.2,16),cl=Cl(al),cd=Cd(al);
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'氣流分離（剖面示意）',20,sep>.3?'#ff9d7a':'#f2c230',700);
  const cx=380,cy=430,c=320,sh=sep*2*Math.sin(TT*23);
  ctx.save();rrp(62,214,696,420,10);ctx.clip();streams(cx,cy,al,sep,1,[-160,-115,-72,105,145,185]);ctx.restore();
  foil(cx,cy+sh,c,.15,al,'#e9eef1','rgba(0,0,0,.4)');vortices(cx,cy+sh,c,al,sep);
  const ac=fpt(cx,cy,c,al,.25,0);
  arrow(ac.x,ac.y,ac.x,ac.y-cl*150,'#7dffc4',4);wt(ac.x+12,ac.y-cl*150+8,'升力',18,'#7dffc4',700);
  arrow(ac.x,ac.y,ac.x+Math.max(22,Math.min(260,cd*150*10)),ac.y,'#ff9d7a',4);
  wt(90,250,trf('α = {a}°',{a:al.toFixed(1)}),26,sep>.3?'#ff9d7a':'#f2c230',700,'left',COND);
  alphaDo(sep,()=>{const p=fpt(cx,cy,c,al,.8,-.32*c);lab(p.x,p.y,'分離渦流',{dx:60,dy:-50,st:'w'});});
  rowK(90,690,'升力係數 CL',cl.toFixed(2),'#7dffc4',640);rowK(90,736,'升阻比 L/D',Math.round(cl/cd).toString(),sep>.3?'#ff9d7a':'#f2c230',640);
  /* 右上：CL 曲線 */
  const A=chartBox(800,160,740,330,{title:'升力係數與失速（示例）',x0:0,x1:20,y0:0,y1:1.8,xt:[0,5,10,15,20],yt:[0,.5,1,1.5],xl:'攻角 α（°）',yl:'CL',pl:70,pt:64,pb:58,gx:4,gy:3});
  box(A.X(14),A.py,A.X(20)-A.X(14),A.ph,'rgba(232,87,42,.16)');wt(A.X(17),A.py+26,'失速區',17,'#ff9d7a',700,'center');
  ctx.beginPath();for(let a=0;a<=20;a+=.25){const y=A.Y(Cl(a));a?ctx.lineTo(A.X(a),y):ctx.moveTo(A.X(a),y);}ctx.strokeStyle='rgba(125,255,196,.45)';ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();for(let a=0;a<=al;a+=.25){const y=A.Y(Cl(a));a?ctx.lineTo(A.X(a),y):ctx.moveTo(A.X(a),y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=3.5;ctx.stroke();
  circ(A.X(al),A.Y(cl),8,sep>.3?'#e8572a':'#f2c230','#13232e',2);
  /* 右下：影響 */
  card(800,510,740,290,{bg:'rgba(7,27,39,.75)'});wt(824,550,'失速的影響與對策',20,'#f2c230',700);
  [['升力驟降、阻力暴增','#ff9d7a',.5],['葉片振動與噪音增加','#ff9d7a',.58],['早期定槳距風機：利用失速限制出力','rgba(227,236,238,.9)',.72],['現代大型風機：以變槳避開失速','#7dffc4',.8]].forEach(([t,col,k],i)=>
   alphaDo(seg(u,k,k+.06),()=>{circ(836,594+i*52,5,col);wt(854,600+i*52,t,18,col,600);}));
 }},

/* 6 ─────────────────────────────── 變槳控制攻角 */
{t:'變槳控制攻角',en:'Pitching to control the angle of attack',dur:14,side:true,
 d:'風速低於額定時，葉片維持在最佳槳距角，讓各段攻角接近設計值，盡量多捕捉風能。風速超過約 11 m/s 的額定風速後，轉速已達上限，若葉片不動，相對風角變大，攻角也跟著增加，出力會超過發電機的額定。這時變槳系統把整支葉片往順槳方向轉，槳距角加大、攻角變小，升力減少，出力維持在額定值。颱風或風速超過切出值時，葉片轉到約 90° 順槳，幾乎不再產生驅動力。',
 s:[[0,'風速低於額定，葉片保持在最佳角度'],[.3,'風速超過約 11 m/s，葉片開始轉向順槳'],[.54,'槳距角加大、攻角變小，出力維持在額定'],[.8,'颱風或超過切出風速時，葉片轉到約 90° 停機']],
 draw(u){
  const v=lerp(8,15,ease(seg(u,.08,.62)))+11*ease(seg(u,.8,.88)),pt=Math.min(10,Math.max(0,v-11)*2.5);
  const T=turbine(540,gyy(540),260,180,TT*1.0+.3);
  windLines(120,540,8+Math.round(v-8),110+10*v,.5,9,50);
  lab(T.x,T.y,'變槳軸承轉動整支葉片',{dx:120,dy:80,st:'s',a:band(u,.3,.62)});
  /* 剖面卡：r = 30 m */
  card(860,360,680,440,{bg:'rgba(7,27,39,.88)'});wt(884,398,'葉中剖面 r = 30 m（示例）',20,'#f2c230',700);
  const ph=Math.atan(v*2/3/(OM*30))*180/Math.PI,th0=phiR(30)-AD,fe=ease(seg(u,.84,.96)),th=lerp(th0+pt,88,fe),al=ph-th,al0=ph-th0;
  const cx=1170,cy=560,a=ph*Math.PI/180;
  arrow(cx-230*Math.cos(a)-60,cy-230*Math.sin(a),cx-90*Math.cos(a)-60,cy-90*Math.sin(a),'#7dc8dc',3.5);
  wt(cx-280,cy-60,'相對風',16,'#7dc8dc',700);
  alphaDo(seg(u,.3,.4)*(1-fe)*.5,()=>{ctx.setLineDash([5,5]);foil(cx,cy,220,.16,th0,'rgba(255,255,255,.04)','rgba(255,157,122,.8)');ctx.setLineDash([]);});
  foil(cx,cy,220,.16,th,'#e9eef1','rgba(0,0,0,.4)');
  if(pt>0&&fe<.5)alphaDo(seg(u,.36,.42),()=>{ctx.beginPath();ctx.arc(cx,cy,130,th0*Math.PI/180,th*Math.PI/180);ctx.strokeStyle='#f2c230';ctx.lineWidth=2.5;ctx.stroke();
   const e=th*Math.PI/180;wt(cx+140*Math.cos(e)+8,cy+140*Math.sin(e)+20,'往順槳方向',16,'#f2c230',700);});
  rowK(884,716,'攻角 α',trf('{a}°',{a:al.toFixed(1)}),fe>.5?'#7dc8dc':'#7dffc4',620);
  alphaDo(seg(u,.4,.46)*(1-fe),()=>rowK(884,760,'不變槳時的攻角',trf('{a}°',{a:al0.toFixed(1)}),'#ff9d7a',620));
  alphaDo(fe,()=>rowK(884,760,'順槳停機','≈ 90°','#f2c230',620));
 },
 hud(u){hudPanel(250,182,'變槳控制（示例）',seg(u,.04,.1),w=>{const v=lerp(8,15,ease(seg(u,.08,.62)))+11*ease(seg(u,.8,.88)),fe=ease(seg(u,.84,.96)),pt=lerp(Math.min(10,Math.max(0,v-11)*2.5),90,fe);
  const P=fe>0?4.2*(1-fe):v<11?4.2*(v*v*v-27)/(1331-27):4.2;
  hrow(56,'風速',trf('{v} m/s',{v:v.toFixed(1)}),w,'#7dffc4');hrow(88,'槳距角',trf('{p}°',{p:pt.toFixed(1)}),w,'#f2c230');
  hrow(120,'輸出功率',trf('{p} MW',{p:P.toFixed(1)}),w,'#fff');hrow(152,'額定功率','4.2 MW',w,'#ff9d7a');});}}
]};
