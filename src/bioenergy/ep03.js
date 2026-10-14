// KITS: land
/* 生質能系列 第 3 集：垃圾焚化與汽電共生 */
/* 進廠與貯坑 → 焚化爐與鍋爐 → 汽電共生 → 空污防制 → 灰渣再利用 → 垃圾管理的順序（示意，比例壓縮） */
const STM_C='#7dc8dc',PWR_C='#f2c230',FLUE_C='#8d989f',WST_C='#9a7a4a';
const WCL=[[560,330,.6,4],[1000,380,.5,3]];
function clouds(){for(const [x0,y,sc,sp] of WCL){const x=480+((x0-480+TT*sp)%900+900)%900;lcloud(x,y,sc);}}
function pl(P,col,lw){ctx.lineJoin='round';ln(P.flat(),col,lw);}
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1;const p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4,col));}}

/* ── 全廠座標（世界座標，地面 GY=600） ── */
const PL={pit:{x:200,w:380,top:390},hop:{x:580,w:60},furn:{x:640,w:150,top:440},boil:{x:790,w:110,top:290},tur:{x:930,w:170,top:500},scr:{x:1130,w:80,top:370},bag:{x:1240,w:100,top:430},stack:{x:1380,w:30,top:240},pole:1500};
const P_STEAM=[[845,300],[845,262],[1010,262],[1010,504]];
const P_FLUE1=[[715,520],[715,400],[845,400],[845,560]];
const P_APC=[[900,572],[1170,572],[1170,400],[1290,400],[1290,580],[1395,580],[1395,262]];
const P_PWR=[[1100,590],[1500,590],[1500,490]];
const GRATE=[[665,500],[705,516],[745,532],[780,548]];

/* 垃圾貯坑與吊車 */
const PITR=rng(7);const PITB=[];for(let i=0;i<70;i++)PITB.push([PITR(),PITR(),PITR(),PITR()]);
const WCOL=['#8a6a45','#a58b5a','#6f7a80','#4d6f8a','#b9a37a','#7a5a3a','#5c6b52'];
function pitFill(h){ /* h：垃圾高度 0–1 */
  const x0=PL.pit.x+16,x1=PL.pit.x+PL.pit.w-16,top=lerp(700,585,h);
  box(x0,600,x1-x0,120,'#241a14');
  ctx.save();ctx.beginPath();ctx.rect(x0,600,x1-x0,120);ctx.clip();
  poly([x0,720,x0,top+14,x0+80,top-6,x0+190,top-18,x0+300,top-2,x1,top+16,x1,720],'#5f4a36');
  for(const [a,b,c,d] of PITB){const x=lerp(x0+6,x1-6,a),y=lerp(top+6,712,b);if(y<top-2+ (Math.abs(x-(x0+x1)/2)<110?-14:0))continue;
    box(x,y,10+c*22,6+d*8,WCOL[Math.floor(c*d*100)%WCOL.length],'rgba(0,0,0,.25)',1);}
  ctx.restore();
}
function hall(o){
  o=o||{};const P=PL.pit;
  box(P.x,P.top,P.w,210,'#aab4ba','rgba(0,0,0,.3)',1.5);poly([P.x-14,P.top+2,P.x+P.w/2,P.top-40,P.x+P.w+14,P.top+2],'#6d7c86');
  box(P.x+14,P.top+28,P.w-28,182,'#33444f');
  for(let k=0;k<5;k++)box(P.x+34+k*66,P.top+40,40,18,'rgba(125,200,220,.3)');
  pitFill(o.fill===undefined?.7:o.fill);
  /* 卸料平台牆 */
  box(P.x-10,560,26,40,'#8d989f','rgba(0,0,0,.3)',1.5);
  /* 軌道與吊車 */
  box(P.x+14,400,P.w+50,8,'#394650');
  const gx=o.gx===undefined?330:o.gx,gy=o.gy===undefined?450:o.gy,op=o.open===undefined?1:o.open;
  box(gx-22,396,44,18,'#e9b21f','rgba(0,0,0,.3)',1.5);
  ln([gx,414,gx,gy],'#2b3137',3);
  box(gx-12,gy,24,14,'#555f66');
  const sp=lerp(4,26,op);
  poly([gx-12,gy+14,gx-12-sp,gy+44,gx-4,gy+40],'#394650','rgba(0,0,0,.4)',1);
  poly([gx+12,gy+14,gx+12+sp,gy+44,gx+4,gy+40],'#394650','rgba(0,0,0,.4)',1);
  if(o.load){alphaDo(o.load,()=>{for(let k=0;k<5;k++)box(gx-14+k*6,gy+30+(k%2)*6,12,9,WCOL[k]);});}
}
function hopper(){
  const H=PL.hop;poly([H.x,PL.pit.top+10,H.x+H.w,PL.pit.top+10,H.x+H.w-12,470,H.x+12,470],'#7d868c','rgba(0,0,0,.35)',1.5);
  box(H.x+10,470,H.w,50,'#6d7c86');
}
/* 焚化爐與鍋爐 */
function furnace(o){
  o=o||{};const F=PL.furn,B=PL.boil,fire=o.fire===undefined?1:o.fire;
  box(F.x,F.top,F.w,600-F.top,'#7d868c','rgba(0,0,0,.35)',1.5);
  box(F.x+14,F.top+24,F.w-28,136,'#2a1c16');
  /* 爐排（階梯狀）與垃圾床 */
  poly([GRATE[0][0],GRATE[0][1]-12,GRATE[3][0],GRATE[3][1]-8,GRATE[3][0],GRATE[3][1],GRATE[0][0],GRATE[0][1]],'#5f4a36');
  for(let k=0;k<4;k++)ln([GRATE[k][0],GRATE[k][1],GRATE[k][0]+34,GRATE[k][1]+2],'#c9d1d6',4);
  if(fire>0)for(let k=0;k<7;k++){const fx=666+k*16,fy=lerp(498,538,k/6),fh=24+16*Math.sin(TT*9+k*1.7);
    alphaDo(fire,()=>poly([fx-8,fy-10,fx,fy-10-fh,fx+8,fy-10],k%2?'#f2c230':'#e8572a'));}
  /* 鍋爐（水管牆） */
  box(B.x,B.top,B.w,600-B.top,'#8a959b','rgba(0,0,0,.35)',1.5);
  box(B.x+10,B.top+36,B.w-20,250,'rgba(40,30,28,.85)');
  for(let k=0;k<6;k++)ln([B.x+16+k*16,B.top+40,B.x+16+k*16,B.top+280],'rgba(125,200,220,.5)',3);
  rrp(B.x+8,B.top+4,B.w-16,26,13);ctx.fillStyle='#aeb8be';ctx.fill();
  const ha=o.heat===undefined?1:o.heat;alphaDo(ha*.35,()=>box(B.x+10,B.top+36,B.w-20,250,'#e8572a'));
  /* 出渣機 */
  box(F.x+F.w-20,568,40,32,'#44535c','rgba(0,0,0,.35)',1.5);
  ln([F.x+F.w-20,568,F.x+F.w,560],'#44535c',3);
}
function turbineHall(o){
  o=o||{};const T=PL.tur;
  box(T.x,T.top,T.w,100,'#3f6f5c','rgba(0,0,0,.35)',1.5);
  box(T.x+12,T.top+50,50,34,'#c9d1d6');poly([T.x+62,T.top+46,T.x+96,T.top+38,T.x+96,T.top+88,T.x+62,T.top+80],'#8d989f');
  circ(T.x+126,T.top+64,24,'#2a3a46','#c9d1d6',2);
  ctx.save();ctx.translate(T.x+126,T.top+64);ctx.rotate(TT*(o.spin===undefined?5:o.spin));for(let k=0;k<6;k++){ctx.rotate(TAU/6);ln([0,0,18,0],'#f2c230',2);}ctx.restore();
  /* 空冷冷凝器 */
  box(T.x+10,T.top-34,T.w-20,26,'#aeb8be','rgba(0,0,0,.3)',1.5);
  for(let k=0;k<3;k++){const cx=T.x+40+k*45;ctx.save();ctx.translate(cx,T.top-21);ctx.rotate(TT*6+k);ln([-14,0,14,0],'#44535c',3);ctx.restore();}
}
function apc(o){
  o=o||{};
  /* 風管（先畫，設備蓋在上面） */
  pl([[900,572],[1170,572]],'#6d7c86',9);pl([[1170,400],[1290,400]],'#6d7c86',9);pl([[1290,580],[1395,580],[1395,262]],'#6d7c86',9);
  const S=PL.scr,G=PL.bag,K=PL.stack;
  box(S.x,S.top,S.w,600-S.top,'#c9d1d6','rgba(0,0,0,.35)',1.5);
  poly([S.x-6,S.top+2,S.x+S.w/2,S.top-26,S.x+S.w+6,S.top+2],'#8d989f');
  const sp=o.spray===undefined?1:o.spray;
  if(sp>0)for(let k=0;k<12;k++){const f=(TT*.6+k/12)%1;alphaDo(sp*(1-f),()=>circ(S.x+14+((k*37)%52),S.top+30+f*140,3,'#f4f6f7'));}
  box(G.x,G.top,G.w,600-G.top,'#aeb8be','rgba(0,0,0,.3)',1.5);
  for(let k=0;k<5;k++)box(G.x+10+k*18,G.top+26,8,120,'rgba(40,50,56,.45)');
  poly([G.x,G.top,G.x+G.w/2,G.top-22,G.x+G.w,G.top],'#8d989f');
  box(K.x,K.top,K.w,600-K.top,'#b9c1c6','rgba(0,0,0,.35)',1.5);for(let k=0;k<3;k++)box(K.x,K.top+10+k*14,K.w,6,'#e8572a');
  const sm=o.smoke===undefined?1:o.smoke;
  for(let k=0;k<5;k++){const f=(TT*.4+k/5)%1;alphaDo(sm*(1-f)*.4,()=>circ(K.x+K.w/2+f*30,K.top-8-f*70,5+f*13,'rgba(235,240,242,.9)'));}
}
function pole(){const p=PL.pole;ln([p,600,p,440],'#6b5a48',5);ln([p-26,452,p+26,452],'#6b5a48',3);box(p-14,470,28,30,'#8d989f');ln([PL.tur.x+PL.tur.w,590,p,590,p,500],'#394650',2);}
function plant(o){
  o=o||{};
  hall({fill:o.fill===undefined?.7:o.fill,gx:o.gx,gy:o.gy,open:o.open});hopper();
  pole();furnace({fire:o.fire,heat:o.heat});turbineHall({spin:o.spin});apc({smoke:o.smoke,spray:o.spray});
}

/* 圖解小工具 */
function bullet(x,y,t,col,sz){circ(x,y-6,7,col);wt(x+22,y,t,sz||19,'#fff',600);}

const EP={no:3,slug:'bioenergy',seriesName:'生質能系列',t:'垃圾焚化與汽電共生',en:'Waste-to-energy and cogeneration',
lede:'垃圾焚化廠既是處理廢棄物的設施，也是一座發電廠。這一集從垃圾車進廠、貯坑混合開始，看垃圾在爐排上燃燒、把鍋爐的水變成蒸汽；比較純發電與汽電共生的能源利用率，認識層層串聯的空污防制設備，說明底渣與飛灰各自的去向，最後回到垃圾管理的順序：焚化發電是最後的選項，而不是第一選擇。',
facts:[['625 萬＋','公噸','2025 年全國垃圾熱處理設施處理量（環境部）'],
['34 億','度','2025 年熱處理設施全年發電量，約供 83 萬戶家庭一年用電（環境部）'],
['約 540','度／公噸','由前兩項數字推算的平均發電量（示例推算，含廠內自用）'],
['≥ 850','°C','二次燃燒室典型操作溫度，廢氣停留 2 秒以上（典型範例）'],
['逾 90','%','焚化底渣經處理後的再利用率（監察院調查）'],
['> 85','%','2025 年全國垃圾焚化設施平均運轉率（環境部）']],
note:'說明：本集為教育用途示意動畫，廠房設備與比例經過壓縮。2025 年處理量（逾 625 萬公噸）、發電量（約 34 億度）、約 83 萬戶與運轉率（逾 85%）依環境部公布之全國垃圾熱處理統計；每公噸約 540 度為前兩數字相除的示例推算，含廠內自用電，各廠不同。底渣再利用率逾九成引自監察院調查報告，飛灰再利用比例低於底渣。爐溫 850°C 與停留 2 秒、蒸汽約 40 bar／400°C、發電效率約 20%、汽電共生利用率 50% 以上、900 公噸／日規模，為典型範例；實際依各廠設計與運轉條件而不同。生物源碳的認定依法規與計算方式而定。',
base:()=>{landSky(600,{sun:{x:1240,y:110},clouds:false});clouds();drawGround();},
shots:[
{t:'垃圾進廠與貯坑混合',en:'Delivery and the waste pit',dur:13,side:true,
 d:'垃圾車進廠先過磅，再倒車到卸料平台，把一般廢棄物倒進深槽狀的垃圾貯坑。貯坑的功用是儲存與混合：垃圾含水、紙類與廚餘的比例不一，熱值並不穩定，吊車操作員要用抓斗把乾濕不同的垃圾翻動、堆高混合，讓進爐的燃料盡量均勻。貯坑上方維持負壓，臭氣被吸進爐內當作燃燒空氣，不會外洩。混合好的垃圾再由抓斗抓起，投入進料斗。全廠依日處理量設計，例如 3 座爐、各 300 公噸，合計 900 公噸／日（示例）。',
 s:[[0,'垃圾車進廠過磅，倒車到卸料平台'],[.3,'垃圾倒入貯坑，負壓抽走臭氣，避免外洩'],[.52,'吊車抓斗把乾濕垃圾翻動混合，熱值才穩定'],[.76,'混合好的垃圾，由抓斗投入進料斗']],
 cam:u=>({x:470,y:490,s:1.5}),
 draw(u){
  const dump=seg(u,.28,.5),grab=seg(u,.52,.62),lift=seg(u,.62,.72),mv=seg(u,.72,.88),rel=seg(u,.88,.94);
  /* 抓斗路徑：待命 → 下降 → 抓取 → 上升 → 橫移 → 投料 */
  const dn=seg(u,.46,.56),up=seg(u,.62,.72);
  const gyy=lerp(450,610,ease(dn))-lerp(0,160,ease(up));
  const op=1-ease(seg(u,.55,.6))+ease(rel);
  hall({fill:lerp(.55,.8,ease(dump)),gx:lerp(330,612,ease(mv)),gy:gyy,open:clamp(op),load:seg(u,.58,.62)*(1-rel)});
  hopper();
  const tx=lerp(-20,240,ease(seg(u,.02,.26)));
  truck(tx,600,true,'#3f6f5c',()=>{const k=1-dump;for(let j=0;j<4;j++)box(14+j*18,-34-24*k*(1-j*.12),16,24*k,WCOL[j]);});
  /* 倒入貯坑的垃圾 */
  if(dump>0&&dump<1)for(let k=0;k<9;k++){const f=(dump*2+k/9)%1;alphaDo(1-f*.3,()=>box(246+((k*29)%60),600+f*40-8+(1-f)*-10,10,8,WCOL[k%7]));}
  lab(100,590,'垃圾車',{dx:-20,dy:-110,st:'s',a:band(u,.04,.3)});
  lab(PL.pit.x+190,640,'垃圾貯坑',{dx:0,dy:80,st:'s',a:band(u,.3,.56)});
  lab(PL.pit.x+190,405,'吊車與抓斗',{dx:-30,dy:-70,st:'l',a:band(u,.5,.8)});
  lab(PL.hop.x+30,PL.pit.top+60,'進料斗',{dx:50,dy:-70,st:'g',a:band(u,.8,1)});
 },
 hud(u){hudPanel(270,150,'全廠規模（示例）',seg(u,.04,.1),w=>{
  hrow(56,'日處理量','900 t/日',w,'#f2c230');
  hrow(88,'爐座數','3 座',w,'#7dffc4');
  hrow(120,'貯坑氣壓','負壓',w,'#7dc8dc');});}},

{t:'爐排燃燒與鍋爐產汽',en:'Grate combustion and boiler',dur:14,side:true,
 d:'垃圾由進料斗落到爐排上，爐排緩慢往下推動，垃圾依序經過乾燥、燃燒與燃燼三個區段，空氣從爐排下方吹入助燃。爐膛與二次燃燒室的溫度維持在 850°C 以上，廢氣停留 2 秒以上，讓有機污染物充分分解。高溫煙氣通過水管牆鍋爐，把水加熱成約 40 bar、400°C 的過熱蒸汽（典型範例），推動蒸汽輪機與發電機。燃燒後剩下的底渣由爐排尾端落入出渣機，經水冷卻後送出。',
 s:[[0,'垃圾落上爐排，依序乾燥、燃燒、燃燼'],[.26,'爐溫 850°C 以上，廢氣停留 2 秒以上'],[.52,'高溫煙氣把鍋爐的水變成高壓過熱蒸汽'],[.76,'蒸汽推動汽輪機發電，底渣由尾端排出']],
 cam:u=>camMix({x:800,y:450,s:1},{x:830,y:430,s:1.45},ease(seg(u,.02,.2))*(1-ease(seg(u,.9,1)))),
 draw(u){
  plant({fire:seg(u,.04,.14),heat:seg(u,.3,.5),fill:.6,gx:612,gy:450,open:1});
  flowDots([[610,470],[690,500]],4,WST_C,seg(u,.02,.1),.5,4);
  flowDots(P_FLUE1,10,FLUE_C,seg(u,.24,.3),.3,4);
  flowDots(P_STEAM,10,STM_C,seg(u,.5,.56),.35,4);
  flowDots(P_PWR,5,PWR_C,seg(u,.72,.78),.6,3.5);
  /* 底渣落下 */
  if(u>.74)for(let k=0;k<3;k++){const f=(TT*.5+k/3)%1;alphaDo(seg(u,.74,.8)*(1-f),()=>box(PL.furn.x+PL.furn.w-4,560+f*30,8,6,'#6f7a80'));}
  lab(700,470,'爐排',{dx:-50,dy:-130,st:'s',a:band(u,.04,.3)});
  lab(715,430,'二次燃燒室 850°C 以上',{dx:-20,dy:-110,st:'w',a:band(u,.24,.52)});
  lab(845,330,'水管牆鍋爐',{dx:60,dy:-90,st:'s',a:band(u,.4,.7)});
  lab(PL.tur.x+126,PL.tur.top+64,'蒸汽輪機＋發電機',{dx:70,dy:-120,st:'s',a:band(u,.54,.82)});
  lab(PL.furn.x+PL.furn.w,585,'出渣機',{dx:30,dy:60,st:'l',a:band(u,.74,1)});
 },
 hud(u){hudPanel(270,150,'鍋爐條件（示例）',seg(u,.04,.1),w=>{const k=seg(u,.14,.5);
  hrow(56,'爐溫',trf('{v} °C',{v:Math.round(850*k)}),w,'#ff9d7a');
  hrow(88,'蒸汽壓力',trf('{v} bar',{v:Math.round(40*seg(u,.5,.62))}),w,'#7dc8dc');
  hrow(120,'發電出力',trf('{v} MW',{v:(20*seg(u,.56,.8)).toFixed(0)}),w,'#f2c230');});}},

{t:'汽電共生：把餘熱變成產品',en:'Cogeneration: using the waste heat',dur:13,
 d:'汽電共生是同一份燃料同時產出電與熱。純發電時，蒸汽在汽輪機內一路膨脹做功，最後在冷凝器把大量熱量排進空氣或冷卻水，白白流失，焚化廠的發電效率多在 20% 上下。若在中途抽出部分蒸汽，或使用背壓排汽，直接送給鄰近的工廠、園區或溫水設施，熱就變成產品，整體能源利用率可提高到 50% 以上（示例）。代價是發電量略減，而且必須有穩定、距離近的用熱用戶。',
 s:[[0,'純發電：大部分熱量在冷凝器排掉'],[.28,'汽電共生：中途抽汽，把蒸汽直接送給用戶'],[.54,'熱也成為產品，整體能源利用率大幅提高'],[.78,'前提是附近要有穩定的用熱用戶']],
 draw(u){
  diagBG();
  card(60,160,820,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'蒸汽的去向（示意）',20,'#f2c230',700);
  const N=[['鍋爐','#e8572a',.02,100,300],['汽輪機','#7dc8dc',.08,330,300],['發電機','#f2c230',.14,560,300]];
  N.forEach(([n,col,t,x,y])=>alphaDo(seg(u,t,t+.06),()=>{tag(x+60,y,n,{bg:col,size:19,align:'center'});}));
  alphaDo(seg(u,.08,.14),()=>{arrow(224,300,290,300,'rgba(255,255,255,.6)',3);arrow(450,300,520,300,'rgba(255,255,255,.6)',3);});
  alphaDo(seg(u,.14,.2),()=>{arrow(680,300,740,300,'#f2c230',4);wt(748,290,'電',24,'#f2c230',800);});
  /* 純發電：排熱 */
  alphaDo(seg(u,.12,.2),()=>{arrow(390,330,390,400,'#ff9d7a',4);tag(390,440,'冷凝器　大量排熱',{bg:'#ff9d7a',size:18,align:'center'});});
  for(let k=0;k<4;k++){const f=(TT*.4+k/4)%1;alphaDo(seg(u,.14,.2)*(1-f),()=>circ(310+k*40,396-f*40,6,'rgba(255,157,122,.7)'));}
  /* 汽電共生：抽汽 */
  alphaDo(seg(u,.3,.38),()=>{ln([390,270,390,215,600,215,600,560],'#7dffc4',4);tag(390,190,'抽汽',{bg:'#7dffc4',size:18,align:'center'});});
  flowDots([[390,270],[390,215],[600,215],[600,560]],6,'#7dffc4',seg(u,.34,.4),.3,4.5);
  alphaDo(seg(u,.36,.44),()=>{box(520,570,160,100,'#6d7c86','rgba(0,0,0,.35)',1.5);poly([510,572,600,530,690,572],'#44535c');box(540,600,30,70,'#2a3a46');box(610,600,30,70,'#2a3a46');
   tag(600,720,'蒸汽用戶',{bg:'#7dffc4',size:18,align:'center'});wt(600,760,'工廠、園區、溫水設施',16,'rgba(227,236,238,.85)',500,'center');});
  alphaDo(seg(u,.4,.46),()=>{wt(100,560,'熱不再排掉，而是賣給用戶',18,'#7dffc4',700);wt(100,594,'代價：發電量略減',17,'rgba(227,236,238,.8)',500);});
  /* 右：能源利用率 */
  card(920,160,620,640,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});wt(944,200,'燃料能量的利用率（示例）',20,'#f2c230',700);
  const bw=520,bx=950;
  const rows=[['只發電',[[20,'#f2c230','電']],.5],['汽電共生',[[18,'#f2c230','電'],[35,'#7dffc4','熱']],.58]];
  rows.forEach(([n,segs,t],i)=>{const y=290+i*190;alphaDo(seg(u,t-.06,t),()=>wt(bx,y,n,20,'#fff',700));
   box(bx,y+20,bw,50,'rgba(255,255,255,.08)');let acc=0;
   segs.forEach(([v,col,lab_],j)=>{const k=ease(seg(u,t+j*.06,t+.1+j*.06));const w=bw*v/100*k;box(bx+bw*acc/100,y+20,w,50,col);
    if(k>.9)wt(bx+bw*acc/100+bw*v/200,y+53,lab_,18,'#0e2a3b',800,'center');acc+=v;});
   const tot=segs.reduce((s,x)=>s+x[0],0);
   alphaDo(seg(u,t+.12,t+.18),()=>wt(bx+bw*tot/100+12,y+56,trf('約 {n}%',{n:tot}),26,i?'#7dffc4':'#f2c230',700,'left',COND));
   alphaDo(seg(u,t+.12,t+.18),()=>wt(bx,y+104,i?'電與熱都有人使用':'其餘多半以廢熱排出',16,'rgba(227,236,238,.8)',500));});
  alphaDo(seg(u,.8,.88),()=>{card(944,640,572,130,{bg:'rgba(232,87,42,.12)',st:'rgba(232,87,42,.55)'});wt(968,676,'前提',17,'#ff9d7a',700);wt(968,710,'用戶距離要近、用熱要穩定',19,'#fff',600);wt(968,742,'否則管線損失與閒置反而不划算',17,'rgba(227,236,238,.85)',500);});
 }},

{t:'層層把關的空污防制',en:'Flue gas cleaning',dur:14,side:true,
 d:'焚化廠的煙氣處理是公眾最在意的一環，通常由多道設備串聯。爐內可噴入氨水或尿素，降低氮氧化物（SNCR）；煙氣進入半乾式洗煙塔，與噴入的消石灰漿反應，去除氯化氫與硫氧化物等酸性氣體，同時降溫；接著注入活性碳粉，吸附戴奧辛與重金屬；最後通過袋式集塵器，把粒狀物與反應產物攔下，成為飛灰。處理過的煙氣由煙囪排出，排放濃度由連續監測設備記錄，並須符合法規標準。',
 s:[[0,'爐內噴氨水，先降低氮氧化物'],[.26,'洗煙塔噴消石灰漿，中和酸性氣體並降溫'],[.5,'注入活性碳，吸附戴奧辛與重金屬'],[.74,'袋式集塵攔下粒狀物，煙氣才由煙囪排出']],
 cam:u=>camMix({x:800,y:450,s:1},{x:1160,y:440,s:1.5},ease(seg(u,.02,.2))*(1-ease(seg(u,.92,1)))),
 draw(u){
  plant({fire:1,heat:.6,fill:.6,gx:612,gy:450,open:1,smoke:seg(u,.7,.8)});
  flowDots(P_FLUE1,8,FLUE_C,seg(u,.04,.12),.3,4);
  flowDots(P_APC,16,FLUE_C,seg(u,.22,.3),.22,4);
  alphaDo(seg(u,.46,.52),()=>{for(let k=0;k<6;k++){const f=(TT*.5+k/6)%1;circ(1140+f*100,432+(k%3)*10,3,'#222');}});
  lab(845,420,'爐內噴氨水（SNCR）',{dx:-30,dy:-110,st:'l',a:band(u,.02,.26)});
  lab(PL.scr.x+40,PL.scr.top+80,'半乾式洗煙塔＋消石灰漿',{dx:-20,dy:-120,st:'s',a:band(u,.24,.52)});
  lab(1200,402,'活性碳注入',{dx:-10,dy:-100,st:'g',a:band(u,.48,.74)});
  lab(PL.bag.x+50,PL.bag.top+60,'袋式集塵器',{dx:10,dy:-90,st:'s',a:band(u,.62,.9)});
  lab(PL.stack.x+15,PL.stack.top+30,'煙囪＋連續監測',{dx:-40,dy:-40,st:'l',a:band(u,.76,1)});
 },
 hud(u){hudPanel(270,150,'各段任務（示例）',seg(u,.04,.1),w=>{
  hrow(56,'洗煙塔','中和酸氣',w,'#f2c230');
  hrow(88,'活性碳','吸附戴奧辛',w,'#7dffc4');
  hrow(120,'袋式集塵','攔截粒狀物',w,'#7dc8dc');});}},

{t:'底渣與飛灰的去向',en:'Bottom ash and fly ash',dur:13,
 d:'焚化後，重量約剩下垃圾的一至兩成（典型），主要是兩類灰渣。底渣是爐排尾端排出的不可燃物，如玻璃、陶瓷與金屬，經磁選回收鐵金屬、篩分、熟化後，可作為再生粒料，用於道路底層與磚品等；監察院調查指出，底渣再利用率已超過九成。飛灰是煙氣處理攔下的細粉，含較高濃度的重金屬與鹽類，須經穩定化或熔融處理，再依規定再利用或掩埋，再利用比例遠低於底渣。',
 s:[[0,'焚化後重量剩下一至兩成，主要是灰渣'],[.28,'底渣經磁選、篩分、熟化，成為再生粒料'],[.54,'飛灰含重金屬與鹽類，要先穩定化處理'],[.78,'底渣再利用率逾九成，飛灰比例仍低']],
 draw(u){
  diagBG();
  card(60,160,520,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'1 公噸垃圾的去向（示例）',20,'#f2c230',700);
  const k=ease(seg(u,.04,.2));
  box(110,260,420,56,'#9a7a4a');wt(320,296,'垃圾　1 公噸',20,'#fff',800,'center');
  alphaDo(seg(u,.1,.18),()=>{arrow(320,322,320,366,'rgba(255,255,255,.6)',3);});
  alphaDo(seg(u,.14,.22),()=>{
   box(110,376,420*.85*k,50,'#8d989f');wt(110+420*.85*.5,408,'煙氣與水氣',18,'#0e2a3b',800,'center');
   box(110+420*.85,376,420*.15*k,50,'#e8572a');});
  alphaDo(seg(u,.2,.28),()=>{wt(110+420*.85+4,360,'灰渣',17,'#ff9d7a',700,'center');wt(110,456,'重量剩 1–2 成（典型）',17,'rgba(227,236,238,.85)',500);});
  alphaDo(seg(u,.24,.34),()=>{card(100,500,440,130,{bg:'rgba(242,194,48,.1)',st:'rgba(242,194,48,.5)'});wt(120,540,'同時發電約',18,'rgba(227,236,238,.9)',600);
   wt(120,600,'540',54,'#f2c230',700,'left',COND);wt(240,596,'度（全國平均推算）',18,'#fff',600);});
  alphaDo(seg(u,.3,.38),()=>{wt(100,690,'底渣約占灰渣大宗，',17,'rgba(227,236,238,.85)',500);wt(100,720,'全國每年約 82–85 萬公噸',20,'#7dffc4',700);});
  /* 右：底渣線 */
  card(620,160,920,320,{bg:'rgba(7,27,39,.75)',st:'rgba(125,255,196,.45)'});wt(644,200,'底渣：變成再生粒料',20,'#7dffc4',700);
  const A=[['磁選','回收鐵金屬','#7dc8dc',.28],['篩分','依粒徑分級','#d6b85a',.34],['熟化','穩定性質','#c9a46a',.4],['再生粒料','道路底層、磚品','#7dffc4',.46]];
  A.forEach(([n,d,col,t],i)=>alphaDo(seg(u,t,t+.06),()=>{const x=650+i*222;tag(x+90,290,n,{bg:col,size:18,align:'center'});wt(x+90,330,d,16,'rgba(227,236,238,.85)',500,'center');if(i<3)arrow(x+170,290,x+206,290,'rgba(255,255,255,.6)',3);}));
  alphaDo(seg(u,.5,.58),()=>{box(650,380,720*ease(seg(u,.5,.62)),30,'#7dffc4');wt(650+720+10,404,'再利用率逾 90%',22,'#7dffc4',700,'left',COND);});
  /* 右下：飛灰線 */
  card(620,510,920,290,{bg:'rgba(7,27,39,.75)',st:'rgba(255,157,122,.5)'});wt(644,550,'飛灰：先處理，再決定去向',20,'#ff9d7a',700);
  const B=[['攔下的細粉','含重金屬、鹽類','#ff9d7a',.54],['穩定化／熔融','降低溶出風險','#f2c230',.6],['再利用或掩埋','依法規辦理','#7dc8dc',.66]];
  B.forEach(([n,d,col,t],i)=>alphaDo(seg(u,t,t+.06),()=>{const x=650+i*290;tag(x+110,640,n,{bg:col,size:18,align:'center'});wt(x+110,682,d,16,'rgba(227,236,238,.85)',500,'center');if(i<2)arrow(x+230,640,x+270,640,'rgba(255,255,255,.6)',3);}));
  alphaDo(seg(u,.78,.86),()=>wt(650,760,'再利用比例遠低於底渣，是去化的難題',18,'#fff',600));
 }},

{t:'焚化發電的角色',en:'Where waste-to-energy fits',dur:13,
 d:'焚化發電是垃圾管理的最後關卡，不是第一選擇。優先順序依序是減量、再使用、回收，再來才是焚化，最後才是掩埋。2025 年環境部統計，全國垃圾熱處理設施處理超過 625 萬公噸，全年發電約 34 億度，約可供應 83 萬戶家庭一年用電，平均運轉率超過 85%。垃圾中的紙類、廚餘、木竹屬生物源碳，這部分發電有再生能源的意義；塑膠則含化石碳，燃燒仍會排放二氧化碳，所以源頭減量與分類回收仍是關鍵。',
 s:[[0,'垃圾管理的順序：減量、再使用、回收，最後才焚化'],[.3,'2025 年熱處理垃圾逾 625 萬公噸，發電約 34 億度'],[.58,'紙類、廚餘是生物源碳，塑膠則含化石碳'],[.8,'源頭減量與分類回收，仍是第一道功夫']],
 draw(u){
  diagBG();
  card(60,160,760,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'垃圾管理的優先順序',20,'#f2c230',700);
  const L=[['減量','源頭少用、少丟','#7dffc4'],['再使用','維修、重複使用','#7dffc4'],['回收','分類回收再製','#7dc8dc'],['焚化發電','回收能源，減量約九成體積','#f2c230'],['掩埋','最後的處置','#ff9d7a']];
  L.forEach(([n,d,col],i)=>{const a=seg(u,.04+i*.07,.1+i*.07),w=640-i*80,x=110+i*40,y=250+i*104;
   alphaDo(a,()=>{box(x,y,w,86,col==='#f2c230'?'rgba(242,194,48,.22)':'rgba(255,255,255,.06)',col,col==='#f2c230'?3:1.5);tag(x+70,y+30,n,{bg:col,size:20,align:'center'});wt(x+20,y+72,d,17,'rgba(227,236,238,.9)',500);
    if(i===3)alphaDo(.5+.5*Math.sin(TT*3),()=>ring(x+w-30,y+43,10,'#f2c230',3));});});
  alphaDo(seg(u,.42,.5),()=>{arrow(78,260,78,740,'rgba(255,255,255,.4)',3);wt(70,790,'優先',16,'#7dffc4',700);});
  /* 右：數據與碳 */
  const S=[['625 萬＋','公噸','熱處理垃圾量',.28,'#f2c230'],['34 億','度','全年發電量',.34,'#7dffc4'],['83 萬','戶','約可供應的家庭用電',.4,'#7dc8dc']];
  S.forEach(([v,un,d,t,col],i)=>alphaDo(seg(u,t,t+.06),()=>{const x=860+i*232;card(x,160,216,200,{bg:'rgba(7,27,39,.75)',st:col+'88'});wt(x+108,250,v,i?44:38,col,700,'center',COND);wt(x+108,284,un,18,'#fff',700,'center');wt(x+108,330,d,15,'rgba(227,236,238,.85)',500,'center');}));
  alphaDo(seg(u,.44,.5),()=>wt(860,396,'2025 年全國統計（環境部）；平均運轉率逾 85%',16,'rgba(227,236,238,.85)',500));
  card(860,420,680,380,{bg:'rgba(7,27,39,.75)',st:'rgba(125,255,196,.45)'});wt(884,460,'垃圾裡的碳，有兩種來源',20,'#7dffc4',700);
  alphaDo(seg(u,.54,.62),()=>{card(884,490,300,190,{bg:'rgba(125,255,196,.1)',st:'rgba(125,255,196,.5)'});wt(1034,530,'生物源碳',22,'#7dffc4',800,'center');
   wt(1034,572,'紙類、廚餘、木竹',18,'#fff',600,'center');wt(1034,606,'來自植物，可再生長',16,'rgba(227,236,238,.85)',500,'center');wt(1034,650,'發電有再生能源意義',16,'#7dffc4',700,'center');});
  alphaDo(seg(u,.6,.68),()=>{card(1210,490,300,190,{bg:'rgba(255,157,122,.1)',st:'rgba(255,157,122,.5)'});wt(1360,530,'化石碳',22,'#ff9d7a',800,'center');
   wt(1360,572,'塑膠、橡膠、合成纖維',18,'#fff',600,'center');wt(1360,606,'來自石化原料',16,'rgba(227,236,238,.85)',500,'center');wt(1360,650,'燃燒仍排放 CO₂',16,'#ff9d7a',700,'center');});
  alphaDo(seg(u,.8,.88),()=>wt(884,740,'減少塑膠與一次性用品，比提高燃燒效率更有效',18,'#fff',600));
 }}
]};
