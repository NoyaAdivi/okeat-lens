/* FAQ content for noya-app.js */
window.NOYA_FAQ = {
 "topics": [
  {
   "id": "scan",
   "icon": "📸",
   "he": "זיהוי",
   "en": "Recognition"
  },
  {
   "id": "food",
   "icon": "🥗",
   "he": "תזונה",
   "en": "Nutrition"
  },
  {
   "id": "privacy",
   "icon": "🔒",
   "he": "פרטיות",
   "en": "Privacy"
  },
  {
   "id": "app",
   "icon": "📲",
   "he": "אפליקציה",
   "en": "App"
  }
 ],
 "items": [
  {
   "t": "scan",
   "he": [
    "איך מזהים מנה?",
    "גוררים תמונה, מדביקים עם Ctrl+V, מצלמים או בוחרים מנה מהרשימה. תוך שנייה מופיע מה זה, כמה הזיהוי בטוח ועוד ניחושים."
   ],
   "en": [
    "How do I identify a dish?",
    "Drop a photo, paste with Ctrl+V, take a picture or pick a dish from the list. Within a second you see what it is, how confident the match is, and other guesses."
   ]
  },
  {
   "t": "scan",
   "he": [
    "מה ההבדל בין שני מנועי הזיהוי?",
    "\"בדפדפן\" מריץ MobileNet על המכשיר ומכיר כ-50 מאכלים בלי שרת. \"Food-101\" הוא מודל שאימנתי על 101 מנות ורץ כ-API בפייתון, מדויק יותר אבל צריך להפעיל אותו."
   ],
   "en": [
    "What is the difference between the two engines?",
    "\"In browser\" runs MobileNet on your device and knows about 50 foods with no server. \"Food-101\" is a model I trained on 101 dishes, running as a Python API: more accurate, but you need to start it."
   ]
  },
  {
   "t": "scan",
   "he": [
    "הזיהוי טעה, מה עושים?",
    "לוחצים \"לא זה? בחירת מנה אחרת\" או על אחד הניחושים הנוספים, וכל הנתונים מתעדכנים מיד."
   ],
   "en": [
    "The match is wrong, what now?",
    "Tap \"Not this? Pick another dish\" or one of the other guesses, and all the numbers update right away."
   ]
  },
  {
   "t": "food",
   "he": [
    "מאיפה מגיעים ערכי התזונה?",
    "מערכי ייחוס למנה טיפוסית, לפי 2,000 קלוריות ליום. משנים את הכמות ב\"כמה אכלתם?\" והכל מחושב מחדש."
   ],
   "en": [
    "Where do the nutrition values come from?",
    "From reference values for a typical serving, based on 2,000 calories a day. Change the amount under \"How much did you eat?\" and everything recalculates."
   ]
  },
  {
   "t": "food",
   "he": [
    "אפשר לסמוך על תגיות כשרות, טבעוני וללא גלוטן?",
    "הן רמזים לפי המתכון הנפוץ ולא מידע מאומת. ב-Okeat רק הקהילה מאשרת מקומות, ולכן יש כפתור שמוביל לחיפוש שם."
   ],
   "en": [
    "Can I trust the kosher, vegan and gluten free tags?",
    "They are hints based on the common recipe, not verified facts. On Okeat only the community verifies places, which is why there is a button that searches there."
   ]
  },
  {
   "t": "food",
   "he": [
    "מה זה \"הארוחה שלי\"?",
    "מוסיפים כמה מנות ומקבלים סיכום של כל הארוחה: קלוריות, חלבון, פחמימות ואבות מזון. אפשר גם להשוות בין שתי מנות."
   ],
   "en": [
    "What is \"My meal\"?",
    "Add a few dishes and get a summary of the whole meal: calories, protein, carbs and food groups. You can also compare two dishes side by side."
   ]
  },
  {
   "t": "privacy",
   "he": [
    "התמונה שלי נשלחת לאנשהו?",
    "במנוע \"בדפדפן\" התמונה לא יוצאת מהמכשיר. במנוע Food-101 היא נשלחת רק לכתובת ה-API שאתם מגדירים, בדרך כלל המחשב שלכם."
   ],
   "en": [
    "Is my photo sent anywhere?",
    "With the \"In browser\" engine the photo never leaves your device. With Food-101 it goes only to the API address you set, usually your own computer."
   ]
  },
  {
   "t": "app",
   "he": [
    "אפשר להתקין את Okeat Lens כאפליקציה?",
    "כן. בכרום או באדג׳ לוחצים על כפתור ההתקנה שמופיע בתחתית המסך או בשורת הכתובת, ובאייפון בוחרים שיתוף ואז \"הוספה למסך הבית\". האפליקציה נפתחת בחלון משלה עם אייקון משלה."
   ],
   "en": [
    "Can I install Okeat Lens as an app?",
    "Yes. In Chrome or Edge tap the install button at the bottom of the screen or in the address bar. On iPhone tap Share, then \"Add to Home Screen\". It opens in its own window with its own icon."
   ]
  },
  {
   "t": "app",
   "he": [
    "זה עובד גם בלי אינטרנט?",
    "אחרי הביקור הראשון הקבצים של האתר נשמרים במכשיר, כך שהוא נפתח מהר ועובד גם כשהחיבור נופל. פעולות שצריכות שרת חיצוני יחכו שהחיבור יחזור."
   ],
   "en": [
    "Does it work offline?",
    "After your first visit the site files are kept on your device, so it opens fast and keeps working when the connection drops. Anything that needs an outside server waits until you are back online."
   ]
  },
  {
   "t": "app",
   "he": [
    "זה עולה כסף?",
    "לא. הכל חינם, בלי פרסומות ובלי הרשמה, והקוד פתוח בגיטהאב."
   ],
   "en": [
    "Does it cost anything?",
    "No. It is free, with no ads and no sign up, and the code is open on GitHub."
   ]
  }
 ]
};
