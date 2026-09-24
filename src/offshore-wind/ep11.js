// KITS: marine, offshore-seq
/* ================= EP11 風機安裝：葉片 ================= */
const O=(c,p)=>{SC=c;SU=p;};const map=(u,a,b)=>lerp(a,b,u);
function wSide(p){O(10,p);drawOnshore(1);drawHDD(1);drawCables();scWTIV();drawStructures();}
const WIND=[5,4.5,5,6,7.5,9,11,12.5,13,12,10.5,9,8,7,6.5,6,7,8.5,10,11.5,10,8,6.5,5.5];
const EP={no:11,slug:'offshore-wind',seriesName:'離岸風場開發系列',total:13,t:'風機安裝：葉片',en:'Turbine installation: blades',
lede:'一支葉片超過一百公尺長，比足球場還長，卻要在風中被水平吊到 150 公尺高、把根部上百支螺栓插進輪轂。這一集拆解葉片的構造、專用夾具的吊裝技巧，以及為什麼葉片吊裝最怕風。',
facts:[['115','m','15 MW 級葉片長度示例，約一座足球場長'],['60–70','公噸','單支葉片重量，大部分是複合材料'],['10–12','m/s','葉片吊裝的典型風速上限'],['120','°','每裝好一支，輪轂以盤車裝置轉動的角度'],['100+','支','葉根螺栓數量，插入輪轂的變槳軸承'],['約 300','km/h','額定轉速下葉尖的線速度']],
note:'說明：本集為教育用途示意動畫。葉片長度、重量、作業風速上限等為典型範例；實際依機型、吊裝設備與作業程序而定。',
shots:[
{t:'葉片的構造',en:'Anatomy of a blade',dur:14,
 d:'葉片是一根中空的複合材料「長梁」。沿著長度方向，上下各有一條以碳纖維或玻璃纖維疊成的主梁帽，承受彎曲力；中間以剪力腹板連接，像工字梁一樣。外殼是玻璃纖維包夾輕質芯材的三明治結構，兼顧剛性與重量。前緣貼有耐磨保護層，抵抗雨滴高速撞擊；葉尖附近埋有接閃器，雷擊電流沿著內部導線一路導到地。',
 s:[[0,'葉片外型：從圓形葉根漸變成扁平的翼型'],[.2,'主梁帽：碳纖維或玻璃纖維，承受彎曲'],[.38,'剪力腹板：連接上下梁帽，像工字梁'],[.55,'外殼：玻璃纖維包夾輕質芯材的三明治結構'],[.72,'前緣保護層與接閃器：抵抗雨蝕與雷擊']],
 draw(u){
  diagBG();const a=[0,.2,.38,.55,.72].map(t=>seg(u,t,t+.06));
  const bx=120,by=250,L=1360;ctx.beginPath();ctx.moveTo(bx,by-40);for(let i=0;i<=40;i++){const s=i/40;ctx.lineTo(bx+s*L,by-chord(s)*6.5);}for(let i=40;i>=0;i--){const s=i/40;ctx.lineTo(bx+s*L,by+chord(s)*3.5);}ctx.closePath();ctx.fillStyle='#e9ecef';ctx.fill();ctx.strokeStyle='#8a99a3';ctx.lineWidth=2;ctx.stroke();
  wt(bx,by+90,'葉根',18,'#fff',700,'center');wt(bx+L,by+50,'葉尖',18,'#fff',700,'right');ln([bx,by+110,bx+L,by+110],'rgba(242,194,48,.7)',1.6);wt(bx+L/2,by+140,'約 115 m',22,'#f2c230',700,'center',COND);
  const sx=bx+L*.35;ln([sx,by-70,sx,by+40],'#f2c230',2);wt(sx+10,by-76,'剖面位置',16,'#f2c230',600);
  alphaDo(a[4],()=>{for(const s of [.93,.99]){circ(bx+L*s,by-chord(s)*1.2,6,'#e8572a');}ctx.setLineDash([6,5]);ln([bx+30,by,bx+L*.99,by-2],'#e8572a',1.6);ctx.setLineDash([]);wt(bx+L*.9,by-50,'接閃器與引下線',17,'#ff9d7a',700,'center');});
  const cx=800,cy=600,sc=4.2,foil=t=>{const x=t,yt=.6*(.2969*Math.sqrt(t)-.126*t-.3516*t*t+.2843*t*t*t-.1015*t*t*t*t);return {x,y:yt};};
  const P=(t,s)=>{const f=foil(t);return {x:cx-320+f.x*640,y:cy-s*f.y*sc*160+(s>0?-6:6)*0};};
  ctx.beginPath();for(let i=0;i<=40;i++){const p=P(i/40,1);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}for(let i=40;i>=0;i--){const p=P(i/40,-1);ctx.lineTo(p.x,p.y);}ctx.closePath();ctx.fillStyle=a[3]>0?'#f2d98a':'#e9ecef';ctx.fill();ctx.strokeStyle='#e9ecef';ctx.lineWidth=10;ctx.stroke();
  ctx.beginPath();for(let i=0;i<=40;i++){const p=P(i/40,.78);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}for(let i=40;i>=0;i--){const p=P(i/40,-.78);ctx.lineTo(p.x,p.y);}ctx.closePath();ctx.fillStyle='#0e2a3b';ctx.fill();
  alphaDo(a[1],()=>{for(const s of [1,-1]){const p0=P(.22,s*.9),p1=P(.45,s*.9);box(p0.x,Math.min(p0.y,p1.y)-8,p1.x-p0.x,16,'#394650');}});
  alphaDo(a[2],()=>{for(const t of [.25,.42]){const p0=P(t,.8),p1=P(t,-.8);ln([p0.x,p0.y,p1.x,p1.y],'#8a99a3',8);}});
  alphaDo(a[4],()=>{const p=P(0,1);ctx.beginPath();ctx.arc(p.x+14,cy,30,Math.PI/2,Math.PI*1.5);ctx.strokeStyle='#58b8d0';ctx.lineWidth=8;ctx.stroke();});
  const LB=[[null],[P(.33,.9),'主梁帽（碳纖維）'],[P(.34,0),'剪力腹板'],[P(.7,.5),'三明治外殼'],[P(0,0),'前緣保護層']];
  LB.forEach((l,i)=>{if(!i)return;alphaDo(a[i],()=>{const tx=[0,1200,1200,1200,340][i],ty=[0,470,560,650,760][i];ln([l[0].x,l[0].y,tx-10,ty-6],'rgba(255,255,255,.6)',1.4);circ(l[0].x,l[0].y,5,'#fff');wt(tx,ty,l[1],20,'#fff',700,i===4?'right':'left');});});
 }},
{t:'第一支葉片',en:'The first blade',dur:12,side:true,
 d:'葉片以專用的葉片夾具水平夾住重心位置，夾具本身可以調整葉片的俯仰角度，讓葉根對準輪轂上的安裝面。兩條導引繩從夾具兩端拉回甲板，由自動張力絞機控制，抵抗風把葉片吹得打轉。葉根對上輪轂後，一百多支螺栓依序穿過變槳軸承，技術人員在輪轂內側旋上螺帽並鎖固。',
 s:[[0,'葉片夾具在重心位置水平夾住葉片'],[.3,'吊升到輪轂高度，導引繩控制姿態'],[.6,'葉根對準輪轂，螺栓穿過變槳軸承'],[.85,'輪轂內側鎖固螺帽，夾具鬆開']],
 cam:()=>({x:TX-150,y:250,s:1.15}),draw(u){wSide(map(u,0,.28));},hud(){hudW();}},
{t:'轉 120°，第二、三支',en:'Turning the hub',dur:16,side:true,
 d:'裝好一支葉片後，輪轂必須轉到下一支葉片的安裝位置。此時轉子重量極不平衡，不能靠風轉動，而是以機艙內的盤車裝置慢慢把輪轂轉動 120°，並以轉子鎖鎖住。第二、第三支葉片依相同程序吊裝，整個過程在天候良好時約需一天。',
 s:[[0,'盤車裝置把輪轂轉動 120°，轉子鎖鎖定'],[.12,'吊裝第 2 支葉片'],[.45,'再轉 120°'],[.52,'吊裝第 3 支葉片'],[.9,'三支葉片安裝完成']],
 cam:()=>({x:TX-150,y:250,s:1.15}),draw(u){wSide(map(u,.2,.8));},hud(){hudW();}},
{t:'為什麼葉片吊裝最怕風',en:'Weather windows',dur:12,
 d:'葉片又長又輕，就像一面巨大的帆，風速一高，導引繩就控制不了它的擺動，葉根對位更不可能。因此葉片吊裝的作業風速上限比塔架、機艙更嚴格，通常在每秒 10 到 12 公尺左右（以輪轂高度量測）。安裝團隊會依氣象預報找出連續數小時的「作業窗口」，台灣海峽東北季風強勁，冬季窗口特別稀少，這也是施工排程多集中在夏季的原因之一。',
 s:[[0,'葉片受風面積大，像一面巨大的帆'],[.25,'作業風速上限約 10–12 m/s（輪轂高度）'],[.5,'依預報找出連續數小時的作業窗口'],[.75,'冬季東北季風強，窗口稀少，施工多集中在夏季']],
 draw(u){
  diagBG();const c=chartBox(60,300,1480,500,{title:'輪轂高度風速預報（24 小時）',x0:0,x1:24,y0:0,y1:16,xt:[0,6,12,18,24],yt:[0,4,8,12,16],xl:'時',yl:'m/s',pt:80,gx:8,gy:4});
  const lim=c.Y(10);alphaDo(seg(u,.25,.3),()=>{ctx.setLineDash([10,6]);ln([c.px,lim,c.px+c.pw,lim],'#e8572a',2.4);ctx.setLineDash([]);wt(c.px+c.pw-8,lim-10,'葉片吊裝上限 10 m/s',19,'#e8572a',700,'right');});
  const k=seg(u,.05,.5);ctx.beginPath();for(let t=0;t<=23*k;t+=.1){const i=Math.floor(t),f=t-i,v=lerp(WIND[i],WIND[Math.min(23,i+1)],f);t?ctx.lineTo(c.X(t),c.Y(v)):ctx.moveTo(c.X(t),c.Y(v));}ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();
  alphaDo(seg(u,.5,.56),()=>{const win=[[0,5.3],[11.3,17.6],[21.3,24]];win.forEach(w=>{box(c.X(w[0]),c.py,c.X(w[1])-c.X(w[0]),c.ph,'rgba(125,255,196,.14)');});wt(c.X(2.6),c.py+30,'作業窗口',18,'#7dffc4',700,'center');wt(c.X(14.4),c.py+30,'作業窗口',18,'#7dffc4',700,'center');});
  const sw=Math.sin(TT*2)*lerp(3,18,(Math.sin(TT*.4)+1)/2);ctx.save();ctx.translate(1100,190);ctx.rotate(sw*Math.PI/180);ln([-260,0,260,0],'#e9ecef',16);box(-40,-18,80,36,'#394650');ctx.restore();ln([1100,90,1100,172],'#222',2);wt(820,200,'風一大，葉片就像帆一樣擺動',19,'#fff',600,'right');
 }},
{t:'降船、撤離、下一部',en:'Jacking down',dur:10,side:true,
 d:'三支葉片安裝完成，安裝船把船身降回水面，逐一拔起樁腿。樁靴拔出時海床會留下凹坑，也要記錄位置，避免下次作業或海纜受到影響。安裝船接著航向下一個機位，甲板上還載著下一套風機；全部載完後才回組裝港補貨。',
 s:[[0,'三支葉片安裝完成'],[.2,'船身降回水面'],[.6,'拔起樁腿，記錄樁靴留下的凹坑'],[.85,'航向下一個機位']],
 cam:()=>({x:TX-180,y:350,s:.98}),draw(u){wSide(map(u,.8,1));}}
]};
