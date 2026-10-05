// KITS: marine
/* ================= EP25 吸力式與重力式基礎 ================= */
/* text wrapped to a width (after translation) */
function wrap25(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
/* suction bucket jacket geometry (world px; schematic) */
const BX25=100,BW25=56,SK25=42,JH25=270,TW25=36;
const BED25=Math.max(bedY(TX-BX25),bedY(TX+BX25));
const LID0=BED25-SK25;            // lid level when the skirt tip touches the seabed
const R25=TX+175,CP25=R25+80;     // heavy-lift vessel and crane pedestal
const deck25=()=>wlAt(R25+215,.35)-18;
/* one suction bucket: lid at y, skirt below; pump module on top */
function bucket25(x,y,pump){
  const g=ctx.createLinearGradient(x-BW25/2,0,x+BW25/2,0);g.addColorStop(0,'#3d4b55');g.addColorStop(.38,'#8a9ca8');g.addColorStop(1,'#34414b');
  ctx.fillStyle=g;ctx.fillRect(x-BW25/2,y,BW25,SK25);
  ln([x-BW25/2,y+SK25*.5,x+BW25/2,y+SK25*.5],'rgba(0,0,0,.18)',.8);
  box(x-BW25/2-2,y-5,BW25+4,6,'#55626a');
  poly([x-BW25/2+5,y-5,x-6,y-24,x+6,y-24,x+BW25/2-5,y-5],'#76858f','rgba(0,0,0,.25)',.8);
  if(pump>0)alphaDo(pump,()=>{box(x+9,y-17,15,12,'#e8a33a','#8a5a1a',.8);box(x+13,y-22,6,5,'#5b666e');
   for(let k=0;k<5;k++){const q=(TT*.7+k/5)%1;circ(x+16+Math.sin(q*9+k)*3,y-24-q*46,1.6+q,`rgba(200,235,245,${.75*(1-q)})`);}});
}
/* suction bucket jacket: left lid yl, right lid yr (rear bucket in the middle) */
function sbj25(cx,yl,yr,o){
  o=o||{};const ym=(yl+yr)/2,yt=ym-JH25,N=4;
  const PL=f=>({x:lerp(cx-BX25,cx-TW25,f),y:lerp(yl,yt,f)}),PR=f=>({x:lerp(cx+BX25,cx+TW25,f),y:lerp(yr,yt,f)});
  alphaDo(.55,()=>{bucket25(cx,ym,0);ln([cx,ym-24,cx,yt],'rgba(150,165,175,.8)',5);});
  ctx.strokeStyle='#8595a0';ctx.lineWidth=3;ctx.beginPath();
  for(let i=0;i<N;i++){const a0=PL(i/N),a1=PL((i+1)/N),b0=PR(i/N),b1=PR((i+1)/N);
   ctx.moveTo(a0.x,a0.y-24);ctx.lineTo(b1.x,b1.y);ctx.moveTo(b0.x,b0.y-24);ctx.lineTo(a1.x,a1.y);ctx.moveTo(a1.x,a1.y);ctx.lineTo(b1.x,b1.y);}
  ctx.stroke();
  for(const P of [PL,PR]){const a=P(0),b=P(1);ln([a.x,a.y-20,b.x,b.y],'#2f3a42',9);ln([a.x,a.y-20,b.x,b.y],'#b7c3ca',6);}
  for(let i=1;i<N;i++)for(const P of [PL,PR]){const p=P(i/N);circ(p.x,p.y,4.5,'#8595a0');}
  bucket25(cx-BX25,yl,o.pump||0);bucket25(cx+BX25,yr,o.pump||0);
  box(cx-TW25-10,yt-6,(TW25+10)*2,7,'#f2c230');
  if(o.tp){const g=ctx.createLinearGradient(cx-20,0,cx+20,0);g.addColorStop(0,'#c9971a');g.addColorStop(.4,'#f7d24c');g.addColorStop(1,'#b3830c');
   ctx.fillStyle=g;ctx.fillRect(cx-20,yt-30,40,24);box(cx-56,yt-33,112,4,'#6f7a80');rail(cx-56,cx+56,yt-33,8);}
  return {yt};
}
/* shot 1: lowering then self-weight penetration */
function lid1(u){if(u<.52)return lerp(SEA-20,LID0,ease(seg(u,.08,.5)));return LID0+12*easeOut(seg(u,.56,.8));}
/* gravity-based foundation */
const GX25=TX,GW25=104,GB25=34,GH25=262;
const GBED25=bedY(GX25)-8;        // top of the levelled gravel bed
const STONE25=(()=>{const r=rng(251),a=[];for(let i=0;i<70;i++){const s=r()<.5?-1:1;a.push({x:GX25+s*(GW25+4+r()*58),y:0,r:2.4+r()*3.2,k:r(),c:r()});}return a;})();
const GRAV25=(()=>{const r=rng(252),a=[];for(let i=0;i<46;i++)a.push({x:GX25-GW25-24+r()*(GW25*2+48),r:1.4+r()*1.8,c:r()});return a;})();
function gbf25(cx,yb,water,sand){
  // base slab with cutaway cells
  box(cx-GW25,yb-GB25,GW25*2,GB25,'#9aa3a8','#6d777d',1);
  const cw=(GW25*2-16)/4;
  for(let i=0;i<4;i++){const x=cx-GW25+8+i*cw,ih=GB25-12,iy=yb-GB25+6;
   box(x+2,iy,cw-4,ih,'#3c464d');
   if(sand>0)box(x+2,iy+ih*(1-sand),cw-4,ih*sand,'#d9c393');
   const wv=Math.max(0,water-sand);if(wv>0)box(x+2,iy+ih*(1-sand-wv),cw-4,ih*wv,'rgba(88,184,208,.85)');}
  // cone + shaft
  const ct=yb-GB25-74,top=yb-GH25;
  const g=ctx.createLinearGradient(cx-GW25*.7,0,cx+GW25*.7,0);g.addColorStop(0,'#7f898f');g.addColorStop(.4,'#c3cbcf');g.addColorStop(1,'#757f85');
  poly([cx-GW25*.78,yb-GB25,cx-20,ct,cx+20,ct,cx+GW25*.78,yb-GB25],g,'rgba(0,0,0,.25)',1);
  const g2=ctx.createLinearGradient(cx-20,0,cx+20,0);g2.addColorStop(0,'#7f898f');g2.addColorStop(.4,'#d3d9dc');g2.addColorStop(1,'#757f85');
  ctx.fillStyle=g2;ctx.fillRect(cx-20,top,40,ct-top);
  box(cx-22,top-6,44,8,'#f2c230');box(cx-50,top-9,100,4,'#6f7a80');rail(cx-50,cx+50,top-9,8);
}
function gbfY(u){return lerp(SEA+140,GBED25,ease(seg(u,.32,.62)));}

const EP={no:25,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'吸力式與重力式基礎',en:'Suction bucket and gravity-based foundations',
lede:'不是每一座離岸風機都要用液壓錘把樁打進海床。這一集看兩種「不打樁」的基礎：吸力桶套管靠抽出桶內海水產生的壓力差把桶壓進海床，台灣的大彰化 2b 及 4 風場是亞太地區首次採用；重力式基礎則像一座巨大的混凝土沉箱，靠自重與壓艙物站穩。最後把它們和單樁、打樁套管放在一起比較。',
facts:[['66','座','大彰化 2b 及 4 風場的吸力桶套管基礎數量，為亞太地區首次採用（沃旭能源）'],['約 80','m','同一批吸力桶套管的高度，單座重量最高約 2,300 t'],['約 1,150','t','直徑 12 m 吸力桶在 100 kPa 負壓下增加的下壓力（示例）'],['0.5–1','L/D','風機用吸力桶裙板長度與直徑比的常見範圍（典型範例）'],['約 5,000','t','法國 Fécamp 重力式基礎的空重，底部直徑約 31 m（EDF）'],['0','次','吸力桶安裝不需錘擊打樁，幾乎沒有打樁水下噪音']],
note:'說明：本集為教育用途示意動畫，基礎尺寸、水深與貫入深度經過壓縮，地層為示意。大彰化 2b 及 4 風場吸力桶套管的數量、高度與重量取自沃旭能源及產業媒體的公開資訊；Fécamp 重力式基礎的空重與底部直徑取自 EDF Renouvelables 新聞稿，Blyth 示範風場以注水下沉、再以砂置換壓艙的工法取自 BAM 新聞稿；吸力式基礎的設計與安裝可參考 DNV-RP-E303 等規範。吸力桶直徑、裙板長度比、負壓、貫入深度、傾斜容許值與基礎重量的數字皆為典型範例，實際依各風場的地質調查與設計而定，不代表特定風場。',
shots:[
/* 1 */{t:'吸力桶套管：不用打樁的基礎',en:'Suction bucket jacket: no piling',dur:13,side:true,
 d:'吸力桶套管（SBJ）的三支腳柱底下不是基樁，而是三個倒扣的大鋼桶，頂部封閉、底部開口，稱為吸力桶。重件吊裝船把整座套管吊入海中，鋼桶的裙板接觸海床後，先靠套管自己的重量插入海床幾公尺。大彰化 2b 及 4 風場的吸力桶套管高約 80 公尺、單座最重約 2,300 公噸，共 66 座，是台灣與亞太地區第一次採用這種基礎。',
 s:[[0,'吸力桶套管的腳柱底下是三個倒扣的鋼桶'],[.3,'重件吊裝船把整座套管緩緩放入海中'],[.56,'裙板碰到海床後，先靠自重插入幾公尺'],[.8,'接下來不用打樁，而是把桶內的水抽出來']],
 cam:u=>camMix({x:780,y:450,s:1.02},{x:TX+10,y:BED25-70,s:1.75},ease(seg(u,.56,.74))),
 draw(u){
  const deck=deck25();vsl(R25,430,false,{damp:.35},vHLV);
  const y=lid1(u),J=sbj25(TX,y,y,{});
  const hk={x:TX,y:J.yt-62+18*seg(u,.8,.95)};
  crane(CP25,deck-30,420,hk.x,hk.y,{col:'#e9b21f'});
  slings(hk.x,hk.y,[TX-TW25-8,J.yt-4,TX+TW25+8,J.yt-4]);
  school(TX-300,640,7,9,TT,30,1);
  lab(R25+250,deck-10,'重件吊裝船',{dx:40,dy:60,a:band(u,0,.3)});
  lab(TX-70,J.yt+90,'吸力桶套管',{dx:-110,dy:-30,a:band(u,.02,.3),st:'s'});
  lab(TX-BX25,y+SK25/2,'吸力桶（頂部封閉）',{dx:-110,dy:20,a:band(u,.12,.5),st:'s'});
  lab(TX+BX25,y+SK25-6,'自重貫入',{dx:90,dy:30,a:band(u,.6,1),st:'g'});
  lab(TX-BX25,y-6,'裙板插入海床',{dx:-100,dy:-40,a:band(u,.64,1)});
 },
 hud(u){hudPanel(240,130,'下放（示例）',seg(u,.04,.1),w=>{
  const y=lid1(u),pen=Math.max(0,y-LID0);
  hrow(52,'桶底水深',Math.min(40,Math.max(0,(y+SK25-SEA)/6.03)).toFixed(0)+' m',w);
  hrow(80,'自重貫入',(pen/SK25*9).toFixed(1)+' m',w,'#7dffc4');hbar(14,88,w-28,pen/SK25,'#7dffc4');
  hrow(118,'錘擊數','0',w,'#f2c230');});}},
/* 2 */{t:'負壓貫入的原理',en:'How suction penetration works',dur:14,
 d:'自重貫入之後，桶頂的抽水泵把桶內的海水抽走。桶子是封閉的，桶內壓力因此比外面的海水壓力低，這個壓力差作用在整個頂蓋上，就像一隻看不見的手把桶往下壓。以直徑 12 公尺的吸力桶為例，頂蓋面積約 113 平方公尺，100 kPa 的負壓就能增加約 1,150 公噸的下壓力（示例）。在砂土中，海水從桶外繞過裙板尖端往桶內滲流，還會降低尖端的阻力。',
 s:[[0,'桶頂的抽水泵把桶內的海水抽走'],[.26,'桶內壓力降低，與外面形成壓力差'],[.5,'壓力差作用在頂蓋上，把桶往下壓'],[.74,'砂土中的滲流還能降低裙板尖端的阻力']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'吸力桶剖面（示意）',20,'#fff',700);
  const X0=84,X1=756,SL=430,BOT=780,cx=410,HW=125,SKD=200;
  const p=lerp(42,186,ease(seg(u,.2,.86))),lid=SL-SKD+p;
  ctx.save();rrp(61,151,718,648,14);ctx.clip();
  box(X0,210,X1-X0,SL-210,'rgba(59,147,187,.3)');ln([X0,210,X1,210],'rgba(255,255,255,.6)',1.4);
  box(X0,SL,X1-X0,BOT-SL,'rgba(217,195,147,.85)');ln([X0,SL,X1,SL],'#a98a58',2);
  const r=rng(31);for(let i=0;i<120;i++){const x=X0+r()*(X1-X0),y=SL+6+r()*(BOT-SL-12);circ(x,y,1.2,'rgba(120,95,62,.4)');}
  // inside: water above the soil plug (lighter = lower pressure)
  const pump=seg(u,.06,.14);
  box(cx-HW+5,lid+5,HW*2-10,SL-lid-5,`rgba(125,200,220,${.3+.25*pump})`);
  // seepage particles (sand) outside → around the tip → inside
  const sp=seg(u,.72,.8);
  if(sp>0)alphaDo(sp,()=>{for(const s of [-1,1])for(let k=0;k<7;k++){const q=(TT*.35+k/7)%1;
   const P=[{x:cx+s*(HW+60),y:SL+4},{x:cx+s*(HW+18),y:lid+SKD+10},{x:cx+s*(HW-24),y:lid+SKD+10},{x:cx+s*(HW-40),y:SL+4}];
   const t=q*3,i=Math.min(2,Math.floor(t)),f=t-i,pt=lerpPt(P[i],P[i+1],f);circ(pt.x,pt.y,2.4,'#58b8d0');}
   for(const s of [-1,1]){arrow(cx+s*(HW+70),SL+40,cx+s*(HW+30),lid+SKD-20,'rgba(88,184,208,.9)',2);arrow(cx+s*(HW-30),lid+SKD-10,cx+s*(HW-50),SL+30,'rgba(88,184,208,.9)',2);}});
  // bucket walls and lid
  for(const s of [-1,1])box(cx+s*HW-(s>0?8:0),lid,8,SKD,'#8a9ca8','#3d4b55',1);
  box(cx-HW-4,lid-12,HW*2+8,14,'#76858f','#3d4b55',1);
  box(cx-30,lid-80,60,68,'#b7c3ca','#5b666e',1);
  // pump
  box(cx+40,lid-38,40,26,'#e8a33a','#8a5a1a',1);ln([cx+60,lid-38,cx+60,lid-70,cx+96,lid-70],'#e8a33a',4);
  if(pump>0)alphaDo(pump,()=>{for(let k=0;k<6;k++){const q=(TT*.8+k/6)%1;circ(cx+100+q*70,lid-70-q*30,2.6,'rgba(200,235,245,.85)');}
   arrow(cx+104,lid-74,cx+170,lid-104,'#7dc8dc',2.4);});
  // outside pressure arrows on the lid, smaller inside arrows
  const pd=seg(u,.26,.34);
  if(pd>0)alphaDo(pd,()=>{for(let i=0;i<5;i++){const x=cx-HW+22+i*(HW*2-44)/4;if(Math.abs(x-cx)<38)continue;arrow(x,lid-62,x,lid-16,'#ff9d7a',3);}
   for(let i=0;i<4;i++){const x=cx-HW+40+i*(HW*2-80)/3;arrow(x,lid+56,x,lid+30,'rgba(125,255,196,.85)',2);}});
  const pf=seg(u,.5,.58);
  if(pf>0)alphaDo(pf,()=>{arrow(cx-HW-40,lid-40,cx-HW-40,lid+80,'#f2c230',6);});
  ctx.restore();
  alphaDo(pd,()=>{tag(cx-HW-6,Math.max(lid-70,242),'外部水壓',{bg:'#ff9d7a',size:14,align:'right'});tag(cx,lid+84,'桶內壓力較低',{bg:'#7dffc4',size:14,align:'center'});});
  alphaDo(pf,()=>tag(cx-HW-54,lid+110,'向下推力',{bg:'#f2c230',size:14,align:'right'}));
  alphaDo(pump,()=>tag(cx+110,lid-120,'抽水泵',{bg:'#e8a33a',size:14,align:'center'}));
  alphaDo(sp,()=>tag(cx,lid+SKD+44,'滲流降低尖端阻力',{bg:'#58b8d0',size:14,align:'center'}));
  // depth readout
  wt(X1-16,SL+34,trf('貫入 {n} m',{n:(p/SKD*9).toFixed(1)}),18,'#13232e',700,'right',COND);
  // right: numbers
  card(820,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(844,190,'壓力差產生的下壓力（示例）',20,'#fff',700);
  alphaDo(seg(u,.3,.36),()=>{card(844,214,672,92,{bg:'rgba(242,194,48,.08)',st:'rgba(242,194,48,.5)',r:6});
   wt(1180,274,'F = ΔP × A',38,'#f2c230',700,'center',COND);});
  const V=[['吸力桶直徑','12 m',.36],['頂蓋面積 A','約 113 m²',.4],['負壓 ΔP','100 kPa',.44]];
  V.forEach((v,i)=>{const a=seg(u,v[2],v[2]+.05);if(a<=0)return;alphaDo(a,()=>{const y=330+i*58;
   card(844,y,672,46,{bg:'rgba(255,255,255,.04)',r:6});wt(866,y+30,v[0],17,'#fff',500);wt(1496,y+31,v[1],22,'#f2c230',700,'right',COND);});});
  const r2=seg(u,.52,.62);if(r2>0)alphaDo(seg(u,.52,.56),()=>{box(844,524,672,1,'rgba(255,255,255,.14)');
   wt(866,568,'額外下壓力',18,'rgba(227,236,238,.85)',600);wt(1496,572,trf('約 {n} kN',{n:Math.round(11300*ease(r2)).toLocaleString('en-US')}),32,'#7dffc4',700,'right',COND);
   wt(1496,616,'≈ '+Math.round(1150*ease(r2)).toLocaleString('en-US')+' t',26,'#7dffc4',700,'right',COND);});
  alphaDo(seg(u,.74,.8),()=>{circ(860,670,5,'#58b8d0');wrap25(876,676,'砂土：向上的滲流讓尖端阻力變小',620,17,'#fff',600,24);});
  alphaDo(seg(u,.82,.88),()=>{circ(860,730,5,'#b37cff');wrap25(876,736,'黏土：透水性低，主要靠壓力差推入',620,17,'#fff',600,24);});
 }},
/* 3 */{t:'抽水、調平到設計深度',en:'Pumping and levelling to depth',dur:13,side:true,
 d:'三個吸力桶各有自己的抽水泵，由船上的控制室分別調整負壓。如果某一個桶下得比較快，整座套管就會傾斜，這時降低那個桶的負壓、加大其他桶的負壓，邊貫入邊調平。頂蓋接近海床、裙板全部插入後停止抽水，關閉頂蓋閥門，並移除抽水泵。套管的垂直度通常要控制在約 0.5 度以內（典型範例），之後才能安裝轉接段與風機。',
 s:[[0,'三個桶各有抽水泵，分別調整負壓'],[.3,'某個桶下得快，套管就會傾斜'],[.5,'調整各桶負壓，邊貫入邊調平'],[.8,'裙板全部插入，停止抽水並移除抽水泵']],
 cam:u=>camMix({x:TX+10,y:BED25-70,s:1.75},{x:TX+10,y:BED25-110,s:1.5},ease(seg(u,.82,.96))),
 draw(u){
  const base=12+(SK25-14)*ease(seg(u,.08,.82)),d=5*band(u,.3,.62)*(1-seg(u,.5,.64));
  const yl=LID0+base+d,yr=LID0+base-d,pump=1-seg(u,.86,.94);
  const J=sbj25(TX,yl,yr,{pump});
  school(TX-260,600,6,4,TT,24,1);
  lab(TX+BX25+16,yr-12,'抽水泵',{dx:90,dy:-40,a:band(u,.02,.3)*pump,st:'s'});
  lab(TX-BX25,yl+SK25/2,'桶內負壓',{dx:-110,dy:-20,a:band(u,.06,.3),st:'g'});
  lab(TX-BX25,yl+8,'下得較快',{dx:-100,dy:-40,a:band(u,.32,.56),st:'w'});
  lab(TX,(yl+yr)/2-140,'調整各桶負壓',{dx:-120,dy:-30,a:band(u,.5,.78),st:'s'});
  lab(TX+BX25,yr+SK25-4,'裙板全部插入',{dx:90,dy:30,a:band(u,.8,1),st:'g'});
 },
 hud(u){hudPanel(240,150,'負壓貫入（示例）',seg(u,.04,.1),w=>{
  const base=12+(SK25-14)*ease(seg(u,.08,.82)),d=band(u,.3,.62)*(1-seg(u,.5,.64));
  const kpa=u>.86?0:Math.round(lerp(20,120,ease(seg(u,.08,.8))));
  hrow(52,'桶內負壓',kpa+' kPa',w,'#f2c230');
  hrow(80,'貫入深度',(base/SK25*9).toFixed(1)+' m',w);hbar(14,88,w-28,base/SK25,'#7dffc4');
  const tl=.08+.6*d;hrow(118,'傾斜',tl.toFixed(2)+'°',w,tl>.5?'#e8572a':'#7dffc4');
  hrow(142,'狀態',u>.86?'完成':u>.3&&u<.64?'調平中':'貫入中',w,u>.86?'#7dffc4':'rgba(227,236,238,.85)');});}},
/* 4 */{t:'適用地層與風險',en:'Where it works and what can go wrong',dur:13,
 d:'吸力桶最適合均質的砂土與黏土，彰化外海以砂、粉土為主的海床就是適用的條件。砂黏互層的地層，負壓與阻力會一層一層改變，需要仔細評估；遇到礫石、孤石或岩盤，裙板插不進去，甚至會變形。負壓也不能無限加大：桶內土壤可能被吸高形成土塞，砂土的滲流太強還會發生管湧，讓桶內外連通而失去密封。反過來，除役時把水打回桶內，就能把整座基礎拔出來。',
 s:[[0,'均質的砂土與黏土最適合吸力桶'],[.3,'礫石、孤石或岩盤會讓裙板插不進去'],[.52,'負壓太大時，可能出現土塞隆起或管湧'],[.76,'除役時反向打水，可以把整座基礎拔出']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'適用地層',20,'#fff',700);
  const S=[['砂土與黏土','適用：可順利貫入','#7dffc4',.04,0],['砂黏互層','需詳細評估：阻力逐層變化','#f2c230',.16,1],['礫石、孤石、岩盤','不適用：裙板插不進或變形','#e8572a',.3,2]];
  S.forEach((s,i)=>{const a=seg(u,s[3],s[3]+.06);if(a<=0)return;alphaDo(a,()=>{const y=216+i*190;
   card(84,y,672,170,{bg:'rgba(255,255,255,.03)',st:s[2],r:6});
   // soil swatch
   const sx=104,sw=200,sy=y+60,sh=96;
   if(s[4]===0)box(sx,sy,sw,sh,'#d9c393');
   else if(s[4]===1){for(let k=0;k<4;k++)box(sx,sy+k*sh/4,sw,sh/4,k%2?'#a4876a':'#d9c393');}
   else{box(sx,sy,sw,sh,'#b9a47c');const r=rng(77);for(let k=0;k<16;k++)circ(sx+10+r()*(sw-20),sy+10+r()*(sh-20),5+r()*7,'#7c7470','#5d5652',1);}
   box(sx,sy-30,sw,30,'rgba(59,147,187,.35)');
   // mini bucket
   const pen=s[4]===2?8:s[4]===1?52:62,bx=sx+sw/2,bw=70,bh=64,ly=sy-bh+pen;
   box(bx-bw/2,ly,6,bh,'#8a9ca8');box(bx+bw/2-6,ly,6,bh,'#8a9ca8');box(bx-bw/2-3,ly-6,bw+6,8,'#76858f');
   if(s[4]===2)alphaDo(seg(u,.36,.42),()=>tag(bx,sy+18,'卡住',{bg:'#e8572a',fg:'#fff',size:13,align:'center'}));
   wt(330,y+48,s[0],20,s[2],800);
   wrap25(330,y+92,s[1],400,17,'#fff',600,24);});});
  // right: risks
  card(820,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(844,190,'負壓過大的風險',20,'#fff',700);
  const R=[['土塞隆起','桶內土壤被吸高，到不了設計深度',.52],['管湧','滲流太強，桶內外連通而失去密封',.6]];
  R.forEach((r,i)=>{const a=seg(u,r[2],r[2]+.06);if(a<=0)return;alphaDo(a,()=>{const y=214+i*104;
   card(844,y,672,90,{bg:'rgba(232,87,42,.08)',st:'rgba(232,87,42,.5)',r:6});
   wt(878,y+54,String(i+1),26,'#e8572a',700,'center',COND);wt(906,y+38,r[0],19,'#ff9d7a',700);wrap25(906,y+68,r[1],590,16,'#fff',500,22);});});
  alphaDo(seg(u,.68,.74),()=>tag(1180,450,'負壓要控制在臨界值以下',{bg:'#7dffc4',size:16,align:'center'}));
  // decommissioning mini animation
  const da=seg(u,.76,.82);if(da>0)alphaDo(da,()=>{box(844,486,672,1,'rgba(255,255,255,.14)');
   wt(844,522,'除役：反向打水拔出',19,'#f2c230',700);
   const sx=880,sw=340,sl=700;box(sx,560,sw,sl-560,'rgba(59,147,187,.3)');box(sx,sl,sw,80,'#d9c393');ln([sx,sl,sx+sw,sl],'#a98a58',2);
   const lift=70*ease(seg(u,.84,1)),bx=sx+sw/2,bw=110,bh=64,ly=sl-bh+64-lift;
   ctx.save();ctx.beginPath();ctx.rect(sx,550,sw,230);ctx.clip();
   box(bx-bw/2,ly,7,bh,'#8a9ca8');box(bx+bw/2-7,ly,7,bh,'#8a9ca8');box(bx-bw/2-3,ly-7,bw+6,9,'#76858f');ln([bx,ly-7,bx,550],'#b7c3ca',8);
   for(let k=0;k<3;k++){const q=(TT*.9+k/3)%1;arrow(bx-30+k*30,ly+6+q*20,bx-30+k*30,ly+22+q*20,'#7dc8dc',2);}
   ctx.restore();
   wrap25(1250,600,'把海水打回桶內，桶內壓力升高',270,16,'#fff',600,22);
   wrap25(1250,690,'整座基礎可以拔出，海床幾乎不留結構',270,16,'#7dffc4',600,22);});
 }},
/* 5 */{t:'重力式基礎：靠重量站穩',en:'Gravity-based foundations',dur:14,side:true,
 d:'重力式基礎（GBF）是一座巨大的鋼筋混凝土沉箱，不插進海床，而是靠自重與壓艙物抵抗風浪的傾倒力。海床要先挖除軟弱表土、鋪上整平的碎石墊層。沉箱是空心的，可以浮在水上由拖船拖到現場，再往艙內注水慢慢沉到墊層上，之後把海水換成砂或碎石，最後在周圍拋石防止淘刷。法國 Fécamp 風場的重力式基礎底部直徑約 31 公尺、空重約 5,000 公噸。',
 s:[[0,'海床先鋪好整平的碎石墊層'],[.16,'空心的混凝土沉箱浮在水上，由拖船拖到現場'],[.34,'往艙內注水，沉箱慢慢沉到墊層上'],[.64,'海水換成砂，基礎更重更穩'],[.86,'周圍拋石，防止海流淘刷']],
 cam:u=>({x:760,y:500,s:1.12}),
 draw(u){
  // gravel bed
  for(const g of GRAV25)circ(g.x,GBED25+4,g.r,g.c<.5?'#8f8a80':'#a59f93');
  box(GX25-GW25-24,GBED25,GW25*2+48,6,'#8f8a80');
  const gx=lerp(1080,GX25,ease(seg(u,.04,.3))),yb=gbfY(u);
  const water=ease(seg(u,.32,.62))*(1-ease(seg(u,.64,.84))),sand=ease(seg(u,.64,.84));
  // tug and towline
  const ta=1-seg(u,.32,.4);
  if(ta>0){const tx=gx-150;vsl(tx,130,true,{a:ta},vWorkboat);alphaDo(ta,()=>ln([tx-4,SEA-6,gx-20,SEA+2],'rgba(30,30,30,.8)',1));}
  gbf25(gx,yb,water,sand);
  // filling hose
  if(u>.32&&u<.86)alphaDo(band(u,.32,.84),()=>{ln([gx+20,yb-GH25+10,gx+40,yb-GH25-30],'#e8a33a',3);});
  // scour protection
  const sc=seg(u,.86,.98);
  if(sc>0)for(const s of STONE25){const a=clamp(sc*1.6-s.k*.6);if(a<=0)continue;const y=lerp(SEA+40,bedY(s.x)-s.r*.6,ease(a));circ(s.x,y,s.r,s.c<.5?'#7c7470':'#958d86');}
  school(GX25+300,620,7,6,TT,28,-1);
  lab(GX25+GW25,GBED25+2,'碎石墊層',{dx:90,dy:30,a:band(u,0,.18),st:'s'});
  lab(gx-150,SEA-14,'拖船',{dx:-60,dy:-50,a:band(u,.12,.32)});
  lab(gx,yb-GH25+60,'混凝土沉箱',{dx:100,dy:-40,a:band(u,.12,.4),st:'s'});
  lab(gx-GW25+30,yb-12,'注入海水壓艙',{dx:-110,dy:-50,a:band(u,.36,.62),st:'g'});
  lab(gx-GW25+30,yb-12,'換成砂壓艙',{dx:-110,dy:-50,a:band(u,.66,.86),st:'s'});
  lab(GX25+GW25+40,bedY(GX25+GW25+40)-6,'拋石保護',{dx:90,dy:-40,a:band(u,.88,1),st:'g'});
 },
 hud(u){hudPanel(240,130,'重力式基礎（示例）',seg(u,.04,.1),w=>{
  const water=ease(seg(u,.32,.62))*(1-ease(seg(u,.64,.84))),sand=ease(seg(u,.64,.84));
  hrow(52,'階段',u<.32?'拖航':u<.64?'注水下沉':u<.86?'砂置換':'拋石保護',w,'#f2c230');
  hrow(80,'壓艙物',sand>.02?trf('砂 {n}%',{n:Math.round(sand*100)}):trf('海水 {n}%',{n:Math.round(water*100)}),w,sand>.02?'#f2c230':'#7dc8dc');
  const tot=5000+water*4000+sand*9000;hrow(110,'總重',(Math.round(tot/100)*100).toLocaleString('en-US')+' t',w,'#7dffc4');});}},
/* 6 */{t:'四種固定式基礎比較',en:'Comparing four fixed foundations',dur:14,
 d:'單樁與打樁套管都要用液壓錘把鋼樁打進海床，技術成熟，但打樁噪音大，必須配合氣泡幕等減噪措施。吸力桶套管靠負壓貫入，幾乎沒有打樁噪音，除役時還能整座拔除，但只適合砂土與黏土。重力式基礎不需打樁，適合承載力較好的淺層地盤，不過需要大規模的海床整地與重型施工船。選擇哪一種，取決於水深、地層、噪音規範與施工資源。',
 s:[[0,'單樁與打樁套管靠液壓錘把樁打進海床'],[.3,'吸力桶套管靠負壓貫入，幾乎沒有打樁噪音'],[.55,'重力式基礎靠重量站穩，需要海床整地'],[.8,'依水深、地層、噪音與施工資源選擇']],
 draw(u){
  diagBG();
  card(60,150,1480,650,{bg:'rgba(7,27,39,.8)'});
  const C=[['單樁','#58b8d0',.02],['打樁套管','#7dc8dc',.1],['吸力桶套管','#f2c230',.3],['重力式','#b37cff',.55]];
  const RW=['固定方式','安裝噪音','適用地層','除役拆除','台灣案例'];
  const T=[['打樁貫入海床','高，需減噪措施','砂土、黏土，避開硬岩','切除至海床以下','雲林等風場'],
   ['預打基樁＋灌漿','高，需減噪措施','鬆軟地層也可，樁打得深','切除至海床以下','大彰化 1 & 2a'],
   ['負壓貫入吸力桶','低，幾乎無打樁噪音','砂土、黏土，不適合礫石岩盤','反向打水，整座拔除','大彰化 2b 及 4'],
   ['自重與壓艙物','低，不需打樁','承載力較好的淺層地盤','移除壓艙物後浮起','台灣尚未採用']];
  alphaDo(seg(u,.02,.06),()=>{RW.forEach((r,i)=>wt(84,284+i*96,r,17,'rgba(227,236,238,.75)',700));box(84,226,1432,1,'rgba(255,255,255,.18)');});
  C.forEach((c,ci)=>{const a=seg(u,c[2],c[2]+.06);if(a<=0)return;const x=280+ci*312,cx=x+150;
   const on=(ci===2&&u>=.3&&u<.55)||(ci===3&&u>=.55&&u<.8);
   alphaDo(a,()=>{if(on)card(x,164,300,560,{bg:'rgba(242,194,48,.07)',st:'#f2c230',r:6});
    wt(cx,206,c[0],20,c[1],800,'center');
    T[ci].forEach((t,ri)=>{const b=seg(u,c[2]+.02+ri*.02,c[2]+.06+ri*.02);alphaDo(b,()=>{wrap25(cx,284+ri*96,t,270,16,'#fff',500,22,'center');});
     if(ci===0)box(84,312+ri*96,1432,1,'rgba(255,255,255,.07)');});});});
  alphaDo(seg(u,.82,.88),()=>tag(800,736,'依水深、地層、噪音與施工資源選擇基礎',{bg:'#7dffc4',size:17,align:'center'}));
 }}
]};
