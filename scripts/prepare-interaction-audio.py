from pathlib import Path
import math
import random
import struct
import wave

root=Path(__file__).resolve().parents[1]
public=root/'public'
plugin=root/'android/app/src/main/java/com/qatra/app/QatraPlugin.kt'
text=plugin.read_text(encoding='utf-8')
anchor='override fun load() {\nsuper.load()\n'
if text.count(anchor)!=1:
    raise SystemExit('Unexpected native plugin load hook; refusing duplicate audio setup.')
text=text.replace(anchor,anchor+'try{if(qatraUiSounds==null)qatraUiSounds=QatraUiSounds(context)}catch(e:Exception){android.util.Log.w("QatraUiSounds","Audio preparation unavailable",e)}\n',1)
plugin.write_text(text,encoding='utf-8')

(public/'interaction-audio.js').write_text(r'''
(() => {
'use strict';
if(window.QatraInteractionAudio)return;
let lastTap=-1000;
const targets='button,a[href],summary,[role="button"],[onclick],input[type="checkbox"],input[type="radio"],select,.custom-radio-item,.day-chip,.note-cat-btn,.nav-item,.nav-home-btn,.header-btn,.mm-pill,.mm-card,.qn-chip,.ql-tab,.qp-option,.action-card,[data-view],[data-sheet]';
function tap(){
 const now=performance.now();if(now-lastTap<45)return;lastTap=now;
 try{
  const native=typeof QatraNative!=='undefined'?QatraNative:null;
  if(native&&typeof native.playUiSound==='function')Promise.resolve(native.playUiSound({name:'tap'})).catch(()=>{});
 }catch(error){/* Feedback must never prevent the underlying action. */}
}
function permitted(control){return !!control&&!control.matches(':disabled,[aria-disabled="true"]')&&!control.closest('[inert],[hidden],[aria-disabled="true"]');}
document.addEventListener('click',event=>{
 if(!event.isTrusted||!(event.target instanceof Element))return;
 const control=event.target.closest(targets);if(!permitted(control))return;
 tap();
},true);
document.addEventListener('change',event=>{
 if(!event.isTrusted||!(event.target instanceof Element))return;
 const control=event.target;if(control.matches('input[type="range"],select')&&permitted(control))tap();
},true);
window.QatraInteractionAudio=Object.freeze({enabled:true});
})();
''',encoding='utf-8')

html=public/'index.html'
text=html.read_text(encoding='utf-8')
if text.count('</head>')!=1 or 'src="interaction-audio.js"' in text:
    raise SystemExit('Unexpected interaction audio script integration.')
text=text.replace('</head>','<script defer src="interaction-audio.js"></script>\n</head>',1)
html.write_text(text,encoding='utf-8')

rate=22050
duration=.095
rng=random.Random(621)
samples=[]
for i in range(int(rate*duration)):
    t=i/rate
    attack=1-math.exp(-t*1300)
    body=math.sin(2*math.pi*(1080*t-2100*t*t))*math.exp(-t*62)
    sparkle=.20*math.sin(2*math.pi*2160*t)*math.exp(-t*105)
    texture=.13*(rng.random()*2-1)*math.exp(-t*190)
    fade=min(1,max(0,(duration-t)/.018))
    samples.append(attack*(body+sparkle+texture)*fade)
peak=max(abs(v) for v in samples) or 1
path=root/'android/app/src/main/res/raw/qatra_ui_tap.wav'
with wave.open(str(path),'wb') as out:
    out.setnchannels(1)
    out.setsampwidth(2)
    out.setframerate(rate)
    out.writeframes(b''.join(struct.pack('<h',round(v/peak*.70*32767)) for v in samples))
