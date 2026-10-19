// KITS: land
/* 水力系列 第 3 集：魚道與生態流量 */
/* 側視河段（示意，比例壓縮）：左側攔河堰上游、右側減水河段與廠房 */
const WX=690,UB=560,DB=650,PHX=1000,WLU=470;
const PIPE=[[650,548],[690,556],[760,566],[1000,566]];
const FWL=1460;
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1;const p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4,col));}}
function fishS(x,y,s,dir,col){
  const w=Math.sin(TT*9+x*.05)*.18;
  ctx.save();ctx.translate(x,y);ctx.scale(dir*s,s);
  ctx.beginPath();ctx.ellipse(0,0,17,7,0,0,TAU);ctx.fillStyle=col||'#b8d6e0';ctx.fill();
  ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(-27,-8+w*20);ctx.lineTo(-27,8+w*20);ctx.closePath();ctx.fill();
  circ(10,-2,1.6,'#13232e');
  ctx.restore();
}
/* 河段側視：dLow 為減水河段水深、dFull 為其他河段水深 */
function riverScene(dLow,o){
  o=o||{};
  ctx.beginPath();ctx.moveTo(-200,1000);ctx.lineTo(-200,330);ctx.lineTo(500,300);ctx.lineTo(900,360);ctx.lineTo(1300,320);ctx.lineTo(1800,360);ctx.lineTo(1800,1000);ctx.closePath();ctx.fillStyle='#7f9e62';ctx.fill();
  const r=rng(9);for(let i=0;i<36;i++)circ(-100+r()*1800,360+r()*150,8+r()*5,'#5d8646');
  /* 河岸後方的廠房（背景平面） */
  box(PHX-20,584,170,16,'#8f7d68');
  box(PHX,516,130,70,'#d9dfe2','rgba(0,0,0,.35)',1.5);poly([PHX-8,516,PHX+65,486,PHX+138,516],'#8a4a3a');
  for(let k=0;k<3;k++)box(PHX+14+k*38,540,24,18,'#6f8a9a');
  /* 水體 */
  const gU=ctx.createLinearGradient(0,WLU,0,UB);gU.addColorStop(0,'#4ea3c4');gU.addColorStop(1,'#1d5f86');
  box(-200,WLU,WX+200,UB-WLU+2,gU);
  const wlD=x=>DB-(x<PHX+90?dLow:40);
  ctx.beginPath();ctx.moveTo(WX+60,DB+2);ctx.lineTo(WX+60,wlD(WX+60));ctx.lineTo(PHX+90,wlD(PHX));ctx.lineTo(PHX+90,DB-40);ctx.lineTo(1800,DB-40);ctx.lineTo(1800,DB+8);ctx.closePath();ctx.fillStyle='#3f93b8';ctx.fill();
  for(let k=0;k<7;k++){const x=((k*97+TT*14)%600)-150;ln([x,WLU+6,x+26,WLU+6],'rgba(255,255,255,.45)',1.5);}
  /* 河床 */
  ctx.beginPath();ctx.moveTo(-200,1000);ctx.lineTo(-200,UB);ctx.lineTo(WX,UB);ctx.lineTo(WX+10,DB);ctx.lineTo(1800,DB+6);ctx.lineTo(1800,1000);ctx.closePath();ctx.fillStyle='#8f7d68';ctx.fill();
  ctx.beginPath();ctx.moveTo(-200,1000);ctx.lineTo(-200,UB+60);ctx.lineTo(WX,UB+60);ctx.lineTo(WX+10,DB+60);ctx.lineTo(1800,DB+66);ctx.lineTo(1800,1000);ctx.closePath();ctx.fillStyle='#716a62';ctx.fill();
  /* 取水口與引水管（管埋在堰基後再露出） */
  ctx.lineCap='round';ln(PIPE.flat(),'#44535c',14);ln(PIPE.flat(),'#5f7f92',7);ctx.lineCap='butt';
  for(let x=800;x<PHX;x+=70)ln([x,PIPE[2][1]+4,x,wlD(x)-2],'#6b5a48',4);
  box(WX-60,520,26,56,'#9aa4aa','rgba(0,0,0,.35)',1.5);for(let k=0;k<4;k++)ln([WX-58,526+k*13,WX-38,526+k*13],'#44535c',1.5);
  /* 堰體 */
  poly([WX,WLU-14,WX+54,WLU-14,WX+60,DB,WX,UB+4],'#b8c0c4','rgba(0,0,0,.35)',2);
  for(let k=1;k<4;k++)ln([WX,WLU+k*36,WX+56,WLU+k*36],'rgba(0,0,0,.12)',1.5);
}
const EP={no:3,slug:'hydropower',seriesName:'水力系列',t:'魚道與生態流量',en:'Fishways and ecological flow',
lede:'小水力不必築大壩，但只要攔河取水，河裡的魚與下游的水量就會受到影響。這一集看攔河堰如何擋住洄游魚類、取水後出現的減水河段，再談「該留多少水給河」的經驗法則、三種魚道的構造與池堰式魚道的爬升原理，最後整理台灣小水力在生態檢核上的做法。',
facts:[['10 / 30 / 60','%','Tennant 經驗法則：占年平均流量比例，短期生存下限／良好棲地／優良棲地'],
['約 0.3','m','池堰式魚道單池落差的典型範例，落差過大魚就跳不過去'],
['7 × 0.3','m','7 級池子爬升約 2.1 m 的堰高（示例）'],
['1,167','kW','年平均流量 10 m³/s、取水 7 m³/s、落差 20 m、效率 0.85 的出力（示例）'],
['2,000','kW','裝置容量達此規模的小水力須經主管機關邀集專家審查（依媒體報導）'],
['47','處','水利署 2008 年公布的台灣河川小水力潛力點']],
note:'說明：本集為教育用途示意動畫，河段、堰體與魚道比例經過壓縮，並非特定電廠外形。Tennant 經驗法則（1976，美國蒙大拿河川）的 10%、30%、60% 為經驗值，各國河川仍需現地棲地調查，不可直接套用；台灣小水力須檢附生態檢核證明、達 2,000 kW 或位於環境敏感區須專家審查、2024 年底公告《小水力發電設施設置指引》鼓勵設於圳路與管渠，取自能源署修正辦法之媒體報導與公視、地球公民基金會等報導；潛力點 47 處取自水利署 2008 年公布資料（媒體報導）。流量、落差、效率、魚道單池落差與池數為「典型範例」數字，僅供說明。',
base:()=>{landSky(640,{sun:{x:1240,y:110},clouds:false});},
shots:[
{t:'攔河取水之後',en:'After the weir',dur:13,side:true,
 d:'川流式小水力在河中築一道低矮的攔河堰，把部分水引進取水口，經管路送到廠房發電，再從尾水回到河裡。這樣不必蓄水，但河道從堰到尾水口之間的水會變少，稱為減水河段。更直接的問題是：堰是一道牆，從下游往上游洄游的魚、蝦與蟹被擋在堰下，無法回到上游的棲地產卵或覓食；往下游漂流的幼魚也可能被引進取水口。因此取水之外，還要規劃讓水與魚都能通過的設施。',
 s:[[0,'攔河堰把河水墊高，水從取水口被引走'],[.3,'堰到尾水口之間的河段，水量變少'],[.58,'往上游洄游的魚被堰擋在下方'],[.82,'取水之外，還要讓水與魚都能通過']],
 cam:u=>camMix({x:800,y:450,s:1},{x:850,y:470,s:1.1},ease(seg(u,.1,.7))),
 draw(u){
  const k=ease(seg(u,.3,.5));
  riverScene(lerp(40,12,k));
  flowDots(PIPE,6,'#dff6ff',seg(u,.28,.34),.5,4);
  flowDots([[PHX+65,586],[PHX+65,606]],2,'#dff6ff',seg(u,.4,.5),.8,3.5);
  /* 魚往上游游，被堰擋住後折返 */
  const f=seg(u,.5,.95),fx=lerp(1380,WX+90,ease(Math.min(f*1.4,1)))+(f>.72?(f-.72)*500:0),fy=DB-22-Math.sin(f*9)*4;
  alphaDo(seg(u,.5,.56),()=>{fishS(fx,fy,1.1,f>.72?1:-1,'#ffd27a');fishS(fx+70,fy+6,.9,f>.72?1:-1,'#b8d6e0');});
  alphaDo(band(u,.58,1),()=>{wt(WX+95,DB-96,'×',44,'#e8572a',900,'center');});
  lab(WX+27,WLU-10,'攔河堰',{dx:-60,dy:-90,st:'s',a:band(u,.04,.3)});
  lab(WX-47,548,'取水口',{dx:-120,dy:-60,a:band(u,.14,.4)});
  lab(PHX+65,500,'廠房',{dx:30,dy:-90,st:'l',a:band(u,.2,.5)});
  lab(860,DB-14,'減水河段',{dx:0,dy:80,st:'w',a:band(u,.32,.7)});
  lab(WX+95,DB-30,'洄游魚被擋住',{dx:90,dy:70,st:'w',a:band(u,.6,1)});
 },
 hud(u){hudPanel(250,150,'河道水量（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.3,.5));
  hrow(56,'河川來水','10 m³/s',w,'#7dc8dc');hrow(88,'發電取水',trf('{q} m³/s',{q:(7*k).toFixed(1)}),w,'#f2c230');hrow(120,'留在河道',trf('{q} m³/s',{q:(10-7*k).toFixed(1)}),w,'#7dffc4');});}},

{t:'減水河段與放流量',en:'Bypassed reach and release flow',dur:13,
 d:'從平面看，河水在攔河堰分成兩條路：一條進入取水口、引水道與廠房，發電後在尾水口回到河裡；另一條留在原本的河道，也就是減水河段。留在河道裡的水量，稱為放流量或生態流量，它要維持河道的水深與流速，讓水生生物有地方棲息、洄游，也讓沿岸的水質與地下水不致惡化。關鍵在於這個水量要「常態放流」，不能等發電用不完才放，否則枯水期河道可能乾涸。圖中以年平均來水 10 m³/s 為例，取水 7、放流 3。',
 s:[[0,'河水在堰前分成兩條路'],[.3,'一條經取水口與引水道進廠房發電'],[.56,'另一條留在原河道，就是生態流量'],[.8,'放流必須常態進行，不是有餘才放']],
 draw(u){
  diagBG();
  card(60,160,940,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'取水與放流（平面示意）',20,'#f2c230',700);
  const RY=500,WXp=450;
  /* 上游河道 */
  box(90,RY-34,WXp-90,68,'#2f86a8');
  const reach=[[WXp,RY],[880,RY]],canal=[[WXp-10,RY-30],[WXp-10,330],[800,330],[800,380]],tailr=[[800,380],[840,380],[880,RY-16]];
  box(WXp,RY-12,430,24,'#2f86a8');box(880,RY-34,110,68,'#2f86a8');
  ln([WXp-10,RY-34,WXp-10,330,800,330],'#3a93b4',18);
  box(WXp-16,RY-44,20,88,'#b8c0c4','rgba(0,0,0,.4)',2);
  box(780,380-30,120,80,'#d9dfe2','rgba(0,0,0,.35)',1.5);wt(840,396,'廠房',16,'#13232e',700,'center');
  ln([800,380,880,RY-34],'#3a93b4',14);
  /* 流動點 */
  const sp=.18;
  const dots=(P,n,col,a)=>{if(a<=0)return;for(let k=0;k<n;k++){const p=ptAt(P,((TT*sp)+k/n)%1);alphaDo(a,()=>circ(p[0],p[1],4.5,col));}};
  dots([[100,RY],[WXp-10,RY]],7,'#dff6ff',seg(u,.04,.1));
  dots([[WXp-10,RY-30],[WXp-10,330],[800,330],[800,380]],7,'#f2c230',seg(u,.3,.36));
  dots([[WXp,RY],[880,RY]],3,'#7dffc4',seg(u,.54,.6));
  dots([[880,RY-16],[960,RY]],6,'#dff6ff',seg(u,.6,.66));
  alphaDo(seg(u,.78,.84),()=>{wt(660,RY+56,'枯水期也不能中斷',17,'#e8572a',700,'center');});
  wt(WXp-10,RY+80,'攔河堰',16,'#f2c230',700,'center');
  wt(WXp+60,RY-66,'減水河段（放流）',16,'#7dffc4',700,'left');
  wt(110,RY-56,'上游來水',16,'rgba(227,236,238,.85)',600,'left');
  wt(560,310,'引水道',16,'#f2c230',700,'center');
  wt(930,RY+62,'匯回原河道',16,'rgba(227,236,238,.85)',600,'center');
  /* 水量帳 */
  card(1030,160,510,640,{bg:'rgba(7,27,39,.75)'});wt(1054,200,'一年平均流量帳（示例）',20,'#f2c230',700);
  const rows=[['河川來水',10,'#7dc8dc',0,.06],['發電取水',7,'#f2c230',.3,.38],['放流（留在河道）',3,'#7dffc4',.54,.62]];
  rows.forEach(([n,v,col,a0,a1],i)=>{const y=270+i*130,g=ease(seg(u,a0,a1));
   wt(1054,y,n,18,'#fff',600);box(1054,y+18,400,26,'rgba(255,255,255,.1)');box(1054,y+18,40*v*g,26,col);
   wt(1054+40*v*g+10,y+38,Math.round(v*g*10)/10+' m³/s',22,col,700,'left',COND);});
  alphaDo(seg(u,.82,.88),()=>{card(1054,660,462,110,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});
   wt(1074,700,'放流量 = 河道的最低生命線',18,'#7dffc4',700);wt(1074,736,'依水深、流速與魚類需求訂定',16,'#fff',500);});
 }},

{t:'該留多少水給河',en:'How much water to leave',dur:13,
 d:'放流量該訂多少，沒有放諸四海皆準的答案。一個常被引用的經驗法則是美國 Tennant 在 1976 年提出的方法，以占年平均流量的比例判斷河流的棲地狀況：約 10% 是短期生存的下限，河道變淺變窄，魚被擠進深潭；約 30% 可維持良好的水生棲地；約 60% 則接近優良到極佳。這個方法來自美國蒙大拿州的河川，台灣的溪流坡陡、流量變化大，仍要靠現地調查水深、流速與魚類需求，並隨豐枯水期調整，才能訂出合適的放流量。',
 s:[[0,'同一條河，留的水量不同，棲地差很多'],[.28,'約 10%：水淺，魚擠在深潭，只是短期生存下限'],[.52,'約 30%：水深與流速足夠，可維持良好棲地'],[.76,'約 60%：接近優良；實際仍需現地調查']],
 draw(u){
  diagBG();
  const cols=[['10%','短期生存下限',.1,.04,'#e8572a','水淺、魚擠進深潭'],['30%','良好的水生棲地',.45,.3,'#f2c230','水深與流速足夠'],['60%','優良到極佳',.8,.54,'#7dffc4','棲地多樣、可洄游']];
  cols.forEach(([pct,n,h,t,col,sub],i)=>{const x=60+i*500,a=seg(u,t,t+.06),k=ease(seg(u,t,t+.2));
   card(x,160,480,500,{bg:'rgba(7,27,39,.75)',st:a>.5?col:'rgba(255,255,255,.16)'});
   wt(x+24,206,trf('占年平均流量 {p}',{p:pct}),22,col,700);wt(x+24,238,n,18,'rgba(227,236,238,.85)',600);
   alphaDo(a,()=>{
    const cx=x+240,top=300,bot=600,hb=90,ht=160;
    poly([cx-ht,top,cx-hb,bot,cx+hb,bot,cx+ht,top,cx+ht+70,top,cx+ht+70,bot+30,cx-ht-70,bot+30,cx-ht-70,top],'#8f7d68');
    const fr=h*k,wh=(bot-top)*fr,wy=bot-wh,hw=hb+(ht-hb)*fr,xl=cx-hw,xr=cx+hw;
    poly([xl,wy,xr,wy,cx+hb,bot,cx-hb,bot],'rgba(79,170,205,.85)');
    ln([xl,wy,xr,wy],'rgba(255,255,255,.7)',2);
    /* 魚：10% 時擠在深潭一小塊 */
    if(i===0){for(let q=0;q<4;q++)fishS(cx-30+q*18,bot-18-(q%2)*8,.8,q%2?1:-1,'#b8d6e0');}
    else if(i===1){for(let q=0;q<3;q++)fishS(cx-90+q*80+Math.sin(TT+q)*8,bot-34-(q%2)*22,.9,q%2?1:-1,'#b8d6e0');}
    else{for(let q=0;q<5;q++)fishS(cx-130+q*65+Math.sin(TT+q)*10,bot-30-(q%3)*40,1,q%2?1:-1,'#b8d6e0');}
    wt(cx,640,sub,17,'#fff',600,'center');
   });});
  alphaDo(seg(u,.8,.86),()=>{card(60,690,1480,100,{bg:'rgba(232,87,42,.16)',st:'rgba(232,87,42,.5)'});
   wt(90,732,'注意',20,'#e8572a',700);wt(190,732,'這是蒙大拿河川的經驗值，不能直接套用到台灣溪流',18,'#fff',600);
   wt(190,768,'坡陡、流量變化大 → 要現地量水深與流速，並依豐枯水期調整',17,'rgba(227,236,238,.85)',500);});
 }},

{t:'三種魚道',en:'Three kinds of fishway',dur:13,
 d:'魚道是在堰旁開出的一條「樓梯」，把一道大落差拆成許多小落差，讓魚一階一階游上去。池堰式魚道以隔牆分成一個個水池，水從隔牆頂部或孔口流下，魚在池間跳躍或穿越，構造簡單、最常見。垂直縫隙式魚道的隔牆開有上下貫通的窄縫，水位變化時仍能通過，魚可以在水中直接游過，適合水位波動大、需要兼顧不同魚種的河川。近自然式魚道則用塊石鋪成緩坡的小溪，能同時讓魚、蝦與蟹通過，但需要較長的距離與空間。',
 s:[[0,'魚道把一道大落差拆成許多小落差'],[.28,'池堰式：隔牆分成水池，魚一池一池往上'],[.52,'垂直縫隙式：窄縫上下貫通，水位變化也能過'],[.76,'近自然式：塊石緩坡，魚蝦蟹都能通過']],
 draw(u){
  diagBG();
  const cols=[['池堰式','Pool and weir',.04],['垂直縫隙式','Vertical slot',.28],['近自然式','Nature-like ramp',.52]];
  cols.forEach(([n,en,t],i)=>{const x=60+i*500,a=seg(u,t,t+.06);
   card(x,160,480,520,{bg:'rgba(7,27,39,.75)',st:a>.5?'rgba(242,194,48,.5)':'rgba(255,255,255,.16)'});
   wt(x+24,204,n,22,'#f2c230',700);wt(x+24,234,en,16,'rgba(227,236,238,.85)',500);
   alphaDo(a,()=>{
    if(i===0){ /* 側視階梯 */
     for(let k=0;k<5;k++){const bx=x+50+k*80,sy=540-k*44;
      box(bx,sy,80,600-sy,'rgba(79,170,205,.8)');box(bx+72,sy-44+10,10,600-sy+34,'#b8c0c4');ln([bx,sy,bx+80,sy],'rgba(255,255,255,.6)',2);}
     box(x+30,600,430,16,'#8f7d68');
     fishS(x+90+((TT*40)%320),520-((TT*40)%320)*.55,.9,1,'#ffd27a');
     wt(x+240,650,'隔牆分池，一次爬一小階',16,'#fff',600,'center');
    }else if(i===1){ /* 平面：隔牆開縫，水流呈 S 形 */
     box(x+30,290,420,300,'rgba(79,170,205,.55)','#b8c0c4',2);
     for(let k=0;k<4;k++){const bx=x+100+k*86,sl=k%2?0:1;
      box(bx,290,10,sl?240:240,'#b8c0c4');
      if(sl)box(bx-1,520,12,70,'rgba(79,170,205,.9)');else box(bx-1,290,12,60,'rgba(79,170,205,.9)');}
     for(let k=0;k<5;k++){const f=((TT*.2)+k/5)%1;const px=x+50+f*380,py=440+Math.sin(f*TAU*2)*80;alphaDo(.8,()=>circ(px,py,4,'#dff6ff'));}
     fishS(x+120+((TT*30)%260),440+Math.sin(((TT*30)%260)/260*TAU*2)*70,.8,1,'#ffd27a');
     wt(x+240,650,'平面圖：窄縫上下貫通',16,'#fff',600,'center');
    }else{ /* 近自然：塊石斜坡 */
     poly([x+30,590,x+450,380,x+450,600,x+30,600],'#7e6b58');
     poly([x+30,580,x+450,372,x+450,396,x+30,596],'rgba(79,170,205,.8)');
     const r=rng(4);for(let k=0;k<16;k++){const bx=x+50+r()*380,by=590-(bx-x-30)*.5;ctx.beginPath();ctx.ellipse(bx,by-6-r()*8,12+r()*8,8+r()*4,0,0,TAU);ctx.fillStyle=['#9a8a78','#6e6258','#a89884'][k%3];ctx.fill();}
     fishS(x+100+((TT*34)%280),565-((TT*34)%280)*.5,.8,1,'#ffd27a');
     wt(x+240,650,'塊石緩坡，蝦蟹也能爬',16,'#fff',600,'center');
    }
   });});
  alphaDo(seg(u,.8,.86),()=>{card(60,704,1480,86,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});
   wt(90,756,'怎麼選',20,'#7dffc4',700);wt(240,756,'依目標魚蝦種類、水位變化與可用空間決定；進出口要讓魚找得到入口',18,'#fff',600);});
 }},

{t:'池堰式魚道如何爬升',en:'Climbing a pool-and-weir fishway',dur:13,
 d:'池堰式魚道的設計關鍵是單池落差。圖中以堰高約 2.1 公尺為例，拆成 7 級，每級落差約 0.3 公尺，魚只要在池中休息，再一躍或一游就能過下一道隔牆。落差太大、水流太急，魚就會力竭或根本跳不過去。每個池子還要夠大，讓水流的能量在池內消散，魚才有安靜的地方喘息。魚道的入口要設在靠近堰下、水流最明顯的地方，並持續有足夠的水量吸引魚進入。常見的魚道坡度約在百分之十到十二，確切數值依魚種與研究而定。',
 s:[[0,'2.1 m 的堰，拆成 7 級，每級約 0.3 m'],[.28,'魚在池裡休息，再一躍通過隔牆'],[.55,'池子夠大，水流能量在池內消散'],[.8,'入口要在堰下水流明顯處，才找得到']],
 draw(u){
  diagBG();
  card(60,160,1480,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'池堰式魚道剖面（示意，7 級階梯）',20,'#f2c230',700);
  const lvl=k=>640-40*k;
  const sm=t=>{t=clamp(t);return t*t*(3-2*t);};
  const surfAt=x=>{let s=0;for(let k=0;k<7;k++){const xb=160+140*k;s+=sm((x-xb+14)/28);}return 640-40*s;};
  /* 下游河道 */
  box(70,640,90,100,'rgba(79,170,205,.8)');ln([70,640,160,640],'rgba(255,255,255,.7)',2);
  /* 6 個池與上游水庫 */
  for(let k=0;k<6;k++){const px=160+140*k,sy=lvl(k+1);box(px,sy,140,740-sy,'rgba(79,170,205,.8)');ln([px,sy,px+140,sy],'rgba(255,255,255,.7)',2);}
  box(1000,lvl(7),520,740-lvl(7),'rgba(60,140,180,.8)');ln([1000,lvl(7),1520,lvl(7)],'rgba(255,255,255,.7)',2);
  /* 隔牆與池底 */
  for(let k=0;k<7;k++){const xb=160+140*k,top=lvl(k+1)+6;box(xb-5,top,10,744-top,'#b8c0c4');}
  box(60,740,1480,20,'#8f7d68');
  /* 落下的水 */
  for(let k=1;k<7;k++){const xb=160+140*k;for(let q=0;q<3;q++){const f=((TT*1.1)+q/3+k*.2)%1;alphaDo(.8,()=>circ(xb-14+f*18,lvl(k+1)-4+f*38,3.2,'#dff6ff'));}}
  /* 魚沿路往上 */
  const f=seg(u,.18,.92),fx=lerp(80,1100,f),fy=surfAt(fx)+34-Math.exp(-Math.pow(((fx-160+70)%140-70)/22,2))*34;
  fishS(fx,fy,1.1,1,'#ffd27a');
  /* 落差標示 */
  alphaDo(band(u,.02,.5),()=>{ln([1230,lvl(7)+0,1230,lvl(0)],'rgba(242,194,48,.6)',2);arrow(1230,lvl(7),1230,lvl(0),'#f2c230',3);wt(1250,520,'堰高約 2.1 m',20,'#f2c230',700,'left');
   ln([200,lvl(2),360,lvl(2)],'rgba(255,255,255,.4)',1.5);});
  alphaDo(band(u,.04,.5),()=>{wt(500,lvl(3)-30,'每級落差約 0.3 m',19,'#7dffc4',700,'center');arrow(500,lvl(3)-16,500,lvl(3)+22,'#7dffc4',3);});
  lab(230,lvl(1)+30,'魚道入口',{dx:-60,dy:80,st:'s',a:band(u,.7,1)});
  lab(570,lvl(3)+36,'池（讓魚休息）',{dx:0,dy:100,a:band(u,.42,.7)});
  lab(1100,lvl(7)+10,'上游',{dx:30,dy:-70,st:'l',a:band(u,.8,1)});
  lab(100,640,'下游河道',{dx:0,dy:-80,st:'l',a:band(u,.06,.3)});
 },
 hud(u){hudPanel(250,150,'魚道（示例）',seg(u,.05,.1),w=>{
  hrow(56,'堰高','2.1 m',w,'#7dc8dc');hrow(88,'級數','7 級',w,'#fff');hrow(120,'單級落差','0.3 m',w,'#f2c230');});}},

{t:'留水、發電與生態檢核',en:'Water, power and ecological checks',dur:13,
 d:'放流越多，發電就越少，這是一道取捨。以年平均來水 10 m³/s、落差 20 m、效率 0.85 為例，不放流時約 1,668 kW，放流 10% 約 1,501 kW，30% 約 1,167 kW，60% 只剩約 667 kW。因此要在開發前做生態檢核，調查棲地與洄游種類，再把魚道與放流設施納入設計。依媒體報導，台灣小水力設在河流或野溪者須檢附生態檢核證明，達 2,000 kW 或位於環境敏感區還要專家審查，且政策傾向把小水力設在圳路與管渠等人造水域。',
 s:[[0,'放流越多，發電越少，是一道取捨'],[.3,'放流 30% 時，出力約剩 1,167 kW'],[.55,'開發前先做生態檢核，再設計魚道與放流'],[.8,'台灣傾向把小水力設在圳路與管渠']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,700,640,{title:'放流比例與出力（示例）',x0:0,x1:60,y0:0,y1:1800,pl:90,pb:80,pt:76,gx:6,gy:3,xt:[0,10,20,30,40,50,60],yt:[0,600,1200,1800],xl:'放流占來水 %',yl:'kW'});
  const g=ease(seg(u,.04,.5));
  ctx.beginPath();for(let r=0;r<=60;r+=2){if(r/60>g)break;const px=c.X(r),py=c.Y(166.77*(10-r/10));r?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.strokeStyle='#f2c230';ctx.lineWidth=3;ctx.stroke();
  [[10,1501,.1],[30,1167,.3],[60,667,.6]].forEach(([r,p,t])=>{const a=seg(u,t+.1,t+.16);alphaDo(a,()=>{circ(c.X(r),c.Y(p),8,'#7dffc4','#13232e',2);wt(c.X(r)+14,c.Y(p)-14,p.toLocaleString('en-US')+' kW',20,'#7dffc4',700,'left',COND);});});
  const sx=800,sw=740;
  card(sx,160,sw,640,{bg:'rgba(7,27,39,.75)'});wt(sx+24,200,'台灣小水力的檢核流程（依媒體報導）',20,'#f2c230',700);
  const steps=[['生態檢核','調查棲地與洄游魚蝦，檢附證明',.3],['設計','魚道與常態放流設施納入設計',.48],['審查','2,000 kW 以上或敏感區須專家審查',.64],['運轉','監測放流量與魚道，必要時調整',.78]];
  steps.forEach(([n,sub,t],i)=>{const a=seg(u,t,t+.06),y=240+i*100;
   alphaDo(a,()=>{tag(sx+24,y+14,String(i+1),{bg:'#f2c230',fg:'#13232e',size:20,align:'left'});wt(sx+80,y+20,n,22,'#fff',700);wt(sx+80,y+52,sub,17,'rgba(227,236,238,.85)',500);
    if(i<3)ln([sx+34,y+44,sx+34,y+84],'rgba(255,255,255,.35)',2);});});
  alphaDo(seg(u,.84,.9),()=>{card(sx+24,660,sw-48,120,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});
   wt(sx+44,700,'選址偏好',18,'#7dffc4',700);wt(sx+44,736,'圳路、管渠等人造水域，生態敏感度較低',18,'#fff',600);wt(sx+44,766,'（2024 年底《小水力發電設施設置指引》）',16,'rgba(227,236,238,.85)',500);});
 }}
]};
