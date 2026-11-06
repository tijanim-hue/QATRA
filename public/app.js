"use strict";

const QUOTES_DB = [
  "الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.",
  "كل يوم فرصة جديدة، استثمرها بحب.",
  "سبحان الله وبحمده، سبحان الله العظيم.",
  "لا إله إلا أنت سبحانك إني كنت من الظالمين."
];

let selectedQuotes = [...QUOTES_DB];
const QatraNative = window.Capacitor?.Plugins?.QatraNative;

// التنقل السفلي
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
  };
});

// المكتبة
function renderLibrary() {
  document.getElementById('quotesList').innerHTML = QUOTES_DB.map(q => {
    const checked = selectedQuotes.includes(q) ? "checked" : "";
    return `<div style="display:flex; align-items:flex-start; gap:10px;">
      <input type="checkbox" style="width:20px;height:20px;accent-color:var(--cyan);flex-shrink:0;margin-top:2px;" value="${q}" ${checked} 
        onchange="if(this.checked) selectedQuotes.push(this.value); else selectedQuotes = selectedQuotes.filter(x => x !== this.value);">
      <div style="font-size:14px; line-height:1.6;">${q}</div>
    </div>`;
  }).join('');
}

// القطرة السينمائية
async function fireCinematic() {
  const pool = selectedQuotes.length > 0 ? selectedQuotes : QUOTES_DB;
  const quote = pool[Math.floor(Math.random() * pool.length)];
  document.getElementById('dailyQuoteText').textContent = `"${quote}"`;
  
  if (QatraNative) {
    await QatraNative.showDrop({ quote: quote });
  } else {
    alert("تأثير سقوط القطرة وتشكيل العبارة يعمل بشكل حصري داخل تطبيق أندرويد.");
  }
}
document.getElementById('triggerCinematic').onclick = fireCinematic;
document.getElementById('previewFloatingBtn').onclick = fireCinematic;

// مؤقت جلسة تركيز وهدوء
let timerInterval; let timeLeft = 25 * 60; let isTimerRunning = false;
document.getElementById('timerPlayBtn').onclick = () => {
  if (isTimerRunning) { 
    clearInterval(timerInterval); 
    document.getElementById('timerPlayBtn').innerHTML = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`; 
  } else {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) { timeLeft--; const m = Math.floor(timeLeft/60).toString().padStart(2,'0'); const s = (timeLeft%60).toString().padStart(2,'0'); document.getElementById('timerDisplay').textContent = `${m}:${s}`; }
      else { clearInterval(timerInterval); alert("انتهت الجلسة!"); }
    }, 1000);
    document.getElementById('timerPlayBtn').innerHTML = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  }
  isTimerRunning = !isTimerRunning;
};

// أصوات طبيعة / قرآن (عشوائي)
const audioTracks = [
  "https://actions.google.com/sounds/v1/water/rain_on_roof.ogg",
  "https://server8.mp3quran.net/afs/001.mp3" // سورة الفاتحة كمثال
];
let player = new Audio(); let isPlaying = false;
document.getElementById('playAudioBtn').onclick = () => {
  if (isPlaying) { player.pause(); isPlaying = false; document.getElementById('playAudioBtn').textContent = "▶ تشغيل عشوائي"; document.getElementById('audioStatus').textContent = "تم الإيقاف"; }
  else {
    player.src = audioTracks[Math.floor(Math.random() * audioTracks.length)];
    player.play(); isPlaying = true; document.getElementById('playAudioBtn').textContent = "⏸ إيقاف"; document.getElementById('audioStatus').textContent = "جارٍ الاستماع...";
  }
};

window.onload = () => {
  renderLibrary();
  document.getElementById('dailyQuoteText').textContent = `"${QUOTES_DB[0]}"`;
  if (QatraNative) QatraNative.askPermissions();
};
