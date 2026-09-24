// KITS: marine
/* ================= EP04 環境影響評估 ================= */
const RVX=260,PAMX=820,hY4=h=>SEA-h*1.35;
function podX(u,i){return lerp(-120,1500,u)+[0,-46,-90,-30][i];}
function drawPod(u,base,amp,n){for(let i=0;i<n;i++){const x=podX(u,i),p=x/150+[0,.35,.7,.2][i],y=base+amp*Math.cos(p*TAU),ang=Math.atan(-amp*TAU/150*Math.sin(p*TAU));dolphin(x,y,ang,i===3?.7:1);}}
function hydrophone(x){const b=bedY(x);box(x-10,b-8,20,8,'#4d5760');ln([x,b-8,x,b-60],'#2b3035',1.4);circ(x,b-66,7,'#f2c230','#9c7a12',1);box(x-3,b-54,6,14,'#394650');}
function grab(x,y,open){ctx.save();ctx.translate(x,y);box(-3,-18,6,10,'#394650');const o=open*.6;ctx.save();ctx.rotate(-o);poly([0,-8,-16,-6,-14,8,0,8],'#8a99a3','#394650',1);ctx.restore();ctx.save();ctx.rotate(o);poly([0,-8,16,-6,14,8,0,8],'#8a99a3','#394650',1);ctx.restore();ctx.restore();}
const SPL=(r,m)=>215.1-(m?13:0)-15*Math.log10(Math.max(r,1))-r*.0004;

const EP={no:4,slug:'offshore-wind',seriesName:'離岸風場開發系列',total:13,t:'環境影響評估',en:'Environmental impact assessment',
lede:'風場蓋在海裡，海裡原本就住著鯨豚、魚群與底棲生物，天上還有候鳥飛過。這一集看環評調查怎麼「聽」海豚、「追」候鳥、「挖」海床，以及打樁噪音如何被量化與管制。',
facts:[['160','dB','常見的打樁噪音管制值：距樁 750 公尺處的單次聲曝值（SEL）上限'],['750','m','打樁前觀察員與聲學監測必須確認沒有鯨豚的警戒範圍'],['30–60','分鐘','打樁前的鯨豚觀察與監聽時間，確認淨空才能開始'],['10–15','dB','氣泡幕等減噪措施可降低的水下噪音量級'],['四季','全年','鯨豚、鳥類與漁業調查需涵蓋季節變化，含春秋候鳥過境期'],['數年','持續','施工前、施工中與營運期間都要監測並提報結果']],
note:'說明：本集為教育用途示意動畫。噪音管制值、警戒距離與調查頻率為台灣常見的環評承諾範例，實際內容依各開發案的環評審查結論與主管機關規定而定。聲學傳播曲線為簡化模型。',
shots:[
/* 1 */{t:'鯨豚目視調查',en:'Marine mammal visual survey',dur:12,side:true,
 d:'研究船沿固定穿越線航行，受過訓練的觀察員在甲板高處以雙筒望遠鏡掃視海面，記錄看到的鯨豚種類、數量、行為（覓食、移動、休息）與位置。台灣西部沿海是瀕危的台灣白海豚棲息地，牠們多出沒在近岸淺水區，因此風場選址與海纜登陸路線都必須特別評估。',
 s:[[0,'研究船沿穿越線航行，觀察員輪班掃視海面'],[.28,'發現鯨豚群：記錄種類、數量與行為'],[.55,'同步記錄位置、時間、海況與能見度'],[.8,'多年、多季的目擊資料，描繪出鯨豚的分布熱點']],
 cam:()=>({x:560,y:430,s:1.35}),
 draw(u){
  const x=lerp(-200,RVX,easeOut(seg(u,0,.2))),wl=vsl(x,150,false,{damp:.7},vResearch);
  for(let i=0;i<3;i++){const px=x+84+i*12;person(px,wl-50,['#e8572a','#f2c230','#1f7f99'][i],1.1);ln([px+2,wl-60,px+8,wl-61],'#222',2);}
  if(u>.25)drawPod(seg(u,.25,1),SEA+14,26,4);
  lab(x+96,wl-62,'鯨豚觀察員',{dx:-40,dy:-50,a:band(u,.08,.5)});
  if(u>.3){const d=podX(seg(u,.25,1),0);lab(d,SEA-6,'鯨豚群出現',{dx:40,dy:-60,st:'s',a:band(u,.3,.6)});}
 },
 hud(u){hudPanel(250,200,'目擊紀錄表',seg(u,.3,.36),w=>{
  const t=Math.floor(9*60+22+u*30);hrow(52,'時間',`${Math.floor(t/60)}:${P2(t%60)}`,w);hrow(78,'物種','瓶鼻海豚',w);hrow(104,'數量','4 隻（含幼豚）',w);hrow(130,'行為',u>.6?'覓食':'移動',w);hrow(156,'海況',"蒲福 2 級",w);hrow(182,'能見度','> 5 km',w,'#7dffc4');});}},
/* 2 */{t:'水下聲學監測 PAM',en:'Passive acoustic monitoring',dur:12,side:true,
 d:'鯨豚大部分時間在水面下，而且在夜晚與惡劣天候時根本看不到。被動式聲學監測（PAM）把水下聽音器固定在海床上，全天候錄下海裡的聲音。海豚用高頻「滴答聲」回聲定位、用哨音彼此溝通，分析軟體能從頻譜中自動辨識這些聲音，統計鯨豚在不同季節、晝夜出現的頻率。',
 s:[[0,'水下聽音器錨定在海床，全天候錄音數個月'],[.25,'海豚發出回聲定位的高頻滴答聲'],[.5,'哨音在頻譜上呈現彎曲的線條'],[.75,'統計每天偵測到的時數，比對季節與晝夜變化']],
 cam:()=>({x:760,y:600,s:1.5}),
 draw(u){hydrophone(PAMX);drawPod(seg(u,.1,.95),600,40,3);
  const d=podX(seg(u,.1,.95),0),near=clamp(1-Math.abs(d-PAMX)/360);
  if(near>0)for(let i=0;i<4;i++){const k=(TT*1.8+i/4)%1;ring(d+22,600,8+k*110,`rgba(183,255,226,${near*(1-k)*.7})`,1.6);}
  lab(PAMX,bedY(PAMX)-66,'水下聽音器',{dx:80,dy:-40,a:1});
 },
 hud(u){hudPanel(280,230,'頻譜圖（0–150 kHz）',seg(u,.2,.26),(w)=>{
  const x0=14,y0=40,cw=w-28,ch=150;ctx.fillStyle='#0a1a24';ctx.fillRect(x0,y0,cw,ch);
  const tNow=TT,span=8;const d=u;
  for(let i=0;i<cw;i+=3){const tt=tNow-span+span*i/cw,near=clamp(1-Math.abs(podX(seg((tt-SS[1])/12,.1,.95),0)-PAMX)/360);
   for(let j=0;j<ch;j+=4){const v=hn(Math.round(tt*20),j)*.25*(1-j/ch);ctx.fillStyle=`rgba(80,160,200,${v})`;ctx.fillRect(x0+i,y0+ch-j,3,4);}
   if(near>.2&&hn(Math.round(tt*12),1)>.72){ctx.fillStyle=`rgba(242,194,48,${near})`;ctx.fillRect(x0+i,y0+10,2,ch-30);}
   if(near>.3){const f=.55+.25*Math.sin(tt*3.1)+.1*Math.sin(tt*7);ctx.fillStyle=`rgba(125,255,196,${near})`;ctx.fillRect(x0+i,y0+ch-f*ch*.5,3,3);}}
  htext(x0,y0+ch+20,'黃：回聲定位滴答聲　綠：哨音',12,'rgba(227,236,238,.8)');
  htext(x0,y0+ch+40,trf('今日偵測時數 {h} 小時',{h:(2+u*3.4).toFixed(1)}),13,'#fff',700);
 });}},
/* 3 */{t:'鳥類雷達與遷徙',en:'Bird radar survey',dur:12,side:true,
 d:'台灣位於東亞－澳洲候鳥遷徙路線上，每年春秋兩季有大量候鳥飛越海峽。調查團隊以垂直掃描的鳥類雷達，全天記錄飛越海面的鳥群高度、數量與方向，並搭配船上目視辨識物種。關鍵問題是：有多少比例的鳥飛在風機葉片的掃掠高度內？這決定碰撞風險評估與可能的減輕措施。',
 s:[[0,'鳥類雷達在海上平台持續垂直掃描'],[.25,'記錄每一群鳥的飛行高度、數量與方向'],[.5,'標出風機葉片掃掠範圍（約 30–270 公尺）'],[.75,'統計飛在掃掠範圍內的比例，評估碰撞風險']],
 cam:()=>({x:760,y:300,s:1.05}),
 draw(u){const wl=vsl(RVX,150,false,{damp:.7},vResearch);box(RVX+100,wl-74,6,24,'#8a99a3');ctx.save();ctx.translate(RVX+103,wl-78);ctx.rotate(Math.sin(TT*1.5)*.8);box(-14,-3,28,6,'#e3e9ec');ctx.restore();},
 fx(u){
  const ox=RVX+103,oy=wlAt(RVX+75,.7)-78,sw=Math.sin(TT*1.5)*.8;
  alphaDo(seg(u,.05,.12),()=>{const a=-Math.PI/2+sw*.9+.55;poly([ox,oy,ox+Math.cos(a-.08)*1300,oy+Math.sin(a-.08)*1300,ox+Math.cos(a+.08)*1300,oy+Math.sin(a+.08)*1300],'rgba(125,255,196,.12)');});
  alphaDo(seg(u,.5,.56),()=>{box(VX0,hY4(270),VX1-VX0,hY4(30)-hY4(270),'rgba(242,194,48,.10)');ln([VX0,hY4(270),VX1,hY4(270)],'rgba(242,194,48,.6)',1.2);ln([VX0,hY4(30),VX1,hY4(30)],'rgba(242,194,48,.6)',1.2);lab(1180,hY4(150),'風機葉片掃掠範圍',{dx:0,dy:0,st:'s'});});
  const r=rng(12);for(let g=0;g<9;g++){const h=r()*340+10,sp=40+r()*40,x0=r()*1800;const x=((x0+TT*sp)%1900)-150,y=hY4(h);const n=3+Math.floor(r()*5);
   for(let i=0;i<n;i++)bird(x-i*12-Math.abs(i-n/2)*6,y+Math.abs(i-n/2)*5,.9,TT+i+g);
   if(u>.25){ctx.strokeStyle='rgba(125,255,196,.5)';ctx.setLineDash([2,4]);ln([x-160,y,x-12*n,y],'rgba(125,255,196,.45)',1.2);ctx.setLineDash([]);}}
  lab(ox,oy,'垂直掃描鳥類雷達',{dx:60,dy:-40,a:band(u,.03,.4)});
 },
 hud(u){hudPanel(250,220,'飛行高度分布',seg(u,.3,.36),(w)=>{
  const B=[[0,50,22],[50,100,19],[100,150,14],[150,200,11],[200,250,9],[250,300,7],[300,400,10],[400,600,8]];let y=46;
  B.forEach(b=>{const inR=b[0]>=30&&b[1]<=280||b[0]==0&&false;const rz=(b[0]>=50&&b[1]<=250);htext(14,y+10,`${b[0]}–${b[1]} m`,12,'rgba(227,236,238,.8)',600,COND);hbar(84,y+3,110,b[2]/24*seg(u,.32,.5),rz&&u>.55?'#f2c230':'#7dc8dc');htext(w-14,y+11,b[2]+'%',13,'#fff',700,COND,'right');y+=19;});
  if(u>.72)htext(14,y+18,'約 45% 飛在掃掠範圍內',13,'#f2c230',700);
 });}},
/* 4 */{t:'底棲生物與漁業資源',en:'Benthic and fisheries survey',dur:12,side:true,
 d:'海床上下住著貝類、多毛類、甲殼類等底棲生物，是整個食物網的基礎。研究船以抓泥器採集固定面積的海床底質，送回實驗室篩選、鑑定、計算生物量與多樣性；另以試驗網具調查魚類與漁業資源，並訪談在地漁民了解傳統漁場。這些資料是日後比較「蓋之前、蓋之後」生態變化的基準線。',
 s:[[0,'抓泥器張開下放到海床'],[.3,'觸底後夾口閉合，採集固定面積的底質'],[.55,'收回甲板，篩洗出底棲生物並分類鑑定'],[.76,'以試驗網具與漁民訪談調查漁業資源']],
 cam:u=>({x:560,y:560,s:1.45}),
 draw(u){
  const wl=vsl(RVX+120,150,false,{damp:.7},vResearch),gx=RVX+134;
  const gy=u<.3?lerp(wl-20,bedY(gx)-8,ease(seg(u,.02,.3))):u<.55?lerp(bedY(gx)-8,wl-24,ease(seg(u,.36,.55))):wl-24;
  ln([gx,wl-30,gx,gy-18],'#2b3035',1.2);grab(gx,gy,u<.32?1:0);
  if(u>.3&&u<.34){for(let i=0;i<8;i++){const k=seg(u,.3,.34);circ(gx+(i-4)*5,bedY(gx)-4-k*20*(i%3),3*(1-k),'rgba(150,125,90,.6)');}}
  const r=rng(3);for(let i=0;i<14;i++){const x=380+r()*600,y=bedY(x);if(i%3===0){ctx.beginPath();ctx.ellipse(x,y-2,5,3,0,Math.PI,0);ctx.fillStyle='#d9b38c';ctx.fill();}else{ln([x,y,x+Math.sin(TT+i)*3,y-8-r()*6],'#c96b5a',1.6);}}
  school(760,590,14,7,TT,40,1);school(560,640,9,9,TT,30,-1,'rgba(242,214,120,.8)');
  if(u>.74){const nx=lerp(1200,860,seg(u,.74,1));ln([nx+100,SEA,nx,630],'#2b3035',1);poly([nx,610,nx-80,600,nx-110,640,nx-80,680,nx,660],'rgba(230,230,230,.25)','rgba(255,255,255,.6)',1);}
  lab(gx,gy,'抓泥器',{dx:60,dy:-30,a:band(u,.05,.6)});
  lab(420,bedY(420),'底棲生物',{dx:-40,dy:-70,a:band(u,.2,.7)});
  lab(760,590,'魚群',{dx:60,dy:-50,a:band(u,.6,1)});
 },
 hud(u){hudPanel(240,170,'樣站 B-07 分析結果',seg(u,.56,.62),w=>{hrow(52,'物種數','38 種',w);hrow(78,'密度','1,240 個體／m²',w);hrow(104,'優勢類群','多毛類',w);hrow(130,'底質','細砂 82%',w);hrow(156,'季別','春季（第 3 次）',w,'#7dffc4');});}},
/* 5 */{t:'水下噪音評估',en:'Underwater noise modelling',dur:13,
 d:'打樁是離岸風場施工中最吵的作業，巨大的衝擊聲在水中能傳到數十公里外，可能影響鯨豚的聽覺與行為。環評階段就要以聲學模型預測噪音隨距離的衰減，並承諾管制標準：例如距樁 750 公尺處的單次聲曝值不得超過 160 dB。為了達標，施工時必須搭配氣泡幕等減噪措施，並持續實測。',
 s:[[0,'以聲學模型預測打樁噪音隨距離衰減的情形'],[.28,'未減噪時，750 公尺處可能高於管制值'],[.52,'加上氣泡幕等減噪措施，噪音降低約 10–15 dB'],[.76,'以警戒區與即時量測確保施工時符合承諾']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,900,650,{title:'單次聲曝值 SEL 隨距離衰減',x0:0,x1:3000,y0:140,y1:200,xt:[0,500,1000,1500,2000,2500,3000],yt:[140,150,160,170,180,190,200],xl:'距離打樁點（m）',yl:'dB re 1 μPa²s',pt:86,pl:70,gx:6,gy:6});
  const lim=c.Y(160);ctx.setLineDash([10,6]);ln([c.px,lim,c.px+c.pw,lim],'#e8572a',2.4);ctx.setLineDash([]);wt(c.px+c.pw-8,lim-10,'管制值 160 dB',19,'#e8572a',700,'right');
  ln([c.X(750),c.py,c.X(750),c.py+c.ph],'rgba(255,255,255,.5)',1.6);wt(c.X(750)+8,c.py+24,'750 m',19,'#fff',700,'left',COND);
  const curve=(m,k,col)=>{ctx.beginPath();for(let r=20;r<=3000*k;r+=20){const y=c.Y(clamp(SPL(r,m),140,200));r===20?ctx.moveTo(c.X(r),y):ctx.lineTo(c.X(r),y);}ctx.strokeStyle=col;ctx.lineWidth=3.4;ctx.stroke();};
  curve(false,seg(u,.05,.3),'#ff8a60');
  if(u>.28){const v=SPL(750,false);circ(c.X(750),c.Y(v),8,'#ff8a60','#fff',2);lab(c.X(750),c.Y(v),trf('未減噪 {v} dB',{v:v.toFixed(0)}),{dx:80,dy:-40,st:'w',a:seg(u,.28,.32)});}
  if(u>.5){curve(true,seg(u,.5,.7),'#7dffc4');if(u>.68){const v=SPL(750,true);circ(c.X(750),c.Y(v),8,'#7dffc4','#fff',2);lab(c.X(750),c.Y(v),trf('減噪後 {v} dB',{v:v.toFixed(0)}),{dx:80,dy:40,st:'g'});}}
  // top view
  card(1000,150,540,650,{bg:'rgba(7,27,39,.75)'});wt(1024,190,'施工警戒區（上視）',20,'#f2c230',700);
  const cx=1270,cy=480;ring(cx,cy,230,'rgba(255,255,255,.12)',1);
  alphaDo(seg(u,.74,.8),()=>{ctx.beginPath();ctx.arc(cx,cy,190,0,TAU);ctx.fillStyle='rgba(232,87,42,.10)';ctx.fill();ctx.setLineDash([8,6]);ring(cx,cy,190,'#e8572a',2.4);ctx.setLineDash([]);wt(cx,cy+225,'750 m 警戒區',19,'#e8572a',700,'center');
   for(let i=0;i<4;i++){const a=i*TAU/4+.4;circ(cx+Math.cos(a)*190,cy+Math.sin(a)*190,7,'#f2c230');}wt(cx+140,cy-160,'監測點',16,'#f2c230',700);});
  alphaDo(seg(u,.5,.56),()=>{ctx.setLineDash([3,4]);ring(cx,cy,34,'#8fd0ff',3);ctx.setLineDash([]);});
  const ph=(TT*.8)%1;ring(cx,cy,10+ph*220,`rgba(255,138,96,${.6*(1-ph)})`,2);circ(cx,cy,8,'#fff');
  if(u<.74){const dx=lerp(1500,1400,u),dy=300;dolphin(dx,dy,Math.PI,1.3);}
 }},
/* 6 */{t:'審查與環評承諾',en:'Review and commitments',dur:12,
 d:'調查與評估的成果寫成環境影響說明書，送交主管機關審查。專案小組與委員會會邀請專家、學者、漁會與民間團體參與討論，要求開發商補充資料或修改方案。通過後，開發商對減輕措施所做的承諾具有法律拘束力，施工與營運期間都要依承諾執行監測、定期提報，並接受查核。',
 s:[[0,'撰寫環境影響說明書，公開說明並蒐集意見'],[.2,'專案小組審查：專家、漁會與民間團體參與討論'],[.45,'環評大會作成審查結論'],[.65,'減輕措施成為具拘束力的環評承諾'],[.84,'施工與營運期間持續監測、定期提報']],
 draw(u){
  diagBG();
  const N=[['環境影響說明書','調查成果與影響預測'],['專案小組審查','補件、修正方案'],['環評大會','作成審查結論'],['環評承諾','減輕措施具拘束力'],['監測與提報','施工與營運期間']];
  const y=300,w=250,gap=40,x0=(1600-(w*5+gap*4))/2;
  N.forEach((n,i)=>{const t0=[0,.2,.45,.65,.84][i],a=seg(u,t0,t0+.06),x=x0+i*(w+gap);
   alphaDo(a,()=>{card(x,y-70,w,140,{bg:i===Math.max(0,[0,.2,.45,.65,.84].filter(t=>u>=t).length-1)?'rgba(242,194,48,.22)':'rgba(255,255,255,.06)',st:'rgba(242,194,48,.6)'});
    wt(x+w/2,y-28,String(i+1),26,'#f2c230',700,'center',COND);wt(x+w/2,y+10,n[0],21,'#fff',700,'center');wt(x+w/2,y+44,n[1],16,'rgba(227,236,238,.75)',500,'center');
    if(i<4)arrow(x+w+4,y,x+w+gap-4,y,'#f2c230',2.4);});});
  alphaDo(seg(u,.65,.72),()=>{card(160,470,1280,330,{bg:'rgba(7,27,39,.8)'});wt(190,512,'常見承諾事項（示例）',20,'#f2c230',700);
   const L=['打樁噪音：距樁 750 m 處單次聲曝值 ≤ 160 dB','打樁前 30 分鐘：鯨豚觀察員與 PAM 確認警戒區淨空','採用軟啟動與氣泡幕等減噪措施','避開特定生物敏感季節施工','施工船舶減速、避開白海豚重要棲地','營運期持續監測鯨豚、鳥類、底棲與漁業資源'];
   L.forEach((t,i)=>{const a=seg(u,.68+i*.03,.71+i*.03);alphaDo(a,()=>{const cx=190+(i%2)*630,cy=560+Math.floor(i/2)*70;circ(cx+8,cy-7,8,'#7dffc4');wt(cx+26,cy,t,19,'#fff',500);});});});
 }}
]};
