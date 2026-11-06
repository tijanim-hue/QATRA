"use strict";

const STORAGE_KEY = "qatra_pro_v2";
const CATEGORIES = [
  { type: "quote", quotes: ["لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.", "تمهّل، فلكل مرحلة حكمتها.", "القليل المستمر يصنع أثرًا عميقًا."] },
  { type: "dhikr", quotes: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إني أسألك العفو والعافية.", "حسبي الله لا إله إلا هو، عليه توكلت."] }
];

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  remindersEnabled: true, isDarkMode: true, contentType: 'all', lastQuote: ""
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;

function getRandomContent() {
  let contentList = CATEGORIES.flatMap(c => c.quotes);
  if (state.contentType === 'quotes') contentList = CATEGORIES.find(c => c.type === 'quote').quotes;
  if (state.contentType === 'dhikr') contentList = CATEGORIES.find(c => c.type === 'dhikr').quotes;
  return contentList[Math.floor(Math.random() * contentList.length)];
}

function applyTheme() {
  document.body.classList.toggle('dark-mode', state.isDarkMode);
  document.getElementById('darkModeSetting').checked = state.isDarkMode;
  document.getElementById('contentTypeSetting').value = state.contentType;
}

// تشغيل القائمة الجانبية (Hamburger)
document.getElementById('openSidebar').onclick = () => {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('show');
};
document.getElementById('closeSidebar').onclick = document.getElementById('sidebarOverlay').onclick = () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
};

// أزرار القائمة
document.getElementById('btnShare').onclick = () => {
  if (navigator.share) navigator.share({ title: 'قطرة', text: 'حمل تطبيق قطرة لتذكيرات الهدوء والأذكار!', url: 'https://github.com/Mohammed-Tijani' });
};
document.getElementById('btnAbout').onclick = () => alert("تطبيق قطرة: مصمم بحب ليمنحك لحظة هدوء وسط ضجيج الحياة.");
document.getElementById('btnPrivacy').onclick = () => alert("نحن نحترم خصوصيتك. لا يتم جمع أي بيانات شخصية.");
document.getElementById('btnLang').onclick = () => alert("اللغة العربية هي لغة التطبيق الحالية.");

// التنقل السفلي
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(btn.dataset.view).classList.add('active');
    btn.classList.add('active');
  };
});

// أزرار القطرة والمعاينة
document.getElementById('showDrop').onclick = async () => {
  const quote = getRandomContent();
  document.getElementById('dailyQuote').textContent = quote;
  if (QatraNative && QatraNative.showDrop) {
    await QatraNative.showDrop({ quote: quote });
  } else {
    console.log("Native plugin not ready. Quote:", quote);
  }
};

document.getElementById('previewFloating').onclick = async () => {
  if (QatraNative && QatraNative.showDrop) {
    await QatraNative.showDrop({ quote: getRandomContent() });
  } else {
    alert("سيتم عرض التأثير السينمائي الخارجي في تطبيق الأندرويد بعد البناء.");
  }
};

// حفظ الإعدادات
document.getElementById('darkModeSetting').onchange = (e) => { state.isDarkMode = e.target.checked; localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); applyTheme(); };
document.getElementById('contentTypeSetting').onchange = (e) => { state.contentType = e.target.value; localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); };

applyTheme();
document.getElementById('dailyQuote').textContent = getRandomContent();
