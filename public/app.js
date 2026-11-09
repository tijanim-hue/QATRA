"use strict";
const STORE_KEY = "qatra_worldclass_v13";

const DICT = {
ar: {
app_title: "قطرة | QATRA", moment_zen: "فاجئني", click_to_program: "بقطرة سينمائية",
next_drop: "قطرتك القادمة", today_impact: "أثر اليوم", drop_settings: "إعدادات قطرتي",
display_method: "طريقة العرض", mode_both: "تنبيه + قطرة مائية", mode_floating: "قطرة مائية فقط",
dur_5: "5 ثوانٍ", dur_10: "10 ثوانٍ", dur_15: "15 ثانية",
smart_schedule: "البرمجة الذكية", i_want: "أريد", drops_daily: "قطرات يومياً", from: "من", to: "إلى", apply_smart: "تطبيق البرمجة الذكية",
manual_schedule: "الجدولة اليدوية", custom_schedule: "تحديد ساعة وأيام:", save_schedule: "حفظ الموعد",
personal_library: "المكتبة الشخصية", library_desc: "احتفظ بالمعاني التي تلامس قلبك.",
discover_quotes: "اكتشف العبارات", swipe_hint: "اسحب للتقليب يميناً ويساراً", your_garden: "حديقتك", level_of_awareness: "مستوى الوعي العام",
tree_serenity: "السكينة", tree_awareness: "الوعي", sakeena: "سكينة", nature_sounds: "أصوات الطبيعة",
app_settings: "إعدادات التطبيق", glass_mode: "الشفافية وتأثير الزجاج", show_image: "إظهار صورة مع العبارة",
show_home_cards: "إظهار بطاقات الرئيسية", language: "لغة التطبيق:", save_done: "تم وحفظ", back: "رجوع",
copied: "تم النسخ بنجاح", days: "أيام", rain: "المطر", sea: "البحر",
all_categories: "عشوائي", cat_dhikr: "أذكار وأدعية", cat_selfDev: "تطوير الذات", cat_quran: "آيات قرآنية", cat_culture: "ثقافة وحكم", cat_poetry: "أبيات شعرية", my_custom_quotes: "عباراتي الخاصة", stop_repeat: "إيقاف التكرار", every_30: "كل 30 دقيقة", every_1h: "كل 1 ساعة", no_reminders: "لا توجد مواعيد", source_category: "مصدر العبارات", 
perm_title: "مرحباً بك في قطرة", 
perm_desc: "لكي تتمكن القطرة من الطفو على شاشتك وتنبيهك، نحتاج لمنح بعض الأذونات الأساسية للنظام.", 
perm_grant: "منح الصلاحيات والبدء",
quote_of_day: "اقتباس اليوم", drops: "قطرة", your_progress: "نشاطك وتقدمك"
},
en: {
app_title: "Qatra | Drop", moment_zen: "Surprise Me", click_to_program: "Cinematic Drop",
next_drop: "Next Drop", today_impact: "Today's Impact", drop_settings: "Drop Settings",
display_method: "Display Mode", mode_both: "Notif + Drop", mode_floating: "Drop Only",
dur_5: "5 Secs", dur_10: "10 Secs", dur_15: "15 Secs",
smart_schedule: "Smart Schedule", i_want: "I want", drops_daily: "drops daily", from: "From", to: "To", apply_smart: "Apply Schedule",
manual_schedule: "Manual Schedule", custom_schedule: "Custom time:", save_schedule: "Save",
personal_library: "Library", library_desc: "Meanings close to your heart.",
discover_quotes: "Discover", swipe_hint: "Swipe to flip", your_garden: "Your Garden", level_of_awareness: "Awareness Level",
tree_serenity: "Serenity", tree_awareness: "Awareness", sakeena: "Sakeena", nature_sounds: "Nature Sounds",
app_settings: "App Settings", glass_mode: "Glass Effect", show_image: "Show Image",
show_home_cards: "Show Home Cards", language: "Language:", save_done: "Done", back: "Back",
copied: "Copied!", days: "days", rain: "Rain", sea: "Sea",
all_categories: "Random", cat_dhikr: "Dhikr", cat_selfDev: "Self Dev", cat_quran: "Quran", cat_culture: "Culture", cat_poetry: "Poetry", my_custom_quotes: "My Quotes", stop_repeat: "Stop", every_30: "30 Mins", every_1h: "1 Hour", no_reminders: "No reminders", source_category: "Quote Source", 
perm_title: "Welcome to QATRA", 
perm_desc: "To allow Drops to float on your screen, we need system permissions.", 
perm_grant: "Grant Permissions & Start", 
quote_of_day: "Quote of the Day", drops: "Drops", your_progress: "Your Progress"
},
fr: {
app_title: "Qatra", moment_zen: "Surprends-moi", click_to_program: "Goutte Cinématique",
next_drop: "Prochaine Goutte", today_impact: "Impact du Jour", drop_settings: "Paramètres",
display_method: "Affichage", mode_both: "Notif + Goutte", mode_floating: "Goutte",
dur_5: "5 Sec", dur_10: "10 Sec", dur_15: "15 Sec",
smart_schedule: "Programme Intelligent", i_want: "Je veux", drops_daily: "gouttes/jour", from: "De", to: "À", apply_smart: "Appliquer",
manual_schedule: "Programme Manuel", custom_schedule: "Heure:", save_schedule: "Sauvegarder",
personal_library: "Bibliothèque", library_desc: "Citations favorites.",
discover_quotes: "Découvrir", swipe_hint: "Glisser pour tourner", your_garden: "Ton Jardin", level_of_awareness: "Niveau de Conscience",
tree_serenity: "Sérénité", tree_awareness: "Conscience", sakeena: "Sakeena", nature_sounds: "Sons de la Nature",
app_settings: "Paramètres", glass_mode: "Effet Verre", show_image: "Afficher Image",
show_home_cards: "Afficher Cartes", language: "Langue:", save_done: "Terminé", back: "Retour",
copied: "Copié!", days: "Jours", rain: "Pluie", sea: "Mer",
all_categories: "Aléatoire", cat_dhikr: "Dhikr", cat_selfDev: "Dév Personnel", cat_quran: "Coran", cat_culture: "Culture", cat_poetry: "Poésie", my_custom_quotes: "Mes Citations", stop_repeat: "Arrêter", every_30: "30 Mins", every_1h: "1 Heure", no_reminders: "Aucun", source_category: "Source", 
perm_title: "Bienvenue dans Qatra", 
perm_desc: "Pour autoriser les gouttes à flotter sur votre écran, nous avons besoin de permissions.", 
perm_grant: "Accorder les permissions", 
quote_of_day: "Citation du Jour", drops: "Gouttes", your_progress: "Votre Progrès"
}
};

const QUOTES_DB = {
    dhikr: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني."],
    quran: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "إِنَّ مَعَ الْعُسْرِ يُسْرًا"],
    poetry: ["وَمَا نَيْلُ الْمَطَالِبِ بِالتَّمَنِّي ... وَلَكِنْ تُؤْخَذُ الدُّنْيَا غِلَابَا"],
    selfDev: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "كل إنجاز عظيم بدأ بقرار بسيط للمحاولة.", "لا تقارن بدايتك بموسم حصاد الآخرين."],
    culture: ["الوقت كالسيف إن لم تقطعه قطعك."]
};

let state = {
    lang: 'ar', dark: true, glass: true, mode: 'both', duration: 10000, interval: '0', showImage: false, showHomeCards: true,
    quoteSource: 'all', schedules: [], myQuotes: [], stats: { drops: 0, likes: 0 }
};

try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) state = JSON.parse(saved);
} catch(e) {}

const QatraNative = window.Capacitor?.Plugins?.QatraNative;

function getTranslation(key) { 
    try {
        return (DICT[state.lang] && DICT[state.lang][key]) ? DICT[state.lang][key] : (DICT['en'][key] || key); 
    } catch(e) { return key; }
}

function applyState() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
        document.body.classList.toggle('dark-mode', state.dark);
        document.body.classList.toggle('glass-active', state.glass);
        document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
        
        document.querySelectorAll('[data-i18n]').forEach(el => { 
            const key = el.getAttribute('data-i18n');
            if (key) el.textContent = getTranslation(key); 
        });
        
        const hc = document.getElementById('homeCardsContainer');
        if(hc) hc.style.display = state.showHomeCards ? 'block' : 'none';
        
        const langSel = document.getElementById('langSelect');
        if(langSel) langSel.value = state.lang;
        
        renderGarden();
        updateNextDropUI();
    } catch(e) {}
}

function renderGarden() {
    try {
        const likes = state.stats?.likes || 0;
        const pEl = document.getElementById('totalAwarenessProgress'); 
        if(pEl) pEl.style.width = Math.min((likes / 50) * 100, 100) + '%';
        const dropsEl = document.getElementById('chartDropsVal');
        if(dropsEl) dropsEl.innerText = state.stats?.drops || 0;
    } catch(e) {}
}

// بطاقات السحب الفيزيائي (Tinder Swipe) للمكتبة
function initDiscoverSwipe() {
    const container = document.getElementById('swipeContainer');
    if (!container) return;
    
    let allQuotes = [];
    Object.values(QUOTES_DB).forEach(cat => allQuotes = allQuotes.concat(cat));
    if (state.myQuotes && state.myQuotes.length > 0) allQuotes = allQuotes.concat(state.myQuotes);
    allQuotes = allQuotes.sort(() => 0.5 - Math.random()).slice(0, 15);

    container.innerHTML = '';
    
    allQuotes.forEach((quote, index) => {
        const card = document.createElement('div');
        card.className = 'swipe-card';
        card.style.zIndex = allQuotes.length - index;
        card.style.transform = `scale(${1 - index * 0.05}) translateY(${index * 12}px)`;
        card.innerHTML = `<div class="swipe-quote">${quote}</div>`;
        container.appendChild(card);

        let startX = 0, currentX = 0, isDragging = false;

        card.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            card.classList.add('dragging');
        }, {passive: true});

        card.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX - startX;
            const rotateDeg = currentX * 0.05; 
            card.style.transform = `translateX(${currentX}px) rotate(${rotateDeg}deg) scale(1.05)`;
        }, {passive: true});

        card.addEventListener('touchend', () => {
            isDragging = false;
            card.classList.remove('dragging');
            if (Math.abs(currentX) > 100) {
                const direction = currentX > 0 ? 1 : -1;
                card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
                card.style.transform = `translateX(${direction * 500}px) rotate(${direction * 30}deg)`;
                card.style.opacity = 0;
                
                setTimeout(() => {
                    card.remove();
                    const remaining = container.querySelectorAll('.swipe-card');
                    remaining.forEach((c, i) => {
                        c.style.transition = 'transform 0.3s ease';
                        c.style.transform = `scale(${1 - i * 0.05}) translateY(${i * 12}px)`;
                    });
                }, 400);
            } else {
                card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.transform = 'translateX(0) rotate(0deg) scale(1)';
            }
            currentX = 0;
        });
    });
}

window.setQuoteSource = (source) => { state.quoteSource = source; applyState(); syncNativeAlarms(); };

function getRandomQuote() {
    try {
        let pool = [];
        let catKey = state.quoteSource;
        if (catKey === 'all' || !QUOTES_DB[catKey]) {
            const keys = Object.keys(QUOTES_DB);
            catKey = keys[Math.floor(Math.random() * keys.length)];
            pool = QUOTES_DB[catKey];
        } else if (catKey === 'myQuotes') {
            pool = state.myQuotes.length > 0 ? state.myQuotes : ["أضف عباراتك الخاصة في المكتبة لتظهر هنا."];
        } else {
            pool = QUOTES_DB[catKey];
        }
        return { quote: pool[Math.floor(Math.random() * pool.length)], category: catKey };
    } catch(e) {
        return { quote: "الحمد لله", category: "dhikr" };
    }
}

window.fireCinematic = async () => {
    try {
        const qData = getRandomQuote();
        state.stats.drops = (state.stats.drops || 0) + 1; 
        applyState();
        if (QatraNative) {
            await QatraNative.showDrop({ quote: qData.quote, category: qData.category, duration: state.duration, showImage: state.showImage }).catch(()=>{});
        }
    } catch(e) {}
};

window.openQuoteOfDay = () => {
    try {
        const qData = getRandomQuote();
        const textModal = document.getElementById('qodTextModal');
        if(textModal) textModal.innerText = qData.quote;
        
        const likeBtn = document.getElementById('qodLikeBtn');
        if(likeBtn) {
            likeBtn.innerHTML = `<svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" fill="none" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
            likeBtn.style.color = "var(--text-dim)";
            likeBtn.onclick = () => {
                likeBtn.style.color = "#FF3B30";
                likeBtn.innerHTML = `<svg viewBox="0 0 24 24" width="30" height="30" stroke="#FF3B30" fill="#FF3B30" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
                state.stats.likes = (state.stats.likes || 0) + 1; 
                applyState();
            };
        }

        const copyBtn = document.getElementById('qodCopyBtn');
        if(copyBtn) {
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(qData.quote).then(() => {
                    const t = document.getElementById('copyToast'); 
                    if(t) { t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 2000); }
                });
            };
        }
        
        const sheet = document.getElementById('quoteOfDaySheet');
        if(sheet) sheet.classList.add('show');
    } catch(e) {}
};

function updateNextDropUI() {
    try {
        const ndText = document.getElementById('nextDropTimeText');
        if(ndText) ndText.innerText = getTranslation('no_reminders');
    } catch(e) {}
}

function syncNativeAlarms() {
    if(!QatraNative) return;
    QatraNative.scheduleInterval({ intervalMinutes: parseInt(state.interval), mode: state.mode, duration: state.duration, quote: getRandomQuote().quote, category: state.quoteSource, fullScreen: true, showImage: state.showImage }).catch(()=>{});
}

const libCats = [
    {id: 'dhikr', i18n: 'cat_dhikr'}, {id: 'quran', i18n: 'cat_quran'},
    {id: 'poetry', i18n: 'cat_poetry'}, {id: 'selfDev', i18n: 'cat_selfDev'},
    {id: 'culture', i18n: 'cat_culture'}, {id: 'myQuotes', i18n: 'my_custom_quotes'}
];

function renderLibraryCategories() {
    try {
        const chipsRow = document.getElementById('libraryCatChips');
        if(!chipsRow) return;
        chipsRow.innerHTML = libCats.map((c, i) => `<div class="chip-btn ${i===0?'active':''}" onclick="selectLibCat('${c.id}', this)" data-i18n="${c.i18n}">${getTranslation(c.i18n)}</div>`).join('');
        selectLibCat(libCats[0].id, chipsRow.firstChild);
    } catch(e) {}
}

window.selectLibCat = (id, el) => {
    try {
        document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
        if(el) el.classList.add('active');
        
        const addDiv = document.getElementById('addCustomQuoteDiv');
        if (id === 'myQuotes') {
            if(addDiv) addDiv.style.display = 'block';
        } else {
            if(addDiv) addDiv.style.display = 'none';
        }
    } catch(e) {}
};

window.addMyQuote = () => {
    try {
        const inp = document.getElementById('newMyQuoteInput');
        if(inp && inp.value.trim()){ 
            if(!state.myQuotes) state.myQuotes = [];
            state.myQuotes.push(inp.value.trim()); 
            inp.value=''; 
            applyState(); 
            initDiscoverSwipe();
            alert("تمت إضافة عبارتك الخاصة بنجاح!");
        }
    } catch(e) {}
};

// حفظ وتفعيل المواعيد اليدوية
document.getElementById('saveScheduleBtn')?.addEventListener('click', () => {
    try {
        const tVal = document.getElementById('customTime').value;
        const intVal = document.getElementById('intervalSelect').value;
        if (tVal) {
            state.schedules.push({ id: Math.floor(Math.random()*10000), time: tVal, days: [0,1,2,3,4,5,6] });
        }
        state.interval = intVal;
        applyState();
        syncNativeAlarms();
        
        const t = document.getElementById('copyToast'); 
        if(t) { 
            t.innerText = "تم حفظ وتفعيل الموعد بنجاح";
            t.classList.add('show'); 
            setTimeout(()=>t.classList.remove('show'), 2000); 
        }
    } catch(e) {}
});

window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 500);
        }
    }, 1200);
});

document.addEventListener('DOMContentLoaded', () => {
    try {
        applyState();

        const permBlocker = document.getElementById('permissionBlocker');
        if (!localStorage.getItem('perms_granted')) {
            if(permBlocker) permBlocker.style.display = 'flex';
        } else {
            if(permBlocker) permBlocker.style.display = 'none';
        }

        document.getElementById('grantPermsBtn')?.addEventListener('click', () => {
            if(QatraNative) {
                QatraNative.askPermissions().then(() => { 
                    localStorage.setItem('perms_granted', 'true'); 
                    if(permBlocker) permBlocker.style.display = 'none'; 
                }).catch(() => {
                    localStorage.setItem('perms_granted', 'true');
                    if(permBlocker) permBlocker.style.display = 'none';
                });
            } else {
                localStorage.setItem('perms_granted', 'true');
                if(permBlocker) permBlocker.style.display = 'none';
            }
        });

        document.querySelectorAll('.nav-item, .nav-home-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if(!btn.dataset.view) return;
                document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                document.querySelectorAll('.nav-item, .nav-home-btn').forEach(n => n.classList.remove('active'));
                const targetView = document.getElementById(btn.dataset.view);
                if(targetView) targetView.classList.add('active');
                btn.classList.add('active');
                if(btn.dataset.view === 'libraryView') {
                    renderLibraryCategories();
                    initDiscoverSwipe();
                }
            });
        });

        document.getElementById('langSelect')?.addEventListener('change', e => { 
            state.lang = e.target.value; 
            applyState(); 
            renderLibraryCategories(); 
        });

        // السحب للإغلاق النوافذ باستخدام الخط الصغير (Handle)
        document.querySelectorAll('.sheet-overlay').forEach(sheet => {
            const handle = sheet.querySelector('.sheet-handle');
            const content = sheet.querySelector('.sheet-content');
            if (!handle || !content) return;
            let startY = 0, currentY = 0;
            handle.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; content.style.transition = 'none'; }, {passive: true});
            handle.addEventListener('touchmove', (e) => {
                if (!startY) return;
                currentY = Math.max(0, e.touches[0].clientY - startY);
                content.style.transform = `translateY(${currentY}px)`;
            }, {passive: true});
            handle.addEventListener('touchend', () => {
                content.style.transition = 'transform 0.3s ease';
                if (currentY > 80) sheet.classList.remove('show');
                content.style.transform = '';
                startY = 0; currentY = 0;
            });
        });

        initDiscoverSwipe();

    } catch(e) {}
});
