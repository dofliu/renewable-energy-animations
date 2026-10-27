// KITS: land
/* 太陽光電系列 第 10 集：熱斑與旁路二極體 */
const E_Y='#f2c230',E_G='#7dffc4',E_W='#e8572a',E_B='#58b8d0';
const DEG=Math.PI/180;
const gy=x=>groundY(x);
const CARD='rgba(7,27,39,.75)';
/* 沿折線取點（f：0–1） */
function polyAt(P,f){let L=0;const S=[];for(let i=0;i+3<P.length;i+=2){const l=Math.hypot(P[i+2]-P[i],P[i+3]-P[i+1]);S.push(l);L+=l;}
 let d=clamp(f)*L;for(let i=0,k=0;i<S.length;i++,k+=2){if(d<=S[i]||i===S.length-1){const t=S[i]?d/S[i]:0;return {x:lerp(P[k],P[k+2],t),y:lerp(P[k+1],P[k+3],t)};}d-=S[i];}return {x:P[0],y:P[1]};}
function flowDots(P,n,spd,col,a){alphaDo(a,()=>{for(let i=0;i<n;i++){const p=polyAt(P,((TT*spd)+i/n)%1);circ(p.x,p.y,4.5,col);}});}
/* 一顆電池：heat 0–1 時由藍變橘紅 */
function cellBox(x,y,w,h,heat,shade){const r=Math.round(lerp(31,232,heat)),g=Math.round(lerp(63,87,heat)),b=Math.round(lerp(102,42,heat));
 box(x,y,w,h,'rgb('+r+','+g+','+b+')','rgba(160,200,240,.45)',1);if(shade)alphaDo(shade,()=>box(x,y,w,h,'rgba(5,10,15,.7)'));}
function leaf(x,y,s,rot,a){alphaDo(a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.beginPath();ctx.ellipse(0,0,34*s,17*s,0,0,Math.PI*2);ctx.fillStyle='#4f7a3a';ctx.fill();ln([-34*s,0,34*s,0],'#2f4d24',2);ctx.restore();});}
function diode(x,y,col,on){ln([x-34,y,x-14,y],col,3);ln([x+14,y,x+34,y],col,3);
 poly([x-14,y-16,x-14,y+16,x+14,y],on?col:'rgba(0,0,0,0)',col,3);ln([x+14,y-16,x+14,y+16],col,4);}
function drone(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);box(-18,-6,36,12,'#dfe5e8','rgba(0,0,0,.4)',1);
 for(const sx of [-30,30]){ln([sx*.55,-6,sx,-14],'#8a99a3',3);const r=Math.sin(TT*40)*14;ln([sx-r,-16,sx+r,-16],'#c7d0d5',3);}circ(0,8,5,'#2b3137');ctx.restore();}

const EP={no:10,slug:'solar-pv',seriesName:'太陽光電系列',t:'熱斑與旁路二極體',en:'Hot spots and bypass diodes',
lede:'一片落葉、一坨鳥糞，就可能讓太陽光電模組裡的一顆電池變成「小電熱器」。這一集看遮蔭如何讓電池反向受壓、局部過熱，旁路二極體怎麼替它分流，以及熱像巡檢與認證測試如何把風險關在籠子裡。',
facts:[['3','個','常見 60 片模組分成 3 個子串，每個子串 20 顆電池各配一顆旁路二極體'],
['約 10','V','一個 20 顆電池子串的工作電壓；被遮蔭電池可能承受相近的反向電壓（文獻整理）'],
['約 0.7','V','旁路二極體導通時的順向壓降（矽二極體約 0.7 V，蕭特基較低，約 0.4 V，示例）'],
['約 1/3','','一個子串被旁路時，模組輸出功率約減少三分之一'],
['5','小時','IEC 61215 熱斑耐久測試要求模組在熱斑條件下撐過的時間'],
['100 以上','°C','接線盒內溫度可超過 100°C，二極體溫度越高漏電越大，嚴重時可能熱失控']],
note:'說明：本集為教育用途示意動畫，設備與比例經過調整。60 片模組分成 3 個 20 顆電池子串、各配一顆旁路二極體、20 顆子串反向偏壓約 10–12 V、二極體導通後被遮蔭電池幾乎不再耗能、一個子串被旁路使輸出約少三分之一，整理自賓州州立大學 AE868 課程教材、專利文獻與電氣工程論壇討論；IEC 61215 熱斑耐久測試需撐過 5 小時引自 arXiv:1411.0621；接線盒內溫度可達 100°C 以上與蕭特基二極體漏電隨溫度上升，引自伯恩應用科技大學（BFH）論文。被遮電池的電流、功率與溫度數值、一天內升溫曲線、二極體壓降、熱像溫度皆為典型範例，非特定模組或案場資料，實際依電池型號、遮蔭程度與日照而異。',
base:()=>{landSky(GY,{sun:{x:1280,y:120}});drawGround();},
shots:[
{t:'一片落葉的影響',en:'A fallen leaf',dur:13,side:true,
 d:'太陽光電場裡的遮蔭不一定來自大樹或建築，一片落葉、一坨鳥糞、一小塊泥土，都可能蓋住模組上的一顆電池。模組內部的電池片是一顆接著一顆串聯起來的，被遮到的那一顆幾乎發不出電，還會擋住整串的電流。遮蔭又分成兩類：隨太陽移動的樹影、樓影屬於暫時性，鳥糞與泥垢則會停在同一個位置，一次就是好幾天甚至好幾個月。',
 s:[[0,'光電場裡，樹影、落葉、鳥糞都可能遮住模組'],[.3,'被遮到的只有一小塊，卻會影響整串電池'],[.56,'樹影會隨太陽移動，鳥糞卻停在同一個位置'],[.8,'長時間不動的遮蔭，最容易留下熱斑']],
 draw(u){
  const xs=[360,620,880,1140],tx=170,sh=ease(seg(u,.1,.45));
  /* 樹與樹影 */
  box(tx-8,gy(tx)-150,16,150,'#5b4636');circ(tx,gy(tx)-190,70,'#3f6b3a');circ(tx-45,gy(tx)-160,48,'#4a7a40');circ(tx+48,gy(tx)-165,50,'#477544');
  const sx=lerp(300,520,sh);alphaDo(.55,()=>poly([sx,gy(sx)+2,sx+170,gy(sx)+2,sx+230,gy(sx)+14,sx+60,gy(sx)+14],'rgba(5,10,15,.7)'));
  xs.forEach((x,i)=>solarPanel(x,gy(x),190,25));
  /* 落葉 */
  const px=xs[1],py=gy(px)-190*.45-20;
  leaf(px+12,py-30+(1-ease(seg(u,.05,.3)))*-160,.8,-.5+TT*.3*(1-seg(u,.05,.3)),band(u,.04,1));
  alphaDo(band(u,.5,1),()=>{circ(xs[2]+18,gy(xs[2])-190*.45-34,6,'#d9d3c3');circ(xs[2]+26,gy(xs[2])-190*.45-30,4,'#d9d3c3');});
  lab(px+20,py-30,'落葉',{dx:-90,dy:-100,st:'w',a:band(u,.28,.9)});
  lab(xs[2]+22,gy(xs[2])-190*.45-32,'鳥糞',{dx:70,dy:-110,st:'w',a:band(u,.5,1)});
  lab(sx+100,gy(sx)+8,'移動的樹影',{dx:0,dy:70,st:'l',a:band(u,.4,.72),minor:true});
  lab(xs[0],gy(xs[0])-190*.45-4,'模組',{dx:-50,dy:-140,st:'s',a:band(u,.04,.3)});
 }},

{t:'串聯：最弱的一顆說了算',en:'Series strings and the weakest cell',dur:13,
 d:'一片 60 片電池的模組，通常把 20 顆電池串成一個子串，三個子串再串起來。串聯的特性是電流只有一條路，處處相同，所以整串電流會被最弱的那一顆限制。好比一條水管裡有一段被捏細，整條管子的流量就只剩那一段能通過的量。假設每顆電池滿照射時能提供約 10 A，遮住一半面積的那一顆只剩約 5 A，整個子串就跟著降到約 5 A。',
 s:[[0,'60 片模組，由三個 20 顆電池的子串組成'],[.3,'串聯的電流只有一條路，處處相同'],[.56,'一顆被遮住一半，只能提供約五安培'],[.8,'整個子串被它拖累，電流跟著降到五安培']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:CARD});wt(84,200,'60 片模組的內部（示意）',20,E_Y,700);
  const cw=50,x0=110,y0=250,cols=6,rows=10;
  box(x0-10,y0-10,cols*cw+20,rows*cw+20,'#2b3137','rgba(255,255,255,.3)',2);
  const sa=seg(u,.06,.2),act=seg(u,.2,.3);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const shade=(c===2&&r===4)?seg(u,.4,.54)*.55:0;cellBox(x0+c*cw,y0+r*cw,cw-2,cw-2,0,shade);}
  [[0,E_Y],[2,E_G],[4,E_B]].forEach(([c0,col],i)=>alphaDo(sa*(i===1?1:.55),()=>{ctx.strokeStyle=col;ctx.lineWidth=i===1?4:2;ctx.strokeRect(x0-3+c0*cw,y0-3,cw*2+2,rows*cw+2);}));
  leaf(x0+2*cw+cw*.55,y0+4*cw+cw*.5,.6,-.4,seg(u,.38,.5));
  alphaDo(sa,()=>{wt(x0+cw,y0-20,'子串 1',14,'#fff',600,'center');wt(x0+3*cw,y0-20,'子串 2',14,E_G,700,'center');wt(x0+5*cw,y0-20,'子串 3',14,'#fff',600,'center');});
  wt(x0+cols*cw/2,y0+rows*cw+36,'每個子串 20 顆電池串聯',16,'rgba(227,236,238,.85)',600,'center');
  /* 電流長條 */
  const bx=500,by=700,K=36,B=[['正常電池',10,'rgba(227,236,238,.75)',.3],['被遮一半',5,E_W,.5],['整個子串',5,E_Y,.7]];
  wt(bx,226,'電流（A，示例）',18,'rgba(227,236,238,.85)',600);
  ln([bx-10,by,1040,by],'rgba(255,255,255,.4)',2);
  B.forEach(([n,v,col,t0],i)=>{const x=bx+10+i*180,a=ease(seg(u,t0-.1,t0+.06)),h=v*K*a;box(x,by-h,120,h,col);wt(x+60,by+30,n,18,'#fff',700,'center');
   alphaDo(seg(u,t0,t0+.08),()=>wt(x+60,by-h-14,trf('{n} A',{n:v}),32,col,700,'center',COND));});
  alphaDo(seg(u,.72,.84),()=>{ctx.setLineDash([8,6]);ln([bx,by-5*K,1040,by-5*K],E_Y,2);ctx.setLineDash([]);});
  card(1100,160,440,640,{bg:CARD});wt(1124,200,'串聯的三件事',20,E_Y,700);
  [['電流處處相同','只有一條路可走',.3],['最弱的決定電流','像捏細的水管',.56],['例：遮半顆','整串剩約一半電流（示例）',.8]].forEach(([a,b,t0],i)=>{const k=seg(u,t0,t0+.08),y=270+i*160;
   alphaDo(.25+.75*k,()=>{box(1124,y-26,14,110,k>.5?E_Y:'rgba(255,255,255,.3)');wt(1156,y+6,a,22,'#fff',700);wt(1156,y+48,b,17,'rgba(227,236,238,.85)',500);});});
 }},

{t:'反向受壓，變成電熱器',en:'Reverse bias turns the cell into a heater',dur:14,
 d:'其他電池仍在發電，電流硬是要通過被遮的那顆。這顆電池擋不住，只好被其他十九顆電池「反向」施加電壓，約接近整個子串的工作電壓，也就是十伏上下。電壓乘上電流就是功率，這份電能不再輸出，全部變成熱，集中在一顆約拳頭大的電池上。例如約 10 V、8 A 就是 80 W，等於一支電烙鐵。溫度升高後，封裝材變黃、焊帶熔化，嚴重時玻璃破裂，甚至起火。',
 s:[[0,'其他電池照常發電，電流依然要穿過被遮的那顆'],[.3,'十九顆電池的電壓，反過來壓在這一顆身上'],[.56,'電壓乘上電流，電能全部變成熱'],[.8,'熱集中在一點，封裝與玻璃都可能損壞']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:CARD});wt(84,200,'一個子串，20 顆電池（示意）',20,E_Y,700);
  const cx0=120,cy=300,cw=44,ch=70,SH=13,T=ease(seg(u,.5,.9)),heat=T;
  for(let i=0;i<20;i++)cellBox(cx0+i*cw,cy,cw-3,ch,i===SH?heat:0,i===SH?.5*(1-heat*.6):0);
  /* 電流 */
  flowDots([cx0-30,cy+ch/2,cx0+20*cw+10,cy+ch/2],10,.12,E_Y,seg(u,.04,.14));
  alphaDo(seg(u,.04,.14),()=>{wt(cx0+10*cw,cy-24,'電流方向',17,E_Y,700,'center');arrow(cx0+10*cw-60,cy-8,cx0+10*cw+60,cy-8,E_Y,2.5);});
  /* 被遮的電池 */
  lab(cx0+SH*cw+cw/2,cy+ch,'被遮的電池',{dx:0,dy:70,st:'w',a:band(u,.04,1)});
  /* 19 顆的電壓括號 */
  const va=seg(u,.28,.4);
  alphaDo(va,()=>{ln([cx0,cy+ch+22,cx0,cy+ch+34,cx0+SH*cw-4,cy+ch+34,cx0+SH*cw-4,cy+ch+22],E_G,2.5);ln([cx0+(SH+1)*cw,cy+ch+22,cx0+(SH+1)*cw,cy+ch+34,cx0+20*cw-4,cy+ch+34,cx0+20*cw-4,cy+ch+22],E_G,2.5);
   wt(cx0+SH*cw/2,cy+ch+66,'其他 19 顆',17,E_G,700,'center');});
  alphaDo(seg(u,.3,.42),()=>{arrow(cx0+SH*cw/2,cy+ch+80,cx0+SH*cw+cw/2-6,cy+ch+8,E_W,3);wt(cx0+SH*cw/2-20,cy+ch+104,'約 10 V 反向加壓（示例）',18,E_W,700,'left');});
  /* 計算 */
  const pa=seg(u,.54,.66);
  alphaDo(pa,()=>{card(90,540,940,100,{bg:'rgba(232,87,42,.1)',st:'rgba(232,87,42,.5)'});
   wt(120,602,'功率 = 電壓 × 電流',22,'#fff',700);wt(1000,604,'約 10 V × 8 A ≈ 80 W',34,E_W,700,'right',COND);});
  alphaDo(seg(u,.78,.9),()=>{wt(90,690,'80 W 集中在約 16 cm 見方的一顆電池上',19,'#fff',700);wt(90,730,'封裝材變黃、焊帶熔化、玻璃破裂，是熱斑的可能後果',17,'rgba(227,236,238,.85)',500);});
  /* 溫度計 */
  card(1100,160,440,640,{bg:CARD});wt(1124,200,'被遮電池的溫度（示例）',20,E_Y,700);
  const tx=1200,ty0=260,th=470,temp=lerp(45,130,T);
  box(tx,ty0,50,th,'rgba(255,255,255,.1)','rgba(255,255,255,.35)',2);
  const fh=th*(temp-40)/100;box(tx+4,ty0+th-fh,42,fh,temp>100?E_W:temp>70?'#ff9d7a':E_Y);
  [[40,'40'],[70,'70'],[100,'100'],[140,'140']].forEach(([v,l])=>{const yy=ty0+th-th*(v-40)/100;ln([tx+52,yy,tx+64,yy],'rgba(255,255,255,.6)',2);wt(tx+74,yy+6,l,16,'rgba(227,236,238,.85)',600);});
  wt(1440,ty0+th-fh+10,trf('{n} °C',{n:Math.round(temp)}),38,temp>100?E_W:'#fff',700,'right',COND);
  alphaDo(seg(u,.7,.8),()=>wt(1124,ty0+th+54,'超過 100 °C 就要小心',18,E_W,700));
 }},

{t:'旁路二極體分流',en:'The bypass diode shunts current',dur:14,
 d:'為了避免單顆電池被燒壞，每個子串都並聯一顆旁路二極體，接在接線盒裡。平常子串電壓為正，二極體反向不導通，什麼事也不做；當某個子串被遮蔽、電壓掉到零甚至反向，二極體就導通，讓其他子串的電流從旁邊繞過去，被遮電池只剩下約 0.7 V 的小壓降。代價是這個子串的電不見了，模組輸出約少三分之一，但整片模組不必整個停擺。',
 s:[[0,'每個子串都並聯一顆旁路二極體'],[.3,'平常二極體不導通，電流走電池'],[.55,'子串被遮蔽，二極體導通，電流繞道'],[.8,'代價是少了一個子串，輸出約少三分之一']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:CARD});wt(84,200,'模組內部電路（示意）',20,E_Y,700);
  const BX=[110,410,710],BW=260,BY=370,BH=110,wy=BY+BH/2,dy=290,act=ease(seg(u,.44,.56));
  ln([70,wy,110,wy],'#c7d0d5',4);ln([970,wy,1010,wy],'#c7d0d5',4);ln([370,wy,410,wy],'#c7d0d5',4);ln([670,wy,710,wy],'#c7d0d5',4);
  BX.forEach((x,i)=>{const sh=i===1?act*.6:0;
   for(let c=0;c<10;c++)for(let r=0;r<2;r++)cellBox(x+c*26,BY+r*55,24,53,0,sh);
   box(x-2,BY-2,BW+4,BH+4,'rgba(0,0,0,0)','rgba(255,255,255,.4)',2);
   wt(x+BW/2,BY+BH+36,trf('子串 {n}',{n:i+1}),18,i===1?E_G:'#fff',700,'center');
   const nl=x-20,nr=x+BW+20,on=i===1&&act>.5,col=on?E_G:'rgba(227,236,238,.55)';
   ln([nl,wy,nl,dy,nr,dy,nr,wy],col,on?3.5:2.5);diode((nl+nr)/2,dy,col,on);
   circ(nl,wy,5,'#c7d0d5');circ(nr,wy,5,'#c7d0d5');});
  leaf(BX[1]+BW*.5,BY+BH*.5,1.1,-.3,seg(u,.38,.5));
  /* 電流 */
  const fa=seg(u,.06,.14);
  [0,1,2].forEach(i=>{const x=BX[i],nl=x-20,nr=x+BW+20,byp=i===1&&act>.5;
   const P=byp?[nl,wy,nl,dy,nr,dy,nr,wy]:[nl,wy,nr,wy];flowDots(P,byp?6:7,.13,byp?E_G:E_Y,fa);});
  flowDots([70,wy,90,wy],2,.5,E_Y,fa);
  lab(BX[1]+BW/2+10,dy,'旁路二極體',{dx:0,dy:-60,st:'g',a:band(u,.04,1)});
  lab(BX[1]+BW*.8,BY+BH,'被遮蔽的子串',{dx:0,dy:140,st:'w',a:band(u,.4,1)});
  alphaDo(seg(u,.5,.62),()=>wt(BX[1]+BW/2+10,dy+46,'導通，壓降約 0.7 V',17,E_G,700,'center'));
  alphaDo(seg(u,.06,.16),()=>wt(90,wy-30,'輸出 →',16,'rgba(227,236,238,.85)',600));
  /* 右側讀數 */
  card(1100,160,440,640,{bg:CARD});wt(1124,200,'輸出（示例）',20,E_Y,700);
  const V=lerp(30,20,act),P=lerp(100,67,act);
  wt(1124,290,'電壓',20,'rgba(227,236,238,.85)',600);wt(1516,300,trf('{n} V',{n:Math.round(V)}),44,E_Y,700,'right',COND);ln([1124,320,1516,320],'rgba(255,255,255,.15)',1);
  wt(1124,400,'功率',20,'rgba(227,236,238,.85)',600);wt(1516,410,trf('{n} %',{n:Math.round(P)}),44,act>.5?E_W:E_G,700,'right',COND);ln([1124,430,1516,430],'rgba(255,255,255,.15)',1);
  box(1124,470,392,26,'rgba(255,255,255,.1)');box(1124,470,392*P/100,26,act>.5?E_W:E_G);
  alphaDo(seg(u,.56,.7),()=>{wt(1124,560,'只損失一個子串',20,'#fff',700);wt(1124,600,'其餘兩串照常發電',17,'rgba(227,236,238,.85)',500);});
  alphaDo(seg(u,.74,.86),()=>{card(1124,640,392,120,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});wt(1144,684,'被遮電池只剩小壓降',19,E_G,700);wt(1144,722,'不再被其他電池「燒」',17,'rgba(227,236,238,.9)',500);});
 }},

{t:'用熱像儀找熱斑',en:'Finding hot spots with thermography',dur:13,side:true,
 d:'光電場運維常用無人機掛載紅外線熱像儀，在日照充足的時段沿著模組列飛行。正常模組的表面溫度相近，帶有熱斑的電池會明顯較亮。判讀時要看熱的形狀：單顆電池過熱，常是遮蔭或電池缺陷；整個子串偏熱，可能是旁路二極體導通；整片模組偏熱，則可能是接線問題。找到位置後再到現場清除汙物、更換模組，並記錄在維運系統裡。',
 s:[[0,'無人機掛著熱像儀，沿著模組列飛行'],[.3,'正常的模組溫度相近，影像顏色均勻'],[.55,'有一片的其中一格特別亮，那就是熱斑'],[.8,'依熱的形狀判斷：電池、子串，還是整片']],
 draw(u){
  const xs=[190,420,650,880];
  xs.forEach(x=>solarPanel(x,gy(x),190,25));
  const dx=lerp(170,xs[2]+10,ease(seg(u,.04,.5))),dyy=lerp(260,250,u)+Math.sin(TT*2)*6;
  alphaDo(band(u,.08,.9),()=>{ctx.beginPath();ctx.moveTo(dx,dyy+14);ctx.lineTo(dx-110,gy(dx)-60);ctx.lineTo(dx+110,gy(dx)-60);ctx.closePath();ctx.fillStyle='rgba(232,87,42,.12)';ctx.fill();ctx.strokeStyle='rgba(232,87,42,.5)';ctx.lineWidth=1.5;ctx.stroke();});
  drone(dx,dyy,1.6);
  const hs=seg(u,.46,.58);
  alphaDo(hs,()=>{const hx=xs[2]+6,hy=gy(xs[2])-190*.45-26;const g=ctx.createRadialGradient(hx,hy,2,hx,hy,34);g.addColorStop(0,'rgba(255,200,80,.95)');g.addColorStop(1,'rgba(232,87,42,0)');ctx.fillStyle=g;ctx.fillRect(hx-34,hy-34,68,68);});
  lab(dx,dyy,'無人機熱像儀',{dx:-120,dy:-60,st:'s',a:band(u,.04,.5)});
  lab(xs[2]+6,gy(xs[2])-190*.45-26,'熱斑',{dx:90,dy:-120,st:'w',a:band(u,.48,1)});
  /* 熱像視窗 */
  const ia=seg(u,.2,.3);
  alphaDo(ia,()=>{card(1020,330,480,290,{bg:'rgba(7,12,18,.92)',st:'rgba(255,255,255,.3)'});wt(1040,368,'熱像畫面（示意）',17,E_Y,700);
   const gx=1050,gyy=400,w=34,h=30;
   for(let r=0;r<6;r++)for(let c=0;c<10;c++){const d=Math.hypot(c-6.5,r-2.5),hot=clamp(1-d/1.8)*hs,bg=.18+.1*Math.sin(r*.7+c*.5);
    const t=clamp(bg+hot*.85);const rr=Math.round(lerp(40,255,t)),g=Math.round(lerp(20,t>.6?200:60,t)),b=Math.round(lerp(120,20,t));box(gx+c*w,gyy+r*h,w-2,h-2,'rgb('+rr+','+g+','+b+')');}
   alphaDo(hs,()=>{wt(1050,gyy+6*h+34,'熱斑約 95 °C',19,'#ffb347',700);wt(1500,gyy+6*h+34,'周圍約 55 °C',18,'rgba(227,236,238,.85)',600,'right');});});
 },
 hud(u){hudPanel(250,150,'熱像判讀（示例）',seg(u,.05,.1),w=>{const h=seg(u,.46,.58);
  hrow(56,'周圍',trf('{n} °C',{n:55}),w,'#7dffc4');hrow(88,'最熱點',trf('{n} °C',{n:Math.round(lerp(56,95,h))}),w,h>.5?'#e8572a':'#fff');
  hrow(120,'溫差',trf('{n} °C',{n:Math.round(lerp(1,40,h))}),w,'#f2c230');});}},

{t:'層層防護與二極體也會壞',en:'Layers of protection, and diode failure',dur:13,
 d:'熱斑的防護是多道關卡。設計上有旁路二極體；認證上，IEC 61215 規定模組要在熱斑條件下撐過五小時；運維上靠熱像巡檢、清洗、除草與修剪樹木，減少遮蔭。旁路二極體本身也會失效：接線盒內溫度可超過 100°C，高溫下漏電增加，嚴重時熱失控。二極體短路，整個子串的發電就白白損失；若是開路，它就不再保護電池，熱斑風險隨之回來。',
 s:[[0,'設計、認證、巡檢與維護，是四道防線'],[.3,'認證測試要模組在熱斑條件下撐過五小時'],[.56,'接線盒內高溫，二極體也可能失效'],[.8,'短路損失發電，開路失去保護，都要靠巡檢發現']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:CARD});wt(84,200,'熱斑的四道防線',20,E_Y,700);
  const L=[['設計','每個子串配一顆旁路二極體',E_Y,.06],['認證','IEC 61215 熱斑耐久測試，撐過 5 小時',E_B,.22],['巡檢','無人機熱像儀找出異常模組',E_G,.38],['維護','清洗、除草、修剪樹木，減少遮蔭',E_Y,.52]];
  L.forEach(([a,b,col,t0],i)=>{const k=seg(u,t0,t0+.1),y=240+i*135;alphaDo(.2+.8*k,()=>{box(90,y,8,105,col);tag(116,y+8,a,{size:20,bg:col,fg:'#13232e'});wt(116,y+78,b,19,'#fff',600);
   wt(1030,y+52,trf('{n}',{n:i+1}),56,'rgba(255,255,255,.18)',700,'right',COND);});});
  card(1100,160,440,640,{bg:CARD});wt(1124,200,'二極體失效的兩種樣子',20,E_Y,700);
  const hot=seg(u,.54,.66);
  /* 接線盒溫度 */
  alphaDo(hot,()=>{box(1124,236,392,120,'#2b3137','rgba(255,255,255,.3)',2);wt(1144,274,'接線盒',18,'#fff',700);
   wt(1500,330,trf('{n} °C',{n:Math.round(lerp(60,105,hot))}),38,hot>.6?E_W:E_Y,700,'right',COND);wt(1144,320,'溫度越高，漏電越大',15,'rgba(227,236,238,.85)',500);});
  [['短路','子串發的電直接被短接','整串白白損失',E_W,.66],['開路','不再保護被遮的電池','熱斑風險回來',E_W,.78]].forEach(([n,a,b,col,t0],i)=>{const k=seg(u,t0,t0+.08),y=400+i*190;
   alphaDo(k,()=>{card(1124,y,392,170,{bg:'rgba(232,87,42,.08)',st:'rgba(232,87,42,.45)'});tag(1144,y+14,n,{size:18,bg:col,fg:'#fff'});wt(1144,y+90,a,18,'#fff',700);wt(1144,y+128,b,17,'rgba(227,236,238,.9)',500);});});
 }}
]};
