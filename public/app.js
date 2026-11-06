"use strict";

const STORE_KEY = "qatra_premium_v13";

// 1. توليد مكتبة ضخمة (مئات العناصر)
const generateArray = (base, count) => Array.from({length: count}, (_, i) => `${base} ${i+1}`);
const QUOTES_DB = {
  dhikr: { titleAr: "أذكار وأدعية 🤲", titleEn: "Dhikr & Dua", icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني.", "يا حي يا قيوم برحمتك أستغيث.", "اللهم صل وسلم وبارك على نبينا محمد.", ...generateArray("دعاء مخصص للهدوء والسكينة رقم", 45)] },
  motivation: { titleAr: "تحفيز وإيجابية 💡", titleEn: "Motivation", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', items: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.", "تمهّل، فلكل مرحلة حكمتها.", "القليل المستمر يصنع أثرًا عميقًا.", "كل يوم فرصة جديدة.", ...generateArray("عبارة تحفيزية إيجابية لبداية يومك رقم", 45)] },
  quran: { titleAr: "آيات قرآنية 📖", titleEn: "Quran Verses", icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', items: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "إِنَّ مَعَ الْعُسْرِ يُسْرًا", "فَاصْبِرْ صَبْرًا جَمِيلًا", "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", ...generateArray("آية قرآنية عظيمة للتأمل رقم", 45)] }
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  lang: 'ar', mode: 'both', duration: 10000, interval: '0',
  selectedQuotes: ["سبحان الله وبحمده، سبحان الله العظيم.", "الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات."],
  schedules: [], stats: { drops: 0 }
};
const QatraNative = window.Capacitor?.Plugins?.QatraNative;

// --- اللغات ---
const dict = {
  ar: { app_title: "قطرة", focus_session: "لحظة وعي", quote_of_day: "اقتباس اليوم", upcoming: "مواعيدك", meditation: "تأمل", qatra_settings: "إعدادات القطرة", quotes: "المكتبة", garden: "حديقتك" },
  en: { app_title: "Qatra", focus_session: "Moment of Zen", quote_of_day: "Daily Quote", upcoming: "Upcoming", meditation: "Meditate", qatra_settings: "Drop Settings", quotes: "Library", garden: "Garden" }
};

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  const s = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
  s('langSelect', state.lang); s('notifModeSetting', state.mode); s('dropDurationSetting', state.duration); s('intervalSelect', state.interval);
  document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { if(dict[state.lang] && dict[state.lang][el.getAttribute('data-i18n')]) el.textContent = dict[state.lang][el.getAttribute('data-i18n')]; });
  renderCategories(); renderGarden();
}

// --- التنقل ---
document.getElementById('openSettingsSheet').onclick = () => document.getElementById('settingsSheet').classList.add('show');
document.getElementById('langSelect').onchange = e => { state.lang = e.target.value; applyState(); };

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view, .nav-item').forEach(el => el.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
  };
});

// --- السحب للتحديث الألوان (Pull to Refresh) ---
let startY = 0;
const scrollContent = document.getElementById('scrollContent');
const ptrContainer = document.getElementById('ptrContainer');
const colors = [
  {p: '#00F0FF', s: '#9D00FF'}, {p: '#FF00A0', s: '#00F0FF'}, {p: '#00FF66', s: '#0066FF'}, {p: '#FFD700', s: '#FF0055'}
];

scrollContent.addEventListener('touchstart', e => { if(scrollContent.scrollTop === 0) startY = e.touches[0].clientY; }, {passive:true});
scrollContent.addEventListener('touchmove', e => {
  if (startY > 0 && scrollContent.scrollTop === 0) {
    let y = e.touches[0].clientY - startY;
    if (y > 20 && y < 100) { ptrContainer.style.transform = `translateY(${y - 60}px)`; }
  }
}, {passive:true});
scrollContent.addEventListener('touchend', e => {
  if (startY > 0 && scrollContent.scrollTop === 0) {
    let y = e.changedTouches[0].clientY - startY;
    if (y > 60) {
      // تغيير الألوان بتدرج
      const randColor = colors[Math.floor(Math.random() * colors.length)];
      document.documentElement.style.setProperty('--primary', randColor.p);
      document.documentElement.style.setProperty('--secondary', randColor.s);
      
      // تحديث الأيقونات بـ CSS variable
      document.querySelectorAll('.card-icon-wrap, .action-icon').forEach(el => {
        el.style.color = randColor.p;
        el.style.background = `rgba(${hexToRgb(randColor.p)}, 0.1)`;
      });
      document.getElementById('grad-start').setAttribute('stop-color', randColor.p);
      document.getElementById('grad-end').setAttribute('stop-color', randColor.s);
      
      setTimeout(() => { ptrContainer.style.transform = `translateY(-100%)`; }, 800);
    } else {
      ptrContainer.style.transform = `translateY(-100%)`;
    }
  }
  startY = 0;
}, {passive:true});

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,240,255';
}

// --- حديقة الجوائز (Gamification) ---
const GARDEN_STAGES = [
  { max: 5, emoji: '🌱', nameAr: 'بذرة النوايا', nameEn: 'Seed of Intention', desc: 'كل قطرة تسقي بها روحك تنبت بذرة.' },
  { max: 20, emoji: '🌿', nameAr: 'برعم التغيير', nameEn: 'Sprout of Change', desc: 'بداية جميلة، استمر!' },
  { max: 50, emoji: '🪴', nameAr: 'نبتة الإصرار', nameEn: 'Plant of Persistence', desc: 'جذورك تزداد قوة.' },
  { max: 100, emoji: '🌳', nameAr: 'شجرة المعرفة', nameEn: 'Tree of Knowledge', desc: 'أصبحت تستظل بوعيك.' },
  { max: 200, emoji: '🌸', nameAr: 'شجرة مزدهرة', nameEn: 'Blooming Tree', desc: 'أثمرت جهودك نوراً.' },
  { max: 9999, emoji: '🌲', nameAr: 'غابة الحكمة (مرحلة جديدة)', nameEn: 'Forest of Wisdom', desc: 'أنت تزرع أرضاً من الوعي.' }
];

function renderGarden() {
  const drops = state.stats.drops;
  let stage = GARDEN_STAGES[0];
  let nextGoal = 5;
  for (let i = 0; i < GARDEN_STAGES.length; i++) {
    if (drops < GARDEN_STAGES[i].max) {
      stage = GARDEN_STAGES[i];
      nextGoal = GARDEN_STAGES[i].max;
      break;
    }
  }
  const prevMax = stage === GARDEN_STAGES[0] ? 0 : GARDEN_STAGES[GARDEN_STAGES.indexOf(stage)-1].max;
  const progress = ((drops - prevMax) / (nextGoal - prevMax)) * 100;
  
  document.getElementById('treeEmoji').innerText = stage.emoji;
  document.getElementById('treeLevelName').innerText = state.lang === 'ar' ? stage.nameAr : stage.nameEn;
  document.getElementById('treeDesc').innerText = stage.desc;
  document.getElementById('treeProgress').style.width = `${progress}%`;
  document.getElementById('treeStats').innerText = state.lang === 'ar' ? `القطرات: ${drops} / ${nextGoal}` : `Drops: ${drops} / ${nextGoal}`;
}

// --- الأقسام والاقتباسات ---
function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if(!container) return;
  container.innerHTML = Object.keys(QUOTES_DB).map(key => {
    const cat = QUOTES_DB[key];
    const title = state.lang === 'ar' ? cat.titleAr : cat.titleEn;
    return `<div class="bento-card bento-span-2" onclick="openCategory('${key}')" style="margin-bottom:12px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div class="card-icon-wrap" style="background:rgba(0,240,255,0.1); color:var(--cyan);"><svg viewBox="0 0 24 24">${cat.icon}</svg></div>
        <div style="color:var(--text-dim);">›</div>
      </div>
      <div class="card-title">${title}</div>
      <div class="card-value" style="font-size:13px; font-weight:600;">${cat.items.length} ${state.lang==='ar'?'عبارة':'items'}</div>
    </div>`;
  }).join('');
}

window.openCategory = (id) => {
  const cat = QUOTES_DB[id];
  document.getElementById('catSheetTitle').innerText = state.lang === 'ar' ? cat.titleAr : cat.titleEn;
  // إظهار 50 عنصر فقط كعينة لتجنب بطء الشاشة، يمكن للمستخدم تحديد الكل لاحقاً
  const displayItems = cat.items.slice(0, 50); 
  document.getElementById('catSheetContent').innerHTML = displayItems.map(q => {
    const checked = state.selectedQuotes.includes(q) ? "checked" : "";
    return `<div class="check-row">
      <input type="checkbox" value="${q}" ${checked} onchange="if(this.checked) state.selectedQuotes.push(this.value); else state.selectedQuotes = state.selectedQuotes.filter(x=>x!==this.value); applyState(); syncNativeAlarms();">
      <div style="font-size:15px; font-weight:600;">${q}</div>
    </div>`;
  }).join('');
  document.getElementById('categorySheet').classList.add('show');
};

// --- القطرة والمواعيد ---
function getRandomQuote() {
  const pool = state.selectedQuotes.length > 0 ? state.selectedQuotes : QUOTES_DB.dhikr.items;
  return pool[Math.floor(Math.random() * pool.length)];
}

async function fireCinematic() {
  const quote = getRandomQuote();
  document.getElementById('dailyQuoteText').textContent = `"${quote}"`;
  if (QatraNative) {
    state.stats.drops++; applyState();
    await QatraNative.showDrop({ quote: quote, duration: state.duration });
  }
}
document.getElementById('triggerCinematic').onclick = fireCinematic;
document.getElementById('previewFloatingBtn').onclick = fireCinematic;

document.getElementById('notifModeSetting').onchange = e => { state.mode = e.target.value; applyState(); syncNativeAlarms(); };
document.getElementById('dropDurationSetting').onchange = e => { state.duration = parseInt(e.target.value); applyState(); syncNativeAlarms(); };
document.getElementById('intervalSelect').onchange = e => { state.interval = e.target.value; applyState(); syncNativeAlarms(); renderSchedules(); };

function renderSchedules() {
  const list = document.getElementById('savedSchedulesList');
  if(!list) return;
  list.innerHTML = state.schedules.map((s, i) => 
    `<div class="modern-row" style="background:rgba(0,0,0,0.2); padding:15px; border-radius:16px; margin-bottom:10px;">
      <strong style="font-size:18px;">${s.time}</strong>
      <button onclick="deleteSchedule(${i})" style="background:none;border:none;color:#ff4d4d;font-weight:bold;cursor:pointer;">X</button>
    </div>`
  ).join('');
  
  const nextTxt = document.getElementById('nextReminderText');
  if(state.interval !== '0') nextTxt.innerText = state.lang === 'ar' ? `تكرار مفعل` : `Repeat On`;
  else if(state.schedules.length > 0) nextTxt.innerText = state.lang === 'ar' ? `لديك ${state.schedules.length} مواعيد` : `${state.schedules.length} Schedules`;
  else nextTxt.innerText = state.lang === 'ar' ? "لا يوجد مواعيد" : "No schedule";
}
document.getElementById('saveScheduleBtn').onclick = () => {
  const t = document.getElementById('customTime').value;
  if(t) { state.schedules.push({id: Math.floor(Math.random()*10000), time: t}); applyState(); renderSchedules(); syncNativeAlarms(); }
};
window.deleteSchedule = (i) => { state.schedules.splice(i,1); applyState(); renderSchedules(); syncNativeAlarms(); };

function syncNativeAlarms() {
  if(!QatraNative) return;
  QatraNative.scheduleInterval({ intervalMinutes: parseInt(state.interval), mode: state.mode, duration: state.duration, quote: getRandomQuote() }).catch(e=>console.log(e));
  state.schedules.forEach(s => QatraNative.schedule({id: s.id, time: s.time, mode: state.mode, duration: state.duration, quote: getRandomQuote()}).catch(e=>console.log(e)));
}

// --- التأمل ---
const randomAudios = ["https://actions.google.com/sounds/v1/water/rain_on_roof.ogg", "https://server8.mp3quran.net/afs/001.mp3"];
let randPlayer = new Audio(); let isRandPlaying = false;
document.getElementById('playRandomAudioBtn').onclick = () => {
  if (isRandPlaying) { randPlayer.pause(); isRandPlaying = false; document.getElementById('playRandomAudioBtn').textContent = state.lang==='ar'?"▶ تشغيل محتوى عشوائي":"▶ Play Ambient"; document.getElementById('audioStatus').textContent = state.lang==='ar'?"استعد للهدوء":"Ready"; }
  else {
    randPlayer.src = randomAudios[Math.floor(Math.random() * randomAudios.length)];
    randPlayer.play(); isRandPlaying = true; document.getElementById('playRandomAudioBtn').textContent = "⏸ إيقاف"; document.getElementById('audioStatus').textContent = state.lang==='ar'?"جارٍ الاسترخاء...":"Relaxing...";
  }
};

window.onload = () => {
  applyState(); renderSchedules();
  document.getElementById('dailyQuoteText').textContent = `"${getRandomQuote()}"`;
  
  // شاشة إقلاع مؤمنة تختفي تلقائياً وبسلاسة
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) { splash.style.opacity = '0'; setTimeout(()=> splash.remove(), 800); }
  }, 1500);

  // طلب الأذونات يعمل في الخلفية 
  if (QatraNative) {
    setTimeout(() => { QatraNative.askPermissions().catch(e => console.log(e)); }, 2000);
  }
};
