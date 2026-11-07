"use strict";

const STORE_KEY = "qatra_worldclass_v4";

// === قاموس الترجمة الشامل ===
const DICT = {
  ar: {
    app_title: "قطرة | QATRA", pull_to_switch: "اسحب لتبديل المظهر", moment_zen: "لحظة وعي",
    click_to_program: "اضغط لبرمجة قطرتك", quote_of_day: "اقتباس اليوم", scheduled_reminders: "مواعيدك المبرمجة",
    no_reminders: "لا توجد مواعيد", drop_settings: "إعداد قطرتك", source_category: "1. مصدر العبارات",
    all_categories: "عشوائي (من كل الأقسام)", cat_dhikr: "أذكار وأدعية", cat_selfDev: "تطوير الذات",
    cat_quran: "آيات قرآنية", cat_culture: "ثقافة عامة وحكم", my_library: "مكتبتي الخاصة", display_method: "2. طريقة العرض وتفضيلاتك",
    mode_both: "تنبيه النظام + قطرة مائية (معاً)", mode_floating: "القطرة المائية فقط", mode_notification: "تنبيه النظام فقط",
    dur_5: "مدة القطرة: 5 ثوانٍ", dur_10: "مدة القطرة: 10 ثوانٍ", dur_15: "مدة القطرة: 15 ثانية",
    schedule_repeat: "3. جدولة المواعيد (تكرار مستمر)", stop_repeat: "إيقاف التكرار التلقائي", every_30: "كل 30 دقيقة",
    every_1h: "كل 1 ساعة", every_3h: "كل 3 ساعات", every_12h: "كل 12 ساعة", every_24h: "كل 24 ساعة",
    custom_schedule: "أو تحديد ساعة وأيام مخصصة:", save_schedule: "حفظ الموعد", quotes_library: "اقتباسات",
    explore_copy: "تصفح العبارات وانسخ ما يلهمك.", my_library_title: "مكتبتي الخاصة", add_your_quotes: "أضف عباراتك الخاصة (حتى 50)",
    meditation: "تأمل واسترخاء", ready_relax: "استعد للهدوء",
    nature_quran: "أصوات طبيعة وقرآن مريح", play_now: "▶ تشغيل الآن", stop_now: "⏸ إيقاف", your_garden: "حديقتك",
    your_progress: "نشاطك وتقدمك 📈", usage_days: "أيام الاستخدام:", total_notifs: "الإشعارات النصية:",
    total_drops: "القطرات السينمائية:", close: "إغلاق", app_settings: "إعدادات التطبيق", glass_mode: "الشفافية وتأثير الزجاج 💎",
    language: "لغة التطبيق:", save_done: "تم وحفظ", back: "رجوع", copied: "تم النسخ بنجاح", delete: "حذف",
    days: "أيام", repeat_on: "تكرار مفعل", schedules_count: "مواعيد مبرمجة", choose_time: "الرجاء اختيار الوقت ويوم واحد على الأقل.",
    quotes_ready: "عبارة جاهزة", enter_quote: "أدخل عبارتك هنا...", add: "إضافة", quote_added: "تمت الإضافة", quote_deleted: "تم الحذف", limit_reached: "لقد وصلت للحد الأقصى (50 عبارة)", empty_library: "لا توجد عبارات في مكتبتك. سيتم عرض اقتباسات عشوائية.", added_quotes_count: "العبارات المضافة: "
  },
  en: {
    app_title: "Qatra | Drop", pull_to_switch: "Pull to switch theme", moment_zen: "Moment of Zen",
    click_to_program: "Tap to config Drop", quote_of_day: "Daily Quote", scheduled_reminders: "Your Reminders",
    no_reminders: "No scheduled reminders", drop_settings: "Drop Settings", source_category: "1. Quotes Source",
    all_categories: "Random (All categories)", cat_dhikr: "Dhikr & Supplications", cat_selfDev: "Self Development",
    cat_quran: "Quranic Verses", cat_culture: "Culture & Wisdom", my_library: "My Library", display_method: "2. Display Mode",
    mode_both: "Notification + Drop (Both)", mode_floating: "Floating Drop Only", mode_notification: "Notification Only",
    dur_5: "Duration: 5 Secs", dur_10: "Duration: 10 Secs", dur_15: "Duration: 15 Secs",
    schedule_repeat: "3. Auto Repeat", stop_repeat: "Stop Auto Repeat", every_30: "Every 30 Mins",
    every_1h: "Every 1 Hour", every_3h: "Every 3 Hours", every_12h: "Every 12 Hours", every_24h: "Every 24 Hours",
    custom_schedule: "Or Custom Time & Days:", save_schedule: "Save Schedule", quotes_library: "Quotes",
    explore_copy: "Explore and copy quotes.", my_library_title: "My Library", add_your_quotes: "Add your quotes (up to 50)",
    meditation: "Meditation & Relax", ready_relax: "Ready to Relax",
    nature_quran: "Nature Sounds & Quran", play_now: "▶ Play Now", stop_now: "⏸ Stop", your_garden: "Your Garden",
    your_progress: "Your Progress 📈", usage_days: "Usage Days:", total_notifs: "Notifications:",
    total_drops: "Cinematic Drops:", close: "Close", app_settings: "App Settings", glass_mode: "Glass Effect 💎",
    language: "App Language:", save_done: "Done", back: "Back", copied: "Copied Successfully", delete: "Delete",
    days: "days", repeat_on: "Repeat On", schedules_count: "scheduled", choose_time: "Please choose a time and day.",
    quotes_ready: "Quotes", enter_quote: "Enter your quote here...", add: "Add", quote_added: "Added", quote_deleted: "Deleted", limit_reached: "You reached the limit (50 quotes)", empty_library: "Your library is empty. Random quotes will be shown.", added_quotes_count: "Added quotes: "
  },
  fr: {
    app_title: "Qatra | Goutte", pull_to_switch: "Tirez pour changer de thème", moment_zen: "Moment Zen",
    click_to_program: "Configurer la Goutte", quote_of_day: "Citation du Jour", scheduled_reminders: "Vos Rappels",
    no_reminders: "Aucun rappel", drop_settings: "Paramètres", source_category: "1. Source des citations",
    all_categories: "Aléatoire", cat_dhikr: "Dhikr & Invocations", cat_selfDev: "Développement Personnel",
    cat_quran: "Versets Coraniques", cat_culture: "Culture & Sagesse", my_library: "Ma Bibliothèque", display_method: "2. Mode d'affichage",
    mode_both: "Notification + Goutte (Les deux)", mode_floating: "Goutte Uniquement", mode_notification: "Notification Uniquement",
    dur_5: "Durée: 5 Sec", dur_10: "Durée: 10 Sec", dur_15: "Durée: 15 Sec",
    schedule_repeat: "3. Répétition Auto", stop_repeat: "Arrêter la Répétition", every_30: "Toutes les 30 Min",
    every_1h: "Chaque Heure", every_3h: "Toutes les 3 Heures", every_12h: "Toutes les 12 Heures", every_24h: "Toutes les 24 Heures",
    custom_schedule: "Ou Heure et Jours personnalisés:", save_schedule: "Enregistrer", quotes_library: "Citations",
    explore_copy: "Explorez et copiez.", my_library_title: "Ma Bibliothèque", add_your_quotes: "Ajoutez vos citations (max 50)",
    meditation: "Méditation", ready_relax: "Prêt à se détendre",
    nature_quran: "Sons de la nature & Coran", play_now: "▶ Lire", stop_now: "⏸ Arrêter", your_garden: "Votre Jardin",
    your_progress: "Votre Progression 📈", usage_days: "Jours d'utilisation:", total_notifs: "Notifications:",
    total_drops: "Gouttes Cinématiques:", close: "Fermer", app_settings: "Paramètres", glass_mode: "Effet Verre 💎",
    language: "Langue:", save_done: "Terminé", back: "Retour", copied: "Copié avec succès", delete: "Supprimer",
    days: "jours", repeat_on: "Répétition activée", schedules_count: "programmés", choose_time: "Veuillez choisir une heure.",
    quotes_ready: "Citations", enter_quote: "Entrez votre citation...", add: "Ajouter", quote_added: "Ajouté", quote_deleted: "Supprimé", limit_reached: "Limite atteinte (50)", empty_library: "Bibliothèque vide. Citations aléatoires.", added_quotes_count: "Citations ajoutées: "
  },
  es: {
    app_title: "Qatra | Gota", pull_to_switch: "Desliza para cambiar", moment_zen: "Momento Zen",
    click_to_program: "Configurar Gota", quote_of_day: "Cita del Día", scheduled_reminders: "Tus Recordatorios",
    no_reminders: "Sin recordatorios", drop_settings: "Configuración", source_category: "1. Fuente de Citas",
    all_categories: "Aleatorio", cat_dhikr: "Dhikr y Súplicas", cat_selfDev: "Desarrollo Personal",
    cat_quran: "Versículos Coránicos", cat_culture: "Cultura y Sabiduría", my_library: "Mi Biblioteca", display_method: "2. Modo de visualización",
    mode_both: "Notificación + Gota (Ambos)", mode_floating: "Solo Gota", mode_notification: "Solo Notificación",
    dur_5: "Duración: 5 Seg", dur_10: "Duración: 10 Seg", dur_15: "Duración: 15 Seg",
    schedule_repeat: "3. Repetición Automática", stop_repeat: "Detener Repetición", every_30: "Cada 30 Min",
    every_1h: "Cada Hora", every_3h: "Cada 3 Horas", every_12h: "Cada 12 Horas", every_24h: "Cada 24 Horas",
    custom_schedule: "O Hora Personalizada:", save_schedule: "Guardar", quotes_library: "Citas",
    explore_copy: "Explora y copia.", my_library_title: "Mi Biblioteca", add_your_quotes: "Añade tus citas (hasta 50)",
    meditation: "Meditación", ready_relax: "Listo para relajar",
    nature_quran: "Sonidos naturales", play_now: "▶ Reproducir", stop_now: "⏸ Detener", your_garden: "Tu Jardín",
    your_progress: "Tu Progreso 📈", usage_days: "Días de uso:", total_notifs: "Notificaciones:",
    total_drops: "Gotas Cinemáticas:", close: "Cerrar", app_settings: "Ajustes", glass_mode: "Efecto Cristal 💎",
    language: "Idioma:", save_done: "Hecho", back: "Volver", copied: "Copiado exitosamente", delete: "Borrar",
    days: "días", repeat_on: "Repetición Activada", schedules_count: "programados", choose_time: "Por favor elige la hora.",
    quotes_ready: "Citas", enter_quote: "Ingresa tu cita...", add: "Añadir", quote_added: "Añadido", quote_deleted: "Borrado", limit_reached: "Límite alcanzado (50)", empty_library: "Biblioteca vacía. Citas aleatorias.", added_quotes_count: "Citas añadidas: "
  },
  de: {
    app_title: "Qatra | Tropfen", pull_to_switch: "Ziehen für Thema", moment_zen: "Zen Moment",
    click_to_program: "Tropfen konfigurieren", quote_of_day: "Zitat des Tages", scheduled_reminders: "Ihre Erinnerungen",
    no_reminders: "Keine Erinnerungen", drop_settings: "Einstellungen", source_category: "1. Zitatquelle",
    all_categories: "Zufällig", cat_dhikr: "Dhikr & Bittgebete", cat_selfDev: "Selbstentwicklung",
    cat_quran: "Koranverse", cat_culture: "Kultur & Weisheit", my_library: "Meine Bibliothek", display_method: "2. Anzeigemodus",
    mode_both: "Benachrichtigung + Tropfen", mode_floating: "Nur Tropfen", mode_notification: "Nur Benachrichtigung",
    dur_5: "Dauer: 5 Sek", dur_10: "Dauer: 10 Sek", dur_15: "Dauer: 15 Sek",
    schedule_repeat: "3. Auto-Wiederholung", stop_repeat: "Wiederholung stoppen", every_30: "Alle 30 Min",
    every_1h: "Jede Stunde", every_3h: "Alle 3 Stunden", every_12h: "Alle 12 Stunden", every_24h: "Alle 24 Stunden",
    custom_schedule: "Oder Eigene Zeit:", save_schedule: "Speichern", quotes_library: "Zitate",
    explore_copy: "Erkunden und kopieren.", my_library_title: "Meine Bibliothek", add_your_quotes: "Füge Zitate hinzu (bis 50)",
    meditation: "Meditation", ready_relax: "Bereit zum Entspannen",
    nature_quran: "Naturgeräusche", play_now: "▶ Abspielen", stop_now: "⏸ Stoppen", your_garden: "Dein Garten",
    your_progress: "Dein Fortschritt 📈", usage_days: "Nutzungstage:", total_notifs: "Benachrichtigungen:",
    total_drops: "Tropfen:", close: "Schließen", app_settings: "Einstellungen", glass_mode: "Glaseffekt 💎",
    language: "Sprache:", save_done: "Fertig", back: "Zurück", copied: "Erfolgreich kopiert", delete: "Löschen",
    days: "Tage", repeat_on: "Wiederholen ein", schedules_count: "geplant", choose_time: "Bitte wählen Sie eine Zeit.",
    quotes_ready: "Zitate", enter_quote: "Zitat eingeben...", add: "Hinzufügen", quote_added: "Hinzugefügt", quote_deleted: "Gelöscht", limit_reached: "Limit erreicht (50)", empty_library: "Bibliothek leer. Zufällige Zitate.", added_quotes_count: "Hinzugefügte Zitate: "
  }
};

// توليد مكتبة ضخمة (100 عنصر لكل قسم)
const generateArray = (base, count) => Array.from({length: count}, (_, i) => `${base}${i+1}`);
const QUOTES_DB = {
  dhikr: { key: "cat_dhikr", icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني.", "يا حي يا قيوم برحمتك أستغيث.", ...generateArray("دعاء مخصص للسكينة والتوكل رقم", 96)] },
  selfDev: { key: "cat_selfDev", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', items: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.", "القليل المستمر يصنع أثرًا عميقًا.", ...generateArray("فكرة وخطوة في تطوير الذات رقم", 97)] },
  quran: { key: "cat_quran", icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', items: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "إِنَّ مَعَ الْعُسْرِ يُسْرًا", "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", ...generateArray("آية قرآنية كريمة للتأمل رقم", 97)] },
  culture: { key: "cat_culture", icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>', items: ["الوقت كالسيف إن لم تقطعه قطعك.", "العقل السليم في الجسم السليم.", ...generateArray("حكمة ومعلومة عامة رقم", 98)] }
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
  lang: 'ar', dark: true, glass: true, mode: 'both', duration: 10000, interval: '0',
  quoteSource: 'all', schedules: [], stats: { drops: 0, notifs: 0, days: 1 },
  myQuotes: [] // عبارات المستخدم
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;

function getTranslation(key) { return DICT[state.lang][key] || key; }

function showToast(msgKey) {
  const toast = document.getElementById('copyToast');
  toast.textContent = getTranslation(msgKey);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function safeOn(id, eventType, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(eventType, handler);
}

function applyState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  if (state.dark) { document.body.classList.add('dark-mode'); }
  else { document.body.classList.remove('dark-mode'); }
  document.body.classList.toggle('glass-active', state.glass);
  
  document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
  document.documentElement.lang = state.lang;
  
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
  s('langSelect', state.lang);
  s('notifModeSetting', state.mode); 
  s('dropDurationSetting', state.duration); 
  s('intervalSelect', state.interval);
  s('quoteCategorySetting', state.quoteSource);

  const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
  setTxt('statDrops', state.stats.drops);
  setTxt('statNotifs', state.stats.notifs);
  setTxt('statDays', state.stats.days);

  renderCategories(); renderGarden(); renderSchedules(); renderMyLibrary();
}

safeOn('langSelect', 'change', e => { state.lang = e.target.value; applyState(); syncNativeAlarms(); });
safeOn('quoteCategorySetting', 'change', e => { state.quoteSource = e.target.value; applyState(); syncNativeAlarms(); });

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
  setTxt('treeStats', `${getTranslation('total_drops')}${drops} / ${nextGoal}`);  const prevMax = idx === 0 ? 0 : GARDEN[idx-1].max; const progress = ((drops - prevMax) / (nextGoal - prevMax)) * 100; const progEl = document.getElementById('treeProgress'); if(progEl) progEl.style.width = `${progress}%`;
}

// --- مكتبتي الخاصة (إضافة وحذف 50 عبارة) ---
function renderMyLibrary() {
  const countEl = document.getElementById('myLibraryCount');
  if(countEl) countEl.innerText = `${getTranslation('added_quotes_count')}${state.myQuotes.length} / 50`;
  
  const listEl = document.getElementById('myLibraryList');
  if(!listEl) return;
  
  listEl.innerHTML = state.myQuotes.map((q, i) => `
    <div class="my-quote-item">
      <div style="font-size:15px; font-weight:700; flex:1; margin-inline-end:10px;">${q}</div>
      <button class="delete-btn" onclick="deleteMyQuote(${i})">${getTranslation('delete')}</button>
    </div>
  `).join('');
}

safeOn('addQuoteBtn', 'click', () => {
  const input = document.getElementById('newQuoteInput');
  const txt = input.value.trim();
  if(txt) {
    if(state.myQuotes.length >= 50) {
      showToast('limit_reached');
    } else {
      state.myQuotes.push(txt);
      input.value = '';
      applyState();
      showToast('quote_added');
      syncNativeAlarms(); // تحديث المواعيد بالعبارات الجديدة
    }
  }
});

window.deleteMyQuote = (idx) => {
  state.myQuotes.splice(idx, 1);
  applyState();
  showToast('quote_deleted');
  syncNativeAlarms();
};

// --- المكتبة العامة (للقراءة والنسخ فقط) ---
function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if(!container) return;
  container.innerHTML = Object.keys(QUOTES_DB).map(key => {
    const cat = QUOTES_DB[key];
    const title = getTranslation(cat.key);
    return `<div class="glass-card action-card"
