#!/usr/bin/env python3
"""Regenerate the GitHub Pages site from catalog.json.

usage: python site_build.py --site SITE_DIR

Reads SITE_DIR/catalog.json and writes:
  SITE_DIR/index.html              portal with one card per topic
  SITE_DIR/<slug>/index.html       topic page (optional overview + grouped episodes)
and (re)injects the top navigation bar into every overview/episode HTML listed in the catalog.
Safe to run repeatedly: the old nav bar is replaced, never duplicated.
Episode durations are read from the HTML when the catalog omits "dur".
"""
import argparse, json, os, re, html as H
ap=argparse.ArgumentParser();ap.add_argument('--site',required=True);a=ap.parse_args()
R=a.site;cat=json.load(open(os.path.join(R,'catalog.json'),encoding='utf-8'))
e=H.escape
LANGS=['zh','en','ja']
def L(v):
    '''catalog text may be a plain string (Chinese only) or {"zh":..,"en":..,"ja":..}'''
    if isinstance(v,dict):return {k:(v.get(k) or v.get('zh') or '') for k in LANGS}
    return {k:(v or '') for k in LANGS}
def T(v,tag='span',cls=''):
    d=L(v);c=f' class="{cls}"' if cls else ''
    return f'<{tag}{c} data-zh="{e(d["zh"])}" data-en="{e(d["en"])}" data-ja="{e(d["ja"])}">{e(d["zh"])}</{tag}>'
LANGSW='<div class="langsw" role="group" aria-label="Language"><button type="button" data-lang="zh" lang="zh-Hant">中文</button><button type="button" data-lang="en" lang="en">EN</button><button type="button" data-lang="ja" lang="ja">日本語</button></div>'
LANGJS='''<script>(function(){var K='rea-lang',LS=['zh','en','ja'];
function cur(){try{var q=(new URLSearchParams(location.search).get('lang')||'').slice(0,2).toLowerCase();if(LS.indexOf(q)>=0)return q;var s=localStorage.getItem(K)||localStorage.getItem('owf-lang');if(LS.indexOf(s)>=0)return s;var n=(navigator.language||'').toLowerCase();return n.indexOf('ja')==0?'ja':n.indexOf('en')==0?'en':'zh';}catch(e){return 'zh';}}
function apply(l){document.querySelectorAll('[data-zh]').forEach(function(el){var v=el.getAttribute('data-'+l);el.textContent=v||el.getAttribute('data-zh');});
 var t=document.querySelector('title[data-zh]');if(t)document.title=t.getAttribute('data-'+l)||t.getAttribute('data-zh');
 if(!document.getElementById('cv'))document.documentElement.lang=l==='zh'?'zh-Hant-TW':l;
 document.querySelectorAll('.langsw [data-lang]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-lang')===l?'true':'false');});}
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-lang]');if(!b)return;var l=b.getAttribute('data-lang');try{localStorage.setItem(K,l);}catch(e){}setTimeout(function(){apply(l);},0);});
document.addEventListener('langchange',function(ev){apply(ev.detail);});
apply(cur());})();</script>'''
ICON='<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E🌊%3C/text%3E%3C/svg%3E">'
NAVCSS='<style id="topnav-css">.topnav [hidden]{display:none}.topnav{display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;font-size:14px;margin:0 0 10px}.topnav a{color:var(--sea);text-decoration:none;font-weight:700}.topnav a:hover{text-decoration:underline}.topnav a:focus-visible{outline:3px solid var(--signal);outline-offset:2px;border-radius:4px}.topnav .sp{flex:1}</style>'
BASECSS=''':root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);--bg:#e7eeec;--surface:#f6f9f8;--ink:#13232e;--muted:#4f6470;--line:#c5d3d2;--sea:#1f7f99;--signal:#f2c230;--chart:#0e2a3b;--sans:"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;--cond:"Barlow Condensed","Arial Narrow",sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#08202d;--surface:#0e2a3b;--ink:#e3ecee;--muted:#93aab4;--line:#1f4254;--sea:#58b8d0}}
:root[data-theme="dark"]{--bg:#08202d;--surface:#0e2a3b;--ink:#e3ecee;--muted:#93aab4;--line:#1f4254;--sea:#58b8d0}
*,*::before,*::after{box-sizing:inherit}html{scroll-padding-top:env(safe-area-inset-top,0px)}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.6;-webkit-font-smoothing:antialiased}
.wrap{max-width:900px;margin:0 auto;padding:28px clamp(14px,4vw,32px) 56px}a:focus-visible{outline:3px solid var(--signal);outline-offset:2px}
h1{font-size:clamp(30px,5.5vw,48px);font-weight:900;margin:0 0 10px;line-height:1.2}.lede{color:var(--muted);max-width:60ch;margin:0 0 28px;font-size:16px}
h2{font-size:14px;color:var(--muted);font-weight:700;margin:30px 0 10px}.foot{margin-top:36px;font-size:13px;color:var(--muted);max-width:70ch}
.crumb{font-size:14px;margin:0 0 14px}.crumb a{color:var(--sea);font-weight:700;text-decoration:none}
.ep,.hero{display:grid;grid-template-columns:56px 1fr auto;align-items:center;gap:14px;padding:12px 16px;margin-bottom:8px;background:var(--surface);border:1px solid var(--line);border-radius:12px;color:inherit;text-decoration:none}
.ep:hover,.hero:hover,.topic:hover{border-color:var(--sea)}.n{font-family:var(--cond);font-weight:700;font-size:30px;color:var(--sea);line-height:1}
.t b{display:block;font-size:17px}.t i{font-style:normal;font-size:14px;color:var(--muted)}.d{font-family:var(--cond);font-weight:600;font-size:16px;color:var(--muted);font-variant-numeric:tabular-nums}
.hero{background:var(--chart);border-color:var(--chart);color:#fff;padding:18px}.hero .n{color:var(--signal)}.hero .t i,.hero .d{color:rgba(255,255,255,.75)}
.topics{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:8px}
.topic{display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden;color:inherit;text-decoration:none}
.topic .th{display:block;aspect-ratio:320/150;background:var(--chart);overflow:hidden}.topic .th svg,.topic .th img{display:block;width:100%;height:100%;object-fit:cover}
.topic .th .ph{display:grid;place-items:center;height:100%;color:#f2c230;font-weight:900;font-size:34px}
.topic .body{padding:14px 16px 16px}.topic b{font-size:20px;display:block}.topic p{margin:4px 0 10px;color:var(--muted);font-size:14px}.topic .meta{font-family:var(--cond);font-weight:600;color:var(--sea);font-size:15px}'''
def head(t):return f'<!DOCTYPE html><html lang="zh-Hant-TW"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{e(t)}</title>{ICON}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Noto+Sans+TC:wght@400;500;700;900&display=swap" rel="stylesheet"><style>{BASECSS}</style></head><body><div class="wrap">'
def dur_of(path):
    try:s=open(path,encoding='utf-8').read()
    except FileNotFoundError:return None
    ds=[int(x) for x in re.findall(r"\{t:'[^']*',en:'[^']*',dur:(\d+)",s)]
    if not ds:return None
    t=sum(ds);return f'{t//60}:{t%60:02d}'
def inject(path,nav):
    s=open(path,encoding='utf-8').read()
    s=re.sub(r'<nav class="topnav".*?</nav>\n?','',s,flags=re.S)
    s=re.sub(r'<style(?: id="topnav-css")?>\.topnav.*?</style>','',s,flags=re.S)
    s=re.sub(r'<script id="topnav-js">.*?</script>','',s,flags=re.S)
    s=s.replace("'owf-lang'","'rea-lang'")  # one language setting for the whole site
    if 'rel="icon"' not in s:s=s.replace('</head>',ICON+'</head>',1)
    s=s.replace('</head>',NAVCSS+'</head>',1).replace('<div class="wrap">','<div class="wrap">\n'+nav,1)
    s=s.replace('</body>',LANGJS.replace('<script>','<script id="topnav-js">',1)+'</body>',1)
    open(path,'w',encoding='utf-8').write(s)
SITE=L(cat.get('siteTitle','再生能源動畫館'));cards=''
UIT={'series':{'zh':'{t}系列','en':'{t} series','ja':'{t}シリーズ'},'first':{'zh':'先看全貌','en':'Start with the overview','ja':'まずは全体像'},
 'topics':{'zh':'主題','en':'Topics','ja':'テーマ'},'back':{'zh':'回到本系列 →','en':'Back to the series →','ja':'シリーズへ戻る →'},
 'meta':{'zh':'{o}{n} 集','en':'{o}{n} episodes','ja':'{o}全 {n} 話'},'ov':{'zh':'1 支總覽＋','en':'overview + ','ja':'総集編＋'}}
def fmt(key,**kw):
    out={}
    for l in LANGS:
        t=UIT[key][l]
        for k,v in kw.items():t=t.replace('{'+k+'}',v[l] if isinstance(v,dict) else str(v))
        out[l]=t
    return out
def cat_(a,b):return {l:a[l]+b[l] for l in LANGS}
def titleTag(v):d=L(v);return f'<title data-zh="{e(d["zh"])}" data-en="{e(d["en"])}" data-ja="{e(d["ja"])}">{e(d["zh"])}</title>'
def head2(v):return head(L(v)['zh']).replace(f'<title>{e(L(v)["zh"])}</title>',titleTag(v),1)
HEADCSS='.masthead2{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}.langsw{display:inline-flex;border:1px solid var(--line);border-radius:10px;overflow:hidden;height:36px;background:var(--surface)}.langsw button{appearance:none;border:0;background:transparent;color:var(--muted);font:inherit;font-size:13px;font-weight:500;padding:0 12px;cursor:pointer}.langsw button+button{border-left:1px solid var(--line)}.langsw button[aria-pressed="true"]{background:var(--chart);color:#fff}.langsw button:focus-visible{outline:3px solid var(--signal);outline-offset:-3px}'
missing=[]
for tp in cat['topics']:
    slug=tp['slug'];D=os.path.join(R,slug);eps=[x for g in tp.get('groups',[]) for x in g['episodes']]
    TT=L(tp['title']);ST=fmt('series',t=TT)
    for x in eps+([tp['overview']] if tp.get('overview') else []):
        if not os.path.exists(os.path.join(D,x['file'])):missing.append(f'{slug}/{x["file"]}')
    base=f'<a href="../index.html">{T(SITE)}</a><a href="index.html">{T(ST)}</a><span class="sp"></span>'
    order=([tp['overview']] if tp.get('overview') else [])+eps
    def lab(y):
        n=f'{y["no"]:02d} ' if 'no' in y else '';d=L(y['title']);return {l:n+d[l] for l in LANGS}
    for i,x in enumerate(order):
        p=os.path.join(D,x['file'])
        if not os.path.exists(p):continue
        prv=order[i-1] if i else None;nxt=order[i+1] if i+1<len(order) else None
        nav=f'<nav class="topnav" aria-label="Series">{base}'+(f'<a href="{prv["file"]}">{T(cat_({l:"← " for l in LANGS},lab(prv)))}</a>' if prv else '')+(f'<a href="{nxt["file"]}">{T(cat_(lab(nxt),{l:" →" for l in LANGS}))}</a>' if nxt else f'<a href="index.html">{T(UIT["back"])}</a>')+'</nav>'
        inject(p,nav)
    rows=''
    if tp.get('overview'):
        o=tp['overview'];d=o.get('dur') or dur_of(os.path.join(D,o['file'])) or ''
        rows+=f'<h2>{T(UIT["first"])}</h2>\n<a class="hero" href="{o["file"]}"><span class="n">▶</span><span class="t">{T(o["title"],"b")}{T(o.get("sub",""),"i")}</span><span class="d">{d}</span></a>\n'
    for g in tp.get('groups',[]):
        if g.get('name'):rows+=f'<h2>{T(g["name"])}</h2>\n'
        for x in g['episodes']:
            d=x.get('dur') or dur_of(os.path.join(D,x['file'])) or ''
            n=f'{x["no"]:02d}' if 'no' in x else '▶'
            rows+=f'<a class="ep" href="{x["file"]}"><span class="n">{n}</span><span class="t">{T(x["title"],"b")}{T(x.get("sub",""),"i")}</span><span class="d">{d}</span></a>\n'
    page=head2(cat_(ST,cat_({l:"｜" for l in LANGS},SITE))).replace('</style>',HEADCSS+'</style>',1)+f'<div class="masthead2"><p class="crumb"><a href="../index.html">← {T(SITE)}</a></p>{LANGSW}</div><h1>{T(ST)}</h1>{T(tp.get("lede",""),"p","lede")}\n{rows}{T(cat.get("disclaimer",""),"p","foot")}</div>{LANGJS}</body></html>'
    open(os.path.join(D,'index.html'),'w',encoding='utf-8').write(page)
    th=os.path.join(D,'thumb.svg')
    thumb=open(th,encoding='utf-8').read() if os.path.exists(th) else f'<span class="ph">{T(TT)}</span>'
    meta=fmt('meta',o=(UIT['ov'] if tp.get('overview') else {l:'' for l in LANGS}),n=len(eps))
    cards+=f'<a class="topic" href="{slug}/index.html"><span class="th" aria-hidden="true">{thumb}</span><span class="body">{T(TT,"b")}{T(tp.get("summary",""),"p")}{T(meta,"span","meta")}</span></a>\n'
portal=head2(SITE).replace('</style>',HEADCSS+'</style>',1)+f'<div class="masthead2"><h1>{T(SITE)}</h1>{LANGSW}</div>{T(cat.get("siteLede",""),"p","lede")}<h2>{T(UIT["topics"])}</h2><div class="topics">\n{cards}</div>{T(cat.get("disclaimer",""),"p","foot")}</div>{LANGJS}</body></html>'
open(os.path.join(R,'index.html'),'w',encoding='utf-8').write(portal)
if not os.path.exists(os.path.join(R,'.nojekyll')):open(os.path.join(R,'.nojekyll'),'w').close()
print(f'site rebuilt: {len(cat["topics"])} topic(s)')
if missing:print('WARNING missing files listed in catalog:',missing)
