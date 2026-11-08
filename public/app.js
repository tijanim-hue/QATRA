"use strict";

const STORE_KEY = "qatra_worldclass_v9";

const DICT = {
  ar: {
    app_title: "قطرة | QATRA", pull_to_switch: "اسحب لتبديل المظهر", moment_zen: "لحظة وعي", click_to_program: "اضغط لبرمجة قطرتك", 
    next_drop: "قطرتك القادمة", today_impact: "أثر اليوم", current_moment: "لحظتك الحالية", drop_settings: "إعدادات قطرتي", 
    discover_quotes: "اكتشف العبارات", my_favorites: "مفضلاتي", my_groups: "مجموعاتي", my_custom_quotes: "عباراتي الخاصة", 
    create_group: "إنشاء مجموعة جديدة", add: "إضافة", your_garden: "حديقتك", level_of_awareness: "مستوى الوعي العام",
    tree_serenity: "شجرة السكينة", tree_knowledge: "شجرة المعرفة", tree_awareness: "شجرة الوعي", tree_gratitude: "شجرة الامتنان",
    sakeena: "سكينة", nature_sounds: "أصوات الطبيعة", quran_recitation: "القرآن الكريم",
    short_sessions: "جلسات قصيرة", app_settings: "إعدادات التطبيق", glass_mode: "الشفافية والزجاج", show_image: "إظهار صورة العبارة",
    show_home_cards: "بطاقات الرئيسية", language: "لغة التطبيق:", save_done: "تم وحفظ", back: "رجوع", copied: "تم النسخ بنجاح", 
    delete: "حذف", days: "أيام", quotes_ready: "عبارة جاهزة", rain: "🌧️ المطر", sea: "🌊 البحر", forest: "🌲 الغابة", birds: "🕊️ الطيور",
    all_categories: "عشوائي (من كل الأقسام)", cat_dhikr: "أذكار وأدعية", cat_selfDev: "تطوير الذات", cat_quran: "آيات قرآنية", cat_culture: "ثقافة عامة وحكم", cat_poetry: "أبيات شعرية", my_library: "مجموعاتي الخاصة", stop_repeat: "إيقاف التكرار التلقائي", every_30: "كل 30 دقيقة", every_1h: "كل 1 ساعة", every_3h: "كل 3 ساعات", every_12h: "كل 12 ساعة", every_24h: "كل 24 ساعة", no_reminders: "لا توجد مواعيد", source_category: "1. مصدر العبارات",
    cat_awareness: "أسئلة وعي (جديد)", cat_family: "قطرات لأحبائي (عائلتي)", my_journal: "دفتر الأثر (تأملاتي)", family_drops: "قطرات لأحبائي",
    quote_of_day: "اقتباس اليوم", surprise_me: "فاجئني", tap_for_drop: "اكتشف الآن قطرة جديدة"
  }
};
DICT['en'] = DICT['ar']; 
const langs = ['fr','es','de']; langs.forEach(l => DICT[l] = DICT['en']); 

// قاعدة البيانات (كما هي تماماً في الأكواد السابقة)
const QUOTES_DB = {
  awareness: { key: "cat_awareness", icon: '<path d="..."/>', items: ["ما الشيء الذي يستحق امتنانك اليوم؟", "ما الخطوة الصغيرة التي تستطيع القيام بها الآن؟"] },
  dhikr: { key: "cat_dhikr", icon: '<path d="..."/>', items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين."] },
  selfDev: { key: "cat_selfDev", icon: '<path d="..."/>', items: ["الهدوء ليس ضعفا بل هو قوة التحكم في الذات.", "كل إنجاز عظيم بدأ بقرار بسيط للمحاولة."] },
  quran: { key: "cat_quran", icon: '<path d="..."/>', items: ["ومن يتوكل على الله فهو حسبه.", "إن مع العسر يسرا."] },
  culture: { key: "cat_culture", icon: '<path d="..."/>', items: ["الوقت كالسيف إن لم تقطعه قطعك.", "العقل السليم في الجسم السليم."] },
  poetry: { key: "cat_poetry", icon: '<path d="..."/>', items: ["وما نيل المطالب بالتمني ولكن تؤخذ الدنيا غلابا.", "تجري الرياح بما لا تشتهي السفن."] }
};

const MORNING_ALERTS = ["صباح جديد وفرصة جديدة لبداية رائعة.", "استيقظ وابتسم فالحياة تخبئ لك الكثير من الجمال."];

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  lang: 'ar', dark: true, glass: true, mode: 'both', duration: 10000, interval: '0', showImage: false, showHomeCards: true,
  quoteSource: 'all', schedules: [], groups: { 'favorites': [], 'myQuotes': [] }, 
  journal: [], family: [],
  stats: { drops: 0, likes: 0, dhikr: 0, culture: 0, selfDev: 0, poetry: 0, days: 1 }
};

let currentQotdQuote = ""; // متغير لتخزين اقتباس اليوم وضمان تطابقه

const QatraNative = window.Capacitor?.Plugins?.QatraNative;
function getTranslation(key) { return (DICT[state.lang] && DICT[state.lang][key]) ? DICT[state.lang][key] : (DICT['en'][key] || key); }
function safeOn(id, eventType, handler) { const el = document.getElementById(id); if (el) el.addEventListener(eventType, handler); }

// --- نظام التنبيهات الاحترافي (Custom Toasts) ---
window.showToast = (msg, iconSvg) => {
    const toast = document.getElementById('customToast');
    const msgEl = document.getElementById('customToastMsg');
    const iconEl = document.getElementById('customToastIcon');
    if(toast && msgEl && iconEl) {
        msgEl.innerText = msg;
        iconEl.innerHTML = iconSvg || `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  document.body.classList.toggle('dark-mode', state.dark);
  document.body.classList.toggle('glass-active', state.glass);
  
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = getTranslation(el.getAttribute('data-i18n')); });
  updateHomeCards(); 
}

// --- استماع لطلب الأذونات الإجبارية عند بدء التطبيق ---
window.requestOverlayPermission = () => {
    if (QatraNative) {
        QatraNative.askPermissions().then(res => {
            if (res.hasOverlay) {
                document.getElementById('permissionBlocker').classList.remove('show');
            } else {
                showToast("الإذن ضروري لعمل التطبيق", `<svg viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`);
            }
        });
    }
}

function checkPermissionsOnStart() {
    if (QatraNative) {
        QatraNative.checkPermissions().then(res => {
            if (!res.hasOverlay) {
                document.getElementById('permissionBlocker').classList.add('show');
            }
        });
    }
}

if (QatraNative) {
  QatraNative.addListener('quoteLiked', (info) => {
    state.stats.likes++; applyState();
  });
}

function updateHomeCards() {
  const tiEl = document.getElementById('todayImpactText'); if(tiEl) tiEl.innerText = `لقد تفاعلت مع ${state.stats.likes} قطرات اليوم`;
  const tipEl = document.getElementById('todayImpactProgress'); if(tipEl) tipEl.style.width = Math.min((state.stats.likes / 10)*100, 100) + '%';
  
  const cmEl = document.getElementById('currentMomentText'); 
  if(cmEl) cmEl.innerText = MORNING_ALERTS[Math.floor(Math.random() * MORNING_ALERTS.length)];
}

// --- اقتباس اليوم المتطابق ---
window.openQuoteOfTheDay = () => {
    document.getElementById('qotdModalText').innerText = currentQotdQuote;
    const likeBtn = document.getElementById('qotdLikeBtn');
    likeBtn.style.color = '#fff'; likeBtn.style.background = 'rgba(255,255,255,0.2)';
    likeBtn.onclick = () => {
        addToFavorites(currentQotdQuote);
        likeBtn.style.color = '#FF3B30';
        likeBtn.style.background = 'rgba(255,59,48,0.2)';
    };
    document.getElementById('qotdModal').classList.add('show');
}
window.closeQotdModal = () => { document.getElementById('qotdModal').classList.remove('show'); }
window.copyQotd = () => { copyQuote(currentQotdQuote); closeQotdModal(); }

window.copyQuote = (txt) => {
  navigator.clipboard.writeText(txt).then(() => {
    showToast("تم النسخ للحافظة", `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`);
  });
};

window.addToFavorites = (txt) => {
  if(!state.groups['favorites'].includes(txt)) {
    state.groups['favorites'].push(txt); applyState(); 
    showToast("تمت الإضافة للمفضلة ❤️", `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`);
  }
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
    discoverActiveCat = cat; currentDiscoverIndex = 0;
    renderDiscoverCategories(); showDiscoverCard(0);
}

function showDiscoverCard(direction) {
    const container = document.getElementById('discoverCardContainer');
    const items = QUOTES_DB[discoverActiveCat].items;
    
    if (items.length === 0) return;
    
    currentDiscoverIndex = (currentDiscoverIndex + direction + items.length) % items.length;
    const quote = items[currentDiscoverIndex];
    const safeQuote = quote.replace(/'/g, "\\'");

    const oldCard = container.querySelector('.discover-quote-card');
    if (oldCard) { oldCard.classList.add('hidden'); setTimeout(() => oldCard.remove(), 500); }

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

// --- القطرة السينمائية العشوائية ---
function getRandomQuote() {
  let pool = [];
  let categoryKey = state.quoteSource;
  if (state.quoteSource === 'all') {
    const keys = Object.keys(QUOTES_DB).filter(k => k !== 'awareness');
    categoryKey = keys[Math.floor(Math.random() * keys.length)];
    pool = QUOTES_DB[categoryKey].items;
  } else { pool = QUOTES_DB[state.quoteSource].items; }
  const quote = pool[Math.floor(Math.random() * pool.length)];
  return { quote, categoryKey };
}

window.fireCinematic = async () => {
  // للزر فاجئني
  const keys = Object.keys(QUOTES_DB);
  const randomCategoryKey = keys[Math.floor(Math.random() * keys.length)];
  const pool = QUOTES_DB[randomCategoryKey].items;
  const randomQuote = pool[Math.floor(Math.random() * pool.length)];
  
  if (QatraNative) {
    state.stats.drops++; applyState();
    await QatraNative.showDrop({ quote: randomQuote, category: randomCategoryKey, duration: state.duration, fullScreen: true, showImage: state.showImage }).catch(e=>{});
  }
};

document.addEventListener('DOMContentLoaded', () => {
  checkPermissionsOnStart();
  
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

  applyState(); 
  
  // توليد اقتباس اليوم وتثبيته في المعاينة وفي النافذة الزجاجية
  const { quote } = getRandomQuote();
  currentQotdQuote = quote;
  const qtElPreview = document.getElementById('dailyQuoteTextPreview');
  if(qtElPreview) qtElPreview.textContent = `"${quote.substring(0, 30)}..."`;

  setTimeout(() => { const splash = document.getElementById('splash'); if (splash) { splash.style.opacity = '0'; setTimeout(() => splash.remove(), 800); } }, 2500);
});
