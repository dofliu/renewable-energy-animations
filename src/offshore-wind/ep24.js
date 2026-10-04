// KITS: marine
/* ================= EP24 腐蝕防護與陰極保護 ================= */
/* complete fixed-bottom turbine at cx (monopile + TP + tower + nacelle + rotor) */
function turb24(cx,ang){
  const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);
  drawNacelle(cx,TW_TOP,0,true);drawRotor(cx-44,TW_TOP-20,ang,3);
}
function far24(x,s,ang){const h=150*s,hx=x,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([hx,hy,hx+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(hx,hy,3*s,'#eef2f4');}
/* text wrapped to a width (after translation) */
function wrap24(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
const PB24=bedY(TX); // seabed at the monopile
const HW24=PILE_W/2;
/* exposure zones beside the pile (world y, exaggerated) */
const ZN24=[
 {n:'大氣區',a:236,b:420,c:'125,200,220',p:'塗層',t:.1},
 {n:'飛濺區',a:420,b:458,c:'232,87,42',p:'厚塗層＋腐蝕裕度',t:.24},
 {n:'潮差區',a:458,b:488,c:'242,194,48',p:'塗層＋部分陰極保護',t:.38},
 {n:'全浸區',a:488,b:PB24,c:'88,184,208',p:'塗層＋陰極保護',t:.52},
 {n:'埋入區',a:PB24,b:PB24+50,c:'179,124,255',p:'陰極保護',t:.66}];
/* sacrificial anode on stand-off (side view); rem 0–1 remaining; d=+1 right side */
function anode24(x,y,rem,d){
  const w=4+5*rem;box(d>0?x:x-6,y-2,6,4,'#6b7780');
  box(d>0?x+6:x-6-w,y-16,w,32,rem>.6?'#c9d1d5':'#8f9aa2','#5b666e',.8);
  if(rem<.6)for(let i=0;i<4;i++)circ(x+d*(6+w/2)+((i%2)-.5)*2,y-10+i*7,1,'#4d5962');
}
/* rust spots on the submerged pile (fixed layout) */
const RUST24=(()=>{const r=rng(241),a=[];for(let i=0;i<70;i++)a.push({x:TX+(r()*2-1)*(HW24-3),y:500+r()*(PB24-510),r:1.5+r()*3.5,k:r()});return a;})();
function rust24(f){if(f<=0)return;for(const s of RUST24){const g=clamp(f*1.4-s.k*.4);if(g<=0)continue;circ(s.x,s.y,s.r*g,`rgba(176,92,44,${.85*g})`);}}
/* ionic current dots: from anode (ax,ay) through water to the pile face */
function flow24(ax,ay,d,k0,a){
  alphaDo(a,()=>{for(let k=0;k<6;k++){const off=(k-2.5)*22,q=(TT*.5+k/6+k0)%1;
   const P0={x:ax+d*12,y:ay},P1={x:ax+d*70,y:ay+off*.8},P2={x:TX+d*HW24,y:ay+off};
   const x=(1-q)*(1-q)*P0.x+2*(1-q)*q*P1.x+q*q*P2.x,y=(1-q)*(1-q)*P0.y+2*(1-q)*q*P1.y+q*q*P2.y;
   circ(x,y,1.8,'#7dffc4');}});
}
/* corrosion profile (typical unprotected steel, mm/yr) vs zone index */
const PROF24=[[0,.06],[.55,.09],[.7,.33],[.78,.36],[.86,.16],[.9,.1],[.95,.17],[1.05,.1],[1.5,.1],[1.6,.03],[2,.02]];
const profAt=v=>{for(let i=0;i<PROF24.length-1;i++){const a=PROF24[i],b=PROF24[i+1];if(v<=b[0])return lerp(a[1],b[1],(v-a[0])/(b[0]-a[0]));}return .02;};
/* current demand (A) of the example pile: area 754 m², DNV-RP-B401 tropical 0–30 m */
const AREA24=754;
const jb24=t=>.100+.050*Math.exp(-t/2);
const fc24=t=>.02+.012*t;

const EP={no:24,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'腐蝕防護與陰極保護',en:'Corrosion protection and cathodic protection',
lede:'鋼鐵泡在溫暖、含鹽、充滿氧氣的海裡，是腐蝕最嚴重的環境之一。這一集從設計的角度，看離岸風機基礎怎麼依高度分成不同的腐蝕區，各用什麼塗層與腐蝕裕度，再說明犧牲陽極與外加電流兩種陰極保護的原理、保護電流怎麼估算，以及完工後如何監測電位，與第 30、31 集的檢查與維修接在一起。',
facts:[['0.3','mm/年','飛濺區未保護鋼材的典型腐蝕速率（典型範例）'],['≥ 1,000','μm','飛濺區塗層的典型總膜厚（NORSOK M-501 系統 7A，塗料廠資料）'],['0.150','A/m²','熱帶海水（> 20 °C）0–30 m 裸鋼的初期設計電流密度（DNV-RP-B401）'],['2,000','Ah/kg','鋁合金陽極在海水中的設計電化學容量（DNV-RP-B401）'],['−0.80 ～ −1.10','V','鋼材的保護電位範圍（相對 Ag/AgCl）：太正會腐蝕，太負有氫脆風險'],['約 1.1','t','直徑 8 m 單樁浸水外表面 25 年所需的鋁陽極重量（示例）']],
note:'說明：本集為教育用途示意動畫，尺寸、高度與各腐蝕區的範圍經過誇大。腐蝕區的劃分與各區防護方式參考 DNV-RP-0416、ISO 12944-9；塗層膜厚依 NORSOK M-501 系統（大氣區約 280 μm 以上、全浸區約 350 μm 以上、飛濺區約 1,000 μm 以上，依塗料廠技術文件）。設計電流密度、塗層破損係數（第 III 類 a=0.02、b=0.012）、陽極容量與利用率依 DNV-RP-B401。飛濺區腐蝕速率 0.3 mm/年為文獻常用的典型值；各區腐蝕速率曲線、塗層壽命、腐蝕裕度、單樁直徑與水深、整流器輸出與電位讀數皆為典型範例，實際依風場設計與驗證機構審查而定，不代表特定風場。',
shots:[
/* 1 */{t:'一座基礎，五個腐蝕區',en:'One foundation, five corrosion zones',dur:13,side:true,
 d:'同一根鋼管從海面上一路插進海床，各段遇到的環境完全不同，設計時依高度分成幾個腐蝕區。大氣區受鹽霧與日照；飛濺區被浪花反覆打濕又曬乾；潮差區隨潮汐一下泡水一下露出；全浸區一直泡在海水裡；埋入區則插在海床泥砂中。台灣海峽中部的潮差可達約 4 公尺，飛濺區的範圍也跟著變寬。每一區的主要防護方式都不一樣。',
 s:[[0,'同一根鋼管，從空氣、浪花一路插進海床'],[.24,'飛濺區被浪花反覆打濕又曬乾'],[.46,'潮差區與全浸區泡在海水裡，可以用陰極保護'],[.7,'每一區依環境選擇不同的防護方式']],
 cam:u=>camMix({x:800,y:450,s:1},{x:TX-40,y:500,s:1.4},ease(seg(u,.02,.16))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[1100,.45,1.7],[1300,.4,2.6]])far24(x,s,TT*.9+p);
  turb24(TX,TT*.6);
  school(TX-260,620,8,6,TT,30,1);
 },
 fx(u){
  const x0=TX+HW24+6,x1=TX+260;
  ZN24.forEach((z,i)=>{const a=seg(u,z.t,z.t+.05);if(a<=0)return;const on=u>=z.t&&(i===4||u<ZN24[i+1].t);
   alphaDo(a,()=>{box(x0,z.a,x1-x0,z.b-z.a,`rgba(${z.c},${on?.32:.16})`);ln([x0,z.a,x1,z.a],`rgba(${z.c},.8)`,1);
    tag(x0+12,(z.a+z.b)/2,z.n,{size:13,bg:on?'#f2c230':'rgba(7,27,39,.85)',fg:on?'#13232e':'#fff'});});});
  alphaDo(seg(u,.36,.42),()=>{ctx.setLineDash([5,4]);
   ln([TX-140,458,TX-HW24-4,458],'rgba(255,255,255,.8)',1.2);ln([TX-140,488,TX-HW24-4,488],'rgba(255,255,255,.8)',1.2);ctx.setLineDash([]);
   tag(TX-142,458,'最高潮位',{size:12,align:'right',bg:'rgba(7,27,39,.8)',fg:'#fff'});tag(TX-142,488,'最低潮位',{size:12,align:'right',bg:'rgba(7,27,39,.8)',fg:'#fff'});});
 },
 hud(u){hudPanel(250,130,'各區主要防護',seg(u,.08,.14),w=>{
  let z=ZN24[0];for(const q of ZN24)if(u>=q.t)z=q;
  hrow(52,'目前區域',z.n,w,'#f2c230');
  htext(14,84,'主要防護',12,'rgba(227,236,238,.78)');
  htext(w-14,112,z.p,15,'#7dffc4',700,undefined,'right');});}},
/* 2 */{t:'飛濺區為什麼最嚴重',en:'Why the splash zone is the worst',dur:13,
 d:'把未保護鋼材在不同高度的腐蝕速率畫出來，最高的峰值落在飛濺區。這裡乾濕交替、氧氣充足，浪花帶來的鹽分不斷累積，波浪與漂流物還會撞傷塗層；它又不是一直泡在水裡，陰極保護的電流到不了。所以飛濺區除了最厚的塗層，還要把鋼板加厚當作腐蝕裕度：例如塗層 10 年後失效，剩下 15 年以每年 0.3 毫米計，就要多留約 4.5 毫米（示例）。',
 s:[[0,'未保護鋼材的腐蝕速率，峰值落在飛濺區'],[.3,'乾濕交替、氧氣充足，塗層又容易被撞傷'],[.55,'不常泡在水中，陰極保護的電流到不了'],[.76,'所以鋼板要加厚，預留腐蝕裕度']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'未保護鋼材的腐蝕速率（典型範例）',20,'#fff',700);
  const PX=330,PW=400,TOP=240,BOT=740,X=v=>PX+PW*v/.4,Y=v=>lerp(TOP,BOT,v/2);
  const Z=[[0,.62,'大氣區','125,200,220'],[.62,.9,'飛濺區','232,87,42'],[.9,1.05,'潮差區','242,194,48'],[1.05,1.58,'全浸區','88,184,208'],[1.58,2,'埋入區','179,124,255']];
  Z.forEach((z,i)=>alphaDo(seg(u,.02+i*.02,.06+i*.02),()=>{box(96,Y(z[0]),210,Y(z[1])-Y(z[0]),`rgba(${z[3]},.22)`);ln([96,Y(z[0]),PX+PW,Y(z[0])],'rgba(255,255,255,.1)',1);
   wt(118,(Y(z[0])+Y(z[1]))/2+6,z[2],17,'#fff',700);}));
  alphaDo(seg(u,.04,.1),()=>{ln([PX,TOP,PX,BOT,PX+PW,BOT],'rgba(255,255,255,.5)',1.4);
   [0,.1,.2,.3,.4].forEach(v=>{wt(X(v),BOT+22,v.toFixed(1),15,'rgba(227,236,238,.75)',600,'center',COND);if(v)ln([X(v),TOP,X(v),BOT],'rgba(255,255,255,.08)',1);});
   wt(PX+PW,BOT+46,'mm/年',15,'rgba(227,236,238,.7)',500,'right',COND);});
  const g=ease(seg(u,.08,.34)),P=[];for(let v=0;v<=2*g;v+=.01)P.push({x:X(profAt(v)),y:Y(v)});
  pathLine(P,'#ff9d7a',3.4);
  if(g>.42)alphaDo(seg(u,.3,.36),()=>{circ(X(.36),Y(.78),6,'#e8572a');tag(X(.36)-12,Y(.78)-24,'峰值約 0.3 mm/年以上',{bg:'#e8572a',fg:'#fff',size:13,align:'right'});});
  // right: reasons
  card(820,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(844,190,'飛濺區的三個不利條件',20,'#fff',700);
  const R=[['乾濕交替、氧氣充足，鹽分不斷累積',.3],['波浪與漂流物撞擊，塗層容易受損',.42],['不常泡在水中，陰極保護電流到不了',.55]];
  R.forEach((r,i)=>{const a=seg(u,r[1],r[1]+.05);if(a<=0)return;alphaDo(a,()=>{const y=218+i*86;
   card(844,y,672,70,{bg:'rgba(232,87,42,.08)',st:'rgba(232,87,42,.5)',r:6});
   wt(878,y+44,String(i+1),24,'#e8572a',700,'center',COND);wrap24(906,y+43,r[0],590,18,'#fff',500,24);});});
  const c=seg(u,.74,.8);if(c>0)alphaDo(c,()=>{box(844,488,672,1,'rgba(255,255,255,.14)');
   wt(844,530,'腐蝕裕度（示例）',19,'#f2c230',700);
   wt(1180,600,'0.3 mm/年 × 15 年',30,'#fff',700,'center',COND);
   wrap24(1180,636,'設計壽命 25 年，塗層 10 年後失效',600,15,'rgba(227,236,238,.75)',500,22,'center');
   wt(1180,722,'+ '+(4.5*ease(seg(u,.78,.9))).toFixed(1)+' mm',44,'#7dffc4',700,'center',COND);
   wt(1180,764,'鋼板加厚',16,'rgba(227,236,238,.8)',600,'center');});
 }},
/* 3 */{t:'分區塗層系統',en:'Coating systems by zone',dur:13,
 d:'塗層是第一道防線，把鋼材和海水、氧氣隔開。各區使用不同的塗層系統，離岸常依 NORSOK M-501 與 ISO 12944-9 選用。大氣區常用富鋅底漆、環氧中塗與耐候的聚氨酯面漆，總膜厚約 280 微米以上；飛濺區用玻璃鱗片環氧等厚膜塗層，常達 1,000 微米以上；全浸區用環氧系統，約 350 微米以上，並和陰極保護一起作用，所以塗層還要能抵抗陰極剝離。',
 s:[[0,'塗層把鋼材和海水、氧氣隔開，是第一道防線'],[.3,'大氣區：富鋅底漆、環氧中塗、聚氨酯面漆'],[.55,'飛濺區：玻璃鱗片環氧厚膜，約 1,000 μm 以上'],[.78,'全浸區：環氧塗層，搭配陰極保護']],
 draw(u){
  diagBG();
  const C=[
   {x:60,n:'大氣區',col:'#7dc8dc',std:'NORSOK 系統 1',t:.06,tot:280,foot:'面漆耐紫外線',
    L:[['富鋅環氧底漆',60,'#8f9aa2'],['環氧中塗',160,'#c9b98f'],['聚氨酯面漆',60,'#e3ecee']]},
   {x:570,n:'飛濺區',col:'#e8572a',std:'NORSOK 系統 7A',t:.36,tot:1000,foot:'再加腐蝕裕度',
    L:[['玻璃鱗片環氧（第 1 道）',500,'#6f8f8a'],['玻璃鱗片環氧（第 2 道）',500,'#8fb0a8']]},
   {x:1080,n:'全浸區',col:'#58b8d0',std:'NORSOK 系統 7B',t:.62,tot:350,foot:'搭配陰極保護',
    L:[['環氧塗層（第 1 道）',175,'#6b8796'],['環氧塗層（第 2 道）',175,'#8aa6b4']]}];
  const BASE=730,K=.4;
  C.forEach((c,ci)=>{const a=seg(u,c.t,c.t+.05);if(a<=0)return;const on=u>=c.t&&(ci===2||u<C[ci+1].t);
   alphaDo(a,()=>{
    card(c.x,150,460,650,{bg:on?'rgba(242,194,48,.07)':'rgba(7,27,39,.8)',st:on?'#f2c230':'rgba(255,255,255,.16)'});
    box(c.x+24,170,6,40,c.col);wt(c.x+42,198,c.n,24,c.col,800);
    wt(c.x+42,226,c.std,15,'rgba(227,236,238,.7)',600);
    // steel substrate
    box(c.x+30,BASE,170,40,'#5b666e');ln([c.x+30,BASE,c.x+200,BASE],'#8a99a3',1.4);wt(c.x+115,BASE+27,'鋼材',14,'#fff',700,'center');
    // layers grow
    let y=BASE,acc=0;const g=seg(u,c.t+.02,c.t+.2);
    c.L.forEach((l,i)=>{const f=clamp(g*c.L.length-i);if(f<=0)return;const h=l[1]*K*ease(f);y-=h;acc+=l[1]*ease(f);box(c.x+30,y,170,h,l[2]);ln([c.x+30,y,c.x+200,y],'rgba(0,0,0,.25)',1);
     alphaDo(f,()=>{const ly=300+i*76;box(c.x+222,ly-14,14,14,l[2]);const n=wrap24(c.x+244,ly,l[0],196,15,'#fff',600,20);
      wt(c.x+244,ly+n*20+4,l[1]+' μm',15,'rgba(227,236,238,.75)',600,'left',COND);});});
    wt(c.x+330,640,Math.round(acc)+' μm',40,'#f2c230',700,'center',COND);
    wt(c.x+330,672,'總膜厚（約）',14,'rgba(227,236,238,.75)',600,'center');
    alphaDo(seg(u,c.t+.18,c.t+.22),()=>tag(c.x+330,712,c.foot,{bg:ci===1?'#e8572a':ci===2?'#7dffc4':'#f2c230',fg:ci===1?'#fff':undefined,size:14,align:'center'}));});});
 }},
/* 4 */{t:'犧牲陽極如何保護鋼材',en:'How sacrificial anodes protect steel',dur:14,side:true,
 d:'鋼材在海水中腐蝕，是因為鐵失去電子變成離子。如果把一塊比鋼更「活潑」的鋁合金接在鋼材上，鋁會搶先失去電子，電流經由海水流回鋼材表面，讓鋼材變成陰極而不再腐蝕，這就是犧牲陽極的陰極保護。鋁合金陽極在海水中的電位約 −1.05 V，能把鋼材拉到 −0.80 V 以下。陽極在工廠就焊在樁上或轉接段的支架上，隨年份慢慢消耗，設計時要讓它撐滿整個壽命。',
 s:[[0,'沒有保護時，鋼材失去電子而生鏽'],[.26,'接上比鋼更活潑的鋁合金陽極'],[.48,'保護電流經海水流回鋼材，鋼材變成陰極'],[.72,'陽極逐年消耗，設計時要撐滿整個壽命']],
 cam:u=>({x:TX-50,y:612,s:2.4}),
 draw(u){
  turb24(TX,TT*.6);
  rust24(seg(u,.02,.24)*(1-seg(u,.5,.62)));
  const on=seg(u,.26,.34),rem=1-.82*ease(seg(u,.66,.96));
  if(on>0)alphaDo(on,()=>{for(const y of [560,650]){anode24(TX+HW24,y,rem,1);anode24(TX-HW24,y,rem,-1);}});
  const cur=seg(u,.44,.52);
  if(cur>0)for(const y of [560,650]){flow24(TX+HW24+10,y,1,0,cur);flow24(TX-HW24-10,y,-1,.5,cur);}
  // electrons through the metal: small dots along the stand-off
  if(cur>0)alphaDo(cur*.9,()=>{for(const y of [560,650])for(let k=0;k<3;k++){const q=(TT*.9+k/3)%1;circ(TX+HW24+10-q*10,y,1.4,'#f2c230');circ(TX-HW24-10+q*10,y,1.4,'#f2c230');}});
  school(TX+230,560,6,4,TT,24,-1);
  lab(TX,600,'鋼材生鏽（失去電子）',{dx:-120,dy:-40,a:band(u,.04,.26),st:'w'});
  lab(TX+HW24+12,560,'鋁合金陽極',{dx:90,dy:-40,a:band(u,.28,.5),st:'s'});
  lab(TX+70,610,'保護電流（經海水）',{dx:100,dy:30,a:band(u,.48,.72),st:'g'});
  lab(TX-HW24,640,'鋼材成為陰極',{dx:-110,dy:30,a:band(u,.52,.74),st:'g'});
  lab(TX+HW24+12,650,'陽極逐年消耗',{dx:90,dy:40,a:band(u,.74,1),st:'s'});
 },
 hud(u){hudPanel(240,150,'陰極保護（示例）',seg(u,.04,.1),w=>{
  const v=u<.3?-0.62:lerp(-0.62,-0.98,ease(seg(u,.44,.62))),ok=v<-0.8;
  hrow(52,'鋼材電位',v.toFixed(2)+' V',w,ok?'#7dffc4':'#e8572a');
  hbar(14,60,w-28,clamp((-v-0.55)/0.5),ok?'#7dffc4':'#e8572a');
  const yr=Math.round(25*seg(u,.66,.96));
  hrow(92,'運轉年數',trf('{n} 年',{n:yr}),w);
  hrow(118,'陽極剩餘',u<.26?'—':Math.round(100-82*ease(seg(u,.66,.96)))+'%',w,'#f2c230');
  hrow(142,'門檻','−0.80 V',w);});}},
/* 5 */{t:'保護電流要多少',en:'How much current is needed',dur:13,
 d:'陽極要放多少，先要算出整個壽命需要多少保護電流。裸鋼需要的電流等於面積乘以設計電流密度，台灣海域水溫高，依 DNV-RP-B401 熱帶海水 0–30 m 的初期值為每平方公尺 0.150 安培。有塗層時只有破損的部分需要電流，用塗層破損係數表示，會隨年份增加。以直徑 8 公尺、水深 30 公尺的單樁浸水外表面約 754 平方公尺為例，平均只需約 9 安培，25 年約 1.1 公噸鋁陽極（示例）。',
 s:[[0,'保護電流等於面積乘以設計電流密度'],[.3,'裸鋼需要上百安培，有塗層時少很多'],[.55,'塗層逐年破損，需要的電流慢慢增加'],[.78,'平均約 9 A，25 年約需 1.1 t 鋁陽極（示例）']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,900,650,{x0:0,x1:25,y0:0,y1:120,xt:[0,5,10,15,20,25],yt:[0,30,60,90,120],yl:'保護電流（A）',pt:96,pb:70,pl:80,pr:30,gx:5,gy:4});
  wt(84,190,'單樁浸水外表面所需電流（示例）',20,'#fff',700);
  wt(c.px+c.pw,c.py+c.ph+52,'運轉年數',15,'rgba(227,236,238,.7)',500,'right');
  const gb=ease(seg(u,.06,.3)),gc=ease(seg(u,.32,.62));
  const Pb=[],Pc=[];for(let t=0;t<=25*gb;t+=.25)Pb.push({x:c.X(t),y:c.Y(AREA24*jb24(t))});
  for(let t=0;t<=25*gc;t+=.25)Pc.push({x:c.X(t),y:c.Y(AREA24*jb24(t)*fc24(t))});
  pathLine(Pb,'#ff9d7a',3);pathLine(Pc,'#7dffc4',3.4);
  if(gb>.1)alphaDo(seg(u,.1,.16),()=>tag(c.X(14),c.Y(92),'裸鋼（無塗層）',{bg:'#ff9d7a',size:14,align:'center'}));
  if(gc>.5)alphaDo(seg(u,.5,.56),()=>tag(c.X(17),c.Y(40),'有塗層：只有破損處需要電流',{bg:'#7dffc4',size:14,align:'center'}));
  alphaDo(seg(u,.04,.1),()=>{const L=[['裸鋼','#ff9d7a'],['有塗層','#7dffc4']];L.forEach((l,i)=>{const x=c.px+c.pw-260+i*130;ln([x,c.py-28,x+22,c.py-28],l[1],3);wt(x+28,c.py-23,l[0],14,'rgba(227,236,238,.9)',600);});});
  // right: numbers
  card(1000,150,540,650,{bg:'rgba(7,27,39,.8)'});wt(1024,190,'估算條件（示例）',20,'#fff',700);
  const V=[['浸水面積','754 m²',.14],['初期電流密度','0.150 A/m²',.2],['平均電流密度','0.070 A/m²',.26],['塗層破損係數','0.02 + 0.012 × 年',.36]];
  V.forEach((v,i)=>{const a=seg(u,v[2],v[2]+.05);if(a<=0)return;alphaDo(a,()=>{const y=214+i*64;
   card(1024,y,492,52,{bg:'rgba(255,255,255,.04)',r:6});wt(1044,y+33,v[0],16,'#fff',500);wt(1496,y+34,v[1],20,'#f2c230',700,'right',COND);});});
  const r=seg(u,.66,.76);if(r>0)alphaDo(seg(u,.66,.7),()=>{box(1024,490,492,1,'rgba(255,255,255,.14)');
   wt(1044,532,'平均保護電流',17,'rgba(227,236,238,.85)',600);wt(1496,536,(9*ease(r)).toFixed(1)+' A',32,'#7dffc4',700,'right',COND);
   wt(1044,592,'25 年鋁陽極重量',17,'rgba(227,236,238,.85)',600);wt(1496,600,(1.1*ease(seg(u,.72,.84))).toFixed(1)+' t',40,'#7dffc4',700,'right',COND);
   alphaDo(seg(u,.84,.9),()=>wrap24(1044,660,'若完全沒有塗層，平均約 53 A，需要約 6.4 t 陽極',472,16,'#ff9d7a',600,24));
   alphaDo(seg(u,.88,.94),()=>wrap24(1044,730,'塗層與陰極保護互相搭配，才能兼顧可靠與重量',472,15,'rgba(227,236,238,.75)',500,22));});
 }},
/* 6 */{t:'外加電流陰極保護',en:'Impressed current cathodic protection',dur:13,side:true,
 d:'另一種做法是外加電流陰極保護（ICCP）：在轉接段內裝一台整流器，把電流送到不太消耗的鈦基混合金屬氧化物陽極，再經海水流到鋼材。樁身上的固定參考電極持續量測電位，整流器依讀數自動調整輸出，把鋼材維持在保護範圍內。它的陽極輕、可以調整，國外已有不少風場採用；但必須有電才能保護，風機併網前要有臨時措施，電位也不能拉得太負，以免高強度鋼產生氫脆。',
 s:[[0,'轉接段內的整流器提供保護電流'],[.26,'電流經混合金屬氧化物陽極流進海水，再回到鋼材'],[.5,'參考電極量測電位，整流器自動調整輸出'],[.74,'電位不能太負，以免高強度鋼產生氫脆']],
 cam:u=>camMix({x:TX-60,y:520,s:1.7},{x:TX-30,y:600,s:2.1},ease(seg(u,.2,.4))),
 draw(u){
  turb24(TX,TT*.6);
  const RX=TX+HW24+2,RY=402;
  box(RX,RY,30,20,'#394650','#8a99a3',1);box(RX+4,RY+4,8,5,u>.12?'#7dffc4':'#555');box(RX+16,RY+4,10,2,'#f2c230');
  // supply cable down the pile to the anode
  const AX=TX+80,AY=640;
  ln([RX+22,RY+20,TX+HW24+3,RY+40,TX+HW24+3,AY-30,AX-8,AY],'#e8572a',1.8);
  box(AX-8,AY-2,8,4,'#6b7780');box(AX,AY-6,36,12,'#9aa3a8','#5b666e',.8);for(let i=0;i<5;i++)ln([AX+4+i*7,AY-6,AX+4+i*7,AY+6],'#5b666e',.6);
  // reference electrode on the other side, feedback cable
  const EX=TX-HW24-6,EY=600;
  ln([EX+2,EY,TX-HW24-3,EY-10,TX-HW24-3,RY+30,RX+4,RY+20],'rgba(125,255,196,.7)',1.2);
  box(EX-8,EY-5,10,10,'#f2c230');
  const cur=seg(u,.22,.32);
  if(cur>0)alphaDo(cur,()=>{for(let k=0;k<8;k++){const off=(k-3.5)*16,q=(TT*.55+k/8)%1;
   const P0={x:AX+36,y:AY},P1={x:AX+70,y:AY+off},P2={x:TX+HW24,y:AY-40+off*1.4};
   const x=(1-q)*(1-q)*P0.x+2*(1-q)*q*P1.x+q*q*P2.x,y=(1-q)*(1-q)*P0.y+2*(1-q)*q*P1.y+q*q*P2.y;circ(x,y,1.7,'#7dffc4');}});
  // feedback pulse
  if(u>.5&&u<.74)alphaDo(band(u,.5,.72),()=>{const q=(TT*.8)%1,y=lerp(EY,RY+30,q);circ(TX-HW24-3,y,2.6,'#7dffc4');});
  school(TX+240,700,6,4,TT,24,-1);
  lab(RX+15,RY,'整流器（轉接段內）',{dx:80,dy:-50,a:band(u,.04,.3),st:'s'});
  lab(AX+18,AY,'混合金屬氧化物陽極',{dx:70,dy:50,a:band(u,.26,.5),st:'s'});
  lab(EX-3,EY,'參考電極',{dx:-90,dy:-30,a:band(u,.48,.74),st:'g'});
  lab(TX+HW24,560,'保護電流',{dx:90,dy:-30,a:band(u,.3,.5),st:'g',minor:true});
  lab(TX,690,'太負：氫脆風險',{dx:-110,dy:20,a:band(u,.76,1),st:'w'});
 },
 hud(u){hudPanel(250,150,'外加電流（示例）',seg(u,.04,.1),w=>{
  const I=u<.22?0:lerp(6,14,ease(seg(u,.22,.4)))-lerp(0,4,ease(seg(u,.52,.7)));
  const v=u<.22?-0.62:lerp(-0.62,-1.04,ease(seg(u,.22,.44)))+lerp(0,.1,ease(seg(u,.52,.7)));
  const ok=v<-0.8&&v>-1.1;
  hrow(52,'輸出電流',I.toFixed(1)+' A',w,'#f2c230');
  hrow(80,'鋼材電位',v.toFixed(2)+' V',w,ok?'#7dffc4':'#e8572a');
  hbar(14,88,w-28,clamp((-v-0.55)/0.6),ok?'#7dffc4':'#e8572a');
  hrow(118,'控制範圍','−0.80 ～ −1.10 V',w);
  hrow(142,'模式',u<.5?'啟動':'自動調整',w,u<.5?'rgba(227,236,238,.8)':'#7dffc4');});}},
/* 7 */{t:'兩種方法與電位監測',en:'Comparing methods and monitoring',dur:13,
 d:'犧牲陽極不需要電源，安裝當天就開始保護，維護少，但陽極很重、無法調整；外加電流陽極輕、輸出可以調整，但要有電源、需要持續監看，並注意過度保護。不論哪一種，完工後都要監測。樁上的固定參考電極把電位傳回監控系統，再配合每年 ROV 或潛水員的現場量測（第 30 集）；若電位接近 −0.80 V 門檻，就加裝陽極或調整系統（第 31 集），讓保護撐過整個設計壽命。',
 s:[[0,'犧牲陽極：免電源、維護少，但重且無法調整'],[.3,'外加電流：輕、可調整，但要電源與持續監看'],[.55,'固定參考電極把電位傳回監控系統'],[.76,'每年現場量測，不足時加裝陽極或調整']],
 draw(u){
  diagBG();
  card(60,150,900,650,{bg:'rgba(7,27,39,.8)'});
  const CX=[300,630];
  alphaDo(seg(u,.02,.08),()=>{wt(84,198,'比較項目',17,'rgba(227,236,238,.7)',700);
   wt(CX[0]+150,198,'犧牲陽極',20,'#f2c230',800,'center');wt(CX[1]+150,198,'外加電流',20,'#7dc8dc',800,'center');
   box(84,216,852,1,'rgba(255,255,255,.18)');});
  const T=[['電源','不需要','需要整流器與供電'],['開始保護','安裝後立即','送電後才開始'],['重量','較重','較輕'],['調整','無法調整','可自動調整'],['維護','少，定期量測','需持續監看'],['過度保護','風險低','需設定上限']];
  T.forEach((r,i)=>{const a0=i<3?.06+i*.04:.3+(i-3)*.04,a=seg(u,a0,a0+.05);if(a<=0)return;alphaDo(a,()=>{const y=268+i*84;
   wt(84,y,r[0],17,'#fff',700);wrap24(CX[0]+150,y,r[1],300,17,'rgba(227,236,238,.9)',500,22,'center');wrap24(CX[1]+150,y,r[2],300,17,'rgba(227,236,238,.9)',500,22,'center');
   box(84,y+34,852,1,'rgba(255,255,255,.08)');});});
  // right: monitoring loop
  card(1000,150,540,650,{bg:'rgba(7,27,39,.8)'});wt(1024,190,'完工後的電位監測',20,'#fff',700);
  const M=[['固定參考電極','電位傳回監控系統',.55,'#7dffc4'],['每年現場量測','ROV 或潛水員（第 30 集）',.64,'#7dffc4'],['接近 −0.80 V 門檻','加裝陽極或調整（第 31 集）',.76,'#f2c230']];
  M.forEach((m,i)=>{const a=seg(u,m[2],m[2]+.05);if(a<=0)return;alphaDo(a,()=>{const y=222+i*150;
   card(1024,y,492,110,{bg:'rgba(255,255,255,.04)',st:m[3],r:6});circ(1060,y+55,14,m[3]);wt(1060,y+61,String(i+1),18,'#0e2a3b',700,'center',COND);
   wrap24(1092,y+46,m[0],400,19,'#fff',700,24);wrap24(1092,y+80,m[1],400,15,'rgba(227,236,238,.8)',500,22);
   if(i<2)arrow(1270,y+114,1270,y+146,'rgba(227,236,238,.6)',2);});});
  alphaDo(seg(u,.88,.94),()=>tag(1270,724,'保護撐過整個設計壽命',{bg:'#7dffc4',size:17,align:'center'}));
 }}
]};
