/* Native-only opt-in client. No external network or identity storage at startup. */
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
 const panel=el('details');panel.className='qatra-ai-panel';panel.appendChild(el('summary','القطرة الذكية'));panel.appendChild(el('p','مساعدة اختيارية لفهم الشعور أو إعادة ترتيب الفكرة، مع تحكمك الكامل فيما يُرسل.'));
 const permission=el('input'),historyPermission=el('input');permission.type=historyPermission.type='checkbox';
 function checkbox(input,text){const label=el('label');label.append(input,document.createTextNode(text));return label;}
 function button(text){const node=el('button',text);node.type='button';return node;}
 const pick=button('اختيار مقتطفات محلية'),send=button('إرسال النص الحالي'),cancel=button('إلغاء الطلب'),clear=button('مسح الجلسة والعودة للمحلي'),save=button('حفظ هذا الرد محليًا'),history=el('div'),output=el('p'),status=el('p'),follow=el('textarea');
 follow.id='qatra-ai-follow-'+activity;follow.maxLength=2000;follow.rows=3;const followLabel=el('label','متابعة أو توضيح للرد الأخير');followLabel.htmlFor=follow.id;
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');cancel.disabled=save.disabled=true;
 panel.append(el('p','للتأمل لا للتشخيص أو العلاج. بعد الموافقة والإرسال يتصل التطبيق بخادم قطرة وبـ Firebase لهوية مؤقتة؛ ويُرسل النص والشعور والشدة وسياق الجلسة المختصر إلى Groq عبر الخادم. لا تكتب أسرارًا.'),checkbox(permission,' أوافق على الاتصال وإرسال النص الحالي وسياق الجلسة.'),checkbox(historyPermission,' أوافق على إرسال المقتطفات التي أحددها، حتى ثلاثة.'),pick,history,el('p','المتابعة تتضمن النص الأصلي وآخر ست رسائل مختصرة حتى 1000 حرف للرسالة. رموز الهوية في الذاكرة فقط؛ إعادة فتح التطبيق قد تنشئ حسابًا مجهولًا جديدًا. الإلغاء لا يسحب ما وصل إلى الخدمة.'),send,cancel,clear,status,output,followLabel,follow,save);screen.appendChild(panel);
 const s={epoch:0,controller:null,turns:[],reply:null,entry:null,selected:new Map(),saving:false};
 function reset(){s.epoch++;s.controller?.abort();s.controller=null;s.turns=[];s.reply=s.entry=null;s.selected.clear();history.replaceChildren();output.textContent=follow.value='';permission.checked=historyPermission.checked=false;send.disabled=false;cancel.disabled=save.disabled=true;status.textContent='الوضع المحلي نشط.';if(!panels.some(p=>p.permission.checked))identity=null;}
 function input(){const text=$(activity==='feelings'?'mmReason':'mmThought').value.trim(),feeling=activity==='feelings'?document.querySelector('#mmFeelings button[aria-pressed="true"]')?.textContent.trim():'',intensity=activity==='feelings'?Number($('mmIntensity').value):null;if(!text||text.length>6000||activity==='feelings'&&(!feeling||!Number.isInteger(intensity)||intensity<1||intensity>10))throw Error('INPUT');return {activity,text,feeling:feeling||'',intensity};}
 pick.addEventListener('click',async()=>{
  if(s.controller)return;const epoch=s.epoch;pick.disabled=true;
  try{
   await root.QatraMindfulData.ready();const records=[];
   for(const kind of ['feeling','thought','note']){const page=await root.QatraMindfulStore.list(kind,{limit:20});for(const entry of page.entries){const text=entry.payload?.text||entry.payload?.reason||entry.payload?.feeling;if(typeof text==='string'&&text.trim())records.push({kind,id:entry.id,revision:entry.revision,text:text.slice(0,1000)});}}
   if(epoch!==s.epoch)return;s.selected.clear();history.replaceChildren();history.appendChild(el('p','حتى 20 سجلًا لكل نوع. راجع المقتطف المعروض (حتى 1000 حرف) قبل تحديده. لا إرسال دون موافقة السجلات.'));
   if(!records.length)history.appendChild(el('p','لا توجد سجلات نصية للاختيار.'));
   records.forEach((record,index)=>{const check=el('input');check.type='checkbox';history.appendChild(checkbox(check,({feeling:'شعور',thought:'فكرة',note:'تدوينة'})[record.kind]+': '+record.text));check.addEventListener('change',()=>{if(s.controller){check.checked=s.selected.has(index);return;}if(check.checked&&s.selected.size>=3){check.checked=false;status.textContent='الحد ثلاثة مقتطفات.';return;}if(check.checked)s.selected.set(index,record);else s.selected.delete(index);});});
  }catch(error){if(epoch===s.epoch)status.textContent='تعذرت قراءة السجلات؛ لم نستخدم مخزنًا بديلًا.';}finally{pick.disabled=false;}
 });
 permission.addEventListener('change',()=>{if(!permission.checked)reset();});
 historyPermission.addEventListener('change',()=>{if(!historyPermission.checked){s.controller?.abort();s.selected.clear();history.querySelectorAll('input').forEach(e=>e.checked=false);}});
 cancel.addEventListener('click',()=>{s.epoch++;s.controller?.abort();s.controller=null;send.disabled=false;cancel.disabled=true;status.textContent='أُلغي انتظار الرد؛ لا يمكن سحب ما وصل سابقًا.';});clear.addEventListener('click',reset);
 send.addEventListener('click',async()=>{
  if(!permission.checked){status.textContent='اختر موافقة الاتصال أولًا، أو استخدم الوضع المحلي.';return;}if(busy){status.textContent='انتظر اكتمال الطلب أو إلغائه.';return;}
  let current;try{current=input();}catch(error){status.textContent='اكتب النص أو سياق الشعور (حتى 6000 حرف)، واختر الشعور وشدته.';return;}
  const extra=follow.value.trim();if(s.turns.length&&!extra){status.textContent='اكتب متابعة أو امسح الجلسة لطلب جديد.';return;}
  const text=current.text+(extra?'\n\nمتابعة المستخدم: '+extra:''),records=historyPermission.checked?[...s.selected.values()]:[];
  const body=JSON.stringify({...current,text,turns:s.turns,records:records.map(r=>({kind:r.kind,text:r.text})),consent:{cloud:true,history:historyPermission.checked,policyVersion:POLICY}});
  if(text.length>6000||text.length+s.turns.reduce((n,t)=>n+t.text.length,0)+records.reduce((n,r)=>n+r.text.length,0)>14000||new TextEncoder().encode(body).length>32768){status.textContent='السياق طويل؛ قلّله أو امسح الجلسة. لم نحذفه بصمت.';return;}
  if(root.location.origin!=='https://localhost'){status.textContent='عنوان التطبيق يختلف عن الإعداد المتوقع؛ أوقفنا الاتصال للمراجعة.';return;}
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
   const now=new Date(),common={schemaVersion:1,id:'cloud-'+response.requestId,createdAt:now.toISOString(),source:'mindful-minute',analysis:{method:'groq-structured-v1',requestId:response.requestId,policyVersion:POLICY,safety:reply.safety,historyRefs:records.map(r=>({kind:r.kind,id:r.id,revision:r.revision}))}};
   s.entry=activity==='feelings'?{...common,activity,feeling:current.feeling,intensity:current.intensity,reason:current.text,reflection:rendered,followup:extra}:{...common,activity:'thought',category:'ترتيب فكرة',date:now.toLocaleString('ar'),text:'الفكرة الأصلية:\n'+text+'\n\nالرد السحابي:\n'+rendered};
   follow.value='';save.disabled=false;status.textContent='وصل الرد ولم يُحفظ تلقائيًا. زر الحفظ لهذا الرد فقط.';
  }catch(error){if(epoch===s.epoch)status.textContent=error.message==='CLOUD_AI_DISABLED'?'القطرة الذكية غير متاحة حاليًا؛ الوضع المحلي نشط.':error.message==='OPERATION_NOT_ALLOWED'?'يجب تفعيل الدخول المجهول في Firebase.':'تعذر إكمال الطلب. لم نقدّم ردًا محليًا على أنه سحابي، ولا نعيد المحاولة تلقائيًا.';}
  finally{busy=false;if(epoch===s.epoch){s.controller=null;send.disabled=false;cancel.disabled=true;}}
 });
 save.addEventListener('click',async()=>{if(!s.entry||s.saving)return;const epoch=s.epoch,entry=s.entry;s.saving=true;save.disabled=true;try{await root.QatraMindfulData.add(activity==='feelings'?'qatra_feelings_log':'qatra_notebook',entry);if(epoch===s.epoch)status.textContent='حُفظ الرد محليًا في بيانات قطرة.';}catch(error){if(epoch===s.epoch){status.textContent='تعذر الحفظ؛ لم نستخدم مصدرًا بديلًا.';save.disabled=false;}}finally{s.saving=false;}});
 const changed=()=>{if(s.controller||s.reply||s.turns.length)reset();};$(activity==='feelings'?'mmReason':'mmThought').addEventListener('input',changed);
 if(activity==='feelings'){$('mmIntensity').addEventListener('input',changed);$('mmFeelings').addEventListener('click',changed);}panel.addEventListener('toggle',()=>{if(!panel.open)reset();});panels.push({permission,screen,panel,reset});
}
function boot(){
 if(!$('mindfulSheet')||!root.QatraMindfulData?.enabled)return;
 const style=el('style');style.textContent='.qatra-ai-panel{position:relative;margin-top:22px;padding:18px;border:1px solid color-mix(in srgb,var(--primary,#38bdf8) 28%,transparent);border-radius:22px;background:linear-gradient(145deg,rgba(56,189,248,.10),rgba(139,92,246,.08));box-shadow:0 18px 40px rgba(2,6,23,.16);backdrop-filter:blur(18px) saturate(1.15);overflow:hidden}.qatra-ai-panel::before{content:"";position:absolute;inset:-40% -20% auto;height:70%;background:radial-gradient(circle at 30% 20%,rgba(56,189,248,.22),transparent 60%);pointer-events:none}.qatra-ai-panel summary{position:relative;display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.05rem;cursor:pointer}.qatra-ai-panel summary::before{content:"💧";font-size:1.1rem;filter:drop-shadow(0 0 8px rgba(56,189,248,.55))}.qatra-ai-panel>p:first-of-type{position:relative;margin-top:8px;color:color-mix(in srgb,currentColor 72%,transparent);font-size:.92rem}.qatra-ai-panel label{display:block;margin:12px 0;white-space:pre-wrap;overflow-wrap:anywhere}.qatra-ai-panel button{font:inherit;color:inherit;background:rgba(255,255,255,.07);border:1px solid color-mix(in srgb,var(--primary,#38bdf8) 35%,transparent);border-radius:14px;padding:11px 14px;margin:4px;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}.qatra-ai-panel button:hover:not(:disabled){transform:translateY(-1px);background:rgba(56,189,248,.12);box-shadow:0 8px 22px rgba(56,189,248,.16)}.qatra-ai-panel button:disabled{opacity:.45}.qatra-ai-panel p{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.8}.qatra-ai-panel textarea{width:100%;font:inherit;color:inherit;background:rgba(255,255,255,.05);border:1px solid color-mix(in srgb,var(--primary,#38bdf8) 22%,transparent);border-radius:14px;padding:12px}.qatra-ai-panel :focus-visible{outline:2px solid var(--primary,#38bdf8);outline-offset:2px}';document.head.appendChild(style);
 mount('feelings');mount('thought');new MutationObserver(()=>{for(const p of panels)if($('mindfulSheet').dataset.mmOpen!=='true'||!p.screen.classList.contains('is-active')||!p.panel.open)p.reset();}).observe($('mindfulSheet'),{attributes:true,subtree:true,attributeFilter:['class','style','data-mm-open','open']});
 root.addEventListener('qatra-awareness-data-changed',()=>{identity=null;panels.forEach(p=>p.reset());});
}
root.QatraMindfulAI=Object.freeze({reset(){identity=null;panels.forEach(p=>p.reset());}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})(globalThis);
