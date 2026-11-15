import pathlib
import re

root = pathlib.Path(__file__).resolve().parents[1]
app = root / 'public/app.js'
source = app.read_text(encoding='utf-8')
old = "root.classList.add('q8-pinned');header.insertAdjacentElement('afterend',hero);"
new = """const home=document.getElementById('homeView');if(!home)return;
  root.classList.add('q8-pinned');
  home.prepend(...root.querySelectorAll(':scope > .q2-wall'));
  home.prepend(hero);"""
if source.count(old) != 1:
    raise SystemExit('Expected one prepared hero integration; refusing an ambiguous layout change.')
source = source.replace(old, new, 1)

html = root / 'public/index.html'
markup = html.read_text(encoding='utf-8')
label = re.search(r'data-i18n=[\"\']glass_mode[\"\']', markup)
if not label:
    raise SystemExit('Glass settings label not found.')
rows = list(re.finditer(r'<div\b[^>]*class=[\"\'][^\"\']*\bcontrol-row\b[^\"\']*[\"\'][^>]*>', markup[:label.start()]))
if not rows:
    raise SystemExit('Glass settings row not found.')
row = rows[-1]
# Keep legacy input IDs available to existing handlers, but remove the row from the UI.
markup = markup[:row.start()] + row.group(0)[:-1] + ' hidden inert aria-hidden="true" style="display:none!important" data-qatra-retired-glass="true">' + markup[row.end():]
html.write_text(markup, encoding='utf-8')

match = re.search(r'classList\.toggle\(\s*([\"\'])glass-active\1\s*,\s*(?:!!|Boolean\()?state\.([A-Za-z_$][\w$]*)', source)
if not match:
    raise SystemExit('Could not resolve the existing glass state property safely.')
key = match.group(2)
source += '\n/* Permanent glass: migrate legacy disabled preferences before applying state. */\n'
source += '(() => { const previous = applyState; applyState = function(...args) { state[' + repr(key) + '] = true; document.body.classList.add("qg-permanent","glass-active"); const result = previous.apply(this,args); document.body.classList.add("qg-permanent","glass-active"); return result; }; applyState(); })();\n'
app.write_text(source, encoding='utf-8')

css = root / 'public/package2-skins.css'
css.write_text(css.read_text(encoding='utf-8') + '''
/* Preserve the unified scrolling scene and the approved circle offsets. */
.app-container.q8-pinned{--q8-scene-gap:28px;--q8-art-correction:32px}
.app-container.q8-pinned.q2-home #homeView{position:relative;isolation:isolate;min-height:100%}
.app-container.q8-pinned.q2-home #homeView>.q2-wall{inset:calc(0px - var(--q8-header-height,84px) - 8px + var(--q8-art-correction)) -20px 0;z-index:-1}
.app-container.q8-pinned.q2-home #surpriseButton{position:relative!important;top:auto!important;left:auto!important;right:auto!important;transform:none!important;margin:0 auto 22px!important;z-index:1}
.app-container.q8-pinned #scrollContent{box-sizing:border-box;min-height:0;flex:1;margin-top:0!important;padding-top:calc(var(--q8-header-height,84px) + var(--q8-scene-gap))!important;padding-bottom:calc(140px + env(safe-area-inset-bottom,0px));overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch}
body .app-container.q8-pinned>.header{position:absolute!important;top:0;inset-inline:0;z-index:90}
.app-container.q8-pinned>.floating-nav{z-index:100}

/* Theme-tinted glass tokens; independent of retired glass preferences. */
html body.qg-permanent{--q8-glass:rgba(24,32,48,.60);--q8-sheet:rgba(24,32,48,.76);--q8-field:rgba(24,32,48,.48);--q8-edge:rgba(255,255,255,.17);--q8-shadow:0 10px 28px #00000020,inset 0 1px 0 #ffffff16;background:var(--bg)!important}
@supports(background:color-mix(in srgb,white,transparent)){
 html body.qg-permanent{--q8-glass:color-mix(in srgb,var(--surface) 48%,transparent);--q8-sheet:color-mix(in srgb,var(--surface) 72%,transparent);--q8-field:color-mix(in srgb,var(--surface) 36%,transparent);--q8-edge:color-mix(in srgb,var(--text) 16%,transparent)}
}
/* Include IDs in the selector to override earlier per-screen opaque themes. */
html body.qg-permanent.glass-active.q3-themed :is(#homeView .glass-card,#mindfulSheet .mm-card,#mindfulSheet .mm-panel,.glass-card,.garden-card,.floating-nav,.audio-player,.qn-card,.qn-stat,.qn-progress,.qatra-notebook-card,.qatra-notebook-head,.qatra-ai-panel,.qatra-dialog,.qe-panel,.qh-panel,.ql-card){background:var(--q8-glass)!important;border-color:var(--q8-edge)!important;box-shadow:var(--q8-shadow)!important;backdrop-filter:blur(18px) saturate(135%)!important;-webkit-backdrop-filter:blur(18px) saturate(135%)!important;color:var(--text)!important}
html body.qg-permanent.glass-active.q3-themed :is(#mindfulSheetContent,.sheet-content,.qatra-notebook,.qatra-dialog,.qe-panel,.qh-panel){background:var(--q8-sheet)!important;border-color:var(--q8-edge)!important;backdrop-filter:blur(22px) saturate(135%)!important;-webkit-backdrop-filter:blur(22px) saturate(135%)!important;color:var(--text)!important}
html body.qg-permanent.glass-active.q3-themed :is(#mindfulSheet,.sheet-overlay,.qe-backdrop){background:rgba(0,0,0,.18)!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
/* Avoid accumulating blur on cards already inside a frosted sheet. */
html body.qg-permanent.glass-active.q3-themed :is(#mindfulSheetContent,.sheet-content,.qatra-notebook,.qatra-dialog,.qe-panel,.qh-panel) :is(.glass-card,.mm-card,.mm-panel,.qn-card,.qn-stat,.qn-progress,.ql-card,.qatra-ai-panel){backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
html body.qg-permanent.glass-active.q3-themed :is(#mindfulSheet textarea,#mindfulSheet .qatra-ai-output,textarea,select,input[type=text],input[type=time],input[type=number],input[type=datetime-local],.custom-radio-item,.my-quote-item){background:var(--q8-field)!important;border-color:var(--q8-edge)!important;color:var(--text)!important}
html body.qg-permanent.glass-active.q3-themed select option{background:var(--surface)!important;color:var(--text)!important}
html body.qg-permanent.glass-active.q3-themed :is(#mindfulSheet h2,#mindfulSheet h3,#mindfulSheet label,.qatra-notebook-head h2,.qatra-notebook-card .card-title){color:var(--text)!important}
html body.qg-permanent.glass-active.q3-themed :is(#mindfulSheet p,#mindfulSheet .mm-card small,.qatra-notebook-card .card-sub){color:var(--text-dim)!important}
html body.qg-permanent.glass-active.q3-themed .floating-nav .nav-item{color:var(--text-dim)!important}
html body.qg-permanent.glass-active.q3-themed .floating-nav .nav-item.active{color:var(--primary)!important}
html body.qg-permanent.glass-active.q3-themed .floating-nav .nav-home-btn{border-color:var(--q8-edge)!important}
/* No solid header strip, separator, shadow or abrupt blur boundary. */
html body.qg-permanent.glass-active.q3-themed .app-container>.header{background:transparent!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
@supports ((mask-image:linear-gradient(black,transparent)) or (-webkit-mask-image:linear-gradient(black,transparent))){
 html body.qg-permanent.glass-active.q3-themed .app-container>.header::before{content:'';position:absolute;inset:0 0 -20px;z-index:-1;pointer-events:none;background:transparent;backdrop-filter:blur(16px) saturate(120%);-webkit-backdrop-filter:blur(16px) saturate(120%);mask-image:linear-gradient(to bottom,black 55%,transparent);-webkit-mask-image:linear-gradient(to bottom,black 55%,transparent)}
}
html body.qg-permanent .app-container{background:var(--bg)!important}
html body.qg-permanent .app-container :is(.view,.content-area){background:transparent!important}
/* Fade only the artwork's entrance, not the circle or its motion. */
html body.qg-permanent .q2-wall{mask-image:linear-gradient(to bottom,transparent,black 24px);-webkit-mask-image:linear-gradient(to bottom,transparent,black 24px)}
html body.qg-permanent :is(button,a,input,textarea,select):focus-visible{outline:2px solid var(--primary);outline-offset:3px}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){
 html body.qg-permanent{--q8-glass:var(--surface);--q8-sheet:var(--surface);--q8-field:var(--surface)}
}
@media(prefers-contrast:more){html body.qg-permanent{--q8-glass:var(--surface);--q8-sheet:var(--surface);--q8-field:var(--surface);--q8-edge:var(--text-dim)}}
''', encoding='utf-8')
