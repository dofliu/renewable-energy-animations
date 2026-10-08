// KITS: marine
/* ================= EP28 漁業共存與海域共享 ================= */
function wrap28(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
/* complete monopile turbine at TX */
function turb28(rot){
  const yb=bedY(TX)+130;
  drawPile(TX,yb,Math.PI/2,yb-PILE_TOP,PILE_W);
  drawTP(TX,TP_BOT);for(let k=0;k<3;k++)drawTowerSec(TX,TP_TOP-k*HS,k);
  drawNacelle(TX,TW_TOP,0,true);drawRotor(TX-44,TW_TOP-20,rot,3);
}
/* rock scour protection mound around the pile foot */
function rocks28(a){
  const bed=bedY(TX),r=rng(28);
  alphaDo(a,()=>{poly([TX-92,bed+2,TX-50,bed-18,TX+50,bed-18,TX+92,bed+2],'#6b7479');
   for(let i=0;i<34;i++){const x=TX-88+r()*176,k=1-Math.abs(x-TX)/92,y=bed+1-k*16*r()-2;circ(x,y,3+r()*4,r()<.5?'#8a949a':'#59636a');}});
}
/* plan-view turbine icon */
function tplan28(x,y,rot,col){
  circ(x,y,4,col||'#f2f5f6');for(let k=0;k<3;k++){const a=rot+k*TAU/3;ln([x,y,x+Math.cos(a)*13,y+Math.sin(a)*13],col||'#f2f5f6',2);}
}
/* fish abundance index vs distance from the foundation (typical example) */
const FI28=d=>3+97*Math.exp(-d/55);
const GRID28=[[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2],[2,2],[3,2]];

const EP={no:28,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'漁業共存與海域共享',en:'Fisheries coexistence and sharing the sea',
lede:'風場蓋在海上，也蓋在漁民長期作業的漁場裡。這一集看風機基礎如何成為人工魚礁、聚魚的範圍有多大，施工與營運期間的安全區與航道怎麼劃，不同漁法還能不能作業，漁業補償與共存共榮經費如何運用，以及開發商與在地漁會怎樣一步步協商。',
facts:[['50','公尺','營運期風機周邊常見的安全區範圍（歐洲部分國家，示例）'],['500','公尺','施工期間環繞施工船的移動式安全區常見範圍'],['86','種','台灣風場調查在基礎 50 公尺內記錄到的礁岩性魚類'],['3','項','補償基準常見的計算項目：漁業權損失、繞道成本、漁獲淨收益損失'],['4','類','共存共榮經費常見用途：棲地營造、放流、漁法轉型輔導、休閒漁業']],
note:'說明：本集為教育用途示意動畫，風機、魚群、安全區與航道的比例經過壓縮，聚魚指數、風機間距與船隊配置皆為「典型範例」，並非特定案場資料。基礎周邊聚魚範圍小、岩石護腳的聚魚效果通常高於砂袋與導管架，依德國與台灣風場的公開研究；施工期 500 公尺移動式安全區與營運期 50 公尺安全區為英國等地的常見做法，台灣各案場的實際範圍、可作業漁法與補償金額，以主管機關公告與環評承諾為準。補償計算項目與共存共榮經費用途參考地方政府公開之離岸式風力發電廠漁業補償基準。',
shots:[
/* 1 */{t:'基礎變成人工魚礁',en:'Foundations become artificial reefs',dur:13,side:true,
 d:'單樁基礎與周圍的護腳岩塊，在平坦的沙質海床上突然多了一片硬底質。藤壺、貽貝與海藻先附著在樁身上，吸引小型甲殼類與小魚來覓食，再引來較大的肉食性魚類，形成一個小型的生態系。台灣離岸風場的調查也在基礎周邊記錄到沙地上原本沒有的礁岩性魚類。這個人工魚礁效應對部分底棲與礁岩魚種有利，但並不等於整體漁獲量必然增加，仍需長期監測。',
 s:[[0,'平坦的沙質海床上，單樁與護腳岩塊成了新的硬底質'],[.28,'藤壺與貽貝附著樁身，吸引小魚與甲殼類'],[.55,'更大的肉食性魚類跟著聚集到基礎周邊'],[.78,'聚魚效果只出現在基礎附近，仍需長期監測']],
 cam:u=>camMix({x:800,y:450,s:1},{x:TX+40,y:SEA+130,s:1.7},ease(seg(u,.05,.3))),
 draw(u){
  const bed=bedY(TX);
  rocks28(seg(u,.06,.18));
  turb28(TT*.9);
  // fouling on the pile
  const f=seg(u,.26,.5),r=rng(7);
  alphaDo(f,()=>{for(let i=0;i<46;i++){const y=SEA+14+r()*(bed-SEA-24),s=r()<.5?-1:1;circ(TX+s*(PILE_W/2-1),y,2+r()*2.4,r()<.6?'#c9b48a':'#4fa66a');}});
  // fish gather around the foundation
  const g=ease(seg(u,.3,.85));
  school(TX-70,bed-70,Math.round(2+g*9),11,TT,26,1,'rgba(200,225,235,.85)');
  school(TX+75,bed-45,Math.round(1+g*8),12,TT,24,-1,'rgba(242,194,48,.8)');
  if(g>.5)school(TX+10,bed-120,Math.round(g*6),13,TT,30,1,'rgba(125,255,196,.7)');
  // sandy seabed far away: only a few fish
  school(1060,bed-60,2,14,TT,30,-1,'rgba(200,225,235,.6)');
 },
 fx(u){
  const bed=bedY(TX);
  lab(TX-60,bed-6,'護腳岩塊',{dx:-150,dy:40,a:band(u,.08,.32)});
  lab(TX+16,SEA+60,'附著生物（藤壺、貽貝）',{dx:190,dy:-10,a:band(u,.3,.58),st:'g'});
  lab(TX+75,bed-45,'礁岩性魚類聚集',{dx:190,dy:-30,a:band(u,.5,.9),st:'s'});
  lab(1060,bed-60,'沙質海床：魚少',{dx:0,dy:-70,a:band(u,.5,.9),minor:true});
 },
 hud(u){hudPanel(250,150,'基礎周邊觀察（示例）',seg(u,.05,.12),w=>{
  hrow(52,'硬底質','樁身＋護腳',w,'#f2c230');
  hrow(78,'聚魚範圍','約 50 m 內',w,'#7dffc4');
  hrow(104,'沙地對照','幾乎沒有',w);
  hrow(130,'結論','需長期監測',w,'#ff9d7a');})}},
/* 2 */{t:'聚魚範圍有多大',en:'How far does the reef effect reach?',dur:13,
 d:'人工魚礁效應是真的，但範圍很小。魚群的密度在基礎旁最高，往外幾十公尺就快速下降，到了一兩百公尺外和周圍的沙地幾乎沒有差別。基礎周邊的保護材料也有影響：德國北海的研究發現，用岩石保護海床的單樁，比砂袋保護的單樁與導管架更能吸引魚類。因此風場帶來的聚魚好處集中在基礎附近，也就是安全區管制最嚴格的位置，漁民未必能直接受惠。',
 s:[[0,'魚群密度在基礎旁最高，向外迅速下降'],[.3,'一兩百公尺外，幾乎與周圍沙地沒有差別'],[.55,'岩石護腳的聚魚效果通常高於砂袋與導管架'],[.8,'好處集中在基礎附近，也是管制最嚴的位置']],
 draw(u){
  diagBG();
  card(60,150,860,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'離基礎距離與魚群密度（典型示例）',21,'#fff',700);
  const c=chartBox(110,230,780,500,{x0:0,x1:400,y0:0,y1:100,xt:[0,100,200,300,400],yt:[0,25,50,75,100],xl:'離基礎距離 (m)',yl:'相對魚群密度',pl:64,pr:20,pt:20,pb:56});
  const f=seg(u,.05,.4),P=[];for(let i=0;i<=80;i++){const d=i*5;if(d/400>f)break;P.push(c.X(d),c.Y(FI28(d)));}
  if(P.length>3)ln(P,'#7dffc4',3.2);
  alphaDo(seg(u,.3,.4),()=>{box(c.X(0),c.Y(100),c.X(50)-c.X(0),c.Y(0)-c.Y(100),'rgba(242,194,48,.14)');
   wt(c.X(25),c.Y(100)-8,'50 m',17,'#f2c230',700,'center',COND);
   ln([c.X(0),c.Y(3),c.X(400),c.Y(3)],'rgba(255,255,255,.35)',1.2);wt(c.X(395),c.Y(3)-10,'周圍沙地',16,'rgba(227,236,238,.85)',600,'right');});
  card(940,150,600,650,{bg:'rgba(7,27,39,.8)'});wt(964,190,'基礎形式與護腳材料（示意）',21,'#fff',700);
  const B=[['單樁＋岩石護腳',100,'#7dffc4'],['單樁＋砂袋護腳',58,'#f2c230'],['導管架',52,'#58b8d0']];
  B.forEach((b,i)=>{const a=seg(u,.5+i*.08,.6+i*.08),y=250+i*92;alphaDo(a,()=>{wt(964,y,b[0],19,'#fff',600);
   box(964,y+14,500,26,'rgba(255,255,255,.1)');box(964,y+14,500*b[1]/100*a/Math.max(a,.001),26,b[2]);});});
  alphaDo(seg(u,.8,.88),()=>{wt(964,560,'相對聚魚程度（示意，非實測值）',16,'rgba(227,236,238,.75)',500);
   wrap28(964,610,'台灣風場調查：基礎 50 m 內記錄到 86 種礁岩性魚類，周圍沙地沒有',552,18,'#fff',600,26);
   wrap28(964,700,'好處集中在基礎附近，也是管制最嚴的位置',552,18,'#f2c230',600,26);});
 }},
/* 3 */{t:'安全區與航道',en:'Safety zones and shipping lanes',dur:14,
 d:'從上方看風場，是一格一格的風機與海纜。施工期間，施工船周圍會劃出移動式的安全區，英國等地常見的範圍約 500 公尺，其他船舶不得進入；風機完工後，營運期的安全區通常縮到風機周圍約 50 公尺，主要用於大型維修作業。風場外另有航道，供商船通行，漁船則依主管機關公告，決定能否穿越風場或進入作業。出海前務必查詢最新的航行警告。',
 s:[[0,'從上方看，風場是一格一格的風機與海纜'],[.28,'施工期間，施工船周圍劃出約 500 公尺的移動式安全區'],[.55,'營運期安全區縮小到風機周圍約 50 公尺'],[.78,'商船走航道，漁船依公告決定能否進入風場']],
 draw(u){
  diagBG();
  card(60,150,960,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'風場平面圖（示意，風機間距約 1 公里）',21,'#fff',700);
  const OXp=290,OYp=270,SP=150;
  // shipping lane
  const ln1=seg(u,.6,.74);
  alphaDo(.25+ln1*.75,()=>{box(100,640,880,70,'rgba(88,184,208,.14)');ctx.setLineDash([12,10]);ln([100,675,980,675],'rgba(125,200,220,.6)',1.4);ctx.setLineDash([]);
   wt(112,630,'航道（商船）',17,'#7dc8dc',700);});
  // cables
  GRID28.forEach(([i,j])=>{if(i<3)ln([OXp+i*SP,OYp+j*SP,OXp+(i+1)*SP,OYp+j*SP],'rgba(255,157,122,.4)',1.2);});
  // zones
  const z5=band(u,.26,.55),z50=seg(u,.5,.62);
  const cur=GRID28[5];const bx=OXp+cur[0]*SP,by=OYp+cur[1]*SP;
  alphaDo(z5,()=>{circ(bx,by,75,'rgba(232,87,42,.14)','#e8572a',2);ctx.setLineDash([8,6]);ring(bx,by,75,'#e8572a',2);ctx.setLineDash([]);
   // crane vessel
   box(bx+34,by+26,34,12,'#e8572a');box(bx+54,by+16,10,10,'#f4f6f7');ln([bx+38,by+26,bx+30,by+2],'#f2c230',2.4);
   wt(bx,by-86,'約 500 m',20,'#ff9d7a',700,'center',COND);});
  GRID28.forEach(([i,j],k)=>{const x=OXp+i*SP,y=OYp+j*SP;
   if(z50>0&&k!==5)alphaDo(z50*.9,()=>{circ(x,y,9,'rgba(242,194,48,.18)','#f2c230',1.4);});
   tplan28(x,y,TT*.8+k,k===5&&u<.55?'#9aa7ad':'#f2f5f6');});
  alphaDo(z50,()=>{wt(OXp+3*SP+60,OYp-8,'約 50 m',20,'#f2c230',700,'left',COND);ln([OXp+3*SP+54,OYp-14,OXp+3*SP+12,OYp-6],'#f2c230',1.4);});
  // moving vessels: merchant ship on the lane, fishing boats waiting outside
  const m=((TT*.05)%1);const mx=lerp(120,960,m);
  alphaDo(.3+ln1*.7,()=>{poly([mx-22,668,mx+18,668,mx+26,675,mx+18,682,mx-22,682],'#d5dde0');});
  const fb=seg(u,.72,.9);
  [[130,520],[130,590]].forEach(([x,y],i)=>alphaDo(fb,()=>{poly([x,y-6,x+16,y,x,y+6],'#f2c230');wt(x+24,y+5,i?'漁船':'漁船',14,'rgba(227,236,238,.85)',600);}));
  // right: legend
  card(1040,150,500,650,{bg:'rgba(7,27,39,.8)'});wt(1064,190,'管制範圍（英國等地的常見做法）',20,'#fff',700);
  const L=[['施工期','移動式安全區約 500 m','#ff9d7a'],['營運期','風機周圍約 50 m','#f2c230'],['航道','商船通行，漁船依公告','#7dc8dc']];
  L.forEach((o,i)=>alphaDo(seg(u,.26+i*.2,.34+i*.2),()=>{const y=224+i*116;card(1064,y,452,100,{bg:'rgba(255,255,255,.04)',st:o[2],r:8});wt(1086,y+38,o[0],22,o[2],700);wrap28(1086,y+72,o[1],410,17,'#fff',600,24);}));
  alphaDo(seg(u,.84,.92),()=>{wrap28(1064,620,'台灣各案場的實際範圍與可進入的作業，以主管機關公告為準，出海前查詢航行警告',452,17,'#fff',600,25);});
 }},
/* 4 */{t:'哪些漁法還能作業',en:'Which fishing methods can still operate',dur:14,side:true,
 d:'風場內不是一律禁漁，但不同漁法受到的影響差別很大。釣具與延繩釣的鉤線小、可以避開結構，籠具與定置網只要放在公告允許的位置，也比較有機會共存。底拖網與流刺網的網具範圍大，容易勾到基礎護腳、海纜與其他設施，在風場內作業困難。各國做法不同，台灣仍以主管機關公告與協商結果為準，漁民也需要時間調整漁具與作業方式。',
 s:[[0,'風機之間水面上，一艘小型漁船正在放釣線與籠具'],[.3,'釣具與籠具避得開結構，較有機會與風場共存'],[.55,'另一艘拖網船的網具範圍大，朝基礎與海纜前進'],[.78,'底拖網與流刺網在風場內很難作業']],
 cam:u=>camMix({x:800,y:450,s:1},{x:470,y:SEA+80,s:1.25},ease(seg(u,.05,.3))),
 draw(u){
  const bed=bedY(TX);rocks28(1);
  turb28(TT*.9);
  // export cable on the seabed
  const cp=[];for(let x=TX+95;x<=1240;x+=40)cp.push(x,bedY(x)+7);
  ln(cp,'#ff9d7a',2.4);
  // small boat A with hook line + pots (left)
  const ax=lerp(330,400,seg(u,0,.25));
  const wA=vsl(ax,110,false,{tilt:.3},vSmallWork);
  const px=ax+120,py=bedY(px);
  alphaDo(seg(u,.1,.3),()=>{ln([ax+60,wA-8,px,py-10],'rgba(255,255,255,.6)',1.2);box(px-12,py-16,24,16,'#c9b48a','#7a6a45',1.5);
   for(let k=0;k<3;k++){const q=(TT*.6+k/3)%1;circ(px+Math.sin(k*2)*6,py-18-q*60,2+q,`rgba(235,248,255,${.5*(1-q)})`);}});
  alphaDo(seg(u,.2,.4),()=>{school(px+30,py-60,5,21,TT,22,1,'rgba(200,225,235,.85)');});
  // trawler B (right) heading toward the foundation with net behind
  const bx=lerp(1400,960,easeOut(seg(u,.4,.75)));
  const wB=vsl(bx,150,true,{tilt:.3},vWorkboat);
  const nx=bx+60,ny=bedY(nx+170);
  alphaDo(seg(u,.4,.55),()=>{ln([bx+20,wB+6,nx+190,ny-6],'rgba(255,255,255,.55)',1.2);
   poly([nx+190,ny-6,nx+300,ny-34,nx+300,ny+2,nx+190,ny+2],'rgba(232,87,42,.35)','#e8572a',1.4);});
 },
 fx(u){
  const bed=bedY(TX),ax=lerp(330,400,seg(u,0,.25));
  lab(ax+55,SEA-4,'小型漁船',{dx:-30,dy:-60,a:band(u,.02,.3)});
  lab(ax+120,bedY(ax+120)-8,'籠具',{dx:0,dy:60,a:band(u,.12,.48),st:'g'});
  lab(TX-10,SEA+120,'基礎與護腳',{dx:-150,dy:20,a:band(u,.4,.8)});
  lab(900,bedY(900)+8,'海纜',{dx:0,dy:70,a:band(u,.4,.8),st:'w',minor:true});
  lab(870,SEA-6,'拖網船',{dx:0,dy:-80,a:band(u,.5,.9),st:'w'});
  if(u>.6){const k=band(u,.6,.95);alphaDo(k,()=>{wt(TX+170,SEA+150,'✕',64,'#e8572a',700,'center');});}
 },
 hud(u){hudPanel(250,172,'風場內作業難易（示例）',seg(u,.05,.12),w=>{
  hrow(52,'釣具、延繩釣','較容易',w,'#7dffc4');
  hrow(78,'籠具、定置網','視位置',w,'#f2c230');
  hrow(104,'底拖網','困難',w,'#e8572a');
  hrow(130,'流刺網','困難',w,'#e8572a');
  htext(14,160,'依公告與協商而定',14,'rgba(227,236,238,.75)',500);})}},
/* 5 */{t:'漁業補償與共存共榮',en:'Compensation and shared-benefit funds',dur:14,
 d:'開發商要面對的第一個問題，是風場讓漁民損失了什麼。補償基準通常把損失拆成幾個項目：漁業權人在風場範圍內經營的損失、漁船為了避開風場而增加的繞道成本，以及漁獲淨收益的減少，再依施工與營運的年數、影響面積比例估算。除了補償，還有共存共榮經費，用來營造棲地與放流魚苗、輔導漁船轉換漁法，以及發展休閒漁業，讓漁業與風場長期共存。',
 s:[[0,'先算清楚：風場讓漁民損失了什麼'],[.28,'補償依漁業權損失、繞道成本與漁獲淨收益損失估算'],[.55,'另有共存共榮經費，用於棲地營造、放流與轉型輔導'],[.8,'目標是讓漁業與風場長期共存，而不只是一次性補償']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'損失補償：算什麼',22,'#f2c230',700);
  const A=[['漁業權損失','風場範圍內漁業權人的經營損失','#f2c230'],['繞道成本','漁船避開風場而增加的油料與時間','#58b8d0'],['漁獲淨收益損失','作業受限造成的漁獲收益減少','#ff9d7a']];
  A.forEach((o,i)=>alphaDo(seg(u,.1+i*.1,.18+i*.1),()=>{const y=222+i*136;card(84,y,672,118,{bg:'rgba(255,255,255,.04)',st:o[2],r:8});
   wt(106,y+46,o[0],24,o[2],700);wrap28(106,y+84,o[1],620,18,'#fff',600,26);}));
  alphaDo(seg(u,.4,.48),()=>{ln([84,650,756,650],'rgba(255,255,255,.2)',1);wt(106,700,'依施工與營運年數、影響面積比例估算',18,'rgba(227,236,238,.9)',600);
   wt(106,740,'金額與認定以主管機關基準與協商為準',16,'rgba(227,236,238,.7)',500);});
  card(820,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(844,190,'共存共榮經費：用來做什麼',22,'#7dffc4',700);
  const Bn=[['棲地營造與放流','人工魚礁、魚苗放流，維持資源','#7dffc4'],['漁法轉型輔導','協助改用適合風場作業的漁法','#f2c230'],['休閒漁業','賞鯨、海釣與體驗，增加新收入','#58b8d0'],['漁會管理小組','由在地漁會共同決定如何運用','#ff9d7a']];
  Bn.forEach((o,i)=>alphaDo(seg(u,.5+i*.08,.58+i*.08),()=>{const y=222+i*136;card(844,y,672,118,{bg:'rgba(255,255,255,.04)',st:o[2],r:8});
   wt(866,y+46,o[0],24,o[2],700);wrap28(866,y+84,o[1],620,18,'#fff',600,26);}));
 }},
/* 6 */{t:'與在地漁會協商',en:'Working with local fishing associations',dur:14,
 d:'補償與共存要談得成，關鍵在於及早、公開、持續。開發商在規劃階段就要向漁會說明計畫，並請漁民提供實際使用的漁場與漁期；接著進入補償與共存方案的協商，同時協調施工船的作業時間，盡量避開重要魚汛，並事先公告航行警告；營運後再用魚類調查與座談持續檢討。協商的難處在於漁會的代表性與分配是否公平，因此資訊透明、保留彈性，是長期維持信任的基礎。',
 s:[[0,'規劃階段就向漁會說明，請漁民提供實際漁場與漁期'],[.28,'依調查結果，協商補償與共存方案'],[.55,'施工避開重要魚汛，並事先公告航行警告'],[.8,'營運後持續做魚類調查與座談，保持資訊透明']],
 draw(u){
  diagBG();
  const S=[['早期說明','規劃階段向漁會說明','#58b8d0'],['漁場調查','漁場、漁期與漁具','#7dc8dc'],['補償與共存方案','協商、簽署與分配','#f2c230'],['施工協調','避開魚汛、航行警告','#ff9d7a'],['營運與檢討','魚類調查與定期座談','#7dffc4']];
  S.forEach((s,i)=>{const a=seg(u,.04+i*.09,.12+i*.09),x=60+i*300;if(a<=0)return;alphaDo(a,()=>{
   card(x,150,270,170,{bg:'rgba(7,27,39,.85)',st:s[2]});wt(x+135,206,String(i+1),38,s[2],700,'center',COND);
   wt(x+135,252,s[0],20,s[2],700,'center');wrap28(x+135,288,s[1],240,16,'#fff',600,22,'center');
   if(i<4)arrow(x+274,235,x+296,235,'rgba(255,255,255,.7)',3);});});
  // fishing season calendar with construction window
  card(60,350,960,450,{bg:'rgba(7,27,39,.8)'});wt(84,390,'施工排程與魚汛（典型示例）',21,'#fff',700);
  const MX=140,MW=70;
  for(let m=0;m<12;m++){const x=MX+m*MW;box(x,640,MW-4,30,'rgba(255,255,255,.08)');wt(x+MW/2-2,662,String(m+1),16,'rgba(227,236,238,.85)',600,'center',COND);}
  wt(84,440,'重要魚汛',17,'#ff9d7a',700);wt(84,520,'施工窗口',17,'#7dffc4',700);
  const run=seg(u,.3,.55);
  alphaDo(run,()=>{box(MX+1*MW,452,3*MW-4,34,'rgba(232,87,42,.45)','#e8572a',1.4);wt(MX+2.5*MW-2,476,'魚汛（示例）',16,'#fff',700,'center');});
  alphaDo(seg(u,.5,.7),()=>{box(MX+5*MW,532,6*MW-4,34,'rgba(125,255,196,.35)','#7dffc4',1.4);wt(MX+8*MW-2,556,'集中施工（示例）',16,'#fff',700,'center');
   ln([MX+1*MW,500,MX+4*MW-4,500],'rgba(232,87,42,.6)',1.2);});
  alphaDo(seg(u,.55,.65),()=>{wt(84,730,'重點：魚汛期減少施工、其餘時間集中作業，縮短總影響時間',17,'#f2c230',700);});
  // right: principles
  card(1040,350,500,450,{bg:'rgba(7,27,39,.8)'});wt(1064,390,'維持信任的做法',21,'#fff',700);
  const P=[['及早公開','計畫與調查結果都讓漁民看得到','#7dffc4'],['代表性與公平','分配方式讓各漁法的漁民都能參與','#f2c230'],['持續檢討','營運後仍定期調查與座談','#58b8d0']];
  P.forEach((o,i)=>alphaDo(seg(u,.68+i*.08,.76+i*.08),()=>{const y=416+i*124;card(1064,y,452,108,{bg:'rgba(255,255,255,.04)',st:o[2],r:8});
   wt(1086,y+40,o[0],21,o[2],700);wrap28(1086,y+72,o[1],410,17,'#fff',600,24);}));
 }}
]};
