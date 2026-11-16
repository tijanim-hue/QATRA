from pathlib import Path

root=Path(__file__).resolve().parents[1]
public=root/'public'
nav=public/'navigation.js'
source=nav.read_text(encoding='utf-8')
old="function route(){return {view:document.querySelector('.view.active')?.id||'homeView',screen:$('mindfulSheet')?.dataset.mmOpen==='true'?(document.querySelector('#mindfulSheet .mm-screen.is-active')?.dataset.mmScreen||'menu'):null};}"
new="""function route(){
 const pages=[...document.querySelectorAll('.app-container .view')].filter(visible);
 const page=pages.find(el=>el.id!=='homeView')||pages[0];
 return {view:page?.id||'homeView',screen:visible($('mindfulSheet'))?(document.querySelector('#mindfulSheet .mm-screen.is-active')?.dataset.mmScreen||'menu'):null};
}"""
if source.count(old)!=1:
    raise SystemExit('Unexpected navigation route; refusing an ambiguous patch.')
source=source.replace(old,new,1)
source=source.replace("if(now.screen==='menu'){mm()?.close();return;}","if(now.screen==='menu'){mm()?.close();go({view:'homeView',screen:null});return;}",1)
source=source.replace("if(route().screen==='menu')mm()?.close();else mm()?.show('menu');","if(route().screen==='menu'){mm()?.close();go({view:'homeView',screen:null});}else mm()?.show('menu');",1)
anchor='  const cap=window.Capacitor;'
if source.count(anchor)!=1:
    raise SystemExit('Exit guard location is ambiguous.')
source=source.replace(anchor,"  if(!visible($('homeView'))){go({view:'homeView',screen:null});return;}\n"+anchor,1)
nav.write_text(source,encoding='utf-8')

app=public/'app.js'
source=app.read_text(encoding='utf-8')
anchor='window.QatraSkins={installPull,init:initialize,'
if source.count(anchor)!=1:
    raise SystemExit('Theme integration contract changed; refusing to duplicate gestures.')
source=source.replace(anchor,"window.QatraSkins={installPull:()=>{},next:()=>{initialize();if(Date.now()<lockedUntil)return false;lockedUntil=Date.now()+(reduced()?250:750);apply(index+1);return true;},init:initialize,",1)
source+=r'''
/* One bottom-edge gesture across application scrollports. */
(() => {
'use strict';
let gesture=null,hint=null,cooldown=0;
const blocked='input,textarea,select,[contenteditable="true"],[role="slider"],.sheet-handle,[data-no-theme-pull]';
function bottom(el){return el.scrollTop+el.clientHeight>=el.scrollHeight-2;}
function scrollport(target){
 let candidate=null;
 for(let el=target instanceof Element?target:null;el&&el!==document.body;el=el.parentElement){
  const style=getComputedStyle(el),scrollable=/(auto|scroll)/.test(style.overflowY)&&el.scrollHeight>el.clientHeight+2;
  if(scrollable){if(!bottom(el))return null;if(!candidate)candidate=el;}
  else if(!candidate&&el.matches('.sheet-content,.mm-scroll,.content-area,.qh-panel,.qe-panel,.qatra-notebook'))candidate=el;
 }
 return candidate&&bottom(candidate)?candidate:null;
}
function status(ready){
 if(!hint){hint=document.createElement('div');hint.setAttribute('role','status');hint.setAttribute('aria-live','polite');hint.style.cssText='position:fixed;z-index:20050;bottom:calc(100px + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%);max-width:80vw;padding:10px 18px;border-radius:18px;background:var(--surface);color:var(--text);border:1px solid var(--border);box-shadow:0 8px 24px #0003;font:600 13px Cairo,sans-serif;pointer-events:none;text-align:center';document.body.appendChild(hint);}
 const ar=document.documentElement.lang==='ar';hint.textContent=ar?(ready?'أفلت لتغيير الثيم':'اسحب أكثر لتغيير الثيم'):(ready?'Release to change theme':'Pull further to change theme');hint.hidden=false;
}
function reset(){gesture=null;if(hint)hint.hidden=true;}
document.addEventListener('touchstart',event=>{
 reset();if(event.touches.length!==1||Date.now()<cooldown||!(event.target instanceof Element)||event.target.closest(blocked))return;
 if(document.activeElement?.matches('input,textarea,[contenteditable="true"]'))return;
 const port=scrollport(event.target);if(!port)return;
 gesture={port,x:event.touches[0].clientX,y:event.touches[0].clientY,distance:0};
},{passive:true,capture:true});
document.addEventListener('touchmove',event=>{
 if(!gesture)return;if(event.touches.length!==1||!gesture.port.isConnected||!bottom(gesture.port)){reset();return;}
 const dx=event.touches[0].clientX-gesture.x,dy=gesture.y-event.touches[0].clientY;
 if(Math.abs(dx)>Math.max(20,Math.abs(dy))||dy<0){reset();return;}
 gesture.distance=dy;if(dy>16){if(event.cancelable)event.preventDefault();status(dy>=88);}
},{passive:false,capture:true});
document.addEventListener('touchend',()=>{
 const change=gesture&&gesture.distance>=88&&bottom(gesture.port);reset();
 if(change){cooldown=Date.now()+900;window.QatraSkins?.next?.();}
},{passive:true,capture:true});
document.addEventListener('touchcancel',reset,{passive:true,capture:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
})();
'''
app.write_text(source,encoding='utf-8')
import runpy
runpy.run_path(str(root/'scripts/prepare-news.py'),run_name='__main__')
