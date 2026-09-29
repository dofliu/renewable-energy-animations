// KITS: marine
/* ================= EP17 颱風與地震的設計挑戰 ================= */
/* complete fixed-bottom turbine at cx (monopile + TP + tower + nacelle + rotor) */
function turb17(cx,ang){
  const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);
  drawNacelle(cx,TW_TOP,0,true);drawRotor(cx-44,TW_TOP-20,ang,3);
}
/* text wrapped to a width (after translation) */
function wrap17(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
/* rotor angle as a pure function of u: integrate the angular speed om(x) over the shot */
function rotAng17(u,dur,om){let a=0;const n=60;for(let i=0;i<n;i++)a+=om(u*(i+.5)/n)*u/n*dur;return a;}

/* ---------- shot 1: typhoon ---------- */
const V1_17=u=>lerp(12,52,ease(seg(u,.02,.8)));          // 10-min mean wind at hub (example)
const UC17=(()=>{let u=0;while(u<1&&V1_17(u)<25)u+=.001;return u;})();   // cut-out moment
const om1_17=x=>x<UC17?1.25:lerp(1.25,.05,ease(seg(x,UC17,UC17+.12)));
const sk17=u=>.3+.7*ease(seg(u,0,.7));                   // storm intensity 0–1
const RAIN17=(()=>{const r=rng(17),a=[];for(let i=0;i<150;i++)a.push({x:r()*2000-200,y:r()*900,l:.6+r()*.6,sp:.8+r()*.5});return a;})();
const SCL17=(()=>{const r=rng(71),a=[];for(let i=0;i<9;i++)a.push({x:r()*2400-400,y:40+r()*190,s:.9+r()*1.1,sp:.7+r()*.6});return a;})();
function stormSky17(k){
  drawSky();
  ctx.fillStyle=`rgba(28,38,48,${.7*k})`;ctx.fillRect(VX0,VY0,VX1-VX0,SEA+10-VY0);
  for(const c of SCL17){const x=((c.x+TT*60*c.sp*k+400)%2600+2600)%2600-400;
    ctx.save();ctx.globalAlpha*=.85*k;ctx.beginPath();
    [[0,0,34],[34,-14,40],[74,-4,32],[104,6,24],[-30,8,22]].forEach(([dx,dy,r])=>{ctx.moveTo(x+dx*c.s+r*c.s,c.y+dy*c.s);ctx.arc(x+dx*c.s,c.y+dy*c.s,r*c.s,0,TAU);});
    ctx.fillStyle='#4a5864';ctx.fill();ctx.restore();}
}
/* storm swell drawn over the kit water: crests above sea level with foam */
function stormSwell17(A){
  const xe=Math.min(VX1,COAST-40);if(xe<=VX0)return;
  const y=x=>SEA+2-A*clamp((COAST-40-x)/260)*(.5+.5*Math.sin(x*.012-TT*2.1))*(.65+.35*Math.sin(x*.031+TT*1.3));
  ctx.beginPath();ctx.moveTo(VX0,SEA+3);for(let x=VX0;x<=xe;x+=6)ctx.lineTo(x,y(x));ctx.lineTo(xe,SEA+3);ctx.closePath();
  const g=ctx.createLinearGradient(0,SEA-A,0,SEA+3);g.addColorStop(0,'#2c6c8c');g.addColorStop(1,'#3b93bb');ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();for(let x=VX0;x<=xe;x+=6){const v=y(x);x===VX0?ctx.moveTo(x,v):ctx.lineTo(x,v);}
  ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=2;ctx.stroke();
  for(let x=VX0-(VX0%60);x<=xe;x+=60){const v=y(x);if(v<SEA-A*.55)circ(x+Math.sin(TT*3+x)*4,v+2,3+A*.08,'rgba(255,255,255,.75)');}
}
function rain17(k){
  ctx.strokeStyle=`rgba(210,225,235,${.45*k})`;ctx.lineWidth=1.3;ctx.beginPath();
  for(const d of RAIN17){if(d.x>2000*k&&k<1)continue;const y=((d.y+TT*900*d.sp)%1000+1000)%1000-60,x=((d.x+TT*420*d.sp+(y*.45))%2000+2000)%2000-200;
    if(y>SEA+10)continue;ctx.moveTo(x,y);ctx.lineTo(x+14*d.l,y+32*d.l);}
  ctx.stroke();
}

/* ---------- shot 3: typhoon wind record ---------- */
const VM17=t=>(12+42*Math.exp(-Math.pow((t-12)/4,2)))*(1-.72*Math.exp(-Math.pow((t-12)/.7,2)));
const VG17=t=>VM17(t)*(1.32+.1*Math.sin(t*7.3)+.07*Math.sin(t*17.1+1)+.05*Math.sin(t*31.7));
const TH17=t=>150*(1/(1+Math.exp(-(t-12)/2.2)));     // wind direction change (deg)
function yaw17(u){                                    // nacelle yaw (deg): tracks, then stuck on grid loss, then catches up
  const t=24*u,th=TH17(t),tS=24*.46,tB=24*.76;
  if(t<tS)return th;if(t<tB)return TH17(tS);
  return lerp(TH17(tS),th,ease(seg(u,.76,.86)));
}

/* ---------- shot 4: earthquake ---------- */
const EQ17=u=>seg(u,.14,.2)*(1-seg(u,.62,.76));
const om4_17=x=>x<.3?1.1:lerp(1.1,0,ease(seg(x,.3,.46)));

/* ---------- shot 5: liquefaction ---------- */
const GR17=(()=>{const r=rng(55),a=[];for(let j=0;j<6;j++)for(let i=0;i<9;i++)a.push({i,j,ox:(r()-.5)*2,oy:(r()-.5)*2,ph:r()*6,r:21+r()*4});return a;})();
const FL17=d=>{const v=1.55-.95*Math.exp(-Math.pow((d-7)/3.2,2))+.012*d;return v;};   // example FL profile

const EP={no:17,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'颱風與地震的設計挑戰',en:'Designing for typhoons and earthquakes',
lede:'台灣位在颱風路徑上，也處在環太平洋地震帶，離岸風機除了要能發電，更要在極端風浪與強震中站得住。這一集看颱風來襲時風機如何自保，認識 IEC 的 T 級風機等級，再看地震、土壤液化與二十多年的疲勞載重如何左右設計。',
facts:[['57','m/s','T 級基準風速 Vref,T：輪轂高度 10 分鐘平均、50 年回歸期'],['79.8','m/s','T 級對應的 50 年回歸期 3 秒極端陣風（1.4 × Vref,T）'],['475','年','極限狀態檢核的設計地震回歸期；使用狀態另以 95 年地震檢核'],['< 1','FL','抗液化安全係數 FL = CRR / CSR 小於 1，即判定該土層會液化'],['20','年以上','技術指引規定的離岸風機最短設計年限'],['346','座','2024 年凱米颱風過後，台灣海峽仍安然佇立的離岸風機（能源署）']],
note:'說明：本集為教育用途示意動畫。風機等級、T 級基準風速、極端風速公式、地震回歸期、液化評估方法與設計年限取自經濟部標準檢驗局《離岸風力發電場址調查及設計技術指引》（2023）與 IEC 61400-1 第 4 版；凱米颱風後的風機數量取自能源署風力發電單一服務窗口；蒲福風級取自中央氣象署。颱風風速與風向歷程、切出風速 25 m/s、海床加速度、FL 分布、S-N 曲線與疲勞損傷值均為典型範例，實際依各風場的場址調查與設計而定。',
shots:[
/* 1 */{t:'颱風來襲：風機怎麼自保',en:'When a typhoon hits',dur:14,side:true,
 d:'颱風接近時，風速一路升高。風速超過切出風速（典型約 25 m/s），控制系統讓風機停止發電，把三支葉片轉到約 90 度的順槳位置，像刀鋒一樣切風，大幅減少受力；機艙則持續偏航，讓轉子正面迎風，避免側向受風。若電網中斷，備用電源仍要維持偏航與控制。2024 年凱米颱風過後，台灣海峽的 346 座離岸風機都安然佇立。',
 s:[[0,'颱風接近，風速與浪高一路升高'],[.3,'超過切出風速，風機停止發電'],[.48,'葉片轉到順槳位置，像刀鋒一樣切風'],[.66,'機艙持續偏航，讓轉子正面迎風'],[.82,'電網中斷時，備用電源仍維持控制']],
 cam:u=>({x:640,y:430,s:1}),
 base:u=>{const k=sk17(u);stormSky17(k);drawWaterBack();drawSoil();},
 end:u=>{sideEnd();stormSwell17(6+20*sk17(u));},
 draw(u){
  turb17(TX,rotAng17(u,14,om1_17));
 },
 fx(u){
  rain17(sk17(u));
  lab(HUB.x,HUB.y,'超過切出風速：停機',{dx:-110,dy:70,a:band(u,UC17,UC17+.18),st:'w'});
  lab(HUB.x+BR*.7,HUB.y+BR*.2,'葉片順槳（約 90°）',{dx:90,dy:40,a:band(u,.46,.68),st:'s'});
  lab(TX+30,TW_TOP-30,'機艙偏航，正面迎風',{dx:120,dy:-40,a:band(u,.64,.84)});
  lab(TX+30,TP_TOP-40,'備用電源維持控制',{dx:130,dy:10,a:band(u,.8,1),st:'g'});
  lab(260,SEA-14,'颱風巨浪',{dx:-60,dy:-60,a:band(u,.66,1),st:'w',minor:true});
 },
 hud(u){hudPanel(240,150,'颱風監測（示例）',seg(u,.02,.08),w=>{const V=V1_17(u),G=V*(1.3+.06*Math.sin(TT*5.3));
  hrow(52,'平均風速',V.toFixed(0)+' m/s',w,'#f2c230');hbar(14,60,w-28,V/60,V>25?'#e8572a':'#f2c230');
  hrow(92,'陣風',G.toFixed(0)+' m/s',w);
  const st=u<UC17?'發電中':u<UC17+.12?'切出停機':'順槳待機';
  hrow(116,'狀態',st,w,u<UC17?'#7dffc4':'#ff9d7a');
  hrow(140,'偏航',u>.8?'備用電源':'對風中',w,'#7dffc4');});}},
/* 2 */{t:'風機等級：為颱風多加一級',en:'Turbine classes and Class T',dur:14,
 d:'國際標準 IEC 61400-1 依「基準風速」把風機分成 I、II、III 級，基準風速是輪轂高度 50 年回歸期的 10 分鐘平均風速，I 級為 50 m/s。第 4 版為颱風地區新增 T 級，基準風速提高到 57 m/s；對應的 50 年回歸期 3 秒陣風是基準風速的 1.4 倍，約 79.8 m/s。57 m/s 大約相當於蒲福風級 17 級。台灣的離岸風機須符合 T 級規範。',
 s:[[0,'IEC 61400-1 依基準風速把風機分成 I、II、III 級'],[.3,'第 4 版新增颱風等級：T 級'],[.55,'T 級基準風速 57 m/s，極端陣風約 79.8 m/s'],[.78,'台灣的離岸風機須符合 T 級規範']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,860,650,{title:'IEC 61400-1 風機等級',x0:0,x1:4,y0:0,y1:90,yt:[0,20,40,60,80],yl:'m/s',pt:96,pl:70,pb:70,gx:4,gy:4});
  const CL=[['III 級',37.5,.04],['II 級',42.5,.1],['I 級',50,.16],['T 級',57,.34]];
  CL.forEach((k,i)=>{const a=seg(u,k[2],k[2]+.08);if(a<=0)return;const xm=c.X(i+.5),bw=62,T=i===3;
   alphaDo(Math.max(a,.001),()=>{
    const h1=k[1]*ease(a),h2=k[1]*1.4*ease(seg(u,k[2]+.14,k[2]+.22));
    box(xm-bw-4,c.Y(h1),bw,c.Y(0)-c.Y(h1),T?'#f2c230':'#58b8d0');
    if(h2>0)box(xm+4,c.Y(h2),bw,c.Y(0)-c.Y(h2),T?'rgba(232,87,42,.85)':'rgba(125,200,220,.45)');
    wt(xm-bw/2-4,c.Y(h1)-10,String(k[1]),19,T?'#f2c230':'#fff',700,'center',COND);
    if(h2>0)alphaDo(seg(u,k[2]+.18,k[2]+.22),()=>wt(xm+bw/2+4,c.Y(h2)-10,String(Math.round(k[1]*14)/10),19,T?'#ff9d7a':'rgba(227,236,238,.85)',700,'center',COND));
    wt(xm,c.Y(0)+30,k[0],19,T?'#f2c230':'#fff',700,'center');});});
  // legend
  alphaDo(seg(u,.06,.12),()=>{box(420,190,16,16,'#58b8d0');wt(444,204,'基準風速 Vref（10 分鐘平均）',16,'#fff',600);
   box(420,218,16,16,'rgba(125,200,220,.45)');wt(444,232,'50 年 3 秒陣風 Ve50',16,'#fff',600);});
  alphaDo(seg(u,.5,.56),()=>{ctx.setLineDash([7,5]);ln([c.X(0),c.Y(57),c.X(4),c.Y(57)],'#f2c230',1.6);ctx.setLineDash([]);});
  // right cards
  alphaDo(seg(u,.3,.36),()=>{card(960,150,580,330,{bg:'rgba(242,194,48,.07)',st:'rgba(242,194,48,.45)'});
   wt(984,192,'T 級（颱風等級）',21,'#f2c230',700);
   ['IEC 61400-1 第 4 版為颱風地區新增','基準風速 Vref,T = 57 m/s，高於 I 級的 50 m/s','台灣離岸風機須符合 T 級規範（能源署）'].forEach((t,i)=>{const a=seg(u,.34+i*.06,.4+i*.06);alphaDo(a,()=>{circ(992,242+i*74,5,'#f2c230');wrap17(1008,248+i*74,t,500,18,'#fff',600,25);});});});
  alphaDo(seg(u,.56,.62),()=>{card(960,500,580,300,{bg:'rgba(7,27,39,.8)'});
   wt(984,542,'極端風速模型',20,'#fff',700);
   wt(984,604,'Ve50 = 1.4 × Vref',32,'#f2c230',700,'left',COND);
   wt(984,634,'50 年回歸期 3 秒陣風',16,'rgba(227,236,238,.8)',500);
   wt(984,684,'Ve1 = 0.8 × Ve50',26,'#7dc8dc',700,'left',COND);
   wt(984,712,'1 年回歸期 3 秒陣風',16,'rgba(227,236,238,.8)',500);
   alphaDo(seg(u,.74,.8),()=>wrap17(984,764,'57 m/s 約相當於蒲福風級 17 級（56.1–61.2 m/s）',530,17,'#7dffc4',600,23));});
 }},
/* 3 */{t:'颱風的風，為什麼特別難',en:'What makes typhoon winds hard',dur:14,
 d:'颱風的風不只是大。陣風比平均風速高出三到四成，紊流也強；颱風眼通過時風速驟降又驟升，風向在數小時內大幅轉變。若此時電網中斷、偏航系統停擺，機艙卡在原來的方向，強風就從側面打在轉子與塔架上，這是設計中必須檢核的情境，所以要有備用電源讓機艙繼續對風。台灣颱風路徑多變，年最大風速的變異大，技術指引要求適度提高設計風速。',
 s:[[0,'颱風的陣風比平均風速高出三到四成'],[.3,'颱風眼通過，風速驟降又驟升'],[.46,'風向在數小時內大幅轉變'],[.6,'電網中斷時，機艙卡住，強風從側面打來'],[.78,'備用電源啟動，機艙重新對風']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,860,400,{title:'颱風通過時的輪轂風速（示例）',x0:0,x1:24,y0:0,y1:90,xt:[0,6,12,18,24],yt:[0,30,60,90],xl:'時間（小時）',yl:'m/s',pt:70,pl:60,gx:4,gy:3});
  const tc=24*u,P=[],Q=[];for(let t=0;t<=tc;t+=.08){P.push(c.X(t),c.Y(VM17(t)));Q.push(c.X(t),c.Y(Math.min(88,VG17(t))));}
  ctx.setLineDash([6,5]);ln([c.X(0),c.Y(57),c.X(24),c.Y(57)],'rgba(242,194,48,.7)',1.4);ln([c.X(0),c.Y(79.8),c.X(24),c.Y(79.8)],'rgba(232,87,42,.7)',1.4);ctx.setLineDash([]);
  wt(c.X(24)-6,c.Y(57)-8,'Vref,T 57',15,'#f2c230',700,'right',COND);wt(c.X(24)-6,c.Y(79.8)-8,'Ve50 79.8',15,'#ff9d7a',700,'right',COND);
  if(Q.length>3)ln(Q,'rgba(255,157,122,.85)',1.4);if(P.length>3)ln(P,'#7dffc4',3);
  ln([c.X(tc),c.py,c.X(tc),c.py+c.ph],'rgba(255,255,255,.35)',1);
  wt(250,196,'10 分鐘平均',15,'#7dffc4',700);wt(370,196,'3 秒陣風',15,'#ff9d7a',700);
  alphaDo(band(u,.44,.62),()=>wt(c.X(12),c.Y(VM17(12))+34,'颱風眼',16,'#fff',700,'center'));
  // top view: wind direction and nacelle yaw
  card(960,150,580,400,{bg:'rgba(7,27,39,.8)'});wt(984,190,'俯視：風向與機艙方向',20,'#f2c230',700);
  const cx=1250,cy=372,R=140;ring(cx,cy,R,'rgba(255,255,255,.18)',1.4);
  for(let a=0;a<360;a+=30){const r=a*Math.PI/180;ln([cx+Math.cos(r)*(R-8),cy+Math.sin(r)*(R-8),cx+Math.cos(r)*R,cy+Math.sin(r)*R],'rgba(255,255,255,.3)',1.4);}
  const th=TH17(tc)*Math.PI/180,yw=yaw17(u)*Math.PI/180,mis=Math.abs(TH17(tc)-yaw17(u));
  // wind arrow comes from direction th toward the centre
  const wx=cx-Math.cos(th)*(R+10),wy=cy-Math.sin(th)*(R+10);
  const k=(TT*.9)%1;for(let i=0;i<3;i++){const o=(i-1)*22,px=-Math.sin(th)*o,py=Math.cos(th)*o,f=(k+i*.33)%1;
   arrow(wx+px+Math.cos(th)*f*60,wy+py+Math.sin(th)*f*60,wx+px+Math.cos(th)*(f*60+50),wy+py+Math.sin(th)*(f*60+50),'#7dc8dc',3);}
  ctx.save();ctx.translate(cx,cy);ctx.rotate(yw);
  rrp(-8,-18,64,36,6);ctx.fillStyle='#e8edf0';ctx.fill();box(-16,-6,10,12,'#c9d1d5');
  ln([-16,-96,-16,96],mis>30?'#ff9d7a':'#f5f7f8',6);circ(-16,0,7,'#f2f5f6');ctx.restore();
  const bad=mis>30;wt(cx,cy+R+34,trf('偏航誤差 {n}°',{n:Math.round(mis)}),20,bad?'#ff9d7a':'#7dffc4',700,'center',COND);
  alphaDo(band(u,.5,.78),()=>tag(984,236,'電網中斷，偏航停擺',{bg:'#e8572a',fg:'#fff',size:16}));
  alphaDo(band(u,.78,1),()=>tag(984,236,'備用電源啟動',{bg:'#7dffc4',fg:'#0e2a3b',size:16}));
  // bottom cards
  const B=[['陣風大、紊流強','陣風比平均風速高出三到四成',.08],['風向急轉','颱風眼前後，風向可轉一百多度',.42],['路徑多變','年最大風速變異大，設計風速要適度提高',.86]];
  B.forEach((b,i)=>{const a=seg(u,b[2],b[2]+.06);if(a<=0)return;const x=60+i*500;alphaDo(a,()=>{card(x,580,480,220,{bg:'rgba(7,27,39,.8)'});
   wt(x+24,624,b[0],20,i===2?'#f2c230':'#fff',700);wrap17(x+24,664,b[1],430,17,'rgba(227,236,238,.88)',500,24);});});
 }},
/* 4 */{t:'地震：海床跟著搖',en:'When the seabed shakes',dur:13,side:true,
 d:'台灣位在環太平洋地震帶，地震波從震源傳到海床，基樁與整座風機跟著左右搖晃，塔頂的晃動又比底部更大。技術指引把地震分成兩個層級檢核：475 年回歸期的地震屬極限狀態，支撐結構要保持彈性、不能破壞；95 年回歸期的地震屬使用狀態，基礎的永久位移與傾角要小到風機仍能運轉。機艙裡的振動感測器偵測到強震會觸發停機。',
 s:[[0,'風機正常運轉，海床下方是鬆軟的砂泥層'],[.16,'地震波從震源傳上來，海床開始搖晃'],[.3,'振動感測器偵測到強震，觸發停機'],[.5,'475 年地震：支撐結構要保持彈性'],[.76,'95 年地震：基礎傾角要小到仍能運轉']],
 cam:u=>({x:640,y:440,s:1}),
 base:u=>{const e=EQ17(u),gx=4*e*Math.sin(TT*38);drawSky();drawWaterBack();ctx.save();ctx.translate(gx,0);drawSoil();ctx.restore();},
 draw(u){
  const e=EQ17(u),gx=4*e*Math.sin(TT*38),sw=e*.02*Math.sin(TT*6.5),yb=bedY(TX)+130;
  // seismic wave fronts in the soil
  if(e>0){ctx.save();soilRegion();ctx.clip();for(let i=0;i<4;i++){const r=((TT*260+i*150)%600);alphaDo(e*(1-r/600),()=>ring(260,1060,r+200,'rgba(232,87,42,.7)',3));}ctx.restore();}
  ctx.save();ctx.translate(gx,yb);ctx.transform(1,0,-sw,1,0,0);ctx.translate(0,-yb);
  turb17(TX,rotAng17(u,13,om4_17));ctx.restore();
  // top sway trace
  alphaDo(band(u,.18,.72),()=>{ctx.setLineDash([4,4]);ln([TX,TW_TOP-60,TX,yb],'rgba(255,255,255,.35)',1.2);ctx.setLineDash([]);});
 },
 fx(u){
  const e=EQ17(u);
  lab(250,bedY(250)+180,'地震波',{dx:-40,dy:-80,a:band(u,.14,.4)*e,st:'w'});
  lab(TX+10,TW_TOP-24,'振動感測器觸發停機',{dx:130,dy:-30,a:band(u,.3,.52),st:'w'});
  lab(TX,420,'支撐結構保持彈性',{dx:150,dy:0,a:band(u,.5,.76),st:'s'});
  lab(TX,bedY(TX),'基礎傾角檢核',{dx:150,dy:30,a:band(u,.76,1),st:'g'});
  lab(TX,TW_TOP-60,'塔頂晃動最大',{dx:-130,dy:30,a:band(u,.2,.46)*e,minor:true});
 },
 hud(u){hudPanel(240,150,'地震監測（示例）',seg(u,.02,.08),w=>{const e=EQ17(u),g=.28*e*(.7+.3*Math.abs(Math.sin(TT*9)));
  hrow(52,'海床加速度',g.toFixed(2)+' g',w,'#f2c230');hbar(14,60,w-28,g/.35,'#e8572a');
  hrow(92,'塔頂位移',Math.round(e*38*Math.abs(Math.sin(TT*6.5)))+' cm',w);
  hrow(116,'狀態',u<.3?'運轉中':u<.62?'觸發停機':'停機檢查',w,u<.3?'#7dffc4':'#ff9d7a');
  hrow(140,'檢核',u<.76?'475 年 ULS':'95 年 SLS',w,'#fff');});}},
/* 5 */{t:'土壤液化：地層失去支撐',en:'Soil liquefaction',dur:15,
 d:'海床表層常是飽和、鬆散的砂層。平時砂粒彼此接觸、互相支撐；地震反覆搖晃時，砂粒想擠密，孔隙裡的水卻來不及排出，超額孔隙水壓上升。當孔隙水壓升到等於土壤原本的有效應力，砂粒不再互相壓緊，土層就像液體一樣失去強度，這就是液化。設計時先計算各深度的抗液化安全係數 FL，小於 1 的土層視為會液化，並分別分析液化與不液化兩種情境，取較保守的結果。',
 s:[[0,'平時砂粒互相接觸，承載力來自顆粒間的摩擦'],[.24,'地震搖晃，孔隙水來不及排出，水壓上升'],[.44,'水壓等於有效應力，砂粒浮起，土層液化'],[.64,'計算各深度的安全係數 FL，小於 1 視為液化'],[.82,'液化與不液化兩種情境都要分析，取保守者']],
 draw(u){
  diagBG();
  card(60,150,700,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'飽和砂層的放大圖（示意）',20,'#f2c230',700);
  const q=ease(seg(u,.22,.5)),shake=seg(u,.22,.26)*(1-seg(u,.56,.62)),bx=100,by=220,bw=620,bh=380;
  ctx.save();rrp(bx,by,bw,bh,8);ctx.clip();box(bx,by,bw,bh,'rgba(59,147,187,.45)');
  const pos=[];GR17.forEach(g=>{const x0=bx+40+g.i*68+(g.j%2)*34,y0=by+bh-40-g.j*56;
   const fx=Math.sin(TT*1.2+g.ph)*14*q+g.ox*16*q+shake*Math.sin(TT*30+g.ph)*3,fy=-q*(26+g.oy*12)+Math.cos(TT*1.1+g.ph)*8*q;pos.push([x0+fx,y0+fy,g.r*(1-.12*q)]);});
  // contact force chains
  alphaDo(1-q,()=>{ctx.strokeStyle='rgba(242,194,48,.9)';ctx.lineWidth=3;ctx.beginPath();pos.forEach((p,i)=>pos.forEach((o,j)=>{if(j>i&&Math.hypot(p[0]-o[0],p[1]-o[1])<72){ctx.moveTo(p[0],p[1]);ctx.lineTo(o[0],o[1]);}}));ctx.stroke();});
  pos.forEach(p=>circ(p[0],p[1],p[2],'#d9c393','rgba(120,95,50,.6)',1.4));
  ctx.restore();
  wt(bx+bw/2,by+bh+34,q<.5?'砂粒互相接觸（黃線為傳力路徑）':'砂粒浮在水中，失去接觸',17,q<.5?'#f2c230':'#ff9d7a',700,'center');
  // pore pressure ratio bar
  const ru=clamp(q*1.02);wt(84,668,'超額孔隙水壓 ／ 有效應力',17,'#fff',600);
  box(84,684,560,24,'rgba(255,255,255,.12)');box(84,684,560*ru,24,ru>=.99?'#e8572a':'#58b8d0');
  wt(664,704,ru.toFixed(2),24,ru>=.99?'#ff9d7a':'#fff',700,'left',COND);
  alphaDo(seg(u,.46,.5),()=>wt(84,746,'比值達到 1：土壤液化',19,'#ff9d7a',700));
  // FL profile chart
  const c=chartBox(800,150,740,420,{title:'抗液化安全係數 FL（示例）',x0:0,x1:2,y0:20,y1:0,xt:[0,.5,1,1.5,2],yt:[0,5,10,15,20],xl:'FL',yl:'海床下深度（m）',pt:78,pl:64,pb:56,gx:4,gy:4});
  const fp=seg(u,.6,.72);
  if(fp>0){const P=[];for(let d=0;d<=20*fp;d+=.25)P.push(c.X(FL17(d)),c.Y(d));
   alphaDo(1,()=>{ctx.save();ctx.beginPath();ctx.rect(c.px,c.py,c.X(1)-c.px,c.ph);ctx.clip();
    const Z=[];for(let d=0;d<=20*fp;d+=.25)Z.push([c.X(FL17(d)),c.Y(d)]);ctx.beginPath();ctx.moveTo(c.X(1),c.Y(0));Z.forEach(p=>ctx.lineTo(Math.min(p[0],c.X(1)),p[1]));ctx.lineTo(c.X(1),Z[Z.length-1][1]);ctx.closePath();ctx.fillStyle='rgba(232,87,42,.35)';ctx.fill();ctx.restore();});
   ln(P,'#7dffc4',3);}
  ctx.setLineDash([7,5]);ln([c.X(1),c.py,c.X(1),c.py+c.ph],'#e8572a',1.8);ctx.setLineDash([]);
  wt(c.X(1)+8,c.py+22,'FL = 1',16,'#ff9d7a',700,'left',COND);
  alphaDo(seg(u,.7,.76),()=>wt(c.X(.62),c.Y(7)+6,'液化層',17,'#ff9d7a',700,'center'));
  // formula + design card
  alphaDo(seg(u,.62,.68),()=>{card(800,590,740,210,{bg:'rgba(242,194,48,.07)',st:'rgba(242,194,48,.4)'});
   wt(824,640,'FL = CRR / CSR',30,'#f2c230',700,'left',COND);
   wrap17(1110,622,'土壤抗液化強度 ÷ 地震引起的剪應力（475 年地震）',400,16,'rgba(227,236,238,.88)',500,22);
   alphaDo(seg(u,.82,.88),()=>{wrap17(824,700,'液化層不計側向支撐，基樁要穿過並深入下方緊密地層；液化與不液化兩種情境都分析，取較保守的結果。',690,17,'#7dffc4',600,25);});});
 }},
/* 6 */{t:'疲勞：上億次的小載重',en:'Fatigue: millions of small loads',dur:14,
 d:'颱風與地震是少見的極端事件，但風機在二十多年裡每天都承受波浪、紊流與轉子旋轉帶來的反覆載重。每一次應力都不大，累積上億次後，焊道與節點仍可能出現裂紋，這就是疲勞。設計時用 S-N 曲線換算每一種應力幅度可承受的次數，再依邁納法則把各種載重造成的損傷相加，整個設計年限內的累積損傷必須小於 1，並保留安全係數。',
 s:[[0,'波浪、紊流與轉子旋轉，每天帶來反覆載重'],[.26,'應力越小，可承受的次數越多：S-N 曲線'],[.52,'二十五年間，每八秒一道浪，約一億次'],[.74,'把各種載重的損傷相加，累積損傷要小於 1']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,860,650,{title:'S-N 曲線（示意）',x0:4,x1:9,y0:-1.6,y1:0,pt:80,pl:74,pb:74,gx:5,gy:4,yl:'應力幅度'});
  wt(c.px+c.pw,c.py+c.ph+56,'循環次數 N',16,'rgba(227,236,238,.7)',500,'right');
  for(let n=4;n<=9;n++){wt(c.X(n)-4,c.py+c.ph+26,'10',16,'rgba(227,236,238,.75)',600,'center',COND);wt(c.X(n)+10,c.py+c.ph+16,String(n),12,'rgba(227,236,238,.75)',600,'left',COND);}
  wt(c.px-12,c.Y(0)+5,'高',16,'rgba(227,236,238,.75)',600,'right');wt(c.px-12,c.Y(-1.6)+5,'低',16,'rgba(227,236,238,.75)',600,'right');
  const sn=x=>x<7?-(x-4)/3:-1-(x-7)/5,cf=seg(u,.22,.44),P=[];
  for(let x=4;x<=4+5*cf;x+=.05)P.push(c.X(x),c.Y(sn(x)));if(P.length>3)ln(P,'#f2c230',3.4);
  alphaDo(seg(u,.4,.46),()=>{wt(c.X(5.6),c.Y(sn(5.6))-24,'應力大：可承受次數少',16,'#ff9d7a',700,'left');
   wt(c.X(7.4),c.Y(sn(7.4))-24,'應力小：次數多',16,'#7dffc4',700,'left');});
  // markers: typhoon load vs daily waves
  alphaDo(seg(u,.46,.52),()=>{circ(c.X(4.6),c.Y(sn(4.6)),9,'#e8572a');wt(c.X(4.6),c.Y(sn(4.6))+38,'颱風',16,'#ff9d7a',700,'center');
   circ(c.X(8.4),c.Y(sn(8.4)),9,'#58b8d0');wt(c.X(8.4),c.Y(sn(8.4))+36,'日常波浪',16,'#7dc8dc',700,'center');});
  // load source strip
  const L=[['波浪','每 5–10 秒一次'],['風紊流','隨時變化'],['轉子旋轉','每轉三次葉片通過']];
  alphaDo(seg(u,.02,.08),()=>{card(960,150,580,200,{bg:'rgba(7,27,39,.8)'});wt(984,190,'反覆載重的來源',20,'#fff',700);
   L.forEach((l,i)=>{const x=984+i*186,a=seg(u,.04+i*.05,.1+i*.05);alphaDo(a,()=>{
    const ph=TT*(i===0?1.2:i===1?2.6:3.4);ln(Array.from({length:30},(_,k)=>[x+k*5.5,262+Math.sin(ph+k*.5)*(i===1?6+4*Math.sin(k*1.7):10)]).flat(),i===0?'#58b8d0':i===1?'#7dc8dc':'#f2c230',2.4);
    wt(x,310,l[0],18,'#fff',700);wt(x,334,l[1],14,'rgba(227,236,238,.78)',500);});});});
  // cycle counter
  alphaDo(seg(u,.5,.56),()=>{const k=ease(seg(u,.52,.72)),yr=25*k,n=yr*365*24*3600/8;
   card(960,370,580,200,{bg:'rgba(7,27,39,.8)'});wt(984,410,'波浪載重累計（示例）',20,'#fff',700);
   wt(984,480,trf('第 {n} 年',{n:yr.toFixed(0)}),30,'#7dc8dc',700,'left',COND);
   wt(1516,480,trf('{n} 萬次',{n:Math.round(n/1e4).toLocaleString('en-US'),m:(n/1e6).toFixed(1)}),34,'#f2c230',700,'right',COND);
   hbar(984,508,532,k,'#f2c230');wt(984,550,'每 8 秒一道浪 × 25 年 ≈ 1 億次',16,'rgba(227,236,238,.85)',500);});
  // Miner damage
  alphaDo(seg(u,.72,.78),()=>{const D=.62*ease(seg(u,.74,.92));
   card(960,590,580,210,{bg:'rgba(242,194,48,.07)',st:'rgba(242,194,48,.4)'});
   wt(984,632,'累積損傷 D = Σ n / N',24,'#f2c230',700,'left',COND);
   box(984,656,532,26,'rgba(255,255,255,.12)');box(984,656,532*D,26,'#7dffc4');
   ln([984+532,648,984+532,690],'#e8572a',2.4);wt(1516,712,'D = 1 破壞',15,'#ff9d7a',700,'right');
   wt(984,712,'D = '+D.toFixed(2),18,'#7dffc4',700,'left',COND);
   wrap17(984,752,'設計年限內 D 必須小於 1，並保留安全係數',540,16,'#fff',600,22);});
 }}
]};
