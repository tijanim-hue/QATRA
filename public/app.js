"use strict";

const STORE_KEY = "qatra_worldclass_v3";

// === قاموس الترجمة الشامل ===
const DICT = {
  ar: {
    app_title: "قطرة | QATRA", pull_to_switch: "اسحب لتبديل المظهر", moment_zen: "لحظة وعي",
    click_to_program: "اضغط لبرمجة قطرتك", quote_of_day: "اقتباس اليوم", scheduled_reminders: "مواعيدك المبرمجة",
    no_reminders: "لا توجد مواعيد", drop_settings: "إعداد قطرتك", source_category: "1. مصدر العبارات",
    all_categories: "عشوائي (من كل الأقسام)", cat_dhikr: "أذكار وأدعية", cat_selfDev: "تطوير الذات",
    cat_quran: "آيات قرآنية", cat_culture: "ثقافة عامة وحكم", my_library: "مكتبتي الخاصة", my_library_title: "مكتبتي الخاصة",
    add_your_quotes: "أضف عباراتك الخاصة (حتى 50)", enter_quote: "أدخل عبارتك هنا...", add: "إضافة",
    display_method: "2. طريقة العرض وتفضيلاتك",
    mode_both: "تنبيه النظام + قطرة مائية (معاً)", mode_floating: "القطرة المائية فقط", mode_notification: "تنبيه النظام فقط",
    dur_5: "مدة القطرة: 5 ثوانٍ", dur_10: "مدة القطرة: 10 ثوانٍ", dur_15: "مدة القطرة: 15 ثانية",
    schedule_repeat: "3. جدولة المواعيد (تكرار مستمر)", stop_repeat: "إيقاف التكرار التلقائي", every_30: "كل 30 دقيقة",
    every_1h: "كل 1 ساعة", every_3h: "كل 3 ساعات", every_12h: "كل 12 ساعة", every_24h: "كل 24 ساعة",
    custom_schedule: "أو تحديد ساعة وأيام مخصصة:", save_schedule: "حفظ الموعد", quotes_library: "اقتباسات",
    explore_copy: "تصفح العبارات وانسخ ما يلهمك.", meditation: "تأمل واسترخاء", ready_relax: "استعد للهدوء",
    nature_quran: "أصوات طبيعة وقرآن مريح", play_now: "▶ تشغيل الآن", stop_now: "⏸ إيقاف", your_garden: "حديقتك",
    your_progress: "نشاطك وتقدمك 📈", usage_days: "أيام الاستخدام:", total_notifs: "الإشعارات النصية:",
    total_drops: "القطرات السينمائية:", close: "إغلاق", app_settings: "إعدادات التطبيق", glass_mode: "الشفافية وتأثير الزجاج 💎",
    show_image: "إظهار صورة مع العبارة 🖼️",
    language: "لغة التطبيق:", save_done: "تم وحفظ", back: "رجوع", copied: "تم النسخ بنجاح", delete: "حذف",
    days: "أيام", repeat_on: "تكرار مفعل", schedules_count: "مواعيد مبرمجة", choose_time: "الرجاء اختيار الوقت ويوم واحد على الأقل.",
    quotes_ready: "عبارة جاهزة"
  },
  en: {
    app_title: "Qatra | Drop", pull_to_switch: "Pull to switch theme", moment_zen: "Moment of Zen",
    click_to_program: "Tap to config Drop", quote_of_day: "Daily Quote", scheduled_reminders: "Your Reminders",
    no_reminders: "No scheduled reminders", drop_settings: "Drop Settings", source_category: "1. Quotes Source",
    all_categories: "Random (All categories)", cat_dhikr: "Dhikr & Supplications", cat_selfDev: "Self Development",
    cat_quran: "Quranic Verses", cat_culture: "Culture & Wisdom", my_library: "My Library", my_library_title: "My Custom Library",
    add_your_quotes: "Add your custom quotes (up to 50)", enter_quote: "Enter your quote here...", add: "Add",
    display_method: "2. Display Mode",
    mode_both: "Notification + Drop (Both)", mode_floating: "Floating Drop Only", mode_notification: "Notification Only",
    dur_5: "Duration: 5 Secs", dur_10: "Duration: 10 Secs", dur_15: "Duration: 15 Secs",
    schedule_repeat: "3. Auto Repeat", stop_repeat: "Stop Auto Repeat", every_30: "Every 30 Mins",
    every_1h: "Every 1 Hour", every_3h: "Every 3 Hours", every_12h: "Every 12 Hours", every_24h: "Every 24 Hours",
    custom_schedule: "Or Custom Time & Days:", save_schedule: "Save Schedule", quotes_library: "Quotes",
    explore_copy: "Explore and copy quotes.", meditation: "Meditation & Relax", ready_relax: "Ready to Relax",
    nature_quran: "Nature Sounds & Quran", play_now: "▶ Play Now", stop_now: "⏸ Stop", your_garden: "Your Garden",
    your_progress: "Your Progress 📈", usage_days: "Usage Days:", total_notifs: "Notifications:",
    total_drops: "Cinematic Drops:", close: "Close", app_settings: "App Settings", glass_mode: "Glass Effect 💎",
    show_image: "Show image with quote 🖼️",
    language: "App Language:", save_done: "Done", back: "Back", copied: "Copied Successfully", delete: "Delete",
    days: "days", repeat_on: "Repeat On", schedules_count: "scheduled", choose_time: "Please choose a time and day.",
    quotes_ready: "Quotes"
  },
  fr: {
    app_title: "Qatra | Goutte", pull_to_switch: "Tirez pour changer de thème", moment_zen: "Moment Zen",
    click_to_program: "Configurer la Goutte", quote_of_day: "Citation du Jour", scheduled_reminders: "Vos Rappels",
    no_reminders: "Aucun rappel", drop_settings: "Paramètres", source_category: "1. Source des citations",
    all_categories: "Aléatoire", cat_dhikr: "Dhikr & Invocations", cat_selfDev: "Développement Personnel",
    cat_quran: "Versets Coraniques", cat_culture: "Culture & Sagesse", my_library: "Ma Bibliothèque", my_library_title: "Ma Bibliothèque",
    add_your_quotes: "Ajoutez vos citations (jusqu'à 50)", enter_quote: "Entrez votre citation...", add: "Ajouter",
    display_method: "2. Mode d'affichage",
    mode_both: "Notification + Goutte (Les deux)", mode_floating: "Goutte Uniquement", mode_notification: "Notification Uniquement",
    dur_5: "Durée: 5 Sec", dur_10: "Durée: 10 Sec", dur_15: "Durée: 15 Sec",
    schedule_repeat: "3. Répétition Auto", stop_repeat: "Arrêter la Répétition", every_30: "Toutes les 30 Min",
    every_1h: "Chaque Heure", every_3h: "Toutes les 3 Heures", every_12h: "Toutes les 12 Heures", every_24h: "Toutes les 24 Heures",
    custom_schedule: "Ou Heure et Jours personnalisés:", save_schedule: "Enregistrer", quotes_library: "Citations",
    explore_copy: "Explorez et copiez.", meditation: "Méditation", ready_relax: "Prêt à se détendre",
    nature_quran: "Sons de la nature & Coran", play_now: "▶ Lire", stop_now: "⏸ Arrêter", your_garden: "Votre Jardin",
    your_progress: "Votre Progression 📈", usage_days: "Jours d'utilisation:", total_notifs: "Notifications:",
    total_drops: "Gouttes Cinématiques:", close: "Fermer", app_settings: "Paramètres", glass_mode: "Effet Verre 💎",
    show_image: "Afficher l'image avec citation 🖼️",
    language: "Langue:", save_done: "Terminé", back: "Retour", copied: "Copié avec succès", delete: "Supprimer",
    days: "jours", repeat_on: "Répétition activée", schedules_count: "programmés", choose_time: "Veuillez choisir une heure.",
    quotes_ready: "Citations"
  },
  es: {
    app_title: "Qatra | Gota", pull_to_switch: "Desliza para cambiar", moment_zen: "Momento Zen",
    click_to_program: "Configurar Gota", quote_of_day: "Cita del Día", scheduled_reminders: "Tus Recordatorios",
    no_reminders: "Sin recordatorios", drop_settings: "Configuración", source_category: "1. Fuente de Citas",
    all_categories: "Aleatorio", cat_dhikr: "Dhikr y Súplicas", cat_selfDev: "Desarrollo Personal",
    cat_quran: "Versículos Coránicos", cat_culture: "Cultura y Sabiduría", my_library: "Mi Biblioteca", my_library_title: "Mi Biblioteca",
    add_your_quotes: "Añade tus citas (hasta 50)", enter_quote: "Introduce tu cita...", add: "Añadir",
    display_method: "2. Modo de visualización",
    mode_both: "Notificación + Gota (Ambos)", mode_floating: "Solo Gota", mode_notification: "Solo Notificación",
    dur_5: "Duración: 5 Seg", dur_10: "Duración: 10 Seg", dur_15: "Duración: 15 Seg",
    schedule_repeat: "3. Repetición Automática", stop_repeat: "Detener Repetición", every_30: "Cada 30 Min",
    every_1h: "Cada Hora", every_3h: "Cada 3 Horas", every_12h: "Cada 12 Horas", every_24h: "Cada 24 Horas",
    custom_schedule: "O Hora Personalizada:", save_schedule: "Guardar", quotes_library: "Citas",
    explore_copy: "Explora y copia.", meditation: "Meditación", ready_relax: "Listo para relajar",
    nature_quran: "Sonidos naturales", play_now: "▶ Reproducir", stop_now: "⏸ Detener", your_garden: "Tu Jardín",
    your_progress: "Tu Progreso 📈", usage_days: "Días de uso:", total_notifs: "Notificaciones:",
    total_drops: "Gotas Cinemáticas:", close: "Cerrar", app_settings: "Ajustes", glass_mode: "Efecto Cristal 💎",
    show_image: "Mostrar imagen con cita 🖼️",
    language: "Idioma:", save_done: "Hecho", back: "Volver", copied: "Copiado exitosamente", delete: "Borrar",
    days: "días", repeat_on: "Repetición Activada", schedules_count: "programados", choose_time: "Por favor elige la hora.",
    quotes_ready: "Citas"
  },
  de: {
    app_title: "Qatra | Tropfen", pull_to_switch: "Ziehen für Thema", moment_zen: "Zen Moment",
    click_to_program: "Tropfen konfigurieren", quote_of_day: "Zitat des Tages", scheduled_reminders: "Ihre Erinnerungen",
    no_reminders: "Keine Erinnerungen", drop_settings: "Einstellungen", source_category: "1. Zitatquelle",
    all_categories: "Zufällig", cat_dhikr: "Dhikr & Bittgebete", cat_selfDev: "Selbstentwicklung",
    cat_quran: "Koranverse", cat_culture: "Kultur & Weisheit", my_library: "Meine Bibliothek", my_library_title: "Meine Bibliothek",
    add_your_quotes: "Eigene Zitate (bis 50)", enter_quote: "Zitat eingeben...", add: "Hinzufügen",
    display_method: "2. Anzeigemodus",
    mode_both: "Benachrichtigung + Tropfen", mode_floating: "Nur Tropfen", mode_notification: "Nur Benachrichtigung",
    dur_5: "Dauer: 5 Sek", dur_10: "Dauer: 10 Sek", dur_15: "Dauer: 15 Sek",
    schedule_repeat: "3. Auto-Wiederholung", stop_repeat: "Wiederholung stoppen", every_30: "Alle 30 Min",
    every_1h: "Jede Stunde", every_3h: "Alle 3 Stunden", every_12h: "Alle 12 Stunden", every_24h: "Alle 24 Stunden",
    custom_schedule: "Oder Eigene Zeit:", save_schedule: "Speichern", quotes_library: "Zitate",
    explore_copy: "Erkunden und kopieren.", meditation: "Meditation", ready_relax: "Bereit zum Entspannen",
    nature_quran: "Naturgeräusche", play_now: "▶ Abspielen", stop_now: "⏸ Stoppen", your_garden: "Dein Garten",
    your_progress: "Dein Fortschritt 📈", usage_days: "Nutzungstage:", total_notifs: "Benachrichtigungen:",
    total_drops: "Tropfen:", close: "Schließen", app_settings: "Einstellungen", glass_mode: "Glaseffekt 💎",
    show_image: "Bild mit Zitat anzeigen 🖼️",
    language: "Sprache:", save_done: "Fertig", back: "Zurück", copied: "Erfolgreich kopiert", delete: "Löschen",
    days: "Tage", repeat_on: "Wiederholen ein", schedules_count: "geplant", choose_time: "Bitte wählen Sie eine Zeit.",
    quotes_ready: "Zitate"
  }
};

// توليد مكتبة ضخمة (100 عنصر لكل قسم)
const generateArray = (base, count) => Array.from({length: count}, (_, i) => `${base} ${i+1}`);
const QUOTES_DB = {
  dhikr: { key: "cat_dhikr", icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني.", "يا حي يا قيوم برحمتك أستغيث.", ...generateArray("دعاء مخصص للسكينة والتوكل رقم", 96)] },
  selfDev: { key: "cat_selfDev", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', items: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.", "القليل المستمر يصنع أثرًا عميقًا.", ...generateArray("فكرة وخطوة في تطوير الذات رقم", 97)] },
  quran: { key: "cat_quran", icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', items: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "إِنَّ مَعَ الْعُسْرِ يُسْرًا", "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", ...generateArray("آية قرآنية كريمة للتأمل رقم", 97)] },
  culture: { key: "cat_culture", icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>', items: ["الوقت كالسيف إن لم تقطعه قطعك.", "العقل السليم في الجسم السليم.", ...generateArray("حكمة ومعلومة عامة رقم", 98)] }
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  lang: 'ar', dark: true, glass: true, mode: 'both', duration: 10000, interval: '0',
  quoteSource: 'all', customQuotes: ["مرحباً بك في قطرة. هذه عبارتك الأولى في مكتبتك."], 
  schedules: [], stats: { drops: 0, notifs: 0, days: 1 },
  showImage: false // الوضع الافتراضي كما طلبت (بدون صورة)
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;

function getTranslation(key) { return DICT[state.lang][key] || key; }

// دالة الحماية
function safeOn(id, eventType, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(eventType, handler);
}

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  if (state.dark) { document.body.classList.add('dark-mode'); }
  else { document.body.classList.remove('dark-mode'); }
  document.body.classList.toggle('glass-active', state.glass);
  
  // تطبيق اتجاه اللغة
  document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
  document.documentElement.lang = state.lang;
  
  // ترجمة جميع النصوص
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (DICT[state.lang][key]) el.textContent = DICT[state.lang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (DICT[state.lang][key]) el.placeholder = DICT[state.lang][key];
  });

  const c = (id, val) => { const el = document.getElementById(id); if(el) el.checked = val; };
  const s = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };

  c('glassToggle', state.glass);
  c('imageToggle', state.showImage);
  s('langSelect', state.lang);
  s('notifModeSetting', state.mode); 
  s('dropDurationSetting', state.duration); 
  s('intervalSelect', state.interval);
  
  // تحديث شكل القائمة الراديو
  document.querySelectorAll('.custom-radio-item').forEach(item => {
    if(item.dataset.value === state.quoteSource) item.classList.add('active');
    else item.classList.remove('active');
  });

  const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
  setTxt('statDrops', state.stats.drops);
  setTxt('statNotifs', state.stats.notifs);
  setTxt('statDays', state.stats.days);

  renderCategories(); renderGarden(); renderSchedules(); renderMyLibrary();
}

// تغيير اللغة والمصدر وإظهار الصورة
safeOn('langSelect', 'change', e => { state.lang = e.target.value; applyState(); syncNativeAlarms(); });
safeOn('imageToggle', 'change', e => { state.showImage = e.target.checked; applyState(); syncNativeAlarms(); });
window.setQuoteSource = (source) => { state.quoteSource = source; applyState(); syncNativeAlarms(); };

// --- مكتبتي الخاصة (إضافة وحذف العبارات المخصصة) ---
function renderMyLibrary() {
  const list = document.getElementById('myLibraryList');
  const countTxt = document.getElementById('myLibraryCount');
  if(!list || !countTxt) return;
  
  countTxt.innerText = `العبارات المضافة: ${state.customQuotes.length} / 50`;
  list.innerHTML = state.customQuotes.map((q, i) => `
    <div class="my-quote-item">
      <div style="flex:1; margin-inline-end:10px; font-weight:600; line-height:1.5;">${q}</div>
      <button class="delete-btn" onclick="deleteCustomQuote(${i})">${getTranslation('delete')}</button>
    </div>
  `).join('');
}

safeOn('addQuoteBtn', 'click', () => {
  const input = document.getElementById('newQuoteInput');
  const txt = input.value.trim();
  if (txt !== "" && state.customQuotes.length < 50) {
    state.customQuotes.push(txt);
    input.value = "";
    applyState(); syncNativeAlarms();
  } else if (state.customQuotes.length >= 50) {
    alert("لقد وصلت للحد الأقصى (50 عبارة). احذف بعض العبارات لإضافة المزيد.");
  }
});

window.deleteCustomQuote = (i) => {
  state.customQuotes.splice(i, 1);
  applyState(); syncNativeAlarms();
};


// --- الأيام والمواعيد ---
const WEEK_DAYS = {
  ar: [{id:0,n:"أحد"},{id:1,n:"إثن"},{id:2,n:"ثلا"},{id:3,n:"أرب"},{id:4,n:"خمي"},{id:5,n:"جمع"},{id:6,n:"سبت"}],
  en: [{id:0,n:"Sun"},{id:1,n:"Mon"},{id:2,n:"Tue"},{id:3,n:"Wed"},{id:4,n:"Thu"},{id:5,n:"Fri"},{id:6,n:"Sat"}],
  fr: [{id:0,n:"Dim"},{id:1,n:"Lun"},{id:2,n:"Mar"},{id:3,n:"Mer"},{id:4,n:"Jeu"},{id:5,n:"Ven"},{id:6,n:"Sam"}],
  es: [{id:0,n:"Dom"},{id:1,n:"Lun"},{id:2,n:"Mar"},{id:3,n:"Mié"},{id:4,n:"Jue"},{id:5,n:"Vie"},{id:6,n:"Sáb"}],
  de: [{id:0,n:"Son"},{id:1,n:"Mon"},{id:2,n:"Die"},{id:3,n:"Mit"},{id:4,n:"Don"},{id:5,n:"Fre"},{id:6,n:"Sam"}]
};
let currentSelectedDays = new Set([0,1,2,3,4,5,6]);

function renderDaysGrid() {
  const dg = document.getElementById('daysGrid');
  if(dg) {
    const daysArr = WEEK_DAYS[state.lang] || WEEK_DAYS['en'];
    dg.innerHTML = daysArr.map(d =>
      `<div class="day-chip ${currentSelectedDays.has(d.id)?'active':''}" onclick="toggleDay(${d.id})">${d.n}</div>`
    ).join('');
  }
}
window.toggleDay = (id) => { currentSelectedDays.has(id) ? currentSelectedDays.delete(id) : currentSelectedDays.add(id); renderDaysGrid(); };

// --- الحديقة (الجوائز) ---
const GARDEN = [
  { max: 5, emoji: '🌱' }, { max: 20, emoji: '🌿' }, { max: 50, emoji: '🪴' },
  { max: 100, emoji: '🌳' }, { max: 200, emoji: '🌸' }, { max: 9999, emoji: '🌲' }
];
const gardenNames = {ar: ['بذرة النوايا','برعم التغيير','نبتة الإصرار','شجرة المعرفة','شجرة مزدهرة','غابة الحكمة'], en: ['Seed of Intention','Sprout of Change','Plant of Persistence','Tree of Knowledge','Blooming Tree','Forest of Wisdom'], fr: ['Graine d\'Intention','Pousse de Changement','Plante de Persistance','Arbre de la Connaissance','Arbre en Fleurs','Forêt de la Sagesse'], es: ['Semilla de Intención','Brote de Cambio','Planta de Persistencia','Árbol del Conocimiento','Árbol Floreciente','Bosque de Sabiduría'], de: ['Samen der Absicht','Spross der Veränderung','Pflanze der Beharrlichkeit','Baum des Wissens','Blühender Baum','Wald der Weisheit']};
const gardenDescs = {ar: ['كل قطرة تسقي بها روحك تنبت بذرة.','بداية جميلة، استمر!','جذورك تزداد قوة.','أصبحت تستظل بوعيك.','أثمرت جهودك نوراً.','أنت تزرع أرضاً من الوعي.'], en: ['Every drop grows a seed.','Great start, keep going!','Your roots are growing stronger.','Basking in your awareness.','Your efforts are bearing light.','You are planting a land of awareness.'], fr: ['Chaque goutte fait pousser une graine.','Bon début, continuez!','Vos racines se renforcent.','Vous vous prélassez dans la conscience.','Vos efforts portent de la lumière.','Vous plantez une terre de conscience.'], es: ['Cada gota hace crecer una semilla.','¡Buen comienzo, sigue así!','Tus raíces se están fortaleciendo.','Disfrutando de tu conciencia.','Tus esfuerzos dan luz.','Estás plantando una tierra de conciencia.'], de: ['Jeder Tropfen lässt einen Samen wachsen.','Toller Start, mach weiter!','Deine Wurzeln werden stärker.','Du sonnst dich in deinem Bewusstsein.','Deine Bemühungen bringen Licht.','Du pflanzt ein Land des Bewusstseins.']};

function renderGarden() {
  const drops = state.stats.drops;
  let idx = 0; let nextGoal = 5;
  for (let i = 0; i < GARDEN.length; i++) {
    if (drops < GARDEN[i].max) { idx = i; nextGoal = GARDEN[i].max; break; }
  }
  const lang = state.lang || 'en';
  
  const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
  setTxt('treeEmoji', GARDEN[idx].emoji);
  setTxt('treeLevelName', gardenNames[lang][idx]);
  setTxt('treeDesc', gardenDescs[lang][idx]);
  setTxt('treeStats', `${getTranslation('total_drops')} ${drops} / ${nextGoal}`);

  const prevMax = idx === 0 ? 0 : GARDEN[idx-1].max;
  const progress = ((drops - prevMax) / (nextGoal - prevMax)) * 100;
  const progEl = document.getElementById('treeProgress');
  if(progEl) progEl.style.width = `${progress}%`;
}

// --- المكتبة (للقراءة والنسخ فقط) ---
function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if(!container) return;
  container.innerHTML = Object.keys(QUOTES_DB).map(key => {
    const cat = QUOTES_DB[key];
    const title = getTranslation(cat.key);
    return `<div class="glass-card action-card" onclick="openCategory('${key}')">
      <div class="card-icon"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${cat.icon}</svg></div>
      <div class="card-info">
        <div class="card-title">${title}</div>
        <div class="card-sub">${cat.items.length} ${getTranslation('quotes_ready')}</div>
      </div>
      <div style="color:var(--border); font-size:26px; font-weight:bold;">›</div>
    </div>`;
  }).join('');
}

window.openCategory = (id) => {
  const cat = QUOTES_DB[id];
  const titleEl = document.getElementById('catSheetTitle');
  if (titleEl) titleEl.innerText = getTranslation(cat.key);

  const content = document.getElementById('catSheetContent');
  if(content) {
      // إتاحة النسخ بدلاً من الاختيار
      content.innerHTML = cat.items.slice(0, 50).map(q => {
        return `<div style="display:flex; align-items:center; justify-content:space-between; gap:14px; padding:18px 0; border-bottom:1px solid var(--border);">
          <div style="font-size:15px; font-weight:700;">${q}</div>
          <button onclick="copyQuote('${q.replace(/'/g, "\\'")}')" style="background:color-mix(in srgb, var(--primary) 10%, transparent); border:none; padding:10px; border-radius:12px; color:var(--primary); cursor:pointer;">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>`;
      }).join('');
  }
  const sheet = document.getElementById('categorySheet');
  if(sheet) sheet.classList.add('show');
};

window.copyQuote = (txt) => {
  navigator.clipboard.writeText(txt).then(() => {
    const toast = document.getElementById('copyToast');
    if(toast) {
      toast.textContent = getTranslation('copied');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }
  });
};

// --- القطرة والمواعيد ---
function getRandomQuote() {
  let pool = [];
  let categoryKey = state.quoteSource;

  if (state.quoteSource === 'all') {
    const keys = Object.keys(QUOTES_DB);
    categoryKey = keys[Math.floor(Math.random() * keys.length)];
    pool = QUOTES_DB[categoryKey].items;
  } else if (state.quoteSource === 'myLibrary') {
    pool = state.customQuotes.length > 0 ? state.customQuotes : ["أضف عبارات في مكتبتك الخاصة"];
  } else {
    pool = QUOTES_DB[state.quoteSource].items;
  }

  const quote = pool[Math.floor(Math.random() * pool.length)];
  return { quote, categoryKey };
}

// دالة القطرة السينمائية (تحديث: تمرير خيار إظهار الصورة)
window.fireCinematic = async () => {
  const { quote, categoryKey } = getRandomQuote();
  const qtEl = document.getElementById('dailyQuoteText');
  if (qtEl) qtEl.textContent = `"${quote}"`;

  if (QatraNative) {
    state.stats.drops++; applyState();
    await QatraNative.showDrop({ quote: quote, category: categoryKey, duration: state.duration, fullScreen: true, showImage: state.showImage }).catch(e=>{});
  }
};

function renderSchedules() {
  const list = document.getElementById('savedSchedulesList');
  if(!list) return;
  list.innerHTML = state.schedules.map((s, i) =>
    `<div class="modern-row" style="background:var(--bg); padding:18px; border-radius:18px; margin-bottom:12px; border:1px solid var(--border);">
      <strong style="font-size:18px;">${s.time} <span style="font-size:11px;color:var(--text-dim); margin-inline-start:8px;">(${s.days.length} ${getTranslation('days')})</span></strong>
      <button onclick="deleteSchedule(${i})" style="background:rgba(255,0,0,0.1); border:none; color:#ff4d4d; font-weight:bold; cursor:pointer; padding:8px 16px; border-radius:10px;">${getTranslation('delete')}</button>
    </div>`
  ).join('');

  const txt = document.getElementById('nextReminderText');
  if(txt) {
    if(state.interval !== '0') txt.innerText = `${getTranslation('repeat_on')} (${state.interval})`;
    else if(state.schedules.length > 0) txt.innerText = `${state.schedules.length} ${getTranslation('schedules_count')}`;
    else txt.innerText = getTranslation('no_reminders');
  }
}

window.deleteSchedule = (i) => {
  if(QatraNative && state.schedules[i]) QatraNative.cancel({id: state.schedules[i].id}).catch(e=>{});
  state.schedules.splice(i,1); applyState(); renderSchedules(); syncNativeAlarms();
};

function syncNativeAlarms() {
  if(!QatraNative) return;
  const { quote, categoryKey } = getRandomQuote();
  QatraNative.scheduleInterval({ intervalMinutes: parseInt(state.interval), mode: state.mode, duration: state.duration, quote: quote, category: categoryKey, fullScreen: true, showImage: state.showImage }).catch(e=>{});
  
  state.schedules.forEach(s => {
    const rQuote = getRandomQuote();
    QatraNative.schedule({id: s.id, time: s.time, days: s.days, mode: state.mode, duration: state.duration, quote: rQuote.quote, category: rQuote.categoryKey, fullScreen: true, showImage: state.showImage}).catch(e=>{});
  });
}

// --- التأمل ---
const randomAudios = ["https://actions.google.com/sounds/v1/water/rain_on_roof.ogg", "https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg", "https://server8.mp3quran.net/afs/001.mp3"];
let randPlayer = new Audio(); let isRandPlaying = false;

// =======================================================
// تهيئة التطبيق عند البداية
// =======================================================
document.addEventListener('DOMContentLoaded', () => {

  // تشغيل صوت سحري رائع عند الإقلاع
  try {
    const splashAudio = new Audio("https://actions.google.com/sounds/v1/magic/magic_chime.ogg");
    splashAudio.play().catch(() => {});
  } catch(e) {}

  if (QatraNative) { 
      QatraNative.askPermissions().catch(e => console.log(e)); 
  }

  safeOn('glassToggle', 'change', e => { state.glass = e.target.checked; applyState(); });
  safeOn('notifModeSetting', 'change', e => { state.mode = e.target.value; applyState(); syncNativeAlarms(); });
  safeOn('dropDurationSetting', 'change', e => { state.duration = parseInt(e.target.value); applyState(); syncNativeAlarms(); });
  safeOn('intervalSelect', 'change', e => { state.interval = e.target.value; applyState(); syncNativeAlarms(); renderSchedules(); });

  safeOn('saveScheduleBtn', 'click', () => {
    const tEl = document.getElementById('customTime');
    if(!tEl) return;
    const t = tEl.value;
    if(t && currentSelectedDays.size > 0) {
      state.schedules.push({id: Math.floor(Math.random()*10000), time: t, days: Array.from(currentSelectedDays)});
      applyState(); renderSchedules(); syncNativeAlarms();
    } else {
      alert(getTranslation('choose_time'));
    }
  });

  safeOn('playAudioBtn', 'click', () => {
    const btn = document.getElementById('playAudioBtn');
    const status = document.getElementById('audioStatus');
    if (isRandPlaying) {
      randPlayer.pause(); isRandPlaying = false;
      if(btn) btn.textContent = getTranslation('play_now');
      if(status) status.textContent = getTranslation('ready_relax');
    } else {
      randPlayer.src = randomAudios[Math.floor(Math.random() * randomAudios.length)];
      randPlayer.play(); isRandPlaying = true;
      if(btn) btn.textContent = getTranslation('stop_now');
      if(status) status.textContent = "جارٍ الاسترخاء...";
    }
  });

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

  // السحب لتغيير المظهر
  let startY = 0;
  const scrollContent = document.getElementById('scrollContent');
  const ptrContainer = document.getElementById('ptrContainer');
  const ptrIcon = document.getElementById('ptrIcon');

  if(scrollContent && ptrContainer && ptrIcon) {
    scrollContent.addEventListener('touchstart', e => { if(scrollContent.scrollTop === 0) startY = e.touches[0].clientY; }, {passive:true});
    scrollContent.addEventListener('touchmove', e => {
      if (startY > 0 && scrollContent.scrollTop === 0) {
        let y = e.touches[0].clientY - startY;
        if (y > 20 && y < 100) { ptrContainer.style.transform = `translateY(${y - 70}px)`; ptrIcon.style.transform = `rotate(${y*4}deg)`; }
      }
    }, {passive:true});
    scrollContent.addEventListener('touchend', e => {
      if (startY > 0 && scrollContent.scrollTop === 0) {
        let y = e.changedTouches[0].clientY - startY;
        if (y > 70) {
          ptrIcon.classList.add('spin');
          state.dark = !state.dark;
          applyState();
          setTimeout(() => { ptrContainer.style.transform = `translateY(-100%)`; ptrIcon.classList.remove('spin'); }, 600);
        } else {
          ptrContainer.style.transform = `translateY(-100%)`;
        }
      }
      startY = 0;
    }, {passive:true});
  }

  applyState(); renderSchedules(); renderDaysGrid();
  const qtEl = document.getElementById('dailyQuoteText');
  if(qtEl) qtEl.textContent = `"${getRandomQuote().quote}"`;

  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(() => splash.remove(), 800);
    }
  }, 2500);
});
