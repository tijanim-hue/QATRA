(() => {
'use strict';
if(window.QatraNews)return;
const links={'aljazeera-home':'https://www.aljazeera.net/','aljazeera-latest':'https://www.aljazeera.net/latest','globalvoices-home':'https://ar.globalvoices.org/','globalvoices-license':'https://globalvoices.org/about/global-voices-attribution-policy/'};
const el=(tag,text)=>{const node=document.createElement(tag);if(text)node.textContent=text;return node};
let sheet,focusBefore,preview,previewTimer;
const native=()=>!!(window.Capacitor?.isNativePlatform?.()||window.Capacitor?.getPlatform?.()==='android');
const api=()=>window.Capacitor?.Plugins?.QatraNewsLinks||window.Capacitor?.registerPlugin?.('QatraNewsLinks');
function dismissPreview(){clearTimeout(previewTimer);preview?.remove();preview=null}
function close(){if(preview){dismissPreview();return}if(!sheet?.open)return;sheet.close();if(focusBefore?.isConnected)focusBefore.focus()}
function published(story){const time=Number(story.publishedAt);return Number.isFinite(time)&&time>0?time:0}
function fresh(story){const age=Date.now()-published(story);return published(story)>0&&age>=-600000&&age<=72*3600000}
function dateText(story){const value=published(story);return value?new Date(value).toLocaleString('ar',{dateStyle:'medium',timeStyle:'short'}):'تاريخ النشر غير متاح'}
async function openSource(id){if(native()){const result=await api().openSource({source:id});if(result.opened!==true)throw Error('open')}else external(links[id])}
function external(url){const opened=window.open(url,'_blank');if(!opened)throw Error('blocked');opened.opener=null}
async function openArticle(story){
 const url=new URL(story.url);if(url.protocol!=='https:'||url.hostname!=='ar.globalvoices.org'||!/^\/\d{4}\/\d{2}\/\d{2}\//.test(url.pathname))throw Error('url');
 if(native()){const result=await api().openArticle({url:url.href});if(result.opened!==true)throw Error('open')}else external(url.href);
}
function showPreview(story,trigger){
 dismissPreview();const layer=el('div');preview=layer;layer.className='qnews-preview';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-labelledby','qnewsPreviewTitle');layer.tabIndex=-1;
 const drop=el('div');drop.className='qnews-falling-drop';drop.setAttribute('aria-hidden','true');drop.innerHTML='<svg viewBox="0 0 100 140" fill="currentColor"><path d="M50 2C42 28 7 59 7 88a43 43 0 0 0 86 0C93 59 58 28 50 2Z"/></svg>';
 const card=el('article');card.className='qnews-preview-card';card.hidden=true;const title=el('h3',story.title);title.id='qnewsPreviewTitle';
 card.append(el('small',fresh(story)?'معاينة قصة حديثة — ليست إشعار خلفية':'معاينة مادة قديمة أو غير مؤرّخة — ليست خبرًا جديدًا'),title,el('p','الأصوات العالمية'+(story.author?' · '+story.author:'')),el('p',dateText(story)));
 const message=el('p');message.setAttribute('role','status');const read=el('button','قراءة المقال في المصدر ↗');read.type='button';read.onclick=async()=>{read.disabled=true;try{await openArticle(story)}catch(_){message.textContent='تعذر فتح المقال الخارجي.'}finally{read.disabled=false}};
 const back=el('button','رجوع');back.type='button';const finish=()=>{dismissPreview();if(trigger?.isConnected)trigger.focus()};back.onclick=finish;card.append(read,back,message);layer.append(drop,card);sheet.append(layer);layer.focus();
 const reveal=()=>{if(preview!==layer)return;drop.hidden=true;card.hidden=false;read.focus()};
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)reveal();else previewTimer=setTimeout(reveal,1000);
 layer.addEventListener('click',event=>{if(event.target===layer)finish()});layer.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Escape'){event.preventDefault();finish()}if(event.key==='Tab'){const controls=[read,back].filter(x=>!x.disabled&&!card.hidden);if(!controls.length){event.preventDefault();return}const first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
}
function start(){
 const anchor=document.getElementById('openQatraMedicine');if(!anchor)return;
 const entry=el('button');entry.type='button';entry.id='openQatraNews';entry.className='glass-card action-card';entry.setAttribute('aria-haspopup','dialog');
 entry.innerHTML='<span class="card-icon"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 7h8M8 11h3m3 0h2M8 15h8M8 18h5"/></svg></span><span class="card-info"><span class="card-title">قطرة أخبار</span><span class="card-sub">قصص عالمية وروابط مصادر · تجريبي</span></span>';anchor.after(entry);
 sheet=el('dialog');sheet.id='qatraNewsSheet';sheet.dir='rtl';sheet.setAttribute('aria-labelledby','qatraNewsTitle');sheet.setAttribute('data-no-theme-pull','');
 const panel=el('section');panel.className='qnews-panel';const header=el('header'),title=el('h2','قطرة أخبار'),back=el('button','رجوع');title.id='qatraNewsTitle';back.type='button';back.onclick=close;header.append(title,back);
 const intro=el('p','نسخة تجريبية تعرض عناوين من خلاصة الأصوات العالمية وتفتح المقالات خارج قطرة. لا تختار الأهمية آليًا ولا ترسل تنبيهات خلفية. الجزيرة تبقى روابط خارجية فقط.');intro.className='qnews-note';
 const gv=el('section');gv.className='qnews-source';gv.append(el('h3','الأصوات العالمية — بالعربية'));
 const refresh=el('button','تحديث القصص'),status=el('p'),stories=el('div');refresh.type='button';status.setAttribute('role','status');status.setAttribute('aria-live','polite');let loading=false,version=0;
 async function load(){
  if(loading||!sheet.open)return;loading=true;refresh.disabled=true;const serial=++version;status.textContent='جارٍ قراءة الخلاصة…';
  try{
   if(!native())throw Error('native');const result=await api().getStories();if(serial!==version||!sheet.open)return;
   if(!Array.isArray(result.stories))throw Error('format');stories.replaceChildren();let recent=0;
   for(const story of result.stories){
    if(typeof story.title!=='string'||typeof story.url!=='string')continue;const row=el('article');row.className='qnews-story';if(fresh(story))recent++;
    const badge=el('small',fresh(story)?'منشور خلال آخر ٧٢ ساعة':'مادة قديمة أو تاريخها غير متاح');row.append(badge,el('h4',story.title),el('p','الأصوات العالمية'+(story.author?' · '+story.author:'')),el('time',dateText(story)));
    const read=el('button','قراءة المصدر ↗');read.type='button';read.onclick=async()=>{read.disabled=true;try{await openArticle(story)}catch(_){status.textContent='تعذر فتح المقال الخارجي.'}finally{read.disabled=false}};
    const test=el('button','معاينة القطرة');test.type='button';test.onclick=()=>showPreview(story,test);row.append(read,test);stories.append(row);
   }
   status.textContent=!stories.children.length?'لم تعد الخلاصة عناوين قابلة للعرض.':recent?'عُرضت عناوين المصدر بتاريخ نشرها. الحداثة لا تعني أن القصة مختارة كخبر مهم.':'لا توجد مواد ضمن آخر ٧٢ ساعة في الخلاصة المسترجعة. المعروض أرشيف وليس أخبارًا جديدة.';
  }catch(_){if(serial===version&&sheet.open)status.textContent='تعذر جلب الخلاصة. قد تبقى نتائج سابقة ظاهرة؛ يمكنك فتح موقع المصدر مباشرة. الجلب التجريبي مخصص لنسخة Android.'}
  finally{loading=false;refresh.disabled=false}
 }
 refresh.onclick=load;gv.append(refresh,status,stories);
 function linkButton(id,label,parent){const button=el('button',label+' ↗');button.type='button';button.onclick=async()=>{button.disabled=true;try{await openSource(id)}catch(_){status.textContent='تعذر فتح الرابط الخارجي.'}finally{button.disabled=false}};parent.append(button)}
 linkButton('globalvoices-home','فتح الأصوات العالمية',gv);linkButton('globalvoices-license','سياسة إعادة النشر والاستثناءات',gv);
 const aj=el('section');aj.className='qnews-source';aj.append(el('h3','الجزيرة — روابط فقط'));linkButton('aljazeera-home','فتح موقع الجزيرة',aj);linkButton('aljazeera-latest','آخر الأخبار على الجزيرة',aj);
 panel.append(header,intro,gv,aj,el('small','تُعرض العناوين كما وردت في المصدر مع اسم الكاتب عند توفره. لا تُعرض نصوص المقالات أو صورها. المواد الأصلية والاستثناءات تخضع لسياسة المصدر؛ قطرة غير تابع للمصادر ولا يمثلها.'));sheet.append(panel);document.body.append(sheet);
 entry.onclick=()=>{if(sheet.open)return;focusBefore=document.activeElement;try{sheet.showModal();back.focus();load()}catch(_){}};
 sheet.addEventListener('click',event=>{if(event.target===sheet)close()});sheet.addEventListener('cancel',event=>{event.preventDefault();close()});sheet.addEventListener('close',()=>{version++;dismissPreview()});sheet.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Escape'){event.preventDefault();close()}});
}
window.QatraNews=Object.freeze({close,isOpen:()=>!!sheet?.open});
const style=el('style');style.textContent=`
#openQatraNews .card-icon svg{width:28px;height:28px}#qatraNewsSheet{position:fixed;inset:0;margin:0;width:100%;height:100%;max-width:none;max-height:none;box-sizing:border-box;border:0;padding:16px;background:#0008;color:var(--text);font:inherit;backdrop-filter:blur(8px)}#qatraNewsSheet[open]{display:flex;align-items:center;justify-content:center}#qatraNewsSheet::backdrop{background:transparent}.qnews-panel{width:100%;max-width:560px;max-height:90dvh;overflow:auto;box-sizing:border-box;padding:22px;border-radius:28px;border:1px solid var(--border);background:var(--surface);box-shadow:0 24px 80px #0005}.qnews-panel header{display:flex;align-items:center;justify-content:space-between;gap:16px}.qnews-panel h2{font-size:23px;margin:0}.qnews-panel p{line-height:1.9}.qnews-note{padding:14px;border:1px solid var(--border);border-radius:16px;font-size:13px}.qnews-source{margin:18px 0;padding:18px;border:1px solid var(--border);border-radius:20px;background:var(--bg)}.qnews-source h3{margin:0}.qnews-source>button{display:block;width:100%;margin-top:10px;text-align:start}#qatraNewsSheet button{min-height:48px;padding:12px 16px;border:1px solid var(--border);border-radius:15px;background:var(--surface);color:var(--primary);font:inherit;touch-action:manipulation}#qatraNewsSheet small{display:block;line-height:1.9;font-size:12px;color:var(--text-dim)}#qatraNewsSheet :focus-visible{outline:2px solid var(--primary);outline-offset:3px}.qnews-story{padding:16px 0;border-bottom:1px solid var(--border)}.qnews-story h4{font-size:16px;line-height:1.9;margin:8px 0}.qnews-story p,.qnews-story time{font-size:12px;line-height:1.8}.qnews-story button{margin:10px 0 0 8px}.qnews-preview{position:fixed;inset:0;z-index:10;padding:20px;display:flex;align-items:center;justify-content:center;background:#000a;backdrop-filter:blur(8px)}.qnews-preview-card{width:min(440px,100%);box-sizing:border-box;max-height:85dvh;overflow:auto;padding:24px;border-radius:26px;background:var(--surface);border:1px solid var(--border);box-shadow:0 24px 80px #0006}.qnews-preview-card h3{font-size:20px;line-height:1.9}.qnews-preview-card button{display:block;width:100%;margin-top:10px}.qnews-falling-drop{width:60px;color:var(--primary);filter:drop-shadow(0 8px 22px #0005);animation:qnews-fall .9s cubic-bezier(.4,0,.8,1) both}.qnews-preview [hidden]{display:none!important}@keyframes qnews-fall{from{transform:translateY(-55vh) scale(.6);opacity:.2}to{transform:translateY(0) scale(1);opacity:1}}@media(prefers-reduced-motion:reduce){.qnews-falling-drop{animation:none}}
`;document.head.append(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
