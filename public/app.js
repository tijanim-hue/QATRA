"use strict";

const STORE_KEY = "qatra_pro_v5";
const QUOTES_DB = [
  "الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "سبحان الله وبحمده، سبحان الله العظيم.",
  "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "تمهّل، فلكل مرحلة حكمتها.",
  "اللهم إنك عفو تحب العفو فاعف عني.", "القليل المستمر يصنع أثرًا عميقًا."
];

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  dark: true, glass: false, mode: 'both', duration: 10000, interval: '0', 
  selectedQuotes: [...QUOTES_DB], stats: { drops: 10, notifs: 12, days: 3 }
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
}

// --- التنقل ---
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
  };
});

// --- الإعدادات ---
document.getElementById('darkToggle').onchange = e => { state.dark = e.target.checked; applyState(); };
document.getElementById('glassToggle').onchange = e => { state.glass = e.target.checked; applyState(); };
document.getElementById('notifModeSetting').onchange = e => { state.mode = e.target.value; applyState(); };
document.getElementById('dropDurationSetting').onchange = e => { state.duration = parseInt(e.target.value); applyState(); };
document.getElementById('intervalSelect').onchange = e => { state.interval = e.target.value; applyState(); };

// --- المكتبة ---
function renderLibrary() {
  document.getElementById('quotesList').innerHTML = QUOTES_DB.map(q => {
    const checked = state.selectedQuotes.includes(q) ? "checked" : "";
    return `<div style="display:flex; align-items:flex-start; gap:10px; padding:10px; border-bottom:1px solid var(--border);">
      <input type="checkbox" style="width:20px;height:20px;accent-color:var(--cyan);" value="${q}" ${checked} 
        onchange="if(this.checked) state.selectedQuotes.push(this.value); else state.selectedQuotes = state.selectedQuotes.filter(x => x !== this.value); applyState();">
      <div style="font-size:14px;">${q}</div>
    </div>`;
  }).join('');
}

// --- القطرة السينمائية و الأندرويد ---
async function fireCinematic() {
  const pool = state.selectedQuotes.length > 0 ? state.selectedQuotes : QUOTES_DB;
  const quote = pool[Math.floor(Math.random() * pool.length)];
  document.getElementById('dailyQuoteText').textContent = quote;
  
  if (QatraNative) {
    state.stats.drops += 1;
    applyState();
    await QatraNative.showDrop({ quote: quote, duration: state.duration });
  } else {
    alert("التأثير السينمائي يعمل داخل تطبيق الأندرويد فقط.");
  }
}
document.getElementById('triggerCinematic').onclick = fireCinematic;
document.getElementById('previewFloatingBtn').onclick = fireCinematic;

// --- مؤقت التأمل وأصوات الطبيعة ---
let timerInterval; let timeLeft = 25 * 60; let isTimerRunning = false;
let natureAudio = new Audio("https://actions.google.com/sounds/v1/water/rain_on_roof.ogg");
natureAudio.loop = true;

document.getElementById('timerPlayBtn').onclick = () => {
  if (isTimerRunning) { 
    clearInterval(timerInterval); 
    natureAudio.pause();
    document.getElementById('timerPlayBtn').innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`; 
  } else {
    natureAudio.play();
    timerInterval = setInterval(() => {
      if (timeLeft > 0) { timeLeft--; const m = Math.floor(timeLeft/60).toString().padStart(2,'0'); const s = (timeLeft%60).toString().padStart(2,'0'); document.getElementById('timerDisplay').textContent = `${m}:${s}`; }
      else { clearInterval(timerInterval); natureAudio.pause(); alert("انتهت الجلسة!"); }
    }, 1000);
    document.getElementById('timerPlayBtn').innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  }
  isTimerRunning = !isTimerRunning;
};

// أصوات طبيعة متنوعة
const sounds = ["https://actions.google.com/sounds/v1/water/rain_on_roof.ogg", "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg", "https://actions.google.com/sounds/v1/ambiences/birds_in_forest.ogg"];
document.getElementById('playAudioBtn').onclick = () => {
  if (isTimerRunning) { natureAudio.pause(); isTimerRunning = false; document.getElementById('playAudioBtn').textContent = "▶ تشغيل أصوات الطبيعة"; document.getElementById('audioStatus').textContent = "متوقف"; }
  else {
    natureAudio.src = sounds[Math.floor(Math.random() * sounds.length)];
    natureAudio.play(); isTimerRunning = true; document.getElementById('playAudioBtn').textContent = "⏸ إيقاف"; document.getElementById('audioStatus').textContent = "جارٍ الاسترخاء...";
  }
};

window.onload = () => {
  applyState(); renderLibrary();
  document.getElementById('dailyQuoteText').textContent = QUOTES_DB[0];
  if (QatraNative) QatraNative.askPermissions();
};
