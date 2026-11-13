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
