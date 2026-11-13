/* Okeat Lens web demo: recognize a dish in the browser or through the Food-101 API. */
const $ = (id) => document.getElementById(id);

const I18N = {
  he: {
    openOkeat: "ל-Okeat", eyebrow: "ראייה ממוחשבת · Food-101", title1: "מה יש", title2: "בצלחת?",
    lead: "מצלמים מנה, ו-Okeat Lens מזהה אותה ומציע אם היא כנראה טבעונית, צמחונית, ללא גלוטן ואיזה סוג כשרות מתאים לה.",
    drop: "גררו לכאן תמונה של אוכל", pick: "בחירת תמונה", camera: "צילום", tryOne: "או נסו דוגמה:",
    sPizza: "🍕 פיצה", sBurger: "🍔 המבורגר", sIce: "🍨 גלידה", itLooks: "זה נראה כמו",
    note: "אלה רמזים לפי מתכון נפוץ, לא מידע מאומת. ב-Okeat רק הקהילה מאשרת.",
    topGuesses: "עוד ניחושים", findOkeat: "חיפוש מקומות ב-Okeat 🗺️", engine: "מנוע זיהוי",
    mBrowser: "בדפדפן (מיידי)", mApi: "מודל Food-101 (API)", apiUrl: "כתובת ה-API",
    engineHelp: "\"בדפדפן\" מריץ MobileNet על המכשיר שלכם ומכיר כ-20 מאכלים. \"API\" משתמש במודל שאימנתי על 101 מנות.",
    madeBy: "נבנה באהבה על ידי", loading: "טוענת את המודל…", thinking: "מזהה…",
    notFood: "לא הצלחתי לזהות כאן אוכל 🤔 נסו תמונה קרובה יותר של המנה", notSure: "לא בטוחה, הנה הניחושים שלי",
    apiDown: "ה-API לא עונה. הפעילו אותו עם uvicorn lens.api:app", notImage: "זה לא קובץ תמונה",
    vegan: "🌱 טבעוני", vegetarian: "🥕 צמחוני", gluten_free: "🌾 ללא גלוטן",
    meat: "🥩 בשרי", dairy: "🧀 חלבי", parve: "🍃 פרווה", not_kosher: "⚠️ כנראה לא כשר",
  },
  en: {
    openOkeat: "Open Okeat", eyebrow: "Computer Vision · Food-101", title1: "What's on", title2: "the plate?",
    lead: "Snap a dish and Okeat Lens recognizes it, then tells you if it's likely vegan, vegetarian, gluten-free and which kind of kosher fits it.",
    drop: "Drop a food photo here", pick: "Choose a photo", camera: "Take a photo", tryOne: "or try one:",
    sPizza: "🍕 Pizza", sBurger: "🍔 Burger", sIce: "🍨 Ice cream", itLooks: "This looks like",
    note: "These are hints from a typical recipe, not verified facts. On Okeat only the community confirms.",
    topGuesses: "Other guesses", findOkeat: "Find places on Okeat 🗺️", engine: "Recognition engine",
    mBrowser: "In the browser (instant)", mApi: "Food-101 model (API)", apiUrl: "API address",
    engineHelp: "\"Browser\" runs MobileNet on your device and knows about 20 foods. \"API\" uses my model trained on 101 dishes.",
    madeBy: "Built with love by", loading: "Loading the model…", thinking: "Looking…",
    notFood: "I couldn't spot food here 🤔 Try a closer photo of the dish", notSure: "Not sure, here are my guesses",
    apiDown: "The API isn't answering. Start it with uvicorn lens.api:app", notImage: "That's not an image file",
    vegan: "🌱 Vegan", vegetarian: "🥕 Vegetarian", gluten_free: "🌾 Gluten-free",
    meat: "🥩 Meat", dairy: "🧀 Dairy", parve: "🍃 Parve", not_kosher: "⚠️ Likely not kosher",
  },
};

/* ImageNet food classes that MobileNet knows, mapped to dishes. */
const V = ["vegan", "vegetarian"], VG = ["vegetarian"], GF = ["gluten_free"];
const produce = (en, he) => ({ en, he, tags: [...V, ...GF], kosher: "parve" });
const BROWSER_MAP = {
  "pizza": "pizza", "cheeseburger": "hamburger", "hotdog": "hot_dog", "ice cream": "ice_cream",
  "guacamole": "guacamole", "carbonara": "spaghetti_carbonara",
  "burrito": { en: "Burrito", he: "בוריטו", tags: [], kosher: "meat" },
  "bagel": { en: "Bagel", he: "בייגל", tags: V, kosher: "parve" },
  "pretzel": { en: "Pretzel", he: "בייגלה", tags: V, kosher: "parve" },
  "french loaf": { en: "Baguette", he: "באגט", tags: V, kosher: "parve" },
  "mashed potato": { en: "Mashed potatoes", he: "פירה", tags: [...VG, ...GF], kosher: "dairy" },
  "trifle": { en: "Trifle", he: "טרייפל", tags: VG, kosher: "dairy" },
  "meat loaf": { en: "Meatloaf", he: "קציץ בשר", tags: [], kosher: "meat" },
  "potpie": { en: "Pot pie", he: "פאי בשר", tags: [], kosher: "meat" },
  "consomme": { en: "Clear soup", he: "מרק צח", tags: GF, kosher: "meat" },
  "hot pot": { en: "Hot pot", he: "הוט פוט", tags: GF, kosher: "meat" },
  "espresso": { en: "Espresso", he: "אספרסו", tags: [...V, ...GF], kosher: "parve" },
  "chocolate sauce": { en: "Chocolate sauce", he: "רוטב שוקולד", tags: [...VG, ...GF], kosher: "dairy" },
  "dough": { en: "Dough", he: "בצק", tags: V, kosher: "parve" },
  "head cabbage": produce("Cabbage", "כרוב"), "broccoli": produce("Broccoli", "ברוקולי"),
  "cauliflower": produce("Cauliflower", "כרובית"), "zucchini": produce("Zucchini", "קישוא"),
  "spaghetti squash": produce("Spaghetti squash", "דלעת ספגטי"), "acorn squash": produce("Squash", "דלעת"),
  "butternut squash": produce("Butternut squash", "דלורית"), "cucumber": produce("Cucumber", "מלפפון"),
  "artichoke": produce("Artichoke", "ארטישוק"), "bell pepper": produce("Bell pepper", "פלפל"),
  "mushroom": produce("Mushrooms", "פטריות"), "granny smith": produce("Green apple", "תפוח ירוק"),
  "strawberry": produce("Strawberries", "תותים"), "orange": produce("Orange", "תפוז"),
  "lemon": produce("Lemon", "לימון"), "fig": produce("Fig", "תאנה"), "pineapple": produce("Pineapple", "אננס"),
  "banana": produce("Banana", "בננה"), "jackfruit": produce("Jackfruit", "ג'קפרוט"),
  "custard apple": produce("Custard apple", "אנונה"), "pomegranate": produce("Pomegranate", "רימון"),
};

let lang = (() => { try { return localStorage.getItem("lens-lang") || "he"; } catch { return "he"; } })();
let labels = {}, mobilenetModel = null, lastBlob = null, lastItems = null;

const t = (k) => I18N[lang][k] ?? k;

function applyLang() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  $("langBtn").textContent = lang === "he" ? "EN" : "עב";
  document.title = lang === "he" ? "Okeat Lens · מה יש בצלחת?" : "Okeat Lens · What's on the plate?";
  if (lastItems) render(lastItems, false);
}

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 3200);
}

function confetti() {
  const colors = ["#FFD5C9", "#D9F3E7", "#DAD5FF", "#FBD5E0", "#FFF1C9", "#5548C8"];
  for (let i = 0; i < 70; i++) {
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
    data.classes.forEach((c) => (labels[c.key] = c));
  } catch { /* the browser map still works without it */ }
}

async function getMobileNet() {
  if (!mobilenetModel) {
    toast(t("loading"));
    mobilenetModel = await mobilenet.load({ version: 2, alpha: 1.0 });
  }
  return mobilenetModel;
}

function mapImagenet(className) {
  const names = className.toLowerCase().split(",").map((s) => s.trim());
  for (const n of names) {
    const hit = BROWSER_MAP[n];
    if (hit) return typeof hit === "string" ? labels[hit] || { en: n, he: n, tags: [], kosher: "parve" } : hit;
  }
  return null;
}

async function predictBrowser(img) {
  const model = await getMobileNet();
  const preds = await model.classify(img, 10);
  const items = [];
  for (const p of preds) {
    const d = mapImagenet(p.className);
    if (d && !items.some((x) => x.en === d.en)) items.push({ ...d, confidence: p.probability });
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
  return (await res.json()).top;
}

function render(items, animate = true) {
  lastItems = items;
  const best = items[0];
  const other = lang === "he" ? best.en : best.he;
  $("dishName").textContent = lang === "he" ? best.he : best.en;
  $("dishOther").textContent = other;
  const pct = Math.round(best.confidence * 100);
  $("ring").style.setProperty("--p", animate ? 0 : pct);
  requestAnimationFrame(() => requestAnimationFrame(() => $("ring").style.setProperty("--p", pct)));
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

  const bars = $("bars");
  bars.innerHTML = "";
  items.slice(1).forEach((d) => {
    const li = document.createElement("li");
    li.innerHTML = `<span></span><span class="pct"></span><div class="track"><div class="fill"></div></div>`;
    li.children[0].textContent = lang === "he" ? d.he : d.en;
    li.children[1].textContent = (d.confidence * 100).toFixed(1) + "%";
    bars.appendChild(li);
    const fill = li.querySelector(".fill");
    requestAnimationFrame(() => requestAnimationFrame(() => (fill.style.width = Math.max(2, d.confidence * 100) + "%")));
  });

  $("result").hidden = false;
  if (animate) {
    $("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (best.confidence >= 0.8) confetti();
    else if (best.confidence < 0.15) toast(t("notSure"));
  }
}

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
    if (!items.length) { $("result").hidden = true; lastItems = null; toast(t("notFood")); }
    else render(items);
  } catch (e) {
    toast(e.message || t("apiDown"));
  } finally {
    $("scan").hidden = true;
  }
}

function setup() {
  applyLang();
  loadLabels();
  $("langBtn").onclick = () => {
    lang = lang === "he" ? "en" : "he";
    try { localStorage.setItem("lens-lang", lang); } catch {}
    applyLang();
  };
  $("pickBtn").onclick = () => $("file").click();
  $("camBtn").onclick = () => $("camera").click();
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
    const res = await fetch(b.dataset.src);
    analyze(await res.blob(), b.dataset.src);
  }));

  document.querySelectorAll("input[name=mode]").forEach((r) => (r.onchange = () => {
    $("apiField").hidden = mode() !== "api";
    if (lastBlob) analyze(lastBlob);
  }));
}

document.addEventListener("DOMContentLoaded", setup);
