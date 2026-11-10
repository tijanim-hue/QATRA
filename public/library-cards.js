"use strict";
/* QATRA phase 3: six-category swipe library. The existing state/storage are retained. */
(() => {
if(window.QatraLibrary)return;
const UI={"ar": {"title": "الأقسام", "selfDev": "تطوير الذات", "dhikr": "أدعية وأذكار", "quran": "آيات قرآنية", "poetry": "أبيات شعرية", "culture": "حكم وأقوال", "generalCulture": "ثقافة عامة", "choices": "اختياراتي", "add": "أضف إلى اختياراتي", "selected": "ضمن اختياراتي", "copy": "نسخ", "copied": "تم النسخ", "copyFail": "تعذر النسخ؛ حاول مجددًا", "save": "حفظ في المفضلة", "saved": "محفوظة في المفضلة", "next": "التالي", "previous": "السابق", "swipe": "اسحب البطاقة يمينًا أو يسارًا", "empty": "لا توجد عبارات هنا بعد", "emptyChoices": "أضف عبارات إلى اختياراتك أولًا", "use": "استخدام اختياراتي", "using": "مصدر القطرات الآن: اختياراتي", "paused": "اختياراتك فارغة. أُوقفت مواعيد هذا المصدر مؤقتًا حتى تختار عبارات.", "count": "{n} عبارة مختارة", "viewChoices": "عرض اختياراتي", "browse": "استعراض الأقسام", "cancelError": "تعذر إيقاف أحد المواعيد. حاول مجددًا.", "manage": "إدارة اختياراتي"}, "en": {"title": "Categories", "selfDev": "Self development", "dhikr": "Dhikr and supplications", "quran": "Quranic verses", "poetry": "Poetry", "culture": "Wisdom and sayings", "generalCulture": "General knowledge", "choices": "My choices", "add": "Add to my choices", "selected": "In my choices", "copy": "Copy", "copied": "Copied", "copyFail": "Unable to copy; try again", "save": "Save to favorites", "saved": "Saved to favorites", "next": "Next", "previous": "Previous", "swipe": "Swipe the card left or right", "empty": "No quotes here yet", "emptyChoices": "Choose some quotes first", "use": "Use my choices", "using": "Drop source: My choices", "paused": "Your choices are empty. Reminders from this source are paused until you choose quotes.", "count": "{n} selected quotes", "viewChoices": "View my choices", "browse": "Browse categories", "cancelError": "Unable to stop a reminder. Please retry.", "manage": "Manage my choices"}, "fr": {"title": "Catégories", "selfDev": "Développement personnel", "dhikr": "Invocations et rappels", "quran": "Versets du Coran", "poetry": "Poésie", "culture": "Sagesse et citations", "generalCulture": "Culture générale", "choices": "Mes choix", "add": "Ajouter à mes choix", "selected": "Dans mes choix", "copy": "Copier", "copied": "Copié", "copyFail": "Copie impossible ; réessayez", "save": "Enregistrer en favoris", "saved": "Enregistré en favoris", "next": "Suivant", "previous": "Précédent", "swipe": "Glissez la carte à gauche ou à droite", "empty": "Aucune citation pour le moment", "emptyChoices": "Choisissez d’abord des citations", "use": "Utiliser mes choix", "using": "Source des gouttes : Mes choix", "paused": "Vos choix sont vides. Les rappels de cette source sont suspendus jusqu’à votre sélection.", "count": "{n} citations choisies", "viewChoices": "Voir mes choix", "browse": "Parcourir les catégories", "cancelError": "Impossible d’arrêter un rappel. Réessayez.", "manage": "Gérer mes choix"}, "es": {"title": "Categorías", "selfDev": "Desarrollo personal", "dhikr": "Invocaciones y recuerdos", "quran": "Versículos del Corán", "poetry": "Poesía", "culture": "Sabiduría y dichos", "generalCulture": "Cultura general", "choices": "Mis elecciones", "add": "Añadir a mis elecciones", "selected": "En mis elecciones", "copy": "Copiar", "copied": "Copiado", "copyFail": "No se pudo copiar; inténtalo de nuevo", "save": "Guardar en favoritos", "saved": "Guardado en favoritos", "next": "Siguiente", "previous": "Anterior", "swipe": "Desliza la tarjeta a izquierda o derecha", "empty": "Aún no hay frases aquí", "emptyChoices": "Elige algunas frases primero", "use": "Usar mis elecciones", "using": "Fuente de gotas: Mis elecciones", "paused": "No hay elecciones. Los recordatorios de esta fuente se pausan hasta que elijas frases.", "count": "{n} frases elegidas", "viewChoices": "Ver mis elecciones", "browse": "Explorar categorías", "cancelError": "No se pudo detener un recordatorio. Inténtalo de nuevo.", "manage": "Gestionar mis elecciones"}, "de": {"title": "Kategorien", "selfDev": "Persönliche Entwicklung", "dhikr": "Bittgebete und Gedenken", "quran": "Koranverse", "poetry": "Poesie", "culture": "Weisheiten und Zitate", "generalCulture": "Allgemeinwissen", "choices": "Meine Auswahl", "add": "Zur Auswahl hinzufügen", "selected": "In meiner Auswahl", "copy": "Kopieren", "copied": "Kopiert", "copyFail": "Kopieren fehlgeschlagen; erneut versuchen", "save": "In Favoriten speichern", "saved": "In Favoriten gespeichert", "next": "Weiter", "previous": "Zurück", "swipe": "Karte nach links oder rechts ziehen", "empty": "Hier gibt es noch keine Zitate", "emptyChoices": "Wähle zuerst einige Zitate aus", "use": "Meine Auswahl verwenden", "using": "Tropfenquelle: Meine Auswahl", "paused": "Deine Auswahl ist leer. Erinnerungen aus dieser Quelle werden bis zur Auswahl pausiert.", "count": "{n} ausgewählte Zitate", "viewChoices": "Meine Auswahl ansehen", "browse": "Kategorien durchsuchen", "cancelError": "Eine Erinnerung konnte nicht gestoppt werden. Bitte erneut versuchen.", "manage": "Meine Auswahl verwalten"}};
const SEEDS=[{"category": "selfDev", "text": "خطوة صغيرة تتكرر كل يوم تصنع فرقًا أكبر من حماس لا يستمر.", "source": "من صياغة قطرة"}, {"category": "selfDev", "text": "قارن تقدّمك بما كنت عليه، لا بما يعرضه الآخرون.", "source": "من صياغة قطرة"}, {"category": "selfDev", "text": "امنح انتباهك لمهمة واحدة، ثم انتقل إلى التالية بهدوء.", "source": "من صياغة قطرة"}, {"category": "selfDev", "text": "الراحة جزء من الاستمرار، وليست نقيض الإنجاز.", "source": "من صياغة قطرة"}, {"category": "selfDev", "text": "يمكنك تعديل خطتك دون أن تتخلى عن هدفك.", "source": "من صياغة قطرة"}, {"category": "dhikr", "text": "سبحان الله", "source": ""}, {"category": "dhikr", "text": "الحمد لله", "source": ""}, {"category": "dhikr", "text": "الله أكبر", "source": ""}, {"category": "dhikr", "text": "لا إله إلا الله", "source": ""}, {"category": "quran", "text": "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", "source": "البقرة: 286 — مقتطف من الآية", "url": "https://quran.com/al-baqarah/286"}, {"category": "quran", "text": "وَجَعَلَ الْقَمَرَ فِيهِنَّ نُورًا وَجَعَلَ الشَّمْسَ سِرَاجًا", "source": "نوح: 16", "url": "https://quran.com/nuh/16-28"}, {"category": "culture", "text": "ليس كل بطء تأخرًا؛ أحيانًا يكون ترتيبًا للخطوات.", "source": "من صياغة قطرة"}, {"category": "culture", "text": "حين لا تستطيع تغيير البداية، يمكنك تحسين الخطوة التالية.", "source": "من صياغة قطرة"}, {"category": "generalCulture", "text": "ضوء القمر الذي نراه هو ضوء الشمس المنعكس عن سطحه؛ فالقمر لا يصنع ضوءه بنفسه.", "source": "NASA — Moonlight", "url": "https://science.nasa.gov/moon/moonlight/"}, {"category": "generalCulture", "text": "يتكوّن جزيء الماء من ذرتَي هيدروجين وذرة أكسجين، وتُكتب صيغته الكيميائية H₂O.", "source": "USGS — Water Isotopes Diagram", "url": "https://www.usgs.gov/media/images/water-isotopes-diagram"}];
const ORDER=['selfDev','dhikr','quran','poetry','culture','generalCulture'];
const LANG=()=>UI[state.lang]?state.lang:'ar';
const t=(key,values={})=>{let text=UI[LANG()][key]||UI.en[key]||key;for(const [k,v] of Object.entries(values))text=text.split('{'+k+'}').join(typeof v==='number'?new Intl.NumberFormat(LANG()).format(v):String(v));return text;};
const isReal=text=>typeof text==='string'&&text.trim()&&!/^(دعاء رقم|فكرة تطوير ذات رقم|آية رقم|حكمة رقم|بيت شعر رقم)\s*\d+\s*$/.test(text);
const metadata=new Map();
function itemId(category,text){let hash=2166136261;for(const c of category+'\n'+text){hash^=c.codePointAt(0);hash=Math.imul(hash,16777619);}return category+'-'+(hash>>>0).toString(16);}
const makeRecord=(category,text)=>({id:itemId(category,text),category,text,source:metadata.get(category+'\n'+text)?.source||''});
if(!QUOTES_DB.generalCulture)QUOTES_DB.generalCulture={key:'cat_generalCulture',icon:QUOTES_DB.culture.icon,items:[]};
for(const entry of SEEDS){
 const category=QUOTES_DB[entry.category];
 if(category&&!category.items.includes(entry.text))category.items.push(entry.text);
 metadata.set(entry.category+'\n'+entry.text,entry);
}
for(const [lang,words] of Object.entries(UI)){
 if(!DICT[lang])DICT[lang]={...DICT.en};
 Object.assign(DICT[lang],{cat_culture:words.culture,cat_generalCulture:words.generalCulture,ql_my_choices:words.choices});
}
const unique=new Set();
state.myChoices=(Array.isArray(state.myChoices)?state.myChoices:[]).filter(entry=>{
 if(!entry||!ORDER.includes(entry.category)||!isReal(entry.text))return false;
 const key=entry.category+'\n'+entry.text;if(unique.has(key))return false;unique.add(key);return true;
}).map(entry=>({...entry,id:itemId(entry.category,entry.text)}));
let category='selfDev';let position=0;let renderVersion=0;let moving=false;let host=null;let status='';let paintedLanguage=null;
const save=()=>localStorage.setItem(STORE_KEY,JSON.stringify(state));
const records=key=>key==='myChoices'?state.myChoices.map(entry=>({...entry,source:entry.source||metadata.get(entry.category+'\n'+entry.text)?.source||''})):Array.from(new Set(QUOTES_DB[key]?.items.filter(isReal)||[])).map(text=>makeRecord(key,text));
const hasChoice=entry=>state.myChoices.some(e=>e.category===entry.category&&e.text===entry.text);
const element=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
function notify(message){status=message;const label=document.getElementById('ql-status');if(label)label.textContent=message;else{const toast=document.getElementById('copyToast');if(toast){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000);}}}
function updateCounts(){
 const count=document.getElementById('ql-choice-count');if(count)count.textContent=t('count',{n:state.myChoices.length});
 const active=document.querySelector('[data-value="myChoices"]');if(active)active.classList.toggle('active',state.quoteSource==='myChoices');
}
function refreshSourceLabels(){
 const group=document.getElementById('quoteSourceGroup');if(!group)return;
 for(const key of ['myChoices','generalCulture']){
  if(group.querySelector('[data-value="'+key+'"]'))continue;
  const button=element('button','custom-radio-item ql-source-option');button.type='button';button.dataset.value=key;
  const label=element('span','',key==='myChoices'?t('choices'):t('generalCulture'));
  label.setAttribute('data-i18n',key==='myChoices'?'ql_my_choices':'cat_generalCulture');button.appendChild(label);
  button.appendChild(element('div','custom-radio-circle'));button.addEventListener('click',()=>window.setQuoteSource(key));
  if(key==='myChoices')group.prepend(button);else group.appendChild(button);
 }
 if(!document.getElementById('ql-manage-choices')){
  const manage=element('button','ql-manage',t('manage'));manage.type='button';manage.id='ql-manage-choices';manage.addEventListener('click',()=>open('myChoices'));group.insertAdjacentElement('afterend',manage);
 }
 const manage=document.getElementById('ql-manage-choices');if(manage)manage.textContent=t('manage');
 updateCounts();
}
const previousApply=applyState;
applyState=function(){previousApply();refreshSourceLabels();if(host&&paintedLanguage!==LANG()&&document.getElementById('categorySheet')?.classList.contains('show'))render();};
const previousSet=window.setQuoteSource;
window.setQuoteSource=function(source){if(source==='myChoices'&&!state.myChoices.length){notify(t('emptyChoices'));return;}previousSet(source);};
const previousSync=syncNativeAlarms;
let pauseQueue=Promise.resolve();
syncNativeAlarms=function(){
 pauseQueue=pauseQueue.catch(()=>{}).then(async()=>{
  if(state.quoteSource!=='myChoices'||state.myChoices.length)return previousSync();
  if(!QatraNative)return;
  try{
   await QatraNative.scheduleInterval({intervalMinutes:0,mode:state.mode,duration:state.duration});
   for(const schedule of state.schedules)await QatraNative.cancel({id:schedule.id});
   if(typeof QatraNative.reconcileHomeAlarms==='function')await QatraNative.reconcileHomeAlarms({ids:[]});
   if(window.QatraHome)await window.QatraHome.refresh();notify(t('paused'));
  }catch(error){console.error('QATRA empty choices',error);notify(t('cancelError'));}
 });return pauseQueue;
};
getRandomQuote=function(){
 if(state.quoteSource==='myChoices'){
  const choices=state.myChoices;if(!choices.length)return {quote:t('emptyChoices'),categoryKey:'myChoices'};
  const entry=choices[Math.floor(Math.random()*choices.length)];return {quote:entry.text,categoryKey:entry.category};
 }
 let categories=state.quoteSource==='all'?ORDER:[state.quoteSource];let available=[];
 if(state.quoteSource==='myGroups'||state.quoteSource==='favorites'){
  const keys=state.quoteSource==='favorites'?['favorites']:Object.keys(state.groups);
  const pool=keys.flatMap(key=>state.groups[key]||[]).filter(isReal);
  return {quote:pool.length?pool[Math.floor(Math.random()*pool.length)]:getTranslation('no_custom_quotes'),categoryKey:state.quoteSource};
 }
 for(const key of categories){const pool=records(key);if(pool.length)available.push(pool);}
 if(!available.length)return {quote:t('empty'),categoryKey:state.quoteSource};
 const pool=available[Math.floor(Math.random()*available.length)];const entry=pool[Math.floor(Math.random()*pool.length)];return {quote:entry.text,categoryKey:entry.category};
};
function toggleChoice(entry){
 const at=state.myChoices.findIndex(e=>e.category===entry.category&&e.text===entry.text);
 if(at>=0)state.myChoices.splice(at,1);else state.myChoices.push({...entry});
 save();updateCounts();render();
 if(state.quoteSource==='myChoices')syncNativeAlarms();
}
function cardText(card,entry){
 const label=element('span','ql-badge',t(entry.category));card.appendChild(label);
 const quote=element('div','ql-text',entry.text);quote.setAttribute('dir','auto');card.appendChild(quote);
 if(entry.source)card.appendChild(element('p','ql-source',entry.source));
}
function render(){
 if(!host)return;
 ++renderVersion;moving=false;paintedLanguage=LANG();
 const entries=records(category);position=entries.length?((position%entries.length)+entries.length)%entries.length:0;
 host.replaceChildren();
 const tabs=element('div','ql-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label',t('title'));
 for(const key of ORDER){const tab=element('button','ql-tab'+(key===category?' active':''),t(key));tab.type='button';tab.setAttribute('role','tab');tab.setAttribute('aria-selected',key===category?'true':'false');tab.addEventListener('click',()=>{category=key;position=0;status='';render();});tabs.appendChild(tab);}
 host.appendChild(tabs);
 const tools=element('div','ql-tools');const count=element('span','ql-count',t('count',{n:state.myChoices.length}));count.id='ql-choice-count';tools.appendChild(count);
 const filter=element('button','ql-text-button',category==='myChoices'?t('browse'):t('viewChoices'));filter.type='button';filter.addEventListener('click',()=>{category=category==='myChoices'?'selfDev':'myChoices';position=0;status='';render();});tools.appendChild(filter);host.appendChild(tools);
 if(!entries.length){host.appendChild(element('p','ql-empty',category==='myChoices'?t('emptyChoices'):t('empty')));}
 else{
  const deck=element('div','ql-deck');deck.setAttribute('aria-label',t('swipe'));
  for(let layer=2;layer>=1;layer--){const ghost=element('div','ql-card ql-ghost ql-ghost-'+layer);ghost.setAttribute('aria-hidden','true');cardText(ghost,entries[(position+layer)%entries.length]);deck.appendChild(ghost);}
  const entry=entries[position];const card=element('article','ql-card ql-front');cardText(card,entry);
  const actions=element('div','ql-actions');const choose=element('button','ql-choose'+(hasChoice(entry)?' chosen':''),hasChoice(entry)?t('selected'):t('add'));choose.type='button';choose.setAttribute('aria-pressed',hasChoice(entry)?'true':'false');choose.addEventListener('click',()=>toggleChoice(entry));actions.appendChild(choose);
  const mini=element('div','ql-mini-actions');const favorite=element('button','ql-small-button',state.groups.favorites.includes(entry.text)?t('saved'):t('save'));favorite.type='button';favorite.addEventListener('click',()=>{if(!state.groups.favorites.includes(entry.text))state.groups.favorites.push(entry.text);save();favorite.textContent=t('saved');});mini.appendChild(favorite);
  const copy=element('button','ql-small-button',t('copy'));copy.type='button';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(entry.text);copy.textContent=t('copied');}catch(_){notify(t('copyFail'));}});mini.appendChild(copy);actions.appendChild(mini);card.appendChild(actions);deck.appendChild(card);host.appendChild(deck);
  const nav=element('div','ql-navigation');
  const nav=element('div','ql-navigation');
  nav.style.justifyContent = 'center';
  const page=element('span','ql-page',new Intl.NumberFormat(LANG()).format(position+1)+' / '+new Intl.NumberFormat(LANG()).format(entries.length));
  page.setAttribute('dir','ltr');page.setAttribute('aria-live','polite');
  nav.appendChild(page);
  host.appendChild(nav);
  host.appendChild(element('p','ql-hint',t('swipe')));
  function advance(step,direction){
   if(moving||entries.length<2)return;moving=true;
   const version=renderVersion;
   const ghost=deck.querySelector('.ql-ghost-1');if(ghost){ghost.replaceChildren();cardText(ghost,entries[(position+step+entries.length)%entries.length]);}
   const done=()=>{if(version!==renderVersion)return;position=(position+step+entries.length)%entries.length;render();};
   const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   if(reduce){done();return;}
   const end='translateX('+(direction*125)+'%) rotate('+(direction*24)+'deg)';
   if(typeof card.animate==='function'){
    const animation=card.animate([{transform:card.style.transform||'translateX(0) rotate(0deg)',opacity:1},{transform:end,opacity:0}],{duration:330,easing:'cubic-bezier(.2,.65,.3,1)',fill:'forwards'});
    animation.finished.then(done).catch(()=>{if(version===renderVersion)render();});
   }else{card.style.transition='transform 330ms ease, opacity 330ms ease';card.style.transform=end;card.style.opacity='0';setTimeout(done,340);}
  }
  let pointer=null;
  card.addEventListener('pointerdown',event=>{
   if(moving||entries.length<2||event.isPrimary===false||(event.button!==undefined&&event.button!==0)||event.target.closest('button'))return;
   card.style.transition='';pointer={id:event.pointerId,x:event.clientX,y:event.clientY,dx:0};if(card.setPointerCapture)card.setPointerCapture(event.pointerId);
  });
  card.addEventListener('pointermove',event=>{
   if(!pointer||pointer.id!==event.pointerId||moving)return;
   const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
   if(Math.abs(dy)>Math.abs(dx)+18){pointer=null;card.style.transform='';return;}
   pointer.dx=dx;card.style.transform='translateX('+dx+'px) rotate('+(dx/18)+'deg)';
  });
  const release=event=>{if(!pointer||pointer.id!==event.pointerId)return;const dx=pointer.dx;pointer=null;if(Math.abs(dx)>Math.max(45,card.getBoundingClientRect().width*.17))advance(1,dx>0?1:-1);else{card.style.transition='transform 180ms ease';card.style.transform='';setTimeout(()=>{card.style.transition='';},200);}};
  card.addEventListener('pointerup',release);card.addEventListener('pointercancel',()=>{pointer=null;card.style.transform='';});
 }
 const use=element('button','btn-solid ql-use',t('use'));use.type='button';use.disabled=!state.myChoices.length;use.addEventListener('click',()=>{if(!state.myChoices.length){notify(t('emptyChoices'));return;}window.setQuoteSource('myChoices');notify(t('using'));});host.appendChild(use);
 const statusLabel=element('p','ql-status',status);statusLabel.id='ql-status';statusLabel.setAttribute('role','status');host.appendChild(statusLabel);
}
function open(key){
 if(key&&!ORDER.includes(key)&&key!=='myChoices')return;
 if(key)category=key;position=0;status='';
 const sheet=document.getElementById('categorySheet'),content=document.getElementById('catSheetContent');if(!sheet||!content)return;
 const title=document.getElementById('catSheetTitle');if(title)title.textContent=t('title');
 sheet.classList.add('ql-sheet','show');content.replaceChildren();host=element('div','ql-library');content.appendChild(host);render();
}
window.showCategoryList=()=>open('selfDev');window.openQuotesList=key=>open(key);
window.QatraLibrary={open,toggleChoice,records,choices:()=>state.myChoices.map(entry=>({...entry}))};
save();
function init(){
 refreshSourceLabels();
 const mode=document.getElementById('notifModeSetting');
 if(mode)mode.addEventListener('change',event=>{const value=event.target.value;if(['both','floating','notification'].includes(value)){state.mode=value;applyState();syncNativeAlarms();}});
 const duration=document.getElementById('dropDurationSetting');
 if(duration)duration.addEventListener('change',event=>{const value=Number(event.target.value);if([5000,10000,15000].includes(value)){state.duration=value;applyState();syncNativeAlarms();}});
 applyState();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
