// KITS: land
/* 太陽光電系列 第 12 集：孤島效應與防孤島保護 */
const E_Y='#f2c230',E_G='#7dffc4',E_W='#e8572a',E_B='#58b8d0';
const gy=x=>groundY(x);
const CARD='rgba(7,27,39,.75)',DIM='rgba(227,236,238,.85)',OFFW='rgba(255,255,255,.22)';
const TOPY=350;
function house(x,y,w,lit,pv){
 box(x-w/2,y-w*.55,w,w*.55,'#cfd6d9','rgba(0,0,0,.3)',1);
 poly([x-w/2-8,y-w*.55,x,y-w*.55-w*.3,x+w/2+8,y-w*.55],'#7a5a4a','rgba(0,0,0,.3)',1);
 [-.28,.14].forEach(k=>box(x+k*w,y-w*.4,w*.14,w*.16,lit||'#2a3a44','rgba(0,0,0,.35)',1));
 box(x-w*.05,y-w*.3,w*.12,w*.3,'#5b4636');
 if(pv)solarPanel(x+w*.18,y-w*.55-w*.1,w*.55,25,{h:4});
}
function pole(x,y,top){ln([x,y,x,top],'#6b5a4a',6);ln([x-30,top+8,x+30,top+8],'#6b5a4a',5);}
function wire(x0,x1,y,col,lw){ln([x0,y,x1,y],col,lw||3);}
function flowDots(x0,x1,y,col,sp,n){for(let i=0;i<n;i++){const L=x1-x0,p=((TT*sp+i*L/n)%L+L)%L;circ(sp>0?x0+p:x1-p,y,5,col);}}
function breaker(x,y,closed,col){circ(x-22,y,6,col);circ(x+22,y,6,col);if(closed)ln([x-22,y,x+22,y],col,5);else ln([x-22,y,x+10,y-26],col,5);}
function bolt(x,y,s){poly([x,y,x-14*s,y+30*s,x-2*s,y+30*s,x-12*s,y+62*s,x+16*s,y+22*s,x+3*s,y+22*s,x+12*s,y],E_Y,'#fff',1);}
function sine(x0,x1,y,A,cyc,ph,col,lw){ctx.beginPath();for(let i=0;i<=80;i++){const x=lerp(x0,x1,i/80),v=y-A*Math.sin(i/80*cyc*Math.PI*2+ph);i?ctx.lineTo(x,v):ctx.moveTo(x,v);}ctx.strokeStyle=col;ctx.lineWidth=lw||3;ctx.stroke();}

const EP={no:12,slug:'solar-pv',seriesName:'太陽光電系列',t:'孤島效應與防孤島保護',en:'Islanding and anti-islanding protection',
lede:'電網停電了，屋頂的光電卻還在發電，這時一小段線路變成脫離電網的「孤島」，對搶修人員與設備都很危險。這一集看孤島怎麼形成、為什麼難偵測，以及變流器如何用被動與主動方法在兩秒內自己斷開。',
facts:[['2','秒','常見規範與 IEC 62116 測試要求：孤島發生後變流器需在約 2 秒內停止輸出（典型要求）'],
['Q≈1','','IEC 62116 測試用的 RLC 負載品質因數約 1（容許 ±0.2），並調到 60 Hz 共振'],
['100','%','測試時發電量與負載相等，電壓頻率幾乎不變，是最難偵測的情況'],
['20','kVA','台電低壓單相併聯系統最大裝置容量（併聯技術要點）'],
['3','項','高壓併聯常見防孤島設備：遙控跳脫裝置、頻率變化率電驛、相位跳動電驛'],
['60','Hz','台灣電力系統頻率，變流器以它為基準偵測異常']],
note:'說明：本集為教育用途示意動畫，設備與比例經過調整。孤島定義、被動與主動偵測分類、非偵測區（NDZ）與 IEC 62116 測試概念（RLC 負載、品質因數約 1、孤島後約 2 秒內停止輸出）整理自 IEC 62116 標準介紹頁與公開技術文獻；台電低壓單相併聯容量上限 20 kVA、高壓併聯需於責任分界點設置遙控跳脫裝置並加裝頻率變化率電驛（ROCOF）與相位跳動電驛（VSR）等防孤島保護，整理自台電公告之再生能源發電系統併聯技術要點與相關說明，實際整定值以台電最新公告與審查為準。頻率曲線、偏移量與各項數值皆為典型範例，非特定案場資料。',
base:()=>{landSky(GY,{sun:{x:1280,y:120},dusk:.2});drawGround();},
shots:[
{t:'停電了，屋頂卻還亮著',en:'Blackout, but the roofs still shine',dur:13,side:true,
 d:'一條配電饋線從變電所出發，沿路接著住家，許多屋頂都有光電。電網端突然發生事故，變電所的斷路器跳脫，市電停了。但只要陽光夠、屋頂光電發的電又剛好接近這段線路的用電量，變流器就可能繼續供電，讓這一小段線路在沒有電網的情況下仍然帶電。這個與主電網分離、卻自己維持運轉的區域，就叫做孤島。',
 s:[[0,'饋線從變電所出發，沿路接著裝有光電的住家'],[.3,'電網事故，變電所斷路器跳脫，市電停了'],[.58,'屋頂光電繼續發電，這一段線路仍然帶電'],[.82,'與主電網分離卻自己運轉，叫做孤島']],
 draw(u){
  const poles=[140,420,700,980,1260,1500],hx=[280,560,840,1120,1380],open=ease(seg(u,.28,.36));
  poles.forEach(x=>pole(x,gy(x),TOPY));
  cabinet(40,gy(40),70,90,'#dfe5e8');
  hx.forEach(x=>house(x,gy(x),110,u>.3?'#c9ffe6':'#ffe9a8',true));
  const gridCol=open<.5?E_Y:OFFW;
  wire(40,250,TOPY,gridCol,4);wire(250,1500,TOPY,open<.5?E_Y:E_G,4);
  breaker(250,TOPY,open<.5,open<.5?E_Y:E_W);
  if(open<.5){flowDots(40,1500,TOPY,E_Y,90,14);}
  else{hx.forEach((x,i)=>{for(let k=0;k<3;k++){const p=((TT*40+k*25+i*9)%75)/75;circ(x+8,lerp(gy(x)-110,TOPY,p),4,E_G);}});}
  alphaDo(seg(u,.24,.32)*(1-seg(u,.5,.62)),()=>bolt(90,190,1.2));
  alphaDo(seg(u,.6,.74),()=>{ctx.setLineDash([10,8]);ctx.strokeStyle=E_G;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(880,TOPY+120,640,170,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);});
  lab(250,TOPY,'變電所斷路器',{dx:-20,dy:-90,st:u>.3?'w':'s',a:band(u,.04,.5)});
  lab(90,240,'電網事故',{dx:110,dy:20,st:'w',a:band(u,.24,.5)});
  lab(1120,gy(1120)-95,'屋頂光電',{dx:40,dy:70,st:'g',a:band(u,.5,.8)});
  lab(1380,TOPY,'孤島',{dx:0,dy:-120,st:'g',a:band(u,.72,1)});
 }},

{t:'孤島怎麼撐得住',en:'How an island sustains itself',dur:14,
 d:'孤島要撐住，關鍵是「發電量剛好等於用電量」。斷路器打開之後，變流器仍然把電送進這段線路的負載。如果光電發得比負載少，線路電壓與頻率會很快掉下來，變流器自己就會偵測到異常停機；如果發得比負載多，電壓則會上升。只有兩邊功率幾乎相等的時候，電壓與頻率幾乎不變，變流器看不出電網已經消失，孤島才會一直撐下去。',
 s:[[0,'斷路器打開，變流器仍把電送進這段線路'],[.3,'光電發得比負載少，電壓與頻率很快掉下去'],[.56,'兩邊功率剛好相等，電壓頻率幾乎不變'],[.82,'變流器看不出電網消失，孤島就撐住了']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:CARD});wt(84,200,'斷路器打開之後的饋線（示意）',20,E_Y,700);
  const op=ease(seg(u,.1,.22));
  box(100,300,130,110,'#1f3f66','rgba(160,200,240,.5)',2);wt(165,362,'電網',22,'#fff',700,'center');
  breaker(330,355,op<.5,op<.5?E_Y:E_W);
  wire(230,308,355,op<.5?E_Y:OFFW,4);wire(352,980,355,E_B,4);
  box(430,500,190,110,'#3a4a55','rgba(255,255,255,.4)',2);wt(525,562,'用戶負載',22,'#fff',700,'center');
  box(760,500,190,110,'#1f5f4a','rgba(125,255,196,.5)',2);wt(855,562,'光電變流器',22,'#fff',700,'center');
  ln([525,355,525,500],E_B,3);ln([855,355,855,500],E_B,3);
  if(op<.5)flowDots(230,525,355,E_Y,80,4);
  for(let k=0;k<3;k++){const p=((TT*50+k*30)%90)/90;circ(855,lerp(500,355,p),4,E_G);circ(lerp(855,525,p),355,4,E_G);circ(525,lerp(355,500,p),4,E_G);}
  card(1100,160,440,640,{bg:CARD});wt(1124,200,'發電與用電的差距',20,E_Y,700);
  const cases=[['發電少於負載',60,100,E_W,.28,'電壓、頻率下降'],['發電約等於負載',100,100,E_G,.54,'幾乎不變，孤島撐住']];
  cases.forEach(([n,pv,ld,col,t0,res],i)=>{const k=seg(u,t0,t0+.1),y=250+i*280;
   alphaDo(.2+.8*k,()=>{wt(1124,y,n,20,'#fff',700);
    box(1124,y+20,Math.round(2.2*pv*k),28,E_G);wt(1124+Math.round(2.2*pv*k)+8,y+42,'光電',16,E_G,700);
    box(1124,y+60,Math.round(2.2*ld),28,E_B);wt(1124+Math.round(2.2*ld)+8,y+82,'負載',16,E_B,700);
    wt(1124,y+135,res,19,col,700);});});
  alphaDo(seg(u,.8,.9),()=>wt(1124,770,'兩者相等時最難被發現',18,E_W,700));
 }},

{t:'為什麼孤島很危險',en:'Why islands are dangerous',dur:13,side:true,
 d:'孤島之所以要避免，是因為停電後沒有人知道線路還帶電。搶修人員以為斷路器已經打開，爬上電線桿作業，卻可能碰到由光電反送的電壓而觸電。電網恢復時，變電所的斷路器若在孤島與主電網相位不同步時重合閘，巨大的電流會衝擊設備與變流器。孤島內電壓與頻率也不受電網穩定，用戶的電器同樣可能受損。',
 s:[[0,'搶修人員確認市電已停，爬上電線桿作業'],[.32,'線路卻被屋頂光電反送，仍然帶電'],[.6,'電網恢復，斷路器重合閘時兩邊相位不同步'],[.82,'衝擊電流會損壞設備與變流器']],
 draw(u){
  const px=760,top=190;
  ln([40,TOPY+0,px,top+20],OFFW,4);
  pole(px,gy(px),top);
  const live=seg(u,.3,.4),rc=seg(u,.6,.7);
  ln([px,top+20,1500,top+20],lerp(0,1,live)>.5?E_G:OFFW,4);
  cabinet(40,gy(40),70,90,'#dfe5e8');breaker(130,TOPY-30,rc<.5,rc<.5?E_W:E_Y);
  house(1180,gy(1180),130,u>.3?'#c9ffe6':'#2a3a44',true);ln([1180,gy(1180)-120,1180,top+20],E_G,2);
  const wy=lerp(gy(px)-30,top+70,ease(seg(u,.05,.3)));
  ln([920,gy(920),850,wy+10],'#9aa7ae',6);box(820,wy,56,32,'#e9b21f','rgba(0,0,0,.4)',2);person(848,wy,'#e8572a',6);
  box(900,gy(920)-36,90,36,'#e9b21f','rgba(0,0,0,.4)',2);circ(920,gy(920),9,'#222');circ(970,gy(920),9,'#222');
  alphaDo(seg(u,.34,.5)*(1-seg(u,.5,.56)),()=>{for(let i=0;i<3;i++){const sx=px+40+i*14,sy=top+20+(i%2)*10;ln([sx,sy,sx+10,sy-14,sx+4,sy-18,sx+16,sy-34],E_Y,3);}});
  alphaDo(seg(u,.62,.72)*(1-seg(u,.9,1)),()=>{circ(130,TOPY-30,22+10*Math.sin(TT*14),'rgba(232,87,42,.35)');bolt(210,TOPY-90,.9);});
  lab(848,wy,'搶修人員',{dx:-120,dy:-60,st:'s',a:band(u,.04,.44)});
  lab(1100,top+20,'光電反送',{dx:-40,dy:-80,st:'g',a:band(u,.3,.62)});
  lab(px+30,top+20,'線路仍帶電',{dx:60,dy:-70,st:'w',a:band(u,.36,.6)});
  lab(130,TOPY-30,'重合閘',{dx:60,dy:-110,st:'w',a:band(u,.58,1)});
  alphaDo(seg(u,.62,.74),()=>{card(160,650,440,110,{bg:'rgba(7,27,39,.8)',st:'rgba(232,87,42,.6)'});wt(180,690,'相位不同步',20,E_W,700);sine(180,360,732,14,1.5,0,E_Y,3);sine(380,580,732,14,1.5,1.6,E_G,3);});
 }},

{t:'被動偵測：看電壓與頻率',en:'Passive detection: watch voltage and frequency',dur:14,
 d:'變流器最基本的防孤島方法是被動偵測：隨時量測併聯點的電壓與頻率，一旦超出設定範圍，就在極短時間內跳脫。電網消失後，只要發電與負載有落差，電壓或頻率就會很快偏離，變流器便會停止輸出。但如果兩邊功率剛好平衡，電壓與頻率變化很小，永遠落在範圍之內，這個「偵測不到的區域」叫做非偵測區（NDZ），需要靠主動偵測補強。',
 s:[[0,'被動偵測：隨時量測電壓與頻率，超出範圍就跳脫'],[.3,'有功率落差時，頻率很快越界，變流器停機'],[.56,'功率剛好平衡，頻率幾乎不動，永遠在範圍內'],[.82,'這個偵測不到的區域，叫做非偵測區（NDZ）']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:CARD});
  const c=chartBox(90,200,940,570,{title:'孤島後的頻率（示例）',x0:0,x1:2,y0:58.5,y1:61.5,xt:[0,.5,1,1.5,2],yt:[59,60,61],xl:'孤島後時間（秒）',yl:'頻率（Hz）',pl:80,pr:30,pt:60,pb:60});
  ctx.setLineDash([8,6]);ln([c.X(0),c.Y(60.5),c.X(2),c.Y(60.5)],E_W,2);ln([c.X(0),c.Y(59.5),c.X(2),c.Y(59.5)],E_W,2);ctx.setLineDash([]);
  wt(c.X(2)-10,c.Y(60.5)-10,'上限（示例 60.5）',16,E_W,700,'right');wt(c.X(2)-10,c.Y(59.5)+24,'下限（示例 59.5）',16,E_W,700,'right');
  const f=seg(u,.06,.8);
  const fa=t=>60-1.3*(1-Math.exp(-t/.5)),fb=t=>60+.18*(1-Math.exp(-t/.8))+.03*Math.sin(t*9);
  const tripT=.27;
  ctx.beginPath();for(let t=0;t<=Math.min(2*f,tripT+.02);t+=.02){const v=fa(t);t?ctx.lineTo(c.X(t),c.Y(v)):ctx.moveTo(c.X(t),c.Y(v));}ctx.strokeStyle=E_W;ctx.lineWidth=4;ctx.stroke();
  ctx.beginPath();for(let t=0;t<=2*f;t+=.02){const v=fb(t);t?ctx.lineTo(c.X(t),c.Y(v)):ctx.moveTo(c.X(t),c.Y(v));}ctx.strokeStyle=E_G;ctx.lineWidth=4;ctx.stroke();
  alphaDo(seg(u,.3,.4),()=>{circ(c.X(tripT),c.Y(59.5),9,E_W);tag(c.X(tripT)+30,c.Y(61.2),'越界，變流器跳脫',{size:19,bg:E_W,fg:'#13232e'});});
  alphaDo(seg(u,.56,.7),()=>{tag(c.X(.75),c.Y(59.0),'功率平衡：永遠在範圍內',{size:19,bg:E_G,fg:'#13232e'});});
  card(1100,160,440,640,{bg:CARD});wt(1124,200,'常見的被動保護',20,E_Y,700);
  [['過／低電壓','電壓超出設定範圍就跳脫',.14],['過／低頻率','頻率超出設定範圍就跳脫',.3],['頻率變化率','頻率變化太快就跳脫',.46]].forEach(([a,b,t0],i)=>{const k=seg(u,t0,t0+.08),y=260+i*115;
   alphaDo(.25+.75*k,()=>{box(1124,y-26,14,84,k>.5?E_Y:'rgba(255,255,255,.3)');wt(1156,y+4,a,22,'#fff',700);wt(1156,y+44,b,17,DIM,500);});});
  alphaDo(seg(u,.78,.9),()=>{card(1124,610,392,150,{bg:'rgba(232,87,42,.08)',st:'rgba(232,87,42,.45)'});wt(1144,654,'盲區：非偵測區（NDZ）',20,E_W,700);wt(1144,694,'發電約等於負載時，',17,DIM,500);wt(1144,724,'被動方法看不出孤島',17,DIM,500);});
 }},

{t:'主動偵測：輕輕推一下',en:'Active detection: a gentle nudge',dur:14,
 d:'主動偵測的想法是：變流器自己故意對輸出頻率或功率做一點微小的擾動，再看電網怎麼回應。連著大電網時，電網的慣量很大，這點擾動幾乎不影響頻率；一旦成為孤島，沒有電網撐著，擾動會被正回授一路放大，頻率持續偏移直到越界，變流器就會跳脫。常見做法有主動頻率偏移、Sandia 頻率偏移與無功功率擾動，即使功率剛好平衡也能偵測。',
 s:[[0,'變流器故意把輸出頻率微微推一下'],[.3,'連著電網時，大電網把頻率穩穩撐住'],[.56,'成為孤島後，擾動被正回授一路放大'],[.82,'頻率越界就跳脫，功率平衡也躲不掉']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:CARD});wt(84,200,'變流器注入微小的頻率擾動（示例）',20,E_Y,700);
  const mk=(y,title,col,fn,show,trip)=>{
   const c=chartBox(90,y,940,260,{title,x0:0,x1:2,y0:58.5,y1:61.5,xt:[0,1,2],yt:[59,60,61],xl:'',yl:'Hz',pl:80,pr:30,pt:44,pb:30});
   ctx.setLineDash([8,6]);ln([c.X(0),c.Y(60.5),c.X(2),c.Y(60.5)],E_W,2);ln([c.X(0),c.Y(59.5),c.X(2),c.Y(59.5)],E_W,2);ctx.setLineDash([]);
   const f=show;ctx.beginPath();for(let t=0;t<=Math.min(2*f,trip);t+=.02){const v=Math.max(58.7,Math.min(61.3,fn(t)));t?ctx.lineTo(c.X(t),c.Y(v)):ctx.moveTo(c.X(t),c.Y(v));}ctx.strokeStyle=col;ctx.lineWidth=4;ctx.stroke();return c;};
  const c1=mk(230,'連著電網',E_G,t=>60+.08*Math.sin(t*14),seg(u,.1,.45),9);
  alphaDo(seg(u,.32,.46),()=>wt(c1.X(2)-10,c1.Y(60.5)-12,'電網慣量大，頻率穩定',17,E_G,700,'right'));
  const c2=mk(510,'成為孤島',E_W,t=>60+.08*Math.sin(t*14)+.12*(Math.exp(t*1.9)-1),seg(u,.5,.82),1.1);
  alphaDo(seg(u,.7,.82),()=>{circ(c2.X(1.1),c2.Y(Math.min(61.3,60+.08*Math.sin(15.4)+.12*(Math.exp(2.09)-1))),9,E_W);});
  alphaDo(seg(u,.8,.9),()=>tag(c2.X(.2),c2.Y(61.0),'越界，變流器跳脫',{size:19,bg:E_W,fg:'#13232e'}));
  card(1100,160,440,640,{bg:CARD});wt(1124,200,'常見的主動方法',20,E_Y,700);
  [['主動頻率偏移','輸出電流頻率略高於電網',.12],['Sandia 頻率偏移','用頻率偏差回授放大擾動',.28],['無功功率擾動','小幅改變無功功率輸出',.44]].forEach(([a,b,t0],i)=>{const k=seg(u,t0,t0+.08),y=260+i*115;
   alphaDo(.25+.75*k,()=>{box(1124,y-26,14,84,k>.5?E_Y:'rgba(255,255,255,.3)');wt(1156,y+4,a,22,'#fff',700);wt(1156,y+44,b,17,DIM,500);});});
  alphaDo(seg(u,.78,.9),()=>{card(1124,620,392,140,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});wt(1144,664,'補上被動方法的盲區',20,E_G,700);wt(1144,704,'功率平衡時依然能偵測',17,DIM,500);});
 }},

{t:'驗證與台灣的併聯規定',en:'Verification and Taiwan interconnection rules',dur:13,
 d:'變流器出廠前要通過防孤島測試。IEC 62116 的做法是：接上由電阻、電感、電容組成的負載，調到與光電發電量相等、並在六十赫茲共振，品質因數約一，這是最難偵測的情況；然後突然切斷電網，量測變流器多久內停止輸出，一般要求約兩秒內。台灣方面，低壓單相併聯容量上限為二十千伏安；高壓併聯則要在責任分界點設置遙控跳脫裝置，並加裝頻率變化率與相位跳動電驛。',
 s:[[0,'測試時接上電阻、電感、電容負載，調到功率相等'],[.3,'在六十赫茲共振，品質因數約一，最難偵測'],[.56,'突然切斷電網，量測變流器多久內停止輸出'],[.82,'台灣高壓併聯要加裝遙控跳脫與防孤島電驛']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:CARD});wt(84,200,'IEC 62116 防孤島測試流程（示意）',20,E_Y,700);
  const steps=[['1','調整 RLC 負載','電阻、電感、電容，Q 約 1',.06],['2','發電＝負載','功率完全相配，60 Hz 共振',.24],['3','突然切斷電網','模擬孤島發生',.42],['4','量測跳脫時間','要求約 2 秒內停止輸出',.6]];
  steps.forEach(([n,a,b,t0],i)=>{const k=seg(u,t0,t0+.1),y=240+i*118;
   alphaDo(.2+.8*k,()=>{tag(90,y,n,{size:22,bg:k>.5?E_Y:'rgba(255,255,255,.3)',fg:'#13232e'});wt(150,y+22,a,22,'#fff',700);wt(150,y+56,b,17,DIM,500);});});
  const tm=seg(u,.6,.82)*2;
  alphaDo(seg(u,.58,.7),()=>{card(660,500,370,260,{bg:'rgba(0,0,0,.25)'});wt(845,570,'跳脫時間',19,DIM,600,'center');wt(845,660,trf('{n} 秒',{n:tm.toFixed(2)}),64,tm>=1.99?E_G:E_Y,700,'center',COND);
   alphaDo(seg(u,.8,.9),()=>tag(740,700,'小於 2 秒：通過',{size:20,bg:E_G,fg:'#13232e'}));});
  card(1100,160,440,640,{bg:CARD});wt(1124,200,'台灣的併聯要求',20,E_Y,700);
  [['低壓併聯','單相最大裝置容量 20 kVA',.2],['責任分界點','裝設遙控跳脫裝置',.4],['高壓防孤島電驛','頻率變化率（ROCOF）、相位跳動（VSR）',.6]].forEach(([a,b,t0],i)=>{const k=seg(u,t0,t0+.08),y=260+i*130;
   alphaDo(.25+.75*k,()=>{box(1124,y-26,14,96,k>.5?E_Y:'rgba(255,255,255,.3)');wt(1156,y+4,a,22,'#fff',700);wt(1156,y+46,b,17,DIM,500);});});
  alphaDo(seg(u,.8,.92),()=>wt(1124,720,'整定值以台電最新公告為準',17,E_W,700));
 }}
]};
