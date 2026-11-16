(() => {
'use strict';
if(window.QatraCulture)return;
const el=(tag,text)=>{const node=document.createElement(tag);if(text)node.textContent=text;return node};
const urls={'globalvoices-home':'https://ar.globalvoices.org/','globalvoices-license':'https://ar.globalvoices.org/about/global-voices-attribution-policy/'};
const native=()=>!!(window.Capacitor?.isNativePlatform?.()||window.Capacitor?.getPlatform?.()==='android');
const api=()=>window.Capacitor?.Plugins?.QatraNewsLinks||window.Capacitor?.registerPlugin?.('QatraNewsLinks');
let sheet,focusBefore,preview,timer;
function dismiss(){clearTimeout(timer);preview?.remove();preview=null}
function close(){if(preview){dismiss();return}if(sheet?.open){sheet.close();focusBefore?.isConnected&&focusBefore.focus()}}
async function external(method,data,url){
 if(native()){const result=await api()[method](data);if(result.opened!==true)throw Error('open')}
 else{const page=window.open(url,'_blank');if(!page)throw Error('blocked');page.opener=null}
}
function dateText(article){const time=Number(article.publishedAt);return Number.isFinite(time)&&time>0?new Date(time).toLocaleDateString('ar',{dateStyle:'long'}):'تاريخ النشر غير متاح'}
function showDrop(article,trigger){
 dismiss();const layer=el('div');preview=layer;layer.className='qculture-preview';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-labelledby','qcultureArticleTitle');layer.tabIndex=-1;
 const drop=el('div');drop.className='qculture-drop';drop.setAttribute('aria-hidden','true');drop.innerHTML='<svg viewBox="0 0 100 140" fill="currentColor"><path d="M50 2C42 28 7 59 7 88a43 43 0 0 0 86 0C93 59 58 28 50 2Z"/></svg>';
 const card=el('article');card.className='qculture-card';card.hidden=true;const title=el('h3',article.title);title.id='qcultureArticleTitle';const snippet=el('p',article.excerpt||'المقتطف غير متاح في الخلاصة.');snippet.className='qculture-excerpt';
 const author=el('p',article.author?'الكاتب: '+article.author:'الكاتب غير مذكور في الخلاصة');
 const source=el('small','الأصوات العالمية · '+dateText(article));const read=el('button','قراءة المقال في المصدر ↗');read.type='button';const status=el('p');status.setAttribute('role','status');
 read.onclick=async()=>{read.disabled=true;try{const url=new URL(article.url);if(url.protocol!=='https:'||url.hostname!=='ar.globalvoices.org')throw Error('url');await external('openArticle',{url:url.href},url.href)}catch(_){status.textContent='تعذر فتح المقال الخارجي.'}finally{read.disabled=false}};
 const back=el('button','رجوع');back.type='button';const finish=()=>{dismiss();trigger?.isConnected&&trigger.focus()};back.onclick=finish;
 card.append(el('small','قطرة ثقافة · معاينة داخل التطبيق'),title,author,snippet,source,read,back,status);layer.append(drop,card);sheet.append(layer);layer.focus();
 const reveal=()=>{if(preview===layer){drop.hidden=true;card.hidden=false;read.focus()}};if(matchMedia('(prefers-reduced-motion:reduce)').matches)reveal();else timer=setTimeout(reveal,1000);
 layer.addEventListener('click',event=>{if(event.target===layer)finish()});layer.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Escape'){event.preventDefault();finish()}if(event.key==='Tab'){const controls=[read,back].filter(x=>!x.disabled&&!card.hidden);if(!controls.length){event.preventDefault();return}if(event.shiftKey&&document.activeElement===controls[0]){event.preventDefault();controls.at(-1).focus()}else if(!event.shiftKey&&document.activeElement===controls.at(-1)){event.preventDefault();controls[0].focus()}}});
}
function start(){
 const anchor=document.getElementById('openQatraMedicine');if(!anchor)return;
 const entry=el('button');entry.type='button';entry.id='openQatraCulture';entry.className='glass-card action-card';entry.setAttribute('aria-haspopup','dialog');entry.innerHTML='<span class="card-icon"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5C8 2 4 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-2-1-6-2-10 1Zm0 0v15"/></svg></span><span class="card-info"><span class="card-title">قطرة ثقافة</span><span class="card-sub">مقالة تلهمك · والقراءة في مصدرها</span></span>';anchor.after(entry);
 sheet=el('dialog');sheet.id='qatraCultureSheet';sheet.dir='rtl';sheet.setAttribute('aria-labelledby','qcultureTitle');sheet.setAttribute('data-no-theme-pull','');const panel=el('section');panel.className='qculture-panel';const head=el('header'),title=el('h2','قطرة ثقافة'),back=el('button','رجوع');title.id='qcultureTitle';back.type='button';back.onclick=close;head.append(title,back);
 const intro=el('p','اختر المصدر والمجال. تعرض القطرة عنوان المقالة وكاتبها ومقتطفًا قصيرًا، وتفتح القراءة الكاملة في موقع المصدر.');
 const sourceLabel=el('label','مصدر المقالات'),source=el('select');source.add(new Option('الأصوات العالمية — العربية','globalvoices'));sourceLabel.append(source);
 const fieldLabel=el('label','مجال المقالات'),field=el('select');field.add(new Option('كل المجالات الثقافية المتاحة','all'));fieldLabel.append(field);
 let saved='all';try{saved=localStorage.getItem('qatra.culture.field')||'all'}catch(_){}
 const status=el('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');const refresh=el('button','تحديث المقالات'),test=el('button','تجربة قطرة ثقافة');refresh.type=test.type='button';test.disabled=true;
 const note=el('small','المصدر المتاح حاليًا: الأصوات العالمية. المجالات مستخرجة من تصنيفات المصدر الثقافية، وقد لا تتوفر مقالات لكل مجال في الخلاصة الحالية. لا تُعرض قائمة المقالات أو نصوصها الكاملة هنا. جدولة القطرات في الخلفية غير مفعّلة في هذه الدفعة.');
 let articles=[],loading=false,version=0,cursor=0;
 const matching=()=>articles.filter(a=>field.value==='all'||a.categories.includes(field.value));
 function paint(){const count=matching().length;test.disabled=!count;status.textContent=count?'المتاح لاختيارك: '+new Intl.NumberFormat('ar').format(count)+' مقالة. يظهر تاريخ النشر على البطاقة.':'لا تتوفر مقالات ثقافية لهذا الاختيار في الخلاصة الحالية. جرّب مجالًا آخر أو افتح المصدر.'}
 field.onchange=()=>{saved=field.value;cursor=0;try{localStorage.setItem('qatra.culture.field',saved)}catch(_){}paint()};
 async function load(){if(loading||!sheet.open)return;loading=true;refresh.disabled=true;const serial=++version;status.textContent='جارٍ قراءة المقالات الثقافية…';try{
  if(!native())throw Error('native');const result=await api().getArticles();if(serial!==version||!sheet.open)return;if(!Array.isArray(result.articles))throw Error('format');articles=result.articles.filter(a=>typeof a.title==='string'&&typeof a.url==='string'&&Array.isArray(a.categories));
  const categories=[...new Set(articles.flatMap(a=>a.categories).filter(x=>typeof x==='string'))].sort((a,b)=>a.localeCompare(b,'ar'));field.replaceChildren(new Option('كل المجالات الثقافية المتاحة','all'));categories.forEach(x=>field.add(new Option(x,x)));field.value=categories.includes(saved)?saved:'all';cursor=0;paint();
 }catch(_){if(serial===version&&sheet.open)status.textContent='تعذر تحديث المقالات. قد تبقى بيانات سابقة متاحة؛ افتح المصدر أو أعد المحاولة. الجلب التجريبي متاح في Android.'}finally{loading=false;refresh.disabled=false}}
 refresh.onclick=load;test.onclick=()=>{const rows=matching();if(rows.length)showDrop(rows[cursor++%rows.length],test)};
 const sourceButton=el('button','فتح المصدر ↗'),license=el('button','سياسة إعادة الاستخدام ↗');sourceButton.type=license.type='button';
 for(const [button,id] of [[sourceButton,'globalvoices-home'],[license,'globalvoices-license']])button.onclick=async()=>{button.disabled=true;try{await external('openSource',{source:id},urls[id])}catch(_){status.textContent='تعذر فتح الرابط الخارجي.'}finally{button.disabled=false}};
 panel.append(head,intro,sourceLabel,fieldLabel,status,refresh,test,note,sourceButton,license,el('small','المقتطف مأخوذ من وصف الخلاصة ومقصوص للاختصار دون توليد نص جديد. تُنسب المادة إلى المصدر والكاتب عند توفره، وتُراعى سياسة المصدر واستثناءاتها.'));sheet.append(panel);document.body.append(sheet);
 entry.onclick=()=>{if(sheet.open)return;focusBefore=document.activeElement;try{sheet.showModal();back.focus();load()}catch(_){}};sheet.addEventListener('click',event=>{if(event.target===sheet)close()});sheet.addEventListener('cancel',event=>{event.preventDefault();close()});sheet.addEventListener('close',()=>{version++;dismiss()});sheet.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Escape'){event.preventDefault();close()}});
}
window.QatraCulture=Object.freeze({close,isOpen:()=>!!sheet?.open});
window.QatraNews=window.QatraCulture;
const style=el('style');style.textContent=`
#openQatraCulture .card-icon svg{width:28px;height:28px}#qatraCultureSheet{position:fixed;inset:0;margin:0;width:100%;height:100%;max-width:none;max-height:none;box-sizing:border-box;border:0;padding:16px;background:#0008;color:var(--text);font:inherit;backdrop-filter:blur(8px)}#qatraCultureSheet[open]{display:flex;align-items:center;justify-content:center}#qatraCultureSheet::backdrop{background:transparent}.qculture-panel{width:100%;max-width:540px;max-height:90dvh;overflow:auto;box-sizing:border-box;padding:22px;border:1px solid var(--border);border-radius:28px;background:var(--surface);box-shadow:0 24px 80px #0005}.qculture-panel header{display:flex;align-items:center;justify-content:space-between;gap:12px}.qculture-panel h2{margin:0;font-size:23px}.qculture-panel p{line-height:1.9}.qculture-panel label{display:block;margin:18px 0}.qculture-panel select{display:block;width:100%;min-height:48px;margin-top:8px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:14px;font:inherit;padding:12px}#qatraCultureSheet button{min-height:48px;padding:12px 16px;border:1px solid var(--border);border-radius:15px;background:var(--surface);color:var(--primary);font:inherit;touch-action:manipulation}.qculture-panel>button{display:block;width:100%;margin-top:10px}.qculture-panel small,.qculture-card small{display:block;line-height:1.9;color:var(--text-dim);font-size:12px}.qculture-panel>small{margin-top:16px}.qculture-preview{position:fixed;inset:0;z-index:10;padding:20px;display:flex;align-items:center;justify-content:center;background:#000a;backdrop-filter:blur(8px)}.qculture-card{width:min(440px,100%);box-sizing:border-box;max-height:85dvh;overflow:auto;padding:24px;border:1px solid var(--border);border-radius:26px;background:var(--surface);box-shadow:0 24px 80px #0006}.qculture-card h3{font-size:21px;line-height:1.9}.qculture-card p{line-height:1.9}.qculture-excerpt{padding:14px;border-inline-start:3px solid var(--primary);border-radius:12px;background:var(--bg);font-size:14px}.qculture-card button{display:block;width:100%;margin-top:10px}.qculture-drop{width:60px;color:var(--primary);filter:drop-shadow(0 8px 22px #0005);animation:qculture-fall .9s cubic-bezier(.4,0,.8,1) both}.qculture-preview [hidden]{display:none!important}#qatraCultureSheet :focus-visible{outline:2px solid var(--primary);outline-offset:3px}@keyframes qculture-fall{from{transform:translateY(-55vh) scale(.6);opacity:.2}to{transform:translateY(0) scale(1);opacity:1}}@media(prefers-reduced-motion:reduce){.qculture-drop{animation:none}}
`;document.head.append(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
