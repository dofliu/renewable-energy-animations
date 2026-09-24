#!/usr/bin/env python3
"""QA an animation HTML in every language.

usage: python qa.py FILE.html [--outdir DIR] [--langs zh,en,ja] [--width 1100]

For each language it scans the whole timeline and reports
  - runtime errors
  - untranslated text: in EN, any Chinese/Japanese characters drawn on the canvas or shown in the page;
    in JA, canvas strings that are identical to the Chinese version (probably missing from the dictionary)
It saves DIR/<name>_<lang>_NN.png frames (zh: two per shot; en/ja: one per shot) and a contact sheet
DIR/<name>_<lang>_sheet.png for each language. Exit code 1 if errors or untranslated strings were found.
The Google Fonts 403 console message when offline is harmless and ignored.
"""
import argparse, os, sys, re
from playwright.sync_api import sync_playwright
from PIL import Image
ap=argparse.ArgumentParser();ap.add_argument('html');ap.add_argument('--outdir',default='qa');ap.add_argument('--langs',default='zh,en,ja');ap.add_argument('--width',type=int,default=1100);a=ap.parse_args()
os.makedirs(a.outdir,exist_ok=True);name=os.path.splitext(os.path.basename(a.html))[0]
CJK=re.compile(r'[\u3000-\u9fff\uff00-\uffef]')
HOOK="""(()=>{window.__drawn=new Set();const f=CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText=function(t,...r){try{window.__drawn.add(String(t));}catch(e){}return f.call(this,t,...r);};})();"""
DOMSEL='#mT,#mLede,#mSeries,#iT,#iD,#iS,#caption,#facts,#foot,#shotGrid,[data-i18n]'
bad=False;drawn={}
def sheet(files,out):
    ims=[Image.open(f) for f in files];w,h=ims[0].size;W2,H2=w//2,h//2;rows=(len(ims)+1)//2
    s=Image.new('RGB',(W2*2,H2*rows),'white')
    for i,im in enumerate(ims):s.paste(im.resize((W2,H2)),((i%2)*W2,(i//2)*H2))
    s.save(out);return out
with sync_playwright() as p:
    b=p.chromium.launch()
    for lang in a.langs.split(','):
        errs=[];pg=b.new_page(viewport={'width':a.width,'height':900});pg.add_init_script(HOOK)
        pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load resource' not in m.text else None)
        pg.goto('file://'+os.path.abspath(a.html)+'?lang='+lang);pg.wait_for_timeout(700)
        try:pg.evaluate('__ow.pause()')
        except Exception as e:print(lang,'engine did not start:',e,errs);bad=True;continue
        SS=pg.evaluate('__ow.SS');tot=pg.evaluate('__ow.TOTAL');bounds=SS+[tot]
        dom=set()
        t=0.2
        while t<tot:
            pg.evaluate(f'__ow.seek({t})');pg.wait_for_timeout(22)
            if lang=='en':
                for tx in pg.evaluate(f"[...document.querySelectorAll('{DOMSEL}')].map(e=>e.innerText)"):
                    for line in tx.split('\n'):
                        if CJK.search(line):dom.add(line.strip())
            t+=1.2
        files=[]
        for i in range(len(SS)):
            d=bounds[i+1]-bounds[i]
            for f in ((.35,.8) if lang=='zh' else (.6,)):
                pg.evaluate(f'__ow.seek({bounds[i]+d*f})');pg.wait_for_timeout(260)
                fn=os.path.join(a.outdir,f'{name}_{lang}_{len(files):02d}.png');pg.locator('#stage').screenshot(path=fn);files.append(fn)
        drawn[lang]=set(pg.evaluate('[...window.__drawn]'))
        keep=set(pg.evaluate('__ow.keep()'))
        dom-=keep;drawn[lang]-=keep
        sp=sheet(files,os.path.join(a.outdir,f'{name}_{lang}_sheet.png'))
        miss=[]
        if lang=='en':miss=sorted({s for s in drawn[lang] if CJK.search(s)}|dom)
        if lang=='ja' and 'zh' in drawn:
            same=set(pg.evaluate('Object.values(DICT).map(v=>v[1])'))  # JA identical to Chinese on purpose
            miss=sorted(s for s in drawn[lang]&drawn['zh'] if CJK.search(s) and len(s)>1 and s not in same)
        print(f'[{lang}] {len(SS)} shots, {tot:.0f} s, sheet → {sp}')
        print(f'[{lang}] runtime errors:',errs if errs else 'none')
        if miss:print(f'[{lang}] untranslated ({len(miss)}):');[print('    ',m) for m in miss[:80]]
        else:print(f'[{lang}] untranslated: none')
        bad=bad or bool(errs) or bool(miss)
        pg.close()
    b.close()
sys.exit(1 if bad else 0)
