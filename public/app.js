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
    "today_impact": "أثر اليوم",
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

const generateArray = (base, count) => Array.from({length: count}, (_, i) => `${base} ${i+1}`);
const QUOTES_DB = {
dhikr: { key: "cat_dhikr", icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', items: ["سبحان الله وبحمده، سبحان الله العظيم.", "لا إله إلا أنت سبحانك إني كنت من الظالمين.", ...generateArray("دعاء رقم", 98)] },
selfDev: { key: "cat_selfDev", icon: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', items: ["الهدوء ليس ضعفاً، بل هو قوة التحكم في الذات.", ...generateArray("فكرة تطوير ذات رقم", 99)] },
quran: { key: "cat_quran", icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>', items: ["وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", ...generateArray("آية رقم", 99)] },
culture: { key: "cat_culture", icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>', items: ["الوقت كالسيف إن لم تقطعه قطعك.", ...generateArray("حكمة رقم", 99)] },
poetry: { key: "cat_poetry", icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>', items: ["وَمَا نَيْلُ الْمَطَالِبِ بِالتَّمَنِّي ... وَلَكِنْ تُؤْخَذُ الدُّنْيَا غِلَابَا", "دقات قلب المرء قائلة له ... إن الحياة دقائق وثواني", ...generateArray("بيت شعر رقم", 98)] }
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
<button onclick="copyQuote(decodeURIComponent('${encodeURIComponent(q).replace(/'/g, '%27')}'))" style="background:transparent; border:none; color:var(--secondary); cursor:pointer;">
<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
</button>
</div>
</div>`;
}).join('');
}
};

window.copyQuote = (txt) => {
navigator.clipboard.writeText(txt).then(() => {
const toast = document.getElementById('copyToast');
if(toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2000); }
});
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
if(!btn.dataset.view) return;
document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
document.querySelectorAll('.nav-item, .nav-home-btn').forEach(n => n.classList.remove('active'));
const viewEl = document.getElementById(btn.dataset.view);
if(viewEl) viewEl.classList.add('active');
btn.classList.add('active');
});
});

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
setTimeout(() => { ptrContainer.style.transform = 'translateY(-100%)'; ptrIcon.classList.remove('spin'); }, 600);
} else {
ptrContainer.style.transform = 'translateY(-100%)';
}
}
startY = 0;
}, {passive:true});
}

applyState(); renderDaysGrid();
const qtEl = document.getElementById('dailyQuoteText');
if(qtEl) qtEl.textContent = `"${getRandomQuote().quote}"`;

setTimeout(() => { const splash = document.getElementById('splash'); if (splash) { splash.style.opacity = '0'; setTimeout(() => splash.remove(), 800); } }, 2500);
});
