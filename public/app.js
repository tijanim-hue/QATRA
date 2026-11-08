"use strict";

const STORE_KEY = "qatra_worldclass_v8";

// === قاموس الترجمة ===
const DICT = {
  ar: {
    app_title: "قطرة | QATRA", pull_to_switch: "اسحب لتبديل المظهر", moment_zen: "لحظة وعي", click_to_program: "اضغط لبرمجة قطرتك", 
    next_drop: "قطرتك القادمة", today_impact: "أثر اليوم", current_moment: "لحظتك الحالية", drop_settings: "إعدادات قطرتي", 
    display_method: "طريقة العرض وتفضيلاتك", mode_both: "تنبيه النظام + قطرة مائية (معاً)", mode_floating: "القطرة المائية فقط", 
    mode_notification: "تنبيه النظام فقط", dur_5: "مدة القطرة: 5 ثوانٍ", dur_10: "مدة القطرة: 10 ثوانٍ", dur_15: "مدة القطرة: 15 ثانية",
    smart_schedule: "البرمجة الذكية (توزيع تلقائي)", i_want: "أريد", drops_daily: "قطرات يومياً", from: "من", to: "إلى", apply_smart: "تطبيق البرمجة الذكية",
    manual_schedule: "الجدولة اليدوية (تكرار مستمر)", custom_schedule: "تحديد ساعة وأيام مخصصة:", save_schedule: "حفظ الموعد", 
    personal_library: "المكتبة الشخصية", library_desc: "احتفظ بالمعاني التي تلامس قلبك، ونظمها في مجموعاتك.", 
    discover_quotes: "اكتشف العبارات", my_favorites: "مفضلاتي", my_groups: "مجموعاتي", my_custom_quotes: "عباراتي الخاصة", 
    create_group: "إنشاء مجموعة جديدة", add: "إضافة", your_garden: "حديقتك", level_of_awareness: "مستوى الوعي العام",
    tree_serenity: "شجرة السكينة", tree_serenity_desc: "الأذكار والقرآن", tree_knowledge: "شجرة المعرفة", tree_knowledge_desc: "الثقافة العامة",
    tree_awareness: "شجرة الوعي", tree_awareness_desc: "تطوير الذات", tree_gratitude: "شجرة الامتنان", tree_gratitude_desc: "الشعر والمشاعر",
    sakeena: "سكينة", sakeena_desc: "اختر مساحتك للهدوء والاسترخاء.", nature_sounds: "أصوات الطبيعة", quran_recitation: "القرآن الكريم",
    short_sessions: "جلسات قصيرة", app_settings: "إعدادات التطبيق", glass_mode: "الشفافية والزجاج", show_image: "إظهار صورة العبارة",
    show_home_cards: "بطاقات الرئيسية", language: "لغة التطبيق:", save_done: "تم وحفظ", back: "رجوع", copied: "تم النسخ بنجاح", 
    delete: "حذف", days: "أيام", quotes_ready: "عبارة جاهزة", rain: "🌧️ المطر", sea: "🌊 البحر", forest: "🌲 الغابة", birds: "🕊️ الطيور",
    all_categories: "عشوائي (من كل الأقسام)", cat_dhikr: "أذكار وأدعية", cat_selfDev: "تطوير الذات", cat_quran: "آيات قرآنية", cat_culture: "ثقافة عامة وحكم", cat_poetry: "أبيات شعرية", my_library: "مجموعاتي الخاصة", stop_repeat: "إيقاف التكرار التلقائي", every_30: "كل 30 دقيقة", every_1h: "كل 1 ساعة", every_3h: "كل 3 ساعات", every_12h: "كل 12 ساعة", every_24h: "كل 24 ساعة", no_reminders: "لا توجد مواعيد", source_category: "1. مصدر العبارات",
    cat_awareness: "أسئلة وعي (جديد)", cat_family: "قطرات لأحبائي (عائلتي)", my_journal: "دفتر الأثر (تأملاتي)", family_drops: "قطرات لأحبائي",
    quote_of_day: "اقتباس اليوم", surprise_me: "فاجئني", tap_for_drop: "اضغط لقطرة عشوائية ملهمة"
  }
};
// اللغات الأخرى تعتمد على الانجليزية للتبسيط
DICT['en'] = DICT['ar']; 
const langs = ['fr','es','de']; langs.forEach(l => DICT[l] = DICT['en']); 

// === قاعدة البيانات المدمجة بالكامل ===
const QUOTES_DB = {
  awareness: { 
    key: "cat_awareness",
    icon: '<path d="M9 21h6v-1H9v1zm3-19C6.48 2 2 6.48 2 12c0 2.85 1.2 5.41 3.11 7.24.38.36.61.88.61 1.42V21c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-.34c0-.54.23-1.06.61-1.42C20.8 17.41 22 14.85 22 12c0-5.52-4.48-10-10-10zm2 14h-4v-2h4v2zm0-4h-4V7h4v5z"/>',
    items: [
      "ما الشيء الذي يستحق امتنانك اليوم؟", "ما الخطوة الصغيرة التي تستطيع القيام بها الآن؟", "هل هناك شخص يستحق منك كلمة طيبة اليوم؟", "ما الشيء الذي تعلمته من تجربة صعبة مررت بها؟", "ما الأمر الذي تستطيع التخلي عنه اليوم لتشعر براحة أكبر؟", "ما النعمة التي اعتدت وجودها ولم تعد تنتبه إليها؟", "ما القرار الصغير الذي قد يجعل يومك أفضل؟", "ما الفكرة التي تشغل ذهنك وتحتاج إلى إعادة النظر فيها؟"
    ]
  },
  dhikr: { 
    key: "cat_dhikr", 
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', 
    items: [
      "سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني.", "يا حي يا قيوم برحمتك أستغيث.", "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه.", "لا إله إلا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير.", "اللهم صل وسلم وبارك على نبينا محمد.", "حسبنا الله ونعم الوكيل.", "لا حول ولا قوة إلا بالله العلي العظيم.", "اللهم آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار."
    ] 
  },
  selfDev: { 
    key: "cat_selfDev", 
    icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', 
    items: [
      "الهدوء ليس ضعفا بل هو قوة التحكم في الذات.", "كل إنجاز عظيم بدأ بقرار بسيط للمحاولة.", "لا تقارن بدايتك بموسم حصاد الآخرين.", "النجاح يبدأ بخطوة واحدة والمسيرة تكتمل بالإصرار.", "العمل الجاد يتفوق على الموهبة حينما تتكاسل الموهبة عن العمل.", "لا تستسلم أبدا فالقادم أجمل بكثير مما مضى.", "أنت أقوى مما تتخيل وأكثر ذكاء مما تعتقد.", "كل يوم جديد هو فرصة جديدة لإعادة كتابة قصتك."
    ] 
  },
  quran: { 
    key: "cat_quran", 
    icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', 
    items: [
      "ومن يتوكل على الله فهو حسبه.", "إن مع العسر يسرا.", "لا تحزن إن الله معنا.", "والله يعصمك من الناس.", "وهو معكم أينما كنتم.", "فصبر جميل والله المستعان.", "إن الله وملائكته يصلون على النبي.", "وما توفيقي إلا بالله."
    ] 
  },
  culture: { 
    key: "cat_culture", 
    icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>', 
    items: [
      "الوقت كالسيف إن لم تقطعه قطعك.", "العقل السليم في الجسم السليم.", "من جد وجد ومن زرع حصد.", "الأرض تدور حول الشمس ومجرة درب التبانة هي موطننا.", "أقدم مدينة مأهولة في التاريخ هي مدينة أريحا في فلسطين."
    ] 
  },
  poetry: { 
    key: "cat_poetry", 
    icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>', 
    items: [
      "وما نيل المطالب بالتمني ولكن تؤخذ الدنيا غلابا.", "دقات قلب المرء قائلة له إن الحياة دقائق وثواني.", "تجري الرياح بما لا تشتهي السفن.", "إذا الشعب يوما أراد الحياة فلا بد أن يستجيب القدر."
    ] 
  }
};

const MORNING_ALERTS = [
  "صباح جديد وفرصة جديدة لبداية رائعة.", "استيقظ وابتسم فالحياة تخبئ لك الكثير من الجمال.", "دع شمس الصباح تشرق في قلبك قبل أن تشرق في السماء.", "كل صباح هو صفحة بيضاء فاكتب فيها أجمل الكلمات.", "ابدأ يومك بالامتنان والشكر على نعم الله التي لا تحصى.", "الأمل يتجدد مع كل إشراقة شمس.", "صباحك مليء بالبركة والتوفيق والنجاح.", "لا تدع الأمس يسرق من جمال اليوم."
];

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  lang: 'ar', dark: true, glass: true, mode: 'both', duration: 10000, interval: '0', showImage: false, showHomeCards: true,
  quoteSource: 'all', schedules: [], groups: { 'favorites': [], 'myQuotes': [] }, 
  journal: [], family: [],
  stats: { drops: 0, likes: 0, dhikr: 0, culture: 0, selfDev: 0, poetry: 0, days: 1, lastDate: new Date().toDateString() }
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;
function getTranslation(key) { return (DICT[state.lang] && DICT[state.lang][key]) ? DICT[state.lang][key] : (DICT['en'][key] || key); }
function safeOn(id, eventType, handler) { const el = document.getElementById(id); if (el) el.addEventListener(eventType, handler); }

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  document.body.classList.toggle('dark-mode', state.dark);
  document.body.classList.toggle('glass-active', state.glass);
  document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
  
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = getTranslation(el.getAttribute('data-i18n')); });
  
  const hc = document.getElementById('homeCardsContainer');
  if(hc) hc.style.display = state.showHomeCards ? 'block' : 'none';

  const c = (id, val) => { const el = document.getElementById(id); if(el) el.checked = val; };
  const s = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
  
  c('glassToggle', state.glass); c('imageToggle', state.showImage); c('homeCardsToggle', state.showHomeCards);
  s('langSelect', state.lang); s('notifModeSetting', state.mode); 
  s('dropDurationSetting', state.duration); 
  
  document.querySelectorAll('.custom-radio-item').forEach(item => {
    if(item.dataset.value === state.quoteSource) item.classList.add('active');
    else item.classList.remove('active');
  });

  const optVals = ['0','30','60','180','720','1440'];
  const optKeys = ['stop_repeat','every_30','every_1h','every_3h','every_12h','every_24h'];
  const intSel = document.getElementById('intervalSelect');
  if(intSel) {
      intSel.innerHTML = optVals.map((v,i) => `<option value="${v}">${getTranslation(optKeys[i])}</option>`).join('');
      intSel.value = state.interval;
  }

  updateHomeCards(); updateStatsChart(); renderGarden(); renderSchedules();
}

safeOn('langSelect', 'change', e => { state.lang = e.target.value; applyState(); syncNativeAlarms(); });
safeOn('imageToggle', 'change', e => { state.showImage = e.target.checked; applyState(); syncNativeAlarms(); });
safeOn('homeCardsToggle', 'change', e => { state.showHomeCards = e.target.checked; applyState(); });
safeOn('intervalSelect', 'change', e => { state.interval = e.target.value; applyState(); syncNativeAlarms(); });
window.setQuoteSource = (source) => { state.quoteSource = source; applyState(); syncNativeAlarms(); };

if (QatraNative) {
  QatraNative.addListener('quoteLiked', (info) => {
    state.stats.likes++;
    if (state.stats[info.category] !== undefined) state.stats[info.category]++;
    else if (info.category === 'quran') state.stats.dhikr++;
    else if (info.category === 'myGroups') state.stats.selfDev++;
    applyState();
  });
  
  QatraNative.addListener('openJournal', (info) => {
    openAnswerSheet(info.quote);
  });
}

function updateStatsChart() {
  const drops = state.stats.likes; 
  const days = state.stats.days;
  const maxD = Math.max(drops, 50);
  
  const c1 = document.getElementById('chartDropsCircle');
  if(c1) c1.style.strokeDashoffset = 100.5 - (100.5 * (drops/maxD));
  
  const c2 = document.getElementById('chartDaysCircle');
  if(c2) c2.style.strokeDashoffset = 100.5 - (100.5 * (Math.min(days,30)/30));
  
  const txt1 = document.getElementById('chartDropsVal'); if(txt1) txt1.innerText = drops;
  const txt2 = document.getElementById('chartDaysVal'); if(txt2) txt2.innerText = days;
}

function updateHomeCards() {
  const now = new Date();
  let nextDrop = getTranslation('no_reminders');
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
  
  let catText = state.quoteSource === 'all' ? getTranslation('all_categories') : (state.quoteSource === 'myGroups' ? getTranslation('my_library') : getTranslation('cat_'+state.quoteSource));
  const ncatEl = document.getElementById('nextDropCategoryText'); if(ncatEl) ncatEl.innerText = `الفئة: ${catText}`;
  
  const tiEl = document.getElementById('todayImpactText'); if(tiEl) tiEl.innerText = `لقد تفاعلت مع ${state.stats.likes} قطرات اليوم`;
  const tipEl = document.getElementById('todayImpactProgress'); if(tipEl) tipEl.style.width = Math.min((state.stats.likes / 10)*100, 100) + '%';
  
  const cmEl = document.getElementById('currentMomentText'); 
  if(cmEl) cmEl.innerText = MORNING_ALERTS[Math.floor(Math.random() * MORNING_ALERTS.length)];
}

const WEEK_DAYS = {
  ar: [{id:0,n:"أحد"},{id:1,n:"إثن"},{id:2,n:"ثلا"},{id:3,n:"أرب"},{id:4,n:"خمي"},{id:5,n:"جمع"},{id:6,n:"سبت"}]
};
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

safeOn('saveScheduleBtn', 'click', () => {
  const tEl = document.getElementById('customTime');
  if(!tEl) return;
  const t = tEl.value;
  if(t && currentSelectedDays.size > 0) {
    state.schedules.push({id: Math.floor(Math.random()*10000), time: t, days: Array.from(currentSelectedDays)});
    applyState(); renderSchedules(); syncNativeAlarms();
  } else { alert(getTranslation('choose_time')); }
});

function renderSchedules() {
  const list = document.getElementById('savedSchedulesList');
  if(list) list.innerHTML = state.schedules.map((s, i) => `<div class="modern-row" style="background:var(--bg); padding:18px; border-radius:18px; margin-bottom:12px; border:1px solid var(--border); display:flex; justify-content:space-between;"><strong style="font-size:18px;">${s.time}</strong> <button onclick="deleteSchedule(${i})" style="background:rgba(255,0,0,0.1); border:none; color:#ff4d4d; font-weight:bold; cursor:pointer; padding:8px 16px; border-radius:10px;">${getTranslation('delete')}</button></div>`).join('');
  updateHomeCards();
}
window.deleteSchedule = (i) => { if(QatraNative && state.schedules[i]) QatraNative.cancel({id: state.schedules[i].id}); state.schedules.splice(i,1); applyState(); syncNativeAlarms(); };

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

// === التصميم الجديد لاكتشف العبارات (اقتباسات تمريرية) ===
let discoverActiveCat = 'dhikr';
let currentDiscoverIndex = 0;

window.openDiscoverQuotes = () => {
    document.getElementById('discoverSheet').classList.add('show');
    renderDiscoverCategories();
    showDiscoverCard(0);
}

function renderDiscoverCategories() {
    const scrollDiv = document.getElementById('discoverCategoriesScroll');
    if (!scrollDiv) return;
    const cats = Object.keys(QUOTES_DB).filter(k => k !== 'awareness');
    scrollDiv.innerHTML = cats.map(k => `
        <button class="discover-cat-btn ${k === discoverActiveCat ? 'active' : ''}" onclick="changeDiscoverCat('${k}')">${getTranslation(QUOTES_DB[k].key)}</button>
    `).join('');
}

window.changeDiscoverCat = (cat) => {
    discoverActiveCat = cat;
    currentDiscoverIndex = 0;
    renderDiscoverCategories();
    showDiscoverCard(0);
}

function showDiscoverCard(direction) {
    const container = document.getElementById('discoverCardContainer');
    const items = QUOTES_DB[discoverActiveCat].items;
    
    if (items.length === 0) return;
    
    currentDiscoverIndex = (currentDiscoverIndex + direction + items.length) % items.length;
    const quote = items[currentDiscoverIndex];
    const safeQuote = quote.replace(/'/g, "\\'");

    const oldCard = container.querySelector('.discover-quote-card');
    if (oldCard) {
        oldCard.classList.add('hidden');
        setTimeout(() => oldCard.remove(), 500);
    }

    const newCard = document.createElement('div');
    newCard.className = 'discover-quote-card incoming';
    newCard.innerHTML = `
        <div class="discover-card-header">
            <button class="discover-icon-btn" onclick="copyQuote('${safeQuote}')" style="color:var(--primary);">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button class="discover-icon-btn" onclick="addToFavorites('${safeQuote}')" style="color:var(--secondary);">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
        </div>
        <div class="discover-quote-text" onclick="showDiscoverCard(1)">${quote}</div>
        <div class="discover-quote-mark">”</div>
    `;
    
    container.appendChild(newCard);
    setTimeout(() => { newCard.classList.remove('incoming'); }, 50);
}

// === اقتباس اليوم المنبثق ===
window.openQuoteOfTheDay = () => {
    const { quote } = getRandomQuote();
    document.getElementById('qotdModalText').innerText = quote;
    
    // زر الإعجاب في النافذة يضيف العبارة للمفضلة ويتفاعل
    const likeBtn = document.getElementById('qotdLikeBtn');
    likeBtn.style.color = '#fff'; 
    likeBtn.style.background = 'rgba(255,255,255,0.2)';
    likeBtn.onclick = () => {
        addToFavorites(quote);
        likeBtn.style.color = '#FF3B30';
        likeBtn.style.background = 'rgba(255,59,48,0.2)';
    };

    document.getElementById('qotdModal').classList.add('show');
}
window.closeQotdModal = () => { document.getElementById('qotdModal').classList.remove('show'); }
window.copyQotd = () => {
    const quote = document.getElementById('qotdModalText').innerText;
    copyQuote(quote);
    closeQotdModal();
}

window.copyQuote = (txt) => {
  navigator.clipboard.writeText(txt).then(() => {
    const toast = document.getElementById('copyToast');
    if(toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2000); }
  });
};

window.addToFavorites = (txt) => {
  if(!state.groups['favorites'].includes(txt)) {
    state.groups['favorites'].push(txt); applyState(); alert('تمت الإضافة للمفضلة');
  }
}

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

let currentOpenGroup = "";
window.openGroup = (k) => {
  currentOpenGroup = k;
  const titleEl = document.getElementById('groupViewTitle'); if(titleEl) titleEl.innerText = (k==='favorites'?'مفضلاتي':(k==='myQuotes'?'عباراتي الخاصة':k));
  const addDiv = document.getElementById('addToGroupDiv'); if(addDiv) addDiv.style.display = (k==='favorites' ? 'none' : 'flex');
  const c = document.getElementById('groupViewContent');
  if(c) {
    c.innerHTML = state.groups[k].map((q,i) => `
      <div class="my-quote-item">
        <div style="flex:1;">${q}</div>
        <div style="display:flex; gap:8px;">
          <button onclick="shareQuotePrompt('${q.replace(/'/g, "\\'")}')" style="background:transparent; border:none; color:#F59E0B; cursor:pointer;">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </button>
          <button onclick="removeQuoteFromGroup('${k}',${i})" class="delete-btn">حذف</button>
        </div>
      </div>`).join('');
  }
  document.getElementById('groupViewSheet').classList.add('show');
};
window.removeQuoteFromGroup = (k, i) => { state.groups[k].splice(i,1); applyState(); openGroup(k); };
window.addQuoteToCurrentGroup = () => {
  const input = document.getElementById('newGroupQuoteInput');
  if(input && input.value.trim() !== "") {
    state.groups[currentOpenGroup].push(input.value.trim());
    input.value = ""; applyState(); openGroup(currentOpenGroup);
  }
}

// --- دفتر الأثر (Journal) والأسئلة ---
window.openJournalSheet = () => {
    document.getElementById('journalSheet').classList.add('show');
    renderJournal();
}

function renderJournal() {
    const content = document.getElementById('journalContent');
    if (!content) return;
    if (state.journal.length === 0) {
        content.innerHTML = `<p style="text-align:center; color:var(--text-dim); margin-top:40px;">لا توجد تأملات مسجلة بعد.</p>`;
        return;
    }
    content.innerHTML = state.journal.map((j, i) => `
        <div class="journal-item">
            <div style="font-size:12px; color:var(--primary); margin-bottom:5px;">${j.date}</div>
            <div style="font-size:15px; font-weight:800; margin-bottom:8px;">${j.question}</div>
            <div style="font-size:14px; color:var(--text-dim); margin-bottom:10px;">"${j.answer}"</div>
            <button onclick="deleteJournal(${i})" class="delete-btn" style="font-size:11px; padding:5px 10px;">حذف</button>
        </div>
    `).join('');
}

window.deleteJournal = (i) => {
    state.journal.splice(i, 1);
    applyState();
    renderJournal();
}

window.openAnswerSheet = (questionText) => {
    document.getElementById('activeQuestionText').innerText = questionText;
    document.getElementById('answerInput').value = "";
    document.getElementById('answerSheet').classList.add('show');
}

window.saveReflection = () => {
    const q = document.getElementById('activeQuestionText').innerText;
    const a = document.getElementById('answerInput').value.trim();
    if (a !== "") {
        state.journal.unshift({ question: q, answer: a, date: new Date().toLocaleDateString('ar-EG') });
        applyState();
        document.getElementById('answerSheet').classList.remove('show');
        alert("تم حفظ تأملك بنجاح في دفتر الأثر.");
    }
}

// --- قطرات لأحبائي (Family Drops) ---
window.openFamilySheet = () => {
    document.getElementById('familySheet').classList.add('show');
    renderFamily();
}

function renderFamily() {
    const content = document.getElementById('familyContent');
    if (!content) return;
    content.innerHTML = state.family.map((f, i) => `
        <div class="my-quote-item">
            <div style="flex:1;">
                <div style="font-size:15px; font-weight:800;">${f.name}</div>
                <div style="font-size:12px; color:var(--text-dim);">${f.relation}</div>
            </div>
            <button onclick="shareQuotePrompt('إلى ${f.name} العزيز...\\nأسأل الله أن يجعل يومك مليئاً بالخير.\\n\\nتفضل هذه القطرة:', true)" class="btn-solid" style="margin:0; width:auto; padding:8px 15px; background:linear-gradient(135deg, #F43F5E, #FB923C);">أرسل 💧</button>
            <button onclick="deleteFamily(${i})" class="delete-btn" style="margin-right:10px;">حذف</button>
        </div>
    `).join('');
}

window.addFamilyMember = () => {
    const name = document.getElementById('newFamilyName').value.trim();
    const rel = document.getElementById('newFamilyRel').value;
    if (name !== "") {
        state.family.push({ name: name, relation: rel });
        document.getElementById('newFamilyName').value = "";
        applyState(); renderFamily();
    }
}
window.deleteFamily = (i) => { state.family.splice(i, 1); applyState(); renderFamily(); }

// --- المشاركة وتوليد الصور (Native Android Share) ---
let currentShareText = "";
window.shareQuotePrompt = (text, isFamily = false) => {
    currentShareText = text;
    document.getElementById('shareQuoteText').innerText = isFamily ? text : `"${text}"`;
    document.getElementById('shareSheet').classList.add('show');
}

window.shareAsText = () => {
    const shareData = { title: 'قطرة | QATRA', text: currentShareText + "\n\n💧 تطبيق قطرة" };
    if (navigator.share) {
        navigator.share(shareData).catch(e => console.log('Share error:', e));
    } else {
        copyQuote(currentShareText);
    }
    document.getElementById('shareSheet').classList.remove('show');
}

window.shareAsImage = async () => {
    const canvas = document.getElementById('shareCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1080; canvas.height = 1920;
    
    const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grd.addColorStop(0, "#0EA5E9"); grd.addColorStop(1, "#8B5CF6");
    ctx.fillStyle = grd; ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "rgba(11, 17, 33, 0.85)"; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.direction = "rtl";
    ctx.font = "bold 60px Cairo"; ctx.fillText("💧 قـطـرة", canvas.width / 2, 300);
    
    ctx.font = "bold 80px Cairo";
    const words = currentShareText.split(' ');
    let line = ''; let y = canvas.height / 2 - 100;
    const maxWidth = 900; const lineHeight = 120;

    for(let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' '; y += lineHeight;
      } else { line = testLine; }
    }
    ctx.fillText(line, canvas.width / 2, y);

    ctx.font = "normal 40px Cairo"; ctx.fillStyle = "#94A3B8";
    ctx.fillText("قطرة صغيرة، أثر كبير.", canvas.width / 2, canvas.height - 200);

    canvas.toBlob(async (blob) => {
        try {
            const file = new File([blob], 'qatra_drop.png', { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'قطرة | QATRA',
                    text: 'تأمل هذه القطرة 💧',
                    files: [file]
                });
            } else { alert("مشاركة الصور غير مدعومة في متصفحك الحالي."); }
        } catch (e) { console.log('Share failed', e); }
        document.getElementById('shareSheet').classList.remove('show');
    }, 'image/png');
}

// --- القطرة السينمائية ودمج المصادر ---
function getRandomQuote() {
  let pool = [];
  let categoryKey = state.quoteSource;
  
  if (state.quoteSource === 'all') {
    const keys = Object.keys(QUOTES_DB).filter(k => k !== 'awareness');
    categoryKey = keys[Math.floor(Math.random() * keys.length)];
    pool = QUOTES_DB[categoryKey].items;
  } else if (state.quoteSource === 'myGroups') {
    Object.keys(state.groups).forEach(k => { pool = pool.concat(state.groups[k]); });
    if(pool.length === 0) pool = ["أضف عبارات في مجموعاتك لتظهر هنا."];
    categoryKey = "myGroups";
  } else if (state.quoteSource === 'family') {
      pool = ["اضغط لترسل قطرة لأحبائك"];
  } else {
    pool = QUOTES_DB[state.quoteSource].items;
  }
  const quote = pool[Math.floor(Math.random() * pool.length)];
  return { quote, categoryKey };
}

window.fireCinematic = async () => {
  // عند النقر على الدائرة الفاخرة، القطرة ستكون عشوائية تماماً من أي قسم
  const keys = Object.keys(QUOTES_DB);
  const randomCategoryKey = keys[Math.floor(Math.random() * keys.length)];
  const pool = QUOTES_DB[randomCategoryKey].items;
  const randomQuote = pool[Math.floor(Math.random() * pool.length)];
  
  const qtEl = document.getElementById('dailyQuoteText'); if (qtEl) qtEl.textContent = `"${randomQuote}"`;
  
  if (randomCategoryKey === 'cat_awareness' && !QatraNative) {
      openAnswerSheet(randomQuote);
      return;
  }

  if (QatraNative) {
    state.stats.drops++; applyState();
    await QatraNative.showDrop({ quote: randomQuote, category: randomCategoryKey, duration: state.duration, fullScreen: true, showImage: state.showImage }).catch(e=>{});
  }
};

function syncNativeAlarms() {
  if(!QatraNative) return;
  QatraNative.scheduleInterval({ intervalMinutes: parseInt(state.interval), mode: state.mode, duration: state.duration, quote: getRandomQuote().quote, category: state.quoteSource, fullScreen: true, showImage: state.showImage }).catch(e=>{});
  
  state.schedules.forEach(s => {
    const rQuote = getRandomQuote();
    QatraNative.schedule({id: s.id, time: s.time, days: s.days, mode: state.mode, duration: state.duration, quote: rQuote.quote, category: rQuote.categoryKey, fullScreen: true, showImage: state.showImage}).catch(e=>{});
  });
}

// --- التأمل (المشغل العائم المتطور) ---
let randPlayer = new Audio();
let audioUpdateInterval;

window.playAudio = (type, title) => {
  randPlayer.pause();
  const aMap = { 
    'rain': 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg', 
    'sea': 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg', 
    'forest': 'https://actions.google.com/sounds/v1/water/stream_flowing_slowly.ogg',
    'birds': 'https://actions.google.com/sounds/v1/animals/birds_singing.ogg',
    'quran1': 'https://server8.mp3quran.net/afs/001.mp3',
    'quran2': 'https://server8.mp3quran.net/afs/018.mp3',
    'quran3': 'https://server8.mp3quran.net/afs/067.mp3'
  };
  if(aMap[type]) { 
      randPlayer.src = aMap[type]; 
      randPlayer.play();
      document.getElementById('audioTitleText').innerText = title || "جاري التشغيل";
      document.getElementById('globalAudioPlayer').classList.add('show');
      document.getElementById('audioPlayPauseBtn').innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      
      clearInterval(audioUpdateInterval);
      audioUpdateInterval = setInterval(() => {
          if (randPlayer.duration) {
              const p = (randPlayer.currentTime / randPlayer.duration) * 100;
              document.getElementById('audioProgressFill').style.width = `${p}%`;
          }
      }, 500);
  }
};

window.togglePlayPause = () => {
    if (randPlayer.paused) {
        randPlayer.play();
        document.getElementById('audioPlayPauseBtn').innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    } else {
        randPlayer.pause();
        document.getElementById('audioPlayPauseBtn').innerHTML = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
    }
}

window.closeAudioPlayer = () => {
    randPlayer.pause();
    clearInterval(audioUpdateInterval);
    document.getElementById('globalAudioPlayer').classList.remove('show');
}

window.startSession = (mins) => {
  alert(`بدأت جلسة ${mins} دقائق. يرجى الاسترخاء وإغلاق عينيك.`);
  setTimeout(() => alert("انتهت الجلسة بنجاح."), mins * 60000);
}

document.addEventListener('DOMContentLoaded', () => {
  
  if (QatraNative) { QatraNative.askPermissions().catch(e => console.log(e)); }
  
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

  let startY = 0;
  const scrollContent = document.getElementById('scrollContent');
  const ptrContainer = document.getElementById('ptrContainer');
  const ptrIcon = document.getElementById('ptrIcon');

  if(scrollContent && ptrContainer && ptrIcon) {
    scrollContent.addEventListener('touchstart', e => { if(scrollContent.scrollTop === 0) startY = e.touches[0].clientY; }, {passive:true});
    scrollContent.addEventListener('touchmove', e => {
      if (startY > 0 && scrollContent.scrollTop === 0) {
        let y = e.touches[0].clientY - startY;
        if (y > 20 && y < 100) { ptrContainer.style.transform = `translateY(${y - 70}px)`; ptrIcon.style.transform = `rotate(${y*4}deg)`; }
      }
    }, {passive:true});
    scrollContent.addEventListener('touchend', e => {
      if (startY > 0 && scrollContent.scrollTop === 0) {
        let y = e.changedTouches[0].clientY - startY;
        if (y > 70) {
          ptrIcon.classList.add('spin');
          state.dark = !state.dark;
          applyState();
          setTimeout(() => { ptrContainer.style.transform = `translateY(-100%)`; ptrIcon.classList.remove('spin'); }, 600);
        } else {
          ptrContainer.style.transform = `translateY(-100%)`;
        }
      }
      startY = 0;
    }, {passive:true});
  }

  applyState(); renderDaysGrid();
  
  // توليد اقتباس عشوائي خفي للزر
  const { quote } = getRandomQuote();
  const qtEl = document.getElementById('dailyQuoteTextPreview');
  if(qtEl) qtEl.textContent = `"${quote.substring(0, 30)}..."`;

  setTimeout(() => { const splash = document.getElementById('splash'); if (splash) { splash.style.opacity = '0'; setTimeout(() => splash.remove(), 800); } }, 2500);
});
