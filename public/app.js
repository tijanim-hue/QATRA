"use strict";

const STORE_KEY = "qatra_worldclass_v1";

// توليد مكتبة ضخمة جداً (100 عنصر لكل قسم)
const generateArray = (base, count) => Array.from({length: count}, (_, i) => `${base} ${i+1}`);
const QUOTES_DB = {
  selfDev: { title: "تطوير الذات", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', items: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.", "القليل المستمر يصنع أثرًا عميقًا.", ...generateArray("فكرة وخطوة في تطوير الذات رقم", 97)] },
  dhikr: { title: "أذكار وأدعية", icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني.", "يا حي يا قيوم برحمتك أستغيث.", ...generateArray("دعاء مخصص للسكينة والتوكل رقم", 96)] },
  quran: { title: "آيات قرآنية", icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', items: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "إِنَّ مَعَ الْعُسْرِ يُسْرًا", "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", ...generateArray("آية قرآنية كريمة للتأمل رقم", 97)] },
  culture: { title: "ثقافة عامة وحكم", icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>', items: ["الوقت كالسيف إن لم تقطعه قطعك.", "العقل السليم في الجسم السليم.", ...generateArray("حكمة ومعلومة عامة رقم", 98)] }
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  dark: true, glass: true, mode: 'both', duration: 10000, interval: '0', 
  selectedQuotes: ["سبحان الله وبحمده، سبحان الله العظيم.", "الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات."],
  schedules: [], stats: { drops: 0, notifs: 0, days: 1 }
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  if (state.dark) { document.body.classList.add('dark-mode'); } 
  else { document.body.classList.remove('dark-mode'); }
  document.body.classList.toggle('glass-active', state.glass);
  
  const c = (id, val) => { const el = document.getElementById(id); if(el) el.checked = val; };
  const s = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
  
  c('darkToggle', state.dark); c('glassToggle', state.glass);
  s('notifModeSetting', state.mode); s('dropDurationSetting', state.duration); s('intervalSelect', state.interval);

  const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
  setTxt('statDrops', state.stats.drops);
  setTxt('statNotifs', state.stats.notifs);
  setTxt('statDays', state.stats.days);

  renderCategories(); renderGarden();
}

// --- التنقل ---
document.getElementById('darkToggle').onchange = e => { state.dark = e.target.checked; applyState(); };
document.getElementById('glassToggle').onchange = e => { state.glass = e.target.checked; applyState(); };

document.querySelectorAll('.nav-item, .nav-home-btn').forEach(btn => {
  btn.onclick = () => {
    // تجاهل زر الإحصائيات لأنه يفتح نافذة ولا يغير الصفحة
    if(btn.dataset.view === 'statsSheet') return;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item, .nav-home-btn').forEach(n => n.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
  };
});

// --- السحب للتحديث (تبديل الوضع الداكن والمضيء) ---
let startY = 0;
const scrollContent = document.getElementById('scrollContent');
const ptrContainer = document.getElementById('ptrContainer');
const ptrIcon = document.getElementById('ptrIcon');

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
      // تبديل الوضع الداكن بدلاً من تغيير الألوان
      state.dark = !state.dark;
      applyState();
      setTimeout(() => { ptrContainer.style.transform = `translateY(-100%)`; ptrIcon.classList.remove('spin'); }, 600);
    } else {
      ptrContainer.style.transform = `translateY(-100%)`;
    }
  }
  startY = 0;
}, {passive:true});

// --- الأيام والمواعيد المخصصة ---
const WEEK_DAYS = [{ id: 0, name: "أحد" }, { id: 1, name: "إثن" }, { id: 2, name: "ثلا" }, { id: 3, name: "أرب" }, { id: 4, name: "خمي" }, { id: 5, name: "جمع" }, { id: 6, name: "سبت" }];
let currentSelectedDays = new Set([0,1,2,3,4,5,6]);

function renderDaysGrid() {
  document.getElementById('daysGrid').innerHTML = WEEK_DAYS.map(d => 
    `<div class="day-chip ${currentSelectedDays.has(d.id)?'active':''}" onclick="toggleDay(${d.id})">${d.name}</div>`
  ).join('');
}
window.toggleDay = (id) => { currentSelectedDays.has(id) ? currentSelectedDays.delete(id) : currentSelectedDays.add(id); renderDaysGrid(); };

// --- الحديقة (الجوائز) ---
const GARDEN = [
  { max: 5, emoji: '🌱', name: 'بذرة النوايا', desc: 'كل قطرة تسقي بها روحك تنبت بذرة.' },
  { max: 20, emoji: '🌿', name: 'برعم التغيير', desc: 'بداية جميلة، استمر!' },
  { max: 50, emoji: '🪴', name: 'نبتة الإصرار', desc: 'جذورك تزداد قوة.' },
  { max: 100, emoji: '🌳', name: 'شجرة المعرفة', desc: 'أصبحت تستظل بوعيك.' },
  { max: 200, emoji: '🌸', name: 'شجرة مزدهرة', desc: 'أثمرت جهودك نوراً.' },
  { max: 9999, emoji: '🌲', name: 'غابة الحكمة', desc: 'أنت تزرع أرضاً من الوعي.' }
];

function renderGarden() {
  const drops = state.stats.drops;
  let stage = GARDEN[0]; let nextGoal = 5;
  for (let i = 0; i < GARDEN.length; i++) {
    if (drops < GARDEN[i].max) { stage = GARDEN[i]; nextGoal = GARDEN[i].max; break; }
  }
  const prevMax = stage === GARDEN[0] ? 0 : GARDEN[GARDEN.indexOf(stage)-1].max;
  const progress = ((drops - prevMax) / (nextGoal - prevMax)) * 100;
  
  const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
  setTxt('treeEmoji', stage.emoji);
  setTxt('treeLevelName', stage.name);
  setTxt('treeDesc', stage.desc);
  setTxt('treeStats', `القطرات المقروءة: ${drops} / ${nextGoal}`);
  
  const progEl = document.getElementById('treeProgress');
  if(progEl) progEl.style.width = `${progress}%`;
}

// --- الأقسام والمكتبة (اقتباسات) ---
function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if(!container) return;
  container.innerHTML = Object.keys(QUOTES_DB).map(key => {
    const cat = QUOTES_DB[key];
    return `<div class="glass-card action-card" onclick="openCategory('${key}')">
      <div class="card-icon"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${cat.icon}</svg></div>
      <div class="card-info">
        <div class="card-title">${cat.title}</div>
        <div class="card-sub">${cat.items.length} عبارة جاهزة</div>
      </div>
      <div style="color:var(--border); font-size:26px; font-weight:bold;">›</div>
    </div>`;
  }).join('');
}

window.openCategory = (id) => {
  const cat = QUOTES_DB[id];
  document.getElementById('catSheetTitle').innerText = cat.title;
  // عرض 50 عنصر لتجنب تجميد الشاشة
  document.getElementById('catSheetContent').innerHTML = cat.items.slice(0, 50).map(q => {
    const checked = state.selectedQuotes.includes(q) ? "checked" : "";
    return `<div style="display:flex; align-items:flex-start; gap:14px; padding:18px 0; border-bottom:1px solid var(--border);">
      <input type="checkbox" style="width:24px; height:24px; accent-color:var(--primary); margin-top:2px; flex-shrink:0;" value="${q}" ${checked} 
        onchange="if(this.checked) state.selectedQuotes.push(this.value); else state.selectedQuotes = state.selectedQuotes.filter(x=>x!==this.value); applyState(); syncNativeAlarms();">
      <div style="font-size:15px; font-weight:700;">${q}</div>
    </div>`;
  }).join('');
  document.getElementById('categorySheet').classList.add('show');
};

// --- القطرة والمواعيد (نفس المحرك الناجح) ---
function getRandomQuote() {
  const pool = state.selectedQuotes.length > 0 ? state.selectedQuotes : QUOTES_DB.dhikr.items;
  return pool[Math.floor(Math.random() * pool.length)];
}

window.fireCinematic = async () => {
  const quote = getRandomQuote();
  const qtEl = document.getElementById('dailyQuoteText');
  if (qtEl) qtEl.textContent = `"${quote}"`;
  
  if (QatraNative) {
    state.stats.drops++; applyState();
    await QatraNative.showDrop({ quote: quote, duration: state.duration }).catch(e=>{});
  }
};
document.getElementById('previewFloatingBtn').onclick = fireCinematic;

document.getElementById('notifModeSetting').onchange = e => { state.mode = e.target.value; applyState(); syncNativeAlarms(); };
document.getElementById('dropDurationSetting').onchange = e => { state.duration = parseInt(e.target.value); applyState(); syncNativeAlarms(); };
document.getElementById('intervalSelect').onchange = e => { state.interval = e.target.value; applyState(); syncNativeAlarms(); renderSchedules(); };

function renderSchedules() {
  const list = document.getElementById('savedSchedulesList');
  if(!list) return;
  list.innerHTML = state.schedules.map((s, i) => 
    `<div class="modern-row" style="background:var(--bg); padding:18px; border-radius:18px; margin-bottom:12px; border:1px solid var(--border);">
      <strong style="font-size:18px;">${s.time} <span style="font-size:11px;color:var(--text-dim); margin-right:8px;">(${s.days.length} أيام)</span></strong>
      <button onclick="deleteSchedule(${i})" style="background:rgba(255,0,0,0.1); border:none; color:#ff4d4d; font-weight:bold; cursor:pointer; padding:8px 16px; border-radius:10px;">حذف</button>
    </div>`
  ).join('');
  
  const txt = document.getElementById('nextReminderText');
  if(txt) {
    if(state.interval !== '0') txt.innerText = `تكرار مفعل (كل ${state.interval} دقيقة)`;
    else if(state.schedules.length > 0) txt.innerText = `لديك ${state.schedules.length} مواعيد مبرمجة`;
    else txt.innerText = "لم يتم تحديد مواعيد";
  }
}

document.getElementById('saveScheduleBtn').onclick = () => {
  const tEl = document.getElementById('customTime');
  if(!tEl) return;
  const t = tEl.value;
  if(t && currentSelectedDays.size > 0) { 
    state.schedules.push({id: Math.floor(Math.random()*10000), time: t, days: Array.from(currentSelectedDays)}); 
    applyState(); renderSchedules(); syncNativeAlarms();
  } else {
    alert("الرجاء اختيار الوقت ويوم واحد على الأقل.");
  }
};
window.deleteSchedule = (i) => { 
  if(QatraNative && state.schedules[i]) QatraNative.cancel({id: state.schedules[i].id}).catch(e=>{});
  state.schedules.splice(i,1); applyState(); renderSchedules(); syncNativeAlarms(); 
};

function syncNativeAlarms() {
  if(!QatraNative) return;
  QatraNative.scheduleInterval({ intervalMinutes: parseInt(state.interval), mode: state.mode, duration: state.duration, quote: getRandomQuote() }).catch(e=>{});
  state.schedules.forEach(s => QatraNative.schedule({id: s.id, time: s.time, days: s.days, mode: state.mode, duration: state.duration, quote: getRandomQuote()}).catch(e=>{}));
}

// --- التأمل والاستماع ---
const randomAudios = ["https://actions.google.com/sounds/v1/water/rain_on_roof.ogg", "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg", "https://server8.mp3quran.net/afs/001.mp3"];
let randPlayer = new Audio(); let isRandPlaying = false;
document.getElementById('playAudioBtn').onclick = () => {
  const btn = document.getElementById('playAudioBtn');
  const status = document.getElementById('audioStatus');
  if (isRandPlaying) { 
    randPlayer.pause(); isRandPlaying = false; 
    if(btn) btn.textContent = "▶ تشغيل الآن"; 
    if(status) status.textContent = "استعد للهدوء"; 
  } else {
    randPlayer.src = randomAudios[Math.floor(Math.random() * randomAudios.length)];
    randPlayer.play(); isRandPlaying = true; 
    if(btn) btn.textContent = "⏸ إيقاف"; 
    if(status) status.textContent = "جارٍ الاسترخاء...";
  }
};

// --- الإقلاع الآمن جداً وطلب الأذونات ---
window.onload = () => {
  applyState(); renderSchedules(); renderDaysGrid();
  const qtEl = document.getElementById('dailyQuoteText');
  if(qtEl) qtEl.textContent = `"${getRandomQuote()}"`;
  
  // شاشة إقلاع آمنة لا تتوقف أبداً (مستقلة عن الأذونات)
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) { 
      splash.style.opacity = '0'; 
      setTimeout(() => splash.remove(), 800); 
    }
  }, 2500); // إظهار الشاشة لـ 2.5 ثانية لعرض شريط التحميل واسمك بوضوح

  // طلب الأذونات يعمل في الخلفية بهدوء
  if (QatraNative) {
    setTimeout(() => { 
      QatraNative.askPermissions().catch(e => console.log(e)); 
    }, 3500);
  }
};
