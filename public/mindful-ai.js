/* Cloud-only mindful AI, premium dialogs, and QATRA notebook. */
(function(root){
'use strict';
if(!root.Capacitor?.isNativePlatform?.()||root.QatraMindfulAI)return;
const BASE='https://qatra-ai.vercel.app',POLICY='qatra-ai-v1',$=id=>document.getElementById(id),panels=[];
let identity=null,busy=false;
const el=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
async function read(url,options,signal){
 const c=new AbortController(),abort=()=>c.abort();if(signal.aborted)throw Error('CANCELLED');
 signal.addEventListener('abort',abort,{once:true});const timer=setTimeout(abort,35000);
 try{
  const response=await fetch(url,{...options,signal:c.signal,credentials:'omit',cache:'no-store',redirect:'error',referrerPolicy:'no-referrer'});
  if(!response.body)throw Error('INVALID_RESPONSE');
  const reader=response.body.getReader(),parts=[];let size=0;
  try{for(;;){const item=await reader.read();if(item.done)break;size+=item.value.byteLength;if(size>131072){await reader.cancel();throw Error('INVALID_RESPONSE');}parts.push(item.value);}}finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  const data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  if(!response.ok)throw Error(typeof data.error==='string'?data.error:data.error?.message||'UNAVAILABLE');
  return data;
 }finally{clearTimeout(timer);signal.removeEventListener('abort',abort);}
}
async function authenticate(config,signal){
 if(identity?.key===config.apiKey&&identity.expires>Date.now()+60000)return identity.token;
 const refresh=identity?.key===config.apiKey?identity.refresh:null;
 const url=(refresh?'https://securetoken.googleapis.com/v1/token?key=':'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=')+encodeURIComponent(config.apiKey);
 const data=await read(url,{method:'POST',headers:{'content-type':refresh?'application/x-www-form-urlencoded':'application/json'},body:refresh?new URLSearchParams({grant_type:'refresh_token',refresh_token:refresh}).toString():JSON.stringify({returnSecureToken:true})},signal);
 const token=refresh?data.id_token:data.idToken,renew=refresh?data.refresh_token:data.refreshToken,ttl=Number(refresh?data.expires_in:data.expiresIn);
 if(signal.aborted)throw Error('CANCELLED');
 if(typeof token!=='string'||typeof renew!=='string'||token.length>8192||renew.length>8192||!Number.isFinite(ttl)||ttl<60||ttl>7200)throw Error('INVALID_RESPONSE');
 identity={key:config.apiKey,token,refresh:renew,expires:Date.now()+ttl*1000};return token;
}
function validate(value){
 const limits={understanding:1200,question:400,reframe:1200,step:600},keys=[...Object.keys(limits),'facts','assumptions','perspectives','needsClarification','safety'];
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==keys.length||Object.keys(value).some(k=>!keys.includes(k)))throw Error('INVALID_RESPONSE');
 for(const [key,max] of Object.entries(limits))if(typeof value[key]!=='string'||value[key].length>max)throw Error('INVALID_RESPONSE');
 for(const key of ['facts','assumptions','perspectives'])if(!Array.isArray(value[key])||value[key].length>4||value[key].some(t=>typeof t!=='string'||!t.trim()||t.length>500))throw Error('INVALID_RESPONSE');
 if(!value.understanding.trim()||typeof value.needsClarification!=='boolean'||!['routine','support'].includes(value.safety)||value.needsClarification&&!value.question.trim())throw Error('INVALID_RESPONSE');return value;
}
function format(r){return [['ما فهمته',r.understanding],['وقائع مبلّغ عنها',r.facts.join('\n')],['تفسيرات أو توقعات',r.assumptions.join('\n')],['زوايا أخرى',r.perspectives.join('\n')],['منظور متوازن',r.reframe],['خطوة اختيارية',r.step],['سؤال متابعة',r.question]].filter(x=>x[1]).map(x=>x.join(':\n')).join('\n\n');}
function mount(activity){
 const screen=document.querySelector('[data-mm-screen="'+activity+'"]');if(!screen)return;
 const panel=el('details');panel.className='qatra-ai-panel';panel.appendChild(el('summary','القطرة الذكية'));panel.appendChild(el('p','اكتب ما يحيّر أو يثقل ذهنك، وستتولى القطرة الذكية فهمه وإعادة ترتيبه بمنظور أهدأ.'));
 const permission=el('input');permission.type='checkbox';
 function checkbox(input,text){const label=el('label');label.append(input,document.createTextNode(text));return label;}
 function button(text){const node=el('button',text);node.type='button';return node;}
 const send=button('اطلب من القطرة الذكية'),cancel=button('إلغاء الطلب'),clear=button('مسح الجلسة'),save=button('حفظ هذا الرد في دفتر قطرة'),output=el('p'),status=el('p'),follow=el('textarea');
 follow.id='qatra-ai-follow-'+activity;follow.maxLength=2000;follow.rows=3;const followLabel=el('label','متابعة أو توضيح للرد الأخير');followLabel.htmlFor=follow.id;
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');cancel.disabled=save.disabled=true;
 panel.append(el('p','للتأمل لا للتشخيص أو العلاج. بعد الموافقة والإرسال يتصل التطبيق بخادم قطرة وبـ Firebase لهوية مؤقتة؛ ويُرسل النص والشعور والشدة وسياق الجلسة المختصر إلى Groq عبر الخادم. لا تكتب أسرارًا.'),checkbox(permission,' أوافق على الاتصال وإرسال النص الحالي وسياق الجلسة.'),send,cancel,clear,status,output,followLabel,follow,save);screen.appendChild(panel);
 const s={epoch:0,controller:null,turns:[],reply:null,entry:null,saving:false};
 function reset(){s.epoch++;s.controller?.abort();s.controller=null;s.turns=[];s.reply=s.entry=null;output.textContent=follow.value='';permission.checked=false;send.disabled=false;cancel.disabled=save.disabled=true;status.textContent='جاهز للاتصال بالقطرة الذكية.';if(!panels.some(p=>p.permission.checked))identity=null;}
 function input(){const text=$(activity==='feelings'?'mmReason':'mmThought').value.trim(),feeling=activity==='feelings'?document.querySelector('#mmFeelings button[aria-pressed="true"]')?.textContent.trim():'',intensity=activity==='feelings'?Number($('mmIntensity').value):null;if(!text||text.length>6000||activity==='feelings'&&(!feeling||!Number.isInteger(intensity)||intensity<1||intensity>10))throw Error('INPUT');return {activity,text,feeling:feeling||'',intensity};}
 permission.addEventListener('change',()=>{if(!permission.checked)reset();});
 cancel.addEventListener('click',()=>{s.epoch++;s.controller?.abort();s.controller=null;send.disabled=false;cancel.disabled=true;status.textContent='أُلغي انتظار الرد؛ لا يمكن سحب ما وصل سابقًا.';});clear.addEventListener('click',reset);
 send.addEventListener('click',async()=>{
  if(!permission.checked){status.textContent='اختر موافقة الاتصال أولًا.';return;}if(busy){status.textContent='انتظر اكتمال الطلب أو إلغائه.';return;}
  let current;try{current=input();}catch(error){status.textContent='اكتب النص أو سياق الشعور (حتى 6000 حرف)، واختر الشعور وشدته.';return;}
  const extra=follow.value.trim();if(s.turns.length&&!extra){status.textContent='اكتب متابعة أو امسح الجلسة لطلب جديد.';return;}
  const text=current.text+(extra?'\n\nمتابعة المستخدم: '+extra:'');
  const body=JSON.stringify({...current,text,turns:s.turns,records:[],consent:{cloud:true,history:false,policyVersion:POLICY}});
  if(text.length>6000||text.length+s.turns.reduce((n,t)=>n+t.text.length,0)>14000||new TextEncoder().encode(body).length>32768){status.textContent='النص طويل؛ قلّله أو امسح الجلسة ثم أعد المحاولة.';return;}
  if(!['https://localhost','capacitor://localhost','http://localhost'].includes(root.location.origin)){status.textContent='عنوان التطبيق يختلف عن الإعداد المتوقع؛ أوقفنا الاتصال للمراجعة.';return;}
  const signature=JSON.stringify(current),epoch=++s.epoch,c=new AbortController();s.controller=c;busy=true;send.disabled=save.disabled=true;cancel.disabled=false;s.reply=s.entry=null;output.textContent='';status.textContent='جارٍ التحقق من توفر القطرة الذكية…';
  try{
   const config=await read(BASE+'/api/client-config',{method:'GET'},c.signal);if(config.cloudEnabled!==true)throw Error('CLOUD_AI_DISABLED');
   if(config.policyVersion!==POLICY||config.identity?.projectId!=='qatra-7f579'||config.identity.provider!=='firebase-anonymous'||typeof config.identity.apiKey!=='string')throw Error('CONFIGURATION_REQUIRED');
   const bearer=await authenticate(config.identity,c.signal);if(c.signal.aborted||epoch!==s.epoch||!permission.checked)throw Error('CANCELLED');status.textContent='القطرة الذكية تفكر…';
   const response=await read(BASE+'/api/mindful',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+bearer},body},c.signal);
   if(c.signal.aborted||epoch!==s.epoch||JSON.stringify(input())!==signature)return;
   if(response.provider!=='remote'||response.policyVersion!==POLICY||typeof response.requestId!=='string')throw Error('INVALID_RESPONSE');
   const reply=validate(response.data),rendered=format(reply);s.reply=reply;output.textContent='رد القطرة الذكية:\n\n'+rendered+(reply.safety==='support'?'\n\nعند خطر مباشر تواصل مع الطوارئ المحلية أو شخص موثوق؛ المساعد ليس خدمة طوارئ.':'');
   s.turns=[...s.turns,{role:'user',text:(extra||current.text).slice(0,1000)},{role:'assistant',text:rendered.slice(0,1000)}].slice(-6);
   const now=new Date(),common={schemaVersion:1,createdAt:now.toISOString(),source:'mindful-minute',analysis:{method:'groq-structured-v1',requestId:response.requestId,policyVersion:POLICY,safety:reply.safety}};
   s.entry=activity==='feelings'?{...common,activity,feeling:current.feeling,intensity:current.intensity,reason:current.text,reflection:rendered,followup:extra}:{...common,activity:'thought',category:'ترتيب فكرة',text:text,reflection:rendered,followup:extra};
   follow.value='';save.disabled=false;status.textContent='وصل الرد ولم يُحفظ تلقائيًا. زر الحفظ يضيفه إلى دفتر قطرة.';
  }catch(error){if(epoch===s.epoch)status.textContent=error.message==='CLOUD_AI_DISABLED'?'القطرة الذكية غير متاحة حاليًا.':error.message==='OPERATION_NOT_ALLOWED'?'يجب تفعيل الدخول المجهول في Firebase.':'تعذر إكمال الطلب. لم نقدّم ردًا بديلًا، ولا نعيد المحاولة تلقائيًا.';}
  finally{busy=false;if(epoch===s.epoch){s.controller=null;send.disabled=false;cancel.disabled=true;}}
 });
 save.addEventListener('click',async()=>{if(!s.entry||s.saving)return;const epoch=s.epoch,entry=s.entry;s.saving=true;save.disabled=true;try{await root.QatraMindfulData.ready();await root.QatraMindfulStore.put('note','ai-'+entry.analysis.requestId,entry,0);if(epoch===s.epoch){status.textContent='حُفظ الرد في دفتر قطرة.';root.dispatchEvent(new CustomEvent('qatra-notebook-updated'));}}catch(error){if(epoch===s.epoch){status.textContent='تعذر الحفظ في دفتر قطرة: '+(error?.message||'خطأ غير معروف');save.disabled=false;}}finally{s.saving=false;}});
 const changed=()=>{if(s.controller||s.reply||s.turns.length)reset();};$(activity==='feelings'?'mmReason':'mmThought').addEventListener('input',changed);
 if(activity==='feelings'){$('mmIntensity').addEventListener('input',changed);$('mmFeelings').addEventListener('click',changed);}panel.addEventListener('toggle',()=>{if(!panel.open)reset();});panels.push({permission,screen,panel,reset});
}
function suppressLocal(){
 const sheet=$('mindfulSheet');if(!sheet)return;
 sheet.querySelectorAll('button').forEach(b=>{
  const t=(b.textContent||'').trim();
  if(t.includes('ترتيب الفكرة')||t.includes('أفرغ ذهنك')||t.includes('اختيار المقتطفات')){
   const host=b.closest('.mm-panel')||b.closest('.mm-card')||b;b.hidden=true;
  }
 });
}
function boot(){
 if(!$('mindfulSheet')||!root.QatraMindfulData?.enabled)return;
 const style=el('style');style.textContent='.qatra-ai-panel{position:relative;margin-top:22px;padding:18px;border:1px solid color-mix(in srgb,var(--primary,#38bdf8) 28%,transparent);border-radius:22px;background:linear-gradient(145deg,rgba(56,189,248,.10),rgba(139,92,246,.08));box-shadow:0 18px 40px rgba(2,6,23,.16);backdrop-filter:blur(18px) saturate(1.15);overflow:hidden}.qatra-ai-panel::before{content:"";position:absolute;inset:-40% -20% auto;height:70%;background:radial-gradient(circle at 30% 20%,rgba(56,189,248,.22),transparent 60%);pointer-events:none}.qatra-ai-panel summary{position:relative;display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.05rem;cursor:pointer}.qatra-ai-panel summary::before{content:"💧";font-size:1.1rem;filter:drop-shadow(0 0 8px rgba(56,189,248,.55))}.qatra-ai-panel>p:first-of-type{position:relative;margin-top:8px;color:color-mix(in srgb,currentColor 72%,transparent);font-size:.92rem}.qatra-ai-panel label{display:block;margin:12px 0;white-space:pre-wrap;overflow-wrap:anywhere}.qatra-ai-panel button{font:inherit;color:inherit;background:rgba(255,255,255,.07);border:1px solid color-mix(in srgb,var(--primary,#38bdf8) 35%,transparent);border-radius:14px;padding:11px 14px;margin:4px;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}.qatra-ai-panel button:hover:not(:disabled){transform:translateY(-1px);background:rgba(56,189,248,.12);box-shadow:0 8px 22px rgba(56,189,248,.16)}.qatra-ai-panel button:disabled{opacity:.45}.qatra-ai-panel p{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.8}.qatra-ai-panel textarea{width:100%;font:inherit;color:inherit;background:rgba(255,255,255,.05);border:1px solid color-mix(in srgb,var(--primary,#38bdf8) 22%,transparent);border-radius:14px;padding:12px}.qatra-ai-panel :focus-visible{outline:2px solid var(--primary,#38bdf8);outline-offset:2px}';document.head.appendChild(style);
 mount('feelings');mount('thought');suppressLocal();new MutationObserver(()=>{suppressLocal();for(const p of panels)if($('mindfulSheet').dataset.mmOpen!=='true'||!p.screen.classList.contains('is-active')||!p.panel.open)p.reset();}).observe($('mindfulSheet'),{attributes:true,subtree:true,childList:true,attributeFilter:['class','style','data-mm-open','open']});
 root.addEventListener('qatra-awareness-data-changed',()=>{identity=null;panels.forEach(p=>p.reset());});
}
root.QatraMindfulAI=Object.freeze({reset(){identity=null;panels.forEach(p=>p.reset());}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();

/* ===== نافذة احترافية ===== */
(function dialog(){
 if(root.QatraDialog)return;
 function open(title,message,options={}){
  return new Promise(resolve=>{
   const backdrop=el('div');backdrop.className='qatra-dialog-backdrop';
   const card=el('div');card.className='qatra-dialog';
   const icon=el('div',options.danger?'⚠️':'ℹ️');icon.className='qatra-dialog-icon'+(options.danger?' danger':'');
   const h=el('h3',title);const p=el('p',message);
   const row=el('div');row.className='qatra-dialog-actions';
   const cancel=el('button',options.cancelText||'إلغاء');cancel.className='qatra-dialog-btn';
   const ok=el('button',options.confirmText||'تأكيد');ok.className='qatra-dialog-btn primary'+(options.danger?' danger':'');
   row.append(cancel,ok);card.append(icon,h,p,row);backdrop.appendChild(card);document.body.appendChild(backdrop);
   requestAnimationFrame(()=>backdrop.classList.add('show'));
   const close=value=>{backdrop.classList.remove('show');setTimeout(()=>backdrop.remove(),220);resolve(value);};
   cancel.addEventListener('click',()=>close(false));ok.addEventListener('click',()=>close(true));
   backdrop.addEventListener('click',e=>{if(e.target===backdrop)close(false);});
  });
 }
 const style=el('style');style.textContent='.qatra-dialog-backdrop{position:fixed;inset:0;z-index:3000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(4,10,22,.55);backdrop-filter:blur(10px);opacity:0;transition:opacity .22s ease}.qatra-dialog-backdrop.show{opacity:1}.qatra-dialog{width:100%;max-width:380px;background:linear-gradient(160deg,rgba(20,32,52,.96),rgba(12,20,36,.98));border:1px solid rgba(131,218,208,.25);border-radius:26px;padding:24px;color:#eaf2fa;box-shadow:0 30px 70px rgba(0,0,0,.45);transform:translateY(14px) scale(.97);transition:transform .22s cubic-bezier(.2,.8,.2,1)}.qatra-dialog-backdrop.show .qatra-dialog{transform:none}.qatra-dialog-icon{width:52px;height:52px;border-radius:18px;display:grid;place-items:center;font-size:22px;background:rgba(131,218,208,.14);margin-bottom:14px}.qatra-dialog-icon.danger{background:rgba(255,107,107,.14)}.qatra-dialog h3{margin:0 0 8px;font-size:18px;font-weight:900}.qatra-dialog p{margin:0 0 20px;font-size:14px;line-height:1.8;color:#bccbdd}.qatra-dialog-actions{display:flex;gap:10px}.qatra-dialog-btn{flex:1;padding:13px;border-radius:16px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#eaf2fa;font:inherit;font-weight:800;cursor:pointer}.qatra-dialog-btn.primary{background:linear-gradient(135deg,#0EA5E9,#8B5CF6);border-color:transparent;color:#fff}.qatra-dialog-btn.primary.danger{background:linear-gradient(135deg,#ef4444,#b91c1c)}';document.head.appendChild(style);
 root.QatraDialog=Object.freeze({open});
 root.confirm=message=>{root.QatraDialog.open('تأكيد الإجراء',message,{danger:true,confirmText:'حذف',cancelText:'إلغاء'});return false;};
 root.alert=message=>{root.QatraDialog.open('تنبيه',message,{confirmText:'حسنًا'});};
})();

/* ===== دفتر قطرة ===== */
(function notebook(){
 if(root.QatraNotebook)return;
 const SOURCES=[['feeling','شعور','💧'],['thought','فكرة','💭'],['session','جلسة','🧘'],['gratitude','امتنان','🙏'],['intention','نية','🎯'],['note','تأمل ذكي','🧠'],['achievement','إنجاز','🏆']];
 let overlay=null,list=null,stats=null,progress=null,toolbar=null,entries=[],filter='all',loaded=false,loading=false,card=null;
 const selection=new Set();
 const key=e=>e.kind+'::'+e.id;
 const dayKey=d=>{const x=new Date(d);return isNaN(x)?'':x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');};
 function fmt(d){try{const x=new Date(d);if(isNaN(x))return '';return x.toLocaleDateString('ar',{weekday:'long',day:'numeric',month:'long'})+' • '+x.toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'});}catch{return '';}}
 function css(){
  if(document.getElementById('qatra-notebook-style'))return;
  const s=el('style');s.id='qatra-notebook-style';
  s.textContent=`.qatra-notebook{position:fixed;inset:0;z-index:1600;display:none;flex-direction:column;background:var(--bg,#F4F7FB);color:var(--text,#1E293B);font-family:inherit}.qatra-notebook.open{display:flex}.qatra-notebook-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px 10px}.qatra-notebook-head h2{margin:0;font-size:20px;font-weight:900}.qatra-notebook-close{width:40px;height:40px;border:none;border-radius:14px;background:color-mix(in srgb,var(--primary,#0EA5E9) 12%,transparent);color:var(--primary,#0EA5E9);font-size:20px;font-weight:800;cursor:pointer}.qatra-notebook-body{flex:1;overflow-y:auto;padding:6px 20px 40px}.qn-hero{position:relative;overflow:hidden;border:1px solid color-mix(in srgb,var(--primary,#0EA5E9) 25%,transparent);border-radius:26px;padding:20px;background:linear-gradient(145deg,rgba(56,189,248,.12),rgba(139,92,246,.10));margin-bottom:16px}.qn-hero h3{margin:0 0 6px;font-size:17px;font-weight:900}.qn-hero p{margin:0;font-size:13px;color:var(--text-dim,#64748B);line-height:1.7}.qn-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:14px 0}.qn-stat{background:var(--surface,#fff);border:1px solid var(--border,rgba(0,0,0,.04));border-radius:18px;padding:14px}.qn-stat b{display:block;font-size:22px;font-weight:900;color:var(--primary,#0EA5E9)}.qn-stat span{font-size:12px;font-weight:700;color:var(--text-dim,#64748B)}.qn-progress{background:var(--surface,#fff);border:1px solid var(--border,rgba(0,0,0,.04));border-radius:18px;padding:16px;margin-bottom:16px}.qn-progress-row{display:flex;justify-content:space-between;font-size:13px;font-weight:700;margin-bottom:8px}.qn-bar{height:8px;border-radius:99px;background:var(--border,rgba(0,0,0,.06));overflow:hidden}.qn-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--primary,#0EA5E9),var(--secondary,#8B5CF6));transition:width .6s cubic-bezier(.4,0,.2,1)}.qn-chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:10px;margin-bottom:6px;scrollbar-width:none}.qn-chips::-webkit-scrollbar{display:none}.qn-chip{flex:none;padding:9px 14px;border-radius:999px;border:1px solid var(--border,rgba(0,0,0,.06));background:var(--surface,#fff);color:var(--text-dim,#64748B);font:inherit;font-size:13px;font-weight:700;cursor:pointer}.qn-chip.active{color:#fff;background:linear-gradient(135deg,var(--primary,#0EA5E9),var(--secondary,#8B5CF6));border-color:transparent}.qn-toolbar{display:flex;gap:8px;margin:6px 0 14px}.qn-toolbar button{flex:1;padding:11px 10px;border:none;border-radius:14px;font:inherit;font-size:13px;font-weight:800;cursor:pointer;background:color-mix(in srgb,#ef4444 12%,transparent);color:#ef4444;border:1px solid color-mix(in srgb,#ef4444 30%,transparent)}.qn-toolbar button:disabled{opacity:.4}.qn-card{position:relative;background:var(--surface,#fff);border:1px solid var(--border,rgba(0,0,0,.05));border-radius:20px;padding:16px;margin-bottom:12px;box-shadow:var(--shadow,0 10px 30px -10px rgba(0,0,0,.05))}.qn-card.selected{border-color:var(--primary,#0EA5E9);box-shadow:0 0 0 2px color-mix(in srgb,var(--primary,#0EA5E9) 25%,transparent)}.qn-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px}.qn-actions{display:flex;gap:6px;align-items:center}.qn-actions button{width:34px;height:34px;border:none;border-radius:12px;background:color-mix(in srgb,#ef4444 10%,transparent);color:#ef4444;font-size:15px;cursor:pointer;display:grid;place-items:center}.qn-actions label{width:34px;height:34px;border-radius:12px;background:color-mix(in srgb,var(--primary,#0EA5E9) 10%,transparent);display:grid;place-items:center;cursor:pointer}.qn-actions input{width:18px;height:18px;accent-color:var(--primary,#0EA5E9)}.qn-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:999px;font-size:12px;font-weight:800;background:color-mix(in srgb,var(--primary,#0EA5E9) 12%,transparent);color:var(--primary,#0EA5E9)}.qn-time{font-size:12px;font-weight:700;color:var(--text-dim,#64748B);margin-bottom:8px}.qn-text{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.8;font-size:14px}.qn-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.qn-tag{padding:4px 10px;border-radius:999px;font-size:11px;font-weight:800;background:color-mix(in srgb,var(--secondary,#8B5CF6) 12%,transparent);color:var(--secondary,#8B5CF6)}.qn-empty{text-align:center;padding:40px 10px;color:var(--text-dim,#64748B);font-weight:700;line-height:1.8}.qatra-notebook-card{position:relative;overflow:hidden;width:100%;text-align:start;border:none;cursor:pointer;border-radius:24px;padding:18px;margin-bottom:14px;color:#fff;background:linear-gradient(135deg,rgba(14,165,233,.95),rgba(139,92,246,.95));box-shadow:0 16px 36px color-mix(in srgb,var(--primary,#0EA5E9) 35%,transparent)}.qatra-notebook-card::before{content:"";position:absolute;inset:-40% -20% auto;height:80%;background:radial-gradient(circle at 25% 20%,rgba(255,255,255,.25),transparent 60%);pointer-events:none}.qatra-notebook-card .card-icon{width:54px;height:54px;border-radius:18px;background:rgba(255,255,255,.18);color:#fff;display:grid;place-items:center;font-size:24px;box-shadow:inset 0 1px 0 rgba(255,255,255,.3)}.qatra-notebook-card .card-title{font-size:18px;font-weight:900;margin-bottom:4px}.qatra-notebook-card .card-sub{font-size:13px;font-weight:700;color:rgba(255,255,255,.85)}`;
  document.head.appendChild(s);
 }
 function build(){
  if(overlay)return;
  css();
  overlay=el('div');overlay.className='qatra-notebook';
  const title=el('h2','دفتر قطرة');const close=el('button','✕');close.className='qatra-notebook-close';close.setAttribute('aria-label','إغلاق دفتر قطرة');
  const headRow=el('div');headRow.className='qatra-notebook-head';headRow.append(title,close);
  const hero=el('div');hero.className='qn-hero';hero.append(el('h3','مساحتك الهادئة'),el('p','مشاعرك، أفكارك، نواياك، امتنانك، إنجازاتك، وردود القطرة الذكية — كلها مرتبة بتاريخها في مكان واحد.'));
  stats=el('div');stats.className='qn-grid';
  progress=el('div');progress.className='qn-progress';
  const chips=el('div');chips.className='qn-chips';
  const all=[['all','الكل','✨'],...SOURCES.map(k=>[k[0],k[1],k[2]])];
  all.forEach(([key,label,icon])=>{const b=el('button',icon+' '+label);b.className='qn-chip'+(key==='all'?' active':'');b.addEventListener('click',()=>{filter=key;chips.querySelectorAll('.qn-chip').forEach(c=>c.classList.remove('active'));b.classList.add('active');render();});chips.appendChild(b);});
  toolbar=el('div');toolbar.className='qn-toolbar';
  const delSelected=el('button','🗑 حذف المحدد');delSelected.disabled=true;delSelected.addEventListener('click',()=>deleteMany([...selection]));
  const delAll=el('button','🗑 حذف الكل');delAll.addEventListener('click',()=>deleteMany(entries.map(key)));
  toolbar.append(delSelected,delAll);
  list=el('div');
  const body=el('div');body.className='qatra-notebook-body';body.append(hero,stats,progress,chips,toolbar,list);
  overlay.append(headRow,body);document.body.appendChild(overlay);
  close.addEventListener('click',()=>overlay.classList.remove('open'));
  root.addEventListener('qatra-notebook-updated',()=>{if(overlay.classList.contains('open'))refresh();});
  root.addEventListener('qatra-awareness-data-changed',()=>{loaded=false;selection.clear();if(overlay.classList.contains('open'))refresh();});
 }
 function statCard(value,label){const c=el('div');c.className='qn-stat';c.append(el('b',value),el('span',label));return c;}
 function render(){
  const items=filter==='all'?entries:entries.filter(e=>e.kind===filter);
  list.replaceChildren();
  if(!items.length){list.appendChild(el('p','لا توجد سجلات في هذا التصنيف بعد. ابدأ بتسجيل شعور أو فكرة أو نية أو امتنان، وستظهر هنا بتاريخها.'));list.className='qn-empty';return;}
  list.className='';
  items.forEach(e=>{
   const kind=SOURCES.find(k=>k[0]===e.kind)||['note','تدوينة','📝'];
   const card=el('div');card.className='qn-card'+(selection.has(key(e))?' selected':'');
   const top=el('div');top.className='qn-top';
   const badge=el('span',kind[2]+' '+kind[1]);badge.className='qn-badge';top.appendChild(badge);
   const actions=el('div');actions.className='qn-actions';
   const check=el('input');check.type='checkbox';check.checked=selection.has(key(e));check.setAttribute('aria-label','تحديد السجل');
   check.addEventListener('change',()=>{if(check.checked)selection.add(key(e));else selection.delete(key(e));card.classList.toggle('selected',check.checked);updateToolbar();});
   const label=el('label');label.appendChild(check);actions.appendChild(label);
   const del=el('button','🗑');del.setAttribute('aria-label','حذف السجل');del.addEventListener('click',()=>deleteMany([key(e)]));actions.appendChild(del);
   top.appendChild(actions);card.appendChild(top);
   const time=el('div',fmt(e.date)||'—');time.className='qn-time';card.appendChild(time);
   const text=el('p',e.text);text.className='qn-text';card.appendChild(text);
   const meta=el('div');meta.className='qn-meta';
   if(e.feeling){const t=el('span','شعور: '+e.feeling);t.className='qn-tag';meta.appendChild(t);}
   if(Number.isFinite(e.intensity)){const t=el('span','الشدة: '+e.intensity+'/10');t.className='qn-tag';meta.appendChild(t);}
   if(e.ai){const t=el('span','رد القطرة الذكية');t.className='qn-tag';meta.appendChild(t);}
   if(meta.children.length)card.appendChild(meta);
   list.appendChild(card);
  });
  updateToolbar();
 }
 function updateToolbar(){
  const del=toolbar?.querySelector('button');
  if(del)del.disabled=!selection.size;
 }
 async function deleteMany(keys){
  if(!keys.length)return;
  const targets=entries.filter(e=>keys.includes(key(e)));
  if(!targets.length)return;
  const ok=await root.QatraDialog.open(keys.length===1?'حذف السجل':'حذف السجلات',keys.length===1?'سيتم حذف هذا السجل نهائيًا من دفتر قطرة، ولا يمكن التراجع عن هذه الخطوة.':'سيتم حذف '+keys.length+' سجل نهائيًا من دفتر قطرة، ولا يمكن التراجع عن هذه الخطوة.',{danger:true,confirmText:'حذف نهائي',cancelText:'إلغاء'});
  if(!ok)return;
  try{await root.QatraMindfulData.ready();
   for(const e of targets){try{await root.QatraMindfulStore.remove(e.kind,e.id,e.revision);}catch(err){console.warn('notebook delete failed',e.kind,e.id,err);}}
   keys.forEach(k=>selection.delete(k));
   root.dispatchEvent(new CustomEvent('qatra-notebook-updated'));
   await refresh();
  }catch(error){root.QatraDialog.open('تعذر الحذف','حدث خطأ أثناء حذف السجلات. لم يتم حذف ما لم يُؤكد حذفه، ويمكنك المحاولة مرة أخرى.',{confirmText:'حسنًا'});}
 }
 function renderStats(){
  const days=new Set(entries.map(e=>dayKey(e.date)).filter(Boolean));
  let streak=0,cursor=new Date();
  if(!days.has(dayKey(cursor)))cursor.setDate(cursor.getDate()-1);
  while(days.has(dayKey(cursor))){streak++;cursor.setDate(cursor.getDate()-1);}
  const week=[];for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);week.push(dayKey(d));}
  const weekDays=new Set(week.filter(d=>days.has(d))).size;
  const feelings=entries.filter(e=>e.kind==='feeling'&&Number.isFinite(e.intensity));
  const avg=feelings.length?(feelings.reduce((n,e)=>n+e.intensity,0)/feelings.length).toFixed(1):'—';
  stats.replaceChildren(statCard(entries.length,'إجمالي السجلات'),statCard(streak,'أيام متتابعة'),statCard(weekDays+'/7','هذا الأسبوع'),statCard(avg,'متوسط الشدة'));
  progress.replaceChildren();
  const row=el('div');row.className='qn-progress-row';row.append(el('span','تقدم الأسبوع'),el('span',weekDays+' من 7 أيام'));
  const bar=el('div');bar.className='qn-bar';const fill=el('i');fill.style.width=Math.min(100,weekDays/7*100)+'%';bar.appendChild(fill);
  progress.append(row,bar);
 }
 async function refresh(){
  if(loading)return;loading=true;
  if(!loaded){list.replaceChildren(el('p','جارٍ تحميل دفتر قطرة…'));list.className='qn-empty';}
  const next=[];
  try{await root.QatraMindfulData.ready();}catch{}
  for(const [kind] of SOURCES){
   try{const page=await root.QatraMindfulStore.list(kind,{limit:100});
    for(const entry of page.entries||[]){const p=entry.payload||{};const text=p.text||p.reason||p.feeling||p.reflection||p.title||'';if(typeof text==='string'&&text.trim())next.push({kind,id:entry.id,revision:entry.revision,text:text.trim(),date:p.createdAt||entry.createdAt||entry.updatedAt,intensity:p.intensity,feeling:p.feeling,ai:p.source==='mindful-minute'||!!p.analysis});}
   }catch{}
  }
  next.sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
  entries=next;
  [...selection].forEach(k=>{if(!entries.some(e=>key(e)===k))selection.delete(k);});
  loaded=true;loading=false;renderStats();render();
 }
 function open(){build();overlay.classList.add('open');refresh();}
 function findLibrary(){
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){const n=walker.currentNode;if(n.textContent.includes('المكتبة الشخصية'))return n;}
  return null;
 }
 function injectCard(){
  if(card)return true;
  const node=findLibrary();if(!node)return false;
  node.textContent=node.textContent.replace('المكتبة الشخصية','قطراتي');
  let host=node.parentElement;
  while(host&&host!==document.body){
   if(host.tagName==='SECTION'||host.classList.contains('view')||host.classList.contains('library-grid')||host.classList.contains('cards-grid')||host.classList.contains('grid'))break;
   host=host.parentElement;
  }
  if(!host||host===document.body)host=node.parentElement;
  card=el('button');card.type='button';card.className='glass-card action-card qatra-notebook-card';card.style.cssText='width:100%;text-align:start';
  const icon=el('div','📖');icon.className='card-icon';
  const info=el('div');info.className='card-info';
  const t=el('div','دفتر قطرة');t.className='card-title';
  const sub=el('div','مشاعرك ونواياك وامتنانك وإنجازاتك وردود القطرة الذكية');sub.className='card-sub';
  info.append(t,sub);card.append(icon,info);card.addEventListener('click',open);
  host.prepend(card);
  return true;
 }
 function mountCard(){
  if(!root.QatraMindfulData?.enabled)return;
  if(injectCard())return;
  const timer=setInterval(()=>{if(injectCard())clearInterval(timer);},700);
  setTimeout(()=>clearInterval(timer),20000);
  const observer=new MutationObserver(()=>{if(injectCard())observer.disconnect();});observer.observe(document.body,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountCard);else mountCard();
 root.QatraNotebook=Object.freeze({open,refresh});
})();
})(globalThis);
