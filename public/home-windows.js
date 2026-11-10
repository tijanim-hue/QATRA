"use strict";
/* QATRA phase 2: additive home windows and native-ledger integration. */
(() => {
const WORDS = {"ar": {"next": "قطرتك القادمة", "impact": "أثر اليوم", "moment": "لحظتك الحالية", "quote": "اقتباس اليوم", "close": "إغلاق", "copy": "نسخ الاقتباس", "copied": "تم النسخ", "copyFailed": "تعذر النسخ. حاول مجددًا.", "loading": "جارٍ قراءة بيانات التطبيق…", "unavailable": "تعذر قراءة البيانات من خدمة Android. أعد فتح النافذة للمحاولة.", "none": "لا توجد قطرة مجدولة", "noneHint": "أضف موعدًا أو فعّل التكرار من إعدادات قطرتي.", "remaining": "الوقت المتبقي", "scheduled": "الموعد المخطط", "source": "المصدر", "delayed": "بانتظار التسليم", "timingNote": "هذا موعد مخطط؛ قد يؤخر نظام Android التسليم أثناء توفير الطاقة.", "today": "إعجابات اليوم", "total": "إجمالي الإعجابات", "historyNote": "التفصيل اليومي يبدأ من هذا التحديث. تبقى الإعجابات السابقة ضمن الإجمالي.", "translationNote": "ترجمة عربية لمقتطف من المصدر", "quoteSource": "صاحب الاقتباس والمصدر", "categoryAll": "عشوائي من الأقسام", "myGroups": "مجموعاتي", "favorites": "مفضلاتي", "likesSummary": "{n} إعجاب اليوم", "morning": "خذ نفسًا هادئًا، واختر خطوة صغيرة تجعل صباحك أفضل.", "daytime": "ليس مطلوبًا أن تنجز كل شيء الآن؛ ركّز على خطوتك التالية.", "evening": "خفّف إيقاعك، وتذكّر خطوة جميلة أنجزتها اليوم.", "night": "امنح نفسك وقتًا للراحة؛ يمكنك أن تبدأ من جديد غدًا.", "scheduleError": "تعذر تحديث المواعيد. بقيت البيانات المحفوظة دون حذف؛ حاول مجددًا."}, "en": {"next": "Your next drop", "impact": "Today's impact", "moment": "Your current moment", "quote": "Quote of the day", "close": "Close", "copy": "Copy quote", "copied": "Copied", "copyFailed": "Unable to copy. Please try again.", "loading": "Reading app data…", "unavailable": "Unable to read Android service data. Reopen this window to retry.", "none": "No scheduled drop", "noneHint": "Add a time or enable repeat in Drop Settings.", "remaining": "Time remaining", "scheduled": "Planned time", "source": "Source", "delayed": "Awaiting delivery", "timingNote": "This is a planned time; Android power saving may delay delivery.", "today": "Today's likes", "total": "All-time likes", "historyNote": "Daily tracking starts with this update. Previous likes remain in the total.", "translationNote": "Translated excerpt from the source", "quoteSource": "Author and source", "categoryAll": "Random from categories", "myGroups": "My groups", "favorites": "My favorites", "likesSummary": "{n} likes today", "morning": "Take a calm breath and choose one small step for a better morning.", "daytime": "You do not have to finish everything now. Focus on your next step.", "evening": "Slow down and remember one good step you took today.", "night": "Allow yourself to rest. Tomorrow is another chance to begin.", "scheduleError": "Unable to update reminders. Saved data has not been deleted; please retry."}, "fr": {"next": "Votre prochaine goutte", "impact": "Impact du jour", "moment": "Votre instant présent", "quote": "Citation du jour", "close": "Fermer", "copy": "Copier la citation", "copied": "Copié", "copyFailed": "Copie impossible. Réessayez.", "loading": "Lecture des données…", "unavailable": "Données Android indisponibles. Rouvrez cette fenêtre pour réessayer.", "none": "Aucune goutte programmée", "noneHint": "Ajoutez une heure ou activez la répétition dans les paramètres de la goutte.", "remaining": "Temps restant", "scheduled": "Heure prévue", "source": "Source", "delayed": "En attente de réception", "timingNote": "Heure indicative : les économies d’énergie Android peuvent retarder la réception.", "today": "Mentions J’aime du jour", "total": "Total des mentions J’aime", "historyNote": "Le suivi quotidien commence avec cette mise à jour. Les anciennes mentions restent dans le total.", "translationNote": "Extrait traduit de la source", "quoteSource": "Auteur et source", "categoryAll": "Catégories aléatoires", "myGroups": "Mes groupes", "favorites": "Mes favoris", "likesSummary": "{n} mentions J’aime aujourd’hui", "morning": "Respirez calmement et choisissez un petit pas pour un meilleur matin.", "daytime": "Vous ne devez pas tout finir maintenant. Concentrez-vous sur le prochain pas.", "evening": "Ralentissez et souvenez-vous d’un beau progrès accompli aujourd’hui.", "night": "Accordez-vous du repos. Demain sera un nouveau départ.", "scheduleError": "Impossible de mettre à jour les rappels. Vos données sont conservées. Réessayez."}, "es": {"next": "Tu próxima gota", "impact": "Impacto de hoy", "moment": "Tu momento actual", "quote": "Cita del día", "close": "Cerrar", "copy": "Copiar cita", "copied": "Copiado", "copyFailed": "No se pudo copiar. Inténtalo de nuevo.", "loading": "Leyendo datos…", "unavailable": "No se pudieron leer los datos de Android. Abre esta ventana de nuevo.", "none": "No hay gotas programadas", "noneHint": "Añade una hora o activa la repetición en Ajustes de mi gota.", "remaining": "Tiempo restante", "scheduled": "Hora prevista", "source": "Fuente", "delayed": "Esperando la entrega", "timingNote": "La hora es orientativa; el ahorro de energía de Android puede retrasar la entrega.", "today": "Me gusta de hoy", "total": "Total de Me gusta", "historyNote": "El registro diario comienza con esta actualización. Los Me gusta anteriores siguen en el total.", "translationNote": "Fragmento traducido de la fuente", "quoteSource": "Autor y fuente", "categoryAll": "Categorías aleatorias", "myGroups": "Mis grupos", "favorites": "Mis favoritos", "likesSummary": "{n} Me gusta hoy", "morning": "Respira con calma y elige un pequeño paso para mejorar tu mañana.", "daytime": "No tienes que terminar todo ahora. Concéntrate en el siguiente paso.", "evening": "Baja el ritmo y recuerda un buen paso que has dado hoy.", "night": "Permítete descansar. Mañana puedes empezar de nuevo.", "scheduleError": "No se pudieron actualizar los recordatorios. Tus datos se conservan; inténtalo de nuevo."}, "de": {"next": "Dein nächster Tropfen", "impact": "Heutige Wirkung", "moment": "Dein aktueller Moment", "quote": "Zitat des Tages", "close": "Schließen", "copy": "Zitat kopieren", "copied": "Kopiert", "copyFailed": "Kopieren fehlgeschlagen. Bitte erneut versuchen.", "loading": "Daten werden gelesen…", "unavailable": "Android-Daten nicht verfügbar. Öffne dieses Fenster erneut.", "none": "Kein Tropfen geplant", "noneHint": "Füge eine Uhrzeit hinzu oder aktiviere die Wiederholung in den Tropfen-Einstellungen.", "remaining": "Verbleibende Zeit", "scheduled": "Geplante Uhrzeit", "source": "Quelle", "delayed": "Zustellung ausstehend", "timingNote": "Geplante Uhrzeit: Android kann die Zustellung im Energiesparmodus verzögern.", "today": "Heutige Gefällt-mir-Angaben", "total": "Gefällt-mir insgesamt", "historyNote": "Die tägliche Erfassung beginnt mit diesem Update. Frühere Angaben bleiben in der Gesamtsumme.", "translationNote": "Übersetzter Auszug aus der Quelle", "quoteSource": "Autor und Quelle", "categoryAll": "Zufällig aus Kategorien", "myGroups": "Meine Gruppen", "favorites": "Meine Favoriten", "likesSummary": "{n} Gefällt-mir heute", "morning": "Atme ruhig und wähle einen kleinen Schritt für einen besseren Morgen.", "daytime": "Du musst nicht alles jetzt erledigen. Konzentriere dich auf den nächsten Schritt.", "evening": "Werde ruhiger und erinnere dich an einen guten Schritt von heute.", "night": "Gönne dir Ruhe. Morgen kannst du neu beginnen.", "scheduleError": "Erinnerungen konnten nicht aktualisiert werden. Deine Daten bleiben erhalten; versuche es erneut."}};
const QUOTES = [{"author": {"ar": "إبكتيتوس", "en": "Epictetus", "fr": "Epictetus", "es": "Epictetus", "de": "Epictetus"}, "source": {"ar": "المختصر، الفصل 5", "en": "Enchiridion, section 5", "fr": "Manuel, chapitre 5", "es": "Manual, capítulo 5", "de": "Handbüchlein, Abschnitt 5"}, "url": "https://classics.mit.edu/Epictetus/epicench.html", "text": {"ar": "ليست الأشياء هي التي تزعج الناس، بل آراؤهم عنها.", "en": "Men are disturbed, not by things, but by the principles and notions which they form concerning things.", "fr": "Ce ne sont pas les choses qui troublent les hommes, mais les opinions qu’ils en ont.", "es": "No son las cosas las que perturban a las personas, sino sus opiniones sobre ellas.", "de": "Nicht die Dinge beunruhigen die Menschen, sondern ihre Ansichten darüber."}}, {"author": {"ar": "إبكتيتوس", "en": "Epictetus", "fr": "Epictetus", "es": "Epictetus", "de": "Epictetus"}, "source": {"ar": "المختصر، الفصل 8", "en": "Enchiridion, section 8", "fr": "Manuel, chapitre 8", "es": "Manual, capítulo 8", "de": "Handbüchlein, Abschnitt 8"}, "url": "https://classics.mit.edu/Epictetus/epicench.html", "text": {"ar": "لا تطلب أن تقع الأحداث كما تريد، بل أردها كما تقع، فتسير حياتك على خير.", "en": "Don't demand that things happen as you wish, but wish that they happen as they do happen, and you will go on well.", "fr": "Ne demandez pas que les choses arrivent selon vos souhaits ; souhaitez qu’elles arrivent comme elles arrivent, et vous irez bien.", "es": "No exijas que las cosas sucedan como deseas; desea que sucedan como suceden y te irá bien.", "de": "Verlange nicht, dass die Dinge nach deinem Wunsch geschehen; wünsche sie dir so, wie sie geschehen, und es wird dir gut gehen."}}, {"author": {"ar": "ماركوس أوريليوس", "en": "Marcus Aurelius", "fr": "Marcus Aurelius", "es": "Marcus Aurelius", "de": "Marcus Aurelius"}, "source": {"ar": "التأملات، الكتاب الخامس، الفقرة 1", "en": "Meditations, book V, section 1", "fr": "Pensées, livre V, section 1", "es": "Meditaciones, libro V, sección 1", "de": "Selbstbetrachtungen, Buch V, Abschnitt 1"}, "url": "https://classics.mit.edu/Antoninus/meditations.5.five.html", "text": {"ar": "حين تنهض في الصباح كارهًا، فليحضر في ذهنك هذا الفكر: إنني أنهض لأؤدي عمل إنسان.", "en": "In the morning when thou risest unwillingly, let this thought be present: I am rising to the work of a human being.", "fr": "Le matin, lorsque vous vous levez à contrecœur, pensez : je me lève pour accomplir mon travail d’être humain.", "es": "Por la mañana, cuando te levantes de mala gana, piensa: me levanto para realizar el trabajo de un ser humano.", "de": "Wenn du morgens widerwillig aufstehst, denke: Ich stehe auf, um die Arbeit eines Menschen zu tun."}}];
const byId = id => document.getElementById(id);
const language = () => WORDS[state.lang] ? state.lang : 'ar';
const t = (key, values = {}) => {
 let text = (WORDS[language()][key] || WORDS.en[key] || key);
 for (const [k,v] of Object.entries(values)) text = text.split('{'+k+'}').join(typeof v === 'number' ? new Intl.NumberFormat(language()).format(v) : String(v));
 return text;
};
const number = n => new Intl.NumberFormat(language()).format(n);
const native = QatraNative;
let data = null;
let readError = false;
let currentModal = null;
let readPromise = null;
let scheduleQueue = Promise.resolve();
let lastRead = 0;
let lastMoment = '';
const oldUpdate = updateHomeCards;
const oldApply = applyState;
if (!state.homeMetricsOffset) {
 state.homeMetricsOffset = {likes:Number(state.stats.likes)||0, categories:{}};
 for (const key of ['dhikr','culture','selfDev','poetry']) state.homeMetricsOffset.categories[key] = Number(state.stats[key])||0;
}
const save = () => localStorage.setItem(STORE_KEY, JSON.stringify(state));
const quoteIndex = () => Number.isInteger(state.homeQuoteId) && state.homeQuoteId >= 0 && state.homeQuoteId < QUOTES.length ? state.homeQuoteId : 0;
const quoteText = q => q.text[language()] || q.text.en;
const sourceName = key => key === 'all' ? t('categoryAll') : key === 'myGroups' ? t('myGroups') : key === 'favorites' ? t('favorites') : getTranslation('cat_'+key);
const setText = (id,text) => { const el=byId(id); if(el) el.textContent=text; };
const nextData = () => data && data.next && typeof data.next === 'object' ? data.next : null;
function remaining(at) {
 const seconds=Math.max(0,Math.ceil((at-Date.now())/1000));
 if (!seconds) return t('delayed');
 const values=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60];
 return values.map(n=>new Intl.NumberFormat(language(),{minimumIntegerDigits:2,useGrouping:false}).format(n)).join(':');
}
function momentText() {
 const hour=new Date().getHours();
 return t(hour>=5&&hour<12?'morning':hour>=12&&hour<18?'daytime':hour>=18&&hour<22?'evening':'night');
}
function paintHome() {
 const next=nextData();
 setText('nextDropTimeText',readError?t('unavailable'):!data?t('loading'):next?remaining(Number(next.at)):t('none'));
 setText('nextDropCategoryText',next?sourceName(next.category):'');
 setText('todayImpactText',data?t('likesSummary',{n:Number(data.todayLikes)||0}):readError?t('unavailable'):t('loading'));
 const progress=byId('todayImpactProgress'); if(progress)progress.style.width=Math.min((Number(data?.todayLikes)||0)/10*100,100)+'%';
 lastMoment=momentText();setText('currentMomentText',lastMoment);
 setText('dailyQuoteText','“'+quoteText(QUOTES[quoteIndex()])+'”');
 if(currentModal?.type==='next')paintNext(currentModal.body);
 if(currentModal?.type==='impact')paintImpact(currentModal.body);
}
updateHomeCards = function() { oldUpdate();paintHome(); };
applyState = function() { oldApply();paintHome(); };

function mergeMetrics(snapshot) {
 const baseline=state.homeMetricsOffset;
 state.stats.likes=(Number(baseline.likes)||0)+(Number(snapshot.totalLikes)||0);
 const totals={dhikr:0,culture:0,selfDev:0,poetry:0};
 for(const [category,count] of Object.entries(snapshot.categories||{})) {
  const key=category==='quran'?'dhikr':category==='generalCulture'?'culture':category==='myGroups'||category==='favorites'?'selfDev':category;
  if(Object.prototype.hasOwnProperty.call(totals,key))totals[key]+=Number(count)||0;
 }
 for(const key of Object.keys(totals)) state.stats[key]=(Number(baseline.categories[key])||0)+totals[key];
}
async function refreshHome() {
 if(readPromise)return readPromise;
 if(!native||typeof native.getHomeData!=='function'){readError=true;paintHome();return null;}
 readPromise=(async()=>{
  try {
   const result=await native.getHomeData();
   data=result;readError=false;lastRead=Date.now();mergeMetrics(result);applyState();return result;
  }catch(error){console.error('QATRA home data',error);readError=true;paintHome();return null;}
  finally{readPromise=null;}
 })();
 return readPromise;
}
function selectScheduledQuote() {
 if (state.quoteSource === 'myChoices') {
  const selected = (state.myChoices || []).filter(entry => entry && typeof entry.text === 'string' && entry.text.trim());
  if (!selected.length) throw new Error('My choices is empty; scheduling is paused.');
  const entry = selected[Math.floor(Math.random() * selected.length)];
  return {quote: entry.text, categoryKey: entry.category};
 }

 const real = q => typeof q==='string'&&q.trim()&&!/^(دعاء رقم|فكرة تطوير ذات رقم|آية رقم|حكمة رقم|بيت شعر رقم)\s*\d+\s*$/.test(q);
 let pool=[];
 const source=state.quoteSource;
 if(source==='myGroups'||source==='favorites') {
  const keys=source==='favorites'?['favorites']:Object.keys(state.groups);
  for(const key of keys) for(const quote of state.groups[key]||[])if(real(quote))pool.push({quote,categoryKey:source});
 }else {
  const keys=source==='all'?Object.keys(QUOTES_DB):[source];
  for(const key of keys)for(const quote of QUOTES_DB[key]?.items||[])if(real(quote))pool.push({quote,categoryKey:key});
 }
 if(pool.length)return pool[Math.floor(Math.random()*pool.length)];
 // Keep the existing empty-library message rather than choosing an unrelated source.
 return {quote:getTranslation('no_custom_quotes'),categoryKey:source};
}
syncNativeAlarms = function() {
 if(!native)return Promise.resolve();
 const plan={intervalMinutes:parseInt(state.interval)||0,mode:state.mode,duration:state.duration,showImage:state.showImage,
  schedules:state.schedules.map(s=>({id:s.id,time:s.time,days:Array.from(s.days||[]),payload:selectScheduledQuote()})),intervalQuote:selectScheduledQuote()};
 scheduleQueue=scheduleQueue.catch(()=>{}).then(async()=>{
  if(typeof native.reconcileHomeAlarms==='function')await native.reconcileHomeAlarms({ids:plan.schedules.map(s=>s.id)});
  await native.scheduleInterval({intervalMinutes:plan.intervalMinutes,mode:plan.mode,duration:plan.duration,showImage:plan.showImage,
   quote:plan.intervalQuote.quote,category:plan.intervalQuote.categoryKey});
  for(const entry of plan.schedules)await native.schedule({id:entry.id,time:entry.time,days:entry.days,mode:plan.mode,
   duration:plan.duration,showImage:plan.showImage,quote:entry.payload.quote,category:entry.payload.categoryKey});
  await refreshHome();
 }).catch(error=>{console.error('QATRA schedule',error);readError=true;paintHome();notify(t('scheduleError'));});
 return scheduleQueue;
};
function notify(message) {
 const toast=byId('copyToast');
 if(toast){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000);}
 else console.warn(message);
}
function node(tag,className,text) {
 const el=document.createElement(tag);if(className)el.className=className;
 if(text!==undefined)el.textContent=text;return el;
}
function dismiss() {
 if(!currentModal)return;
 const previous=currentModal;currentModal=null;
 previous.root.remove();document.removeEventListener('keydown',previous.keys);
 if(previous.focus&&typeof previous.focus.focus==='function')previous.focus.focus();
}
function openWindow(title,type) {
 dismiss();
 const root=node('div','qh-backdrop');
 const panel=node('section','qh-panel glass-card');
 panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','qh-modal-title');
 panel.appendChild(node('div','qh-handle'));
 const heading=node('h2','qh-title',title);heading.id='qh-modal-title';panel.appendChild(heading);
 const body=node('div','qh-body');panel.appendChild(body);
 const close=node('button','btn-solid qh-close',t('close'));close.type='button';close.addEventListener('click',dismiss);panel.appendChild(close);
 root.appendChild(panel);root.addEventListener('click',event=>{if(event.target===root)dismiss();});
 const keys=event=>{
  if(event.key==='Escape'){event.preventDefault();dismiss();return;}
  if(event.key==='Tab'){
   const focusables=Array.from(panel.querySelectorAll('button,a[href],[tabindex="0"]'));
   const first=focusables[0],last=focusables[focusables.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  }
 };
 currentModal={root,body,type,keys,focus:document.activeElement};document.addEventListener('keydown',keys);
 document.body.appendChild(root);close.focus();return body;
}
function quoteBlock(parent,text){const block=node('blockquote','qh-quote',text);parent.appendChild(block);return block;}
function infoRow(parent,label,value){const row=node('div','qh-info');row.appendChild(node('span','qh-label',label));row.appendChild(node('span','qh-value',value));parent.appendChild(row);}
function paintNext(body){
 const next=nextData();
 // Only rebuild when the payload/status/language changes; countdown updates independently.
 const signature=JSON.stringify([language(),readError,!!data,next]);
 if(body.dataset.signature!==signature){
  body.dataset.signature=signature;body.replaceChildren();
  if(readError){body.appendChild(node('p','qh-note',t('unavailable')));return;}
  if(!data){body.appendChild(node('p','qh-note',t('loading')));return;}
  if(!next){body.appendChild(node('p','qh-empty',t('none')));body.appendChild(node('p','qh-note',t('noneHint')));return;}
  quoteBlock(body,next.quote);
  infoRow(body,t('source'),sourceName(next.category));
  infoRow(body,t('scheduled'),new Intl.DateTimeFormat(language(),{dateStyle:'medium',timeStyle:'short'}).format(new Date(Number(next.at))));
  body.appendChild(node('p','qh-label',t('remaining')));
  const clock=node('div','qh-clock',remaining(Number(next.at)));clock.dataset.clock='true';clock.setAttribute('dir','ltr');body.appendChild(clock);
  body.appendChild(node('p','qh-note',t('timingNote')));
 }
 const clock=body.querySelector('[data-clock]');if(clock&&next)clock.textContent=remaining(Number(next.at));
}
function paintImpact(body){
 const signature=JSON.stringify([language(),readError,data?.date,data?.todayLikes,state.stats.likes]);
 if(body.dataset.signature===signature)return;
 body.dataset.signature=signature;body.replaceChildren();
 if(!data){body.appendChild(node('p','qh-note',readError?t('unavailable'):t('loading')));return;}
 const grid=node('div','qh-metrics');
 for(const [label,value] of [[t('today'),data.todayLikes],[t('total'),state.stats.likes]]){
  const box=node('div','qh-metric');box.appendChild(node('strong','qh-metric-number',number(Number(value)||0)));box.appendChild(node('span','qh-label',label));grid.appendChild(box);
 }
 body.appendChild(grid);body.appendChild(node('p','qh-note',t('historyNote')));
}
async function openNext(){const body=openWindow(t('next'),'next');paintNext(body);await refreshHome();}
async function openImpact(){const body=openWindow(t('impact'),'impact');paintImpact(body);await refreshHome();}
function openMoment(){const text=byId('currentMomentText')?.textContent||momentText();const body=openWindow(t('moment'),'moment');quoteBlock(body,text);}
function openQuote(){
 let next=Math.floor(Math.random()*QUOTES.length);if(next===quoteIndex())next=(next+1)%QUOTES.length;
 state.homeQuoteId=next;save();paintHome();
 const q=QUOTES[next];const body=openWindow(t('quote'),'quote');quoteBlock(body,quoteText(q));
 body.appendChild(node('p','qh-author',q.author[language()]||q.author.en));
 body.appendChild(node('p','qh-source',q.source[language()]||q.source.en));
 if(language()!=='en')body.appendChild(node('p','qh-note',t('translationNote')));
 const copy=node('button','qh-copy',t('copy'));copy.type='button';copy.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText('“'+quoteText(q)+'” — '+(q.author[language()]||q.author.en)+', '+(q.source[language()]||q.source.en));copy.textContent=t('copied');}
  catch(_){copy.textContent=t('copyFailed');}
 });body.appendChild(copy);
}
function bindCard(id,handler){
 const card=byId(id)?.closest('.action-card');if(!card)return;
 card.removeAttribute('onclick');card.setAttribute('role','button');card.setAttribute('tabindex','0');card.setAttribute('aria-haspopup','dialog');
 card.addEventListener('click',handler);
 card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();handler();}});
}
async function start(){
 bindCard('nextDropTimeText',openNext);bindCard('todayImpactText',openImpact);bindCard('currentMomentText',openMoment);bindCard('dailyQuoteText',openQuote);
 const initial=await refreshHome();
 if(initial&&!initial.initialized)await syncNativeAlarms();
 if(native&&typeof native.addListener==='function')Promise.resolve(native.addListener('quoteLiked',()=>{refreshHome();})).catch(error=>console.error(error));
 setInterval(()=>{
  if(document.visibilityState==='hidden')return;
  paintHome();if(Date.now()-lastRead>=15000)refreshHome();
 },1000);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='hidden')refreshHome();});
 paintHome();
}
window.QatraHome={openNext,openImpact,openMoment,openQuote,refresh:refreshHome,close:dismiss};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
