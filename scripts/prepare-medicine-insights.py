from pathlib import Path
root=Path(__file__).resolve().parents[1]
def patch(path,old,new):
 p=root/path;s=p.read_text(encoding='utf-8')
 if new in s:return
 if s.count(old)!=1:raise SystemExit('Unexpected insights anchor: '+str(path)+' '+old[:60])
 p.write_text(s.replace(old,new,1),encoding='utf-8')
patch('android/app/src/main/java/com/qatra/app/MainActivity.java','registerPlugin(QatraMedicineDeletionPlugin.class);','registerPlugin(QatraMedicineDeletionPlugin.class);\n        registerPlugin(QatraMedicineInsightsPlugin.class);')
patch('android/app/src/main/java/com/qatra/app/QatraMedicineDatabase.kt',') {\n    override fun onConfigure',') {\n    private val inventoryContext = context.applicationContext\n    override fun onConfigure')
p=root/'android/app/src/main/java/com/qatra/app/QatraMedicineDatabase.kt';s=p.read_text(encoding='utf-8')
if 'QatraMedicineStockAlerts.check(inventoryContext' not in s:
 a=s.index('    fun confirmTaken(');b=s.index('    fun listMedicines()',a);chunk=s[a:b]
 if chunk.count('return transaction { db ->')!=1 or chunk.count('\n        }\n    }\n\n')!=1:raise SystemExit('Unexpected dose transaction')
 chunk=chunk.replace('return transaction { db ->','val recorded = transaction { db ->',1)
 chunk=chunk.replace('\n        }\n    }\n\n','\n        }\n        if(recorded) runCatching { QatraMedicineStockAlerts.check(inventoryContext) }\n        return recorded\n    }\n\n',1)
 p.write_text(s[:a]+chunk+s[b:],encoding='utf-8')
p=root/'public/qatra-medicine-entry.js';s=p.read_text(encoding='utf-8')
anchor=" document.addEventListener('pointerdown',event=>{"
proxy=r'''
 const proxies=new Map();let scanFrame=0;
 function syncProxies(){scanFrame=0;
  for(const [select,button] of proxies){if(!select.isConnected){button.remove();proxies.delete(select);continue}const text=select.selectedOptions[0]?.textContent||'اختر الخيار';if(button.textContent!==text)button.textContent=text;button.disabled=select.disabled;button.setAttribute('aria-invalid',String(!select.validity.valid));}
  for(const select of document.querySelectorAll('select')){
   if(select.multiple||select.size>1||proxies.has(select))continue;
   const button=el('button');button.type='button';button.className='qc-select-trigger';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-label',select.getAttribute('aria-label')||[...(select.labels?.[0]?.childNodes||[])].find(n=>n.nodeType===3&&n.textContent.trim())?.textContent.trim()||'اختيار');
   select.before(button);select.classList.add('qc-native-select');select._qatraChoiceButton=button;proxies.set(select,button);
   button.onclick=event=>{event.preventDefault();event.stopPropagation();open(select)};select.addEventListener('change',scheduleScan);select.addEventListener('invalid',event=>{event.preventDefault();open(select)});scheduleScan();
  }
 }
 function scheduleScan(){if(!scanFrame)scanFrame=requestAnimationFrame(syncProxies)}
 new MutationObserver(scheduleScan).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['disabled','hidden','selected']});
 setInterval(()=>{if(!document.hidden)syncProxies()},1000);syncProxies();
'''
if 'const proxies=new Map()' not in s:
 if s.count(anchor)!=1:raise SystemExit('Unexpected choice controller')
 s=s.replace(anchor,proxy+'\n'+anchor,1)
 s=s.replace('!select.getClientRects().length','!(select._qatraChoiceButton||select).getClientRects().length')
 s=s.replace('if(select.isConnected)select.focus()','if(select.isConnected)(select._qatraChoiceButton||select).focus()')
 s=s.replace("if(event.key==='Escape'&&!panel.hidden)","if(event.key==='Escape'&&!panel.hidden&&!event.target.closest('dialog'))")
 edit=" form.addEventListener('qatra-medicine-edit',event=>{const m=event.detail;display.value=m.strength||'';volume.value='';if(![...unit.options].some(o=>o.value===m.unit)){const o=new Option(m.unit,m.unit);o.dataset.legacy='true';unit.add(o)}unit.value=m.unit;measures();sync()});\n"
 s=s.replace(" form.addEventListener('reset',()=>{cancel();reset();",edit+" form.addEventListener('reset',()=>{for(const o of unit.querySelectorAll('[data-legacy]'))o.remove();cancel();reset();",1)
 p.write_text(s,encoding='utf-8')
patch('public/qatra-medicine-management.js',"field('times').value=m.dailyTimes.join(', ');save.textContent", "field('times').value=m.dailyTimes.join(', ');form.dispatchEvent(new CustomEvent('qatra-medicine-edit',{detail:m}));save.textContent")
patch('public/qatra-medicine-schedule.js'," render();\n}\nconst style", " form.addEventListener('qatra-medicine-edit',event=>{const values=event.detail.dailyTimes||[];slots=Array(24).fill('');values.slice(0,24).forEach((value,index)=>slots[index]=value);selectedCount=Math.max(1,Math.min(24,values.length));count.value=String(selectedCount);message.textContent='';render()});\n render();\n}\nconst style")
p=root/'public/qatra-medicine-deletion.js';s=p.read_text(encoding='utf-8');extra=(root/'public/qatra-medicine-insights.js').read_text(encoding='utf-8')
if '/* qatra-medicine-insights-v1 */' not in s:p.write_text(s+'\n'+extra,encoding='utf-8')
