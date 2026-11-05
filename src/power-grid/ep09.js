// KITS: land
/* 電網系列 第 9 集：高壓直流輸電（HVDC）與離岸風電送電 */
/* 數值多為典型範例：交流海纜可用容量、成本曲線、損失百分比與功率皆為示意；距離範圍整理自公開文獻 */
const SY9=470;
const pf9=u=>u<.45?600*ease(seg(u,.1,.3)):600*(1-2*ease(seg(u,.52,.78)));
const L0_9=160;
const acCap9=L=>Math.sqrt(Math.max(0,1-Math.pow(L/L0_9,2)))*100;
const cAC9=L=>8+.55*L, cDC9=L=>34+.2*L;
function pt9(P,t){const k=clamp(t,0,.9999)*(P.length-1),j=Math.floor(k);return [lerp(P[j][0],P[j+1][0],k-j),lerp(P[j][1],P[j+1][1],k-j)];}
function flow9(P,dir,col,n,r,a,sp){
  if(a<=0.01)return;
  alphaDo(a,()=>{for(let i=0;i<n;i++){let t=(TT*(sp||.18)*dir+i/n)%1;if(t<0)t+=1;const q=pt9(P,t);circ(q[0],q[1],r,col);}});
}
function turb9(x,h,rot){const by=swellY(x,{y:SY9})+2;ln([x,by,x,by+170],'#c9d3d8',4);ln([x,by,x,by-h],'#eef2f4',5);for(let i=0;i<3;i++){const a=rot+i*TAU/3;ln([x,by-h,x+h*.55*Math.cos(a),by-h+h*.55*Math.sin(a)],'#eef2f4',3);}circ(x,by-h,4.5,'#cfd8dc');return by;}
function pole9(x,gy,h){ln([x,gy,x,gy-h],'#6b5a48',5);ln([x-24,gy-h+12,x+24,gy-h+12],'#6b5a48',4);ln([x-16,gy-h+34,x+16,gy-h+34],'#6b5a48',3);return [x,gy-h+12];}
function conv9(x,gy,w,on){
  box(x,gy-84,w,84,'#d9dfe3','rgba(0,0,0,.35)',1.4);box(x+8,gy-100,w-16,16,'#aeb8be','rgba(0,0,0,.3)',1);
  for(let i=0;i<4;i++)box(x+12+i*((w-24)/4),gy-70,(w-24)/4-8,40,'#8d989f');
  for(let i=0;i<3;i++)box(x+14+i*30,gy-22,22,18,on?'#7dffc4':'#7a8790');
}
function platform9(x,on){
  const by=swellY(x,{y:SY9});
  [-70,70].forEach(d=>ln([x+d,by-8,x+d,780],'#b9c3c9',7));ln([x-70,640,x+70,560],'#b9c3c9',3);ln([x+70,640,x-70,560],'#b9c3c9',3);
  box(x-110,by-70,220,58,'#e3e8ec','rgba(0,0,0,.35)',1.4);box(x-96,by-58,60,34,'#8d989f');box(x-24,by-58,60,34,'#8d989f');
  for(let i=0;i<3;i++)box(x+50,by-58+i*12,36,7,on?'#7dffc4':'#7a8790');
  ln([x-90,by-70,x-90,by-100],'#c9d3d8',3);box(x-104,by-106,28,8,'#e8572a');
}
function hrw9(x,y,label,val,w,col){wt(x,y,label,20,'rgba(227,236,238,.9)',600);wt(x+w,y+4,val,28,col,700,'right',COND);}
function wave9(x0,w,base,amp,fn,p,col,lw){
  ctx.beginPath();let on=false;const n=160;
  for(let i=0;i<=n*p;i++){const t=i/n,x=x0+w*t,y=base-amp*fn(t);on?ctx.lineTo(x,y):(ctx.moveTo(x,y),on=true);}
  ctx.strokeStyle=col;ctx.lineWidth=lw||3.4;ctx.stroke();
}
function seaScene9(){
  landSky(SY9,{sun:{x:1350,y:110}});
  ctx.save();ctx.beginPath();ctx.rect(VX0,VY0,1330-VX0,VY1-VY0);ctx.clip();drawSwell({y:SY9,A:9,L:300,sp:1,bed:780});ctx.restore();
  ctx.beginPath();ctx.moveTo(1080,VY1+20);ctx.lineTo(1080,780);ctx.lineTo(1280,520);ctx.lineTo(VX1,520);ctx.lineTo(VX1,VY1+20);ctx.closePath();ctx.fillStyle='#a4876a';ctx.fill();
  ctx.beginPath();ctx.moveTo(1280,520);ctx.lineTo(VX1,520);ctx.lineTo(VX1,532);ctx.lineTo(1274,532);ctx.closePath();ctx.fillStyle='#7a9a55';ctx.fill();
}

const EP={no:9,slug:'power-grid',seriesName:'電網系列',t:'高壓直流輸電與離岸風電送電',en:'HVDC transmission for offshore wind',
lede:'離岸風場離岸越遠，交流海纜就越吃力：電纜本身像一個長長的電容器，會吃掉一部分輸電容量。高壓直流輸電（HVDC）先在海上把交流整流成直流，送到岸上再逆變回交流。這一集看交流為何受距離限制、換流站怎麼運作、成本在什麼距離交會，以及直流還能做到的事。',
facts:[['50–100','公里','文獻中海纜輸電的交流與直流成本交會距離範圍，隨容量與條件而變'],
['0','充電電流','直流穩態下沒有電纜電容的充放電電流，不佔用電纜容量'],
['2','條導體','直流每迴路只要正負兩極；三相交流需要三條導體'],
['< 1','%','每座換流站的損失，典型約佔傳輸功率的 0.4–1%'],
['±320','kV','歐洲北海柔性直流常見電壓等級，單回路約數百 MW 至 900 MW 級（典型範例）'],
['可控','功率與方向','換流器可快速調整潮流大小與方向，也能連接頻率不同的電網']],
note:'說明：本集為教育用途示意動畫。交流與直流輸電成本交會距離（約 50–100 公里，大容量時更短）、直流不需無效功率補償與充電電流、換流站損失低於傳輸功率 1%、柔性直流（VSC）以 IGBT 開關，整理自 Alassi 等人 2019 年 HVDC 技術回顧、EPRI／CIGRE 與 Chalmers 研究摘要。台電曾研究以高壓直流輸電將遠海風電送回陸上，見國發會報告摘要，並無已定案之台灣離岸直流案場。畫面中的交流海纜可用容量曲線（以 220 kV 約 160 公里為例）、成本曲線、兩電網頻率與傳輸功率皆為典型範例，非特定案場資料。',
base:()=>seaScene9(),
shots:[
{t:'交流海纜的難題',en:'The problem with long AC cables',dur:13,
 d:'海纜的導體外包著絕緣層，再包著金屬護套，構造像一個長長的電容器。交流電壓一秒來回六十次，電纜就不斷充電、放電，產生與負載無關的充電電流。電纜越長，這股電流越大，佔掉的容量也越多，能送出的有效功率便隨距離縮減。示例中，一條 220 kV 交流海纜到約 160 公里時，容量全被充電電流用盡；直流穩態沒有這個問題。這是離岸風場離岸越遠，越需要直流的第一個原因。',
 s:[[0,'海纜像一個長長的電容器'],[.3,'交流電壓來回，電纜不斷充放電'],[.6,'電纜越長，充電電流越大，吃掉容量'],[.85,'直流穩態沒有充電電流，容量不受距離影響']],
 draw(u){
  diagBG();
  const C=chartBox(60,150,960,650,{title:'海纜可送出的有效功率（典型範例）',x0:0,x1:160,y0:0,y1:110,xt:[0,40,80,120,160],yt:[0,25,50,75,100],xl:'公里',pl:84,pt:60,pb:56,gx:4,gy:5});
  const tm=160*ease(seg(u,.1,.9));
  ctx.beginPath();for(let L=0;L<=tm+1e-6;L+=2)L?ctx.lineTo(C.X(L),C.Y(acCap9(L))):ctx.moveTo(C.X(L),C.Y(acCap9(L)));ctx.strokeStyle='#f2c230';ctx.lineWidth=4;ctx.stroke();
  alphaDo(seg(u,.5,.62),()=>{ln([C.X(0),C.Y(100),C.X(tm),C.Y(100)],'#7dffc4',4);});
  ln([C.X(tm),C.py,C.X(tm),C.py+C.ph],'rgba(255,255,255,.4)',1.4);
  wt(C.px+16,C.py+34,'交流海纜',18,'#f2c230',700);
  alphaDo(seg(u,.5,.62),()=>wt(C.px+16,C.py+62,'直流海纜',18,'#7dffc4',700));
  alphaDo(seg(u,.76,.9),()=>tag(C.X(120),C.Y(acCap9(120))-34,'容量被充電電流吃掉',{size:16,bg:'#e8572a',align:'center'}));
  const cx=1060;card(cx,150,480,300,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});
  wt(cx+24,192,'海纜構造＝電容器',22,'#f2c230',700);
  const ox=cx+130,oy=330;circ(ox,oy,92,'#2a3a44','#7dc8dc',3);circ(ox,oy,76,'#3d5662');
  [[-26,18],[26,18],[0,-28]].forEach(([dx,dy])=>circ(ox+dx,oy+dy,19,'#e0a15a','#fff3d6',1.5));
  const ph=(TT*.9)%1;ring(ox,oy,96+ph*26,'rgba(242,194,48,'+(1-ph)+')',3);ring(ox,oy,96+((ph+.5)%1)*26,'rgba(242,194,48,'+(1-(ph+.5)%1)+')',3);
  wt(cx+250,292,'導體',19,'#e0a15a',700);wt(cx+250,326,'絕緣層',19,'rgba(227,236,238,.9)',600);wt(cx+250,360,'金屬護套',19,'#7dc8dc',700);
  wt(cx+250,410,'交流來回 → 充放電',17,'rgba(227,236,238,.8)',500);
  card(cx,470,480,330,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(cx+24,512,'此刻（示例，220 kV 交流）',21,'#7dc8dc',700);
  const c=tm/L0_9;
  hrw9(cx+24,574,'海纜長度',Math.round(tm)+' km',432,'#fff');
  hrw9(cx+24,630,'充電電流佔額定',Math.round(c*100)+'%',432,c>.7?'#e8572a':'#f2c230');
  hrw9(cx+24,686,'交流可送功率',Math.round(acCap9(tm))+'%',432,acCap9(tm)<70?'#e8572a':'#f2c230');
  hrw9(cx+24,742,'直流可送功率','100%',432,'#7dffc4');
 }},

{t:'風場到岸上：海上換流站',en:'Wind farm to shore: the offshore converter',dur:14,side:true,
 d:'遠海風場先以交流陣列電纜把各台風機的電力集中到海上平台。平台上的換流站把交流整流成直流，經一條直流海纜沿海床送上岸；陸上換流站再逆變回交流，接進電網的變電所。海上換流站體積龐大，要有專用的平台與基礎，這是直流的主要代價。示例中，一組約 900 MW 的直流系統，海纜只需正負兩條導體，沿線不需要海上的無效功率補償站。',
 s:[[0,'風機以交流陣列電纜把電集中到海上平台'],[.3,'海上換流站把交流整流成直流'],[.55,'直流海纜沿海床送上岸'],[.8,'陸上換流站逆變回交流，併入電網']],
 draw(u){
  const rot=TT*1.2;
  const bases=[330,490,650].map((x,i)=>turb9(x,150,rot+i*1.9));
  const PX=880,PY=swellY(PX,{y:SY9})-40;
  platform9(PX,u>.3);
  const aOn=seg(u,.05,.2);
  bases.forEach((by,i)=>{const x=[330,490,650][i];const P=[[x,by+8],[x,by+60],[PX-70,by+60],[PX-70,PY+10]];ln(P.flat(),'rgba(242,194,48,.55)',2.2);flow9(P,1,'#f2c230',5,3.2,aOn,.22);});
  const D=[[PX+70,PY+10],[PX+70,770],[1090,770],[1280,538],[1330,520]];
  ln(D.flat(),'#ff8a60',5);
  flow9(D,1,'#ff9d7a',14,4,seg(u,.35,.5),.16);
  const gy=520;conv9(1340,gy,130,u>.7);
  const G=pole9(1520,gy,150);ln([1470,gy-60,1470,G[1],G[0],G[1]],'rgba(30,40,46,.85)',1.8);
  flow9([[1470,gy-60],[1470,G[1]],G],1,'#f2c230',4,3.4,seg(u,.7,.85),.25);
  lab(490,SY9-170,'風機',{dx:0,dy:-80,st:'s',a:band(u,.02,.35)});
  lab(PX,PY-30,'海上換流站',{dx:0,dy:-120,st:'w',a:band(u,.25,.7)});
  lab(1010,770,'直流海纜',{dx:0,dy:-70,st:'w',a:band(u,.45,.9)});
  lab(1400,gy-90,'陸上換流站',{dx:0,dy:-100,st:'g',a:band(u,.65,.98)});
 },
 hud(u){
  const p=Math.round(900*seg(u,.3,.6)),ac=Math.round(100*seg(u,.05,.25));
  hudPanel(280,152,'直流送電（示例）',seg(u,.04,.1),w=>{hrow(56,'海上平台',ac+'%',w,'#f2c230');hrow(88,'直流電壓','±320 kV',w,'#ff9d7a');hrow(120,'送出功率',p+' MW',w,'#7dffc4');});}},

{t:'換流站如何運作',en:'How a converter station works',dur:13,
 d:'換流站是直流輸電的核心。整流器把交流電的正負半波都導向同一個方向，再經濾波與電容平滑，得到穩定的直流；陸上的逆變器則反過來，把直流電切成脈衝，再合成為頻率與相位符合電網的交流。現代離岸風電多採用柔性直流（VSC），以 IGBT 高速開關，造出所需的交流波形，能獨立控制有功與無功功率，也不需要靠電網提供換相電壓，風場無電時仍可啟動。',
 s:[[0,'交流電的電壓正負來回'],[.3,'整流：正負半波都導向同一個方向'],[.6,'濾波與電容平滑，成為穩定直流'],[.85,'岸上逆變，合成符合電網的交流']],
 draw(u){
  diagBG();
  card(60,150,760,650,{bg:'rgba(7,27,39,.75)'});wt(84,190,'一條電流的三種樣子（示意）',22,'#f2c230',700);
  const P=[['①　風場交流',215,t=>Math.sin(TAU*2*t),'#f2c230',.04,.3,true],['②　整流後（脈動）',405,t=>Math.abs(Math.sin(TAU*2*t)),'#58b8d0',.3,.58,false],['③　濾波平滑後（直流）',595,t=>.92-.08*Math.cos(TAU*4*t),'#7dffc4',.58,.86,false]];
  P.forEach(([n,top,fn,c,a0,a1,sg])=>{
    alphaDo(seg(u,a0-.04,a0+.04),()=>{
      box(84,top,712,170,'rgba(255,255,255,.05)');wt(100,top+30,n,20,c,700);
      const base=sg?top+105:top+158,amp=sg?55:100;ln([100,base,780,base],'rgba(255,255,255,.3)',1.2);
      const p=ease(seg(u,a0,a1));wave9(110,660,base,amp,fn,p,c,3.6);
      if(p<1&&p>0){const t=p,x=110+660*t;circ(x,base-amp*fn(t),6,'#fff');}
    });});
  const S=[['①','整流：交流→直流','風場側（海上換流站）','#f2c230',.28],['②','直流海纜','正負兩極，常見 ±320 kV（示例）','#ff9d7a',.5],['③','逆變：直流→交流','岸上側，合成符合電網的波形','#7dffc4',.74]];
  S.forEach(([n,a,b,c,a0],i)=>{const y=150+i*160,lit=band(u,a0-.1,a0+.24+(i==2?.5:0));
    card(860,y,680,140,{bg:'rgba(255,255,255,'+(.05+.1*lit)+')',st:c});circ(912,y+70,26,c);wt(912,y+80,n,28,'#13232e',800,'center');
    wt(960,y+60,a,25,c,700);wt(960,y+102,b,19,'rgba(227,236,238,.9)',500);
    if(i<2)alphaDo(seg(u,a0,a0+.1),()=>arrow(1200,y+140,1200,y+160,'rgba(227,236,238,.6)',2.4));});
  alphaDo(seg(u,.82,.94),()=>{card(860,640,680,160,{bg:'rgba(7,27,39,.75)',st:'#b37cff'});wt(884,682,'柔性直流（VSC）',22,'#b37cff',700);
    ['以 IGBT 高速開關合成交流波形','有功與無功可獨立控制'].forEach((t,i)=>{circ(894,730+i*38-5,3.5,'#b37cff');wt(912,730+i*38,t,20,'rgba(227,236,238,.95)',500);});});
 }},

{t:'成本在哪個距離交會',en:'Where the cost curves cross',dur:13,
 d:'直流與交流的成本結構不同。直流要建兩座換流站，固定成本高；但海纜只需兩條導體、沒有充電電流，也不需沿線補償，每公里增加的成本較低。交流相反：設備簡單、起步便宜，距離一長就得加裝電抗器等補償設備。兩條成本曲線因此會交會。文獻對海纜輸電給出的交會距離約為 50–100 公里，傳輸功率越大，交會點越近。示例曲線的交會點約在 75 公里。',
 s:[[0,'直流有兩座換流站，起步成本高'],[.3,'交流起步便宜，但每公里成本增加得快'],[.6,'兩條曲線在某個距離交會'],[.85,'容量越大，交會點越近，直流越划算']],
 draw(u){
  diagBG();
  const C=chartBox(60,150,960,650,{title:'輸電總成本與距離（相對值，典型範例）',x0:0,x1:200,y0:0,y1:130,xt:[0,50,100,150,200],yt:[0,30,60,90,120],xl:'公里',pl:84,pt:60,pb:56,gx:4,gy:4});
  const tm=200*ease(seg(u,.08,.82));
  const dr=(f,col)=>{ctx.beginPath();for(let L=0;L<=tm+1e-6;L+=2)L?ctx.lineTo(C.X(L),C.Y(f(L))):ctx.moveTo(C.X(L),C.Y(f(L)));ctx.strokeStyle=col;ctx.lineWidth=4;ctx.stroke();};
  alphaDo(seg(u,.2,.3),()=>{box(C.X(50),C.py,C.X(100)-C.X(50),C.ph,'rgba(179,124,255,.14)');wt(C.X(75),C.py+28,'文獻交會範圍 50–100 km',16,'#c9a8ff',700,'center');});
  dr(cAC9,'#f2c230');dr(cDC9,'#7dffc4');
  wt(C.px+16,C.py+34,'交流',18,'#f2c230',700);wt(C.px+16,C.py+62,'直流',18,'#7dffc4',700);
  const xp=26/.35;
  alphaDo(seg(u,.5,.62),()=>{circ(C.X(xp),C.Y(cAC9(xp)),9,'#fff','#e8572a',3);tag(C.X(xp),C.Y(cAC9(xp))+48,'交會點 約 75 km（示例）',{size:16,bg:'#e8572a',align:'center'});});
  alphaDo(seg(u,.2,.3),()=>tag(C.X(14),C.Y(cDC9(0))-34,'換流站固定成本',{size:15,bg:'#58b8d0',align:'left'}));
  ln([C.X(tm),C.py,C.X(tm),C.py+C.ph],'rgba(255,255,255,.4)',1.4);
  const cx=1060;
  card(cx,150,480,300,{bg:'rgba(7,27,39,.75)',st:'#7dffc4'});wt(cx+24,192,'直流：起步貴、每公里便宜',21,'#7dffc4',700);
  ['兩座換流站，固定成本高','海纜只需兩條導體','沒有充電電流，不需沿線補償'].forEach((t,i)=>alphaDo(seg(u,.12+i*.06,.22+i*.06),()=>{circ(cx+34,250+i*46-5,3.5,'#7dffc4');wt(cx+52,250+i*46,t,19,'rgba(227,236,238,.95)',500);}));
  card(cx,470,480,330,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});wt(cx+24,512,'交流：起步便宜、距離長就加料',21,'#f2c230',700);
  ['設備簡單，變壓器即可升降壓','距離長需加裝電抗器補償','三相需要三條導體'].forEach((t,i)=>alphaDo(seg(u,.28+i*.06,.38+i*.06),()=>{circ(cx+34,570+i*46-5,3.5,'#f2c230');wt(cx+52,570+i*46,t,19,'rgba(227,236,238,.95)',500);}));
  alphaDo(seg(u,.8,.92),()=>{wt(cx+24,740,'容量越大，交會點越近',20,'#c9a8ff',700);ln([cx+24,756,cx+456,756],'rgba(179,124,255,.5)',2);wt(cx+24,784,'約 200 MW 以上才有明顯優勢（文獻）',16,'rgba(227,236,238,.8)',500);});
 }},

{t:'直流的另一種本事：連接與控制',en:"DC's other talent: linking and control",dur:13,side:true,
 base:()=>{landSky(GY,{sun:{x:800,y:110},clouds:false});drawGround();},
 d:'直流還有一項交流做不到的本事。兩個頻率或相位不同的電網，無法直接併聯，但可以各接一座換流站，中間用直流連起來，電網之間不必同步。換流器還能在極短時間內調整潮流的大小，甚至讓功率方向反轉，成為調度員手中的閥門。示例中，一條 600 MW 的直流線，先把電從 A 電網送往 B 電網，再依調度需要反向送回。',
 s:[[0,'兩個頻率不同的電網，無法直接相連'],[.3,'各接一座換流站，中間以直流連接'],[.55,'換流器把功率從 A 送往 B'],[.8,'調度需要時，潮流在短時間內反向']],
 draw(u){
  const p=pf9(u),dir=p>=0?1:-1,a=clamp(Math.abs(p)/600,0,1);
  const LP=[pole9(150,GY,160),pole9(300,GY,160),pole9(450,GY,160)];ln([100,GY-110,...LP.flat()],'rgba(30,40,46,.85)',1.8);
  const RP=[pole9(1150,GY,160),pole9(1300,GY,160),pole9(1450,GY,160)];ln([...RP.flat(),1500,GY-110],'rgba(30,40,46,.85)',1.8);
  conv9(560,GY,130,u>.3);conv9(910,GY,130,u>.3);
  ln([450,LP[2][1],450,GY-60,560,GY-60],'rgba(30,40,46,.85)',1.8);ln([1040,GY-60,1150,GY-60,1150,RP[0][1]],'rgba(30,40,46,.85)',1.8);
  const Dd=[[690,GY-30],[910,GY-30]];ln(Dd.flat(),'#ff8a60',6);
  flow9(Dd,dir,'#ff9d7a',8,4.4,a*seg(u,.3,.45),.18);
  const wv=(x,f,col)=>{box(x-12,GY-310,200,100,'rgba(19,35,46,.78)');ctx.beginPath();for(let i=0;i<=60;i++){const xx=x+i*3,yy=GY-260-26*Math.sin(TAU*(f*i/60*2-TT*f*.5));i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.strokeStyle=col;ctx.lineWidth=3;ctx.stroke();};
  wv(190,5,'#f2c230');wv(1230,6,'#7dffc4');
  alphaDo(seg(u,.02,.15),()=>{tag(280,GY-322,'A 電網　50 Hz',{size:22,bg:'#13232e',fg:'#f2c230',align:'center'});tag(1320,GY-322,'B 電網　60 Hz',{size:22,bg:'#13232e',fg:'#7dffc4',align:'center'});});
  lab(625,GY-100,'換流站',{dx:0,dy:-110,st:'s',a:band(u,.25,.95)});
  lab(800,GY-30,'直流線',{dx:0,dy:70,st:'w',a:band(u,.3,.95)});
  lab(800,GY-250,'頻率不同，不必同步',{dx:0,dy:-40,st:'g',a:band(u,.08,.45)});
  lab(800,GY+20,'潮流反向',{dx:0,dy:110,st:'w',a:band(u,.62,.95)});
 },
 hud(u){
  const p=Math.round(pf9(u));
  hudPanel(280,152,'直流潮流（示例）',seg(u,.04,.1),w=>{hrow(56,'功率',Math.abs(p)+' MW',w,'#7dffc4');hrow(88,'方向',p>10?'A → B':(p<-10?'B → A':'待命'),w,'#f2c230');hbar(16,102,w-32,Math.abs(p)/600,'#7dffc4');hrow(138,'頻率','50 / 60 Hz',w,'#ff9d7a');});}},

{t:'取捨與台灣的情境',en:'Trade-offs and the Taiwan context',dur:13,
 d:'選擇交流還是直流，要同時看距離與容量。距離較短時，交流設備簡單、容易維護，通常較有利；距離拉長、容量變大，直流少掉的損失與補償設備才抵得過換流站的投資。直流的代價包括換流站體積大、需要專用平台，以及設備與維修經驗的累積。台灣目前的離岸風場距離岸約數十公里，多在交流較有利的範圍；台電曾研究以高壓直流輸電把遠海風場的電力送回陸上，未來更遠的深水與浮動式風場，才更需要評估直流。',
 s:[[0,'短距離：交流設備簡單，容易維護'],[.3,'距離與容量增加，直流開始划算'],[.6,'直流的代價是大型換流站與專用平台'],[.85,'台灣近岸風場以交流為主，遠海才評估直流']],
 draw(u){
  diagBG();
  card(60,150,1480,260,{bg:'rgba(7,27,39,.75)'});wt(84,190,'依距離選擇輸電方式（示意）',22,'#f2c230',700);
  const x0=120,w=1360,y=300,X=km=>x0+w*km/200;
  box(x0,y,X(50)-x0,34,'rgba(242,194,48,.75)');box(X(50),y,X(100)-X(50),34,'rgba(179,124,255,.75)');box(X(100),y,x0+w-X(100),34,'rgba(125,255,196,.75)');
  wt((x0+X(50))/2,y+25,'交流較有利',19,'#13232e',800,'center');wt((X(50)+X(100))/2,y+25,'交界區',19,'#13232e',800,'center');wt((X(100)+x0+w)/2,y+25,'直流較有利',19,'#13232e',800,'center');
  [0,50,100,150,200].forEach(k=>{ln([X(k),y+34,X(k),y+46],'rgba(255,255,255,.6)',1.6);wt(X(k),y+72,k+' km',17,'rgba(227,236,238,.85)',600,'center');});
  const mk=lerp(0,200,ease(seg(u,.1,.5)));
  ln([X(mk),y-24,X(mk),y+34],'#fff',3);tag(X(mk),y-34,Math.round(mk)+' km',{size:16,bg:'#f2c230',fg:'#13232e',align:'center'});
  alphaDo(seg(u,.78,.9),()=>{const kx=X(47.5);ln([kx,y+80,kx,y+112],'#ff9d7a',2.4);tag(kx,y+138,'彰化外海風場距岸約 35–60 km',{size:16,bg:'#e8572a',align:'center'});});
  const cols=[['交流輸電','#f2c230',['設備簡單，維護成熟','變壓器即可升降壓','距離長需電抗器補償'],.18],['直流輸電','#7dffc4',['損失低，沒有充電電流','可控制潮流、連接不同電網','需要大型換流站與專用平台'],.36]];
  cols.forEach(([n,c,ls,a0],i)=>alphaDo(seg(u,a0,a0+.1),()=>{const x=60+i*500;card(x,430,480,370,{bg:'rgba(7,27,39,.75)',st:c});wt(x+24,474,n,25,c,700);
    ls.forEach((t,j)=>{circ(x+34,534+j*62-5,3.5,c);wt(x+52,534+j*62,t,19,'rgba(227,236,238,.95)',500);});}));
  alphaDo(seg(u,.56,.68),()=>{card(1060,430,480,370,{bg:'rgba(7,27,39,.75)',st:'#b37cff'});wt(1084,474,'台灣的情境',25,'#b37cff',700);
    ['近岸風場以交流海纜為主','台電曾研究以直流送遠海風電','更遠的深水與浮動式風場才更需評估'].forEach((t,j)=>{circ(1094,534+j*62-5,3.5,'#b37cff');wt(1112,534+j*62,t,19,'rgba(227,236,238,.95)',500);});
    wt(1084,768,'交界區要逐案比較成本與損失',17,'rgba(227,236,238,.75)',500);});
 }}
]};
