"use strict";

/* =========================
   QATRA — Application Core
   ========================= */

const STORAGE_KEY = "qatra_app_v1";

const CATEGORIES = [
  {
    id: "hope",
    name: "الأمل",
    emoji: "🌱",
    type: "quote",
    quotes: [
      "لا يلزم أن تكون كل خطواتك كبيرة؛ المهم أن تواصل السير.",
      "قد يحمل الغد بابًا لم تره اليوم.",
      "ما دمت تحاول، فهناك دائمًا مساحة لبداية جديدة.",
      "الأمل ليس انتظارًا؛ إنه طريقة أخرى للمضي قدمًا."
    ]
  },
  {
    id: "confidence",
    name: "الثقة بالنفس",
    emoji: "✨",
    type: "quote",
    quotes: [
      "أنت أكثر قدرة مما توحي به لحظات الشك.",
      "لا تقارن بدايتك بمنتصف طريق الآخرين.",
      "امنح نفسك حق التجربة، لا شرط الكمال.",
      "خطوتك الصغيرة اليوم تستحق التقدير."
    ]
  },
  {
    id: "calm",
    name: "الهدوء",
    emoji: "🌊",
    type: "quote",
    quotes: [
      "ليس عليك أن تحمل كل شيء في هذه اللحظة.",
      "اهدأ قليلًا؛ بعض الأمور تحتاج وقتًا لا قلقًا.",
      "خذ الأمور واحدة تلو الأخرى.",
      "دع ما لا تستطيع تغييره يأخذ مساحته، دون أن يأخذ سلامك."
    ]
  },
  {
    id: "gratitude",
    name: "الامتنان",
    emoji: "🤍",
    type: "quote",
    quotes: [
      "تأمل نعمة صغيرة؛ فقد تكون كبيرة في حقيقتها.",
      "في يومك أشياء تستحق أن تقول عنها: الحمد لله.",
      "الامتنان لا ينكر الصعوبات، لكنه يذكرك بما لا يزال جميلًا.",
      "لحظة هادئة، قلب مطمئن، ونَفَس عميق… نعم تستحق الشكر."
    ]
  },
  {
    id: "focus",
    name: "التركيز",
    emoji: "🎯",
    type: "quote",
    quotes: [
      "وجّه انتباهك إلى الخطوة التي بين يديك.",
      "ابدأ بما تستطيع، واترك الباقي لوقته.",
      "القليل المستمر يصنع أثرًا عميقًا.",
      "لا تحتاج إلى إنهاء كل شيء الآن؛ ابدأ بشيء واحد."
    ]
  },
  {
    id: "patience",
    name: "الصبر",
    emoji: "🌿",
    type: "quote",
    quotes: [
      "بعض الثمار تحتاج وقتًا أطول كي تنضج.",
      "الصبر ليس توقفًا؛ إنه استمرار بثبات.",
      "لا تستعجل ما يحتاج إلى نمو.",
      "تمهّل، فلكل مرحلة حكمتها."
    ]
  },
  {
    id: "balance",
    name: "التوازن",
    emoji: "☯️",
    type: "quote",
    quotes: [
      "الراحة جزء من الطريق، وليست خروجًا عنه.",
      "امنح العمل حقه، وامنح نفسك حقها أيضًا.",
      "التوازن يبدأ حين تصغي إلى احتياجاتك.",
      "ليس كل انشغال إنجازًا، وليس كل هدوء ضياعًا للوقت."
    ]
  },
  {
    id: "growth",
    name: "النمو الشخصي",
    emoji: "🪴",
    type: "quote",
    quotes: [
      "كل يوم يمنحك فرصة لتتعلم شيئًا عن نفسك.",
      "التغيير الحقيقي يبدأ بخطوة صادقة.",
      "لا بأس أن تتقدم ببطء، ما دمت لا تتخلى عن نفسك.",
      "اجعل من أخطائك دروسًا، لا أحكامًا نهائية."
    ]
  },
  {
    id: "adhkar",
    name: "الأذكار والأدعية",
    emoji: "🤲",
    type: "dhikr",
    quotes: [
      "سبحان الله وبحمده، سبحان الله العظيم.",
      "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.",
      "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه.",
      "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت.",
      "اللهم إني أسألك العفو والعافية في الدنيا والآخرة.",
      "يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين.",
      "اللهم آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.",
      "حسبي الله لا إله إلا هو، عليه توكلت وهو رب العرش العظيم."
    ]
  }
];

const WEEK_DAYS = [
  { id: 0, short: "أحد", name: "الأحد" },
  { id: 1, short: "إثن", name: "الإثنين" },
  { id: 2, short: "ثلا", name: "الثلاثاء" },
  { id: 3, short: "أرب", name: "الأربعاء" },
  { id: 4, short: "خمي", name: "الخميس" },
  { id: 5, short: "جمع", name: "الجمعة" },
  { id: 6, short: "سبت", name: "السبت" }
];

const DEFAULT_STATE = {
  remindersEnabled: false,
  notificationEnabled: true,
  floatingEnabled: true,
  motionEnabled: true,
  duration: 10,
  schedules: [],
  lastQuoteIndex: -1,
  visualStyle: 'drop', // 'drop' or 'egg'
  contentType: 'all',  // 'all', 'quotes', 'dhikr', 'specific_category'
  specificCategoryId: null,
  isDarkMode: true,
  isGlassmorphism: false
};

let state = loadState();
let selectedDays = new Set([0, 1, 2, 3, 4, 5, 6]);
let toastTimer = null;
let floatingTimer = null;

/* Native Android bridge */
const QatraNative = window.Capacitor?.Plugins?.QatraNative || null;
async function nativeCall(method, options = {}) {
  if (!QatraNative || typeof QatraNative[method] !== "function") return null;
  try { return await QatraNative[method](options); }
  catch (error) { console.warn(`QatraNative.${method} failed`, error); return null; }
}

function syncNativeSchedules() {
  if (!QatraNative) return;
  state.schedules.forEach(async schedule => {
    await nativeCall("cancel", { id: schedule.id });
    
    if (!state.remindersEnabled || !schedule.enabled) return;
    
    const modes = schedule.mode || "both";
    let effectiveMode = "both";
    if (!state.notificationEnabled && !state.floatingEnabled) {
      effectiveMode = "none";
    } else if (state.notificationEnabled && !state.floatingEnabled) {
      effectiveMode = "notification";
    } else if (!state.notificationEnabled && state.floatingEnabled) {
      effectiveMode = "floating";
    }

    if (effectiveMode === "none") return;
    
    await nativeCall("schedule", { 
      id: schedule.id, 
      time: schedule.time, 
      days: schedule.days, 
      mode: effectiveMode, 
      quote: getRandomContent().text,
      visualStyle: state.visualStyle
    });
  });
}


/* =========================
   Storage
   ========================= */

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return structuredClone(DEFAULT_STATE);
    const parsedState = JSON.parse(saved);
    
    if (parsedState.schedules) {
      parsedState.schedules = parsedState.schedules.map(s => {
        if (typeof s.id === 'string') s.id = Math.floor(Math.random() * 2147483647);
        return s;
      });
    }
    return { ...structuredClone(DEFAULT_STATE), ...parsedState };
  } catch (error) {
    console.warn("Could not load settings:", error);
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    applyTheme();
  } catch (error) {
    showToast("تعذر حفظ الإعدادات");
  }
}

/* =========================
   Quotes & Content
   ========================= */

function getAllContent() {
  let filteredCategories = CATEGORIES;
  
  if (state.contentType === 'quotes') {
    filteredCategories = CATEGORIES.filter(c => c.type === 'quote');
  } else if (state.contentType === 'dhikr') {
    filteredCategories = CATEGORIES.filter(c => c.type === 'dhikr');
  } else if (state.contentType === 'specific_category' && state.specificCategoryId) {
    filteredCategories = CATEGORIES.filter(c => c.id === state.specificCategoryId);
  }
  
  // Fallback if empty
  if (filteredCategories.length === 0) filteredCategories = CATEGORIES;

  return filteredCategories.flatMap(category =>
    category.quotes.map(text => ({
      text,
      category: category.name,
      categoryId: category.id,
      type: category.type
    }))
  );
}

function getRandomContent() {
  const content = getAllContent();
  if (content.length <= 1) return content[0];

  let index;
  do {
    index = Math.floor(Math.random() * content.length);
  } while (index === state.lastQuoteIndex && content.length > 1);

  state.lastQuoteIndex = index;
  saveState();
  return content[index];
}

function setDailyQuote() {
  const content = getRandomContent();
  const quoteEl = document.getElementById("dailyQuote");
  const categoryEl = document.getElementById("quoteCategory");
  
  if (quoteEl && categoryEl) {
    quoteEl.textContent = content.text;
    categoryEl.textContent = content.type === 'dhikr' ? `نفحة ${content.category}` : `قطرة ${content.category}`;
  }
  return content;
}

/* =========================
   UI & Theme
   ========================= */

function applyTheme() {
  const root = document.documentElement;
  
  // Theme Toggle
  if (state.isDarkMode) {
    root.style.setProperty('--bg', '#080e1c');
    root.style.setProperty('--text', '#f4f7ff');
    root.style.setProperty('--surface', '#111a2d');
  } else {
    root.style.setProperty('--bg', '#f0f4f8');
    root.style.setProperty('--text', '#111a2d');
    root.style.setProperty('--surface', '#ffffff');
  }
  
  // Glassmorphism Toggle
  if (state.isGlassmorphism) {
    document.body.classList.add('glass-effect');
  } else {
    document.body.classList.remove('glass-effect');
  }

  // Update visual style in hero section
  updateHeroVisualStyle();
}

function updateHeroVisualStyle() {
  const heroStage = document.getElementById('dropStage');
  if (!heroStage) return;

  if (state.visualStyle === 'egg') {
    heroStage.innerHTML = `
      <div class="egg">
        <div class="crack"></div>
      </div>`;
  } else {
    heroStage.innerHTML = `
      <div class="drop-ring"></div>
      <div class="drop-ring ring-2"></div>
      <div class="drop"></div>`;
  }
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));
  
  const view = document.getElementById(viewId);
  const navBtn = document.querySelector(`[data-view="${viewId}"]`);
  
  if (view) view.classList.add("active");
  if (navBtn) navBtn.classList.add("active");

  if (viewId === "scheduleView") renderSchedules();
  if (viewId === "libraryView") renderLibrary();
  if (viewId === "settingsView") syncSettingsUI();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* =========================
   Schedules
   ========================= */

function formatDays(days) {
  if (!Array.isArray(days) || days.length === 0) return "لم يتم اختيار الأيام";
  if (days.length === 7) return "كل أيام الأسبوع";
  return WEEK_DAYS.filter(d => days.includes(d.id)).map(d => d.name).join("، ");
}

function renderSchedules() {
  const list = document.getElementById("scheduleList");
  if (!list) return;

  if (state.schedules.length === 0) {
    list.innerHTML = `<div class="empty-state">لا توجد مواعيد بعد.<br>أضف موعدًا لتبدأ رحلتك.</div>`;
    updateReminderSummary();
    return;
  }

  list.innerHTML = state.schedules
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
    .map(schedule => `
      <div class="schedule-item">
        <div>
          <div class="schedule-time">${escapeHTML(schedule.time)}</div>
          <div class="schedule-days">${escapeHTML(formatDays(schedule.days))}</div>
        </div>
        <div class="schedule-actions">
          <label class="toggle" aria-label="تفعيل الموعد">
            <input type="checkbox" data-action="toggle-schedule" data-id="${schedule.id}" ${schedule.enabled ? "checked" : ""}>
            <span class="toggle-track"></span>
          </label>
          <button class="small-icon" data-action="edit-schedule" data-id="${schedule.id}">✎</button>
          <button class="small-icon" data-action="delete-schedule" data-id="${schedule.id}">×</button>
        </div>
      </div>
    `).join("");

  updateReminderSummary();
}

function updateReminderSummary() {
  const summary = document.getElementById("reminderSummary");
  if (!summary) return;
  const enabledCount = state.schedules.filter(item => item.enabled).length;
  if (!state.remindersEnabled) summary.textContent = "التذكيرات متوقفة";
  else if (enabledCount === 0) summary.textContent = "لا توجد مواعيد مفعلة";
  else summary.textContent = `${enabledCount} موعد مفعّل`;
}

function openScheduleModal(schedule = null) {
  const modal = document.getElementById("scheduleModal");
  const form = document.getElementById("scheduleForm");
  
  form.reset();
  document.getElementById("scheduleId").value = schedule?.id || "";
  document.getElementById("scheduleTime").value = schedule?.time || "09:00";
  document.getElementById("scheduleMode").value = schedule?.mode || "both";
  document.getElementById("modalTitle").textContent = schedule ? "تعديل الموعد" : "إضافة موعد";

  selectedDays = new Set(Array.isArray(schedule?.days) ? schedule.days : [0, 1, 2, 3, 4, 5, 6]);
  renderDayChips();
  modal.classList.add("show");
}

function closeScheduleModal() {
  document.getElementById("scheduleModal").classList.remove("show");
}

function renderDayChips() {
  const container = document.getElementById("daysGrid");
  container.innerHTML = WEEK_DAYS.map(day => `
    <button type="button" class="day-chip ${selectedDays.has(day.id) ? "selected" : ""}" data-day="${day.id}">
      ${day.short}
    </button>
  `).join("");
}

function saveSchedule(event) {
  event.preventDefault();
  const rawId = document.getElementById("scheduleId").value;
  const id = rawId ? parseInt(rawId, 10) : Math.floor(Math.random() * 2147483647);
  const time = document.getElementById("scheduleTime").value;
  const mode = document.getElementById("scheduleMode").value;
  const days = [...selectedDays].sort((a, b) => a - b);

  if (!time) return showToast("اختر وقت التذكير");
  if (days.length === 0) return showToast("اختر يومًا واحدًا على الأقل");

  const schedule = { id, time, mode, days, enabled: true };

  if (rawId) {
    state.schedules = state.schedules.map(item => item.id === id ? schedule : item);
  } else {
    state.schedules.push(schedule);
  }

  state.remindersEnabled = true;
  saveState();
  syncNativeSchedules();
  syncSettingsUI();
  renderSchedules();
  closeScheduleModal();
  showToast("تم حفظ الموعد بنجاح");
}

function deleteSchedule(id) {
  state.schedules = state.schedules.filter(item => item.id !== id);
  nativeCall("cancel", { id });
  saveState();
  syncNativeSchedules();
  renderSchedules();
  showToast("تم حذف الموعد");
}

function toggleSchedule(id, enabled) {
  state.schedules = state.schedules.map(item => item.id === id ? { ...item, enabled } : item);
  saveState();
  syncNativeSchedules();
  renderSchedules();
}

/* =========================
   Categories and Library
   ========================= */

function renderCategories() {
  const container = document.getElementById("categoryGrid");
  if(container) {
      container.innerHTML = CATEGORIES.slice(0, 4).map(category => `
        <button class="category-card" data-category="${category.id}">
          <div class="category-emoji">${category.emoji}</div>
          <div class="category-name">${category.name}</div>
          <div class="category-count">${category.quotes.length} عبارات</div>
        </button>
      `).join("");
  }
}

function renderLibrary() {
  const container = document.getElementById("libraryGrid");
  if(container){
      container.innerHTML = CATEGORIES.map(category => `
        <button class="category-card" data-category="${category.id}">
          <div class="category-emoji">${category.emoji}</div>
          <div class="category-name">${category.name}</div>
          <div class="category-count">${category.quotes.length} عبارات</div>
        </button>
      `).join("");
      document.getElementById("quotesList").innerHTML = "";
  }
}

function showCategoryQuotes(categoryId) {
  const category = CATEGORIES.find(item => item.id === categoryId);
  if (!category) return;

  const container = document.getElementById("quotesList");
  container.innerHTML = `
    <div class="section-heading">
      <h2>${category.emoji} ${escapeHTML(category.name)}</h2>
      <button class="text-button" id="backToCategories">العودة</button>
    </div>
    <div style="display:grid;gap:10px">
      ${category.quotes.map(quote => `
        <div class="reminder-card">
          <div class="reminder-info">
            <div class="reminder-title" style="line-height:2">${escapeHTML(quote)}</div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
  document.getElementById("backToCategories").addEventListener("click", renderLibrary);
}

/* =========================
   Settings
   ========================= */

function syncSettingsUI() {
  const setChecked = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  const setValue = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

  setChecked("remindersEnabled", state.remindersEnabled);
  setChecked("notificationSetting", state.notificationEnabled);
  setChecked("floatingSetting", state.floatingEnabled);
  setChecked("motionSetting", state.motionEnabled);
  setValue("durationSetting", String(state.duration));
  
  setValue("visualStyleSetting", state.visualStyle);
  setValue("contentTypeSetting", state.contentType);
  
  setChecked("darkModeSetting", state.isDarkMode);
  setChecked("glassmorphismSetting", state.isGlassmorphism);

  updateReminderSummary();
  updateCategorySelectVisibility();
}

function updateCategorySelectVisibility() {
    const contentTypeSelect = document.getElementById('contentTypeSetting');
    const specificCategoryGroup = document.getElementById('specificCategoryGroup');
    if(contentTypeSelect && specificCategoryGroup) {
        if(contentTypeSelect.value === 'specific_category') {
            specificCategoryGroup.style.display = 'flex';
            populateCategorySelect();
        } else {
            specificCategoryGroup.style.display = 'none';
        }
    }
}

function populateCategorySelect() {
    const select = document.getElementById('specificCategorySetting');
    if(select) {
        select.innerHTML = CATEGORIES.map(c => 
            `<option value="${c.id}" ${state.specificCategoryId === c.id ? 'selected' : ''}>${c.name}</option>`
        ).join('');
    }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* =========================
   Event Listeners Setup
   ========================= */

function setupEventListeners() {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });

  const bindClick = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener("click", fn); };
  const bindChange = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener("change", fn); };

  bindClick("openSettings", () => showView("settingsView"));
  bindClick("manageSchedule", () => showView("scheduleView"));
  bindClick("openLibrary", () => showView("libraryView"));
  bindClick("addSchedule", () => openScheduleModal());
  bindClick("closeModal", closeScheduleModal);
  
  bindClick("themeToggle", () => {
      state.isDarkMode = !state.isDarkMode;
      saveState();
      syncSettingsUI();
  });

  bindClick("glassToggle", () => {
      state.isGlassmorphism = !state.isGlassmorphism;
      saveState();
      syncSettingsUI();
  });


  bindClick("showDrop", () => {
    const content = setDailyQuote();
    if (state.floatingEnabled) {
      nativeCall("showDrop", { text: content.text, style: state.visualStyle });
    } else {
      showToast("تم اختيار عبارة جديدة");
    }
  });

  const modal = document.getElementById("scheduleModal");
  if(modal) modal.addEventListener("click", e => { if (e.target.id === "scheduleModal") closeScheduleModal(); });
  
  const form = document.getElementById("scheduleForm");
  if(form) form.addEventListener("submit", saveSchedule);

  const daysGrid = document.getElementById("daysGrid");
  if(daysGrid) daysGrid.addEventListener("click", e => {
    const btn = e.target.closest("[data-day]");
    if (!btn) return;
    const day = Number(btn.dataset.day);
    selectedDays.has(day) ? selectedDays.delete(day) : selectedDays.add(day);
    renderDayChips();
  });

  const schedList = document.getElementById("scheduleList");
  if(schedList) {
    schedList.addEventListener("click", e => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const action = btn.dataset.action;
        const id = parseInt(btn.dataset.id, 10);
        if (action === "edit-schedule") openScheduleModal(state.schedules.find(i => i.id === id));
        if (action === "delete-schedule") deleteSchedule(id);
    });
    schedList.addEventListener("change", e => {
        const input = e.target.closest('[data-action="toggle-schedule"]');
        if (input) toggleSchedule(parseInt(input.dataset.id, 10), input.checked);
    });
  }

  // Settings Handlers
  bindChange("remindersEnabled", e => { state.remindersEnabled = e.target.checked; saveState(); syncNativeSchedules(); syncSettingsUI(); });
  bindChange("notificationSetting", e => { state.notificationEnabled = e.target.checked; saveState(); syncNativeSchedules(); });
  bindChange("floatingSetting", e => { state.floatingEnabled = e.target.checked; saveState(); syncNativeSchedules(); });
  bindChange("motionSetting", e => { state.motionEnabled = e.target.checked; saveState(); });
  bindChange("durationSetting", e => { state.duration = Number(e.target.value); saveState(); });
  
  bindChange("visualStyleSetting", e => { state.visualStyle = e.target.value; saveState(); updateHeroVisualStyle(); });
  bindChange("contentTypeSetting", e => { 
      state.contentType = e.target.value; 
      updateCategorySelectVisibility();
      saveState(); 
  });
  bindChange("specificCategorySetting", e => { state.specificCategoryId = e.target.value; saveState(); });
  bindChange("darkModeSetting", e => { state.isDarkMode = e.target.checked; saveState(); });
  bindChange("glassmorphismSetting", e => { state.isGlassmorphism = e.target.checked; saveState(); });


  bindClick("previewFloating", () => {
    if (!state.floatingEnabled) return showToast("فعّل القطرة العائمة أولًا");
    nativeCall("showDrop", { text: getRandomContent().text, style: state.visualStyle });
  });

  bindClick("resetApp", () => {
    if (!confirm("هل تريد إعادة ضبط التطبيق؟ سيتم حذف المواعيد.")) return;
    state = structuredClone(DEFAULT_STATE);
    saveState();
    syncSettingsUI();
    renderSchedules();
    showToast("تمت إعادة ضبط التطبيق");
  });

  const catGrid = document.getElementById("categoryGrid");
  if(catGrid) catGrid.addEventListener("click", e => {
    const btn = e.target.closest("[data-category]");
    if (!btn) return;
    showView("libraryView");
    showCategoryQuotes(btn.dataset.category);
  });

  const libGrid = document.getElementById("libraryGrid");
  if(libGrid) libGrid.addEventListener("click", e => {
    const btn = e.target.closest("[data-category]");
    if (btn) showCategoryQuotes(btn.dataset.category);
  });
}

/* =========================
   Initialization
   ========================= */

async function initializeApp() {
  applyTheme();
  renderCategories();
  renderSchedules();
  setDailyQuote();
  syncSettingsUI();
  setupEventListeners();
  syncNativeSchedules();

  setTimeout(() => {
    const pb = document.getElementById('splash-progress');
    if (pb) pb.style.width = '100%';
  }, 100);

  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(() => splash.remove(), 600);
    }
  }, 2500);

  if (window.Capacitor && Capacitor.Plugins.QatraNative) {
    try { await Capacitor.Plugins.QatraNative.requestOverlayPermission(); } 
    catch (e) { console.error("Permission request failed", e); }
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);
