// KITS: land
/* 電網系列 第 10 集：電動車智慧充電與 V2G */
/* 數值多為典型範例：負載曲線、充電功率、電池容量、來回效率皆為示意 */
const G10=(h,m,w)=>Math.exp(-Math.pow((h-m)/w,2));
const base10=h=>56+12*G10(h,10.5,3)+44*G10(h,20,2.4);
const evU10=h=>18*G10(h,19.6,1.9);
const evS10=h=>11*(G10(h,2,2.6)+G10(h,26,2.6))+7*G10(h,12.5,1.6);
const SOCK10=[[0,78],[2,90],[8,90],[9,80],[11,80],[14,90],[17,90],[18,80],[19,80],[22,55],[24,78]];
const soc10=h=>{h=clamp(h,0,24);for(let i=1;i<SOCK10.length;i++){const a=SOCK10[i-1],b=SOCK10[i];if(h<=b[0])return lerp(a[1],b[1],ease((h-a[0])/(b[0]-a[0])));}return 78;};
function car10(x,gy,col,tilt){
  ctx.save();ctx.translate(x,gy);
  box(-110,-52,220,34,col,'rgba(0,0,0,.35)',1.4);
  poly([-70,-52,-42,-92,46,-92,86,-52],col,'rgba(0,0,0,.35)',1.4);
  poly([-58,-54,-36,-86,-4,-86,-4,-54],'#9fc7dc');poly([4,-54,4,-86,40,-86,72,-54],'#9fc7dc');
  box(96,-44,12,8,'#f2c230');box(-110,-44,8,8,'#e8572a');
  for(const wx of [-66,66])circ(wx,-18,22,'#1f2529','#555',3),circ(wx,-18,9,'#aab4b9');
  ctx.restore();
}
function wall10(x,gy,on,col){
  box(x,gy-90,46,90,'#e3e8ec','rgba(0,0,0,.35)',1.4);box(x+8,gy-76,30,22,'#13232e');
  circ(x+23,gy-65,5,on?col:'#7a8790');box(x+10,gy-42,26,6,'#8d989f');
}
function house10(x,gy){
  box(x,gy-230,420,230,'#e7dccb','rgba(0,0,0,.3)',1.4);poly([x-30,gy-230,x+210,gy-340,x+450,gy-230],'#a35a45','rgba(0,0,0,.3)',1.4);
  box(x+60,gy-170,80,70,'#9fc7dc','rgba(0,0,0,.35)',1.2);box(x+250,gy-170,80,70,'#9fc7dc','rgba(0,0,0,.35)',1.2);box(x+170,gy-120,60,120,'#7c5a44');
}
function meter10(x,gy,col){box(x,gy-170,44,62,'#dfe5e8','rgba(0,0,0,.4)',1.2);circ(x+22,gy-139,16,'#13232e',col,2);wt(x+22,gy-133,'kWh',11,col,700,'center');}
function pole10(x,gy,h){ln([x,gy,x,gy-h],'#6b5a48',5);ln([x-24,gy-h+12,x+24,gy-h+12],'#6b5a48',4);return [x,gy-h+12];}
function pt10(P,t){const k=clamp(t,0,.9999)*(P.length-1),j=Math.floor(k);return [lerp(P[j][0],P[j+1][0],k-j),lerp(P[j][1],P[j+1][1],k-j)];}
function flow10(P,dir,col,n,r,a,sp){if(a<=.01)return;alphaDo(a,()=>{for(let i=0;i<n;i++){let t=(TT*(sp||.2)*dir+i/n)%1;if(t<0)t+=1;const q=pt10(P,t);circ(q[0],q[1],r,col);}});}
function hrw10(x,y,label,val,w,col){wt(x,y,label,20,'rgba(227,236,238,.9)',600);wt(x+w,y+4,val,28,col,700,'right',COND);}
function curve10(C,fn,col,p,lw){ctx.beginPath();const n=96;for(let i=0;i<=n*p;i++){const h=24*i/n;i?ctx.lineTo(C.X(h),C.Y(fn(h))):ctx.moveTo(C.X(h),C.Y(fn(h)));}ctx.strokeStyle=col;ctx.lineWidth=lw||4;ctx.stroke();}
function bullets10(x,y,ls,col,u,a0,gap){ls.forEach((t,i)=>alphaDo(seg(u,a0+i*.06,a0+i*.06+.1),()=>{circ(x+10,y+i*(gap||46)-5,3.5,col);wt(x+28,y+i*(gap||46),t,19,'rgba(227,236,238,.95)',500);}));}
const dayBase10=()=>{landSky(GY,{sun:{x:1300,y:120}});drawGround();};

const EP={no:10,slug:'power-grid',seriesName:'電網系列',t:'電動車智慧充電與 V2G',en:'EV smart charging and V2G',
lede:'電動車越來越多，每一輛都是一顆會移動的大電池。如果大家下班回家就插電，會把傍晚的尖峰越推越高；但只要讓充電聽從電網與電價的訊號，電動車反而能吸收中午的太陽光電，甚至在傍晚把電送回去。這一集看智慧充電如何排程、V2G 雙向充放電如何運作，以及車主與電網各自要付出的取捨。',
facts:[['7','kW','家用交流充電樁常見功率等級（典型範例）'],
['≈ 15','kWh','以 7 kW 放電約 2 小時送出的電量，約占 60 kWh 電池的 25%（示例）'],
['7','MW','一千輛車同時以 7 kW 放電的聚合容量（算術：1,000 × 7 kW）'],
['30','%','車主可設定的最低電量底線，確保隔天有電可開（示例）'],
['ISO 15118-20','','車與充電樁的通訊標準，加入雙向電能傳輸所需的訊息'],
['≈ 85','%','充放電來回效率，變流與電池發熱各有損失（典型範例）']],
note:'說明：本集為教育用途示意動畫。智慧充電與 V2G 的運作概念、車樁通訊標準 ISO 15118-20（含雙向電能傳輸）、需由車主設定最低電量與出發時間等，整理自公開技術說明與搜尋摘要；台灣已有媒體報導的 V2G 示範場（台北市，直流雙向充電樁），以及台電研擬的電動車專屬時間電價（報導中尖離峰價差約 4 倍，各版本草案不一，未確認最終實施內容，請以台電公告為準）。畫面中的負載曲線、電動車充電曲線、7 kW 功率、60 kWh 電池、30% 電量底線、85% 來回效率與一天電量變化皆為典型範例，非特定車款或場域資料。',
base:()=>dayBase10(),
shots:[
{t:'大家下班同時插電',en:'Everyone plugs in at once',dur:13,
 d:'電動車的充電功率不小，一輛家用交流充電約 7 kW，相當於好幾戶的平均用電。多數人下班回到家，才把車子插上電，這段時間正好是全國的夜間尖峰。示例中，如果電動車一回家就立刻充電，原本的負載曲線在晚上七點到九點會被再墊高一塊，尖峰更高，電網得多備一些機組與線路容量。這是電動車在電網上的第一個問題，也是智慧充電要解決的事。',
 s:[[0,'白天上班，電動車停在原地'],[.3,'傍晚回家，大家同時插上充電槍'],[.6,'充電負載疊在夜間尖峰上'],[.85,'尖峰被墊高，電網得多備容量']],
 draw(u){
  diagBG();
  const C=chartBox(60,150,960,650,{title:'一天的用電負載（相對值，典型範例）',x0:0,x1:24,y0:40,y1:130,xt:[0,6,12,18,24],yt:[40,60,80,100,120],xl:'時',pl:84,pt:60,pb:56,gx:4,gy:4});
  const p=ease(seg(u,.08,.5));curve10(C,base10,'#58b8d0',p);
  const p2=ease(seg(u,.4,.8));
  alphaDo(seg(u,.4,.5),()=>{ctx.beginPath();for(let i=0;i<=96*p2;i++){const h=24*i/96;i?ctx.lineTo(C.X(h),C.Y(base10(h)+evU10(h))):ctx.moveTo(C.X(h),C.Y(base10(h)+evU10(h)));}ctx.strokeStyle='#ff8a60';ctx.lineWidth=4;ctx.stroke();});
  wt(C.px+16,C.py+34,'原本負載',18,'#58b8d0',700);alphaDo(seg(u,.4,.5),()=>wt(C.px+16,C.py+62,'加上電動車（回家即充）',18,'#ff8a60',700));
  alphaDo(seg(u,.78,.9),()=>{const x=C.X(20),y=C.Y(base10(20)+evU10(20));tag(x,y-40,'尖峰被墊高',{size:16,bg:'#e8572a',align:'center'});});
  const cx=1060;card(cx,150,480,300,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});wt(cx+24,192,'一輛車有多大？',22,'#f2c230',700);
  wt(cx+24,252,'家用交流充電',19,'rgba(227,236,238,.9)',600);wt(cx+456,256,'約 7 kW',28,'#f2c230',700,'right',COND);
  wt(cx+24,310,'一戶住宅平均用電',19,'rgba(227,236,238,.9)',600);wt(cx+456,314,'約 0.5–1 kW',28,'#7dc8dc',700,'right',COND);
  wt(cx+24,376,'一輛車充電，約等於好幾戶同時用電',18,'rgba(227,236,238,.8)',500);
  card(cx,470,480,330,{bg:'rgba(7,27,39,.75)',st:'#ff8a60'});wt(cx+24,512,'回家即充的問題',21,'#ff8a60',700);
  bullets10(cx+34,572,['下班時間集中，電動車同時插電','正好疊在夜間尖峰','電網要多備機組與線路容量'],'#ff8a60',u,.3,56);
 }},

{t:'車庫裡的智慧充電',en:'Smart charging at home',dur:13,side:true,
 d:'智慧充電不是把電動車變貴，而是讓充電聽訊號。車子與充電樁以通訊標準連線，車主先設定好「幾點要出發」與「要充到幾成」，充電樁再依電價、電網狀況或太陽光電的出力，決定何時、用多大功率補電。只要在出發前達到目標電量，什麼時候充都一樣；於是充電可以避開尖峰，把負載挪到深夜或有太陽的時段。',
 s:[[0,'車與充電樁以通訊標準連線'],[.3,'車主設定出發時間與目標電量'],[.55,'傍晚尖峰時段，充電功率先壓低'],[.8,'深夜離峰，再依需要提高功率補電']],
 draw(u){
  const gy=GY;house10(1050,gy);
  const gp=pole10(930,gy,190);meter10(1000,gy,'#7dffc4');
  wall10(840,gy,u>.1,'#7dffc4');
  const peak=u<.55&&u>.2;const kw=u<.2?0:(peak?1.5:(u<.9?7:7*(1-seg(u,.9,1))));
  car10(520,gy,'#3f8fb0');
  const cable=[[840+23,gy-30],[760,gy-30],[760,gy-24],[660,gy-26]];ln(cable.flat(),'#2b3137',5);
  flow10(cable,-1,'#7dffc4',6,4,clamp(kw/7,0,1)*seg(u,.1,.2),.2);
  const comm=seg(u,.05,.25);
  alphaDo(comm,()=>{ctx.setLineDash([8,8]);ctx.lineDashOffset=-TT*30;ln([520,gy-110,520,gy-210,863,gy-210,863,gy-96],'#f2c230',2.4);ctx.setLineDash([]);});
  lab(520,gy-100,'電動車',{dx:-30,dy:-120,st:'s',a:band(u,.02,.4)});
  lab(863,gy-70,'充電樁',{dx:0,dy:-190,st:'g',a:band(u,.15,.9)});
  lab(692,gy-210,'車樁通訊',{dx:0,dy:-60,st:'s',a:band(u,.08,.4)});
  lab(1022,gy-139,'智慧電表',{dx:20,dy:-110,st:'l',a:band(u,.5,.95)});
 },
 hud(u){
  const peak=u<.55&&u>.2;const kw=u<.2?0:(peak?1.5:(u<.9?7:7*(1-seg(u,.9,1))));
  const s=Math.round(lerp(40,90,ease(clamp(u*1.05,0,1))));
  hudPanel(290,152,'智慧充電（示例）',seg(u,.04,.1),w=>{hrow(56,'目標電量','90%',w,'#f2c230');hrow(88,'出發時間','07:30',w,'#7dc8dc');hrow(120,'充電功率',kw.toFixed(1)+' kW',w,peak?'#ff8a60':'#7dffc4');});}},

{t:'充電怎麼排程',en:'Scheduling the charge',dur:13,
 d:'把同樣的充電量改排到不同時段，負載曲線的形狀就變了。示例中，車主在傍晚尖峰時不充電，讓電網先喘口氣；深夜離峰再以較低功率慢慢補電，白天若停在公司，則吸收中午太陽光電的剩餘電力。時間電價是最直接的訊號：離峰便宜、尖峰貴，系統自動替車主算出最省的充電計畫。這樣不必增加機組，就能把尖峰壓平，還讓再生能源多一個去處。',
 s:[[0,'先畫出回家即充的負載'],[.3,'傍晚尖峰時不充電'],[.55,'深夜離峰補電，白天吸收太陽光電'],[.85,'尖峰壓平，電網少備容量']],
 draw(u){
  diagBG();
  const C=chartBox(60,150,960,650,{title:'排程後的一天負載（相對值，典型範例）',x0:0,x1:24,y0:40,y1:130,xt:[0,6,12,18,24],yt:[40,60,80,100,120],xl:'時',pl:84,pt:60,pb:56,gx:4,gy:4});
  curve10(C,h=>base10(h)+evU10(h),'rgba(255,138,96,.45)',1,3);
  curve10(C,base10,'#58b8d0',1,3);
  const p=ease(seg(u,.35,.8));ctx.beginPath();for(let i=0;i<=96*p;i++){const h=24*i/96;i?ctx.lineTo(C.X(h),C.Y(base10(h)+evS10(h))):ctx.moveTo(C.X(h),C.Y(base10(h)+evS10(h)));}ctx.strokeStyle='#7dffc4';ctx.lineWidth=4.4;ctx.stroke();
  wt(C.px+16,C.py+34,'回家即充',17,'#ff9d7a',700);wt(C.px+16,C.py+60,'原本負載',17,'#58b8d0',700);wt(C.px+16,C.py+86,'智慧排程後',17,'#7dffc4',700);
  alphaDo(seg(u,.3,.42),()=>{box(C.X(1),C.py,C.X(4)-C.X(1),C.ph,'rgba(125,255,196,.1)');tag(C.X(2.5),C.py+160,'深夜離峰',{size:15,bg:'#58b8d0',align:'center'});});
  alphaDo(seg(u,.5,.62),()=>{box(C.X(11),C.py,C.X(14.5)-C.X(11),C.ph,'rgba(242,194,48,.1)');tag(C.X(12.7),C.py+210,'中午太陽光電',{size:15,bg:'#f2c230',fg:'#13232e',align:'center'});});
  alphaDo(seg(u,.8,.92),()=>tag(C.X(20),C.Y(base10(20)+evS10(20))-46,'尖峰沒有增加',{size:16,bg:'#7dffc4',fg:'#13232e',align:'center'}));
  const cx=1060;card(cx,150,480,300,{bg:'rgba(7,27,39,.75)',st:'#7dffc4'});wt(cx+24,192,'充電排程看什麼訊號',21,'#7dffc4',700);
  bullets10(cx+34,252,['時間電價：離峰便宜、尖峰貴','電網與負載：尖峰時降功率','太陽光電出力：中午多充'],'#7dffc4',u,.12,50);
  card(cx,470,480,330,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});wt(cx+24,512,'車主只要決定兩件事',21,'#f2c230',700);
  alphaDo(seg(u,.3,.4),()=>{tag(cx+34,556,'幾點出發',{size:19,bg:'#f2c230',fg:'#13232e'});wt(cx+250,576,'→ 例：07:30',19,'rgba(227,236,238,.95)',500);});
  alphaDo(seg(u,.4,.5),()=>{tag(cx+34,616,'充到幾成',{size:19,bg:'#f2c230',fg:'#13232e'});wt(cx+250,636,'→ 例：90%',19,'rgba(227,236,238,.95)',500);});
  alphaDo(seg(u,.55,.65),()=>wt(cx+24,700,'出發前達標，時機由系統決定',17,'rgba(227,236,238,.85)',500));
 }},

{t:'V2G：把電送回去',en:'V2G: sending power back',dur:14,side:true,
 base:()=>{landSky(GY,{sun:{x:260,y:330},dusk:.8});drawGround();},
 d:'V2G（Vehicle-to-Grid）讓電流可以雙向流動。車上的電池是直流電，雙向充電樁內有變流器，放電時把直流轉成與電網同頻同相的交流，經住宅的電表送進家中用電，多出的部分回到電網。傍晚尖峰，太陽下山、冷氣與烹飪正忙，示例中一輛車以 7 kW 放電約 2 小時，送出約 15 kWh，相當於一座小型儲能。車與樁必須都支援雙向傳輸，並通過併網規範。',
 s:[[0,'傍晚，太陽下山，家中用電變多'],[.3,'車上直流電池透過雙向充電樁放電'],[.55,'變流器轉成同頻同相的交流'],[.8,'先供家中使用，多餘的送回電網']],
 draw(u){
  const gy=GY;house10(1050,gy);const gp=pole10(930,gy,190);meter10(1000,gy,'#f2c230');
  wall10(840,gy,u>.2,'#f2c230');car10(520,gy,'#3f8fb0');
  const kw=7*seg(u,.25,.4);
  const cable=[[660,gy-26],[760,gy-24],[760,gy-30],[863,gy-30]];ln(cable.flat(),'#2b3137',5);
  flow10(cable,1,'#f2c230',6,4,seg(u,.25,.4),.22);
  const toH=[[1000,gy-110],[1090,gy-110]];flow10([[880,gy-110],[1000,gy-110],[1100,gy-110]],1,'#f2c230',5,3.4,seg(u,.5,.65),.2);
  const toG=[[880,gy-110],[900,gy-150],[930,gy-178]];flow10([[880,gy-110],[900,gy-150],[930,gy-178],[1000,gy-250]],1,'#7dffc4',5,3.4,seg(u,.7,.85),.18);
  alphaDo(seg(u,.5,.62),()=>{tag(1260,gy-190,'家中用電',{size:18,bg:'#13232e',fg:'#f2c230',align:'center'});});
  lab(520,gy-100,'電動車（直流電池）',{dx:-30,dy:-130,st:'s',a:band(u,.02,.5)});
  lab(863,gy-70,'雙向充電樁',{dx:0,dy:-190,st:'w',a:band(u,.25,.95)});
  lab(863,gy-120,'直流→交流',{dx:-40,dy:80,st:'g',a:band(u,.5,.95)});
  lab(930,gy-178,'送回電網',{dx:60,dy:-110,st:'g',a:band(u,.7,.98)});
 },
 hud(u){
  const kw=7*seg(u,.25,.4);const soc=Math.round(80-25*seg(u,.3,.95));
  hudPanel(290,152,'V2G 放電（示例）',seg(u,.04,.1),w=>{hrow(56,'放電功率',kw.toFixed(1)+' kW',w,'#f2c230');hrow(88,'電池電量',soc+'%',w,'#7dffc4');hbar(16,102,w-32,soc/100,'#7dffc4');hrow(138,'時段','19–21 時',w,'#ff9d7a');});}},

{t:'一輛車的一天',en:'One car, one day',dur:13,
 d:'一輛車的電量一天會怎麼變？示例中，深夜離峰把電池補到九成；白天通勤與停放，吃掉約一成，中午停在公司時再吸收一點太陽光電；傍晚回家，在尖峰以 7 kW 放電約兩小時，電量降到五成多；之後再充電，隔天早上仍回到九成。關鍵是車主設定的底線：放電不能低於 30%，確保隔天出門有電，也減少電池過度循環。',
 s:[[0,'深夜離峰，電量補到九成'],[.3,'白天通勤，中午吸收太陽光電'],[.6,'傍晚尖峰放電，電量降到五成多'],[.85,'電量仍高於 30% 底線，隔天照常出門']],
 draw(u){
  diagBG();
  const C=chartBox(60,150,960,650,{title:'電動車電量的一天（典型範例，60 kWh 電池）',x0:0,x1:24,y0:0,y1:100,xt:[0,6,12,18,24],yt:[0,25,50,75,100],xl:'時',pl:84,pt:60,pb:56,gx:4,gy:4});
  const hm=24*ease(seg(u,.08,.82));
  ctx.beginPath();for(let h=0;h<=hm+1e-6;h+=.25)h?ctx.lineTo(C.X(h),C.Y(soc10(h))):ctx.moveTo(C.X(h),C.Y(soc10(h)));ctx.strokeStyle='#7dffc4';ctx.lineWidth=4.4;ctx.stroke();
  ln([C.px,C.Y(30),C.px+C.pw,C.Y(30)],'#e8572a',2.4);wt(C.px+C.pw-8,C.Y(30)-10,'車主底線 30%',17,'#ff9d7a',700,'right');
  ln([C.X(hm),C.py,C.X(hm),C.py+C.ph],'rgba(255,255,255,.4)',1.4);circ(C.X(hm),C.Y(soc10(hm)),7,'#fff','#7dffc4',3);
  const zones=[[0,3.5,'離峰補電','#58b8d0',.12],[11,14,'吸收光電','#f2c230',.4],[19,22,'V2G 放電','#e8572a',.62]];
  zones.forEach(([a,b,n,c,a0])=>alphaDo(seg(u,a0,a0+.1),()=>{box(C.X(a),C.py,C.X(b)-C.X(a),C.ph,c+'22');tag(C.X((a+b)/2),C.py+30,n,{size:15,bg:c,fg:c=='#f2c230'?'#13232e':'#fff',align:'center'});}));
  const cx=1060;
  card(cx,150,480,300,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(cx+24,192,'此刻（示例）',21,'#7dc8dc',700);
  const hh=Math.round(hm),s=soc10(hm);
  hrw10(cx+24,254,'時間',String(hh%24).padStart(2,'0')+':00',432,'#fff');
  hrw10(cx+24,310,'電池電量',Math.round(s)+'%',432,s<60?'#f2c230':'#7dffc4');
  hrw10(cx+24,366,'約等於',(s*.6).toFixed(0)+' kWh',432,'#7dc8dc');
  card(cx,470,480,330,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});wt(cx+24,512,'放電設定的三道防線',21,'#f2c230',700);
  bullets10(cx+34,572,['最低電量底線（例 30%）','出發前一定回到目標電量','只在尖峰或電價高時放電'],'#f2c230',u,.5,56);
 }},

{t:'聚合與取捨',en:'Aggregation and trade-offs',dur:14,
 d:'一輛車的 7 kW 對電網很小，但把一千輛聚合起來，就是 7 MW，相當於一座中型儲能。聚合商把分散的車輛集合成一個資源，向電網或市場提供調頻與備轉。代價也要看清楚：充放電有約一成多的損失、電池多循環會加速老化、車與樁都要支援雙向並通過併網規範，車主也需要足夠的回饋才願意參加。台灣已有媒體報導的 V2G 示範場，仍屬早期推廣階段。',
 s:[[0,'一輛車很小，一千輛聚合就是 7 MW'],[.3,'聚合商把分散的車輛當成一座儲能'],[.6,'代價：損失、電池老化、設備與規範'],[.85,'台灣已有示範場，仍在早期階段']],
 draw(u){
  diagBG();
  card(60,150,740,650,{bg:'rgba(7,27,39,.75)'});wt(84,190,'一千輛車的聚合（算術示意）',22,'#f2c230',700);
  const R=rng(10),n=Math.round(1000*ease(seg(u,.05,.4)));
  const cols=40,rows=25,gx=84,gy0=226,cw=17,chh=11;
  const shown=Math.round(cols*rows*n/1000);
  for(let i=0;i<cols*rows;i++){const cx0=gx+(i%cols)*cw,cy0=gy0+Math.floor(i/cols)*chh;box(cx0,cy0,cw-4,chh-3,i<shown?'#7dffc4':'rgba(255,255,255,.08)');}
  hrw10(84,556,'車輛數',trf('{n} 輛',{n:n}),690,'#fff');
  hrw10(84,612,'每輛放電','7 kW',690,'#7dc8dc');
  hrw10(84,668,'聚合容量',(n*7/1000).toFixed(1)+' MW',690,'#7dffc4');
  alphaDo(seg(u,.3,.45),()=>{wt(84,740,'聚合商統一調度：調頻、備轉、削尖峰',19,'#f2c230',700);ln([84,756,776,756],'rgba(242,194,48,.5)',2);wt(84,784,'車主仍保有最低電量與出發時間的決定權',16,'rgba(227,236,238,.8)',500);});
  const x=840;
  card(x,150,700,290,{bg:'rgba(7,27,39,.75)',st:'#e8572a'});wt(x+24,192,'要付出的取捨',22,'#ff9d7a',700);
  bullets10(x+34,252,['來回效率約 85%，一成多變成熱','多循環會加速電池老化，需回饋補償','車與充電樁都要支援雙向，並通過併網規範','車主參與意願取決於回饋與便利'],'#e8572a',u,.5,46);
  card(x,460,700,340,{bg:'rgba(7,27,39,.75)',st:'#b37cff'});wt(x+24,502,'台灣的情境',22,'#b37cff',700);
  bullets10(x+34,562,['台北有媒體報導的 V2G 示範場','電動車專屬時間電價曾有草案','以公告為準，仍在早期推廣','先做智慧充電，再逐步邁向雙向'],'#b37cff',u,.7,52);
 }}
]};
