// KITS: land
/* 太陽光電系列 第 3 集：屋頂型太陽光電安裝 */
const BX0=360,BX1=1180,RH=330,RL=372;                    // 廠房：單斜屋頂，左高右低
const roofY=x=>lerp(RH,RL,(x-BX0)/(BX1-BX0));
const SK0=744,SK1=816;                                   // 採光罩範圍
const MX=[420,500,580,660,824,904,984,1064],ML=76;       // 模組（側視沿坡長度）
const gyy=x=>groundY(x);
const E_Y='#f2c230',E_G='#7dffc4';
function rack(x){box(x-3,roofY(x)-9,6,9,'#8d989f');box(x-7,roofY(x)-14,14,5,'#c9d1d6');}
function pvMod(x0){const x1=x0+ML,y0=roofY(x0)-15,y1=roofY(x1)-15;poly([x0,y0,x1,y1,x1,y1-6,x0,y0-6],'#1f3f66','rgba(0,0,0,.4)',1);ln([x0,y0-6,x1,y1-6],'#9fc3e6',1.5);box(x0-1,y0-7,3,8,'#aab5bc');box(x1-2,y1-7,3,8,'#aab5bc');}
function modRack(i,a){alphaDo(a,()=>{rack(MX[i]+18);rack(MX[i]+58);});}
function ropeY(x){return roofY(x)-58;}
function lifeline(a){alphaDo(a,()=>{[440,1100].forEach(x=>{ln([x,roofY(x),x,ropeY(x)],'#394650',4);circ(x,ropeY(x),4,'#e8572a');});ln([440,ropeY(440),1100,ropeY(1100)],'#e8572a',2);});}
function boards(a){alphaDo(a,()=>{const x0=SK0-46,x1=SK1+46;poly([x0,roofY(x0)-3,x1,roofY(x1)-3,x1,roofY(x1)-9,x0,roofY(x0)-9],'#b07a45','rgba(0,0,0,.35)',1);for(let x=x0+16;x<x1;x+=16)ln([x,roofY(x)-3,x,roofY(x)-9],'rgba(0,0,0,.3)',1);});}
function worker(x,col,clip){const s=4.4,y=roofY(x)-1;person(x,y,col,s);if(clip)ln([x+2,y-5*s,x+18,ropeY(x+18)],'rgba(242,194,48,.95)',1.6);}
function guard(a){alphaDo(a,()=>{[[BX0-18,BX0+30],[BX1-30,BX1+18]].forEach(([x0,x1])=>{for(let x=x0;x<=x1;x+=24)ln([x,roofY(x)-2,x,roofY(x)-40],'#f2c230',3);ln([x0,roofY(x0)-40,x1,roofY(x1)-40],'#f2c230',3);ln([x0,roofY(x0)-20,x1,roofY(x1)-20],'#f2c230',2);});});}
/* 廠房側視（山牆面剖切，可看到屋架與桁條） */
function building(o){o=o||{};
 const b0=gyy(BX0)+4,b1=gyy(BX1)+4;
 poly([BX0,roofY(BX0)+24,BX1,roofY(BX1)+24,BX1,b1,BX0,b0],'#cfd8dc','rgba(0,0,0,.25)',1);
 ctx.strokeStyle='rgba(0,0,0,.07)';ctx.lineWidth=1;ctx.beginPath();for(let x=BX0+20;x<BX1;x+=20){ctx.moveTo(x,roofY(x)+26);ctx.lineTo(x,gyy(x)+2);}ctx.stroke();
 box(500,gyy(560)-170,150,170,'#9aa7b0','rgba(0,0,0,.3)',1);for(let y=gyy(560)-160;y<gyy(560);y+=14)ln([502,y,648,y],'rgba(0,0,0,.18)',1);
 for(let i=0;i<5;i++)box(740+i*80,450,56,30,'#7fa6bd','rgba(0,0,0,.3)',1);
 if(o.cut){const x0=SK0-40,x1=SK1+40;poly([x0,roofY(x0)+24,x1,roofY(x1)+24,x1,roofY(x1)+110,x0,roofY(x0)+110],"#3e4c56");
  if(o.net){const a=o.net;alphaDo(a,()=>{ctx.strokeStyle='rgba(125,255,196,.85)';ctx.lineWidth=1.2;ctx.beginPath();for(let x=x0+8;x<=x1-8;x+=10){ctx.moveTo(x,roofY(x)+62);ctx.lineTo(x,roofY(x)+70);}ctx.moveTo(x0+8,roofY(x0+8)+62);ctx.lineTo(x1-8,roofY(x1-8)+62);ctx.moveTo(x0+8,roofY(x0+8)+70);ctx.lineTo(x1-8,roofY(x1-8)+70);ctx.stroke();});}}
 poly([BX0-20,roofY(BX0-20)+14,BX1+20,roofY(BX1+20)+14,BX1+20,roofY(BX1+20)+24,BX0-20,roofY(BX0-20)+24],'#5b6770');
 for(let x=BX0+10;x<BX1;x+=54)box(x-4,roofY(x)+3,8,11,'#8d989f','rgba(0,0,0,.35)',1);
 ctx.lineCap='butt';ln([BX0-24,roofY(BX0-24),SK0,roofY(SK0)],'#b8c4ca',6);ln([SK1,roofY(SK1),BX1+24,roofY(BX1+24)],'#b8c4ca',6);
 ln([SK0,roofY(SK0),SK1,roofY(SK1)],'rgba(236,248,252,.85)',6);
 for(let x=BX0-14;x<BX1+20;x+=18)if(x<SK0||x>SK1)ln([x,roofY(x)-3,x,roofY(x)+3],'rgba(0,0,0,.18)',1);
 if(o.rust)alphaDo(o.rust,()=>{const r=rng(5);for(let i=0;i<9;i++){const x=980+r()*180;circ(x,roofY(x)-1,2+r()*3,'rgba(200,90,40,.85)');}});
}
function craneTruck(hx,hy){const tx=1460;truck(tx,gyy(tx),true,'#e9b21f');return crane(1410,gyy(1410)-40,490,hx,hy,{col:'#e9b21f'});}
function pallet(hx,hy,n,a){alphaDo(a,()=>{box(hx-40,hy+50,80,10,'#a7825a');for(let i=0;i<n;i++)box(hx-38,hy+46-i*4,76,4,i%2?'#1f3f66':'#27507e');});}
/* 沿折線取比例 f 的點 */
function partialPt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
 let r=f*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,sp,col,a,r){if(a<=0)return;for(let k=0;k<n;k++){const f=(TT*sp+k/n)%1,p=partialPt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4,col));}}

const EP={no:3,slug:'solar-pv',seriesName:'太陽光電系列',t:'屋頂型太陽光電安裝',en:'Installing rooftop solar',
lede:'工廠、倉庫與住家的屋頂，是台灣最常見的光電場址。這一集跟著一座鐵皮廠房屋頂，看安裝前如何勘查結構、兩種屋頂怎麼固定又不漏水、高處作業如何防墜、颱風的上掀力有多大，最後把電接上台電的低壓線路。',
facts:[['4.5','m','屋頂光電設施高度在此以內，經技師出具結構安全證明，可免請雜項執照'],
['30','cm','易踏穿屋頂上的踏板最小寬度，下方另須裝設安全網或堅固格柵'],
['2','m','高度 2 公尺以上屬高處作業，須有防墜措施，遇強風大雨應停止作業'],
['5,400','Pa','新建建築物光電設置標準要求的模組耐風荷重規格'],
['100','kW','裝置容量未滿此值，可併接台電低壓系統（220／380 V）'],
['約 15','kg/m²','模組加支架增加的屋頂載重（示例），安裝前須經結構檢核']],
note:'說明：本集為教育用途示意動畫，廠房、模組與人物比例經過調整。免請雜項執照與結構簽證條件依「設置再生能源設施免請領雜項執照標準」，踏板與防墜規定依「職業安全衛生設施規則」，低壓併聯容量依台電「再生能源發電系統併聯技術要點」，模組耐風荷重 5,400 Pa 依內政部「建築物設置太陽光電發電設備標準」。99 kWp 廠房、屋頂載重、年發電量與風壓計算皆為典型範例（風壓未乘風壓係數），實際設計以結構技師計算與各廠牌規格為準。',
base:()=>{landSky(GY,{clouds:false});drawGround();},
shots:[
{t:'先勘查屋頂',en:'Surveying the roof',dur:13,side:true,
 d:'屋頂型光電的第一步不是搬模組，而是確認屋頂撐得住、用得久。技師會檢查屋齡與鋼構鏽蝕、桁條間距、採光罩位置與遮蔭，再依可用面積排列模組。模組加支架約讓屋頂每平方公尺多出 15 公斤左右的載重，須經結構檢核。依規定，屋頂光電設施高度在 4.5 公尺以內，由建築師或土木、結構技師出具結構安全證明，可免請雜項執照；超過 3 公尺等情形需另附結構計算。',
 s:[[0,'一座鐵皮廠房，準備在屋頂設置太陽光電'],[.25,'打開剖面：屋架上的桁條撐起金屬浪板'],[.45,'檢查鏽蝕與採光罩位置，避開易踏穿處'],[.7,'排列模組，並檢核增加的屋頂載重']],
 cam:u=>{const A={x:800,y:450,s:1},B={x:780,y:380,s:1.7},C={x:790,y:400,s:1.3};return u<.5?camMix(A,B,ease(seg(u,.15,.35))):camMix(B,C,ease(seg(u,.55,.68)));},
 draw(u){
  building({rust:seg(u,.42,.5)});boards(1);
  const px=lerp(470,690,ease(seg(u,.08,.6)));worker(px,'#1f7f99');box(px+5,roofY(px)-34,8,10,'#2b3137');
  alphaDo(seg(u,.58,.66),()=>{ctx.setLineDash([6,5]);MX.forEach(x0=>{const x1=x0+ML;poly([x0,roofY(x0)-9,x1,roofY(x1)-9,x1,roofY(x1)-17,x0,roofY(x0)-17],'rgba(242,194,48,.18)','#f2c230',1.5);});ctx.setLineDash([]);});
  const la=seg(u,.74,.82);if(la>0)for(let i=0;i<7;i++){const x=440+i*110,dy=6*Math.sin(TT*3+i);alphaDo(la,()=>arrow(x,roofY(x)-80+dy,x,roofY(x)-26+dy,'#f2c230',3));}
  lab(300,roofY(300)+10,'金屬浪板屋頂',{dx:-30,dy:-80,a:band(u,.04,.3)});
  lab(630,roofY(630)+8,'桁條（C 型鋼）',{dx:-60,dy:70,st:'l',a:band(u,.22,.52)});
  lab(470,roofY(470)+19,'屋架',{dx:-40,dy:60,st:'l',a:band(u,.26,.52),minor:true});
  lab((SK0+SK1)/2,roofY(780),'採光罩',{dx:20,dy:-70,st:'w',a:band(u,.36,.62)});
  lab(1070,roofY(1070),'鏽蝕檢查',{dx:30,dy:-60,st:'w',a:band(u,.44,.66)});
  lab(620,roofY(620)-18,'模組排列（規劃）',{dx:-30,dy:-80,st:'s',a:band(u,.62,.8)});
  lab(990,roofY(990)-60,'增加載重約 15 kg/m²',{dx:40,dy:-60,st:'s',a:band(u,.78,1)});
 },
 hud(u){hudPanel(250,150,'屋頂勘查（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.55,.8));
  hrow(56,'可用面積',Math.round(600*k)+' m²',w,'#fff');hrow(88,'預估容量',Math.round(99*k)+' kWp',w,'#f2c230');hrow(120,'增加載重','約 15 kg/m²',w,'#7dffc4');});}},

{t:'兩種屋頂，兩種固定',en:'Mounting on two roof types',dur:13,
 d:'固定支架的原則是「抓得牢、不漏水」。鋼筋混凝土平屋頂常用混凝土基座，以化學錨栓或植筋固定在樓板上，鑽孔處要重新施作防水並包覆基座；也有不鑽孔、靠重量壓住的配重式基座，但須檢核屋頂承重。金屬浪板屋頂則用專用夾具夾住浪板的肋，不必穿孔；若必須鎖螺絲，要鎖進下方桁條，並加上防水墊圈與矽利康。屋齡較久的鐵皮屋頂，常先加蓋一層新浪板再裝支架。',
 s:[[0,'RC 屋頂：基座以化學錨栓固定在樓板上'],[.24,'鑽孔處重新做防水，包覆整個基座'],[.45,'金屬屋頂：夾具夾住浪板的肋，不必穿孔'],[.72,'若要鎖螺絲，必須鎖進桁條並加防水墊圈']],
 draw(u){
  diagBG();
  card(60,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'鋼筋混凝土（RC）平屋頂',20,'#f2c230',700);
  const a0=seg(u,.02,.1);
  alphaDo(a0,()=>{box(100,560,640,80,'#8f989c');const r=rng(3);for(let i=0;i<40;i++)circ(110+r()*620,570+r()*62,1.5+r()*2,'rgba(0,0,0,.18)');
   box(100,548,640,12,'#2b3137');wt(110,668,'RC 樓板',16,'rgba(227,236,238,.8)',600);wt(740,668,'原有防水層',16,'rgba(227,236,238,.8)',600,'right');});
  const PD=[[250,330],[520,600]];
  const dr=seg(u,.1,.22);
  PD.forEach(([x0,x1])=>{alphaDo(seg(u,.08,.14),()=>{box(x0,478,x1-x0,70,'#c9ccc7','rgba(0,0,0,.3)',1);});
   const bl=62*dr;[x0+18,x1-18].forEach(x=>{if(bl>0){ln([x,500,x,500+bl],'#394650',4);}});});
  alphaDo(band(u,.12,.3),()=>{tag(430,610,'化學錨栓',{size:16,align:'center'});});
  const wp=seg(u,.24,.34);
  alphaDo(wp,()=>{PD.forEach(([x0,x1])=>{ctx.strokeStyle='#7dffc4';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x0-24,550);ctx.lineTo(x0-4,550);ctx.lineTo(x0-4,470);ctx.lineTo(x1+4,470);ctx.lineTo(x1+4,550);ctx.lineTo(x1+24,550);ctx.stroke();});
   wt(84,262,'鑽孔處重做防水',17,'#7dffc4',700);wt(84,290,'塗層包覆基座',17,'#7dffc4',700);});
  const st=seg(u,.3,.4);
  alphaDo(st,()=>{ln([290,478,290,408],'#aab5bc',8);ln([560,478,560,340],'#aab5bc',8);ln([290,408,560,340],'#aab5bc',4);
   ctx.save();ctx.translate(425,374);ctx.rotate(Math.atan2(-68,270));box(-190,-18,380,12,'#1f3f66','rgba(0,0,0,.4)',1);box(-190,-18,380,2,'#9fc3e6');ctx.restore();
   wt(600,330,'傾斜支架',16,'#fff',600);});
  alphaDo(seg(u,.36,.44),()=>{wt(84,712,'基座以化學錨栓或植筋固定',17,'#fff',500);wt(84,746,'或用配重基座不鑽孔，但須檢核承重',17,'rgba(227,236,238,.85)',500);});
  /* 右：金屬浪板 */
  card(820,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(844,200,'金屬浪板屋頂',20,'#f2c230',700);
  const RB=[930,1060,1190,1320,1450],SY=520,TY=478;
  const P=[860,SY];RB.forEach(x=>P.push(x-32,SY,x-14,TY,x+14,TY,x+32,SY));P.push(1500,SY);
  alphaDo(seg(u,.4,.46),()=>{box(860,SY+8,640,22,'#8d989f','rgba(0,0,0,.35)',1);wt(1500,SY+58,'桁條',16,'rgba(227,236,238,.8)',600,'right');
   poly(P.concat([1500,SY+8,860,SY+8]),'#b8c4ca','rgba(0,0,0,.4)',1.2);wt(870,SY+58,'浪板的肋',16,'rgba(227,236,238,.8)',600);});
  const cl=ease(seg(u,.46,.58));
  [1060,1320].forEach(x=>{if(cl<=0)return;const dy=lerp(-90,0,cl);alphaDo(cl,()=>{poly([x-24,TY-4+dy,x+24,TY-4+dy,x+24,TY+18+dy,x+17,TY+18+dy,x+13,TY+4+dy,x-13,TY+4+dy,x-17,TY+18+dy,x-24,TY+18+dy],'#dfe5e8','rgba(0,0,0,.5)',1.2);});});
  alphaDo(seg(u,.54,.6),()=>{box(900,TY-24,560,20,'#c9d1d6','rgba(0,0,0,.35)',1);});
  alphaDo(seg(u,.58,.64),()=>{box(890,TY-44,580,14,'#1f3f66','rgba(0,0,0,.4)',1);box(890,TY-44,580,2,'#9fc3e6');});
  alphaDo(band(u,.48,.66),()=>tag(1190,TY-90,'夾具夾住肋，不穿孔',{size:17,align:'center',bg:'#7dffc4'}));
  const wd=seg(u,.6,.7);if(wd>0)for(let k=0;k<6;k++){const f=(TT*.7+k/6)%1,x=880+k*103;alphaDo(wd*clamp((1-f)*3),()=>{const y=lerp(TY-44-90,SY-6,Math.min(1,f*1.6));circ(x+30,y,4,'#58b8d0');});}
  alphaDo(seg(u,.72,.8),()=>{card(850,600,660,90,{bg:'rgba(232,87,42,.12)',st:'rgba(232,87,42,.5)'});
   ln([905,615,905,660],'#dfe5e8',4);box(893,650,24,6,'#2b3137');circ(905,610,9,'#aab5bc');
   wt(940,636,'必須鎖螺絲時：鎖進桁條',17,'#fff',700);wt(940,666,'加防水墊圈與矽利康',17,'rgba(227,236,238,.85)',500);});
  alphaDo(seg(u,.82,.9),()=>{wt(844,730,'老舊鐵皮屋頂常先加蓋新浪板',17,'#fff',500);wt(844,762,'再裝支架，一併更新防水',17,'rgba(227,236,238,.85)',500);});
 }},

{t:'高處作業先防墜',en:'Fall protection comes first',dur:13,side:true,
 d:'屋頂作業最大的風險是墜落，尤其是踏穿採光罩或老舊浪板。依職業安全衛生設施規則，在易踏穿材料構築的屋頂上作業，要在屋架上設置寬度 30 公分以上的踏板、在下方可能墜落的範圍裝設安全網或堅固格柵，並指定屋頂作業主管監督。作業人員穿著安全帶，掛在屋脊方向拉設的安全母索上；屋簷邊緣設置護欄。高度 2 公尺以上遇強風、大雨，應停止作業。',
 s:[[0,'採光罩與老舊浪板一踩就破，是最常見的墜落點'],[.3,'在屋架上鋪設寬 30 公分以上的踏板'],[.42,'採光罩下方裝設安全網'],[.58,'人員的安全帶掛在安全母索上'],[.8,'屋簷邊緣加裝護欄，強風大雨時停工']],
 cam:u=>camMix({x:780,y:370,s:2.3},{x:790,y:390,s:1.35},ease(seg(u,.74,.86))),
 draw(u){
  building({cut:true,net:seg(u,.42,.5)});
  const bd=seg(u,.3,.38);boards(bd);
  lifeline(seg(u,.56,.64));
  const clip=u>.62;
  worker(640,'#1f7f99',clip);worker(lerp(880,930,seg(u,.62,.8)),'#e8572a',clip);
  const g=seg(u,.06,.3);
  if(g>0&&u<.32){const f=easeIn(seg(u,.14,.28)),x=780,y=roofY(x)-1+f*115;
   alphaDo(clamp(1-seg(u,.28,.32))*.85,()=>{ctx.setLineDash([4,4]);ctx.strokeStyle='#e8572a';ctx.lineWidth=2;ctx.strokeRect(x-9,y-48,18,48);ctx.setLineDash([]);
    if(f>0){ln([760,roofY(760),772,roofY(772)+10,784,roofY(784)-2,796,roofY(796)+12],'#e8572a',2);}
    ln([x-12,roofY(x)-70,x+12,roofY(x)-50],'#e8572a',3);ln([x+12,roofY(x)-70,x-12,roofY(x)-50],'#e8572a',3);});}
  guard(seg(u,.8,.88));
  lab(780,roofY(780),'採光罩：易踏穿',{dx:40,dy:-80,st:'w',a:band(u,.04,.32)});
  lab(700,roofY(700)-6,'踏板（寬 30 cm 以上）',{dx:-40,dy:-90,st:'s',a:band(u,.34,.62)});
  lab(820,roofY(820)+66,'安全網',{dx:60,dy:40,st:'g',a:band(u,.44,.72)});
  lab(560,ropeY(560),'安全母索',{dx:-40,dy:-50,st:'g',a:band(u,.58,.84)});
  lab(652,roofY(652)-30,'安全帶',{dx:40,dy:70,a:band(u,.62,.84),minor:true});
  lab(BX1,roofY(BX1)-40,'屋簷護欄',{dx:30,dy:-60,st:'s',a:band(u,.84,1)});
 },
 hud(u){hudPanel(250,150,'作業條件（示例）',seg(u,.05,.1),w=>{hrow(56,'作業高度','約 8 m',w,'#fff');hrow(88,'平均風速','4 m/s',w,'#7dffc4');
  hrow(120,'判定',u>.62?'可作業（已掛安全帶）':'準備中',w,u>.62?'#7dffc4':'#f2c230');});}},

{t:'吊運模組與安裝支架',en:'Lifting and mounting',dur:13,side:true,
 d:'模組以棧板成疊吊上屋頂，放在結構較強的位置，避免集中壓在單一浪板上。安裝順序是先在浪板的肋上鎖夾具，架上鋁合金導軌，再把模組一片片放上，以中壓塊與邊壓塊夾住鋁框固定。模組之間與屋頂邊緣要保留維修走道與散熱空間。一座約 99 kWp 的廠房屋頂，大約需要 171 片 580 W 模組，熟練的工班通常幾天內可以完成安裝。',
 s:[[0,'吊車把一疊模組吊上屋頂'],[.3,'在浪板的肋上鎖夾具，架上導軌'],[.5,'模組一片片放上，以壓塊夾住鋁框'],[.78,'保留維修走道，依序完成整面屋頂']],
 cam:u=>camMix({x:820,y:420,s:1.05},{x:770,y:380,s:1.5},ease(seg(u,.36,.5))),
 draw(u){
  building();boards(1);lifeline(1);
  const LX=1110,land=roofY(LX)-62,pick=gyy(1270)-60;
  const h=kf(u,[[0,1270,pick],[.08,1270,pick],[.18,1270,220],[.27,LX,220],[.34,LX,land],[.38,LX,land],[.46,1230,200],[1,1230,200]]);
  const onRoof=u>=.36,prog=seg(u,.46,.92),n=Math.round(8*prog);
  const pa=1-seg(u,.9,.96);
  if(!onRoof){const t=craneTruck(h.x,h.y);slings(t.x,t.hy,[h.x-38,h.y+46,h.x+38,h.y+46]);pallet(h.x,h.y,10,1);}
  else{craneTruck(h.x,h.y);pallet(LX,land,Math.max(1,10-Math.round(10*prog)),pa);}
  for(let i=0;i<8;i++){const ra=seg(u,.36+i*.03,.4+i*.03);modRack(i,ra);}
  for(let i=0;i<8;i++){const k=clamp(8*prog-i);if(k>0)alphaDo(k,()=>{ctx.save();ctx.translate(0,-18*(1-k));pvMod(MX[i]);ctx.restore();});}
  const fx=MX[Math.min(7,n)]+ML/2;
  worker(u<.36?560:fx-40,'#1f7f99',true);worker(u<.36?900:fx+50,'#e8572a',true);worker(1040,'#e9b21f',true);
  lab(1270,Math.min(h.y+60,pick+50),'吊車吊運模組',{dx:40,dy:-70,st:'s',a:band(u,.03,.3)});
  lab(MX[1]+18,roofY(MX[1]+18)-12,'夾具與導軌',{dx:-50,dy:-80,a:band(u,.38,.58)});
  lab(MX[3]+ML,roofY(MX[3]+ML)-20,'壓塊夾住鋁框',{dx:-30,dy:-90,st:'l',a:band(u,.58,.8)});
  lab((SK0+SK1)/2,roofY(780)-10,'避開採光罩，保留走道',{dx:40,dy:-90,st:'g',a:band(u,.78,1)});
 },
 hud(u){hudPanel(250,120,'安裝進度（示例）',seg(u,.05,.1),w=>{const p=seg(u,.46,.92),n=Math.round(171*p);
  hrow(56,'已安裝',trf('{n} ／ 171 片',{n}),w,'#f2c230');hrow(88,'裝置容量',(n*.58).toFixed(1)+' kWp',w,'#7dffc4');});}},

{t:'颱風的上掀力',en:'Typhoon uplift',dur:13,
 d:'風吹過屋頂時，氣流在屋簷處分離，屋頂上方形成負壓，把模組往上「吸」，這就是上掀力。吸力在屋頂的角隅與邊緣最大，中央較小，所以設計時邊角區的固定點要加密。風壓與風速平方成正比：以 17 級陣風上限每秒 61.2 公尺估算，風速壓約 2,250 帕，一片約 2.6 平方公尺的模組就要承受近 6 千牛頓的力，相當於約 590 公斤重。內政部新建建築物光電設置標準要求模組耐風荷重達 5,400 帕以上。',
 s:[[0,'氣流在屋簷分離，屋頂上方形成負壓'],[.25,'角隅與邊緣的吸力最大，固定點要加密'],[.45,'風壓與風速的平方成正比'],[.72,'17 級陣風下，一片模組承受約 590 公斤的上掀力']],
 draw(u){
  diagBG();
  card(60,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'側視：屋頂上方的負壓',20,'#f2c230',700);
  const a0=seg(u,.02,.08);
  alphaDo(a0,()=>{box(170,340,360,120,'#5b6770');box(170,334,360,6,'#b8c4ca');for(let i=0;i<5;i++)box(190+i*68,318,60,8,'#1f3f66');});
  for(let j=0;j<5;j++){const y=260+j*40;for(let k=0;k<2;k++){const f=(TT*.6+k/2+j*.13)%1,x=80+f*80;alphaDo(a0*.9,()=>arrow(x,y,x+34,y,'#7dc8dc',2.5));}}
  const sl=seg(u,.06,.2);
  alphaDo(sl,()=>{ctx.strokeStyle='rgba(125,200,220,.7)';ctx.lineWidth=2;for(let j=0;j<3;j++){ctx.beginPath();ctx.moveTo(90,300-j*26);ctx.bezierCurveTo(160,300-j*26,190,250-j*30,300,256-j*26);ctx.lineTo(740,280-j*22);ctx.stroke();}
   ctx.setLineDash([5,5]);ctx.beginPath();ctx.ellipse(270,316,100,20,0,0,TAU);ctx.strokeStyle='rgba(232,87,42,.8)';ctx.stroke();ctx.setLineDash([]);});
  const up=seg(u,.12,.26);
  for(let i=0;i<7;i++){const x=190+i*54,L=lerp(70,22,i/6)*up,dy=4*Math.sin(TT*4+i);if(L>2)arrow(x,314+dy,x,314-L+dy,'#e8572a',3);}
  alphaDo(seg(u,.16,.24),()=>{wt(560,300,'前緣吸力最大',16,'#ffb199',700);});
  const pz=seg(u,.26,.4);
  alphaDo(pz,()=>{wt(84,520,'俯視：屋頂風壓分區',20,'#f2c230',700);const X0=110,Y0=545,Wd=340,Ht=220,e=38,c=64;
   box(X0,Y0,Wd,Ht,'rgba(88,184,208,.3)','rgba(255,255,255,.5)',1.5);
   ctx.fillStyle='rgba(255,138,96,.55)';ctx.fillRect(X0,Y0,Wd,e);ctx.fillRect(X0,Y0+Ht-e,Wd,e);ctx.fillRect(X0,Y0,e,Ht);ctx.fillRect(X0+Wd-e,Y0,e,Ht);
   [[X0,Y0],[X0+Wd-c,Y0],[X0,Y0+Ht-c],[X0+Wd-c,Y0+Ht-c]].forEach(([x,y])=>box(x,y,c,c,'#e8572a'));
   box(480,578,22,22,'#e8572a');wt(514,596,'角隅區：吸力最大',17,'#fff',600);
   box(480,628,22,22,'rgba(255,138,96,.75)');wt(514,646,'邊緣區：次之',17,'#fff',600);
   box(480,678,22,22,'rgba(88,184,208,.6)');wt(514,696,'中央區：較小',17,'#fff',600);
   wt(480,748,'邊角區固定點加密',17,'#7dffc4',700);});
  /* 右：風速壓 */
  const C=chartBox(820,160,720,410,{title:'風速壓 q ＝ ½ ρ V²',x0:0,x1:70,y0:0,y1:3000,xt:[0,10,20,30,40,50,60,70],yt:[0,1000,2000,3000],xl:'風速（m/s）',yl:'風速壓（Pa）',pt:70,pb:50,pl:70,gx:7,gy:3});
  const q=V=>.6*V*V,f1=seg(u,.44,.64);
  if(f1>0){ctx.beginPath();for(let V=0;V<=70*f1;V+=.5){const x=C.X(V),y=C.Y(q(V));V?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#58b8d0';ctx.lineWidth=3.5;ctx.stroke();}
  alphaDo(seg(u,.5,.58),()=>{const V=28.4;circ(C.X(V),C.Y(q(V)),6,'#fff');wt(C.X(V)+10,C.Y(q(V))-12,'10 級上限 28.4 m/s',16,'rgba(227,236,238,.9)',600);});
  const m=seg(u,.62,.7);
  alphaDo(m,()=>{const V=61.2,Q=q(V);ctx.setLineDash([6,5]);ln([C.X(V),C.Y(0),C.X(V),C.Y(Q)],'#f2c230',2);ln([C.X(0),C.Y(Q),C.X(V),C.Y(Q)],'#f2c230',2);ctx.setLineDash([]);
   circ(C.X(V),C.Y(Q),8,'#f2c230');wt(C.X(V)-14,C.Y(Q)+32,'17 級陣風 61.2 m/s',17,'#f2c230',700,'right');wt(C.X(0)+12,C.Y(Q)-10,'約 2,250 Pa',18,'#f2c230',700,'left',COND);});
  const r=seg(u,.72,.8);
  alphaDo(r,()=>{card(820,600,720,200,{bg:'rgba(232,87,42,.14)',st:'rgba(232,87,42,.5)'});
   wt(846,640,'一片模組的上掀力（示例）',19,'#f2c230',700);
   wt(846,684,'2,250 Pa × 2.6 m² ≈ 5.8 kN',26,'#fff',700,'left',COND);
   wt(1514,684,'約 590 kgf',26,'#ff9d7a',700,'right',COND);
   wt(846,724,'角隅區再乘上較大的風壓係數，實際更大',16,'rgba(227,236,238,.85)',500);
   wt(846,762,'新建物標準：模組耐風荷重 5,400 Pa 以上',17,'#7dffc4',700);});
 }},

{t:'接上台電低壓線路',en:'Connecting to the low-voltage grid',dur:13,
 d:'模組串列輸出直流電，經直流開關進入變流器，轉成與市電同步的交流電，再經交流斷路器與台電的售電電表送上電網。依台電併聯技術要點，裝置容量未滿 100 瓩，可併接 110／220 伏或 220／380 伏的低壓系統；全額售電時，售電電表與原本的用電電表分開計量。變流器必須具備防止單獨運轉（防孤島）的保護：電網停電時會自動停止送電，保護搶修人員。模組框架與支架也要確實接地，並加裝突波保護器。',
 s:[[0,'模組串列輸出直流電，經直流開關進入變流器'],[.25,'變流器轉成交流電，經售電電表送上台電線路'],[.45,'未滿 100 kW 的案場可併接低壓系統'],[.62,'電網停電時，變流器自動停止送電（防孤島）'],[.86,'支架接地並加裝突波保護器']],
 draw(u){
  diagBG();
  wt(460,212,'單線圖（全額售電，示意）',20,'#f2c230',700);
  const Y=330,BXS=[[80,270,'模組串列',E_Y],[320,470,'直流開關',E_Y],[530,730,'變流器','#fff'],[790,950,'交流斷路器',E_G],[1010,1190,'售電電表',E_G],[1250,1520,'台電低壓線路',E_G]];
  const isl=seg(u,.62,.66)*(1-seg(u,.84,.88));
  const lit=i=>seg(u,.03+i*.05,.08+i*.05);
  ln([270,Y,320,Y],'#f2c230',4*lit(1));ln([470,Y,530,Y],'#f2c230',4*lit(2));ln([730,Y,790,Y],'#7dffc4',4*lit(3));ln([950,Y,1010,Y],'#7dffc4',4*lit(4));ln([1190,Y,1250,Y],isl>.5?'#e8572a':'#7dffc4',4*lit(5));
  BXS.forEach(([x0,x1,n,c],i)=>{const k=lit(i);if(k<=0)return;alphaDo(k,()=>{card(x0,Y-56,x1-x0,112,{bg:'rgba(7,27,39,.9)',st:c});wt((x0+x1)/2,Y+90,n,18,c,700,'center');
   const cx=(x0+x1)/2;
   if(i===0){for(let j=0;j<3;j++)poly([x0+22+j*54,Y+30,x0+62+j*54,Y+30,x0+72+j*54,Y-30,x0+32+j*54,Y-30],'#1f3f66','#9fc3e6',1);}
   if(i===1||i===3){ln([cx-40,Y,cx-14,Y],c,3);ln([cx-14,Y,cx+12,Y-20],c,3);ln([cx+14,Y,cx+40,Y],c,3);circ(cx-14,Y,4,c);circ(cx+14,Y,4,c);}
   if(i===2){ln([x0+20,Y+40,x1-20,Y-40],'rgba(255,255,255,.4)',1.5);wt(x0+50,Y-14,'DC',22,E_Y,700,'center',COND);
    ctx.beginPath();for(let t=0;t<=1;t+=.05){const x=x1-80+t*56,y=Y+22-12*Math.sin(t*TAU);t?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=E_G;ctx.lineWidth=2.5;ctx.stroke();
    if(isl>.5)tag(cx,Y-78,'停止送電',{size:16,align:'center',bg:'#e8572a',fg:'#fff'});}
   if(i===4){circ(cx,Y,34,'#dfe5e8','#394650',2);box(cx-20,Y-8,40,16,'#13232e');wt(cx,Y+6,String(1000+Math.floor(TT*3)%9000).padStart(5,'0'),14,E_G,700,'center',COND);}
   if(i===5){const pc=isl>.5?'rgba(232,87,42,.9)':'#c9d1d6';ln([x0+60,Y+44,x0+60,Y-44],'#8a6a4a',6);ln([x0+36,Y-32,x0+84,Y-32],'#8a6a4a',4);ln([x0+84,Y-30,x1-20,Y-24],pc,2);ln([x0+84,Y-20,x1-20,Y-12],pc,2);ln([x0+84,Y-10,x1-20,Y],pc,2);
    if(isl>.5)wt(x0+130,Y+40,'停電',18,'#ff9d7a',700);else wt(x0+130,Y+40,'220／380 V',18,'#7dffc4',700,'left',COND);}});});
  const fa=seg(u,.3,.36)*(1-isl);
  flowDots([[270,Y],[320,Y]],2,.8,E_Y,fa);flowDots([[470,Y],[530,Y]],2,.8,E_Y,fa);flowDots([[730,Y],[790,Y]],2,.8,E_G,fa);flowDots([[950,Y],[1010,Y]],2,.8,E_G,fa);flowDots([[1190,Y],[1250,Y]],2,.8,E_G,fa);
  alphaDo(seg(u,.3,.36),()=>{wt(400,Y-80,'直流 DC',17,E_Y,700,'center');wt(1100,Y-80,'交流 AC',17,E_G,700,'center');});
  alphaDo(seg(u,.44,.5),()=>{card(60,500,460,290,{bg:'rgba(7,27,39,.75)'});wt(84,540,'低壓併聯',20,'#f2c230',700);
   wt(84,600,'未滿 100 kW',34,'#fff',700,'left',COND);wt(84,644,'可併接台電低壓系統',17,'#fff',500);wt(84,678,'單相 110／220 V',17,'rgba(227,236,238,.85)',500);wt(84,708,'三相 220／380 V',17,'rgba(227,236,238,.85)',500);wt(84,758,'本例 99 kWp：低壓併聯',17,'#7dffc4',700);});
  alphaDo(seg(u,.6,.66),()=>{card(570,500,460,290,{bg:'rgba(7,27,39,.75)',st:isl>.5?'rgba(232,87,42,.7)':undefined});wt(594,540,'防孤島保護',20,'#f2c230',700);
   wt(594,590,'電網停電時',17,'#fff',500);wt(594,624,'變流器偵測到異常',17,'#fff',500);wt(594,658,'在數秒內自動停止送電',17,'#fff',500);wt(594,716,'避免電網停電時仍帶電',17,'#7dffc4',700);wt(594,748,'保護台電搶修人員',17,'#7dffc4',700);});
  alphaDo(seg(u,.84,.9),()=>{card(1080,500,460,290,{bg:'rgba(7,27,39,.75)'});wt(1104,540,'接地與突波保護',20,'#f2c230',700);
   wt(1104,590,'模組鋁框、支架接地',17,'#fff',500);wt(1104,624,'直流與交流側加裝',17,'#fff',500);wt(1104,658,'突波保護器（SPD）',17,'#fff',500);wt(1104,716,'降低雷擊與突波損害',17,'#7dffc4',700);
   const bx=1440;ln([bx,760,bx,700],'#7dffc4',3);ln([bx-24,760,bx+24,760],'#7dffc4',3);ln([bx-16,770,bx+16,770],'#7dffc4',3);ln([bx-8,780,bx+8,780],'#7dffc4',3);});
 }},

{t:'屋頂開始發電',en:'The roof goes live',dur:12,side:true,
 d:'台電完成掛表併聯後，屋頂就成了一座小型電廠。99 kWp 的廠房屋頂，在台灣中南部一年約可發電 12 萬度左右，依地區與方位而異。一般流程是：向台電申請併聯審查、向地方政府申請同意備案、依核定內容施工並完成結構與電氣簽證、與台電簽訂購售電契約並掛表併聯，最後辦理設備登記。之後的維護重點是定期清洗、檢查螺栓與防水，以及颱風前後巡檢。',
 s:[[0,'太陽升起，屋頂的模組開始發電'],[.28,'電流經變流器與售電電表送上台電線路'],[.55,'一年約可發電 12 萬度（示例）'],[.75,'申請、施工到掛表併聯，屋頂成為小型電廠']],
 base:u=>{landSky(GY,{sun:{x:lerp(240,980,u),y:lerp(300,150,Math.sin(u*Math.PI*.55))},clouds:false});drawGround();},
 draw(u){
  building();for(let i=0;i<8;i++){modRack(i,1);pvMod(MX[i]);}
  const PX=1300;ln([PX,gyy(PX),PX,330],'#7a5c40',8);ln([PX-44,350,PX+44,350],'#7a5c40',5);
  [[PX-40,352],[PX,352],[PX+40,352]].forEach(([x,y])=>ln([x,y,1640,y+8],'#394650',1.6));
  box(1060,410,64,62,'#dfe5e8','rgba(0,0,0,.4)',1.2);box(1070,420,26,14,'#13232e');circ(1110,452,4,'#7dffc4');
  box(1100,500,50,50,'#c9d1d6','rgba(0,0,0,.4)',1.2);circ(1125,522,15,'#fff','#394650',1.5);
  const Pd=[[1140,roofY(1140)-18],[1172,roofY(1172)+4],[1172,440],[1124,440]],Pa=[[1092,472],[1092,525],[1100,525]],Pg=[[1150,512],[1225,440],[PX-4,352]];
  ln([1140,roofY(1140)-18,1172,roofY(1172)+4,1172,440,1124,440],'#2b3137',3);ln([1092,472,1092,525,1100,525],'#2b3137',3);ln([1150,512,1225,440,PX-4,352],'#394650',1.8);
  const on=seg(u,.08,.2);flowDots(Pd,6,.5,E_Y,on,4.5);flowDots(Pa,3,.6,E_G,on*seg(u,.25,.32),4.5);flowDots(Pg,6,.5,E_G,on*seg(u,.28,.36),4.5);
  MX.forEach((x0,i)=>alphaDo(on*.6*(.5+.5*Math.sin(TT*2+i)),()=>ln([x0+10,roofY(x0+10)-21,x0+30,roofY(x0+30)-21],'#fff',2)));
  lab(MX[2]+40,roofY(MX[2]+40)-22,trf('{n} 片模組',{n:171}),{dx:-40,dy:-80,st:'s',a:band(u,.04,.3)});
  lab(1092,420,'變流器',{dx:-60,dy:-70,a:band(u,.24,.5)});
  lab(1125,540,'售電電表',{dx:-80,dy:50,st:'g',a:band(u,.3,.56)});
  lab(PX,380,'台電低壓線路',{dx:60,dy:40,st:'l',a:band(u,.36,.62)});
  const fc=seg(u,.72,.78);
  alphaDo(fc,()=>{card(60,640,1480,150,{bg:'rgba(7,27,39,.82)'});wt(84,676,'一般申請流程（簡化）',18,'#f2c230',700);
   const ST=['併聯審查','同意備案','施工與簽證','簽約掛表','設備登記'];
   ST.forEach((n,i)=>{const k=seg(u,.76+i*.035,.8+i*.035),x=90+i*292;alphaDo(.6+.4*k,()=>{tag(x,738,trf('{i}. {s}',{i:i+1,s:tr(n)}),{size:17,bg:k>.5?'#f2c230':'rgba(255,255,255,.25)',fg:k>.5?'#13232e':'#fff'});});
    if(i<4)alphaDo(k,()=>arrow(x+230,738,x+272,738,'rgba(255,255,255,.6)',2));});});
 },
 hud(u){hudPanel(250,150,'發電情形（示例）',seg(u,.05,.1),w=>{const P=99*.78*Math.sin(Math.PI*clamp(.15+u*.7))*seg(u,.08,.2),E=Math.round(99*5.2*seg(u,.08,1));
  hrow(56,'裝置容量','99 kWp',w,'#fff');hrow(88,'即時功率',Math.round(P)+' kW',w,'#f2c230');hrow(120,'今日累計',E+' kWh',w,'#7dffc4');});}}
]};
