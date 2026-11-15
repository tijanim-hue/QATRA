from pathlib import Path

root=Path(__file__).resolve().parents[1]
js=root/'public/qatra-medicine.js'
css=root/'public/qatra-medicine.css'
text=js.read_text(encoding='utf-8')
style=css.read_text(encoding='utf-8')
marker='/* qatra-picker-v2 */'
if marker in text or marker in style:
    raise SystemExit('Picker preparation unexpectedly ran twice.')
start='function createWheel(label,count,initial){'
end='function openTimePicker(){'
anchor=" update();\n timePicker.addEventListener('click',event=>{"
if text.count(start)!=1 or text.count(end)!=1 or text.count(anchor)!=1:
    raise SystemExit('Ambiguous medicine picker anchors.')
a=text.index(start)
b=text.index(end,a)
wheel=r'''function createWheel(label,count,initial){
 const column=document.createElement('div');column.className='qm-wheel-column';
 const caption=document.createElement('span');caption.className='qm-wheel-label';caption.textContent=label;
 const wheel=document.createElement('div');wheel.className='qm-wheel';wheel.tabIndex=0;
 wheel.setAttribute('role','spinbutton');wheel.setAttribute('aria-label',label);
 wheel.setAttribute('aria-valuemin','0');wheel.setAttribute('aria-valuemax',String(count-1));
 const list=document.createElement('div');list.className='qm-wheel-list';list.setAttribute('aria-hidden','true');
 const rows=Array.from({length:7},()=>{const row=document.createElement('div');row.className='qm-wheel-item';list.appendChild(row);return row;});
 wheel.appendChild(list);column.append(caption,wheel);
 const mod=n=>((n%count)+count)%count,step=44;
 let position=initial,frame=0,target=null,drag=null,wheelDelta=0;
 const value=()=>mod(Math.round(target===null?position:target));
 function paint(){
  const base=Math.floor(position),fraction=position-base;
  rows.forEach((row,i)=>{const index=base+i-3;row.textContent=pad(mod(index));row.classList.toggle('is-selected',index===Math.round(position));});
  list.style.transform=`translate3d(0,${-step-fraction*step}px,0)`;
  wheel.setAttribute('aria-valuenow',String(value()));wheel.setAttribute('aria-valuetext',pad(value()));
  column.dispatchEvent(new Event('change',{bubbles:true}));
 }
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;target=null;}
 function set(next,animate=true){
  stop();if(!Number.isFinite(next))return;
  const end=Math.round(next),start=position;
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if(!animate||reduced){position=mod(end);paint();return;}
  target=end;const started=performance.now();
  function tick(now){const t=Math.min(1,(now-started)/220),e=1-Math.pow(1-t,3);position=start+(end-start)*e;
   if(t>=1){position=mod(end);target=null;frame=0;paint();return;}
   paint();frame=requestAnimationFrame(tick);
  }
  frame=requestAnimationFrame(tick);paint();
 }
 wheel.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.button!==0)return;
  stop();drag={id:event.pointerId,y:event.clientY,start:position,lastY:event.clientY,lastAt:performance.now(),velocity:0};
  wheel.setPointerCapture(event.pointerId);event.preventDefault();
 });
 wheel.addEventListener('pointermove',event=>{
  if(!drag||event.pointerId!==drag.id)return;
  const now=performance.now(),dt=Math.max(1,now-drag.lastAt);
  drag.velocity=.6*drag.velocity+.4*(drag.lastY-event.clientY)/step/dt;
  position=drag.start+(drag.y-event.clientY)/step;
  drag.lastY=event.clientY;drag.lastAt=now;paint();event.preventDefault();
 });
 function finish(event,cancelled=false){
  if(!drag||event.pointerId!==drag.id)return;
  const old=drag;drag=null;
  if(wheel.hasPointerCapture(event.pointerId))wheel.releasePointerCapture(event.pointerId);
  const drift=!cancelled&&performance.now()-old.lastAt<100?Math.max(-3,Math.min(3,old.velocity*100)):0;
  set(position+drift);
 }
 wheel.addEventListener('pointerup',event=>finish(event));
 wheel.addEventListener('pointercancel',event=>finish(event,true));
 wheel.addEventListener('lostpointercapture',event=>finish(event,true));
 wheel.addEventListener('wheel',event=>{
  event.preventDefault();wheelDelta+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?220:1);
  if(Math.abs(wheelDelta)>=32){const direction=Math.sign(wheelDelta);wheelDelta=0;set((target===null?Math.round(position):target)+direction);}
 },{passive:false});
 wheel.addEventListener('keydown',event=>{
  const current=target===null?Math.round(position):target;
  const next=event.key==='ArrowUp'?current-1:event.key==='ArrowDown'?current+1:event.key==='Home'?current-mod(current):event.key==='End'?current-mod(current)+count-1:null;
  if(next!==null){event.preventDefault();set(next);}
 });
 paint();return {element:column,get:value,set};
}
'''
text=text[:a]+marker+'\n'+wheel+text[b:]
text=text.replace(anchor," hourWheel.element.addEventListener('change',update);minuteWheel.element.addEventListener('change',update);\n"+anchor,1)
style+=r'''
/* qatra-picker-v2 */
#qmTimePicker{align-items:center;padding:16px;padding-bottom:max(16px,env(safe-area-inset-bottom));backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:inherit;color:var(--text)}
#qmTimePicker .qm-time-card{max-height:90dvh;overflow:auto;padding:22px;border-radius:28px;background:var(--surface);box-shadow:0 24px 80px #0005}
#qmTimePicker .qm-preview{font-variant-numeric:tabular-nums;direction:ltr;font-size:38px;line-height:1.4}
#qmTimePicker .qm-wheel-row{direction:ltr;align-items:flex-start;gap:18px}
#qmTimePicker .qm-wheel-column{width:130px;max-width:40vw;display:flex;flex-direction:column;gap:10px;min-width:0}
#qmTimePicker .qm-wheel-column>.qm-wheel-label{position:static;display:block;height:auto;line-height:1.8;text-align:center;font-size:14px;font-weight:700;color:var(--text-dim);direction:rtl}
#qmTimePicker .qm-wheel{width:100%;height:220px;position:relative;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;isolation:isolate;cursor:grab}
#qmTimePicker .qm-wheel:active{cursor:grabbing}
#qmTimePicker .qm-wheel-list{inset:0;transition:none!important;pointer-events:none;will-change:transform}
#qmTimePicker .qm-wheel-item{height:44px;min-height:44px;line-height:44px;font-size:24px;font-variant-numeric:tabular-nums;direction:ltr}
#qmTimePicker .qm-wheel::before{top:88px;z-index:2;opacity:1;background:var(--primary)}
#qmTimePicker .qm-wheel::after{top:132px;z-index:2;opacity:1;background:var(--primary)}
#qmTimePicker .qm-time-actions{display:flex;gap:12px;margin-top:18px}
#qmTimePicker .qm-time-actions button{font:inherit;min-height:50px;padding:12px 18px;border:1px solid var(--border);border-radius:16px;background:var(--bg);color:var(--text);cursor:pointer;flex:1;font-weight:700}
#qmTimePicker .qm-time-actions .qm-primary{background:var(--primary);color:var(--q3-on-accent,#071522);border-color:transparent}
#qmTimePicker :focus-visible{outline:2px solid var(--primary);outline-offset:3px}
#qmTimePicker .qm-time-actions button:active{transform:scale(.98)}
'''
js.write_text(text,encoding='utf-8')
css.write_text(style,encoding='utf-8')
