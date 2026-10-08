// KITS: land
/* 陸域風電系列 第 14 集：大部件更換 */
const gyy=x=>groundY(x);
/* 正視的葉片與風機（沿用第 3、10、16 集） */
function bladeF(cx,cy,a,L,w){w=w===undefined?1:w;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
  const k=Math.max(.18,w);poly([8,-5*k,8+L*.2,-10*k,8+L,-1.5*k,8+L,1.5*k,8+L*.2,8*k,8,5*k],'#f4f6f7','rgba(0,0,0,.35)',1);ctx.restore();}
function turbine(x,gy,H,R,rot){const hy=gy-H,w0=Math.max(4,R*.09),w1=Math.max(2.5,R*.05);
  poly([x-w0,gy,x-w1,hy+R*.06,x+w1,hy+R*.06,x+w0,gy],'#eef2f4','rgba(0,0,0,.3)',1);nacRotor(x,hy,R,rot);return {x,y:hy};}
function nacRotor(x,hy,R,rot){box(x-R*.11,hy-R*.08,R*.24,R*.14,'#e3e8ec','rgba(0,0,0,.3)',1);
  for(let i=0;i<3;i++)bladeF(x,hy,rot+i*TAU/3-Math.PI/2,R);circ(x,hy,Math.max(3,R*.07),'#dfe5e8','rgba(0,0,0,.4)',1);}
function windLines(y0,y1,n,sp,a,seed,len){if(a<=0)return;const r=rng(seed||3);ctx.lineCap='round';
  for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),ph=r(),s=sp*(.7+.6*r()),L=(len||60)*(.6+.8*r());const x=VX0-200+((ph*2400+TT*s)%(VX1-VX0+400));
   alphaDo(a*(.25+.35*r()),()=>ln([x,y,x+L,y],'#ffffff',2));}ctx.lineCap='butt';}
/* 卡片內的一列 */
function rowK(x,y,label,val,col,w){wt(x,y,label,18,'rgba(227,236,238,.85)',600);wt(x+w,y,val,22,col,700,'right',COND);}
function bullets(x,y,L,u,k0,dk,gap){L.forEach(([t,col],i)=>alphaDo(seg(u,k0+i*dk,k0+i*dk+.05),()=>{circ(x,y+i*gap-6,5,col==='#fff'?'#f2c230':col);wt(x+18,y+i*gap,t,18,col,600);}));}
const fmtK=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,',');
/* 沿折線取點（f = 0–1） */
function ptAt(P,f){const s=[];let L=0;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);s.push(d);L+=d;}
  let r=clamp(f,0,1)*L;for(let i=0;i<s.length;i++){if(r<=s[i]){const k=s[i]?r/s[i]:0;return [lerp(P[i][0],P[i+1][0],k),lerp(P[i][1],P[i+1][1],k)];}r-=s[i];}return P[P.length-1].slice();}
function sine(x0,x1,y,A,fHz,win,t0,col,lw){ctx.beginPath();for(let x=x0;x<=x1;x++){const t=t0+(x-x0)/(x1-x0)*win,v=y-A*Math.sin(TAU*fHz*t);x>x0?ctx.lineTo(x,v):ctx.moveTo(x,v);}ctx.strokeStyle=col;ctx.lineWidth=lw||2;ctx.stroke();}
function specLine(C,f1,fn,col,g){ctx.beginPath();for(let f=0;f<=f1*g;f+=.5){const y=C.Y(fn(f));f?ctx.lineTo(C.X(f),y):ctx.moveTo(C.X(f),y);}ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();}
const gpk=(f,c,a,w)=>a*Math.exp(-(f-c)*(f-c)/(2*(w||3)*(w||3)));
const ferr=m=>60*m+(m>7?40*Math.pow(m-7,2.2):0);
/* 示例：2 MW 級機組、容量因數 28% → 每日約 13.4 MWh */
const MWH_DAY=13.4;
/* 履帶吊（朝左）：回傳吊臂端點。a = 吊臂仰角（弧度） */
function crawler(cx,G,a,L,cw){
  const px=cx-34,py=G-66;
  rrp(cx-84,G-26,180,26,13);ctx.fillStyle='#2b3137';ctx.fill();
  for(let i=0;i<5;i++)circ(cx-62+i*36,G-13,8,'#4a545c','#1d2328',1.5);
  box(cx-72,G-72,156,48,'#e9b21f','rgba(0,0,0,.4)',1);box(cx-66,G-98,40,28,'#f4f6f7','rgba(0,0,0,.4)',1);box(cx-60,G-92,26,14,'#2a3a46');
  for(let i=0;i<cw;i++)box(cx+84,G-72+i*0-i*14-14+14,40,14,'#6f7c84','rgba(0,0,0,.45)',1);
  const tx=px-Math.cos(a)*L,ty=py-Math.sin(a)*L,nx=Math.sin(a)*7,ny=-Math.cos(a)*7;
  ln([px+nx,py+ny,tx+nx*.35,ty+ny*.35],'#e9b21f',3);ln([px-nx,py-ny,tx-nx*.35,ty-ny*.35],'#e9b21f',3);
  const n=Math.max(2,Math.round(L/34));ctx.beginPath();for(let i=0;i<n;i++){const f0=i/n,f1=(i+1)/n,k0=1-.65*f0,k1=1-.65*f1,s=i%2?1:-1;
   ctx.moveTo(px-Math.cos(a)*L*f0+nx*k0*s,py-Math.sin(a)*L*f0+ny*k0*s);ctx.lineTo(px-Math.cos(a)*L*f1-nx*k1*s,py-Math.sin(a)*L*f1-ny*k1*s);}
  ctx.strokeStyle='rgba(60,50,20,.8)';ctx.lineWidth=1.2;ctx.stroke();
  const mx=px+46,my=py-70;ln([px+4,py,mx,my],'#3d4750',4);ln([mx,my,tx,ty],'rgba(30,35,40,.55)',1);ln([mx,my,cx+110,G-72],'rgba(30,35,40,.55)',1);
  return {x:tx,y:ty};
}
/* 齒輪箱（示意）：dmg 0–1 損傷程度 */
function gbox(x,y,w,h,dmg,spin){
  rrp(x,y,w,h,18);ctx.fillStyle='#6f7c84';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=2;ctx.stroke();
  const cx=x+w*.34,cy=y+h*.46,R=h*.28;ring(cx,cy,R,'#b9c0c4',4);circ(cx,cy,R*.3,'#cfd6db');
  for(let i=0;i<3;i++){const a=spin+i*TAU/3;circ(cx+Math.cos(a)*R*.62,cy+Math.sin(a)*R*.62,R*.26,'#9aa3a8','rgba(0,0,0,.4)',1);}
  const g2x=x+w*.72,g2y=cy-R*.35;circ(g2x,g2y,R*.55,'#9aa3a8','rgba(0,0,0,.4)',1.5);circ(g2x,g2y,R*.2,'#cfd6db');
  for(let i=0;i<12;i++){const a=-spin*1.6+i*TAU/12;ln([g2x+Math.cos(a)*R*.5,g2y+Math.sin(a)*R*.5,g2x+Math.cos(a)*R*.66,g2y+Math.sin(a)*R*.66],'#9aa3a8',4);}
  if(dmg>0){const a=-spin*1.6+1.3;const dx=g2x+Math.cos(a)*R*.6,dy=g2y+Math.sin(a)*R*.6;alphaDo(dmg,()=>{circ(dx,dy,9,'#e8572a');ring(dx,dy,14+4*Math.sin(TT*8),'#ff9d7a',2);});}
  box(x+8,y+h-26,w-16,16,'rgba(242,194,48,.45)');
}
/* 機艙＋輪轂（放大版，第 5 集用）。gb=0 齒輪箱在位、1 已移除 */
function nacBig(X,hy,showGB,open){
  rrp(X-52,hy-26,126,52,10);ctx.fillStyle='rgba(227,232,236,.92)';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.5;ctx.stroke();
  alphaDo(.55+.45*open,()=>{rrp(X-44,hy-18,112,40,6);ctx.fillStyle='#2d3b45';ctx.fill();});
  box(X-40,hy+2,18,12,'#b9c0c4');box(X+34,hy-6,32,26,'#4f6f80','rgba(0,0,0,.5)',1);
  if(showGB)box(X-18,hy-10,48,32,'#6f7c84','rgba(0,0,0,.55)',1.5);
  else{ctx.setLineDash([3,4]);ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;ctx.strokeRect(X-18,hy-10,48,32);ctx.setLineDash([]);}
  if(open>0){ctx.save();ctx.translate(X-40,hy-26);ctx.rotate(-open*1.1);box(0,-5,60,5,'#dfe5e8','rgba(0,0,0,.4)',1);ctx.restore();}
}

const EP={no:14,slug:'onshore-wind',seriesName:'陸域風電系列',t:'大部件更換',en:'Major component replacement',
lede:'齒輪箱或主軸承一旦失效，風機只能停下來等大型吊機。這一集看故障如何判定、三種更換方案怎麼取捨、履帶吊如何進場組裝，再到齒輪箱從機艙頂吊出與吊入的過程，最後算出停機天數與損失的發電量。',
facts:[['400–750','噸級','更換齒輪箱或轉子常見的履帶吊級距（示例，依輪轂高度與吊件而定）'],
['15–20','噸','2 MW 級機組齒輪箱的典型重量（示例）'],
['1–3','天','履帶吊進場後的組裝時間（示例）'],
['3–5','天','備品與吊機都就緒時，實際吊換作業的停機天數（示例）'],
['13.4','MWh／日','2 MW、容量因數 28% 的機組每停機一天損失的發電量（示例）'],
['3–6','個月','齒輪箱備品若需新購，交期可能長達數月（示例）']],
note:'說明：本集為教育用途示意動畫，機艙、齒輪箱、履帶吊與吊裝程序經過簡化，並非特定機型或案場。吊機噸位、設備重量、組裝與停機天數、備品交期與容量因數 28% 皆為典型範例；實際依機型、輪轂高度、吊機規格、場地與天候而定。齒輪箱交貨期長、價格高且吊裝受天候影響，並需有備品交換機制，與台電風機運維報告的觀察一致。轉子是否需先吊下依機型而異。',
base:()=>{landSky(GY,{sun:{x:1260,y:140},clouds:false});drawGround();},
shots:[
/* 1 ─────────────────────────────── 故障判定 */
{t:'齒輪箱失效：停機與判定',en:'Gearbox failure: shutdown and diagnosis',dur:13,side:true,
 d:'齒輪箱長期承受變動的風載，齒面疲勞剝落是常見的失效模式。狀態監測系統先察覺振動速度與油溫同時上升，鐵質顆粒也增加；超過限值後控制系統自動停機，轉子慢慢停下並上鎖。維修團隊隨後上塔，以內視鏡檢查齒面，確認剝落面積與是否傷及軸承。若損傷已無法在塔上修復，就必須走大部件更換：調備品、訂吊機、等天氣，而這些等待往往比實際吊換更久。',
 s:[[0,'風機正常運轉，監測系統持續記錄振動與油溫'],[.24,'振動與油溫同時升高，鐵質顆粒越來越多'],[.44,'超過限值，控制系統自動停機，轉子上鎖'],[.7,'內視鏡確認齒面剝落，判定必須更換齒輪箱']],
 draw(u){
  const X=400,G=gyy(X);
  turbine(120,gyy(120),170,80,TT*1.1+.4);
  const d=clamp(u-.38,0,.14),P=u<.38?u:.38+d-d*d/.28,rot=.3+16*P,wv=1-seg(u,.4,.54);
  windLines(120,560,9,150,.5,5,50);
  const T=turbine(X,G,320,150,rot);
  const al=seg(u,.2,.26)*(1-seg(u,.44,.5));if(al>0)alphaDo(al*(.5+.5*Math.sin(TT*10)),()=>{ring(X,T.y,34,'#e8572a',4);ring(X,T.y,52,'rgba(232,87,42,.6)',2);});
  const ca=seg(u,.1,.18);if(ca>0)alphaDo(ca,()=>{ctx.setLineDash([5,6]);ln([X+20,T.y-8,700,200],'rgba(255,255,255,.55)',1.5);ln([X+20,T.y+8,700,560],'rgba(255,255,255,.55)',1.5);ctx.setLineDash([]);ring(X,T.y,26,'rgba(255,255,255,.7)',2);
   card(700,170,840,430,{bg:'rgba(7,27,39,.9)'});wt(724,208,'齒輪箱剖面（示意）',20,'#f2c230',700);
   const dm=ease(seg(u,.2,.5)),sp=TT*.9*wv;gbox(740,250,370,230,dm,sp+.5);
   /* 鐵屑 */
   const r=rng(5);for(let k=0;k<26;k++){const f=(r()+TT*.18)%1,x=830+r()*240;if(r()>.15+dm*.85)continue;alphaDo(1-f*.4,()=>circ(x,420+f*50,2.6,'#ff9d7a'));}
   const vib=lerp(2.4,11.2,ease(seg(u,.14,.4))),tmp=lerp(62,81,ease(seg(u,.14,.42))),fe=ferr(lerp(5,10.5,ease(seg(u,.14,.4))));
   wt(1140,250,'即時數據（示例）',17,'rgba(227,236,238,.85)',600);
   rowK(1140,292,'振動速度',trf('{v} mm/s',{v:vib.toFixed(1)}),vib>7?'#ff9d7a':'#7dffc4',380);
   rowK(1140,330,'油溫',trf('{v} °C',{v:Math.round(tmp)}),tmp>76?'#ff9d7a':'#7dffc4',380);
   rowK(1140,368,'鐵質顆粒',trf('{n} 顆',{n:fmtK(fe)}),fe>900?'#ff9d7a':'#7dffc4',380);
   bullets(1140,430,[['警報：振動與油液同時異常','#f2c230'],['停機、上鎖，內視鏡檢查齒面','#fff'],['確認剝落：判定需要更換','#ff9d7a']],u,.46,.14,40);});
  lab(X,T.y,'機艙',{dx:-110,dy:-70,st:'l',a:band(u,.02,.2),minor:true});
  lab(X,T.y,'超過限值：自動停機',{dx:-170,dy:-40,st:'w',a:band(u,.4,.62)});
  lab(X,G-40,'塔底控制櫃',{dx:-120,dy:-30,a:band(u,.7,1),minor:true});
 }},

/* 2 ─────────────────────────────── 更換方案與等待時間 */
{t:'更換方案與等待時間',en:'Replacement options and waiting time',dur:15,
 d:'齒輪箱更換有三種思路。第一種是動用履帶吊，從機艙頂吊出舊件、吊入新件，是目前最普遍的做法。第二種是機艙內或爬升式小吊機，適合較輕的部件，可省下大吊機的動員費。第三種是備品交換池，事先備好整修過的齒輪箱，故障時直接對換，舊件再送回工廠翻修。真正拉長停機的常常不是吊換本身，而是等吊機排程與等備品交期，所以備品與吊機的預先安排，比施工速度更關鍵。',
 s:[[0,'三種更換思路：大吊機、機艙內小吊機、備品交換池'],[.26,'履帶吊最普遍，但動員與組裝成本高'],[.5,'比較三種情境：吊換本身只占停機時間的一小段'],[.76,'等吊機與等備品，才是停機時間的大宗']],
 draw(u){
  diagBG();
  const O=[['履帶吊吊換','主流做法','能吊出整個齒輪箱，甚至轉子；需整地與組裝 1–3 天','#f2c230'],
   ['機艙內小吊機','輕量部件','免大吊機；吊重有限，多用於小型部件與軸承座','#7dc8dc'],
   ['備品交換池','縮短等待','整修好的齒輪箱預先備妥，故障時直接對換','#7dffc4']];
  O.forEach(([a,b,c,col],i)=>{const y=160+i*214,g=seg(u,.02+i*.07,.08+i*.07);alphaDo(g,()=>{
   card(60,y,700,194,{bg:'rgba(7,27,39,.75)'});rrp(60,y,10,194,5);ctx.fillStyle=col;ctx.fill();
   wt(92,y+44,a,26,col,700);tag(92+wtw(a,26,700)+18,y+36,b,{size:15,bg:col});
   wt(92,y+86,c,18,'rgba(227,236,238,.92)',600);
   /* 圖示 */
   ctx.save();ctx.translate(640,y+184);ctx.scale(.6,.6);const ix=0,iy=0;
   if(i===0){box(ix-30,iy-22,70,20,'#e9b21f');ln([ix-10,iy-22,ix-60,iy-130],'#e9b21f',4);ln([ix-60,iy-130,ix-60,iy-100],'rgba(30,35,40,.7)',1.2);box(ix-72,iy-100,26,20,'#7f8b93','rgba(0,0,0,.5)',1);}
   if(i===1){box(ix-50,iy-70,110,46,'#dfe5e8','rgba(0,0,0,.4)',1);ln([ix-10,iy-70,ix-10,iy-96,ix+40,iy-96],'#7dc8dc',4);ln([ix+40,iy-96,ix+40,iy-76],'rgba(30,35,40,.7)',1.2);box(ix+30,iy-76,22,14,'#7f8b93','rgba(0,0,0,.5)',1);}
   if(i===2){box(ix-70,iy-40,54,34,'#7f8b93','rgba(0,0,0,.5)',1);box(ix+10,iy-40,54,34,'#6f7c84','rgba(0,0,0,.5)',1);arrow(ix-12,iy-62,ix+12,iy-62,'#7dffc4',3);arrow(ix+12,iy-70,ix-12,iy-70,'#7dffc4',3);}
   ctx.restore();
   });});
  /* 停機天數堆疊圖 */
  const C=chartBox(800,160,740,400,{title:'三種情境的停機天數（示例）',x0:0,x1:120,y0:0,y1:3,xt:[0,20,40,60,80,100,120],yt:[],xl:'天',pl:30,pt:64,pb:58,gx:6,gy:3});
  const S=[['備品在庫、吊機已預約',4,3,0],['備品在庫、吊機需排隊',4,14,0],['備品需新購',4,14,90]];
  S.forEach(([n,w,q,sp],i)=>{const g=ease(seg(u,.5+i*.08,.62+i*.08));if(g<=0)return;const yc=C.py+C.ph*(i+.5)/3,h=34;
   wt(C.px+4,yc-h/2-8,n,16,'rgba(227,236,238,.9)',600);
   const x0=C.X(0),a1=C.X(w*g),a2=C.X((w+q)*g),a3=C.X((w+q+sp)*g);
   box(x0,yc-h/2,a1-x0,h,'#f2c230');if(q>0)box(a1,yc-h/2,a2-a1,h,'#7dc8dc');if(sp>0)box(a2,yc-h/2,a3-a2,h,'#ff9d7a');
   alphaDo(seg(g,.9,1),()=>wt(a3+10,yc+7,trf('{n} 天',{n:w+q+sp}),20,'#fff',700,'left',COND));});
  alphaDo(seg(u,.82,.9),()=>{const y=C.py+C.ph+62;box(800,y-20,24,14,'#f2c230');wt(830,y-8,'吊換作業',16,'#f2c230',700);box(950,y-20,24,14,'#7dc8dc');wt(980,y-8,'等吊機',16,'#7dc8dc',700);box(1090,y-20,24,14,'#ff9d7a');wt(1120,y-8,'等備品',16,'#ff9d7a',700);});
  card(800,600,740,200,{bg:'rgba(7,27,39,.75)'});wt(824,638,'取捨重點',20,'#f2c230',700);
  bullets(836,684,[['吊換作業只有約 4 天，多半是最短的一段','#fff'],['吊機排程受天候與其他案場影響','#fff'],['備品交期可能長達數月：備品池最有效','#f2c230']],u,.76,.07,40);
 }},

/* 3 ─────────────────────────────── 履帶吊進場與組裝 */
{t:'履帶吊進場與組裝',en:'Crawler crane arrives and is assembled',dur:14,side:true,
 d:'確定更換後，現場先整出吊車平台：夯實碎石並鋪上鋼墊板，讓幾百噸的機具不會下陷。履帶吊以多台拖車分批運來：吊臂分段、配重塊與主機。主機在平台就位後，先掛上配重，再把吊臂一段一段接長、慢慢仰起。這個組裝通常需要一到三天，並且要避開強風。吊車平台通常設在塔基附近，吊臂長度要超過輪轂高度，才能把重物送進機艙頂。',
 s:[[0,'整平夯實吊車平台，鋪上鋼墊板'],[.24,'拖車分批運來主機、配重塊與吊臂分段'],[.5,'主機就位，掛上配重'],[.74,'吊臂分段接長，慢慢仰起，直到超過輪轂高度']],
 draw(u){
  const X=380,G=gyy(X),CX=900,GC=gyy(CX);
  windLines(120,520,7,130,.35,9,50);
  const T=turbine(X,G,300,130,1.2);
  /* 吊車平台 */
  const pa=seg(u,.02,.2);if(pa>0){alphaDo(pa,()=>{box(CX-210,GC-6,420,8,'#8d8576','rgba(0,0,0,.3)',1);for(let k=0;k<7;k++)box(CX-196+k*58,GC-10,50,6,'#394650','rgba(0,0,0,.4)',1);});}
  /* 拖車 */
  const tv=ease(seg(u,.2,.52));
  [[0,'吊臂分段'],[1,'配重塊']].forEach(([i,n],k)=>{const x=lerp(1760+k*260,CX+230+k*10,tv)-(k?0:0),xe=lerp(CX+230+k*10,1700,seg(u,.56,.9));const xx=u<.56?x:xe;
   const fl=u<.56?false:true;alphaDo(1-seg(u,.9,.97),()=>truck(xx,gyy(xx),false,'#5b6a73',()=>{if(i===0){box(8,-50,100,14,'#e9b21f','rgba(0,0,0,.4)',1);box(8,-64,100,14,'#e9b21f','rgba(0,0,0,.4)',1);}else if(u<.5){for(let q=0;q<3;q++)box(10+q*30,-58,26,24,'#6f7c84','rgba(0,0,0,.45)',1);}}));});
  /* 履帶吊 */
  const ca=seg(u,.46,.54),cw=u<.54?0:u<.62?1:u<.7?2:3,ba=lerp(.1,1.26,ease(seg(u,.62,.9))),bl=lerp(180,400,seg(u,.62,.9));
  if(ca>0)alphaDo(ca,()=>{const t=crawler(CX,GC,ba,bl,cw);if(u>.9)slings(t.x,t.y+60,[t.x,t.y]);});
  lab(CX,GC-8,'吊車平台',{dx:30,dy:60,st:'g',a:band(u,.1,.38)});
  lab(CX+230,gyy(CX+230)-50,'拖車運來分段與配重',{dx:80,dy:-130,a:band(u,.28,.52)});
  lab(CX+110,GC-60,'配重塊',{dx:130,dy:-90,st:'s',a:band(u,.58,.8)});
  lab(CX-60,GC-80,'履帶吊主機',{dx:-60,dy:-120,st:'s',a:band(u,.5,.7)});
  lab(X,T.y,'輪轂高度約 80 m',{dx:130,dy:-100,st:'l',a:band(u,.76,1)});
 },
 hud(u){hudPanel(250,150,'吊機需求（示例）',seg(u,.3,.38),w=>{
  hrow(56,'起重能力','400–750 t',w,'#f2c230');hrow(88,'吊臂長度','約 90–110 m',w,'#7dc8dc');hrow(120,'組裝時間','1–3 天',w,'#7dffc4');});}},

/* 4 ─────────────────────────────── 吊換程序 */
{t:'吊換程序：從停機到恢復',en:'Replacement sequence: shutdown to restart',dur:14,
 d:'整個更換可拆成幾個固定步驟。第一天停機、斷電並掛上鎖定標籤（LOTO），鎖住轉子。接著拆除扭力臂、聯軸器、油管與電線，打開機艙頂開口。履帶吊把舊齒輪箱吊出，放上拖車，再把新的吊入原位。對心、鎖固扭力螺栓、接回油路後，加油並做空載與帶載試運轉，確認振動與油溫都正常才重新併網。多數齒輪箱可從機艙頂吊出，轉子留在原位；主軸承則通常須先吊下轉子，工程量更大，且依機型而異。',
 s:[[0,'停機斷電、掛鎖定標籤，並鎖住轉子'],[.26,'拆除聯軸器、扭力臂與油管，打開機艙頂'],[.5,'吊出舊齒輪箱，再吊入新齒輪箱並對心'],[.76,'加油、試運轉，確認振動與油溫正常後併網']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,860,640,{title:'吊換流程時間表（示例）',x0:0,x1:5,y0:0,y1:6,xt:[0,1,2,3,4,5],yt:[],pl:30,pt:64,pb:58,gx:5,gy:6});
  const ST=[['停機、斷電、上鎖（LOTO）',0,.5,'#e8572a'],['拆聯軸器、扭力臂、油管',.5,1.5,'#f2c230'],['吊出舊齒輪箱',1.5,2.3,'#7dc8dc'],['吊入新齒輪箱、對心',2.3,3.4,'#7dc8dc'],['鎖固螺栓、接油管與電線',3.4,4.2,'#f2c230'],['加油、試運轉、併網',4.2,5,'#7dffc4']];
  ST.forEach(([n,a,b,col],i)=>{const g=ease(seg(u,.06+i*.1,.16+i*.1));if(g<=0)return;const yc=C.py+C.ph*(i+.5)/6;
   wt(C.px+4,yc-24,trf('{k} {n}',{k:i+1,n:tr(n)}),17,'rgba(227,236,238,.95)',600);
   alphaDo(g,()=>{rrp(C.X(a),yc-8,Math.max(8,(C.X(b)-C.X(a))*g),20,5);ctx.fillStyle=col;ctx.fill();});});
  /* 當日指示線 */
  const day=5*ease(seg(u,.1,.86));ctx.setLineDash([6,5]);ln([C.X(day),C.py,C.X(day),C.py+C.ph],'rgba(255,255,255,.7)',2);ctx.setLineDash([]);
  tag(C.X(day),C.py+C.ph+40,trf('第 {n} 天',{n:Math.min(5,Math.floor(day)+1)}),{size:15,bg:'#f2c230',align:'center'});
  /* 兩種吊法 */
  card(960,160,580,300,{bg:'rgba(7,27,39,.75)'});wt(984,198,'齒輪箱：機艙頂開口吊換',20,'#f2c230',700);
  nacBig(1120,330,u<.5,1);ln([1120,330-40,1120,330-110],'#f2c230',2);arrow(1120,270,1120,246,'#f2c230',3);
  circ(1060,330,22,'#dfe5e8','rgba(0,0,0,.4)',1.5);for(let i=0;i<3;i++)bladeF(1060,330,i*TAU/3-Math.PI/2,0);
  wt(984,414,'轉子留在原位，只吊齒輪箱（約 15–20 t）',16,'rgba(227,236,238,.9)',600);wt(984,440,'多數機型適用，作業最短',16,'#7dffc4',700);
  card(960,480,580,320,{bg:'rgba(7,27,39,.75)'});wt(984,518,'主軸承：通常須先吊下轉子',20,'#f2c230',700);
  const rz=ease(seg(u,.5,.8));nacBig(1090,640,true,0);
  const rx=lerp(1030,1400,rz),ry=lerp(640,600,rz);circ(rx,ry,16,'#dfe5e8','rgba(0,0,0,.4)',1.5);for(let i=0;i<3;i++)bladeF(rx,ry,i*TAU/3-Math.PI/2+.3,64*.8);
  wt(984,740,'轉子約 40–65 t（示例），需更大吊機與更長工期',16,'rgba(227,236,238,.9)',600);wt(984,768,'依機型而異，吊風險與成本都更高',16,'#ff9d7a',700);
 }},

/* 5 ─────────────────────────────── 吊換現場 */
{t:'齒輪箱吊出與吊入',en:'Lifting the gearbox out and in',dur:15,side:true,
 cam:u=>({x:620,y:330,s:1.3}),
 d:'履帶吊的吊臂越過機艙，吊鉤垂下，掛住舊齒輪箱的吊點。拆開固定螺栓後，齒輪箱從機艙頂開口緩緩升起，吊臂旋轉，把它放到平板拖車上。新的齒輪箱隨即吊起，送進機艙，對準主軸與基座。這一段吊裝只能在風速低於吊機規定上限時進行，吊件要有導向繩，由地面人員控制擺動。吊進原位後，作業人員鎖固螺栓、接回油路，完成對心。',
 s:[[0,'吊鉤垂下，掛住舊齒輪箱的吊點'],[.22,'齒輪箱從機艙頂開口升起，吊臂旋轉轉向拖車'],[.5,'舊件放上拖車，隨即掛起新齒輪箱'],[.72,'新件吊進機艙，地面人員用導向繩控制擺動'],[.88,'對準主軸與基座，鎖固螺栓']],
 draw(u){
  const X=380,G=gyy(X),hy=G-300,CX=X+400,GC=gyy(CX),TKX=X+200,TG=gyy(TKX);
  windLines(80,540,7,130,.35,11,50);
  poly([X-14,G,X-6,hy+20,X+6,hy+20,X+14,G],'#eef2f4','rgba(0,0,0,.3)',1);
  for(let i=0;i<3;i++)bladeF(X-52,hy,[-Math.PI/2,Math.PI/6,5*Math.PI/6][i],130);
  circ(X-52,hy,13,'#dfe5e8','rgba(0,0,0,.4)',1);
  /* 卡車與備品 */
  const oldOn=u>.5,newOn=u<.58;
  const nac_open=seg(u,.02,.1)*(1-seg(u,.9,.97));
  nacBig(X+22,hy,false,nac_open);
  const gbIn=u<.22?true:u>.84;
  /* 吊鉤路徑：[u, x, y] */
  const nx=X+6,ny=hy;
  const HK=kf(u,[[0,nx,hy-100],[.1,nx,hy-100],[.16,nx,ny-24],[.24,nx,ny-24],[.36,nx,hy-100],[.5,TKX-6,TG-120],[.56,TKX-6,TG-62],[.6,TKX+60,TG-62],[.62,TKX+60,TG-90],[.7,nx,hy-100],[.82,nx,hy-100],[.88,nx,ny-24],[.94,nx,ny-24],[1,nx,hy-140]]);
  /* 拖車 */
  alphaDo(1,()=>truck(TKX,TG,false,'#5b6a73',()=>{}));
  /* 吊機 */
  const h={x:HK.x,y:HK.y};crane(CX,GC-30,580,h.x,h.y-30,{col:'#e9b21f'});
  box(CX-90,GC-26,150,20,'#e9b21f','rgba(0,0,0,.4)',1);box(CX-110,GC-10,190,10,'#394650');
  /* 齒輪箱：在機艙／吊鉤／拖車 */
  const draw1=(x,y,col)=>{box(x-24,y,48,32,col,'rgba(0,0,0,.55)',1.5);ln([x-24,y,x,y-30,x+24,y,x,y-30],'rgba(30,30,30,.75)',1.2);};
  const carry=(u>=.16&&u<.6)?'old':(u>=.62&&u<.94)?'new':null;
  if(u<.16)box(X-18,hy-10,48,32,'#6f7c84','rgba(0,0,0,.55)',1.5);
  if(carry==='old')draw1(h.x,h.y+14,'#6f7c84');
  if(carry==='new')draw1(h.x,h.y+14,'#9aa3a8');
  if(u>=.6)box(TKX+10,TG-52,54,34,'#6f7c84','rgba(0,0,0,.55)',1.5);   /* 舊件放在拖車 */
  if(u<.62)box(TKX+66,TG-52,54,34,'#9aa3a8','rgba(0,0,0,.55)',1.5);   /* 新件待吊 */
  if(u>=.94)box(X-18,hy-10,48,32,'#9aa3a8','rgba(0,0,0,.55)',1.5);
  /* 導向繩與人員 */
  if(carry){ln([h.x,h.y+34,TKX-30,TG-12],'rgba(255,255,255,.45)',1);}
  person(TKX-40,TG,'#e8572a',1.6);person(X+60,G,'#e8572a',1.6);
  lab(X+22,hy,'機艙頂開口',{dx:-60,dy:-120,st:'l',a:band(u,.04,.2)});
  lab(TKX+40,TG-52,'平板拖車',{dx:20,dy:-160,a:band(u,.4,.64)});
  lab(nx,hy-30,'舊齒輪箱吊出',{dx:-150,dy:-50,st:'w',a:band(u,.2,.46)});
  lab(nx,hy-30,'新齒輪箱吊入',{dx:-150,dy:-50,st:'g',a:band(u,.66,.9)});
  lab(TKX-40,TG-30,'導向繩與地面人員',{dx:-150,dy:-90,st:'s',a:band(u,.56,.86),minor:true});
 },
 hud(u){hudPanel(250,150,'吊換進度（示例）',seg(u,.02,.08),w=>{
  const day=Math.min(4,1+Math.floor(u*3.99));hrow(56,'作業天數',trf('第 {n} 天',{n:day}),w,'#f2c230');hrow(88,'吊重（齒輪箱）','約 18 t',w,'#7dc8dc');hrow(120,'風速限制','≤ 10 m/s',w,'#7dffc4');});}},

/* 6 ─────────────────────────────── 窗口與損失 */
{t:'吊裝窗口與損失發電量',en:'Lifting window and lost generation',dur:14,
 d:'吊裝最怕強風，履帶吊的作業風速上限依吊機與吊件而定，常見約 8–12 m/s。台灣的東北季風與颱風季都會壓縮作業窗口，較合適的時段集中在春季到初夏，即使如此仍須逐日看風速預報。每停機一天，風機就少發一天的電：以 2 MW、容量因數 28% 估算，每天約 13.4 MWh。把等吊機、等備品的天數乘上去，就看得出預先備品與預約吊機的價值，也呼應狀態監測：提早預警，才有時間排程。',
 s:[[0,'吊裝作業要避開強風：東北季風與颱風季都會縮小窗口'],[.26,'較合適的時段集中在春季到初夏，仍須逐日看預報'],[.5,'每停機一天，約少發 13.4 MWh 的電'],[.76,'備品與吊機預先安排，損失可以差到十幾倍']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'台灣吊裝作業窗口（示意）',20,'#f2c230',700);
  const M=['1','2','3','4','5','6','7','8','9','10','11','12'],col=m=>m>=3&&m<=5?'#7dffc4':(m>=6&&m<=9)?'#ff8a60':'#e8572a';
  M.forEach((n,i)=>{const g=seg(u,.04+i*.015,.1+i*.015);alphaDo(g,()=>{const x=90+(i%6)*106,y=250+Math.floor(i/6)*130;
   rrp(x,y,94,104,8);ctx.fillStyle='rgba(255,255,255,.06)';ctx.fill();rrp(x,y+66,94,38,8);ctx.fillStyle=col(i);ctx.fill();
   wt(x+47,y+40,trf('{m} 月',{m:n}),22,'#fff',700,'center',COND);wt(x+47,y+92,i>=3&&i<=5?'較合適':(i>=6&&i<=9)?'颱風季':'東北季風',15,'#13232e',700,'center');});});
  wt(90,540,'吊機作業風速上限常見約 8–12 m/s（示例）',18,'#f2c230',700);
  bullets(100,590,[['春季到初夏較合適，仍須逐日看預報','#fff'],['颱風季與東北季風期窗口很短','#fff'],['預約吊機要保留天候的彈性','#f2c230']],u,.28,.08,44);
  /* 損失發電量 */
  const C=chartBox(800,160,740,400,{title:'損失發電量（每日 13.4 MWh，示例）',x0:0,x1:1500,y0:0,y1:3,xt:[0,500,1000,1500],yt:[],xl:'MWh',pl:30,pt:64,pb:58,gx:3,gy:3});
  const S=[['備品在庫、吊機已預約',7],['備品在庫、吊機需排隊',18],['備品需新購',108]];
  S.forEach(([n,dd],i)=>{const g=ease(seg(u,.46+i*.1,.6+i*.1));if(g<=0)return;const yc=C.py+C.ph*(i+.5)/3,h=34,v=dd*MWH_DAY*g;
   wt(C.px+4,yc-h/2-8,n,16,'rgba(227,236,238,.9)',600);
   box(C.X(0),yc-h/2,C.X(v)-C.X(0),h,i===2?'#ff9d7a':i===1?'#f2c230':'#7dffc4');
   wt(C.X(v)+10,yc+7,trf('{n} MWh',{n:fmtK(v)}),20,'#fff',700,'left',COND);});
  card(800,580,740,220,{bg:'rgba(7,27,39,.75)'});wt(824,618,'算法與結論',20,'#f2c230',700);
  wt(836,660,'2 MW × 24 h × 28% ≈ 13.4 MWh／日',22,'#fff',600,'left',COND);
  alphaDo(seg(u,.74,.8),()=>{wt(836,704,'損失發電量 = 停機天數 × 每日發電量',17,'rgba(227,236,238,.9)',600);
   wt(836,740,'最長與最短的情境差約 15 倍',17,'#ff9d7a',700);wt(836,774,'預測性維護與備品池，把突發故障變成排程',17,'#7dffc4',700);});
 }}
]};
