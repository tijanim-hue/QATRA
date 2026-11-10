"use strict";
(() => {
if(window.QatraExperience)return;
const WORDS={"ar": {"welcome": "لنجهّز قطرتك", "permissions": "أذونات قطرة", "intro": "سنطلب إذن الظهور فوق التطبيقات أولًا، ثم الإشعارات بعد العودة. يمكنك التأجيل وتغيير قرارك لاحقًا.", "overlay": "الظهور فوق التطبيقات", "overlayDesc": "فعّل السماح لقطرة في إعداد النظام، ثم ارجع إلى التطبيق.", "notification": "السماح بالإشعارات", "notificationDesc": "حتى تصل تنبيهاتك بالطريقة التي اخترتها.", "start": "بدء الإعداد", "later": "لاحقًا", "retry": "المحاولة مجددًا", "waiting": "بانتظار عودتك من إعدادات النظام…", "overlayMissing": "لم يُفعّل إذن الطفو بعد. يمكنك إعادة المحاولة أو التأجيل.", "notificationMissing": "الإشعارات غير مفعّلة. يمكنك المحاولة أو تفعيلها لاحقًا.", "done": "الأذونات المطلوبة مفعّلة", "close": "تم", "sound": "أصوات الأزرار والبداية", "soundHint": "نقرات خفيفة ونغمة افتتاحية قصيرة، مع احترام الوضع الصامت.", "wake": "إيقاظ الشاشة للقطرات", "wakeHint": "اختياري: قد تظهر العبارة على شاشة القفل. لا يفتح قفل الهاتف، وقد يقيّده النظام.", "manage": "إدارة أذونات التطبيق", "error": "تعذر فتح الإعداد المطلوب. حاول مجددًا.", "unavailable": "خدمة Android غير متاحة. تحقق من تثبيت البناء الجديد ثم أعد فتح التطبيق."}, "en": {"welcome": "Let’s prepare your drop", "permissions": "Qatra permissions", "intro": "We will request display-over-apps access first, then notifications when you return. You can postpone or change your choice later.", "overlay": "Display over other apps", "overlayDesc": "Allow Qatra in system settings, then return to the app.", "notification": "Allow notifications", "notificationDesc": "Receive reminders in your chosen display mode.", "start": "Start setup", "later": "Later", "retry": "Try again", "waiting": "Waiting for your return from system settings…", "overlayMissing": "Overlay access is not enabled. Retry or postpone.", "notificationMissing": "Notifications are disabled. Retry or enable them later.", "done": "Required permissions are enabled", "close": "Done", "sound": "Button and startup sounds", "soundHint": "Soft taps and a short opening chime, respecting silent mode.", "wake": "Wake screen for drops", "wakeHint": "Optional: quotes may appear on the lock screen. This does not unlock the phone; Android may restrict it.", "manage": "Manage app permissions", "error": "Unable to open this setting. Please retry.", "unavailable": "Android service unavailable. Install the new build and reopen the app."}, "fr": {"welcome": "Préparons votre goutte", "permissions": "Autorisations de Qatra", "intro": "Nous demanderons d’abord la superposition, puis les notifications à votre retour. Vous pouvez reporter votre choix.", "overlay": "Affichage au-dessus des applications", "overlayDesc": "Autorisez Qatra dans les paramètres système, puis revenez.", "notification": "Autoriser les notifications", "notificationDesc": "Recevez les rappels avec votre mode d’affichage choisi.", "start": "Commencer", "later": "Plus tard", "retry": "Réessayer", "waiting": "En attente de votre retour des paramètres…", "overlayMissing": "La superposition n’est pas autorisée. Réessayez ou reportez.", "notificationMissing": "Notifications désactivées. Réessayez ou activez-les plus tard.", "done": "Les autorisations requises sont activées", "close": "Terminé", "sound": "Sons des boutons et du démarrage", "soundHint": "Clics discrets et courte mélodie, en respectant le mode silencieux.", "wake": "Réveiller l’écran pour les gouttes", "wakeHint": "Option : citations sur l’écran verrouillé, sans déverrouiller le téléphone. Android peut restreindre cette fonction.", "manage": "Gérer les autorisations", "error": "Impossible d’ouvrir ce paramètre. Réessayez.", "unavailable": "Service Android indisponible. Installez la nouvelle version et rouvrez l’application."}, "es": {"welcome": "Preparemos tu gota", "permissions": "Permisos de Qatra", "intro": "Primero pediremos la superposición y, a tu regreso, las notificaciones. Puedes posponer tu decisión.", "overlay": "Mostrar sobre otras aplicaciones", "overlayDesc": "Permite Qatra en los ajustes del sistema y vuelve.", "notification": "Permitir notificaciones", "notificationDesc": "Recibe recordatorios con tu modo de visualización elegido.", "start": "Comenzar", "later": "Más tarde", "retry": "Reintentar", "waiting": "Esperando tu regreso de los ajustes…", "overlayMissing": "La superposición no está activada. Reintenta o pospón.", "notificationMissing": "Notificaciones desactivadas. Reintenta o actívalas más tarde.", "done": "Los permisos necesarios están activados", "close": "Listo", "sound": "Sonidos de botones e inicio", "soundHint": "Toques suaves y una breve melodía, respetando el modo silencioso.", "wake": "Encender la pantalla para las gotas", "wakeHint": "Opcional: frases en la pantalla de bloqueo sin desbloquear el teléfono. Android puede limitar esta función.", "manage": "Gestionar permisos", "error": "No se pudo abrir este ajuste. Inténtalo de nuevo.", "unavailable": "Servicio Android no disponible. Instala la nueva versión y vuelve a abrir la aplicación."}, "de": {"welcome": "Bereiten wir deinen Tropfen vor", "permissions": "Qatra-Berechtigungen", "intro": "Zuerst fragen wir die Einblendung ab und nach deiner Rückkehr die Benachrichtigungen. Du kannst später entscheiden.", "overlay": "Über anderen Apps anzeigen", "overlayDesc": "Erlaube Qatra in den Systemeinstellungen und kehre zurück.", "notification": "Benachrichtigungen erlauben", "notificationDesc": "Erhalte Erinnerungen im gewählten Anzeigemodus.", "start": "Einrichtung starten", "later": "Später", "retry": "Erneut versuchen", "waiting": "Warten auf deine Rückkehr aus den Einstellungen…", "overlayMissing": "Einblendung nicht erlaubt. Erneut versuchen oder später fortfahren.", "notificationMissing": "Benachrichtigungen deaktiviert. Erneut versuchen oder später aktivieren.", "done": "Erforderliche Berechtigungen sind aktiviert", "close": "Fertig", "sound": "Tasten- und Startklänge", "soundHint": "Sanfte Klicks und kurzer Startklang; der Lautlosmodus wird beachtet.", "wake": "Bildschirm für Tropfen aufwecken", "wakeHint": "Optional: Zitate auf dem Sperrbildschirm, ohne das Telefon zu entsperren. Android kann dies einschränken.", "manage": "Berechtigungen verwalten", "error": "Diese Einstellung konnte nicht geöffnet werden. Bitte erneut versuchen.", "unavailable": "Android-Dienst nicht verfügbar. Installiere den neuen Build und öffne die App erneut."}}, native=QatraNative;
const language=()=>WORDS[state.lang]?state.lang:'ar';
const t=key=>WORDS[language()][key]||WORDS.en[key]||key;
const node=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
let status=null,modal=null,busy=false,approved=false,notificationAttempted=false,refreshing=null,lastTap=0;
const save=()=>localStorage.setItem(STORE_KEY,JSON.stringify(state));
function close(){if(modal){const old=modal;modal=null;old.root.remove();old.focus?.focus?.();}}
function complete(){state.qatraPermissionIntroSeen=true;state.qatraPermissionJourney=false;save();approved=false;busy=false;close();}
function view(mode,message){
 close();const root=node('div','qe-backdrop'),panel=node('section','qe-panel glass-card');
 panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','qe-title');
 const title=node('h2','qe-title',mode==='intro'?t('welcome'):t('permissions'));title.id='qe-title';panel.appendChild(title);
 panel.appendChild(node('p','qe-intro',mode==='intro'?t('intro'):message||t('waiting')));
 for(const [key,description,done] of [['overlay','overlayDesc',status?.overlay],['notification','notificationDesc',status?.notifications]]){
  const row=node('div','qe-step'+(done?' granted':''));row.appendChild(node('span','qe-step-mark',done?'✓':key==='overlay'?'1':'2'));
  const copy=node('div','');copy.appendChild(node('strong','',t(key)));copy.appendChild(node('p','',t(description)));row.appendChild(copy);panel.appendChild(row);
 }
 const button=node('button','btn-solid',mode==='done'?t('close'):mode==='intro'?t('start'):t('retry'));button.type='button';button.disabled=busy;
 button.addEventListener('click',()=>{if(mode==='done'){complete();return;}approved=true;notificationAttempted=false;advance();});panel.appendChild(button);
 if(mode!=='done'){const later=node('button','qe-later',t('later'));later.type='button';later.addEventListener('click',complete);panel.appendChild(later);}
 panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();complete();}if(event.key==='Tab'){const list=Array.from(panel.querySelectorAll('button:not(:disabled)'));const first=list[0],last=list[list.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}});
 root.appendChild(panel);const focus=document.activeElement;document.body.appendChild(root);modal={root,mode,focus};button.focus();
}
function updateSettings(){
 for(const [id,key] of [['qe-ui-sounds','uiSounds'],['qe-wake-screen','wakeScreen']]){const input=document.getElementById(id);if(input){input.checked=!!status?.[key];input.disabled=!status;}}
 const error=document.getElementById('qe-service-error');if(error)error.textContent=status?'':t('unavailable');
}
async function read(){
 if(!native||typeof native.getExperienceStatus!=='function'){status=null;updateSettings();return null;}
 try{status=await native.getExperienceStatus();updateSettings();return status;}catch(error){console.error(error);status=null;updateSettings();return null;}
}
async function advance(){
 if(busy)return;busy=true;state.qatraPermissionJourney=true;save();const current=await read();
 if(!current){busy=false;view('retry',t('unavailable'));return;}
 try{
  if(!current.overlay){view('waiting',t('waiting'));await native.openOverlayPermission();return;}
  if(!current.notifications){notificationAttempted=true;view('waiting',t('waiting'));await native.requestQatraNotifications();busy=false;await returned(true);return;}
  busy=false;view('done',t('done'));
 }catch(error){console.error(error);busy=false;view('retry',t('error'));}
}
async function returned(fromPrompt=false){
 if(refreshing)return refreshing;
 refreshing=(async()=>{const current=await read();if(!current||!modal)return;
  if(current.overlay&&current.notifications){busy=false;view('done',t('done'));return;}
  if(!current.overlay){busy=false;view('retry',t('overlayMissing'));return;}
  if(approved&&!notificationAttempted&&!fromPrompt){busy=false;setTimeout(()=>advance(),200);return;}
  busy=false;view('retry',t('notificationMissing'));
 })().finally(()=>{refreshing=null;});return refreshing;
}
function settings(){
 const target=document.getElementById('settingsSheet')?.querySelector('.sheet-content');if(!target||document.getElementById('qe-settings'))return;
 const block=node('div','qe-settings');block.id='qe-settings';
 for(const [key,hint,id,pref] of [['sound','soundHint','qe-ui-sounds','uiSounds'],['wake','wakeHint','qe-wake-screen','wakeScreen']]){
  const row=node('div','control-row qe-preference'),copy=node('div','qe-pref-copy');
  const title=node('strong','',t(key));title.dataset.qeText=key;copy.appendChild(title);const desc=node('p','',t(hint));desc.dataset.qeText=hint;copy.appendChild(desc);row.appendChild(copy);
  const label=node('label','toggle'),input=node('input','');input.type='checkbox';input.id=id;input.disabled=!status;input.checked=!!status?.[pref];input.setAttribute('aria-label',t(key));
  input.addEventListener('change',async()=>{try{status=await native.setExperiencePreferences({[pref]:input.checked});updateSettings();}catch(error){console.error(error);await read();}});
  label.appendChild(input);label.appendChild(node('span','toggle-track'));row.appendChild(label);block.appendChild(row);
 }
 const manage=node('button','qe-manage',t('manage'));manage.type='button';manage.dataset.qeText='manage';manage.addEventListener('click',async()=>{await read();busy=false;approved=false;notificationAttempted=false;view('intro');});block.appendChild(manage);
 const error=node('p','qe-hint');error.id='qe-service-error';block.appendChild(error);
 const done=target.querySelector('.btn-solid');if(done)target.insertBefore(block,done);else target.appendChild(block);
}
const previousApply=applyState;
applyState=function(){previousApply();document.querySelectorAll('[data-qe-text]').forEach(e=>e.textContent=t(e.dataset.qeText));for(const [id,key] of [['qe-ui-sounds','sound'],['qe-wake-screen','wake']])document.getElementById(id)?.setAttribute('aria-label',t(key));};
function tap(event){
 if(!native||typeof native.playUiSound!=='function'||status?.uiSounds===false)return;
 const target=event.target.closest?.('button,[role="button"],.action-card,.nav-item,.nav-home-btn,.header-btn,.custom-radio-item,.day-chip,.toggle');
 if(!target||target.disabled||target.getAttribute('aria-disabled')==='true')return;
 const now=Date.now();if(now-lastTap<80)return;lastTap=now;native.playUiSound({name:'tap'}).catch(error=>console.debug(error));
}
async function start(){
 settings();document.addEventListener('click',tap,true);const current=await read();if(!current)return;
 if(!window.__qatraStartupSoundPlayed){window.__qatraStartupSoundPlayed=true;native.playUiSound({name:'startup'}).catch(error=>console.debug(error));}
 Promise.resolve(native.addListener('experienceResumed',()=>returned())).catch(error=>console.debug(error));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&modal)returned();});
 if(state.qatraPermissionJourney){approved=true;view('intro');}
 else if(!state.qatraPermissionIntroSeen&&(!current.overlay||!current.notifications))view('intro');
 else{state.qatraPermissionIntroSeen=true;save();}
}
window.QatraExperience={openPermissions:async()=>{await read();busy=false;approved=false;notificationAttempted=false;view('intro');},refresh:read};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
