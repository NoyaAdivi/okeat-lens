<p align="center">
  <a href="https://noyaadivi.github.io/okeat-lens/"><img src="docs/readme/banner-en.svg" width="100%" alt="Okeat Lens: recognize a dish from a photo and see its nutrition, nutrient families, allergens and diet hints"></a>
</p>

<p align="center"><a href="README.he.md"><img src="docs/readme/lang-he.svg" height="44" alt="לגרסה בעברית"></a></p>

<p align="center">
  <a href="https://noyaadivi.github.io/okeat-lens/"><img src="https://img.shields.io/badge/Try_the_live_demo-FFD5C9?style=for-the-badge&logo=googlechrome&logoColor=A8483A" alt="Try the live demo"></a>
  <a href="#how-it-works"><img src="https://img.shields.io/badge/How_it_works-D9F3E7?style=for-the-badge&logo=pytorch&logoColor=1F7350" alt="How it works"></a>
  <a href="docs/INTEGRATION.md"><img src="https://img.shields.io/badge/Connect_to_Okeat-DAD5FF?style=for-the-badge&logo=mapbox&logoColor=5548C8" alt="Connect to Okeat"></a>
</p>

<p align="center">
  <a href="https://github.com/NoyaAdivi/okeat-lens/actions/workflows/tests.yml"><img src="https://github.com/NoyaAdivi/okeat-lens/actions/workflows/tests.yml/badge.svg" alt="Tests"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/NoyaAdivi/okeat-lens?color=DAD5FF&labelColor=5548C8" alt="License"></a>
  <a href="https://github.com/NoyaAdivi/okeat-lens/commits/main"><img src="https://img.shields.io/github/last-commit/NoyaAdivi/okeat-lens?color=FFD5C9&labelColor=A8483A" alt="Last commit"></a>
  <a href="https://github.com/NoyaAdivi/okeat-lens"><img src="https://img.shields.io/github/languages/top/NoyaAdivi/okeat-lens?color=D9F3E7&labelColor=1F7350" alt="Top language"></a>
</p>

<h3 align="center">Point your camera at a plate. See what's in it and what you can eat.</h3>

<p align="center">
  Okeat Lens is a Computer Vision model that recognizes <b>101 dishes</b> from a single photo<br>
  and turns them into the diet hints <a href="https://okeat.vercel.app">Okeat</a> understands: vegan, vegetarian, gluten-free and kosher type.
</p>

<table align="center">
  <tr>
    <td align="center" width="25%"><a href="#the-model"><b>🍽️ 101</b></a><br><sub>dishes it recognizes</sub></td>
    <td align="center" width="25%"><a href="#the-model"><b>🧠 MobileNetV3</b></a><br><sub>fine-tuned on Food-101</sub></td>
    <td align="center" width="25%"><a href="README.he.md"><b>🌍 HE · EN</b></a><br><sub>every dish named in both</sub></td>
    <td align="center" width="25%"><a href="https://github.com/NoyaAdivi/okeat-lens/actions/workflows/tests.yml"><b>🧪 CI</b></a><br><sub>tests on every push</sub></td>
  </tr>
  <tr valign="top">
    <td valign="top" width="33%">
      <p><b>🍽️ What's in it</b></p>
      <ul>
        <li><b>Calories, protein, carbs, fat</b>, fiber, sugar and sodium</li>
        <li><b>Animated macro donut</b> and % of daily intake</li>
        <li><b>Portion picker</b>: ½, 1, 1½ or 2 servings</li>
      </ul>
    </td>
    <td valign="top" width="33%">
      <p><b>🥚 The six nutrient families</b></p>
      <ul>
        <li><b>Carbs, proteins, fats, vitamins, minerals, water</b></li>
        <li><b>Which vitamins and minerals</b> stand out</li>
        <li><b>Balanced plate</b> view with what to add on the side</li>
      </ul>
    </td>
    <td valign="top" width="33%">
      <p><b>✨ Things no other food app does together</b></p>
      <ul>
        <li><b>9 allergens</b> per dish, next to the kosher type</li>
        <li><b>My meal</b> adds up dishes, <b>compare</b> two dishes</li>
        <li><b>Share card</b> image, recent scans, pick a dish by hand</li>
      </ul>
    </td>
  </tr>
</table>

<a name="highlights"></a>
<p align="center"><a href="#see-it-in-action"><img src="docs/readme/highlights-en.svg" width="100%" alt="Highlights"></a></p>

<table>
  <tr valign="top">
    <td valign="top" width="33%">
      <p><b>📸 See a dish, name it</b></p>
      <ul>
        <li><b>Transfer learning</b> on 101,000 food photos</li>
        <li><b>Top-5 guesses</b> with a confidence for each</li>
        <li><b>Hebrew and English names</b> for every dish</li>
        <li><b>Knows when it's unsure</b> and says so</li>
      </ul>
    </td>
    <td valign="top" width="33%">
      <p><b>🥗 Turn it into diet hints</b></p>
      <ul>
        <li><b>Vegan, vegetarian, gluten-free</b> per dish</li>
        <li><b>Kosher type:</b> meat, dairy, parve or likely not kosher</li>
        <li><b>Honest by design:</b> hints are never marked as verified</li>
        <li><a href="docs/INTEGRATION.md"><b>Plugs into Okeat</b></a> to open the map with the right filters</li>
      </ul>
    </td>
    <td valign="top" width="33%">
      <p><b>💛 Built to be used</b></p>
      <ul>
        <li><a href="https://noyaadivi.github.io/okeat-lens/"><b>Live web demo</b></a>: drag, drop, paste or snap a photo</li>
        <li><b>REST API</b> with FastAPI and auto docs</li>
        <li><b>ONNX export</b> to run the model anywhere</li>
        <li><b>Tested in CI</b>, no GPU needed for the tests</li>
      </ul>
    </td>
  </tr>
</table>

<a name="see-it-in-action"></a>
<p align="center"><a href="#how-it-works"><img src="docs/readme/screens-en.svg" width="100%" alt="See it in action"></a></p>

<p align="center">
  <a href="https://noyaadivi.github.io/okeat-lens/"><img src="docs/images/screen-en.png" width="80%" alt="Okeat Lens recognizing hummus with 93% confidence: 216 calories, macros, the six nutrient families and a balanced plate"></a>
</p>

<p align="center">
  <a href="https://noyaadivi.github.io/okeat-lens/"><b>Live demo</b></a> ·
  <a href="#rest-api"><b>API</b></a> ·
  <a href="docs/INTEGRATION.md"><b>Okeat integration</b></a> ·
  <a href="labels.json"><b>All 101 dishes</b></a>
</p>

<a name="how-it-works"></a>
<p align="center"><a href="#the-model"><img src="docs/readme/how-en.svg" width="100%" alt="How it works"></a></p>

```mermaid
flowchart LR
  A([📸 Food photo]) --> B[Resize 256 · crop 224<br/>normalize]
  B --> C[MobileNetV3<br/>fine-tuned on Food-101]
  C --> D{Top-5 dishes<br/>+ confidence}
  D -->|confidence ≥ 15%| E([🥗 Diet hints<br/>vegan · GF · kosher type])
  D -->|under 15%| F([🤔 Not sure, no hints])
  E --> G([🗺️ Okeat map<br/>with matching filters])
  style A fill:#E8E4FF,stroke:#6F60F0,color:#2C2668
  style B fill:#FFE6DE,stroke:#E36E57,color:#2C2668
  style C fill:#DAD5FF,stroke:#5548C8,color:#2C2668
  style D fill:#FFF1C9,stroke:#B98A1E,color:#5C4410
  style E fill:#D9F3E7,stroke:#1F7350,color:#1F4D38
  style F fill:#FBD5E0,stroke:#A03A5C,color:#5C1F33
  style G fill:#FFD5C9,stroke:#A8483A,color:#5C2A20
```

<p align="center"><sub>Diet hints describe a typical recipe. On Okeat only the community can verify a place, so these are always labelled as hints.</sub></p>

<a name="the-model"></a>
<p align="center"><a href="#rest-api"><img src="docs/readme/model-en.svg" width="100%" alt="The model"></a></p>

| | |
|---|---|
| **Dataset** | [Food-101](https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/): 101 dishes, 750 training and 250 test photos each |
| **Backbone** | [MobileNetV3-Large](https://pytorch.org/vision/stable/models/generated/torchvision.models.mobilenet_v3_large.html), pretrained on ImageNet: small and fast enough for phones |
| **Training** | 1 warm-up epoch with a frozen backbone, then full fine-tuning with AdamW, cosine schedule, label smoothing and mixed precision |
| **Augmentation** | random resized crop, horizontal flip, color jitter |
| **Metrics** | top-1 and top-5 accuracy on the test split, saved to `models/metrics.json` |
| **Browser demo** | [MobileNet in TensorFlow.js](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet), mapped to about 20 foods, so it works with no server |

<details>
<summary><b>🥗 How diet hints are decided</b></summary>
<br>

Every one of the 101 dishes in [`labels.json`](labels.json) has a Hebrew name, an English name, diet tags and a kosher type, based on how the dish is usually made. A few examples:

| Dish | Tags | Kosher type |
|---|---|---|
| 🧆 Falafel · פלאפל | vegan, vegetarian, gluten-free | parve |
| 🍕 Pizza · פיצה | vegetarian | dairy |
| 🥩 Steak · סטייק | gluten-free | meat |
| 🍣 Sushi · סושי | gluten-free | parve |
| 🦐 Shrimp and grits · שרימפס וגריטס | gluten-free | likely not kosher |

The tests check that every vegan dish is also vegetarian, every name exists in both languages and the order matches Food-101.
</details>

<a name="rest-api"></a>
<p align="center"><a href="#tech-stack"><img src="docs/readme/api-en.svg" width="100%" alt="REST API"></a></p>

| Method | Path | What it does |
|---|---|---|
| `GET` | `/health` | is the server up |
| `GET` | `/labels` | all 101 dishes with names and hints |
| `POST` | `/predict` | send a photo (`file`), get the dish, top-5 and diet hints |
| `GET` | `/nutrition/{key}?portions=1` | calories, macros, the six nutrient families, allergens and % of daily intake |
| `POST` | `/meal` | send `items` (`key`, `portions`), get the meal totals |

```bash
curl -F "file=@hummus.jpg" http://localhost:8000/predict
```

```json
{
  "dish": { "en": "Hummus", "he": "חומוס", "tags": ["vegan", "vegetarian", "gluten_free"], "kosher": "parve", "confidence": 0.93 },
  "hints": { "tags": ["vegan", "vegetarian", "gluten_free"], "kosher": "parve", "verified": false },
  "okeat_url": "https://okeat.vercel.app/map"
}
```

Interactive docs open at `http://localhost:8000/docs`. How Okeat uses this: [docs/INTEGRATION.md](docs/INTEGRATION.md).

<a name="tech-stack"></a>
<p align="center"><a href="#run-locally"><img src="docs/readme/stack-en.svg" width="100%" alt="Tech Stack"></a></p>

<p align="center"><b>Model</b><br>
<a href="https://pytorch.org"><img src="https://img.shields.io/badge/PyTorch-FBD5E0?style=for-the-badge&logo=pytorch&logoColor=A03A5C" alt="PyTorch"></a>
<a href="https://pytorch.org/vision/stable/index.html"><img src="https://img.shields.io/badge/torchvision-FBD5E0?style=for-the-badge&logo=pytorch&logoColor=A03A5C" alt="torchvision"></a>
<a href="https://onnx.ai"><img src="https://img.shields.io/badge/ONNX-FBD5E0?style=for-the-badge&logo=onnx&logoColor=A03A5C" alt="ONNX"></a>
</p>

<p align="center"><b>API</b><br>
<a href="https://www.python.org"><img src="https://img.shields.io/badge/Python_3.12-DAD5FF?style=for-the-badge&logo=python&logoColor=5548C8" alt="Python"></a>
<a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-DAD5FF?style=for-the-badge&logo=fastapi&logoColor=5548C8" alt="FastAPI"></a>
<a href="https://python-pillow.org"><img src="https://img.shields.io/badge/Pillow-DAD5FF?style=for-the-badge&logo=python&logoColor=5548C8" alt="Pillow"></a>
</p>

<p align="center"><b>Web demo</b><br>
<a href="https://www.tensorflow.org/js"><img src="https://img.shields.io/badge/TensorFlow.js-D9F3E7?style=for-the-badge&logo=tensorflow&logoColor=1F7350" alt="TensorFlow.js"></a>
<a href="https://developer.mozilla.org/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-D9F3E7?style=for-the-badge&logo=javascript&logoColor=1F7350" alt="JavaScript"></a>
<a href="https://developer.mozilla.org/docs/Web/CSS"><img src="https://img.shields.io/badge/CSS3-D9F3E7?style=for-the-badge&logo=css&logoColor=1F7350" alt="CSS3"></a>
</p>

<p align="center"><b>Ship</b><br>
<a href="https://pages.github.com"><img src="https://img.shields.io/badge/GitHub_Pages-FFD5C9?style=for-the-badge&logo=githubpages&logoColor=A8483A" alt="GitHub Pages"></a>
<a href="https://github.com/NoyaAdivi/okeat-lens/actions"><img src="https://img.shields.io/badge/GitHub_Actions-FFD5C9?style=for-the-badge&logo=githubactions&logoColor=A8483A" alt="GitHub Actions"></a>
<a href="https://docs.pytest.org"><img src="https://img.shields.io/badge/pytest-FFD5C9?style=for-the-badge&logo=pytest&logoColor=A8483A" alt="pytest"></a>
</p>

<a name="run-locally"></a>
<p align="center"><a href="#contact"><img src="docs/readme/run-en.svg" width="100%" alt="Run it locally"></a></p>

1. Install:
   ```bash
   git clone https://github.com/NoyaAdivi/okeat-lens.git
   cd okeat-lens
   pip install -r requirements.txt
   ```
2. Train (Food-101 downloads by itself, about 5 GB):
   ```bash
   python train.py --epochs 1 --subset 0.05   # quick check, a few minutes
   python train.py --epochs 8                 # the real model, best on a GPU
   ```
3. Use it:
   ```bash
   python predict.py my-dinner.jpg            # from the terminal
   uvicorn lens.api:app --reload              # as an API on port 8000
   ```
   Then open `index.html`, pick <b>Food-101 model (API)</b> under ⚙️ and drop a photo.

> [!TIP]
> No GPU? The web demo works right away in the browser, and `python train.py --subset 0.1` trains on 10% of the data.

<details>
<summary><b>📂 Project structure</b></summary>

```
├── lens/
│   ├── diet.py        dish names (HE/EN), diet hints, the JSON Okeat reads
│   ├── predictor.py   loads the model and predicts top-k dishes
│   └── api.py         FastAPI server: /health, /labels, /nutrition, /meal, /predict
├── train.py           fine-tunes MobileNetV3 on Food-101
├── predict.py         recognize a dish from the terminal
├── export_onnx.py     export the model to ONNX
├── labels.json        all 101 dishes with Hebrew names and hints
├── index.html         web demo (GitHub Pages)
├── style.css · app.js pastel theme, animations, in-browser recognition
├── tests/             pytest: labels and API (no GPU needed)
└── docs/
    ├── INTEGRATION.md how Okeat connects to the API
    ├── readme/        animated README banners
    └── images/        screenshots
```
</details>

<a name="contact"></a>
<p align="center"><a href="https://www.linkedin.com/in/noya-adivi/"><img src="docs/readme/footer-en.svg" width="100%" alt="Built by Noya Adivi"></a></p>

<p align="center">
  <a href="https://noyaadivi.github.io/okeat-lens/"><img src="https://img.shields.io/badge/Try_Okeat_Lens-FFD5C9?style=for-the-badge&logo=googlechrome&logoColor=A8483A" alt="Try Okeat Lens"></a>
  <a href="https://www.linkedin.com/in/noya-adivi/"><img src="https://img.shields.io/badge/LinkedIn-DAD5FF?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzU1NDhDOCIgZD0iTTIwLjQ1IDIwLjQ1aC0zLjU2di01LjU3YzAtMS4zMy0uMDMtMy4wNC0xLjg1LTMuMDQtMS44NiAwLTIuMTQgMS40NS0yLjE0IDIuOTR2NS42N0g5LjM1VjloMy40MXYxLjU2aC4wNWMuNDgtLjkgMS42NC0xLjg1IDMuMzctMS44NSAzLjYgMCA0LjI3IDIuMzcgNC4yNyA1LjQ2djYuMjh6TTUuMzQgNy40M2EyLjA2IDIuMDYgMCAxIDEgMC00LjEzIDIuMDYgMi4wNiAwIDAgMSAwIDQuMTN6TTcuMTIgMjAuNDVIMy41NlY5aDMuNTZ2MTEuNDV6TTIyLjIyIDBIMS43N0MuNzkgMCAwIC43NyAwIDEuNzN2MjAuNTRDMCAyMy4yMy43OSAyNCAxLjc3IDI0aDIwLjQ1Yy45OCAwIDEuNzgtLjc3IDEuNzgtMS43M1YxLjczQzI0IC43NyAyMy4yIDAgMjIuMjIgMHoiLz48L3N2Zz4=" alt="LinkedIn"></a>
  <a href="https://noyaadivi.github.io/noya-website"><img src="https://img.shields.io/badge/Portfolio-D9F3E7?style=for-the-badge&logo=githubpages&logoColor=1F7350" alt="Portfolio"></a>
  <a href="https://okeat.vercel.app"><img src="https://img.shields.io/badge/Okeat-FFF1C9?style=for-the-badge&logo=mapbox&logoColor=B98A1E" alt="Okeat"></a>
  <a href="https://github.com/NoyaAdivi"><img src="https://img.shields.io/badge/More_projects-FBD5E0?style=for-the-badge&logo=github&logoColor=A03A5C" alt="More projects"></a>
</p>
