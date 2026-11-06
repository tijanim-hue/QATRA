"use strict";

const STORE_KEY = "qatra_premium_final_v3";

// توليد مكتبة ضخمة جداً (100 عنصر لكل قسم)
const generateArray = (base, count) => Array.from({length: count}, (_, i) => `${base} ${i+1}`);
const QUOTES_DB = {
  selfDev: { title: "تطوير الذات", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', items: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.", "القليل المستمر يصنع أثرًا عميقًا.", ...generateArray("فكرة وخطوة في تطوير الذات رقم", 97)] },
  dhikr: { title: "أذكار وأدعية", icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني.", "يا حي يا قيوم برحمتك أستغيث.", ...generateArray("دعاء مخصص للسكينة والتوكل رقم", 96)] },
  quran: { title: "آيات قرآنية", icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', items: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "إِنَّ مَعَ الْعُسْرِ يُسْرًا", "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", ...generateArray("آية قرآنية كريمة للتأمل رقم", 97)] },
  culture: { title: "ثقافة عامة وحكم", icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>', items: ["الوقت كالسيف إن لم تقطعه قطعك.", "العقل السليم في الجسم السليم.", ...generateArray("حكمة ومعلومة عامة رقم", 98)] }
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  dark: true, glass: true, mode: 'both', duration: 10000, interval: '0', 
  selectedQuotes: ["سبحان الله وبحمده، سبحان الله العظيم.", "الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات."],
  schedules: [], stats: { drops: 0 }
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

  renderCategories(); renderGarden();
}

// --- التنقل ---
document.getElementById('darkToggle').onchange = e => { state.dark = e.target.checked; applyState(); };
document.getElementById('glassToggle').onchange = e => { state.glass = e.target.checked; applyState(); };

document.querySelectorAll('.nav-item, .nav-home-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item, .nav-home-btn').forEach(n => n.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
  };
});

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
  
  document.getElementById('treeEmoji').innerText = stage.emoji;
  document.getElementById('treeLevelName').innerText = stage.name;
  document.getElementById('treeDesc').innerText = stage.desc;
  document.getElementById('treeProgress').style.width = `${progress}%`;
  document.getElementById('treeStats').innerText = `القطرات المقروءة: ${drops} / ${nextGoal}`;
}

// --- الأقسام والمكتبة ---
function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if(!container) return;
  container.innerHTML = Object.keys(QUOTES_DB).map(key => {
    const cat = QUOTES_DB[key];
    return `<div class="glass-card action-card" onclick="openCategory('${key}')">
      <div class="card-icon"><svg viewBox="0 0 24 24">${cat.icon}</svg></div>
      <div class="card-info">
        <div class="card-title">${cat.title}</div>
        <div class="card-sub">${cat.items.length} عبارة جاهزة</div>
      </div>
      <div style="color:var(--muted); font-size:24px;">›</div>
    </div>`;
  }).join('');
}

window.openCategory = (id) => {
  const cat = QUOTES_DB[id];
  document.getElementById('catSheetTitle').innerText = cat.title;
  // عرض 50 عنصر لتجنب تجميد الشاشة
  document.getElementById('catSheetContent').innerHTML = cat.items.slice(0, 50).map(q => {
    const checked = state.selectedQuotes.includes(q) ? "checked" : "";
    return `<div style="display:flex; align-items:flex-start; gap:12px; padding:15px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
      <input type="checkbox" style="width:22px; height:22px; accent-color:var(--cyan); margin-top:2px; flex-shrink:0;" value="${q}" ${checked} 
        onchange="if(this.checked) state.selectedQuotes.push(this.value); else state.selectedQuotes = state.selectedQuotes.filter(x=>x!==this.value); applyState(); syncNativeAlarms();">
      <div style="font-size:15px; font-weight:700;">${q}</div>
    </div>`;
  }).join('');
  document.getElementById('categorySheet').classList.add('show');
};

// --- القطرة والمواعيد ---
function getRandomQuote() {
  const pool = state.selectedQuotes.length > 0 ? state.selectedQuotes : QUOTES_DB.dhikr.items;
  return pool[Math.floor(Math.random() * pool.length)];
}

window.fireCinematic = async () => {
  const quote = getRandomQuote();
  document.getElementById('dailyQuoteText').textContent = `"${quote}"`;
  if (QatraNative) {
    state.stats.drops++; applyState();
    await QatraNative.showDrop({ quote: quote, duration: state.duration });
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
    `<div class="modern-row" style="background:rgba(0,0,0,0.2); padding:15px; border-radius:14px; margin-bottom:10px;">
      <strong style="font-size:18px;">${s.time} <span style="font-size:11px;color:var(--muted)">(${s.days.length} أيام)</span></strong>
      <button onclick="deleteSchedule(${i})" style="background:none;border:none;color:#ff4d4d;font-weight:bold;cursor:pointer;">حذف</button>
    </div>`
  ).join('');
  
  const txt = document.getElementById('nextReminderText');
  if(state.interval !== '0') txt.innerText = `تكرار مفعل (كل ${state.interval} دقيقة)`;
  else if(state.schedules.length > 0) txt.innerText = `لديك ${state.schedules.length} مواعيد مبرمجة`;
  else txt.innerText = "لم يتم تحديد مواعيد";
}

document.getElementById('saveScheduleBtn').onclick = () => {
  const t = document.getElementById('customTime').value;
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

// --- التأمل ---
const randomAudios = ["https://actions.google.com/sounds/v1/water/rain_on_roof.ogg", "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg", "https://server8.mp3quran.net/afs/001.mp3"];
let randPlayer = new Audio(); let isRandPlaying = false;
document.getElementById('playAudioBtn').onclick = () => {
  if (isRandPlaying) { randPlayer.pause(); isRandPlaying = false; document.getElementById('playAudioBtn').textContent = "▶ تشغيل الآن"; document.getElementById('audioStatus').textContent = "استعد للهدوء"; }
  else {
    randPlayer.src = randomAudios[Math.floor(Math.random() * randomAudios.length)];
    randPlayer.play(); isRandPlaying = true; document.getElementById('playAudioBtn').textContent = "⏸ إيقاف"; document.getElementById('audioStatus').textContent = "جارٍ الاسترخاء...";
  }
};

// --- الإقلاع الآمن وطلب الأذونات ---
window.onload = () => {
  applyState(); renderSchedules(); renderDaysGrid();
  document.getElementById('dailyQuoteText').textContent = `"${getRandomQuote()}"`;
  
  // 1. الإخفاء الإجباري لشاشة الإقلاع (مستقل تماماً عن الأذونات لتفادي التعليق)
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) { splash.style.opacity = '0'; setTimeout(()=> splash.remove(), 800); }
  }, 2500); // 2.5 ثانية لعرض شريط التحميل بوضوح

  // 2. طلب الأذونات يبدأ في الخلفية بهدوء ولا يعطل الواجهة
  if (QatraNative) {
    setTimeout(() => { QatraNative.askPermissions().catch(e => console.log(e)); }, 3500);
  }
};
