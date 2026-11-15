from pathlib import Path
import math
import struct
import wave

root=Path(__file__).resolve().parents[1]
public=root/'public'
def replace_once(text,old,new):
    if text.count(old)!=1:
        raise SystemExit('Unexpected integration anchor: '+old[:90])
    return text.replace(old,new,1)

app=public/'app.js'
s=app.read_text(encoding='utf-8')
s=replace_once(s,'function bottom(el){return el.scrollTop+el.clientHeight>=el.scrollHeight-2;}','function bottom(el){return el.scrollTop<=2;}')
s=replace_once(s,'dy=gesture.y-event.touches[0].clientY','dy=event.touches[0].clientY-gesture.y')
s=replace_once(s,"setTimeout(() => { const splash = document.getElementById('splash'); if (splash) { splash.style.opacity = '0'; setTimeout(() => splash.remove(), 800); } }, 2500);","/* Startup timing is owned by QatraPolish after the permission journey. */")
app.write_text(s,encoding='utf-8')
nav=public/'navigation.js'
s=nav.read_text(encoding='utf-8')
s=replace_once(s,".sheet-overlay,.qh-backdrop,.qe-backdrop,[role=\"dialog\"]",".sheet-overlay,.qh-backdrop,.qe-backdrop,#notebookSheet,[role=\"dialog\"]")
s=replace_once(s,'function dismiss(layer){',"function dismiss(layer){\n if(layer.id==='notebookSheet'){const close=$('closeNotebookSheet');if(close)close.click();else layer.style.display='none';go({view:'homeView',screen:null});return true;}")
s=replace_once(s,'if(native)await native.confirmExit();','if(window.QatraPolish)window.QatraPolish.confirmExit();else if(native)await native.confirmExit();')
nav.write_text(s,encoding='utf-8')
experience=public/'experience.js'
s=experience.read_text(encoding='utf-8')
s=replace_once(s,"if(!window.__qatraStartupSoundPlayed){window.__qatraStartupSoundPlayed=true;native.playUiSound({name:'startup'}).catch(error=>console.debug(error));}",'/* Play the startup signature with the visible introduction, not the permission prompt. */')
s=replace_once(s,'function complete(){state.qatraPermissionIntroSeen=true;state.qatraPermissionJourney=false;save();approved=false;busy=false;close();}',"function complete(){state.qatraPermissionIntroSeen=true;state.qatraPermissionJourney=false;save();approved=false;busy=false;close();window.dispatchEvent(new Event('qatra-intro-ready'));}")
s=replace_once(s,'settings();const current=await read();if(!current)return;',"settings();const current=await read();if(!current){window.dispatchEvent(new Event('qatra-intro-ready'));return;}")
s=replace_once(s,'else{state.qatraPermissionIntroSeen=true;save();}',"else{state.qatraPermissionIntroSeen=true;save();window.dispatchEvent(new Event('qatra-intro-ready'));}")
experience.write_text(s,encoding='utf-8')

(public/'polish.js').write_text(r'''
(() => {
'use strict';
const $=id=>document.getElementById(id),ar=()=>document.documentElement.lang==='ar';
const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
let dialog=null,ready=false,gated=false,started=false;
function sheet(title){
 if(dialog)dialog.close();const el=node('dialog','qp-dialog');el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.dir=document.documentElement.dir;
 const heading=node('h2','',title);heading.id='qp-dialog-title';el.setAttribute('aria-labelledby',heading.id);el.appendChild(heading);
 const cancel=node('button','qp-cancel',ar()?'إلغاء':'Cancel');cancel.type='button';cancel.addEventListener('click',()=>el.close());
 el.appendChild(cancel);el.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();el.close();}});
 el.addEventListener('click',event=>{const box=el.getBoundingClientRect();if(event.target===el&&(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom))el.close();});
 const focus=document.activeElement;el.addEventListener('close',()=>{if(dialog===el)dialog=null;el.remove();if(focus?.isConnected)focus.focus();},{once:true});
 document.body.appendChild(el);dialog=el;return {el,cancel};
}
function confirmExit(){
 if(dialog?.open)return;
 const {el,cancel}=sheet(ar()?'هل تريد مغادرة قطرة؟':'Leave Qatra?');cancel.textContent=ar()?'البقاء':'Stay';
 const copy=node('p','',ar()?'لحظة صغيرة قد تصنع فرقًا في يومك. ابقَ لاكتشاف قطرة جديدة، أو عد حين يناسبك.':'A small moment can brighten your day. Discover another drop, or return whenever it suits you.');el.insertBefore(copy,cancel);
 const leave=node('button','qp-primary',ar()?'غادر':'Leave');leave.type='button';leave.addEventListener('click',async()=>{
  leave.disabled=true;
  try{const cap=window.Capacitor,native=cap?.Plugins?.QatraNavigation||cap?.registerPlugin?.('QatraNavigation');if(!native)throw Error('Native navigation unavailable');await native.exitConfirmed();el.close();}
  catch(error){leave.disabled=false;copy.textContent=ar()?'تعذر تنفيذ المغادرة. يمكنك البقاء والمحاولة لاحقًا.':'Unable to leave. Please try again later.';}
 });el.appendChild(leave);el.showModal();cancel.focus();
}
const titles={langSelect:['لغة التطبيق','App language'],'qe-voice-select':['نبرة الصوت','Voice'],notifModeSetting:['طريقة العرض وتفضيلاتك','Display preferences'],dropDurationSetting:['مدة القطرة','Drop duration']};
function enhance(select){
 if(select.dataset.qpPicker||typeof HTMLDialogElement==='undefined'||!HTMLDialogElement.prototype.showModal)return;
 select.dataset.qpPicker='true';select.hidden=true;select.style.setProperty('display','none','important');select.tabIndex=-1;
 const button=node('button','qp-select');button.type='button';button.setAttribute('aria-haspopup','dialog');select.insertAdjacentElement('afterend',button);
 function refresh(){button.textContent=(select.selectedOptions[0]?.textContent||titles[select.id][ar()?0:1])+'  ▾';button.disabled=select.disabled;button.setAttribute('aria-label',titles[select.id][ar()?0:1]+': '+button.textContent);}
 button.addEventListener('click',()=>{
  const {el,cancel}=sheet(titles[select.id][ar()?0:1]);const list=node('div','qp-options');
  [...select.options].forEach((option,index)=>{
   const item=node('button','qp-option');item.type='button';item.disabled=option.disabled;item.setAttribute('aria-pressed',String(option.selected));
   const voice=select.id==='qe-voice-select';item.appendChild(node('strong','',voice?(ar()?'النبرة ':'Voice ')+(index+1):option.textContent));
   if(voice)item.appendChild(node('small','',option.textContent));
   item.addEventListener('click',()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));refresh();el.close();});list.appendChild(item);
  });el.insertBefore(list,cancel);el.showModal();(list.querySelector('[aria-pressed=true]')||cancel).focus();
 });select.addEventListener('change',refresh);
 new MutationObserver(refresh).observe(select,{attributes:true,childList:true,subtree:true,characterData:true});refresh();
}
function scan(){for(const id of Object.keys(titles)){const select=$(id);if(select)enhance(select);}}
function introduction(){
 if(!ready||!gated||started)return;started=true;
 const splash=$('splash')||node('div');splash.id='splash';splash.className='qp-intro';splash.style.opacity='1';
 splash.replaceChildren();splash.setAttribute('role','status');splash.setAttribute('aria-label',ar()?'أهلًا بك في قطرة':'Welcome to Qatra');
 const orb=node('div','qp-orb');orb.appendChild(node('div','qp-ripple'));const image=node('img');image.src='assets/icon.png';image.alt='';orb.appendChild(image);splash.appendChild(orb);
 splash.appendChild(node('h1','','قطرة | QATRA'));splash.appendChild(node('p','',ar()?'لحظة صغيرة… وأثر يبقى':'A small moment. A lasting impact.'));if(!splash.isConnected)document.body.appendChild(splash);
 if(!window.__qatraStartupSoundPlayed){window.__qatraStartupSoundPlayed=true;try{const native=typeof QatraNative!=='undefined'?QatraNative:null;native?.playUiSound?.({name:'startup'})?.catch(()=>{});}catch(error){}}
 let elapsed=0,last=performance.now();
 function frame(now){if(!document.hidden)elapsed+=Math.min(now-last,64);last=now;if(elapsed<3200){requestAnimationFrame(frame);return;}
  $('qp-boot')?.remove();document.body.classList.add('qp-reveal');
  if(splash.animate&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const animation=splash.animate([{opacity:1,filter:'blur(0px)'},{opacity:0,filter:'blur(10px)'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});animation.finished.catch(()=>{}).finally(()=>splash.remove());}else splash.remove();
  setTimeout(()=>document.body.classList.remove('qp-reveal'),750);
 }requestAnimationFrame(frame);
}
window.QatraPolish=Object.freeze({confirmExit});
window.addEventListener('qatra-intro-ready',()=>{gated=true;introduction();});
function start(){
 scan();new MutationObserver(records=>{if(records.some(record=>[...record.addedNodes].some(el=>el.nodeType===1&&(el.matches?.('select')||el.querySelector?.('select')))))scan();}).observe(document.body,{childList:true,subtree:true});
 ready=true;introduction();
 document.addEventListener('click',event=>{if(event.target.closest?.('#closeNotebookSheet'))setTimeout(()=>document.querySelector('[data-view="homeView"]')?.click(),350);});
 document.addEventListener('visibilitychange',()=>{const splash=$('splash');if(splash)splash.classList.toggle('qp-paused',document.hidden);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
''',encoding='utf-8')

(public/'polish.css').write_text('''
.qp-dialog{box-sizing:border-box;position:fixed;inset:auto 12px max(12px,env(safe-area-inset-bottom));margin:0 auto;width:min(460px,calc(100% - 24px));max-height:82dvh;overflow:auto;padding:24px;border-radius:28px;border:1px solid var(--border);background:var(--surface);background:color-mix(in srgb,var(--surface) 88%,transparent);color:var(--text);box-shadow:0 24px 70px #0005;backdrop-filter:blur(24px) saturate(135%);-webkit-backdrop-filter:blur(24px) saturate(135%);font-family:Cairo,sans-serif;z-index:30000}
.qp-dialog::backdrop{background:#0007;backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}
.qp-dialog[open]{animation:qp-enter .24s ease-out}.qp-dialog h2{font-size:20px;margin:0 0 16px}.qp-dialog p{line-height:1.9;color:var(--text-dim)}
.qp-dialog button,.qp-select{box-sizing:border-box;font:inherit;cursor:pointer;min-height:52px;color:var(--text);border:1px solid var(--border);border-radius:16px;background:transparent;padding:12px 16px}.qp-select{width:100%;text-align:start;margin-top:10px;min-width:0;background:color-mix(in srgb,var(--surface) 55%,transparent)}
.qp-options{display:flex;flex-direction:column;gap:9px;max-height:50dvh;overflow:auto;margin-bottom:16px}.qp-option{text-align:start;flex:none;display:grid;gap:5px}.qp-option small{color:var(--text-dim);overflow-wrap:anywhere}.qp-option[aria-pressed=true]{border-color:var(--primary);background:color-mix(in srgb,var(--primary) 14%,transparent);box-shadow:inset 3px 0 var(--primary)}
.qp-dialog .qp-cancel,.qp-dialog .qp-primary{width:100%;margin-top:8px}.qp-dialog .qp-primary{background:var(--primary);color:var(--q3-on-accent);border-color:transparent}.qp-dialog button:focus-visible,.qp-select:focus-visible{outline:2px solid var(--primary);outline-offset:3px}.qp-dialog button:disabled,.qp-select:disabled{opacity:.5;cursor:default}
#splash.qp-intro{display:flex!important;background:radial-gradient(ellipse at 50% 38%,var(--q3-glow),transparent 60%),var(--bg);color:var(--text);gap:10px;text-align:center;overflow:hidden}#splash.qp-intro h1{font-size:30px;letter-spacing:2px;margin:30px 0 0;animation:qp-enter .8s both}#splash.qp-intro p{color:var(--text-dim);animation:qp-enter 1s .25s both}.qp-orb{position:relative;width:112px;height:112px;display:grid;place-items:center}.qp-orb img{width:90px;height:90px;border-radius:26px;box-shadow:0 0 70px var(--q3-glow);animation:qp-float 2.8s ease-in-out infinite}.qp-ripple,.qp-ripple::after{position:absolute;inset:-28px;content:'';border:1px solid var(--primary);border-radius:50%;animation:qp-ripple 2.8s ease-out infinite}.qp-ripple::after{inset:-18px;animation-delay:.5s}.qp-paused *,.qp-paused *::after{animation-play-state:paused!important}.qp-reveal .app-container{animation:qp-enter .65s both}
@keyframes qp-enter{from{opacity:0;filter:blur(7px)}to{opacity:1;filter:blur(0)}}@keyframes qp-float{50%{transform:translateY(-8px)}}@keyframes qp-ripple{from{transform:scale(.85);opacity:.6}to{transform:scale(1.4);opacity:0}}
@media(prefers-reduced-motion:reduce){.qp-dialog[open],#splash.qp-intro *,.qp-reveal .app-container{animation:none!important}.qp-ripple{display:none}}
''',encoding='utf-8')
html=public/'index.html'
s=html.read_text(encoding='utf-8')
s=replace_once(s,'</head>','<link rel="stylesheet" href="polish.css">\n<style id="qp-boot">.app-container{visibility:hidden}#splash:not(.qp-intro){display:none!important}</style>\n<script defer src="polish.js"></script>\n</head>')
html.write_text(s,encoding='utf-8')

plugin=root/'android/app/src/main/java/com/qatra/app/QatraNavigationPlugin.java'
s=plugin.read_text(encoding='utf-8')
pos=s.rfind('}')
s=s[:pos]+'''    @PluginMethod public void exitConfirmed(PluginCall call){
        getActivity().runOnUiThread(()->{call.resolve();getActivity().finish();});
    }
'''+s[pos:]
plugin.write_text(s,encoding='utf-8')

rate=22050
duration=2.8
samples=[]
for i in range(int(rate*duration)):
    t=i/rate
    value=0.0
    for delay,gain in [(0,1),(.19,.20),(.37,.10)]:
        for start,freq in [(0,523.251),(.24,659.255),(.52,783.991),(.88,1046.502)]:
            u=t-start-delay
            if u>=0:
                envelope=(1-math.exp(-u*75))*math.exp(-u*2.6)
                value+=gain*envelope*(math.sin(2*math.pi*freq*u)+.22*math.sin(2*math.pi*freq*2.003*u))
    samples.append(value*min(1,max(0,(duration-t)/.35)))
peak=max(abs(v) for v in samples) or 1
path=root/'android/app/src/main/res/raw/qatra_ui_startup.wav'
with wave.open(str(path),'wb') as out:
    out.setnchannels(1)
    out.setsampwidth(2)
    out.setframerate(rate)
    out.writeframes(b''.join(struct.pack('<h',round(v/peak*.66*32767)) for v in samples))
