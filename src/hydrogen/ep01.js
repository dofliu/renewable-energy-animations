// KITS: land
/* 氫能系列 第 1 集：電解水產氫 */
const gyy=x=>groundY(x);
const SUN={x:1000,y:110};
const EX=560,EW=260,EH=112;                     // 電解槽貨櫃左緣、寬、高
const SPX=860,CPX=990,TBX=1110,TRK=1330;          // 分離純化、壓縮機、儲氫管束、管束拖車
const H2C='#7dffc4',O2C='#b37cff',WC='#58b8d0';   // 氫氣、氧氣、水的顏色
/* 沿折線 P（[[x,y],…]）取比例 f 的點 */
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1,p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
/* 小型風機（側視，葉片旋轉） */
function miniTurbine(x,h){const g=gyy(x),hy=g-h;poly([x-5,g,x-2.5,hy,x+2.5,hy,x+5,g],'#e3e8ec','rgba(0,0,0,.25)',1);box(x-4,hy-6,18,10,'#e3e8ec','rgba(0,0,0,.3)',1);
  for(let k=0;k<3;k++){const a=TT*1.4+k*TAU/3;ctx.save();ctx.translate(x,hy-1);ctx.rotate(a);poly([0,-2,62,-3,70,0,62,3,0,2],'#f4f6f7','rgba(0,0,0,.3)',1);ctx.restore();}circ(x,hy-1,4,'#c9d1d6');}
/* 電解槽貨櫃；open 0–1 為側牆透明度 */
function elecContainer(open){const x=EX,y=gyy(EX+EW/2),w=EW,h=EH;open=open||0;
  box(x,y-h,w,h,'#13232e');if(open>0)alphaDo(open,()=>elecInside(x,y));
  alphaDo(1-open*.88,()=>{box(x,y-h,w,h,'#e3e8ec');ctx.strokeStyle='rgba(0,0,0,.13)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<26;i++){const xx=x+w*i/26;ctx.moveTo(xx,y-h+4);ctx.lineTo(xx,y-4);}ctx.stroke();
   box(x+16,y-h+18,70,14,'#1f7f99');wt(x+51,y-h+28,'H₂',12,'#fff',700,'center',COND);});
  ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.5;ctx.strokeRect(x,y-h,w,h);box(x-4,y-h-4,w+8,5,'#aeb8be');
  box(x+30,y-h-30,10,26,'#8d989f');box(x+w-50,y-h-30,10,26,'#8d989f');
}
/* 貨櫃內部：整流器、電解槽堆、氫／氧氣液分離器、純水 */
function elecInside(x,y){const h=EH;box(x+2,y-h+2,EW-4,h-4,'#0e2a3b');
  box(x+8,y-h+12,36,h-20,'#44535c','rgba(255,255,255,.35)',1);for(let i=0;i<4;i++)box(x+13,y-h+22+i*18,26,8,'#2a3a46');
  box(x+56,y-58,96,42,'#8d989f','rgba(255,255,255,.4)',1);for(let i=0;i<22;i++)ln([x+60+i*4.2,y-56,x+60+i*4.2,y-18],i%2?'#3f6f96':'#c9d1d6',2);
  box(x+52,y-62,6,50,'#c9d1d6');box(x+150,y-62,6,50,'#c9d1d6');
  rrp(x+170,y-h+14,26,70,10);ctx.fillStyle='#3a5a4c';ctx.fill();rrp(x+204,y-h+14,26,70,10);ctx.fillStyle='#4b3a66';ctx.fill();
  box(x+168,y-24,64,16,'#1f5f7a','rgba(255,255,255,.3)',1);
  ln([x+104,y-58,x+104,y-h+8,x+183,y-h+8,x+183,y-h+14],'rgba(125,255,196,.8)',2);ln([x+130,y-58,x+130,y-h+4,x+217,y-h+4,x+217,y-h+14],'rgba(179,124,255,.8)',2);
}
/* 氫氣純化乾燥塔 */
function purifier(x){const g=gyy(x);for(let i=0;i<2;i++){rrp(x+i*34,g-104,26,100,12);ctx.fillStyle='#dfe5e8';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();}box(x-6,g-6,76,6,'#8d989f');}
/* 壓縮機橇 */
function compressor(x){const g=gyy(x);box(x,g-70,100,66,'#f2c230','rgba(0,0,0,.3)',1);box(x+10,g-60,40,34,'#d9ad2a');ring(x+74,g-40,16,'rgba(0,0,0,.35)',3);
  const a=TT*4;ln([x+74,g-40,x+74+12*Math.cos(a),g-40+12*Math.sin(a)],'rgba(0,0,0,.5)',2);box(x-4,g-6,108,6,'#6a747a');}
/* 儲氫管束（固定式高壓容器） */
function tubeBank(x){const g=gyy(x);box(x+10,g-100,6,100,'#6a747a');box(x+184,g-100,6,100,'#6a747a');
  for(let r=0;r<4;r++){rrp(x,g-96+r*22,200,18,9);ctx.fillStyle='#c9d1d6';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();}}
/* 管束拖車 */
function tubeTrailer(x){const g=gyy(x+100);ctx.save();ctx.translate(x,g);
  box(0,-18,176,8,'#2b3137');for(let r=0;r<3;r++){rrp(4,-70+r*17,168,15,7);ctx.fillStyle='#dfe5e8';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();}
  box(4,-72,10,56,'#1f7f99');box(180,-46,40,36,'#f4f6f7');box(190,-42,22,14,'#2a3a46');box(176,-12,48,4,'#2b3137');
  for(const wx of [22,48,74,200])circ(wx,-5,8,'#222','#555',2);ctx.restore();}
/* 管線 */
const PV2E=()=>[[300,gyy(300)-30],[EX-20,gyy(300)-30],[EX-20,gyy(EX)-EH+30],[EX,gyy(EX)-EH+30]];
const WT2E=()=>[[420,gyy(420)-150],[420,gyy(420)-20],[EX-20,gyy(420)-20]];
const E2S=()=>[[EX+EW/2-80,gyy(EX)-EH],[EX+EW/2-80,gyy(EX)-EH-40],[SPX+13,gyy(EX)-EH-40],[SPX+13,gyy(SPX)-104]];
const S2C=()=>[[SPX+47,gyy(SPX)-104],[SPX+47,gyy(SPX)-124],[CPX+50,gyy(SPX)-124],[CPX+50,gyy(CPX)-70]];
const C2T=()=>[[CPX+100,gyy(CPX)-40],[TBX,gyy(TBX)-40]];
const T2K=()=>[[TBX+200,gyy(TBX)-80],[TRK+10,gyy(TBX)-80],[TRK+10,gyy(TRK+100)-72]];
function pipes(){[E2S(),S2C(),C2T(),T2K()].forEach(P=>pathLine2(P,'rgba(60,70,78,.6)',3));}
function plantDraw(truckX){
  fence(520,1560,gyy(1000)+4);
  for(let i=0;i<5;i++)solarPanel(70+i*50,gyy(80+i*50),46,22,{h:30,glint:true});
  miniTurbine(430,190);
  ln([PV2E()[0][0],PV2E()[0][1],PV2E()[1][0],PV2E()[1][1],PV2E()[2][0],PV2E()[2][1],PV2E()[3][0],PV2E()[3][1]],'rgba(40,50,58,.5)',2);
  pipes();elecContainer(0);purifier(SPX);compressor(CPX);tubeBank(TBX);tubeTrailer(truckX===undefined?TRK:truckX);
  const wy=gyy(EX)-20;ln([EX+EW,wy,EX+EW+20,wy],WC,3);
}
/* 路徑轉 pathLine 用的平坦陣列 */
function pathLine2(P,col,lw){const a=[];P.forEach(p=>a.push(p[0],p[1]));ln(a,col,lw);}

const EP={no:1,slug:'hydrogen',seriesName:'氫能系列',t:'電解水產氫',en:'Making hydrogen by splitting water',
lede:'氫氣燃燒或用在燃料電池時只產生水，但它在地球上幾乎都藏在水和天然氣裡。這一集走進一座電解產氫場，看電如何把水拆成氫和氧，比較鹼性與 PEM 兩種電解槽，算一算一公斤氫要多少度電，並說明綠氫、灰氫的差別，以及氫氣如何壓縮儲存。',
facts:[['1.23','V','電解水的理論最低電壓；實際電解槽運轉約 1.8–2.0 V'],
['39.4','kWh','產生 1 公斤氫的理論最低耗電（以高熱值計）'],
['約 50–55','kWh','目前電解槽系統產生 1 公斤氫的典型耗電（示例）'],
['約 9','公斤','產生 1 公斤氫理論上需要的水量'],
['10–12','kg CO₂e','天然氣重組製造 1 公斤灰氫的排放（IEA）'],
['9–12','%','台灣 2050 淨零路徑中，氫能發電在電力配比的占比']],
note:'說明：本集為教育用途示意動畫，設備外觀與比例經過調整。電解電壓（1.23 V、1.48 V）為 25°C 標準狀態的熱力學值；鹼性與 PEM 電解槽的運轉電壓、電流密度與耗電為文獻常見範圍的典型範例；灰氫排放取自 IEA《Global Hydrogen Review 2024》；台灣電網電力排碳係數取經濟部能源署公告 113 年度 0.474 公斤 CO₂e/度；氫能占比取自國家發展委員會「臺灣 2050 淨零排放路徑」。產氫場配置、功率與儲存壓力為示意情境，實際數值依各案場設計而定。',
base:()=>{landSky(GY,{sun:SUN,clouds:false});drawGround();},
shots:[
{t:'一座綠氫產氫場',en:'A green hydrogen plant',dur:12,side:true,
 d:'氫是宇宙中最多的元素，但在地球上很少以氫氣單獨存在，大多和氧結合成水，或和碳結合成天然氣。電解產氫場的做法是用電把水拆開：太陽光電或風機送來的電進入電解槽，產出的氫氣經過分離、純化與乾燥，再由壓縮機打進高壓儲氫容器，最後用管束拖車或管線送到工廠、加氫站與電廠。若用的是再生能源電力，產出的就稱為綠氫。',
 s:[[0,'太陽光電與風機送來的電，進入電解槽'],[.28,'電解槽把水拆成氫氣與氧氣'],[.52,'氫氣經過純化乾燥，再進入壓縮機'],[.76,'高壓氫氣裝上管束拖車送出']],
 cam:u=>camMix({x:800,y:450,s:1},{x:860,y:470,s:1.1},ease(seg(u,.1,.5))),
 draw(u){
  plantDraw();
  flowDots(PV2E(),6,'#f2c230',band(u,.02,1),.5);flowDots(WT2E(),5,'#f2c230',band(u,.02,1),.5);
  flowDots(E2S(),6,H2C,seg(u,.28,.34),.35);flowDots(S2C(),6,H2C,seg(u,.52,.58),.35);flowDots(C2T(),3,H2C,seg(u,.56,.62),.35);flowDots(T2K(),4,H2C,seg(u,.76,.82),.35);
  lab(180,gyy(180)-34,'太陽光電',{dx:0,dy:-80,st:'s',a:band(u,.02,.3)});
  lab(430,gyy(430)-190,'風機',{dx:60,dy:-30,st:'s',a:band(u,.02,.3)});
  lab(EX+EW/2,gyy(EX)-EH,'電解槽',{dx:0,dy:-120,st:'s',a:band(u,.26,.55)});
  lab(SPX+30,gyy(SPX)-104,'純化乾燥',{dx:-10,dy:-90,a:band(u,.5,.75)});
  lab(CPX+50,gyy(CPX)-70,'壓縮機',{dx:40,dy:-110,a:band(u,.52,.78)});
  lab(TRK+90,gyy(TRK)-72,'管束拖車',{dx:-30,dy:-90,st:'g',a:band(u,.76,1)});
 },
 hud(u){hudPanel(240,150,'產氫場（示例）',seg(u,.05,.1),w=>{const p=10*ease(seg(u,.05,.3)),k=seg(u,.28,.4);
  hrow(56,'電力',p.toFixed(1)+' MW',w,'#f2c230');hrow(88,'產氫',Math.round(192*k*p/10)+' kg/h',w,H2C);hrow(120,'狀態',k>.5?'產氫中':'啟動',w,'#fff');});}},

{t:'用電把水拆開',en:'Splitting water with electricity',dur:14,
 d:'電解槽裡有兩片電極泡在水中，接上直流電後，負極（陰極）產生氫氣，正極（陽極）產生氧氣。反應式是 2H₂O → 2H₂ + O₂，所以氫氣的體積是氧氣的兩倍。拆開水分子需要能量：理論上電壓至少要 1.23 伏特；若連反應吸收的熱也由電供應，要 1.48 伏特。實際電解槽還要克服電極反應的過電位與電阻損失，一般運轉在 1.8 到 2.0 伏特，多出來的部分會變成熱。',
 s:[[0,'兩片電極泡在水中，接上直流電'],[.25,'電壓超過 1.23 V，電極開始冒出氣泡'],[.48,'負極產生氫氣，正極產生氧氣，體積 2 比 1'],[.72,'實際運轉約 1.8–2.0 V，多出的電壓變成熱']],
 draw(u){
  diagBG();
  const V=u<.72?lerp(0,1.5,ease(seg(u,.05,.45))):lerp(1.5,1.9,ease(seg(u,.72,.82)));
  const on=clamp((V-1.23)/.1),K=on*(V>1.5?1.6:1);
  card(60,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'電解槽（示意）',20,'#f2c230',700);
  /* 電源 */
  box(330,230,180,70,'#1c3144','#c9d1d6',2);wt(420,276,trf('{v} V',{v:V.toFixed(2)}),32,V>=1.23?'#f2c230':'#fff',700,'center',COND);
  ln([330,265,220,265,220,380],'#ff9d7a',3);ln([510,265,620,265,620,380],'#7dc8dc',3);
  wt(214,252,'−',26,'#7dc8dc',700,'center');wt(626,252,'+',26,'#ff9d7a',700,'center');
  /* 水槽 */
  box(150,380,540,360,'rgba(88,184,208,.18)');ln([150,380,150,740,690,740,690,380],'#c9d1d6',3);box(150,420,540,2,'rgba(125,200,220,.6)');
  box(206,370,28,330,'#8d989f');box(606,370,28,330,'#8d989f');
  ctx.setLineDash([6,6]);ln([420,430,420,736],'rgba(227,236,238,.45)',2);ctx.setLineDash([]);
  /* 氣泡 */
  const R=rng(5),B=[];for(let i=0;i<40;i++)B.push([R(),R(),R()]);
  if(K>0)B.forEach(([a,b,c],i)=>{const hy=i<27,xx=hy?240+a*70:540+a*60,sp=.35+c*.3,p=(TT*sp*K+b)%1,yy=lerp(700,425,p);if(!hy&&i%3===0)return;
   alphaDo(on*(p<.95?1:0),()=>circ(xx+6*Math.sin(p*8+i),yy,hy?5:7,'rgba(255,255,255,.1)',hy?H2C:O2C,2));});
  alphaDo(on,()=>{wt(270,790-20,'H₂ 氫氣',22,H2C,700,'center');wt(570,790-20,'O₂ 氧氣',22,O2C,700,'center');});
  wt(220,360,'陰極',17,'rgba(227,236,238,.9)',600,'center');wt(620,360,'陽極',17,'rgba(227,236,238,.9)',600,'center');
  /* 右：反應式與電壓階梯 */
  alphaDo(seg(u,.45,.52),()=>{card(820,160,720,170,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});wt(844,200,'反應式',20,'#f2c230',700);
   wt(1180,268,'2H₂O  →  2H₂  +  O₂',40,'#fff',700,'center');wt(1180,312,'氫氣體積是氧氣的 2 倍',18,'rgba(227,236,238,.85)',500,'center');});
  const c=chartBox(820,360,720,440,{title:'電解電壓',x0:0,x1:1,y0:0,y1:2.2,xt:[],yt:[0,1,2],yl:'V',pt:56,pb:30,pl:60,pr:20,gx:1,gy:2});
  const L=[[1.23,'理論最低電壓','#7dffc4',.2],[1.48,'熱中性電壓（反應熱也由電供應）','#7dc8dc',.35],[1.9,'實際運轉約 1.8–2.0 V','#f2c230',.72]];
  L.forEach(([v,n,col,t0])=>alphaDo(seg(u,t0,t0+.06),()=>{ctx.setLineDash([6,5]);ln([c.px,c.Y(v),c.px+c.pw,c.Y(v)],col,2);ctx.setLineDash([]);wt(c.px+70,c.Y(v)-10,n,17,col,700,'left');wt(c.px+14,c.Y(v)-10,v.toFixed(2),17,col,700,'left',COND);}));
  box(c.X(.7),c.Y(V),c.X(.9)-c.X(.7),c.Y(0)-c.Y(V),V>=1.23?'rgba(242,194,48,.75)':'rgba(227,236,238,.4)');
  alphaDo(seg(u,.78,.84),()=>{box(c.X(.7),c.Y(1.9),c.X(.9)-c.X(.7),c.Y(1.48)-c.Y(1.9),'rgba(255,138,96,.9)');wt(c.X(.8),c.Y(1.69)+6,'損失 → 熱',17,'#fff',700,'center');});
 }},

{t:'鹼性與 PEM 電解槽',en:'Alkaline vs PEM electrolysers',dur:14,
 d:'目前商業化最多的是兩種電解槽。鹼性電解槽用濃度約 30% 的氫氧化鉀溶液當電解質，兩極之間用隔膜分開，由氫氧根離子（OH⁻）在溶液中移動；技術成熟、不需貴金屬，單位成本較低。質子交換膜（PEM）電解槽用純水和一片固態高分子膜，氫離子（H⁺）穿過膜到陰極；電流密度可達鹼性的數倍，設備較小巧，功率升降也快，適合搭配變動的風光電力，但需要鉑與銥等貴金屬觸媒。',
 s:[[0,'鹼性電解槽：氫氧化鉀溶液與隔膜'],[.25,'氫氧根離子從陰極移向陽極'],[.5,'PEM 電解槽：純水與固態質子交換膜'],[.72,'氫離子穿過膜，反應快，適合搭配風光']],
 draw(u){
  diagBG();
  const cellFig=(x,kind,a)=>{alphaDo(a,()=>{const y=250,w=640,h=280,pem=kind==='pem';
   box(x,y,w,h,pem?'rgba(125,200,220,.12)':'rgba(88,184,208,.22)','#c9d1d6',2);
   box(x+40,y+10,34,h-20,'#8d989f');box(x+w-74,y+10,34,h-20,'#8d989f');
   wt(x+57,y-14,'陰極 −',17,'#7dc8dc',700,'center');wt(x+w-57,y-14,'陽極 +',17,'#ff9d7a',700,'center');
   if(pem){box(x+w/2-10,y+10,20,h-20,'#e3d27a');box(x+w/2-16,y+10,6,h-20,'#5c6770');box(x+w/2+10,y+10,6,h-20,'#5c6770');}
   else{ctx.setLineDash([8,6]);ln([x+w/2,y+10,x+w/2,y+h-10],'rgba(227,236,238,.8)',3);ctx.setLineDash([]);}
   const R=rng(pem?9:3);for(let i=0;i<14;i++){const p=(TT*(.35+R()*.3)+R())%1,yy=lerp(y+h-20,y+20,p);circ(x+90+R()*60,yy,5,'rgba(255,255,255,.1)',H2C,2);if(i%2)circ(x+w-150+R()*60,yy,6,'rgba(255,255,255,.1)',O2C,2);}
   const ion=pem?'H⁺':'OH⁻',dir=pem?-1:1,mv=seg(u,pem?.55:.25,pem?.62:.32);
   for(let k=0;k<3;k++){const f=((TT*.28)+k/3)%1,xx=dir>0?lerp(x+120,x+w-130,f):lerp(x+w-130,x+120,f),yy=y+80+k*62;
    alphaDo(mv,()=>{circ(xx,yy,17,pem?'#f2c230':'#58b8d0');wt(xx,yy+1,ion,15,'#0e2a3b',700,'center',COND,'middle');});}
   alphaDo(mv,()=>arrow(dir>0?x+250:x+w-250,y+h+28,dir>0?x+w-250:x+250,y+h+28,pem?'#f2c230':'#58b8d0',3));
   wt(x+w/2,y+h+62,pem?'固態質子交換膜':'氫氧化鉀溶液＋隔膜',17,'rgba(227,236,238,.9)',600,'center');});};
  const a1=seg(u,.02,.08),a2=seg(u,.48,.54);
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)',st:a1>.5&&u<.48?'rgba(242,194,48,.55)':undefined});wt(84,196,'鹼性電解槽（AWE）',22,'#f2c230',700);
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)',st:a2>.5?'rgba(242,194,48,.55)':undefined});wt(844,196,'PEM 電解槽',22,a2>.5?'#f2c230':'rgba(227,236,238,.7)',700);
  cellFig(100,'awe',a1);cellFig(860,'pem',a2);
  const P1=[['電解質：約 30% 氫氧化鉀','#fff'],['電流密度約 0.2–0.4 A/cm²','#fff'],['技術成熟、不需貴金屬','#7dffc4']];
  const P2=[['電解質：純水＋高分子膜','#fff'],['電流密度約 1–2 A/cm²','#fff'],['功率升降快，需要鉑與銥','#7dffc4']];
  P1.forEach(([t,c],i)=>alphaDo(seg(u,.3+i*.05,.35+i*.05),()=>wt(100,672+i*38,t,19,c,600)));
  P2.forEach(([t,c],i)=>alphaDo(seg(u,.66+i*.05,.71+i*.05),()=>wt(860,672+i*38,t,19,c,600)));
 }},

{t:'打開電解槽貨櫃',en:'Inside an electrolyser container',dur:12,side:true,
 d:'一套電解產氫系統不只有電解槽。電網或再生能源的交流電先經過整流器變成直流電，送進由數十到數百片電解單元疊成的電解槽堆。產出的氫氣和氧氣各自帶著水，先進入氣液分離器，把水分回收再利用；氫氣接著通過純化與乾燥設備，去除微量氧氣和水氣，純度可達 99.97% 以上，符合燃料電池車的要求。系統還需要純水設備與冷卻系統，把電解產生的熱帶走。',
 s:[[0,'打開貨櫃：整流器、電解槽堆與分離器'],[.3,'整流器把交流電變成直流電'],[.5,'氫氣和氧氣分別進入氣液分離器'],[.72,'水回收再用，氫氣再經純化與乾燥']],
 cam:u=>camMix({x:800,y:450,s:1},{x:EX+EW/2+20,y:gyy(EX+EW/2)-EH/2-10,s:2.7},ease(seg(u,.02,.25))),
 draw(u){
  const op=ease(seg(u,.12,.3));
  fence(520,1560,gyy(1000)+4);pipes();purifier(SPX);compressor(CPX);tubeBank(TBX);
  for(let i=0;i<5;i++)solarPanel(70+i*50,gyy(80+i*50),46,22,{h:30});
  elecContainer(op);
  const x=EX,y=gyy(EX+EW/2);
  if(op>.5){const dc=[[x+44,y-60],[x+56,y-60]];flowDots(dc,2,'#f2c230',seg(u,.3,.36),.6,2.5);
   const hP=[[x+104,y-58],[x+104,y-EH+8],[x+183,y-EH+8],[x+183,y-EH+14]],oP=[[x+130,y-58],[x+130,y-EH+4],[x+217,y-EH+4],[x+217,y-EH+14]];
   flowDots(hP,5,H2C,seg(u,.48,.54),.4,2.4);flowDots(oP,4,O2C,seg(u,.48,.54),.4,2.4);
   const wb=[[x+200,y-26],[x+100,y-26]];flowDots(wb,3,WC,seg(u,.7,.76),.4,2.2);}
  lab(x+26,y-EH/2,'整流器',{dx:-60,dy:-80,st:'s',a:band(u,.24,.55)});
  lab(x+104,y-38,'電解槽堆',{dx:-40,dy:90,st:'s',a:band(u,.2,1)});
  lab(x+183,y-EH+40,'氫氣分離器',{dx:-20,dy:-110,st:'g',a:band(u,.48,1)});
  lab(x+217,y-EH+50,'氧氣分離器',{dx:70,dy:-50,a:band(u,.5,1)});
  lab(x+200,y-16,'純水',{dx:70,dy:60,a:band(u,.7,1)});
 },
 hud(u){hudPanel(240,150,'電解槽（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.28,.5));
  hrow(56,'單元電壓',(1.9*k).toFixed(2)+' V',w,'#f2c230');hrow(88,'溫度',Math.round(lerp(25,70,ease(seg(u,.3,.9))))+'°C',w,'#ff9d7a');hrow(120,'氫氣純度',k>.9&&u>.72?'99.97%':'—',w,H2C);});}},

{t:'一公斤氫要多少電',en:'How much electricity per kilogram',dur:13,
 d:'一公斤氫氣蘊含約 39.4 度電的能量（高熱值），這也是電解水產生一公斤氫的理論最低耗電。實際的電解槽系統還有過電位、電阻、整流與輔助設備的損失，目前典型耗電約 50 到 55 度，系統效率約七到八成；若要壓縮到加氫站使用的高壓，還要再加幾度電。同時也需要水：理論上每公斤氫約 9 公斤水，實際還要考慮純水處理的損耗。一公斤氫大約可讓一輛燃料電池車行駛 100 公里（示例）。',
 s:[[0,'一公斤氫的能量約 39.4 度電'],[.3,'實際電解還有損失，約 50–55 度'],[.55,'理論上還需要約 9 公斤的水'],[.75,'一公斤氫約可讓燃料電池車跑 100 公里']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,860,640,{title:'產生 1 公斤氫的耗電（示例）',x0:0,x1:4,y0:0,y1:70,xt:[],yt:[0,20,40,60],yl:'kWh',pt:70,pb:70,pl:70,gx:1,gy:3});
  const bw=c.X(.7)-c.X(0);
  const bar=(i,v0,v1,col,t0,t1,n,val)=>{const k=ease(seg(u,t0,t1));if(k<=0)return;const x=c.X(.35+i*1.2),v=lerp(v0,v0+(v1-v0),k);
   box(x,c.Y(v),bw,c.Y(v0)-c.Y(v),col);alphaDo(seg(u,t1-.02,t1+.04),()=>{wt(x+bw/2,c.Y(v1)-14,val,26,'#fff',700,'center',COND);wt(x+bw/2,c.py+c.ph+34,n,18,'rgba(227,236,238,.9)',600,'center');});};
  bar(0,0,39.4,'#7dffc4',.02,.2,'理論最低','39.4');
  bar(1,0,39.4,'rgba(125,255,196,.45)',.28,.36,'電解槽系統','');bar(1,39.4,52,'#ff8a60',.34,.46,'電解槽系統','約 52');
  bar(2,0,52,'rgba(125,255,196,.45)',.5,.56,'＋壓縮','');bar(2,52,55,'#f2c230',.54,.62,'＋壓縮','約 55');
  alphaDo(seg(u,.44,.5),()=>{wt(c.X(1.55)+bw+12,c.Y(46)+6,'損失',18,'#ff9d7a',700,'left');});
  alphaDo(seg(u,.3,.36),()=>{ctx.setLineDash([5,5]);ln([c.px,c.Y(39.4),c.px+c.pw,c.Y(39.4)],'rgba(125,255,196,.6)',1.5);ctx.setLineDash([]);});
  /* 右：換算卡 */
  const R=[['一公斤氫的體積','約 11 m³','常壓 0°C 時，約一個小房間',.08,'#7dc8dc'],['系統效率','約 75%','39.4 ÷ 52（示例）',.44,'#ff9d7a'],['需要的水','約 9 kg','每公斤氫的理論需水量',.55,'#58b8d0'],['燃料電池車','約 100 km','一公斤氫可行駛的距離（示例）',.75,'#7dffc4']];
  R.forEach(([t,v,s,t0,col],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=160+i*162;card(960,y,580,146,{bg:'rgba(7,27,39,.75)'});wt(990,y+42,t,19,'rgba(227,236,238,.9)',600);wt(990,y+100,v,40,col,700,'left',COND);wt(1510,y+100,s,16,'rgba(227,236,238,.8)',500,'right');}));
  /* 水滴計數 */
  const wk=seg(u,.55,.72);if(wk>0){const n=Math.round(9*wk);for(let i=0;i<9;i++)alphaDo(i<n?1:.2,()=>circ(1215+i*20,160+2*162+42-6,7,'#58b8d0'));}
 }},

{t:'灰氫、藍氫與綠氫',en:'Grey, blue and green hydrogen',dur:13,
 d:'氫氣本身沒有顏色，「灰、藍、綠」指的是製造方式與碳排放。目前世界上大部分的氫來自天然氣蒸汽重組，每產生一公斤氫約排放 10 到 12 公斤二氧化碳當量，稱為灰氫；台灣現有的氫氣也有九成以上來自天然氣重組。若把重組產生的二氧化碳捕捉封存，就是藍氫。用再生能源電解水產生的是綠氫。要注意電力來源：若以台灣電網平均電力電解，每公斤氫的間接排放約 25 公斤，反而比灰氫高。',
 s:[[0,'氫氣本身沒有顏色，顏色代表製造方式'],[.25,'灰氫：天然氣重組，每公斤排放 10–12 公斤'],[.5,'藍氫：重組並捕捉封存二氧化碳'],[.72,'綠氫：再生能源電解，排放接近零']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,900,640,{title:'每公斤氫的碳排放（示例）',x0:0,x1:30,y0:0,y1:4,xt:[0,10,20,30],yt:[],xl:'kg CO₂e / kg H₂',pt:70,pb:64,pl:200,gx:3,gy:0});
  const B=[['灰氫',11,'#8d989f','天然氣重組',.12,'10–12'],['藍氫',3,'#58b8d0','重組＋碳捕捉',.42,'約 1–4'],['綠氫',.5,'#7dffc4','再生能源電解',.66,'接近 0'],['電網電解',24.6,'#ff8a60','台灣電網平均電力',.8,'約 25']];
  B.forEach(([n,v,col,s,t0,val],i)=>{const k=ease(seg(u,t0,t0+.1));if(k<=0)return;const y=c.Y(3.5-i),h=70;
   alphaDo(seg(u,t0,t0+.04),()=>{wt(c.px-20,y-6,n,22,col,700,'right');wt(c.px-20,y+22,s,15,'rgba(227,236,238,.8)',500,'right');});
   box(c.X(0),y-h/2,Math.max(4,c.X(v*k)-c.X(0)),h,col);
   alphaDo(seg(u,t0+.08,t0+.12),()=>wt(c.X(v)+14,y+8,val,26,'#fff',700,'left',COND));});
  /* 右：說明卡 */
  const C=[['灰氫','CH₄ + 2H₂O → CO₂ + 4H₂','二氧化碳直接排放','#8d989f',.12],['藍氫','捕捉 CO₂ 並封存於地下','捕捉率決定排放','#58b8d0',.42],['綠氫','再生能源電力電解水','只產生氧氣','#7dffc4',.66]];
  C.forEach(([n,a,b,col,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=160+i*170;card(1000,y,540,150,{bg:'rgba(7,27,39,.75)'});box(1000,y,8,150,col);
   wt(1030,y+44,n,22,col,700);wt(1030,y+88,a,19,'#fff',600);wt(1030,y+124,b,17,'rgba(227,236,238,.85)',500);}));
  alphaDo(seg(u,.8,.86),()=>{card(1000,672,540,128,{bg:'rgba(232,87,42,.14)',st:'rgba(232,87,42,.6)'});wt(1030,716,'電力來源決定顏色',20,'#ff9d7a',700);wt(1030,756,'電網 0.474 kg/度 × 52 度 ≈ 25 kg',18,'#fff',600);});
 }},

{t:'壓縮與儲存',en:'Compression and storage',dur:13,side:true,
 d:'氫氣是最輕的氣體，常壓下一公斤就有約 11 立方公尺，必須壓縮才方便儲存與運輸。電解槽出口壓力通常只有數十巴，壓縮機再把氫氣加壓到約 200 巴以上，存進固定式儲氫管束，或灌進管束拖車運到用戶。燃料電池車的車載氣瓶則用 350 或 700 巴。另一種方式是冷卻到 −253°C 成為液氫，或轉成氨等化學載體，後續集數會再介紹。',
 s:[[0,'電解槽出口的氫氣只有數十巴'],[.3,'壓縮機把氫氣加壓到約 200 巴'],[.55,'存進儲氫管束，再灌進管束拖車'],[.78,'拖車把高壓氫氣送到工廠與加氫站']],
 cam:u=>camMix({x:1060,y:460,s:1.5},{x:1180,y:470,s:1.3},ease(seg(u,.6,.95))),
 draw(u){
  const tx=TRK+ease(seg(u,.82,1))*420;
  plantDraw(tx);
  flowDots(E2S(),6,H2C,band(u,0,1),.35);flowDots(S2C(),6,H2C,band(u,0,.8),.35);
  flowDots(C2T(),3,H2C,band(u,.3,.8),.5,5.5);flowDots(T2K(),4,H2C,band(u,.55,.8),.4,5.5);
  lab(SPX+47,gyy(SPX)-124,'約 30 bar',{dx:-30,dy:-70,st:'g',a:band(u,.02,.35)});
  lab(CPX+50,gyy(CPX)-70,'壓縮機',{dx:0,dy:-100,st:'s',a:band(u,.28,.6)});
  lab(TBX+100,gyy(TBX)-100,'儲氫管束',{dx:0,dy:-80,a:band(u,.5,.8)});
  lab(tx+90,gyy(tx+100)-72,'管束拖車',{dx:20,dy:-90,st:'g',a:band(u,.6,1)});
 },
 hud(u){hudPanel(240,170,'壓縮與儲存（示例）',seg(u,.05,.1),w=>{const p=lerp(30,200,ease(seg(u,.3,.75))),m=Math.round(300*ease(seg(u,.55,.82)));
  hrow(56,'壓力',Math.round(p)+' bar',w,'#f2c230');hrow(88,'拖車裝載',m+' kg',w,H2C);hbar(14,100,w-28,m/300,H2C);hrow(136,'狀態',u>.82?'出車':'充填中',w,'#fff');});}}
]};
