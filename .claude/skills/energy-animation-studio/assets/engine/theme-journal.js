/* ================= theme: journal（DOF LAB 品牌層） =================
   依劉老師簡報設計系統的 Journal 主題延伸：畫布維持深色，強調色改為鏽紅、資料色改為青綠，
   標題用 Noto Serif，近直角圓角，片頭改為編輯式排版並放入 D 字標。只改品牌層，不改各集內容。 */
const THEME=(()=>{
  /* 畫布配色對照：經典色 → Journal 深色版 */
  const MAP={'#f2c230':'#e08a5f','#13232e':'#1e2326','#0e2a3b':'#1b2126','#7dffc4':'#7cc7bd','#1f7f5c':'#2f7f7a',
    '#e8572a':'#c8553d','#ff8a60':'#e0957a','#ff9d7a':'#e8a58c','#58b8d0':'#7ea9cc','#7dc8dc':'#9dbdd8','#f2f6f7':'#f1f0ec'};
  const RGBA=[['242,194,48','224,138,95'],['7,27,39','40,46,51'],['7,26,37','30,35,38'],['9,31,44','30,35,38'],['8,32,45','30,35,38'],
    ['4,14,22','16,19,21'],['5,22,32','20,24,27'],['125,255,196','124,199,189'],['31,127,92','47,127,122'],['227,236,238','226,228,224']];
  const cache=new Map();
  function mapc(v){
    if(typeof v!=='string')return v;
    let r=cache.get(v);if(r!==undefined)return r;
    const k=v.toLowerCase();r=MAP[k]||v;
    if(r===v&&k.startsWith('rgba(')){const n=k.slice(5).replace(/\s+/g,'');for(const [a,b] of RGBA)if(n.startsWith(a+',')){r='rgba('+b+n.slice(a.length);break;}}
    if(cache.size<4000)cache.set(v,r);return r;
  }
  const P=CanvasRenderingContext2D.prototype;
  for(const prop of ['fillStyle','strokeStyle','shadowColor']){
    const d=Object.getOwnPropertyDescriptor(P,prop);
    Object.defineProperty(P,prop,{configurable:true,get(){return d.get.call(this);},set(v){d.set.call(this,mapc(v));}});
  }
  const acs=CanvasGradient.prototype.addColorStop;CanvasGradient.prototype.addColorStop=function(o,c){return acs.call(this,o,mapc(c));};
  /* Journal：接近直角 */
  const rrp0=rrp;rrp=function(x,y,w,h,r){return rrp0(x,y,w,h,Math.min(r,3));};

  /* D 字標（monogram-d.svg） */
  const DP=new Path2D('M34 26h27c25 0 42 14 42 38S86 102 61 102H34V26zm25 56c13 0 21-6 21-18s-8-18-21-18h-3v36h3z');
  function mono(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s/128,s/128);rrp0(0,0,128,128,14);ctx.fillStyle='#202124';ctx.fill();ctx.fillStyle='#f47a20';ctx.fill(DP,'evenodd');ctx.restore();}
  const SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="14" fill="#202124"/><path d="M34 26h27c25 0 42 14 42 38S86 102 61 102H34V26zm25 56c13 0 21-6 21-18s-8-18-21-18h-3v36h3z" fill="#F47A20" fill-rule="evenodd"/></svg>';
  const mk=document.querySelector('.masthead .mark');if(mk)mk.innerHTML=SVG;
  const serif=()=>LANG==='ja'?'"Noto Serif JP","Noto Serif TC",serif':'"Noto Serif TC","Noto Serif JP",serif';

  return {
    titleFont:serif,
    fonts:()=>['700 32px "Noto Serif TC"','900 32px "Noto Serif TC"'].concat(LANG==='ja'?['700 32px "Noto Serif JP"','900 32px "Noto Serif JP"']:[]),
    /* 片頭：左對齊的編輯式版面 */
    opening(a){
      screenSpace();ctx.fillStyle=`rgba(21,25,28,${.9*a})`;ctx.fillRect(0,0,cssW,cssH);
      ctx.save();ctx.globalAlpha=a;ctx.textAlign='left';
      const u=cssW/100,x=cssW*.08,w=cssW*.84;
      /* 標題區：眉題（系列與集數）＋襯線大標＋副標 */
      const fs=clamp(cssW/17,22,76),tt=epT(),tfs=LANG==='en'&&tt.length>26?fs*.8:fs,y0=cssH*.5;
      ctx.textBaseline='alphabetic';
      ctx.font=`600 ${clamp(u*1.7,12,26)}px ${FONT}`;ctx.fillStyle='#e08a5f';ctx.fillText(seriesLine()||P2(EP.no),x,y0-tfs*.95,w);
      ctx.fillStyle='#e08a5f';ctx.fillRect(x,y0-tfs*.95-clamp(u*1.7,12,26)-u*1.4,u*5,3);
      ctx.font=`900 ${tfs}px ${serif()}`;ctx.fillStyle='#fbfaf6';ctx.fillText(tt,x,y0+tfs*.35,w);
      ctx.font=`500 ${fs*.4}px ${LANG==='en'?FONT:COND}`;ctx.fillStyle='rgba(236,234,228,.72)';ctx.fillText(epSub(),x,y0+tfs*.35+fs*.8,w);
      /* 底部品牌列：細線、D 字標＋DOF LAB、署名 */
      const yf=cssH*.78,m=clamp(u*2.6,16,46),ym=yf+u*1.6;
      ctx.fillStyle='rgba(236,234,228,.22)';ctx.fillRect(x,yf,w,1);
      mono(x,ym,m);
      ctx.textBaseline='middle';ctx.font=`700 ${clamp(u*1.4,10,22)}px ${COND}`;ctx.fillStyle='rgba(236,234,228,.92)';
      if('letterSpacing' in ctx)ctx.letterSpacing=`${(u*.3).toFixed(1)}px`;ctx.fillText('DOF LAB',x+m+u*1.1,ym+m/2);if('letterSpacing' in ctx)ctx.letterSpacing='0px';
      ctx.font=`500 ${clamp(u*1.15,10,18)}px ${FONT}`;ctx.fillStyle='rgba(236,234,228,.66)';ctx.textAlign='right';ctx.fillText(ui('creditFull'),x+w,ym+m/2,w*.62);
      ctx.restore();ctx.textBaseline='alphabetic';ctx.textAlign='left';
    },
    /* 匯出影片的右上角署名前加上 D 字標 */
    overlay(){ctx.font=`400 11px ${FONT}`;const tw=ctx.measureText(ui('credit')+' · '+ui('scaleNote')).width;mono(cssW-12-tw-19,8,14);}
  };
})();
