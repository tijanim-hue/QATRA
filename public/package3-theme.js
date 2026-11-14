/* QATRA global artwork palettes. Original PNG files are never modified. */
(() => {
'use strict';
const rgb=v=>{const m=String(v).trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);if(!m)return null;let s=m[1];if(s.length===3)s=s.split('').map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(s.slice(i,i+2),16));};
const hex=c=>'#'+c.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
const mix=(a,b,t)=>a.map((v,i)=>v*(1-t)+b[i]*t);
const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
const rgba=(c,a)=>'rgba('+c.map(Math.round).join(',')+','+a+')';
function legible(color,surfaces,minimum=4.5){
 if(surfaces.every(bg=>contrast(color,bg)>=minimum))return color;
 const ends=[[0,0,0],[255,255,255]];const target=ends.sort((a,b)=>Math.min(...surfaces.map(bg=>contrast(b,bg)))-Math.min(...surfaces.map(bg=>contrast(a,bg))))[0];
 for(let i=1;i<=100;i++){const next=mix(color,target,i/100);if(surfaces.every(bg=>contrast(next,bg)>=minimum))return next;}return target;
}
function paletteFor(base,accent,foreground,muted){
 let bg=rgb(base),raw=rgb(accent);if(!bg||!raw)return null;
 const light=lum(bg)>.35;bg=mix(bg,light?[255,255,255]:[0,0,0],.15);
 const surface=mix(bg,[255,255,255],light?.68:.065);
 const surfaces=[bg,surface];const fg=legible(rgb(foreground)||(light?[15,23,42]:[248,250,252]),surfaces,7);
 const dim=legible(rgb(muted)||mix(fg,bg,.25),surfaces);
 const primary=legible(raw,surfaces),on=contrast([255,255,255],primary)>=contrast([0,0,0],primary)?'#ffffff':'#000000';
 const border=rgba(fg,.18),soft=hex(surface);
 return {'--bg':hex(bg),'--surface':soft,'--text':hex(fg),'--text-dim':hex(dim),'--primary':hex(primary),'--secondary':hex(primary),'--border':border,'--shadow':'0 12px 32px '+(light?'#00102020':'#00000040'),'--q3-panel':soft,'--q3-on-accent':on,'--q3-soft':soft,'--q3-screen':hex(bg),'--q3-drop':'linear-gradient(140deg,'+hex(raw)+','+hex(primary)+')','--q3-glow':rgba(raw,.25),'--q3-danger':light?'#a51d32':'#ffb4bf','--t-card':soft,'--t-text':hex(fg),'--t-sub':hex(dim),'--t-nav-act':'transparent','--qg-panel':soft,'--qg-sheet':soft,'--qg-border':border,'--qg-shadow':'0 12px 32px rgba(0,0,0,.16)','--q3-neutral-bg':light?'#f1f3f5':'#171b24','--q3-neutral-text':light?'#334155':'#e2e8f0'};
}
let root=null,signature='',queued=false,epoch=0;const cache=new Map();
function apply(values){const palette=paletteFor(...values);if(!palette)return;for(const [name,value]of Object.entries(palette))document.body.style.setProperty(name,value,'important');document.body.classList.add('q3-themed');const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=palette['--bg'];}
function sample(id,fallback,token){
 const image=new Image();image.onload=()=>{
  if(token!==epoch)return;
  try{const canvas=document.createElement('canvas');canvas.width=32;canvas.height=56;const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return;ctx.drawImage(image,0,0,32,56);const pixels=ctx.getImageData(0,0,32,56).data;
   const edges=[],buckets=new Map();
   for(let y=0;y<56;y++)for(let x=0;x<32;x++){const p=(y*32+x)*4;if(pixels[p+3]<240)continue;const c=[pixels[p],pixels[p+1],pixels[p+2]];if(x<4||x>27||y<4||y>51)edges.push(c);const hi=Math.max(...c),lo=Math.min(...c);if(hi-lo>35&&lum(c)>.025&&lum(c)<.88){const key=c.map(v=>Math.floor(v/32)).join(',');const b=buckets.get(key)||{n:0,sum:[0,0,0]};b.n++;c.forEach((v,i)=>b.sum[i]+=v);buckets.set(key,b);}}
   if(!edges.length)return;const base=[0,1,2].map(i=>edges.map(c=>c[i]).sort((a,b)=>a-b)[Math.floor(edges.length/2)]);const dominant=[...buckets.values()].sort((a,b)=>b.n-a.n)[0];const accent=dominant?dominant.sum.map(v=>v/dominant.n):rgb(fallback[1]);const values=[hex(base),hex(accent||[56,189,248])];cache.set(id,values);if(token===epoch)apply(values);
  }catch(error){/* Keep a legible fallback palette when sampling is unavailable. */}
 };image.src='assets/qatra-skins/qatra-theme-'+String(id).padStart(2,'0')+'.png';
}
function sync(){if(!root)return;const style=getComputedStyle(root),read=n=>style.getPropertyValue('--q2-'+n).trim();const id=Number(root.dataset.qatraSkin);const fallback=['bgsolid','accent','fg','muted'].map(read);const next=JSON.stringify([id,...fallback]);if(next===signature)return;signature=next;const token=++epoch;apply(cache.get(id)||fallback);if(Number.isInteger(id)&&id>=1&&id<=8&&!cache.has(id))sample(id,fallback,token);}
function init(){
 const style=document.createElement('style');style.textContent=`
body.q3-themed .floating-nav{background:var(--q3-neutral-bg)!important;border-color:rgba(128,128,128,.2)!important;box-shadow:0 12px 32px rgba(0,0,0,.16)!important}
body.q3-themed .floating-nav .nav-item,body.q3-themed .floating-nav .nav-item.active{color:var(--q3-neutral-text)!important;background:transparent!important;box-shadow:none!important}
body.q3-themed .floating-nav .nav-item svg{color:inherit!important;stroke:currentColor!important}
body.q3-themed .floating-nav .nav-home-btn{background:var(--primary)!important;color:var(--q3-on-accent)!important;box-shadow:0 8px 22px var(--q3-glow)!important;border-color:var(--q3-neutral-bg)!important}
body.q3-themed .floating-nav .nav-home-btn svg{stroke:var(--q3-on-accent)!important}
body.q3-themed :is(.glass-card,.garden-card,.qn-card,.qn-stat,.qn-progress,.qatra-notebook,.qatra-ai-panel,.qatra-dialog,.qe-panel,.qh-panel,.ql-card){background:var(--surface)!important;color:var(--text)!important;border-color:var(--border)!important}
body.q3-themed :is(.view,.sheet-content,.qatra-notebook,.qatra-dialog) :is(h1,h2,h3,h4,label,.card-title,.qn-text,.qn-progress-row,.qatra-ai-output){color:var(--text)!important}
body.q3-themed :is(.view,.sheet-content,.qatra-notebook,.qatra-dialog) :is(p,small,.card-sub,.qn-time,.qatra-ai-status){color:var(--text-dim)!important}
body.q3-themed :is(.card-icon,.setting-icon,.qn-stat b,.qn-badge,.qn-tag){color:var(--primary)!important;background:var(--surface)!important}
body.q3-themed :is(textarea,select,input[type=text],input[type=time],input[type=number],input[type=datetime-local]){background:var(--surface)!important;color:var(--text)!important;border-color:var(--border)!important}
body.q3-themed #mindfulSheet textarea,body.q3-themed #mindfulSheet label,body.q3-themed #mindfulSheet .qatra-ai-output{color:var(--text)!important;background-color:var(--surface)!important}
body.q3-themed :is(textarea,input)::placeholder{color:var(--text-dim)!important;opacity:1!important}
body.q3-themed :is(.btn-solid,.qatra-ai-ask,.mm-primary,.qn-chip.active,.ql-tab.active,.ql-use){background:var(--primary)!important;color:var(--q3-on-accent)!important}
body.q3-themed #homeView :is(.card-title,.glass-card span){color:var(--text)!important}
body.q3-themed #homeView .card-sub{color:var(--text-dim)!important}
body.q3-themed #surpriseButton :is(.surprise-title,.surprise-description){color:var(--text)!important;background:var(--surface)!important;border-radius:12px;padding-inline:8px;text-shadow:none!important}
body.q3-themed .qatra-notebook-head,body.q3-themed .qatra-notebook-card{background:#15243c!important;color:#fff!important}
body.q3-themed .qatra-notebook-head h2,body.q3-themed .qatra-notebook-card .card-title{color:#fff!important}
body.q3-themed .qatra-notebook-card .card-sub{color:#e2e8f0!important}
body.q3-themed .qatra-notebook-card .card-icon{background:#253b5b!important;color:#fff!important}
body.q3-themed .qatra-dialog-btn{background:var(--surface);color:var(--text);border-color:var(--border)}
body.q3-themed .qatra-dialog-btn.primary{background:var(--primary);color:var(--q3-on-accent)}
body.q3-themed .qatra-dialog-btn.primary.danger{background:#b91c1c;color:#fff}
`;document.head.appendChild(style);
 root=document.querySelector('.app-container');if(!root)return;new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;sync();});}).observe(root,{attributes:true,attributeFilter:['style','data-qatra-skin']});sync();
}
window.QatraGlobalTheme={sync,paletteFor};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
