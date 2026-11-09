"use strict";
const STORE_KEY = "qatra_worldclass_final_5";

const DICT = {
ar: {
app_title: "قطرة | QATRA", moment_zen: "فاجئني", click_to_program: "بقطرة سينمائية",
next_drop: "قطرتك القادمة", today_impact: "أثر اليوم", drop_settings: "إعدادات قطرتي",
display_method: "طريقة العرض", mode_both: "تنبيه + قطرة مائية (شاشة وقفل)", mode_floating: "قطرة مائية فقط",
dur_5: "5 ثوانٍ", dur_10: "10 ثوانٍ", dur_15: "15 ثانية",
smart_schedule: "البرمجة الذكية", i_want: "أريد", drops_daily: "قطرات يومياً", from: "من", to: "إلى", apply_smart: "تطبيق البرمجة الذكية",
manual_schedule: "الجدولة اليدوية", custom_schedule: "تحديد ساعة الموعد:", save_schedule: "حفظ الموعد",
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
quote_of_day: "اقتباس اليوم", drops: "قطرة", your_progress: "نشاطك وتقدمك 📈"
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
    try { return (DICT[state.lang] && DICT[state.lang][key]) ? DICT[state.lang][key] : (DICT['ar'][key] || key); } catch(e) { return key; }
}

function applyState() {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(state));
        document.body.classList.toggle('dark-mode', state.dark);
        document.body.classList.toggle('glass-active', state.glass);
        
        document.querySelectorAll('[data-i18n]').forEach(el => { 
            const key = el.getAttribute('data-i18n');
            if (key) el.textContent = getTranslation(key); 
        });
        
        const hc = document.getElementById('homeCardsContainer');
        if(hc) hc.style.display = state.showHomeCards ? 'block' : 'none';

        const modeSel = document.getElementById('notifModeSetting');
        if(modeSel) modeSel.value = state.mode || 'both';
        
        document.querySelectorAll('.source-item').forEach(item => {
            if(item.dataset.value === state.quoteSource) item.classList.add('active');
            else item.classList.remove('active');
        });
        
        renderGarden();
        updateNextDropUI();
        renderScheduledList();
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

let swipeQuotes = [];
let currentQuoteIndex = 0;

window.initDiscoverSwipe = () => {
    const container = document.getElementById('swipeContainer');
    if (!container) return;
    
    let allQuotes = [];
    Object.values(QUOTES_DB).forEach(cat => allQuotes = allQuotes.concat(cat));
    if (state.myQuotes && state.myQuotes.length > 0) allQuotes = allQuotes.concat(state.myQuotes);
    swipeQuotes = allQuotes.sort(() => 0.5 - Math.random()).slice(0, 15);
    currentQuoteIndex = 0;
    
    container.innerHTML = '';
    renderSingleSwipeCard();
};

function renderSingleSwipeCard() {
    const container = document.getElementById('swipeContainer');
    if (!container) return;
    
    if (currentQuoteIndex >= swipeQuotes.length) {
        container.innerHTML = `<div style="color:var(--text-dim); padding:20px;">لقد اكتشفت جميع العبارات.</div>`;
        return;
    }

    const quote = swipeQuotes[currentQuoteIndex];
    const card = document.createElement('div');
    card.className = 'swipe-card';
    card.style.transform = `scale(1) translateY(0)`;
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
        card.style.transform = `translateX(${currentX}px) rotate(${rotateDeg}deg) scale(1.02)`;
    }, {passive: true});

    card.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');
        
        if (Math.abs(currentX) > 90) {
            const direction = currentX > 0 ? 1 : -1;
            card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            card.style.transform = `translateX(${direction * 400}px) rotate(${direction * 25}deg)`;
            card.style.opacity = 0;
            
            setTimeout(() => {
                card.remove();
                currentQuoteIndex++;
                renderSingleSwipeCard(); 
            }, 400);
        } else {
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = 'translateX(0) rotate(0deg) scale(1)';
        }
        currentX = 0;
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

window.showWebCinematicDrop = (qData) => {
    const overlay = document.getElementById('cinematicDropOverlay');
    const textEl = document.getElementById('cinematicQuoteText');
    const heartBtn = document.getElementById('cinematicHeartBtn');
    if(!overlay || !textEl || !heartBtn) return;

    textEl.innerText = qData.quote;
    heartBtn.classList.remove('liked');
    heartBtn.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" fill="none" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    
    heartBtn.onclick = (e) => {
        e.stopPropagation();
        if(heartBtn.classList.contains('liked')) return;
        heartBtn.classList.add('liked');
        heartBtn.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32" stroke="#FF3B30" fill="#FF3B30" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        state.stats.likes = (state.stats.likes || 0) + 1;
        applyState();
    };

    overlay.classList.add('show');
    
    setTimeout(() => overlay.classList.remove('show'), state.duration || 10000);
};

window.fireCinematic = async () => {
    try {
        const qData = getRandomQuote();
        state.stats.drops = (state.stats.drops || 0) + 1; 
        applyState();
        
        showWebCinematicDrop(qData); // ظهور داخل التطبيق للضمان
        
        if (QatraNative) {
            // إرسال أوامر التصميم القسري للإضافة (مربع، Blur، قلب)
            await QatraNative.showDrop({ 
                quote: qData.quote, category: qData.category, duration: state.duration, showImage: state.showImage,
                mode: state.mode, showOnLockScreen: true,
                design: { shape: "square", blur: true, blurRadius: 25, borderRadius: 35, showHeart: true, backgroundColor: "#73141928" }
            }).catch(()=>{});
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
            likeBtn.innerHTML = `<svg viewBox="0 0 24 24" width="34" height="34" stroke="currentColor" fill="none" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
            likeBtn.style.color = "var(--text-dim)";
            likeBtn.onclick = () => {
                likeBtn.style.color = "#FF3B30";
                likeBtn.style.transform = "scale(1.2)";
                likeBtn.innerHTML = `<svg viewBox="0 0 24 24" width="34" height="34" stroke="#FF3B30" fill="#FF3B30" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
                state.stats.likes = (state.stats.likes || 0) + 1; 
                applyState();
                setTimeout(() => likeBtn.style.transform = "scale(1)", 200);
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
        if(ndText) {
            if (state.schedules && state.schedules.length > 0) {
                ndText.innerText = `موعد نشط: ${state.schedules[state.schedules.length - 1].time}`;
            } else {
                ndText.innerText = getTranslation('no_reminders');
            }
        }
    } catch(e) {}
}

function syncNativeAlarms() {
    if(!QatraNative) return;
    const designPayload = { shape: "square", blur: true, blurRadius: 25, borderRadius: 35, showHeart: true, backgroundColor: "#73141928" };
    
    QatraNative.scheduleInterval({ 
        intervalMinutes: parseInt(state.interval), mode: state.mode, duration: state.duration, quote: getRandomQuote().quote, category: state.quoteSource, fullScreen: true, showImage: state.showImage, 
        showOnLockScreen: true, design: designPayload
    }).catch(()=>{});

    if (state.schedules && state.schedules.length > 0) {
        state.schedules.forEach(s => {
            const rq = getRandomQuote();
            QatraNative.schedule({
                id: s.id, time: s.time, days: s.days, mode: state.mode, duration: state.duration, 
                quote: rq.quote, category: rq.category, fullScreen: true, showImage: state.showImage, 
                showOnLockScreen: true, design: designPayload
            }).catch(()=>{});
        });
    }
}

// -------------------------------------------------------------
// محرك زمني داخلي صارم (Time Engine) لضمان نزول القطرة في الموعد المبرمج!
// -------------------------------------------------------------
setInterval(() => {
    const now = new Date();
    const currentH = now.getHours().toString().padStart(2, '0');
    const currentM = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${currentH}:${currentM}`;
    
    if (state.schedules && state.schedules.length > 0) {
        state.schedules.forEach(s => {
            if (s.time === timeString && s.lastTriggered !== timeString) {
                s.lastTriggered = timeString; // لمنع التكرار في نفس الدقيقة
                fireCinematic();
                applyState();
            }
        });
    }
}, 30000); // يفحص الوقت كل 30 ثانية لضمان الدقة المطلقة

document.getElementById('applySmartScheduleBtn')?.addEventListener('click', () => {
    try {
        const count = parseInt(document.getElementById('smartDropsCount').value) || 5;
        if (count > 0) {
            let sMins = 8 * 60; 
            let eMins = 22 * 60; 
            const intv = (eMins - sMins) / count;
            state.schedules = [];
            for(let i=0; i<count; i++) {
                let t = sMins + Math.round(i*intv);
                let h = Math.floor((t%1440)/60).toString().padStart(2,'0');
                let m = (t%60).toString().padStart(2,'0');
                state.schedules.push({ id: Date.now() + i, time: `${h}:${m}`, days: [0,1,2,3,4,5,6], lastTriggered: "" });
            }
            applyState();
            syncNativeAlarms(); // تفعيل فوري في النظام
            const tToast = document.getElementById('copyToast');
            if(tToast) { tToast.innerText = "تم تطبيق البرمجة الذكية بنجاح!"; tToast.classList.add('show'); setTimeout(()=>tToast.classList.remove('show'), 2500); }
        }
    } catch(e) {}
});

function renderScheduledList() {
    const listEl = document.getElementById('scheduledTimesList');
    if (!listEl) return;
    if (!state.schedules || state.schedules.length === 0) {
        listEl.innerHTML = ``;
        return;
    }
    listEl.innerHTML = state.schedules.map((s) => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg); border:
