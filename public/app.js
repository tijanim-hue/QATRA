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
    quotes: [
      "كل يوم يمنحك فرصة لتتعلم شيئًا عن نفسك.",
      "التغيير الحقيقي يبدأ بخطوة صادقة.",
      "لا بأس أن تتقدم ببطء، ما دمت لا تتخلى عن نفسك.",
      "اجعل من أخطائك دروسًا، لا أحكامًا نهائية."
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
  lastQuoteIndex: -1
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
    const effectiveMode = (!state.notificationEnabled && !state.floatingEnabled) ? "none" :
      (state.notificationEnabled && state.floatingEnabled ? modes :
      (state.notificationEnabled ? "notification" : "floating"));
    if (effectiveMode === "none") return;
    await nativeCall("schedule", { id: schedule.id, time: schedule.time, days: schedule.days, mode: effectiveMode, quote: getRandomQuote().text });
  });
}


/* =========================
   Storage
   ========================= */

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return structuredClone(DEFAULT_STATE);
    }

    return {
      ...structuredClone(DEFAULT_STATE),
      ...JSON.parse(saved)
    };
  } catch (error) {
    console.warn("Could not load QATRA settings:", error);
    return structuredClone(DEFAULT_STATE);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Could not save QATRA settings:", error);
    showToast("تعذر حفظ الإعدادات على هذا الجهاز");
  }
}

/* =========================
   Quotes
   ========================= */

function getAllQuotes() {
  return CATEGORIES.flatMap(category =>
    category.quotes.map(text => ({
      text,
      category: category.name,
      categoryId: category.id
    }))
  );
}

function getRandomQuote() {
  const quotes = getAllQuotes();

  if (quotes.length <= 1) {
    return quotes[0];
  }

  let index;

  do {
    index = Math.floor(Math.random() * quotes.length);
  } while (index === state.lastQuoteIndex);

  state.lastQuoteIndex = index;
  saveState();

  return quotes[index];
}

function setDailyQuote() {
  const quote = getRandomQuote();

  document.getElementById("dailyQuote").textContent = quote.text;
  document.getElementById("quoteCategory").textContent =
    `قطرة ${quote.category}`;

  return quote;
}

/* =========================
   Navigation
   ========================= */

function showView(viewId) {
  document.querySelectorAll(".view").forEach(view => {
    view.classList.toggle("active", view.id === viewId);
  });

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === viewId
    );
  });

  if (viewId === "scheduleView") {
    renderSchedules();
  }

  if (viewId === "libraryView") {
    renderLibrary();
  }

  if (viewId === "settingsView") {
    syncSettingsUI();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   Toast
   ========================= */

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* =========================
   Floating Drop Preview
   ========================= */

function showFloatingPreview(text) {
  const preview = document.getElementById("floatingPreview");
  const floatingText = document.getElementById("floatingText");

  floatingText.textContent = text;
  preview.classList.add("show");

  clearTimeout(floatingTimer);

  floatingTimer = setTimeout(() => {
    preview.classList.remove("show");
  }, Number(state.duration) * 1000);
}

function closeFloatingPreview() {
  document.getElementById("floatingPreview").classList.remove("show");
  clearTimeout(floatingTimer);
}

/* =========================
   Schedules
   ========================= */

function formatDays(days) {
  if (!Array.isArray(days) || days.length === 0) {
    return "لم يتم اختيار الأيام";
  }

  if (days.length === 7) {
    return "كل أيام الأسبوع";
  }

  return WEEK_DAYS
    .filter(day => days.includes(day.id))
    .map(day => day.name)
    .join("، ");
}

function renderSchedules() {
  const list = document.getElementById("scheduleList");

  if (state.schedules.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        لا توجد مواعيد بعد.<br>
        أضف موعدًا لتبدأ رحلتك مع قطرة.
      </div>
    `;

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
            <input
              type="checkbox"
              data-action="toggle-schedule"
              data-id="${escapeHTML(schedule.id)}"
              ${schedule.enabled ? "checked" : ""}
            >
            <span class="toggle-track"></span>
          </label>

          <button
            class="small-icon"
            data-action="edit-schedule"
            data-id="${escapeHTML(schedule.id)}"
            aria-label="تعديل الموعد"
          >✎</button>

          <button
            class="small-icon"
            data-action="delete-schedule"
            data-id="${escapeHTML(schedule.id)}"
            aria-label="حذف الموعد"
          >×</button>
        </div>
      </div>
    `)
    .join("");

  updateReminderSummary();
}

function updateReminderSummary() {
  const enabledCount = state.schedules.filter(item => item.enabled).length;
  const summary = document.getElementById("reminderSummary");

  if (!state.remindersEnabled) {
    summary.textContent = "التذكيرات متوقفة";
  } else if (enabledCount === 0) {
    summary.textContent = "لا توجد مواعيد مفعلة";
  } else {
    summary.textContent = `${enabledCount} موعد مفعّل`;
  }
}

function openScheduleModal(schedule = null) {
  const modal = document.getElementById("scheduleModal");
  const form = document.getElementById("scheduleForm");

  form.reset();

  document.getElementById("scheduleId").value = schedule?.id || "";
  document.getElementById("scheduleTime").value = schedule?.time || "09:00";
  document.getElementById("scheduleMode").value = schedule?.mode || "both";
  document.getElementById("modalTitle").textContent =
    schedule ? "تعديل الموعد" : "إضافة موعد";

  selectedDays = new Set(
    Array.isArray(schedule?.days)
      ? schedule.days
      : [0, 1, 2, 3, 4, 5, 6]
  );

  renderDayChips();
  modal.classList.add("show");
}

function closeScheduleModal() {
  document.getElementById("scheduleModal").classList.remove("show");
}

function renderDayChips() {
  const container = document.getElementById("daysGrid");

  container.innerHTML = WEEK_DAYS.map(day => `
    <button
      type="button"
      class="day-chip ${selectedDays.has(day.id) ? "selected" : ""}"
      data-day="${day.id}"
    >
      ${day.short}
    </button>
  `).join("");
}

function saveSchedule(event) {
  event.preventDefault();

  const id = document.getElementById("scheduleId").value;
  const time = document.getElementById("scheduleTime").value;
  const mode = document.getElementById("scheduleMode").value;
  const days = [...selectedDays].sort((a, b) => a - b);

  if (!time) {
    showToast("اختر وقت التذكير");
    return;
  }

  if (days.length === 0) {
    showToast("اختر يومًا واحدًا على الأقل");
    return;
  }

  const schedule = {
    id: id || createId(),
    time,
    mode,
    days,
    enabled: true
  };

  if (id) {
    state.schedules = state.schedules.map(item =>
      item.id === id ? schedule : item
    );
  } else {
    state.schedules.push(schedule);
  }

  state.remindersEnabled = true;

  saveState();
  syncNativeSchedules();
  syncSettingsUI();
  renderSchedules();
  closeScheduleModal();

  showToast("تم حفظ الموعد");
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
  state.schedules = state.schedules.map(item =>
    item.id === id ? { ...item, enabled } : item
  );

  saveState();
  syncNativeSchedules();
  renderSchedules();
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/* =========================
   Categories and Library
   ========================= */

function renderCategories() {
  const container = document.getElementById("categoryGrid");

  container.innerHTML = CATEGORIES.slice(0, 4).map(category => `
    <button class="category-card" data-category="${category.id}">
      <div class="category-emoji">${category.emoji}</div>
      <div class="category-name">${category.name}</div>
      <div class="category-count">${category.quotes.length} عبارات</div>
    </button>
  `).join("");
}

function renderLibrary() {
  const container = document.getElementById("libraryGrid");

  container.innerHTML = CATEGORIES.map(category => `
    <button class="category-card" data-category="${category.id}">
      <div class="category-emoji">${category.emoji}</div>
      <div class="category-name">${category.name}</div>
      <div class="category-count">${category.quotes.length} عبارات</div>
    </button>
  `).join("");

  document.getElementById("quotesList").innerHTML = "";
}

function showCategoryQuotes(categoryId) {
  const category = CATEGORIES.find(item => item.id === categoryId);

  if (!category) {
    return;
  }

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
            <div class="reminder-title" style="line-height:2">
              ${escapeHTML(quote)}
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  document.getElementById("backToCategories").addEventListener("click", () => {
    renderLibrary();
  });
}

/* =========================
   Settings
   ========================= */

function syncSettingsUI() {
  document.getElementById("remindersEnabled").checked =
    state.remindersEnabled;

  document.getElementById("notificationSetting").checked =
    state.notificationEnabled;

  document.getElementById("floatingSetting").checked =
    state.floatingEnabled;

  document.getElementById("motionSetting").checked =
    state.motionEnabled;

  document.getElementById("durationSetting").value =
    String(state.duration);

  updateReminderSummary();
}

function setMotionEnabled(enabled) {
  state.motionEnabled = enabled;

  document.querySelectorAll(".drop, .drop-ring").forEach(element => {
    element.style.animationPlayState = enabled ? "running" : "paused";
  });

  saveState();
}

/* =========================
   Security / HTML escaping
   ========================= */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

/* =========================
   Event Listeners
   ========================= */

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    showView(button.dataset.view);
  });
});

document.getElementById("openSettings").addEventListener("click", () => {
  showView("settingsView");
});

document.getElementById("manageSchedule").addEventListener("click", () => {
  showView("scheduleView");
});

document.getElementById("openLibrary").addEventListener("click", () => {
  showView("libraryView");
});

document.getElementById("showDrop").addEventListener("click", () => {
  const quote = setDailyQuote();

  if (state.floatingEnabled) {
    nativeCall("showDrop", { text: quote.text }).then(result => { if (!result) showFloatingPreview(quote.text); });
  } else {
    showToast("تم اختيار قطرتك الجديدة");
  }
});

document.getElementById("addSchedule").addEventListener("click", () => {
  openScheduleModal();
});

document.getElementById("closeModal").addEventListener("click", () => {
  closeScheduleModal();
});

document.getElementById("scheduleModal").addEventListener("click", event => {
  if (event.target.id === "scheduleModal") {
    closeScheduleModal();
  }
});

document.getElementById("scheduleForm").addEventListener("submit", saveSchedule);

document.getElementById("daysGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-day]");

  if (!button) {
    return;
  }

  const day = Number(button.dataset.day);

  if (selectedDays.has(day)) {
    selectedDays.delete(day);
  } else {
    selectedDays.add(day);
  }

  renderDayChips();
});

document.getElementById("scheduleList").addEventListener("click", event => {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  const schedule = state.schedules.find(item => item.id === id);

  if (action === "edit-schedule" && schedule) {
    openScheduleModal(schedule);
  }

  if (action === "delete-schedule") {
    deleteSchedule(id);
  }
});

document.getElementById("scheduleList").addEventListener("change", event => {
  const input = event.target.closest('[data-action="toggle-schedule"]');

  if (!input) {
    return;
  }

  toggleSchedule(input.dataset.id, input.checked);
});

document.getElementById("remindersEnabled").addEventListener("change", event => {
  state.remindersEnabled = event.target.checked;

  saveState();
  syncNativeSchedules();
  syncSettingsUI();

  showToast(
    state.remindersEnabled
      ? "تم تفعيل التذكيرات داخل التطبيق"
      : "تم إيقاف التذكيرات"
  );
});

document.getElementById("notificationSetting").addEventListener("change", event => {
  state.notificationEnabled = event.target.checked;

  saveState();
  syncNativeSchedules();

  showToast(
    state.notificationEnabled
      ? "تم تفعيل خيار الإشعارات"
      : "تم إيقاف خيار الإشعارات"
  );
});

document.getElementById("floatingSetting").addEventListener("change", event => {
  state.floatingEnabled = event.target.checked;

  saveState();
  syncNativeSchedules();

  showToast(
    state.floatingEnabled
      ? "تم تفعيل معاينة القطرة العائمة"
      : "تم إيقاف معاينة القطرة العائمة"
  );
});

document.getElementById("motionSetting").addEventListener("change", event => {
  setMotionEnabled(event.target.checked);
});

document.getElementById("durationSetting").addEventListener("change", event => {
  state.duration = Number(event.target.value);

  saveState();

  showToast("تم تحديث مدة ظهور القطرة");
});

document.getElementById("previewFloating").addEventListener("click", () => {
  if (!state.floatingEnabled) {
    showToast("فعّل القطرة العائمة أولًا");
    return;
  }

  const quote = getRandomQuote();
  nativeCall("showDrop", { text: quote.text }).then(result => { if (!result) showFloatingPreview(quote.text); });
});

document.getElementById("closeFloating").addEventListener("click", () => {
  closeFloatingPreview();
});

document.getElementById("resetApp").addEventListener("click", () => {
  const confirmed = window.confirm(
    "هل تريد إعادة ضبط إعدادات قطرة؟ سيتم حذف المواعيد المحفوظة."
  );

  if (!confirmed) {
    return;
  }

  state = structuredClone(DEFAULT_STATE);
  saveState();

  syncSettingsUI();
  renderSchedules();
  closeFloatingPreview();

  showToast("تمت إعادة ضبط التطبيق");
});

document.getElementById("categoryGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (!button) {
    return;
  }

  showView("libraryView");
  showCategoryQuotes(button.dataset.category);
});

document.getElementById("libraryGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");

  if (!button) {
    return;
  }

  showCategoryQuotes(button.dataset.category);
});

/* =========================
   Initialization
   ========================= */

function initializeApp() {
  renderCategories();
  renderSchedules();
  setDailyQuote();
  syncSettingsUI();

  setMotionEnabled(state.motionEnabled);
  syncNativeSchedules();
}

document.addEventListener("DOMContentLoaded", initializeApp);
