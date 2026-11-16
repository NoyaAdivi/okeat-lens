import io

from fastapi.testclient import TestClient
from PIL import Image

from lens.api import create_app


class FakePredictor:
    def predict(self, image, k=5):
        return [("hummus", 0.8), ("falafel", 0.1), ("pizza", 0.05)][:k]


client = TestClient(create_app(FakePredictor()))


def jpeg():
    buf = io.BytesIO()
    Image.new("RGB", (64, 64), (240, 200, 150)).save(buf, "JPEG")
    return buf.getvalue()


def test_health():
    assert client.get("/health").json()["status"] == "ok"


def test_labels():
    body = client.get("/labels").json()
    assert body["count"] == 101


def test_predict():
    r = client.post("/predict", files={"file": ("plate.jpg", jpeg(), "image/jpeg")})
    assert r.status_code == 200
    body = r.json()
    assert body["dish"]["he"] == "חומוס"
    assert "vegan" in body["hints"]["tags"]
    assert body["hints"]["verified"] is False


def test_predict_k():
    r = client.post("/predict?k=2", files={"file": ("plate.jpg", jpeg(), "image/jpeg")})
    assert len(r.json()["top"]) == 2


def test_rejects_non_image():
    r = client.post("/predict", files={"file": ("notes.txt", b"hello", "text/plain")})
    assert r.status_code == 415


def test_nutrition_endpoint():
    body = client.get("/nutrition/pizza?portions=2").json()
    assert body["portions"] == 2 and body["kcal"] > 0 and "milk" in body["allergens"]
    assert client.get("/nutrition/shakshuka").status_code == 404


def test_meal_endpoint():
    r = client.post("/meal", json={"items": [{"key": "sushi"}, {"key": "miso_soup", "portions": 2}]})
    assert r.status_code == 200 and r.json()["kcal"] > 0
    assert client.post("/meal", json={"items": []}).status_code == 422


def test_predict_has_nutrition():
    body = client.post("/predict", files={"file": ("plate.jpg", jpeg(), "image/jpeg")}).json()
    assert body["nutrition"]["families"]["protein"] >= 1 and body["nutrition"]["estimate"] is True
