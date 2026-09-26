#!/usr/bin/env python3
"""Build one self-contained animation HTML from an episode script.

usage: python build.py EPISODE.js --out OUT.html [--theme NAME]

The episode file declares the kits it needs on its first lines, e.g.
    // KITS: marine
    // KITS: land
    // KITS: marine, offshore-seq, offshore-farm
Order in the output: core → i18n → kits → episode → EPISODE.i18n.js (translations, next to the episode file) → theme → engine.
--theme NAME adds the brand layer assets/engine/theme-NAME.js / .css / .head.html (default: none = classic look).
"""
import argparse, os, re, sys
HERE=os.path.dirname(os.path.abspath(__file__));A=os.path.join(HERE,'..','assets','engine')
KIT_FILES={'marine':'kit-marine.js','offshore-dict':'kit-offshore-dict.js','land':'kit-land.js','offshore-farm':'kit-offshore-farm.js','offshore-seq':'kit-offshore-seq.js'}
ORDER=['marine','land','offshore-dict','offshore-farm','offshore-seq']
def rd(n):return open(os.path.join(A,n),encoding='utf-8').read()
ap=argparse.ArgumentParser();ap.add_argument('episode');ap.add_argument('--out',required=True);ap.add_argument('--theme',default='');a=ap.parse_args()
src=open(a.episode,encoding='utf-8').read()
kits=set()
for m in re.finditer(r'KITS:\s*([\w\-, ]+)',src[:600]):kits|={k.strip() for k in m.group(1).split(',') if k.strip()}
bad=kits-set(KIT_FILES)
if bad:sys.exit(f'unknown kit(s): {bad}; available: {list(KIT_FILES)}')
if 'offshore-seq' in kits or 'offshore-farm' in kits:kits|={'marine','offshore-dict'}
if 'marine' in kits:kits.add('offshore-dict')
tf=os.path.splitext(a.episode)[0]+'.i18n.js'
tsrc=open(tf,encoding='utf-8').read() if os.path.exists(tf) else ''
if not tsrc:print('WARNING: no translation file',tf,'- the EN/JA versions will show Chinese text')
TH={'js':'','css':'','head':''}
if a.theme:
    if not os.path.exists(os.path.join(A,f'theme-{a.theme}.js')):sys.exit(f'unknown theme: {a.theme}')
    for k,ext in [('js','.js'),('css','.css'),('head','.head.html')]:
        f=os.path.join(A,f'theme-{a.theme}{ext}')
        if os.path.exists(f):TH[k]=rd(f'theme-{a.theme}{ext}')
js='\n'.join([rd('core.js'),rd('i18n.js')]+[rd(KIT_FILES[k]) for k in ORDER if k in kits]+[src,tsrc]+([TH['js']] if TH['js'] else [])+[rd('engine.js')])
m=re.search(r"EP\s*=\s*\{[^}]*?no\s*:\s*(\d+)\s*,\s*t\s*:\s*'([^']+)'",src)
title=(f"{int(m.group(1)):02d} {m.group(2)}" if m else os.path.basename(a.episode))
m2=re.search(r"seriesName\s*:\s*'([^']+)'",src)
if m2:title+='｜'+m2.group(1)
html=rd('template.html').replace('</head>',TH['head']+'</head>',1).replace('__CSS__',rd('style.css')+('\n'+TH['css'] if TH['css'] else '')).replace('__MUXER__',rd('mp4-muxer.js')).replace('__JS__',js).replace('__TITLE__',title)
os.makedirs(os.path.dirname(os.path.abspath(a.out)),exist_ok=True)
open(a.out,'w',encoding='utf-8').write(html)
print(f'built {a.out}  ({len(html)//1024} KB, kits: {sorted(kits) or "none"}'+(f', theme: {a.theme}' if a.theme else '')+')')
