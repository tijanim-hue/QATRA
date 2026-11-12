/* QATRA_GLOBAL_PALETTE_V3 */
(() => {
'use strict';
const rgb=hex=>{
 const m=String(hex).trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);if(!m)return null;
 let value=m[1];if(value.length===3)value=value.split('').map(c=>c+c).join('');
 return [0,2,4].map(i=>parseInt(value.slice(i,i+2),16));
};
const hex=c=>'#'+c.map(n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>a.map((v,i)=>v*(1-t)+b[i]*t);
const lum=c=>c.map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
function paletteFor(base,accent,foreground,muted){
 const bg=rgb(base),raw=rgb(accent),fg=rgb(foreground);if(!bg||!raw||!fg)return null;
 const light=lum(bg)>.45,surface=mix(bg,light?[255,255,255]:[255,255,255],light?.64:.085);
 // Adjust the shared accent only where required for legibility on panel backgrounds.
 let primary=raw;
 for(let step=0;step<=20;step++){
  primary=mix(raw,light?[0,0,0]:[255,255,255],step/25);
  if(contrast(primary,surface)>=4.5)break;
 }
 const mutedRgb=rgb(muted)||mix(fg,bg,.28);
 const secondary=mix(primary,fg,.16);
 const rgba=(c,alpha)=>'rgba('+c.map(Math.round).join(',')+','+alpha+')';
 const color=hex(primary),border=rgba(fg,light?.13:.16),onAccent=contrast([255,255,255],primary)>=contrast([5,15,25],primary)?'#ffffff':'#050f19';
 return {'--bg':hex(bg),'--surface':hex(surface),'--text':hex(fg),'--text-dim':hex(mutedRgb),'--primary':color,'--secondary':hex(secondary),'--border':border,
 '--shadow':'0 12px 32px '+(light?'#00102015':'#00000040'),
 '--q3-panel':hex(surface),'--q3-on-accent':onAccent,'--q3-soft':'linear-gradient(140deg,'+rgba(raw,light?.13:.18)+','+rgba(surface,.8)+')',
 '--q3-screen':'radial-gradient(ellipse at top right,'+rgba(raw,.16)+',transparent 60%),'+hex(bg),
 '--q3-drop':'linear-gradient(140deg,'+hex(mix(raw,[255,255,255],.45))+','+color+')','--q3-glow':rgba(raw,.25),'--q3-danger':light?'#ad2336':'#ffb4bf',
 '--t-card':hex(surface),'--t-text':hex(fg),'--t-sub':hex(mutedRgb),'--t-nav-act':rgba(raw,.18),
 '--qg-panel':rgba(surface,.83),'--qg-sheet':rgba(surface,.96),'--qg-border':border,'--qg-shadow':'0 15px 40px '+(light?'#00102020':'#00000055')};
}
let signature='',root=null,queued=false;
function sync(){
 if(!root)return;const style=getComputedStyle(root),read=name=>style.getPropertyValue('--q2-'+name).trim();
 const values=['bgsolid','accent','fg','muted'].map(read),next=JSON.stringify(values);
 if(next===signature)return;const palette=paletteFor(...values);if(!palette)return;
 signature=next;
 for(const [key,value] of Object.entries(palette))document.body.style.setProperty(key,value,'important');
 document.body.classList.add('q3-themed');
 const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=palette['--bg'];
}
function init(){
 root=document.querySelector('.app-container');if(!root)return;
 const observer=new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;sync();});});
 observer.observe(root,{attributes:true,attributeFilter:['style','data-qatra-skin']});sync();
}
window.QatraGlobalTheme={sync,paletteFor};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
