/* Okeat Lens web demo: recognize a dish in the browser or through the Food-101 API,
   then show its nutrition, the six nutrient families, allergens and diet hints. */
const $ = (id) => document.getElementById(id);
const store = {
  get(k, d) { try { const v = localStorage.getItem("lens-" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("lens-" + k, JSON.stringify(v)); } catch {} },
};

const I18N = {
  he: {
    openOkeat: "ל-Okeat", eyebrow: "ראייה ממוחשבת · Food-101 · תזונה", title1: "מה יש", title2: "בצלחת?",
    lead: "מצלמים מנה, ו-Okeat Lens מזהה אותה ומראה כמה קלוריות, חלבון ופחמימות יש בה, את אבות המזון, האלרגנים, ואם היא כנראה טבעונית, ללא גלוטן ואיזו כשרות מתאימה לה.",
    stDishes: "מנות ומאכלים", stFam: "אבות מזון", stAll: "אלרגנים", stUp: "שפות",
    drop: "גררו לכאן תמונה של אוכל, או הדביקו עם Ctrl+V", pick: "בחירת תמונה", camera: "צילום", browse: "בלי תמונה: בחירה מהרשימה",
    tryOne: "או נסו דוגמה:", sPizza: "🍕 פיצה", sBurger: "🍔 המבורגר", sIce: "🍨 גלידה", sSushi: "🍣 סושי", recent: "זוהו לאחרונה:", surprise: "🎲 תפתיעו אותי", shareMeal: "📤 שיתוף", copied: "הסיכום הועתק ✓", mealTxt: "הארוחה שלי ב-Okeat Lens", allergenQ: "מחפשים מנה בלי אלרגן? בחרו מנה ובדקו את האלרגנים שלה",
    itLooks: "זה נראה כמו", youPicked: "בחרתם", sure: "ביטחון", notThis: "לא זה? בחירת מנה אחרת ✏️",
    portion: "כמה אכלתם?", serving: "מנה", gram: "גרם", kcal: "קלוריות",
    protein: "חלבון", carbs: "פחמימות", fat: "שומן", fiber: "סיבים", sugar: "סוכר", sodium_mg: "נתרן",
    ofCal: "מהקלוריות", dailyH: "מתוך הצריכה היומית", dailySub: "לפי ערכי ייחוס של 2,000 קלוריות ליום",
    famH: "אבות המזון בצלחת", f_carbs: "פחמימות", f_protein: "חלבונים", f_fat: "שומנים", f_vitamins: "ויטמינים", f_minerals: "מינרלים", f_water: "מים",
    lv0: "כמעט אין", lv1: "מעט", lv2: "בינוני", lv3: "הרבה", none: "לא בולט במנה",
    plateH: "צלחת מאוזנת", g_vegetables: "ירקות", g_fruit: "פירות", g_grains: "דגנים", g_protein: "חלבון", g_dairy: "חלב", g_treats: "פינוק",
    tipAll: "יש כאן כמעט את כל חלקי הצלחת 🌈", tipAdd: "כדי לאזן, אפשר להוסיף לצד המנה:", tipTreat: "מנה של פינוק, נהנים ממנה 🍰",
    a_gluten: "גלוטן", a_milk: "חלב", a_eggs: "ביצים", a_nuts: "אגוזים", a_peanuts: "בוטנים", a_fish: "דגים", a_shellfish: "פירות ים", a_soy: "סויה", a_sesame: "שומשום",
    mayContain: "אלרגנים במתכון נפוץ:", noAllergens: "✓ אין אלרגנים נפוצים במתכון הרגיל",
    v_A: "A", v_B: "B", v_B12: "B12", v_C: "C", v_D: "D", v_E: "E", v_K: "K",
    m_Fe: "ברזל", m_Ca: "סידן", m_K: "אשלגן", m_Mg: "מגנזיום", m_Zn: "אבץ", waterPct: "{n}% מים",
    note: "הערכים הם הערכה למנה טיפוסית, וגם התגיות הן רמזים ולא מידע מאומת. ב-Okeat רק הקהילה מאשרת.",
    addMeal: "➕ הוספה לארוחה שלי", share: "📸 כרטיס לשיתוף", compare: "⚖️ השוואה", unpin: "⚖️ ביטול השוואה",
    vs: "מול", added: "נוסף לארוחה ✓",
    myMeal: "הארוחה שלי", mealH: "🍽️ הארוחה שלי", clear: "ניקוי", remove: "הסרה",
    topGuesses: "עוד ניחושים · לחיצה מחליפה", findOkeat: "חיפוש מקומות ב-Okeat 🗺️", search: "חיפוש מנה…",
    engine: "מנוע זיהוי", mBrowser: "בדפדפן (מיידי)", mApi: "מודל Food-101 (API)", apiUrl: "כתובת ה-API",
    engineHelp: "\"בדפדפן\" מריץ MobileNet על המכשיר שלכם ומכיר כ-50 מאכלים. \"API\" משתמש במודל שאימנתי על 101 מנות.",
    loading: "טוען את המודל…", thinking: "מזהה…",
    notFood: "לא הצלחתי לזהות כאן אוכל 🤔 אפשר לבחור את המנה מהרשימה", notSure: "לא בטוח, הנה הניחושים שלי",
    apiDown: "ה-API לא עונה. הפעילו אותו עם uvicorn lens.api:app", notImage: "זה לא קובץ תמונה", saved: "הכרטיס נשמר ✓",
    vegan: "🌱 טבעוני", vegetarian: "🥕 צמחוני", gluten_free: "🌾 ללא גלוטן",
    meat: "🥩 בשרי", dairy: "🧀 חלבי", parve: "🍃 פרווה", not_kosher: "⚠️ כנראה לא כשר",
    boostH: "לשדרג את הצלחת", boostSub: "רוצים יותר חלבון, פחמימה או סיבים? בחרו, הוסיפו, וכל המספרים מתעדכנים",
    b_protein: "💪 יותר חלבון", b_carbs: "⚡ יותר פחמימה", b_fiber: "🌿 יותר סיבים", b_fat: "🫒 שומן טוב", b_veg: "🥦 יותר ויטמינים", b_light: "🪶 קליל יותר",
    rec: "מומלץ", recTip: "💡 ביחס ליעד שלכם, לארוחה הזאת חסר בעיקר {x}", onPlate: "נוסף לצלחת", clearExtras: "הסרת הכל",
    deltaTxt: "עם התוספות: {k} קלוריות · {p} גרם חלבון · {c} גרם פחמימות", kosherFit: "מוצגות רק תוספות שמתאימות לכשרות של המנה",
    plus: "הוספה", vitShort: "ויטמינים", onlyK: "{n} קלוריות", withExtras: "+ תוספות",
    dailySub: "לפי ערכי ייחוס של 2,000 קלוריות ליום", dailyGoal: "לפי היעד שלכם: {n} קלוריות ליום", changeGoal: "🎯 שינוי היעד",
    leftK: "נשארו לכם היום עוד {n} קלוריות ו-{p} גרם חלבון ליעד 🎯", overK: "עברתם את היעד היומי ב-{n} קלוריות", hitK: "בדיוק ביעד היומי 🎉",
    goalH: "🎯 היעד היומי שלי", resetGoal: "חזרה לברירת המחדל", tabQuick: "בחירה מהירה", tabCalc: "מחשבון", tabCustom: "ידני",
    p1500: "קליל", p1800: "מתון", p2000: "ממוצע", p2500: "פעיל", p3000: "ספורטיבי",
    sex: "מין", female: "אישה", male: "גבר", age: "גיל", height: "גובה (ס״מ)", weight: "משקל (ק״ג)", activity: "כמה אתם זזים?",
    act1: "כמעט לא, עבודה מול מחשב", act2: "קצת, אימון 1 עד 3 פעמים בשבוע", act3: "בינוני, 3 עד 5 אימונים בשבוע", act4: "הרבה, אימון כמעט כל יום", act5: "מאוד, עבודה פיזית או ספורט תחרותי",
    aim: "המטרה שלי", lose: "לרדת במשקל", keep: "לשמור", gain: "לעלות במסה", calcBtn: "🧮 חישוב", saveGoal: "✓ שמירה כיעד שלי",
    proteinG: "חלבון (גרם)", carbsG: "פחמימות (גרם)", fatG: "שומן (גרם)", goalNote: "הערכה כללית בלבד ולא תחליף לייעוץ של דיאטנית.",
    bmr: "במנוחה", tdee: "שריפה יומית", target: "היעד שלכם", goalSaved: "היעד היומי עודכן ✓", goalReset: "חזרנו ל-2,000 קלוריות", fixFields: "בדקו את השדות המסומנים",
    nowGoal: "היעד שלכם", defGoal: "ברירת מחדל",
    pickCmp: "⚖️ בחרו מנה להשוואה מול {d}", pf_all: "הכל", pf_il: "🇮🇱 ישראלי", pf_vegan: "🌱 טבעוני", pf_gluten_free: "🌾 ללא גלוטן", pf_protein: "💪 עשיר בחלבון", pf_light: "🪶 עד 300 קלוריות", pf_sweet: "🍰 מתוקים", noMatch: "לא נמצאה מנה 🤔",
    cmpSwap: "🔄 להחליף ביניהן", cmpOther: "✏️ מנה אחרת", cmpClose: "✕ סגירה", better: "עדיף", cmpWin: "🏆 {d} עדיפה ב-{n} מתוך {m}", cmpTie: "🤝 תיקו, שתיהן טובות", cmpNote: "עדיף = יותר חלבון וסיבים, פחות קלוריות, סוכר, שומן ונתרן",
    cardFoot: "הערכה למנה טיפוסית · Okeat Lens",
  },
  en: {
    openOkeat: "Open Okeat", eyebrow: "Computer Vision · Food-101 · Nutrition", title1: "What's on", title2: "the plate?",
    lead: "Snap a dish and Okeat Lens recognizes it, then shows its calories, protein and carbs, the six nutrient families, allergens, and whether it's likely vegan, gluten-free and which kind of kosher fits it.",
    stDishes: "dishes and foods", stFam: "nutrient families", stAll: "allergens", stUp: "languages",
    drop: "Drop a food photo here, or paste with Ctrl+V", pick: "Choose a photo", camera: "Take a photo", browse: "No photo: pick from the list",
    tryOne: "or try one:", sPizza: "🍕 Pizza", sBurger: "🍔 Burger", sIce: "🍨 Ice cream", sSushi: "🍣 Sushi", recent: "Recently spotted:", surprise: "🎲 Surprise me", shareMeal: "📤 Share", copied: "Summary copied ✓", mealTxt: "My meal on Okeat Lens", allergenQ: "Looking for a dish without an allergen? Pick one and check its allergens",
    itLooks: "This looks like", youPicked: "You picked", sure: "sure", notThis: "Not this? Pick another dish ✏️",
    portion: "How much did you eat?", serving: "serving", gram: "g", kcal: "calories",
    protein: "Protein", carbs: "Carbs", fat: "Fat", fiber: "Fiber", sugar: "Sugar", sodium_mg: "Sodium",
    ofCal: "of calories", dailyH: "Of your daily intake", dailySub: "Based on reference values for 2,000 calories a day",
    famH: "The six nutrient families", f_carbs: "Carbs", f_protein: "Proteins", f_fat: "Fats", f_vitamins: "Vitamins", f_minerals: "Minerals", f_water: "Water",
    lv0: "hardly any", lv1: "a little", lv2: "some", lv3: "a lot", none: "not notable here",
    plateH: "Balanced plate", g_vegetables: "Veggies", g_fruit: "Fruit", g_grains: "Grains", g_protein: "Protein", g_dairy: "Dairy", g_treats: "Treat",
    tipAll: "Almost every part of the plate is here 🌈", tipAdd: "To balance it, you could add on the side:", tipTreat: "A treat, enjoy it 🍰",
    a_gluten: "Gluten", a_milk: "Milk", a_eggs: "Eggs", a_nuts: "Nuts", a_peanuts: "Peanuts", a_fish: "Fish", a_shellfish: "Shellfish", a_soy: "Soy", a_sesame: "Sesame",
    mayContain: "Allergens in a typical recipe:", noAllergens: "✓ No common allergens in the usual recipe",
    v_A: "A", v_B: "B", v_B12: "B12", v_C: "C", v_D: "D", v_E: "E", v_K: "K",
    m_Fe: "Iron", m_Ca: "Calcium", m_K: "Potassium", m_Mg: "Magnesium", m_Zn: "Zinc", waterPct: "{n}% water",
    note: "Values are estimates for a typical serving, and the tags are hints, not verified facts. On Okeat only the community confirms.",
    addMeal: "➕ Add to my meal", share: "📸 Share card", compare: "⚖️ Compare", unpin: "⚖️ Stop comparing",
    vs: "vs", added: "Added to your meal ✓",
    myMeal: "My meal", mealH: "🍽️ My meal", clear: "Clear", remove: "Remove",
    topGuesses: "Other guesses · tap to switch", findOkeat: "Find places on Okeat 🗺️", search: "Search a dish…",
    engine: "Recognition engine", mBrowser: "In the browser (instant)", mApi: "Food-101 model (API)", apiUrl: "API address",
    engineHelp: "\"Browser\" runs MobileNet on your device and knows about 50 foods. \"API\" uses my model trained on 101 dishes.",
    loading: "Loading the model…", thinking: "Looking…",
    notFood: "I couldn't spot food here 🤔 You can pick the dish from the list", notSure: "Not sure, here are my guesses",
    apiDown: "The API isn't answering. Start it with uvicorn lens.api:app", notImage: "That's not an image file", saved: "Card saved ✓",
    vegan: "🌱 Vegan", vegetarian: "🥕 Vegetarian", gluten_free: "🌾 Gluten-free",
    meat: "🥩 Meat", dairy: "🧀 Dairy", parve: "🍃 Parve", not_kosher: "⚠️ Likely not kosher",
    boostH: "Boost the plate", boostSub: "Want more protein, carbs or fiber? Pick, add, and every number updates",
    b_protein: "💪 More protein", b_carbs: "⚡ More carbs", b_fiber: "🌿 More fiber", b_fat: "🫒 Good fats", b_veg: "🥦 More vitamins", b_light: "🪶 Lighter",
    rec: "Tip", recTip: "💡 Compared to your goal, this meal is mostly low on {x}", onPlate: "Added to the plate", clearExtras: "Remove all",
    deltaTxt: "With extras: {k} calories · {p} g protein · {c} g carbs", kosherFit: "Only extras that fit the dish's kosher type are shown",
    plus: "Add", vitShort: "Vitamins", onlyK: "{n} calories", withExtras: "+ extras",
    dailySub: "Based on reference values for 2,000 calories a day", dailyGoal: "Based on your goal: {n} calories a day", changeGoal: "🎯 Change goal",
    leftK: "{n} calories and {p} g protein left for today's goal 🎯", overK: "You are {n} calories over your daily goal", hitK: "Right on your daily goal 🎉",
    goalH: "🎯 My daily goal", resetGoal: "Back to default", tabQuick: "Quick pick", tabCalc: "Calculator", tabCustom: "Manual",
    p1500: "Light", p1800: "Moderate", p2000: "Average", p2500: "Active", p3000: "Athletic",
    sex: "Sex", female: "Female", male: "Male", age: "Age", height: "Height (cm)", weight: "Weight (kg)", activity: "How active are you?",
    act1: "Barely, desk job", act2: "A little, 1 to 3 workouts a week", act3: "Moderate, 3 to 5 workouts a week", act4: "A lot, training almost daily", act5: "Very, physical job or competitive sport",
    aim: "My goal", lose: "Lose weight", keep: "Maintain", gain: "Build mass", calcBtn: "🧮 Calculate", saveGoal: "✓ Save as my goal",
    proteinG: "Protein (g)", carbsG: "Carbs (g)", fatG: "Fat (g)", goalNote: "A general estimate, not a replacement for a dietitian.",
    bmr: "At rest", tdee: "Daily burn", target: "Your goal", goalSaved: "Daily goal updated ✓", goalReset: "Back to 2,000 calories", fixFields: "Check the highlighted fields",
    nowGoal: "Your goal", defGoal: "Default",
    pickCmp: "⚖️ Pick a dish to compare with {d}", pf_all: "All", pf_il: "🇮🇱 Israeli", pf_vegan: "🌱 Vegan", pf_gluten_free: "🌾 Gluten-free", pf_protein: "💪 High protein", pf_light: "🪶 Up to 300 calories", pf_sweet: "🍰 Sweets", noMatch: "No dish found 🤔",
    cmpSwap: "🔄 Swap them", cmpOther: "✏️ Another dish", cmpClose: "✕ Close", better: "better", cmpWin: "🏆 {d} wins {n} of {m}", cmpTie: "🤝 A tie, both are fine", cmpNote: "Better = more protein and fiber, less calories, sugar, fat and sodium",
    cardFoot: "Estimate for a typical serving · Okeat Lens",
  },
};

/* ImageNet classes that MobileNet knows, mapped to dish keys in labels.json. */
const BROWSER_MAP = {
  "pizza": "pizza", "cheeseburger": "hamburger", "hotdog": "hot_dog", "ice cream": "ice_cream",
  "guacamole": "guacamole", "carbonara": "spaghetti_carbonara", "burrito": "burrito", "bagel": "bagel",
  "pretzel": "pretzel", "french loaf": "baguette", "mashed potato": "mashed_potatoes", "trifle": "trifle",
  "meat loaf": "meatloaf", "potpie": "pot_pie", "consomme": "clear_soup", "hot pot": "hot_pot",
  "espresso": "espresso", "chocolate sauce": "chocolate_sauce", "dough": "dough", "head cabbage": "cabbage",
  "broccoli": "broccoli", "cauliflower": "cauliflower", "zucchini": "zucchini", "spaghetti squash": "spaghetti_squash",
  "acorn squash": "squash", "butternut squash": "butternut_squash", "cucumber": "cucumber", "artichoke": "artichoke",
  "bell pepper": "bell_pepper", "mushroom": "mushrooms", "granny smith": "green_apple", "strawberry": "strawberries",
  "orange": "orange", "lemon": "lemon", "fig": "fig", "pineapple": "pineapple", "banana": "banana",
  "jackfruit": "jackfruit", "custard apple": "custard_apple", "pomegranate": "pomegranate",
};
const MACRO_KEYS = ["protein", "carbs", "fat", "fiber", "sugar", "sodium_mg"];
const FAMILY_ICON = { carbs: "🍞", protein: "🥚", fat: "🫒", vitamins: "🍊", minerals: "🧂", water: "💧" };
const GROUP_ICON = { vegetables: "🥦", fruit: "🍎", grains: "🌾", protein: "🍗", dairy: "🥛", treats: "🍰" };
const ALLERGEN_ICON = { gluten: "🌾", milk: "🥛", eggs: "🥚", nuts: "🌰", peanuts: "🥜", fish: "🐟", shellfish: "🦐", soy: "🫘", sesame: "⚪" };
const CIRC = 2 * Math.PI * 48;

/* Extras you can add to the plate. Values are per unit: [key, icon, he, en, unit he, unit en, g, kcal, protein, carbs, fat, fiber, sugar, sodium, kosher, groups, allergens, vitamins, minerals] */
const ADDON_ROWS = [
  ["egg", "🥚", "ביצה קשה", "Boiled egg", "ביצה", "1 egg", 50, 78, 6.3, 0.6, 5.3, 0, 0.6, 62, "parve", "protein", "eggs", "B12 D", "Fe"],
  ["chicken", "🍗", "חזה עוף בגריל", "Grilled chicken breast", "100 גרם", "100 g", 100, 165, 31, 0, 3.6, 0, 0, 74, "meat", "protein", "", "B B12", "Zn K"],
  ["tuna", "🐟", "טונה במים", "Tuna in water", "קופסה", "1 can", 80, 90, 20, 0, 1, 0, 0, 250, "parve", "protein", "fish", "B12 D", "Fe"],
  ["salmon", "🍣", "סלמון אפוי", "Baked salmon", "100 גרם", "100 g", 100, 206, 22, 0, 12, 0, 0, 60, "parve", "protein", "fish", "D B12", "K"],
  ["yogurt", "🥣", "יוגורט יווני 0%", "Greek yogurt 0%", "גביע", "1 cup", 170, 100, 17, 6, 0.7, 0, 6, 60, "dairy", "dairy protein", "milk", "B12", "Ca"],
  ["cottage", "🧀", "קוטג׳ 5%", "Cottage cheese 5%", "חצי גביע", "half a tub", 125, 120, 14, 4, 6, 0, 4, 450, "dairy", "dairy protein", "milk", "B12", "Ca"],
  ["cheese", "🧀", "גבינה צהובה", "Yellow cheese", "פרוסה", "1 slice", 20, 70, 5, 0.2, 5.5, 0, 0, 120, "dairy", "dairy", "milk", "A B12", "Ca Zn"],
  ["milk", "🥛", "חלב 3%", "Milk 3%", "כוס", "1 glass", 240, 145, 8, 11.5, 7.5, 0, 11.5, 105, "dairy", "dairy", "milk", "B12 D A", "Ca K"],
  ["tofu", "🫘", "טופו", "Tofu", "100 גרם", "100 g", 100, 144, 17, 3, 9, 2, 0.6, 14, "parve", "protein", "soy", "", "Ca Fe Mg"],
  ["edamame", "🫛", "אדממה", "Edamame", "כוס", "1 cup", 155, 188, 18.4, 13.8, 8, 8, 3.4, 9, "parve", "vegetables protein", "soy", "C K", "Fe Mg"],
  ["lentils", "🍲", "עדשים מבושלות", "Cooked lentils", "כוס", "1 cup", 200, 230, 18, 40, 0.8, 16, 3.6, 4, "parve", "protein", "", "B", "Fe K Mg"],
  ["hummus", "🥙", "חומוס", "Hummus", "3 כפות", "3 tbsp", 50, 83, 4, 7, 5, 3, 0.1, 190, "parve", "protein", "sesame", "B", "Fe Mg"],
  ["tahini", "🥄", "טחינה גולמית", "Raw tahini", "כף", "1 tbsp", 15, 89, 2.6, 3.2, 8, 1.4, 0, 5, "parve", "", "sesame", "B E", "Ca Mg"],
  ["rice", "🍚", "אורז לבן", "White rice", "כוס", "1 cup", 160, 205, 4.3, 45, 0.4, 0.6, 0, 2, "parve", "grains", "", "B", "Mg"],
  ["quinoa", "🌾", "קינואה", "Quinoa", "כוס", "1 cup", 185, 222, 8, 39, 3.6, 5, 1.6, 13, "parve", "grains", "", "B E", "Mg Fe Zn"],
  ["bread", "🍞", "לחם מלא", "Whole wheat bread", "פרוסה", "1 slice", 30, 75, 3.6, 13, 1, 2, 1.5, 140, "parve", "grains", "gluten", "B", "Fe Mg"],
  ["pasta", "🍝", "פסטה", "Pasta", "כוס", "1 cup", 140, 220, 8, 43, 1.3, 2.5, 0.8, 1, "parve", "grains", "gluten", "B", "Fe"],
  ["oats", "🥣", "שיבולת שועל", "Oats", "חצי כוס", "half a cup", 40, 150, 5, 27, 2.7, 4, 0.4, 2, "parve", "grains", "gluten", "B", "Fe Mg Zn"],
  ["sweetpotato", "🍠", "בטטה אפויה", "Baked sweet potato", "בטטה", "1 sweet potato", 150, 135, 3, 31, 0.2, 5, 9, 54, "parve", "vegetables", "", "A C", "K"],
  ["potato", "🥔", "תפוח אדמה אפוי", "Baked potato", "תפוח אדמה", "1 potato", 170, 160, 4.3, 37, 0.2, 3.8, 2, 17, "parve", "vegetables", "", "C B", "K"],
  ["banana", "🍌", "בננה", "Banana", "בננה", "1 banana", 120, 105, 1.3, 27, 0.4, 3.1, 14, 1, "parve", "fruit", "", "B C", "K Mg"],
  ["dates", "🌴", "תמרים מג׳הול", "Medjool dates", "3 תמרים", "3 dates", 72, 200, 1.3, 54, 0.1, 4.8, 48, 1, "parve", "fruit", "", "B", "K Mg"],
  ["apple", "🍎", "תפוח", "Apple", "תפוח", "1 apple", 180, 95, 0.5, 25, 0.3, 4.4, 19, 2, "parve", "fruit", "", "C", "K"],
  ["berries", "🍓", "תותים", "Strawberries", "כוס", "1 cup", 150, 48, 1, 11.5, 0.5, 3, 7, 2, "parve", "fruit", "", "C", "K Mg"],
  ["salad", "🥗", "סלט ירקות", "Veggie salad", "קערה", "1 bowl", 150, 30, 1.3, 6, 0.3, 2, 3.5, 10, "parve", "vegetables", "", "A C K", "K"],
  ["broccoli", "🥦", "ברוקולי מאודה", "Steamed broccoli", "כוס", "1 cup", 90, 31, 2.6, 6, 0.3, 2.4, 1.5, 30, "parve", "vegetables", "", "C K A", "K Ca"],
  ["avocado", "🥑", "אבוקדו", "Avocado", "חצי", "half", 70, 112, 1.4, 6, 10.3, 4.7, 0.5, 5, "parve", "vegetables", "", "E K C", "K"],
  ["almonds", "🌰", "שקדים", "Almonds", "חופן", "a handful", 28, 164, 6, 6, 14, 3.5, 1.2, 0, "parve", "", "nuts", "E", "Mg Ca"],
  ["pb", "🥜", "חמאת בוטנים", "Peanut butter", "כף", "1 tbsp", 16, 94, 3.5, 3.5, 8, 1, 1.5, 70, "parve", "", "peanuts", "E B", "Mg"],
  ["oliveoil", "🫒", "שמן זית", "Olive oil", "כף", "1 tbsp", 13, 119, 0, 0, 13.5, 0, 0, 0, "parve", "", "", "E K", ""],
];
const ADDONS = {};
ADDON_ROWS.forEach(([key, ic, he, en, uhe, uen, g, kcal, protein, carbs, fat, fiber, sugar, sodium_mg, kosher, groups, al, vit, min]) => {
  ADDONS["x_" + key] = { key: "x_" + key, addon: true, ic, he, en, uhe, uen, kosher, tags: [], groups: groups.split(" ").filter(Boolean),
    allergens: al.split(" ").filter(Boolean),
    nutrition: { serving_g: g, kcal, protein, carbs, fat, fiber, sugar, sodium_mg, water_pct: 60, vitamins: vit.split(" ").filter(Boolean), minerals: min.split(" ").filter(Boolean) } };
});
const BOOST = {
  protein: ["chicken", "tuna", "salmon", "egg", "yogurt", "cottage", "tofu", "edamame", "lentils", "cheese", "hummus", "almonds"],
  carbs: ["rice", "quinoa", "sweetpotato", "potato", "bread", "pasta", "oats", "banana", "dates", "lentils"],
  fiber: ["lentils", "edamame", "broccoli", "avocado", "salad", "berries", "apple", "oats", "quinoa", "hummus", "bread", "almonds"],
  fat: ["avocado", "oliveoil", "tahini", "almonds", "pb", "salmon", "egg", "cheese"],
  veg: ["salad", "broccoli", "sweetpotato", "berries", "apple", "banana", "avocado", "edamame"],
  light: ["salad", "broccoli", "berries", "apple", "egg", "yogurt", "tuna", "cottage"],
};
const PRESETS = [1500, 1800, 2000, 2500, 3000];
const PICK_FILTERS = {
  all: () => true, il: (d) => d.il, vegan: (d) => d.tags.includes("vegan"), gluten_free: (d) => d.tags.includes("gluten_free"),
  protein: (d) => d.nutrition.protein >= 20, light: (d) => d.nutrition.kcal <= 300, sweet: (d) => (d.groups || []).includes("treats"),
};

let lang = store.get("lang", "he");
let labels = {}, all = [], ref = { kcal: 2000, protein: 50, carbs: 260, fat: 70, fiber: 30, sugar: 90, sodium_mg: 2400 };
let mobilenetModel = null, lastBlob = null, lastItems = null, current = null, portions = 1, picked = false;
let meal = store.get("meal", []), history = store.get("history", []);
let extras = {}, extrasFor = null, boostGoal = null, cmpKey = null, cmpP = 1, pickMode = "pick", pickFilter = "all";
let baseRef = { ...ref }, goal = store.get("goal", null), sex = store.get("sex", "f"), aim = store.get("aim", "keep");
if (goal) ref = goal;

const t = (k, v = {}) => String(I18N[lang][k] ?? I18N.en[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x]);
const nm = (d) => (lang === "he" ? d.he : d.en);
const fmt = (x) => (Math.round(x * 10) / 10).toLocaleString(lang === "he" ? "he-IL" : "en-US");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function scale(n, p) {
  const o = { ...n, serving_g: Math.round(n.serving_g * p), kcal: Math.round(n.kcal * p) };
  MACRO_KEYS.forEach((k) => (o[k] = k === "sodium_mg" ? Math.round(n[k] * p) : Math.round(n[k] * p * 10) / 10));
  return o;
}
const NUM_KEYS = ["serving_g", "kcal", ...MACRO_KEYS];
function sumN(list) {
  const o = { serving_g: 0, kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium_mg: 0, vitamins: [], minerals: [] };
  let w = 0;
  list.forEach(([n, p]) => {
    const s = scale(n, p);
    NUM_KEYS.forEach((k) => (o[k] += s[k]));
    w += (s.water_pct || 0) * s.serving_g;
    o.vitamins = [...new Set([...o.vitamins, ...(s.vitamins || [])])];
    o.minerals = [...new Set([...o.minerals, ...(s.minerals || [])])];
  });
  o.water_pct = Math.round(w / Math.max(o.serving_g, 1));
  ["protein", "carbs", "fat", "fiber", "sugar"].forEach((k) => (o[k] = Math.round(o[k] * 10) / 10));
  return o;
}
const plateList = () => [[current.nutrition, portions], ...Object.entries(extras).map(([k, q]) => [labels[k].nutrition, q])];
const plateGroups = () => new Set([...(current.groups || []), ...Object.keys(extras).flatMap((k) => labels[k].groups)]);
function calSplit(n) {
  const kc = { protein: 4 * n.protein, carbs: 4 * n.carbs, fat: 9 * n.fat };
  const tot = kc.protein + kc.carbs + kc.fat || 1;
  return { protein: kc.protein / tot, carbs: kc.carbs / tot, fat: kc.fat / tot };
}
function families(n) {
  const g = Math.max(n.serving_g, 1);
  const lv = (gr, hi) => (gr / g >= hi ? 3 : gr / g >= hi / 2 ? 2 : gr >= 1 ? 1 : 0);
  return {
    carbs: lv(n.carbs, 0.3), protein: lv(n.protein, 0.15), fat: lv(n.fat, 0.15),
    vitamins: Math.min(3, n.vitamins.length), minerals: Math.min(3, n.minerals.length),
    water: n.water_pct >= 75 ? 3 : n.water_pct >= 50 ? 2 : n.water_pct >= 20 ? 1 : 0,
  };
}

function countUp(el, to, dur = 900) {
  const from = Number(el.dataset.v || 0);
  el.dataset.v = to;
  if (reduced) return (el.textContent = fmt(to));
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(from + (to - from) * e).replace(/\.\d$/, (m) => (k < 1 ? "" : m));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const frame2 = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  $("langBtn").textContent = lang === "he" ? "EN" : "עב";
  document.title = lang === "he" ? "Okeat Lens · מה יש בצלחת?" : "Okeat Lens · What's on the plate?";
  if (lastItems) render(lastItems, false);
  renderMeal(false);
  renderHistory();
  renderGoal();
  if ($("picker").open) fillPicker();
}

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 3200);
}

function confetti(n = 70) {
  if (reduced) return;
  const colors = ["#FFD5C9", "#D9F3E7", "#DAD5FF", "#FBD5E0", "#FFF1C9", "#5548C8"];
  for (let i = 0; i < n; i++) {
    const c = document.createElement("i");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
    c.style.animationDelay = Math.random() * 0.4 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3800);
  }
}

const mode = () => document.querySelector("input[name=mode]:checked").value;

async function loadLabels() {
  try {
    const data = await (await fetch("labels.json")).json();
    all = [...data.classes, ...(data.extras || [])];
    all.forEach((c) => (labels[c.key] = c));
    Object.values(ADDONS).forEach((a) => (labels[a.key] = a));
    if (data.daily_reference) baseRef = data.daily_reference;
    ref = goal || baseRef;
    const st = document.querySelector('.stats [data-act="browse"] b');
    st.dataset.count = all.length;
    if (Number(st.dataset.v)) countUp(st, all.length, 600);
  } catch { toast("labels.json?"); }
}

async function getMobileNet() {
  if (!mobilenetModel) {
    toast(t("loading"));
    mobilenetModel = await mobilenet.load({ version: 2, alpha: 1.0 });
  }
  return mobilenetModel;
}

function mapImagenet(className) {
  for (const n of className.toLowerCase().split(",").map((s) => s.trim())) {
    if (BROWSER_MAP[n] && labels[BROWSER_MAP[n]]) return labels[BROWSER_MAP[n]];
  }
  return null;
}

async function predictBrowser(img) {
  const preds = await (await getMobileNet()).classify(img, 10);
  const items = [];
  for (const p of preds) {
    const d = mapImagenet(p.className);
    if (d && !items.some((x) => x.key === d.key)) items.push({ ...d, confidence: p.probability });
  }
  return items.slice(0, 5);
}

async function predictApi(blob) {
  const form = new FormData();
  form.append("file", blob, "dish.jpg");
  const url = $("apiUrl").value.replace(/\/$/, "") + "/predict";
  let res;
  try { res = await fetch(url, { method: "POST", body: form }); } catch { throw new Error(t("apiDown")); }
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || t("apiDown"));
  return (await res.json()).top.map((d) => ({ ...(labels[d.key] || {}), ...d }));
}

/* ---------- result ---------- */
function render(items, animate = true) {
  lastItems = items;
  const best = items[0];
  current = best;
  if (extrasFor !== best.key) { extras = {}; boostGoal = null; extrasFor = best.key; }
  if (cmpKey === best.key) cmpKey = null;
  $("dishName").textContent = nm(best);
  $("dishOther").textContent = lang === "he" ? best.en : best.he;
  document.querySelector("#result .eyebrow").textContent = t(picked ? "youPicked" : "itLooks");
  const pct = Math.round(best.confidence * 100);
  $("ring").hidden = picked;
  $("ring").style.setProperty("--p", animate ? 0 : pct);
  frame2(() => $("ring").style.setProperty("--p", pct));
  $("ringVal").textContent = pct + "%";

  const chips = $("chips");
  chips.innerHTML = "";
  [...best.tags, best.kosher].filter(Boolean).forEach((k, i) => {
    const s = document.createElement("span");
    s.className = "chip " + k;
    s.style.animationDelay = i * 0.08 + "s";
    s.textContent = t(k);
    chips.appendChild(s);
  });

  const al = $("allergens");
  al.innerHTML = "";
  if (best.allergens?.length) {
    al.insertAdjacentHTML("beforeend", `<span class="al-h">${t("mayContain")}</span>`);
    best.allergens.forEach((a, i) => al.insertAdjacentHTML("beforeend",
      `<span class="al" style="animation-delay:${i * 0.06}s">${ALLERGEN_ICON[a]} ${t("a_" + a)}</span>`));
  } else if (best.allergens) al.innerHTML = `<span class="al ok">${t("noAllergens")}</span>`;

  renderNutrition(animate);
  renderCompare();
  const q = new URLSearchParams();
  if (best.tags.length) q.set("diet", best.tags.join(","));
  if (best.kosher && best.kosher !== "not_kosher") q.set("kosher", best.kosher);
  q.set("dish", best.en);
  $("okeatBtn").href = "https://okeat.vercel.app/map?" + q.toString();
  $("okeatFilters").textContent = [...best.tags, best.kosher].filter((k) => k && k !== "not_kosher").map((k) => t(k)).join(" · ");

  const bars = $("bars");
  bars.innerHTML = "";
  items.slice(1).forEach((d, i) => {
    const li = document.createElement("li");
    li.tabIndex = 0;
    li.innerHTML = `<span></span><span class="pct"></span><div class="track"><div class="fill"></div></div>`;
    li.children[0].textContent = nm(d);
    li.children[1].textContent = (d.confidence * 100).toFixed(1) + "%";
    const swap = () => { const arr = [...items]; [arr[0], arr[i + 1]] = [arr[i + 1], arr[0]]; render(arr); };
    li.onclick = swap;
    li.onkeydown = (e) => e.key === "Enter" && swap();
    bars.appendChild(li);
    const fill = li.querySelector(".fill");
    frame2(() => (fill.style.width = Math.max(2, d.confidence * 100) + "%"));
  });
  bars.previousElementSibling.hidden = bars.hidden = items.length < 2;

  $("result").hidden = false;
  window.revealAll?.();
  if (animate) {
    $("result").scrollIntoView({ behavior: "smooth", block: "start" });
    if (!picked && best.confidence >= 0.8) confetti();
    else if (!picked && best.confidence < 0.15) toast(t("notSure"));
  }
}

function setDonut(svg, n) {
  const s = calSplit(n);
  let off = 0;
  [["d-p", s.protein], ["d-c", s.carbs], ["d-f", s.fat]].forEach(([cls, v]) => {
    const c = svg.querySelector("." + cls), len = Math.max(0, v * CIRC - (v > 0.02 ? 3 : 0));
    c.style.strokeDasharray = `0 ${CIRC}`;
    c.style.strokeDashoffset = -off;
    frame2(() => (c.style.strokeDasharray = `${len} ${CIRC - len}`));
    off += v * CIRC;
  });
}

function macroList(ul, n, withPct) {
  const s = calSplit(n);
  ul.innerHTML = "";
  ["protein", "carbs", "fat", "fiber", "sugar", "sodium_mg"].forEach((k, i) => {
    const li = document.createElement("li");
    li.className = "m-" + k;
    li.style.animationDelay = i * 0.06 + "s";
    const unit = k === "sodium_mg" ? (lang === "he" ? "מ״ג" : "mg") : t("gram");
    const share = withPct && s[k] != null ? `<small>${Math.round(s[k] * 100)}% ${t("ofCal")}</small>` : "";
    li.innerHTML = `<i></i><span>${t(k)}</span><b><em data-v="0">0</em> ${unit}</b>${share}`;
    ul.appendChild(li);
    countUp(li.querySelector("em"), n[k]);
  });
}

function dailyBars(ol, n) {
  ol.innerHTML = "";
  ["kcal", "protein", "carbs", "fat", "fiber", "sugar", "sodium_mg"].forEach((k) => {
    const p = Math.round((100 * n[k]) / ref[k]);
    const li = document.createElement("li");
    li.className = "d-" + k;
    li.innerHTML = `<span>${t(k)}</span><span class="pct">${p}%</span><div class="track"><div class="fill"></div></div>`;
    ol.appendChild(li);
    const fill = li.querySelector(".fill");
    frame2(() => (fill.style.width = Math.min(100, Math.max(2, p)) + "%"));
    if (p > 100) li.classList.add("over");
  });
}

function renderNutrition(animate) {
  if (!current?.nutrition) return;
  const n = sumN(plateList());
  $("dailySub").textContent = goal ? t("dailyGoal", { n: fmt(ref.kcal) }) : t("dailySub");
  document.querySelectorAll("#portionSeg button").forEach((b) => b.classList.toggle("on", Number(b.dataset.p) === portions));
  $("grams").textContent = `≈ ${n.serving_g} ${t("gram")}`;
  countUp($("kcal"), n.kcal, animate ? 1100 : 600);
  setDonut($("donut"), n);
  macroList($("macros"), n, true);
  dailyBars($("daily"), n);

  const fam = families(n), box = $("families");
  box.innerHTML = "";
  Object.entries(fam).forEach(([k, lv], i) => {
    let detail = t("lv" + lv);
    if (k === "vitamins") detail = n.vitamins.length ? n.vitamins.map((v) => t("v_" + v)).join(" · ") : t("none");
    if (k === "minerals") detail = n.minerals.length ? n.minerals.map((m) => t("m_" + m)).join(" · ") : t("none");
    if (k === "water") detail = t("waterPct", { n: n.water_pct });
    if (["carbs", "protein", "fat"].includes(k)) detail += ` · ${fmt(n[k])} ${t("gram")}`;
    const div = document.createElement("div");
    div.className = `fam fam-${k} lv${lv}`;
    div.style.animationDelay = i * 0.07 + "s";
    div.innerHTML = `<div class="liquid"><span style="--lv:${lv}"></span></div><div class="fi">${FAMILY_ICON[k]}</div>
      <b>${t("f_" + k)}</b><div class="dots">${[1, 2, 3].map((d) => `<i class="${d <= lv ? "on" : ""}"></i>`).join("")}</div><small>${detail}</small>`;
    box.appendChild(div);
  });

  const g = plateGroups();
  const plate = $("hplate");
  plate.querySelector(".q-veg").classList.toggle("on", g.has("vegetables") || g.has("fruit"));
  plate.querySelector(".q-grain").classList.toggle("on", g.has("grains"));
  plate.querySelector(".q-prot").classList.toggle("on", g.has("protein"));
  plate.querySelector(".q-dairy").classList.toggle("on", g.has("dairy"));
  plate.classList.remove("spin"); void plate.getBoundingClientRect(); plate.classList.add("spin");
  const missing = ["vegetables", "grains", "protein"].filter((x) => !g.has(x) && !(x === "vegetables" && g.has("fruit")));
  $("plateTip").textContent = g.has("treats") && g.size <= 2 ? t("tipTreat")
    : missing.length === 0 ? t("tipAll") : `${t("tipAdd")} ${missing.map((m) => GROUP_ICON[m] + " " + t("g_" + m)).join(", ")}`;
  $("plateLegend").innerHTML = ["vegetables", "fruit", "grains", "protein", "dairy", "treats"]
    .map((x) => `<span class="${g.has(x) ? "on" : ""}">${GROUP_ICON[x]} ${t("g_" + x)}</span>`).join("");
  renderBoost();
}

function renderCompare() {
  const box = $("compare");
  $("pinBtn").textContent = cmpKey ? t("unpin") : t("compare");
  if (!cmpKey || !current || !labels[cmpKey]) { box.hidden = true; box.innerHTML = ""; return; }
  const A = sumN(plateList()), B = scale(labels[cmpKey].nutrition, cmpP), dB = labels[cmpKey];
  const keys = ["kcal", "protein", "carbs", "fat", "fiber", "sugar", "sodium_mg"];
  const higher = { protein: 1, fiber: 1 };
  let wa = 0, wb = 0;
  const rows = keys.map((k) => {
    const max = Math.max(A[k], B[k], 1);
    let win = "";
    if (k !== "carbs" && A[k] !== B[k]) {
      const aBetter = higher[k] ? A[k] > B[k] : A[k] < B[k];
      win = aBetter ? "a" : "b";
      aBetter ? wa++ : wb++;
    }
    const unit = k === "kcal" ? "" : k === "sodium_mg" ? (lang === "he" ? " מ״ג" : " mg") : " " + t("gram");
    return `<div class="cmp-row"><span>${t(k)}</span>
      <div class="cmp-bar a${win === "a" ? " win" : ""}"><i style="--w:${(100 * A[k]) / max}%"></i><b>${fmt(A[k])}${unit}</b></div>
      <div class="cmp-bar b${win === "b" ? " win" : ""}"><i style="--w:${(100 * B[k]) / max}%"></i><b>${fmt(B[k])}${unit}</b></div></div>`;
  }).join("");
  const m = wa + wb;
  const verdict = wa === wb ? t("cmpTie") : t("cmpWin", { d: wa > wb ? nm(current) : nm(dB), n: Math.max(wa, wb), m });
  const seg = [0.5, 1, 1.5, 2].map((p) => `<button type="button" data-bp="${p}" class="${p === cmpP ? "on" : ""}">${p === 0.5 ? "½" : p === 1.5 ? "1½" : p}</button>`).join("");
  box.innerHTML = `<div class="cmp-head"><div class="cmp-name a"><b></b><small>×${portions}${Object.keys(extras).length ? " " + t("withExtras") : ""}</small></div>
    <span class="vs">${t("vs")}</span><div class="cmp-name b"><b></b><div class="seg-pill mini">${seg}</div></div></div>
    ${rows}<p class="verdict">${verdict}</p><p class="sub small">${t("cmpNote")}</p>
    <div class="cmp-actions"><button class="btn soft" type="button" data-cmp="swap">${t("cmpSwap")}</button><button class="btn mint" type="button" data-cmp="other">${t("cmpOther")}</button><button class="btn ghost" type="button" data-cmp="close">${t("cmpClose")}</button></div>`;
  box.querySelector(".cmp-name.a b").textContent = nm(current);
  box.querySelector(".cmp-name.b b").textContent = nm(dB);
  box.hidden = false;
}

/* ---------- boost the plate ---------- */
function kosherOk(a) {
  if (current.kosher === "meat") return a.kosher !== "dairy";
  if (current.kosher === "dairy") return a.kosher !== "meat";
  return true;
}
function addonMetric(a, goalKey) {
  const n = a.nutrition;
  if (goalKey === "veg") return n.vitamins.length ? `${t("vitShort")} ${n.vitamins.join(" · ")}` : t("onlyK", { n: n.kcal });
  if (goalKey === "light") return t("onlyK", { n: n.kcal });
  return `+${fmt(n[goalKey])} ${t("gram")} ${t(goalKey)}`;
}
function renderBoost() {
  if (!current?.nutrition) return;
  const n = sumN(plateList());
  const share = (k) => n[k] / (ref[k] / 3);
  const low = ["protein", "fiber", "carbs"].map((k) => [k, share(k)]).sort((x, y) => x[1] - y[1])[0];
  const rec = low[1] < 0.7 ? low[0] : n.kcal > ref.kcal * 0.5 ? "light" : null;
  $("boostGoals").innerHTML = Object.keys(BOOST).map((k) =>
    `<button type="button" data-goal="${k}" class="${k === boostGoal ? "on" : ""}${k === rec ? " rec" : ""}">${t("b_" + k)}${k === rec ? `<em>${t("rec")}</em>` : ""}</button>`).join("");
  const grid = $("addonGrid");
  grid.innerHTML = "";
  if (!boostGoal && rec && rec !== "light") grid.innerHTML = `<p class="rec-tip">${t("recTip", { x: t(rec) })}</p>`;
  if (boostGoal) {
    BOOST[boostGoal].map((k) => ADDONS["x_" + k]).filter(kosherOk).forEach((a, i) => {
      const q = extras[a.key] || 0;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "addon" + (q ? " has" : "");
      b.style.animationDelay = i * 0.04 + "s";
      b.dataset.add = a.key;
      b.innerHTML = `<span class="ai">${a.ic}</span><b></b><small>${lang === "he" ? a.uhe : a.uen} · ${a.nutrition.kcal} ${t("kcal")}</small><em>${addonMetric(a, boostGoal)}</em><span class="plus">${q ? "×" + q : "+"}</span>`;
      b.querySelector("b").textContent = nm(a);
      grid.appendChild(b);
    });
    if (current.kosher === "meat" || current.kosher === "dairy") grid.insertAdjacentHTML("beforeend", `<p class="sub small kfit">${t("kosherFit")}</p>`);
  }
  const keys = Object.keys(extras);
  $("extrasBox").hidden = !keys.length;
  $("extrasList").innerHTML = keys.map((k) => `<span class="xchip"><button type="button" data-dec="${k}" aria-label="-">−</button>${labels[k].ic} <b>${nm(labels[k])}</b> ×${extras[k]}<button type="button" data-inc="${k}" aria-label="+">+</button></span>`).join("");
  if (keys.length) {
    const base = scale(current.nutrition, portions);
    $("extrasDelta").textContent = t("deltaTxt", { k: `${fmt(n.kcal)} (+${fmt(n.kcal - base.kcal)})`, p: `${fmt(n.protein)} (+${fmt(n.protein - base.protein)})`, c: `${fmt(n.carbs)} (+${fmt(n.carbs - base.carbs)})` });
  }
}
function changeExtra(key, d) {
  extras[key] = Math.max(0, Math.min(9, (extras[key] || 0) + d));
  if (!extras[key]) delete extras[key];
  renderNutrition(false);
  renderCompare();
}

/* ---------- daily goal ---------- */
function goalFrom(kcal, protein) {
  kcal = Math.round(kcal);
  protein = Math.round(protein ?? (kcal * 0.15) / 4);
  const fat = Math.round((kcal * 0.3) / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return { kcal, protein, carbs, fat, fiber: Math.round(kcal * 0.014), sugar: Math.round(kcal * 0.045), sodium_mg: 2300 };
}
function setGoal(g) {
  goal = g;
  ref = g || baseRef;
  store.set("goal", g);
  renderGoal();
  if (current) { renderNutrition(false); renderCompare(); }
  renderMeal(false);
  toast(g ? t("goalSaved") : t("goalReset"));
  if (g) confetti(30);
}
function renderGoal() {
  const r = ref;
  $("goalNow").innerHTML = `<span class="gn-k"><b>${fmt(r.kcal)}</b> ${t("kcal")}</span>` +
    ["protein", "carbs", "fat"].map((k) => `<span class="gn m-${k}"><i></i>${t(k)} <b>${fmt(r[k])}</b> ${t("gram")}</span>`).join("") +
    `<small>${goal ? t("nowGoal") : t("defGoal")}</small>`;
  $("resetGoal").hidden = !goal;
  $("presets").innerHTML = PRESETS.map((k) => `<button type="button" data-k="${k}" class="${goal && goal.kcal === k ? "on" : ""}"><b>${fmt(k)}</b><small>${t("p" + k)}</small></button>`).join("");
  const cf = $("customForm");
  ["kcal", "protein", "carbs", "fat"].forEach((k) => (cf.elements[k].value = Math.round(r[k])));
  const saved = store.get("calc", null), f = $("calcForm");
  if (saved) ["age", "height", "weight", "act"].forEach((k) => saved[k] && (f.elements[k].value = saved[k]));
  document.querySelectorAll("#sexSeg button").forEach((b) => b.classList.toggle("on", b.dataset.v === sex));
  document.querySelectorAll("#aimSeg button").forEach((b) => b.classList.toggle("on", b.dataset.v === aim));
}
function calcGoal() {
  const f = $("calcForm");
  const bad = ["age", "height", "weight"].filter((k) => !f.elements[k].checkValidity() || !f.elements[k].value);
  ["age", "height", "weight"].forEach((k) => f.elements[k].classList.toggle("bad", bad.includes(k)));
  if (bad.length) return toast(t("fixFields"));
  const a = +f.elements.age.value, h = +f.elements.height.value, w = +f.elements.weight.value, act = +f.elements.act.value;
  store.set("calc", { age: a, height: h, weight: w, act });
  const bmr = 10 * w + 6.25 * h - 5 * a + (sex === "m" ? 5 : -161), tdee = bmr * act;
  let kcal = aim === "lose" ? tdee - 500 : aim === "gain" ? tdee + 300 : tdee;
  kcal = Math.max(sex === "m" ? 1500 : 1200, Math.round(kcal / 10) * 10);
  const g = goalFrom(kcal, w * (aim === "lose" ? 1.6 : aim === "gain" ? 1.8 : 1.2));
  const out = $("calcOut");
  out.innerHTML = `<div class="co-tiles"><div><small>${t("bmr")}</small><b>${fmt(Math.round(bmr))}</b></div><div><small>${t("tdee")}</small><b>${fmt(Math.round(tdee))}</b></div><div class="hl"><small>${t("target")}</small><b>${fmt(g.kcal)}</b></div></div>
    <div class="co-mac">${["protein", "carbs", "fat", "fiber"].map((k) => `<span class="m-${k}"><i></i>${t(k)} <b>${g[k]}</b> ${t("gram")}</span>`).join("")}</div>
    <button class="btn primary wide" type="button" id="useCalc">${t("saveGoal")}</button>`;
  out.hidden = false;
  out.querySelectorAll(".co-tiles b").forEach((el) => { const v = Number(el.textContent.replace(/\D/g, "")); el.dataset.v = 0; countUp(el, v, 900); });
  $("useCalc").onclick = () => setGoal(g);
}

/* ---------- my meal ---------- */
function mealTotals() {
  const tot = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium_mg: 0, serving_g: 0 };
  meal.forEach((m) => {
    const d = labels[m.key];
    if (!d) return;
    const n = scale(d.nutrition, m.p);
    Object.keys(tot).forEach((k) => (tot[k] += n[k]));
  });
  ["protein", "carbs", "fat", "fiber", "sugar"].forEach((k) => (tot[k] = Math.round(tot[k] * 10) / 10));
  return tot;
}

function renderMeal(animate = true) {
  meal = meal.filter((m) => labels[m.key] || !all.length);
  store.set("meal", meal);
  $("mealCount").textContent = meal.length;
  $("mealJump").hidden = $("meal").hidden = !meal.length || !all.length;
  if (!meal.length || !all.length) return;
  const ul = $("mealList");
  ul.innerHTML = "";
  meal.forEach((m, i) => {
    const d = labels[m.key], n = scale(d.nutrition, m.p);
    const li = document.createElement("li");
    li.innerHTML = `<span class="mi-name"></span><span class="mi-p">×${m.p}</span><b>${n.kcal}</b><button class="x" type="button" aria-label="${t("remove")}">✕</button>`;
    li.querySelector(".mi-name").textContent = (d.addon ? d.ic + " " : "") + nm(d);
    li.querySelector(".x").onclick = () => { li.classList.add("bye"); setTimeout(() => { meal.splice(i, 1); renderMeal(); }, 280); };
    ul.appendChild(li);
  });
  const tot = mealTotals();
  countUp($("mealKcal"), tot.kcal, animate ? 900 : 300);
  const s = calSplit(tot);
  const st = $("mealStack").children;
  [s.protein, s.carbs, s.fat].forEach((v, i) => (st[i].style.flexGrow = Math.max(0.001, v)));
  macroList($("mealMacros"), tot, false);
  dailyBars($("mealDaily"), tot);
  const left = Math.round(ref.kcal - tot.kcal);
  $("mealLeft").textContent = Math.abs(left) < 25 ? t("hitK") : left > 0
    ? t("leftK", { n: fmt(left), p: fmt(Math.max(0, Math.round(ref.protein - tot.protein))) }) : t("overK", { n: fmt(-left) });
  $("mealLeft").classList.toggle("over", left <= -25);
}

function flyToMeal() {
  const from = $("addMeal").getBoundingClientRect(), to = $("mealJump").getBoundingClientRect();
  if (reduced || !to.width) return;
  const f = document.createElement("div");
  f.className = "fly";
  f.textContent = "🍽️";
  f.style.left = from.left + from.width / 2 + "px";
  f.style.top = from.top + "px";
  document.body.appendChild(f);
  frame2(() => { f.style.transform = `translate(${to.left - from.left - from.width / 2}px, ${to.top - from.top}px) scale(.5)`; f.style.opacity = ".2"; });
  setTimeout(() => f.remove(), 800);
}

/* ---------- history ---------- */
function thumb(img) {
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 96;
    const s = Math.min(img.naturalWidth, img.naturalHeight);
    c.getContext("2d").drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, 96, 96);
    return c.toDataURL("image/jpeg", 0.7);
  } catch { return null; }
}
function remember(key) {
  const img = $("img");
  const th = !img.hidden && img.naturalWidth ? thumb(img) : null;
  history = [{ key, th }, ...history.filter((h) => h.key !== key)].slice(0, 8);
  store.set("history", history);
  renderHistory();
}
function renderHistory() {
  const row = $("histRow");
  row.innerHTML = "";
  history.filter((h) => labels[h.key]).forEach((h) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "hist";
    b.title = nm(labels[h.key]);
    b.innerHTML = h.th ? `<img src="${h.th}" alt="">` : `<span>${GROUP_ICON[labels[h.key].groups[0]] || "🍽️"}</span>`;
    b.insertAdjacentHTML("beforeend", `<small></small>`);
    b.lastChild.textContent = nm(labels[h.key]);
    b.onclick = () => choose(h.key);
    row.appendChild(b);
  });
  $("history").hidden = !row.children.length;
}

/* ---------- picker ---------- */
function fillPicker() {
  const q = $("pickSearch").value.trim().toLowerCase();
  const grid = $("pickGrid");
  $("pickFilters").innerHTML = Object.keys(PICK_FILTERS).map((k) => `<button type="button" data-f="${k}" class="${k === pickFilter ? "on" : ""}">${t("pf_" + k)}</button>`).join("");
  grid.innerHTML = "";
  const list = all.filter((d) => (!q || d.en.toLowerCase().includes(q) || d.he.includes(q)) && PICK_FILTERS[pickFilter](d)
      && !(pickMode === "compare" && d.key === current?.key))
    .sort((a, b) => nm(a).localeCompare(nm(b), lang));
  list.forEach((d) => {
    const b = document.createElement("button");
    b.type = "button";
    b.innerHTML = `<span class="pi">${(d.groups || []).map((g) => GROUP_ICON[g]).join("")}</span><b></b><small>${d.nutrition.kcal} ${t("kcal")} · ${t("protein")} ${fmt(d.nutrition.protein)}</small>`;
    b.querySelector("b").textContent = nm(d);
    b.onclick = () => {
      $("picker").close();
      if (pickMode === "compare") {
        cmpKey = d.key; cmpP = 1;
        renderCompare();
        setTimeout(() => $("compare").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }), 60);
      } else choose(d.key);
    };
    grid.appendChild(b);
  });
  if (!list.length) grid.innerHTML = `<p class="empty">${t("noMatch")}</p>`;
}
function openPicker(m = "pick") {
  pickMode = m === "compare" && current ? "compare" : "pick";
  $("pickTitle").hidden = pickMode !== "compare";
  if (pickMode === "compare") $("pickTitle").textContent = t("pickCmp", { d: nm(current) });
  $("pickSearch").value = "";
  pickFilter = "all";
  fillPicker();
  $("picker").showModal();
  if (matchMedia("(hover: hover)").matches) $("pickSearch").focus();
}
function choose(key) {
  const d = labels[key];
  if (!d) return;
  picked = true;
  portions = 1;
  render([{ ...d, confidence: 1 }]);
  remember(key);
}

/* ---------- share card ---------- */
function roundRect(x, c, X, Y, W, H, r) { x.beginPath(); x.roundRect ? x.roundRect(X, Y, W, H, r) : x.rect(X, Y, W, H); x.fillStyle = c; x.fill(); }
async function shareCard() {
  if (!current) return;
  await document.fonts.ready;
  const n = scale(current.nutrition, portions), W = 1080, H = 1350;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d"), rtl = lang === "he";
  const g = x.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#FFE3DA"); g.addColorStop(0.5, "#EDE9FF"); g.addColorStop(1, "#DDF5EA");
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  [["#FBD5E0", 900, 160, 260], ["#FFF1C9", 140, 1180, 240], ["#DAD5FF", 980, 1200, 200]].forEach(([col, cx, cy, r]) => {
    x.globalAlpha = 0.7; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fillStyle = col; x.fill(); x.globalAlpha = 1;
  });
  const img = $("img");
  if (!img.hidden && img.naturalWidth) {
    try {
      x.save(); x.beginPath(); x.arc(W / 2, 330, 230, 0, 7); x.clip();
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      x.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, W / 2 - 230, 100, 460, 460);
      x.restore();
      x.lineWidth = 14; x.strokeStyle = "#fff"; x.beginPath(); x.arc(W / 2, 330, 236, 0, 7); x.stroke();
    } catch { x.restore(); }
  } else {
    x.font = "260px serif"; x.textAlign = "center"; x.fillText(GROUP_ICON[current.groups[0]] || "🍽️", W / 2, 420);
  }
  x.direction = rtl ? "rtl" : "ltr"; x.textAlign = "center"; x.fillStyle = "#2C2668";
  x.font = "700 84px Fredoka, Rubik, sans-serif"; x.fillText(nm(current), W / 2, 680);
  x.font = "800 150px Rubik, sans-serif"; x.fillStyle = "#5548C8"; x.fillText(String(n.kcal), W / 2, 850);
  x.font = "600 44px Rubik, sans-serif"; x.fillStyle = "#5f5a8f"; x.fillText(`${t("kcal")} · ${n.serving_g} ${t("gram")}`, W / 2, 915);
  const cols = [["protein", "#F5A3C0"], ["carbs", "#F0CF7A"], ["fat", "#8FE0BE"]];
  cols.forEach(([k, col], i) => {
    const bx = 90 + i * 310, by = 980;
    roundRect(x, "rgba(255,255,255,.85)", bx, by, 280, 190, 36);
    roundRect(x, col, bx + 30, by + 30, 40, 40, 20);
    x.fillStyle = "#2C2668"; x.textAlign = "center";
    x.font = "800 64px Rubik, sans-serif"; x.fillText(fmt(n[k]) + (rtl ? "" : "g"), bx + 140, by + 110);
    x.font = "600 38px Rubik, sans-serif"; x.fillStyle = "#5f5a8f"; x.fillText(t(k), bx + 140, by + 162);
  });
  x.font = "600 30px Rubik, sans-serif"; x.fillStyle = "#5f5a8f"; x.fillText(t("cardFoot"), W / 2, 1270);
  const blob = await new Promise((r) => c.toBlob(r, "image/png"));
  const file = new File([blob], `okeat-lens-${current.key}.png`, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: nm(current) }); return; } catch (e) { if (e.name === "AbortError") return; }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast(t("saved"));
}

/* ---------- photo flow ---------- */
async function analyze(blob, src) {
  if (!blob.type.startsWith("image/")) return toast(t("notImage"));
  lastBlob = blob;
  const img = $("img");
  img.crossOrigin = "anonymous";
  img.src = src || URL.createObjectURL(blob);
  await img.decode().catch(() => {});
  img.hidden = false;
  $("placeholder").hidden = true;
  $("scan").hidden = false;
  try {
    const items = mode() === "api" ? await predictApi(blob) : await predictBrowser(img);
    picked = false;
    portions = 1;
    if (!items.length) { toast(t("notFood")); setTimeout(() => openPicker(), 900); }
    else { render(items); remember(items[0].key); }
  } catch (e) {
    toast(e.message || t("apiDown"));
  } finally {
    $("scan").hidden = true;
  }
}

function setup() {
  applyLang();
  loadLabels().then(() => { renderMeal(false); renderHistory(); });
  $("langBtn").onclick = () => { lang = lang === "he" ? "en" : "he"; store.set("lang", lang); applyLang(); };
  $("pickBtn").onclick = () => $("file").click();
  $("camBtn").onclick = () => $("camera").click();
  $("browseBtn").onclick = () => openPicker();
  $("fixBtn").onclick = () => openPicker();
  $("pickFilters").onclick = (e) => { const f = e.target.closest("[data-f]"); if (f) { pickFilter = f.dataset.f; fillPicker(); } };
  $("pickSearch").oninput = fillPicker;
  $("picker").addEventListener("click", (e) => e.target === $("picker") && $("picker").close());
  [$("file"), $("camera")].forEach((inp) => (inp.onchange = () => inp.files[0] && analyze(inp.files[0])));
  $("img").onclick = () => $("file").click();

  const drop = $("drop");
  drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("drag"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("drag"));
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    drop.classList.remove("drag");
    const f = e.dataTransfer.files[0];
    if (f) analyze(f);
  });
  drop.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target === drop) $("file").click(); });
  document.addEventListener("paste", (e) => {
    const f = [...e.clipboardData.files].find((x) => x.type.startsWith("image/"));
    if (f) analyze(f);
  });

  document.querySelectorAll(".sample").forEach((b) => (b.onclick = async () => {
    try {
      const res = await fetch(b.dataset.src);
      await analyze(await res.blob(), b.dataset.src);
    } catch { choose(b.dataset.key); }
  }));

  $("portionSeg").onclick = (e) => {
    const p = Number(e.target.dataset.p);
    if (!p || p === portions) return;
    portions = p;
    renderNutrition(false);
    renderCompare();
  };
  $("addMeal").onclick = () => {
    if (!current) return;
    const ex = meal.find((m) => m.key === current.key);
    if (ex) ex.p += portions; else meal.push({ key: current.key, p: portions });
    Object.entries(extras).forEach(([k, q]) => { const e = meal.find((m) => m.key === k); if (e) e.p += q; else meal.push({ key: k, p: q }); });
    renderMeal();
    flyToMeal();
    toast(t("added"));
    if (meal.length === 3) confetti(40);
  };
  $("mealJump").onclick = () => $("meal").scrollIntoView({ behavior: "smooth", block: "start" });
  $("clearMeal").onclick = () => { meal = []; renderMeal(); };
  $("shareMeal").onclick = async () => {
    const tot = mealTotals();
    const lines = meal.map((m) => `• ${nm(labels[m.key])} ×${m.p}: ${scale(labels[m.key].nutrition, m.p).kcal} kcal`);
    const text = `${t("mealTxt")} 🍽️\n${lines.join("\n")}\n= ${tot.kcal} kcal · ${t("protein")} ${fmt(tot.protein)} ${t("gram")} · ${t("carbs")} ${fmt(tot.carbs)} ${t("gram")} · ${t("fat")} ${fmt(tot.fat)} ${t("gram")}\n${location.href.split("#")[0]}`;
    if (navigator.share) { try { await navigator.share({ text }); return; } catch (e) { if (e.name === "AbortError") return; } }
    try { await navigator.clipboard.writeText(text); toast(t("copied")); } catch { prompt("", text); }
  };
  const randomDish = () => { const pool = all.filter((d) => d.key !== current?.key); choose(pool[Math.floor(Math.random() * pool.length)].key); };
  $("diceBtn").onclick = () => { $("diceBtn").classList.remove("roll"); void $("diceBtn").offsetWidth; $("diceBtn").classList.add("roll"); randomDish(); };
  document.querySelectorAll(".stats [data-act]").forEach((b) => (b.onclick = () => {
    const a = b.dataset.act;
    if (a === "browse") openPicker();
    else if (a === "random") randomDish();
    else if (a === "allergen") { toast(t("allergenQ")); openPicker(); }
    else $("langBtn").click();
  }));
  $("shareBtn").onclick = shareCard;
  $("pinBtn").onclick = () => {
    if (!current) return;
    if (cmpKey) { cmpKey = null; renderCompare(); } else openPicker("compare");
  };
  $("compare").onclick = (e) => {
    const bp = e.target.closest("[data-bp]"), act = e.target.closest("[data-cmp]")?.dataset.cmp;
    if (bp) { cmpP = Number(bp.dataset.bp); renderCompare(); }
    else if (act === "close") { cmpKey = null; renderCompare(); $("pinBtn").scrollIntoView({ block: "center" }); }
    else if (act === "other") openPicker("compare");
    else if (act === "swap") { const old = current.key; choose(cmpKey); cmpKey = old; cmpP = 1; renderCompare(); }
  };
  $("boostGoals").onclick = (e) => {
    const b = e.target.closest("[data-goal]");
    if (!b) return;
    boostGoal = boostGoal === b.dataset.goal ? null : b.dataset.goal;
    renderBoost();
  };
  $("addonGrid").onclick = (e) => {
    const b = e.target.closest("[data-add]");
    if (!b) return;
    changeExtra(b.dataset.add, 1);
    const nb = $("addonGrid").querySelector(`[data-add="${b.dataset.add}"]`);
    nb?.classList.add("bump");
  };
  $("extrasList").onclick = (e) => {
    const d = e.target.closest("[data-dec]"), i = e.target.closest("[data-inc]");
    if (d) changeExtra(d.dataset.dec, -1); else if (i) changeExtra(i.dataset.inc, 1);
  };
  $("clearExtras").onclick = () => { extras = {}; renderNutrition(false); renderCompare(); };

  /* daily goal */
  document.querySelectorAll(".goal-link").forEach((b) => (b.onclick = () => $("goal").scrollIntoView({ behavior: "smooth", block: "start" })));
  $("goalTabs").onclick = (e) => {
    const b = e.target.closest("[data-tab]");
    if (!b) return;
    document.querySelectorAll("#goalTabs button").forEach((x) => x.classList.toggle("on", x === b));
    document.querySelectorAll(".gpane").forEach((p) => (p.hidden = p.dataset.pane !== b.dataset.tab));
  };
  $("presets").onclick = (e) => { const b = e.target.closest("[data-k]"); if (b) setGoal(goalFrom(Number(b.dataset.k))); };
  $("resetGoal").onclick = () => setGoal(null);
  $("sexSeg").onclick = (e) => { const b = e.target.closest("[data-v]"); if (b) { sex = b.dataset.v; store.set("sex", sex); renderGoal(); } };
  $("aimSeg").onclick = (e) => { const b = e.target.closest("[data-v]"); if (b) { aim = b.dataset.v; store.set("aim", aim); renderGoal(); } };
  $("calcForm").onsubmit = (e) => { e.preventDefault(); calcGoal(); };
  $("customForm").onsubmit = (e) => {
    e.preventDefault();
    const f = e.target;
    if (!f.reportValidity()) return;
    const kcal = +f.elements.kcal.value;
    setGoal({ ...goalFrom(kcal), protein: +f.elements.protein.value, carbs: +f.elements.carbs.value, fat: +f.elements.fat.value });
  };

  document.querySelectorAll("input[name=mode]").forEach((r) => (r.onchange = () => {
    $("apiField").hidden = mode() !== "api";
    if (lastBlob) analyze(lastBlob);
  }));

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll("[data-count]").forEach((b) => countUp(b, Number(b.dataset.count), 1400));
    io.unobserve(e.target);
  }));
  io.observe(document.querySelector(".stats"));

  /* polish: sticky header, scroll reveal, tilt and button shine */
  addEventListener("scroll", () => $("top").classList.toggle("stuck", scrollY > 10), { passive: true });
  const rv = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), rv.unobserve(e.target))), { threshold: 0.15 });
  window.revealAll = () => document.querySelectorAll(".rv:not(.in)").forEach((el) => rv.observe(el));
  revealAll();
  if (!reduced && matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".upload, .stats button, .fam").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--rx", (-y * 5).toFixed(2) + "deg");
        el.style.setProperty("--ry", (x * 6).toFixed(2) + "deg");
        el.style.setProperty("--mx", (x + 0.5) * 100 + "%");
        el.style.setProperty("--my", (y + 0.5) * 100 + "%");
      });
      el.addEventListener("pointerleave", () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
    });
  }
}

document.addEventListener("DOMContentLoaded", setup);
