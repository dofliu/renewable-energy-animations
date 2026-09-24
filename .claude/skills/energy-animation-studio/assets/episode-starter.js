// KITS: land
/* =====================================================================
   STARTER EPISODE — copy this file, rename it, then replace the content.
   Shows the two shot types:
     1. side:true  → a scene on a background (here the open-sea swell from kit-land)
     2. diagram    → draw everything yourself, starting with diagBG()
   World coordinates are always 1600 × 900. Keep the top-left ~420×130 clear
   (chapter card) and the top-right corner clear when a shot has a HUD.
   ===================================================================== */
const map=(u,a,b)=>lerp(a,b,u);
const SW={y:430,A:22,L:300,sp:1.3,bed:800};
function buoyAt(x){return swellY(x,SW);}
const EP={no:1,t:'點吸收式波浪發電',en:'Point absorber wave energy',
seriesName:'波浪發電系列',total:1,
lede:'一句到兩句話說明本集要回答的問題，以及觀眾看完會懂什麼。',
facts:[['1–3','m','示例：典型浮標直徑（請以查證過的數值取代）'],['0.5–1','MW','示例：單機額定功率']],
note:'說明：本集為教育用途示意動畫，數值為典型範例，實際依各案設計而定。',
base:()=>{landSky(SW.y);drawSwell(SW);},   // episode-wide background for side:true shots
shots:[
{t:'浮標隨浪起伏',en:'Riding the swell',dur:12,side:true,
 d:'分鏡說明段落：120–200 字，解釋這個畫面在發生什麼、為什麼重要。',
 s:[[0,'第一句字幕：畫面一開始在做什麼'],[.35,'第二句字幕'],[.7,'第三句字幕']],
 cam:u=>({x:800,y:470,s:1.1}),
 draw(u){
  const x=800,y=buoyAt(x);
  ln([x,y+30,x,SW.bed],'#2b3035',2);box(x-40,SW.bed-16,80,16,'#4d5760');      // tether and base
  ctx.save();ctx.translate(x,y);poly([-46,-10,46,-10,34,24,-34,24],'#f2c230','#9c7a12',1.5);ctx.restore();
  lab(x,y-10,'浮標',{dx:80,dy:-50,a:band(u,.05,1)});
  lab(x,SW.bed-16,'海床基座與發電機',{dx:-100,dy:-40,st:'s',a:band(u,.35,1)});
 },
 hud(u){hudPanel(220,110,'即時輸出',seg(u,.3,.36),w=>{const v=(buoyAt(800)-SW.y)/SW.A;hrow(54,'浮標位移',(v*1.5).toFixed(2)+' m',w);hrow(84,'功率',Math.abs(v*380).toFixed(0)+' kW',w,'#f2c230');});}},
{t:'能量怎麼轉換',en:'Power take-off',dur:12,
 d:'圖解分鏡：用圖表或剖面說明原理，這一類分鏡建議佔全集三分之一以上。',
 s:[[0,'波浪的上下運動'],[.4,'轉換成發電機的旋轉'],[.75,'經電力電子轉成穩定的交流電']],
 draw(u){
  diagBG();
  const c=chartBox(80,170,760,600,{title:'浮標高度隨時間變化',x0:0,x1:10,y0:-2,y1:2,xt:[0,5,10],yt:[-2,0,2],xl:'時間（秒）',yl:'m',pt:80});
  ctx.beginPath();for(let t=0;t<=10*seg(u,0,.4);t+=.05){const y=c.Y(1.5*Math.sin(t*1.3));t?ctx.lineTo(c.X(t),y):ctx.moveTo(c.X(t),y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=3;ctx.stroke();
  card(900,170,620,600,{bg:'rgba(7,27,39,.75)'});wt(924,212,'轉換鏈',20,'#f2c230',700);
  ['波浪起伏','液壓或直驅發電機','變流器','併網'].forEach((s,i)=>{const a=seg(u,.1+i*.2,.16+i*.2);alphaDo(a,()=>{tag(960,300+i*120,s,{size:22});if(i<3)arrow(1000,330+i*120,1000,380+i*120,'#f2c230',3);});});
 }}
]};
