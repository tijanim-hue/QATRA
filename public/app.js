"use strict";

const STORE_KEY = "qatra_worldclass_v6";

// === قاموس الترجمة ===
const DICT = {
  "ar": {
    "surprise_title": "فاجئني",
    "surprise_description": "اكتشف الآن قطرة جديدة",
    "app_title": "قطرة | QATRA",
    "pull_to_switch": "اسحب لتبديل المظهر",
    "moment_zen": "لحظة وعي",
    "click_to_program": "اضغط لبرمجة قطرتك",
    "next_drop": "قطرتك القادمة",
    "today_impact": "خطوة اليوم",
    "current_moment": "لحظتك الحالية",
    "drop_settings": "إعدادات قطرتي",
    "display_method": "طريقة العرض وتفضيلاتك",
    "mode_both": "تنبيه النظام + قطرة مائية (معاً)",
    "mode_floating": "القطرة المائية فقط",
    "mode_notification": "تنبيه النظام فقط",
    "dur_5": "مدة القطرة: 5 ثوانٍ",
    "dur_10": "مدة القطرة: 10 ثوانٍ",
    "dur_15": "مدة القطرة: 15 ثانية",
    "smart_schedule": "البرمجة الذكية (توزيع تلقائي)",
    "i_want": "أريد",
    "drops_daily": "قطرات يومياً",
    "from": "من",
    "to": "إلى",
    "apply_smart": "تطبيق البرمجة الذكية",
    "manual_schedule": "الجدولة اليدوية (تكرار مستمر)",
    "custom_schedule": "تحديد ساعة وأيام مخصصة:",
    "save_schedule": "حفظ الموعد",
    "personal_library": "المكتبة الشخصية",
    "library_desc": "احتفظ بالمعاني التي تلامس قلبك، ونظمها في مجموعاتك.",
    "discover_quotes": "اكتشف العبارات",
    "my_favorites": "مفضلاتي",
    "my_groups": "مجموعاتي",
    "my_custom_quotes": "عباراتي الخاصة",
    "create_group": "إنشاء مجموعة جديدة",
    "add": "إضافة",
    "your_garden": "حديقتك",
    "level_of_awareness": "مستوى الوعي العام",
    "tree_serenity": "شجرة السكينة",
    "tree_serenity_desc": "الأذكار والقرآن",
    "tree_knowledge": "شجرة المعرفة",
    "tree_knowledge_desc": "الثقافة العامة",
    "tree_awareness": "شجرة الوعي",
    "tree_awareness_desc": "تطوير الذات",
    "tree_gratitude": "شجرة الامتنان",
    "tree_gratitude_desc": "الشعر والمشاعر",
    "sakeena": "سكينة",
    "sakeena_desc": "اختر مساحتك للهدوء والاسترخاء.",
    "nature_sounds": "أصوات الطبيعة",
    "quran_recitation": "القرآن الكريم",
    "short_sessions": "جلسات قصيرة",
    "app_settings": "إعدادات التطبيق",
    "glass_mode": "الشفافية وتأثير الزجاج",
    "show_image": "إظهار صورة مع العبارة",
    "show_home_cards": "إظهار بطاقات الرئيسية",
    "language": "لغة التطبيق:",
    "save_done": "تم وحفظ",
    "back": "رجوع",
    "copied": "تم النسخ بنجاح",
    "delete": "حذف",
    "days": "أيام",
    "quotes_ready": "عبارة جاهزة",
    "rain": "🌧️ المطر",
    "sea": "🌊 البحر",
    "forest": "🌲 الغابة",
    "birds": "🕊️ الطيور",
    "all_categories": "عشوائي (من كل الأقسام)",
    "cat_dhikr": "أذكار وأدعية",
    "cat_selfDev": "تطوير الذات",
    "cat_quran": "آيات قرآنية",
    "cat_culture": "ثقافة عامة وحكم",
    "cat_poetry": "أبيات شعرية",
    "my_library": "مجموعاتي الخاصة",
    "stop_repeat": "إيقاف التكرار التلقائي",
    "every_30": "كل 30 دقيقة",
    "every_1h": "كل 1 ساعة",
    "every_3h": "كل 3 ساعات",
    "every_12h": "كل 12 ساعة",
    "every_24h": "كل 24 ساعة",
    "no_reminders": "لا توجد مواعيد",
    "source_category": "1. مصدر العبارات",
    "your_progress": "نشاطك وتقدمك",
    "close": "إغلاق",
    "quote_of_day": "اقتباس اليوم",
    "choose_time": "اختر وقتًا ويومًا واحدًا على الأقل.",
    "section_title": "الأقسام",
    "drops": "قطرة",
    "after_minutes": "بعد {count} دقيقة",
    "category_label": "الفئة: {name}",
    "today_likes_summary": "لقد تفاعلت مع {count} قطرات اليوم",
    "active_days_summary": "تفاعلت لمدة {count} أيام",
    "moment_default": "استمتع بلحظتك",
    "moment_morning": "ابدأ يومك بنية طيبة",
    "moment_afternoon": "خطوة واحدة تكفي لتبدأ",
    "moment_evening": "توقف قليلًا، وتأمل ما أنجزته",
    "added_favorite": "تمت الإضافة إلى المفضلة",
    "session_start": "بدأت جلسة {count} دقائق. يرجى الاسترخاء وإغلاق عينيك.",
    "session_end": "انتهت الجلسة بنجاح.",
    "playing": "جاري التشغيل",
    "group_name": "اسم المجموعة",
    "enter_quote": "أدخل عبارتك هنا...",
    "enter_group_name": "اسم المجموعة الجديدة",
    "no_custom_quotes": "أضف عبارات في مجموعاتك لتظهر هنا.",
    "surah_baqara": "سورة البقرة",
    "surah_kahf": "سورة الكهف",
    "surah_mulk": "سورة الملك",
    "session_one": "دقيقة هدوء",
    "session_three": "3 دقائق تأمل",
    "session_five": "5 دقائق استرخاء",
    "listening": "جاري الاستماع..."
  },
  "en": {
    "surprise_title": "Surprise Me",
    "surprise_description": "Discover a new drop",
    "app_title": "Qatra | Drop",
    "pull_to_switch": "Pull to switch theme",
    "moment_zen": "Moment of Zen",
    "click_to_program": "Tap to config",
    "next_drop": "Next Drop",
    "today_impact": "Today's Impact",
    "current_moment": "Current Moment",
    "drop_settings": "My Drop Settings",
    "display_method": "Display Mode",
    "mode_both": "Notification + Drop",
    "mode_floating": "Drop Only",
    "mode_notification": "Notification Only",
    "dur_5": "Duration: 5 Secs",
    "dur_10": "Duration: 10 Secs",
    "dur_15": "Duration: 15 Secs",
    "smart_schedule": "Smart Schedule",
    "i_want": "I want",
    "drops_daily": "drops daily",
    "from": "From",
    "to": "To",
    "apply_smart": "Apply Schedule",
    "manual_schedule": "Manual Schedule",
    "custom_schedule": "Custom time & days:",
    "save_schedule": "Save Schedule",
    "personal_library": "Personal Library",
    "library_desc": "Keep the meanings that touch your heart.",
    "discover_quotes": "Discover Quotes",
    "my_favorites": "My Favorites",
    "my_groups": "My Groups",
    "my_custom_quotes": "My Custom Quotes",
    "create_group": "Create New Group",
    "add": "Add",
    "your_garden": "Your Garden",
    "level_of_awareness": "Awareness Level",
    "tree_serenity": "Serenity Tree",
    "tree_serenity_desc": "Dhikr & Quran",
    "tree_knowledge": "Knowledge Tree",
    "tree_knowledge_desc": "Culture",
    "tree_awareness": "Awareness Tree",
    "tree_awareness_desc": "Self Dev",
    "tree_gratitude": "Gratitude Tree",
    "tree_gratitude_desc": "Poetry",
    "sakeena": "Sakeena",
    "sakeena_desc": "Choose your space to relax.",
    "nature_sounds": "Nature Sounds",
    "quran_recitation": "Quran",
    "short_sessions": "Short Sessions",
    "app_settings": "App Settings",
    "glass_mode": "Glass appearance",
    "show_image": "Show an image with the quote",
    "show_home_cards": "Show home cards",
    "language": "App Language:",
    "save_done": "Done",
    "back": "Back",
    "copied": "Copied!",
    "delete": "Delete",
    "days": "days",
    "quotes_ready": "Quotes",
    "rain": "🌧️ Rain",
    "sea": "🌊 Sea",
    "forest": "🌲 Forest",
    "birds": "🕊️ Birds",
    "all_categories": "Random",
    "cat_dhikr": "Dhikr & Supplications",
    "cat_selfDev": "Self Development",
    "cat_quran": "Quranic Verses",
    "cat_culture": "Culture",
    "cat_poetry": "Poetry",
    "my_library": "My Groups",
    "stop_repeat": "Stop Auto Repeat",
    "every_30": "Every 30 Mins",
    "every_1h": "Every 1 Hour",
    "every_3h": "Every 3 Hours",
    "every_12h": "Every 12 Hours",
    "every_24h": "Every 24 Hours",
    "no_reminders": "No scheduled reminders",
    "source_category": "1. Quotes Source",
    "your_progress": "Your activity and progress",
    "close": "Close",
    "quote_of_day": "Quote of the day",
    "choose_time": "Choose a time and at least one day.",
    "section_title": "Categories",
    "drops": "Drops",
    "after_minutes": "In {count} minutes",
    "category_label": "Category: {name}",
    "today_likes_summary": "You liked {count} drops today",
    "active_days_summary": "Active for {count} days",
    "moment_default": "Enjoy this moment",
    "moment_morning": "Start your day with a kind intention",
    "moment_afternoon": "One step is enough to begin",
    "moment_evening": "Pause and reflect on what you achieved",
    "added_favorite": "Added to favorites",
    "session_start": "A {count}-minute session has started. Relax and close your eyes.",
    "session_end": "The session has ended.",
    "playing": "Now playing",
    "group_name": "Group name",
    "enter_quote": "Enter your quote here...",
    "enter_group_name": "New group name",
    "no_custom_quotes": "Add quotes to your groups to see them here.",
    "surah_baqara": "Surah Al-Baqarah",
    "surah_kahf": "Surah Al-Kahf",
    "surah_mulk": "Surah Al-Mulk",
    "session_one": "One quiet minute",
    "session_three": "3 minutes of reflection",
    "session_five": "5 minutes of relaxation",
    "listening": "Listening..."
  },
  "fr": {
    "pull_to_switch": "Tirez pour changer le thème",
    "moment_zen": "Instant de pleine conscience",
    "click_to_program": "Appuyez pour programmer votre goutte",
    "next_drop": "Votre prochaine goutte",
    "today_impact": "Impact du jour",
    "current_moment": "Votre instant présent",
    "drop_settings": "Paramètres de ma goutte",
    "display_method": "Affichage et préférences",
    "mode_both": "Notification et goutte",
    "mode_floating": "Goutte uniquement",
    "mode_notification": "Notification uniquement",
    "dur_5": "Durée : 5 secondes",
    "dur_10": "Durée : 10 secondes",
    "dur_15": "Durée : 15 secondes",
    "smart_schedule": "Programmation intelligente",
    "i_want": "Je souhaite",
    "drops_daily": "gouttes par jour",
    "from": "De",
    "to": "À",
    "apply_smart": "Appliquer la programmation",
    "manual_schedule": "Programmation manuelle",
    "custom_schedule": "Heure et jours personnalisés :",
    "save_schedule": "Enregistrer le rappel",
    "personal_library": "Bibliothèque personnelle",
    "library_desc": "Gardez les mots qui vous touchent et classez-les dans vos groupes.",
    "discover_quotes": "Découvrir les citations",
    "my_favorites": "Mes favoris",
    "my_groups": "Mes groupes",
    "my_custom_quotes": "Mes citations",
    "create_group": "Créer un groupe",
    "add": "Ajouter",
    "your_garden": "Votre jardin",
    "level_of_awareness": "Niveau de conscience",
    "tree_serenity": "Arbre de la sérénité",
    "tree_serenity_desc": "Invocations et Coran",
    "tree_knowledge": "Arbre du savoir",
    "tree_knowledge_desc": "Culture générale",
    "tree_awareness": "Arbre de la conscience",
    "tree_awareness_desc": "Développement personnel",
    "tree_gratitude": "Arbre de la gratitude",
    "tree_gratitude_desc": "Poésie et émotions",
    "sakeena": "Sakeena",
    "sakeena_desc": "Choisissez votre espace de calme et de détente.",
    "nature_sounds": "Sons de la nature",
    "quran_recitation": "Récitation du Coran",
    "short_sessions": "Séances courtes",
    "app_settings": "Paramètres de l’application",
    "glass_mode": "Apparence en verre",
    "show_image": "Afficher une image avec la citation",
    "show_home_cards": "Afficher les cartes d’accueil",
    "language": "Langue de l’application :",
    "save_done": "Terminé et enregistré",
    "back": "Retour",
    "copied": "Copié avec succès",
    "delete": "Supprimer",
    "days": "jours",
    "quotes_ready": "citations",
    "rain": "Pluie",
    "sea": "Mer",
    "forest": "Forêt",
    "birds": "Oiseaux",
    "all_categories": "Aléatoire : toutes les catégories",
    "cat_dhikr": "Invocations et rappels",
    "cat_selfDev": "Développement personnel",
    "cat_quran": "Versets du Coran",
    "cat_culture": "Culture et sagesse",
    "cat_poetry": "Vers de poésie",
    "my_library": "Mes groupes personnels",
    "stop_repeat": "Arrêter la répétition",
    "every_30": "Toutes les 30 minutes",
    "every_1h": "Toutes les heures",
    "every_3h": "Toutes les 3 heures",
    "every_12h": "Toutes les 12 heures",
    "every_24h": "Toutes les 24 heures",
    "no_reminders": "Aucun rappel",
    "source_category": "Source des citations",
    "surprise_title": "Surprends-moi",
    "surprise_description": "Découvrez une nouvelle goutte",
    "your_progress": "Votre activité et vos progrès",
    "close": "Fermer",
    "quote_of_day": "Citation du jour",
    "choose_time": "Choisissez une heure et au moins un jour.",
    "section_title": "Catégories",
    "drops": "Gouttes",
    "after_minutes": "Dans {count} minutes",
    "category_label": "Catégorie : {name}",
    "today_likes_summary": "Vous avez aimé {count} gouttes aujourd’hui",
    "active_days_summary": "Actif pendant {count} jours",
    "moment_default": "Profitez de cet instant",
    "moment_morning": "Commencez la journée avec une belle intention",
    "moment_afternoon": "Un seul pas suffit pour commencer",
    "moment_evening": "Faites une pause et pensez à vos progrès",
    "added_favorite": "Ajouté aux favoris",
    "session_start": "Séance de {count} minutes commencée. Détendez-vous et fermez les yeux.",
    "session_end": "La séance est terminée.",
    "playing": "Lecture en cours",
    "group_name": "Nom du groupe",
    "enter_quote": "Saisissez votre citation…",
    "enter_group_name": "Nom du nouveau groupe",
    "no_custom_quotes": "Ajoutez des citations à vos groupes pour les voir ici.",
    "app_title": "QATRA",
    "surah_baqara": "Sourate Al-Baqara",
    "surah_kahf": "Sourate Al-Kahf",
    "surah_mulk": "Sourate Al-Mulk",
    "session_one": "Une minute de calme",
    "session_three": "3 minutes de méditation",
    "session_five": "5 minutes de détente",
    "listening": "Écoute en cours…"
  },
  "es": {
    "pull_to_switch": "Desliza hacia abajo para cambiar el tema",
    "moment_zen": "Momento de atención plena",
    "click_to_program": "Toca para programar tu gota",
    "next_drop": "Tu próxima gota",
    "today_impact": "Impacto de hoy",
    "current_moment": "Tu momento actual",
    "drop_settings": "Ajustes de mi gota",
    "display_method": "Visualización y preferencias",
    "mode_both": "Notificación y gota",
    "mode_floating": "Solo gota",
    "mode_notification": "Solo notificación",
    "dur_5": "Duración: 5 segundos",
    "dur_10": "Duración: 10 segundos",
    "dur_15": "Duración: 15 segundos",
    "smart_schedule": "Programación inteligente",
    "i_want": "Quiero",
    "drops_daily": "gotas al día",
    "from": "Desde",
    "to": "Hasta",
    "apply_smart": "Aplicar programación",
    "manual_schedule": "Programación manual",
    "custom_schedule": "Hora y días personalizados:",
    "save_schedule": "Guardar recordatorio",
    "personal_library": "Biblioteca personal",
    "library_desc": "Guarda las palabras que te inspiran y organízalas en grupos.",
    "discover_quotes": "Descubrir frases",
    "my_favorites": "Mis favoritos",
    "my_groups": "Mis grupos",
    "my_custom_quotes": "Mis frases",
    "create_group": "Crear un grupo",
    "add": "Añadir",
    "your_garden": "Tu jardín",
    "level_of_awareness": "Nivel de conciencia",
    "tree_serenity": "Árbol de la serenidad",
    "tree_serenity_desc": "Invocaciones y Corán",
    "tree_knowledge": "Árbol del conocimiento",
    "tree_knowledge_desc": "Cultura general",
    "tree_awareness": "Árbol de la conciencia",
    "tree_awareness_desc": "Desarrollo personal",
    "tree_gratitude": "Árbol de la gratitud",
    "tree_gratitude_desc": "Poesía y emociones",
    "sakeena": "Sakeena",
    "sakeena_desc": "Elige tu espacio de calma y relajación.",
    "nature_sounds": "Sonidos de la naturaleza",
    "quran_recitation": "Recitación del Corán",
    "short_sessions": "Sesiones cortas",
    "app_settings": "Ajustes de la aplicación",
    "glass_mode": "Apariencia de cristal",
    "show_image": "Mostrar una imagen con la frase",
    "show_home_cards": "Mostrar tarjetas de inicio",
    "language": "Idioma de la aplicación:",
    "save_done": "Listo y guardado",
    "back": "Volver",
    "copied": "Copiado correctamente",
    "delete": "Eliminar",
    "days": "días",
    "quotes_ready": "frases",
    "rain": "Lluvia",
    "sea": "Mar",
    "forest": "Bosque",
    "birds": "Aves",
    "all_categories": "Aleatorio: todas las categorías",
    "cat_dhikr": "Invocaciones y recuerdos",
    "cat_selfDev": "Desarrollo personal",
    "cat_quran": "Versículos del Corán",
    "cat_culture": "Cultura y sabiduría",
    "cat_poetry": "Versos de poesía",
    "my_library": "Mis grupos personales",
    "stop_repeat": "Detener repetición",
    "every_30": "Cada 30 minutos",
    "every_1h": "Cada hora",
    "every_3h": "Cada 3 horas",
    "every_12h": "Cada 12 horas",
    "every_24h": "Cada 24 horas",
    "no_reminders": "Sin recordatorios",
    "source_category": "Fuente de las frases",
    "surprise_title": "Sorpréndeme",
    "surprise_description": "Descubre una nueva gota",
    "your_progress": "Tu actividad y progreso",
    "close": "Cerrar",
    "quote_of_day": "Cita del día",
    "choose_time": "Elige una hora y al menos un día.",
    "section_title": "Categorías",
    "drops": "Gotas",
    "after_minutes": "En {count} minutos",
    "category_label": "Categoría: {name}",
    "today_likes_summary": "Has indicado que te gustan {count} gotas hoy",
    "active_days_summary": "Activo durante {count} días",
    "moment_default": "Disfruta este momento",
    "moment_morning": "Empieza el día con una buena intención",
    "moment_afternoon": "Un paso basta para empezar",
    "moment_evening": "Haz una pausa y reflexiona sobre tus logros",
    "added_favorite": "Añadido a favoritos",
    "session_start": "Ha comenzado una sesión de {count} minutos. Relájate y cierra los ojos.",
    "session_end": "La sesión ha terminado.",
    "playing": "Reproduciendo",
    "group_name": "Nombre del grupo",
    "enter_quote": "Escribe tu frase…",
    "enter_group_name": "Nombre del nuevo grupo",
    "no_custom_quotes": "Añade frases a tus grupos para verlas aquí.",
    "app_title": "QATRA",
    "surah_baqara": "Sura Al-Baqara",
    "surah_kahf": "Sura Al-Kahf",
    "surah_mulk": "Sura Al-Mulk",
    "session_one": "Un minuto de calma",
    "session_three": "3 minutos de reflexión",
    "session_five": "5 minutos de relajación",
    "listening": "Escuchando…"
  },
  "de": {
    "pull_to_switch": "Zum Themenwechsel nach unten ziehen",
    "moment_zen": "Moment der Achtsamkeit",
    "click_to_program": "Tippen, um den Tropfen zu planen",
    "next_drop": "Dein nächster Tropfen",
    "today_impact": "Heutige Wirkung",
    "current_moment": "Dein aktueller Moment",
    "drop_settings": "Tropfen-Einstellungen",
    "display_method": "Anzeige und Einstellungen",
    "mode_both": "Benachrichtigung und Tropfen",
    "mode_floating": "Nur Tropfen",
    "mode_notification": "Nur Benachrichtigung",
    "dur_5": "Dauer: 5 Sekunden",
    "dur_10": "Dauer: 10 Sekunden",
    "dur_15": "Dauer: 15 Sekunden",
    "smart_schedule": "Intelligente Planung",
    "i_want": "Ich möchte",
    "drops_daily": "Tropfen täglich",
    "from": "Von",
    "to": "Bis",
    "apply_smart": "Planung anwenden",
    "manual_schedule": "Manuelle Planung",
    "custom_schedule": "Uhrzeit und Wochentage:",
    "save_schedule": "Erinnerung speichern",
    "personal_library": "Persönliche Bibliothek",
    "library_desc": "Bewahre Worte, die dich berühren, in deinen Gruppen auf.",
    "discover_quotes": "Zitate entdecken",
    "my_favorites": "Meine Favoriten",
    "my_groups": "Meine Gruppen",
    "my_custom_quotes": "Meine Zitate",
    "create_group": "Gruppe erstellen",
    "add": "Hinzufügen",
    "your_garden": "Dein Garten",
    "level_of_awareness": "Achtsamkeitsniveau",
    "tree_serenity": "Baum der Gelassenheit",
    "tree_serenity_desc": "Bittgebete und Koran",
    "tree_knowledge": "Baum des Wissens",
    "tree_knowledge_desc": "Allgemeinwissen",
    "tree_awareness": "Baum der Achtsamkeit",
    "tree_awareness_desc": "Persönliche Entwicklung",
    "tree_gratitude": "Baum der Dankbarkeit",
    "tree_gratitude_desc": "Poesie und Gefühle",
    "sakeena": "Sakeena",
    "sakeena_desc": "Wähle deinen Ort für Ruhe und Entspannung.",
    "nature_sounds": "Naturklänge",
    "quran_recitation": "Koranrezitation",
    "short_sessions": "Kurze Sitzungen",
    "app_settings": "App-Einstellungen",
    "glass_mode": "Glasoptik",
    "show_image": "Bild zum Zitat anzeigen",
    "show_home_cards": "Startseitenkarten anzeigen",
    "language": "App-Sprache:",
    "save_done": "Fertig und gespeichert",
    "back": "Zurück",
    "copied": "Erfolgreich kopiert",
    "delete": "Löschen",
    "days": "Tage",
    "quotes_ready": "Zitate",
    "rain": "Regen",
    "sea": "Meer",
    "forest": "Wald",
    "birds": "Vögel",
    "all_categories": "Zufällig aus allen Kategorien",
    "cat_dhikr": "Bittgebete und Gedenken",
    "cat_selfDev": "Persönliche Entwicklung",
    "cat_quran": "Koranverse",
    "cat_culture": "Wissen und Weisheit",
    "cat_poetry": "Gedichte",
    "my_library": "Meine persönlichen Gruppen",
    "stop_repeat": "Wiederholung beenden",
    "every_30": "Alle 30 Minuten",
    "every_1h": "Jede Stunde",
    "every_3h": "Alle 3 Stunden",
    "every_12h": "Alle 12 Stunden",
    "every_24h": "Alle 24 Stunden",
    "no_reminders": "Keine Erinnerungen",
    "source_category": "Zitatquelle",
    "surprise_title": "Überrasche mich",
    "surprise_description": "Entdecke einen neuen Tropfen",
    "your_progress": "Deine Aktivität und Fortschritte",
    "close": "Schließen",
    "quote_of_day": "Zitat des Tages",
    "choose_time": "Wähle eine Uhrzeit und mindestens einen Tag.",
    "section_title": "Kategorien",
    "drops": "Tropfen",
    "after_minutes": "In {count} Minuten",
    "category_label": "Kategorie: {name}",
    "today_likes_summary": "Du hast heute {count} Tropfen mit Gefällt mir markiert",
    "active_days_summary": "Seit {count} Tagen aktiv",
    "moment_default": "Genieße diesen Moment",
    "moment_morning": "Beginne den Tag mit einer guten Absicht",
    "moment_afternoon": "Ein Schritt reicht für den Anfang",
    "moment_evening": "Halte inne und denke an deine Erfolge",
    "added_favorite": "Zu Favoriten hinzugefügt",
    "session_start": "Eine Sitzung von {count} Minuten beginnt. Entspanne dich und schließe die Augen.",
    "session_end": "Die Sitzung ist beendet.",
    "playing": "Wiedergabe läuft",
    "group_name": "Gruppenname",
    "enter_quote": "Gib dein Zitat ein…",
    "enter_group_name": "Name der neuen Gruppe",
    "no_custom_quotes": "Füge deinen Gruppen Zitate hinzu, um sie hier zu sehen.",
    "app_title": "QATRA",
    "surah_baqara": "Sure Al-Baqara",
    "surah_kahf": "Sure Al-Kahf",
    "surah_mulk": "Sure Al-Mulk",
    "session_one": "Eine Minute Ruhe",
    "session_three": "3 Minuten Besinnung",
    "session_five": "5 Minuten Entspannung",
    "listening": "Wiedergabe…"
  }
};

const QUOTES_DB = {
  dhikr: { key: "cat_dhikr", icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', items: ["سبحان الله وبحمده سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "اللهم إنك عفو تحب العفو فاعف عني.", "يا حي يا قيوم برحمتك أستغيث.", "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه.", "لا إله إلا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير.", "اللهم صل وسلم وبارك على نبينا محمد.", "حسبنا الله ونعم الوكيل.", "لا حول ولا قوة إلا بالله العلي العظيم.", "اللهم آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.", "اللهم إني أسألك الهدى والتقى والعفاف والغنى.", "اللهم مقلب القلوب ثبت قلبي على دينك.", "رضيت بالله ربا وبالإسلام دينا وبمحمد نبيا.", "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم.", "أعوذ بكلمات الله التامات من شر ما خلق.", "اللهم إني أعوذ بك من الهم والحزن.", "اللهم إني أعوذ بك من العجز والكسل.", "اللهم إني أعوذ بك من الجبن والبخل.", "اللهم إني أعوذ بك من غلبة الدين وقهر الرجال.", "اللهم إني أسألك العفو والعافية في الدنيا والآخرة.", "اللهم استر عوراتي وآمن روعاتي.", "اللهم احفظني من بين يدي ومن خلفي وعن يميني وعن شمالي.", "أستغفر الله وأتوب إليه.", "اللهم اغفر لي ذنبي كله دقه وجله وأوله وآخره.", "اللهم اجعل في قلبي نورا وفي بصري نورا.", "سبحان الله عدد ما خلق سبحان الله ملء ما خلق.", "الحمد لله عدد ما خلق الحمد لله ملء ما خلق.", "لا إله إلا الله عدد ما خلق لا إله إلا الله ملء ما خلق.", "الله أكبر عدد ما خلق الله أكبر ملء ما خلق.", "اللهم إني أسألك الجنة وما قرب إليها من قول أو عمل.", "اللهم إني أعوذ بك من النار وما قرب إليها من قول أو عمل.", "اللهم أحسن عاقبتنا في الأمور كلها.", "اللهم أجرنا من خزي الدنيا وعذاب الآخرة.", "اللهم قني عذابك يوم تبعث عبادك.", "يا مقلب القلوب ثبت قلبي على دينك.", "يا مصرف القلوب صرف قلوبنا على طاعتك.", "اللهم أعني على ذكرك وشكرك وحسن عبادتك.", "اللهم إني ظلمت نفسي ظلما كثيرا ولا يغفر الذنوب إلا أنت.", "فاغفر لي مغفرة من عندك وارحمني إنك أنت الغفور الرحيم.", "اللهم إني أسألك علما نافعا ورزقا طيبا وعملا متقبلا.", "اللهم إني أعوذ بك من علم لا ينفع ومن قلب لا يخشع.", "اللهم إني أعوذ بك من نفس لا تشبع ومن دعوة لا يستجاب لها.", "اللهم رحمتك أرجو فلا تكلني إلى نفسي طرفة عين.", "اللهم أصلح لي شأني كله لا إله إلا أنت.", "لا إله إلا الله العظيم الحليم.", "لا إله إلا الله رب العرش العظيم.", "لا إله إلا الله رب السماوات ورب الأرض ورب العرش الكريم.", "اللهم اغفر لي وارحمني واهدني واجبرني وعافني وارزقني.", "اللهم إني أسألك من الخير كله عاجله وآجله ما علمت منه وما لم أعلم.", "اللهم إني أعوذ بك من الشر كله عاجله وآجله ما علمت منه وما لم أعلم.", "اللهم إني أسألك من خير ما سألك عبدك ونبيك.", "اللهم إني أعوذ بك من شر ما عاذ به عبدك ونبيك.", "اللهم ما قضيت لي من قضاء فاجعل عاقبته رشدا.", "اللهم اكفني بحلالك عن حرامك وأغنني بفضلك عمن سواك.", "اللهم طهر قلبي من النفاق وعملي من الرياء ولساني من الكذب وعيني من الخيانة.", "اللهم إنك تعلم خائنة الأعين وما تخفي الصدور.", "اللهم اجعلني شكورا واجعلني صبورا واجعلني في عيني صغيرا وفي أعين الناس كبيرا.", "اللهم اغفر للمؤمنين والمؤمنات والمسلمين والمسلمات الأحياء منهم والأموات.", "اللهم إني أسألك عيشة نقية وميتة سوية ومردا غير مخز ولا فاضح.", "اللهم إني أسألك الفردوس الأعلى من الجنة.", "اللهم أجرني من النار.", "اللهم إني أسألك حبك وحب من يحبك وحب عمل يقربني إلى حبك.", "اللهم اجعل حبك أحب إلي من نفسي وأهلي ومن الماء البارد.", "اللهم ارزقني حلاوة الإيمان.", "اللهم زيني بزينة الإيمان واجعلني هاديا مهديا.", "اللهم اهدني وسددني.", "اللهم إني أسألك الهدى والسداد.", "اللهم إني أعوذ بك من زوال نعمتك وتحول عافيتك وفجاءة نقمتك وجميع سخطك.", "اللهم إني أعوذ بك من جهد البلاء ودرك الشقاء وسوء القضاء وشماتة الأعداء.", "اللهم مصرف القلوب صرف قلوبنا على طاعتك.", "اللهم أصلح لي ديني الذي هو عصمة أمري.", "اللهم أصلح لي دنياي التي فيها معاشي.", "اللهم أصلح لي آخرتي التي فيها معادي.", "اللهم اجعل الحياة زيادة لي في كل خير.", "اللهم اجعل الموت راحة لي من كل شر.", "اللهم رب جبرائيل وميكائيل وإسرافيل فاطر السماوات والأرض عالم الغيب والشهادة.", "أنت تحكم بين عبادك فيما كانوا فيه يختلفون.", "اهدني لما اختلف فيه من الحق بإذنك إنك تهدي من تشاء إلى صراط مستقيم.", "اللهم إني أسألك العافية في الدنيا والآخرة.", "اللهم متعني بسمعي وبصري واجعلهما الوارث مني.", "اللهم انصرني على من ظلمني وخذ منه بثأري.", "اللهم إني أعوذ بك من البرص والجنون والجذام ومن سيئ الأسقام.", "اللهم إني أعوذ بك من الفقر والقلة والذلة.", "اللهم إني أعوذ بك من أن أظلم أو أظلم.", "اللهم إني أعوذ بك من يوم السوء ومن ليلة السوء ومن ساعة السوء ومن صاحب السوء ومن جار السوء.", "اللهم ارزقني حسن الخاتمة.", "اللهم توفني مسلما وألحقني بالصالحين.", "اللهم اغفر لي خطيئتي وجهلي وإسرافي في أمري وما أنت أعلم به مني.", "اللهم اغفر لي جدي وهزلي وخطئي وعمدي وكل ذلك عندي.", "اللهم اغفر لي ما قدمت وما أخرت وما أسررت وما أعلنت وما أنت أعلم به مني.", "أنت المقدم وأنت المؤخر وأنت على كل شيء قدير.", "اللهم ارزقني توبة نصوحا قبل الموت.", "اللهم اجعل قبري روضة من رياض الجنة.", "اللهم يسر حسابي ويمن كتابي.", "اللهم اجعلني من الذين يستمعون القول فيتبعون أحسنه.", "اللهم إني أسألك النعيم المقيم الذي لا يحول ولا يزول.", "اللهم إني أسألك الأمن يوم الخوف.", "اللهم اكشف عني كل بلوى ونجني من كل كرب.", "اللهم إني أسألك الرضا بعد القضاء وبرد العيش بعد الموت.", "اللهم إني أسألك لذة النظر إلى وجهك والشوق إلى لقائك."] },
  selfDev: { key: "cat_selfDev", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', items: ["الهدوء ليس ضعفا بل هو قوة التحكم في الذات.", "كل إنجاز عظيم بدأ بقرار بسيط للمحاولة.", "لا تقارن بدايتك بموسم حصاد الآخرين.", "النجاح يبدأ بخطوة واحدة والمسيرة تكتمل بالإصرار.", "العمل الجاد يتفوق على الموهبة حينما تتكاسل الموهبة عن العمل.", "لا تستسلم أبدا فالقادم أجمل بكثير مما مضى.", "أنت أقوى مما تتخيل وأكثر ذكاء مما تعتقد.", "كل يوم جديد هو فرصة جديدة لإعادة كتابة قصتك.", "النسخة الأفضل منك تنتظر في نهاية طريق الالتزام.", "لا تخف من الفشل بل خف من البقاء في نفس المكان.", "العقبات هي مجرد اختبارات لمدى رغبتك في الوصول.", "ركز على الخطوة التالية وليس على الجبل بأكمله.", "النجاح ليس مفتاح السعادة بل السعادة هي مفتاح النجاح.", "ما تزرعه اليوم بعناء ستحصده غدا بفخر.", "استثمر في عقلك فهو أصل كل ثروة.", "الإيجابية لا تعني غياب المشاكل بل تعني القدرة على التعامل معها.", "الفرق بين المستحيل والممكن يكمن في العزيمة.", "اجعل من أخطائك دروسا تنير لك الطريق.", "لا تدع آراء الآخرين تحدد من أنت.", "الشغف هو الوقود الذي يدفعك للاستمرار.", "التميز ليس فعلا بل هو عادة يومية.", "الخوف من الفشل يقتل الأحلام أكثر من الفشل نفسه.", "ابدأ من حيث أنت واستخدم ما تملك وافعل ما تستطيع.", "النجاح يولد من رحم التحديات.", "الطريق إلى القمة يبدأ بخطوة مليئة بالثقة.", "لا تكن أسيرا لماضيك بل كن مهندسا لمستقبلك.", "كل ألم يبني فيك قوة جديدة لم تكن تعرفها.", "الإرادة القوية تقهر كل الصعاب.", "كن أنت التغيير الذي تريده في العالم.", "لا تنتظر الفرصة بل اصنعها بنفسك.", "النجاح رحلة وليس وجهة نهائية.", "الصبر والمثابرة هما مفتاحا كل باب مغلق.", "تعلم كيف ترتاح لا كيف تستسلم.", "الأهداف هي أحلام بمواعيد نهائية.", "توقف عن تمني الأشياء وابدأ في العمل من أجلها.", "تطوير الذات هو استثمار لا يخسر أبدا.", "ابحث عن الجمال في كل شيء حتى في أصعب الأوقات.", "كن فخورا بكل خطوة تخطوها نحو هدفك.", "لا تقبل بأقل مما تستحق.", "النجاح يحتاج إلى شجاعة للبدء وعزيمة للاستمرار.", "كلما زادت التحديات زادت حلاوة الانتصار.", "العمل بصمت يصنع ضجيج النجاح.", "التفكير الإيجابي يفتح أبوابا كانت تبدو مغلقة.", "الفشل الحقيقي هو التوقف عن المحاولة.", "تذكر دائما لماذا بدأت عندما تفكر في الاستسلام.", "التغيير يبدأ من الداخل قبل أن يظهر في الخارج.", "كن مصدر إلهام لنفسك قبل أن تلهم الآخرين.", "النجاح لا يأتي بالصدفة بل بالتخطيط والعمل.", "لا تضيع وقتك في الندم بل استثمره في التعلم.", "التركيز على الحلول يصغر حجم المشاكل.", "العقل الباطن يحقق ما تؤمن به بصدق.", "اجعل من يومك تحفة فنية.", "الثقة بالنفس هي أول سر من أسرار النجاح.", "الطموح بلا عمل كطائر بلا أجنحة.", "تحدى نفسك كل يوم لتكون أفضل من الأمس.", "لا تدع الأعذار تسرق أحلامك.", "النجاح يتطلب التضحية ببعض الراحة من أجل المستقبل.", "الحياة تمنحك ما تستحق عندما تسعى إليه بجد.", "كل صباح هو بداية لفرصة عظيمة.", "استمر في التقدم حتى وإن كانت خطواتك بطيئة.", "قوة العقل قادرة على تحطيم أقوى الحواجز.", "لا شيء يقف أمام إرادة إنسان مصمم على النجاح.", "اجعل من النقد البناء سلما للارتقاء.", "النجاح ليس حكرا على أحد بل لمن يدفع الثمن.", "التفاؤل هو الإيمان الذي يؤدي إلى الإنجاز.", "العمل الدؤوب يحول الحلم إلى حقيقة.", "لا تنتظر الظروف المثالية بل اصنعها.", "الإبداع يبدأ عندما تخرج من منطقة راحتك.", "تعلم من الأمس وعش لليوم وخطط للغد.", "كل مشكلة تحمل في طياتها بذور فرصة جديدة.", "النجاح هو القدرة على الانتقال من فشل إلى فشل دون فقدان الحماس.", "لا تخش البدء من جديد فهذه المرة ستبدأ بخبرة.", "القوة الحقيقية تظهر في أوقات الضعف.", "الالتزام هو ما يحول الوعود إلى واقع.", "لا تجعل الخوف يقرر مصيرك.", "النجاح هو محصلة مجهودات صغيرة تتكرر يوميا.", "الشخص الوحيد الذي يجب أن تحاول التفوق عليه هو أنت بالأمس.", "الشك يقتل الأحلام أكثر من الفشل.", "التفكير الإبداعي يفتح آفاقا لا حدود لها.", "لا تتوقف عن التعلم فالحياة لا تتوقف عن التعليم.", "الصمود في وجه العواصف يصنع بحارة ماهرين.", "النجاح يكمن في التفاصيل الصغيرة.", "اجعل أهدافك عالية ولا تتوقف حتى تصل إليها.", "الإيمان بالنفس هو الخطوة الأولى نحو العظمة.", "التحفيز الداخلي هو المحرك الأقوى للإنجاز.", "لا تعتمد على الحظ بل اصنع حظك بيدك.", "كل يوم يحمل لك فرصة لتكون نسخة أفضل.", "النجاح يتطلب الصبر والمثابرة والعمل الجاد.", "تجاوز حدودك واكتشف قدراتك الكامنة.", "لا تجعل الماضي يسرق حاضرك ومستقبلك.", "العمل بشغف يقلل من الشعور بالتعب.", "التحديات هي ما تجعل الحياة مثيرة للاهتمام.", "تغلب على مخاوفك وانطلق نحو أحلامك.", "النجاح لا يقاس بما تملكه بل بما تحققه.", "الإيجابية هي مفتاح السعادة والنجاح.", "لا تدع اليأس يتسلل إلى قلبك.", "العمل المستمر هو سر التفوق.", "تطوير المهارات يفتح أبواب الفرص.", "النجاح هو رحلة اكتشاف الذات.", "اجعل من حياتك قصة تستحق أن تروى."] },
  quran: { key: "cat_quran", icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', items: ["ومن يتوكل على الله فهو حسبه.", "إن مع العسر يسرا.", "لا تحزن إن الله معنا.", "والله يعصمك من الناس.", "وهو معكم أينما كنتم.", "فصبر جميل والله المستعان.", "إن الله وملائكته يصلون على النبي.", "وما توفيقي إلا بالله.", "واصبر وما صبرك إلا بالله.", "إن الله يحب المتوكلين.", "الله نور السماوات والأرض.", "فإن مع العسر يسرا.", "ومن يتق الله يجعل له مخرجا.", "ويرزقه من حيث لا يحتسب.", "إن الله بالغ أمره.", "قد جعل الله لكل شيء قدرا.", "سيجعل الله بعد عسر يسرا.", "إن الله مع الصابرين.", "ولا تحزن عليهم ولا تك في ضيق مما يمكرون.", "فالله خير حافظا وهو أرحم الراحمين.", "إن ربي لطيف لما يشاء.", "إنه هو العليم الحكيم.", "أليس الله بكاف عبده.", "قل لن يصيبنا إلا ما كتب الله لنا.", "هو مولانا وعلى الله فليتوكل المؤمنون.", "وإن يمسسك الله بضر فلا كاشف له إلا هو.", "وإن يردك بخير فلا راد لفضله.", "يصيب به من يشاء من عباده.", "وهو الغفور الرحيم.", "وننزل من القرآن ما هو شفاء ورحمة للمؤمنين.", "فاستجبنا له ونجيناه من الغم.", "وكذلك ننجي المؤمنين.", "رب إني مسني الضر وأنت أرحم الراحمين.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", "إني توكلت على الله ربي وربكم.", "ما من دابة إلا هو آخذ بناصيتها.", "إن ربي على صراط مستقيم.", "رب أوزعني أن أشكر نعمتك التي أنعمت علي.", "وعلى والدي وأن أعمل صالحا ترضاه.", "وأدخلني برحمتك في عبادك الصالحين.", "ربنا لا تزغ قلوبنا بعد إذ هديتنا.", "وهب لنا من لدنك رحمة.", "إنك أنت الوهاب.", "ربنا إننا آمنا فاغفر لنا ذنوبنا.", "وقنا عذاب النار.", "الصابرين والصادقين والقانتين والمنفقين.", "والمستغفرين بالأسحار.", "شهد الله أنه لا إله إلا هو.", "والملائكة وأولو العلم قائما بالقسط.", "لا إله إلا هو العزيز الحكيم.", "إن الدين عند الله الإسلام.", "قل إن كنتم تحبون الله فاتبعوني.", "يحببكم الله ويغفر لكم ذنوبكم.", "والله غفور رحيم.", "ربنا تقبل منا إنك أنت السميع العليم.", "وتب علينا إنك أنت التواب الرحيم.", "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة.", "ربنا لا تؤاخذنا إن نسينا أو أخطأنا.", "ربنا ولا تحمل علينا إصرا كما حملته على الذين من قبلنا.", "ربنا ولا تحملنا ما لا طاقة لنا به.", "واعف عنا واغفر لنا وارحمنا.", "أنت مولانا فانصرنا على القوم الكافرين.", "بل الله مولاكم وهو خير الناصرين.", "وما جعله الله إلا بشرى لكم.", "ولتطمئن قلوبكم به.", "وما النصر إلا من عند الله العزيز الحكيم.", "حسبنا الله ونعم الوكيل.", "فانقلبوا بنعمة من الله وفضل لم يمسسهم سوء.", "واتبعوا رضوان الله.", "والله ذو فضل عظيم.", "الذين قال لهم الناس إن الناس قد جمعوا لكم فاخشوهم.", "فزادهم إيمانا وقالوا حسبنا الله ونعم الوكيل.", "فآتاهم الله ثواب الدنيا وحسن ثواب الآخرة.", "والله يحب المحسنين.", "وكأين من نبي قاتل معه ربيون كثير.", "فما وهنوا لما أصابهم في سبيل الله.", "وما ضعفوا وما استكانوا.", "والله يحب الصابرين.", "وما كان قولهم إلا أن قالوا ربنا اغفر لنا ذنوبنا.", "وإسرافنا في أمرنا وثبت أقدامنا.", "وانصرنا على القوم الكافرين.", "فاعف عنهم واستغفر لهم وشاورهم في الأمر.", "فإذا عزمت فتوكل على الله.", "إن ينصركم الله فلا غالب لكم.", "وإن يخذلكم فمن ذا الذي ينصركم من بعده.", "وعلى الله فليتوكل المؤمنون.", "كل نفس ذائقة الموت.", "وإنما توفون أجوركم يوم القيامة.", "فمن زحزح عن النار وأدخل الجنة فقد فاز.", "وما الحياة الدنيا إلا متاع الغرور.", "لتبلون في أموالكم وأنفسكم.", "ولتسمعن من الذين أوتوا الكتاب من قبلكم.", "ومن الذين أشركوا أذى كثيرا.", "وإن تصبروا وتتقوا فإن ذلك من عزم الأمور.", "لا يغرنك تقلب الذين كفروا في البلاد.", "متاع قليل ثم مأواهم جهنم وبئس المهاد.", "لكن الذين اتقوا ربهم لهم جنات تجري من تحتها الأنهار.", "خالدين فيها نزلا من عند الله.", "وما عند الله خير للأبرار."] },
  culture: { key: "cat_culture", icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>', items: ["الوقت كالسيف إن لم تقطعه قطعك.", "العقل السليم في الجسم السليم.", "من جد وجد ومن زرع حصد.", "الأرض تدور حول الشمس ومجرة درب التبانة هي موطننا.", "أقدم مدينة مأهولة في التاريخ هي مدينة أريحا في فلسطين.", "الماء يغلي عند مئة درجة مئوية ويتجمد عند الصفر.", "تأسست جامعة القرويين في المغرب وهي أقدم جامعة في العالم.", "جبل إفرست هو أعلى قمة جبلية على وجه الأرض.", "البحر الميت هو أخفض نقطة على يابسة الكرة الأرضية.", "الأسد لا يلتفت لصياح الضفادع.", "علم الفلك يدرس الأجرام السماوية والظواهر الكونية.", "من طلب العلا سهر الليالي.", "الكتاب خير جليس في الزمان.", "الحكمة ضالة المؤمن أنى وجدها فهو أحق بها.", "سور الصين العظيم هو أطول بناء صنعه الإنسان.", "الأمازون هو أكبر نهر في العالم من حيث حجم تدفق المياه.", "المحيط الهادئ هو أكبر محيطات الكرة الأرضية.", "الدماغ البشري يستهلك نحو عشرين بالمئة من طاقة الجسم.", "ابن سينا هو من أشهر علماء الطب في التاريخ الإسلامي.", "الخوارزمي هو مؤسس علم الجبر وأول من استخدم الصفر.", "تاج محل في الهند يعتبر من أجمل المعالم المعمارية في العالم.", "الطاقة لا تفنى ولا تستحدث من العدم بل تتحول من شكل لآخر.", "الضوء ينتقل بسرعة تقارب ثلاثمائة ألف كيلومتر في الثانية.", "الأكسجين يشكل حوالي إحدى وعشرين بالمئة من الغلاف الجوي.", "القناعة كنز لا يفنى.", "العلم يبني بيوتا لا عماد لها والجهل يهدم بيوت العز والشرف.", "قطرة الماء تثقب الحجر لا بالعنف بل بالمثابرة.", "الابتسامة لغة لا تحتاج إلى ترجمة.", "أول من اخترع الطباعة هو يوهانس غوتنبرغ.", "الجاذبية الأرضية هي القوة التي تبقينا على سطح الكوكب.", "الذهب معدن لا يصدأ ولا يتآكل بمرور الزمن.", "الماس هو أصلب مادة طبيعية معروفة.", "القلب السليم يضخ الدم آلاف المرات يوميا دون توقف.", "التاريخ هو معلم الأجيال ومخزن العبر.", "الحضارة الفرعونية تركت إرثا معماريا وثقافيا هائلا.", "الكندي هو أول فيلسوف عربي في الإسلام.", "الجاحظ من أشهر أدباء العصر العباسي.", "المتنبي يعتبر من أعظم شعراء العرب.", "البيروني قدم إسهامات عظيمة في علم الفلك والرياضيات.", "الفارابي لقب بالمعلم الثاني بعد أرسطو.", "ابن خلدون هو مؤسس علم الاجتماع الحديث.", "الإدريسي رسم واحدة من أدق خرائط العالم في العصور الوسطى.", "الرازي كان له فضل كبير في تطوير الكيمياء والطب.", "ابن بطوطة هو أشهر رحالة في التاريخ الإسلامي.", "اللسان ليس له عظام لكنه يكسر القلوب.", "الكرم هو أن تعطي أكثر مما تستطيع والغرور هو أن تأخذ أقل مما تحتاج.", "الصمت حكمة وقليل فاعله.", "العجلة من الشيطان والتأني من الرحمن.", "من حفر حفرة لأخيه وقع فيها.", "الطيور على أشكالها تقع.", "الجزائر هي أكبر دولة إفريقية من حيث المساحة.", "روسيا هي أكبر دولة في العالم من حيث المساحة.", "الفاتيكان هي أصغر دولة في العالم.", "نهر النيل هو أطول نهر في العالم.", "الصحراء الكبرى هي أكبر صحراء حارة في العالم.", "البطريق طائر يعيش في النصف الجنوبي من الكرة الأرضية.", "النحل حشرة مفيدة تنتج العسل وتلقح النباتات.", "الخفاش هو الثديي الوحيد القادر على الطيران الحقيقي.", "الحوت الأزرق هو أكبر حيوان على وجه الأرض.", "الدلفين حيوان بحري ذكي وودود للإنسان.", "الجمل يلقب بسفينة الصحراء لقدرته على تحمل العطش.", "الفيل يتميز بذاكرة قوية وذكاء حاد.", "الأسد يلقب بملك الغابة لزئيره وقوته.", "الفهد هو أسرع حيوان بري على وجه الأرض.", "الصقر طائر جارح يتميز بقوة البصر وسرعة الانقضاض.", "الحمامة ترمز للسلام والمحبة في كثير من الثقافات.", "الوردة الحمراء ترمز للحب والعاطفة.", "شجرة الزيتون ترمز للسلام والبركة.", "النخلة شجرة مباركة وثمرها التمر.", "التفاحة فاكهة مفيدة للصحة والوقاية من الأمراض.", "البرتقال غني بفيتامين سي المقوي للمناعة.", "العسل شفاء للناس ومصدر للطاقة.", "الحليب غذاء متكامل غني بالكالسيوم.", "الخبز هو الغذاء الأساسي لكثير من شعوب العالم.", "الأرز يعتبر الغذاء الرئيسي في قارة آسيا.", "القهوة مشروب منبه يحظى بشعبية عالمية.", "الشاي هو المشروب الأكثر استهلاكا بعد الماء.", "السكر يستخرج من قصب السكر أو بنجر السكر.", "الملح يعزز نكهة الطعام ويحفظه من التلف.", "الذهب والفضة معادن نفيسة تستخدم في الزينة والنقود.", "الحديد معدن أساسي في الصناعة والبناء.", "النحاس موصل جيد للكهرباء والحرارة.", "الألمنيوم معدن خفيف ومقاوم للصدأ.", "البلاستيك مادة صناعية متعددة الاستخدامات.", "الورق يخترع من لب الخشب ويستخدم في الكتابة والطباعة.", "الإنترنت شبكة عنكبوتية تربط العالم بأسره.", "الحاسوب جهاز إلكتروني يعالج البيانات بسرعة فائقة.", "الهاتف الذكي يجمع بين ميزات الهاتف والحاسوب.", "الكاميرا تلتقط الصور وتسجل اللحظات.", "التلفاز ينقل الصورة والصوت عبر مسافات بعيدة.", "السيارة وسيلة نقل برية شائعة الاستخدام.", "الطائرة وسيلة نقل جوية سريعة ومريحة.", "السفينة وسيلة نقل بحرية تحمل الركاب والبضائع.", "القطار وسيلة نقل برية تسير على السكك الحديدية.", "الدراجة وسيلة نقل صديقة للبيئة ومفيدة للصحة.", "الساعة آلة لقياس الوقت بدقة.", "البوصلة تحدد الاتجاهات الجغرافية.", "المجهر يكبر الأشياء الصغيرة جدا.", "التلسكوب يقرب الأجرام السماوية البعيدة.", "الميزان أداة لقياس الكتلة والوزن."] },
  poetry: { key: "cat_poetry", icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>', items: ["وما نيل المطالب بالتمني ولكن تؤخذ الدنيا غلابا.", "دقات قلب المرء قائلة له إن الحياة دقائق وثواني.", "تجري الرياح بما لا تشتهي السفن.", "إذا الشعب يوما أراد الحياة فلا بد أن يستجيب القدر.", "السيف أصدق أنباء من الكتب في حده الحد بين الجد واللعب.", "الخيل والليل والبيداء تعرفني والسيف والرمح والقرطاس والقلم.", "ومن هاب أسباب المنايا ينلنه وإن يرق أسباب السماء بسلم.", "إذا غامرت في شرف مروم فلا تقنع بما دون النجوم.", "فطعم الموت في أمر حقير كطعم الموت في أمر عظيم.", "ولست أرى السعادة جمع مال ولكن التقي هو السعيد.", "أعلل النفس بالآمال أرقبها ما أضيق العيش لولا فسحة الأمل.", "ذو العقل يشقى في النعيم بعقله وأخو الجهالة في الشقاوة ينعم.", "لا تحسبن المجد تمرا أنت آكله لن تبلغ المجد حتى تلعق الصبرا.", "لكل شيء إذا ما تم نقصان فلا يغر بطيب العيش إنسان.", "هي الأمور كما شاهدتها دول من سره زمن ساءته أزمان.", "الأم مدرسة إذا أعددتها أعددت شعبا طيب الأعراق.", "وإذا أصيب القوم في أخلاقهم فأقم عليهم مأتما وعويلا.", "لا تنه عن خلق وتأتي مثله عار عليك إذا فعلت عظيم.", "وإنما الأمم الأخلاق ما بقيت فإن هم ذهبت أخلاقهم ذهبوا.", "يعطيك من طرف اللسان حلاوة ويروغ منك كما يروغ الثعلب.", "إن الشباب والفراغ والجدة مفسدة للمرء أي مفسدة.", "الرأي قبل شجاعة الشجعان هو أول وهي المحل الثاني.", "ولم أر في عيوب الناس شيئا كنقص القادرين على التمام.", "على قدر أهل العزم تأتي العزائم وتأتي على قدر الكرام المكارم.", "وتعظم في عين الصغير صغارها وتصغر في عين العظيم العظائم.", "أنا الذي نظر الأعمى إلى أدبي وأسمعت كلماتي من به صمم.", "ومن يك ذا فم مر مريض يجد مرا به الماء الزلالا.", "إذا رأيت نيوب الليث بارزة فلا تظنن أن الليث يبتسم.", "وما الحسن في وجه الفتى شرفا له إذا لم يكن في فعله والخلائق.", "نبكي على الدنيا وما من معشر جمعتهم الدنيا فلم يتفرقوا.", "أين القصور أبا حسن وأربابها شط المزار وعنهم انقطع الخبر.", "كفى بك داء أن ترى الموت شافيا وحسب المنايا أن يكن أمانيا.", "وما كل ما يتمنى المرء يدركه تجري الرياح بما لا تشتهي السفن.", "ضاقت فلما استحكمت حلقاتها فرجت وكنت أظنها لا تفرج.", "قم للمعلم وفه التبجيلا كاد المعلم أن يكون رسولا.", "نعيب زماننا والعيب فينا وما لزماننا عيب سوانا.", "وقد ينبت المرعى على دمن الثرى وتبقى حزازات النفوس كما هيا.", "ولولا المشقة ساد الناس كلهم الجود يفقر والإقدام قتال.", "وما المرء إلا بإخوانه كما تقبض الكف بالمعصم.", "ولا خير في ود امرئ متلون إذا الريح مالت مال حيث تميل.", "تغرد الطيور في صباح مشرق لتعزف ألحان الأمل والحياة.", "الليل يستر العيوب والنهار يفضح الأسرار.", "القلب يهفو إلى الذكريات الجميلة رغم قسوة الأيام.", "الدموع تغسل أحزان الروح وتطهر القلب.", "الابتسامة تضيء الوجه وتنشر الفرح في الأرجاء.", "الصمت لغة العظماء وكلام الجهلاء.", "الحب شعور نقي يجمع القلوب على الخير.", "الصداقة كنز ثمين لا يقدر بثمن.", "الأخوة رباط وثيق يجمع العائلة على المحبة.", "الوطن هو الملجأ الآمن والحضن الدافئ.", "الغربة مرارة قاسية لا يعرفها إلا من جربها.", "الشوق نار تحرق القلوب وتدمع العيون.", "الأمل شمعة تضيء دروب الحياة المظلمة.", "اليأس عدو خفي يقتل الطموح والأحلام.", "النجاح ثمرة العمل الجاد والمثابرة.", "الفشل درس مفيد يعلمنا كيف ننهض من جديد.", "الحياة رحلة قصيرة يجب أن نعيشها بكل لحظاتها.", "الموت حقيقة مؤكدة لا مفر منها.", "الزمن نهر جارف لا يتوقف عن الجريان.", "القدر سيف مسلط على رقاب العباد.", "الصبر مفتاح الفرج وبلسم الجروح.", "التسامح لغة الأقوياء وعفو الكرام.", "الانتقام نار تحرق صاحبها قبل عدوه.", "الغضب عاصفة هوجاء تدمر كل ما في طريقها.", "الحسد مرض خبيث يأكل الحسنات كما تأكل النار الحطب.", "الغرور مقبرة النجاح وبداية النهاية.", "التواضع صفة العظماء وتاج الكرام.", "الكرم شجرة طيبة تثمر المحبة والتقدير.", "البخل مرض نفسي يقتل الإنسانية.", "الصدق منجاة والكذب مهواة.", "الأمانة صفة الأنبياء وخلق المؤمنين.", "الخيانة طعنة في الظهر لا تغتفر.", "الوفاء عملة نادرة في زمن الخداع.", "الظلم ظلمات يوم القيامة وعاقبته وخيمة.", "العدل أساس الملك وقوام الحياة.", "الحرية هبة إلهية لا تقدر بثمن.", "العبودية ذل وهوان لا يرضاه حر.", "العلم نور يضيء دروب الجهل والظلام.", "الجهل آفة تدمر المجتمعات وتؤخر الأمم.", "العمل شرف وعزة وكرامة للإنسان.", "البطالة مقبرة الطاقات ومصنع الآفات.", "الشباب ربيع الحياة وأمل المستقبل.", "الشيخوخة وقار وحكمة وخبرة.", "الصحة تاج على رؤوس الأصحاء لا يراه إلا المرضى.", "المرض ابتلاء واختبار من الله.", "السعادة شعور داخلي لا يشترى بالمال.", "الشقاء نتيجة البعد عن الله واتباع الهوى.", "الدنيا دار ممر والآخرة دار مقر.", "الجنة حلم المؤمنين ومبتغى الصالحين.", "النار عذاب أليم ومأوى الكافرين."] }
};

let state = JSON.parse(localStorage.getItem(STORE_KEY)) || {
lang: 'ar', dark: true, glass: true, mode: 'both', duration: 10000, interval: '0', showImage: false, showHomeCards: true,
quoteSource: 'all', schedules: [], groups: { 'favorites': [], 'myQuotes': [] },
stats: { drops: 0, likes: 0, dhikr: 0, culture: 0, selfDev: 0, poetry: 0, days: 1 }
};

const QatraNative = window.Capacitor?.Plugins?.QatraNative;
function getTranslation(key, values = {}) {
const dictionary = DICT[state.lang] || DICT.ar;
let result = dictionary[key] || DICT.en[key] || key;
for (const [name, value] of Object.entries(values)) {
const formatted = typeof value === 'number' ? new Intl.NumberFormat(state.lang || 'ar').format(value) : String(value);
result = result.split('{' + name + '}').join(formatted);
}
return result;
}
function safeOn(id, eventType, handler) { const el = document.getElementById(id); if (el) el.addEventListener(eventType, handler); }

function applyState() {
localStorage.setItem(STORE_KEY, JSON.stringify(state));
document.body.classList.toggle('dark-mode', state.dark);
document.body.classList.toggle('glass-active', state.glass);
document.documentElement.dir = (state.lang === 'ar') ? 'rtl' : 'ltr';
document.documentElement.lang = state.lang;

document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = getTranslation(el.getAttribute('data-i18n')); });
document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
el.placeholder = getTranslation(el.getAttribute('data-i18n-placeholder'));
});
const settingsControl = document.querySelector('.qatra-settings');
if (settingsControl) settingsControl.setAttribute('aria-label', getTranslation('app_settings'));
const surpriseControl = document.getElementById('surpriseButton');
if (surpriseControl) surpriseControl.setAttribute('aria-label', getTranslation('surprise_title'));


const hc = document.getElementById('homeCardsContainer');
if(hc) hc.style.display = state.showHomeCards ? 'block' : 'none';

const c = (id, val) => { const el = document.getElementById(id); if(el) el.checked = val; };
const s = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };

c('glassToggle', state.glass); c('imageToggle', state.showImage); c('homeCardsToggle', state.showHomeCards);
s('langSelect', state.lang); s('notifModeSetting', state.mode);
s('dropDurationSetting', state.duration);

document.querySelectorAll('.custom-radio-item').forEach(item => {
if(item.dataset.value === state.quoteSource) item.classList.add('active');
else item.classList.remove('active');
});

const optVals = ['0','30','60','180','720','1440'];
const optKeys = ['stop_repeat','every_30','every_1h','every_3h','every_12h','every_24h'];
const intSel = document.getElementById('intervalSelect');
if(intSel) {
intSel.innerHTML = optVals.map((v,i) => `<option value="${v}">${getTranslation(optKeys[i])}</option>`).join('');
intSel.value = state.interval;
}

updateHomeCards(); updateStatsChart(); renderGarden(); renderSchedules();
window.QatraProgress?.syncGroups().catch(console.error);
}

safeOn('langSelect', 'change', e => { state.lang = e.target.value; applyState(); renderDaysGrid();
const initialAudioTitle = document.getElementById('audioTitleText');
if (initialAudioTitle && !randPlayer.src) initialAudioTitle.textContent = getTranslation('listening'); syncNativeAlarms(); });
safeOn('glassToggle', 'change', e => { state.glass = e.target.checked; applyState(); });
safeOn('imageToggle', 'change', e => { state.showImage = e.target.checked; applyState(); syncNativeAlarms(); });
safeOn('homeCardsToggle', 'change', e => { state.showHomeCards = e.target.checked; applyState(); });
safeOn('intervalSelect', 'change', e => { state.interval = e.target.value; applyState(); syncNativeAlarms(); });
window.setQuoteSource = (source) => { state.quoteSource = source; applyState(); syncNativeAlarms(); };

// Likes are reconciled from the native ledger in home-windows.js.

function updateStatsChart() {
const drops = state.stats.likes; // استخدام التفاعل كمؤشر أساسي
const days = state.stats.days;
const maxD = Math.max(drops, 50);

const c1 = document.getElementById('chartDropsCircle');
if(c1) c1.style.strokeDashoffset = 100.5 - (100.5 * (drops/maxD));

const c2 = document.getElementById('chartDaysCircle');
if(c2) c2.style.strokeDashoffset = 100.5 - (100.5 * (Math.min(days,30)/30));

const txt1 = document.getElementById('chartDropsVal'); if(txt1) txt1.innerText = drops;
const txt2 = document.getElementById('chartDaysVal'); if(txt2) txt2.innerText = days;
}

function updateHomeCards() {
const now = new Date();
let nextDrop = getTranslation('no_reminders');
if (state.schedules.length > 0) {
const next = state.schedules.map(s => {
const [h,m] = s.time.split(':');
const d = new Date(); d.setHours(h,m,0);
if(d < now) d.setDate(d.getDate()+1);
return d;
}).sort((a,b) => a-b)[0];
const diffMins = Math.round((next - now)/60000);
nextDrop = getTranslation('after_minutes', {count: diffMins});
}
const ndEl = document.getElementById('nextDropTimeText'); if(ndEl) ndEl.innerText = nextDrop;

let catText = state.quoteSource === 'all' ? getTranslation('all_categories') : (state.quoteSource === 'myGroups' ? getTranslation('my_library') : getTranslation('cat_'+state.quoteSource));
const ncatEl = document.getElementById('nextDropCategoryText'); if(ncatEl) ncatEl.innerText = getTranslation('category_label', {name: catText});

const tiEl = document.getElementById('todayImpactText'); if(tiEl) tiEl.innerText = getTranslation('today_likes_summary', {count: state.stats.likes});
const tipEl = document.getElementById('todayImpactProgress'); if(tipEl) tipEl.style.width = Math.min((state.stats.likes / 10)*100, 100) + '%';

let momentMsg = getTranslation('moment_default');
const hour = now.getHours();
if(hour >= 5 && hour < 12) momentMsg = getTranslation('moment_morning');
else if(hour >= 12 && hour < 18) momentMsg = getTranslation('moment_afternoon');
else momentMsg = getTranslation('moment_evening');
const cmEl = document.getElementById('currentMomentText'); if(cmEl) cmEl.innerText = momentMsg;
}

// --- الأيام والمواعيد والبرمجة الذكية ---
const WEEK_DAYS = {
ar: [{id:0,n:"أحد"},{id:1,n:"إثن"},{id:2,n:"ثلا"},{id:3,n:"أرب"},{id:4,n:"خمي"},{id:5,n:"جمع"},{id:6,n:"سبت"}],
en: [{id:0,n:"Sun"},{id:1,n:"Mon"},{id:2,n:"Tue"},{id:3,n:"Wed"},{id:4,n:"Thu"},{id:5,n:"Fri"},{id:6,n:"Sat"}]
};

WEEK_DAYS.fr = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'].map((n,id) => ({id,n}));
WEEK_DAYS.es = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].map((n,id) => ({id,n}));
WEEK_DAYS.de = ['So','Mo','Di','Mi','Do','Fr','Sa'].map((n,id) => ({id,n}));

let currentSelectedDays = new Set([0,1,2,3,4,5,6]);
function renderDaysGrid() {
const dg = document.getElementById('daysGrid');
if(dg) dg.innerHTML = (WEEK_DAYS[state.lang] || WEEK_DAYS.ar).map(d => `<div class="day-chip ${currentSelectedDays.has(d.id)?'active':''}" onclick="toggleDay(${d.id})">${d.n}</div>`).join('');
}
window.toggleDay = (id) => { currentSelectedDays.has(id) ? currentSelectedDays.delete(id) : currentSelectedDays.add(id); renderDaysGrid(); };

safeOn('applySmartScheduleBtn', 'click', () => {
const count = parseInt(document.getElementById('smartDropsCount').value);
const start = document.getElementById('smartTimeStart').value;
const end = document.getElementById('smartTimeEnd').value;
if(count > 0 && start && end) {
const [sh, sm] = start.split(':').map(Number); const [eh, em] = end.split(':').map(Number);
let startMins = sh * 60 + sm; let endMins = eh * 60 + em;
if(endMins <= startMins) endMins += 24 * 60;
const interval = (endMins - startMins) / count;
state.schedules = [];
for(let i=0; i<count; i++) {
let tMins = startMins + Math.round(i * interval);
let h = Math.floor((tMins%1440)/60).toString().padStart(2,'0');
let m = (tMins%60).toString().padStart(2,'0');
state.schedules.push({id: Math.floor(Math.random()*10000), time: `${h}:${m}`, days: [0,1,2,3,4,5,6]});
}
applyState(); syncNativeAlarms();
}
});

safeOn('saveScheduleBtn', 'click', () => {
const tEl = document.getElementById('customTime');
if(!tEl) return;
const t = tEl.value;
if(t && currentSelectedDays.size > 0) {
state.schedules.push({id: Math.floor(Math.random()*10000), time: t, days: Array.from(currentSelectedDays)});
applyState(); renderSchedules(); syncNativeAlarms();
} else { alert(getTranslation('choose_time')); }
});

function renderSchedules() {
const list = document.getElementById('savedSchedulesList');
if(list) list.innerHTML = state.schedules.map((s, i) => `<div class="modern-row" style="background:var(--bg); padding:18px; border-radius:18px; margin-bottom:12px; border:1px solid var(--border); display:flex; justify-content:space-between;"><strong style="font-size:18px;">${s.time}</strong> <button onclick="deleteSchedule(${i})" style="background:rgba(255,0,0,0.1); border:none; color:#ff4d4d; font-weight:bold; cursor:pointer; padding:8px 16px; border-radius:10px;">${getTranslation('delete')}</button></div>`).join('');
updateHomeCards();
}
window.deleteSchedule = (i) => { if(QatraNative && state.schedules[i]) QatraNative.cancel({id: state.schedules[i].id}); state.schedules.splice(i,1); applyState(); syncNativeAlarms(); };

// --- الحديقة المتعددة الأشجار ---
function getTreeStage(score) {
const G = [{ m: 5, e: '🌱' }, { m: 20, e: '🌿' }, { m: 50, e: '🪴' }, { m: 100, e: '🌳' }, { m: 200, e: '🌸' }];
for(let i=0; i<G.length; i++) if(score < G[i].m) return G[i].e; return '🌲';
}
function renderGarden() {
const s = state.stats;
const tEl = (id, e) => { const x = document.getElementById(id); if(x) x.innerText = e; };
tEl('treeEmoji_dhikr', getTreeStage(s.dhikr)); tEl('treeEmoji_culture', getTreeStage(s.culture));
tEl('treeEmoji_selfDev', getTreeStage(s.selfDev)); tEl('treeEmoji_poetry', getTreeStage(s.poetry));
const tot = s.dhikr + s.culture + s.selfDev + s.poetry;
const pEl = document.getElementById('totalAwarenessProgress'); if(pEl) pEl.style.width = Math.min((tot/500)*100, 100)+'%';
tEl('totalDaysActiveText', getTranslation('active_days_summary', {count:s.days}));
window.QatraProgress?.paintRings();
}

// --- المكتبة والمجموعات (أيقونات احترافية للقلب والنسخ) ---
window.showCategoryList = () => { document.getElementById('catSheetTitle').textContent = getTranslation('section_title'); document.getElementById('categorySheet').classList.add('show'); renderCategories(); }
window.showGroupsManager = () => { document.getElementById('groupsManagerArea').style.display = 'block'; renderGroupsList(); };

function renderCategories() {
const container = document.getElementById('catSheetContent');
if(!container) return;
container.innerHTML = Object.keys(QUOTES_DB).map(key => {
const cat = QUOTES_DB[key];
return `<div class="glass-card action-card" onclick="openQuotesList('${key}')" style="margin-bottom:10px;">
<div class="card-icon"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${cat.icon}</svg></div> <div class="card-info"><div class="card-title">${getTranslation(cat.key)}</div></div>
<div style="color:var(--border); font-size:24px; font-weight:bold;">›</div>
</div>`;
}).join('');
}

window.openQuotesList = (id) => {
const cat = QUOTES_DB[id];
document.getElementById('catSheetTitle').innerText = getTranslation(cat.key);
const content = document.getElementById('catSheetContent');
if(content) {
content.innerHTML = cat.items.slice(0, 50).map(q => {
return `<div style="display:flex; align-items:center; justify-content:space-between; gap:14px; padding:18px 0; border-bottom:1px solid var(--border);"> <div style="font-size:15px; font-weight:700;">${q}</div>
<div style="display:flex; gap:8px;">
<button class="q4-legacy-heart" data-q4-text="${encodeURIComponent(q).replace(/'/g, '%27')}" onclick="QatraProgress.toggleLike(decodeURIComponent('${encodeURIComponent(q).replace(/'/g, '%27')}'),'${id}').then(()=>QatraProgress.paint()).catch(e=>alert(e.message))" style="background:transparent; border:none; color:var(--secondary); cursor:pointer;">
<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
</button>
</div>
</div>`;
}).join('');
window.QatraProgress?.paint();
}
};

window.copyQuote = async (txt) => {
try {
await window.QatraProgress.copy(txt);
const toast = document.getElementById('copyToast');
if(toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2000); }
} catch(error) { alert('تعذر النسخ: '+error.message); }
};

window.addToFavorites = (txt) => {
if(!state.groups['favorites'].includes(txt)) {
state.groups['favorites'].push(txt); applyState(); alert(getTranslation('added_favorite'));
}
}

function renderGroupsList() {
const list = document.getElementById('customGroupsList');
if(!list) return;
list.innerHTML = Object.keys(state.groups).filter(k=> k !== 'favorites' && k !== 'myQuotes').map(k => `<div class="action-card" style="padding:15px; border:1px solid var(--border); border-radius:16px; margin-bottom:10px;" onclick="openGroup('${k}')">
<div class="card-info"><div class="card-title">${k}</div><div class="card-sub">${state.groups[k].length} ${getTranslation('quotes_ready')}</div></div>
<button onclick="event.stopPropagation(); deleteGroup('${k}')" class="delete-btn">${getTranslation('delete')}</button> </div>`).join('');
}
safeOn('createGroupBtn', 'click', () => {
const name = document.getElementById('newGroupNameInput').value.trim();
if(name && !state.groups[name]) { state.groups[name] = []; document.getElementById('newGroupNameInput').value=''; applyState(); renderGroupsList(); }
});
window.deleteGroup = (k) => { delete state.groups[k]; applyState(); renderGroupsList(); };

let currentOpenGroup = "";
window.openGroup = (k) => {
currentOpenGroup = k;
const titleEl = document.getElementById('groupViewTitle'); if(titleEl) titleEl.innerText = (k==='favorites'?getTranslation('my_favorites'):(k==='myQuotes'?getTranslation('my_custom_quotes'):k));
const addDiv = document.getElementById('addToGroupDiv'); if(addDiv) addDiv.style.display = (k==='favorites' ? 'none' : 'flex');
const c = document.getElementById('groupViewContent');
if(c) c.innerHTML = state.groups[k].map((q,i) => `<div class="my-quote-item"><div style="flex:1;">${q}</div><button onclick="removeQuoteFromGroup('${k}',${i})" class="delete-btn">${getTranslation('delete')}</button></div>`).join('');
document.getElementById('groupViewSheet').classList.add('show');
};
window.removeQuoteFromGroup = (k, i) => { state.groups[k].splice(i,1); applyState(); openGroup(k); };
window.addQuoteToCurrentGroup = () => {
const input = document.getElementById('newGroupQuoteInput');
if(input && input.value.trim() !== "") {
state.groups[currentOpenGroup].push(input.value.trim());
input.value = ""; applyState(); openGroup(currentOpenGroup);
}
}

// --- القطرة السينمائية ودمج المصادر ---
function getRandomQuote() {
let pool = [];
let categoryKey = state.quoteSource;

if (state.quoteSource === 'all') {
const keys = Object.keys(QUOTES_DB);
categoryKey = keys[Math.floor(Math.random() * keys.length)];
pool = QUOTES_DB[categoryKey].items;
} else if (state.quoteSource === 'myGroups') {
Object.keys(state.groups).forEach(k => { pool = pool.concat(state.groups[k]); });
if(pool.length === 0) pool = [getTranslation('no_custom_quotes')];
categoryKey = "myGroups";
} else {
pool = QUOTES_DB[state.quoteSource].items;
}
const quote = pool[Math.floor(Math.random() * pool.length)];
return { quote, categoryKey };
}

let surpriseBusy = false;
window.fireCinematic = async () => {
if (surpriseBusy) return;
const button = document.getElementById('surpriseButton');
if (!QatraNative || typeof QatraNative.showDrop !== 'function') {
alert(state.lang === 'ar' ? 'تعذر الاتصال بخدمة القطرة. أغلق التطبيق وافتحه ثم حاول مجددًا.' : 'Drop service is unavailable. Please reopen the app.');
return;
}
const available = Object.keys(QUOTES_DB).map(categoryKey => ({
categoryKey,
items: QUOTES_DB[categoryKey].items.filter(q => typeof q === 'string' && q.trim() && !/^(دعاء رقم|فكرة تطوير ذات رقم|آية رقم|حكمة رقم|بيت شعر رقم)\s*\d+\s*$/.test(q))
})).filter(category => category.items.length);
if (!available.length) return;
const category = available[Math.floor(Math.random() * available.length)];
const quote = category.items[Math.floor(Math.random() * category.items.length)];
const duration = Math.max(5000, Math.min(15000, Number(state.duration) || 10000));
surpriseBusy = true;
if (button) { button.disabled = true; button.setAttribute('aria-busy','true'); button.classList.add('is-opening'); }
try {
await new Promise(resolve => setTimeout(resolve, 650));
await QatraNative.showDrop({quote, category: category.categoryKey, duration, fullScreen:true, showImage:state.showImage, surprise:true});
const qtEl = document.getElementById('dailyQuoteText');
if (qtEl) qtEl.textContent = `"${quote}"`;
state.stats.drops++;
applyState();
await new Promise(resolve => setTimeout(resolve, duration + 1000));
} catch (error) {
console.error('QATRA surprise failed',error);
alert(state.lang === 'ar' ? 'لم تظهر القطرة. تحقق من إذن الظهور فوق التطبيقات ثم حاول مجددًا.' : 'Unable to show the drop. Check overlay permission and try again.');
} finally {
surpriseBusy = false;
if (button) { button.disabled = false; button.setAttribute('aria-busy','false'); button.classList.remove('is-opening'); }
}
};

function syncNativeAlarms() {
if(!QatraNative) return;
QatraNative.scheduleInterval({ intervalMinutes: parseInt(state.interval), mode: state.mode, duration: state.duration, quote: getRandomQuote().quote, category: state.quoteSource, fullScreen: true, showImage: state.showImage }).catch(e=>{});

state.schedules.forEach(s => {
const rQuote = getRandomQuote();
QatraNative.schedule({id: s.id, time: s.time, days: s.days, mode: state.mode, duration: state.duration, quote: rQuote.quote, category: rQuote.categoryKey, fullScreen: true, showImage: state.showImage}).catch(e=>{});
});
}

// --- التأمل (المشغل العائم المتطور) ---
let randPlayer = new Audio();
let audioUpdateInterval;

window.playAudio = (type, title) => {
randPlayer.pause();
const aMap = {
'rain': 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg',
'sea': 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
'forest': 'https://actions.google.com/sounds/v1/water/stream_flowing_slowly.ogg',
'birds': 'https://actions.google.com/sounds/v1/animals/birds_singing.ogg',
'quran1': 'https://server8.mp3quran.net/afs/001.mp3',
'quran2': 'https://server8.mp3quran.net/afs/018.mp3',
'quran3': 'https://server8.mp3quran.net/afs/067.mp3'
};
if(aMap[type]) {
randPlayer.src = aMap[type];
randPlayer.play();
document.getElementById('audioTitleText').innerText = title || getTranslation('playing');
document.getElementById('globalAudioPlayer').classList.add('show');
document.getElementById('audioPlayPauseBtn').innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

clearInterval(audioUpdateInterval);
audioUpdateInterval = setInterval(() => {
if (randPlayer.duration) {
const p = (randPlayer.currentTime / randPlayer.duration) * 100;
document.getElementById('audioProgressFill').style.width = `${p}%`;
}
}, 500);
}
};

window.togglePlayPause = () => {
if (randPlayer.paused) {
randPlayer.play();
document.getElementById('audioPlayPauseBtn').innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
} else {
randPlayer.pause();
document.getElementById('audioPlayPauseBtn').innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
}
}

window.closeAudioPlayer = () => {
randPlayer.pause();
clearInterval(audioUpdateInterval);
document.getElementById('globalAudioPlayer').classList.remove('show');
}

window.startSession = (mins) => {
alert(getTranslation('session_start', {count:mins}));
setTimeout(() => alert(getTranslation('session_end')), mins * 60000);
}

document.addEventListener('DOMContentLoaded', () => {

// Sequential permission onboarding is handled by experience.js.

document.querySelectorAll('.nav-item, .nav-home-btn, .header-btn').forEach(btn => {
btn.addEventListener('click', () => {
if(btn.dataset.sheet){window.openSheet(btn.dataset.sheet);return;}
if(!btn.dataset.view) return;
document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
document.querySelectorAll('.nav-item, .nav-home-btn').forEach(n => n.classList.remove('active'));
const viewEl = document.getElementById(btn.dataset.view);
if(viewEl) viewEl.classList.add('active');
btn.classList.add('active');
});
});

const scrollContent = document.getElementById('scrollContent');
const ptrContainer = document.getElementById('ptrContainer');
const ptrIcon = document.getElementById('ptrIcon');
window.QatraSkins.installPull(scrollContent,ptrContainer,ptrIcon);

applyState(); renderDaysGrid();
const qtEl = document.getElementById('dailyQuoteText');
if(qtEl) qtEl.textContent = `"${getRandomQuote().quote}"`;

setTimeout(() => { const splash = document.getElementById('splash'); if (splash) { splash.style.opacity = '0'; setTimeout(() => splash.remove(), 800); } }, 2500);
});


// --- المرحلة 1: منطق "خطوة اليوم" ---
const dailySteps = [
    "اتصل بشخص تحبه واسأل عنه.", "خصّص خمس دقائق دون هاتف.", "سامح نفسك على خطأ قديم.",
    "اقرأ صفحتين من كتاب.", "قل كلمة طيبة لشخص لم تتحدث معه منذ مدة.",
    "اكتب شيئاً واحداً تشعر بالامتنان لوجوده.", "ساعد شخصاً دون انتظار مقابل.",
    "رتّب مساحة صغيرة من غرفتك.", "امشِ عشر دقائق وتأمل ما حولك.",
    "تخلّص من فكرة سلبية تستنزف طاقتك."
];

function initDailyStep() {
    const today = new Date().toDateString();
    let stepData = JSON.parse(localStorage.getItem('qatra_daily_step') || '{}');
    
    // إذا كان يوماً جديداً أو لم يتم تعيين خطوة
    if (stepData.date !== today) {
        stepData = {
            date: today,
            stepText: dailySteps[Math.floor(Math.random() * dailySteps.length)],
            completed: false
        };
        localStorage.setItem('qatra_daily_step', JSON.stringify(stepData));
    }
    
    updateStepUI(stepData);
}

function updateStepUI(stepData) {
    const descEl = document.getElementById('dailyStepDesc');
    const iconEl = document.getElementById('dailyStepIcon');
    const cards = document.querySelectorAll('.glass-card');
    let stepCard = null;
    
    // البحث عن بطاقة خطوة اليوم بأمان
    cards.forEach(card => {
        if(card.querySelector('#dailyStepTitle')) stepCard = card;
    });

    if(!stepCard || !descEl || !iconEl) return;

    descEl.textContent = stepData.completed ? "أنجزت خطوة اليوم!" : stepData.stepText;
    
    if (stepData.completed) {
        iconEl.innerHTML = '<svg viewBox="0 0 24 24" style="stroke: #10B981; fill: rgba(16, 185, 129, 0.2); transform: scale(1.1); transition: all 0.3s ease;"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
        stepCard.style.opacity = '0.8';
        stepCard.onclick = null; // تعطيل النقر إذا تم الإنجاز
    } else {
        iconEl.innerHTML = '<svg viewBox="0 0 24 24" style="transition: all 0.3s ease;"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
        stepCard.style.opacity = '1';
        stepCard.style.cursor = 'pointer';
        stepCard.onclick = function() {
            completeStep(stepData);
        };
    }
}

function completeStep(stepData) {
    if(stepData.completed) return;
    
    stepData.completed = true;
    localStorage.setItem('qatra_daily_step', JSON.stringify(stepData));
    
    // تحديث إحصائيات الخطوات المنجزة (للمرحلة 4 لاحقاً)
    let stats = JSON.parse(localStorage.getItem('qatra_stats') || '{"completedSteps": 0}');
    stats.completedSteps = (stats.completedSteps || 0) + 1;
    localStorage.setItem('qatra_stats', JSON.stringify(stats));

    // حركة بصرية بسيطة عند الإنجاز
    const iconEl = document.getElementById('dailyStepIcon');
    if(iconEl) {
        iconEl.style.transform = 'scale(1.5)';
        setTimeout(() => {
            updateStepUI(stepData);
        }, 300);
    } else {
        updateStepUI(stepData);
    }
}

// تشغيل التهيئة عند تحميل التطبيق
setTimeout(initDailyStep, 600);


// --- Stage 10 (Part 1): Daily Step DOM Logic ---
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // 1. البحث عن بطاقة خطوة اليوم بذكاء مهما كان تصميمها
        const cards = document.querySelectorAll('.glass-card, .card');
        let targetCard = null;
        
        cards.forEach(card => {
            const titleEl = card.querySelector('.title');
            if(titleEl && titleEl.textContent.includes('خطوة اليوم')) {
                targetCard = card;
            }
        });

        // 2. إذا وجدناها، نقوم بتحويلها وبرمجتها
        if(targetCard) {
            const titleEl = targetCard.querySelector('.title');
            const descEl = targetCard.querySelector('.desc');
            const iconContainer = targetCard.querySelector('.icon') || targetCard.querySelector('.card-icon');
            
            titleEl.textContent = "خطوة اليوم";
            
            const dailySteps = [
                "اتصل بشخص تحبه واسأل عنه.",
                "خصّص خمس دقائق دون هاتف.",
                "سامح نفسك على خطأ قديم.",
                "اقرأ صفحتين من كتاب.",
                "قل كلمة طيبة لشخص لم تتحدث معه منذ مدة.",
                "اكتب شيئاً واحداً تشعر بالامتنان لوجوده.",
                "ساعد شخصاً دون انتظار مقابل.",
                "رتّب مساحة صغيرة من غرفتك.",
                "امشِ عشر دقائق وتأمل ما حولك.",
                "تخلّص من فكرة سلبية تستنزف طاقتك."
            ];

            function renderStep(stepData) {
                if (stepData.completed) {
                    if(descEl) descEl.textContent = "أنجزت خطوة اليوم! أحسنت.";
                    if(iconContainer) {
                        iconContainer.innerHTML = '<svg viewBox="0 0 24 24" style="width:24px; height:24px; stroke: #10B981; fill: rgba(16,185,129,0.2); stroke-width: 2;"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
                    }
                    targetCard.style.opacity = '0.7';
                    targetCard.onclick = null;
                    targetCard.style.cursor = 'default';
                } else {
                    if(descEl) descEl.textContent = stepData.stepText;
                    if(iconContainer) {
                        iconContainer.innerHTML = '<svg viewBox="0 0 24 24" style="width:24px; height:24px; stroke: currentColor; fill: none; stroke-width: 2; transition: transform 0.3s;"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
                    }
                    targetCard.style.opacity = '1';
                    targetCard.style.cursor = 'pointer';
                    
                    targetCard.onclick = () => {
                        stepData.completed = true;
                        localStorage.setItem('qatra_daily_step', JSON.stringify(stepData));
                        
                        // حركة بصرية
                        if(iconContainer) {
                            iconContainer.style.transform = 'scale(1.4)';
                            setTimeout(() => {
                                iconContainer.style.transform = 'scale(1)';
                                renderStep(stepData);
                            }, 300);
                        } else {
                            renderStep(stepData);
                        }
                    };
                }
            }

            // 3. التحقق من تاريخ اليوم وتهيئة الخطوة
            const today = new Date().toDateString();
            let stepData = JSON.parse(localStorage.getItem('qatra_daily_step') || '{}');
            
            if (stepData.date !== today) {
                stepData = {
                    date: today,
                    stepText: dailySteps[Math.floor(Math.random() * dailySteps.length)],
                    completed: false
                };
                localStorage.setItem('qatra_daily_step', JSON.stringify(stepData));
            }
            
            renderStep(stepData);
        }
    }, 600); // تأخير بسيط لضمان اكتمال تحميل الواجهة الأساسية
});


// === BULLETPROOF DAILY STEP ===
document.addEventListener('DOMContentLoaded', () => {
    // ننتظر قليلاً حتى تكتمل الواجهة
    setTimeout(() => {
        const elements = document.querySelectorAll('*');
        let targetCard = null;

        // 1. البحث الدقيق عن البطاقة التي تحتوي على كلمة "خطوة اليوم"
        for (let el of elements) {
            if (el.textContent && el.textContent.includes('خطوة اليوم')) {
                let curr = el;
                // الصعود في الشجرة للعثور على إطار البطاقة الأساسي
                while (curr && curr !== document.body) {
                    if (curr.classList.contains('glass-card') || curr.classList.contains('card')) {
                        targetCard = curr;
                        break;
                    }
                    curr = curr.parentElement;
                }
                if (targetCard) break;
            }
        }

        if (targetCard) {
            // 2. إعادة بناء محتوى البطاقة برمجياً لضمان الشكل والاستجابة
            targetCard.style.display = 'flex';
            targetCard.style.justifyContent = 'space-between';
            targetCard.style.alignItems = 'center';
            targetCard.style.cursor = 'pointer';
            
            targetCard.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:4px; flex:1;">
                    <span style="font-weight:800; font-size:1.1rem; color:inherit;">خطوة اليوم</span>
                    <span id="ds-desc" style="font-weight:600; font-size:0.85rem; color:inherit; opacity:0.8; margin-top:2px; line-height:1.4;">جاري التحميل...</span>
                </div>
                <div id="ds-icon" style="display:flex; align-items:center; justify-content:center; padding-right:10px;">
                </div>
            `;

            const desc = targetCard.querySelector('#ds-desc');
            const icon = targetCard.querySelector('#ds-icon');
            
            // 3. قائمة المهام والمنطق
            const steps = [
                "اتصل بشخص تحبه واسأل عنه.", "خصّص خمس دقائق دون هاتف.", "سامح نفسك على خطأ قديم.",
                "اقرأ صفحتين من كتاب.", "قل كلمة طيبة لشخص لم تتحدث معه منذ مدة.",
                "اكتب شيئاً واحداً تشعر بالامتنان لوجوده.", "ساعد شخصاً دون انتظار مقابل.",
                "رتّب مساحة صغيرة من غرفتك.", "امشِ عشر دقائق وتأمل ما حولك.",
                "تخلّص من فكرة سلبية تستنزف طاقتك."
            ];

            const today = new Date().toDateString();
            let stepData = JSON.parse(localStorage.getItem('qatra_daily_step') || '{}');

            // إذا كان يوم جديد، نعين خطوة جديدة
            if (stepData.date !== today) {
                stepData = { date: today, text: steps[Math.floor(Math.random() * steps.length)], completed: false };
                localStorage.setItem('qatra_daily_step', JSON.stringify(stepData));
            }

            // 4. دالة تحديث الواجهة والتفاعل
            function updateCard() {
                if (stepData.completed) {
                    desc.textContent = "أنجزت خطوة اليوم! أحسنت.";
                    icon.innerHTML = '<svg viewBox="0 0 24 24" style="width:28px;height:28px;stroke:#10B981;fill:rgba(16,185,129,0.2);stroke-width:2;"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
                    targetCard.style.opacity = '0.7';
                    targetCard.onclick = null; // تعطيل النقر بعد الإنجاز
                } else {
                    desc.textContent = stepData.text;
                    icon.innerHTML = '<svg viewBox="0 0 24 24" style="width:26px;height:26px;stroke:currentColor;fill:none;stroke-width:2;"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
                    targetCard.style.opacity = '1';
                    
                    // التفاعل عند النقر
                    targetCard.onclick = () => {
                        stepData.completed = true;
                        localStorage.setItem('qatra_daily_step', JSON.stringify(stepData));
                        
                        // تحديث الإحصائيات (للمرحلة 4 لاحقاً)
                        let stats = JSON.parse(localStorage.getItem('qatra_stats') || '{"completedSteps":0}');
                        stats.completedSteps = (stats.completedSteps || 0) + 1;
                        localStorage.setItem('qatra_stats', JSON.stringify(stats));

                        // حركة بصرية أنيقة (Animation)
                        icon.style.transform = 'scale(1.4)';
                        icon.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        setTimeout(() => {
                            icon.style.transform = 'scale(1)';
                            setTimeout(updateCard, 150); // إظهار التحديث
                        }, 300);
                    };
                }
            }
            updateCard();
        }
    }, 800); // 800ms لضمان أن الواجهة حُملت بالكامل قبل التعديل
});




// === FEATURE 1: DAILY STEP ===
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const cards = document.querySelectorAll('.glass-card, .card');
        let stepCard = null;
        
        // 1. البحث عن البطاقة
        cards.forEach(card => {
            const titleEl = card.querySelector('.title, span');
            if (titleEl && (titleEl.textContent.includes('خطوة اليوم') || titleEl.textContent.includes('أثر اليوم'))) {
                stepCard = card;
                titleEl.textContent = 'خطوة اليوم'; // تأكيد تغيير الاسم
            }
        });

        if (stepCard) {
            // 🔴 2. القضاء على وظيفة "أثر اليوم" القديمة
            // الاستنساخ (cloneNode) يمسح جميع الارتباطات والأحداث السابقة المخفية
            const cleanCard = stepCard.cloneNode(true);
            stepCard.parentNode.replaceChild(cleanCard, stepCard);
            stepCard = cleanCard; // تحديث المؤشر للبطاقة الجديدة النظيفة
            
            // إزالة أي حدث onclick مبرمج مسبقاً في الـ HTML
            stepCard.removeAttribute('onclick');

            // 3. إعداد الواجهة والمحتوى
            const descEl = stepCard.querySelector('.desc') || stepCard.querySelectorAll('span')[1];
            const iconEl = stepCard.querySelector('.icon') || stepCard.querySelector('.card-icon');

            const dailyStepsList = [
                "اتصل بشخص تحبه واسأل عنه.", "خصّص خمس دقائق دون هاتف.", "سامح نفسك على خطأ قديم.",
                "اقرأ صفحتين من كتاب.", "قل كلمة طيبة لشخص لم تتحدث معه منذ مدة.",
                "اكتب شيئاً واحداً تشعر بالامتنان لوجوده.", "ساعد شخصاً دون انتظار مقابل.",
                "رتّب مساحة صغيرة من غرفتك.", "امشِ عشر دقائق وتأمل ما حولك.",
                "تخلّص من فكرة سلبية تستنزف طاقتك."
            ];

            const todayKey = new Date().toDateString();
            let savedData = JSON.parse(localStorage.getItem('qatra_daily_step') || '{}');

            if (savedData.date !== todayKey) {
                savedData = {
                    date: todayKey,
                    stepText: dailyStepsList[Math.floor(Math.random() * dailyStepsList.length)],
                    completed: false
                };
                localStorage.setItem('qatra_daily_step', JSON.stringify(savedData));
            }

            const updateStepUI = () => {
                if (savedData.completed) {
                    if (descEl) descEl.textContent = "أنجزت الخطوة!";
                    if (iconEl) iconEl.innerHTML = '<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#10B981;fill:rgba(16,185,129,0.2);stroke-width:2;"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
                    stepCard.style.opacity = '0.7';
                    stepCard.style.cursor = 'default';
                    // إبطال أي تفاعل إضافي
                    stepCard.onclick = (e) => { e.preventDefault(); e.stopPropagation(); };
                } else {
                    if (descEl) descEl.textContent = savedData.stepText;
                    if (iconEl) iconEl.innerHTML = '<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:2;"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
                    stepCard.style.cursor = 'pointer';
                    
                    // 4. تنفيذ الخطوة الجديدة فقط
                    stepCard.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation(); // منع انتقال النقر لأي عنصر آخر
                        
                        savedData.completed = true;
                        localStorage.setItem('qatra_daily_step', JSON.stringify(savedData));
                        
                        if (iconEl) {
                            iconEl.style.transform = 'scale(1.4)';
                            iconEl.style.transition = 'transform 0.3s ease';
                            setTimeout(() => {
                                iconEl.style.transform = 'scale(1)';
                                setTimeout(updateStepUI, 150);
                            }, 300);
                        } else {
                            updateStepUI();
                        }
                    };
                }
            };

            updateStepUI();
        }
    }, 600);
});


// === FEATURE 1: EXACT LOGIC ===
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const cards = document.querySelectorAll('.glass-card, .card');
        let stepCard = null;
        
        // العثور على بطاقة خطوة اليوم
        cards.forEach(card => {
            const title = card.querySelector('.title, span');
            if(title && title.textContent.includes('خطوة اليوم')) {
                stepCard = card;
            }
        });

        if (stepCard) {
            // الاستنساخ لعزل البطاقة عن أي نافذة "أثر" قديمة
            const cleanCard = stepCard.cloneNode(true);
            stepCard.parentNode.replaceChild(cleanCard, stepCard);
            stepCard = cleanCard;
            
            const cardDesc = stepCard.querySelector('.desc') || stepCard.querySelectorAll('span')[1];
            const cardIcon = stepCard.querySelector('.icon') || stepCard.querySelector('.card-icon');

            // قاعدة بيانات الخطوات مع التصنيفات (استعداداً للمستقبل)
            const stepsDatabase = [
                { cat: 'العلاقات الإنسانية', text: 'اتصل بشخص تحبه واسأل عنه.' },
                { cat: 'الهدوء النفسي', text: 'خصّص خمس دقائق دون هاتف.' },
                { cat: 'تطوير الذات', text: 'سامح نفسك على خطأ قديم.' },
                { cat: 'المعرفة', text: 'اقرأ صفحتين من كتاب.' },
                { cat: 'العلاقات الإنسانية', text: 'قل كلمة طيبة لشخص لم تتحدث معه منذ مدة.' },
                { cat: 'الامتنان', text: 'اكتب شيئاً واحداً تشعر بالامتنان لوجوده.' },
                { cat: 'العمل الصالح', text: 'ساعد شخصاً دون انتظار مقابل.' },
                { cat: 'البيئة والترتيب', text: 'رتّب مساحة صغيرة من غرفتك.' },
                { cat: 'الصحة والهدوء', text: 'امشِ عشر دقائق وتأمل ما حولك.' },
                { cat: 'الهدوء النفسي', text: 'تخلّص من فكرة سلبية تستنزف طاقتك.' }
            ];

            const today = new Date().toDateString();
            let savedData = JSON.parse(localStorage.getItem('qatra_daily_step') || '{}');

            // تعيين خطوة جديدة إذا كان يوماً جديداً
            if (savedData.date !== today) {
                const randomStep = stepsDatabase[Math.floor(Math.random() * stepsDatabase.length)];
                savedData = { date: today, text: randomStep.text, category: randomStep.cat, completed: false };
                localStorage.setItem('qatra_daily_step', JSON.stringify(savedData));
            }

            // عناصر النافذة
            const sheet = document.getElementById('stepSheet');
            const sheetContent = sheet.querySelector('.sheet-content');
            const sheetDesc = document.getElementById('stepSheetDesc');
            const sheetCat = document.getElementById('stepCategory');
            const btnComplete = document.getElementById('btnCompleteStep');
            const btnClose = document.getElementById('btnCloseStep');
            const animContainer = document.getElementById('dropAnimContainer');
            const dropIcon = document.getElementById('waterDropIcon');

            // تحديث واجهة البطاقة الرئيسية
            function updateMainCard() {
                if(savedData.completed) {
                    if(cardDesc) cardDesc.textContent = "أنجزت خطوة اليوم!";
                    if(cardIcon) cardIcon.innerHTML = '<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#10B981;fill:rgba(16,185,129,0.2);stroke-width:2;"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
                } else {
                    if(cardDesc) cardDesc.textContent = "اضغط لاكتشاف خطوتك...";
                    if(cardIcon) cardIcon.innerHTML = '<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:2;"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
                }
            }
            updateMainCard();

            // فتح النافذة عند الضغط على البطاقة
            stepCard.onclick = () => {
                sheetDesc.textContent = savedData.text;
                sheetCat.textContent = savedData.category;
                
                if(savedData.completed) {
                    btnComplete.style.display = 'none';
                    animContainer.style.display = 'flex';
                    dropIcon.style.opacity = '1';
                    dropIcon.style.transform = 'translateY(0) scale(1.2)';
                    sheetDesc.textContent = "لقد أنجزت هذه الخطوة اليوم. شكراً لك!";
                } else {
                    btnComplete.style.display = 'block';
                    animContainer.style.display = 'none';
                    dropIcon.style.opacity = '0';
                    dropIcon.style.transform = 'translateY(-20px)';
                }

                sheet.style.display = 'flex';
                setTimeout(() => {
                    sheet.style.opacity = '1';
                    sheetContent.style.transform = 'translateY(0)';
                }, 10);
            };

            // دالة الإغلاق
            const closeSheet = () => {
                sheet.style.opacity = '0';
                sheetContent.style.transform = 'translateY(100%)';
                setTimeout(() => { sheet.style.display = 'none'; }, 300);
            };

            btnClose.onclick = closeSheet;
            sheet.onclick = (e) => { if(e.target === sheet) closeSheet(); };

            // الضغط على زر "أنجزت الخطوة" (حركة القطرة)
            btnComplete.onclick = () => {
                if(savedData.completed) return;
                
                // 1. تسجيل الإنجاز
                savedData.completed = true;
                localStorage.setItem('qatra_daily_step', JSON.stringify(savedData));
                
                // تحديث الإحصائيات الوهمية حتى نبرمج الميزة الرابعة
                let stats = JSON.parse(localStorage.getItem('qatra_stats') || '{"completedSteps": 0}');
                stats.completedSteps = (stats.completedSteps || 0) + 1;
                localStorage.setItem('qatra_stats', JSON.stringify(stats));

                // 2. الحركة البصرية لقطرة الماء
                btnComplete.style.display = 'none';
                animContainer.style.display = 'flex';
                
                // حركة نزول القطرة وانبثاقها (Ripple effect)
                setTimeout(() => {
                    dropIcon.style.opacity = '1';
                    dropIcon.style.transform = 'translateY(0) scale(1.5)';
                    
                    setTimeout(() => {
                        dropIcon.style.transform = 'translateY(0) scale(1)';
                        sheetDesc.textContent = "تم تسجيل الإنجاز بنجاح!";
                        updateMainCard();
                        
                        // إغلاق النافذة تلقائياً بعد الإنجاز بثانيتين
                        setTimeout(closeSheet, 2000);
                    }, 400);
                }, 50);
            };
        }
    }, 600);
});



// === QATRA MINDFUL MINIAPP V1 BEGIN ===
(() => {
'use strict';
const $=id=>document.getElementById(id);
const S={screen:'menu',feeling:null,groundStep:0,groundAnswers:[],groundDone:false,groundId:null,result:null,focus:null,inert:[],saved:new Map()};
const feelings={
 'هدوء':['يمكنك ملاحظة هذا الهدوء دون مطالبة نفسك بالحفاظ عليه دائمًا.','امنح نفسك ثلاثين ثانية لتلاحظ ما يساعدك على السكينة.'],
 'فرح':['هناك مساحة للفرح في تجربتك الآن.','توقف لحظة لتذوقها، ويمكنك مشاركة سببها مع شخص قريب.'],
 'امتنان':['لاحظت شيئًا ذا قيمة بالنسبة لك.','سمِّ تفصيلًا واحدًا تقدره، ويمكنك كتابته في لحظة امتنان.'],
 'قلق':['قد يكون هناك أمر غير محسوم يشغلك؛ لا يلزم حسمه كله الآن.','فرّق بين خطوة يمكنك اتخاذها الآن وأمر لا تملك التحكم فيه.'],
 'حزن':['يمكنك الاعتراف بحزنك دون لوم نفسك عليه.','اختر رفقًا صغيرًا بنفسك، أو تواصل مع شخص ترتاح إليه.'],
 'غضب':['الغضب شعور يمكن ملاحظته قبل اختيار التصرف.','إن أمكن، خذ مسافة قصيرة من الموقف قبل الرد.'],
 'خوف':['هناك ما يجعلك تشعر بعدم الاطمئنان الآن.','انظر حولك وحدد ما تحتاجه لتكون أكثر أمانًا؛ اطلب دعمًا إن لزم.'],
 'حيرة':['قد تحتاج إلى وقت أو معلومات قبل الاختيار.','اكتب سؤالًا واحدًا يمكن أن يساعدك على توضيح الخطوة التالية.'],
 'إرهاق':['طاقتك الآن تستحق الانتباه، لا اللوم.','اختر مهمة يمكن تأجيلها أو استراحة قصيرة مناسبة لك.'],
 'أمل':['ترى احتمالًا يستحق أن تمنحه مساحة.','حوّل هذا الاحتمال إلى خطوة صغيرة ممكنة اليوم.'],
 'وحدة':['قد تكون بحاجة إلى اتصال أو صحبة مريحة.','فكر في شخص يمكنك إرسال رسالة بسيطة إليه.'],
 'حماس':['لديك طاقة نحو شيء يهمك.','اختر بداية واحدة محددة بدل محاولة إنجاز كل شيء دفعة واحدة.']
};
const negative=new Set(['قلق','حزن','غضب','خوف','حيرة','إرهاق','وحدة']);
const patterns={
 general:{name:'تعميم',summary:'قد تتضمن الفكرة حكمًا واسعًا أو مطلقًا.',review:'كلمات مثل «الكل» و«دائمًا» قد توسّع الحكم أبعد من الأدلة المتاحة. وقد تكون حرفية في سياقك؛ أنت أدرى به.',reframe:'هذا موقف أو فترة من تجربتي، وليس بالضرورة وصفًا لكل المواقف أو الأشخاص. يمكنني البحث عن استثناء واحد قبل إصدار حكم شامل.',action:'اكتب واقعة محددة تدعم الفكرة، ثم واقعة واحدة لا تنسجم معها.'},
 label:{name:'وسم الذات',summary:'قد تتضمن الفكرة وصفًا قاسيًا للذات أو للقدرة.',review:'وصف نفسك بكلمة واحدة قد يختزل تجربة معقدة. التعثر في أداء شيء لا يعرّف قيمتك أو جميع قدراتك.',reframe:'ربما لم أنجح في أمر محدد أو أحتاج إلى تعلم مهارة. أستطيع وصف ما حدث دون تحويله إلى حكم على هويتي.',action:'استبدل الوصف العام بجملة تبدأ بـ «واجهت صعوبة في…»، ثم اختر شيئًا يمكن تعلمه.'},
 predict:{name:'تنبؤ سلبي',summary:'قد تتضمن الفكرة قلقًا من نتيجة مستقبلية أو توقعًا صعبًا.',review:'الخوف من نتيجة لا يثبت أنها ستحدث. يمكن الاعتراف باحتمالها دون التعامل معها على أنها يقين.',reframe:'لا أعرف النتيجة بعد. قد توجد احتمالات متعددة، ويمكنني الاستعداد بخطوة ممكنة دون افتراض الأسوأ.',action:'اكتب ما تعرفه فعلًا، وما تتوقعه فقط، ثم حدد إجراءً صغيرًا تحت سيطرتك.'},
 demand:{name:'توقع صارم',summary:'قد تتضمن الفكرة مطلبًا قاسيًا أو مساحة ضيقة للخطأ.',review:'وجود هدف مهم لا يعني أن الخطأ ممنوع أو أن المطلوب يجب إنجازه كاملًا الآن.',reframe:'أفضل أن أتقدم، ويمكنني قبول أداء غير كامل مع التعلم والتصحيح.',action:'حدد نسخة أصغر ومعقولة من المطلوب يمكن البدء بها.'},
 neutral:{name:'استكشاف دون تصنيف',summary:'لم أجد مؤشرًا واضحًا يكفي لترجيح نمط معين؛ لا يعني ذلك أن فكرتك غير مهمة.',review:'قد تكون الفكرة وصفًا واقعيًا أو شعورًا أو موقفًا يحتاج إلى معلومات إضافية، لا إلى تصحيح تلقائي.',reframe:'أستطيع وصف ما حدث وما شعرت به، ثم التمييز بين الوقائع والتفسيرات وما أحتاجه الآن.',action:'اسأل نفسك: ماذا حدث تحديدًا؟ ما الدليل المتاح؟ وما الخطوة الأنسب لاحتياجي؟'}
};
function normalize(text){return text.normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[،؛؟.!:…\n]/g,' ').replace(/\s+/g,' ').trim().toLowerCase();}
function analyze(text,override){
 const normalized=normalize(text),tokens=normalized.split(' '),scores={general:0,label:0,predict:0,demand:0};
 const terms={general:['الكل','دائما','ابدا','الجميع','كلهم'],label:['فاشل','فاشله','غبي','غبيه','عديم','تافه','تافهه'],predict:['خايف','خائف','خايفه','خائفه','مستحيل','سافشل','سيفشل','سافقد','سينتهي'],demand:['لازم','ينبغي']};
 const matches=[];
 for(let i=0;i<tokens.length;i++){
  const word=tokens[i],prior=tokens.slice(Math.max(0,i-3),i);
  // Avoid clear negations such as "لست فاشلا" and "أنا مش غبي"; rules remain deliberately conservative.
  if(prior.some(x=>['لست','ليس','لستُ','مش','مو','ماني','ماشي'].includes(x)))continue;
  for(const [key,list] of Object.entries(terms))if(list.includes(word)||key==='label'&&list.some(x=>word===x+'ا')){scores[key]++;matches.push({pattern:key,term:word});}
 }
 const ranked=Object.keys(scores).filter(k=>scores[k]>0).sort((a,b)=>scores[b]-scores[a]);
 const key=override||ranked[0]||'neutral',p=patterns[key];
 return {schemaVersion:1,input:text,pattern:key,candidates:ranked,matches,understood:'كتبت: «'+(text.length>350?text.slice(0,350)+'…':text)+'»\n'+p.summary,reconsider:p.review,reframed:p.reframe,action:p.action,method:'local-rules-v1'};
}
const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
function notice(text,error=false){const el=$('mmStatus');el.textContent=text;el.hidden=false;el.style.background=error?'#49242d':'#112a30';}
function clearNotice(){$('mmStatus').hidden=true;}
function readLog(key,notebook=false){
 const raw=localStorage.getItem(key);if(raw===null)return notebook?[]:{schemaVersion:1,entries:[]};
 let value;try{value=JSON.parse(raw);}catch(e){throw new Error('السجل الحالي غير قابل للقراءة. لم نستبدله أو نحذفه.');}
 if(notebook){if(!Array.isArray(value))throw new Error('صيغة دفتر قطرة مختلفة؛ لم نغيّرها.');return value;}
 if(Array.isArray(value))return {schemaVersion:1,entries:value};
 if(value&&value.schemaVersion===1&&Array.isArray(value.entries))return value;
 throw new Error('صيغة السجل غير مدعومة. لم تُحذف بياناتك.');
}
function persist(key,entry,notebook=false){
 const log=readLog(key,notebook),list=notebook?log:log.entries;
 if(!list.some(x=>x.id===entry.id))list.push(entry);
 localStorage.setItem(key,JSON.stringify(log));
}
function storeOnce(button,key,payload,category){
 const signature=JSON.stringify(payload),previous=S.saved.get(button.id);
 if(previous===signature){notice('سبق حفظ هذا الإدخال خلال هذه الجلسة.');return;}
 const entry={schemaVersion:1,id:uid(),createdAt:new Date().toISOString(),source:'mindful-minute',...payload};
 try{
  if(key==='qatra_notebook'){
   entry.category=category;entry.date=new Date(entry.createdAt).toLocaleString('ar');
  }
  persist(key,entry,key==='qatra_notebook');S.saved.set(button.id,signature);
  notice('تم الحفظ على هذا الجهاز.');button.classList.remove('mm-success');void button.offsetWidth;button.classList.add('mm-success');
 }catch(e){notice('تعذر الحفظ: '+(e.message||'قد تكون مساحة التخزين ممتلئة.'),true);}
}
function textRequired(id){const value=$(id).value.trim();if(!value){notice('اكتب بضع كلمات أولًا.',true);$(id).focus();return null;}return value;}
function show(screen){
 S.screen=screen;clearNotice();document.querySelectorAll('#mindfulSheet .mm-screen').forEach(el=>el.classList.toggle('is-active',el.dataset.mmScreen===screen));
 $('mmBack').hidden=screen==='menu';$('mindfulDynamicArea').scrollTop=0;
 const names={menu:'دقيقة وعي',feelings:'سمِّ شعورك',thought:'أعد ترتيب فكرتك',ground:'عد إلى اللحظة',gratitude:'لحظة امتنان',intention:'نية صغيرة',unload:'أفرغ ذهنك'};
 $('mmTitle').textContent=names[screen];$('mmTitle').focus();
 if(screen==='ground'&&S.groundDone)resetGround();
 if(screen==='ground')paintGround();
}
function pills(container,items,callback){
 const parent=$(container);parent.replaceChildren();
 for(const label of items){const button=document.createElement('button');button.type='button';button.className='mm-pill';button.textContent=label;button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>callback(label,button,parent));parent.appendChild(button);}
}
function choose(button,parent){parent.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));}
function feelingResponse(){
 if(!S.feeling)return;
 const pair=feelings[S.feeling];$('mmFeelingResponse').textContent=pair[0]+' '+pair[1];
 $('mmIntensityValue').value=$('mmIntensity').value;
 $('mmRouteGround').hidden=!(negative.has(S.feeling)&&Number($('mmIntensity').value)>7);
}
function renderThought(){
 const r=S.result;if(!r)return;$('mmThoughtResult').hidden=false;
 $('mmUnderstood').textContent=r.understood;$('mmReconsider').textContent=r.reconsider;$('mmReframed').textContent=r.reframed;$('mmAction').textContent=r.action;
 pills('mmPatterns',Object.values(patterns).map(p=>p.name),(label,button,parent)=>{const key=Object.keys(patterns).find(k=>patterns[k].name===label);S.result=analyze(r.input,key);renderThought();});
 [...$('mmPatterns').children].forEach(el=>el.setAttribute('aria-pressed',String(el.textContent===patterns[r.pattern].name)));
 const n=normalize(r.input);$('mmSupport').hidden=!['انتحار','انتحر','اقتل نفسي','اؤذي نفسي','اوذي نفسي','ما بغيتش نعيش'].some(term=>n.includes(term));
}
function resetGround(){S.groundStep=0;S.groundAnswers=[];S.groundDone=false;S.groundId=uid();}
function paintGround(){
 const step=S.groundStep;
 const titles=['لاحظ ثلاثة أشياء تراها الآن','استمع إلى ما حولك','لاحظ إحساسًا جسديًا واحدًا','أنت هنا الآن'];
 const prompts=['يمكنك ملاحظة لون أو شكل أو تفصيل صغير. لا حاجة للاستعجال.','ما الأصوات التي تصل إليك؟ اختر وصفًا أو اكتفِ بالملاحظة.','مثل ملامسة القدم للأرض أو اليد للسطح. اختر إحساسًا مريحًا لك.','انتهيت من التمرين. ليس مطلوبًا أن يختفي شعورك؛ يكفي أنك منحت اللحظة انتباهك.'];
 $('mmGroundTitle').textContent=titles[step];$('mmGroundPrompt').textContent=prompts[step];
 $('mmGroundAnswer').hidden=step===3;$('mmGroundLabel').hidden=step===3;$('mmSounds').hidden=step!==1;
 $('mmGroundAnswer').value=S.groundAnswers[step]?.text||'';
 $('mmGroundNext').textContent=step===3?(S.groundDone?'تم تسجيل الإنجاز':'تسجيل الإنجاز'):'التالي';$('mmGroundNext').disabled=S.groundDone;
 document.querySelectorAll('#mmGroundProgress span').forEach((el,i)=>el.classList.toggle('done',i<=step));
}
function open(){
 const sheet=$('mindfulSheet');if(!sheet)return;
 if(sheet.style.display!=='none'&&sheet.dataset.mmOpen==='true')return;
 S.focus=document.activeElement;S.inert=[];
 for(const el of document.querySelectorAll('.app-container')){if(!el.contains(sheet)){S.inert.push([el,el.inert]);el.inert=true;}}
 sheet.dataset.mmOpen='true';sheet.style.display='flex';show('menu');
}
function close(){
 $('mindfulSheet').style.display='none';$('mindfulSheet').dataset.mmOpen='false';
 for(const [el,previous] of S.inert)el.inert=previous;S.inert=[];
 if(S.focus?.isConnected)S.focus.focus();
}
function init(){
 const activities=[['feelings','سمِّ شعورك','تعرف على ما تشعر به وشدته.'],['thought','أعد ترتيب فكرتك','انظر إلى فكرتك بواقعية ورفق.'],['ground','عد إلى اللحظة','انتبه إلى محيطك، خطوة خطوة.'],['gratitude','لحظة امتنان','وثّق شيئًا صغيرًا تقدره.'],['intention','نية صغيرة','اختر خطوة للساعات القادمة.'],['unload','أفرغ ذهنك','اكتب بحرية، ثم اختر ما يناسبك.']];
 const menu=$('mmMenu');
 activities.forEach(([id,title,desc],index)=>{const button=document.createElement('button');button.type='button';button.className='mm-card';const number=document.createElement('span');number.className='mm-no';number.textContent=String(index+1).padStart(2,'0');const heading=document.createElement('strong');heading.textContent=title;const small=document.createElement('small');small.textContent=desc;button.append(number,heading,small);button.addEventListener('click',()=>show(id));menu.appendChild(button);});
 pills('mmFeelings',Object.keys(feelings),(label,button,parent)=>{S.feeling=label;choose(button,parent);$('mmFeelingFields').hidden=false;feelingResponse();});
 $('mmIntensity').addEventListener('input',feelingResponse);
 $('mmSaveFeeling').addEventListener('click',()=>{if(!S.feeling)return;storeOnce($('mmSaveFeeling'),'qatra_feelings_log',{feeling:S.feeling,intensity:Number($('mmIntensity').value),reason:$('mmReason').value.trim()});});
 $('mmRouteGround').addEventListener('click',()=>{resetGround();show('ground');});
 $('mmAnalyze').addEventListener('click',()=>{const text=textRequired('mmThought');if(!text)return;S.result=analyze(text);renderThought();});
 $('mmThought').addEventListener('input',()=>{S.result=null;$('mmThoughtResult').hidden=true;$('mmSupport').hidden=true;});
 $('mmSaveThought').addEventListener('click',()=>{const r=S.result;if(!r)return;storeOnce($('mmSaveThought'),'qatra_notebook',{text:'الفكرة الأصلية: '+r.input+'\n\nما فهمته: '+r.understood+'\n\nإعادة نظر: '+r.reconsider+'\n\nبعد الترتيب: '+r.reframed+'\n\nالخطوة: '+r.action,activity:'thought',analysis:r},'ترتيب فكرة');});
 resetGround();
 pills('mmSounds',['صوت قريب','صوت بعيد','أصوات طبيعة','هدوء'],(label,button,parent)=>{choose(button,parent);$('mmGroundAnswer').value=label;});
 $('mmGroundNext').addEventListener('click',()=>{
  if(S.groundStep<3){S.groundAnswers[S.groundStep]={step:S.groundStep+1,text:$('mmGroundAnswer').value.trim()};S.groundStep++;paintGround();$('mmGroundTitle').focus();return;}
  if(S.groundDone)return;
  try{persist('qatra_moments_log',{schemaVersion:1,id:S.groundId,createdAt:new Date().toISOString(),source:'mindful-minute',exercise:'grounding-3-step',completed:true,answers:S.groundAnswers});S.groundDone=true;paintGround();notice('تم تسجيل إنجاز تمرين العودة إلى اللحظة.');}catch(e){notice('تعذر تسجيل الإنجاز: '+e.message,true);}
 });
 pills('mmGratitudeSuggestions',['شخص عزيز','نعمة معتادة','موقف أسعدك'],(label)=>{const prompts={'شخص عزيز':'أنا ممتن لشخص في حياتي لأنه…','نعمة معتادة':'نعمة اعتدت عليها وأريد تقديرها هي…','موقف أسعدك':'موقف صغير أسعدني اليوم هو…'};const el=$('mmGratitude');el.value+=(el.value?'\n':'')+prompts[label];el.focus();});
 $('mmSaveGratitude').addEventListener('click',()=>{const text=textRequired('mmGratitude');if(text)storeOnce($('mmSaveGratitude'),'qatra_gratitude_log',{text});});
 pills('mmIntentionSuggestions',['أقرأ','أتواصل','أمشي'],(label)=>{const examples={'أقرأ':'أنوي قراءة صفحة واحدة خلال الساعات القادمة.','أتواصل':'أنوي التواصل برسالة بسيطة مع شخص أقدره.','أمشي':'أنوي المشي قليلًا إذا كان ذلك مناسبًا لي.'};$('mmIntention').value+=($('mmIntention').value?'\n':'')+examples[label];$('mmIntention').focus();});
 $('mmSaveIntention').addEventListener('click',()=>{const text=textRequired('mmIntention');if(text)storeOnce($('mmSaveIntention'),'qatra_intentions_log',{text,status:'planned'});});
 $('mmSaveUnload').addEventListener('click',()=>{const text=textRequired('mmUnload');if(text)storeOnce($('mmSaveUnload'),'qatra_notebook',{text,activity:'unload'},'تفريغ ذهني');});
 $('mmRouteThought').addEventListener('click',()=>{const text=textRequired('mmUnload');if(!text)return;$('mmThought').value=text;S.result=analyze(text);show('thought');renderThought();});
 $('mmClearUnload').addEventListener('click',()=>{if(!$('mmUnload').value)return;if(window.confirm('مسح المسودة الحالية؟ لن تتغير الملاحظات المحفوظة سابقًا.')){$('mmUnload').value='';notice('تم مسح المسودة الحالية.');}});
 $('mmBack').addEventListener('click',()=>show('menu'));$('closeMindfulSheet').addEventListener('click',close);
 $('mmSakeena').addEventListener('click',()=>{close();document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id==='meditationView'));document.querySelectorAll('.nav-item,.nav-home-btn').forEach(el=>el.classList.remove('active'));});
 $('mindfulSheet').addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key!=='Tab')return;
  const list=[...$('mindfulSheet').querySelectorAll('button,textarea,input,[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length);
  const first=list[0],last=list[list.length-1];
  if(event.shiftKey&&(document.activeElement===first||document.activeElement===$('mmTitle'))){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 });
}
window.QatraMindful={open,close,analyze,show};
// No existing openSheet implementation was present in the supplied app.
window.openSheet=function(id){if(id==='mindfulSheet'){open();return;}const el=$(id);if(el)el.classList.add('show');};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
// === QATRA MINDFUL MINIAPP V1 END ===

function qatraMindfulEscapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}


// === FEATURE 3: SEPARATE MOMENT AND QUOTE ===
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const cards = document.querySelectorAll('.glass-card, .card');
        let momentCard = null;
        let quoteCard = null;

        // 1. البحث عن البطاقتين بذكاء
        cards.forEach(card => {
            const titleEl = card.querySelector('.title, span');
            if (titleEl) {
                if (titleEl.textContent.includes('لحظتك الحالية')) momentCard = card;
                if (titleEl.textContent.includes('اقتباس اليوم') || titleEl.textContent.includes('اقتباس')) quoteCard = card;
            }
        });

        // 2. معالجة قسم "لحظتك الحالية" (رسائل مرتبطة بالوقت)
        if (momentCard) {
            const descEl = momentCard.querySelector('.desc') || momentCard.querySelectorAll('span')[1];
            const currentHour = new Date().getHours();
            let timePeriod = '';
            let periodMessages = [];

            if (currentHour >= 5 && currentHour < 12) {
                timePeriod = 'Morning';
                periodMessages = [
                    "ابدأ يومك بخطوة صغيرة، فالبدايات العظيمة لا تحتاج دائماً إلى ضجيج.",
                    "نفس جديد، نية متجددة، وفرصة أخرى لتبدأ من جديد.",
                    "صباح الخير. لا تحمل هم الأمس، اليوم قصة جديدة."
                ];
            } else if (currentHour >= 12 && currentHour < 17) {
                timePeriod = 'Noon';
                periodMessages = [
                    "توقف لحظة، أعد ترتيب أولوياتك، ثم تابع طريقك.",
                    "في زحام يومك، لا تنسَ أن تمنح نفسك دقائق من السكون.",
                    "خذ نفساً عميقاً، أنت تبلي بلاءً حسناً حتى الآن."
                ];
            } else if (currentHour >= 17 && currentHour < 21) {
                timePeriod = 'Evening';
                periodMessages = [
                    "امنح نفسك فرصة لتقدير ما أنجزته، حتى لو كان بسيطاً.",
                    "مضى تعب النهار، هذا وقت الهدوء والعودة إلى الذات.",
                    "مساء الامتنان لكل خطوة تجاوزتها اليوم."
                ];
            } else {
                timePeriod = 'Night';
                periodMessages = [
                    "ليس عليك أن تحل كل شيء الليلة؛ بعض الأمور تحتاج إلى وقت.",
                    "اسمح لجسدك وعقلك بالراحة، غداً يوم أفضل بإذن الله.",
                    "سامح نفسك على تقصير اليوم، ونم بقلب مطمئن."
                ];
            }

            // حفظ الرسالة للفترة الحالية حتى لا تتغير مع كل فتح للتطبيق
            const todayDate = new Date().toDateString();
            const momentStorageKey = 'qatra_moment_' + timePeriod + '_' + todayDate;
            let savedMoment = localStorage.getItem(momentStorageKey);
            
            if (!savedMoment) {
                savedMoment = periodMessages[Math.floor(Math.random() * periodMessages.length)];
                localStorage.setItem(momentStorageKey, savedMoment);
            }

            if (descEl) descEl.textContent = savedMoment;
        }

        // 3. معالجة قسم "اقتباس اليوم" (محتوى ثقافي وروحي عميق)
        if (quoteCard) {
            const descEl = quoteCard.querySelector('.desc') || quoteCard.querySelectorAll('span')[1];
            
            const deepQuotes = [
                "﴿وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ﴾ - سورة هود",
                "«احرص على ما ينفعك، واستعن بالله ولا تعجز» - حديث صحيح",
                "«وإنّما المرءُ حديثٌ بَعدَهُ، فَكُن حديثاً حَسَناً لِمَن وَعَى» - ابن دريد",
                "«لا تحقرن صغيرة إن الجبال من الحصى» - مثل عربي",
                "«كل متوقع آتٍ، فتوقع ما تتمنى.» - علي بن أبي طالب",
                "«لا يقلق من كان له أب، فكيف بمن كان له رب.» - الشعراوي",
                "﴿وَأَنْ لَيْسَ لِلْإِنْسَانِ إِلَّا مَا سَعَى﴾ - سورة النجم",
                "«النفسُ ترجو والأماني جمّةٌ، والعبد يدعو والكريمُ كريمُ» - شعر عربي"
            ];

            const todayDate = new Date().toDateString();
            let savedQuoteData = JSON.parse(localStorage.getItem('qatra_daily_quote') || '{}');

            // إذا كان يوماً جديداً، جلب اقتباس جديد
            if (savedQuoteData.date !== todayDate) {
                savedQuoteData = {
                    date: todayDate,
                    text: deepQuotes[Math.floor(Math.random() * deepQuotes.length)]
                };
                localStorage.setItem('qatra_daily_quote', JSON.stringify(savedQuoteData));
            }

            if (descEl) descEl.textContent = savedQuoteData.text;
        }
    }, 700); // 700ms لضمان أن كل البطاقات قد تم رسمها
});


// === FEATURE 4: JOURNEY STATS ===
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. نظام التتبع الصامت (يسجل الأيام تلقائياً عند فتح التطبيق)
    const today = new Date().toDateString();
    let journeyData = JSON.parse(localStorage.getItem('qatra_journey_data') || '{"activeDaysList": []}');
    
    // إذا لم يكن اليوم مسجلاً مسبقاً، أضفه
    if (!journeyData.activeDaysList.includes(today)) {
        journeyData.activeDaysList.push(today);
        localStorage.setItem('qatra_journey_data', JSON.stringify(journeyData));
    }

    // حساب السلسلة المتتالية (Streak)
    let currentStreak = 0;
    if (journeyData.activeDaysList.length > 0) {
        // ترتيب الأيام من الأحدث للأقدم
        const sortedDays = journeyData.activeDaysList.map(d => new Date(d)).sort((a,b) => b - a);
        let checkDate = new Date(); // نبدأ من اليوم
        checkDate.setHours(0,0,0,0);
        
        // التحقق من الاستمرارية
        for (let i = 0; i < sortedDays.length; i++) {
            sortedDays[i].setHours(0,0,0,0);
            const diffTime = Math.abs(checkDate - sortedDays[i]);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) { // نشط اليوم
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1); // نعود للوراء يوماً
            } else if (diffDays === 1 && i === 0) { // لم ينشط اليوم، لكنه نشط أمس
                checkDate.setDate(checkDate.getDate() - 1);
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break; // انقطعت السلسلة
            }
        }
    }

    // 2. ربط زر الإحصائيات في الهيدر لفتح اللوحة الجديدة
    setTimeout(() => {
        // البحث عن الزر القديم الخاص بالإحصائيات (عن طريق الأيقونة أو الحدث)
        const headerBtns = document.querySelectorAll('header button');
        let statsBtn = null;
        headerBtns.forEach(btn => {
            if (btn.innerHTML.includes('M18 20V10M12 20V4M6 20v-6') || (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('statsSheet'))) {
                statsBtn = btn;
            }
        });

        if (statsBtn) {
            // إزالة الأحداث القديمة بالاستنساخ
            const newStatsBtn = statsBtn.cloneNode(true);
            statsBtn.parentNode.replaceChild(newStatsBtn, statsBtn);
            newStatsBtn.removeAttribute('onclick');

            const journeySheet = document.getElementById('journeySheet');
            const journeyContent = document.getElementById('journeySheetContent');
            
            // فتح النافذة وعرض الأرقام الحقيقية
            newStatsBtn.addEventListener('click', () => {
                // جلب الأرقام المحدثة لحظياً من الذاكرة
                const latestJourney = JSON.parse(localStorage.getItem('qatra_journey_data') || '{"activeDaysList": []}');
                const activeDaysCount = latestJourney.activeDaysList.length;
                
                const stepStats = JSON.parse(localStorage.getItem('qatra_stats') || '{"completedSteps": 0}');
                const completedStepsCount = stepStats.completedSteps || 0;
                
                const savedQuotes = JSON.parse(localStorage.getItem('saved_quotes') || '[]');
                const savedQuotesCount = savedQuotes.length || 0;

                // تحديث الـ DOM
                document.getElementById('statActiveDays').textContent = activeDaysCount;
                document.getElementById('statStreak').textContent = currentStreak;
                document.getElementById('statSteps').textContent = window.QatraProgress?.snapshot?.steps ?? 0;
                document.getElementById('statQuotes').textContent = window.QatraProgress?.snapshot?.savedUnique ?? 0;
                window.QatraProgress?.refresh().catch(console.error);

                // عرض النافذة
                journeySheet.style.display = 'flex';
                setTimeout(() => {
                    journeySheet.style.opacity = '1';
                    journeyContent.style.transform = 'translateY(0)';
                }, 10);
            });

            // إغلاق النافذة
            const closeJourney = () => {
                journeySheet.style.opacity = '0';
                journeyContent.style.transform = 'translateY(100%)';
                setTimeout(() => { journeySheet.style.display = 'none'; }, 300);
            };
            
            document.getElementById('closeJourneySheet').onclick = closeJourney;
            journeySheet.onclick = (e) => { if(e.target === journeySheet) closeJourney(); };
        }
    }, 800);
});


// === FEATURE 5: NOTEBOOK ===
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // 1. إضافة زر "دفتر قطرة" في الهيدر بجانب زر الإعدادات
        const headerGroups = document.querySelectorAll('header .header-group');
        if (headerGroups.length > 0 && !document.getElementById('notebookBtn')) {
            const firstGroup = headerGroups[0];
            const notebookBtn = document.createElement('button');
            notebookBtn.className = 'header-btn';
            notebookBtn.id = 'notebookBtn';
            notebookBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:2;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';
            // إضافته بجانب زر الإعدادات
            firstGroup.appendChild(notebookBtn);
        }

        const notebookBtn = document.getElementById('notebookBtn');
        const sheet = document.getElementById('notebookSheet');
        const sheetContent = document.getElementById('notebookSheetContent');
        const closeBtn = document.getElementById('closeNotebookSheet');
        const saveBtn = document.getElementById('btnSaveNote');
        const exportBtn = document.getElementById('btnExportNotes');
        const noteInput = document.getElementById('noteInput');
        const historyContainer = document.getElementById('notebookHistory');
        const catBtns = document.querySelectorAll('.note-cat-btn');
        
        let currentCategory = 'خواطري';

        // 2. التحكم بأزرار التصنيفات
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => {
                    b.style.background = 'transparent';
                    b.style.color = 'var(--t-text)';
                });
                btn.style.background = 'var(--t-nav-act)';
                currentCategory = btn.getAttribute('data-cat');
                noteInput.placeholder = btn.getAttribute('data-placeholder');
            });
        });

        // 3. عرض التدوينات من الذاكرة المحلية
        function renderNotes() {
            const notes = JSON.parse(localStorage.getItem('qatra_notebook') || '[]');
            if (notes.length === 0) {
                historyContainer.innerHTML = '<div style="text-align:center; margin-top:30px;"><svg viewBox="0 0 24 24" style="width:50px;height:50px;stroke:var(--t-sub);fill:none;stroke-width:1;margin-bottom:10px;"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg><p style="color:var(--t-sub, #666); font-weight:600;">دفترك فارغ حالياً. المساحة لك لتبدأ التدوين.</p></div>';
                return;
            }
            
            historyContainer.innerHTML = '';
            // عرض من الأحدث للأقدم
            notes.slice().reverse().forEach((note, index) => {
                const actualIndex = notes.length - 1 - index;
                const noteEl = document.createElement('div');
                noteEl.style = "background:rgba(128,128,128,0.05); border:1px solid rgba(128,128,128,0.1); border-radius:16px; padding:18px; margin-bottom:12px; position:relative;";
                
                let catColor = '#0ea5e9';
                if(note.category === 'ما تعلمته') catColor = '#10b981';
                if(note.category === 'أريد تذكره') catColor = '#f59e0b';
                if(note.category === 'لحظات أثرت فيّ') catColor = '#ec4899'; // استعداداً لربطها باقتباساتك لاحقاً

                noteEl.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <span style="font-size:0.75rem; background:rgba(128,128,128,0.1); color:${catColor}; padding:5px 12px; border-radius:12px; font-weight:bold;">${qatraMindfulEscapeHTML(note.category)}</span>
                        <span style="font-size:0.75rem; color:var(--t-sub, #666); font-weight:bold;">${qatraMindfulEscapeHTML(note.date)}</span>
                    </div>
                    <p style="font-size:1.05rem; color:var(--t-text, #111); line-height:1.7; margin:0 0 15px 0; white-space:pre-wrap;">${qatraMindfulEscapeHTML(note.text)}</p>
                    <button class="delete-note-btn" data-index="${actualIndex}" style="background:rgba(239,68,68,0.1); border:none; border-radius:8px; color:#ef4444; font-size:0.8rem; font-weight:bold; cursor:pointer; padding:6px 12px; display:flex; align-items:center; gap:5px;">
                        <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg> حذف
                    </button>
                `;
                historyContainer.appendChild(noteEl);
            });

            // تفعيل أزرار الحذف
            document.querySelectorAll('.delete-note-btn').forEach(btn => {
                btn.onclick = (e) => {
                    const idx = parseInt(e.target.closest('button').dataset.index);
                    notes.splice(idx, 1);
                    localStorage.setItem('qatra_notebook', JSON.stringify(notes));
                    renderNotes();
                };
            });
        }

        // 4. حفظ تدوينة جديدة
        saveBtn.onclick = () => {
            const text = noteInput.value.trim();
            if (text) {
                const notes = JSON.parse(localStorage.getItem('qatra_notebook') || '[]');
                const dateObj = new Date();
                const timeStr = dateObj.toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'});
                const dateStr = dateObj.toLocaleDateString('ar-EG');
                
                notes.push({
                    category: currentCategory,
                    text: text,
                    date: dateStr + ' - ' + timeStr
                });
                
                localStorage.setItem('qatra_notebook', JSON.stringify(notes));
                noteInput.value = '';
                saveBtn.textContent = 'تم الحفظ بنجاح!';
                saveBtn.style.background = '#10B981';
                renderNotes();
                
                setTimeout(() => {
                    saveBtn.textContent = 'حفظ في الدفتر';
                    saveBtn.style.background = 'var(--t-text, #111)';
                }, 2000);
            }
        };

        // 5. تصدير الخواطر كنسخة احتياطية (ملف JSON محلي)
        exportBtn.onclick = () => {
            const notes = localStorage.getItem('qatra_notebook') || '[]';
            const blob = new Blob([notes], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qatra_notebook_backup.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        // 6. فتح وإغلاق الدفتر
        if(notebookBtn) {
            notebookBtn.addEventListener('click', () => {
                renderNotes();
                sheet.style.display = 'flex';
                setTimeout(() => {
                    sheet.style.opacity = '1';
                    sheetContent.style.transform = 'translateY(0)';
                }, 10);
            });
        }

        const closeSheet = () => {
            sheet.style.opacity = '0';
            sheetContent.style.transform = 'translateY(100%)';
            setTimeout(() => { sheet.style.display = 'none'; }, 300);
        };
        closeBtn.onclick = closeSheet;
        sheet.onclick = (e) => { if(e.target === sheet) closeSheet(); };

    }, 900);
});

// === PRO PHASE 1: DAILY STEP ===
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const stepsDB = [
            { id: 1, cat: 'العلاقات والأسرة', title: 'أعد وصل خيط الود', task: 'تواصل اليوم مع شخص عزيز لم تتحدث معه منذ مدة. لا تحتاج إلى حديث طويل؛ رسالة صادقة تكفي.', why: 'العلاقات الجميلة تحتاج إلى اهتمام متبادل، وأحياناً تكون المبادرة الصغيرة بداية لعودة الدفء.', time: 'دقيقتان' },
            { id: 2, cat: 'الامتنان والسعادة', title: 'ثلاث نعم خفية', task: 'قبل النوم، تذكر ثلاثة أشياء جميلة حدثت لك اليوم، مهما كانت بسيطة.', why: 'توجيه العقل لملاحظة الإيجابيات يعيد برمجة نظرتك للحياة ويقلل من تأثير التوتر.', time: '3 دقائق' },
            { id: 3, cat: 'الصحة والعناية بالنفس', title: 'تنفس بعمق', task: 'خذ 5 أنفاس عميقة جداً (شهيق من الأنف وزفير بطيء من الفم)، وركز فقط على حركة الهواء.', why: 'التنفس العميق يرسل إشارة فورية للدماغ بتقليل هرمونات التوتر والاسترخاء.', time: 'دقيقة واحدة' },
            { id: 4, cat: 'المعرفة والقراءة', title: 'غذاء العقل', task: 'اقرأ صفحتين من كتاب مفيد، أو مقالاً يضيف لك معلومة جديدة.', why: 'القراءة المستمرة، ولو بكمية قليلة، تبني حصيلة معرفية ضخمة بمرور الوقت وتوسع المدارك.', time: '5 دقائق' },
            { id: 5, cat: 'التركيز والإنتاجية', title: 'عزلة رقمية قصيرة', task: 'ضع هاتفك في وضع الطيران أو في غرفة أخرى لمدة 15 دقيقة وركز على مهمة واحدة أو استرخِ.', why: 'تشتت الانتباه المستمر يرهق الدماغ. هذه العزلة تعيد شحن قدرتك على التركيز.', time: '15 دقيقة' },
            { id: 6, cat: 'الوعي العاطفي', title: 'مراقبة صامتة', task: 'راقب فكرة سلبية تخطر ببالك اليوم دون أن تحكم عليها أو تقاومها، دعها تمر كغيمة.', why: 'مراقبة الأفكار بوعي تفصلك عنها وتمنعها من السيطرة على مشاعرك وتصرفاتك.', time: 'مستمر' },
            { id: 7, cat: 'العطاء والعمل الإنساني', title: 'صنيع خفي', task: 'قدم مساعدة صغيرة لشخص اليوم (ابتسامة، مساعدة في الطريق، كلمة طيبة) دون انتظار مقابل.', why: 'العطاء الخالص يفرز هرمونات السعادة ويعزز الشعور بالانتماء والقيمة الإنسانية.', time: 'مفتوح' },
            { id: 8, cat: 'الانضباط والعادات', title: 'مساحة منظمة', task: 'قم بترتيب مساحة صغيرة جداً حولك (مكتبك، سريرك، أو رف صغير) لمدة 5 دقائق فقط.', why: 'الترتيب الخارجي ينعكس إيجاباً على الترتيب الداخلي ويمنح شعوراً بالإنجاز السريع.', time: '5 دقائق' },
            { id: 9, cat: 'التوازن والراحة', title: 'كوب من الهدوء', task: 'اصنع مشروبك المفضل، واشربه ببطء شديد دون تصفح الهاتف أو التفكير في العمل.', why: 'الاستمتاع الواعي باللحظة يكسر روتين العجلة ويعيد توازن الجهاز العصبي.', time: '10 دقائق' },
            { id: 10, cat: 'الروحانيات والقيم', title: 'خلوة قصيرة', task: 'اجلس بمفردك في صمت تام لعدة دقائق، راجع فيها نيتك وجدد عزمك.', why: 'الخلوة تمنح الروح مساحة للتنفس بعيداً عن ضجيج الحياة ومطالب الآخرين.', time: '5 دقائق' }
        ];

        const todayDate = new Date().toDateString();
        let currentStepData = JSON.parse(localStorage.getItem('qatra_pro_daily_step') || '{}');
        let stepHistory = JSON.parse(localStorage.getItem('qatra_steps_history') || '[]');

        if (currentStepData.date !== todayDate) {
            const recentlyDoneIds = stepHistory.slice(-7).map(h => h.id);
            const availableSteps = stepsDB.filter(s => !recentlyDoneIds.includes(s.id));
            const pool = availableSteps.length > 0 ? availableSteps : stepsDB;
            const selectedStep = pool[Math.floor(Math.random() * pool.length)];

            currentStepData = { date: todayDate, step: selectedStep, completed: false };
            localStorage.setItem('qatra_pro_daily_step', JSON.stringify(currentStepData));
        }

        const cards = document.querySelectorAll('.glass-card, .card');
        let oldCard = null;
        cards.forEach(card => {
            const text = card.textContent;
            if (text.includes('خطوة اليوم') || text.includes('أثر اليوم')) oldCard = card;
        });

        if (oldCard) {
            oldCard.style.display = 'none';

            const newWidget = document.createElement('div');
            newWidget.className = oldCard.className;
            newWidget.style.display = 'flex';
            newWidget.style.justifyContent = 'space-between';
            newWidget.style.alignItems = 'center';
            newWidget.style.cursor = 'pointer';
            newWidget.style.padding = '18px 20px';
            newWidget.style.marginBottom = '12px';
            
            const step = currentStepData.step;
            const isDone = currentStepData.completed;

            newWidget.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:6px; flex:1;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-weight:900; font-size:1.15rem; color:var(--t-text, inherit);">خطوة اليوم</span>
                        <span style="font-size: 0.65rem; background: rgba(14, 165, 233, 0.15); color: #0ea5e9; padding: 3px 8px; border-radius: 12px; font-weight: bold;">${step.cat}</span>
                    </div>
                    <span style="font-weight:700; font-size:0.95rem; color:var(--t-sub, inherit); opacity:0.9;">${isDone ? 'تم إنجاز الخطوة بنجاح 🤍' : step.title}</span>
                    <div style="display:flex; align-items: center; gap: 5px; opacity: 0.7; font-size: 0.8rem; color:var(--t-sub, inherit);">
                         <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                         <span>${step.time}</span>
                    </div>
                </div>
                <div id="widgetIcon">
                    ${isDone 
                        ? '<svg viewBox="0 0 24 24" width="28" height="28" stroke="#10b981" fill="rgba(16,185,129,0.2)" stroke-width="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
                        : '<div style="background:rgba(14, 165, 233, 0.1); color:#0ea5e9; padding:8px 15px; border-radius:12px; font-weight:bold; font-size:0.85rem;">ابدأ</div>'
                    }
                </div>
            `;

            oldCard.parentNode.insertBefore(newWidget, oldCard.nextSibling);

            const sheet = document.getElementById('proDailyStepSheet');
            const sheetContent = document.getElementById('proDailyStepContent');
            const btnComplete = document.getElementById('proBtnComplete');
            const animArea = document.getElementById('proDropAnimationArea');
            const dropSvg = document.getElementById('proDropSvg');
            const successMsg = document.getElementById('proSuccessMsg');

            newWidget.onclick = () => {
                document.getElementById('proStepCat').textContent = step.cat;
                document.getElementById('proStepTitle').textContent = step.title;
                document.getElementById('proStepTime').textContent = step.time;
                document.getElementById('proStepTask').textContent = step.task;
                document.getElementById('proStepWhy').textContent = step.why;

                if (currentStepData.completed) {
                    btnComplete.style.display = 'none';
                    animArea.style.display = 'none';
                } else {
                    btnComplete.style.display = 'block';
                    animArea.style.display = 'none';
                    dropSvg.classList.remove('anim-drop');
                    successMsg.style.opacity = '0';
                }

                sheet.style.display = 'flex';
                setTimeout(() => {
                    sheet.style.opacity = '1';
                    sheetContent.style.transform = 'translateY(0)';
                }, 10);
            };

            const closeSheet = () => {
                sheet.style.opacity = '0';
                sheetContent.style.transform = 'translateY(100%)';
                setTimeout(() => { sheet.style.display = 'none'; }, 400);
            };
            document.getElementById('proBtnClose').onclick = closeSheet;
            sheet.onclick = (e) => { if(e.target === sheet) closeSheet(); };

            btnComplete.onclick = () => {
                if (currentStepData.completed) return;
                btnComplete.style.display = 'none';
                animArea.style.display = 'flex';
                
                dropSvg.classList.add('anim-drop');
                successMsg.style.opacity = '1';

                currentStepData.completed = true;
                localStorage.setItem('qatra_pro_daily_step', JSON.stringify(currentStepData));
                
                stepHistory.push({
                    date: todayDate,
                    id: step.id,
                    title: step.title,
                    category: step.cat
                });
                localStorage.setItem('qatra_steps_history', JSON.stringify(stepHistory));

                const widgetIcon = newWidget.querySelector('#widgetIcon');
                widgetIcon.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" stroke="#10b981" fill="rgba(16,185,129,0.2)" stroke-width="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
                newWidget.querySelectorAll('span')[2].textContent = 'تم إنجاز الخطوة بنجاح 🤍';

                setTimeout(closeSheet, 2500);
            };
        }
    }, 1000);
});
// === END PRO PHASE 1 ===

// === QATRA PACKAGE TWO SKINS BEGIN ===
(() => {
'use strict';
const themes=[{"label": "جبال الفجر", "image": "assets/qatra-skins/hero-1.jpg", "wall": "radial-gradient(ellipse at 50% 22%,#665e9166,transparent 55%),linear-gradient(180deg,#182348,#101530 65%,#0c1226)", "vars": {"bgsolid": "#101630", "fg": "#eff4ff", "muted": "#c9d0ef", "accent": "#b8bdff", "ring": "#9fa6ef88", "glow": "#a6aaff55", "card": "linear-gradient(135deg,#4b568b99,#151d3c99)", "border": "#b8bdff55", "play": "linear-gradient(135deg,#ffffff,#9198ec)", "playink": "#17254c", "orb": "#151f47", "orbshade": "linear-gradient(180deg,#242f5933,#121a3f22)", "shadow": "#00000033"}}, {"label": "ورقة الندى", "image": "assets/qatra-skins/hero-2.jpg", "wall": "radial-gradient(ellipse at 10% 18%,#39742555,transparent 42%),radial-gradient(ellipse at 95% 60%,#17704144,transparent 40%),linear-gradient(#002e22,#001a13)", "vars": {"bgsolid": "#001d16", "fg": "#f0fff6", "muted": "#c3e9d1", "accent": "#8af0b2", "ring": "#63f3c788", "glow": "#2ceeab55", "card": "linear-gradient(135deg,#19664f99,#002c2299)", "border": "#78e5ba55", "play": "linear-gradient(135deg,#efffe5,#8ae6ba)", "playink": "#06462f", "orb": "#003428", "orbshade": "linear-gradient(180deg,#001f1510,#00291c33)", "shadow": "#00000033"}}, {"label": "الموج الأزرق", "image": "assets/qatra-skins/hero-3.jpg", "wall": "radial-gradient(ellipse at 50% 30%,#005e8855,transparent 55%),radial-gradient(ellipse at 5% 47%,#00bcf033,transparent 30%),linear-gradient(#001d31,#00101e)", "vars": {"bgsolid": "#001321", "fg": "#edfbff", "muted": "#b8dcea", "accent": "#81e8ff", "ring": "#58dbff99", "glow": "#00bfff66", "card": "linear-gradient(135deg,#17577a99,#032339bb)", "border": "#72ddff55", "play": "linear-gradient(135deg,#f2ffff,#58ccff)", "playink": "#004473", "orb": "#00334a", "orbshade": "linear-gradient(180deg,#002e4910,#002a3b22)", "shadow": "#00000033"}}, {"label": "الثلج السماوي", "image": "assets/qatra-skins/hero-4.jpg", "wall": "radial-gradient(ellipse at 95% 30%,#73c3f855,transparent 50%),linear-gradient(155deg,#f8fcff,#dcecff 70%,#eff7ff)", "vars": {"bgsolid": "#eaf3ff", "fg": "#0c2944", "muted": "#38536d", "accent": "#0875b2", "ring": "#a9e9ffbb", "glow": "#40bbff44", "card": "linear-gradient(135deg,#ffffffdd,#eaf3ffc9)", "border": "#ffffffaa", "play": "linear-gradient(135deg,#ffffff,#77dcff)", "playink": "#005b91", "orb": "#c6e5fa", "orbshade": "linear-gradient(180deg,#ffffff05,#b2dcff11)", "shadow": "#00101c22"}}, {"label": "رمال دافئة", "image": "assets/qatra-skins/hero-5.jpg", "wall": "radial-gradient(ellipse at 50% 35%,#ffd9a366,transparent 50%),linear-gradient(#fbf5f0,#eee1d8)", "vars": {"bgsolid": "#f4ece6", "fg": "#241c18", "muted": "#65554c", "accent": "#97612b", "ring": "#fff9edcc", "glow": "#e3b77b44", "card": "linear-gradient(135deg,#fffaf3d9,#f3e8dfbb)", "border": "#ffffffaa", "play": "linear-gradient(135deg,#fffef5,#f6d8ae)", "playink": "#593817", "orb": "#f3ddc7", "orbshade": "linear-gradient(180deg,#fff8ee08,#e0a45715)", "shadow": "#00101c22"}}, {"label": "القمر الفضي", "image": "assets/qatra-skins/hero-6.jpg", "wall": "radial-gradient(ellipse at 30% 21%,#3c536a66,transparent 48%),linear-gradient(#071421,#020b12)", "vars": {"bgsolid": "#030d16", "fg": "#f0f5fc", "muted": "#b5c5d7", "accent": "#d0e5fc", "ring": "#e3efffbb", "glow": "#b7d7ff55", "card": "linear-gradient(135deg,#40536a88,#0b182899)", "border": "#d5e7ff55", "play": "linear-gradient(135deg,#ffffff,#93abc7)", "playink": "#152640", "orb": "#0c1b2c", "orbshade": "linear-gradient(180deg,#08132100,#06122033)", "shadow": "#00000033"}}, {"label": "غروب أرجواني", "image": "assets/qatra-skins/hero-7.jpg", "wall": "radial-gradient(ellipse at 50% 20%,#bd548055,transparent 55%),linear-gradient(#2b124c,#1b0c2e)", "vars": {"bgsolid": "#1c0c30", "fg": "#fff4ff", "muted": "#e5c6e4", "accent": "#f2a1db", "ring": "#ffb9f3aa", "glow": "#f050e966", "card": "linear-gradient(135deg,#733f7caa,#29113fbb)", "border": "#e8b1f455", "play": "linear-gradient(135deg,#ffe2d7,#f167d5)", "playink": "#5c1e60", "orb": "#4e226a", "orbshade": "linear-gradient(180deg,#46124b05,#330d4444)", "shadow": "#00000033"}}];
const key='qatra_visual_skin_v2';
let index=0,initialized=false,root=null,hero=null,walls=[],scenes=[],front=0,lockedUntil=0;
const reduced=()=>window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function homeActive(){return document.getElementById('homeView')?.classList.contains('active');}
function initialize(){
 if(initialized)return;root=document.querySelector('.app-container');hero=document.getElementById('surpriseButton');if(!root||!hero)return;
 initialized=true;
 try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved?.version===2&&Number.isInteger(saved.index)&&saved.index>=0&&saved.index<themes.length)index=saved.index;}catch(error){console.warn('QATRA skin preference unavailable',error);}
 for(let n=0;n<2;n++){
  const wall=document.createElement('div');wall.className='q2-wall';wall.setAttribute('aria-hidden','true');root.prepend(wall);walls.push(wall);
  const scene=document.createElement('span');scene.className='q2-scene';scene.setAttribute('aria-hidden','true');hero.prepend(scene);scenes.push(scene);
 }
 const sync=()=>{root.classList.toggle('q2-home',!!homeActive());walls.forEach(w=>{w.hidden=!homeActive();});};
 const observer=new MutationObserver(sync);document.querySelectorAll('.view').forEach(v=>observer.observe(v,{attributes:true,attributeFilter:['class']}));
 sync();apply(index,false);
 // All backgrounds are local bundled assets, with no network image dependency.
 themes.forEach(t=>{const image=new Image();image.src=t.image;});
}
function apply(next,save=true){
 if(!initialized)return;
 index=(next+themes.length)%themes.length;const theme=themes[index];
 for(const [name,value] of Object.entries(theme.vars))root.style.setProperty('--q2-'+name,value);
 const back=1-front;walls[back].style.background=theme.wall;scenes[back].style.backgroundImage='url("'+theme.image+'")';
 walls[back].classList.add('q2-visible');scenes[back].classList.add('q2-visible');walls[front].classList.remove('q2-visible');scenes[front].classList.remove('q2-visible');front=back;
 root.dataset.qatraSkin=String(index+1);
 if(save){try{localStorage.setItem(key,JSON.stringify({version:2,index}));}catch(error){console.warn('QATRA skin not saved',error);}}
}
function installPull(scroll,container,icon){
 initialize();if(!scroll||!container||!icon)return;
 let start=null,pulled=false;
 const text=container.querySelector('.ptr-text');
 const prompt=()=>{if(text)text.textContent='اسحب لتغيير التصميم';};
 const reset=()=>{start=null;pulled=false;container.style.transform='translateY(-100%)';icon.classList.remove('spin');};
 scroll.addEventListener('touchstart',event=>{
  reset();
  if(event.touches.length!==1||scroll.scrollTop>1||!homeActive()||Date.now()<lockedUntil)return;
  if(event.target.closest('textarea,input,select,[contenteditable="true"]'))return;
  start={x:event.touches[0].clientX,y:event.touches[0].clientY};prompt();
 },{passive:true});
 scroll.addEventListener('touchmove',event=>{
  if(!start)return;
  if(event.touches.length!==1||!homeActive()){reset();return;}
  const dx=event.touches[0].clientX-start.x,dy=event.touches[0].clientY-start.y;
  if(dy<=0||scroll.scrollTop>1||Math.abs(dx)>Math.max(20,dy)){reset();return;}
  if(dy>12){pulled=true;if(event.cancelable)event.preventDefault();const travel=Math.min(dy*.62,95);container.style.transform='translateY('+(travel-70)+'px)';icon.style.transform='rotate('+dy*3+'deg)';if(text)text.textContent=dy>=78?'أفلت لتطبيق '+themes[(index+1)%themes.length].label:'اسحب لتغيير التصميم';}
 },{passive:false});
 scroll.addEventListener('touchend',event=>{
  if(!start)return;
  const dy=event.changedTouches[0].clientY-start.y;
  if(pulled&&dy>=78&&scroll.scrollTop<=1&&homeActive()){
   lockedUntil=Date.now()+(reduced()?250:750);apply(index+1);icon.classList.add('spin');if(text)text.textContent=themes[index].label;
   start=null;pulled=false;setTimeout(reset,reduced()?100:550);
  }else reset();
 },{passive:true});
 scroll.addEventListener('touchcancel',reset,{passive:true});
}
window.QatraSkins={installPull,init:initialize,get count(){return themes.length;},get current(){return index+1;}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize);else initialize();
})();
// === QATRA PACKAGE TWO SKINS END ===
