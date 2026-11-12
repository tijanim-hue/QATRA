
/* QATRA_PROGRESS_V4: one native ledger; no click interception or shadow counters. */
(() => {
'use strict';
const trees=['dhikr','culture','selfDev','poetry'];
const normalize=text=>String(text).normalize('NFKC').replace(/[\p{M}\u0640]/gu,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/\s+/g,' ').trim();
let snapshot=null,ready=null,readyFlag=false,queue=Promise.resolve(),lastSaved='',pendingSaved='',pendingSavePromise=null;
const hearts=new Map(),catalogue=new Map();
const $=id=>document.getElementById(id);
function category(text,hint){
 if(!catalogue.size&&typeof QUOTES_DB!=='undefined')for(const [key,cat] of Object.entries(QUOTES_DB))for(const value of cat.items||[])if(typeof value==='string')catalogue.set(normalize(value),key);
 const raw=catalogue.get(normalize(text))||hint;
 return raw==='dhikr'||raw==='quran'?'dhikr':raw==='culture'||raw==='generalCulture'?'culture':raw==='poetry'||raw==='feelings'?'poetry':'selfDev';
}
function notify(message){const toast=$('copyToast');if(toast){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),4000);}else console.error(message);}
function quoteState(text){const key=normalize(text);return snapshot?.quotes?.find(q=>q.key===key)||null;}
function isLiked(text){return !!quoteState(text)?.liked;}
function savedItems(){
 const items=new Map();
 for(const group of Object.values(state.groups||{}))for(const text of Array.isArray(group)?group:[])if(typeof text==='string'&&text.trim())items.set(normalize(text),{text,category:category(text)});
 for(const item of state.myChoices||[])if(item?.text?.trim())items.set(normalize(item.text),{text:item.text,category:category(item.text,item.category)});
 return [...items.values()].sort((a,b)=>normalize(a.text).localeCompare(normalize(b.text)));
}
function raw(action,payload={}){
 const result=queue.catch(()=>{}).then(async()=>{
  const values=typeof payload==='function'?payload():payload;
  const data=await QatraNative.progressEvent({action,...values});accept(data);return data;
 });queue=result;return result;
}
async function start(){
 if(ready)return ready;
 ready=(async()=>{
  if(!QatraNative?.progressEvent)throw new Error('ثبّت APK الحزمة الرابعة لتفعيل سجل التقدم.');
  if(!localStorage.getItem('qatra_progress_v4_backup'))localStorage.setItem('qatra_progress_v4_backup',JSON.stringify({stats:state.stats,premiumHearts:state.premiumHearts,at:new Date().toISOString()}));
  let data=await raw('read');
  if(!data.webImported){
   let oldSaved=[];try{oldSaved=JSON.parse(localStorage.getItem('saved_quotes')||'[]');}catch(error){console.warn('Old saved quote format not migrated',error);}
   if(Array.isArray(oldSaved))for(const value of oldSaved)if(typeof value==='string'&&value.trim()&&!state.groups.favorites.includes(value))state.groups.favorites.push(value);
   const items=savedItems().map(x=>({...x,saved:true}));
   for(const item of window.QatraLegacyQuotes?.()||[])items.push({...item,category:category(item.text,item.category),liked:true});
   data=await raw('import',{items});localStorage.setItem(STORE_KEY,JSON.stringify(state));
  }
  lastSaved=JSON.stringify(savedItems());readyFlag=true;accept(data);await syncGroups();return data;
 })().catch(error=>{ready=null;notify(error.message);throw error;});
 return ready;
}
function accept(data){
 if(data?.schemaVersion!==4||!data.categories||!Array.isArray(data.quotes))return;
 if(snapshot&&Number(data.revision)<Number(snapshot.revision))return;
 if(!localStorage.getItem('qatra_progress_v4_backup'))localStorage.setItem('qatra_progress_v4_backup',JSON.stringify({stats:state.stats,premiumHearts:state.premiumHearts,at:new Date().toISOString()}));
 snapshot=data;for(const key of trees)state.stats[key]=Number(data.categories[key])||0;
 state.stats.likes=Number(data.likes)||0;state.stats.drops=Number(data.delivered)||0;
 applyState();paint();
}
function syncGroups(){
 if(!readyFlag)return Promise.resolve();
 const items=savedItems(),signature=JSON.stringify(items);
 if(signature===lastSaved)return Promise.resolve();
 if(signature===pendingSaved)return pendingSavePromise||Promise.resolve();
 pendingSaved=signature;
 pendingSavePromise=raw('syncSaved',{items}).then(()=>{lastSaved=signature;}).catch(error=>{notify('تعذر حفظ التقدم: '+error.message);throw error;}).finally(()=>{if(pendingSaved===signature)pendingSaved='';});
 return pendingSavePromise;
}
async function toggleLike(text,hint){await start();return raw('toggleLike',{text,category:category(text,hint)});}
async function copy(text,hint,clipboardText=text){
 await navigator.clipboard.writeText(clipboardText);
 try{await start();await raw('copy',{text,category:category(text,hint)});}catch(error){notify('تم النسخ، لكن تعذر تسجيل التقدم: '+error.message);}
}
async function toggleSave(text,hint){
 await start();const before=[...(state.groups.favorites||[])],normalized=normalize(text);
 if(before.some(v=>normalize(v)===normalized))state.groups.favorites=before.filter(v=>normalize(v)!==normalized);else state.groups.favorites.push(text);
 try{await syncGroups();applyState();return state.groups.favorites.some(v=>normalize(v)===normalized);}
 catch(error){state.groups.favorites=before;applyState();throw error;}
}
function heartButton(text,hint){
 const button=document.createElement('button');button.type='button';button.className='q4-heart';
 button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
 const paint=()=>{const liked=isLiked(text);button.classList.toggle('liked',liked);button.setAttribute('aria-pressed',String(liked));button.setAttribute('aria-label',state.lang==='ar'?(liked?'إزالة الإعجاب':'إعجاب'):(liked?'Unlike':'Like'));};
 const key=normalize(text);if(!hearts.has(key))hearts.set(key,new Set());hearts.get(key).add({button,paint});paint();
 button.addEventListener('click',async()=>{button.disabled=true;try{await toggleLike(text,hint);paint();}catch(error){notify('تعذر تسجيل الإعجاب: '+error.message);}finally{button.disabled=false;}});
 return button;
}
function mountHeart(parent,text,hint){parent.appendChild(heartButton(text,hint));}
function paintRings(){
 for(const key of trees){
  const emoji=$('treeEmoji_'+key),card=emoji?.closest('.garden-card');if(!card)continue;
  let ring=card.querySelector('.q4-ring');
  if(!ring){ring=document.createElement('div');ring.className='q4-ring';ring.setAttribute('role','progressbar');ring.innerHTML='<svg viewBox="0 0 44 44" aria-hidden="true"><circle class="q4-track" cx="22" cy="22" r="18"/><circle class="q4-fill" cx="22" cy="22" r="18"/></svg><span></span>';card.appendChild(ring);}
  const score=Number(state.stats[key])||0,goals=[5,20,50,100,200,500],goal=goals.find(n=>score<n)||Math.ceil((score+1)/500)*500,previous=score>=500?Math.floor(score/500)*500:(goals.filter(n=>n<=score).pop()||0);
  const pct=Math.min(100,Math.round((score-previous)/(goal-previous)*100));
  ring.querySelector('.q4-fill').style.strokeDashoffset=String(113.097*(1-pct/100));ring.querySelector('span').textContent=pct+'%';
  ring.setAttribute('aria-valuemin',String(previous));ring.setAttribute('aria-valuemax',String(goal));ring.setAttribute('aria-valuenow',String(score));ring.setAttribute('aria-valuetext',score+' / '+goal);ring.title=score+' نقطة · الهدف التالي '+goal;
 }
}
function paint(){
 paintRings();
 if(snapshot){
  if($('statSteps'))$('statSteps').textContent=String(snapshot.steps);
  if($('statQuotes'))$('statQuotes').textContent=String(snapshot.savedUnique);
  let note=$('q4-ledger-note');const journey=$('journeySheetContent');
  if(journey&&!note){note=document.createElement('p');note.id='q4-ledger-note';note.className='q4-note';journey.appendChild(note);}
  if(note)note.textContent=state.lang==='ar'?'الخطوات = الإعجابات النشطة + القطرات المبرمجة المعروضة. المحفوظة = عبارات فريدة محفوظة أو منسوخة. يبدأ سجل الظهور والنسخ الدقيق من هذا التحديث.'+(snapshot.legacy?.unmappedNativeLikes?' يوجد '+snapshot.legacy.unmappedNativeLikes+' إعجاب قديم مجمع محفوظ في الأرشيف، لا يمكن ربطه بعبارات محددة.':''):'';
  let total=$('q4-total-score');const bar=$('totalAwarenessProgress');if(bar&&!total){total=document.createElement('p');total.id='q4-total-score';total.className='q4-note';bar.parentElement.after(total);}
  if(total)total.textContent=String(snapshot.totalScore)+(state.lang==='ar'?' نقطة · الهدف العام 500':' points · goal 500');
 }
 for(const [key,entries] of hearts){for(const entry of entries){if(entry.button.isConnected)entry.paint();else entries.delete(entry);}if(!entries.size)hearts.delete(key);}
 for(const button of document.querySelectorAll('[data-q4-text]')){const text=decodeURIComponent(button.dataset.q4Text);const liked=isLiked(text);button.classList.toggle('liked',liked);button.setAttribute('aria-pressed',String(liked));}
}
window.QatraProgress={start,refresh,accept,syncGroups,copy,toggleLike,toggleSave,heartButton,mountHeart,paint,paintRings,category,isLiked,normalize,get snapshot(){return snapshot;}};
function refresh(){return start().then(()=>raw('read'));}
function init(){start().catch(()=>{});if(QatraNative?.addListener)Promise.resolve(QatraNative.addListener('progressChanged',()=>refresh().catch(()=>{}))).catch(console.warn);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
