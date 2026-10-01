// KITS: marine
/* ================= EP22 離岸風電如何併網 ================= */
/* complete fixed-bottom turbine at cx */
function turb22(cx,ang){
  const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);
  drawNacelle(cx,TW_TOP,0,true);drawRotor(cx-44,TW_TOP-20,ang,3);
}
function far22(x,s,ang){const h=150*s,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([x,hy,x+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(x,hy,3*s,'#eef2f4');}
function oss22(){drawJacket(OX,bedOX,bedOX-SEA+20,true);drawTopside(OX,SEA-20,0);}
/* text wrapped to a width (after translation) */
function wrap22(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
/* cable routes: array (turbine → OSS), export (OSS → landfall → onshore substation) */
const ARR22=(()=>{const P=[{x:TX+16,y:bedY(TX)-20},{x:TX+34,y:bedY(TX+34)+2}];for(let x=TX+40;x<=OX-70;x+=8)P.push({x,y:bedY(x)+2});P.push({x:OX-62,y:bedOX-15});return P;})();
const EXP22=(()=>{const P=[{x:OX+62,y:bedOX-15},{x:OX+80,y:bedY(OX+80)+2}];for(let x=OX+88;x<HDD_EXIT;x+=8)P.push({x,y:bedY(x)+2});for(let t=0;t<=1.0001;t+=.05)P.push(hddPt(t));return P;})();
/* energy path used for the flowing dots */
const FLOW22=ARR22.concat([{x:OX-48,y:SEA-34},{x:OX+48,y:SEA-34}]).concat(EXP22).concat([{x:1574,y:420},{x:1593,y:402},{x:1632,y:334},{x:1760,y:328}]);
function plen22(P){const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i].x-P[i-1].x,P[i].y-P[i-1].y));return L;}
const FLOWL22=plen22(FLOW22),EXPR22=EXP22.slice().reverse().concat([{x:OX+48,y:SEA-34},{x:OX-48,y:SEA-34}]).concat(ARR22.slice().reverse()),EXPRL22=plen22(EXPR22);
function ptAt22(P,L,d){const T=L[L.length-1];if(d<=0)return P[0];if(d>=T)return P[P.length-1];let i=1;while(L[i]<d)i++;const k=(d-L[i-1])/(L[i]-L[i-1]||1);return {x:lerp(P[i-1].x,P[i].x,k),y:lerp(P[i-1].y,P[i].y,k)};}
function flow22(P,L,f,n,sp,colAt){const T=L[L.length-1];for(let i=0;i<n;i++){const d=(TT*sp+i*T/n)%T;if(d>T*f)continue;const p=ptAt22(P,L,d);circ(p.x,p.y,3.4,colAt(d/T));}}
const flowCol22=k=>k<.36?'#f2c230':'#ff9d7a';
function seaScene22(ang){
  for(const [x,s,p] of [[180,.55,.4],[330,.42,1.1],[1000,.42,1.7]])far22(x,s,ang+p);
  turb22(TX,ang);oss22();drawOnshore(1);drawHDD(1);drawPylon();
  drawCable(ARR22);drawCable(EXP22);
}
/* LVRT */
const lvrtReq22=t=>t<0?.88:t<.15?0:t<1.5?lerp(0,.88,(t-.15)/1.35):.88;
const vFault22=t=>t<0?1:t<.12?.08:t<.7?lerp(.08,1,easeOut((t-.12)/.58)):1;
/* forecast vs actual (MW, 48 h) */
const act22=h=>clamp(330+170*Math.sin(h/6.5+.4)+70*Math.sin(h/2.3)+40*Math.sin(h*1.7)-(h>30&&h<36?160*Math.sin((h-30)/6*Math.PI):0),20,600);
const fc22=h=>clamp(330+170*Math.sin((h-1.2)/6.5+.4)+50*Math.sin((h-.8)/2.3)-(h>31&&h<36?90*Math.sin((h-31)/5*Math.PI):0),20,600);
/* curtailment shot: output over the shot */
const avail22=600,cmd22=u=>u<.26?600:u<.76?450:600;
function out22(u){if(u<.36)return 600;if(u<.76)return Math.max(450,600-150*seg(u,.36,.54));return Math.min(600,450+150*seg(u,.8,.98));}

const EP={no:22,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'離岸風電如何併網',en:'Connecting offshore wind to the grid',
lede:'風機轉起來只是第一步，電還要穩穩地送進台電的電網。這一集沿著電力的路徑，從風機、海上變電站、輸出海纜一路到陸上變電站與併網點，再看電網規範要求風場做到什麼：電壓與虛功的調整、電網故障時的低電壓穿越，以及每天的發電預測與降載調度。',
facts:[['345','kV','台灣首座離岸風電 345 kV 陸上變電站於 2025 年送電，併入台電最高電壓等級'],['0.15','秒','併網點電壓降到 0 時，風機至少要維持併聯的時間（台電併聯技術要點）'],['88–110','%','責任分界點電壓在這個範圍內，風機必須持續運轉'],['0.96–0.98','功率因數','特高壓併接風場須具備落後 0.96 到超前 0.98 的虛功調整能力'],['4.8','GW','台灣離岸風電累計裝置容量，2026 年 6 月完成第 500 部風機'],['10','%','台電委託 EPRI 研究建議額外準備的備轉容量，以再生能源裝置容量計']],
note:'說明：本集為教育用途示意動畫，距離、水深與設備尺寸經過壓縮。電壓運轉範圍 88–110%、功率因數 0.96 落後至 0.98 超前、電壓降至 0 時維持併聯 0.15 秒，取自台電「再生能源發電系統併聯技術要點」公開內容；低電壓穿越曲線 0.15 秒之後的恢復段為示意，實際以最新版要點為準。風場出力 600 MW、降載指令、升降載率每分鐘 10%、預測曲線、頻率變化與各設備電壓為典型範例，並非特定案場資料；陸上變電站升壓等級依併網點不同，也有 161 kV。備轉容量 10% 取自台電電力調度處 2017 年簡報引述之 EPRI 研究。',
shots:[
/* 1 */{t:'電從海上到電網',en:'From the sea to the grid',dur:14,side:true,
 d:'離岸風機發出的電要經過好幾段才進入電網。風機內的變壓器先把電壓升到 66 kV，由陣列海纜把一串風機的電匯集到海上變電站；變電站再升壓到 220 kV，經輸出海纜送往岸邊，以水平導向鑽掘穿過海岸線進入陸上變電站。陸上變電站把電壓調整到台電輸電網的 345 kV 或 161 kV，在併網點與台電的系統相接，從這裡開始由台電調度。',
 s:[[0,'風機發出的電，先由陣列海纜以 66 kV 匯集'],[.24,'海上變電站升壓到 220 kV，經輸出海纜送往岸邊'],[.5,'海纜穿過海岸線，進入陸上變電站'],[.72,'在併網點接上台電 345 kV 輸電網']],
 cam:u=>camMix({x:820,y:440,s:.95},{x:1440,y:410,s:1.8},ease(seg(u,.46,.62))),
 draw(u){
  seaScene22(TT*1.1);
  const f=ease(seg(u,.04,.74));
  alphaDo(.55,()=>pathLine(partial(FLOW22,f),'rgba(242,194,48,.6)',3));
  flow22(FLOW22,FLOWL22,f,46,140,flowCol22);
  lab(TX,TW_TOP-10,'風機',{dx:60,dy:-40,a:band(u,.02,.22),st:'s'});
  lab(TX+230,bedY(TX+230)+2,'陣列海纜 66 kV',{dx:-30,dy:60,a:band(u,.08,.3)});
  lab(OX,SEA-90,'海上變電站升壓',{dx:-40,dy:-60,a:band(u,.22,.46),st:'s'});
  lab(1260,bedY(1260)+2,'輸出海纜 220 kV',{dx:-60,dy:60,a:band(u,.3,.5)});
  const hp=hddPt(.45);lab(hp.x,hp.y,'登陸段',{dx:-60,dy:40,a:band(u,.54,.74),minor:true});
  lab(1545,428,'陸上變電站',{dx:-40,dy:-60,a:band(u,.56,.86),st:'s'});
  lab(1632,330,'台電輸電網 345 kV',{dx:-60,dy:-40,a:band(u,.72,1),st:'g'});
 },
 hud(u){hudPanel(230,150,'風場送電（示例）',seg(u,.04,.1),w=>{const st=u<.24?0:u<.5?1:u<.72?2:3,c=i=>i===st?'#f2c230':'rgba(227,236,238,.85)';
  hrow(52,'風場出力','600 MW',w,'#7dffc4');hrow(78,'陣列海纜','66 kV',w,c(0));hrow(104,'輸出海纜','220 kV',w,c(1));hrow(130,'併網點','345 kV',w,st>=2?'#f2c230':c(3));});}},
/* 2 */{t:'一張單線圖看懂併網',en:'The connection in one line diagram',dur:14,
 d:'把整條路徑畫成單線圖，就能看清每一段的電壓與責任。風機到陸上變電站屬於開發商的設備，陸上變電站除了升壓，還裝有虛功補償設備，抵消長距離海纜的充電電流，並以濾波器抑制變流器產生的諧波。責任分界點裝有計量電表與保護斷路器，往外就是台電的變電所與輸電線。台電在彰化沿海規劃了彰工、永興等併網點，2017 年的規劃目標是 2025 年提供約 6.5 GW 的併網容量。',
 s:[[0,'每一段的電壓：0.69、66、220，再到 345 kV'],[.3,'陸上變電站負責升壓、虛功補償與濾波'],[.55,'責任分界點以內屬開發商，以外屬台電'],[.76,'彰化沿海的併網點，承接大量離岸風電']],
 draw(u){
  diagBG();
  const N=[['風機','0.69 → 66 kV','機艙或塔底變壓器'],['陣列海纜','66 kV','5–8 部風機一串'],['海上變電站','66 → 220 kV','主變壓器與 GIS'],
   ['輸出海纜','220 kV','登陸後接陸纜'],['陸上變電站','220 → 345 kV','虛功補償與濾波'],['台電併網點','345／161 kV','輸電網與調度']];
  const W=212,G=34,x0=72,y0=196,H=214;
  wt(x0,180,'電力路徑單線圖（典型）',20,'#f2c230',700);
  N.forEach((n,i)=>{const a=seg(u,.02+i*.05,.07+i*.05),x=x0+i*(W+G),tp=i===5;
   alphaDo(Math.max(.18,a),()=>{card(x,y0+10,W,H,{bg:tp?'rgba(125,255,196,.08)':'rgba(7,27,39,.82)',st:tp?'rgba(125,255,196,.45)':undefined});
    wt(x+W/2,y0+50,n[0],19,'#fff',700,'center');
    // symbol
    const cy=y0+100,cx=x+W/2;
    if(i===0){circ(cx-16,cy,16,null,'#f2c230',2.4);wt(cx-16,cy+6,'G',16,'#f2c230',700,'center',COND);circ(cx+18,cy,12,null,'#f2c230',2);circ(cx+32,cy,12,null,'#f2c230',2);}
    else if(i===1||i===3){ln([x+24,cy,x+W-24,cy],'#121416',8);ln([x+24,cy,x+W-24,cy],i===1?'#f2c230':'#ff9d7a',2.6);}
    else if(i===2||i===4){circ(cx-9,cy,15,null,'#ff9d7a',2.4);circ(cx+9,cy,15,null,'#ff9d7a',2.4);if(i===4){ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.strokeRect(cx+38,cy-14,16,28);}}
    else{ln([cx-36,cy-16,cx+36,cy-16],'#7dffc4',3);ln([cx-36,cy,cx+36,cy],'#7dffc4',3);ln([cx-36,cy+16,cx+36,cy+16],'#7dffc4',3);}
    wt(x+W/2,y0+156,n[1],22,i>1?'#ff9d7a':'#f2c230',700,'center',COND);
    wrap22(x+W/2,y0+188,n[2],W-24,15,'rgba(227,236,238,.82)',500,19,'center');});
   if(i<5&&a>=1)arrowR(x+W+4,y0+110,G-8,'rgba(227,236,238,.7)');});
  // responsibility boundary
  const bx=x0+5*(W+G)-G/2;
  alphaDo(seg(u,.52,.58),()=>{ctx.setLineDash([8,6]);ln([bx,y0-6,bx,y0+H+30],'#e8572a',2.4);ctx.setLineDash([]);
   tag(bx,y0+H+48,'責任分界點',{bg:'#e8572a',fg:'#fff',size:16,align:'center'});
   wt(bx-14,y0+H+86,'← 開發商',16,'rgba(227,236,238,.9)',700,'right');wt(bx+14,y0+H+86,'台電 →',16,'#7dffc4',700,'left');});
  // onshore substation detail
  const ya=540;
  alphaDo(seg(u,.28,.34),()=>{card(60,ya,840,260,{bg:'rgba(7,27,39,.8)'});wt(84,ya+38,'陸上變電站裡做什麼',20,'#fff',700);
   const R=[['升壓','調整到輸電網電壓','#ff9d7a'],['虛功補償','電抗器與 STATCOM 抵消海纜充電電流','#7dffc4'],['諧波濾波','抑制變流器產生的諧波','#58b8d0'],['計量與保護','電表與斷路器設在分界點','#f2c230']];
   R.forEach((r,i)=>{const a=seg(u,.32+i*.05,.36+i*.05),x=84+(i%2)*410,y=ya+70+Math.floor(i/2)*92;alphaDo(Math.max(.25,a),()=>{
    box(x,y,6,72,r[2]);wt(x+20,y+24,r[0],18,r[2],700);wrap22(x+20,y+52,r[1],360,15,'rgba(227,236,238,.85)',500,20);});});});
  alphaDo(seg(u,.74,.8),()=>{card(940,ya,600,260,{bg:'rgba(125,255,196,.06)',st:'rgba(125,255,196,.35)'});wt(964,ya+38,'彰化沿海的併網點',20,'#fff',700);
   wt(964,ya+112,'6.5 GW',44,'#7dffc4',700,'left',COND);wrap22(964+wtw('6.5 GW',44,700,COND)+20,ya+86,'2017 年規劃：2025 年前提供的離岸風電併網容量',330,15,'rgba(227,236,238,.85)',500,20);
   ln([964,ya+150,1516,ya+150],'rgba(255,255,255,.15)',1.4);
   wt(964,ya+198,'345 kV',36,'#ff9d7a',700,'left',COND);wrap22(964+wtw('345 kV',36,700,COND)+20,ya+178,'2025 年首座 345 kV 離岸風電陸上變電站送電',330,15,'rgba(227,236,238,.85)',500,20);});
 }},
/* 3 */{t:'電網規範：風場要像電廠',en:'Grid code: behave like a power plant',dur:13,
 d:'早期的小型電源在電網出狀況時可以先行脫離，但一座離岸風場動輒數百 MW，若在關鍵時刻跳脫，就會讓整個系統失去一大塊電力。因此台電的併聯技術要點要求特高壓併接的風場：責任分界點電壓在額定的 88% 到 110% 之間必須持續運轉；具備落後 0.96 到超前 0.98 的功率因數調整能力；電壓驟降時不可立即跳脫；並能接受調度降載。後續區塊開發還新增低頻穿越與高頻初級頻率控制等要求。',
 s:[[0,'數百 MW 的風場若突然跳脫，整個電網都會受影響'],[.25,'電壓在 88% 到 110% 之間，必須持續運轉'],[.5,'送出或吸收虛功，協助穩定併網點電壓'],[.75,'電壓驟降不跳脫，並能接受調度降載']],
 draw(u){
  diagBG();
  card(60,150,700,650,{bg:'rgba(7,27,39,.78)'});
  wt(84,192,'責任分界點電壓（p.u.）',19,'#f2c230',700);
  const gx0=110,gx1=710,gy=262,V=v=>lerp(gx0,gx1,(v-.8)/.4);
  box(gx0,gy-10,gx1-gx0,20,'rgba(232,87,42,.35)');
  const ga=ease(seg(u,.2,.3));box(V(.88),gy-10,(V(1.1)-V(.88))*ga,20,'rgba(125,255,196,.55)');
  [.8,.88,1,1.1,1.2].forEach(v=>{ln([V(v),gy+12,V(v),gy+20],'rgba(227,236,238,.6)',1.4);wt(V(v),gy+42,v.toFixed(2),16,v===.88||v===1.1?'#7dffc4':'rgba(227,236,238,.75)',600,'center',COND);});
  const vv=1+.04*Math.sin(TT*1.3)+.02*Math.sin(TT*3.1);poly([V(vv),gy-14,V(vv)-9,gy-30,V(vv)+9,gy-30],'#f2c230');
  alphaDo(seg(u,.26,.3),()=>wt((V(.88)+V(1.1))/2,gy-42,'持續運轉區',16,'#7dffc4',700,'center'));
  // P-Q wedge
  ln([84,330,736,330],'rgba(255,255,255,.15)',1.4);
  wt(84,372,'功率因數範圍：虛功調整能力',19,'#f2c230',700);
  const ox=410,oy=760,P=300,kq=2.1,ql=Math.tan(Math.acos(.96))*P*kq,qd=Math.tan(Math.acos(.98))*P*kq,wa=ease(seg(u,.45,.56));
  ln([ox-280,oy,ox+280,oy],'rgba(255,255,255,.5)',1.4);ln([ox,oy,ox,oy-P-40],'rgba(255,255,255,.5)',1.4);
  wt(ox+8,oy-P-14,'P 實功率',15,'rgba(227,236,238,.8)',600,'left');
  wt(ox+278,oy+26,'送出虛功 →',15,'rgba(227,236,238,.8)',600,'right');wt(ox-278,oy+26,'← 吸收虛功',15,'rgba(227,236,238,.8)',600,'left');
  if(wa>0){alphaDo(wa,()=>{poly([ox,oy,ox+ql,oy-P,ox-qd,oy-P],'rgba(125,255,196,.22)','#7dffc4',2);
   wt(ox+ql+8,oy-P+6,'落後 0.96',17,'#7dffc4',700,'left',COND);wt(ox-qd-8,oy-P+6,'超前 0.98',17,'#7dffc4',700,'right',COND);
   const q=Math.sin(TT*.9)*.8,p=P*(.75+.15*Math.sin(TT*.5)),qx=q>0?q*ql*p/P:q*qd*p/P;circ(ox+qx,oy-p,7,'#f2c230');ln([ox,oy,ox+qx,oy-p],'rgba(242,194,48,.6)',1.6);
   wt(ox,404,'運轉點須落在綠色範圍內（示意）',15,'rgba(227,236,238,.75)',500,'center');});}
  // requirement list
  wt(800,184,'特高壓併接風場的主要要求',20,'#fff',700);
  const R=[['電壓運轉範圍','88–110%','分界點電壓在此範圍內須持續運轉',.18],['虛功調整','0.96–0.98','落後 0.96 到超前 0.98 的功率因數',.44],
   ['低電壓持續運轉','0 p.u.／0.15 s','電網故障、電壓驟降時不可立即跳脫',.66],['實功率控制','降載與升降載率','接受調度指令，限制出力變化速度',.76],['頻率支援','低頻穿越','後續區塊開發新增，含高頻初級頻率控制',.86]];
  R.forEach((r,i)=>{const a=seg(u,r[3],r[3]+.06),y=206+i*118;alphaDo(Math.max(.2,a),()=>{
   card(800,y,740,106,{bg:'rgba(7,27,39,.82)',st:a>=1?'rgba(242,194,48,.4)':undefined});
   circ(836,y+40,18,a>=1?'#f2c230':'rgba(255,255,255,.12)');wt(836,y+47,String(i+1),18,a>=1?'#0e2a3b':'#fff',700,'center',COND);
   wt(870,y+44,r[0],19,'#fff',700);wt(1516,y+46,r[1],24,'#f2c230',700,'right',COND);
   wrap22(870,y+80,r[2],640,15,'rgba(227,236,238,.82)',500,20);});});
 }},
/* 4 */{t:'低電壓穿越：故障時撐住',en:'Low-voltage ride-through',dur:14,
 d:'輸電線遭雷擊或短路時，附近的電壓會在一瞬間掉到接近零，保護電驛通常在 0.1 秒左右把故障隔離。台電要求特高壓併接的風機在電壓降到 0 時至少維持併聯 0.15 秒，之後電壓回升的過程中也要留在線上，稱為低電壓穿越（LVRT）。故障期間，風機的變流器改為送出虛功電流，幫忙把電壓撐起來，故障清除後再恢復實功率。如果數百 MW 的風電同時跳脫，系統頻率會明顯下降。',
 s:[[0,'輸電線短路，併網點電壓瞬間掉到接近零'],[.28,'電壓在曲線上方，風機就必須保持併聯'],[.5,'故障期間變流器送出虛功電流，撐起電壓'],[.72,'若 600 MW 同時跳脫，頻率會明顯下降']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,900,650,{title:'低電壓持續運轉曲線（示意）',x0:-.3,x1:3,y0:0,y1:1.2,xt:[0,.5,1,1.5,2,2.5,3],yt:[0,.2,.4,.6,.8,1,1.2],xl:'時間（秒）',yl:'電壓（p.u.）',pt:84,pb:60,gx:6,gy:6});
  const ra=ease(seg(u,.18,.3));
  if(ra>0){alphaDo(ra,()=>{ctx.beginPath();ctx.moveTo(c.X(0),c.Y(0));for(let t=0;t<=3;t+=.01)ctx.lineTo(c.X(t),c.Y(lvrtReq22(t)));ctx.lineTo(c.X(3),c.Y(0));ctx.closePath();ctx.fillStyle='rgba(232,87,42,.18)';ctx.fill();
   const P=[];for(let t=0;t<=3;t+=.01)P.push({x:c.X(t),y:c.Y(lvrtReq22(t))});pathLine(P,'#e8572a',3);
   wt(c.X(2.1),c.Y(.4),'允許跳脫區',18,'#ff9d7a',700,'center');wt(c.X(1.9),c.Y(1.08),'必須保持併聯',18,'#7dffc4',700,'center');
   wt(c.X(.2),c.Y(.06)-8,'0 p.u.／0.15 s',16,'#ff9d7a',700,'left',COND);
   ctx.setLineDash([5,5]);ln([c.X(-.3),c.Y(.88),c.X(3),c.Y(.88)],'rgba(125,255,196,.5)',1.4);ctx.setLineDash([]);wt(c.X(2.98),c.Y(.88)-8,'0.88',15,'#7dffc4',700,'right',COND);});}
  const fa=seg(u,.04,.5);
  if(fa>0){const t1=lerp(-.3,3,fa),P=[];for(let t=-.3;t<=t1;t+=.005)P.push({x:c.X(t),y:c.Y(vFault22(t))});pathLine(P,'#121416',6);pathLine(P,'#7dc8dc',3);}
  alphaDo(band(u,.08,.4),()=>{ln([c.X(0),c.Y(1.16),c.X(0),c.Y(.12)],'rgba(255,255,255,.5)',1.2);wt(c.X(0)+8,c.Y(1.13),'短路發生',16,'#fff',700,'left');});
  alphaDo(band(u,.14,.44),()=>wt(c.X(.12)+12,c.Y(.2),'約 0.1 秒故障清除',16,'rgba(227,236,238,.9)',600,'left'));
  // right: what the turbine does
  card(1000,150,540,300,{bg:'rgba(7,27,39,.8)'});wt(1024,190,'故障期間風機在做什麼',19,'#fff',700);
  const S=[['維持併聯','變流器不跳脫，等待故障清除'],['送出虛功電流','協助併網點電壓回升'],['恢復實功率','電壓回穩後逐步回到原出力']];
  S.forEach((s,i)=>{const a=seg(u,.46+i*.06,.5+i*.06),y=236+i*70;alphaDo(Math.max(.2,a),()=>{
   circ(1040,y,16,a>=1?'#7dffc4':'rgba(255,255,255,.12)');wt(1040,y+6,String(i+1),17,a>=1?'#0e2a3b':'#fff',700,'center',COND);
   wt(1068,y+2,s[0],18,'#fff',700);wrap22(1068,y+28,s[1],450,15,'rgba(227,236,238,.8)',500,20);});});
  // frequency comparison
  const f=chartBox(1000,470,540,330,{title:'系統頻率（示意）',x0:0,x1:10,y0:59.5,y1:60.1,xt:[0,5,10],yt:[59.6,59.8,60],xl:'秒',pt:60,pb:52,pl:70,gx:2,gy:3});
  const ka=ease(seg(u,.7,.92));
  if(ka>0){const A=[],B=[],t1=10*ka;for(let t=0;t<=t1;t+=.05){const trip=t<1?60:60-.38*Math.sin(Math.min(1,(t-1)/2.4)*Math.PI/2)+(t>3.4?.2*seg(t,3.4,9):0);
    const ok=t<1?60:60-.03*Math.exp(-(t-1)*.8)*Math.sin(Math.min(1,(t-1)*2)*Math.PI/2);A.push({x:f.X(t),y:f.Y(trip)});B.push({x:f.X(t),y:f.Y(ok)});}
   pathLine(A,'#ff9d7a',2.6);pathLine(B,'#7dffc4',2.6);
   alphaDo(seg(u,.8,.86),()=>{wt(f.X(4.2),f.Y(59.58),'風電同時跳脫',15,'#ff9d7a',700,'left');wt(f.X(4.2),f.Y(60.04),'低電壓穿越成功',15,'#7dffc4',700,'left');});}
 }},
/* 5 */{t:'發電預測：明天會吹多少風',en:'Forecasting tomorrow\'s wind',dur:13,
 d:'風電的出力跟著天氣變化，調度中心必須事先知道明天大概會有多少風電，才能安排其他機組與備轉容量。風場結合數值天氣預報、風機 SCADA 回傳的風速風向與出力，以及歷史資料建立的模型，提出日前預測，當天再滾動更新。鋒面或颱風外圍環流通過時，預測與實際可能出現明顯落差，因此需要額外準備備轉容量；台電委託 EPRI 的研究建議，約為再生能源裝置容量的 10%。',
 s:[[0,'前一天先提出明天每小時的出力預測'],[.3,'實際出力隨著天氣變化，逐小時揭曉'],[.58,'鋒面通過時，預測與實際出現落差'],[.8,'落差要靠備轉容量與其他機組補上']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,980,500,{title:'離岸風場出力：預測與實際（示例）',x0:0,x1:48,y0:0,y1:600,xt:[0,6,12,18,24,30,36,42,48],yt:[0,200,400,600],xl:'小時',yl:'MW',pt:80,gx:8,gy:3});
  const ba=ease(seg(u,.04,.16));
  if(ba>0)alphaDo(ba,()=>{ctx.beginPath();for(let h=0;h<=48;h+=.5)ctx.lineTo(c.X(h),c.Y(Math.min(600,fc22(h)+40+3*h)));for(let h=48;h>=0;h-=.5)ctx.lineTo(c.X(h),c.Y(Math.max(0,fc22(h)-40-3*h)));ctx.closePath();ctx.fillStyle='rgba(242,194,48,.14)';ctx.fill();
   const F=[];for(let h=0;h<=48;h+=.25)F.push({x:c.X(h),y:c.Y(fc22(h))});pathLine(F,'#f2c230',2.4,[8,6]);});
  const h1=48*ease(seg(u,.26,.86));
  if(h1>0){const A=[];for(let h=0;h<=h1;h+=.2)A.push({x:c.X(h),y:c.Y(act22(h))});pathLine(A,'#121416',5);pathLine(A,'#7dffc4',2.6);
   circ(c.X(h1),c.Y(act22(h1)),6,'#7dffc4');ln([c.X(h1),c.Y(600),c.X(h1),c.Y(0)],'rgba(255,255,255,.25)',1.2);}
  alphaDo(seg(u,.08,.14),()=>{ln([800,190,830,190],'#f2c230',2.4);wt(840,196,'日前預測',15,'#f2c230',700);box(930,182,24,14,'rgba(242,194,48,.25)');wt(962,196,'區間',15,'rgba(227,236,238,.8)',600);});
  alphaDo(seg(u,.26,.3),()=>{ln([800,214,830,214],'#7dffc4',2.6);wt(840,220,'實際出力',15,'#7dffc4',700);});
  alphaDo(band(u,.6,1),()=>{const x=c.X(33);ring(x,c.Y(act22(33)),26,'#e8572a',2.2);wt(x,c.Y(act22(33))+52,'鋒面通過：落差',16,'#ff9d7a',700,'center');});
  // inputs
  const I=[['數值天氣預報','風速、風向、氣壓'],['風機 SCADA','即時風速與出力'],['歷史資料與模型','統計與機器學習']];
  I.forEach((s,i)=>{const a=seg(u,.12+i*.05,.16+i*.05),x=60+i*334;alphaDo(Math.max(.2,a),()=>{card(x,672,312,128,{bg:'rgba(7,27,39,.8)'});
   box(x,672,6,128,'#58b8d0');wt(x+24,712,s[0],18,'#fff',700);wrap22(x+24,744,s[1],270,15,'rgba(227,236,238,.82)',500,20);});});
  // right: how it is used
  card(1080,150,460,650,{bg:'rgba(7,27,39,.8)'});wt(1104,192,'預測用在哪裡',20,'#fff',700);
  const T=[['日前','安排明天的機組組合與備轉容量'],['日內','滾動更新預測，修正排程'],['即時','調度中心監看出力，調整其他機組']];
  T.forEach((s,i)=>{const a=seg(u,.3+i*.08,.34+i*.08),y=240+i*104;alphaDo(Math.max(.2,a),()=>{
   rrp(1104,y,120,40,3);ctx.fillStyle=a>=1?'#f2c230':'rgba(255,255,255,.1)';ctx.fill();wt(1164,y+27,s[0],17,a>=1?'#0e2a3b':'#fff',700,'center');
   wrap22(1240,y+16,s[1],276,15,'rgba(227,236,238,.86)',500,21);if(i<2)ln([1164,y+46,1164,y+96],'rgba(255,255,255,.2)',2);});});
  alphaDo(seg(u,.8,.86),()=>{card(1104,566,412,210,{bg:'rgba(232,87,42,.08)',st:'rgba(232,87,42,.45)'});
   wt(1128,640,'10%',52,'#ff9d7a',700,'left',COND);wrap22(1128,680,'額外備轉容量，以再生能源裝置容量計（台電委託 EPRI 研究）',364,15,'rgba(227,236,238,.88)',500,21);});
 }},
/* 6 */{t:'降載調度：聽從電網的指令',en:'Curtailment and dispatch',dur:13,side:true,
 d:'當輸電線路壅塞、離峰時段供過於求，或電網需要保留調節空間時，調度中心會對風場下達降載指令。指令經通訊系統送到陸上變電站的風場控制器，再透過海纜裡的光纖分配到每一部風機，風機以變槳讓葉片少吃一點風，把出力降到指定值。降載與回升都要依照設定的升降載率逐步進行，避免出力變化太快衝擊電網。指令解除後，風場才回到可用的最大出力。',
 s:[[0,'風況良好，風場以 600 MW 滿載送電'],[.26,'調度中心因線路壅塞，下達降載到 450 MW 的指令'],[.4,'指令經海纜光纖送到每一部風機，以變槳降載'],[.78,'指令解除，依升載率逐步回到滿載']],
 cam:u=>({x:840,y:430,s:.95}),
 draw(u){
  seaScene22(TT*1.1);
  const ok=u<.26||u>.78;
  flow22(FLOW22,FLOWL22,1,ok?46:Math.round(46*out22(u)/600),140,flowCol22);
  // command signal: waves from the right, then along the fibre back to the turbine
  if(u>.26&&u<.42){const k=seg(u,.26,.34);for(let i=0;i<3;i++){const r=((TT*1.4+i/3)%1);alphaDo((1-r)*.8,()=>{ctx.beginPath();ctx.arc(1700,300,30+r*140,Math.PI*.6,Math.PI*1.25);ctx.strokeStyle='#7dffc4';ctx.lineWidth=2.4;ctx.stroke();});}
   if(k>=1){const g=seg(u,.34,.42),d=EXPRL22[EXPRL22.length-1]*g,p=ptAt22(EXPR22,EXPRL22,d);circ(p.x,p.y,7,'#7dffc4');ring(p.x,p.y,13+3*Math.sin(TT*8),'#7dffc4',2);}}
  if(u>.78&&u<.86){const g=seg(u,.78,.86),d=EXPRL22[EXPRL22.length-1]*g,p=ptAt22(EXPR22,EXPRL22,d);circ(p.x,p.y,7,'#7dffc4');ring(p.x,p.y,13+3*Math.sin(TT*8),'#7dffc4',2);}
  if(u>.42&&u<.76)alphaDo(band(u,.42,.76)*(.5+.3*Math.sin(TT*5)),()=>ring(TX-44,TW_TOP-20,26,'#f2c230',2.4));
  lab(1560,410,'調度指令',{dx:-60,dy:-70,a:band(u,.26,.4),st:'g'});
  lab(1250,bedY(1250)+2,'海纜光纖傳送指令',{dx:-60,dy:60,a:band(u,.32,.46)});
  lab(TX-44,TW_TOP-20,'變槳降載',{dx:90,dy:30,a:band(u,.44,.76),st:'s'});
  lab(OX,SEA-90,'風場控制',{dx:-40,dy:-60,a:band(u,.36,.56),minor:true});
  lab(TX-44,TW_TOP-20,'逐步回到滿載',{dx:90,dy:30,a:band(u,.82,1),st:'g'});
 },
 hud(u){hudPanel(230,150,'風場調度（示例）',seg(u,.04,.1),w=>{const p=Math.round(out22(u)),cm=cmd22(u);
  hrow(52,'可用功率',trf('{n} MW',{n:avail22}),w);
  hrow(78,'調度指令',cm<600?trf('{n} MW',{n:cm}):'不限制',w,cm<600?'#e8572a':'#7dffc4');
  hrow(104,'實際出力',trf('{n} MW',{n:p}),w,'#f2c230');hbar(14,112,w-28,p/600,'#f2c230');
  hrow(140,'升降載率','每分鐘 10%',w);});}}
]};
