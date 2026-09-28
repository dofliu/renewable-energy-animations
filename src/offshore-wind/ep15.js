// KITS: marine
/* ================= EP15 離岸風場的運維 ================= */
/* complete fixed-bottom turbine at cx (monopile + TP + tower + nacelle + rotor) */
function turb15(cx,ang){
  const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);
  drawNacelle(cx,TW_TOP,0,true);drawRotor(cx-44,TW_TOP-20,ang,3);
}
/* distant turbine on the horizon */
function far15(x,s,ang){const h=150*s,hx=x,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([hx,hy,hx+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(hx,hy,3*s,'#eef2f4');}
/* text wrapped to a width (after translation) */
function wrap15(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
/* port: quay, O&M building and warehouse on the land side */
function port15(){
  const x0=1440,xe=VX1+30;if(xe<x0)return;
  box(x0,452,xe-x0,120,'#9aa3a8');box(x0,452,xe-x0,5,'#6f7a80');
  for(let x=x0+8;x<xe;x+=40)box(x,458,7,18,'#2b3137');
  for(let x=x0+20;x<xe;x+=70){box(x,446,8,6,'#2b3137');}
  superBlock(1478,386,64,66,5,'#e9edef');box(1474,380,72,7,'#6f7a80');mast(1530,380,16);
  box(1560,404,110,48,'#c7cfd3');poly([1556,404,1615,388,1674,404],'#8e9aa1');
  for(let i=0;i<3;i++)box(1572+i*32,426,22,26,'#5d6b74');
  for(let i=0;i<3;i++)box(1690+i*26,432,22,20,['#e8572a','#1f7f99','#f2c230'][i]);
}
function drone15(x,y){
  const spin=TT*40;box(x-9,y-3,18,6,'#2b3137');ln([x-16,y-6,x+16,y-6],'#2b3137',1.6);
  for(const s of [-1,1]){const rx=x+s*16;ctx.beginPath();ctx.ellipse(rx,y-8,10*Math.abs(Math.cos(spin+s)),1.6,0,0,TAU);ctx.fillStyle='rgba(40,50,60,.55)';ctx.fill();}
  circ(x,y+5,3,'#394650');circ(x+6,y-3,1.4,Math.sin(TT*8)>0?'#7dffc4':'#2a6d56');
}
/* SOV state for shot 3: heave and roll */
function sov3(){const x=300,hv=5*Math.sin(TT*1.05)+2*Math.sin(TT*1.9+1),r=.018*Math.sin(TT*.9+.5);
  const c=Math.cos(r),n=Math.sin(r),wl=SEA+hv,P=(lx,ly)=>({x:x+lx*c-ly*n,y:wl+lx*n+ly*c});return {x,wl,hv,r,P};}
const GW_TIP={x:TX-50,y:TP_TOP-4};
/* NACA-like airfoil (leading edge at x, chord c) */
function foil15(x,y,c,t){const P=[];for(let i=0;i<=40;i++){const s=Math.pow(i/40,2);P.push([x+s*c,y-thk(s,t)*c]);}
  for(let i=40;i>=0;i--){const s=Math.pow(i/40,2);P.push([x+s*c,y+thk(s,t)*c*.55]);}return P;}
function thk(s,t){return 5*t*(.2969*Math.sqrt(s)-.126*s-.3516*s*s+.2843*s*s*s-.1015*s*s*s*s);}
const HS15=[2.3,2.1,1.7,1.3,1.0,0.9,1.0,1.1,1.4,2.0,2.3,2.4];
/* shot 4: cable temperature along the route */
const bump=(d,c,w)=>Math.exp(-Math.pow((d-c)/w,2));
const dtsT=d=>29+.7*Math.sin(d*9)+.4*Math.sin(d*23)-7*bump(d,1.174,.07);

const EP={no:15,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'離岸風場的運維',en:'Offshore wind O&M',
lede:'風機裝好、併網發電之後，接下來二十多年都要靠運維團隊照顧。這一集從運維港出發，看浪高如何決定能不能出海、運維母船怎麼當作海上基地，再用光纖監測海纜、用無人機巡檢葉片、修補被雨滴磨損的前緣，最後看資料如何變成派工。',
facts:[['1.5','m','CTV 靠船登塔的典型示性波高上限'],['2.5–3','m','SOV 動態補償舷梯可作業的示性波高'],['60','人','台灣籍 SOV「大三商領航」號可載運的技術人員'],['75–80','%','離岸風電保險理賠成本中與海纜故障有關的比例（DNV）'],['約 90','m/s','大型風機的葉尖速度，是前緣侵蝕的主因（典型）'],['20–35','%','運維占離岸風場生命週期成本的比例（典型）']],
note:'說明：本集為教育用途示意動畫，水平距離與尺寸經過壓縮。登塔浪高上限、航速、巡檢時間、葉尖速度、成本比例與月平均浪高為典型範例；SOV 資料取自開發商與船東公開資訊，海纜理賠比例取自 DNV 公開文章，彰化海域浪高取自台灣科技媒體中心的專家說明。實際作業條件依各風場、船舶與機型而定。',
shots:[
/* 1 */{t:'運維港：風場的後勤基地',en:'The O&M port',dur:13,side:true,
 d:'離岸風場開始商轉後，接下來 20 到 25 年都要靠運維團隊照顧。運維港是風場的後勤基地，設有監控中心、備品倉庫、技術人員集合點與專用碼頭，台中港即設有多家開發商的運維據點。天氣許可時，人員運輸船（CTV）每天清晨載著技術人員出港，以約 25 節航速前往風場，傍晚返航；需要長時間作業的工作，則交給駐守在風場的運維母船（SOV）。',
 s:[[0,'運維港設有監控中心、備品倉庫與專用碼頭'],[.3,'清晨，人員運輸船（CTV）載著技術人員出港'],[.55,'以約 25 節的航速前往風場，傍晚返航'],[.78,'需要長時間作業時，由駐守風場的運維母船（SOV）接手']],
 base:()=>{drawSky();drawWaterBack();drawSoil();},
 cam:u=>camMix({x:1250,y:400,s:1.35},{x:800,y:420,s:1},ease(seg(u,.2,.72))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[960,.45,1.7],[1150,.4,2.6]])far15(x,s,TT*.9+p);
  turb15(TX,TT*1.05);
  vsl(60,230,false,{damp:.5},vSOV);
  port15();
  const xC=lerp(1436,TX+100,ease(seg(u,.14,.74)));
  const wl=vsl(xC,77,true,{tilt:.8},vCTV);
  if(u>.14&&u<.74)alphaDo(.7,()=>{for(let i=0;i<5;i++){const k=(TT*2+i/5)%1;ln([xC+4+k*80,wl+2+i*.6,xC+24+k*80,wl+2+i*.6],`rgba(255,255,255,${.8*(1-k)})`,1.4);}});
  lab(1510,386,'監控中心',{dx:-40,dy:-50,a:band(u,.02,.3)});
  lab(1615,395,'備品倉庫',{dx:30,dy:-60,a:band(u,.04,.32)});
  lab(1450,456,'運維碼頭',{dx:-60,dy:50,a:band(u,.06,.32)});
  lab(xC-40,wl-18,'人員運輸船（CTV）',{dx:-30,dy:-60,a:band(u,.28,.7),st:'s'});
  lab(175,SEA-60,'運維母船（SOV）',{dx:40,dy:-60,a:band(u,.76,1),st:'s'});
  lab(TX,TP_TOP-10,'風機',{dx:70,dy:-40,a:band(u,.7,1)});
 },
 hud(u){hudPanel(230,150,'今日出勤（示例）',seg(u,.04,.1),w=>{const k=ease(seg(u,.14,.74));
  hrow(52,'技術人員','12 人',w);hrow(78,'航速','約 25 節',w);hrow(104,'航程',Math.round(40*k)+' km',w,'#f2c230');
  hrow(132,'示性波高','1.1 m',w,'#7dffc4');});}},
/* 2 */{t:'出得了海嗎？浪高與天候窗口',en:'Weather windows',dur:14,
 d:'運維工作能不能出海，主要看示性波高（Hs），也就是海面上較大三分之一波浪的平均高度。CTV 以船首頂住靠船設施讓人員跨上爬梯，一般只能在約 1.5 公尺以下作業；SOV 的動態補償舷梯可在約 2.5 到 3 公尺的浪況下使用。台灣海峽冬季東北季風盛行，彰化海域示性波高可達 3 公尺，運維工作必須配合天候窗口排程。',
 s:[[0,'能不能出海，看的是示性波高（Hs）'],[.28,'人員運輸船登塔的典型上限約 1.5 公尺'],[.52,'運維母船的補償舷梯可在約 2.5–3 公尺作業'],[.76,'冬季東北季風期間浪高常超過上限，要把握天候窗口']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,800,440,{title:'台灣海峽月平均示性波高（示例）',x0:.5,x1:12.5,y0:0,y1:3.5,xt:[1,2,3,4,5,6,7,8,9,10,11,12],yt:[0,1,2,3],xl:'月份',pt:74,gx:12,gy:7});
  wt(c.px-10,c.py-14,'Hs (m)',15,'rgba(227,236,238,.7)',600,'right',COND);
  HS15.forEach((h,i)=>{const k=ease(seg(u,.04+i*.018,.1+i*.018));if(k<=0)return;const x=c.X(i+1),y=c.Y(h*k),bw=c.pw/12*.6;
   box(x-bw/2,y,bw,c.Y(0)-y,h>1.5&&u>.28?'#e8572a':'#58b8d0');});
  const th=(v,col,t,a)=>{if(a<=0)return;alphaDo(a,()=>{ctx.setLineDash([8,6]);ln([c.px,c.Y(v),c.px+c.pw,c.Y(v)],col,2.2);ctx.setLineDash([]);wt(c.X(7),c.Y(v)-10,t,17,col,700,'center');});};
  th(1.5,'#e8572a','CTV 上限 約 1.5 m',seg(u,.28,.34));
  th(2.5,'#f2c230','SOV 上限 約 2.5–3 m',seg(u,.52,.58));
  alphaDo(seg(u,.76,.82),()=>{wt(c.X(1.5),c.Y(3.25),'東北季風',17,'#ff9d7a',700,'center');wt(c.X(11.5),c.Y(3.25),'東北季風',17,'#ff9d7a',700,'center');
   wt(c.X(7),c.Y(3.25),'颱風前後停航',17,'rgba(227,236,238,.85)',700,'center');});
  alphaDo(seg(u,.78,.86),()=>{card(60,612,800,180,{bg:'rgba(242,194,48,.08)',st:'rgba(242,194,48,.45)'});
   wt(84,650,'天候窗口',20,'#f2c230',700);
   const n=wrap15(84,684,'東北季風盛行時，彰化海域示性波高可達 3 m、最大波高可達 6 m。',750,17,'#fff',600,24);
   wrap15(84,684+n*24+8,'運維工作集中在浪況較好的月份，冬季只能把握短暫的好天氣。',750,16,'rgba(227,236,238,.8)',500,23);});
  const K=[['人員運輸船（CTV）','≤ 1.5 m','#e8572a',['以船首頂住靠船設施，人員跨上爬梯','航速約 25 節，當日往返','載運 12–24 名技術人員'],.26],
   ['運維母船（SOV）','≤ 2.5–3 m','#f2c230',['動態補償舷梯，走上風機','駐場數週，定期靠港補給','住艙可容納數十名技術人員'],.5],
   ['直升機','不看浪高','#7dffc4',['受風速與能見度限制','載人少、成本高','多用於緊急搶修'],.66]];
  K.forEach((k,i)=>{const a=seg(u,k[4],k[4]+.07);if(a<=0)return;const y=150+i*220;alphaDo(a,()=>{
   card(900,y,640,200,{bg:'rgba(7,27,39,.8)'});wt(924,y+40,k[0],21,'#fff',700);wt(1516,y+44,k[1],30,k[2],700,'right',COND);
   k[3].forEach((t,j)=>{circ(930,y+84+j*36,4,k[2]);wt(946,y+90+j*36,t,17,'rgba(227,236,238,.9)',500);});});});
 }},
/* 3 */{t:'運維母船：駐守風場的旅館與工廠',en:'The service operation vessel',dur:12,side:true,
 d:'運維母船（SOV）典型長度約 80 到 90 公尺，船上有住艙、餐廳、備品倉庫與工作坊，可連續駐守風場數週。台灣籍 SOV「大三商領航」號於 2022 年在台中港啟航，可載運 60 名技術人員、每月靠港補給一次。動態定位系統讓船停在定點，動態補償舷梯即時抵銷船身起伏，技術人員不必跨越浪頭，直接走上風機的工作平台。',
 s:[[0,'運維母船停在風機旁，動態定位系統保持船位'],[.25,'動態補償舷梯伸出，端點固定在工作平台上'],[.5,'船身隨浪起伏，舷梯即時補償，技術人員走過登塔'],[.78,'船上有住艙與備品倉庫，可連續駐守數週']],
 cam:u=>camMix({x:640,y:360,s:1.15},{x:500,y:400,s:1.9},ease(seg(u,.14,.3))),
 draw(u){
  turb15(TX,TT*1.05);
  const S=sov3();ctx.save();ctx.translate(S.x,S.wl);ctx.rotate(S.r);vSOV();ctx.restore();
  // thrusters wash (dynamic positioning)
  alphaDo(.6,()=>{for(let i=0;i<4;i++){const k=(TT*1.4+i/4)%1;circ(S.x+14-k*30,S.wl+14+k*8,3+k*6,`rgba(230,245,255,${.5*(1-k)})`);}});
  const B=S.P(117,-46),e=ease(seg(u,.22,.4)),T={x:lerp(B.x+20,GW_TIP.x,e),y:lerp(B.y-4,GW_TIP.y,e)};
  box(B.x-6,B.y-10,12,12,'#e9b21f');
  ln([B.x,B.y-6,T.x,T.y],'#8f9aa1',5);ln([B.x,B.y-14,T.x,T.y-9],'#e9b21f',1.4);
  for(let i=1;i<6;i++){const p=lerpPt({x:B.x,y:B.y-6},T,i/6);ln([p.x,p.y,p.x,p.y-9],'#e9b21f',1);}
  const w=seg(u,.44,.8);if(w>0)for(let j=0;j<3;j++){const f=clamp(w*1.6-j*.3);if(f<=0||f>=1)continue;const p=lerpPt({x:B.x,y:B.y-6},T,f);person(p.x,p.y-2,'#e8572a',.9);}
  if(u>.8)for(let j=0;j<3;j++)person(TX-46+j*9,TP_TOP-4,'#e8572a',.9);
  lab(S.P(40,-10).x,S.P(40,-10).y,'運維母船（SOV）',{dx:-40,dy:60,a:band(u,.02,.3),st:'s'});
  lab(S.P(10,6).x,S.P(10,6).y,'動態定位推進器',{dx:-40,dy:60,a:band(u,.08,.24),minor:true});
  lab((B.x+T.x)/2,(B.y+T.y)/2-8,'動態補償舷梯',{dx:-20,dy:-60,a:band(u,.26,.7),st:'s'});
  lab(TX-30,TP_TOP-3,'工作平台',{dx:60,dy:40,a:band(u,.3,.62)});
  lab(S.P(180,-50).x,S.P(180,-50).y,'住艙與備品倉庫',{dx:30,dy:-60,a:band(u,.78,1)});
 },
 hud(u){hudPanel(230,150,'舷梯動態補償',seg(u,.04,.1),w=>{const S=sov3();
  hrow(52,'示性波高','2.2 m',w);
  hrow(78,'船身起伏',(S.hv>=0?'+':'')+(S.hv*.14).toFixed(1)+' m',w,'#f2c230');hbar(14,86,w-28,.5+S.hv/14,'#f2c230');
  hrow(118,'舷梯端點','0.0 m',w,'#7dffc4');
  hrow(142,'登塔人員',trf('{n} 人',{n:Math.round(3*clamp(seg(u,.44,.86)))}),w);});}},
/* 4 */{t:'海纜監測：看不見的風險',en:'Watching the cables',dur:14,
 d:'陣列海纜與輸出海纜通常埋在海床下 1 到 2 公尺，但海流與沙波移動會讓覆蓋層變薄，甚至讓海纜裸露、懸空。根據 DNV 的統計，離岸風電保險理賠成本中約 75 到 80% 與海纜故障有關。海纜內的光纖可做分散式溫度量測（DTS）：埋得越淺，散熱越快、溫度越低，異常段落一目了然；再配合定期的多音束測深調查確認埋深，及早補上保護。',
 s:[[0,'海纜埋在海床下約 1–2 公尺，隔絕錨害與海流'],[.25,'海纜內的光纖沿線量測溫度，異常段落一目了然'],[.5,'調查船以多音束聲納掃描海床，確認埋設深度'],[.76,'沙波移動讓海纜裸露，需要及早拋石或覆蓋保護']],
 draw(u){
  diagBG();
  // cross-section
  const X0=60,X1=1100,wl=478,bedF=x=>606+6*Math.sin(x*.02)+46*bump(x,860,55),cabY=x=>636+2*Math.sin(x*.013);
  card(X0,440,X1-X0,360,{bg:'rgba(7,27,39,.78)'});ctx.save();rrp(X0+1,440,X1-X0-2,358,14);ctx.clip();
  box(X0,wl,X1-X0,200,'rgba(59,147,187,.32)');ln([X0,wl,X1,wl],'rgba(255,255,255,.75)',1.5);
  ctx.beginPath();ctx.moveTo(X0,bedF(X0));for(let x=X0;x<=X1;x+=6)ctx.lineTo(x,bedF(x));ctx.lineTo(X1,810);ctx.lineTo(X0,810);ctx.closePath();ctx.fillStyle='rgba(181,154,106,.85)';ctx.fill();
  for(let i=0;i<5;i++){const x0=680+i*34;poly([x0,bedF(x0),x0+22,bedF(x0+22)-10,x0+30,bedF(x0+30)],'rgba(217,195,147,.9)');}
  const C=[];for(let x=X0;x<=X1;x+=8)C.push({x,y:cabY(x)});drawCable(C);
  ln([180,bedF(180),180,cabY(180)],'#fff',1.2);wt(190,(bedF(180)+cabY(180))/2+6,'埋深 1–2 m',15,'#fff',700);
  // survey vessel with multibeam fan
  const sv=lerp(120,1000,seg(u,.46,.8)),sa=band(u,.46,.84);
  if(sa>0)alphaDo(sa,()=>{const g=ctx.createLinearGradient(0,wl,0,bedF(sv));g.addColorStop(0,'rgba(125,255,196,.35)');g.addColorStop(1,'rgba(125,255,196,.08)');
    poly([sv,wl+6,sv-70,bedF(sv-70),sv+70,bedF(sv+70)],g);
    ctx.beginPath();ctx.moveTo(sv-70,bedF(sv-70));for(let x=sv-70;x<=sv+70;x+=5)ctx.lineTo(x,bedF(x));ctx.strokeStyle='#7dffc4';ctx.lineWidth=2.4;ctx.stroke();
    ctx.save();ctx.translate(sv-40,wl);ctx.scale(.7,.7);vSurvey();ctx.restore();});
  const sc=seg(u,.72,.8);if(sc>0)alphaDo(sc,()=>{ring(860,cabY(860),34,'#e8572a',2.4);});
  ctx.restore();
  wt(X0+18,470,'海纜剖面（示意）',18,'#f2c230',700);
  alphaDo(seg(u,.72,.8),()=>wt(860,cabY(860)+62,'沙波移動，海纜裸露',16,'#ff9d7a',700,'center'));
  alphaDo(band(u,.48,.72),()=>wt(sv,wl+40>548?548:wl+40,'多音束測深',15,'#7dffc4',700,'center'));
  // DTS chart aligned with the cross-section (distance 0–1.5 km across X0–X1)
  const c=chartBox(X0,150,X1-X0,270,{title:'光纖量測的海纜溫度（°C，示例）',x0:0,x1:1.5,y0:15,y1:35,xt:[0,.5,1,1.5],yt:[15,25,35],xl:'沿海纜距離（km）',pl:64,pr:36,pt:62,pb:50,gx:6,gy:4});
  const px2d=x=>(x-c.px)/c.pw*1.5;
  const f=ease(seg(u,.2,.46));if(f>0){const P=[];for(let x=c.px;x<=c.px+c.pw*f;x+=4){const d=(x-c.px)/c.pw*1.5;P.push({x,y:c.Y(dtsT(d))});}pathLine(P,'#7dffc4',2.6);}
  const d0=px2d(860);
  alphaDo(seg(u,.4,.46),()=>{ln([860,c.Y(dtsT(d0))+8,860,c.py+c.ph],'rgba(232,87,42,.8)',1.4);circ(860,c.Y(dtsT(d0)),6,'#e8572a');wt(876,c.Y(19),'溫度異常偏低',16,'#ff9d7a',700,'left');});
  alphaDo(seg(u,.24,.3),()=>wt(c.px+c.pw,c.py-10,'光纖分散式溫度量測（DTS）',15,'rgba(227,236,238,.85)',600,'right'));
  // right column
  alphaDo(seg(u,.02,.08),()=>{card(1140,150,400,270,{bg:'rgba(232,87,42,.08)',st:'rgba(232,87,42,.45)'});
   wt(1164,190,'為什麼要盯緊海纜',19,'#fff',700);
   wt(1164,262,'75–80',52,'#ff9d7a',700,'left',COND);wt(1164+wtw('75–80',52,700,COND)+8,262,'%',28,'#ff9d7a',700,'left',COND);
   wrap15(1164,298,'離岸風電保險理賠成本中，與海纜故障有關的比例（DNV）',352,15,'rgba(227,236,238,.88)',500,22);});
  alphaDo(seg(u,.8,.86),()=>{card(1140,440,400,360,{bg:'rgba(7,27,39,.8)'});wt(1164,480,'發現裸露之後',19,'#7dffc4',700);
   const T=['以 ROV 近距離檢視','拋石或覆蓋保護墊','縮短下一次調查間隔'];
   T.forEach((t,i)=>{const a=seg(u,.82+i*.05,.87+i*.05);alphaDo(a,()=>{tag(1164,516+i*80,String(i+1),{bg:'#7dffc4',fg:'#0e2a3b',size:17});wrap15(1212,538+i*80,t,300,17,'#fff',600,22);});});});
 }},
/* 5 */{t:'無人機巡檢葉片',en:'Drone blade inspection',dur:13,side:true,
 d:'葉片長度超過 100 公尺，過去要靠技術人員以繩索垂降逐段檢查。現在多改用無人機：風機停機、轉子鎖定後，無人機沿著每支葉片的前緣、後緣與兩側飛行，拍下數百張高解析影像，一部風機約 30 分鐘到 1 小時即可完成（典型）。影像上傳後，由軟體自動辨識前緣侵蝕、裂紋與雷擊痕跡並標出位置，工程師再依嚴重程度排定修補。',
 s:[[0,'風機停機、轉子鎖定，無人機從工作船起飛'],[.25,'沿著葉片前緣逐段飛行，拍下高解析影像'],[.55,'接近葉尖的前緣最容易磨損，影像中標出侵蝕位置'],[.8,'軟體自動辨識瑕疵，依嚴重程度排定修補']],
 cam:u=>camMix({x:700,y:330,s:1.25},{x:620,y:260,s:1.75},ease(seg(u,.08,.24))),
 draw(u){
  const hub={x:TX-44,y:TW_TOP-20},A0=Math.PI/2;
  turb15(TX,A0);
  vsl(TX+100,77,true,{tilt:.8},vCTV);
  const tipD={x:hub.x,y:hub.y+BR},aU=A0-TAU/3,tipU={x:hub.x+Math.cos(aU)*BR,y:hub.y+Math.sin(aU)*BR},nU={x:-Math.sin(aU),y:Math.cos(aU)};
  const D=kf(u,[[0,TX+62,SEA-24],[.16,hub.x-40,hub.y+20],[.44,hub.x-34,tipD.y],[.56,hub.x+34,tipD.y-10],[.62,hub.x+30,hub.y+30],[.66,hub.x+26+nU.x*30,hub.y-12+nU.y*30],[.86,tipU.x+nU.x*34,tipU.y+nU.y*34],[1,tipU.x+nU.x*40,tipU.y+nU.y*40+30]]);
  const scan=(u>.18&&u<.56)||(u>.66&&u<.88);
  if(scan){const tx=u<.6?hub.x-3:D.x-nU.x*30,ty=u<.6?D.y:D.y-nU.y*30;alphaDo(.5,()=>poly([D.x,D.y+4,tx-8*(u<.6?0:1),ty-10,tx+8*(u<.6?0:1),ty+10],'rgba(125,255,196,.35)'));}
  // defects appear once the drone has passed them
  const DF=[[.33,.84,'w'],[.4,.93,'w'],[.24,.52,'n']];
  DF.forEach(([t0,s,k])=>{if(u<t0+.04)return;const p={x:hub.x-3,y:hub.y+BR*s};alphaDo(seg(u,t0+.04,t0+.08),()=>{ring(p.x,p.y,7,k==='w'?'#e8572a':'#f2c230',2);});});
  drone15(D.x,D.y);
  lab(hub.x,hub.y,'停機並鎖定轉子',{dx:-80,dy:-40,a:band(u,.02,.2)});
  lab(D.x,D.y,'無人機',{dx:60,dy:-40,a:band(u,.06,.36),st:'s'});
  lab(hub.x-3,hub.y+BR*.84,'前緣侵蝕',{dx:-90,dy:20,a:band(u,.46,.84),st:'w'});
  lab(hub.x-3,hub.y+BR*.52,'塗層細裂紋',{dx:-90,dy:-20,a:band(u,.5,.84),minor:true});
  lab(tipU.x,tipU.y,'下一支葉片',{dx:50,dy:40,a:band(u,.66,.84)});
  lab(hub.x-3,hub.y+BR*.93,'AI 自動標記瑕疵',{dx:80,dy:40,a:band(u,.8,1),st:'g'});
 },
 hud(u){hudPanel(230,150,'無人機巡檢（示例）',seg(u,.04,.1),w=>{const p=clamp(seg(u,.18,.56)*.33+seg(u,.66,.88)*.33);
  hrow(52,'巡檢進度',Math.round(p*100)+'%',w,'#f2c230');hbar(14,60,w-28,p,'#f2c230');
  hrow(94,'影像',trf('{n} 張',{n:Math.round(p*600)}),w);
  hrow(120,'發現瑕疵',trf('{n} 處',{n:DF15(u)}),w,'#ff9d7a');hrow(142,'單機巡檢','約 30–60 分',w);});}},
/* 6 */{t:'葉片前緣侵蝕與修補',en:'Leading-edge erosion and repair',dur:15,
 d:'大型離岸風機的葉尖速度約 90 公尺每秒（典型），雨滴、鹽霧與沙塵高速撞擊葉片前緣，塗層會逐漸變粗糙、出現凹坑，嚴重時玻纖層外露。前緣不再平滑，氣流提早分離、升力下降，年發電量可能減少數個百分點。修補由技術人員以繩索或平台吊掛到位，打磨清潔、填補修形，再貼上前緣保護膜或塗上彈性保護塗層，需要風小、乾燥的天候。',
 s:[[0,'葉尖以約 90 m/s 的速度掃過雨滴與鹽霧'],[.25,'前緣塗層由粗糙、凹坑到玻纖外露，逐步惡化'],[.5,'氣流提早分離、升力下降，發電量隨之減少'],[.72,'技術人員吊掛到位，打磨、填補並加上前緣保護']],
 draw(u){
  diagBG();
  card(60,150,800,650,{bg:'rgba(7,27,39,.78)'});wt(84,190,'為什麼前緣會磨損',21,'#fff',700);
  const LX=250,LY=380,CH=560,P=foil15(LX,LY,CH,.2);
  // streamlines
  const sep=seg(u,.5,.62);
  for(let j=0;j<5;j++){const y0=LY-80+j*38;ctx.beginPath();for(let x=90;x<=840;x+=8){const s=(x-LX)/CH;let y=y0;
    if(s>-.1&&s<1.05){const up=y0<LY;const bnd=up?LY-thk(clamp(s),.2)*CH-14:LY+thk(clamp(s),.2)*CH*.55+12;y=up?Math.min(y0,bnd):Math.max(y0,bnd);
     if(up&&s>.35)y+=sep*(j<2?1:0)*18*Math.sin((x+TT*120)*.05)*clamp((s-.35)*3);}
    x===90?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=sep>0&&j<2?'rgba(255,157,122,.6)':'rgba(125,200,220,.45)';ctx.lineWidth=1.4;ctx.stroke();}
  poly(P.flat(),'#eef2f4','rgba(60,80,95,.6)',1);
  // rain streaks hitting the leading edge
  for(let i=0;i<14;i++){const k=(TT*1.6+i/14)%1,y=LY-50+((i*37)%100);const x=lerp(100,LX+4,k);if(k<.96)ln([x,y,x+16,y],'rgba(200,235,255,.8)',1.6);else circ(LX+6,y,3,'rgba(200,235,255,.8)');}
  // erosion grows with u
  const er=seg(u,.22,.5),r=rng(7);
  for(let i=0;i<24;i++){const a=(r()-.5)*2.4,rr=r(),sz=1.5+r()*4;if(rr>er)continue;const cx=LX+6+Math.abs(Math.sin(a))*16+r()*8,cy=LY+Math.sin(a)*30;circ(cx,cy,sz*(er>.66?1.4:1),er>.66&&rr<.3?'#b99870':'#8a99a3');}
  wt(LX-20,LY-80,'前緣',17,'#f2c230',700,'right');wt(LX+CH-10,LY+50,'後緣',17,'rgba(227,236,238,.8)',700,'right');
  alphaDo(seg(u,.02,.08),()=>{wt(100,LY+110,'葉尖速度',16,'rgba(227,236,238,.8)',600);wt(100,LY+150,'約 90 m/s',32,'#f2c230',700,'left',COND);});
  alphaDo(seg(u,.5,.56),()=>wt(700,LY-110,'氣流提早分離',17,'#ff9d7a',700,'center'));
  const ST=[['第 1 階段','塗層變粗糙'],['第 2 階段','出現凹坑'],['第 3 階段','玻纖層外露']];
  ST.forEach((s,i)=>{const a=seg(u,.24+i*.08,.3+i*.08);if(a<=0)return;const x=84+i*256;alphaDo(a,()=>{
   card(x,560,236,112,{bg:i===2?'rgba(232,87,42,.14)':'rgba(255,255,255,.05)',st:i===2?'rgba(232,87,42,.5)':undefined});
   wt(x+18,598,s[0],16,i===2?'#ff9d7a':'#f2c230',700);wt(x+18,636,s[1],18,'#fff',700);});});
  alphaDo(seg(u,.54,.6),()=>{wt(84,716,'年發電量損失（典型）',16,'rgba(227,236,238,.85)',600);
   const k=ease(seg(u,.56,.7));box(84,730,740,14,'rgba(255,255,255,.12)');box(84,730,740*.62*k,14,'#ff9d7a');
   wt(84+740*.62*k+10,745,'可達數個百分點',18,'#ff9d7a',700);wt(84,778,'前緣越粗糙，升力越低、阻力越大',15,'rgba(227,236,238,.75)',500);});
  // right: repair steps
  card(900,150,640,650,{bg:'rgba(7,27,39,.78)'});wt(924,190,'修補步驟',21,'#fff',700);
  // technician on ropes beside a blade section
  const bx=1360;alphaDo(seg(u,.66,.72),()=>{box(bx,220,40,300,'#eef2f4');box(bx-5,220,6,300,'rgba(242,194,48,.9)');ln([bx-30,205,bx-30,330+8*Math.sin(TT)],'#e3d9b8',1.4);ln([bx-20,205,bx-20,330+8*Math.sin(TT)],'#e3d9b8',1.4);
   person(bx-24,350+8*Math.sin(TT),'#e8572a',4);wt(bx+20,550,'前緣保護',15,'#f2c230',700,'center');});
  const R=[['吊掛到位','繩索垂降或吊籃平台'],['打磨清潔','去除受損塗層與污物'],['填補修形','以填料恢復前緣曲線'],['加上保護','貼保護膜或塗彈性塗層'],['檢查紀錄','拍照記錄，供下次巡檢比對']];
  R.forEach((s,i)=>{const a=seg(u,.66+i*.05,.7+i*.05);const y=236+i*96;alphaDo(Math.max(.25,a),()=>{
   circ(944,y,18,a>=1?'#f2c230':'rgba(255,255,255,.12)');wt(944,y+7,String(i+1),19,a>=1?'#0e2a3b':'#fff',700,'center',COND);
   wt(978,y-2,s[0],19,'#fff',700);wt(978,y+26,s[1],15,'rgba(227,236,238,.8)',500);
   if(i<4)ln([944,y+22,944,y+74],'rgba(255,255,255,.2)',2);});});
  alphaDo(seg(u,.9,.96),()=>wrap15(924,740,'需要風小、乾燥的天候，台灣多避開東北季風季節施作',330,15,'#7dffc4',600,21));
 }},
/* 7 */{t:'從資料到派工',en:'From data to work orders',dur:12,
 d:'現代風場的運維是資料驅動的。每部風機的監控與資料擷取系統（SCADA）持續回傳運轉數據，狀態監測系統分析齒輪箱與軸承振動，再加上無人機影像、海纜光纖量測與海象預報，全部匯入遠端監控中心。工程師判斷優先順序後排出工單，配合天候窗口派遣 SOV 或 CTV 出勤。運維約占離岸風場生命週期成本的 20 到 35%，做得好就能維持 97% 以上的可用率。',
 s:[[0,'風機、海纜與無人機的資料持續匯入遠端監控中心'],[.3,'工程師判斷優先順序，排出工單'],[.55,'配合天候窗口，派遣 SOV 或 CTV 出勤'],[.78,'運維約占生命週期成本的 20–35%，目標可用率 97% 以上']],
 draw(u){
  diagBG();
  const IN=['SCADA 運轉數據','振動狀態監測','無人機影像','海纜光纖監測','海象預報'];
  const C1={x:470,y:260,w:300,h:180},C2={x:850,y:260,w:300,h:180},C3={x:1230,y:230,w:310,h:240};
  IN.forEach((t,i)=>{const a=seg(u,.02+i*.03,.08+i*.03);if(a<=0)return;const y=160+i*84;alphaDo(a,()=>{
   card(60,y,330,64,{bg:'rgba(7,27,39,.8)'});circ(88,y+32,7,'#7dffc4');wt(106,y+39,t,18,'#fff',600);
   const s={x:390,y:y+32},e={x:C1.x,y:C1.y+C1.h/2};ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.bezierCurveTo(430,s.y,430,e.y,e.x,e.y);ctx.strokeStyle='rgba(125,255,196,.4)';ctx.lineWidth=2;ctx.stroke();
   const k=(TT*.6+i*.23)%1,m=1-k,p={x:m*m*m*s.x+3*m*m*k*430+3*m*k*k*430+k*k*k*e.x,y:m*m*m*s.y+3*m*m*k*s.y+3*m*k*k*e.y+k*k*k*e.y};circ(p.x,p.y,4,'#7dffc4');});});
  const bx=(B,t,sub,col,a)=>{if(a<=0)return;alphaDo(a,()=>{card(B.x,B.y,B.w,B.h,{bg:'rgba(7,27,39,.85)',st:col});wt(B.x+B.w/2,B.y+B.h/2-4,t,22,col,700,'center');wrap15(B.x+B.w/2,B.y+B.h/2+30,sub,B.w-40,15,'rgba(227,236,238,.8)',500,21,'center');});};
  bx(C1,'遠端監控中心','24 小時判讀異常','#7dffc4',seg(u,.16,.24));
  alphaDo(seg(u,.3,.36),()=>arrow(C1.x+C1.w+8,C1.y+C1.h/2,C2.x-8,C2.y+C2.h/2,'#f2c230',3));
  bx(C2,'工單與排程','依優先順序排定工作','#f2c230',seg(u,.3,.38));
  alphaDo(seg(u,.55,.6),()=>arrow(C2.x+C2.w+8,C2.y+C2.h/2,C3.x-8,C3.y+C3.h/2,'#f2c230',3));
  alphaDo(seg(u,.55,.63),()=>{card(C3.x,C3.y,C3.w,C3.h,{bg:'rgba(7,27,39,.85)',st:'#f2c230'});wt(C3.x+24,C3.y+40,'出勤',22,'#f2c230',700);
   const RW=[['SOV','長時間、大型工作'],['CTV','好天氣的日常維護'],['直升機','緊急搶修']],cx2=C3.x+40+Math.max(...RW.map(r=>wtw(r[0],20,700,COND)));
   RW.forEach((r,i)=>{wt(C3.x+24,C3.y+88+i*50,r[0],20,'#fff',700,'left',COND);wrap15(cx2,C3.y+88+i*50,r[1],C3.x+C3.w-16-cx2,16,'rgba(227,236,238,.85)',500,19);});});
  alphaDo(seg(u,.4,.5),()=>{wt(C2.x+C2.w/2,C2.y+C2.h+40,'天候窗口',17,'#58b8d0',700,'center');
   for(let i=0;i<7;i++){const ok=[1,1,0,0,1,1,1][i];box(C2.x+20+i*38,C2.y+C2.h+56,30,20,ok?'rgba(125,255,196,.7)':'rgba(232,87,42,.7)');}});
  // lifecycle cost bar
  const b=seg(u,.76,.84);if(b<=0)return;alphaDo(b,()=>{
   card(60,600,1480,200,{bg:'rgba(242,194,48,.06)',st:'rgba(242,194,48,.4)'});wt(84,640,'離岸風場生命週期成本（典型示例）',20,'#f2c230',700);
   const SEGS=[['風機與設備',.42,'#58b8d0'],['基礎、海纜與安裝',.28,'#7dc8dc'],['運維 20–35%',.30,'#f2c230']];let x=84;const W=1080*ease(seg(u,.78,.92));
   SEGS.forEach(s=>{const w=W*s[1];box(x,664,Math.max(0,w-4),44,s[2]);if(w>120)wt(x+12,693,s[0],16,'#0e2a3b',700);x+=w;});
   wt(1200,660,'可用率目標',16,'rgba(227,236,238,.85)',600);wt(1200,712,'97%+',46,'#7dffc4',700,'left',COND);
   wt(84,752,'運維做得好，風機停機時間短，每年多發的電就能回收成本',16,'rgba(227,236,238,.85)',500);});
 }}
]};
function DF15(u){return (u>.29?1:0)+(u>.37?1:0)+(u>.44?1:0);}
