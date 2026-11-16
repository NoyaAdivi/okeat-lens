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
    tryOne: "או נסו דוגמה:", sPizza: "🍕 פיצה", sBurger: "🍔 המבורגר", sIce: "🍨 גלידה", sSushi: "🍣 סושי", recent: "זוהו לאחרונה:",
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
    pinned: "נשמר להשוואה. עכשיו זהו או בחרו מנה נוספת", vs: "מול", added: "נוסף לארוחה ✓",
    myMeal: "הארוחה שלי", mealH: "🍽️ הארוחה שלי", clear: "ניקוי", remove: "הסרה",
    topGuesses: "עוד ניחושים · לחיצה מחליפה", findOkeat: "חיפוש מקומות ב-Okeat 🗺️", search: "חיפוש מנה…",
    engine: "מנוע זיהוי", mBrowser: "בדפדפן (מיידי)", mApi: "מודל Food-101 (API)", apiUrl: "כתובת ה-API",
    engineHelp: "\"בדפדפן\" מריץ MobileNet על המכשיר שלכם ומכיר כ-50 מאכלים. \"API\" משתמש במודל שאימנתי על 101 מנות.",
    loading: "טוענת את המודל…", thinking: "מזהה…",
    notFood: "לא הצלחתי לזהות כאן אוכל 🤔 אפשר לבחור את המנה מהרשימה", notSure: "לא בטוחה, הנה הניחושים שלי",
    apiDown: "ה-API לא עונה. הפעילו אותו עם uvicorn lens.api:app", notImage: "זה לא קובץ תמונה", saved: "הכרטיס נשמר ✓",
    vegan: "🌱 טבעוני", vegetarian: "🥕 צמחוני", gluten_free: "🌾 ללא גלוטן",
    meat: "🥩 בשרי", dairy: "🧀 חלבי", parve: "🍃 פרווה", not_kosher: "⚠️ כנראה לא כשר",
    cardFoot: "הערכה למנה טיפוסית · Okeat Lens",
  },
  en: {
    openOkeat: "Open Okeat", eyebrow: "Computer Vision · Food-101 · Nutrition", title1: "What's on", title2: "the plate?",
    lead: "Snap a dish and Okeat Lens recognizes it, then shows its calories, protein and carbs, the six nutrient families, allergens, and whether it's likely vegan, gluten-free and which kind of kosher fits it.",
    stDishes: "dishes and foods", stFam: "nutrient families", stAll: "allergens", stUp: "languages",
    drop: "Drop a food photo here, or paste with Ctrl+V", pick: "Choose a photo", camera: "Take a photo", browse: "No photo: pick from the list",
    tryOne: "or try one:", sPizza: "🍕 Pizza", sBurger: "🍔 Burger", sIce: "🍨 Ice cream", sSushi: "🍣 Sushi", recent: "Recently spotted:",
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
    pinned: "Saved for comparing. Now scan or pick another dish", vs: "vs", added: "Added to your meal ✓",
    myMeal: "My meal", mealH: "🍽️ My meal", clear: "Clear", remove: "Remove",
    topGuesses: "Other guesses · tap to switch", findOkeat: "Find places on Okeat 🗺️", search: "Search a dish…",
    engine: "Recognition engine", mBrowser: "In the browser (instant)", mApi: "Food-101 model (API)", apiUrl: "API address",
    engineHelp: "\"Browser\" runs MobileNet on your device and knows about 50 foods. \"API\" uses my model trained on 101 dishes.",
    loading: "Loading the model…", thinking: "Looking…",
    notFood: "I couldn't spot food here 🤔 You can pick the dish from the list", notSure: "Not sure, here are my guesses",
    apiDown: "The API isn't answering. Start it with uvicorn lens.api:app", notImage: "That's not an image file", saved: "Card saved ✓",
    vegan: "🌱 Vegan", vegetarian: "🥕 Vegetarian", gluten_free: "🌾 Gluten-free",
    meat: "🥩 Meat", dairy: "🧀 Dairy", parve: "🍃 Parve", not_kosher: "⚠️ Likely not kosher",
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

let lang = store.get("lang", "he");
let labels = {}, all = [], ref = { kcal: 2000, protein: 50, carbs: 260, fat: 70, fiber: 30, sugar: 90, sodium_mg: 2400 };
let mobilenetModel = null, lastBlob = null, lastItems = null, current = null, portions = 1, picked = false;
let meal = store.get("meal", []), pinned = null, history = store.get("history", []);

const t = (k, v = {}) => String(I18N[lang][k] ?? I18N.en[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => v[x]);
const nm = (d) => (lang === "he" ? d.he : d.en);
const fmt = (x) => (Math.round(x * 10) / 10).toLocaleString(lang === "he" ? "he-IL" : "en-US");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function scale(n, p) {
  const o = { ...n, serving_g: Math.round(n.serving_g * p), kcal: Math.round(n.kcal * p) };
  MACRO_KEYS.forEach((k) => (o[k] = k === "sodium_mg" ? Math.round(n[k] * p) : Math.round(n[k] * p * 10) / 10));
  return o;
}
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
    if (data.daily_reference) ref = data.daily_reference;
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
  const n = scale(current.nutrition, portions);
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

  const g = new Set(current.groups || []);
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
  $("pinBtn").textContent = pinned && pinned.key === current.key ? t("unpin") : t("compare");
}

function renderCompare() {
  const box = $("compare");
  if (!pinned || !current || pinned.key === current.key) { box.hidden = true; return; }
  const a = scale(current.nutrition, portions), b = scale(pinned.n, pinned.p);
  const rows = ["kcal", "protein", "carbs", "fat", "fiber", "sugar"].map((k) => {
    const max = Math.max(a[k], b[k], 1);
    return `<div class="cmp-row"><span>${t(k)}</span>
      <div class="cmp-bar a"><i style="--w:${(100 * a[k]) / max}%"></i><b>${fmt(a[k])}</b></div>
      <div class="cmp-bar b"><i style="--w:${(100 * b[k]) / max}%"></i><b>${fmt(b[k])}</b></div></div>`;
  }).join("");
  box.innerHTML = `<div class="cmp-head"><b class="a">${nm(current)}</b><span>${t("vs")}</span><b class="b">${nm(labels[pinned.key])}</b></div>${rows}`;
  box.hidden = false;
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
    li.querySelector(".mi-name").textContent = nm(d);
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
  grid.innerHTML = "";
  all.filter((d) => !q || d.en.toLowerCase().includes(q) || d.he.includes(q))
    .sort((a, b) => nm(a).localeCompare(nm(b), lang))
    .forEach((d) => {
      const b = document.createElement("button");
      b.type = "button";
      b.innerHTML = `<span class="pi">${(d.groups || []).map((g) => GROUP_ICON[g]).join("")}</span><b></b><small>${d.nutrition.kcal} ${t("kcal")}</small>`;
      b.querySelector("b").textContent = nm(d);
      b.onclick = () => { $("picker").close(); choose(d.key); };
      grid.appendChild(b);
    });
}
function openPicker() {
  $("pickSearch").value = "";
  fillPicker();
  $("picker").showModal();
  $("pickSearch").focus();
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
    if (!items.length) { toast(t("notFood")); setTimeout(openPicker, 900); }
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
  $("browseBtn").onclick = openPicker;
  $("fixBtn").onclick = openPicker;
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
    renderMeal();
    flyToMeal();
    toast(t("added"));
    if (meal.length === 3) confetti(40);
  };
  $("mealJump").onclick = () => $("meal").scrollIntoView({ behavior: "smooth", block: "start" });
  $("clearMeal").onclick = () => { meal = []; renderMeal(); };
  $("shareBtn").onclick = shareCard;
  $("pinBtn").onclick = () => {
    if (!current) return;
    if (pinned && pinned.key === current.key) pinned = null;
    else { pinned = { key: current.key, n: current.nutrition, p: portions }; toast(t("pinned")); }
    renderNutrition(false);
    renderCompare();
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
    document.querySelectorAll(".upload, .stats div, .fam").forEach((el) => {
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
