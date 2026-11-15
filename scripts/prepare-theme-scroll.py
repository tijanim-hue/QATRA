import pathlib

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
app.write_text(source.replace(old, new, 1), encoding='utf-8')
css = root / 'public/package2-skins.css'
css.write_text(css.read_text(encoding='utf-8') + '''
/* One scrolling scene: artwork, hero content, cards and orbital light. */
.app-container.q8-pinned{--q8-scene-gap:28px;--q8-art-correction:32px}
.app-container.q8-pinned.q2-home #homeView{position:relative;isolation:isolate;min-height:100%}
/* Correct the uploaded circle's offset relative to the hero halo. */
.app-container.q8-pinned.q2-home #homeView>.q2-wall{inset:calc(0px - var(--q8-header-height,84px) - 8px + var(--q8-art-correction)) -20px 0;z-index:-1}
.app-container.q8-pinned.q2-home #surpriseButton{position:relative!important;top:auto!important;left:auto!important;right:auto!important;transform:none!important;margin:0 auto 22px!important;z-index:1}
/* Keep the complete ring clear of the header at the default scroll position. */
.app-container.q8-pinned #scrollContent{box-sizing:border-box;min-height:0;flex:1;margin-top:0!important;padding-top:calc(var(--q8-header-height,84px) + var(--q8-scene-gap))!important;padding-bottom:calc(140px + env(safe-area-inset-bottom,0px));overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch}
body .app-container.q8-pinned>.header{position:absolute!important;top:0;inset-inline:0;z-index:90;background:color-mix(in srgb,var(--surface) 78%,transparent)!important;backdrop-filter:blur(18px) saturate(135%);-webkit-backdrop-filter:blur(18px) saturate(135%);border-bottom:1px solid var(--border)}
.app-container.q8-pinned>.floating-nav{z-index:100}
/* The existing halo pseudo-elements belong to the same moving hero node. */
''', encoding='utf-8')
