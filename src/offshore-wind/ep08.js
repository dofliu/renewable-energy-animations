// KITS: marine, offshore-seq
/* ================= EP08 海纜鋪設 ================= */
const O=(c,p)=>{SC=c;SU=p;};const map=(u,a,b)=>lerp(a,b,u);
function cabSide(p){O(7,p);drawOnshore(1);drawHDD(1);drawCables();sc7(p);drawStructures();}
function hddRig(x,g){box(x-30,g-14,60,14,'#e8a33a');ln([x-20,g-14,x+40,g-70],'#e8a33a',4);box(x+30,g-80,20,14,'#394650');box(x+50,g-24,30,24,'#6b7780');}
const EP={no:8,slug:'offshore-wind',seriesName:'離岸風場開發系列',total:13,t:'海纜鋪設',en:'Subsea cable laying',
lede:'海纜是風場的血管：陣列海纜把每部風機串起來，輸出海纜把電送上岸。這一集從海纜的剖面構造開始，看它如何被拉進基礎、鋪上海床、用水刀埋進海底，最後穿過海岸線登陸。',
facts:[['66','kV','陣列海纜電壓，串接 5–8 部風機為一迴路'],['220','kV','輸出海纜電壓，從海上變電站送到陸上'],['1–3','m','海纜埋設深度，避免漁具與船錨破壞'],['7,000+','公噸','大型海纜鋪設船轉盤可儲放的海纜重量'],['100+','kg/m','輸出海纜的單位重量，一公里就超過百公噸'],['數百','m','水平導向鑽掘穿越海岸的長度，不必開挖海灘']],
note:'說明：本集為教育用途示意動畫。海纜構造、電壓、埋深與鋪設程序為典型範例；實際依海纜製造商、海床條件與主管機關要求而定。台灣部分陣列海纜已採用 66 kV，輸出電壓則有 161 kV 與 220 kV 等不同設計。',
shots:[
{t:'海纜的剖面構造',en:'Inside a subsea cable',dur:13,
 d:'一條三芯交流海纜由內而外層層包覆：中心是傳導電流的銅（或鋁）導體；外面是交聯聚乙烯（XLPE）絕緣層，上下各有一層半導電遮蔽，讓電場均勻分布；再包上金屬遮蔽與防水護套，擋住海水滲入。三芯絞合後，空隙填充材料並夾帶光纖，用來傳輸監控資料與偵測溫度；最外層是一圈鋼線鎧裝，提供拉力強度並抵抗外力。',
 s:[[0,'銅導體：傳導電流'],[.18,'XLPE 絕緣層與半導電遮蔽：隔絕高電壓'],[.36,'金屬遮蔽與防水護套：擋住海水'],[.54,'光纖單元：傳輸監控資料，還能沿線量測溫度'],[.72,'鋼線鎧裝：提供拉力強度、抵抗外力']],
 draw(u){
  diagBG();const cx=520,cy=480,R=300,st=[0,.18,.36,.54,.72].map(t=>seg(u,t,t+.08));
  alphaDo(st[4],()=>{circ(cx,cy,R,'#1b1f22');for(let i=0;i<60;i++){const a=i/60*TAU;circ(cx+Math.cos(a)*(R-18),cy+Math.sin(a)*(R-18),13,'#9aa5ab','#5d6b74',1);}circ(cx,cy,R-34,'#3a3f44');});
  for(let i=0;i<3;i++){const a=-Math.PI/2+i*TAU/3,x=cx+Math.cos(a)*118,y=cy+Math.sin(a)*118;
   alphaDo(st[2],()=>{circ(x,y,100,'#555c62');circ(x,y,92,'#1c1c1c');});
   alphaDo(st[1],()=>{circ(x,y,86,'#2a2a2a');circ(x,y,80,'#e9ecef');circ(x,y,48,'#2a2a2a');});
   alphaDo(st[0],()=>{circ(x,y,44,'#c87533');for(let j=0;j<12;j++){const b=j/12*TAU;circ(x+Math.cos(b)*28,y+Math.sin(b)*28,9,'#d98b4a');}circ(x,y,14,'#d98b4a');});}
  alphaDo(st[3],()=>{circ(cx,cy+8,26,'#394650');for(let j=0;j<6;j++){const b=j/6*TAU;circ(cx+Math.cos(b)*12,cy+8+Math.sin(b)*12,5,['#f2c230','#e8572a','#58b8d0','#7dffc4','#fff','#b37cff'][j]);}});
  const L=[['銅導體（截面積約 500–1,200 mm²）',cx,cy-118],['XLPE 絕緣＋半導電遮蔽',cx+70,cy-160],['金屬遮蔽與防水護套',cx+195,cy+10],['光纖單元',cx+20,cy+10],['鋼線鎧裝',cx+R-18,cy+80]];
  L.forEach((l,i)=>alphaDo(st[i],()=>{const y=230+i*110;ln([l[1],l[2],930,y],'rgba(255,255,255,.6)',1.6);circ(l[1],l[2],5,'#fff');wt(946,y+8,l[0],22,i===Math.max(0,st.filter(s=>s>0).length-1)?'#f2c230':'#fff',700);}));
  alphaDo(seg(u,.85,.9),()=>wt(946,780,'外徑約 20–30 cm，每公尺重數十到上百公斤',18,'rgba(227,236,238,.8)',500));
 }},
{t:'拉入基礎 Pull-in',en:'Cable pull-in',dur:12,side:true,
 d:'鋪設的第一步是把海纜一端拉進風機基礎。技術人員先在轉接段上架好絞機，放下一條引導鋼索，由潛水器接到海纜的拉頭上。海纜外面套著一段「海纜保護系統」（CPS），像彈性護套一樣，保護海纜穿過單樁側壁開孔的那一段不會過度彎折或磨損。絞機緩緩收線，把海纜從海床拉進樁內、再往上拉到轉接段的掛架。',
 s:[[0,'海纜鋪設船進場，停在風機基礎旁'],[.35,'轉接段上的絞機放下引導鋼索，接上海纜拉頭'],[.55,'海纜套著保護系統，穿過樁壁開孔進入樁內'],[.8,'往上拉到轉接段掛架固定']],
 cam:u=>camMix({x:TX+160,y:470,s:1.15},{x:TX+40,y:600,s:2},ease(seg(u,.3,.5))),
 draw(u){cabSide(map(u,0,.25));lab(TX+15,bedTX-20,'保護系統 CPS',{dx:90,dy:-40,st:'s',a:band(u,.5,1)});lab(TX,TP_TOP,'轉接段絞機',{dx:80,dy:-30,a:band(u,.3,.7)});}},
{t:'沿路由鋪設',en:'Laying along the route',dur:12,side:true,
 d:'鋪設船緩緩沿著路由前進，甲板上的轉盤一邊旋轉、一邊把海纜送出，經船尾的滑槽垂入海中，在水中形成一條平緩的懸垂曲線。船速、張力與觸底點必須精準配合：張力太大會拉傷海纜，太小則會在海床上打結扭曲。遙控無人潛水器持續監看觸底點的位置。',
 s:[[0,'轉盤旋轉送出海纜，經滑槽垂入海中'],[.3,'海纜在水中形成懸垂曲線，觸底點緊跟在船後'],[.6,'控制船速與張力，避免海纜扭曲或拉傷'],[.85,'抵達海上變電站，另一端拉入 J 形管']],
 cam:u=>({x:clamp(clvS(map(u,.22,.58))+60,700,1000),y:540,s:1.15}),
 draw(u){cabSide(map(u,.22,.58));},
 hud(u){hudPanel(230,130,'鋪設監測',seg(u,.05,.1),w=>{const p=map(u,.22,.58);hrow(54,'已鋪設',(seg(p,.24,.54)*2.4).toFixed(2)+' km',w,'#f2c230');hrow(80,'張力','38 kN',w);hrow(106,'船速','250 m/h',w);});}},
{t:'高壓水刀埋設',en:'Jet trenching',dur:12,side:true,
 d:'鋪在海床上的海纜還很脆弱。埋設機是一台履帶式或飛行式的遙控無人潛水器，騎在海纜上方前進，把兩支「水刀臂」插進海床，噴出高壓海水讓砂土暫時變成泥漿；海纜靠自身重量沉入溝底，砂土再慢慢沉降回填。埋深通常是 1 到 3 公尺，在船錨與拖網漁具可能觸及的區域要埋得更深。',
 s:[[0,'埋設機沿海纜路由在海床上行進'],[.25,'水刀臂插入海床，噴出高壓海水'],[.5,'砂土液化，海纜靠自重沉入溝底'],[.75,'砂土沉降回填，埋深 1–3 公尺']],
 cam:u=>{const p=map(u,.36,.54);return {x:rovX1(p)+10,y:bedY(rovX1(p))+10,s:3.2};},
 draw(u){cabSide(map(u,.36,.54));const p=map(u,.36,.54),r=rovX1(p);lab(r-16,bedY(r)+8,'水刀臂',{dx:-60,dy:50,st:'s',a:band(u,.2,.7)});lab(r+30,bedY(r)+12,'海纜沉入溝底',{dx:60,dy:50,a:band(u,.45,1)});},
 hud(u){hudPanel(250,170,'埋設深度（沿路由）',seg(u,.1,.16),(w)=>{const x0=14,y0=46,cw=w-28,ch=90;ctx.strokeStyle='rgba(255,255,255,.14)';ctx.strokeRect(x0,y0,cw,ch);
  ctx.setLineDash([4,4]);ln([x0,y0+ch*.5,x0+cw,y0+ch*.5],'#e8572a',1.4);ctx.setLineDash([]);
  const k=seg(u,.05,.95);ctx.beginPath();for(let i=0;i<=cw*k;i+=2){const d=1.6+.3*nz(i*.07)+(i>cw*.55&&i<cw*.65?-.4:0);const y=y0+d/3*ch;i?ctx.lineTo(x0+i,y):ctx.moveTo(x0+i,y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.stroke();
  htext(x0,y0+ch+18,trf('目標 ≥ 1.5 m（紅線）　目前 {d} m',{d:(1.6+.3*nz(cw*k*.07)).toFixed(2)}),12,'#fff',600);});}},
{t:'HDD 穿越海岸登陸',en:'Horizontal directional drilling',dur:14,side:true,
 d:'輸出海纜上岸時，如果直接開挖海灘，會破壞沙灘、防風林與潮間帶生態。水平導向鑽掘（HDD）從陸上工作井出發，先鑽一條小口徑的導向孔，以可控方向的鑽頭沿著弧線從海床下穿出；再用擴孔器來回把孔徑擴大，最後拉入一條大口徑的高密度聚乙烯導管。海纜日後就從海側穿進這條導管上岸。',
 s:[[0,'陸上工作井架設鑽機，沿弧線鑽出導向孔'],[.3,'鑽頭從海床下方穿出，位置由導航系統追蹤'],[.5,'擴孔器來回擴大孔徑'],[.75,'拉入高密度聚乙烯導管，完成登陸通道']],
 cam:()=>({x:1440,y:470,s:1.9}),
 draw(u){O(7,0);drawOnshore(1);drawStructures();hddRig(1565,440);
  const dk=u<.3?seg(u,.02,.3):1,path=[];for(let i=0;i<=30;i++){const t=1-i/30*dk;path.push(hddPt(t));}
  pathLine(path,'rgba(50,45,40,.6)',u<.5?3:u<.75?5:6);
  if(u>.5&&u<.75){const k=(Math.sin((u-.5)/.25*Math.PI*2-Math.PI/2)+1)/2;const p=hddPt(k);circ(p.x,p.y,6,'#e8a33a');}
  if(u>.75){const k=seg(u,.75,.95);const P=[];for(let i=0;i<=30;i++)P.push(hddPt(i/30));pathLine(partial(P,k),'rgba(215,205,185,.95)',3.4);}
  const tip=path[path.length-1];if(u<.5)circ(tip.x,tip.y,5,'#f2c230');
  if(u>.3&&u<.5)ring(tip.x,tip.y,14+Math.sin(TT*6)*3,'#f2c230',2);
  lab(1565,420,'HDD 鑽機',{dx:30,dy:-50,a:band(u,0,.4)});lab(tip.x,tip.y,u<.5?'導向鑽頭':'',{dx:-40,dy:60,st:'s',a:band(u,.05,.5)});
  const m=hddPt(.5);lab(m.x,m.y,u<.75?'擴孔':'HDPE 導管',{dx:40,dy:70,a:band(u,.5,1)});lab(1500,440,'沙灘與防風林不受破壞',{dx:-60,dy:-80,st:'g',a:band(u,.75,1)});}},
{t:'輸出海纜上岸',en:'Export cable landfall',dur:13,side:true,
 d:'鋪設船停在登陸點外海，海纜一端由陸上絞機經 HDD 導管拉上岸，接入陸上接續井。鋪設船接著一路向海上變電站鋪放、埋設，最後拉入 J 形管。整條海纜完成後，還要做高壓耐壓測試、絕緣電阻量測，並以光纖確認沒有斷點，才能準備送電。',
 s:[[0,'陸上絞機經 HDD 導管把海纜拉上岸'],[.3,'鋪設船向海上變電站鋪放並埋設'],[.72,'另一端拉入海上變電站的 J 形管'],[.88,'耐壓測試、絕緣量測與光纖檢測']],
 cam:u=>({x:lerp(1240,1150,u),y:500,s:1.25}),
 draw(u){cabSide(map(u,.62,1));},
 hud(u){hudPanel(230,140,'完工測試',seg(u,.86,.9),w=>{hrow(54,'交流耐壓測試','通過',w,'#7dffc4');hrow(80,'絕緣電阻','正常',w,'#7dffc4');hrow(106,'光纖損耗','0.3 dB/km',w,'#7dffc4');hrow(130,'溫度監測','啟用',w);});}}
]};
