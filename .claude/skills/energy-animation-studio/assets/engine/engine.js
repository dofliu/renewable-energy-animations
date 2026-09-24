/* ================= episode engine ================= */
const hn=(i,j)=>{const s=Math.sin(i*127.1+j*311.7)*43758.5453;return s-Math.floor(s);};
const SH=EP.shots,SS=[];let TOTAL=0;SH.forEach((s,i)=>{SS[i]=TOTAL;TOTAL+=s.dur;});
let SI=0;
const P2=n=>String(n).padStart(2,'0');

/* world-space text with a minimum on-screen size */
function wt(x,y,t,size,col,weight,align,font,base){
  t=tr(t);const k=fit*cam.s,sz=Math.max(size,9.5/k);
  ctx.font=`${weight||500} ${sz}px ${font||FONT}`;ctx.textAlign=align||'left';ctx.textBaseline=base||'alphabetic';
  ctx.fillStyle=col||'#fff';ctx.fillText(t,x,y);ctx.textAlign='left';ctx.textBaseline='alphabetic';
}
function wtw(t,size,weight,font){t=tr(t);const k=fit*cam.s,sz=Math.max(size,9.5/k);ctx.font=`${weight||500} ${sz}px ${font||FONT}`;return ctx.measureText(t).width;}
function arrow(x0,y0,x1,y1,col,lw,hs){
  lw=lw||2;hs=hs||lw*4+2;const a=Math.atan2(y1-y0,x1-x0);
  ln([x0,y0,x1-Math.cos(a)*hs*.6,y1-Math.sin(a)*hs*.6],col,lw);
  poly([x1,y1,x1-Math.cos(a-.42)*hs,y1-Math.sin(a-.42)*hs,x1-Math.cos(a+.42)*hs,y1-Math.sin(a+.42)*hs],col);
}
function tag(x,y,t,o){ // filled pill in world coords
  o=o||{};const size=o.size||20,pad=size*.55,w=wtw(t,size,o.weight||700)+pad*2,h=size*1.75;
  let bx=o.align==='center'?x-w/2:o.align==='right'?x-w:x;
  rrp(bx,y-h/2,w,h,o.r===undefined?h/2:o.r);ctx.fillStyle=o.bg||'#f2c230';ctx.fill();
  wt(bx+pad,y+1,t,size,o.fg||'#13232e',o.weight||700,'left',FONT,'middle');return w;
}
function card(x,y,w,h,o){o=o||{};rrp(x,y,w,h,o.r||14);ctx.fillStyle=o.bg||'rgba(255,255,255,.06)';ctx.fill();if(o.st!==false){ctx.strokeStyle=o.st||'rgba(255,255,255,.16)';ctx.lineWidth=o.lw||1.4;ctx.stroke();}}
function diagBG(){
  applyCam({x:800,y:450,s:1});
  ctx.fillStyle='#0e2a3b';ctx.fillRect(VX0,VY0,VX1-VX0,VY1-VY0);
  ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;ctx.beginPath();
  for(let x=0;x<=W;x+=50){ctx.moveTo(x,VY0);ctx.lineTo(x,VY1);}for(let y=0;y<=H;y+=50){ctx.moveTo(VX0,y);ctx.lineTo(VX1,y);}ctx.stroke();
}
function camMix(a,b,k){return {x:lerp(a.x,b.x,k),y:lerp(a.y,b.y,k),s:lerp(a.s,b.s,k)};}
/* chart helper in world coords: axes box, returns mapper */
function chartBox(x,y,w,h,o){
  o=o||{};card(x,y,w,h,{bg:'rgba(7,27,39,.75)',r:12});
  const px=x+(o.pl||64),py=y+(o.pt||46),pw=w-(o.pl||64)-(o.pr||24),ph=h-(o.pt||46)-(o.pb||46);
  if(o.title)wt(x+18,y+32,o.title,20,'#f2c230',700);
  ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=1;ctx.beginPath();
  const gx=o.gx||5,gy=o.gy||4;for(let i=0;i<=gx;i++){ctx.moveTo(px+pw*i/gx,py);ctx.lineTo(px+pw*i/gx,py+ph);}for(let i=0;i<=gy;i++){ctx.moveTo(px,py+ph*i/gy);ctx.lineTo(px+pw,py+ph*i/gy);}ctx.stroke();
  ln([px,py,px,py+ph,px+pw,py+ph],'rgba(255,255,255,.5)',1.4);
  const X=v=>px+pw*(v-o.x0)/(o.x1-o.x0),Y=v=>py+ph-ph*(v-o.y0)/(o.y1-o.y0);
  if(o.xl)wt(px+pw,py+ph+36,o.xl,16,'rgba(227,236,238,.7)',500,'right');
  if(o.yl)wt(px,py-12,o.yl,16,'rgba(227,236,238,.7)',500,'left');
  if(o.xt)o.xt.forEach(v=>wt(X(v),py+ph+20,String(v),16,'rgba(227,236,238,.75)',600,'center',COND));
  if(o.yt)o.yt.forEach(v=>wt(px-10,Y(v)+5,String(v),16,'rgba(227,236,238,.75)',600,'right',COND));
  return {X,Y,px,py,pw,ph};
}

/* ================= localisation of episode data ================= */
function epT(){return LANG==='en'?(EP.en||EP.t):tr(EP.t);}
function epSub(){return LANG==='en'?EP.t:(EP.en||'');}
function loc(i){const s=SH[i];
  if(LANG==='zh')return {t:s.t,sub:s.en||'',d:s.d,s:s.s};
  return {t:LANG==='en'?(s.en||tr(s.t)):tr(s.t),sub:LANG==='en'?s.t:(s.en||''),d:tr(s.d),s:s.s.map(x=>[x[0],tr(x[1])])};}
function seriesLine(){if(!EP.seriesName)return '';return ui(EP.total?'series':'seriesOne',{s:tr(EP.seriesName),n:EP.no,t:EP.total||''});}
function docTitle(){return EP.seriesName?`${P2(EP.no)} ${epT()}｜${tr(EP.seriesName)}`:epT();}

/* ================= frame ================= */
function renderFrame(){
  SI=0;while(SI<SH.length-1&&T>=SS[SI+1])SI++;
  const sh=SH[SI],u=clamp((T-SS[SI])/sh.dur);U=u;TT=T;
  screenSpace();ctx.clearRect(0,0,cssW,cssH);
  if(sh.side){applyCam(sh.cam?sh.cam(u):{x:800,y:450,s:1});(sh.base||EP.base||(typeof sideBase==='function'?sideBase:()=>{}))(u);if(sh.draw)sh.draw(u);(sh.end||EP.end||(typeof sideEnd==='function'?sideEnd:()=>{}))(u);if(sh.fx)sh.fx(u);}
  else{if(sh.cam)applyCam(sh.cam(u));else applyCam({x:800,y:450,s:1});sh.draw(u);}
  drawTicks();drawLabels();if(sh.hud)sh.hud(u);
  const tin=T-SS[SI],tout=SS[SI]+sh.dur-T;let fa=0;
  if(SI>0)fa=Math.max(fa,1-tin/.45);if(SI<SH.length-1)fa=Math.max(fa,1-tout/.45);
  if(fa>0){screenSpace();ctx.fillStyle=`rgba(4,14,22,${clamp(fa)*.92})`;ctx.fillRect(0,0,cssW,cssH);}
  if(T<3.2){ // opening title
    const a=T<2.3?1:1-(T-2.3)/.9;screenSpace();ctx.fillStyle=`rgba(5,22,32,${.82*a})`;ctx.fillRect(0,0,cssW,cssH);
    ctx.globalAlpha=a;const fs=clamp(cssW/20,22,64),mw=cssW*.9;ctx.textAlign='center';ctx.textBaseline='alphabetic';
    ctx.font=`700 ${fs*1.3}px ${COND}`;ctx.fillStyle='#f2c230';ctx.fillText(P2(EP.no),cssW/2,cssH*.43);
    const tt=epT(),tfs=LANG==='en'&&tt.length>26?fs*.8:fs;
    ctx.font=`900 ${tfs}px ${FONT}`;ctx.fillStyle='#fff';ctx.fillText(tt,cssW/2,cssH*.43+fs*1.2,mw);
    ctx.font=`500 ${fs*.42}px ${LANG==='en'?FONT:COND}`;ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillText(epSub(),cssW/2,cssH*.43+fs*1.85,mw);
    ctx.globalAlpha=1;ctx.textAlign='left';
  }
}
function langText(){
  let s='0123456789 MWkVm/s%°→';
  for(const k in DICT)s+=LI<0?k:DICT[k][LI];
  SH.forEach((c,i)=>{const l=loc(i);s+=l.t+l.sub+l.d+l.s.map(x=>x[1]).join('');});
  EP.facts.forEach(f=>{s+=tr(f[0])+tr(f[1])+tr(f[2]);});s+=epT()+tr(EP.lede)+tr(EP.note)+seriesLine();
  for(const k in UI)s+=UI[k][LI+1];return s;
}
function ensureFonts(){
  if(!document.fonts||!document.fonts.load)return Promise.resolve();
  const fam=LANG==='ja'?'"Noto Sans JP"':'"Noto Sans TC"',txt=langText(),jobs=[];
  for(const w of [400,500,700,900])jobs.push(document.fonts.load(`${w} 16px ${fam}`,txt));
  if(LANG==='ja')for(const w of [500,700])jobs.push(document.fonts.load(`${w} 16px "Noto Sans TC"`,txt));
  for(const w of [500,600,700])jobs.push(document.fonts.load(`${w} 16px "Barlow Condensed"`,'0123456789 MWkV'));
  return Promise.all(jobs).then(()=>document.fonts.ready).catch(()=>{});
}

/* ================= UI controller ================= */
(function(){
  const $=id=>document.getElementById(id);
  const stage=$('stage'),tl=$('timeline'),track=$('tlTrack'),fill=$('tlFill'),head=$('tlHead'),timeEl=$('time');
  const bPlay=$('bPlay'),playIcon=$('playIcon'),cap=$('caption'),cardEl=$('chapcard');
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  let playing=!reduce,speed=1,last=0,dirty=true,ended=false,prevC=-1,prevStep=-2,dragging=false,wasPlaying=false;
  const fmt=t=>{t=Math.max(0,Math.floor(t));return Math.floor(t/60)+':'+P2(t%60);};
  $('mNo').textContent=P2(EP.no);
  SH.forEach(c=>{const d=document.createElement('div');d.className='tl-seg';d.style.flex=c.dur+' 0 0';track.insertBefore(d,fill);});
  const grid=$('shotGrid');
  SH.forEach((c,i)=>{const b=document.createElement('button');b.className='chap';b.type='button';b.innerHTML=`<span class="n">${i+1}</span><span class="t"></span>`;b.addEventListener('click',()=>jump(SS[i]+.001));grid.appendChild(b);});
  const btns=[...grid.children];
  function fillStatic(){
    $('mT').textContent=epT();$('mLede').textContent=tr(EP.lede);$('mSeries').textContent=seriesLine();
    $('facts').innerHTML='';EP.facts.forEach(f=>{const d=document.createElement('div');d.className='fact';const dt=document.createElement('dt');dt.textContent=tr(f[0]);const sm=document.createElement('small');sm.textContent=tr(f[1]);dt.appendChild(sm);const dd=document.createElement('dd');dd.textContent=tr(f[2]);d.append(dt,dd);$('facts').appendChild(d);});
    $('foot').textContent=tr(EP.note);$('cv').setAttribute('aria-label',docTitle());
    btns.forEach((b,i)=>{b.querySelector('.t').textContent=loc(i).t;});
  }
  function resize(){const r=cv.getBoundingClientRect();if(r.width<2)return;cssW=r.width;cssH=r.height;dpr=Math.min(window.devicePixelRatio||1,2);cv.width=Math.round(cssW*dpr);cv.height=Math.round(cssH*dpr);fit=cssW/W;dirty=true;}
  if(window.ResizeObserver)new ResizeObserver(resize).observe(cv);else window.addEventListener('resize',resize);
  resize();
  function setPlayIcon(){
    playIcon.innerHTML=playing?'<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>':(ended?'<path d="M12 5a7 7 0 1 1-6.6 4.7l1.9.7A5 5 0 1 0 12 7v3L7.5 6 12 2z"/>':'<path d="M7 4.5v15l12-7.5z"/>');
    bPlay.setAttribute('aria-label',playing?ui('pause'):(ended?ui('replay'):ui('play')));
  }
  function jump(t){T=clamp(t,0,TOTAL-.001);ended=false;dirty=true;setPlayIcon();}
  function togglePlay(){if(ended){T=0;ended=false;playing=true;}else playing=!playing;setPlayIcon();dirty=true;}
  bPlay.addEventListener('click',togglePlay);
  const idx=()=>{let c=0;while(c<SH.length-1&&T>=SS[c+1])c++;return c;};
  $('bPrev').addEventListener('click',()=>{const c=idx();jump(T-SS[c]>1.5?SS[c]+.001:SS[Math.max(0,c-1)]+.001);});
  $('bNext').addEventListener('click',()=>{const c=idx();if(c<SH.length-1)jump(SS[c+1]+.001);else jump(TOTAL-.01);});
  document.querySelectorAll('[data-speed]').forEach(b=>b.addEventListener('click',()=>{speed=+b.dataset.speed;document.querySelectorAll('[data-speed]').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));}));
  const bLab=$('bLabels');bLab.addEventListener('click',()=>{SHOWLAB=!SHOWLAB;bLab.setAttribute('aria-pressed',SHOWLAB?'true':'false');dirty=true;});
  $('bFull').addEventListener('click',()=>{const d=document;if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d);}else{const f=stage.requestFullscreen||stage.webkitRequestFullscreen;if(f)f.call(stage);}});
  document.addEventListener('fullscreenchange',()=>setTimeout(resize,60));
  function tlFrac(e){const r=track.getBoundingClientRect();return clamp((e.clientX-r.left)/r.width);}
  tl.addEventListener('pointerdown',e=>{dragging=true;wasPlaying=playing;playing=false;tl.setPointerCapture(e.pointerId);jump(tlFrac(e)*TOTAL);});
  tl.addEventListener('pointermove',e=>{if(dragging)jump(tlFrac(e)*TOTAL);});
  const endDrag=()=>{if(!dragging)return;dragging=false;playing=wasPlaying;setPlayIcon();};
  tl.addEventListener('pointerup',endDrag);tl.addEventListener('pointercancel',endDrag);
  tl.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){jump(T-5);e.preventDefault();e.stopPropagation();}
    else if(e.key==='ArrowRight'){jump(T+5);e.preventDefault();e.stopPropagation();}
    else if(e.key==='Home'){jump(0);e.preventDefault();}else if(e.key==='End'){jump(TOTAL-.01);e.preventDefault();}
  });
  document.addEventListener('keydown',e=>{
    const tag=(e.target.tagName||'').toLowerCase();if($('recDlg').open)return;if(tag==='input'||tag==='textarea')return;
    if(e.key===' '||e.code==='Space'){if(tag==='button')return;e.preventDefault();togglePlay();}
    else if(e.key==='ArrowLeft'&&e.target!==tl){$('bPrev').click();}else if(e.key==='ArrowRight'&&e.target!==tl){$('bNext').click();}
  });
  function updateUI(){
    const c=SI,L=loc(c),f=T/TOTAL*100;
    fill.style.width=f+'%';head.style.left=f+'%';
    tl.setAttribute('aria-valuenow',Math.round(f));tl.setAttribute('aria-valuetext',`${c+1} ${L.t}${ui('sep')}${fmt(T)}`);
    timeEl.textContent=fmt(T)+' / '+fmt(TOTAL);
    if(c!==prevC){
      prevC=c;prevStep=-2;cardEl.classList.remove('show');
      setTimeout(()=>{$('ccNo').innerHTML=`${P2(EP.no)}<small>${ui('shotOf',{i:c+1,n:SH.length})}</small>`;$('ccT').textContent=L.t;$('ccE').textContent=L.sub;cardEl.classList.add('show');},reduce?0:180);
      $('iNo').textContent=c+1;$('iT').textContent=L.t;$('iE').textContent=L.sub;$('iD').textContent=L.d;
      $('iS').innerHTML='';L.s.forEach(s=>{const li=document.createElement('li');li.textContent=s[1];$('iS').appendChild(li);});
      btns.forEach((b,i)=>{b.classList.toggle('active',i===c);b.classList.toggle('past',i<c);if(i===c)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
    }
    let si=0;L.s.forEach((s,i)=>{if(U>=s[0])si=i;});
    if(si!==prevStep){prevStep=si;cap.innerHTML='<span class="dot"></span>';cap.appendChild(document.createTextNode(L.s[si][1]));[...$('iS').children].forEach((li,i)=>{li.className=i<si?'done':i===si?'now':'';});}
  }

  /* ---------- language ---------- */
  function setLang(l,save){
    LANG=LANGS.includes(l)?l:'zh';LI=LANG==='zh'?-1:LANG==='en'?0:1;
    document.documentElement.lang=LANG==='zh'?'zh-Hant-TW':LANG;
    FONT=LANG==='ja'?FONT_JP:FONT_TC;
    COND='"Barlow Condensed","Arial Narrow",'+(LANG==='ja'?'"Noto Sans JP",':'')+'"Noto Sans TC","Noto Sans CJK TC",sans-serif';
    document.title=docTitle();
    document.querySelectorAll('[data-i18n]').forEach(e=>{e.textContent=ui(e.dataset.i18n);});
    document.querySelectorAll('[data-i18n-aria]').forEach(e=>e.setAttribute('aria-label',ui(e.dataset.i18nAria)));
    document.querySelectorAll('[data-i18n-title]').forEach(e=>{e.title=ui(e.dataset.i18nTitle);});
    document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===LANG?'true':'false'));
    fillStatic();prevC=-1;prevStep=-2;setPlayIcon();dirty=true;
    if(recDlg.open)recSummary();
    if(save){try{localStorage.setItem(LANG_KEY,LANG);}catch(e){}}
    document.dispatchEvent(new CustomEvent('langchange',{detail:LANG}));
    ensureFonts().then(()=>{dirty=true;});
  }
  document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{if(!recBusy)setLang(b.dataset.lang,true);}));

  /* ---------- MP4 export (offline, frame-accurate: WebCodecs + mp4-muxer) ---------- */
  const recDlg=$('recDlg'),recGo=$('recGo'),recCancel=$('recCancel'),recDl=$('recDl'),recSum=$('recSum'),recProg=$('recProg'),recBar=$('recBar'),recStat=$('recStat'),recPrev=$('recPrev'),recNote=$('recNote');
  const REC={speed:1,range:'all',res:1080,fps:30};
  let recBusy=false,recAbort=false,recUrl=null,recChap=0;
  const LW=1280,LH=720;
  recDlg.querySelectorAll('[data-opt]').forEach(g=>g.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
    if(recBusy)return;const k=g.dataset.opt;REC[k]=k==='range'?b.dataset.v:+b.dataset.v;
    g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));recSummary();})));
  function recSpan(){return REC.range==='chap'?[SS[recChap],SS[recChap]+SH[recChap].dur]:[0,TOTAL];}
  function recBitrate(){return (REC.res>=1080?8e6:5e6)*(REC.fps>30?1.5:1);}
  function recSummary(){
    const [t0,t1]=recSpan(),d=(t1-t0)/REC.speed,f=Math.ceil(d*REC.fps),m=Math.ceil(recBitrate()*d/8/1e6);
    let s=ui('sum',{d:fmt(d),f:f.toLocaleString('en-US'),m:m});
    if(REC.range==='chap')s+=ui('sumChap',{c:(recChap+1)+' '+loc(recChap).t});
    recSum.textContent=s;
  }
  function recStatus(msg,err){recStat.textContent=msg;recStat.classList.toggle('err',!!err);}
  $('bRec').addEventListener('click',()=>{
    recChap=idx();playing=false;setPlayIcon();
    if(!recBusy){recProg.hidden=true;recDl.hidden=true;recStatus('');recGo.textContent=ui('start');}
    recSummary();if(recDlg.showModal)recDlg.showModal();else recDlg.setAttribute('open','');
  });
  $('recX').addEventListener('click',()=>{if(recBusy)recAbort=true;recDlg.close();});
  recDlg.addEventListener('cancel',e=>{if(recBusy)e.preventDefault();});
  recCancel.addEventListener('click',()=>{recAbort=true;});
  recGo.addEventListener('click',()=>{if(!recBusy)recordVideo();});
  const mch=new MessageChannel(),mq=[];mch.port1.onmessage=()=>{const f=mq.shift();if(f)f();};
  const yieldNow=()=>new Promise(r=>{mq.push(r);mch.port2.postMessage(0);});
  const breathe=()=>document.hidden?yieldNow():new Promise(r=>setTimeout(r,0));
  function wrapLines(text,maxW){
    const toks=text.match(/[A-Za-z0-9À-ÿ().,:;'’"%°–\-\/+&]+\s*|\s+|\S/g)||[];
    const out=[];let cur='';
    for(const t of toks){const next=cur+t;if(cur.trim()&&ctx.measureText(next.trimEnd()).width>maxW){out.push(cur.trimEnd());cur=t.trimStart();}else cur=next;}
    if(cur.trim())out.push(cur.trimEnd());return out.length?out:[''];
  }
  /* the chapter card, caption and scale note live in HTML on the page, so the video draws them onto the canvas */
  function drawOverlays(spd){
    screenSpace();const c=SI,L=loc(c);
    const vt=(T-SS[c])/spd,a=clamp((vt-.18)/.5);
    if(a>0&&T>=3.2){
      ctx.save();ctx.globalAlpha=a;ctx.translate(0,-6*(1-a));
      const x0=clamp(cssW*.02,10,22),y0=clamp(cssW*.02,10,20),nS=clamp(cssW*.046,30,58),tS=clamp(cssW*.021,15,26),eS=clamp(cssW*.0135,12,17);
      const inner=tS*1.2+eS*1.6,bh=Math.max(nS*.9,inner),no=P2(EP.no),sub=ui('shotOf',{i:c+1,n:SH.length});
      ctx.textBaseline='alphabetic';ctx.textAlign='left';ctx.font=`700 ${nS}px ${COND}`;const nw=ctx.measureText(no).width;
      ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=12;ctx.shadowOffsetY=2;ctx.fillStyle='#f2c230';ctx.fillText(no,x0,y0+nS*.78);
      ctx.font=`600 ${nS*.42}px ${COND}`;ctx.fillStyle='rgba(255,255,255,.75)';ctx.fillText(sub,x0+nw+4,y0+nS*.78);const sw=ctx.measureText(sub).width;
      const bx=x0+nw+sw+14;ctx.shadowColor='transparent';ctx.fillStyle='#f2c230';ctx.fillRect(bx,y0,3,bh);
      const tx=bx+15,ty=y0+(bh-inner)/2;
      ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=10;ctx.font=`900 ${tS}px ${FONT}`;ctx.fillStyle='#fff';ctx.fillText(L.t,tx,ty+tS*.98,cssW*.6);
      ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=6;ctx.shadowOffsetY=1;ctx.font=`500 ${eS}px ${COND}`;ctx.fillStyle='rgba(255,255,255,.82)';ctx.fillText(L.sub,tx,ty+tS*1.2+eS*1.12,cssW*.6);
      ctx.restore();
    }
    if(cssW>=820){ctx.font=`400 11px ${FONT}`;ctx.textAlign='right';ctx.textBaseline='top';ctx.fillStyle='rgba(255,255,255,.62)';ctx.fillText(ui('scaleNote'),cssW-12,10);ctx.textAlign='left';}
    if(T<3.2)return;
    let si=0;L.s.forEach((s,i)=>{if(U>=s[0])si=i;});
    const fs=clamp(cssW*.015,12,17),lh=fs*1.6,px=16,py=7,dotW=16,maxBox=Math.min(cssW*.88,760);
    ctx.font=`500 ${fs}px ${FONT}`;
    const lines=wrapLines(L.s[si][1],maxBox-px*2-dotW);
    const tw=Math.max(...lines.map((l,i)=>ctx.measureText(l).width+(i?0:dotW)));
    const bw=Math.min(maxBox,tw+px*2),bh=lines.length*lh+py*2,bx=(cssW-bw)/2,by=cssH-clamp(cssW*.018,8,20)-bh;
    rrp(bx,by,bw,bh,10);ctx.fillStyle='rgba(7,26,37,.78)';ctx.fill();
    ctx.textBaseline='middle';ctx.textAlign='left';
    lines.forEach((l,i)=>{const w=ctx.measureText(l).width+(i?0:dotW),lx=(cssW-w)/2,ly=by+py+lh*(i+.5);
      if(!i){circ(lx+4,ly,4,'#f2c230');}ctx.fillStyle='#f2f6f7';ctx.fillText(l,lx+(i?0:dotW),ly+.5);});
  }
  function renderExportFrame(ectx,t,spd,d){
    const sv={ctx,cssW,cssH,dpr,fit,T};
    ctx=ectx;cssW=LW;cssH=LH;dpr=d;fit=cssW/W;T=t;
    try{renderFrame();drawOverlays(spd);}
    finally{ctx=sv.ctx;cssW=sv.cssW;cssH=sv.cssH;dpr=sv.dpr;fit=sv.fit;T=sv.T;}
  }
  async function pickConfig(w,h,fps,br){
    const list=[['avc','avc1.640033'],['avc','avc1.64002A'],['avc','avc1.640028'],['avc','avc1.4D4033'],['avc','avc1.4D402A'],['avc','avc1.4D4028'],['avc','avc1.42E033'],['avc','avc1.42E02A'],['avc','avc1.42E028'],['avc','avc1.42001F'],
      ['vp9','vp09.00.40.08'],['vp9','vp09.00.31.08'],['av1','av01.0.08M.08'],['av1','av01.0.05M.08']];
    for(const [mux,codec] of list){const cfg={codec,width:w,height:h,bitrate:br,framerate:fps};if(mux==='avc')cfg.avc={format:'avc'};
      try{const r=await VideoEncoder.isConfigSupported(cfg);if(r&&r.supported)return {mux,cfg};}catch(e){}}
    return null;
  }
  async function recordVideo(){
    recProg.hidden=false;recDl.hidden=true;recBar.style.width='0%';
    if(typeof VideoEncoder==='undefined'||typeof VideoFrame==='undefined'||typeof Mp4Muxer==='undefined'){recNote.hidden=true;recStatus(ui('stNoSup'),true);return;}
    recBusy=true;recAbort=false;recNote.hidden=false;recGo.disabled=true;recCancel.hidden=false;recDlg.classList.add('busy');
    if(recUrl){URL.revokeObjectURL(recUrl);recUrl=null;}
    recStatus(ui('stPrep'));
    const d=REC.res/720,VW=Math.round(LW*d/2)*2,VH=Math.round(LH*d/2)*2,fps=REC.fps,spd=REC.speed,[t0,t1]=recSpan();
    const n=Math.ceil((t1-t0)/spd*fps),us=1e6/fps,keyEvery=fps*2;
    let enc=null,encErr=null;
    try{
      await ensureFonts();
      const pick=await pickConfig(VW,VH,fps,recBitrate());
      if(!pick)throw new Error('__nocodec');const cfg=pick.cfg;
      const muxer=new Mp4Muxer.Muxer({target:new Mp4Muxer.ArrayBufferTarget(),video:{codec:pick.mux,width:VW,height:VH,frameRate:fps},fastStart:'in-memory',firstTimestampBehavior:'offset'});
      enc=new VideoEncoder({output:(chunk,meta)=>muxer.addVideoChunk(chunk,meta),error:e=>{encErr=e;}});
      enc.configure(cfg);
      const ec=document.createElement('canvas');ec.width=VW;ec.height=VH;
      const ectx=ec.getContext('2d',{alpha:false}),pctx=recPrev.getContext('2d');
      const t0ms=performance.now();let lastUI=0;
      for(let i=0;i<n;i++){
        if(recAbort||encErr)break;
        const t=Math.min(t0+i/fps*spd,t1-.001);
        renderExportFrame(ectx,t,spd,d);
        const fr=new VideoFrame(ec,{timestamp:Math.round(i*us),duration:Math.round(us)});
        enc.encode(fr,{keyFrame:i%keyEvery===0});fr.close();
        while(enc.encodeQueueSize>6&&!encErr&&!recAbort)await yieldNow();
        const now=performance.now();
        if(now-lastUI>150||i===n-1){lastUI=now;const p=(i+1)/n,el=(now-t0ms)/1000;recBar.style.width=(p*100).toFixed(1)+'%';recStatus(ui('stRun',{p:Math.floor(p*100),e:fmt(el/p-el)}));pctx.drawImage(ec,0,0,recPrev.width,recPrev.height);await breathe();}
      }
      if(encErr)throw encErr;
      if(recAbort){try{enc.close();}catch(e){}recBar.style.width='0%';recStatus(ui('stCancel'));return;}
      recStatus(ui('stFin'));await breathe();
      await enc.flush();if(encErr)throw encErr;enc.close();
      muxer.finalize();
      const blob=new Blob([muxer.target.buffer],{type:'video/mp4'});
      recUrl=URL.createObjectURL(blob);recDl.href=recUrl;
      recDl.download=`${EP.slug||'episode'}-${P2(EP.no)}_${LANG}_${REC.range==='chap'?'shot'+P2(recChap+1)+'_':''}${spd}x_${REC.res}p${fps}.mp4`;
      recDl.hidden=false;recDl.click();
      recStatus(ui('stDone',{s:(blob.size/1048576).toFixed(1)})+(pick.mux==='avc'?'':' '+ui('stAlt',{c:pick.mux.toUpperCase()})));recGo.textContent=ui('again');
    }catch(e){
      const msg=e&&e.message;recStatus(msg==='__nocodec'?ui('stNoCodec'):ui('stErr')+(msg||String(e)),true);
      try{if(enc&&enc.state!=='closed')enc.close();}catch(_){}
    }finally{
      recBusy=false;recGo.disabled=false;recCancel.hidden=true;recNote.hidden=true;recDlg.classList.remove('busy');dirty=true;
    }
  }

  function loop(ts){
    const dt=last?Math.min(.1,(ts-last)/1000):0;last=ts;
    if(playing&&!ended){T+=dt*speed;if(T>=TOTAL){T=TOTAL-.001;ended=true;playing=false;setPlayIcon();}dirty=true;}
    if(dirty&&cssW>2){renderFrame();updateUI();dirty=false;}
    requestAnimationFrame(loop);
  }
  let initLang='zh';
  try{const q=(new URLSearchParams(location.search).get('lang')||'').slice(0,2).toLowerCase(),sv=localStorage.getItem(LANG_KEY)||localStorage.getItem('owf-lang'),nv=(navigator.language||'').toLowerCase();
    initLang=LANGS.includes(q)?q:LANGS.includes(sv)?sv:nv.startsWith('ja')?'ja':nv.startsWith('zh')?'zh':nv.startsWith('en')?'en':'zh';}catch(e){}
  setLang(initLang,false);
  setPlayIcon();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{dirty=true;});
  window.__ow={seek:t=>{T=t;dirty=true;},pause:()=>{playing=false;setPlayIcon();},shot:i=>{T=SS[i]+.5;dirty=true;},setLang:l=>setLang(l,false),keep:()=>[EP.t,...SH.map(s=>s.t),...QA_KEEP],get T(){return T;},SS,TOTAL};
  requestAnimationFrame(loop);
})();
