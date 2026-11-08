"use strict";
const STORE_KEY = "qatra_worldclass_v8";

// قاموس الترجمة (عربي، إنجليزي، فرنسي) بدون رموز في الإعدادات
const DICT = {
ar: {
app_title: "قطرة | QATRA", moment_zen: "فاجئني", click_to_program: "بقطرة سينمائية",
next_drop: "قطرتك القادمة", today_impact: "أثر اليوم", drop_settings: "إعدادات قطرتي",
display_method: "طريقة العرض", mode_both: "تنبيه + قطرة مائية", mode_floating: "قطرة مائية فقط",
dur_5: "5 ثوانٍ", dur_10: "10 ثوانٍ", dur_15: "15 ثانية",
smart_schedule: "البرمجة الذكية", i_want: "أريد", drops_daily: "قطرات يومياً", from: "من", to: "إلى", apply_smart: "تطبيق البرمجة الذكية",
manual_schedule: "الجدولة اليدوية", custom_schedule: "تحديد ساعة وأيام:", save_schedule: "حفظ الموعد",
personal_library: "المكتبة الشخصية", library_desc: "احتفظ بالمعاني التي تلامس قلبك.",
discover_quotes: "اكتشف العبارات", your_garden: "حديقتك", level_of_awareness: "مستوى الوعي العام",
tree_serenity: "السكينة", tree_awareness: "الوعي", sakeena: "سكينة", nature_sounds: "أصوات الطبيعة",
app_settings: "إعدادات التطبيق", glass_mode: "الشفافية وتأثير الزجاج", show_image: "إظهار صورة مع العبارة",
show_home_cards: "إظهار بطاقات الرئيسية", language: "لغة التطبيق:", save_done: "تم وحفظ", back: "رجوع",
copied: "تم النسخ بنجاح", days: "أيام", rain: "المطر", sea: "البحر",
all_categories: "عشوائي", cat_dhikr: "أذكار وأدعية", cat_selfDev: "تطوير الذات", cat_quran: "آيات قرآنية", cat_culture: "ثقافة وحكم", cat_poetry: "أبيات شعرية", my_custom_quotes: "عباراتي الخاصة", stop_repeat: "إيقاف التكرار", every_30: "كل 30 دقيقة", every_1h: "كل 1 ساعة", no_reminders: "لا توجد مواعيد", source_category: "مصدر العبارات", perm_title: "مرحباً بك في قطرة", perm_desc: "نحتاج لمنح أذونات الطفو للعمل.", perm_grant: "منح الصلاحيات",
quote_of_day: "اقتباس اليوم", drops: "قطرة"
},
en: {
app_title: "Qatra | Drop", moment_zen: "Surprise Me", click_to_program: "Cinematic Drop",
next_drop: "Next Drop", today_impact: "Today's Impact", drop_settings: "Drop Settings",
display_method: "Display Mode", mode_both: "Notif + Drop", mode_floating: "Drop Only",
dur_5: "5 Secs", dur_10: "10 Secs", dur_15: "15 Secs",
smart_schedule: "Smart Schedule", i_want: "I want", drops_daily: "drops daily", from: "From", to: "To", apply_smart: "Apply Schedule",
manual_schedule: "Manual Schedule", custom_schedule: "Custom time:", save_schedule: "Save",
personal_library: "Library", library_desc: "Meanings close to your heart.",
discover_quotes: "Discover", your_garden: "Your Garden", level_of_awareness: "Awareness Level",
tree_serenity: "Serenity", tree_awareness: "Awareness", sakeena: "Sakeena", nature_sounds: "Nature Sounds",
app_settings: "App Settings", glass_mode: "Glass Effect", show_image: "Show Image",
show_home_cards: "Show Home Cards", language: "Language:", save_done: "Done", back: "Back",
copied: "Copied!", days: "days", rain: "Rain", sea: "Sea",
all_categories: "Random", cat_dhikr: "Dhikr", cat_selfDev: "Self Dev", cat_quran: "Quran", cat_culture: "Culture", cat_poetry: "Poetry", my_custom_quotes: "My Quotes", stop_repeat: "Stop", every_30: "30 Mins", every_1h: "1 Hour", no_reminders: "No reminders", source_category: "Quote Source", perm_title: "Welcome", perm_desc: "We need overlay permissions.", perm_grant: "Grant", quote_of_day: "Quote of the Day", drops: "Drops"
},
fr: {
app_title: "Qatra", moment_zen: "Surprends-moi", click_to_program: "Goutte Cinématique",
next_drop: "Prochaine Goutte", today_impact: "Impact du Jour", drop_settings: "Paramètres",
display_method: "Affichage", mode_both: "Notif + Goutte", mode_floating: "Goutte",
dur_5: "5 Sec", dur_10: "10 Sec", dur_15: "15 Sec",
smart_schedule: "Programme Intelligent", i_want: "Je veux", drops_daily: "gouttes/jour", from: "De", to: "À", apply_smart: "Appliquer",
manual_schedule: "Programme Manuel", custom_schedule: "Heure:", save_schedule: "Sauvegarder",
personal_library: "Bibliothèque", library_desc: "Citations favorites.",
discover_quotes: "Découvrir", your_garden: "Ton Jardin", level_of_awareness: "Niveau de Conscience",
tree_serenity: "Sérénité", tree_awareness: "Conscience", sakeena: "Sakeena", nature_sounds: "Sons de la Nature",
app_settings: "Paramètres", glass_mode: "Effet Verre", show_image: "Afficher Image",
show_home_cards: "Afficher Cartes", language: "Langue:", save_done: "Terminé", back: "Retour",
copied: "Copié!", days: "Jours", rain: "Pluie", sea: "Mer",
all_categories: "Aléatoire", cat_dhikr: "Dhikr", cat_selfDev: "Dév Personnel", cat_quran: "Coran", cat_culture: "Culture", cat_poetry: "Poésie", my_custom_quotes: "Mes Citations", stop_repeat: "Arrêter", every_30: "30 Mins", every_1h: "1 Heure", no_reminders: "Aucun", source_category: "Source", perm_title: "Bienvenue", perm_desc: "Permissions requises.", perm_grant: "Accorder", quote_of_day: "Citation du Jour", drops: "Gouttes"
}
};

// الأقسام والعبارات
const QUOTES_DB = {
    dhikr: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني."],
    quran: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "إِنَّ مَعَ الْعُسْرِ يُسْرًا"],
    poetry: ["وَمَا نَيْلُ الْمَطَالِبِ بِالتَّمَنِّي ... وَلَكِنْ تُؤْخَذُ الدُّنْيَا غِلَابَا"],
    selfDev: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "كل إنجاز عظيم بدأ بقرار بسيط للمحاولة.", "لا تقارن بدايتك بموسم حصاد الآخرين."],
    culture: ["الوقت كالسيف إن لم تقطعه قطعك."]
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
    lang: 'ar', dark: true, glass: true, mode: 'both', duration: 10000, interval: '0', showImage: false, showHomeCards: true,
    quoteSource: 'all', schedules: [], myQuotes: [], stats: { drops: 0, likes: 0 }
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;

function getTranslation(key) { return (DICT[state.lang] && DICT[state.lang][key]) ? DICT[state.lang][key] : (DICT['en'][key] || key); }

function applyState() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    document.body.classList.toggle('dark-mode', state.dark);
    document.body.classList.toggle('glass-active', state.glass);
    document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = getTranslation(el.getAttribute('data-i18n')); });
    
    document.getElementById('homeCardsContainer').style.display = state.showHomeCards ? 'block' : 'none';
    
    const c = (id, val) => { const el = document.getElementById(id); if(el) el.checked = val; };
    const s = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
    c('glassToggle', state.glass); c('imageToggle', state.showImage); c('homeCardsToggle', state.showHomeCards);
    s('langSelect', state.lang); s('notifModeSetting', state.mode); s('intervalSelect', state.interval);
    
    document.querySelectorAll('.custom-radio-item').forEach(item => {
        if(item.dataset.value === state.quoteSource) item.classList.add('active');
        else item.classList.remove('active');
    });

    renderGarden();
    updateNextDropUI();
}

function renderGarden() {
    const likes = state.stats.likes;
    const pEl = document.getElementById('totalAwarenessProgress'); 
    if(pEl) pEl.style.width = Math.min((likes / 50) * 100, 100) + '%';
    const dropsEl = document.getElementById('chartDropsVal');
    if(dropsEl) dropsEl.innerText = state.stats.drops;
}

// السحب للإغلاق النوافذ
function initPullToCloseSheets() {
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
            content.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            if (currentY > 80) sheet.classList.remove('show');
            content.style.transform = '';
            startY = 0; currentY = 0;
        });
    });
}

// السحب للوضع الداكن
function initPullToRefresh() {
    let startY = 0;
    const scrollContent = document.getElementById('scrollContent');
    const ptrContainer = document.getElementById('ptrContainer');
    const ptrIcon = document.getElementById('ptrIcon');
    if(!scrollContent) return;
    scrollContent.addEventListener('touchstart', e => { if(scrollContent.scrollTop === 0) startY = e.touches[0].clientY; }, {passive:true});
    scrollContent.addEventListener('touchmove', e => {
        if (startY > 0 && scrollContent.scrollTop === 0) {
            let y = e.touches[0].clientY - startY;
            if (y > 20 && y < 100) { ptrContainer.style.transform = `translateY(${y - 70}px)`; ptrIcon.style.transform =`rotate(${y*4}deg)`; }
        }
    }, {passive:true});
    scrollContent.addEventListener('touchend', e => {
        if (startY > 0 && scrollContent.scrollTop === 0) {
            let y = e.changedTouches[0].clientY - startY;
            if (y > 70) {
                ptrIcon.classList.add('spin');
                state.dark = !state.dark;
                applyState();
                setTimeout(() => { ptrContainer.style.transform = 'translateY(-100%)'; ptrIcon.classList.remove('spin'); }, 600);
            } else { ptrContainer.style.transform = 'translateY(-100%)'; }
        }
        startY = 0;
    }, {passive:true});
}

window.setQuoteSource = (source) => { state.quoteSource = source; applyState(); syncNativeAlarms(); };

function getRandomQuote() {
    let pool = [];
    let catKey = state.quoteSource;
    if (catKey === 'all') {
        const keys = Object.keys(QUOTES_DB);
        catKey = keys[Math.floor(Math.random() * keys.length)];
        pool = QUOTES_DB[catKey];
    } else if (catKey === 'myQuotes') {
        pool = state.myQuotes.length > 0 ? state.myQuotes : ["أضف عباراتك الخاصة في المكتبة لتظهر هنا."];
    } else {
        pool = QUOTES_DB[catKey];
    }
    return { quote: pool[Math.floor(Math.random() * pool.length)], category: catKey };
}

window.fireCinematic = async () => {
    const qData = getRandomQuote();
    state.stats.drops++; applyState();
    if (QatraNative) {
        await QatraNative.showDrop({ quote: qData.quote, category: qData.category, duration: state.duration, showImage: state.showImage }).catch(()=>{});
    }
};

window.openQuoteOfDay = () => {
    const qData = getRandomQuote();
    document.getElementById('qodTextModal').innerText = qData.quote;
    
    const likeBtn = document.getElementById('qodLikeBtn');
    likeBtn.innerHTML = `<svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" fill="none" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    likeBtn.style.color = "var(--text-dim)";
    likeBtn.onclick = () => {
        likeBtn.style.color = "#FF3B30";
        likeBtn.innerHTML = `<svg viewBox="0 0 24 24" width="30" height="30" stroke="#FF3B30" fill="#FF3B30" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        state.stats.likes++; applyState();
    };

    document.getElementById('qodCopyBtn').onclick = () => {
        navigator.clipboard.writeText(qData.quote).then(() => {
            const t = document.getElementById('copyToast'); t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 2000);
        });
    };
    
    document.getElementById('quoteOfDaySheet').classList.add('show');
};

document.getElementById('applySmartScheduleBtn')?.addEventListener('click', () => {
    const count = parseInt(document.getElementById('smartDropsCount').value);
    const start = document.getElementById('smartTimeStart').value;
    const end = document.getElementById('smartTimeEnd').value;
    if(count > 0 && start && end) {
        const [sh, sm] = start.split(':').map(Number); const [eh, em] = end.split(':').map(Number);
        let sMins = sh*60 + sm; let eMins = eh*60 + em;
        if(eMins <= sMins) eMins += 24*60;
        const intv = (eMins - sMins) / count;
        state.schedules = [];
        for(let i=0; i<count; i++) {
            let t = sMins + Math.round(i*intv);
            let h = Math.floor((t%1440)/60).toString().padStart(2,'0');
            let m = (t%60).toString().padStart(2,'0');
            state.schedules.push({id: Math.floor(Math.random()*10000), time: `${h}:${m}`, days: [0,1,2,3,4,5,6]});
        }
        applyState(); syncNativeAlarms();
    }
});

function updateNextDropUI() {
    const now = new Date();
    let nextDropText = getTranslation('no_reminders');
    let catText = getTranslation('cat_' + state.quoteSource) || getTranslation('all_categories');
    
    if (state.schedules.length > 0) {
        const next = state.schedules.map(s => {
            const [h,m] = s.time.split(':');
            const d = new Date(); d.setHours(h,m,0);
            if(d < now) d.setDate(d.getDate()+1);
            return d;
        }).sort((a,b) => a-b)[0];
        
        const diffMins = Math.round((next - now)/60000);
        nextDropText = `بعد ${diffMins} دقيقة`;
        
        const mH = next.getHours().toString().padStart(2,'0');
        const mM = next.getMinutes().toString().padStart(2,'0');
        document.getElementById('nextDropTimeModal').innerText = `${mH}:${mM}`;
        document.getElementById('nextDropCatModal').innerText = `القسم: ${catText}`;
    } else {
        document.getElementById('nextDropTimeModal').innerText = `--:--`;
        document.getElementById('nextDropCatModal').innerText = getTranslation('no_reminders');
    }
    
    document.getElementById('nextDropTimeText').innerText = nextDropText;
}

function syncNativeAlarms() {
    if(!QatraNative) return;
    QatraNative.scheduleInterval({ intervalMinutes: parseInt(state.interval), mode: state.mode, duration: state.duration, quote: getRandomQuote().quote, category: state.quoteSource, fullScreen: true, showImage: state.showImage }).catch(()=>{});
    state.schedules.forEach(s => {
        const rq = getRandomQuote();
        QatraNative.schedule({id: s.id, time: s.time, days: s.days, mode: state.mode, duration: state.duration, quote: rq.quote, category: rq.category, fullScreen: true, showImage: state.showImage}).catch(()=>{});
    });
}

const libCats = [
    {id: 'dhikr', i18n: 'cat_dhikr'}, {id: 'quran', i18n: 'cat_quran'},
    {id: 'poetry', i18n: 'cat_poetry'}, {id: 'selfDev', i18n: 'cat_selfDev'},
    {id: 'culture', i18n: 'cat_culture'}, {id: 'myQuotes', i18n: 'my_custom_quotes'}
];

function renderLibraryCategories() {
    const chipsRow = document.getElementById('libraryCatChips');
    if(!chipsRow) return;
    chipsRow.innerHTML = libCats.map((c, i) => `<div class="chip-btn ${i===0?'active':''}" onclick="selectLibCat('${c.id}', this)" data-i18n="${c.i18n}">${getTranslation(c.i18n)}</div>`).join('');
    selectLibCat(libCats[0].id, chipsRow.firstChild);
}

window.selectLibCat = (id, el) => {
    document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
    if(el) el.classList.add('active');
    
    const container = document.getElementById('libraryQuotesContainer');
    const addDiv = document.getElementById('addCustomQuoteDiv');
    
    if (id === 'myQuotes') {
        addDiv.style.display = 'block';
        container.innerHTML = state.myQuotes.map((q, i) => `<div style="background:var(--bg); padding:15px; border-radius:12px; border:1px solid var(--border); margin-bottom:10px; font-weight:700;">${q}</div>`).join('');
    } else {
        addDiv.style.display = 'none';
        container.innerHTML = QUOTES_DB[id].map(q => `<div style="background:var(--bg); padding:15px; border-radius:12px; border:1px solid var(--border); margin-bottom:10px; font-weight:700;">${q}</div>`).join('');
    }
};

window.addMyQuote = () => {
    const inp = document.getElementById('newMyQuoteInput');
    if(inp && inp.value.trim()){ state.myQuotes.push(inp.value.trim()); inp.value=''; applyState(); selectLibCat('myQuotes', document.querySelector('.chip-btn:last-child')); }
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        if (QatraNative && !localStorage.getItem('perms_granted')) {
            const blocker = document.getElementById('permissionBlocker');
            if (blocker) blocker.style.display = 'flex';
        }
        
        document.getElementById('grantPermsBtn')?.addEventListener('click', () => {
            if(QatraNative) {
                QatraNative.askPermissions().then(() => { 
                    localStorage.setItem('perms_granted', 'true'); 
                    const blocker = document.getElementById('permissionBlocker');
                    if (blocker) blocker.style.display = 'none'; 
                }).catch(()=>{});
            } else {
                localStorage.setItem('perms_granted', 'true');
                const blocker = document.getElementById('permissionBlocker');
                if (blocker) blocker.style.display = 'none';
            }
        });

        document.querySelectorAll('.nav-item, .nav-home-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if(!btn.dataset.view) return;
                document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                document.querySelectorAll('.nav-item, .nav-home-btn').forEach(n => n.classList.remove('active'));
                const targetView = document.getElementById(btn.dataset.view);
                if (targetView) targetView.classList.add('active');
                btn.classList.add('active');
                if(btn.dataset.view === 'libraryView') renderLibraryCategories();
            });
        });

        const langSelect = document.getElementById('langSelect');
        if (langSelect) {
            langSelect.addEventListener('change', e => { 
                state.lang = e.target.value; 
                applyState(); 
                renderLibraryCategories(); 
            });
        }
        
        initPullToCloseSheets();
        initPullToRefresh();
        applyState();
    } catch (err) {
        console.error("Initialization error: ", err);
    } finally {
        // ضمان إزالة شاشة البداية مهما حدث لكي لا يعلق التطبيق أبداً
        setTimeout(() => { 
            const splash = document.getElementById('splash'); 
            if (splash) { 
                splash.style.opacity = '0'; 
                setTimeout(() => splash.remove(), 800); 
            } 
        }, 1500);
    }
});
