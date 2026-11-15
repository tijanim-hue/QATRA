from pathlib import Path

root = Path(__file__).resolve().parents[1]
public = root / 'public'
(public / 'navigation.js').write_text(r'''
(() => {
'use strict';
const $=id=>document.getElementById(id), mm=()=>window.QatraMindful;
const visible=el=>!!el&&el.isConnected&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';
let history=[],busy=false,scheduled=false;
function route(){return {view:document.querySelector('.view.active')?.id||'homeView',screen:$('mindfulSheet')?.dataset.mmOpen==='true'?(document.querySelector('#mindfulSheet .mm-screen.is-active')?.dataset.mmScreen||'menu'):null};}
const same=(a,b)=>a?.view===b?.view&&a?.screen===b?.screen;
function remember(){
 const next=route();if(same(history.at(-1),next))return;
 const found=history.findLastIndex(r=>same(r,next));
 if(found>=0)history=history.slice(0,found+1);else history.push(next);
 if(next.view==='homeView'&&!next.screen)history=[next];
}
function labels(){
 const back=$('mmBack');if(back){back.hidden=true;back.setAttribute('aria-hidden','true');}
 const close=$('closeMindfulSheet');if(close){const text=document.documentElement.lang==='ar'?'عودة':'Back';if(close.textContent!==text)close.textContent=text;close.setAttribute('aria-label',route().screen==='menu'?'العودة إلى التطبيق':'العودة إلى الرئيسية لدقيقة وعي');}
}
function layers(){
 const list=[...document.querySelectorAll('.sheet-overlay,.qh-backdrop,.qe-backdrop,[role="dialog"]')].filter(visible);
 return list.filter(el=>!list.some(parent=>parent!==el&&parent.contains(el))).sort((a,b)=>(Number(getComputedStyle(a).zIndex)||0)-(Number(getComputedStyle(b).zIndex)||0));
}
function dismiss(layer){
 if(layer.id==='mindfulSheet'){mm()?.close();return true;}
 if(layer.id==='settingsSheet'){closeSettings();return true;}
 const controls=[...layer.querySelectorAll('button')].filter(visible);
 const close=controls.find(b=>b.matches('.qh-close,.qn-close,.qe-later,[data-close]'))||controls.find(b=>/^(إغلاق|إلغاء|رجوع|عودة|Close|Cancel|Back)$/i.test(b.textContent.trim()));
 if(close){close.click();return true;}
 if(layer.matches('.sheet-overlay')){layer.classList.remove('show');if(visible(layer))layer.style.display='none';return true;}
 layer.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));return !visible(layer);
}
function go(target){
 document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id===target.view));
 document.querySelectorAll('.nav-item,.nav-home-btn').forEach(el=>el.classList.toggle('active',el.dataset.view===target.view));
 document.querySelector('.app-container')?.classList.toggle('q2-home',target.view==='homeView');
 if(target.screen){if(route().screen===null)mm()?.open();mm()?.show(target.screen);}else if(route().screen!==null)mm()?.close();
 window.QatraGlobalTheme?.sync();
}
async function back(){
 if(busy)return;busy=true;
 try{
  remember();const top=layers().at(-1),now=route();
  if(top&&top.id!=='mindfulSheet'){dismiss(top);return;}
  if(now.screen){
   if(now.screen==='menu'){mm()?.close();return;}
   const previous=history.at(-2);mm()?.show(previous?.screen&&previous.view===now.view?previous.screen:'menu');return;
  }
  if(now.view!=='homeView'){go(history.at(-2)||{view:'homeView',screen:null});return;}
  const cap=window.Capacitor;
  const native=cap?.Plugins?.QatraNavigation||(cap?.registerPlugin?cap.registerPlugin('QatraNavigation'):null);
  if(native)await native.confirmExit();
 }catch(error){console.error('Qatra navigation failed',error);}
 finally{remember();labels();setTimeout(()=>busy=false,180);}
}
let closingSettings=false;
async function closeSettings(){
 const sheet=$('settingsSheet'),panel=sheet?.querySelector('.sheet-content');if(!sheet||closingSettings)return;
 closingSettings=true;
 try{
  if(panel&&visible(sheet)&&!matchMedia('(prefers-reduced-motion:reduce)').matches&&panel.animate){
   const start=getComputedStyle(panel).transform;
   const animation=panel.animate([{transform:start==='none'?'translateY(0)':start},{transform:'translateY(100%)'}],{duration:210,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'});
   try{await animation.finished;}catch(error){}
   sheet.classList.remove('show');animation.cancel();
  }else sheet.classList.remove('show');
  if(panel)panel.style.removeProperty('transform');
 }finally{closingSettings=false;}
}
function installSettings(){
 const sheet=$('settingsSheet'),panel=sheet?.querySelector('.sheet-content'),handle=panel?.querySelector('.sheet-handle');if(!sheet||!panel||!handle)return;
 sheet.addEventListener('click',event=>{if(event.target===sheet)closeSettings();});
 handle.setAttribute('role','button');handle.tabIndex=0;handle.setAttribute('aria-label','اسحب لأسفل لإغلاق الإعدادات');
 handle.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();closeSettings();}});
 let drag=null;
 handle.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.button!==0)return;drag={id:event.pointerId,y:event.clientY,last:event.clientY,time:performance.now(),speed:0,offset:0};handle.setPointerCapture(event.pointerId);event.preventDefault();
 });
 handle.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;const now=performance.now();drag.speed=(event.clientY-drag.last)/Math.max(1,now-drag.time);drag.last=event.clientY;drag.time=now;drag.offset=Math.max(0,event.clientY-drag.y);panel.style.transform='translate3d(0,'+drag.offset+'px,0)';
 });
 function finish(event,cancelled=false){
  if(!drag||event.pointerId!==drag.id)return;const old=drag;drag=null;
  const flick=performance.now()-old.time<100&&old.speed>.65&&old.offset>24;
  if(!cancelled&&(old.offset>Math.min(120,panel.clientHeight*.25)||flick)){closeSettings();return;}
  if(panel.animate&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const animation=panel.animate([{transform:panel.style.transform||'translateY(0)'},{transform:'translateY(0)'}],{duration:230,easing:'cubic-bezier(.2,.8,.2,1)'});animation.finished.catch(()=>{});}
  panel.style.removeProperty('transform');
 }
 handle.addEventListener('pointerup',event=>finish(event));handle.addEventListener('pointercancel',event=>finish(event,true));handle.addEventListener('lostpointercapture',event=>finish(event,true));
}
function start(){
 const style=document.createElement('style');style.textContent='#mindfulSheet #mmBack{display:none!important}#settingsSheet .sheet-handle{touch-action:none;cursor:grab;width:64px;height:30px;background:transparent;position:relative;margin:0 auto 12px}#settingsSheet .sheet-handle::before{content:"";position:absolute;width:44px;height:4px;inset:12px 10px auto;background:var(--text-dim);opacity:.6;border-radius:99px}#settingsSheet .sheet-handle:active{cursor:grabbing}#settingsSheet .sheet-handle:focus-visible{outline:2px solid var(--primary);outline-offset:3px;border-radius:12px}';document.head.appendChild(style);
 installSettings();labels();remember();
 $('mindfulSheet')?.addEventListener('click',event=>{
  if(!event.target.closest('#closeMindfulSheet'))return;event.preventDefault();event.stopImmediatePropagation();
  if(route().screen==='menu')mm()?.close();else mm()?.show('menu');
  remember();labels();
 },true);
 new MutationObserver(records=>{
  if(!records.some(r=>r.type==='attributes'&&r.target.matches?.('.view,.mm-screen,#mindfulSheet')))return;
  if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;remember();labels();});
 }).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class','data-mm-open']});
}
window.QatraNavigation=Object.freeze({back});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
''', encoding='utf-8')

html=public/'index.html'
markup=html.read_text(encoding='utf-8')
if '</head>' not in markup:
    raise SystemExit('Missing document head.')
html.write_text(markup.replace('</head>','<script defer src="navigation.js"></script>\n</head>',1),encoding='utf-8')

java=root/'android/app/src/main/java/com/qatra/app'
activity=java/'MainActivity.java'
source=activity.read_text(encoding='utf-8')
anchor='super.onCreate(savedInstanceState);'
if source.count(anchor)!=1 or 'class MainActivity extends BridgeActivity' not in source:
    raise SystemExit('Unexpected activity structure; navigation patch not applied.')
source=source.replace(anchor,'registerPlugin(QatraNavigationPlugin.class);\n        '+anchor+r'''
        getOnBackPressedDispatcher().addCallback(this,new androidx.activity.OnBackPressedCallback(true){
            @Override public void handleOnBackPressed(){
                if(getBridge()==null||getBridge().getWebView()==null)return;
                getBridge().getWebView().evaluateJavascript("window.QatraNavigation ? (window.QatraNavigation.back(), true) : false",result->{if(!"true".equals(result))qatraConfirmExit();});
            }
        });
''',1)
position=source.rfind('}')
source=source[:position]+r'''
    private android.app.AlertDialog qatraExitDialog;
    public void qatraConfirmExit(){
        if(isFinishing()||isDestroyed()||(qatraExitDialog!=null&&qatraExitDialog.isShowing()))return;
        qatraExitDialog=new android.app.AlertDialog.Builder(this)
            .setTitle("هل تريد مغادرة قطرة؟")
            .setMessage("لحظة صغيرة قد تصنع فرقًا في يومك. يمكنك البقاء لاكتشاف قطرة جديدة، أو المغادرة والعودة حين يناسبك.")
            .setNegativeButton("البقاء",(dialog,which)->dialog.dismiss())
            .setPositiveButton("غادر",(dialog,which)->finish()).create();
        qatraExitDialog.setOnDismissListener(dialog->qatraExitDialog=null);
        qatraExitDialog.show();
        qatraExitDialog.getButton(android.content.DialogInterface.BUTTON_NEGATIVE).requestFocus();
    }
    @Override public void onDestroy(){
        if(qatraExitDialog!=null)qatraExitDialog.dismiss();
        super.onDestroy();
    }
'''+source[position:]
activity.write_text(source,encoding='utf-8')
(java/'QatraNavigationPlugin.java').write_text('''package com.qatra.app;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
@CapacitorPlugin(name="QatraNavigation")
public class QatraNavigationPlugin extends Plugin {
    @PluginMethod public void confirmExit(PluginCall call){
        getActivity().runOnUiThread(()->{
            ((MainActivity)getActivity()).qatraConfirmExit();
            call.resolve();
        });
    }
}
''',encoding='utf-8')
