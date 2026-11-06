"use strict";

const STORE_KEY = "qatra_pro_v8";

const generateArray = (base, count) => Array.from({length: count}, (_, i) => `${base} ${i+1}`);
const QUOTES_DB = {
  dhikr: { title: "أذكار وأدعية", icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني.", "يا حي يا قيوم برحمتك أستغيث.", ...generateArray("دعاء للسكينة", 50)] },
  motivation: { title: "تحفيز وإيجابية", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', items: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.", "القليل المستمر يصنع أثرًا عميقًا.", ...generateArray("عبارة تحفيزية", 50)] },
  quran: { title: "آيات قرآنية", icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', items: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "إِنَّ مَعَ الْعُسْرِ يُسْرًا", "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", ...generateArray("آية كريمة", 50)] }
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  dark: true, glass: true, mode: 'both', duration: 10000, interval: '0', 
  selectedQuotes: ["سبحان الله وبحمده، سبحان الله العظيم.", "الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات."],
  schedules: [], stats: { drops: 0, notifs: 0, days: 1 }
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  document.body.classList.toggle('light-mode', !state.dark);
  document.body.classList.toggle('glass-active', state.glass);
  
  document.getElementById('darkToggle').checked = state.dark;
  document.getElementById('glassToggle').checked = state.glass;
  document.getElementById('notifModeSetting').value = state.mode;
  document.getElementById('dropDurationSetting').value = state.duration;
  document.getElementById('intervalSelect').value = state.interval;

  document.getElementById('statDrops').innerText = state.stats.drops;
  document.getElementById('statNotifs').innerText = state.stats.notifs;
  document.getElementById('statDays').innerText = state.stats.days;
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

// --- السحب للتحديث (Pull to Refresh) ---
let startY = 0;
const scrollContent = document.getElementById('scrollContent');
const ptrContainer = document.getElementById('ptrContainer');
const ptrIcon = document.getElementById('ptrIcon');
const COLORS = [
  {p: '#00d2ff', s: '#9b51e0'}, {p: '#FF00A0', s: '#00F0FF'}, 
  {p: '#00FF66', s: '#0066FF'}, {p: '#FFD700', s: '#FF0055'}
];

scrollContent.addEventListener('touchstart', e => { if(scrollContent.scrollTop === 0) startY = e.touches[0].clientY; }, {passive:true});
scrollContent.addEventListener('touchmove', e => {
  if (startY > 0 && scrollContent.scrollTop === 0) {
    let y = e.touches[0].clientY - startY;
    if (y > 20 && y < 100) { ptrContainer.style.transform = `translateY(${y - 60}px)`; ptrIcon.style.transform = `rotate(${y*3}deg)`; }
  }
}, {passive:true});
scrollContent.addEventListener('touchend', e => {
  if (startY > 0 && scrollContent.scrollTop === 0) {
    let y = e.changedTouches[0].clientY - startY;
    if (y > 70) {
      ptrIcon.classList.add('spin');
      // تغيير ألوان المتغيرات ليتجاوب التصميم بأكمله
      const randColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      document.documentElement.style.setProperty('--cyan', randColor.p);
      document.documentElement.style.setProperty('--purple', randColor.s);
      
      document.getElementById('grad-start').setAttribute('stop-color', randColor.p);
      document.getElementById('grad-end').setAttribute('stop-color', randColor.s);
      
      const ambient = document.getElementById('ambientBg');
      ambient.style.backgroundImage = `radial-gradient(circle at 10% 30%, ${randColor.p} 0%, transparent 45%), radial-gradient(circle at 90% 70%, ${randColor.s} 0%, transparent 45%)`;
      
      const mainBtn = document.getElementById('mainHomeBtn');
      mainBtn.style.background = `linear-gradient(135deg, ${randColor.p}, ${randColor.s})`;
      mainBtn.style.boxShadow = `0 10px 25px ${randColor.p}80`;

      setTimeout(() => { ptrContainer.style.transform = `translateY(-100%)`; ptrIcon.classList.remove('spin'); }, 800);
    } else {
      ptrContainer.style.transform = `translateY(-100%)`;
    }
  }
  startY = 0;
}, {passive:true});

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
  document.getElementById('categoriesContainer').innerHTML = Object.keys(QUOTES_DB).map(key => {
    const cat = QUOTES_DB[key];
    return `<div class="glass-panel h-card" onclick="openCategory('${key}')">
      <div class="h-icon" style="background:rgba(0,210,255,0.1); color:var(--cyan);"><svg viewBox="0 0 24 24">${cat.icon}</svg></div>
      <div style="flex:1;">
        <div style="font-weight:800; font-size:18px;">${cat.title}</div>
        <div style="font-size:12px; color:var(--muted);">${cat.items.length} عبارة</div>
      </div>
      <div style="color:var(--muted); font-size:24px;">›</div>
    </div>`;
  }).join('');
}
window.openCategory = (id) => {
  const cat = QUOTES_DB[id];
  document.getElementById('catSheetTitle').innerText = cat.title;
  document.getElementById('catSheetContent').innerHTML = cat.items.slice(0,50).map(q => {
    const checked = state.selectedQuotes.includes(q) ? "checked" : "";
    return `<div style="display:flex; align-items:flex-start; gap:12px; padding:15px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
      <input type="checkbox" style="width:22px; height:22px; accent-color:var(--cyan); margin-top:2px; flex-shrink:0;" value="${q}" ${checked} 
        onchange="if(this.checked) state.selectedQuotes.push(this.value); else state.selectedQuotes = state.selectedQuotes.filter(x=>x!==this.value); applyState();">
      <div style="font-size:15px;">${q}</div>
    </div>`;
  }).join('');
  document.getElementById('categorySheet').classList.add('show');
};

// --- إعدادات القطرة ---
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

document.getElementById('notifModeSetting').onchange = e => { state.mode = e.target.value; applyState(); };
document.getElementById('dropDurationSetting').onchange = e => { state.duration = parseInt(e.target.value); applyState(); };
document.getElementById('intervalSelect').onchange = e => { state.interval = e.target.value; applyState(); renderSchedules(); };

function renderSchedules() {
  document.getElementById('savedSchedulesList').innerHTML = state.schedules.map((s, i) => 
    `<div class="control-row" style="background:rgba(0,0,0,0.2); padding:15px; border-radius:14px; margin-bottom:10px;">
      <strong style="font-size:18px;">${s.time}</strong>
      <button onclick="deleteSchedule(${i})" style="background:none;border:none;color:#ff4d4d;font-weight:bold;">حذف</button>
    </div>`
  ).join('');
  
  const txt = document.getElementById('nextReminderText');
  if(state.interval !== '0') txt.innerText = `تكرار مفعل`;
  else if(state.schedules.length > 0) txt.innerText = `لديك ${state.schedules.length} مواعيد مبرمجة`;
  else txt.innerText = "لم يتم تحديد مواعيد";
}
document.getElementById('saveScheduleBtn').onclick = () => {
  const t = document.getElementById('customTime').value;
  if(t) { state.schedules.push({id: Math.floor(Math.random()*10000), time: t}); applyState(); renderSchedules(); }
};
window.deleteSchedule = (i) => { state.schedules.splice(i,1); applyState(); renderSchedules(); };

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

window.onload = () => {
  applyState(); renderSchedules();
  document.getElementById('dailyQuoteText').textContent = `"${getRandomQuote()}"`;
  // طلب الأذونات فوراً (لا يوجد تعليق في هذه النسخة لأن الإقلاع منفصل)
  if (QatraNative) QatraNative.askPermissions();
  
  // إخفاء الشاشة بسلاسة
  setTimeout(() => {
    document.getElementById('splash').style.opacity = '0';
    setTimeout(()=> document.getElementById('splash').remove(), 600);
  }, 1000);
};
