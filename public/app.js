"use strict";

const STORE_KEY = "qatra_worldclass_v5";

const DICT = {
  ar: {
    app_title: "قطرة | QATRA", pull_to_switch: "اسحب لتبديل المظهر", moment_zen: "لحظة وعي", click_to_program: "اضغط لبرمجة قطرتك", 
    next_drop: "قطرتك القادمة", today_impact: "أثر اليوم", current_moment: "لحظتك الحالية", drop_settings: "إعدادات قطرتي", 
    display_method: "طريقة العرض وتفضيلاتك", mode_both: "تنبيه النظام + قطرة مائية (معاً)", mode_floating: "القطرة المائية فقط", 
    mode_notification: "تنبيه النظام فقط", dur_5: "مدة القطرة: 5 ثوانٍ", dur_10: "مدة القطرة: 10 ثوانٍ", dur_15: "مدة القطرة: 15 ثانية",
    smart_schedule: "البرمجة الذكية (توزيع تلقائي)", i_want: "أريد", drops_daily: "قطرات يومياً", from: "من", to: "إلى", apply_smart: "تطبيق البرمجة الذكية",
    manual_schedule: "الجدولة اليدوية", custom_schedule: "تحديد ساعة وأيام مخصصة:", save_schedule: "حفظ الموعد", 
    personal_library: "المكتبة الشخصية", library_desc: "احتفظ بالمعاني التي تلامس قلبك، ونظمها في مجموعاتك.", 
    discover_quotes: "اكتشف العبارات", my_favorites: "مفضلاتي", my_groups: "مجموعاتي", my_custom_quotes: "عباراتي الخاصة", 
    create_group: "إنشاء مجموعة جديدة", add: "إضافة", your_garden: "حديقتك", level_of_awareness: "مستوى الوعي العام",
    tree_serenity: "شجرة السكينة", tree_serenity_desc: "الأذكار والقرآن", tree_knowledge: "شجرة المعرفة", tree_knowledge_desc: "الثقافة العامة",
    tree_awareness: "شجرة الوعي", tree_awareness_desc: "تطوير الذات", tree_gratitude: "شجرة الامتنان", tree_gratitude_desc: "الشعر والمشاعر",
    sakeena: "سكينة", sakeena_desc: "اختر مساحتك للهدوء والاسترخاء.", nature_sounds: "أصوات الطبيعة", quran_recitation: "القرآن الكريم",
    short_sessions: "جلسات قصيرة", app_settings: "إعدادات التطبيق", glass_mode: "الشفافية وتأثير الزجاج 💎", show_image: "إظهار صورة مع العبارة 🖼️",
    show_home_cards: "إظهار بطاقات الرئيسية 📱", language: "لغة التطبيق:", save_done: "تم وحفظ", back: "رجوع", copied: "تم النسخ بنجاح", 
    delete: "حذف", days: "أيام", quotes_ready: "عبارة جاهزة", rain: "🌧️ المطر", sea: "🌊 البحر", forest: "🌲 الغابة"
  },
  en: {
    app_title: "Qatra | Drop", pull_to_switch: "Pull to switch theme", moment_zen: "Moment of Zen", click_to_program: "Tap to config", 
    next_drop: "Next Drop", today_impact: "Today's Impact", current_moment: "Current Moment", drop_settings: "My Drop Settings", 
    display_method: "Display Mode", mode_both: "Notification + Drop", mode_floating: "Drop Only", mode_notification: "Notification Only",
    dur_5: "Duration: 5 Secs", dur_10: "Duration: 10 Secs", dur_15: "Duration: 15 Secs", smart_schedule: "Smart Schedule", 
    i_want: "I want", drops_daily: "drops daily", from: "From", to: "To", apply_smart: "Apply Smart Schedule", manual_schedule: "Manual Schedule", 
    custom_schedule: "Custom time & days:", save_schedule: "Save Schedule", personal_library: "Personal Library", 
    library_desc: "Keep the meanings that touch your heart.", discover_quotes: "Discover Quotes", my_favorites: "My Favorites", 
    my_groups: "My Groups", my_custom_quotes: "My Custom Quotes", create_group: "Create New Group", add: "Add", your_garden: "Your Garden", 
    level_of_awareness: "Awareness Level", tree_serenity: "Serenity Tree", tree_serenity_desc: "Dhikr & Quran", tree_knowledge: "Knowledge Tree", 
    tree_knowledge_desc: "Culture", tree_awareness: "Awareness Tree", tree_awareness_desc: "Self Dev", tree_gratitude: "Gratitude Tree", 
    tree_gratitude_desc: "Poetry", sakeena: "Sakeena", sakeena_desc: "Choose your space to relax.", nature_sounds: "Nature Sounds", 
    quran_recitation: "Quran", short_sessions: "Short Sessions", app_settings: "App Settings", glass_mode: "Glass Effect 💎", 
    show_image: "Show image 🖼️", show_home_cards: "Show Home Cards 📱", language: "App Language:", save_done: "Done", back: "Back", 
    copied: "Copied!", delete: "Delete", days: "days", quotes_ready: "Quotes", rain: "🌧️ Rain", sea: "🌊 Sea", forest: "🌲 Forest"
  }
};

const generateArray = (base, count) => Array.from({length: count}, (_, i) => `${base} ${i+1}`);
const QUOTES_DB = {
  dhikr: { key: "cat_dhikr", icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", ...generateArray("دعاء رقم", 98)] },
  selfDev: { key: "cat_selfDev", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', items: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", ...generateArray("فكرة تطوير ذات رقم", 99)] },
  quran: { key: "cat_quran", icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', items: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", ...generateArray("آية رقم", 99)] },
  culture: { key: "cat_culture", icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>', items: ["الوقت كالسيف إن لم تقطعه قطعك.", ...generateArray("حكمة رقم", 99)] },
  poetry: { key: "tree_gratitude_desc", icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>', items: ["وَمَا نَيْلُ الْمَطَالِبِ بِالتَّمَنِّي ... وَلَكِنْ تُؤْخَذُ الدُّنْيَا غِلَابَا", "دقات قلب المرء قائلة له ... إن الحياة دقائق وثواني", ...generateArray("بيت شعر رقم", 98)] }
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  lang: 'ar', dark: true, glass: true, mode: 'both', duration: 10000, showImage: false, showHomeCards: true,
  schedules: [], groups: { 'favorites': [], 'myQuotes': [] }, stats: { drops: 0, dhikr: 0, culture: 0, selfDev: 0, poetry: 0, days: 1, lastDate: new Date().toDateString() }
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;
function getTranslation(key) { return (DICT[state.lang] && DICT[state.lang][key]) ? DICT[state.lang][key] : (DICT['en'][key] || key); }

function safeOn(id, eventType, handler) { const el = document.getElementById(id); if (el) el.addEventListener(eventType, handler); }

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  document.body.classList.toggle('dark-mode', state.dark);
  document.body.classList.toggle('glass-active', state.glass);
  document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
  document.documentElement.lang = state.lang;
  
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = getTranslation(el.getAttribute('data-i18n')); });
  
  const hc = document.getElementById('homeCardsContainer');
  if(hc) hc.style.display = state.showHomeCards ? 'block' : 'none';

  const c = (id, val) => { const el = document.getElementById(id); if(el) el.checked = val; };
  const s = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
  c('glassToggle', state.glass); c('imageToggle', state.showImage); c('homeCardsToggle', state.showHomeCards);
  s('langSelect', state.lang); s('notifModeSetting', state.mode); s('dropDurationSetting', state.duration);
  
  updateHomeCards(); renderGarden(); renderSchedules();
}

safeOn('langSelect', 'change', e => { state.lang = e.target.value; applyState(); syncNativeAlarms(); });
safeOn('imageToggle', 'change', e => { state.showImage = e.target.checked; applyState(); syncNativeAlarms(); });
safeOn('homeCardsToggle', 'change', e => { state.showHomeCards = e.target.checked; applyState(); });

// --- الرئيسية (تحديث البطاقات) ---
function updateHomeCards() {
  const now = new Date();
  let nextDrop = "لا توجد مواعيد";
  if (state.schedules.length > 0) {
    const next = state.schedules.map(s => {
      const [h,m] = s.time.split(':'); 
      const d = new Date(); d.setHours(h,m,0); 
      if(d < now) d.setDate(d.getDate()+1);
      return d;
    }).sort((a,b) => a-b)[0];
    const diffMins = Math.round((next - now)/60000);
    nextDrop = `بعد ${diffMins} دقيقة`;
  }
  const ndEl = document.getElementById('nextDropTimeText'); if(ndEl) ndEl.innerText = nextDrop;
  
  const tiEl = document.getElementById('todayImpactText'); if(tiEl) tiEl.innerText = `لقد تفاعلت مع ${state.stats.drops} قطرات اليوم`;
  const tipEl = document.getElementById('todayImpactProgress'); if(tipEl) tipEl.style.width = Math.min((state.stats.drops / 10)*100, 100) + '%';
  
  let momentMsg = "استمتع بلحظتك";
  const hour = now.getHours();
  if(hour >= 5 && hour < 12) momentMsg = "ابدأ يومك بنية طيبة";
  else if(hour >= 12 && hour < 18) momentMsg = "خطوة واحدة تكفي لتبدأ";
  else momentMsg = "توقف قليلًا، وتأمل ما أنجزته";
  const cmEl = document.getElementById('currentMomentText'); if(cmEl) cmEl.innerText = momentMsg;
}

// --- الأيام والمواعيد والبرمجة الذكية ---
const WEEK_DAYS = {ar: [{id:0,n:"أحد"},{id:1,n:"إثن"},{id:2,n:"ثلا"},{id:3,n:"أرب"},{id:4,n:"خمي"},{id:5,n:"جمع"},{id:6,n:"سبت"}]};
let currentSelectedDays = new Set([0,1,2,3,4,5,6]);
function renderDaysGrid() {
  const dg = document.getElementById('daysGrid');
  if(dg) dg.innerHTML = (WEEK_DAYS[state.lang] || WEEK_DAYS['ar']).map(d => `<div class="day-chip ${currentSelectedDays.has(d.id)?'active':''}" onclick="toggleDay(${d.id})">${d.n}</div>`).join('');
}
window.toggleDay = (id) => { currentSelectedDays.has(id) ? currentSelectedDays.delete(id) : currentSelectedDays.add(id); renderDaysGrid(); };

safeOn('applySmartScheduleBtn', 'click', () => {
  const count = parseInt(document.getElementById('smartDropsCount').value);
  const start = document.getElementById('smartTimeStart').value;
  const end = document.getElementById('smartTimeEnd').value;
  if(count > 0 && start && end) {
    const [sh, sm] = start.split(':').map(Number); const [eh, em] = end.split(':').map(Number);
    let startMins = sh*60 + sm; let endMins = eh*60 + em;
    if(endMins <= startMins) endMins += 24*60;
    const interval = (endMins - startMins) / count;
    state.schedules = [];
    for(let i=0; i<count; i++) {
      let tMins = startMins + Math.round(i*interval);
      let h = Math.floor((tMins%1440)/60).toString().padStart(2,'0');
      let m = (tMins%60).toString().padStart(2,'0');
      state.schedules.push({id: Math.floor(Math.random()*10000), time: `${h}:${m}`, days: [0,1,2,3,4,5,6]});
    }
    applyState(); syncNativeAlarms();
  }
});

function renderSchedules() {
  const list = document.getElementById('savedSchedulesList');
  if(list) list.innerHTML = state.schedules.map((s, i) => `<div class="modern-row" style="background:var(--bg); padding:18px; border-radius:18px; margin-bottom:12px; border:1px solid var(--border);"><strong style="font-size:18px;">${s.time}</strong> <button onclick="deleteSchedule(${i})" style="background:rgba(255,0,0,0.1); border:none; color:#ff4d4d; font-weight:bold; cursor:pointer; padding:8px 16px; border-radius:10px;">${getTranslation('delete')}</button></div>`).join('');
  updateHomeCards();
}
window.deleteSchedule = (i) => { if(QatraNative && state.schedules[i]) QatraNative.cancel({id: state.schedules[i].id}); state.schedules.splice(i,1); applyState(); syncNativeAlarms(); };

// --- الحديقة المتعددة ---
function getTreeStage(score) {
  const G = [{ m: 5, e: '🌱' }, { m: 20, e: '🌿' }, { m: 50, e: '🪴' }, { m: 100, e: '🌳' }, { m: 200, e: '🌸' }];
  for(let i=0; i<G.length; i++) if(score < G[i].m) return G[i].e; return '🌲';
}
function renderGarden() {
  const s = state.stats;
  const tEl = (id, e) => { const x = document.getElementById(id); if(x) x.innerText = e; };
  tEl('treeEmoji_dhikr', getTreeStage(s.dhikr)); tEl('treeEmoji_culture', getTreeStage(s.culture));
  tEl('treeEmoji_selfDev', getTreeStage(s.selfDev)); tEl('treeEmoji_poetry', getTreeStage(s.poetry));
  const tot = s.dhikr + s.culture + s.selfDev + s.poetry;
  const pEl = document.getElementById('totalAwarenessProgress'); if(pEl) pEl.style.width = Math.min((tot/500)*100, 100)+'%';
  tEl('totalDaysActiveText', `تفاعلت لمدة ${s.days} أيام`);
}

// --- المكتبة والمجموعات ---
window.showGroupsManager = () => { document.getElementById('groupsManagerArea').style.display = 'block'; renderGroupsList(); };
function renderGroupsList() {
  const list = document.getElementById('customGroupsList');
  if(!list) return;
  list.innerHTML = Object.keys(state.groups).filter(k=> k!=='favorites' && k!=='myQuotes').map(k => `
    <div class="action-card" style="padding:15px; border:1px solid var(--border); border-radius:16px; margin-bottom:10px;" onclick="openGroup('${k}')">
      <div class="card-info"><div class="card-title">${k}</div><div class="card-sub">${state.groups[k].length} عبارة</div></div>
      <button onclick="event.stopPropagation(); deleteGroup('${k}')" class="delete-btn">حذف</button>
    </div>
  `).join('');
}
safeOn('createGroupBtn', 'click', () => {
  const name = document.getElementById('newGroupNameInput').value.trim();
  if(name && !state.groups[name]) { state.groups[name] = []; document.getElementById('newGroupNameInput').value=''; applyState(); renderGroupsList(); }
});
window.deleteGroup = (k) => { delete state.groups[k]; applyState(); renderGroupsList(); };

window.openGroup = (k) => {
  const titleEl = document.getElementById('groupViewTitle'); if(titleEl) titleEl.innerText = k;
  const c = document.getElementById('groupViewContent');
  if(c) c.innerHTML = state.groups[k].map((q,i) => `<div class="my-quote-item"><div style="flex:1;">${q}</div><button onclick="removeQuoteFromGroup('${k}',${i})" class="delete-btn">حذف</button></div>`).join('');
  document.getElementById('groupViewSheet').classList.add('show');
};
window.removeQuoteFromGroup = (k, i) => { state.groups[k].splice(i,1); applyState(); openGroup(k); };

// --- القطرة السينمائية ---
function getRandomQuote() {
  const keys = Object.keys(QUOTES_DB);
  const catKey = keys[Math.floor(Math.random() * keys.length)];
  const quote = QUOTES_DB[catKey].items[Math.floor(Math.random() * QUOTES_DB[catKey].items.length)];
  return { quote, catKey };
}

window.fireCinematic = async () => {
  const { quote, catKey } = getRandomQuote();
  const qtEl = document.getElementById('dailyQuoteText'); if (qtEl) qtEl.textContent = `"${quote}"`;
  
  if (QatraNative) {
    state.stats.drops++; state.stats[catKey]++; applyState();
    await QatraNative.showDrop({ quote: quote, category: catKey, duration: state.duration, fullScreen: true, showImage: state.showImage }).catch(e=>{});
  }
};

function syncNativeAlarms() {
  if(!QatraNative) return;
  state.schedules.forEach(s => {
    const { quote, catKey } = getRandomQuote();
    QatraNative.schedule({id: s.id, time: s.time, days: s.days, mode: state.mode, duration: state.duration, quote: quote, category: catKey, fullScreen: true, showImage: state.showImage}).catch(e=>{});
  });
}

// --- التأمل ---
let randPlayer = new Audio();
window.playAudio = (type) => {
  randPlayer.pause();
  const aMap = { 'rain': 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg', 'sea': 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg', 'quran1': 'https://server8.mp3quran.net/afs/001.mp3' };
  if(aMap[type]) { randPlayer.src = aMap[type]; randPlayer.play(); }
};

document.addEventListener('DOMContentLoaded', () => {
  if (QatraNative) QatraNative.askPermissions().catch(e => console.log(e));
  
  document.querySelectorAll('.nav-item, .nav-home-btn, .header-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if(!btn.dataset.view) return;
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      document.querySelectorAll('.nav-item, .nav-home-btn').forEach(n => n.classList.remove('active'));
      const viewEl = document.getElementById(btn.dataset.view);
      if(viewEl) viewEl.classList.add('active');
      btn.classList.add('active');
    });
  });

  applyState(); renderDaysGrid();
  setTimeout(() => { const splash = document.getElementById('splash'); if (splash) { splash.style.opacity = '0'; setTimeout(() => splash.remove(), 800); } }, 2500);
});
