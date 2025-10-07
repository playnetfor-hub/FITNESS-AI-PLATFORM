export const translations = {
  en: {
    // Header
    headerTitle: "AI Fitness Coach",

    // Footer
    footerRights: "All Rights Reserved.",
    footerTagline: "Your personalized journey to a healthier you, powered by AI.",

    // Hero
    heroTitle: "Forge Your Ultimate Physique",
    heroSubtitle: "Unlock your full potential with a hyper-personalized fitness and meal plan crafted by advanced AI. Tell us about yourself and we'll build your roadmap to success.",

    // User Profile Form
    formTitle: "Create Your Profile",
    formSubtitle: "The more accurate you are, the better your plan will be.",
    ageLabel: "Age",
    genderLabel: "Gender",
    weightLabel: "Weight (kg)",
    heightLabel: "Height (cm)",
    goalLabel: "Primary Goal",
    workoutDaysLabel: "Workout Days per Week",
    activityLevelLabel: "Daily Activity Level",
    equipmentLabel: "Available Equipment",
    equipmentPlaceholder: "e.g., Full Gym, Dumbbells only, Bodyweight",
    styleLabel: "Preferred Workout Style",
    dietLabel: "Dietary Restrictions / Preferences",
    dietPlaceholder: "e.g., Vegetarian, Gluten-free, No nuts",
    dislikedExercisesLabel: "Disliked Exercises (Optional)",
    dislikedExercisesPlaceholder: "e.g., Burpees, Lunges, Long-distance running",
    generatePlanButton: "Generate My Plan",
    saveProfileButton: "Save Profile",
    
    // Loading State
    generatingPlan: "Generating Your Personalized Plan...",
    generatingPlanSubtext: "Our AI is crafting the perfect workout and meal plan just for you. This might take a moment.",
    
    // Error State
    generationError: "Failed to generate your fitness plan. Please check your API key and try again.",

    // Sidebar
    sidebarWelcome: "Create Profile",
    sidebarDashboard: "Dashboard",
    sidebarMyAccount: "My Account",
    sidebarMyPlan: "My Plan",
    sidebarProfile: "Profile",
    sidebarSettings: "Settings",
    sidebarMyPlans: "My Plans",

    // Dashboard
    dashboardTitle: "Your AI-Powered Fitness Dashboard",
    dashboardSubtitle: "Here is your personalized plan. Use the tabs to explore.",
    dashboardTodayWorkout: "Today's Workout",
    dashboardTodayNutrition: "Today's Nutrition",
    dashboardViewFullPlan: "View Full Plan",
    settingsButtonLabel: "Open Settings",
    newPlanButton: "Create a New Plan",
    workoutTab: "Workout Plan",
    nutritionTab: "Nutrition Guide",
    progressTab: "Progress",
    protipsTab: "Pro Tips",
    researchTab: "AI Research",
    sharePlanButton: "Share Plan",
    downloadPlanButton: "Download as PDF",
    shareWorkoutText: (focus, goal) => `Check out my workout today! Focusing on ${focus} to crush my goal of ${goal}.`,
    shareNutritionText: (calories, protein) => `Hitting my nutrition goals today! Aiming for ${calories} calories and ${protein}g of protein.`,
    shareGenericText: (goal) => `Making progress on my fitness goal: ${goal}!`,
    copied: "Copied to clipboard!",

    // Profile Page
    profilePageTitle: "Your Profile",
    profilePageSubtitle: "This is the information used to generate your plan.",
    editProfileButton: "Edit Profile",
    
    // Settings Page
    settingsPageTitle: "Settings",
    settingsPageSubtitle: "Customize your application experience.",
    themeSetting: "Theme",
    languageSetting: "Language",
    
    // Workout Plan
    workoutPlanTitle: "Your Weekly Workout Plan",
    warmup: "Warmup",
    exercises: "Exercises",
    cooldown: "Cooldown",
    sets: "Sets",
    reps: "Reps",
    rest: "Rest",
    techniqueFocus: "Technique Focus",
    watchTutorial: "Watch Tutorial",
    showVariations: "Show Variations",
    hideVariations: "Hide Variations",
    loadingVariations: "Finding variations...",
    variationsError: "Could not find variations.",
    variationsTitle: "Suggested Variations",
    
    // Meal Plan
    nutritionGuideTitle: "Your Daily Nutrition Guide",
    macroDashboardTitle: "Daily Macro Dashboard",
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    calorieSplit: "Calorie Split from Macros",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
    postWorkout: "Post-Workout",
    hydration: "Hydration",
    supplements: "Supplement Suggestions",

    // Nutrition Search
    nutritionSearchTitle: "Nutrition Research Tool",
    nutritionSearchSubtitle: "Ask about specific foods, nutrients, or dietary strategies to deepen your understanding.",
    nutritionSearchPlaceholder: "e.g., Is salmon good for fat loss?",
    askButton: "Ask",

    // Research
    researchTitle: "AI-Powered Fitness Research",
    researchSubtitle: "Have a fitness question? Ask our AI. It uses Google Search to provide you with up-to-date and relevant information.",
    researchPlaceholder: "e.g., What are the benefits of creatine?",
    searchButton: "Search",
    tryExample: "Or try an example:",
    answer: "Answer:",
    sources: "Sources:",
    searchError: "Failed to fetch search results. Please try again.",

    // Pro Tips
    proTipsTitle: "Personalized Pro Tips",
    proTipsSubtitle: "Actionable advice from your AI Coach to maximize your results and stay motivated on your journey.",

    // Progress Tracker
    progressTrackerTitle: "Track Your Progress",
    logNewEntry: "Log New Entry",
    copyLatest: "Copy Latest",
    date: "Date",
    waist: "Waist (cm, optional)",
    chest: "Chest (cm, optional)",
    hips: "Hips (cm, optional)",
    saveEntry: "Save Entry",
    weightHistory: "Weight History",
    totalChange: "Total Change",
    logbook: "Logbook",
    noEntries: "No entries yet. Add your first log!",
    weightChartMessage: "Log at least two entries to see your progress chart.",
    
    // Exercise Image
    imageError: "Could not load image.",
    retry: "Retry",
    retrying: "Retrying...",

    // Settings Modal
    settingsTitle: "Edit Your Preferences",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    saveAndRegenerate: "Save & Regenerate Plan",
    customTargetsTitle: "Custom Nutrition Targets (Optional)",
    customTargetsSubtitle: "Override the AI's calculation. Leave blank to let the AI decide.",
    targetCaloriesLabel: "Target Calories",
    targetProteinLabel: "Target Protein (g)",
    targetCarbsLabel: "Target Carbs (g)",
    targetFatLabel: "Target Fat (g)",
    
    // My Plans Page
    myPlansPageTitle: "My Saved Plans",
    myPlansPageSubtitle: "Here are all the fitness plans you've generated. Click to view or manage them.",
    noSavedPlans: "You don't have any saved plans yet. Create a new plan to get started!",
    loadPlan: "Load Plan",
    deletePlan: "Delete",
    confirmDeletePlan: "Are you sure you want to delete this plan? This action cannot be undone.",
    planNameDefault: (goal) => `${goal} Plan - ${new Date().toLocaleDateString()}`,

    // Save Plan Modal
    savePlanModalTitle: "Save Your Plan",
    planNameLabel: "Plan Name",
    savePlanButton: "Save Plan",

  },
  ar: {
    // Header
    headerTitle: "مدرب اللياقة البدنية",

    // Footer
    footerRights: "جميع الحقوق محفوظة.",
    footerTagline: "رحلتك الشخصية نحو صحة أفضل، مدعومة بالذكاء الاصطناعي.",

    // Hero
    heroTitle: "اصقل بنيتك الجسدية المثالية",
    heroSubtitle: "أطلق العنان لإمكانياتك الكاملة مع خطة لياقة بدنية ووجبات مخصصة للغاية صممها الذكاء الاصطناعي المتقدم. أخبرنا عن نفسك وسنبني لك خريطة طريقك نحو النجاح.",
    
    // User Profile Form
    formTitle: "أنشئ ملفك الشخصي",
    formSubtitle: "كلما كنت أكثر دقة، كانت خطتك أفضل.",
    ageLabel: "العمر",
    genderLabel: "الجنس",
    weightLabel: "الوزن (كجم)",
    heightLabel: "الطول (سم)",
    goalLabel: "الهدف الأساسي",
    workoutDaysLabel: "أيام التمرين في الأسبوع",
    activityLevelLabel: "مستوى النشاط اليومي",
    equipmentLabel: "المعدات المتاحة",
    equipmentPlaceholder: "مثال: صالة رياضية كاملة، دمبل فقط، وزن الجسم",
    styleLabel: "أسلوب التمرين المفضل",
    dietLabel: "القيود الغذائية / التفضيلات",
    dietPlaceholder: "مثال: نباتي، خالي من الغلوتين، بدون مكسرات",
    dislikedExercisesLabel: "التمارين غير المفضلة (اختياري)",
    dislikedExercisesPlaceholder: "مثال: بيربيز، لانجز، الجري لمسافات طويلة",
    generatePlanButton: "أنشئ خطتي",
    saveProfileButton: "حفظ الملف الشخصي",

    // Loading State
    generatingPlan: "جاري إنشاء خطتك المخصصة...",
    generatingPlanSubtext: "يقوم الذكاء الاصطناعي لدينا بصياغة خطة التمرين والوجبات المثالية لك. قد يستغرق هذا بعض الوقت.",

    // Error State
    generationError: "فشل في إنشاء خطة اللياقة البدنية الخاصة بك. يرجى التحقق من مفتاح API الخاص بك والمحاولة مرة أخرى.",

    // Sidebar
    sidebarWelcome: "إنشاء ملف شخصي",
    sidebarDashboard: "لوحة التحكم",
    sidebarMyAccount: "حسابي",
    sidebarMyPlan: "خطتي",
    sidebarProfile: "الملف الشخصي",
    sidebarSettings: "الإعدادات",
    sidebarMyPlans: "خططي",

    // Dashboard
    dashboardTitle: "لوحة التحكم الخاصة بك",
    dashboardSubtitle: "هذه هي خطتك المخصصة. استخدم علامات التبويب للاستكشاف.",
    dashboardTodayWorkout: "تمرين اليوم",
    dashboardTodayNutrition: "تغذية اليوم",
    dashboardViewFullPlan: "عرض الخطة الكاملة",
    settingsButtonLabel: "فتح الإعدادات",
    newPlanButton: "إنشاء خطة جديدة",
    workoutTab: "خطة التمرين",
    nutritionTab: "دليل التغذية",
    progressTab: "التقدم",
    protipsTab: "نصائح الخبراء",
    researchTab: "بحث AI",
    sharePlanButton: "مشاركة الخطة",
    downloadPlanButton: "تنزيل كملف PDF",
    shareWorkoutText: (focus, goal) => `شاهد تماريني اليوم! التركيز على ${focus} لتحقيق هدفي وهو ${goal}.`,
    shareNutritionText: (calories, protein) => `أحقق أهدافي الغذائية اليوم! أهدف إلى ${calories} سعر حراري و ${protein} جرام بروتين.`,
    shareGenericText: (goal) => `أحقق تقدماً في هدفي الرياضي: ${goal}!`,
    copied: "تم النسخ إلى الحافظة!",

    // Profile Page
    profilePageTitle: "ملفك الشخصي",
    profilePageSubtitle: "هذه هي المعلومات المستخدمة لإنشاء خطتك.",
    editProfileButton: "تعديل الملف الشخصي",

    // Settings Page
    settingsPageTitle: "الإعدادات",
    settingsPageSubtitle: "قم بتخصيص تجربة التطبيق الخاصة بك.",
    themeSetting: "المظهر",
    languageSetting: "اللغة",
    
    // Workout Plan
    workoutPlanTitle: "خطة التمرين الأسبوعية الخاصة بك",
    warmup: "الإحماء",
    exercises: "التمارين",
    cooldown: "التهدئة",
    sets: "المجموعات",
    reps: "التكرارات",
    rest: "الراحة",
    techniqueFocus: "التركيز على الأسلوب",
    watchTutorial: "شاهد الشرح",
    showVariations: "عرض التنويعات",
    hideVariations: "إخفاء التنويعات",
    loadingVariations: "جاري البحث عن تنويعات...",
    variationsError: "تعذر العثور على تنويعات.",
    variationsTitle: "تنويعات مقترحة",
    
    // Meal Plan
    nutritionGuideTitle: "دليل التغذية اليومي الخاص بك",
    macroDashboardTitle: "لوحة تحكم الماكروز اليومية",
    calories: "السعرات الحرارية",
    protein: "البروتين",
    carbs: "الكربوهيدرات",
    fat: "الدهون",
    calorieSplit: "توزيع السعرات من الماكروز",
    breakfast: "الإفطار",
    lunch: "الغداء",
    dinner: "العشاء",
    snack: "وجبة خفيفة",
    postWorkout: "بعد التمرين",
    hydration: "الترطيب",
    supplements: "اقتراحات المكملات",

    // Nutrition Search
    nutritionSearchTitle: "أداة بحث التغذية",
    nutritionSearchSubtitle: "اسأل عن أطعمة معينة أو عناصر غذائية أو استراتيجيات غذائية لتعميق فهمك.",
    nutritionSearchPlaceholder: "مثال: هل السلمون جيد لخسارة الدهون؟",
    askButton: "اسأل",

    // Research
    researchTitle: "بحث اللياقة البدنية المدعوم بالذكاء الاصطناعي",
    researchSubtitle: "هل لديك سؤال عن اللياقة البدنية؟ اسأل الذكاء الاصطناعي. يستخدم بحث Google لتزويدك بمعلومات محدثة وذات صلة.",
    researchPlaceholder: "مثال: ما هي فوائد الكرياتين؟",
    searchButton: "بحث",
    tryExample: "أو جرب مثالاً:",
    answer: "الإجابة:",
    sources: "المصادر:",
    searchError: "فشل في جلب نتائج البحث. يرجى المحاولة مرة أخرى.",

    // Pro Tips
    proTipsTitle: "نصائح احترافية مخصصة",
    proTipsSubtitle: "نصائح قابلة للتنفيذ من مدربك الذكي لزيادة نتائجك والبقاء متحفزًا في رحلتك.",

    // Progress Tracker
    progressTrackerTitle: "تتبع تقدمك",
    logNewEntry: "تسجيل إدخال جديد",
    copyLatest: "نسخ الأحدث",
    date: "التاريخ",
    waist: "الخصر (سم، اختياري)",
    chest: "الصدر (سم، اختياري)",
    hips: "الوركين (سم، اختياري)",
    saveEntry: "حفظ الإدخال",
    weightHistory: "سجل الوزن",
    totalChange: "التغيير الإجمالي",
    logbook: "السجل",
    noEntries: "لا توجد إدخالات بعد. أضف سجلك الأول!",
    weightChartMessage: "سجل إدخالين على الأقل لرؤية مخطط تقدمك.",
    
    // Exercise Image
    imageError: "تعذر تحميل الصورة.",
    retry: "إعادة المحاولة",
    retrying: "جارٍ إعادة المحاولة...",
    
    // Settings Modal
    settingsTitle: "تعديل تفضيلاتك",
    cancel: "إلغاء",
    saveChanges: "حفظ التغييرات",
    saveAndRegenerate: "حفظ وإعادة إنشاء الخطة",
    customTargetsTitle: "أهداف التغذية المخصصة (اختياري)",
    customTargetsSubtitle: "تجاوز حسابات الذكاء الاصطناعي. اترك الحقول فارغة ليقرر الذكاء الاصطناعي.",
    targetCaloriesLabel: "السعرات الحرارية المستهدفة",
    targetProteinLabel: "البروتين المستهدف (جم)",
    targetCarbsLabel: "الكربوهيدرات المستهدفة (جم)",
    targetFatLabel: "الدهون المستهدفة (جم)",

    // My Plans Page
    myPlansPageTitle: "خططي المحفوظة",
    myPlansPageSubtitle: "هذه هي جميع خطط اللياقة البدنية التي أنشأتها. انقر لعرضها أو إدارتها.",
    noSavedPlans: "ليس لديك أي خطط محفوظة حتى الآن. أنشئ خطة جديدة للبدء!",
    loadPlan: "تحميل الخطة",
    deletePlan: "حذف",
    confirmDeletePlan: "هل أنت متأكد من أنك تريد حذف هذه الخطة؟ لا يمكن التراجع عن هذا الإجراء.",
    planNameDefault: (goal) => `خطة ${goal} - ${new Date().toLocaleDateString('ar-EG')}`,
    
    // Save Plan Modal
    savePlanModalTitle: "احفظ خطتك",
    planNameLabel: "اسم الخطة",
    savePlanButton: "حفظ الخطة",
  }
};