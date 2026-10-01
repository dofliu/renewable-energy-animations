// KITS: marine
/* ================= EP21 離岸風場的除役 ================= */
/* cut line of the monopile: about 1 m below the seabed */
const CUT21=bedY(TX)+14;
/* foundation: pile + transition piece; after the cut, the upper part can be lifted by `lift` px */
function found21(cx,cut,lift){
  const yb=bedY(cx)+130,L=yb-PILE_TOP;
  if(!cut){drawPile(cx,yb,Math.PI/2,L,PILE_W);drawTP(cx,TP_BOT);return;}
  ctx.save();ctx.beginPath();ctx.rect(cx-60,CUT21,120,400);ctx.clip();drawPile(cx,yb,Math.PI/2,L,PILE_W);ctx.restore();
  ctx.save();ctx.translate(0,-lift);ctx.beginPath();ctx.rect(cx-120,-400,240,CUT21+400);ctx.clip();drawPile(cx,yb,Math.PI/2,L,PILE_W);drawTP(cx,TP_BOT);ctx.restore();
}
function tower21(cx,dy){for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS-(dy||0),k);}
/* scour protection rock around the foundation */
function scour21(cx){const r=rng(21);for(let i=0;i<70;i++){const dx=(r()-.5)*190,k=1-Math.abs(dx)/95;if(k<=0)continue;const x=cx+dx;circ(x,bedY(x)-r()*12*k,2.2+r()*2.4,i%3?'#8a949a':'#a7b0b5');}}
function far21(x,s,ang){const h=150*s,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([x,hy,x+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(x,hy,3*s,'#eef2f4');}
function oss21(){drawJacket(OX,bedOX,bedOX-SEA+20,true);drawTopside(OX,SEA-20,0);}
function cabPts21(x0,x1){const P=[];for(let x=x0;x<=x1;x+=6)P.push({x,y:bedY(x)+8});return P;}
/* array cable: full = up the J-tube at both ends; cut = left buried, ends at the foundation */
function cable21(full){
  if(full)drawCable([{x:TX+16,y:bedY(TX)-20},{x:TX+34,y:bedY(TX+34)+2}].concat(cabPts21(TX+40,OX-70)).concat([{x:OX-62,y:bedOX-15}]));
  else drawCable(cabPts21(TX+44,OX+200));
}
/* text wrapped to a width (after translation) */
function wrap21(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
function spark21(x,y,a,s){if(a<=0)return;alphaDo(a,()=>{const g=ctx.createRadialGradient(x,y,1,x,y,26*s);g.addColorStop(0,'rgba(255,240,180,.95)');g.addColorStop(1,'rgba(255,170,80,0)');ctx.fillStyle=g;ctx.fillRect(x-28*s,y-28*s,56*s,56*s);
  for(let i=0;i<8;i++){const an=i*TAU/8+TT*3,r=(8+7*Math.sin(TT*20+i))*s;ln([x,y,x+Math.cos(an)*r,y+Math.sin(an)*r],'rgba(255,230,140,.9)',1.2);}});}
/* rotor angle for shot 1: spins, then coasts to a Y-position stop (one blade up) */
function rotA21(u){const t=.4,w=11,a=u<t?w*u:w*(t+(1-Math.exp(-(u-t)*7))/7);const stop=w*(t+1/7),off=-Math.PI/2-stop;return a+off;}
const Y21=-Math.PI/2;
/* WTIV beside the turbine (shots 3) */
const WR=TX-70,WD=SEA-78,WLEG=bedY(WR-240)+6;
/* HLV for shot 4 (hull from HR-430 to HR) and crane pedestal */
const HR=TX-80,HCP={x:HR-60,y:SEA-36};
function flatRotor21(x,y,k){ctx.save();ctx.translate(x,y);ctx.scale(1,k);drawRotor(0,0,Y21,3);ctx.restore();}
function fishes21(cx,cy,n,seed){school(cx,cy,n,seed,TT,40,1,'rgba(200,225,235,.8)');}

const EP={no:21,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'離岸風場的除役',en:'Decommissioning an offshore wind farm',
lede:'離岸風機的設計壽命大約 20 到 25 年。走到終點時，風場可以延壽、換機，或是除役。這一集看除役怎麼做：把安裝的順序倒過來，先拆葉片與機艙，再吊走塔架，從樁內清淤後把單樁切在海床下約 1 公尺，最後決定海纜與拋石的去留、回收材料，並以掃測確認海域恢復安全。',
facts:[['20–25','年','離岸風機的典型設計壽命，屆滿前評估延壽、換機或除役'],['4,000','元/kW','台灣離岸風場使用海域時，除役保證金的計算基準（國產署）'],['1','m','單樁常見的切除深度：海床面以下約 1 公尺（典型）'],['85–90','%','風機總重量中目前可以回收的比例，難點在葉片複合材料'],['25','年','世界第一座離岸風場丹麥 Vindeby 的運轉年數，於 2017 年完成除役']],
note:'說明：本集為教育用途示意動畫，水平距離、水深與設備尺寸經過壓縮，作業時間大幅縮短。風機容量、運轉年數、各部件重量、材料比例、清淤深度、掃測覆蓋率等皆為典型範例，並非特定案場資料。除役保證金每瓩 4,000 元與分期繳納方式，依國有財產署「海域土地提供離岸式風力發電系統使用之處理方式」；單樁切除至海床下約 1 公尺、海纜與沖刷保護可經評估留置，參考 OSPAR 與英國離岸風場除役計畫的公開文件；風機 85–90% 重量可回收為業界常引用的數字；Vindeby 的資料取自 Ørsted 公開資訊。台灣尚無離岸風場進入除役，實際做法依主管機關核定的除役計畫而定。',
shots:[
/* 1 */{t:'風場的最後一天',en:'The last day of operation',dur:12,side:true,
 d:'離岸風機的設計壽命大約 20 到 25 年。接近終點時，業者要依結構檢查與發電收益，決定延壽、換機或除役。決定除役後，第一步不是吊車，而是讓整個風場安全停機：風機順槳停轉、轉子鎖定，變電站切開陣列海纜的斷路器，再把線路接地。運維人員搭乘人員運輸船登上風機，掛上安全鎖與警示牌，確認沒有任何設備帶電，拆除作業才能開始。',
 s:[[0,'運轉 25 年的風場，迎來最後一天'],[.3,'風機順槳停轉，轉子鎖定在 Y 字位置'],[.55,'變電站切開陣列海纜的斷路器，線路接地'],[.75,'運維人員登上風機上鎖掛牌，確認不帶電']],
 cam:u=>camMix({x:800,y:420,s:1},{x:700,y:420,s:1.3},ease(seg(u,.5,.75))),
 draw(u){
  for(const [x,s,p] of [[200,.55,.4],[1000,.42,1.7],[1380,.36,2.6]]){const st=1-seg(u,.3,.5);far21(x,s,p+TT*.9*st+(1-st)*1.2);}
  found21(TX,false,0);tower21(TX);drawNacelle(TX,TW_TOP,0,true);drawRotor(HUB.x,HUB.y,rotA21(u),3);scour21(TX);
  oss21();cable21(true);
  const cx=lerp(-120,520,easeOut(seg(u,.62,.82)));vsl(cx,78,false,{damp:.8,tilt:.6},vCTV);
  if(u>.82)person(TX-46,TP_TOP-32,'#f2c230',3);
  if(u>.55)alphaDo(.5+.5*Math.sin(TT*6),()=>circ(OX-50,SEA-98,4,'#e8572a'));
  lab(TX,TW_TOP-60,'風機順槳停機',{dx:70,dy:-50,a:band(u,.3,.62),st:'s'});
  lab(OX-50,SEA-98,'斷路器開啟',{dx:40,dy:-60,a:band(u,.55,1),st:'w'});
  lab(TX+200,bedY(TX+200)+8,'陣列海纜',{dx:30,dy:60,a:band(u,.04,.5)});
  lab(OX,SEA-50,'離岸變電站',{dx:60,dy:-90,a:band(u,.04,.5),minor:true});
  lab(cx+40,SEA-14,'人員運輸船',{dx:-30,dy:60,a:band(u,.66,.86)});
  lab(TX-46,TP_TOP-40,'上鎖掛牌',{dx:-80,dy:-50,a:band(u,.84,1),st:'g'});
 },
 hud(u){hudPanel(230,150,'風場狀態（示例）',seg(u,.04,.1),w=>{const p=Math.round(15*(1-seg(u,.3,.5)));
  hrow(52,'運轉年數','25 年',w);hrow(78,'單機容量','15 MW',w);
  hrow(104,'輸出',trf('{n} MW',{n:p}),w,p>0?'#7dffc4':'#ff9d7a');hbar(14,112,w-28,p/15,p>0?'#7dffc4':'#ff9d7a');
  const st=u<.3?'運轉中':u<.55?'停機':u<.8?'隔離接地':'可以拆除';hrow(140,'狀態',st,w,u<.3?'#7dffc4':u<.8?'#f2c230':'#7dffc4');});}},
/* 2 */{t:'壽命終點的三條路',en:'Three paths at end of life',dur:13,
 d:'風場接近設計壽命時，業者有三種選擇。延壽是檢查塔架與基礎的疲勞和腐蝕，更換關鍵零件，評估通過後再運轉數年；換機是拆掉舊風機、換上容量更大的新機型，延續海域與併網容量；除役則是依核定的除役計畫拆除設施、回復海域。在台灣，離岸風場使用國有海域時，要按每瓩 4,000 元計算除役保證金，確保業者到時候有能力拆除。',
 s:[[0,'風場的一生：開發施工，再運轉 20 到 25 年'],[.3,'延壽：檢查疲勞與腐蝕，評估後再運轉數年'],[.5,'換機：換上更大的新風機，延續海域使用'],[.68,'除役：拆除設施，回復海域'],[.84,'台灣以每瓩 4,000 元計算除役保證金']],
 draw(u){
  diagBG();
  card(60,150,1480,220,{bg:'rgba(7,27,39,.78)'});wt(84,190,'離岸風場的一生（典型）',20,'#f2c230',700);
  const x0=120,x1=1480,X=y=>lerp(x0,x1,y/30),by=262,f=ease(seg(u,.02,.28)),yr=30*f;
  rrp(x0,by,x1-x0,30,3);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fill();
  const segs=[[0,3,'#58b8d0','開發與施工'],[3,23,'#7dffc4','運轉'],[23,28,'#f2c230','延壽評估'],[28,30,'#e8572a','拆除']];
  segs.forEach(([a,b,c,t])=>{const e=Math.min(b,yr);if(e<=a)return;rrp(X(a),by,X(e)-X(a),30,3);ctx.fillStyle=c;ctx.fill();
   if(yr>=b)wt((X(a)+X(b))/2,by+21,t,16,'#0e2a3b',700,'center');});
  [0,5,10,15,20,25,30].forEach(y=>{ln([X(y),by+36,X(y),by+44],'rgba(227,236,238,.6)',1.4);wt(X(y),by+66,trf('{n} 年',{n:y}),15,'rgba(227,236,238,.75)',600,'center',COND);});
  alphaDo(seg(u,.2,.26),()=>{ctx.setLineDash([6,5]);ln([X(23),by-14,X(23),by+44],'#f2c230',1.6);ctx.setLineDash([]);wt(X(23),by-22,'設計壽命 20–25 年',16,'#f2c230',700,'center');});
  const O=[['延壽','Life extension','#7dffc4',.3,['檢查結構疲勞與腐蝕','更換關鍵零件與監測系統','評估通過後再運轉數年']],
   ['換機','Repowering','#58b8d0',.48,['換上容量更大的新風機','延續海域與併網容量','基礎多半需要重新設計']],
   ['除役','Decommissioning','#e8572a',.66,['依核定的除役計畫拆除','反向拆除風機與基礎','回復海域供航行與漁業']]];
  O.forEach(([t,e,c,t0,L],i)=>{const a=seg(u,t0,t0+.06),x=60+i*503;alphaDo(Math.max(.18,a),()=>{
   card(x,392,474,248,{bg:i===2?'rgba(232,87,42,.12)':'rgba(7,27,39,.8)',st:a>0?c:undefined});
   rrp(x+24,416,10,40,2);ctx.fillStyle=c;ctx.fill();wt(x+48,446,t,26,'#fff',700);wt(x+48+wtw(t,26,700)+14,446,e,15,'rgba(227,236,238,.7)',600,'left',COND);
   L.forEach((s,j)=>{circ(x+36,490+j*46,4,c);wt(x+52,497+j*46,s,18,'rgba(227,236,238,.9)',500);});});});
  alphaDo(seg(u,.82,.88),()=>{card(60,660,1480,140,{bg:'rgba(242,194,48,.08)',st:'rgba(242,194,48,.45)'});
   wt(90,708,'除役保證金（國產署）',18,'#f2c230',700);
   wt(90,770,'4,000 元/kW',44,'#f2c230',700,'left',COND);
   const m=Math.round(6000*ease(seg(u,.86,.96)));
   wt(520,722,'以 15 MW 風機為例（示例）',17,'rgba(227,236,238,.85)',600);
   wt(520,770,trf('15,000 kW × 4,000 元 = {n} 萬元',{n:m.toLocaleString('en-US'),M:(m/100).toFixed(0)}),28,'#fff',700,'left',COND);
   wrap21(1140,714,'使用國有海域時繳交，可分期，確保業者有能力拆除並回復海域',370,16,'rgba(227,236,238,.85)',500,23);});
 }},
/* 3 */{t:'反向拆除：先拆轉子與機艙',en:'Reverse installation: rotor and nacelle',dur:15,side:true,
 d:'除役基本上是把安裝的順序倒過來。自升式安裝船開到風機旁，放下樁腿把船身頂出水面，讓吊裝不受波浪影響。技術人員先在機艙內鬆開輪轂與主軸的螺栓，主吊車把整組轉子吊離，放平在甲板的支架上；也有工法是把葉片一支支拆下。接著拆除機艙與塔架之間的連接螺栓，把數百噸的機艙吊上船。每一次吊裝都要等到風速與浪高低於作業限制。',
 s:[[0,'自升式安裝船頂升在風機旁，船身離開水面'],[.12,'鬆開輪轂螺栓，主吊車把整組轉子吊離'],[.36,'轉子放平在甲板支架上，也可逐支拆下葉片'],[.56,'鬆開塔頂螺栓，把機艙吊上安裝船'],[.84,'每次吊裝都要等風速與浪高低於限制']],
 cam:u=>camMix({x:640,y:330,s:1.25},{x:560,y:360,s:1.15},ease(seg(u,.3,.5))),
 draw(u){
  for(const [x,s,p] of [[1000,.42,1.7],[1380,.36,2.6]])far21(x,s,p);
  found21(TX,false,0);tower21(TX);scour21(TX);oss21();cable21(false);
  drawWTIV(WR,WD,WLEG);
  // rotor: lift → move left → lower and lay flat on the blade racks
  const rp=kf(u,[[0,HUB.x,HUB.y],[.12,HUB.x,HUB.y],[.2,HUB.x,HUB.y-40],[.32,300,HUB.y-40],[.46,300,WD-48],[1,300,WD-48]]);
  const fk=lerp(1,.1,ease(seg(u,.36,.46)));
  // nacelle: lift → left → deck
  const np=kf(u,[[0,TX,TW_TOP],[.56,TX,TW_TOP],[.62,TX,TW_TOP-46],[.74,470,TW_TOP-46],[.84,470,WD],[1,470,WD]]);
  if(u<.46)flatRotor21(rp.x,rp.y,fk);
  drawNacelle(np.x,np.y,0,u<.56);
  if(u>=.46)flatRotor21(rp.x,rp.y,fk);
  let hk;
  if(u<.5)hk={x:rp.x,y:rp.y-34};
  else if(u<.56)hk={x:lerp(300,TX+10,ease(seg(u,.5,.56))),y:lerp(WD-82,TW_TOP-80,ease(seg(u,.5,.56)))};
  else if(u<.86)hk={x:np.x+10,y:np.y-80};
  else hk={x:lerp(480,520,ease(seg(u,.86,1))),y:lerp(WD-80,140,ease(seg(u,.86,1)))};
  crane(WR-25,SEA-122,360,hk.x,hk.y,{col:'#e9b21f'});
  if(u<.5&&u>.08)slings(hk.x,hk.y,[rp.x-6,rp.y-6,rp.x+6,rp.y-6]);
  if(u>.56&&u<.86)slings(hk.x,hk.y,[np.x-20,np.y-38,np.x+40,np.y-38]);
  if(u>.12&&u<.2)spark21(HUB.x+14,HUB.y,band(u,.12,.2),.5);
  lab(WR-250,WD+10,'自升式安裝船',{dx:-40,dy:80,a:band(u,0,.16),st:'s'});
  lab(WR-25,WD+50,'樁腿頂升',{dx:-60,dy:-20,a:band(u,0,.16),minor:true});
  lab(rp.x,rp.y,'整組轉子',{dx:90,dy:40,a:band(u,.14,.4),st:'s'});
  lab(300,WD-48,'葉片支架',{dx:-30,dy:-80,a:band(u,.44,.6)});
  lab(np.x,np.y-20,'機艙',{dx:70,dy:-50,a:band(u,.58,.86),st:'s'});
  lab(TX,TW_TOP,'塔頂法蘭螺栓',{dx:80,dy:-30,a:band(u,.52,.62),minor:true});
 },
 hud(u){hudPanel(230,150,'吊裝作業（示例）',seg(u,.04,.1),w=>{
  hrow(52,'風速限制','< 10 m/s',w);hrow(78,'目前風速',trf('{n} m/s',{n:(6.5+.6*Math.sin(TT*.7)).toFixed(1)}),w,'#7dffc4');
  const L=u<.46?'轉子 約 300 t':'機艙 約 600 t';hrow(104,'吊重',L,w,'#f2c230');
  const st=u<.12?'頂升完成':u<.46?'吊轉子':u<.56?'轉子完成':u<.84?'吊機艙':'機艙完成';hrow(132,'進度',st,w,u<.84?'#f2c230':'#7dffc4');});}},
/* 4 */{t:'吊走塔架，切除單樁',en:'Removing the tower and cutting the monopile',dur:15,side:true,
 d:'上部結構運走後，換由重型起重船處理塔架與基礎。塔架整段吊離後，陣列海纜先在基礎旁切斷封端。單樁不是整根拔出，而是切斷：先用吸泥設備把樁內的土清到切除線以下，再把磨料水刀放進樁內，沿著內壁繞一圈切開鋼管，切除線通常在海床面以下約 1 公尺。切開後，起重船把上半段單樁連同轉接段吊出水面，海床下的殘樁留在原地。',
 s:[[0,'重型起重船把塔架整段吊離'],[.24,'陣列海纜在基礎旁切斷，封端後留在海床'],[.34,'吸泥設備把樁內的土清到切除線以下'],[.5,'磨料水刀在樁內繞一圈，切開鋼管'],[.7,'上半段單樁連同轉接段吊出水面']],
 cam:u=>{const a={x:640,y:380,s:1.05},b={x:660,y:710,s:1.9},c={x:640,y:470,s:1.1};return u<.6?camMix(a,b,ease(seg(u,.18,.32))):camMix(b,c,ease(seg(u,.66,.84)));},
 draw(u){
  const lift=330*ease(seg(u,.68,.98)),cut=u>.62;
  cable21(false);
  if(u<.3){const dy=110*ease(seg(u,.04,.2));tower21(TX,dy);}
  found21(TX,cut,lift);scour21(TX);
  // cutaway of the pile interior while dredging and cutting
  const ca=band(u,.3,.68,.04);
  if(ca>0)alphaDo(ca,()=>{const top=bedY(TX)-60,bot=CUT21+46,lvl=lerp(bedY(TX),CUT21+30,ease(seg(u,.34,.5)));
   box(TX-11,top,22,bot-top,'#16252e');box(TX-11,lvl,22,bot-lvl,'#a4876a');
   ln([TX+3,top,TX+3,lvl-4],'#e8a33a',2.4);
   if(u<.5){for(let i=0;i<5;i++){const k=(TT*1.4+i/5)%1;circ(TX+3,lvl-4-k*(lvl-top-6),2.2,'rgba(181,154,106,.8)');}}
   if(u>.5){const ang=TT*2.2,tx=TX+Math.cos(ang)*9;box(TX-5,CUT21-14,10,12,'#f2c230');spark21(tx,CUT21,1,.45);}
   ctx.setLineDash([5,4]);ln([TX-46,CUT21,TX+46,CUT21],'#e8572a',1.6);ctx.setLineDash([]);});
  // sediment plume from the dredge discharge
  if(u>.34&&u<.52)alphaDo(.5,()=>{for(let i=0;i<10;i++){const k=(TT*1.1+i/10)%1;circ(TX+60+k*70,bedY(TX+60)-6-k*30,3+k*10,`rgba(181,154,106,${.5*(1-k)})`);}});
  // HLV + crane
  vsl(HR,430,true,{damp:.35},vHLV);
  let hk;
  if(u<.22)hk={x:TX,y:TW_TOP-30-110*ease(seg(u,.04,.2))};
  else if(u<.34)hk={x:TX,y:lerp(TW_TOP-140,TP_TOP-40,ease(seg(u,.24,.34)))};
  else hk={x:TX,y:TP_TOP-40-lift};
  crane(HCP.x,HCP.y,460,hk.x,hk.y,{col:'#e9b21f',solid:true});
  if(u<.22)slings(hk.x,hk.y,[TX-8,TW_TOP-110*ease(seg(u,.04,.2)),TX+8,TW_TOP-110*ease(seg(u,.04,.2))]);
  if(u>.34)slings(hk.x,hk.y,[TX-17,TP_TOP-lift,TX+17,TP_TOP-lift]);
  lab(HR-200,SEA-30,'重型起重船',{dx:-40,dy:-70,a:band(u,0,.2),st:'s'});
  lab(TX,TW_TOP+60-110*ease(seg(u,.04,.2)),'塔架整段吊離',{dx:80,dy:-40,a:band(u,.04,.22)});
  lab(TX+60,bedY(TX+60)+8,'海纜切斷封端',{dx:60,dy:50,a:band(u,.24,.4),st:'w'});
  lab(TX+3,bedY(TX)-30,'吸泥管',{dx:-70,dy:-40,a:band(u,.34,.5)});
  lab(TX,CUT21,'磨料水刀',{dx:-80,dy:40,a:band(u,.5,.68),st:'s'});
  lab(TX+46,CUT21,'切除線：海床下約 1 m',{dx:60,dy:30,a:band(u,.4,.68),st:'w'});
  lab(TX,CUT21+30,'殘樁留在海床下',{dx:70,dy:50,a:band(u,.8,1),st:'g'});
  lab(TX+20,TP_TOP-lift+80,'單樁與轉接段',{dx:70,dy:-30,a:band(u,.76,1),st:'s'});
 },
 hud(u){hudPanel(230,150,'基礎切除（示例）',seg(u,.04,.1),w=>{
  hrow(52,'單樁外徑','約 8 m',w);
  hrow(78,'樁內清淤',trf('海床下 {n} m',{n:(2*ease(seg(u,.34,.5))).toFixed(1)}),w,'#f2c230');
  const c=Math.round(100*seg(u,.5,.62));hrow(104,'切割進度',trf('{n} %',{n:c}),w,c<100?'#f2c230':'#7dffc4');hbar(14,112,w-28,c/100,c<100?'#f2c230':'#7dffc4');
  hrow(140,'吊出重量',u<.68?'—':trf('{n} t',{n:Math.round(1400*ease(seg(u,.68,.8)))}),w);});}},
/* 5 */{t:'切多深？留下什麼',en:'How deep to cut, and what stays',dur:14,
 d:'海床不是固定不動的，沙波會移動、颱風與海流會造成沖刷。若單樁切在海床面，幾年後殘樁可能露出，勾住漁網或船錨；切在海床下約 1 公尺，就能留下安全餘裕。並不是所有東西都要撈起來：依 OSPAR 等國際準則，埋設良好的海纜與沖刷保護拋石，若經評估移除的環境衝擊比留下更大，可以留在原地，但要標示在海圖上並持續監測。最終做法以主管機關核定的除役計畫為準。',
 s:[[0,'海床會隨沙波與沖刷而升降'],[.22,'切在海床面，沖刷後殘樁可能露出'],[.4,'切在海床下約 1 公尺，留下安全餘裕'],[.6,'埋設海纜與拋石，經評估可以留在原地'],[.82,'最終做法以核定的除役計畫為準']],
 draw(u){
  diagBG();
  card(60,150,800,650,{bg:'rgba(7,27,39,.78)'});wt(84,190,'殘樁與海床變動（示意）',20,'#f2c230',700);
  const sc=ease(seg(u,.18,.36))*(1-.4*seg(u,.8,1)),sb=26*sc;
  const panel=(x0,cutOff,title,ok,t0)=>{
   const w=360,cx=x0+w/2,bed0=430,bed=x=>bed0+sb*Math.exp(-Math.pow((x-cx)/90,2))+4*Math.sin(x*.05);
   card(x0,214,w,520,{bg:'rgba(14,42,59,.9)',st:'rgba(255,255,255,.1)'});
   // water
   const g=ctx.createLinearGradient(0,240,0,bed0);g.addColorStop(0,'rgba(88,184,208,.25)');g.addColorStop(1,'rgba(31,127,153,.4)');ctx.fillStyle=g;ctx.fillRect(x0+2,240,w-4,bed0-240);
   // soil
   ctx.beginPath();ctx.moveTo(x0+2,bed(x0));for(let x=x0;x<=x0+w;x+=6)ctx.lineTo(x,bed(x));ctx.lineTo(x0+w-2,730);ctx.lineTo(x0+2,730);ctx.closePath();ctx.fillStyle='#a4876a';ctx.fill();
   ctx.save();ctx.setLineDash([4,4]);ln([x0+10,bed0,x0+w-10,bed0],'rgba(227,236,238,.5)',1.2);ctx.restore();
   wt(x0+w-14,bed0+22,'原海床面',13,'rgba(255,255,255,.9)',600,'right');
   const top=bed0+cutOff;box(cx-26,top,52,720-top,'#6f7f8a');box(cx-20,top,40,720-top,'#3d4b55');
   ln([cx-30,top,cx+30,top],'#f2c230',2);
   wt(cx,262,title,18,'#fff',700,'center');
   const exposed=top<bed(cx);
   if(sc>.4)alphaDo(seg(u,t0,t0+.06),()=>{
    if(!ok&&exposed){ring(cx,top,34,'#e8572a',2.4);tag(cx,top-56,'殘樁露出',{bg:'#e8572a',fg:'#fff',size:16,align:'center'});}
    if(ok)tag(cx,bed(cx)-40,'仍在海床下',{bg:'#7dffc4',fg:'#0e2a3b',size:16,align:'center'});});
   if(cutOff>0)alphaDo(seg(u,.36,.42),()=>{ln([cx-40,bed0,cx-40,top],'#f2c230',1.6);ln([cx-46,bed0,cx-34,bed0],'#f2c230',1.6);ln([cx-46,top,cx-34,top],'#f2c230',1.6);wt(cx-52,(bed0+top)/2+6,'約 1 m',15,'#f2c230',700,'right',COND);});
  };
  panel(80,0,'切在海床面',false,.22);panel(480,44,'切在海床下',true,.4);
  alphaDo(seg(u,.18,.24),()=>wrap21(84,768,'沙波移動與颱風沖刷，會讓海床下降數十公分到數公尺（典型）',760,16,'rgba(227,236,238,.85)',500,22));
  // components table
  card(900,150,640,650,{bg:'rgba(7,27,39,.78)'});wt(924,190,'各部分的去留（典型做法）',20,'#fff',700);
  const R=[['風機與塔架','全部拆除運回陸地','拆除','#f2c230'],['離岸變電站','上部結構與套管式基礎拆除','拆除','#f2c230'],['單樁基礎','切除至海床下約 1 m','切除','#f2c230'],
   ['陣列與輸出海纜','埋設良好可留置，或回收銅鋁','評估','#58b8d0'],['沖刷保護拋石','常留置，已成為魚類棲地','留置','#7dffc4']];
  R.forEach(([a,b,t,c],i)=>{const k=seg(u,.46+i*.06,.5+i*.06),y=222+i*108;alphaDo(Math.max(.2,k),()=>{
   card(924,y,592,92,{bg:'rgba(255,255,255,.04)',st:'rgba(255,255,255,.1)'});
   wt(948,y+38,a,19,'#fff',700);wt(948,y+70,b,16,'rgba(227,236,238,.8)',500);
   tag(1494,y+46,t,{bg:c,fg:'#0e2a3b',size:16,align:'right'});});});
 }},
/* 6 */{t:'材料去哪裡',en:'Where the materials go',dur:13,
 d:'一部大型風機不含基礎就有上千噸，其中大部分是塔架、主軸與齒輪箱等鋼鐵，能送進電爐重熔成新鋼材；發電機與海纜裡的銅、鋁也有成熟的回收管道。業界常說風機 85 到 90% 的重量可以回收，難點是葉片的玻璃纖維與樹脂複合材料，目前多切割後送進水泥窯共處理，或以熱解回收纖維。世界第一座離岸風場丹麥 Vindeby 在 2017 年除役時，部分葉片捐給大學做疲勞研究，也有葉片改做道路隔音牆。',
 s:[[0,'一部大型風機，大部分重量是鋼鐵'],[.28,'鋼鐵重熔成新鋼材，銅與鋁也能回收'],[.52,'難點是葉片的玻璃纖維複合材料'],[.76,'Vindeby 的葉片，有些成了研究材料與隔音牆']],
 draw(u){
  diagBG();
  card(60,150,800,430,{bg:'rgba(7,27,39,.78)'});wt(84,190,'一部風機的材料組成（不含基礎，示例）',19,'#f2c230',700);
  const M=[['鋼與鑄鐵',80,'#7dc8dc'],['複合材料',10,'#ff9d7a'],['銅與鋁',3,'#f2c230'],['其他',7,'#b37cff']];
  const bx=90,bw=740,by=236,f=ease(seg(u,.04,.26));let acc=0;
  M.forEach(([t,p,c])=>{const w=bw*p/100*f;rrp(bx+acc,by,Math.max(0,w-2),56,2);ctx.fillStyle=c;ctx.fill();acc+=bw*p/100*f;});
  M.forEach(([t,p,c],i)=>{const y=344+i*44,a=seg(u,.1+i*.04,.16+i*.04);alphaDo(a,()=>{box(96,y-14,16,16,c);wt(124,y,t,18,'#fff',600);wt(420,y,trf('{n} %',{n:Math.round(p*f)}),20,c,700,'right',COND);});});
  alphaDo(seg(u,.26,.32),()=>{card(470,326,366,170,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});
   wt(490,362,'目前可回收',17,'rgba(227,236,238,.85)',600);wt(490,418,'85–90%',46,'#7dffc4',700,'left',COND);
   wrap21(490,452,'以總重量計，業界常引用的數字',330,15,'rgba(227,236,238,.8)',500,20);});
  alphaDo(seg(u,.06,.1),()=>wt(90,550,'合計約 1,000 t（示例，15 MW 級風機）',16,'rgba(227,236,238,.75)',500));
  // Vindeby
  alphaDo(seg(u,.74,.8),()=>{card(60,600,800,200,{bg:'rgba(242,194,48,.08)',st:'rgba(242,194,48,.45)'});
   wt(84,640,'丹麥 Vindeby（1991–2017）',19,'#f2c230',700);
   wrap21(84,676,'世界第一座離岸風場，11 部風機運轉 25 年後除役。部分葉片捐給丹麥技術大學做疲勞研究，部分改做道路隔音牆，其餘零件回收或留作備品。',752,16,'rgba(227,236,238,.88)',500,24);});
  // routes
  card(900,150,640,650,{bg:'rgba(7,27,39,.78)'});wt(924,190,'回收去向',20,'#fff',700);
  const RT=[['鋼與鑄鐵','#7dc8dc','電爐重熔成新鋼材','塔架、主軸、齒輪箱、基礎鋼管',.28],['銅與鋁','#f2c230','拆解後回收金屬','發電機繞組、變壓器、海纜導體',.36],
   ['葉片複合材料','#ff9d7a','切割後水泥窯共處理','或以熱解回收玻璃纖維',.52],['油品與電子','#b37cff','交由合格業者處理','齒輪油、液壓油、控制電路板',.62]];
  RT.forEach(([m,c,a,b,t0],i)=>{const k=seg(u,t0,t0+.06),y=226+i*140;alphaDo(Math.max(.18,k),()=>{
   card(924,y,592,120,{bg:i===2?'rgba(255,138,96,.1)':'rgba(255,255,255,.04)',st:i===2&&k>0?'rgba(255,138,96,.5)':'rgba(255,255,255,.1)'});
   tag(944,y+36,m,{bg:c,fg:'#0e2a3b',size:16});
   arrow(1180,y+36,1216,y+36,'rgba(227,236,238,.7)',2);
   wt(1230,y+42,a,19,'#fff',700);wt(944,y+90,b,16,'rgba(227,236,238,.8)',500);});});
 }},
/* 7 */{t:'海域復原與監測',en:'Restoring and monitoring the site',dur:12,side:true,
 d:'拆除完成後，還要證明海域真的恢復安全。調查船以多音束聲納掃測整個風場範圍與海纜路徑，確認沒有遺留的鋼構、纜線或掉落物，殘樁與留置海纜的位置會更新到海圖上，讓漁船與航行船舶知道。多年下來，基礎周圍的拋石已長滿附著生物，成為魚群聚集的人工魚礁，這也是部分國家同意留置的原因。除役後通常還有數年的監測期，確認海床與生態穩定。',
 s:[[0,'風機與變電站都已拆除，海面恢復開闊'],[.25,'調查船以多音束聲納掃測，確認沒有遺留物'],[.55,'殘樁與留置海纜的位置更新到海圖上'],[.76,'基礎周圍的拋石，已成為魚群聚集的棲地']],
 cam:u=>camMix({x:800,y:450,s:1},{x:700,y:600,s:1.55},ease(seg(u,.6,.8))),
 draw(u){
  const yb=bedY(TX)+130;ctx.save();ctx.beginPath();ctx.rect(TX-60,CUT21,120,400);ctx.clip();drawPile(TX,yb,Math.PI/2,yb-PILE_TOP,PILE_W);ctx.restore();
  scour21(TX);cable21(false);
  fishes21(TX-30,bedY(TX)-40,9,4);fishes21(TX+60,bedY(TX)-60,6,7);
  const sx=lerp(-200,1500,seg(u,.08,.95)),wl=vsl(sx,170,false,{damp:.6},vSurvey);
  const kx=sx+122,fan=band(u,.12,.94);
  if(fan>0)alphaDo(.35*fan,()=>{poly([kx,wl+16,kx-110,bedY(kx-110),kx+110,bedY(kx+110)],'rgba(125,255,196,.35)');});
  // swath already surveyed
  alphaDo(.6*fan,()=>{const x0=-200+122,x1=kx;ctx.save();ctx.beginPath();for(let x=Math.max(VX0,x0);x<=x1;x+=6){const y=bedY(x)-1;x===Math.max(VX0,x0)?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=2.4;ctx.stroke();ctx.restore();});
  dolphin(lerp(1300,200,seg(u,0,1)),SEA+60,Math.PI,.9);
  lab(sx+90,wl-40,'調查船',{dx:-30,dy:-60,a:band(u,.12,.5),st:'s'});
  lab(kx,(wl+bedY(kx))/2,'多音束聲納',{dx:60,dy:-30,a:band(u,.22,.55)});
  lab(TX,CUT21+20,'殘樁位置標示於海圖',{dx:-80,dy:60,a:band(u,.55,1),st:'g'});
  lab(TX+250,bedY(TX+250)+8,'留置海纜',{dx:40,dy:50,a:band(u,.55,1),minor:true});
  lab(TX-30,bedY(TX)-10,'拋石成為魚礁',{dx:-70,dy:-60,a:band(u,.76,1),st:'s'});
 },
 hud(u){hudPanel(230,150,'海域復原（示例）',seg(u,.04,.1),w=>{const c=Math.round(100*seg(u,.1,.92));
  hrow(52,'掃測覆蓋',trf('{n} %',{n:c}),w,c<100?'#f2c230':'#7dffc4');hbar(14,60,w-28,c/100,c<100?'#f2c230':'#7dffc4');
  hrow(94,'遺留物',c<100?'檢查中':'0 件',w,c<100?'#f2c230':'#7dffc4');
  hrow(120,'海圖更新',u<.55?'待更新':'完成',w,u<.55?'#f2c230':'#7dffc4');
  hrow(142,'後續監測','數年（典型）',w);});}}
]};
