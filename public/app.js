"use strict";

const STORE_KEY = "qatra_pro_v8";

const CATEGORIES = [
  { id: "dhikr", title: "أذكار وأدعية", emoji: "🤲", items: ["سبحان الله وبحمده.", "لا إله إلا أنت سبحانك.", "حسبي الله لا إله إلا هو."] },
  { id: "motivate", title: "تحفيز وإيجابية", emoji: "💡", items: ["الهدوء ليس ضعفاً.", "كل يوم فرصة جديدة.", "استمر بالتقدم."] },
  { id: "quran", title: "آيات قرآنية", emoji: "📖", items: ["إِنَّ مَعَ الْعُسْرِ يُسْرًا", "فَاصْبِرْ صَبْرًا جَمِيلًا"] }
];

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  mode: 'both', duration: 10000, interval: '0', 
  selectedQuotes: ["سبحان الله وبحمده.", "الهدوء ليس ضعفاً."],
  schedules: [], stats: { drops: 0, notifs: 0, days: 1 }
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  document.getElementById('notifModeSetting').value = state.mode;
  document.getElementById('dropDurationSetting').value = state.duration;
  document.getElementById('intervalSelect').value = state.interval;
  
  document.getElementById('statDrops').innerText = state.stats.drops;
  document.getElementById('statNotifs').innerText = state.stats.notifs;
  document.getElementById('statDays').innerText = state.stats.days;
}

// --- التنقل ---
document.querySelectorAll('[data-view]').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('[data-view]').forEach(n => n.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
  };
});

// --- الأقسام والاقتباسات ---
function renderCategories() {
  document.getElementById('categoriesContainer').innerHTML = CATEGORIES.map(cat => 
    `<div class="category-card" onclick="openCategory('${cat.id}')">
      <div class="cat-emoji">${cat.emoji}</div>
      <div style="flex:1;"><div style="font-size:18px; font-weight:800;">${cat.title}</div><div style="font-size:12px; color:var(--muted);">${cat.items.length} عبارات</div></div>
    </div>`
  ).join('');
}

window.openCategory = (id) => {
  const cat = CATEGORIES.find(c => c.id === id);
  document.getElementById('catModalTitle').innerText = cat.title;
  document.getElementById('catModalContent').innerHTML = cat.items.map(q => {
    const checked = state.selectedQuotes.includes(q) ? "checked" : "";
    return `<div style="display:flex; align-items:flex-start; gap:12px; padding:15px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
      <input type="checkbox" style="width:22px; height:22px; accent-color:var(--cyan); margin-top:2px; flex-shrink:0;" value="${q}" ${checked} 
        onchange="if(this.checked) state.selectedQuotes.push(this.value); else state.selectedQuotes = state.selectedQuotes.filter(x=>x!==this.value); applyState();">
      <div style="font-size:15px;">${q}</div>
    </div>`;
  }).join('');
  document.getElementById('quotesCategoryModal').classList.add('show');
};

// --- القطرة السينمائية و الأندرويد ---
function getRandomQuote() {
  const pool = state.selectedQuotes.length > 0 ? state.selectedQuotes : CATEGORIES[0].items;
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

// --- المواعيد ---
document.getElementById('notifModeSetting').onchange = e => { state.mode = e.target.value; applyState(); syncAlarms(); };
document.getElementById('dropDurationSetting').onchange = e => { state.duration = parseInt(e.target.value); applyState(); syncAlarms(); };
document.getElementById('intervalSelect').onchange = e => { state.interval = e.target.value; applyState(); syncAlarms(); renderSchedules();};

function renderSchedules() {
  document.getElementById('savedSchedulesList').innerHTML = state.schedules.map((s, i) => 
    `<div class="glass-panel" style="padding:15px; display:flex; justify-content:space-between; margin-bottom:10px;">
      <strong>${s.time}</strong>
      <button onclick="deleteSchedule(${i})" style="background:none;border:none;color:#ff4d4d;font-weight:bold;">حذف</button>
    </div>`
  ).join('');
  
  const txt = document.getElementById('nextReminderText');
  if(state.interval !== '0') txt.innerText = `تكرار مفعل (كل ${state.interval} دقيقة)`;
  else if(state.schedules.length > 0) txt.innerText = `لديك ${state.schedules.length} مواعيد مبرمجة`;
  else txt.innerText = "لم تحدد مواعيد بعد";
}

document.getElementById('saveScheduleBtn').onclick = () => {
  const t = document.getElementById('customTime').value;
  if(t) { state.schedules.push({id: Math.floor(Math.random()*9999), time: t}); applyState(); renderSchedules(); syncAlarms(); }
};
window.deleteSchedule = (i) => { state.schedules.splice(i,1); applyState(); renderSchedules(); syncAlarms(); };

function syncAlarms() {
  if(!QatraNative) return;
  // جدولة الأوقات المحددة للعمل في بداية الدقيقة (حسب ما برمجناه في الكوتلين)
  state.schedules.forEach(s => QatraNative.schedule({id: s.id, time: s.time, mode: state.mode, duration: state.duration, quote: getRandomQuote()}));
}

// --- جلسات البومودورو و التأمل (أصوات عشوائية) ---
let isPomoRunning = false;
document.getElementById('startPomodoroBtn').onclick = () => {
  const mins = parseInt(document.getElementById('pomoTime').value);
  const audio = document.getElementById('pomoAudio').value;
  document.getElementById('pomodoroModal').classList.remove('show');
  
  if (QatraNative) {
    QatraNative.startPomodoro({ minutes: mins, audioUrl: audio });
    document.getElementById('mainTimeDisplay').textContent = `${mins}:00`;
    alert("بدأت الجلسة في الخلفية! سيظهر لك إشعار.");
  }
};

const randomAudios = ["https://actions.google.com/sounds/v1/water/rain_on_roof.ogg", "https://server8.mp3quran.net/afs/001.mp3"];
let randPlayer = new Audio(); let isRandPlaying = false;
document.getElementById('playRandomAudioBtn').onclick = () => {
  if (isRandPlaying) { randPlayer.pause(); isRandPlaying = false; document.getElementById('playRandomAudioBtn').textContent = "▶ تشغيل محتوى عشوائي"; document.getElementById('audioStatus').textContent = "متوقف"; }
  else {
    randPlayer.src = randomAudios[Math.floor(Math.random() * randomAudios.length)];
    randPlayer.play(); isRandPlaying = true; document.getElementById('playRandomAudioBtn').textContent = "⏸ إيقاف"; document.getElementById('audioStatus').textContent = "جارٍ الاسترخاء...";
  }
};

// --- البداية (الأذونات أولاً) ---
window.onload = () => {
  applyState(); renderCategories(); renderSchedules();
  document.getElementById('dailyQuoteText').textContent = `"${getRandomQuote()}"`;
  
  if (QatraNative) {
    QatraNative.askPermissions().then(() => {
      // إخفاء شاشة الإقلاع فقط بعد طلب الأذونات
      document.getElementById('splash').style.opacity = '0';
      setTimeout(()=> document.getElementById('splash').remove(), 800);
    });
  }
};
