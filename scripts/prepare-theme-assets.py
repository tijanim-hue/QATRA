import copy
import json
import pathlib
import struct

root = pathlib.Path(__file__).resolve().parents[1]
public = root / 'public'
report = []
for i in range(1, 9):
    path = public / 'assets' / 'qatra-skins' / f'qatra-theme-{i:02d}.png'
    with path.open('rb') as stream:
        header = stream.read(24)
    if header[:8] != b'\x89PNG\r\n\x1a\n' or header[12:16] != b'IHDR':
        raise SystemExit(f'Invalid PNG: {path.name}')
    width, height = struct.unpack('>II', header[16:24])
    report.append({'file': path.name, 'width': width, 'height': height, 'bytes': path.stat().st_size})

app = public / 'app.js'
source = app.read_text(encoding='utf-8')
marker = '// === QATRA PACKAGE TWO SKINS BEGIN ==='
start = source.index('const themes=', source.index(marker)) + len('const themes=')
themes, length = json.JSONDecoder().raw_decode(source[start:])
if len(themes) != 7:
    raise SystemExit('Expected the existing seven-theme configuration; refusing an ambiguous update.')
eighth = copy.deepcopy(themes[-1])
eighth['label'] = 'الثيم الثامن'
themes.append(eighth)
for i, theme in enumerate(themes, 1):
    theme['image'] = f'assets/qatra-skins/qatra-theme-{i:02d}.png'
    theme['wall'] = f'url("{theme["image"]}") center top / 100% auto no-repeat, {theme["vars"]["bgsolid"]}'
source = source[:start] + json.dumps(themes, ensure_ascii=False, separators=(',', ':')) + source[start + length:]
source += r'''
/* Preserve the original interactive hero node and its event listeners. */
(() => {
 function pinHero(){
  const root=document.querySelector('.app-container'),hero=document.getElementById('surpriseButton'),scroll=document.getElementById('scrollContent');
  const header=root?.querySelector('.header');
  if(!root||!hero||!scroll||!header||root.classList.contains('q8-pinned'))return;
  root.classList.add('q8-pinned');header.insertAdjacentElement('afterend',hero);
  function measure(){const h=Math.round(header.getBoundingClientRect().height);const value=h+'px';if(root.style.getPropertyValue('--q8-header-height')!==value)root.style.setProperty('--q8-header-height',value);}
  measure();if('ResizeObserver' in window)new ResizeObserver(measure).observe(header);else window.addEventListener('resize',measure,{passive:true});
  function visibility(){root.classList.toggle('q8-paused',document.hidden);}visibility();document.addEventListener('visibilitychange',visibility);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',pinHero,{once:true});else pinHero();
})();
'''
app.write_text(source, encoding='utf-8')

css = public / 'package2-skins.css'
css.write_text(css.read_text(encoding='utf-8') + '''
/* Render uploaded artwork once; preserve both inner and outer decorations. */
.app-container.q2-home #surpriseButton .q2-scene{display:none!important}
.app-container.q2-home #surpriseButton{background:transparent!important;border-color:transparent!important;box-shadow:none!important}
.app-container.q2-home #surpriseButton::before,.app-container.q2-home #surpriseButton::after,.app-container.q2-home #surpriseButton .surprise-orbit{display:none!important}
/* A fixed hero region above an independently scrolling card region. */
.app-container.q8-pinned{--q8-orb-size:min(78vw,294px)}
.app-container.q8-pinned.q2-home #surpriseButton{position:absolute!important;top:calc(var(--q8-header-height,84px) + 8px);left:50%;width:var(--q8-orb-size)!important;height:var(--q8-orb-size)!important;margin:0!important;transform:translateX(-50%)!important;z-index:20;overflow:visible;flex:none}
.app-container.q8-pinned:not(.q2-home)>#surpriseButton{display:none!important}
.app-container.q8-pinned.q2-home #scrollContent{margin-top:calc(var(--q8-orb-size) + 20px);min-height:0;padding-top:4px}
/* Coordinated accent shades rather than unrelated colors. */
body.q3-themed .app-container.q8-pinned #surpriseButton .surprise-play,body.q3-themed .floating-nav .nav-home-btn{background:linear-gradient(145deg,color-mix(in srgb,var(--primary) 82%,white),var(--primary))!important;color:var(--q3-on-accent)!important;border-color:color-mix(in srgb,var(--primary) 38%,var(--surface))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 8px 22px var(--q3-glow)!important}
body.q3-themed .app-container.q8-pinned #surpriseButton .surprise-play svg{fill:var(--q3-on-accent)!important}
body.q3-themed .app-container.q8-pinned #surpriseButton .surprise-title,body.q3-themed .app-container.q8-pinned #surpriseButton .surprise-description{background:color-mix(in srgb,var(--surface) 88%,transparent)!important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
body.q3-themed .app-container.q2-home #homeView .glass-card,body.q3-themed .view .glass-card,body.q3-themed .sheet-content .glass-card,body.q3-themed .qatra-notebook .qn-card,body.q3-themed .qatra-notebook .qn-stat,body.q3-themed .qatra-notebook .qn-progress{background:linear-gradient(140deg,color-mix(in srgb,var(--surface) 94%,var(--primary)),var(--surface))!important;border:1px solid color-mix(in srgb,var(--primary) 22%,var(--surface))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 12px 28px color-mix(in srgb,var(--primary) 10%,transparent)!important;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
body.q3-themed .app-container .view .card-icon,body.q3-themed .sheet-content .setting-icon{color:var(--primary)!important;background:color-mix(in srgb,var(--surface) 92%,var(--primary))!important;border:1px solid color-mix(in srgb,var(--primary) 18%,var(--surface));box-shadow:inset 0 1px 0 rgba(255,255,255,.16)}
/* A slow highlight and a single soft pulse, never a rapid flash. */
.app-container.q8-pinned.q2-home #surpriseButton::before{display:block!important;content:'';position:absolute;inset:0;border-radius:50%;pointer-events:none;z-index:0;background:none;box-shadow:0 0 18px var(--q3-glow),inset 0 0 12px var(--q3-glow);animation:q8-soft-pulse 14s ease-in-out infinite}
@supports ((mask-composite:exclude) or (-webkit-mask-composite:xor)){
 .app-container.q8-pinned.q2-home #surpriseButton::after{display:block!important;content:'';position:absolute;inset:1px;border-radius:50%;padding:2px;pointer-events:none;z-index:0;background:conic-gradient(from 0deg,transparent 0deg,transparent 235deg,color-mix(in srgb,var(--primary) 60%,white) 282deg,rgba(255,255,255,.75) 298deg,transparent 325deg,transparent 360deg);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:q8-orbit 12s linear infinite}
}
@keyframes q8-orbit{to{transform:rotate(360deg)}}
@keyframes q8-soft-pulse{0%,72%,100%{opacity:.25}82%{opacity:.7}92%{opacity:.25}}
.app-container.q8-paused #surpriseButton::before,.app-container.q8-paused #surpriseButton::after{animation-play-state:paused!important}
@media(max-height:720px){.app-container.q8-pinned{--q8-orb-size:min(68vw,250px)}}
@media(prefers-reduced-motion:reduce){.app-container.q8-pinned #surpriseButton::before,.app-container.q8-pinned #surpriseButton::after{animation:none!important;opacity:.3}}
''', encoding='utf-8')
(root / 'theme-assets-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
