(() => {
'use strict';
if(window.QatraNews)return;
const links={'aljazeera-home':'https://www.aljazeera.net/','aljazeera-latest':'https://www.aljazeera.net/latest'};
const el=(tag,text)=>{const node=document.createElement(tag);if(text)node.textContent=text;return node};
let sheet,focusBefore;
function close(){if(!sheet?.open)return;sheet.close();if(focusBefore?.isConnected)focusBefore.focus()}
function start(){
 const anchor=document.getElementById('openQatraMedicine');if(!anchor)return;
 const entry=el('button');entry.type='button';entry.id='openQatraNews';entry.className='glass-card action-card';entry.setAttribute('aria-haspopup','dialog');
 entry.innerHTML='<span class="card-icon"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 7h8M8 11h3m3 0h2M8 15h8M8 18h5"/></svg></span><span class="card-info"><span class="card-title">قطرة أخبار</span><span class="card-sub">مصادر خارجية · بوابة متابعة</span></span>';
 anchor.after(entry);
 sheet=el('dialog');sheet.id='qatraNewsSheet';sheet.dir='rtl';sheet.setAttribute('aria-labelledby','qatraNewsTitle');sheet.setAttribute('data-no-theme-pull','');
 const panel=el('section');panel.className='qnews-panel';const header=el('header'),title=el('h2','قطرة أخبار'),back=el('button','رجوع');title.id='qatraNewsTitle';back.type='button';back.onclick=close;header.append(title,back);
 const sub=el('p','مصادر خارجية');sub.className='qnews-sub';
 const intro=el('p','بوابة متابعة تفتح مواقع المصادر خارج قطرة. ليست خدمة أخبار عاجلة تلقائية، ولا تستورد الأخبار أو الصور إلى التطبيق.');intro.className='qnews-note';
 const source=el('article');source.className='qnews-source';source.append(el('h3','الجزيرة'),el('p','انتقل إلى المصدر للاطلاع على تغطيته الإخبارية.'));
 const status=el('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.className='qnews-status';
 let busy=false;
 for(const [id,label] of [['aljazeera-home','فتح موقع الجزيرة'],['aljazeera-latest','آخر الأخبار على الجزيرة']]){
  const button=el('button',label+' ↗');button.type='button';button.setAttribute('aria-label',label+' — يفتح خارج التطبيق');source.append(button);
  button.onclick=async()=>{
   if(busy)return;busy=true;button.disabled=true;status.textContent='';
   try{
    const cap=window.Capacitor,native=cap?.isNativePlatform?.()||cap?.getPlatform?.()==='android';
    if(native){const api=cap?.Plugins?.QatraNewsLinks||cap?.registerPlugin?.('QatraNewsLinks');if(!api)throw Error('bridge');const result=await api.openSource({source:id});if(result.opened!==true)throw Error('open')}
    else{const opened=window.open(links[id],'_blank');if(!opened)throw Error('blocked');opened.opener=null}
   }catch(_){status.textContent='تعذر فتح الرابط الخارجي. حاول مجددًا أو افتح موقع المصدر من متصفحك.'}
   finally{busy=false;button.disabled=false}
  };
 }
 const foot=el('small','الروابط تنقلك إلى خدمات مستقلة تخضع لشروطها وسياسات خصوصيتها. قطرة غير تابع للجزيرة ولا يمثّلها.');
 panel.append(header,sub,intro,source,status,foot);sheet.append(panel);document.body.append(sheet);
 entry.onclick=()=>{if(sheet.open)return;focusBefore=document.activeElement;status.textContent='';try{sheet.showModal();back.focus()}catch(_){status.textContent='تعذر فتح بوابة الأخبار.'}};
 sheet.addEventListener('click',event=>{if(event.target===sheet)close()});sheet.addEventListener('cancel',event=>{event.preventDefault();close()});sheet.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Escape'){event.preventDefault();close()}});
}
window.QatraNews=Object.freeze({close,isOpen:()=>!!sheet?.open});
const style=el('style');style.textContent=`
#openQatraNews .card-icon svg{width:28px;height:28px}#qatraNewsSheet{position:fixed;inset:0;margin:0;width:100%;height:100%;max-width:none;max-height:none;box-sizing:border-box;border:0;padding:16px;background:#0008;color:var(--text);font:inherit;backdrop-filter:blur(8px)}#qatraNewsSheet[open]{display:flex;align-items:center;justify-content:center}#qatraNewsSheet::backdrop{background:transparent}.qnews-panel{width:100%;max-width:540px;max-height:90dvh;overflow:auto;box-sizing:border-box;padding:22px;border-radius:28px;border:1px solid var(--border);background:var(--surface);box-shadow:0 24px 80px #0005}.qnews-panel header{display:flex;align-items:center;justify-content:space-between;gap:16px}.qnews-panel h2{font-size:23px;margin:0}.qnews-sub{color:var(--primary);font-size:14px}.qnews-panel p{line-height:1.9}.qnews-note{padding:14px;border:1px solid var(--border);border-radius:16px;font-size:13px}.qnews-source{margin:18px 0;padding:18px;border:1px solid var(--border);border-radius:20px;background:var(--bg)}.qnews-source h3{margin:0}.qnews-source button{display:block;width:100%;margin-top:10px;text-align:start}.qnews-panel button{min-height:48px;padding:12px 16px;border:1px solid var(--border);border-radius:15px;background:var(--surface);color:var(--primary);font:inherit;touch-action:manipulation}.qnews-panel small{display:block;line-height:1.9;font-size:12px;color:var(--text-dim)}.qnews-status:empty{display:none}.qnews-panel :focus-visible{outline:2px solid var(--primary);outline-offset:3px}
`;document.head.append(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
