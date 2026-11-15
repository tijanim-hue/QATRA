from pathlib import Path

root=Path(__file__).resolve().parents[1]
app=root/'public/app.js'
text=app.read_text(encoding='utf-8')
anchor='let gesture=null,hint=null,cooldown=0;'
if text.count(anchor)!=1 or text.count('function status(ready){')!=1:
    raise SystemExit('Unexpected pull indicator structure.')
text=text.replace(anchor,'let gesture=null,hint=null,cooldown=0,headerDrop=null,originalOpacity="";',1)
start=text.index('function status(ready){')
end=text.index("document.addEventListener('touchstart'",start)
text=text[:start]+r'''
function status(ready){
 const host=document.querySelector('dialog[open]')||document.body;
 if(!hint){hint=document.createElement('div');hint.className='qd-indicator qd-header-copy';hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');hint.innerHTML='<span class="qd-water" aria-hidden="true"></span><span class="qd-ripple" aria-hidden="true"></span>';}
 if(hint.parentNode!==host)host.appendChild(hint);
 if(!headerDrop){
  const source=document.querySelector('.app-container>.header .brand svg');
  if(source){
   const copy=source.cloneNode(true),style=getComputedStyle(source);copy.removeAttribute('id');copy.setAttribute('aria-hidden','true');
   for(const name of ['fill','stroke','stroke-width','color','opacity'])copy.style.setProperty(name,style.getPropertyValue(name));
   copy.style.width='100%';copy.style.height='100%';copy.style.margin='0';
   hint.querySelector('.qd-water').replaceChildren(copy);headerDrop=source;originalOpacity=source.style.opacity;source.style.opacity='0';
  }
 }
 const box=headerDrop?.getBoundingClientRect(),width=box?.width||34,height=box?.height||34;
 hint.style.insetInlineStart='auto';hint.style.right='auto';
 hint.style.left=(host===document.body?(box?box.left+width/2:window.innerWidth/2):host.clientWidth/2)+'px';
 hint.style.top=(host===document.body?(box?.top||24):8)+'px';hint.style.width=width+'px';
 const water=hint.querySelector('.qd-water');water.style.inset='0 auto auto 0';water.style.width=width+'px';water.style.height=height+'px';water.style.filter='none';
 const progress=ready?1:Math.min(1,(gesture?.distance||0)/88);water.style.transform='translate3d(0,'+(progress*26)+'px,0)';
 const ar=document.documentElement.lang==='ar',label=ar?(ready?'أفلت لتغيير الثيم':'اسحب لأسفل لتغيير الثيم'):(ready?'Release to change theme':'Pull down to change theme');
 if(hint.getAttribute('aria-label')!==label)hint.setAttribute('aria-label',label);hint.hidden=false;
}
function reset(){
 gesture=null;if(hint){hint.hidden=true;hint.classList.remove('qd-falling');}
 if(headerDrop){headerDrop.style.opacity=originalOpacity;headerDrop=null;}
}
'''+text[end:]
text+=r'''
(() => {
 const style=document.createElement('style');style.textContent=`
.qd-header-copy{background:transparent!important;border:0!important;box-shadow:none!important;pointer-events:none}
.qd-header-copy .qd-water{background:transparent!important;border:0!important;box-shadow:none!important;filter:none!important;transform-origin:50% 50%}
.qd-header-copy .qd-water svg{display:block;max-width:none}
.qd-header-copy.qd-falling .qd-water{animation:qd-header-fall .55s cubic-bezier(.4,0,.8,.5) both}
@keyframes qd-header-fall{0%{transform:translateY(26px);opacity:1}75%{transform:translateY(48px);opacity:.85}100%{transform:translateY(56px) scale(1.05,.35);opacity:0}}
@media(prefers-reduced-motion:reduce){.qd-header-copy.qd-falling .qd-water{animation:none!important}}
`;document.head.appendChild(style);
})();
'''
app.write_text(text,encoding='utf-8')
