import pathlib

root = pathlib.Path(__file__).resolve().parents[1]
app = root / 'public/app.js'
source = app.read_text(encoding='utf-8')
source += r'''
/* QATRA: bottom-edge continuation and targeted home contrast. */
(() => {
'use strict';
const rgb=v=>{const m=String(v).trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);if(!m)return null;const s=m[1].length===3?m[1].split('').map(c=>c+c).join(''):m[1];return [0,2,4].map(i=>parseInt(s.slice(i,i+2),16));};
const mix=(a,b,t)=>a.map((v,i)=>v*(1-t)+b[i]*t);
const hex=c=>'#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
let root,signature='',epoch=0,queued=false;const cache=new Map();
function paint(bottom,accent){
 const tint=mix(bottom,[0,0,0],.86),backs=[[0,0,0],[255,255,255]].map(bg=>mix(bg,tint,.82));
 let ink=accent;
 for(let i=0;i<=100;i++){ink=mix(accent,[255,255,255],i/100);if(backs.every(bg=>ratio(ink,bg)>=4.5))break;}
 const on=ratio([255,255,255],ink)>=ratio([0,0,0],ink)?'#ffffff':'#000000';
 for(const [key,value] of Object.entries({'--q3-bottom':hex(bottom),'--q8-home-panel':'rgba('+tint.map(Math.round).join(',')+',.82)','--q8-home-accent':hex(ink),'--q8-home-on':on}))document.body.style.setProperty(key,value,'important');
}
function sync(){
 const style=getComputedStyle(root),id=Number(root.dataset.qatraSkin),base=style.getPropertyValue('--q2-bgsolid').trim(),accent=style.getPropertyValue('--q2-accent').trim();
 const next=JSON.stringify([id,base,accent]);if(next===signature)return;signature=next;const token=++epoch;
 const fallback=rgb(base)||[7,20,34],color=rgb(accent)||[125,211,252];paint(cache.get(id)||fallback,color);
 if(!Number.isInteger(id)||id<1||id>8||cache.has(id))return;
 const image=new Image();image.onload=()=>{
  try{
   const canvas=document.createElement('canvas');canvas.width=64;canvas.height=1;const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return;
   ctx.drawImage(image,0,image.naturalHeight-1,image.naturalWidth,1,0,0,64,1);const data=ctx.getImageData(0,0,64,1).data,colors=[];
   for(let i=0;i<data.length;i+=4)if(data[i+3]>=240)colors.push([data[i],data[i+1],data[i+2]]);
   if(!colors.length)return;const bottom=[0,1,2].map(c=>colors.map(v=>v[c]).sort((a,b)=>a-b)[Math.floor(colors.length/2)]);
   cache.set(id,bottom);if(token===epoch)paint(bottom,color);
  }catch(error){/* Retain theme-local fallback; never substitute another theme. */}
 };image.src='assets/qatra-skins/qatra-theme-'+String(id).padStart(2,'0')+'.png';
}
function start(){
 root=document.querySelector('.app-container');if(!root)return;
 const css=document.createElement('style');css.textContent=`
/* Continue the actual artwork's bottom edge beneath the floating navigation. */
html body.qg-permanent.q3-themed.glass-active{background:var(--q3-bottom,var(--bg))!important}
html body.qg-permanent.q3-themed.glass-active .app-container.q2-home{background:var(--q3-bottom,var(--q2-bgsolid,var(--bg)))!important;overflow-x:clip;min-width:0;transform:none!important;translate:none!important}
html body.qg-permanent.q3-themed.glass-active .app-container.q2-home .q2-wall{background-color:var(--q3-bottom,var(--q2-bgsolid))!important;background-position:center top!important;transform:none!important;translate:none!important;rotate:none!important;scale:none!important}
/* Lock the main home scrollport horizontally, without fixing its vertical position. */
html body.qg-permanent .app-container.q2-home #scrollContent{overflow-x:hidden!important;overscroll-behavior-x:none;touch-action:pan-y pinch-zoom;min-width:0;max-width:100%;box-sizing:border-box}
html body.qg-permanent .app-container.q2-home #homeView{min-width:0;max-width:100%}
/* Only these artwork palettes need a stronger, still translucent reading layer. */
html body.qg-permanent.glass-active.q3-themed .app-container:is([data-qatra-skin="3"],[data-qatra-skin="4"],[data-qatra-skin="7"]) #homeView .glass-card{background:var(--q8-home-panel)!important;color:#f8fafc!important;border:1px solid rgba(255,255,255,.30)!important;box-shadow:inset 0 1px 0 #ffffff20,0 10px 26px #00000024!important}
html body.qg-permanent.glass-active.q3-themed .app-container:is([data-qatra-skin="3"],[data-qatra-skin="4"],[data-qatra-skin="7"]) #homeView .glass-card :is(.card-title,span,strong,b,h2,h3){color:#f8fafc!important}
html body.qg-permanent.glass-active.q3-themed .app-container:is([data-qatra-skin="3"],[data-qatra-skin="4"],[data-qatra-skin="7"]) #homeView .glass-card :is(.card-sub,p,small){color:#dce7f2!important;opacity:1!important}
html body.qg-permanent.glass-active.q3-themed .app-container:is([data-qatra-skin="3"],[data-qatra-skin="4"],[data-qatra-skin="7"]) #homeView .glass-card .card-icon{color:var(--q8-home-accent)!important;background:rgba(255,255,255,.07)!important;border-color:rgba(255,255,255,.22)!important}
html body.qg-permanent.glass-active.q3-themed .app-container:is([data-qatra-skin="3"],[data-qatra-skin="4"],[data-qatra-skin="7"]) #homeView .glass-card .btn-solid{background:var(--q8-home-accent)!important;color:var(--q8-home-on)!important}
html body.qg-permanent.glass-active.q3-themed .app-container:is([data-qatra-skin="3"],[data-qatra-skin="4"],[data-qatra-skin="7"]) #surpriseButton :is(.surprise-title,.surprise-description){background:var(--q8-home-panel)!important;color:#f8fafc!important;text-shadow:none!important}
@media(prefers-contrast:more){html body.qg-permanent.glass-active.q3-themed .app-container:is([data-qatra-skin="3"],[data-qatra-skin="4"],[data-qatra-skin="7"]) #homeView .glass-card{background:#101820!important;border-color:#dce7f2!important}}
`;document.head.appendChild(css);
 new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;sync();});}).observe(root,{attributes:true,attributeFilter:['style','data-qatra-skin']});sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
'''
app.write_text(source, encoding='utf-8')
