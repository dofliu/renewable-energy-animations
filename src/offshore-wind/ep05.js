// KITS: marine
/* ================= EP05 基礎打樁 ================= */
const hlvDeck=R=>wlAt(R-215,.35)-18;
const PBOT_SELF=bedTX+18,BLOWS_N=34,EMB=36;
const blows=q=>8*q+26*q*q;
function pile4(u,R,deck){
  if(u<.24)return {bx:R-10,by:deck-15,ang:0};
  if(u<.42)return {bx:R-10,by:deck-15,ang:Math.PI/2*ease(seg(u,.24,.42))};
  if(u<.48)return {bx:lerp(R-10,TX,ease(seg(u,.42,.48))),by:deck-15,ang:Math.PI/2};
  if(u<.6)return {bx:TX,by:lerp(deck-15,bedTX,ease(seg(u,.48,.6))),ang:Math.PI/2};
  if(u<.71)return {bx:TX,by:lerp(bedTX,PBOT_SELF,easeOut(seg(u,.6,.64))),ang:Math.PI/2};
  const bv=blows(seg(u,.71,.94)),fl=Math.floor(bv),fr=bv-fl,pd=Math.min(1,(fl+easeOut(Math.min(1,fr*5)))/BLOWS_N);
  return {bx:TX,by:lerp(PBOT_SELF,PILE_BOT,pd),ang:Math.PI/2};
}
const pileTop=p=>({x:p.bx-PILE_L*Math.cos(p.ang),y:p.by-PILE_L*Math.sin(p.ang)});
const penM=p=>Math.max(0,(pile4(p,TX-40,0).by-bedTX)/(PILE_BOT-bedTX)*EMB);
function hammer4(u,R,deck,top){
  const t0=PBOT_SELF-PILE_L;
  if(u<.66)return {x:R-150,y:deck-8};
  if(u<.71)return kf(u,[[.66,R-150,deck-8],[.68,R-150,t0-40],[.695,TX,t0-40],[.71,TX,t0]]);
  if(u<.94)return {x:TX,y:top};
  return {x:TX,y:top-60*ease(seg(u,.94,1))};
}
function hammerFlash(u){if(u<.71||u>.94)return 0;const bv=blows(seg(u,.71,.94));return Math.max(0,1-(bv-Math.floor(bv))*3.5);}
function bubbleCurtain(a){if(a<=0)return;for(const X of [TX-150,TX+150]){const bb=bedY(X),dep=bb-SEA;ctx.fillStyle=`rgba(255,255,255,${.06*a})`;ctx.fillRect(X-9,SEA,18,dep);
  for(let i=0;i<30;i++){const k=((TT*.55+i/30)%1),y=bb-k*dep,x=X+Math.sin(i*2.3+TT*3)*5+Math.sin(k*9)*3;circ(x,y,1.2+(i%3)*.8+k*1.2,`rgba(235,250,255,${.55*a})`);}}}
function hose(p){ctx.setLineDash([2,3]);ln([TX+150,bedY(TX+150)-2,lerp(TX+150,TX-150,p),bedY(TX)-2],'#23282c',3);ctx.setLineDash([]);}
/* full piling scene at global phase p (same choreography as the overview film) */
function pilingScene(p,o){
  o=o||{};const R=lerp(1900,TX-40,easeOut(seg(p,0,.13))),deck=hlvDeck(R);
  if(!o.noGuard){const gx=lerp(-420,-60,easeOut(seg(p,0,.1)));vsl(gx,80,false,{tilt:.6},vGuard);}
  const bs=lerp(1750,TX+300,easeOut(seg(p,.1,.24))),bwl=wlAt(bs-50,.7);
  if(p>.14){const k=ease(seg(p,.14,.24));ctx.strokeStyle='#23282c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bs-2,bwl-6);ctx.quadraticCurveTo(bs+30,bwl+120,TX+150,bedY(TX+150)-2);ctx.stroke();hose(k);}
  vsl(bs,100,true,{tilt:.5},vBubble);
  vsl(R,430,true,{damp:.35},vHLV);
  const pile=pile4(p,R,deck),pt=pileTop(pile);drawTP(R-290,deck);
  const ham=hammer4(p,R,deck,pt.y);if(p<.66)drawHammer(ham.x,ham.y,0);
  drawPile(pile.bx,pile.by,pile.ang,PILE_L,PILE_W);
  if(p>=.66)drawHammer(ham.x,ham.y,hammerFlash(p));
  drawGripper(R,deck,p<.42?1:p<.46?1-seg(p,.42,.46):p>.95?seg(p,.95,1):0);
  const stow={x:R-250,y:deck-90};let hk;
  if(p<.18)hk=stow;else if(p<.24)hk=lerpPt(stow,{x:pt.x,y:pt.y-8},ease(seg(p,.18,.24)));else if(p<.62)hk={x:pt.x,y:pt.y-8};
  else if(p<.66){const p0=pileTop(pile4(.62,R,deck));hk=kf(p,[[.62,p0.x,p0.y-8],[.64,TX-110,deck-220],[.66,ham.x,ham.y-110]]);}else hk={x:ham.x,y:ham.y-110};
  crane(R-80,deck-30,440,hk.x,hk.y,{col:'#e9b21f'});
  return {R,deck,pile,pt,ham,bs,bwl};
}
function soundRings(p){
  if(p<=.71||p>=1)return;const q=seg(p,.71,.94),bv=blows(q);
  ctx.save();waterRegion();ctx.clip();
  const age=(bv-Math.floor(bv))*1.2;const e=lerp(.3,1,ease(seg(q,0,.35)));
  for(let j=0;j<3;j++){const a=age+j*.9;if(a>2.4)continue;const r=a*260;
   ctx.save();ctx.beginPath();ctx.rect(TX-150,VY0,300,VY1-VY0);ctx.clip();ring(TX,600,r,`rgba(232,87,42,${.7*e*(1-a/2.4)})`,2.2);ctx.restore();
   ctx.save();ctx.beginPath();ctx.rect(VX0,VY0,TX-150-VX0,VY1-VY0);ctx.rect(TX+150,VY0,VX1-TX-150,VY1-VY0);ctx.clip();ring(TX,600,r,`rgba(232,87,42,${.18*e*(1-a/2.4)})`,1.5);ctx.restore();}
  ctx.restore();
}
function dbc(d){const q=qcAt5(d*5.14*7/7);return 18+q*1.6;}
function qcAt5(d){const n=nz(d*.9);if(d<36)return 8+7*(d/36)+n*1.6;if(d<92)return 2.5+n*.5;if(d<152)return 25+15*((d-92)/60)+n*3;return 42+(d-152)*1.6+n*2;}
const map=(u,a,b)=>lerp(a,b,u);

const EP={no:5,slug:'offshore-wind',seriesName:'離岸風場開發系列',total:13,t:'基礎打樁',en:'Monopile installation',
lede:'單樁是整部風機的根：一根直徑約 10 公尺、長近百公尺、重上千公噸的鋼管，要被垂直打進海床數十公尺。這一集從組裝港裝船、翻樁、打樁到減噪與防淘刷，一步步拆解。',
facts:[['10','m','大型單樁的直徑，相當於三層樓高'],['1,000–2,000','公噸','單支單樁的重量，依水深與地質而定'],['30–40','m','常見的入土深度（本集示例 36 m）'],['0.25','°','打樁完成後的垂直度容許偏差，約每 100 m 偏 44 cm'],['2,000+','錘','打一支樁常需的錘擊次數，液壓錘單次能量可達數千千焦耳'],['10–15','dB','氣泡幕可降低的水下噪音量級']],
note:'說明：本集為教育用途示意動畫。樁的尺寸、重量、錘擊次數與噪音數值為典型範例，實際依機型、水深、地質與環評承諾而定。台灣部分風場採用套管式（Jacket）基礎，以多支針樁固定，施工程序不同。',
shots:[
/* 1 */{t:'組裝港裝船',en:'Load-out at the marshalling port',dur:11,side:true,
 d:'單樁在工廠由厚鋼板捲製、分段焊接而成，運到組裝港暫存。出海前，以數十軸的自走式平板車（SPMT）把整支樁從碼頭滾裝到重件吊裝船甲板上，再以鋼製托架與焊接擋塊進行「海上綁紮」，確保航行中遇到風浪也不會移動。一艘船一趟可載運數支樁與轉接段。',
 s:[[0,'單樁存放在組裝港碼頭，由自走式平板車承載'],[.2,'平板車緩緩把樁滾裝上重件吊裝船'],[.55,'托架與擋塊完成海上綁紮'],[.8,'裝載完成，吊裝船出港前往風場']],
 cam:()=>({x:1170,y:430,s:1.25}),
 draw(u){
  let R=1320;if(u>.8)R=lerp(1320,700,easeIn(seg(u,.8,1)));
  box(1330,SEA-24,560,330,'#a7afb3');box(1330,SEA-24,560,6,'#7b858a');for(let x=1340;x<1880;x+=46)box(x,SEA-18,10,26,'#2b3137');
  const deck=hlvDeck(R);vsl(R,430,true,{damp:.35},vHLV);drawTP(R-290,deck);
  const bx=u<.2?1760:u<.55?lerp(1760,R-10,ease(seg(u,.2,.55))):R-10,by=u<.55?Math.min(SEA-24,deck)-15-10:deck-15;
  if(u<.6){box(bx-PILE_L+20,by+14,PILE_L-40,8,'#e8a33a');for(let x=bx-PILE_L+30;x<bx-20;x+=16)circ(x,by+24,3.4,'#222');}
  drawPile(bx,by,0,PILE_L,PILE_W);
  if(u>.55){const a=seg(u,.55,.62);alphaDo(a,()=>{for(let x=R-60;x>R-400;x-=70){poly([x-10,deck,x+10,deck,x+6,deck-10,x-6,deck-10],'#f2c230');}});}
  lab(1560,SEA-24,'組裝港碼頭',{dx:0,dy:-60,a:band(u,0,.4)});
  lab(bx-120,by+22,'自走式平板車 SPMT',{dx:-30,dy:60,a:band(u,.05,.55)});
  lab(R-200,deck-15,'單樁',{dx:-60,dy:-80,a:band(u,.3,.8)});
  lab(R-150,deck-2,'海上綁紮托架',{dx:40,dy:50,st:'s',a:band(u,.58,.84)});
 },
 hud(u){hudPanel(230,150,'本航次載運',seg(u,.2,.26),w=>{hrow(54,'單樁','3 支',w);hrow(80,'轉接段','1 組',w);hrow(106,'單支重量','約 1,800 公噸',w);hrow(132,'綁紮檢查',u>.62?'完成':'進行中',w,u>.62?'#7dffc4':'#f2c230');});}},
/* 2 */{t:'警戒區淨空與氣泡幕',en:'Clearing the zone',dur:13,side:true,
 d:'打樁前的準備不只是機具定位。氣泡幕施工船把一條打滿小孔的管線在樁位周圍鋪成一圈，壓縮機把空氣打進管線，在水中形成一道上升的氣泡牆。同時，鯨豚觀察員與水下聲學監測要持續確認 750 公尺警戒區內至少 30 分鐘沒有鯨豚，才能下令開始打樁；若鯨豚進入，作業須暫停。',
 s:[[0,'重件吊裝船進場定位，鯨豚觀察船在外圍巡視'],[.2,'氣泡幕施工船在海床上繞樁位鋪設多孔管線'],[.5,'壓縮機送氣，氣泡從海床升起形成一圈氣泡牆'],[.7,'觀察員與聲學監測持續確認 750 公尺內淨空 30 分鐘']],
 cam:()=>({x:560,y:450,s:.98}),
 draw(u){pilingScene(map(u,0,.26));
  const dl=band(u,.02,.3);if(dl>0){const x=lerp(360,-260,seg(u,.02,.3)),p=x/140;alphaDo(dl,()=>dolphin(x,SEA+18+26*Math.cos(p*TAU),Math.PI,.85));}
  lab(40,SEA-30,'鯨豚觀察船',{dy:-40,a:band(u,.02,.5)});lab(TX+300,SEA-30,'氣泡幕施工船',{dy:-50,a:band(u,.12,.5)});
  lab(TX,bedTX-2,'多孔管線繞樁位一圈',{dx:60,dy:-50,a:band(u,.3,.6)});},
 fx(u){bubbleCurtain(seg(u,.46,.56));if(u>.5)lab(TX+150,560,'氣泡幕',{dx:60,dy:-24});},
 hud(u){hudPanel(240,176,'打樁前檢查',seg(u,.05,.1),w=>{
  const m=Math.floor(30*seg(u,.62,.98));hrow(52,'吊裝船定位','完成',w,'#7dffc4');hrow(78,'氣泡幕',u<.5?'布設中':'運轉中',w,u<.5?'#f2c230':'#7dffc4');
  hrow(104,'PAM 監聽',u<.62?'待命':'無鯨豚訊號',w,u<.62?'#fff':'#7dffc4');hrow(130,'淨空計時',trf('{m} / 30 分',{m}),w,m>=30?'#7dffc4':'#f2c230');hbar(14,142,w-28,m/30,m>=30?'#7dffc4':'#f2c230');
  if(m>=30)htext(w/2,168,'可以開始打樁',13,'#7dffc4',700,FONT,'center');});}},
/* 3 */{t:'翻樁 Upending',en:'Upending the monopile',dur:12,side:true,
 d:'單樁以水平方式運到現場，必須先「翻」成直立。主吊機以樁頂的翻樁工具勾住樁頭，樁底則靠在船尾的翻樁鉸座上；吊機緩緩收鋼索，讓近兩千公噸的鋼管以樁底為支點轉動 90 度。這是整個安裝過程中最考驗吊機能力與海況的時刻之一，通常要求浪高在 1.5–2 公尺以下。',
 s:[[0,'主吊機的翻樁工具勾住樁頂'],[.28,'以樁底為支點，收鋼索把樁頭拉起'],[.62,'單樁轉動 90°，完全直立'],[.85,'直立的樁吊向船尾的抱樁器']],
 cam:u=>({x:lerp(470,420,u),y:360,s:1.05}),
 draw(u){const S=pilingScene(map(u,.16,.46));
  lab(S.pt.x,S.pt.y,'翻樁工具',{dx:-80,dy:-20,st:'s',a:band(u,.05,.6)});lab(S.pile.bx,S.pile.by,'翻樁鉸座（支點）',{dx:60,dy:40,a:band(u,.2,.7)});
  lab(S.R-80,S.deck-30,'主吊機',{dx:-60,dy:-70,a:band(u,.1,.6)});},
 fx(u){bubbleCurtain(1);},
 hud(u){hudPanel(230,130,'吊裝監測',seg(u,.05,.1),w=>{const p=map(u,.16,.46),a=p<.24?0:90*ease(seg(p,.24,.42));hrow(54,'樁身角度',a.toFixed(0)+'°',w,'#f2c230');hbar(14,62,w-28,a/90);hrow(96,'吊重','1,820 t',w);hrow(118,'有效浪高','1.2 m',w,'#7dffc4');});}},
/* 4 */{t:'抱樁器與自重貫入',en:'Pile gripper and self-penetration',dur:11,side:true,
 d:'直立的單樁被送進船尾的抱樁器，液壓臂從四周夾住樁身，控制它的位置與垂直度。吊機放鬆鋼索，樁在自身重量下沉入海底，並貫入軟弱的表層土數公尺，這稱為「自重貫入」。此時要反覆量測垂直度，若偏差超過容許值，就得在打樁初期即時修正。',
 s:[[0,'抱樁器張開，單樁移入就位'],[.2,'液壓臂夾住樁身，控制位置與垂直度'],[.4,'緩緩下放，樁穿過水層觸及海床'],[.72,'依靠自重貫入表層土數公尺，量測垂直度']],
 cam:u=>camMix({x:TX,y:380,s:1.2},{x:TX,y:560,s:1.35},ease(seg(u,.3,.6))),
 draw(u){pilingScene(map(u,.42,.66));
  lab(TX+22,wlAt(TX,.35)-36,'抱樁器',{dx:80,dy:-30,a:band(u,.05,.6)});lab(TX,bedTX+10,'自重貫入',{dx:70,dy:10,st:'s',a:band(u,.7,1)});},
 fx(u){bubbleCurtain(1);},
 hud(u){hudPanel(230,170,'垂直度',seg(u,.2,.26),w=>{const e=lerp(.9,.12,seg(u,.2,.9))+.03*Math.sin(TT*2);
  const cx=w/2,cy=92;ring(cx,cy,48,'rgba(255,255,255,.3)',1.2);ring(cx,cy,48*.25/1,'rgba(125,255,196,.6)',1.2);ln([cx-56,cy,cx+56,cy],'rgba(255,255,255,.2)',1);ln([cx,cy-56,cx,cy+56],'rgba(255,255,255,.2)',1);
  circ(cx+Math.cos(TT*.7)*e*48,cy+Math.sin(TT*.9)*e*48,5,e<.25?'#7dffc4':'#f2c230');htext(w-14,160,trf('{e}°（容許 0.25°）',{e:e.toFixed(2)}),13,e<.25?'#7dffc4':'#f2c230',700,FONT,'right');});}},
/* 5 */{t:'打樁：一錘一錘打進海床',en:'Pile driving',dur:16,side:true,
 d:'吊機換上液壓打樁錘，套在樁頂。打樁從「軟啟動」開始：先以低能量慢慢錘擊，讓附近可能存在的海洋生物有時間離開，再逐步加大能量。每一錘都讓樁下沉幾公分到十幾公分；遇到緊密砂層時，每 25 公分需要的錘擊數明顯上升。監測系統即時記錄貫入深度、錘擊數、能量與 750 公尺外的噪音值。',
 s:[[0,'吊起液壓打樁錘，套上樁頂'],[.18,'軟啟動：以低能量開始錘擊，逐步加大'],[.45,'每一錘讓樁下沉數公分，錘擊數隨地層變化'],[.7,'穿過緊密砂層時，每 25 cm 所需錘擊數明顯增加'],[.9,'打到設計入土深度，移開打樁錘']],
 cam:u=>camMix({x:TX-20,y:380,s:1.05},{x:TX+60,y:560,s:1.2},ease(seg(u,.2,.35))),
 draw(u){const p=map(u,.62,1);const S=pilingScene(p,{noGuard:true});
  lab(S.ham.x+17,S.ham.y-60,'液壓打樁錘',{dx:60,dy:-20,a:band(u,.1,.5)});lab(S.ham.x-17,S.ham.y-60,'軟啟動：能量逐步加大',{dx:-90,dy:0,st:'s',a:band(u,.24,.5)});
  lab(TX,PILE_BOT-6,'設計入土深度',{dx:80,dy:-24,a:seg(u,.9,.94)});},
 fx(u){bubbleCurtain(1);soundRings(map(u,.62,1));},
 hud(u){const p=map(u,.62,1);hudPanel(290,300,'打樁監測',seg(u,.05,.1),(w)=>{
  const q=seg(p,.71,.94),bv=p>.71?blows(q):0,e=p>.71&&p<.94?lerp(.15,1,ease(seg(q,0,.35))):0,pen=penM(p);
  hrow(48,'累計錘擊數',String(Math.floor(bv*65)),w);hrow(72,'錘擊能量',Math.round(e*100)+' %',w,'#f2c230');hbar(14,78,w-28,e,'#f2c230');
  hrow(104,'入土深度',pen.toFixed(1)+' m',w);const sel=e>0?146+12*e:0;hrow(128,'750 m 處噪音',sel?sel.toFixed(0)+' dB':'—',w,sel>158?'#f2c230':'#7dffc4');
  const x0=56,y0=148,cw=w-76,ch=128,X=b=>x0+b/120*cw,Y=d=>y0+d/EMB*ch;ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=1;ctx.strokeRect(x0,y0,cw,ch);
  ctx.beginPath();for(let d=4;d<=pen;d+=.25){const px=d/EMB*130,b=18+qcAt5(px*1.2)*1.9+nz(d*3)*4;const x=X(Math.min(118,b)),y=Y(d);d===4?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=1.8;ctx.stroke();
  for(const m of [0,12,24,36])htext(x0-6,Y(m)+4,m+' m',11,'rgba(227,236,238,.7)',600,COND,'right');htext(x0,y0+ch+16,'每 25 cm 錘擊數 →',11,'rgba(227,236,238,.7)');
 });}},
/* 6 */{t:'氣泡幕為什麼能減噪',en:'How a bubble curtain works',dur:12,
 d:'聲音在水中傳得又快又遠，但遇到空氣就很難通過。氣泡幕讓打樁的衝擊聲波必須穿過一道密集的氣泡牆：空氣與海水的密度、聲速差異極大，聲波在氣泡表面被反射、散射，氣泡本身的共振也會吸收能量。單層氣泡幕約可降低 8–12 dB，雙層氣泡幕或搭配樁身外的減噪套筒，可降低 15 dB 以上。',
 s:[[0,'每一次錘擊，樁身像鐘一樣把聲波傳進海水'],[.25,'聲波遇到氣泡牆：空氣與海水差異極大'],[.5,'能量被反射、散射與吸收，穿過後大幅減弱'],[.75,'雙層氣泡幕或減噪套筒可進一步降低噪音']],
 draw(u){
  diagBG();const sy=220,by=740,px=240;
  const g=ctx.createLinearGradient(0,sy,0,by);g.addColorStop(0,'rgba(59,147,187,.5)');g.addColorStop(1,'rgba(11,56,88,.7)');ctx.fillStyle=g;ctx.fillRect(40,sy,1520,by-sy);box(40,by,1520,60,'#b59a6a');ln([40,sy,1560,sy],'rgba(255,255,255,.8)',2);
  box(px-30,120,60,by+60-120,'#8093a0');box(px-30,120,60,20,'#f2c230');
  const cx1=620,cx2=760,dbl=seg(u,.75,.82);
  for(const X of [cx1,cx2]){if(X===cx2&&dbl<=0)continue;const a=X===cx2?dbl:seg(u,.2,.3);alphaDo(a,()=>{ctx.fillStyle='rgba(255,255,255,.07)';ctx.fillRect(X-28,sy,56,by-sy);for(let i=0;i<70;i++){const k=((TT*.5+i/70)%1),y=by-k*(by-sy),x=X+Math.sin(i*2.1+TT*2)*16;circ(x,y,1.5+(i%4)*1.1+k*1.5,'rgba(235,250,255,.6)');}});}
  const amp=x=>{let a=70*Math.pow(160/(x-px+160),.7);if(x>cx1+28)a*=lerp(1,.28,seg(u,.25,.5));if(x>cx2+28)a*=lerp(1,.55,dbl);return a;};
  ctx.beginPath();for(let x=px+34;x<1540;x+=3){const y=480+Math.sin((x-TT*260)*.045)*amp(x);x===px+34?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle='#ff8a60';ctx.lineWidth=3;ctx.stroke();
  if(u>.3){for(let i=0;i<6;i++){const k=(TT*.9+i/6)%1;const y=300+i*70;arrow(cx1-34,y,cx1-34-k*120,y-30+k*10,`rgba(255,138,96,${.7*(1-k)})`,2);}}
  alphaDo(seg(u,.28,.34),()=>{tag(cx1,180,'氣泡牆',{align:'center',size:19});});
  alphaDo(seg(u,.3,.36),()=>{wt(cx1-60,by+36,'反射',19,'#ff8a60',700,'right');wt(cx1,by+36,'散射',19,'#fff',700,'center');wt(cx1+60,by+36,'吸收',19,'#7dffc4',700,'left');});
  card(1000,90,540,110,{bg:'rgba(7,27,39,.85)'});
  const lv=[['無減噪',173,'#ff8a60',0],['單層氣泡幕',163,'#f2c230',.4],['雙層氣泡幕',157,'#7dffc4',.8]];
  lv.forEach((l,i)=>{const a=seg(u,l[3],l[3]+.06);alphaDo(a,()=>{const x=1024+i*172;wt(x,128,l[0],17,'rgba(227,236,238,.8)',500);wt(x,178,l[1]+' dB',34,l[2],700,'left',COND);});});
 }},
/* 7 */{t:'驗收與防淘刷保護',en:'Survey and scour protection',dur:12,side:true,
 d:'打樁完成後，測量樁頂高程、垂直度與位置，確認都在容許範圍內。接下來處理一個看不見的威脅：海流繞過樁身時會加速，把樁周圍的沙子捲走，形成「淘刷坑」，削弱樁的支撐。落管式拋石船以一根垂直的落管，把不同粒徑的石塊精準鋪在樁基周圍，先鋪過濾層、再鋪護甲層，形成一圈保護墊。',
 s:[[0,'量測樁頂高程、位置與垂直度，確認符合設計'],[.2,'海流繞過樁身加速，捲走樁基周圍的沙'],[.42,'淘刷坑逐漸擴大，削弱樁的側向支撐'],[.6,'落管式拋石船把石塊精準鋪在樁基周圍'],[.82,'過濾層加護甲層，防止淘刷繼續發生']],
 cam:u=>camMix({x:TX,y:470,s:1.2},{x:TX+40,y:630,s:2},ease(seg(u,.15,.3))),
 draw(u){
  drawPile(TX,PILE_BOT,Math.PI/2,PILE_L,PILE_W);
  const sc=seg(u,.2,.55)*(1-seg(u,.62,.8)*.0),fill=seg(u,.62,.92);
  ctx.save();const b=bedTX;ctx.beginPath();ctx.moveTo(TX-120,b);ctx.quadraticCurveTo(TX-40,b+30*sc,TX-16,b+26*sc);ctx.lineTo(TX+16,b+26*sc);ctx.quadraticCurveTo(TX+40,b+30*sc,TX+120,b);ctx.closePath();ctx.fillStyle='rgba(29,102,144,.95)';ctx.fill();ctx.restore();
  if(u>.2&&u<.6){for(let i=0;i<10;i++){const k=(TT*.8+i/10)%1,x=lerp(TX-240,TX+240,k),y=b-12-Math.abs(x-TX)<60?0:0;circ(x,b-6-Math.sin(k*9+i)*4-(Math.abs(x-TX)<50?10:0),2.2,'rgba(217,195,147,.8)');}
   for(let i=0;i<3;i++){const y=b-30-i*40;arrowR(TX-260,y,90,'rgba(255,255,255,.6)');ctx.beginPath();ctx.moveTo(TX-20,y);ctx.quadraticCurveTo(TX,y-26,TX+24,y);ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=2;ctx.stroke();arrowR(TX+40,y,120,'rgba(255,255,255,.8)');}}
  const r=rng(8);for(let i=0;i<120;i++){const t=i/120;if(t>fill)break;const layer=t<.4?0:1,x=TX+(r()-.5)*(layer?220:200),y0=b+22*sc*(1-Math.abs(x-TX)/110)-2-layer*8-r()*6;circ(x,y0,layer?4+r()*2.5:2+r(),layer?'#7a756e':'#a39c90');}
  if(u>.58){const vx=TX+30,wl=wlAt(vx+100,.6);vsl(vx-60,200,false,{damp:.6},vSmallWork);const py=lerp(wl,b-40,seg(u,.58,.64));ln([TX+44,wl-10,TX+44,py],'#394650',4);if(u>.64&&u<.92)for(let i=0;i<6;i++){const k=(TT*2+i/6)%1;circ(TX+44+(r()-.5)*10,lerp(py,b-6,k),2.4,'#8a857e');}}
  lab(TX,PILE_TOP,'樁頂高程與垂直度量測',{dx:90,dy:-30,st:'s',a:band(u,0,.18)});
  lab(TX+50,bedTX+14,'淘刷坑',{dx:80,dy:40,st:'w',a:band(u,.4,.62)});
  lab(TX+44,bedTX-50,'落管',{dx:80,dy:-40,a:band(u,.62,.86)});
  lab(TX-80,bedTX-10,'過濾層＋護甲層',{dx:-90,dy:-50,st:'g',a:seg(u,.84,.9)});
 }}
]};
