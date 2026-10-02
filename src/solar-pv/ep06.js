// KITS: land
/* 太陽光電系列 第 6 集：光電場運維與清洗 */
const ROWS=[200,420,640,860,1080],INVX=1240,HOUSE=1350;   // 支架排位置、組串變流器、監控室
const E_Y='#f2c230',E_G='#7dffc4',E_W='#e8572a';
const DEG=Math.PI/180,TA=12*DEG,TW=190;
const gy=x=>groundY(x);
/* 一排支架：o.dirt 積塵 0–1，o.clean 已清洗比例（由左往右），o.hot 熱斑位置（0–1） */
function tbl(cx,o){o=o||{};const y=gy(cx),cy=y-62,tn=Math.tan(TA);
 ln([cx-70,y,cx-70,cy+70*tn],'#8a99a3',5);ln([cx+70,y,cx+70,cy-70*tn],'#8a99a3',5);
 ctx.save();ctx.translate(cx,cy);ctx.rotate(-TA);box(-TW/2,-8,TW,8,'#1f3f66','rgba(0,0,0,.4)',1);
 ctx.strokeStyle='rgba(160,200,240,.5)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<6;i++){ctx.moveTo(-TW/2+TW*i/6,-8);ctx.lineTo(-TW/2+TW*i/6,0);}ctx.stroke();
 box(-TW/2,-8,TW,1.6,o.glint?'#fff':'#9fc3e6');
 const d=o.dirt||0,c=o.clean||0;if(d>0){const x0=-TW/2+TW*c;if(x0<TW/2)box(x0,-9,TW/2-x0,9,`rgba(150,118,74,${.75*d})`);}
 ctx.restore();}
function field(o){o=o||{};ROWS.forEach((x,i)=>tbl(x,{dirt:o.dirt,glint:Math.sin(TT*1.3+x)>.96,clean:o.cleanAt?o.cleanAt(i):0}));
 ln([ROWS[0]+70,gy(ROWS[0])-20,ROWS[4]+70,gy(ROWS[4])-20,INVX-20,gy(INVX)-20],'#2b3137',2.5);}
function inverter(){const y=gy(INVX);box(INVX-26,y-70,52,70,'#dfe5e8','rgba(0,0,0,.3)',1);box(INVX-18,y-58,36,10,'#2b3137');circ(INVX+14,y-30,3,E_G);
 for(let i=0;i<3;i++)ln([INVX-18,y-38+i*7,INVX+4,y-38+i*7],'rgba(0,0,0,.25)',2);}
function house(){const x=HOUSE,y=gy(x+70);box(x,y-110,170,110,'#e9e2cf','rgba(0,0,0,.3)',1);poly([x-10,y-110,x+180,y-110,x+170,y-126,x,y-126],'#6f7d86');
 box(x+20,y-86,70,44,'#13232e');ln([x+26,y-52,x+40,y-66,x+54,y-58,x+68,y-76,x+84,y-70],E_G,2);box(x+110,y-80,40,80,'#8d989f');
 ln([x+150,y-126,x+150,y-196],'#5d6a72',3);circ(x+150,y-198,5,E_Y);}
function partialPt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
 let r=f*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,sp,col,a){if(a<=0)return;for(let k=0;k<n;k++){const f=(TT*sp+k/n)%1,p=partialPt(P,f);alphaDo(a,()=>circ(p[0],p[1],4,col));}}
function drone(x,y){box(x-22,y-6,44,12,'#dfe5e8','rgba(0,0,0,.4)',1);ln([x-48,y-8,x+48,y-8],'#394650',3);
 [-48,48].forEach(d=>{const w=22*Math.abs(Math.sin(TT*30+d));ln([x+d-w,y-12,x+d+w,y-12],'rgba(230,240,245,.9)',2.5);ln([x+d,y-8,x+d,y-12],'#394650',2);});
 box(x-8,y+6,16,10,'#2b3137');circ(x,y+12,3,'#ff8a60');}
/* 草：h 高度（px），cut 已除草的 x 位置 */
function grass(x0,x1,h,cut){ctx.strokeStyle='#5c8a3f';ctx.lineWidth=2;ctx.beginPath();for(let x=x0;x<=x1;x+=7){const hh=(cut!==undefined&&x<cut)?4:h*(.7+.3*nz(x*.05));const y=gy(x);ctx.moveTo(x,y);ctx.lineTo(x+3,y-hh);}ctx.stroke();}
function mower(x){const y=gy(x);box(x-34,y-26,68,18,'#e9b21f','rgba(0,0,0,.35)',1);box(x-6,y-44,22,18,'#394650');circ(x-22,y-6,8,'#222');circ(x+24,y-6,8,'#222');person(x+4,y-44,'#1f7f99',5);}
function cleaner(x,ty){const y=gy(x);person(x,y,'#e8572a',6);ln([x+6,y-48,x+46,ty],'#dfe5e8',2.5);box(x+40,ty-3,14,6,E_Y);
 for(let k=0;k<6;k++){const f=(TT*2+k/6)%1;alphaDo(1-f,()=>circ(x+50+f*10,ty+4+f*30,2.2,'#bfe8f2'));}}
/* 模組正視圖（熱影像） */
function heat(t){const c=[[59,42,122],[180,60,120],[232,87,42],[242,194,48],[255,250,220]];t=clamp(t)*4;const i=Math.min(3,Math.floor(t)),f=t-i,a=c[i],b=c[i+1];
 return `rgb(${lerp(a[0],b[0],f)|0},${lerp(a[1],b[1],f)|0},${lerp(a[2],b[2],f)|0})`;}

const EP={no:6,slug:'solar-pv',seriesName:'太陽光電系列',t:'光電場運維與清洗',en:'Operating and cleaning a solar farm',
lede:'光電場併網之後要運轉二十年以上，發電量能不能維持，靠的是日常運維。這一集看監控系統如何從數據找出異常、無人機熱影像怎麼抓出熱斑，以及清洗、除草與颱風前後檢查各有什麼講究。',
facts:[['≥ 600','W/m²','IEC TS 62446-3 建議的熱影像巡檢最低日照強度'],
['5–10','%','模組清洗後常見可回復的發電量，依積塵程度與環境而異'],
['75–85','%','地面型光電場常見的性能比（PR）範圍（示例）'],
['17','級','屋頂型光電抗風要求：模組正負向須抗 17 級陣風'],
['2','年','屋頂型光電定期檢驗與維護的週期'],
['10','°C','熱斑溫差超過約 10 °C 時安排檢修（示例）']],
note:'說明：本集為教育用途示意動畫，設備、人物與距離比例經過調整。熱影像巡檢最低日照 600 W/m² 依 IEC TS 62446-3:2017；清洗後可回復 5–10% 發電量為模組商與業界常見說法；屋頂型光電須抗 17 級陣風、每 2 年定期檢驗維護依經濟部能源署修法與媒體報導；颱風前後檢查扣件、壓板、螺栓與纜線依能源署宣導。性能比 75–85%、組串電流、熱斑溫差分級、積塵損失曲線與清洗時機皆為典型範例，實際依案場設計、設備規格與維運合約而定。',
base:()=>{landSky(GY,{sun:{x:1060,y:120},clouds:false});drawGround();},
shots:[
{t:'光電場的日常',en:'A day at the solar farm',dur:12,side:true,
 d:'光電場併網後要運轉二十年以上，日常運維決定了發電量能不能維持。每一排模組的直流電先送進組串變流器，變流器除了轉成交流電，也記錄每一串的電壓、電流與告警。資料記錄器把這些數據連同日照計、模組溫度一起上傳到監控平台，維運人員在監控室或手機上就能看到全場狀況，發現異常再派人到現場處理。',
 s:[[0,'光電場併網後，要運轉二十年以上'],[.28,'每一串模組的電力送進組串變流器'],[.54,'變流器與日照計的數據上傳監控平台'],[.78,'維運人員從數據發現異常，再到現場處理']],
 cam:u=>camMix({x:800,y:450,s:1},{x:1080,y:500,s:1.35},ease(seg(u,.3,.5))),
 draw(u){
  field();inverter();house();
  const y=gy(INVX);flowDots([[ROWS[0]+70,gy(ROWS[0])-20],[INVX-20,y-20]],8,.35,E_Y,seg(u,.28,.36));
  flowDots([[INVX+26,y-50],[HOUSE,y-50],[HOUSE+150,gy(HOUSE+70)-198]],5,.5,E_G,seg(u,.52,.6));
  box(1180,y-58,6,58,'#5d6a72');box(1170,y-66,26,8,'#dfe5e8');
  lab(ROWS[1],gy(ROWS[1])-70,'模組支架排',{dx:-30,dy:-90,st:'l',a:band(u,.04,.3)});
  lab(INVX,y-70,'組串變流器',{dx:-60,dy:-80,st:'s',a:band(u,.3,.62)});
  lab(1183,y-66,'日照計',{dx:-80,dy:-40,a:band(u,.5,.78),minor:true});
  lab(HOUSE+60,gy(HOUSE+70)-110,'監控室',{dx:-40,dy:-90,st:'g',a:band(u,.56,1)});
  lab(HOUSE+150,gy(HOUSE+70)-198,'資料上傳',{dx:-90,dy:20,a:band(u,.6,.9),minor:true});
 },
 hud(u){hudPanel(250,150,'即時數據（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.1,.5));
  hrow(56,'日照',Math.round(820*k)+' W/m²',w,'#f2c230');hrow(88,'即時功率',(7.9*k).toFixed(1)+' MW',w,'#fff');hrow(120,'性能比',Math.round(81*k)+' %',w,'#7dffc4');});}},

{t:'從數據找異常',en:'Finding faults in the data',dur:12,
 d:'監控的核心指標是性能比（PR）：實際發電量除以依當下日照、裝置容量算出的理論發電量。地面型案場的 PR 常見在 75% 到 85% 之間，它扣掉了天氣的影響，所以可以拿不同日子、不同案場互相比較。PR 突然下滑，就要往下比對各組串的電流：同一台變流器下的組串照到同樣的陽光，電流應該相近，明顯偏低的那一串，往往有接頭鬆脫、模組損壞或局部遮蔭。',
 s:[[0,'監控平台比對實際發電與理論發電'],[.3,'性能比扣掉天氣影響，可以長期追蹤'],[.56,'同一台變流器下，各組串電流應該相近'],[.78,'偏低的組串，就是要派人檢查的地方']],
 draw(u){
  diagBG();
  card(60,160,800,640,{bg:'rgba(7,27,39,.75)'});
  const c=chartBox(90,180,740,450,{title:'一天的發電功率（示例）',x0:6,x1:18,y0:0,y1:10,xt:[6,9,12,15,18],yt:[0,2,4,6,8,10],xl:'時',yl:'MW'});
  const P=(h,s)=>s*9.6*Math.pow(Math.max(0,Math.sin((h-6)/12*Math.PI)),1.2);
  const line=(s,col,f,dash)=>{ctx.beginPath();for(let h=6;h<=6+12*f+1e-6;h+=.1){const x=c.X(h),y=c.Y(P(h,s));h===6?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=3.5;if(dash)ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);};
  const f1=ease(seg(u,.04,.24)),f2=ease(seg(u,.14,.34));
  line(1,'rgba(227,236,238,.75)',f1,true);if(f2>0)line(.81,E_G,f2);
  alphaDo(seg(u,.2,.26),()=>wt(c.X(8.9),c.Y(8.6),'理論發電',17,'rgba(227,236,238,.85)',700,'center'));
  alphaDo(seg(u,.3,.36),()=>wt(c.X(12),c.Y(5.6),'實際發電',17,E_G,700,'center'));
  const k=seg(u,.32,.42);
  alphaDo(k,()=>{card(90,660,740,120,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});
   wt(114,708,'性能比 PR ＝ 實際發電 ÷ 理論發電',19,'#fff',700);wt(806,712,trf('{n} %',{n:Math.round(81*ease(seg(u,.34,.46)))}),34,E_G,700,'right',COND);
   wt(114,752,'地面型案場常見 75–85%（示例）',16,'rgba(227,236,238,.8)',500);});
  card(900,160,640,640,{bg:'rgba(7,27,39,.75)'});wt(924,200,'同一台變流器的組串電流（示例）',20,'#f2c230',700);
  const I=[9.1,9.0,9.2,8.9,9.1,7.4,9.0,9.1],bx=960,bw=58,base=640,sc=30;
  ln([940,base,1516,base],'rgba(255,255,255,.4)',1.5);
  I.forEach((v,i)=>{const kk=ease(seg(u,.52+i*.025,.6+i*.025)),x=bx+i*68,low=i===5,on=low&&u>.76;
   box(x,base-v*sc*kk,bw,v*sc*kk,on?E_W:'#58b8d0');
   wt(x+bw/2,base+30,String(i+1),17,on?'#ff9d7a':'rgba(227,236,238,.8)',700,'center',COND);
   alphaDo(kk,()=>wt(x+bw/2,base-v*sc-12,v.toFixed(1),16,on?'#ff9d7a':'#fff',700,'center',COND));});
  wt(924,base+66,'組串編號　單位：A',16,'rgba(227,236,238,.7)',500);
  alphaDo(seg(u,.78,.84),()=>{tag(1060,250,'第 6 串偏低約 18%',{size:17,bg:E_W,fg:'#fff'});
   wt(924,760,'可能原因：接頭鬆脫、模組損壞、局部遮蔭',16,'#fff',600);});
 }},

{t:'無人機熱影像巡檢',en:'Drone thermal inspection',dur:12,side:true,
 d:'模組內部的缺陷，肉眼往往看不出來，但會發熱。維運團隊用搭載紅外線熱像儀的無人機，沿著陣列以固定高度飛行拍攝，一個上午就能掃過數十公頃。依 IEC TS 62446-3，巡檢時模組面的日照強度至少要 600 W/m²，電流夠大，缺陷才會明顯升溫。影像經軟體拼接後，溫度異常的電池片會以亮點標出位置，再派人到現場確認與更換。',
 s:[[0,'無人機載著紅外線熱像儀，沿陣列飛行'],[.3,'日照至少 600 W/m²，缺陷才會明顯發熱'],[.56,'熱影像上，異常的電池片呈現亮點'],[.8,'軟體標出位置，再派人到現場確認']],
 cam:u=>({x:800,y:450,s:1}),
 draw(u){field();inverter();
  const dx=lerp(120,1120,ease(seg(u,.06,.86))),dy=300+6*Math.sin(TT*2);
  alphaDo(.18,()=>poly([dx-6,dy+16,dx+6,dy+16,dx+70,gy(dx)-60,dx-70,gy(dx)-60],'#ffb27a'));
  drone(dx,dy);
  lab(dx,dy-10,'熱像無人機',{dx:-60,dy:-60,st:'s',a:band(u,.04,.4)});
  lab(ROWS[2],gy(ROWS[2])-64,'掃描範圍',{dx:0,dy:110,a:band(u,.3,.56),minor:true});
  /* 右上：熱影像拼接圖 */
  const a=seg(u,.2,.3);
  alphaDo(a,()=>{card(1010,140,540,330,{bg:'rgba(7,27,39,.88)'});wt(1032,176,'熱影像拼接（示意）',18,E_Y,700);
   const g0x=1036,g0y=196,cw=27,ch=22,rev=seg(u,.06,.86)*20;
   for(let r=0;r<10;r++)for(let q=0;q<18;q++){if(q>rev)continue;const hot=(r===6&&q===11),warm=(r===2&&q===4);
    let t=.18+.08*hn(r,q);if(hot)t=.95;if(warm)t=.62;box(g0x+q*cw,g0y+r*ch,cw-2,ch-2,heat(t));}
   ln([g0x+rev*cw,g0y,g0x+rev*cw,g0y+220],'rgba(255,255,255,.7)',1.5);
   if(u>.6){ring(g0x+11*cw+12,g0y+6*ch+10,18+3*Math.sin(TT*5),E_Y,2.5);}
   wt(1032,452,u>.6?'熱斑：比周圍高 24 °C':'掃描中…',16,u>.6?E_Y:'rgba(227,236,238,.8)',700);});
 }},

{t:'熱斑從哪裡來',en:'What causes a hot spot',dur:12,
 d:'一片模組由 60 到 72 個電池片串聯，分成三段，每段並聯一顆旁路二極體。當某個電池片被鳥糞、落葉遮住，或內部隱裂，它就產生不了電流，反而被其他電池片推著電流通過，像電阻一樣發熱，形成熱斑。旁路二極體會讓電流繞過這一段，保護模組，但這段的發電量也就損失了。長期的熱斑會讓封裝材料變色、背板燒焦，因此要依溫差高低決定處理的優先順序。',
 s:[[0,'一片模組分成三段，各有一顆旁路二極體'],[.28,'鳥糞或落葉遮住一個電池片'],[.5,'被遮的電池片發熱，旁路二極體導通'],[.74,'依溫差高低，排定處理的優先順序']],
 draw(u){
  diagBG();
  card(60,160,880,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'模組內部（示意）',20,'#f2c230',700);
  const mx=140,my=250,cw=60,ch=44,cols=10,rows=6;
  const shade=ease(seg(u,.28,.36)),hot=ease(seg(u,.42,.52));
  for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){const x=mx+q*cw,y=my+r*ch,isS=(r===4&&q===6);
   box(x,y,cw-4,ch-4,isS&&hot>0?heat(.25+.7*hot):'#1f3f66','rgba(160,200,240,.35)',1);}
  /* 分段 */
  [0,2,4].forEach((r,i)=>{ctx.setLineDash([5,5]);ln([mx-12,my+r*ch-2,mx+cols*cw+8,my+r*ch-2],'rgba(255,255,255,.35)',1.2);ctx.setLineDash([]);
   const y=my+r*ch+ch-2,dxp=mx+cols*cw+40;box(dxp-14,y-10,28,20,i===2&&hot>.5?E_Y:'#8d989f');poly([dxp-6,y-6,dxp-6,y+6,dxp+5,y],'#13232e');
   wt(mx-24,y+6,trf('第 {n} 段',{n:i+1}),15,'rgba(227,236,238,.75)',600,'right');});
  alphaDo(band(u,.06,.4),()=>wt(mx+cols*cw+60,my-16,'旁路二極體',17,'#fff',600,'center'));
  /* 遮蔽物 */
  alphaDo(shade,()=>{const x=mx+6*cw+28,y=my+4*ch+20;circ(x,y,13,'#efe9d8');circ(x+8,y-6,7,'#e2dccb');});
  alphaDo(band(u,.3,.5),()=>tag(mx+6*cw-40,my+4*ch-50,'鳥糞遮蔽',{size:16,bg:'#e3ecee',fg:'#13232e'}));
  if(hot>0){const x=mx+6*cw+28,y=my+4*ch+20;alphaDo(hot*.5,()=>{const g=ctx.createRadialGradient(x,y,4,x,y,70);g.addColorStop(0,'rgba(255,160,90,.8)');g.addColorStop(1,'rgba(255,160,90,0)');ctx.fillStyle=g;ctx.fillRect(x-70,y-70,140,140);});}
  /* 旁路電流 */
  const by=seg(u,.52,.6);
  if(by>0){const y0=my+4*ch,y1=my+6*ch-4,xr=mx+cols*cw+40;alphaDo(by,()=>{pathLine([[mx-6,y1+18],[xr+30,y1+18],[xr+30,y0-10],[mx+cols*cw+80,y0-10]],E_Y,2.5,[7,5]);
   const f=(TT*.6)%1,p=partialPt([[mx-6,y1+18],[xr+30,y1+18],[xr+30,y0-10]],f);circ(p[0],p[1],5,E_Y);});
   alphaDo(band(u,.54,.76),()=>wt(mx,y1+56,'電流繞過第 3 段：保護模組，但這段發電損失',16,E_Y,600));}
  alphaDo(seg(u,.42,.5),()=>wt(84,650,'被遮的電池片變成電阻，局部升溫',17,'#ff9d7a',700));
  /* 右：溫差分級 */
  card(980,160,560,640,{bg:'rgba(7,27,39,.75)'});wt(1004,200,'依溫差分級（示例）',20,'#f2c230',700);
  const L=[['< 10 °C','持續觀察','#7dffc4'],['10–20 °C','排定檢修','#f2c230'],['> 20 °C','優先處理或更換','#e8572a']];
  L.forEach(([a,b,c],i)=>{const k=seg(u,.7+i*.06,.76+i*.06),y=270+i*130;alphaDo(.25+.75*k,()=>{
   box(1004,y,14,90,c);wt(1040,y+38,a,30,c,700,'left',COND);wt(1040,y+76,b,19,'#fff',600);});});
  alphaDo(seg(u,.9,.96),()=>wt(1004,720,'溫差＝異常處與周圍正常電池片的溫度差',15,'rgba(227,236,238,.8)',500));
 }},

{t:'清洗與除草',en:'Cleaning and weeding',dur:12,side:true,
 d:'灰塵、鳥糞、工業落塵與沿海的鹽分會在模組表面累積，擋掉陽光。清洗多安排在清晨或傍晚，模組溫度較低，避免冷水碰到高溫玻璃造成熱衝擊；用軟毛刷搭配低壓清水或純水，不用強酸強鹼清潔劑，也不踩在模組上。支架下的雜草長高後會遮住模組下緣、阻礙巡檢，還可能在乾季引發火災，所以要定期割草，或改用覆蓋與植生管理。',
 s:[[0,'灰塵與鳥糞在模組上累積，擋掉陽光'],[.28,'清晨用軟毛刷與清水，由排頭洗到排尾'],[.56,'支架下的雜草長高，會遮住模組下緣'],[.78,'定期割草，也方便巡檢與防火']],
 base:()=>{landSky(GY,{sun:{x:260,y:230},dusk:.35,clouds:false});drawGround({grass:false});},
 cam:u=>camMix({x:640,y:480,s:1.25},{x:800,y:470,s:1.1},ease(seg(u,.5,.62))),
 draw(u){
  const cl=seg(u,.24,.52);
  const cut=lerp(80,1200,ease(seg(u,.62,.92)));
  const gh=lerp(10,52,ease(seg(u,.5,.6)));
  grass(VX0,VX1,gh,u>.62?cut:undefined);
  ROWS.forEach((x,i)=>{const k=clamp(cl*ROWS.length-i);tbl(x,{dirt:ease(seg(u,0,.14)),clean:k});});
  inverter();
  const ci=Math.min(ROWS.length-1,Math.floor(cl*ROWS.length)),cf=cl*ROWS.length-ci;
  if(u>.22&&u<.54){const cx=ROWS[ci]-TW/2+TW*clamp(cf)*.95,ty=gy(ROWS[ci])-62+(ROWS[ci]-cx)*Math.tan(TA)-6;cleaner(cx-52,ty);}
  if(u>.6)mower(cut+30);
  lab(ROWS[0]+40,gy(ROWS[0])-74,'積塵與鳥糞',{dx:-40,dy:-90,st:'w',a:band(u,.04,.26)});
  lab(ROWS[1],gy(ROWS[1])-70,'軟毛刷＋低壓清水',{dx:40,dy:-110,st:'s',a:band(u,.3,.54)});
  lab(ROWS[3]+60,gy(ROWS[3])-40,'雜草遮住下緣',{dx:40,dy:-100,st:'w',a:band(u,.56,.76)});
  lab(cut+30,gy(cut)-30,'割草機',{dx:-40,dy:-90,st:'g',a:band(u,.66,1)});
 },
 hud(u){hudPanel(250,150,'清洗進度（示例）',seg(u,.05,.1),w=>{const cl=seg(u,.24,.52);
  hrow(56,'已清洗',Math.round(ROWS.length*cl)+' / '+ROWS.length,w,'#fff');hrow(88,'積塵損失',(6*(1-cl)).toFixed(1)+' %',w,cl>.9?'#7dffc4':'#ff9d7a');
  hrow(120,'模組溫度',Math.round(lerp(24,31,u))+' °C',w,'#f2c230');});}},

{t:'積塵損失與清洗時機',en:'Soiling loss and when to clean',dur:12,
 d:'積塵損失會隨乾燥天數慢慢累積，一場夠大的雨能把模組沖乾淨一大半。台灣中南部從秋天到隔年春天雨量少，東北季風又帶來塵土與鹽分，是損失最高的季節；梅雨與颱風季則有雨水自然清洗。清洗一次要花人力與水，所以業者會比較損失的電費與清洗成本，在損失接近門檻時安排清洗，乾季可能每一到兩個月洗一次，雨季則可以少洗。',
 s:[[0,'不下雨的日子，積塵損失慢慢累積'],[.3,'下雨能自然沖掉大部分灰塵'],[.54,'中南部乾季損失最高，需要人工清洗'],[.78,'損失接近門檻時清洗，最划算']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:'rgba(7,27,39,.75)'});
  const c=chartBox(90,180,940,500,{title:'一年的積塵損失（示例：中南部地面型）',x0:0,x1:12,y0:0,y1:8,xt:[0,2,4,6,8,10,12],yt:[0,2,4,6,8],xl:'月',yl:'%'});
  /* 月份 0=10 月起算 */
  alphaDo(seg(u,.3,.38),()=>{box(c.X(7),c.Y(8),c.X(11)-c.X(7),c.Y(0)-c.Y(8),'rgba(88,184,208,.14)');wt((c.X(7)+c.X(11))/2,c.Y(7.4),'梅雨與颱風季',16,'#7dc8dc',700,'center');});
  alphaDo(seg(u,.5,.58),()=>wt(c.X(3),c.Y(7.4),'乾季：東北季風帶來塵土與鹽分',16,'#ff9d7a',700,'center'));
  const CLEAN=[1.6,3.3,5.0,6.6],showC=u>.56;
  const L=(m)=>{let last=0,lv=0;const ev=[];if(showC)CLEAN.forEach(t=>ev.push([t,.15]));[7.3,8.1,8.9,9.6,10.4].forEach(t=>ev.push([t,.25]));ev.sort((a,b)=>a[0]-b[0]);
   const gr=(v,dt,t)=>7.5-(7.5-v)*Math.exp(-dt*(t<7?.55:.15));
   for(const [t,r] of ev){if(t>m)break;lv=gr(lv,t-last,t)*r;last=t;}return gr(lv,m-last,m);};
  const f=ease(seg(u,.04,showC?.9:.5));
  ctx.beginPath();for(let m=0;m<=12*f;m+=.02){const x=c.X(m),y=c.Y(L(m));m===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=showC?E_G:'#ff8a60';ctx.lineWidth=3.5;ctx.stroke();
  alphaDo(seg(u,.74,.8),()=>{ctx.setLineDash([8,6]);ln([c.X(0),c.Y(5),c.X(12),c.Y(5)],E_W,2);ctx.setLineDash([]);wt(c.X(12)-6,c.Y(5)-10,'清洗門檻 5%',16,'#ff9d7a',700,'right');});
  if(showC)CLEAN.forEach((t,i)=>{if(t<12*f)alphaDo(1,()=>{arrow(c.X(t),c.Y(.4)+40,c.X(t),c.Y(.4)+8,E_Y,2);});});
  alphaDo(seg(u,.6,.66),()=>wt(c.X(4.2),c.Y(0)+62,'黃色箭頭：人工清洗',16,E_Y,700,'center'));
  wt(c.X(0),c.Y(0)+62,'10 月',15,'rgba(227,236,238,.7)',600,'left');
  card(1100,160,440,640,{bg:'rgba(7,27,39,.75)'});wt(1124,200,'安排清洗時考量',20,'#f2c230',700);
  const IT=[['損失的電費','積塵損失 × 發電量 × 電價'],['清洗成本','人力、用水、車輛'],['天氣預報','大雨將至就延後'],['乾季頻率','約 1–2 個月一次（示例）']];
  IT.forEach(([a,b],i)=>{const k=seg(u,.2+i*.16,.26+i*.16),y=270+i*130;alphaDo(.25+.75*k,()=>{
   tag(1124,y,String(i+1),{size:17,bg:k>.5?E_Y:'rgba(255,255,255,.25)',fg:k>.5?'#13232e':'#fff'});
   wt(1170,y+7,a,19,'#fff',700);wt(1170,y+43,b,16,'rgba(227,236,238,.8)',500);});});
 }},

{t:'颱風前後的檢查',en:'Before and after a typhoon',dur:12,
 d:'光電設備多以螺栓與壓板鎖固，在強風中持續震動，即使沒有鬆脫，也可能變形或磨損。颱風來臨前，維運人員會檢查並鎖緊壓板與螺栓、固定垂落的纜線、清通排水溝；颱風過後再巡查模組破損、支架變形、積水與漏電，確認安全後才恢復送電。能源署已要求屋頂型光電須抗 17 級陣風，並每 2 年定期檢驗維護。',
 s:[[0,'強風會讓模組受到上掀的力量'],[.28,'颱風前鎖緊壓板與螺栓，固定纜線'],[.54,'颱風後巡查破損、變形、積水與漏電'],[.78,'屋頂型光電須抗 17 級陣風，每 2 年檢驗']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'風力與鎖固點（示意）',20,'#f2c230',700);
  const cx=410,cy=470,wob=Math.sin(TT*9)*2*seg(u,.04,.2)*(1-seg(u,.3,.4));
  ln([cx-130,690,cx-130,cy+26],'#8a99a3',8);ln([cx+130,690,cx+130,cy-30],'#8a99a3',8);box(60+24,690,652,8,'#6b5a45');
  ctx.save();ctx.translate(cx,cy+wob);ctx.rotate(-12*DEG);box(-230,-14,460,14,'#1f3f66','rgba(0,0,0,.4)',1);box(-230,-14,460,2,'#9fc3e6');
  box(-240,-4,480,8,'#b8c2c8');
  [-130,130].forEach(x=>{const tight=seg(u,.32,.42);box(x-16,-20,32,10,tight>.5?E_G:'#d6dde1');circ(x,-15,4,'#394650');});ctx.restore();
  for(let j=0;j<4;j++){const o=(TT*160+j*45)%180;alphaDo(Math.min(1,(180-o)/60)*seg(u,.02,.08),()=>arrow(100+o*.7,cy+80+j*20,170+o*.7,cy+60+j*20,'rgba(125,200,220,.9)',2.5));}
  alphaDo(band(u,.06,.32),()=>{arrow(cx,cy-40,cx,cy-120,E_W,3);wt(cx+14,cy-100,'上掀力',18,'#ff9d7a',700);});
  alphaDo(band(u,.32,1),()=>{wt(cx-150,cy+80,'壓板＋螺栓',17,E_G,700,'center');});
  alphaDo(seg(u,.78,.84),()=>{card(84,700,652,80,{bg:'rgba(242,194,48,.1)',st:'rgba(242,194,48,.5)'});
   wt(108,736,'屋頂型：抗 17 級陣風',19,'#fff',700);wt(108,766,'每 2 年定期檢驗與維護',16,'rgba(227,236,238,.85)',500);});
  const LIST=[[800,'颱風前',.28,['鎖緊壓板與螺栓','固定垂落的纜線','清通排水溝','移除周邊易飛散物']],[1180,'颱風後',.54,['模組玻璃破損','支架變形或鏽蝕','變流器與箱體積水','絕緣與漏電量測']]];
  LIST.forEach(([x,t,a0,it],j)=>{const a=seg(u,a0,a0+.06);alphaDo(.3+.7*a,()=>{card(x,160,360,560,{bg:'rgba(7,27,39,.75)',st:a>.5?'rgba(242,194,48,.6)':'rgba(255,255,255,.16)'});
   wt(x+24,200,t,20,j?'#7dc8dc':E_Y,700);
   it.forEach((s,i)=>{const k=seg(u,a0+.04+i*.04,a0+.08+i*.04),y=268+i*104;alphaDo(.25+.75*k,()=>{
    box(x+24,y-20,24,24,'rgba(0,0,0,0)',k>.5?E_G:'rgba(255,255,255,.4)',2);if(k>.5)ln([x+29,y-8,x+35,y-2,x+44,y-16],E_G,3);
    wt(x+60,y,s,18,'#fff',600);});});});});
  alphaDo(seg(u,.82,.88),()=>{card(800,740,740,60,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});wt(1170,778,'確認安全後，才恢復送電',19,'#fff',700,'center');});
 }}
]};
