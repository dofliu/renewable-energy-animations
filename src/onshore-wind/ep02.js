// KITS: land
/* 陸域風電系列 第 2 集：風機如何把風變成電 */
const gyy=x=>groundY(x);
const VR=10,VIN=3,VOUT=25;                               // 功率曲線參數（m/s，典型範例）
/* 4.2 MW 級風機的功率曲線（MW，示意）：切入後約與 v³ 成正比，接近額定時平滑收斂 */
const pwr=v=>{if(v<VIN||v>VOUT)return 0;const x=(v*v*v-27)/(VR*VR*VR-27);return 4.2*x/Math.pow(1+Math.pow(x,10),.1);};
const rpmAt=v=>v<VIN||v>VOUT?0:Math.min(11,9*v/8);         // 轉速（rpm）：λ≈8，葉尖速度上限約 78 m/s
const pitchAt=v=>v>VOUT?90:v<11?0:Math.min(25,(v-11)*1.8); // 槳距角（度）
/* Cp–λ 經驗式（β=0） */
const cpL=l=>{if(l<=.2)return 0;const li=1/(1/l-.035);return Math.max(0,.5176*(116/li-5)*Math.exp(-21/li)+.0068*l);};
/* 正視的葉片：w 為寬度比例（順槳時變窄） */
function bladeF(cx,cy,a,L,w){w=w===undefined?1:w;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
  const k=Math.max(.18,w);poly([8,-5*k,8+L*.2,-10*k,8+L,-1.5*k,8+L,1.5*k,8+L*.2,8*k,8,5*k],'#f4f6f7','rgba(0,0,0,.35)',1);ctx.restore();}
/* 正視的風機：底 (x,gy)，輪轂高 H，葉片長 R，轉角 rot */
function turbine(x,gy,H,R,rot,o){o=o||{};const hy=gy-H,w0=Math.max(4,R*.09),w1=Math.max(2.5,R*.05);
  poly([x-w0,gy,x-w1,hy+R*.06,x+w1,hy+R*.06,x+w0,gy],'#eef2f4','rgba(0,0,0,.3)',1);
  box(x-R*.1,hy-R*.08,R*.2,R*.13,'#e3e8ec','rgba(0,0,0,.3)',1);
  for(let i=0;i<3;i++)bladeF(x,hy,rot+i*TAU/3-Math.PI/2,R,o.w);
  circ(x,hy,Math.max(3,R*.07),'#dfe5e8','rgba(0,0,0,.4)',1);return {x,y:hy};}
/* 風線：由左向右流動 */
function windLines(y0,y1,n,sp,a,seed,len){if(a<=0)return;const r=rng(seed||3);ctx.lineCap='round';
  for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),ph=r(),s=sp*(.7+.6*r()),L=(len||60)*(.6+.8*r());const x=VX0-200+((ph*2400+TT*s)%(VX1-VX0+400));
   alphaDo(a*(.25+.35*r()),()=>ln([x,y,x+L,y],'#ffffff',2));}ctx.lineCap='butt';}
function farTurbines(){[[1090,110,34],[1240,130,40],[1400,100,30],[1520,120,36]].forEach(([x,h,r],i)=>alphaDo(.75,()=>turbine(x,gyy(x),h,r,TT*1.1+i*1.7)));}
/* 流管：風速比例 vr(x)，半徑 rt(x) */
const SCX=410,SCY=470,SRR=110;
const vr=x=>1-(1/3)*(1+Math.tanh((x-SCX)/70));
const rt=x=>SRR*Math.sqrt((2/3)/vr(x));
const STT=(()=>{const a=[[90,0]];let t=0;for(let x=92;x<=730;x+=2){t+=2/vr(x-1);a.push([x,t]);}return a;})();
function stX(p){const T=STT[STT.length-1][1]*p;let lo=0,hi=STT.length-1;while(hi-lo>1){const m=(lo+hi)>>1;STT[m][1]<T?lo=m:hi=m;}return STT[hi][0];}
/* 翼型：中心 (cx,cy)、弦長 c、弦向單位向量 d（前緣→後緣）、吸力面法向 n */
function airfoil(cx,cy,c,d,n,fill){const P=[],N=40,th=.15,cam=.03;
  const pt=(s,side)=>{const yt=5*th*(.2969*Math.sqrt(s)-.126*s-.3516*s*s+.2843*s*s*s-.1015*s*s*s*s),yc=cam*4*s*(1-s),o=(yc+side*yt)*c,a=(s-.35)*c;return [cx+d[0]*a+n[0]*o,cy+d[1]*a+n[1]*o];};
  for(let i=0;i<=N;i++){const s=1-Math.cos(Math.PI*i/N)*.5-.5;P.push(...pt(1-s,1));}
  for(let i=0;i<=N;i++){const s=1-Math.cos(Math.PI*i/N)*.5-.5;P.push(...pt(s,-1));}
  poly(P,fill||'#eef2f4','rgba(0,0,0,.4)',1.5);}
const unit=(x,y)=>{const L=Math.hypot(x,y)||1;return [x/L,y/L];};
/* 角度積分：dur 秒的分鏡中，角速度 f(u)（rad/s）累積到 u 的轉角 */
function spin(u,dur,f){let a=0;const N=120;for(let i=0;i<N;i++){const x=u*(i+.5)/N;a+=f(x);}return a*u*dur/N;}
const lamAt=u=>u<.26?8:u<.46?lerp(8,2.5,ease(seg(u,.26,.34))):u<.7?lerp(2.5,13.5,ease(seg(u,.46,.58))):lerp(13.5,8,ease(seg(u,.7,.8)));
const vAt=u=>u<.05?1.5:u<.86?lerp(1.5,27,seg(u,.05,.86)):27;
function vec(x,y,d,L,col,lw,a){if(a<=0)return;alphaDo(a,()=>arrow(x,y,x+d[0]*L,y+d[1]*L,col,lw||4));}

const EP={no:2,slug:'onshore-wind',seriesName:'陸域風電系列',t:'風機如何把風變成電',en:'How a wind turbine turns wind into electricity',
lede:'風機的葉片不是被風推著轉，而是像飛機機翼一樣靠升力。這一集從風中的能量談起，看貝茲極限、升力與葉尖速比，以及風機如何靠變槳與偏航隨風調整，畫出一條功率曲線。',
facts:[['59.3','%','貝茲極限：理論上風機最多能擷取通過轉子的風能比例（16/27）'],
['0.45–0.50','Cp','現代三葉片風機在最佳狀態的功率係數'],
['8','倍','風速加倍，風中的功率變為 8 倍（與風速三次方成正比）'],
['7–9','λ','三葉片風機效率最高的葉尖速比範圍'],
['3 / 11 / 25','m/s','切入、額定、切出風速的典型範例'],
['約 94','萬瓩','台灣陸域風電累計裝置容量（能源署統計，2026 年）']],
note:'說明：本集為教育用途示意動畫，風機與地景比例經過調整。風機以台灣常見的 4.2 MW 級陸域機型為典型範例（葉片約 67 m、轉子直徑約 136 m、輪轂高度約 99 m）；風中功率以空氣密度 1.225 kg/m³ 計算；貝茲極限 16/27 為理論值；Cp–λ 曲線採用文獻常用的經驗式，功率曲線、轉速、槳距角、切入 3 m/s／額定 11 m/s／切出 25 m/s 與偏航損失皆為典型範例，實際依各機型製造商規格而定（部分機型的切出風速更高或採逐步降載）。台灣陸域風電裝置容量引自經濟部能源署能源統計。',
base:()=>{landSky(GY,{sun:{x:1260,y:130},clouds:false});drawGround();},
shots:[
{t:'風中的風機',en:'A turbine in the wind',dur:12,side:true,
 d:'台灣西部沿海每年秋冬吹起強勁的東北季風，是陸域風機最早落腳的地方。一部 4.2 MW 級的陸域風機，輪轂高度約 99 公尺，三支葉片各長約 67 公尺，轉動時掃過的圓面積約 1.45 萬平方公尺，大約是兩座足球場。風讓葉片轉動，轉軸帶動機艙裡的發電機，再經變流器與變壓器送上電網。這一集從風的能量談起，看葉片為什麼會轉、風機最多能擷取多少風能，以及它如何隨風速調整。',
 s:[[0,'海岸邊的風機，三支葉片迎著季風轉動'],[.28,'葉片轉動，帶動機艙裡的發電機'],[.55,'葉片長 67 公尺，掃過約兩座足球場的面積'],[.8,'風是怎麼變成電的？先從風的能量看起']],
 cam:u=>camMix({x:800,y:440,s:1.02},{x:760,y:420,s:1.1},ease(seg(u,.1,.7))),
 draw(u){
  farTurbines();
  const T=turbine(640,gyy(640),300,160,TT*8.8*TAU/60*1.6);
  windLines(160,560,26,260,1,4,70);
  alphaDo(band(u,.55,.85),()=>{ctx.setLineDash([8,7]);ring(T.x,T.y,168,'rgba(242,194,48,.9)',2.5);ctx.setLineDash([]);});
  lab(T.x+80,T.y-110,'葉片',{dx:70,dy:-40,st:'l',a:band(u,.04,.5)});
  lab(T.x,T.y,'輪轂與機艙',{dx:130,dy:-20,st:'s',a:band(u,.08,.5)});
  lab(T.x,gyy(640)-120,'塔架',{dx:90,dy:10,a:band(u,.12,.5)});
  lab(T.x,T.y+168,'掃掠面積 約 1.45 萬 m²',{dx:150,dy:60,st:'s',a:band(u,.55,.85)});
  lab(300,300,'東北季風',{dx:0,dy:-60,st:'g',a:band(u,.78,1)});
 },
 hud(u){hudPanel(240,150,'風機即時數據（示例）',seg(u,.05,.1),w=>{const v=7.8+.6*nz(TT*.3);
  hrow(56,'輪轂風速',trf('{v} m/s',{v:v.toFixed(1)}),w,'#fff');hrow(88,'轉子轉速',trf('{r} rpm',{r:rpmAt(v).toFixed(1)}),w,'#7dc8dc');hrow(120,'輸出功率',trf('{p} MW',{p:pwr(v).toFixed(2)}),w,'#f2c230');});}},

{t:'風裡有多少能量',en:'How much energy the wind carries',dur:13,
 d:'風機能發多少電，要先看通過葉片掃掠面的風帶著多少能量。風的功率 P = ½ρAv³：ρ 是空氣密度，海平面約 1.225 kg/m³；A 是葉片掃過的圓面積，與葉片長度的平方成正比；v 是風速，而且是三次方。以直徑約 136 公尺的轉子為例，風速 4 m/s 時風中功率約 0.6 MW，8 m/s 時約 4.6 MW，12 m/s 時超過 15 MW。這就是風機越做越大、塔架越蓋越高，並且選在風大地點的原因。',
 s:[[0,'風的功率取決於空氣密度、掃掠面積與風速'],[.28,'葉片越長，掃掠面積按半徑平方增加'],[.5,'風速加倍，風中的功率變成 8 倍'],[.78,'所以風機要蓋得高，設在風大的地方']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'風的功率公式',20,'#f2c230',700);
  alphaDo(seg(u,.02,.08),()=>wt(410,290,'P = ½ ρ A v³',48,'#fff',700,'center',COND));
  const cx=230,cy=530,R=140;
  alphaDo(seg(u,.28,.34),()=>{circ(cx,cy,R,'rgba(242,194,48,.14)','#f2c230',2.5);turbine(cx,cy+R+70,70+R,R*.93,TT*.8);
   ln([cx,cy,cx+R*Math.cos(-.5),cy+R*Math.sin(-.5)],'#f2c230',2);wt(cx,cy-R-14,'r = 68 m',17,'#f2c230',700,'center',COND);});
  const TM=[['ρ　空氣密度','1.225 kg/m³','#7dc8dc',.1],['A　掃掠面積','π r² ≈ 14,500 m²','#f2c230',.28],['v　風速','功率與 v³ 成正比','#ff9d7a',.5]];
  TM.forEach(([a,b,c,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=410+i*110;box(420,y-26,5,64,c);wt(440,y,a,19,'#fff',700);wt(440,y+32,b,19,c,700,'left',COND);}));
  const C=chartBox(800,160,740,640,{title:'轉子掃掠面內的風功率（示例）',x0:0,x1:3,y0:0,y1:16,yt:[0,4,8,12,16],yl:'MW',pl:76,pt:70,pb:70,gx:3,gy:4});
  const B=[[4,.57,'×1',.14],[8,4.56,'×8',.5],[12,15.4,'×27',.62]];
  B.forEach(([v,p,k,t0],i)=>{const g=ease(seg(u,t0,t0+.1)),x0=C.X(i+.25),x1=C.X(i+.75);
   wt((x0+x1)/2,C.py+C.ph+30,trf('{v} m/s',{v}),18,'rgba(227,236,238,.9)',700,'center',COND);
   if(g<=0)return;box(x0,C.Y(p*g),x1-x0,C.Y(0)-C.Y(p*g),i===1?'#f2c230':'#7dc8dc');
   alphaDo(seg(u,t0+.08,t0+.12),()=>{wt((x0+x1)/2,C.Y(p)-40,trf('{p} MW',{p:p.toFixed(1)}),20,'#fff',700,'center',COND);wt((x0+x1)/2,C.Y(p)-14,k,18,'#7dffc4',700,'center',COND);});});
  alphaDo(seg(u,.52,.58),()=>tag(C.X(.9),C.py+40,'風速加倍，功率變 8 倍',{size:17,bg:'#f2c230',align:'center'}));
  wt(C.px+C.pw,C.py+C.ph+58,'輪轂高度風速',16,'rgba(227,236,238,.7)',500,'right');
 }},

{t:'貝茲極限',en:'The Betz limit',dur:13,
 d:'風機擷取能量，就是讓風減速。但風不能被完全擋住，否則後面的空氣流不走，風也不再通過轉子。1919 年德國物理學家貝茲（Albert Betz）證明，當轉子處的風速降為上游的三分之二、下游再降到三分之一時，擷取的比例最高，為 16/27，也就是 59.3%，稱為貝茲極限。實際風機還有葉片阻力、葉尖渦流與尾流旋轉等損失，現代三葉片風機的功率係數 Cp 約為 0.45 到 0.50。',
 s:[[0,'風通過轉子被減速，流管向外擴張'],[.28,'把風完全擋住，風就不再流過轉子'],[.52,'風速減慢三分之一時，擷取比例最高'],[.78,'理論上限 59.3%，現代風機約可達 45–50%']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'通過轉子的流管',20,'#f2c230',700);
  const up=[],dn=[];for(let x=90;x<=730;x+=8){up.push(x,SCY-rt(x));dn.push(x,SCY+rt(x));}
  alphaDo(.9,()=>{ctx.setLineDash([6,6]);ln(up,'rgba(125,200,220,.8)',2);ln(dn,'rgba(125,200,220,.8)',2);ctx.setLineDash([]);});
  for(let k=0;k<36;k++){const lane=((k%6)-2.5)/2.9,p=(TT*.16+Math.floor(k/6)/6+(k%6)*.037)%1,x=stX(p);circ(x,SCY+lane*rt(x)*.95,3.5,'rgba(255,255,255,.85)');}
  box(SCX-5,SCY-SRR,10,SRR*2,'rgba(242,194,48,.85)');circ(SCX,SCY,9,'#fff');
  const A=[[140,1,'上游風速 100%','#7dc8dc'],[SCX,2/3,'轉子處 67%','#f2c230'],[650,1/3,'下游 33%','#ff9d7a']];
  A.forEach(([x,f,t,c],i)=>alphaDo(seg(u,.04+i*.06,.1+i*.06),()=>{const y=i===1?SCY+SRR+60:SCY+rt(x)+40;arrow(x-f*55,y,x+f*55,y,c,4);wt(x,y+34,t,17,c,700,'center');}));
  alphaDo(seg(u,.02,.08),()=>wt(SCX,SCY-SRR-24,'轉子',17,'#f2c230',700,'center'));
  const C=chartBox(800,160,740,640,{title:'擷取比例與風速減慢的關係',x0:0,x1:.6,y0:0,y1:.7,yt:[],pl:80,pt:70,pb:70,gx:6,gy:7});
  [0,.1,.2,.3,.4,.5,.6].forEach(v=>wt(C.X(v),C.py+C.ph+22,Math.round(v*100)+'%',16,'rgba(227,236,238,.75)',600,'center',COND));
  [0,.2,.4,.6].forEach(v=>wt(C.px-10,C.Y(v)+5,Math.round(v*100)+'%',16,'rgba(227,236,238,.75)',600,'right',COND));
  wt(C.px+C.pw,C.py+C.ph+54,'轉子處風速減慢的比例',16,'rgba(227,236,238,.7)',500,'right');
  wt(C.px,C.py-14,'功率係數 Cp',16,'rgba(227,236,238,.7)',500,'left');
  const cp=a=>4*a*(1-a)*(1-a),aE=.6*seg(u,.1,.5);
  if(aE>0){ctx.beginPath();for(let a=0;a<=aE;a+=.005){const x=C.X(a),y=C.Y(cp(a));a?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=3.5;ctx.stroke();}
  alphaDo(band(u,.3,.7),()=>{const x=C.X(.58),y=C.Y(cp(.58));circ(x,y,6,'#ff9d7a');wt(x-8,y-14,'擋得太多',16,'#ff9d7a',700,'right');});
  alphaDo(seg(u,.52,.58),()=>{const x=C.X(1/3),y=C.Y(16/27);ctx.setLineDash([6,6]);ln([C.px,y,C.px+C.pw,y],'#f2c230',2);ln([x,y,x,C.py+C.ph],'rgba(242,194,48,.6)',1.5);ctx.setLineDash([]);
   circ(x,y,8,'#f2c230');wt(C.px+C.pw-8,y-12,'貝茲極限 59.3%',19,'#f2c230',700,'right');wt(x+10,C.py+C.ph-12,'減慢 1/3',16,'#f2c230',700,'left');});
  alphaDo(seg(u,.78,.84),()=>{box(C.px,C.Y(.5),C.pw,C.Y(.45)-C.Y(.5),'rgba(125,200,220,.25)');wt(C.px+12,C.Y(.45)+26,'現代風機 45–50%',17,'#7dc8dc',700,'left');});
 }},

{t:'升力讓葉片轉動',en:'Lift turns the blades',dur:14,
 d:'葉片不是被風推著轉，而是像飛機機翼一樣靠升力。把葉片切開，剖面是一個翼型。葉片本身在轉動，所以它感受到的是「相對風」：由真實的風與葉片運動速度合成，越靠近葉尖，葉片速度越快，相對風就越斜。氣流流過翼型，上下表面的壓力差產生垂直於相對風的升力。升力沿轉動方向的分量產生扭力讓轉子旋轉，沿風向的分量則成為推力，由塔架與基礎承受。',
 s:[[0,'把葉片切開，剖面就像一片機翼'],[.25,'葉片在轉動，迎面而來的相對風變成斜的'],[.5,'氣流產生升力，方向與相對風垂直'],[.74,'升力沿轉動方向的分量，推動轉子旋轉']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'正面看轉子',20,'#f2c230',700);
  const hx=410,hy=500,R=240,rot=TT*.35;
  for(let i=0;i<3;i++)bladeF(hx,hy,rot+i*TAU/3-Math.PI/2,R);circ(hx,hy,16,'#dfe5e8','rgba(0,0,0,.4)',1);
  alphaDo(seg(u,.04,.1),()=>{const a=rot-Math.PI/2,r=R*.72,px=hx+Math.cos(a)*r,py=hy+Math.sin(a)*r,nx=-Math.sin(a),ny=Math.cos(a);
   ln([px-nx*28,py-ny*28,px+nx*28,py+ny*28],'#e8572a',4);circ(px,py,5,'#e8572a');});
  alphaDo(seg(u,.2,.26),()=>{ctx.beginPath();ctx.arc(hx,hy,R+22,-2.4,-1.2);ctx.strokeStyle='#7dc8dc';ctx.lineWidth=3;ctx.stroke();
   const a=-1.2;arrow(hx+Math.cos(a-.08)*(R+22),hy+Math.sin(a-.08)*(R+22),hx+Math.cos(a)*(R+22),hy+Math.sin(a)*(R+22),'#7dc8dc',3);});
  alphaDo(seg(u,.04,.1),()=>tag(84,760,'紅線：取一段葉片剖面',{size:16,bg:'#ff9d7a'}));
  alphaDo(seg(u,.2,.26),()=>tag(736,760,'風從畫面正面吹入',{size:16,bg:'#dfe5e8',align:'right'}));
  /* 右：翼型與速度三角形 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'葉片剖面上的力',20,'#f2c230',700);
  const cx=1180,cy=500,W=unit(1,2.4),L=[W[1],-W[0]],al=.12,d=[Math.cos(al)*W[0]-Math.sin(al)*L[0],Math.cos(al)*W[1]-Math.sin(al)*L[1]],n=[-d[1],d[0]];
  const nn=n[0]*L[0]+n[1]*L[1]<0?[-n[0],-n[1]]:n;
  ctx.setLineDash([6,6]);ln([cx,230,cx,770],'rgba(255,255,255,.3)',1.5);ctx.setLineDash([]);wt(cx+8,250,'轉動平面',15,'rgba(227,236,238,.7)',500,'left');
  airfoil(cx,cy,200,d,nn);
  vec(880,cy-10,[1,0],150,'#7dc8dc',5,seg(u,.06,.12));alphaDo(seg(u,.06,.12),()=>wt(880,cy-26,'風',18,'#7dc8dc',700));
  vec(cx-150,cy+200,[0,-1],180,'#dfe5e8',5,seg(u,.18,.24));alphaDo(seg(u,.18,.24),()=>wt(cx-164,cy+190,'葉片運動',17,'#dfe5e8',700,'right'));
  const Ws=[cx-W[0]*260,cy-W[1]*260];vec(Ws[0],Ws[1],W,170,'#f2c230',5,seg(u,.28,.34));
  alphaDo(seg(u,.28,.34),()=>wt(Ws[0]+14,Ws[1]+4,'相對風',18,'#f2c230',700,'left'));
  vec(cx,cy,L,280,'#7dffc4',6,seg(u,.5,.56));alphaDo(seg(u,.5,.56),()=>wt(cx+L[0]*286+8,cy+L[1]*286-8,'升力',19,'#7dffc4',700,'left'));
  vec(cx,cy,W,150,'#ff8a60',4,seg(u,.58,.62));alphaDo(seg(u,.58,.62),()=>wt(cx+W[0]*150+14,cy+W[1]*150+10,'阻力',17,'#ff9d7a',700,'left'));
  const k=seg(u,.74,.8);if(k>0){const Lx=L[0]*280,Ly=L[1]*280;alphaDo(k,()=>{ctx.setLineDash([6,5]);ln([cx+Lx,cy+Ly,cx+Lx,cy],'rgba(255,255,255,.6)',1.5);ln([cx+Lx,cy+Ly,cx,cy+Ly],'rgba(255,255,255,.6)',1.5);ctx.setLineDash([]);
   arrow(cx,cy,cx,cy+Ly,'#f2c230',5);arrow(cx,cy,cx+Lx,cy,'#b37cff',4);
   wt(cx-12,cy+Ly-14,'驅動力 → 扭力',17,'#f2c230',700,'right');wt(cx+Lx+10,cy+30,'推力',17,'#b37cff',700,'left');});}
 }},

{t:'葉尖速比',en:'Tip speed ratio',dur:13,
 d:'葉尖速比（TSR，λ）是葉尖線速度除以風速。直徑 136 公尺的轉子每分鐘轉 9 圈時，葉尖速度約 64 m/s；若風速為 8 m/s，葉尖速比就是 8。轉得太慢，大部分氣流從葉片之間穿過而沒被利用；轉得太快，轉子對氣流而言像一面牆，風會繞開。三葉片風機的最佳葉尖速比通常在 7 到 9 之間，控制系統在額定風速以下調整發電機扭力，讓轉速跟著風速變化，盡量維持在最佳點。葉尖速度也受噪音限制，大型陸域風機約 80 m/s。',
 s:[[0,'葉尖速比：葉尖速度與風速的比值'],[.28,'轉太慢，風從葉片之間溜走'],[.5,'轉太快，轉子像一面牆，把風擋開'],[.74,'三葉片風機在葉尖速比約 7–9 時效率最高']],
 draw(u){
  diagBG();
  const lam=lamAt(u);
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'λ = 葉尖速度 ÷ 風速',22,'#f2c230',700);
  const hx=300,hy=500,R=200;const w=lam*.9;
  const rot=spin(u,13,x=>lamAt(x)*.15);
  for(let i=0;i<3;i++)bladeF(hx,hy,rot+i*TAU/3-Math.PI/2,R);circ(hx,hy,14,'#dfe5e8','rgba(0,0,0,.4)',1);
  const a=rot-Math.PI/2,tx=hx+Math.cos(a)*(R+8),ty=hy+Math.sin(a)*(R+8);arrow(tx,ty,tx-Math.sin(a)*lam*14,ty+Math.cos(a)*lam*14,'#f2c230',4);
  arrow(560,300,560+8*14,300,'#7dc8dc',4);wt(560,286,'風速 8 m/s',17,'#7dc8dc',700);
  wt(560,390,'葉尖速度',17,'#f2c230',700);wt(560,426,trf('{v} m/s',{v:Math.round(lam*8)}),30,'#f2c230',700,'left',COND);
  wt(560,500,'葉尖速比',17,'#fff',700);wt(560,546,'λ = '+lam.toFixed(1),36,'#fff',700,'left',COND);
  const st=lam<5?['轉太慢：風從葉片間溜走','#ff9d7a']:lam>11?['轉太快：轉子像一面牆','#ff9d7a']:['接近最佳效率','#7dffc4'];
  alphaDo(seg(u,.04,.1),()=>tag(410,750,st[0],{size:18,bg:st[1],align:'center'}));
  const C=chartBox(800,160,740,640,{title:'功率係數與葉尖速比（示意）',x0:0,x1:14,y0:0,y1:.65,xt:[0,2,4,6,8,10,12,14],yt:[0,.2,.4,.6],xl:'葉尖速比 λ',yl:'Cp',pl:76,pt:70,pb:70,gx:7,gy:3});
  ctx.setLineDash([6,6]);ln([C.px,C.Y(16/27),C.px+C.pw,C.Y(16/27)],'#e8572a',2);ctx.setLineDash([]);wt(C.px+C.pw-8,C.Y(16/27)-10,'貝茲極限 0.593',16,'#ff9d7a',700,'right');
  alphaDo(seg(u,.74,.8),()=>box(C.X(7),C.py,C.X(9)-C.X(7),C.ph,'rgba(125,255,196,.12)'));
  const lE=14*seg(u,.04,.24);if(lE>0){ctx.beginPath();for(let l=.3;l<=lE;l+=.05){const x=C.X(l),y=C.Y(cpL(l));l>.3?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=3.5;ctx.stroke();}
  alphaDo(seg(u,.24,.28),()=>{const x=C.X(lam),y=C.Y(cpL(lam));circ(x,y,9,'#fff','#13232e',2);wt(x,y-18,'Cp = '+cpL(lam).toFixed(2),17,'#fff',700,'center',COND);});
  alphaDo(seg(u,.8,.86),()=>wt(C.X(8),C.py+C.ph-16,'最佳範圍 7–9',17,'#7dffc4',700,'center'));
 }},

{t:'變槳與偏航',en:'Pitch and yaw control',dur:14,
 d:'風機要發得多，先要正對著風。機艙頂端的風向計與風速計持續量測，當風向偏離一段時間，偏航系統就啟動塔頂的多組偏航馬達，帶動齒輪環慢慢轉動機艙，每秒約轉零點幾度。變槳系統則在輪轂內轉動每一支葉片的角度：風速低於額定時，葉片保持在最佳角度；超過額定後逐步加大槳距角、減少升力，讓出力維持在額定值；風速超過切出值或需要緊急停機時，葉片轉到約 90 度的順槳位置，不再產生驅動力。',
 s:[[0,'風向改變，機艙頂上的風向計立刻察覺'],[.25,'偏航馬達轉動機艙，讓轉子重新正對來風'],[.5,'風速超過額定，葉片轉向，洩掉多餘的風'],[.78,'強風時葉片順槳約 90 度，風機停機保護']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'偏航：對準風向（俯視）',20,'#f2c230',700);
  const cx=410,cy=500,wd=-32*ease(seg(u,.04,.12)),yw=-32*ease(seg(u,.28,.46)),er=Math.abs(wd-yw);
  const wr=wd*Math.PI/180,yr=yw*Math.PI/180;
  for(let j=-2;j<=2;j++){const ox=cx-260*Math.cos(wr)-j*60*Math.sin(wr),oy=cy-260*Math.sin(wr)+j*60*Math.cos(wr),f=(TT*.6+j*.2)%1;alphaDo(.7,()=>arrow(ox+Math.cos(wr)*f*50,oy+Math.sin(wr)*f*50,ox+Math.cos(wr)*(f*50+60),oy+Math.sin(wr)*(f*50+60),'#7dc8dc',3));}
  circ(cx,cy,44,'rgba(255,255,255,.06)','rgba(242,194,48,.7)',3);
  ctx.save();ctx.translate(cx,cy);ctx.rotate(yr);
  box(-40,-30,150,60,'#e3e8ec','rgba(0,0,0,.4)',1.5);circ(-52,0,20,'#dfe5e8','rgba(0,0,0,.4)',1);box(-62,-230,14,460,'#f4f6f7','rgba(0,0,0,.35)',1);
  ctx.restore();
  ctx.save();ctx.translate(cx+70*Math.cos(yr),cy+70*Math.sin(yr));ctx.rotate(wr);ln([-22,0,22,0],'#e8572a',3);poly([22,0,10,-8,10,8],'#e8572a');ctx.restore();
  alphaDo(seg(u,.04,.1),()=>wt(700,300,trf('偏差角 {a}°',{a:Math.round(er)}),22,er>3?'#ff9d7a':'#7dffc4',700,'right',COND));
  lab(cx+70*Math.cos(yr),cy+70*Math.sin(yr),'風向計',{dx:80,dy:-90,st:'w',a:band(u,.06,.3)});
  lab(cx+44,cy,'偏航馬達與齒輪環',{dx:150,dy:90,st:'s',a:band(u,.28,.47)});
  alphaDo(seg(u,.48,.54),()=>tag(410,760,'偏差 10° 約損失 3–5% 發電量（示例）',{size:16,bg:'#dfe5e8',align:'center'}));
  /* 右：變槳 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'變槳：調整葉片角度（剖面）',20,'#f2c230',700);
  const v=u<.5?9:u<.75?lerp(9,18,ease(seg(u,.5,.62))):lerp(18,27,ease(seg(u,.78,.84)));
  const b=u<.78?pitchAt(Math.min(v,24)):lerp(pitchAt(18),90,ease(seg(u,.78,.88))),br=(b+6)*Math.PI/180;
  const px=1250,py=470,d=[Math.sin(br),Math.cos(br)],n=[-d[1],d[0]];
  ctx.setLineDash([6,6]);ln([px,250,px,690],'rgba(255,255,255,.3)',1.5);ctx.setLineDash([]);wt(px+8,270,'轉動平面',15,'rgba(227,236,238,.7)',500,'left');
  airfoil(px,py,230,d,n[0]>0?n:[-n[0],-n[1]]);
  const wl=40+v*5;arrow(880,py-110,880+wl,py-110,'#7dc8dc',5);wt(880,py-130,trf('風速 {v} m/s',{v:Math.round(v)}),18,'#7dc8dc',700,'left',COND);
  ctx.beginPath();ctx.arc(px,py,150,-Math.PI/2,-Math.PI/2-b*Math.PI/180,true);ctx.strokeStyle='#f2c230';ctx.lineWidth=3;ctx.stroke();
  wt(1500,340,trf('槳距角 {b}°',{b:Math.round(b)}),24,'#f2c230',700,'right',COND);
  const ST=[['全力擷取','#7dffc4',0,.5],['洩掉多餘的風，維持額定','#f2c230',.5,.78],['順槳停機','#ff9d7a',.78,1.01]];
  ST.forEach(([t,c,a0,a1])=>{if(u>=a0&&u<a1)alphaDo(seg(u,a0+.02,a0+.06)||(a0===0?seg(u,.04,.1):0),()=>tag(1170,740,t,{size:18,bg:c,align:'center'}));});
 }},

{t:'功率曲線',en:'The power curve',dur:14,side:true,
 d:'把風速與出力畫成圖，就是風機的功率曲線。風速低於約 3 m/s 的切入風速時，風機不發電；切入後，控制系統讓轉子維持在最佳葉尖速比，出力隨風速約三次方上升；到達約 11 m/s 的額定風速後，變槳系統開始作用，出力維持在額定 4.2 MW；風速超過約 25 m/s 的切出風速，葉片順槳停機，等風變小再啟動。台灣陸域風電累計約 94 萬瓩，多數位於西部沿海，秋冬東北季風期間是全年發電最多的季節。',
 s:[[0,'風速低於 3 m/s，風機靜止等待'],[.2,'切入後，出力隨風速快速增加'],[.5,'到達額定風速，變槳把出力維持在 4.2 MW'],[.8,'超過 25 m/s，順槳停機，等風變小再啟動']],
 cam:u=>({x:800,y:450,s:1}),
 draw(u){
  const v=vAt(u),b=pitchAt(v),w=Math.cos(Math.min(89,b*1.1)*Math.PI/180);
  const rot=spin(u,14,x=>rpmAt(vAt(x))*TAU/60*1.6);
  farTurbines();
  const T=turbine(360,gyy(360),220,130,rot,{w});
  windLines(180,560,Math.round(8+v*1.2),60+v*28,.9,7,30+v*3);
  lab(T.x,T.y,trf('槳距角 {b}°',{b:Math.round(b)}),{dx:110,dy:40,st:b>1?'s':'n',a:band(u,.5,1)});
  const C=chartBox(700,160,840,430,{title:'4.2 MW 級風機的功率曲線（示例）',x0:0,x1:30,y0:0,y1:5,xt:[0,5,10,15,20,25,30],yt:[0,1,2,3,4,5],xl:'風速 m/s',yl:'MW',pl:70,pt:62,pb:58,gx:6,gy:5});
  const Z=[[0,VIN,'不發電','rgba(255,255,255,.04)','rgba(227,236,238,.75)'],[VIN,11,'追隨最佳效率','rgba(125,255,196,.08)','#7dffc4'],[11,VOUT,'變槳維持額定','rgba(242,194,48,.08)','#f2c230'],[VOUT,30,'停機','rgba(232,87,42,.1)','#ff9d7a']];
  Z.forEach(([a,bb,t,bg,c],i)=>alphaDo(seg(u,.05+i*.2,.1+i*.2),()=>{box(C.X(a),C.py,C.X(bb)-C.X(a),C.ph,bg);if(i>0)wt((C.X(a)+C.X(bb))/2,C.py+(i===3?40:C.ph-14),t,16,c,700,'center');}));
  ctx.setLineDash([5,5]);ln([C.px,C.Y(4.2),C.px+C.pw,C.Y(4.2)],'rgba(242,194,48,.5)',1.5);ctx.setLineDash([]);
  ctx.beginPath();let first=true;for(let s=0;s<=Math.min(v,30);s+=.1){const y=C.Y(pwr(s)),x=C.X(s);first?ctx.moveTo(x,y):ctx.lineTo(x,y);first=false;}ctx.strokeStyle='#fff';ctx.lineWidth=3.5;ctx.stroke();
  const P=pwr(v);circ(C.X(v),C.Y(P),9,'#f2c230','#13232e',2);
  card(720,610,300,150,{bg:'rgba(7,27,39,.8)'});
  wt(740,650,'風速',17,'rgba(227,236,238,.85)',600);wt(1000,650,trf('{v} m/s',{v:v.toFixed(1)}),20,'#7dc8dc',700,'right',COND);
  wt(740,690,'轉速',17,'rgba(227,236,238,.85)',600);wt(1000,690,trf('{r} rpm',{r:rpmAt(v).toFixed(1)}),20,'#fff',700,'right',COND);
  wt(740,730,'出力',17,'rgba(227,236,238,.85)',600);wt(1000,730,trf('{p} MW',{p:P.toFixed(2)}),20,'#f2c230',700,'right',COND);
 }}
]};
