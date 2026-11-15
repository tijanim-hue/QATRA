from pathlib import Path
import re

root=Path(__file__).resolve().parents[1]
public=root/'public'
java=root/'android/app/src/main/java/com/qatra/app'
def once(text,old,new):
    if text.count(old)!=1:
        raise SystemExit('Unexpected integration anchor: '+old[:90])
    return text.replace(old,new,1)

for name in ['QatraPlugin.kt','QatraOverlayService.kt']:
    path=java/name
    text=path.read_text(encoding='utf-8')
    pattern=r'getBoolean\("readAloud",\s*true\)'
    if len(re.findall(pattern,text))!=1:
        raise SystemExit('Read-aloud default changed unexpectedly: '+name)
    text=re.sub(pattern,'getBoolean("readAloud", false)',text,count=1)
    if name=='QatraOverlayService.kt':
        text=once(text,'private var readAloudEnabled = true','private var readAloudEnabled = false')
    path.write_text(text,encoding='utf-8')

app=public/'app.js'
text=app.read_text(encoding='utf-8')
text=once(text,'let index=0,initialized=false,root=null','let index=5,initialized=false,root=null')
old='next:()=>{initialize();if(Date.now()<lockedUntil)return false;lockedUntil=Date.now()+(reduced()?250:750);apply(index+1);return true;}'
new='''next:async()=>{
 initialize();if(!initialized||Date.now()<lockedUntil)return false;
 lockedUntil=Date.now()+1800;
 const next=(index+1)%themes.length,image=new Image();
 try{
  image.src=themes[next].image;
  if(image.decode)await image.decode();
  else await new Promise((resolve,reject)=>{if(image.complete){image.naturalWidth?resolve():reject();}else{image.onload=resolve;image.onerror=reject;}});
  if(document.hidden){lockedUntil=0;return false;}
  apply(next);lockedUntil=Date.now()+(reduced()?250:1100);return true;
 }catch(error){lockedUntil=0;return false;}
}'''
text=once(text,old,new)
pattern=re.compile(r'function status\(ready\)\{.*?\n\}\nfunction reset\(\)\{gesture=null;if\(hint\)hint.hidden=true;\}',re.S)
if len(pattern.findall(text))!=1:
    raise SystemExit('Global pull indicator integration changed.')
replacement=r'''function status(ready){
 const host=document.querySelector('dialog[open]')||document.body;
 if(!hint){
  hint=document.createElement('div');hint.className='qd-indicator';hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');
  hint.innerHTML='<span class="qd-water" aria-hidden="true"><svg viewBox="0 0 32 44"><defs><linearGradient id="qd-water-fill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ecffff"/><stop offset=".5" stop-color="#56d7ef"/><stop offset="1" stop-color="var(--primary)"/></linearGradient></defs><path d="M16 2C14 10 4 18 4 28a12 12 0 0 0 24 0C28 18 18 10 16 2Z" fill="url(#qd-water-fill)"/><path d="M11 20c-3 4-4 9-1 12" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2" stroke-linecap="round"/></svg></span><span class="qd-ripple" aria-hidden="true"></span>';
 }
 if(hint.parentNode!==host)host.appendChild(hint);
 if(hint.hidden||!hint.style.top){
  const box=gesture?.port.getBoundingClientRect();
  const header=gesture?.port.id==='scrollContent'?document.querySelector('.app-container>.header')?.getBoundingClientRect().bottom:0;
  hint.style.top=Math.max(12,Math.min((Math.max(box?.top||0,header||0)+10),window.innerHeight-80))+'px';
 }
 const progress=ready?1:Math.min(1,(gesture?.distance||0)/88);
 hint.querySelector('.qd-water').style.transform='translate3d(0,'+(-8+progress*18)+'px,0) scale('+(.75+progress*.25)+')';
 const ar=document.documentElement.lang==='ar',label=ar?(ready?'أفلت لتغيير الثيم':'اسحب لأسفل لتغيير الثيم'):(ready?'Release to change theme':'Pull down to change theme');
 if(hint.getAttribute('aria-label')!==label)hint.setAttribute('aria-label',label);
 hint.hidden=false;
}
function reset(){gesture=null;if(hint){hint.hidden=true;hint.classList.remove('qd-falling');}}'''
text=pattern.sub(lambda match:replacement,text,count=1)
text=once(text,'if(change){cooldown=Date.now()+900;window.QatraSkins?.next?.();}',"if(change){cooldown=Date.now()+1300;status(true);hint.classList.add('qd-falling');Promise.resolve(window.QatraSkins?.next?.()).catch(()=>{}).finally(()=>setTimeout(reset,500));}")
text+=r'''
/* Compositor-friendly artwork crossfade and a small water pull indicator. */
(() => {
 const style=document.createElement('style');style.textContent=`
.ptr-container{display:none!important}
.q2-wall,#surpriseButton .q2-scene{transition:opacity 1s cubic-bezier(.22,.61,.36,1)!important}
body.qg-permanent,.app-container.q2-home{transition:background-color .9s ease,color .7s ease}
body.qg-permanent :is(.glass-card,.floating-nav,.sheet-content,.qp-dialog){transition:background-color .9s ease,border-color .7s ease,color .7s ease}
.qd-indicator{position:fixed;inset-inline-start:50%;transform:translateX(-50%);width:48px;height:66px;z-index:40000;pointer-events:none;contain:layout style}
.qd-indicator[hidden]{display:none!important}.qd-water{display:block;position:absolute;inset:0 10px auto;width:28px;height:39px;filter:drop-shadow(0 3px 7px var(--q3-glow));transform-origin:50% 75%}.qd-water svg{width:100%;height:100%;display:block}
.qd-ripple{position:absolute;inset:48px 7px auto;height:7px;border:1px solid var(--primary);border-radius:50%;opacity:0}
.qd-falling .qd-water{animation:qd-fall .52s cubic-bezier(.4,0,.8,.5) both}.qd-falling .qd-ripple{animation:qd-spread .55s .25s ease-out both}
@keyframes qd-fall{0%{transform:translateY(10px) scale(1);opacity:1}65%{transform:translateY(24px) scale(.85,1.15);opacity:1}100%{transform:translateY(30px) scale(1.15,.4);opacity:0}}
@keyframes qd-spread{0%{transform:scale(.4);opacity:.7}100%{transform:scale(1.5);opacity:0}}
@media(prefers-reduced-motion:reduce){.q2-wall,#surpriseButton .q2-scene,body.qg-permanent,body.qg-permanent :is(.glass-card,.floating-nav,.sheet-content,.qp-dialog){transition-duration:.01ms!important}.qd-falling .qd-water,.qd-falling .qd-ripple{animation:none!important}.qd-water{transform:none!important}}
`;document.head.appendChild(style);
})();
'''
app.write_text(text,encoding='utf-8')
